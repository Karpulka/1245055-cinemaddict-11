import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
momentDurationFormatSetup(moment);

export const formatDateToFromNow = (date) => {
  return moment(date).fromNow();
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
