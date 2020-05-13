import {FilterTypes} from "../controllers/filter";
import {getFilmsSortByRating} from "../utils/film";
import {SORT_TYPE} from "../components/sort";

export default class Movies {
  constructor(films) {
    this._films = films;
    this._currentFilterType = FilterTypes.ALL;
    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  getAllFilms() {
    return this._films;
  }

  getFilms() {
    switch (this._currentFilterType) {
      case FilterTypes.ALL:
        return this._films;
      case FilterTypes.WATCHLIST:
        return this._films.filter((elm) => elm.isWatchlist);
      case FilterTypes.HISTORY:
        return this._films.filter((elm) => elm.isWatched);
      case FilterTypes.FAVORITES:
        return this._films.filter((elm) => elm.isFavorites);
    }
  }

  updateData(id, newFilm) {
    const index = this._films.findIndex((film) => film.id === id);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newFilm, this._films.slice(index + +1));
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._currentFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  _getFilmsSortByRating(from, to) {
    return getFilmsSortByRating(this.getFilms(), from, to);
  };

  getSortedFilms(sortType, from, to) {
    switch (sortType) {
      case SORT_TYPE.DATE:
        return this.getFilms().slice().sort((a, b) => {
          const bDate = new Date(b.details.find((detail) => detail.term === `Release Date`).info);
          const aDate = new Date(a.details.find((detail) => detail.term === `Release Date`).info);
          return bDate - aDate;
        }).slice(from, to);
      case SORT_TYPE.RATING:
        return this._getFilmsSortByRating(from, to);
        break;
      case SORT_TYPE.DEFAULT:
        return this.getFilms().slice(from, to);
        break;
    }
  };
}
