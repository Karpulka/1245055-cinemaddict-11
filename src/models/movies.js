import {FilterTypes} from "../controllers/filter";

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
}
