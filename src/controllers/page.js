import FilmCard from "../components/film-card";
import FilmDetails from "../components/film-details";
import {POSITION, remove, render, toggleElement} from "../utils/render";
import AdditionBlock from "../components/addition-block";
import {sortByDesc} from "../utils/common";
import MoreButton from "../components/show-more-button";
import NoFilm from "../components/no-film";
import Navigation from "../components/navigation";
import Sort from "../components/sort";
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
      films.slice(0, FILM_COUNT_ADDITION).forEach((film) => {
        renderFilm(additionContainerElement.querySelector(`.films-list__container`), film, POSITION.BEFOREEND);
      });
    } else if (ADDITION_CONTAINER_TITLES[i] === `Most commented` && films[0].comments.length > 0) {
      additionContainerElement.querySelector(`.films-list__title`).textContent = ADDITION_CONTAINER_TITLES[i];
      films.slice(0, FILM_COUNT_ADDITION).forEach((film) => {
        renderFilm(additionContainerElement.querySelector(`.films-list__container`), film, POSITION.BEFOREEND);
      });
    }
  }
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

    const filmsSortByRating = films.slice().sort((a, b) => {
      return sortByDesc(a.rating, b.rating);
    });

    const filmsSortByCommentsCount = films.slice().sort((a, b) => {
      return sortByDesc(a.comments.length, b.comments.length);
    });

    let showingFilmsCount = FILM_PAGE_COUNT;

    if (films.length > 0) {
      films.slice(0, showingFilmsCount).forEach((film) => {
        renderFilm(filmListContainerElement, film);
      });

      const showMoreButton = this._moreButton;

      render(filmListContainerElement, showMoreButton, POSITION.AFTEREND);
      renderAdditionBlocks(filmContainerElement, filmsSortByRating, filmsSortByCommentsCount);

      showMoreButton.setClickHandler(() => {
        const prevFilmsCount = showingFilmsCount;
        showingFilmsCount = showingFilmsCount + FILM_PAGE_COUNT;

        films.slice(prevFilmsCount, showingFilmsCount).forEach((film) => {
          renderFilm(filmListContainerElement, film, POSITION.BEFOREEND);
        });

        if (showingFilmsCount >= films.length) {
          remove(showMoreButton);
        }
      });
    } else {
      filmListContainerElement.remove();
      render(filmContainerElement.querySelector(`.films-list`), this._noFilm, POSITION.BEFOREEND);
    }
  }
}
