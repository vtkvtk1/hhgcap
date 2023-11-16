const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PlanSchema = new Schema(
  {
    name: {
      type: String,
    },
    min: {
      type: Number,
    },
    max: {
      type: Number,
    },
    profit: {
      type: Number,
    },
    hours: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", PlanSchema);

module.exports = Plan;
