import {getRandomNumber, getRandomItemFromArray} from "../util";

const GENRES = [`action`, `adventure`, `comedy`, `crime & gangster`, `drama`, `horror`];
const TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const EMOTIONS = [`smile`, `sleeping`, `puke`, `angry`];
const FILM_POSTERS = [
  `./images/posters/made-for-each-other.png`,
  `./images/posters/made-for-each-other.png`,
  `./images/posters/sagebrush-trail.jpg`,
  `./images/posters/santa-claus-conquers-the-martians.jpg`,
  `./images/posters/the-dance-of-life.jpg`,
  `./images/posters/the-great-flamarion.jpg`,
  `./images/posters/the-man-with-the-golden-arm.jpg`
];

const generateText = function (text = TEXT) {
  const sentences = text.split(`.`);
  const sentencesCount = getRandomNumber(1, 5);

  const resultSentences = [];
  for (let i = 0; i < sentencesCount; i++) {
    resultSentences.push(getRandomItemFromArray(sentences).trim());
  }

  return `${resultSentences.join(`. `)}.`;
};

const getCommentDate = () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - getRandomNumber(0, 7));
  return currentDate;
};

const generateComments = () => {
  const result = [];
  const commentsCount = getRandomNumber(0, 5);

  for (let i = 0; i < commentsCount; i++) {
    result.push({
      comment: generateText(),
      emotion: getRandomItemFromArray(EMOTIONS),
      author: `Author Name ${i}`,
      date: getCommentDate()
    });
  }

  return result;
};

const createFilm = (key) => {
  const years = [2000];
  for (let i = 0; i < 20; i++) {
    years.push(years[years.length - 1] + 1);
  }

  const hour = getRandomNumber(1, 3);
  const minute = getRandomNumber(1, 59);
  const countGenres = getRandomNumber(1, GENRES.length);

  return {
    name: `Film ${key || `Film Film`}`,
    rating: getRandomNumber(0, 10),
    year: getRandomItemFromArray(years),
    duration: `${hour}h ${minute}m`,
    genres: GENRES.slice(countGenres).join(`,`),
    description: generateText(),
    comments: generateComments(),
    poster: getRandomItemFromArray(FILM_POSTERS)
  };
};

const generateFilms = (count) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(createFilm(i));
  }
  return result;
};

export {generateFilms};
