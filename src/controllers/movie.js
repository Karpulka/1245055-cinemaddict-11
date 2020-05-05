import FilmCard from "../components/film-card";
import FilmDetails from "../components/film-details";
import {POSITION, render, toggleElement, replace} from "../utils/render";

export default class MovieController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._filmComponent = null;
    this._filmDetailsComponent = null;
    this._footerElement = document.querySelector(`.footer`);
    this._setMovieHandlers = this._setMovieHandlers.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
    this._onFilmElementClick = this._onFilmElementClick.bind(this);
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onEscapeKeyPress = this._onEscapeKeyPress.bind(this);
    this._setAddToWatchlist = this._setAddToWatchlist.bind(this);
    this._setMarkAsWatched = this._setMarkAsWatched.bind(this);
    this._setMarkAsFavorite = this._setMarkAsFavorite.bind(this);
    this._film = null;
  }

  get film() {
    return this._film;
  }

  render(film) {
    this._film = film;

    const oldFilmComponent = this._filmComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmCard(film);
    this._filmDetailsComponent = new FilmDetails(film);

    this._filmComponent.setAddToWatchlistButtonClickHandler(this._setAddToWatchlist);
    this._filmComponent.setMarkAsWatchedButtonClickHandler(this._setMarkAsWatched);
    this._filmComponent.setMarkAsFavoriteButtonClickHandler(this._setMarkAsFavorite);

    if (oldFilmComponent && oldFilmDetailsComponent) {
      replace(oldFilmComponent, this._filmComponent);
      replace(oldFilmDetailsComponent, this._filmDetailsComponent);
    } else {
      render(this._container, this._filmComponent, POSITION.BEFOREEND);
    }
    this._setMovieHandlers();
  }

  _setAddToWatchlist() {
    this._onDataChange(this._film, Object.assign({}, this._film, {
      isWatchlist: !this._film.isWatchlist
    }));
  }

  _setMarkAsWatched() {
    this._onDataChange(this._film, Object.assign({}, this._film, {
      isWatched: !this._film.isWatched
    }));
  }

  _setMarkAsFavorite() {
    this._onDataChange(this._film, Object.assign({}, this._film, {
      isFavorites: !this._film.isFavorites
    }));
  }

  _setMovieHandlers() {
    this._filmComponent.setOpenCardClickHandler(this._onFilmElementClick);
    this._filmDetailsComponent.setCloseClickHandler(this._onCloseButtonClick);
    this._filmDetailsComponent.setFormElementsChangeHandler();
    this._filmDetailsComponent.setFormSubmitHandler();
  }

  _closeFilmDetails() {
    this._filmDetailsComponent.removeCloseClickHandler(this._onCloseButtonClick);
    toggleElement(this._footerElement, this._filmDetailsComponent, `hide`);
    document.removeEventListener(`keydown`, this._onEscapeKeyPress);
  };

  _onFilmElementClick() {
    toggleElement(this._footerElement, this._filmDetailsComponent, `show`);
    document.addEventListener(`keydown`, this._onEscapeKeyPress);
  };

  _onCloseButtonClick() {
    this._closeFilmDetails();
  };

  _onEscapeKeyPress(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._closeFilmDetails();
    }
  };
}
