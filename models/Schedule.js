const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
