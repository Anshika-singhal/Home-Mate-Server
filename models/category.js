const mongoose = require('mongoose');
const ItemMaintainance = new mongoose.Schema({
    lastServiced: {
        type: Date, // Last cleaning date stored as a Date object
        required: true
    }
});
const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    instructions: {
        type: String,
        required: false
    },
    workFinish: {
        type: Boolean,
        default: false // Assume it's unfinished by default
    },
    frequency: {
        type: String,
        enum:['daily','weekly','monthly','yearly','custom']
    },
    serviceDate:{
        type: Date, // This needs to be required in creation logic
        required: true
    },
    DeleteAt: {
        type: Date,
        default:null
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    ItemMaintainance: [
        ItemMaintainance
    ]
});

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the user model
        ref:'user',
        required: true
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    DeleteAt: {
        type: Date,
        default:null
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    items: [
        ItemSchema
    ]
});

// Add a compound index to enforce unique category names per user
CategorySchema.index({ userId: 1, name: 1 }, { unique: true,partialFilterExpression:{DeleteAt:null} });

module.exports = mongoose.model('category', CategorySchema);
