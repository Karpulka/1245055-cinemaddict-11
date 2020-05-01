import FilmCard from "../components/film-card";
import FilmDetails from "../components/film-details";
import {POSITION, remove, render, toggleElement} from "../utils/render";
import AdditionBlock from "../components/addition-block";
import {sortByDesc} from "../utils/common";
import MoreButton from "../components/show-more-button";
import NoFilm from "../components/no-film";
import Navigation from "../components/navigation";
import Sort, {SORT_TYPE} from "../components/sort";
import ContentBlock from "../components/content-block";

const FILM_COUNT_ADDITION = 2;
const FILM_PAGE_COUNT = 5;
const ADDITION_CONTAINER_TITLES = [`Top rated`, `Most commented`];

const renderFilm = (filmContainerElement, film) => {
  const filmComponent = new FilmCard(film);
  const filmDetailsComponent = new FilmDetails(film);
  const footerElement = document.querySelector(`.footer`);

  const closeFilmDetails = () => {
    toggleElement(footerElement, filmDetailsComponent, `hide`);
    document.removeEventListener(`keydown`, onEscapeKeyPress);
  };

  const onFilmElementClick = () => {
    toggleElement(footerElement, filmDetailsComponent, `show`);
    document.addEventListener(`keydown`, onEscapeKeyPress);
  };

  const onCloseButtonClick = () => {
    filmDetailsComponent.removeCloseClickHandler(onCloseButtonClick);
    closeFilmDetails();
  };

  const onEscapeKeyPress = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      closeFilmDetails();
    }
  };

  render(filmContainerElement, filmComponent, POSITION.BEFOREEND);

  filmComponent.setSelectorClickHandler(`.film-card__poster`, onFilmElementClick);
  filmComponent.setSelectorClickHandler(`.film-card__title`, onFilmElementClick);
  filmComponent.setSelectorClickHandler(`.film-card__comments`, onFilmElementClick);
  filmDetailsComponent.setCloseClickHandler(onCloseButtonClick);
};

const renderAdditionBlocks = (filmContainerElement, filmsSortByRating, filmsSortByCommentsCount) => {
  for (let i = 0; i < FILM_COUNT_ADDITION; i++) {
    render(filmContainerElement, new AdditionBlock(), POSITION.BEFOREEND);
    const extraContainerElements = filmContainerElement.querySelectorAll(`.films-list--extra`);
    const additionContainerElement = extraContainerElements[extraContainerElements.length - 1];
    const films = ADDITION_CONTAINER_TITLES[i] === `Top rated` ? filmsSortByRating : filmsSortByCommentsCount;

    if (ADDITION_CONTAINER_TITLES[i] === `Top rated` && films[0].rating > 0) {
      additionContainerElement.querySelector(`.films-list__title`).textContent = ADDITION_CONTAINER_TITLES[i];
      films.forEach((film) => {
        renderFilm(additionContainerElement.querySelector(`.films-list__container`), film, POSITION.BEFOREEND);
      });
    } else if (ADDITION_CONTAINER_TITLES[i] === `Most commented` && films[0].comments.length > 0) {
      additionContainerElement.querySelector(`.films-list__title`).textContent = ADDITION_CONTAINER_TITLES[i];
      films.forEach((film) => {
        renderFilm(additionContainerElement.querySelector(`.films-list__container`), film, POSITION.BEFOREEND);
      });
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

const renderFilms = (container, films) => {
  films.forEach((film) => {
    renderFilm(container, film, POSITION.BEFOREEND);
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
  }

  render(films) {
    render(this._container, this._navigation, POSITION.AFTERBEGIN);
    render(this._container, this._sort, POSITION.BEFOREEND);
    render(this._container, this._contentBlock, POSITION.BEFOREEND);

    const filmContainerElement = this._container.querySelector(`.films`);
    const filmListContainerElement = this._container.querySelector(`.films-list__container`);

    const filmsSortByRating = getFilmsSortByRating(films, 0, FILM_COUNT_ADDITION);
    const filmsSortByCommentsCount = getFilmsSortByCommentsCount(films, 0, FILM_COUNT_ADDITION);

    const renderLoadMoreButton = (showingFilmsCount) => {
      render(filmListContainerElement, this._moreButton, POSITION.AFTEREND);
      this._moreButton.setClickHandler(() => {
        const prevFilmsCount = showingFilmsCount;
        showingFilmsCount = showingFilmsCount + FILM_PAGE_COUNT;

        const sortedFilms = getSortedFilms(films, this._sort.getCurrentSortType(), prevFilmsCount, showingFilmsCount);
        renderFilms(filmListContainerElement, sortedFilms);

        if (showingFilmsCount >= films.length) {
          remove(this._moreButton);
        }
      });
    };

    let showingFilmsCount = FILM_PAGE_COUNT;

    if (films.length > 0) {
      renderFilms(filmListContainerElement, getSortedFilms(films, this._sort.getCurrentSortType(), 0, showingFilmsCount));
      renderLoadMoreButton(showingFilmsCount);
      renderAdditionBlocks(filmContainerElement, filmsSortByRating, filmsSortByCommentsCount);

      this._sort.setSortTypeChangeHandler((sortType) => {
        showingFilmsCount = FILM_PAGE_COUNT;
        filmListContainerElement.innerHTML = ``;
        remove(this._moreButton);
        renderFilms(filmListContainerElement, getSortedFilms(films, sortType, 0, showingFilmsCount));
        renderLoadMoreButton(showingFilmsCount);
      });
    } else {
      filmListContainerElement.remove();
      render(filmContainerElement.querySelector(`.films-list`), this._noFilm, POSITION.BEFOREEND);
    }
  }
}
