import bcrypt from 'bcrypt';
import User from '../models/users.js';
import Book from '../models/books.js';
import ErrorApi from '../middlewares/handleError.js';
import jwt from 'jsonwebtoken';
import { mailTransporter } from "../config/mail.js";
import crypto from 'crypto';
import { throwDeprecation } from 'process';



export async function registerUser(req, res, next) {
    try {
        const {username, email, password, displayname} = req.body;
        
        // check thiếu dữ liệu
        if(!username || !email || !password) {
            throw new ErrorApi("Username, email, password are required", 400);
        }
    
        // check trùng username hoặc email
        const existingUser = await User.findOne({
            $or: [{username}, {email}]
        });
        if(existingUser) {
            throw new ErrorApi("Username or email already exists", 409);
        }
            
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Add new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            displayname: displayname || username
        });
        
        const userResponse = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            displayname: newUser.displayname,
            avatarUrl: newUser.avatarUrl,
            roles: newUser.roles,
            isBlocked: newUser.isBlocked,
            favoriteBooks: newUser.favoriteBooks,
            createdAt: newUser.createdAt
        };
        res.status(201).json({message: "Registration successful", userResponse});
    } catch (error) {
        next(error);
    }
};

export async function loginUser(req, res, next) {
    try {
        const { usernameOrEmail, password } = req.body;

        if(!usernameOrEmail || !password) {
            throw new ErrorApi("Please enter username/email and password", 400);
        }
            
        const user = await User.findOne({
            $or: [
                {username: usernameOrEmail},
                {email: usernameOrEmail}
            ]
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new ErrorApi("Wrong account or password", 401);
        }

        if(user.isBlocked) {
            throw new ErrorApi("Account is blocked", 403);
        }

        const token = jwt.sign(
            { 
                _id: user._id, 
                username: user.username,
                displayname: user.displayname,
                roles: user.roles 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            displayname: user.displayname,
            avatarUrl: user.avatarUrl,
            roles: user.roles,
            isBlocked: user.isBlocked
        };

        //set cookie để lưu token
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 //1 ngày
        });

        res.json({
            message: "Login Successfully", 
            userResponse
        });
    } catch (error) {
        next(error);
    }
};

export function logoutUser(req, res, next) {
    try {
        res.clearCookie("token");
        res.json({ message: "Logout successfully" });
    } catch (error) {
        next(error);
    }
}


export async function getAllUsers(req, res, next) {
    try {
        const user = await User.find().select("-password -passwordOld");
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export async function getUserById(req, res, next) {
   try {
        const user = await User.findById(req.params.id).select("-password -passwordOld");
        if(!user) throw new ErrorApi("User not found", 404);
        res.json(user);
   } catch (error) {
        next(error);
   } 
};

export async function editUser(req, res, next) {
    try {
        const { id } = req.params;
        const {
            displayname,
            avatarUrl,
            isBlocked,
            favoriteBooks,
            newPassword
        } = req.body;
        const user = await User.findById(id);

        if(!user) throw new ErrorApi("User not found", 404);

        if(displayname !== undefined) user.displayname = displayname;
        if(avatarUrl !== undefined) user.avatarUrl = avatarUrl;
        if(isBlocked !== undefined) user.isBlocked = isBlocked;
        if(favoriteBooks !== undefined) user.favoriteBooks = favoriteBooks;

        if(newPassword) {
            user.passwordOld = user.password;
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();

        res.json({
            message: "Edit user success",
            user: {
                displayname: user.displayname,
                avatarUrl: user.avatarUrl,
                isBlocked: user.isBlocked,
                favoriteBooks: user.favoriteBooks,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        next(error);
    }
};

export async function deleteUser(req, res, next) {
    try {
        const userId = req.params.id;
         
        const deleteUser = await User.findByIdAndDelete(userId);
        if(!deleteUser) throw new ErrorApi("User not found", 404);

        res.json({message: "Delete user successfully"});
    } catch (error) {
        next(error);
    }
};

export async function getMyFavoriteBooks(req, res, next) {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId)
                .select("favoriteBooks")
                .populate({
                    path: "favoriteBooks",
                    populate: {
                        path: "publisher_id",
                        select: "pubName pubDescription"
                    }
                });

        if(!user) throw new ErrorApi("User not found", 404);

        res.json({
            count: user.favoriteBooks.length,
            results: user.favoriteBooks
        });
    } catch (error) {
        next(error);
    }
};

export async function forgotPassword(req, res, next) {
    try {
        const { email } = req.body;

        if(!email) throw new ErrorApi("Email is required", 400);

        const user = await User.findOne({email});

        if(!user) return res.json({message: "If this email exists, we sent a reset link"});

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}&email=${encodeURIComponent(email)}`;

        await mailTransporter.sendMail({
            from: `"BookVerse" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset your Password",
            html: `<div style="font-family: Arial; padding: 16px;">
          <h2>Reset your password</h2>
          <p>Click the link below to reset your password (valid for 15 minutes):</p>
          <a href="${resetLink}" 
             style="display: inline-block; 
                    padding: 10px 14px;
                    background-color: #007bff;
                    color: white; 
                    border-radius: 6px;
                    text-decoration: none;">
            Reset Password
          </a>
          <p>If you didn’t request this, just ignore the email.</p>
        </div>`
        });

        res.json({
            message: "Password reset email sent"
        })

    } catch (error) {
        next(error);
    }
};

export async function resetPassword(req, res, next) {
    try {
        const {email, token, password} = req.body;

        if(!email || !token || !password) throw new ErrorApi("All fields are required", 400);

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            email,
            resetPasswordToken: hashedToken,
            resetPasswordExpires: {$gt: Date.now()}
        });

        if(!user) throw new ErrorApi("Invalid or expired token", 400);

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        res.json({
            message: "Password reset successfully"
        });
    } catch (error) {
        next(error);
    }
}