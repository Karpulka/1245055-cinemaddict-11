export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setFilms(items) {
    const store = this.getItems();
    const newStore = {films: items, comments: store.comments ? [...store.comments] : []};

    this._storage.setItem(this._storeKey, JSON.stringify(newStore));
  }

  setFilm(key, value) {
    const store = this.getItems();
    store.films[key] = value;

    this._storage.setItem(this._storeKey, JSON.stringify(store));
  }

  setComments(filmId, items) {
    const store = this.getItems();
    store.comments.push({[filmId]: items});
    const newStore = {films: store.films, comments: store.comments};

    this._storage.setItem(this._storeKey, JSON.stringify(newStore));
  }

  setComment(key, value) {
    const store = this.getItems();
    const comments = Object.assign({}, store.comments, store.comments[key] = value);

    this._storage.setItem(this._storeKey, JSON.stringify(Object.assign({}, store, comments)));
  }

  removeComment(key) {
    const store = this.getItems();
    let filmIndex = -1;

    for (let [filmId, comments] of Object.entries(store.comments)) {
      const commentIndex = Object.values(comments).findIndex((comment) => {
        return comment.id === key;
      });
      if (commentIndex > -1) {
        filmIndex = filmId;
      }
    }

    if (filmIndex > -1) {
      delete store.comments[filmIndex][key];
    }

    this._storage.setItem(this._storeKey, JSON.stringify(store));
  }
}
