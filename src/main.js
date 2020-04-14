import {createProfileTemplate} from "./components/profile";
import {createNavigationTemplate} from "./components/navigation";
import {createFilmCardTemplate} from "./components/film-card";
import {createContentBlockTemplate} from "./components/content-block";
import {createFilmDetailsTemplate} from "./components/film-details";
import {createBlockAdditionTemplate} from "./components/addition-block";
import {createShowMoreTemplate} from "./components/show-more-button";
import {generateFilms} from "./mock/film";

const FILM_COUNT = 5;
const FILM_COUNT_ADDITION = 2;
const mainContainerElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);
const additionContainerTitles = [`Top rated`, `Most commented`];

const render = (container, template, position) => {
  container.insertAdjacentHTML(position, template);
};

render(headerElement, createProfileTemplate(), `beforeend`);
render(mainContainerElement, createNavigationTemplate(), `afterbegin`);
render(mainContainerElement, createContentBlockTemplate(), `beforeend`);

const filmContainerElement = mainContainerElement.querySelector(`.films`);
const filmListContainerElement = mainContainerElement.querySelector(`.films-list__container`);
const films = generateFilms(FILM_COUNT);
console.log(films);

for (let i = 0; i < FILM_COUNT; i++) {
  render(filmListContainerElement, createFilmCardTemplate(), `beforeend`);
}

render(filmListContainerElement, createShowMoreTemplate(), `afterend`);

for (let i = 0; i < FILM_COUNT_ADDITION; i++) {
  render(filmContainerElement, createBlockAdditionTemplate(), `beforeend`);
  const extraContainerElements = filmContainerElement.querySelectorAll(`.films-list--extra`);
  const additionContainerElement = extraContainerElements[extraContainerElements.length - 1];
  additionContainerElement.querySelector(`.films-list__title`).textContent = additionContainerTitles[i];

  for (let j = 0; j < FILM_COUNT_ADDITION; j++) {
    render(additionContainerElement.querySelector(`.films-list__container`), createFilmCardTemplate(), `beforeend`);
  }
}

render(footerElement, createFilmDetailsTemplate(), `afterend`);
document.querySelector(`.film-details`).classList.add(`visually-hidden`);
