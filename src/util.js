const POSITION = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`
};

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomItemFromArray = (array) => {
  const min = 0;
  const max = array.length;
  return array[getRandomNumber(min, max)];
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatDateTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());
  const year = date.getFullYear();
  const month = castTimeFormat(date.getMonth() + 1);
  const day = castTimeFormat(date.getDate());

  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const render = (container, element, position) => {
  switch (position) {
    case POSITION.AFTERBEGIN:
      container.prepend(element);
      break;
    case POSITION.AFTEREND:
      container.after(element);
      break;
    case POSITION.BEFOREEND:
      container.append(element);
      break;
  }
};

const sortByDesc = (a, b) => {
  return b - a;
};

export {getRandomNumber, getRandomItemFromArray, formatDateTime, createElement, render, POSITION, sortByDesc};
