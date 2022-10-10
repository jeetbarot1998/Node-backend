const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileUplaodSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    uploadedby:{
        type: String,
        required: true
    },
});

module.exports = mongoose.model('FileUplaod', FileUplaodSchema);