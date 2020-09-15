const Moment = require("moment");
const MomentRange = require("moment-range");

const moment = MomentRange.extendMoment(Moment);

const hasDateOverlap = (dates, newDates) => {
  const range = moment.range(moment(dates.startDate), moment(dates.endDate));
  const newRange = moment.range(
    moment(newDates.startDate),
    moment(newDates.endDate)
  );

  return range.overlaps(newRange);
};

module.exports = { hasDateOverlap };
