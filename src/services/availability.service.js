const boom = require('@hapi/boom');
const { addMinutes, isBefore, isEqual, format, parse } = require('date-fns');

const Schedule = require('./../database/entities/schedule.entity');

class AvailabilityService {
  async check({ scheduleId, date }) {
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      throw boom.notFound('schedule not found');
    }
    const day = this.getDay(date);
    const availability = this.getAvailabilityByDay(schedule.availability, day);
    if (availability === null) {
      return [];
    }
    const promises = availability.intervals.map(async (interval) => {
      const startDate = this.createDate(date, interval.startTime);
      const endDate = this.createDate(date, interval.endTime);
      return this.generateSlots(startDate, endDate, schedule.duration, schedule.margin);
    });
    const response = await Promise.all(promises);
    return response.flat();
  }

  getDay(date) {
    return format(parse(date, 'yyyy-MM-dd', new Date()), 'EEEE').toLowerCase();
  }

  getAvailabilityByDay(availability, day) {
    return availability.find(item => item.day === day);
  }

  createDate(date, slotTime) {
    const [year, month, day] = date.split('-').map(item => parseInt(item));
    const [hour , minutes] = slotTime.split(':').map(item => parseInt(item));
    return new Date(year, month - 1, day, hour, minutes, 0);
  }

  generateSlots(startDate, endDate, duration, margin) {
    const slots = [];
    let processing = true;
    let start = startDate;
    let end = null;
    while (processing) {
      end = addMinutes(start, duration);
      processing = isBefore(end, endDate) || isEqual(end, endDate);
      if (processing) {
        slots.push({ start, end, status: 'on' });
      }
      start = addMinutes(end, margin);
    }
    return [...slots];
  }
}

module.exports = AvailabilityService;
