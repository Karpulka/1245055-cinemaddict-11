import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
momentDurationFormatSetup(moment);

export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const getRandomItemFromArray = (array) => {
  const min = 0;
  const max = array.length;
  return array[getRandomNumber(min, max)];
};

export const formatDateTime = (date) => {
  return moment(date).format(`YYYY/MM/DD hh:mm`);
};

export const formatFilmDuration = (movieDuration) => {
  return moment.duration(movieDuration, `minutes`).format(`h[h] m[m]`);
};

export const formatFilmReleaseDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatFilmDurationForStatistic = (movieDuration) => {
  return moment.duration(movieDuration, `minutes`).format(`h:m`);
};

export const sortByDesc = (a, b) => {
  return b - a;
};
