const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const dateParser = (date: Date) => {
  let day = date.getDate() < 10 ? "0" + date.getDate() : String(date.getDate());

  const weekday = WEEKDAYS[date.getDay()];
  const weekdayShort = weekday.slice(0, 3);

  const month = MONTHS[date.getMonth()];
  const monthShort = month.slice(0, 3);

  return { day, weekday, weekdayShort, month, monthShort };
};
