import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        require: true
    },
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    amount: {type:Number, required:true},
    status: {type:String, enum: ['pending', 'complete', 'failed'], default:'pending'},


}, {timeseries:true});


export const Purchase = mongoose.model('Purchase', purchaseSchema);
