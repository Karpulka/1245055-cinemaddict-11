import {POSITION, remove, render} from "../utils/render";
import MoreButton from "../components/show-more-button";
import FilmModel from "../models/film";
import NoFilm from "../components/no-film";
import Sort from "../components/sort";
import ContentBlock from "../components/content-block";
import {renderFilms} from "./movie";
import FilterController, {FilterTypes} from "./filter";
import AdditionBlockController from "./addition-block";
import Statistic from "../components/statistic";
import {parseFilmForUpdate} from "../utils/film";
import Profile from "../components/profile";

const FILM_PAGE_COUNT = 5;

export default class PageController {
  constructor(container, moviesModel, commentsModel, api) {
    this._container = container;
    this._api = api;
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
    this._onAdditionBlockChange = this._onAdditionBlockChange.bind(this);
    this._moviesModel.setFilterChangeHandlers(this._onFilterChange);
    this._moviesModel.setAdditionBlockChangeHandler(this._onAdditionBlockChange);
    this._filmListContainerElement = null;
    this._filmContainerElement = null;
    this._additionBlockController = null;
    this._profileComponent = new Profile(this._moviesModel);
    this._statisticComponent = new Statistic(moviesModel, this._profileComponent);
    this._statisticComponent.hide();
  }

  render() {
    const headerElement = document.querySelector(`.header`);

    render(headerElement, this._profileComponent, POSITION.BEFOREEND);
    this._films = this._moviesModel.getFilms();
    this._filtersController.render();
    render(this._container, this._sort, POSITION.BEFOREEND);
    render(this._container, this._contentBlock, POSITION.BEFOREEND);

    this._filmContainerElement = this._container.querySelector(`.films`);
    this._filmListContainerElement = this._container.querySelector(`.films-list__container`);

    if (this._films.length > 0) {
      const showingFilms = renderFilms(this._filmListContainerElement, this._moviesModel.getSortedFilms(this._sort.getCurrentSortType(), 0, this._showingFilmsCount), this._onDataChange, this._commentsModel, this._api);
      this._showingFilms = this._showingFilms.concat(showingFilms);
      this._renderLoadMoreButton();
      this._additionBlockController = new AdditionBlockController(this._filmContainerElement, this._moviesModel, this._onDataChange, this._commentsModel, this._api);
      this._additionBlockController.render();
      this._filmsInAdditionsBlocks = this._additionBlockController.showingFilms;
      this._showingFilms = this._showingFilms.concat(this._filmsInAdditionsBlocks);
      this._renderSortFilms();
    } else {
      this._filmListContainerElement.remove();
      render(this._filmContainerElement.querySelector(`.films-list`), this._noFilm, POSITION.BEFOREEND);
    }

    render(this._container, this._statisticComponent, POSITION.BEFOREEND);
  }

  _show() {
    if (this._filmContainerElement.classList.contains(`visually-hidden`)) {
      this._filmContainerElement.classList.remove(`visually-hidden`);
    }
  }

  _hide() {
    if (!this._filmContainerElement.classList.contains(`visually-hidden`)) {
      this._filmContainerElement.classList.add(`visually-hidden`);
    }
  }

  _renderLoadMoreButton() {
    if (this._filtersController.getCurrentFilterTypeFilmsCount() <= FILM_PAGE_COUNT || this._showingFilmsCount === this._filtersController.getCurrentFilterTypeFilmsCount()) {
      return;
    }
    render(this._filmListContainerElement, this._moreButton, POSITION.AFTEREND);
    this._moreButton.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount = this._showingFilmsCount + FILM_PAGE_COUNT;

      const sortedFilms = this._moviesModel.getSortedFilms(this._sort.getCurrentSortType(), prevFilmsCount, this._showingFilmsCount);
      const showingFilms = renderFilms(this._filmListContainerElement, sortedFilms, this._onDataChange, this._commentsModel, this._api);
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
      const showingFilms = renderFilms(this._filmListContainerElement, this._moviesModel.getSortedFilms(sortType, 0, this._showingFilmsCount), this._onDataChange, this._commentsModel, this._api);
      this._showingFilms = [].concat(showingFilms);
      this._showingFilms = this._showingFilms.concat(this._filmsInAdditionsBlocks);
      this._renderLoadMoreButton();
    });
  }

  _onDataChange(oldFilm, newFilm) {
    if (newFilm) {
      this._api.updateFilm(oldFilm.id, new FilmModel(parseFilmForUpdate(newFilm)))
        .then((filmModel) => {
          this._updateFilmsAfterRequests(filmModel);
        });
    } else {
      this._api.getFilms()
        .then((filmModels) => {
          const filmModel = filmModels.find((film) => film.id === oldFilm.id);
          this._updateFilmsAfterRequests(filmModel, true);
        });
    }
  }

  _updateFilmsAfterRequests(film, isCommentDelete = false) {
    this._moviesModel.updateData(film.id, film);

    const filmControllers = this._showingFilms.filter((filmController) => filmController.film.id === film.id);
    filmControllers.forEach((filmController) => filmController.render(film));

    this._profileComponent.rerender();
    this._filtersController.render();
    this._statisticComponent.rerender();
    if (!isCommentDelete) {
      this._updateFilms(false);
    }
    this._statisticComponent.hide();
  }

  _onAdditionBlockChange() {
    this._filmsInAdditionsBlocks = this._additionBlockController.showingFilms;
    this._showingFilms = this._showingFilms.concat(this._filmsInAdditionsBlocks);
  }

  _onViewChange() {
    this._showingFilms.forEach((filmController) => filmController.setDefaultView());
  }

  _onFilterChange() {
    this._sort.setDefaultSortType();
    this._updateFilms();
  }

  _updateFilms(resetShowingFilmsCount = true) {
    if (this._filtersController.getCurrentFilterType() === FilterTypes.STATISTIC) {
      this._sort.hide();
      this._hide();
      this._statisticComponent.show();
    } else {
      this._removeFilms();
      this._films = this._moviesModel.getFilms();
      const showingFilmsCount = resetShowingFilmsCount ? FILM_PAGE_COUNT : this._showingFilmsCount;
      const filmsForShow = this._moviesModel.getSortedFilms(this._sort.getCurrentSortType(), 0, showingFilmsCount);

      if (filmsForShow.length > 0) {
        const showingFilms = renderFilms(this._filmListContainerElement, filmsForShow, this._onDataChange, this._commentsModel, this._api);
        this._showingFilms = this._showingFilms.concat(showingFilms);
        this._showingFilmsCount = showingFilms.length;
        this._renderLoadMoreButton();
      } else {
        render(this._filmContainerElement.querySelector(`.films-list`), this._noFilm, POSITION.BEFOREEND);
      }
      this._statisticComponent.hide();
      this._sort.show();
      this._show();
    }
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
