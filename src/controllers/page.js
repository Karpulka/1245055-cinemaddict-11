import {POSITION, remove, render} from "../utils/render";
import MoreButton from "../components/show-more-button";
import NoFilm from "../components/no-film";
import Sort from "../components/sort";
import ContentBlock from "../components/content-block";
import {renderFilms} from "./movie";
import FilterController from "./filter";
import AdditionBlockController from "./addition-block";

const FILM_PAGE_COUNT = 5;

export default class PageController {
  constructor(container, moviesModel, commentsModel) {
    this._container = container;
    this._sort = new Sort();
    this._contentBlock = new ContentBlock();
    this._moreButton = new MoreButton();
    this._noFilm = new NoFilm();
    this._showingFilmsCount = FILM_PAGE_COUNT;
    this._renderLoadMoreButton = this._renderLoadMoreButton.bind(this);
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._films = [];
    this._renderSortFilms = this._renderSortFilms.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._showingFilms = [];
    this._filmsInAdditionsBlocks = [];
    this._onViewChange = this._onViewChange.bind(this);
    this._filtersController = new FilterController(this._container, moviesModel);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._updateFilms = this._updateFilms.bind(this);
    this._removeFilms = this._removeFilms.bind(this);
    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
    this._filmListContainerElement = null;
    this._filmContainerElement = null;
    this._additionBlockController = null;
  }

  render() {
    this._films = this._moviesModel.getFilms();
    this._filtersController.render();
    render(this._container, this._sort, POSITION.BEFOREEND);
    render(this._container, this._contentBlock, POSITION.BEFOREEND);

    this._filmContainerElement = this._container.querySelector(`.films`);
    this._filmListContainerElement = this._container.querySelector(`.films-list__container`);

    if (this._films.length > 0) {
      const showingFilms = renderFilms(this._filmListContainerElement, this._moviesModel.getSortedFilms(this._sort.getCurrentSortType(), 0, this._showingFilmsCount), this._onDataChange, this._commentsModel);
      this._showingFilms = this._showingFilms.concat(showingFilms);
      this._renderLoadMoreButton();
      this._additionBlockController = new AdditionBlockController(this._filmContainerElement, this._moviesModel, this._onDataChange, this._commentsModel);
      this._additionBlockController.render();
      this._filmsInAdditionsBlocks = this._additionBlockController.showingFilms;
      this._showingFilms = this._showingFilms.concat(this._filmsInAdditionsBlocks);
      this._renderSortFilms();
    } else {
      this._filmListContainerElement.remove();
      render(this._filmContainerElement.querySelector(`.films-list`), this._noFilm, POSITION.BEFOREEND);
    }
  }

  _renderLoadMoreButton() {
    render(this._filmListContainerElement, this._moreButton, POSITION.AFTEREND);
    this._moreButton.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount = this._showingFilmsCount + FILM_PAGE_COUNT;

      const sortedFilms = this._moviesModel.getSortedFilms(this._sort.getCurrentSortType(), prevFilmsCount, this._showingFilmsCount);
      const showingFilms = renderFilms(this._filmListContainerElement, sortedFilms, this._onDataChange, this._commentsModel);
      this._showingFilms = this._showingFilms.concat(showingFilms);

      if (this._showingFilmsCount >= this._films.length) {
        remove(this._moreButton);
      }
    });
  }

  _renderSortFilms() {
    this._sort.setSortTypeChangeHandler((sortType) => {
      this._showingFilmsCount = FILM_PAGE_COUNT;
      this._filmListContainerElement.innerHTML = ``;
      remove(this._moreButton);
      const showingFilms = renderFilms(this._filmListContainerElement, this._moviesModel.getSortedFilms(sortType, 0, this._showingFilmsCount), this._onDataChange, this._commentsModel);
      this._showingFilms = [].concat(showingFilms);
      this._showingFilms = this._showingFilms.concat(this._filmsInAdditionsBlocks);
      this._renderLoadMoreButton();
    });
  }

  _onDataChange(oldData, newData) {
    this._moviesModel.updateData(oldData.id, newData);

    const filmControllers = this._showingFilms.filter((filmController) => filmController.film === oldData);

    filmControllers.forEach((filmController) => filmController.render(newData));
    this._filtersController.render();
  }

  _onViewChange() {
    this._showingFilms.forEach((filmController) => filmController.setDefaultView());
  }

  _onFilterChange() {
    this._updateFilms();
  }

  _updateFilms() {
    this._removeFilms();
    this._films = this._moviesModel.getFilms();
    this._sort.setDefaultSortType();
    const showingFilms = renderFilms(this._filmListContainerElement, this._moviesModel.getSortedFilms(this._sort.getCurrentSortType(), 0, FILM_PAGE_COUNT), this._onDataChange, this._commentsModel);
    this._showingFilms = this._showingFilms.concat(showingFilms);
    this._showingFilmsCount = showingFilms.length;
    this._renderLoadMoreButton();
  }

  _removeFilms() {
    this._showingFilms.forEach((filmController) => {
      if (!this._filmsInAdditionsBlocks.includes(filmController)) {
        filmController.destroy();
      }
    });
    this._showingFilms = [].concat(this._filmsInAdditionsBlocks);
    remove(this._moreButton);
  }
}
