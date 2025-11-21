import bcrypt from 'bcrypt';
import Publisher from '../models/publisher.js';
import Book from '../models/books.js';
import User from '../models/users.js';
import ErrorApi from '../middlewares/handleError.js';
import jwt from 'jsonwebtoken';

const loginAdmin = async (req, res, next) => {
    try {
        const { usernameOrEmail, password } = req.body
        if (!usernameOrEmail || !password) {
            throw new ErrorApi("Please enter username/email and password", 400);
        }

        const user = await User.findOne({
            $or: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new ErrorApi("Wrong account or password", 401);
        }

        if (!user.roles.includes("admin")) {
            throw new ErrorApi("Access denied. You are not an admin.", 403);
        }

        if (user.isBlocked) {
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
            roles: user.roles
        };

        res.json({ 
            message: "Admin Login Successfully", 
            token,
            user: userResponse 
        });
    } catch (error) {
        next(error)
    }
}

const addPublisher = async (req, res, next) => {
    try {
        const { pubName, pubAddress, pubPhone, pubEmail, pubDescription } = req.body;

        if (!pubName || !pubPhone || !pubEmail) {
            throw new ErrorApi("Name, Email and Phone is require", 400);
        }

        const existingPublisher = await Publisher.findOne({
            $or: [{ pubName }, { pubEmail }]
        })

        if (existingPublisher) {
            throw new ErrorApi("Publisher Name or Email already exists", 409);
        }

        const newPublisher = await Publisher.create({
            pubName,
            pubAddress,
            pubPhone,
            pubEmail,
            pubDescription
        });

        res.status(201).json({ 
            status: "Success",
            message: "Create publisher successfully", 
            publisher: newPublisher 
        });
    } catch (error) {
        next(error)
    };
}

const getAllPublisher = async (req, res, next) => {
    try {
        const publishers = await Publisher.find().sort({ createdAt: -1 });
        res.json(publishers);
    } catch (error) {
        next(error);
    };
}

const updatePublisher = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const publisher = await Publisher.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!publisher) {
            throw new ErrorApi("Publisher not found", 404);
        }

        res.json({
            message: "Publisher update successful",
            publisher
        });
    } catch (error) { 
        next(error);
    };
}

const deletePublisher = async (req, res, next) => {
    try {
        const { id } = req.params;

        const hasBooks = await Book.exists({ publisher_id: id });
        if (hasBooks) {
            throw new ErrorApi("Cannot delete. This publisher is already in the system.", 400);
        }

        const deletePublisher = await Publisher.findByIdAndDelete(id);
        if (!deletePublisher) {
            throw new ErrorApi("Publisher not found to delete", 404);
        }
        res.json({ message: "Publisher deleted successfully" });
    } catch (error) {
        next(error);
    };
}

const getAllUserAdmin = async (req, res, next) => {
    try {
        const users = await User.find()
            .select("-password -passwordOld")
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        next(error);
    };
}

const getAllBookAdmin = async (req, res, next) => {
    try {
        const books = await Book.find()
            .populate('publisher_id', 'pubName pubAddress pubEmail')
            .sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {
        next(error);
    };
}

export default {
    loginAdmin,
    addPublisher,
    getAllPublisher,
    updatePublisher,
    deletePublisher,
    getAllUserAdmin,
    getAllBookAdmin
};