import {parseFilmForUpdate} from "../utils/film";

export default class FilmModel {
  constructor(film) {
    this.id = film[`id`];
    this.name = film[`film_info`][`title`];
    this.originalName = film[`film_info`][`alternative_title`];
    this.rating = film[`film_info`][`total_rating`];
    this.year = new Date(film[`film_info`][`release`][`date`]).getFullYear();
    this.duration = film[`film_info`][`runtime`];
    this.genres = film[`film_info`][`genre`] ? film[`film_info`][`genre`].join(`, `) : ``;
    this.description = film[`film_info`][`description`];
    this.comments = film[`comments`] ? film[`comments`] : [];
    this.poster = film[`film_info`][`poster`];
    this.age = film[`film_info`][`age_rating`];
    this.isWatchlist = Boolean(film[`user_details`][`watchlist`]);
    this.isWatched = Boolean(film[`user_details`][`already_watched`]);
    this.isFavorites = Boolean(film[`user_details`][`favorite`]);
    this.watchingDate = film[`user_details`][`watching_date`] ? new Date(film[`user_details`][`watching_date`]) : null;
    this.details = [
      {
        term: `Director`,
        info: film[`film_info`][`director`]
      },
      {
        term: `Writers`,
        info: film[`film_info`][`writers`] ? film[`film_info`][`writers`].join(`, `) : ``
      },
      {
        term: `Actors`,
        info: film[`film_info`][`actors`] ? film[`film_info`][`actors`].join(`, `) : ``
      },
      {
        term: `Release Date`,
        info: film[`film_info`][`release`][`date`] ? new Date(film[`film_info`][`release`][`date`]) : null
      },
      {
        term: `Runtime`,
        info: film[`film_info`][`runtime`]
      },
      {
        term: `Country`,
        info: film[`film_info`][`release`][`release_country`]
      },
    ];
  }

  toRAW() {
    return parseFilmForUpdate(this);
  }

  static parseFilm(film) {
    return new FilmModel(film);
  }

  static parseFilms(film) {
    return film.map(FilmModel.parseFilm);
  }

  static clone(film) {
    return new FilmModel(film.toRAW());
  }
}
