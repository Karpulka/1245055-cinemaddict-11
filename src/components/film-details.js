import {formatDateTime, formatFilmDuration} from "../utils/common";
import AbstractSmartComponent from "./abstract-smart-component";

const EMOJI_PATH = `./images/emoji/`;

const renderFilmDetailsRow = (details) => {
  return details
    .map((detail) => {
      const {term, info} = detail;
      return `<tr class="film-details__row">
                <td class="film-details__term">${term}</td>
                <td class="film-details__cell">${term === `Runtime` ? formatFilmDuration(info) : info}</td>
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

const renderComments = (comments) => {
  const result = comments.map((comment) => {
    const {comment: commentText, emotion, author, date} = comment;
    return `<li class="film-details__comment">
              <span class="film-details__comment-emoji">
                <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
              </span>
              <div>
                <p class="film-details__comment-text">${commentText}</p>
                <p class="film-details__comment-info">
                  <span class="film-details__comment-author">${author}</span>
                  <span class="film-details__comment-day">${formatDateTime(date)}</span>
                  <button class="film-details__comment-delete">Delete</button>
                </p>
              </div>
            </li>`;
  }).join(`\n`);
  return `<ul class="film-details__comments-list">${result}</ul>`;
};

const createFilmDetailsTemplate = (film) => {
  const {name, originalName, rating, genres, description, comments, poster, age, details, isWatchlist, isWatched, isFavorites} = film;

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
                        <td class="film-details__term">${genres.length > 1 ? `Genres` : `Genre`}</td>
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
          
                  ${comments.length > 0 ? renderComments(comments) : ``}
          
                  <div class="film-details__new-comment">
                    <div for="add-emoji" class="film-details__add-emoji-label"></div>
          
                    <label class="film-details__comment-label">
                      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                    </label>
          
                    <div class="film-details__emoji-list">
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                      <label class="film-details__emoji-label" for="emoji-smile">
                        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                      </label>
          
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                      <label class="film-details__emoji-label" for="emoji-sleeping">
                        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                      </label>
          
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                      <label class="film-details__emoji-label" for="emoji-puke">
                        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                      </label>
          
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                      <label class="film-details__emoji-label" for="emoji-angry">
                        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                      </label>
                    </div>
                  </div>
                </section>
              </div>
            </form>
          </section>`;
};

export default class FilmDetails extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;
    this._closeClickHandler = null;
  }

  rerender() {
    super.rerender();
  }

  reset() {
    const emoji = this.getElement().querySelector(`.film-details__new-comment .film-details__add-emoji-label img`);
    const commentText = this.getElement().querySelector(`.film-details__comment-input`);
    if (emoji) {
      emoji.remove();
    }
    if (commentText) {
      commentText.value = ``;
    }

    this.rerender();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film);
  }

  setCloseClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
    this._closeClickHandler = handler;
  }

  setFormElementsChangeHandler() {
    this.getElement().querySelectorAll(`[name="comment-emoji"]`).forEach((emotion) => {
      emotion.addEventListener(`change`, (evt) => {
        if (evt.target.value) {
          const forNewEmojiElement = this.getElement().querySelector(`.film-details__new-comment .film-details__add-emoji-label`);
          if (!forNewEmojiElement.querySelector(`img`)) {
            const newEmoji = document.createElement(`img`);
            newEmoji.src = `${EMOJI_PATH}${evt.target.value}.png`;
            newEmoji.alt = `emoji-${evt.target.value}`;
            newEmoji.width = `55`;
            newEmoji.height = `55`;
            forNewEmojiElement.append(newEmoji);
          } else {
            forNewEmojiElement.querySelector(`img`).src = `${EMOJI_PATH}${evt.target.value}.png`;
            forNewEmojiElement.querySelector(`img`).alt = `emoji-${evt.target.value}`;
          }
        }
      });
    });
  }

  setFormSubmitHandler() {
    document.addEventListener(`keydown`, (evt) => {
      if (evt.key === `Enter` && (evt.ctrlKey || evt.metaKey)) {
        const commentText = this.getElement().querySelector(`.film-details__comment-input`).value;
        const emoji = this.getElement().querySelector(`[name="comment-emoji"]:checked`);
        if (commentText && emoji) {
          this._film.comments.push({
            comment: commentText,
            emotion: emoji.value,
            author: `Current Author`,
            date: new Date()
          });
          this.rerender();
        }
      }
    });
  }

  recoveryListeners() {
    this.setCloseClickHandler(this._closeClickHandler);
    this.setFormElementsChangeHandler();
    this.setFormSubmitHandler();
  }
}
