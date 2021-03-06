import {formatDateToFromNow, formatFilmDuration, formatFilmReleaseDate} from "../utils/common";
import AbstractSmartComponent from "./abstract-smart-component";
import {encode} from "he";

const ERROR_SUBMIT_STYLE = `1px solid #ff0000`;
const EMOJI_PATH = `./images/emoji/`;

const renderFilmDetailsRow = (details) => {
  return details
    .map((detail) => {
      const {term, info} = detail;
      let showingInfo = info;
      switch (term) {
        case `Release Date`:
          showingInfo = showingInfo ? formatFilmReleaseDate(showingInfo) : ``;
          break;
        case `Runtime`:
          showingInfo = info ? formatFilmDuration(info) : ``;
          break;
      }

      return `<tr class="film-details__row">
                <td class="film-details__term">${term}</td>
                <td class="film-details__cell">${showingInfo}</td>
              </tr>`;
    })
    .join(`\n`);
};

const renderGenres = (genres) => {
  return genres
    .split(`, `)
    .map((genre) => {
      return `<span class="film-details__genre">${genre}</span>`;
    })
    .join(`\n`);
};

const renderComments = (comments, deletingComments = [], isOnline) => {
  const result = comments.map((comment) => {
    const {comment: commentText, emotion, author, date, id} = comment;
    const disable = deletingComments.indexOf(id) > -1 ? `disabled` : ``;
    const deleteButtonText = deletingComments.indexOf(id) > -1 ? `Deleting...` : `Delete`;

    return `<li class="film-details__comment">
              <span class="film-details__comment-emoji">
                <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
              </span>
              <div>
                <p class="film-details__comment-text">${encode(commentText)}</p>
                <p class="film-details__comment-info">
                  <span class="film-details__comment-author">${author}</span>
                  <span class="film-details__comment-day">${formatDateToFromNow(date)}</span>
                  ${isOnline ? `<button class="film-details__comment-delete" data-id="${id}" ${disable}>${deleteButtonText}</button>` : ``}
                </p>
              </div>
            </li>`;
  }).join(`\n`);
  return `<ul class="film-details__comments-list">${result}</ul>`;
};

const createFilmDetailsTemplate = (film, options = {}) => {
  const {
    name,
    originalName,
    rating,
    genres,
    description,
    poster,
    age,
    details,
    isWatchlist,
    isWatched,
    isFavorites
  } = film;
  const {comments, deletingComments, commentText, commentEmoji, commentEmojiValue} = options;
  const isOnline = window.navigator.onLine;

  return `<section class="film-details">
            <form class="film-details__inner" action="" method="get">
              <div class="form-details__top-container">
                <div class="film-details__close">
                  <button class="film-details__close-btn" type="button">close</button>
                </div>
                <div class="film-details__info-wrap">
                  <div class="film-details__poster">
                    <img class="film-details__poster-img" src="${poster}" alt="">
          
                    <p class="film-details__age">${age}+</p>
                  </div>
          
                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${name}</h3>
                        <p class="film-details__title-original">${originalName}</p>
                      </div>
          
                      <div class="film-details__rating">
                        <p class="film-details__total-rating">${rating}</p>
                      </div>
                    </div>
          
                    <table class="film-details__table">
                      ${renderFilmDetailsRow(details)}
                      <tr class="film-details__row">
                        <td class="film-details__term">${genres.split(`, `).length > 1 ? `Genres` : `Genre`}</td>
                        <td class="film-details__cell">${renderGenres(genres)}</td>
                      </tr>
                    </table>
          
                    <p class="film-details__film-description">
                      ${description}
                    </p>
                  </div>
                </div>
          
                <section class="film-details__controls">
                  <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchlist ? `checked` : ``}>
                  <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
          
                  <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
                  <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
          
                  <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorites ? `checked` : ``}>
                  <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
                </section>
              </div>
          
              <div class="form-details__bottom-container">
                <section class="film-details__comments-wrap">
                  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
          
                  ${comments.length > 0 ? renderComments(comments, deletingComments, isOnline) : ``}
          
                  ${isOnline ? `<div class="film-details__new-comment">
                    <div for="add-emoji" class="film-details__add-emoji-label">${commentEmoji || ``}</div>
          
                    <label class="film-details__comment-label">
                      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentText || ``}</textarea>
                    </label>
          
                    <div class="film-details__emoji-list">
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${commentEmojiValue === `smile` ? `checked` : ``}>
                      <label class="film-details__emoji-label" for="emoji-smile">
                        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                      </label>
          
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${commentEmojiValue === `sleeping` ? `checked` : ``}>
                      <label class="film-details__emoji-label" for="emoji-sleeping">
                        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                      </label>
          
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${commentEmojiValue === `puke` ? `checked` : ``}>
                      <label class="film-details__emoji-label" for="emoji-puke">
                        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                      </label>
          
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${commentEmojiValue === `angry` ? `checked` : ``}>
                      <label class="film-details__emoji-label" for="emoji-angry">
                        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                      </label>
                    </div>
                  </div>` : ``}
                </section>
              </div>
            </form>
          </section>`;
};

export default class FilmDetails extends AbstractSmartComponent {
  constructor(film, commentsModel) {
    super();
    this._film = film;
    this._commentsModel = commentsModel;
    this._closeClickHandler = null;
    this._setFilterInputHandler = null;
    this._deleteButtonHandler = null;
    this._deletingComments = [];
    this._formElements = this.getElement().querySelectorAll(`form input, form textarea, form button`);
    this._newCommentText = null;
    this._newCommentEmoji = null;
    this._newCommentEmojiValue = null;
  }

  getTemplate() {
    const options = {
      comments: this._commentsModel.getComments(this._film.comments),
      deletingComments: this._deletingComments,
      commentText: this._newCommentText,
      commentEmoji: this._newCommentEmoji,
      commentEmojiValue: this._newCommentEmojiValue
    };

    return createFilmDetailsTemplate(this._film, options);
  }

  addDeleteCommentID(id, film) {
    this._deletingComments.push(id);
    this._setCommentInfo();
    this._setCheckedFiltres(film);

    this.rerender();
  }

  removeDeleteCommentID(id, film) {
    const index = this._deletingComments.indexOf(id);
    if (index > -1) {
      this._deletingComments.splice(index, 1);
      this._setCommentInfo();
      this._setCheckedFiltres(film);

      this.rerender();
    }
  }

  _setCheckedFiltres(film) {
    this._film.isWatched = film.isWatched;
    this._film.watchingDate = film.watchingDate;
    this._film.isWatchlist = film.isWatchlist;
    this._film.isFavorites = film.isFavorites;
  }

  _setCommentInfo() {
    const emojiElement = this.getElement().querySelector(`.film-details__new-comment .film-details__add-emoji-label img`);
    const commentTextElement = this.getElement().querySelector(`.film-details__comment-input`);
    const commentEmojiValue = this.getElement().querySelectorAll(`[name="comment-emoji"]:checked`);
    this._newCommentText = commentTextElement ? commentTextElement.value : null;
    this._newCommentEmoji = emojiElement ? emojiElement.outerHTML : null;
    this._newCommentEmojiValue = commentEmojiValue && commentEmojiValue[0] ? commentEmojiValue[0].value : null;
  }

  rerender() {
    super.rerender();
  }

  reset() {
    const emojiElement = this.getElement().querySelector(`.film-details__new-comment .film-details__add-emoji-label img`);
    const commentTextElement = this.getElement().querySelector(`.film-details__comment-input`);
    if (emojiElement) {
      emojiElement.remove();
    }
    if (commentTextElement) {
      commentTextElement.value = ``;
    }

    this._newCommentText = null;
    this._newCommentEmoji = null;
    this._newCommentEmojiValue = null;

    this.rerender();
  }

  setFormElementsChangeHandler() {
    this.getElement().querySelectorAll(`[name="comment-emoji"]`).forEach((emotion) => {
      emotion.addEventListener(`change`, (evt) => {
        const emotionValue = evt.target.value;
        if (emotionValue) {
          const forNewEmojiElement = this.getElement().querySelector(`.film-details__new-comment .film-details__add-emoji-label`);
          const forNewEmojiImageElement = forNewEmojiElement.querySelector(`img`);
          if (!forNewEmojiImageElement) {
            const newEmoji = document.createElement(`img`);
            newEmoji.src = `${EMOJI_PATH}${emotionValue}.png`;
            newEmoji.alt = `emoji-${emotionValue}`;
            newEmoji.width = `55`;
            newEmoji.height = `55`;
            forNewEmojiElement.append(newEmoji);
          } else {
            forNewEmojiImageElement.src = `${EMOJI_PATH}${emotionValue}.png`;
            forNewEmojiImageElement.alt = `emoji-${emotionValue}`;
          }
        }
      });
    });
  }

  setFormFilterInputChangeHandler(handler) {
    this.getElement().querySelector(`[name="watchlist"]`).addEventListener(`change`, handler);
    this.getElement().querySelector(`[name="watched"]`).addEventListener(`change`, handler);
    this.getElement().querySelector(`[name="favorite"]`).addEventListener(`change`, handler);
    this._setFilterInputHandler = handler;
  }

  setDeleteCommentButtonClickHandler(handler) {
    this.getElement().querySelectorAll(`.film-details__comment-delete`).forEach((deleteButton) => {
      deleteButton.addEventListener(`click`, handler);
    });
    this._deleteButtonHandler = handler;
  }

  recoveryListeners() {
    this.setCloseClickHandler(this._closeClickHandler);
    this.setFormElementsChangeHandler();
    this.setFormFilterInputChangeHandler(this._setFilterInputHandler);
    this.setDeleteCommentButtonClickHandler(this._deleteButtonHandler);
  }

  setCloseClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
    this._closeClickHandler = handler;
  }

  disableForm() {
    this._formElements.forEach((formElement) => formElement.setAttribute(`disabled`, `disabled`));
  }

  activateForm() {
    this._formElements.forEach((formElement) => formElement.removeAttribute(`disabled`));
  }

  setSendFormErrorStyles() {
    this.getElement().classList.add(`shake`);
    this.getElement().querySelector(`.film-details__comment-input`).style.border = ERROR_SUBMIT_STYLE;
  }

  setDeleteCommentErrorStyles(id) {
    this.getElement().querySelector(`.film-details__comment-delete[data-id="${id}"]`).closest(`.film-details__comment`).classList.add(`shake`);
  }

  removeDeleteCommentErrorStyles(id) {
    const deleteElement = this.getElement().querySelector(`.film-details__comment-delete[data-id="${id}"]`).closest(`.film-details__comment`);
    if (deleteElement.classList.contains(`shake`)) {
      deleteElement.classList.remove(`shake`);
    }
  }

  removeSendFormErrorStyles() {
    if (this.getElement().classList.contains(`shake`)) {
      this.getElement().classList.remove(`shake`);
    }
    this.getElement().querySelector(`.film-details__comment-input`).style.border = 0;
  }
}
