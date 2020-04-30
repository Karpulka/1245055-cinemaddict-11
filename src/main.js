import Profile from "./components/profile";
import {generateFilms} from "./mock/film";
import {generateFilters} from "./mock/filter";
import {render, POSITION} from "./utils/render";
import PageController from "./controllers/page";

const FILM_COUNT = 22;
const mainContainerElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);

const films = generateFilms(FILM_COUNT);
const filters = generateFilters(films);

render(headerElement, new Profile(), POSITION.BEFOREEND);

new PageController(mainContainerElement, filters).render(films);

footerElement.querySelector(`.footer__statistics`).textContent = `${films.length} movies inside`;
