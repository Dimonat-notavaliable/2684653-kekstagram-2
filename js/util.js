/**
 * Выбирает случайное число из диапазона
 * @param {number} minimum - Нижняя граница диапазона (включительно)
 * @param {number} maximum - Верхняя граница диапазона (включительно)
 * @returns {number} Случайное число из диапазона
 */
const getRandomInteger = (minimum, maximum) => {
  const bottomLimit = Math.ceil(Math.min(minimum, maximum));
  const upperLimit = Math.floor(Math.max(minimum, maximum));

  return Math.floor(Math.random() * (upperLimit - bottomLimit + 1) + bottomLimit);
};

/**
 * Выбирает один случайный элемент из массива.
 * @param {Array} array - Массив элементов
 * @returns {*} Случайный элемент из массива
 */
const getRandomArrayElement = (array) => array[getRandomInteger(0, array.length - 1)];

/**
 * Создает генератор последовательных натуральных чисел
 * @returns {object} Функция - генератор
 */
const createIntGenerator = () => {
  let lastInt = 0;
  return () => {
    lastInt++;
    return lastInt;
  };
};

export {getRandomInteger, getRandomArrayElement, createIntGenerator};
