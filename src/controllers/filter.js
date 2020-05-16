import {render, POSITION, replace} from "../utils/render";
import Navigation from "../components/navigation";

export const FilterTypes = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
  STATISTIC: `stats`
};

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._currentFilter = FilterTypes.ALL;
    this._navigation = null;
    this._setChangeFilterHandlers = this._setChangeFilterHandlers.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const oldNavigation = this._navigation;
    const isStatisticCheck = this._currentFilter === FilterTypes.STATISTIC;
    this._navigation = new Navigation(this._generateFilters(), isStatisticCheck);
    this._navigation.setFilterChangeHandler(this._setChangeFilterHandlers);
    this._navigation.setStatisticClickHandler(this._setChangeFilterHandlers);
    if (oldNavigation) {
      replace(oldNavigation, this._navigation);
    } else {
      render(this._container, this._navigation, POSITION.AFTERBEGIN);
    }
  }

  getCurrentFilterType() {
    return this._currentFilter;
  }

  _setChangeFilterHandlers(evt) {
    evt.preventDefault();
    this._currentFilter = evt.target.getAttribute(`href`).replace(`#`, ``);
    this._moviesModel.setFilter(this._currentFilter);
    this.render();
  }

  _generateFilters() {
    return [
      {
        name: `All movies`,
        link: `#all`,
        count: -1,
        checked: this._currentFilter === `all`
      },
      {
        name: `Watchlist`,
        link: `#watchlist`,
        count: this._moviesModel.getAllFilms().filter((elm) => elm.isWatchlist).length,
        checked: this._currentFilter === `watchlist`
      },
      {
        name: `History`,
        link: `#history`,
        count: this._moviesModel.getAllFilms().filter((elm) => elm.isWatched).length,
        checked: this._currentFilter === `history`
      },
      {
        name: `Favorites`,
        link: `#favorites`,
        count: this._moviesModel.getAllFilms().filter((elm) => elm.isFavorites).length,
        checked: this._currentFilter === `favorites`
      }
    ];
  }

  _onDataChange() {
    this.render();
  }
}
