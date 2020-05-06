import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
momentDurationFormatSetup(moment);

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomItemFromArray = (array) => {
  const min = 0;
  const max = array.length;
  return array[getRandomNumber(min, max)];
};

const formatDateTime = (date) => {
  return moment(date).format(`YYYY/MM/DD hh:mm`);
};

const formatFilmDuration = (movieDuration) => {
  return moment.duration(movieDuration, `minutes`).format(`h[h] m[m]`);
};

const sortByDesc = (a, b) => {
  return b - a;
};

export {getRandomNumber, getRandomItemFromArray, formatDateTime, sortByDesc, formatFilmDuration};
