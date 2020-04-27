import {createElement} from "../util";

const createShowMoreTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class MoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createShowMoreTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
