import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {formatFilmDurationForStatistic} from "../utils/common";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
momentDurationFormatSetup(moment);

const BAR_HEIGHT = 50;
const FilterTypes = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const renderStatisticChart = (statisticCtx, genres, counts) => {
  statisticCtx.height = BAR_HEIGHT * genres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: counts,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const formatDate = (date) => {
  return moment(date).format(`YYYY/MM/DD`);
};

const createStatisticTemplate = (options = {}) => {
  const {watchedFilmsCount, sumDuration, favoriteGenre, filterType, profileRating} = options;
  const time = formatFilmDurationForStatistic(sumDuration).split(`:`);
  return `<section class="statistic">
    <p class="statistic__rank">
      ${profileRating}
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Sci-Fighter</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${filterType === `all-time` ? `checked` : ``}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${filterType === `today` ? `checked` : ``}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${filterType === `week` ? `checked` : ``}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${filterType === `month` ? `checked` : ``}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${filterType === `year` ? `checked` : ``}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${time[0]} <span class="statistic__item-description">h</span> ${time[0] > 0 ? time[1] : 0} <span class="statistic__item-description">m</span></p>
      </li>
      ${watchedFilmsCount > 0 && favoriteGenre ? `<li class="statistic__text-item">
                                   <h4 class="statistic__item-title">Top genre</h4>
                                   <p class="statistic__item-text">${favoriteGenre}</p>
                                 </li>` : ``}
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class Statistic extends AbstractSmartComponent {
  constructor(moviesModel, profileComponent) {
    super();
    this._moviesModel = moviesModel;
    this._statisticChart = null;
    this._watchedFilms = this._moviesModel.getAllFilms().filter((film) => film.isWatched);
    this._sortedWatchedFilmsByGenre = [];
    this._sortedWatchedFilms = [];
    this._genreTitles = [];
    this._genreCounts = [];
    this._favoriteGenre = null;
    this._sumDuration = 0;
    this._currentFilterType = FilterTypes.ALL_TIME;
    this._onChangeFilter = this._onChangeFilter.bind(this);
    this._profileComponent = profileComponent;
  }

  getTemplate() {
    const options = {
      watchedFilmsCount: this._sortedWatchedFilms.length,
      sumDuration: this._sumDuration,
      favoriteGenre: this._favoriteGenre,
      filterType: this._currentFilterType,
      profileRating: this._profileComponent.getCurrentProfileRating()
    }
    return createStatisticTemplate(options);
  }

  show() {
    super.show();

    this.rerender();
  }

  hide() {
    super.hide();
    this._currentFilterType = FilterTypes.ALL_TIME;
    this._removeChangeFilterHandler(this._onChangeFilter);
  }

  rerender() {
    this._resetStatistic();
    this._generateStatistic();

    super.rerender();

    this._renderStatistic();
  }

  recoveryListeners() {
    this._setChangeFilterHandler(this._onChangeFilter);
  }

  _generateStatistic() {
    this._sortedWatchedFilms = this._filterFilmsByWatchingDate();

    this._sortedWatchedFilms.forEach((film) => {
      const genres = film.genres ? film.genres.split(`,`) : [];
      genres.forEach((filmGenre) => {
        const index = this._sortedWatchedFilmsByGenre.findIndex((genre) => genre.name === filmGenre.trim());
        if (index > -1) {
          ++this._sortedWatchedFilmsByGenre[index].count;
        } else {
          this._sortedWatchedFilmsByGenre.push({
            name: filmGenre.trim(),
            count: 1
          });
        }
      });
    });

    this._genreTitles = this._sortedWatchedFilmsByGenre.map((genreInfo) => genreInfo.name);
    this._genreCounts = this._sortedWatchedFilmsByGenre.map((genreInfo) => genreInfo.count);

    const maxGenreCount = Math.max(...this._genreCounts);
    const indexMaxGenreCount = this._genreCounts.indexOf(maxGenreCount);
    this._favoriteGenre = this._genreTitles[indexMaxGenreCount];
    this._sumDuration = this._sortedWatchedFilms.reduce((sumDuration, film) => sumDuration + film.duration, this._sumDuration);
  }

  _renderStatistic() {
    const element = this.getElement();
    const statisticCtx = element.querySelector(`.statistic__chart`);

    this._statisticChart = renderStatisticChart(statisticCtx, this._genreTitles, this._genreCounts);
  }

  _resetStatistic() {
    this._sortedWatchedFilmsByGenre = [];
    this._genreTitles = [];
    this._genreCounts = [];
    this._favoriteGenre = null;
    this._sumDuration = 0;
    this._sortedWatchedFilms = [];
    this._watchedFilms = this._moviesModel.getWatchedFilms();

    if (this._statisticChart) {
      this._statisticChart.destroy();
      this._statisticChart = null;
    }
  }

  _setChangeFilterHandler(handler) {
    this.getElement().querySelectorAll(`[name="statistic-filter"]`).forEach((filter) => {
      filter.addEventListener(`change`, handler);
    });
  }

  _removeChangeFilterHandler(handler) {
    this.getElement().querySelectorAll(`[name="statistic-filter"]`).forEach((filter) => {
      filter.removeEventListener(`change`, handler);
    });
  }

  _onChangeFilter(evt) {
    this._currentFilterType = evt.target.value;
    this.rerender();
  }

  _filterFilmsByWatchingDate() {
    const toDay = new Date();
    let startPeriodDate = null;

    switch (this._currentFilterType) {
      case FilterTypes.TODAY:
        return this._watchedFilms.filter((film) => formatDate(film.watchingDate) === formatDate(toDay));
      case FilterTypes.WEEK:
        startPeriodDate = moment(toDay).add(-7, `days`).format(`YYYY/MM/DD`);
        break;
      case FilterTypes.MONTH:
        startPeriodDate = moment(toDay).add(-1, `month`).format(`YYYY/MM/DD`);
        break;
      case FilterTypes.YEAR:
        startPeriodDate = moment(toDay).add(-1, `year`).format(`YYYY/MM/DD`);
        break;
    }

    if (startPeriodDate) {
      return this._watchedFilms.filter((film) => formatDate(film.watchingDate) >= startPeriodDate);
    }

    return this._watchedFilms;
  }
}
