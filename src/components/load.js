import AbstractComponent from "./abstract-component";

const LOAD_TEXT = `Loading...`;

const getLoadText = () => {
  return `<h2 class="films-list__title">${LOAD_TEXT}</h2>`;
};

export default class Load extends AbstractComponent {
  getTemplate() {
    return getLoadText();
  }
}
