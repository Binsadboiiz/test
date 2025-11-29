import PublisherRequest from "../models/publisherRequest.js";
import ErrorApi from "../middlewares/handleError.js";

export async function sendRequest(req, res, next) {
    try {
        const { pubName, pubAddress, pubPhone, pubEmail, pubDescription } = req.body;

        const exists = await PublisherRequest.findOne({
            userId: req.user._id,
            statusProcess: "pending"
        });

        if(exists) {
            throw new ErrorApi("You are already submitted a request. Please wait for admin approval")
        }

        const request = await PublisherRequest.create({
            userId: req.user._id,
            pubName,
            pubAddress,
            pubPhone,
            pubEmail,
            pubDescription
        });

        res.status(201).json({
            message: "Publisher request submitted successfully",
            request
        });

    } catch (error) {
        next(error);
    }
}