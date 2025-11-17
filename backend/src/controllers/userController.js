import bcrypt from 'bcrypt';
import User from '../models/users.js';


export async function registerUser(req, res) {
    try {
        const {username, email, password, displayname} = req.body;
        
        // check thiếu dữ liệu
        if(!username || !email || !password)
            return res.status(400).json({message: "Username, email, password are required"});

        // check trùng username hoặc email
        const existingUser = await User.findOne({
            $or: [{username}, {email}]
        });
        if(existingUser)
            return res.status(409).json({message: "Username or email already exists"});

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Add new user
        const newUSer = await User.create({
            username,
            email,
            password: hashedPassword,
            displayname: displayname || username
        });
        
        const userResponse = {
            _id: newUSer._id,
            username: newUSer.username,
            email: newUSer.email,
            displayname: newUSer.displayname,
            avatarUrl: newUSer.avatarUrl,
            roles: newUSer.roles,
            isBlocked: newUSer.isBlocked,
            favoriteBooks: newUSer.favoriteBooks,
            createAt: newUSer.createdAt
        };
        res.status(201).json({message: "Registration successful", userResponse});
    } catch (error) {
        console.error("registerUser error: ", error);
        res.status(500).json({message: "Server error", error: error.message});
    }
};

export async function loginUser(req, res) {
    try {
        const {usernameOrEmail, password} = req.body;

        if(!usernameOrEmail || !password)
            return res.status(400).json({message: "Please enter username/email and password"});

        // find ủe by username or email
        const user = await User.findOne({
            $or: [
                {username: usernameOrEmail},
                {email: usernameOrEmail}
            ]
        });
        if(!user)
            return res.status(401).json({message: "Wrong account or password"});

        // check password
        const isPassword = await bcrypt.compare(password, user.password);
        if(!isPassword)
            return res.status(401).json({message: "Wrong account or password"});

        if(user.isBlocked)
            return res.status(403).json({message: "Account is blocked"});

        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            displayname: user.displayname,
            avatarUrl: user.avatarUrl,
            roles: user.roles,
        };
        res.json({message: "Login Successfully", userResponse});
    } catch (error) {
        console.error("longinUser error: ", error);
        res.status(500).json({message: "Server error", error: error.message});
    }
};

export async function getAllUsers(req, res) {
    try {
        const user = await User.find().select("-password -passwordOld");
        if(!user)
            return res.status(404).json({message: "Can not find users"})
        res.json(user);
    } catch (error) {
        console.error("getAllUsers error:", error);
        res.status(500).json({
            message: "Lỗi server khi lấy danh sách user",
            error: error.message
        });
    }
};

export async function getUserById(req, res) {
   try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password -passwordOld");

    if(!user)
        return res.status(404).json({message: "User not found"});

    res.json(user);
   } catch (error) {
    console.error("getUserById error:", error);
    res.status(500).json({
        message: "Lỗi server khi lấy user",
        error: error.message
        });
   } 
};

export async function editUser(req, res) {
    try {
        const userId = req.params.id;
        const {
            displayname,
            avatarUrl,
            isBlocked,
            favoriteBooks,
            newPassword
        } = req.body;
        const user = await User.findByIdAndUpdate(userId);

        if(!user)
            return res.status(404).json({message: "User not found"});

        if(displayname !== undefined) user.displayname = displayname;
        if(avatarUrl !== undefined) user.avatarUrl = avatarUrl;
        if(isBlocked !== undefined) user.isBlocked = isBlocked;
        if(favoriteBooks !== undefined) user.favoriteBooks = favoriteBooks;

        if(newPassword) {
            user.passwordOld = user.password;
            user.password = await bcrypt.hash(newPassword, 10);
        }

        const editUser = await user.save();
        const userResponse = {
            displayname: editUser.displayname,
            avatarUrl: editUser.avatarUrl,
            isBlocked: editUser.isBlocked,
            favoriteBooks: editUser.favoriteBooks,
            updateAt: editUser.updatedAt
        };

        res.json({message: "Edit user success", userResponse});
    } catch (error) {
        console.error("updateUser error:", error);
        res.status(500).json({
            message: "Lỗi server khi cập nhật user",
            error: error.message
        });
    }
};

export async function deleteUser(req, res) {
    try {
        const userId = req.params.id;
         
        const deleteUser = await User.findByIdAndDelete(userId);
        if(!deleteUser)
            return res.status(404).json({message: "User not found"});

        res.json({message: "Delete user successfully"});
    } catch (error) {
        console.error("deleteUser error:", error);
        res.status(500).json({
            message: "Lỗi server khi xóa user",
            error: error.message
        });
    }
};