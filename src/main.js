import Profile from "./components/profile";
import Navigation from "./components/navigation";
import FilmCard from "./components/film-card";
import ContentBlock from "./components/content-block";
import FilmDetails from "./components/film-details";
import AdditionBlock from "./components/addition-block";
import MoreButton from "./components/show-more-button";
import Sort from "./components/sort";
import {generateFilms} from "./mock/film";
import {generateFilters} from "./mock/filter";
import {sortByDesc} from "./utils/common";
import {render, POSITION, remove, toggleElement} from "./utils/render";
import NoFilm from "./components/no-film";

const FILM_COUNT = 22;
const FILM_PAGE_COUNT = 5;
const FILM_COUNT_ADDITION = 2;
const ADDITION_CONTAINER_TITLES = [`Top rated`, `Most commented`];
const mainContainerElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);

const films = generateFilms(FILM_COUNT);
const filters = generateFilters(films);

const renderFilm = (filmContainerElement, film) => {
  const filmComponent = new FilmCard(film);
  const filmDetailsComponent = new FilmDetails(film);

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

render(headerElement, new Profile(), POSITION.BEFOREEND);
render(mainContainerElement, new Navigation(filters), POSITION.AFTERBEGIN);
render(mainContainerElement, new Sort(), POSITION.BEFOREEND);
render(mainContainerElement, new ContentBlock(), POSITION.BEFOREEND);

const filmContainerElement = mainContainerElement.querySelector(`.films`);
const filmListContainerElement = mainContainerElement.querySelector(`.films-list__container`);

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

  const showMoreButton = new MoreButton();

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
  render(filmContainerElement.querySelector(`.films-list`), new NoFilm(), POSITION.BEFOREEND);
}

footerElement.querySelector(`.footer__statistics`).textContent = `${films.length} movies inside`;
