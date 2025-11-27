import User from "../models/users.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

export async function getProfile(req, res, next) {
    try {
        const user = req.user;
        res.json({
            username: user.username,
            email: user.email,
            displayname: user.displayname,
            avatarUrl: user.avatarUrl,
            roles: user.roles,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateProfile(req, res, next) {
    try {
        const user = req.user;
        const { displayname } = req.body;

        if(displayname && displayname.length > 40) {
            return res.status(400).json({message: "Display name qua dai"})
        }

        if(displayname) {
            user.displayname = displayname;
        }

        if(req.file) {
            if(user.avatarUrl && user.avatarUrl.startsWith("/uploads/")) {
                const oldPath = path.join(process.cwd(), user.avatarUrl);
                fs.unlink(oldPath, ()=>{});
            }
            user.avatarUrl = `/uploads/avatars/${req.file.filename}`;
        }
        await user.save();

        res.json({
            message: "Profile updated",
            user: {
                username: user.username,
                email: user.email,
                displayname: user.displayname,
                avatarUrl: user.avatarUrl
            }
        })
    } catch (error) {
        next(error);
    }
}

export async function changePassword(req, res, next) {
    try {
        const user = req.user;
        const { currentPassword, newPassword } = req.body;

        if(!currentPassword || !newPassword) {
            return res.status(400).json({message: "Missing current password or new password"});
        }

        const match = await bcrypt.compare(currentPassword, user.password);
        if(!match) {
            return res.status(400).json({message: "Current password is incorrect"});
        }

        if(newPassword.length < 8) {
            return res.status(400).json({message: "New password must be at least 8 characters"});
        }

        user.passwordOld = user.password;
        user.password = newPassword;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        res.json({message: "Password changed"});

    } catch (error) {
        next(error);
    }
}