import {createElement} from "../util";

const renderFilters = (filters) => {
  return filters
    .map((filter) => {
      const {link, name, count} = filter;
      return `<a href="${link}" class="main-navigation__item">${name}${count !== undefined ? ` <span class="main-navigation__item-count">${count}</span>` : ``}</a>`;
    }).join(`\n`);
};

const createNavigationTemplate = (filters) => {
  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              ${renderFilters(filters)}
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

export default class Navigation {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createNavigationTemplate(this._filters);
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
