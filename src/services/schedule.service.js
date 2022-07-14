const Schedule = require('./../database/entities/schedule.entity');

class ScheduleService {
  create(dto) {
    const newSchedule = new Schedule({
      ...dto,
      user: dto.userId,
    });
    return newSchedule.save();
  }

  getAll() {
    return Schedule.find();
  }

  getByUser(userId) {
    return Schedule.find({ user: userId });
  }

  getById(id) {
    return Schedule.findById(id).populate('user');
  }

  update(id, changes) {
    return Schedule.findByIdAndUpdate(id, changes, { upsert: true, new: true });
  }
}

module.exports = ScheduleService;
