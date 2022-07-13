const Appointment = require('./../database/entities/appointment.entity');

class AppointmentService {
  create(dto) {
    const newAppointment = new Appointment({
      ...dto,
      user: dto.userId,
    });
    return newAppointment.save();
  }

  getAll() {
    return Appointment.find();
  }

  getByUser(userId) {
    return Appointment.find({ user: userId });
  }

  getById(id) {
    return Appointment.findById(id);
  }
}

module.exports = AppointmentService;
