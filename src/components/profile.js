import AbstractSmartComponent from "./abstract-smart-component";

const ProfileRating = {
  DEFAULT: null,
  NOVICE: `Novice`,
  FAN: `Fan`,
  MOVIE_BUFF: `Movie Buff`
};

const createProfileTemplate = (profileRating) => {
  return `<section class="header__profile profile">
            ${profileRating ? `<p class="profile__rating">${profileRating}</p>` : ``}
            <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          </section>`;
};

export default class Profile extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();

    this._moviewModel = moviesModel;
    this._watchedFilmsCount = this._moviewModel.getWatchedFilms().length;
    this._profileRating = this._getProfileRating();
  }

  getTemplate() {
    return createProfileTemplate(this._profileRating);
  }

  rerender() {
    this._watchedFilmsCount = this._moviewModel.getWatchedFilms().length;
    this._profileRating = this._getProfileRating();
    super.rerender();
  }

  getCurrentProfileRating() {
    return this._profileRating;
  }

  recoveryListeners() {}

  _getProfileRating() {
    if (this._watchedFilmsCount > 0 && this._watchedFilmsCount <= 10) {
      return ProfileRating.NOVICE;
    }

    if (this._watchedFilmsCount > 10 && this._watchedFilmsCount <= 20) {
      return ProfileRating.FAN;
    }

    if (this._watchedFilmsCount > 20) {
      return ProfileRating.MOVIE_BUFF;
    }

    return ProfileRating.DEFAULT;
  }
}
