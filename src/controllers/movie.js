import FilmCard from "../components/film-card";
import FilmDetails from "../components/film-details";
import {POSITION, render, toggleElement, replace, remove} from "../utils/render";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

const FormFilterTypes = {
  WATCHLIST: `watchlist`,
  WATCHED: `watched`,
  FAVORITE: `favorite`
};

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const renderFilms = (container, films, onDataChange, commentsModel) => {
  return films.map((film) => {
    const filmController = new MovieController(container, onDataChange, commentsModel);
    filmController.render(film);
    return filmController;
  });
};

export default class MovieController {
  constructor(container, onDataChange, commentsModel) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._mode = Mode.DEFAULT;
    this._filmComponent = null;
    this._filmDetailsComponent = null;
    this._footerElement = document.querySelector(`.footer`);
    this._setMovieHandlers = this._setMovieHandlers.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
    this._onFilmElementClick = this._onFilmElementClick.bind(this);
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onEscapeKeyPress = this._onEscapeKeyPress.bind(this);
    this._setAddToWatchlist = this._setAddToWatchlist.bind(this);
    this._setMarkAsWatched = this._setMarkAsWatched.bind(this);
    this._setMarkAsFavorite = this._setMarkAsFavorite.bind(this);
    this._film = null;
    this._filmCommentsModel = commentsModel;
    this._onSubmitForm = this._onSubmitForm.bind(this);
    this._onChangeFormFilterInput = this._onChangeFormFilterInput.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
  }

  get film() {
    return this._film;
  }

  render(film) {
    this._film = film;

    const oldFilmComponent = this._filmComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmCard(film);
    this._filmDetailsComponent = new FilmDetails(film, this._filmCommentsModel);

    this._filmComponent.setAddToWatchlistButtonClickHandler(this._setAddToWatchlist);
    this._filmComponent.setMarkAsWatchedButtonClickHandler(this._setMarkAsWatched);
    this._filmComponent.setMarkAsFavoriteButtonClickHandler(this._setMarkAsFavorite);

    if (oldFilmComponent && oldFilmDetailsComponent) {
      replace(oldFilmComponent, this._filmComponent);
      replace(oldFilmDetailsComponent, this._filmDetailsComponent);
    } else {
      render(this._container, this._filmComponent, POSITION.BEFOREEND);
    }
    this._setMovieHandlers();
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeFilmDetails();
    }
  }

  _setAddToWatchlist() {
    this._onDataChange(this._film, Object.assign({}, this._film, {
      isWatchlist: !this._film.isWatchlist
    }));
  }

  _setMarkAsWatched() {
    const watchingDate = this._film.isWatched ? null : new Date();
    this._onDataChange(this._film, Object.assign({}, this._film, {
      isWatched: !this._film.isWatched,
      watchingDate
    }));
  }

  _setMarkAsFavorite() {
    this._onDataChange(this._film, Object.assign({}, this._film, {
      isFavorites: !this._film.isFavorites
    }));
  }

  _setMovieHandlers() {
    this._filmComponent.setOpenCardClickHandler(this._onFilmElementClick);
    this._filmDetailsComponent.setCloseClickHandler(this._onCloseButtonClick);
    this._filmDetailsComponent.setFormElementsChangeHandler();
    this._filmDetailsComponent.setFormFilterInputChangeHandler(this._onChangeFormFilterInput);
    this._filmDetailsComponent.setDeleteCommentButtonClickHandler(this._onDeleteButtonClick);
  }

  _onSubmitForm() {
    const filmDetailComponent = this._filmDetailsComponent;
    const commentText = filmDetailComponent.getElement().querySelector(`.film-details__comment-input`).value;
    const emoji = filmDetailComponent.getElement().querySelector(`[name="comment-emoji"]:checked`);

    const commentsIDs = this._film.comments.slice();

    if (this._filmCommentsModel.getCommentsForDelete().length > 0) {
      this._filmCommentsModel.getCommentsForDelete().forEach((commentId) => {
        const commentIndex = commentsIDs.indexOf(commentId);
        if (commentIndex > -1) {
          commentsIDs.splice(commentIndex, 1);
        }
      });
      this._filmCommentsModel.deleteComments();
    }

    if (commentText && emoji) {
      const id = getRandomNumber(1, 1000) + getRandomNumber(1001, 10000);
      const newComment = {
        id,
        comment: commentText,
        emotion: emoji.value,
        author: `Current Author`,
        date: new Date()
      };

      this._filmCommentsModel.addComment(newComment);
      commentsIDs.push(id);
    }
    this._onDataChange(this._film, Object.assign({}, this._film, {comments: commentsIDs}));

    this._filmDetailsComponent.rerender();
  }

  _onChangeFormFilterInput(evt) {
    switch (evt.target.name) {
      case FormFilterTypes.WATCHLIST:
        this._setAddToWatchlist();
        break;
      case FormFilterTypes.WATCHED:
        this._setMarkAsWatched();
        break;
      case FormFilterTypes.FAVORITE:
        this._setMarkAsFavorite();
        break;
    }
  }

  _closeFilmDetails() {
    this._filmDetailsComponent.reset();
    toggleElement(this._footerElement, this._filmDetailsComponent, `hide`);
    document.removeEventListener(`keydown`, this._onEscapeKeyPress);
    this._mode = Mode.DEFAULT;
  }

  _onFilmElementClick() {
    this._mode = Mode.EDIT;
    toggleElement(this._footerElement, this._filmDetailsComponent, `show`);
    document.addEventListener(`keydown`, this._onEscapeKeyPress);
  }

  _onCloseButtonClick() {
    this._closeFilmDetails();
  }

  _onEscapeKeyPress(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._closeFilmDetails();
    } else if (evt.key === `Enter` && (evt.ctrlKey || evt.metaKey)) {
      this._onSubmitForm();
    }
  }

  _onDeleteButtonClick(evt) {
    evt.preventDefault();

    const id = evt.target.getAttribute(`data-id`);
    this._filmCommentsModel.addCommentForDelete(id);
    evt.target.closest(`.film-details__comment`).remove();
    this._filmDetailsComponent.getElement().querySelector(`.film-details__comments-count`).textContent = this._filmDetailsComponent.getElement().querySelectorAll(`.film-details__comments-list > .film-details__comment`).length;
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscapeKeyPress);
  }
}
