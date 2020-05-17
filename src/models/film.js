export default class FilmModel {
  constructor(data) {
    this.id = data[`id`];
    this.name = data[`film_info`][`title`];
    this.originalName = data[`film_info`][`alternative_title`];
    this.rating = data[`film_info`][`total_rating`];
    this.year = new Date(data[`film_info`][`release`][`date`]).getFullYear();
    this.duration = data[`film_info`][`runtime`];
    this.genres = data[`film_info`][`genre`] ? data[`film_info`][`genre`].join(`, `) : ``;
    this.description = data[`film_info`][`description`];
    this.comments = data[`comments`] ? data[`comments`] : [];
    this.poster = data[`film_info`][`poster`];
    this.age = data[`film_info`][`age_rating`];
    this.isWatchlist = Boolean(data[`user_details`][`watchlist`]);
    this.isWatched = Boolean(data[`user_details`][`already_watched`]);
    this.isFavorites = Boolean(data[`user_details`][`favorite`]);
    this.watchingDate = data[`user_details`][`watching_date`] ? new Date(data[`user_details`][`watching_date`]) : null;
    this.details = [
      {
        term: `Director`,
        info: data[`film_info`][`director`]
      },
      {
        term: `Writers`,
        info: data[`film_info`][`writers`] ? data[`film_info`][`writers`].join(`, `) : ``
      },
      {
        term: `Actors`,
        info: data[`film_info`][`actors`] ? data[`film_info`][`actors`].join(`, `) : ``
      },
      {
        term: `Release Date`,
        info: data[`film_info`][`release`][`date`] ? new Date(data[`film_info`][`release`][`date`]) : null
      },
      {
        term: `Runtime`,
        info: data[`film_info`][`runtime`]
      },
      {
        term: `Country`,
        info: data[`film_info`][`release`][`release_country`]
      },
    ];
  }

  toRAW() {
    const releaseDate = this.details.find((item) => item.term === `Release Date`).info;
    const writers = this.details.find((item) => item.term === `Writers`).info;
    const actors = this.details.find((item) => item.term === `Actors`).info;
    return {
      "id": this.id,
      "comments": this.comments,
      "film_info": {
        "title": this.name,
        "alternative_title": this.originalName,
        "total_rating": this.rating,
        "poster": this.poster,
        "age_rating": this.age,
        "director": this.details.find((item) => item.term === `Director`).info,
        "writers": writers ? writers.split(`, `) : [],
        "actors": actors ? actors.split(`, `) : [],
        "release": {
          "date": releaseDate ? releaseDate.toISOString() : null,
          "release_country": this.details.find((item) => item.term === `Country`).info
        },
        "runtime": this.details.find((item) => item.term === `Runtime`).info,
        "genre": this.genres ? this.genres.split(`, `) : [],
        "description": this.description
      },
      "user_details": {
        "watchlist": this.isWatchlist,
        "already_watched": this.isWatched,
        "watching_date": this.watchingDate ? this.watchingDate.toISOString() : null,
        "favorite": this.isFavorites
      }
    };
  }

  static parseFilm(data) {
    return new FilmModel(data);
  }

  static parseFilms(data) {
    return data.map(FilmModel.parseFilm);
  }

  static clone(data) {
    return new FilmModel(data.toRAW());
  }
}
