const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  note: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
});

const Appointment = mongoose.model('Appointments', appointmentSchema);

module.exports = Appointment;
