import FilmCard from "../components/film-card";
import FilmDetails from "../components/film-details";
import {POSITION, render, toggleElement} from "../utils/render";

export default class MovieController {
  constructor(container) {
    this._container = container;
    this._filmComponent = null;
    this._filmDetailsComponent = null;
    this._footerElement = document.querySelector(`.footer`);
    this._setMovieHandlers = this._setMovieHandlers.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
    this._onFilmElementClick = this._onFilmElementClick.bind(this);
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onEscapeKeyPress = this._onEscapeKeyPress.bind(this);
  }

  render(film) {
    this._filmComponent = new FilmCard(film);
    this._filmDetailsComponent = new FilmDetails(film);

    render(this._container, this._filmComponent, POSITION.BEFOREEND);
    this._setMovieHandlers();
  }

  _setMovieHandlers() {
    this._filmComponent.setSelectorClickHandler(`.film-card__poster`, this._onFilmElementClick);
    this._filmComponent.setSelectorClickHandler(`.film-card__title`, this._onFilmElementClick);
    this._filmComponent.setSelectorClickHandler(`.film-card__comments`, this._onFilmElementClick);
    this._filmDetailsComponent.setCloseClickHandler(this._onCloseButtonClick);
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
