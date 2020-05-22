import API from "./api/api";
import Store from "./api/store";
import Provider from "./api/provider";
import Profile from "./components/profile";
import {render, POSITION} from "./utils/render";
import PageController from "./controllers/page";
import Movies from "./models/movies";
import Comments from "./models/comments";

const AUTHORIZATION = `Basic 166HFxc57vbnhh15khFvbn5gvFHDv2=`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinema-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
let films = [];

const renderPage = (movies = [], comments = []) => {
  const mainContainerElement = document.querySelector(`.main`);
  const footerElement = document.querySelector(`.footer`);

  const moviesModel = new Movies(movies);
  const commentsModel = new Comments(comments);

  new PageController(mainContainerElement, moviesModel, commentsModel, apiWithProvider).render();
  footerElement.querySelector(`.footer__statistics`).textContent = `${films.length} movies inside`;
};

const headerElement = document.querySelector(`.header`);
render(headerElement, new Profile(), POSITION.BEFOREEND);

apiWithProvider.getFilms()
  .then((loadedFilms) => {
    films = loadedFilms;
    return films.map((film) => apiWithProvider.loadComments(film.id))
  })
  .then((commentPromises) => Promise.all(commentPromises))
  .then((comments) => {
    const allComments = comments.reduce((concatComments, item) => concatComments.concat(item), []);

    renderPage(films, allComments);
  })
  .catch(() => {
    renderPage();
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
    }).catch(() => {
    // Действие, в случае ошибки при регистрации ServiceWorker
  });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
