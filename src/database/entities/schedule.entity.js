const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  duration: {
    type: Number,
    default: 0,
    required: true,
  },
  margin: {
    type: Number,
    default: 0,
    required: true,
  },
  timezone: {
    type: String,
    trim: true,
    required: true,
  },
  availability: [
    {
      day: {
        type: String,
        required: true,
        enum: [
          'sunday',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
        ],
      },
      intervals: [{ startTime: String, endTime: String }],
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
});

const Schedule = mongoose.model('Schedules', scheduleSchema);

module.exports = Schedule;
