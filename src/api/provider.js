import FilmModel from "../models/film";
import CommentModel from "../models/comment";

const createStoreStructure = (items) => {
  return items.reduce((concatItems, current) => {
    return Object.assign({}, concatItems, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  isOnline() {
    return window.navigator.onLine;
  }

  getFilms() {
    if (this.isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map((film) => film.toRAW()));
          this._store.setFilms(items);

          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems().films);

    return Promise.resolve(FilmModel.parseFilms(storeFilms));
  }

  loadComments(filmId) {
    if (this.isOnline()) {
      return this._api.loadComments(filmId)
        .then((comments) => {
          const items = createStoreStructure(comments);

          this._store.setComments(filmId, items);

          return comments;
        });
    }

    const storeComments = Object.values(this._store.getItems().comments);

    return Promise.resolve(CommentModel.parseComments(Object.values(storeComments[filmId])));
  }

  updateFilm(id, film) {
    if (this.isOnline()) {
      return this._api.updateFilm(id, film)
        .then((newFilm) => {
          this._store.setFilm(newFilm.id, newFilm.toRAW());

          return newFilm;
        });
    }

    const localFilm = FilmModel.clone(Object.assign(film, {id}));

    this._store.setFilm(id, localFilm.toRAW());

    return Promise.resolve(localFilm);
  }

  deleteComment(id) {
    if (this.isOnline()) {
      return this._api.deleteComment(id)
        .then(() => {
          this._store.removeComment(id);

          return Promise.resolve();
        });
    }

    return Promise.resolve();
  }

  addComment(filmId, data) {
    if (this.isOnline()) {
      return this._api.addComment(filmId, data)
        .then((comments) => {
          this._store.setComment(filmId, comments);

          return comments;
        });
    }

    return Promise.resolve();
  }

  sync() {
    if (this.isOnline()) {
      const storeFilms = Object.values(this._store.getItems().films);

      return this._api.sync(storeFilms)
        .then((response) => {
          const items = createStoreStructure(response.updated.map((film) => film.toRAW()));

          this._store.setFilms(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
