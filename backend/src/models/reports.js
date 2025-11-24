import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    reportTitle: {
        type: String,
        require: true,
        trim: true
    },
    reportDetails: {
        type: String,
        default: "",
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    reportImgUrl: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
export default Report;