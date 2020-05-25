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
    this._updatedFilm = null;
  }

  get film() {
    return this._film;
  }

  render(film) {
    this._film = film;
    this._updatedFilm = Object.assign({}, film);

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

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscapeKeyPress);
  }

  _setAddToWatchlist() {
    this._addToWatchlist();
    this._onDataChange(this._film, this._updatedFilm);
  }

  _setMarkAsWatched() {
    this._markAsWatched();
    this._onDataChange(this._film, this._updatedFilm);
  }

  _setMarkAsFavorite() {
    this._markAsFavorite();
    this._onDataChange(this._film, this._updatedFilm);
  }

  _addToWatchlist() {
    this._updatedFilm = Object.assign({}, this._updatedFilm, {
      isWatchlist: !this._film.isWatchlist
    });
  }

  _markAsWatched() {
    const watchingDate = this._updatedFilm.isWatched ? null : new Date();
    this._updatedFilm = Object.assign({}, this._updatedFilm, {
      isWatched: !this._updatedFilm.isWatched,
      watchingDate
    });
  }

  _markAsFavorite() {
    this._updatedFilm = Object.assign({}, this._updatedFilm, {
      isFavorites: !this._updatedFilm.isFavorites
    });
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
        this._addToWatchlist();
        break;
      case FormFilterTypes.WATCHED:
        this._markAsWatched();
        break;
      case FormFilterTypes.FAVORITE:
        this._markAsFavorite();
        break;
    }
  }

  _closeFilmDetails() {
    if (this._film !== this._updatedFilm) {
      this._onDataChange(this._film, this._updatedFilm);
    } else {
      this._filmDetailsComponent.reset();
      toggleElement(this._footerElement, this._filmDetailsComponent, `hide`);
      document.removeEventListener(`keydown`, this._onEscapeKeyPress);
      this._mode = Mode.DEFAULT;
    }
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
        const index = this._updatedFilm.comments.indexOf(id);
        if (index > -1) {
          this._updatedFilm.comments.splice(index, 1);
        }
        this._filmDetailsComponent.removeDeleteCommentID(id);
        document.addEventListener(`keydown`, this._onEscapeKeyPress);
      })
      .catch(() => {
        this._filmDetailsComponent.removeDeleteCommentID(id);
        this._filmDetailsComponent.setDeleteCommentErrorStyles(id);
      });
  }
}
