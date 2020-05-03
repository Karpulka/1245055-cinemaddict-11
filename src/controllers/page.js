import {POSITION, remove, render, replace} from "../utils/render";
import AdditionBlock from "../components/addition-block";
import {sortByDesc} from "../utils/common";
import MoreButton from "../components/show-more-button";
import NoFilm from "../components/no-film";
import Navigation from "../components/navigation";
import Sort, {SORT_TYPE} from "../components/sort";
import ContentBlock from "../components/content-block";
import MovieController from "./movie";
import {generateFilters} from "../mock/filter";

const FILM_COUNT_ADDITION = 2;
const FILM_PAGE_COUNT = 5;
const ADDITION_CONTAINER_TITLES = [`Top rated`, `Most commented`];

const renderAdditionBlocks = (filmContainerElement, filmsSortByRating, filmsSortByCommentsCount) => {
  for (let i = 0; i < FILM_COUNT_ADDITION; i++) {
    render(filmContainerElement, new AdditionBlock(), POSITION.BEFOREEND);
    const extraContainerElements = filmContainerElement.querySelectorAll(`.films-list--extra`);
    const additionContainerElement = extraContainerElements[extraContainerElements.length - 1];
    const films = ADDITION_CONTAINER_TITLES[i] === `Top rated` ? filmsSortByRating : filmsSortByCommentsCount;
    const additionContainerElementTitle = additionContainerElement.querySelector(`.films-list__title`);
    const additionContainerElementFilmList = additionContainerElement.querySelector(`.films-list__container`);

    if (ADDITION_CONTAINER_TITLES[i] === `Top rated` && films[0].rating > 0) {
      additionContainerElementTitle.textContent = ADDITION_CONTAINER_TITLES[i];
      renderFilms(additionContainerElementFilmList, films);
    } else if (ADDITION_CONTAINER_TITLES[i] === `Most commented` && films[0].comments.length > 0) {
      additionContainerElementTitle.textContent = ADDITION_CONTAINER_TITLES[i];
      renderFilms(additionContainerElementFilmList, films);
    }
  }
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
  films.forEach((film) => {
    const filmController = new MovieController(container, onDataChange);
    filmController.render(film);
  });
};

export default class PageController {
  constructor(container, filters) {
    this._container = container;
    this._navigation = new Navigation(filters);
    this._sort = new Sort();
    this._contentBlock = new ContentBlock();
    this._moreButton = new MoreButton();
    this._noFilm = new NoFilm();
    this._showingFilmsCount = FILM_PAGE_COUNT;
    this._renderLoadMoreButton = this._renderLoadMoreButton.bind(this);
    this._films = [];
    this._renderSortFilms = this._renderSortFilms.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  render(films) {
    this._films = films;
    render(this._container, this._navigation, POSITION.AFTERBEGIN);
    render(this._container, this._sort, POSITION.BEFOREEND);
    render(this._container, this._contentBlock, POSITION.BEFOREEND);

    const filmContainerElement = this._container.querySelector(`.films`);
    const filmListContainerElement = this._container.querySelector(`.films-list__container`);

    const filmsSortByRating = getFilmsSortByRating(this._films, 0, FILM_COUNT_ADDITION);
    const filmsSortByCommentsCount = getFilmsSortByCommentsCount(this._films, 0, FILM_COUNT_ADDITION);

    if (this._films.length > 0) {
      renderFilms(filmListContainerElement, getSortedFilms(this._films, this._sort.getCurrentSortType(), 0, this._showingFilmsCount), this._onDataChange);
      this._renderLoadMoreButton();
      renderAdditionBlocks(filmContainerElement, filmsSortByRating, filmsSortByCommentsCount);
      this._renderSortFilms();
    } else {
      filmListContainerElement.remove();
      render(filmContainerElement.querySelector(`.films-list`), this._noFilm, POSITION.BEFOREEND);
    }
  }

  _renderLoadMoreButton() {
    const filmListContainerElement = this._container.querySelector(`.films-list__container`);
    render(filmListContainerElement, this._moreButton, POSITION.AFTEREND);
    this._moreButton.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount = this._showingFilmsCount + FILM_PAGE_COUNT;

      const sortedFilms = getSortedFilms(this._films, this._sort.getCurrentSortType(), prevFilmsCount, this._showingFilmsCount);
      renderFilms(filmListContainerElement, sortedFilms, this._onDataChange);

      if (this._showingFilmsCount >= this._films.length) {
        remove(this._moreButton);
      }
    });
  };

  _renderSortFilms() {
    this._sort.setSortTypeChangeHandler((sortType) => {
      const filmListContainerElement = this._container.querySelector(`.films-list__container`);
      this._showingFilmsCount = FILM_PAGE_COUNT;
      filmListContainerElement.innerHTML = ``;
      remove(this._moreButton);
      renderFilms(filmListContainerElement, getSortedFilms(this._films, sortType, 0, this._showingFilmsCount), this._onDataChange);
      this._renderLoadMoreButton();
    });
  }

  _onDataChange(filmController, oldData, newData) {
    const index = this._films.findIndex((film) => film === oldData);

    if (index === -1) {
      return;
    }

    this._films[index] = newData;

    filmController.render(newData);
    remove(this._navigation);
    this._navigation = new Navigation(generateFilters(this._films));
    render(this._container, this._navigation, POSITION.AFTERBEGIN);
  }
}
