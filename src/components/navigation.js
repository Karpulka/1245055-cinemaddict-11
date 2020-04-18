const renderFilters = (filters) => {
  return filters
    .map((elm) => {
      return `<a href="${elm.link}" class="main-navigation__item">${elm.name}${elm.count ? ` <span class="main-navigation__item-count">${elm.count}</span>` : ``}</a>`;
    }).join(`\n`);
};

export const createNavigationTemplate = (filters) => {
  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              ${renderFilters(filters)}
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>
        
          <ul class="sort">
            <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
            <li><a href="#" class="sort__button">Sort by date</a></li>
            <li><a href="#" class="sort__button">Sort by rating</a></li>
          </ul>`;
};
