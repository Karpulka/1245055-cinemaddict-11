import AbstractComponent from "./abstract-component";

const NO_FILMS_TEXT = `There are no movies in our database`;

const getNoFilmsText = () => {
  return `<h2 class="films-list__title">${NO_FILMS_TEXT}</h2>`;
};

export default class NoFilm extends AbstractComponent {
  getTemplate() {
    return getNoFilmsText();
  }
}
