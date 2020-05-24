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

  isOnline() {
    return window.navigator.onLine;
  }

  loadComments(filmId) {
    if (this.isOnline()) {
      return this._api.loadComments(filmId)
        .then((comments) => {
          const items = createStoreStructure(comments);

          this._store.setComments(items);

          return comments;
        });
    }

    const storeComments = Object.values(this._store.getItems().comments);

    return Promise.resolve(CommentModel.parseComments(Object.values(storeComments)));
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

  addComment(filmId, comment) {
    if (this.isOnline()) {
      return this._api.addComment(filmId, comment)
        .then((comments) => {
          const addedComment = comments.find((commentItem) => Object.values(this._store.getItems().comments).findIndex((item) => item.id === commentItem.id) === -1);

          this._store.setComment(addedComment.id, addedComment);

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
