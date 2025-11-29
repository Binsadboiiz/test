import mongoose from "mongoose";
import User from "../models/users.js";
import Publisher from "../models/publisher.js";

export async function registerPublisher(req, res) {
  try {
    const fromToken = req.user && req.user._id;
    const {
      userId: bodyUserId,
      pubName,
      pubAddress,
      pubPhone,
      pubEmail,
      pubDescription
    } = req.body;

    let userId = fromToken || bodyUserId;

    if (typeof userId === "string") {
      try {
        const maybeObj = JSON.parse(userId);
        if (maybeObj && maybeObj._id) userId = maybeObj._id;
      } catch (e) {
      }
    } else if (typeof userId === "object" && userId !== null) {
      if (userId._id) userId = userId._id;
    }

    if (!userId) return res.status(400).json({ message: "userId is required" });
    if (!pubName || !pubEmail || !pubPhone) {
      return res.status(400).json({ message: "pubName, pubPhone and pubEmail is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.publisher_id) {
      return res.status(409).json({ message: "User đã là publisher" });
    }

    const rawPhone = String(pubPhone || "").trim();
    const digits = rawPhone.replace(/\D/g, "");
    if (!digits) return res.status(400).json({ message: "Số điện thoại không hợp lệ" });

    const phoneNum = Number(digits);
    if (Number.isNaN(phoneNum)) return res.status(400).json({ message: "Số điện thoại không hợp lệ" });

    const newPub = new Publisher({
      pubName: pubName.trim(),
      pubAddress: (pubAddress || "").trim(),
      pubPhone: phoneNum,
      pubEmail: pubEmail.trim().toLowerCase(),
      pubDescription: (pubDescription || "").trim()
    });
    await newPub.save();
    user.roles = ["publisher"];       
    user.publisher_id = newPub._id;
    await user.save();

    return res.json({ message: "Đăng ký Publisher thành công", publisher: newPub });
  } catch (error) {
    console.error("registerPublisher error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getPublisherById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const pub = await Publisher.findById(id);
    if (!pub) return res.status(404).json({ message: "Publisher not found" });

    return res.json(pub);
  } catch (err) {
    console.error("getPublisherById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}