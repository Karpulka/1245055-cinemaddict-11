const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomItemFromArray = (array) => {
  const min = 0;
  const max = array.length;
  return array[getRandomNumber(min, max)];
};

export {getRandomNumber, getRandomItemFromArray};
