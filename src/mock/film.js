import {getRandomNumber, getRandomItemFromArray} from "../utils/common";

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
const NAMES = [`Anthony`, `Anne`, `Heinz`, `Richard`, `Erich`, `Mary Beth`, `Dan`];
const LASTNAMES = [`Mann`, `Wigton`, `Herald`, `Weil`, `von Stroheim`, `Hughes`, `Duryea`];
const COUNTRIES = [`USA`, `Russia`, `France`, `UK`, `Italy`];
const AGES = [0, 6, 12, 16, 18];
const MONTHS = [
  {
    name: `January`,
    dayCount: 31
  },
  {
    name: `February`,
    dayCount: 28
  },
  {
    name: `March`,
    dayCount: 31
  },
  {
    name: `April`,
    dayCount: 30
  },
  {
    name: `May`,
    dayCount: 31
  },
  {
    name: `June`,
    dayCount: 30
  },
  {
    name: `July`,
    dayCount: 31
  },
  {
    name: `August`,
    dayCount: 31
  },
  {
    name: `September`,
    dayCount: 30
  },
  {
    name: `October`,
    dayCount: 31
  },
  {
    name: `November`,
    dayCount: 30
  },
  {
    name: `December`,
    dayCount: 31
  }
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

export const getAllComments = [];

const generateComments = () => {
  const ids = [];
  const commentsCount = getRandomNumber(0, 5);

  for (let i = 0; i < commentsCount; i++) {
    const id = getRandomNumber(1, 10000) + i;
    const comment = {
      id,
      comment: generateText(),
      emotion: getRandomItemFromArray(EMOTIONS),
      author: `Author Name ${i}`,
      date: getCommentDate()
    };
    getAllComments.push(comment);
    ids.push(id);
  }

  return ids;
};

const generateNames = (count = 1) => {
  const names = [];
  for (let i = 0; i < count; i++) {
    names.push(`${getRandomItemFromArray(NAMES)} ${getRandomItemFromArray(LASTNAMES)}`);
  }
  return names.join(`, `);
};

const createFilm = (key) => {
  const years = [2000];
  for (let i = 0; i < 20; i++) {
    years.push(years[years.length - 1] + 1);
  }
  const year = getRandomItemFromArray(years);

  const countGenres = getRandomNumber(1, GENRES.length);
  const duration = getRandomNumber(90, 180);
  const month = getRandomItemFromArray(MONTHS);
  const name = `Film ${key || `Film Film`}`;

  return {
    id: Date.now() + getRandomNumber(1, 10000),
    name,
    originalName: `Original: ${name}`,
    rating: getRandomNumber(0, 10),
    year,
    duration,
    genres: GENRES.slice(countGenres).join(`, `),
    description: generateText(),
    comments: generateComments(),
    poster: getRandomItemFromArray(FILM_POSTERS),
    age: getRandomItemFromArray(AGES),
    isWatchlist: Math.random() > 0.5,
    isWatched: Math.random() > 0.5,
    isFavorites: Math.random() > 0.5,
    details: [
      {
        term: `Director`,
        info: generateNames()
      },
      {
        term: `Writers`,
        info: generateNames(3)
      },
      {
        term: `Actors`,
        info: generateNames(4)
      },
      {
        term: `Release Date`,
        info: `${getRandomNumber(1, month.dayCount)} ${month.name} ${year}`
      },
      {
        term: `Runtime`,
        info: duration
      },
      {
        term: `Country`,
        info: getRandomItemFromArray(COUNTRIES)
      },
    ]
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
