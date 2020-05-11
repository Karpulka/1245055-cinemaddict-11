export default class Movies {
  constructor(films) {
    this._films = films;
  }

  getAllFilms() {
    return this._films;
  }
}
