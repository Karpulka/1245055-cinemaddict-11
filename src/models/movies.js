export default class Movies {
  constructor(films) {
    this._films = films;
  }

  getAllFilms() {
    return this._films;
  }

  updateData(id, newFilm) {
    const index = this._films.findIndex((film) => film.id === id);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newFilm, this._films.slice(index + +1));
  }
}
