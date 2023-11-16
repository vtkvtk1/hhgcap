const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const InvestmentSchema = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    tier: {
        type: String
    },
    duration: {
        type: String
    },
    amountInvested: {
        type: Number,
    },
    status: {
        type: String,
        default: "Active",
    },
}, { timestamps: true });

const Investment = mongoose.model("Investment", InvestmentSchema);

module.exports = Investment;