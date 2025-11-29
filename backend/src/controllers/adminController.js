import User from "../models/users.js";
import Publisher from "../models/publisher.js";
import PublisherRequest from "../models/publisherRequest.js";
import mongoose from "mongoose";

// lấy danh sách yêu cầu chờ duyệt
export async function getRequests(req, res) {
  try {
    const requests = await PublisherRequest.find({ status: "pending" })
      .populate("userId", "username email displayname");
    return res.json(requests);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// duyệt yêu cầu
export async function approveRequest(req, res) {
  try {
    const { requestId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(requestId))
      return res.status(400).json({ message: "Invalid requestId" });

    const request = await PublisherRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending") return res.status(400).json({ message: "Request đã xử lý" });

    const user = await User.findById(request.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newPublisher = new Publisher({
      pubName: request.pubName,
      pubAddress: request.pubAddress,
      pubPhone: request.pubPhone,
      pubEmail: request.pubEmail,
      pubDescription: request.pubDescription
    });
    await newPublisher.save();

    user.roles = ["publisher"];
    user.publisher_id = newPublisher._id;
    await user.save();

    request.status = "approved";
    await request.save();

    return res.json({ message: "Duyệt thành công", publisher: newPublisher });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// từ chối yêu cầu
export async function rejectRequest(req, res) {
  try {
    const { requestId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(requestId))
      return res.status(400).json({ message: "Invalid requestId" });

    const request = await PublisherRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "rejected";
    await request.save();

    return res.json({ message: "Yêu cầu đã bị từ chối" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// register trực tiếp publisher (bỏ qua chờ duyệt, có thể dùng cho test hoặc admin tạo)
export async function registerPublisher(req, res) {
  try {
    const userId = req.user?._id || req.body.userId;
    const { pubName, pubAddress, pubPhone, pubEmail, pubDescription } = req.body;

    if (!userId || !pubName || !pubEmail || !pubPhone)
      return res.status(400).json({ message: "userId, pubName, pubPhone, pubEmail required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.publisher_id) return res.status(409).json({ message: "User đã là publisher" });

    const existPub = await Publisher.findOne({ pubEmail: pubEmail.trim().toLowerCase() });
    if (existPub) return res.status(409).json({ message: "Publisher đã tồn tại" });

    const phoneNum = Number(String(pubPhone).replace(/\D/g, ""));
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// lấy publisher theo id
export async function getPublisherById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const pub = await Publisher.findById(id);
    if (!pub) return res.status(404).json({ message: "Publisher not found" });

    return res.json(pub);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
