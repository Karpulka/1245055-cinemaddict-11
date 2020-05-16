import Profile from "./components/profile";
import {generateFilms, getAllComments} from "./mock/film";
import {render, POSITION} from "./utils/render";
import PageController from "./controllers/page";
import Movies from "./models/movies";
import Comments from "./models/comments";
import Staistic from "./components/statistic";

const FILM_COUNT = 22;
const mainContainerElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);

const films = generateFilms(FILM_COUNT);
const comments = getAllComments;
const moviesModel = new Movies(films);
const commentsModel = new Comments(comments);

render(headerElement, new Profile(), POSITION.BEFOREEND);

new PageController(mainContainerElement, moviesModel, commentsModel).render();

footerElement.querySelector(`.footer__statistics`).textContent = `${films.length} movies inside`;
