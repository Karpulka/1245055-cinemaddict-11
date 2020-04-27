import {createElement} from "../util";

const createBlockAdditionTemplate = () => {
  return `<section class="films-list--extra">
            <h2 class="films-list__title"></h2>      
            <div class="films-list__container">
            </div>
          </section>`;
};

export default class AdditionBlock {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createBlockAdditionTemplate();
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
