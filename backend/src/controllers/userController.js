import bcrypt from 'bcrypt';
import User from '../models/users.js';
import ErrorApi from '../middlewares/handleError.js';
import jwt from 'jsonwebtoken';


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

        if(user.isBlocked === true) {
            throw new ErrorApi("Account is blocked", 403);
        }

        const token = jwt.sign(
            { 
                _id: user._id, 
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
        };

        res.json({
            message: "Login Successfully", 
            token,
            userResponse
        });
    } catch (error) {
        next(error);
    }
};

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