import FilmCard from "../components/film-card";
import FilmDetails from "../components/film-details";
import {POSITION, render, toggleElement, replace, remove} from "../utils/render";
import CommentModel from "../models/comment";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

const FormFilterTypes = {
  WATCHLIST: `watchlist`,
  WATCHED: `watched`,
  FAVORITE: `favorite`
};

export const renderFilms = (container, films, onDataChange, commentsModel, api) => {
  return films.map((film) => {
    const filmController = new MovieController(container, onDataChange, commentsModel, api);
    filmController.render(film);
    return filmController;
  });
};

export default class MovieController {
  constructor(container, onDataChange, commentsModel, api) {
    this._container = container;
    this._api = api;
    this._isOnline = this._api.isOnline();
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

  _onSubmitForm(evt) {
    evt.preventDefault();
    this._filmDetailsComponent.removeSendFormErrorStyles();
    const commentText = this._filmDetailsComponent.getElement().querySelector(`.film-details__comment-input`).value;
    const emoji = this._filmDetailsComponent.getElement().querySelector(`[name="comment-emoji"]:checked`);

    if (commentText && emoji) {
      const newComment = {
        comment: commentText,
        emotion: emoji.value,
        date: new Date()
      };

      this._filmDetailsComponent.disableForm();

      this._api.addComment(this._film.id, new CommentModel(newComment))
        .then((comments) => {
          const addedComment = comments.filter((comment) => this._film.comments.indexOf(comment.id) === -1);
          this._filmCommentsModel.addComment(addedComment);
          this._onDataChange(this._film, null);
        })
        .catch(() => {
          this._filmDetailsComponent.activateForm();
          this._filmDetailsComponent.setSendFormErrorStyles();
        });
    }
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
    if (this._isOnline !== this._api.isOnline()) {
      this._isOnline = this._api.isOnline();
      this._filmDetailsComponent.rerender();
    }
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
      this._onSubmitForm(evt);
    }
  }

  _onDeleteButtonClick(evt) {
    evt.preventDefault();

    const id = evt.target.getAttribute(`data-id`);
    this._filmDetailsComponent.addDeleteCommentID(id);
    this._filmDetailsComponent.removeDeleteCommentErrorStyles(id);

    this._api.deleteComment(id)
      .then(() => {
        this._filmCommentsModel.deleteComment(id);
        this._onDataChange(this._film, null);
      })
      .catch(() => {
        this._filmDetailsComponent.removeDeleteCommentID(id);
        this._filmDetailsComponent.setDeleteCommentErrorStyles(id);
      });
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscapeKeyPress);
  }
}
