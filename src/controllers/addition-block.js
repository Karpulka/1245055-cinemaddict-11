import {POSITION, render} from "../utils/render";
import AdditionBlock from "../components/addition-block";
import {getFilmsSortByCommentsCount, getFilmsSortByRating} from "../utils/film";
import {renderFilms} from "./movie";

const FILM_COUNT_ADDITION = 2;
const ADDITION_CONTAINER_TITLES = [`Top rated`, `Most commented`];

export default class AdditionBlockController {
  constructor(container, moviesModel, onDataChange) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._onDataChange = onDataChange;
    this._showingFilms = [];
    this._filmsSortByCommentsCount = null;
  }

  render() {
    // this._filmsSortByCommentsCount = this._getFilmsSortByCommentsCount();
      for (let i = 0; i < FILM_COUNT_ADDITION; i++) {
        render(this._container, new AdditionBlock(), POSITION.BEFOREEND);
        const extraContainerElements = this._container.querySelectorAll(`.films-list--extra`);
        const additionContainerElement = extraContainerElements[extraContainerElements.length - 1];
        const films = ADDITION_CONTAINER_TITLES[i] === `Top rated` ? this._getFilmsSortByRating() : this._getFilmsSortByCommentsCount();
        const additionContainerElementTitle = additionContainerElement.querySelector(`.films-list__title`);
        const additionContainerElementFilmList = additionContainerElement.querySelector(`.films-list__container`);

        if (ADDITION_CONTAINER_TITLES[i] === `Top rated` && films[0].rating > 0) {
          additionContainerElementTitle.textContent = ADDITION_CONTAINER_TITLES[i];
          this._showingFilms = this._showingFilms.concat(renderFilms(additionContainerElementFilmList, films, this._onDataChange));
        } else if (ADDITION_CONTAINER_TITLES[i] === `Most commented` && films[0].comments.length > 0) {
          additionContainerElementTitle.textContent = ADDITION_CONTAINER_TITLES[i];
          additionContainerElementFilmList.classList.add(`most-commented`);
          this._showingFilms = this._showingFilms.concat(renderFilms(additionContainerElementFilmList, films, this._onDataChange));
        }
      }
  }

  get showingFilms() {
    return this._showingFilms;
  }

  _getFilmsSortByRating() {
    return getFilmsSortByRating(this._moviesModel.getAllFilms(), 0, FILM_COUNT_ADDITION);
  }

  _getFilmsSortByCommentsCount() {
    return getFilmsSortByCommentsCount(this._moviesModel.getAllFilms(), 0, FILM_COUNT_ADDITION);
  }
}
