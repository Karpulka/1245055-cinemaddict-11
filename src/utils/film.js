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

export const parseFilmForUpdate = (film) => {
  const releaseDate = film.details.find((item) => item.term === `Release Date`).info;
  const writers = film.details.find((item) => item.term === `Writers`).info;
  const actors = film.details.find((item) => item.term === `Actors`).info;
  return {
    "id": film.id,
    "comments": film.comments,
    "film_info": {
      "title": film.name,
      "alternative_title": film.originalName,
      "total_rating": film.rating,
      "poster": film.poster,
      "age_rating": film.age,
      "director": film.details.find((item) => item.term === `Director`).info,
      "writers": writers ? writers.split(`, `) : [],
      "actors": actors ? actors.split(`, `) : [],
      "release": {
        "date": releaseDate ? releaseDate.toISOString() : null,
        "release_country": film.details.find((item) => item.term === `Country`).info
      },
      "runtime": film.details.find((item) => item.term === `Runtime`).info,
      "genre": film.genres ? film.genres.split(`, `) : [],
      "description": film.description
    },
    "user_details": {
      "watchlist": film.isWatchlist,
      "already_watched": film.isWatched,
      "watching_date": film.watchingDate ? film.watchingDate.toISOString() : null,
      "favorite": film.isFavorites
    }
  };
};
