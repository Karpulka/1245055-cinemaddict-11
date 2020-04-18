import {createProfileTemplate} from "./components/profile";
import {createNavigationTemplate} from "./components/navigation";
import {createFilmCardTemplate} from "./components/film-card";
import {createContentBlockTemplate} from "./components/content-block";
import {createFilmDetailsTemplate} from "./components/film-details";
import {createBlockAdditionTemplate} from "./components/addition-block";
import {createShowMoreTemplate} from "./components/show-more-button";
import {generateFilms} from "./mock/film";
import {getRandomItemFromArray} from "./util";

const FILM_COUNT = 20;
const FILM_PAGE_COUNT = 5;
const FILM_COUNT_ADDITION = 2;
const mainContainerElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);
const ADDITION_CONTAINER_TITLES = [`Top rated`, `Most commented`];
const NO_FILMS_TEXT = `There are no movies in our database`;

const getNoFilmsText = () => {
  return `<p>${NO_FILMS_TEXT}</p>`;
};

const render = (container, template, position) => {
  container.insertAdjacentHTML(position, template);
};

render(headerElement, createProfileTemplate(), `beforeend`);
render(mainContainerElement, createNavigationTemplate(), `afterbegin`);
render(mainContainerElement, createContentBlockTemplate(), `beforeend`);

const filmContainerElement = mainContainerElement.querySelector(`.films`);
const filmListContainerElement = mainContainerElement.querySelector(`.films-list__container`);
const films = generateFilms(FILM_COUNT);
let showingFilmsCount = FILM_PAGE_COUNT;

if (films.length > 0) {
  for (let i = 0; i < showingFilmsCount; i++) {
    render(filmListContainerElement, createFilmCardTemplate(films[i]), `beforeend`);
  }

  render(filmListContainerElement, createShowMoreTemplate(), `afterend`);

  for (let i = 0; i < FILM_COUNT_ADDITION; i++) {
    render(filmContainerElement, createBlockAdditionTemplate(), `beforeend`);
    const extraContainerElements = filmContainerElement.querySelectorAll(`.films-list--extra`);
    const additionContainerElement = extraContainerElements[extraContainerElements.length - 1];
    additionContainerElement.querySelector(`.films-list__title`).textContent = ADDITION_CONTAINER_TITLES[i];

    for (let j = 0; j < FILM_COUNT_ADDITION; j++) {
      render(additionContainerElement.querySelector(`.films-list__container`), createFilmCardTemplate(getRandomItemFromArray(films)), `beforeend`);
    }
  }

  render(footerElement, createFilmDetailsTemplate(films[0]), `afterend`);
  document.querySelector(`.film-details`).classList.add(`visually-hidden`);

  const showMoreButton = filmContainerElement.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, () => {
    const prevFilmsCount = showingFilmsCount;
    showingFilmsCount = showingFilmsCount + FILM_PAGE_COUNT;

    films.slice(prevFilmsCount, showingFilmsCount)
      .forEach((film) => render(filmListContainerElement, createFilmCardTemplate(film), `beforeend`));

    if (showingFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  });
} else {
  render(filmListContainerElement, getNoFilmsText(), `beforeend`);
}
