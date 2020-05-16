import {FilterTypes} from "../controllers/filter";
import {getFilmsSortByRating} from "../utils/film";
import {SORT_TYPE} from "../components/sort";

export default class Movies {
  constructor(films) {
    this._films = films;
    this._currentFilterType = FilterTypes.ALL;
    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
    this._dataCommentsChangeHandlers = [];
    this._additionBlockChangeHandlers = [];
  }

  getAllFilms() {
    return this._films;
  }

  getFilms() {
    switch (this._currentFilterType) {
      case FilterTypes.WATCHLIST:
        return this._films.filter((elm) => elm.isWatchlist);
      case FilterTypes.HISTORY:
        return this._films.filter((elm) => elm.isWatched);
      case FilterTypes.FAVORITES:
        return this._films.filter((elm) => elm.isFavorites);
    }

    return this._films;
  }

  updateData(id, newFilm) {
    const index = this._films.findIndex((film) => film.id === id);

    if (index === -1) {
      return;
    }

    const isCommentsUpdate = !(this._films[index].comments === newFilm.comments);

    this._films = [].concat(this._films.slice(0, index), newFilm, this._films.slice(index + +1));
    this._callHandlers(this._dataChangeHandlers);

    if (isCommentsUpdate) {
      this._callHandlers(this._dataCommentsChangeHandlers);
      this._callHandlers(this._additionBlockChangeHandlers);
    }
  }

  setFilter(filterType) {
    this._currentFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setFilterChangeHandlers(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setAdditionBlockChangeHandler(handler) {
    this._additionBlockChangeHandlers.push(handler);
  }

  setCommentsDataChangeHAndler(handler) {
    this._dataCommentsChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  _getFilmsSortByRating(from, to) {
    return getFilmsSortByRating(this.getFilms(), from, to);
  }

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
      case SORT_TYPE.DEFAULT:
        return this.getFilms().slice(from, to);
    }
    return [];
  }
}
