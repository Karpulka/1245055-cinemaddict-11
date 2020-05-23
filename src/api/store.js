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
    const newStore = {films: items, comments: store.comments ? store.comments : {}};

    this._storage.setItem(this._storeKey, JSON.stringify(newStore));
  }

  setFilm(key, value) {
    const store = this.getItems();
    store.films[key] = value;

    this._storage.setItem(this._storeKey, JSON.stringify(store));
  }

  setComments(items) {
    const store = this.getItems();
    const newStore = {films: store.films, comments: Object.assign(store.comments, items)};

    this._storage.setItem(this._storeKey, JSON.stringify(newStore));
  }

  setComment(key, value) {
    const store = this.getItems();
    const comments = Object.assign(store.comments, {[key]: value});

    this._storage.setItem(this._storeKey, JSON.stringify(Object.assign({}, store, comments)));
  }

  removeComment(key) {
    const store = this.getItems();

    delete store.comments[key];

    this._storage.setItem(this._storeKey, JSON.stringify(store));
  }
}
