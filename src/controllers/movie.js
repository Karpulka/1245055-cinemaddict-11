import FilmCard from "../components/film-card";
import FilmDetails from "../components/film-details";
import {POSITION, render, toggleElement, replace, remove} from "../utils/render";
import Comments from "../models/comments";
import {getAllComments} from "../mock/film";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export default class MovieController {
  constructor(container, onDataChange) {
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
    this._filmComments = [];
    this._filmCommentsModel = new Comments(getAllComments);
    this._onSubmitForm = this._onSubmitForm.bind(this);
  }

  get film() {
    return this._film;
  }

  render(film) {
    this._film = film;
    this._filmComments = this._filmCommentsModel.getComments(this._film.comments);

    const oldFilmComponent = this._filmComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmCard(film, this._filmComments);
    this._filmDetailsComponent = new FilmDetails(film, this._filmComments);

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
    this._onDataChange(this._film, Object.assign({}, this._film, {
      isWatched: !this._film.isWatched
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
    this._filmDetailsComponent.setFormSubmitHandler(this._onSubmitForm);
  }

  _onSubmitForm() {
    const commentText = this._filmDetailsComponent.getElement().querySelector(`.film-details__comment-input`).value;
    const emoji = this._filmDetailsComponent.getElement().querySelector(`[name="comment-emoji"]:checked`);
    if (commentText && emoji) {
      const id = getRandomNumber(1, 1000) + getRandomNumber(1001, 10000);
      const newComment = {
        id,
        comment: commentText,
        emotion: emoji.value,
        author: `Current Author`,
        date: new Date()
      };

      const commentsIDs = this._film.comments.slice();
      commentsIDs.push(id);
      this._filmCommentsModel.addComment(newComment);
      this._onDataChange(this._film, Object.assign({}, this._film, {comments: commentsIDs}));

      this._filmDetailsComponent.rerender();
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
    }
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscapeKeyPress);
  }
}
