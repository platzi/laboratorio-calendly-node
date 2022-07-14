const boom = require('@hapi/boom');
const {
  addMinutes,
  isBefore,
  isEqual,
  format,
  parse,
  startOfDay,
  endOfDay,
  areIntervalsOverlapping,
} = require('date-fns');
const { utcToZonedTime, format: formatTz } = require('date-fns-tz');

const Schedule = require('./../database/entities/schedule.entity');
const Appointment = require('./../database/entities/appointment.entity');

class AvailabilityService {
  async check({ scheduleId, date, timezone }) {
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      throw boom.notFound('schedule not found');
    }
    const day = this.getDay(date);
    const availability = this.getAvailabilityByDay(schedule.availability, day);
    if (availability === undefined) {
      return [];
    }
    const promises = availability.intervals.map(async (interval) => {
      const startDate = this.createDateWithScheduleTZ(
        date,
        interval.startTime,
        schedule.timezone
      );
      const endDate = this.createDateWithScheduleTZ(
        date,
        interval.endTime,
        schedule.timezone
      );
      return this.generateSlots(
        startDate,
        endDate,
        schedule.duration,
        schedule.margin
      );
    });
    const response = await Promise.all(promises);
    const appointments = await this.getAppointments(date, timezone);
    return response.flat().map((item) => ({
      ...item,
      start: this.createDateWithUserTZ(item.start, timezone),
      end: this.createDateWithUserTZ(item.end, timezone),
      status: this.validateStatus(appointments, item) ? 'off' : 'on'
    }));
  }

  getDay(date) {
    return format(parse(date, 'yyyy-MM-dd', new Date()), 'EEEE').toLowerCase();
  }

  getAvailabilityByDay(availability, day) {
    return availability.find((item) => item.day === day);
  }

  createDateWithScheduleTZ(dateStr, slotTime, scheduleTZ) {
    const date = new Date(dateStr);
    const formatDate = format(date, 'eee LLL dd yyyy');
    const dateUTC = utcToZonedTime(new Date(), scheduleTZ);
    const scheduleTZName = formatTz(dateUTC, 'OOOO', { timeZone: scheduleTZ });
    return new Date(`${formatDate} ${slotTime}:00 ${scheduleTZName}`);
  }

  createDateWithUserTZ(dateStr, userTZ) {
    const date = new Date(dateStr);
    const zonedTime = utcToZonedTime(date, userTZ);
    return formatTz(zonedTime, 'eee LLL dd yyyy HH:mm:ss OOOO', {
      timeZone: userTZ,
    });
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

  async getAppointments(dateStr, userTZ) {
    const date = new Date(dateStr);
    const zonedTime = utcToZonedTime(date, userTZ);
    const appointments = await Appointment.find({
      startDate: { $gte: startOfDay(zonedTime), $lte: endOfDay(zonedTime) },
    }).sort({ startDate: 1 });
    return appointments.map(item => ({
      start: item.startDate,
      end: item.endDate,
    }));
  }

  validateStatus(appointments, slot) {
    return appointments.some(appointment => areIntervalsOverlapping(
      appointment,
      slot
    ))
  }
}

module.exports = AvailabilityService;
