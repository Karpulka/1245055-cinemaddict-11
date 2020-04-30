import AbstractComponent from "./abstract-component";

const createShowMoreTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class MoreButton extends AbstractComponent {
  getTemplate() {
    return createShowMoreTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
