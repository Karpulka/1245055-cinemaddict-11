import Profile from "./components/profile";
import Navigation from "./components/navigation";
import FilmCard from "./components/film-card";
import ContentBlock from "./components/content-block";
import FilmDetails from "./components/film-details";
import AdditionBlock from "./components/addition-block";
import MoreButton from "./components/show-more-button";
import {generateFilms} from "./mock/film";
import {generateFilters} from "./mock/filter";
import {render, POSITION, sortByDesc, createElement} from "./util";

const FILM_COUNT = 20;
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
  return `<p>${NO_FILMS_TEXT}</p>`;
};

const renderFilm = (filmContainerElement, film) => {
  const filmElement = new FilmCard(film).getElement();
  render(filmContainerElement, filmElement, POSITION.BEFOREEND);
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
  //render(footerElement, createFilmDetailsTemplate(films[0]), POSITION.AFTEREND);
  footerElement.querySelector(`.footer__statistics`).textContent = `${films.length} movies inside`;
  // document.querySelector(`.film-details`).classList.add(`visually-hidden`);

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
  render(filmListContainerElement, createElement(getNoFilmsText()), POSITION.BEFOREEND);
}
