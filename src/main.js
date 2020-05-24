import API from "./api/api";
import Store from "./api/store";
import Provider from "./api/provider";
import PageController from "./controllers/page";
import Load from "./components/load";
import Movies from "./models/movies";
import Comments from "./models/comments";
import {POSITION, remove, render} from "./utils/render";

const AUTHORIZATION = `Basic 166HFxc57vbnhh15khFvbn5gvFHDv2=`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinema-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const mainContainerElement = document.querySelector(`.main`);

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const loadComponent = new Load();
let films = [];

const renderPage = (movies = [], comments = []) => {
  const footerElement = document.querySelector(`.footer`);

  const moviesModel = new Movies(movies);
  const commentsModel = new Comments(comments);

  new PageController(mainContainerElement, moviesModel, commentsModel, apiWithProvider).render();
  footerElement.querySelector(`.footer__statistics`).textContent = `${films.length} movies inside`;
};

render(mainContainerElement, loadComponent, POSITION.BEFOREEND);

apiWithProvider.getFilms()
  .then((loadedFilms) => {
    films = loadedFilms;
    return films.map((film) => apiWithProvider.loadComments(film.id));
  })
  .then((commentPromises) => Promise.all(commentPromises))
  .then((comments) => {
    let allComments = [];
    if (apiWithProvider.isOnline()) {
      allComments = comments.reduce((concatComments, item) => concatComments.concat(item), []);
    } else {
      allComments = comments;
    }

    remove(loadComponent);
    renderPage(films, allComments);
  })
  .catch(() => {
    remove(loadComponent);
    renderPage();
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {})
    .catch(() => {});
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
