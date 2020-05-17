import API from "./api";
import Profile from "./components/profile";
import {render, POSITION} from "./utils/render";
import PageController from "./controllers/page";
import Movies from "./models/movies";
import Comments from "./models/comments";

const AUTHORIZATION = `Basic 15GHFxc57vbnhh1fhFvbn5gvFHDv2=`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);
let films = [];

const renderPage = (movies = [], comments = []) => {
  const mainContainerElement = document.querySelector(`.main`);
  const footerElement = document.querySelector(`.footer`);

  const moviesModel = new Movies(movies);
  const commentsModel = new Comments(comments);

  new PageController(mainContainerElement, moviesModel, commentsModel).render();
  footerElement.querySelector(`.footer__statistics`).textContent = `${films.length} movies inside`;
};

const headerElement = document.querySelector(`.header`);
render(headerElement, new Profile(), POSITION.BEFOREEND);

api.getFilms()
  .then((loadedFilms) => {
    films = loadedFilms;
    return films.map((film) => api.loadComments(film.id))
  })
  .then((commentPromises) => Promise.all(commentPromises))
  .then((comments) => {
    const allComments = comments.reduce((concatComments, item) => concatComments.concat(item), []);
    renderPage(films, allComments);
  })
  .catch((err) => {
    renderPage();
  })
