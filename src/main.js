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
import {render, POSITION, sortByDesc, createElement} from "./util";

const FILM_COUNT = 22;
const FILM_PAGE_COUNT = 5;
const FILM_COUNT_ADDITION = 2;
const mainContainerElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);
const ADDITION_CONTAINER_TITLES = [`Top rated`, `Most commented`];
const NO_FILMS_TEXT = `There are no movies in our database`;

const films = generateFilms(FILM_COUNT);
const filters = generateFilters(films);

const getNoFilmsText = () => {
  return `<h2 class="films-list__title">${NO_FILMS_TEXT}</h2>`;
};

const renderFilm = (filmContainerElement, film) => {
  const filmElement = new FilmCard(film).getElement();
  const filmElementPoster = filmElement.querySelector(`.film-card__poster`);
  const filmElementTitle = filmElement.querySelector(`.film-card__title`);
  const filmElementCommentsCount = filmElement.querySelector(`.film-card__comments`);

  const filmDetails = new FilmDetails(film);
  const filmDetailsElement = filmDetails.getElement();
  const filmDetailselementClose = filmDetailsElement.querySelector(`.film-details__close-btn`);

  const closeFilmDetails = () => {
    footerElement.removeChild(filmDetailsElement);
  };

  const onFilmElementClick = () => {
    footerElement.appendChild(filmDetailsElement);
  };

  const onCloseButtonClick = () => {
    filmDetailselementClose.removeEventListener(`click`, onCloseButtonClick);
    document.removeEventListener(`keydown`, onEscapeKeyPress);
    closeFilmDetails();
  };

  const onEscapeKeyPress = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      closeFilmDetails();
    }
  };

  render(filmContainerElement, filmElement, POSITION.BEFOREEND);

  filmElementPoster.addEventListener(`click`, onFilmElementClick);
  filmElementTitle.addEventListener(`click`, onFilmElementClick);
  filmElementCommentsCount.addEventListener(`click`, onFilmElementClick);
  filmDetailselementClose.addEventListener(`click`, onCloseButtonClick);
  document.addEventListener(`keydown`, onEscapeKeyPress);
};

const renderAdditionBlocks = (filmContainerElement, filmsSortByRating, filmsSortByCommentsCount) => {
  for (let i = 0; i < FILM_COUNT_ADDITION; i++) {
    render(filmContainerElement, new AdditionBlock().getElement(), POSITION.BEFOREEND);
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

render(headerElement, new Profile().getElement(), POSITION.BEFOREEND);
render(mainContainerElement, new Navigation(filters).getElement(), POSITION.AFTERBEGIN);
render(mainContainerElement, new Sort().getElement(), POSITION.BEFOREEND);
render(mainContainerElement, new ContentBlock().getElement(), POSITION.BEFOREEND);

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
  const showMoreButtonElement = showMoreButton.getElement();

  render(filmListContainerElement, showMoreButtonElement, POSITION.AFTEREND);
  renderAdditionBlocks(filmContainerElement, filmsSortByRating, filmsSortByCommentsCount);

  showMoreButtonElement.addEventListener(`click`, () => {
    const prevFilmsCount = showingFilmsCount;
    showingFilmsCount = showingFilmsCount + FILM_PAGE_COUNT;

    films.slice(prevFilmsCount, showingFilmsCount).forEach((film) => {
      renderFilm(filmListContainerElement, film, POSITION.BEFOREEND);
    });

    if (showingFilmsCount >= films.length) {
      showMoreButtonElement.remove();
      showMoreButton.removeElement();
    }
  });
} else {
  filmListContainerElement.remove();
  render(filmContainerElement.querySelector(`.films-list`), createElement(getNoFilmsText()), POSITION.BEFOREEND);
}

footerElement.querySelector(`.footer__statistics`).textContent = `${films.length} movies inside`;
