const generateFilters = (films) => {
  return [
    {
      name: `All movies`,
      link: `#all`,
      count: -1
    },
    {
      name: `Watchlist`,
      link: `#watchlist`,
      count: films.filter((elm) => elm.isWatchlist).length,
    },
    {
      name: `History`,
      link: `#history`,
      count: films.filter((elm) => elm.isWatched).length,
    },
    {
      name: `Favorites`,
      link: `#favorites`,
      count: films.filter((elm) => elm.isFavorites).length,
    }
  ];
};

export {generateFilters};
