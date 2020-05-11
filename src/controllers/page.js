import {POSITION, remove, render} from "../utils/render";
import AdditionBlock from "../components/addition-block";
import {sortByDesc} from "../utils/common";
import MoreButton from "../components/show-more-button";
import NoFilm from "../components/no-film";
import Navigation from "../components/navigation";
import Sort, {SORT_TYPE} from "../components/sort";
import ContentBlock from "../components/content-block";
import MovieController from "./movie";
import {generateFilters} from "../mock/filter";
import FilterController from "./filter";

const FILM_COUNT_ADDITION = 2;
const FILM_PAGE_COUNT = 5;
const ADDITION_CONTAINER_TITLES = [`Top rated`, `Most commented`];

const renderAdditionBlocks = (filmContainerElement, filmsSortByRating, filmsSortByCommentsCount, onDataChange) => {
  let showingFilms = [];
  for (let i = 0; i < FILM_COUNT_ADDITION; i++) {
    render(filmContainerElement, new AdditionBlock(), POSITION.BEFOREEND);
    const extraContainerElements = filmContainerElement.querySelectorAll(`.films-list--extra`);
    const additionContainerElement = extraContainerElements[extraContainerElements.length - 1];
    const films = ADDITION_CONTAINER_TITLES[i] === `Top rated` ? filmsSortByRating : filmsSortByCommentsCount;
    const additionContainerElementTitle = additionContainerElement.querySelector(`.films-list__title`);
    const additionContainerElementFilmList = additionContainerElement.querySelector(`.films-list__container`);

    if (ADDITION_CONTAINER_TITLES[i] === `Top rated` && films[0].rating > 0) {
      additionContainerElementTitle.textContent = ADDITION_CONTAINER_TITLES[i];
      showingFilms = showingFilms.concat(renderFilms(additionContainerElementFilmList, films, onDataChange));
    } else if (ADDITION_CONTAINER_TITLES[i] === `Most commented` && films[0].comments.length > 0) {
      additionContainerElementTitle.textContent = ADDITION_CONTAINER_TITLES[i];
      showingFilms = showingFilms.concat(renderFilms(additionContainerElementFilmList, films, onDataChange));
    }
  }
  return showingFilms;
};

const getFilmsSortByRating = (films, from, to) => {
  return films.slice().sort((a, b) => {
    return sortByDesc(a.rating, b.rating);
  }).slice(from, to);
};

const getFilmsSortByCommentsCount = (films, from, to) => {
  return films.slice().sort((a, b) => {
    return sortByDesc(a.comments.length, b.comments.length);
  }).slice(from, to);
};

const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];
  const showingFilms = films.slice();
  switch (sortType) {
    case SORT_TYPE.DATE:
      sortedFilms = showingFilms.sort((a, b) => {
        const bDate = new Date(b.details.find((detail) => detail.term === `Release Date`).info);
        const aDate = new Date(a.details.find((detail) => detail.term === `Release Date`).info);
        return bDate - aDate;
      }).slice(from, to);
      break;
    case SORT_TYPE.RATING:
      sortedFilms = getFilmsSortByRating(showingFilms, from, to);
      break;
    case SORT_TYPE.DEFAULT:
      sortedFilms = showingFilms.slice(from, to);
      break;
  }
  return sortedFilms;
};

const renderFilms = (container, films, onDataChange) => {
  return films.map((film) => {
    const filmController = new MovieController(container, onDataChange);
    filmController.render(film);
    return filmController;
  });
};

export default class PageController {
  constructor(container, moviesModel) {
    this._container = container;
    this._sort = new Sort();
    this._contentBlock = new ContentBlock();
    this._moreButton = new MoreButton();
    this._noFilm = new NoFilm();
    this._showingFilmsCount = FILM_PAGE_COUNT;
    this._renderLoadMoreButton = this._renderLoadMoreButton.bind(this);
    this._moviesModel = moviesModel;
    this._films = [];
    this._renderSortFilms = this._renderSortFilms.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._showingFilms = [];
    this._filmsInAdditionsBlocks = [];
    this._onViewChange = this._onViewChange.bind(this);
    this._filtersController = new FilterController(this._container, moviesModel);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._updateFilms = this._updateFilms.bind(this);
    this._removeFilms = this._removeFilms.bind(this);
    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
    this._filmListContainerElement = null;
  }

  render() {
    this._films = this._moviesModel.getFilms();
    this._filtersController.render();
    render(this._container, this._sort, POSITION.BEFOREEND);
    render(this._container, this._contentBlock, POSITION.BEFOREEND);

    const filmContainerElement = this._container.querySelector(`.films`);
    this._filmListContainerElement = this._container.querySelector(`.films-list__container`);

    const filmsSortByRating = getFilmsSortByRating(this._moviesModel.getAllFilms(), 0, FILM_COUNT_ADDITION);
    const filmsSortByCommentsCount = getFilmsSortByCommentsCount(this._moviesModel.getAllFilms(), 0, FILM_COUNT_ADDITION);

    if (this._films.length > 0) {
      const showingFilms = renderFilms(this._filmListContainerElement, getSortedFilms(this._films, this._sort.getCurrentSortType(), 0, this._showingFilmsCount), this._onDataChange);
      this._showingFilms = this._showingFilms.concat(showingFilms);
      this._renderLoadMoreButton();
      this._filmsInAdditionsBlocks = renderAdditionBlocks(filmContainerElement, filmsSortByRating, filmsSortByCommentsCount, this._onDataChange);
      this._showingFilms = this._showingFilms.concat(this._filmsInAdditionsBlocks);
      this._renderSortFilms();
    } else {
      this._filmListContainerElement.remove();
      render(filmContainerElement.querySelector(`.films-list`), this._noFilm, POSITION.BEFOREEND);
    }
  }

  _renderLoadMoreButton() {
    render(this._filmListContainerElement, this._moreButton, POSITION.AFTEREND);
    this._moreButton.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount = this._showingFilmsCount + FILM_PAGE_COUNT;

      const sortedFilms = getSortedFilms(this._films, this._sort.getCurrentSortType(), prevFilmsCount, this._showingFilmsCount);
      const showingFilms = renderFilms(this._filmListContainerElement, sortedFilms, this._onDataChange);
      this._showingFilms = this._showingFilms.concat(showingFilms);

      if (this._showingFilmsCount >= this._films.length) {
        remove(this._moreButton);
      }
    });
  }

  _renderSortFilms() {
    this._sort.setSortTypeChangeHandler((sortType) => {
      this._showingFilmsCount = FILM_PAGE_COUNT;
      this._filmListContainerElement.innerHTML = ``;
      remove(this._moreButton);
      const showingFilms = renderFilms(this._filmListContainerElement, getSortedFilms(this._films, sortType, 0, this._showingFilmsCount), this._onDataChange);
      this._showingFilms = [].concat(showingFilms);
      this._showingFilms = this._showingFilms.concat(this._filmsInAdditionsBlocks);
      this._renderLoadMoreButton();
    });
  }

  _onDataChange(oldData, newData) {
    this._moviesModel.updateData(oldData.id, newData);

    const filmControllers = this._showingFilms.filter((filmController) => filmController.film === oldData);

    filmControllers.forEach((filmController) => filmController.render(newData));
    remove(this._navigation);
    this._navigation = new Navigation(generateFilters(this._moviesModel.getAllFilms()));
    render(this._container, this._navigation, POSITION.AFTERBEGIN);
  }

  _onViewChange() {
    this._showingFilms.forEach((filmController) => filmController.setDefaultView());
  }

  _onFilterChange() {
    this._updateFilms();
  }

  _updateFilms() {
    this._removeFilms();
    this._films = this._moviesModel.getFilms();
    const showingFilms = renderFilms(this._filmListContainerElement, getSortedFilms(this._films, this._sort.getCurrentSortType(), 0, FILM_PAGE_COUNT), this._onDataChange);
    this._showingFilms = this._showingFilms.concat(showingFilms);
    this._showingFilmsCount = this._showingFilms.length;
    this._renderLoadMoreButton();
  }

  _removeFilms() {
    this._showingFilms.forEach((filmController) => filmController.destroy());
    this._showingFilms = [];
    remove(this._moreButton);
  }
}
