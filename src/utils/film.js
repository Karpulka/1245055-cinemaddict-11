import {sortByDesc} from "./common";

export const getFilmsSortByRating = (films, from, to) => {
  return films.slice().sort((a, b) => {
    return sortByDesc(a.rating, b.rating);
  }).slice(from, to);
};

export const getFilmsSortByCommentsCount = (films, from, to) => {
  return films.slice().sort((a, b) => {
    return sortByDesc(a.comments.length, b.comments.length);
  }).slice(from, to);
};

export const parseDataForUpdate = (data) => {
  const releaseDate = data.details.find((item) => item.term === `Release Date`).info;
  const writers = data.details.find((item) => item.term === `Writers`).info;
  const actors = data.details.find((item) => item.term === `Actors`).info;
  return {
    "id": data.id,
    "comments": data.comments,
    "film_info": {
      "title": data.name,
      "alternative_title": data.originalName,
      "total_rating": data.rating,
      "poster": data.poster,
      "age_rating": data.age,
      "director": data.details.find((item) => item.term === `Director`).info,
      "writers": writers ? writers.split(`, `) : [],
      "actors": actors ? actors.split(`, `) : [],
      "release": {
        "date": releaseDate ? releaseDate.toISOString() : null,
        "release_country": data.details.find((item) => item.term === `Country`).info
      },
      "runtime": data.details.find((item) => item.term === `Runtime`).info,
      "genre": data.genres ? data.genres.split(`, `) : [],
      "description": data.description
    },
    "user_details": {
      "watchlist": data.isWatchlist,
      "already_watched": data.isWatched,
      "watching_date": data.watchingDate ? data.watchingDate.toISOString() : null,
      "favorite": data.isFavorites
    }
  };
};
