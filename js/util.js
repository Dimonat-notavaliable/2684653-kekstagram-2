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

/**
 * Создает новый HTML элемент
 * @param {string} tag - Тэг элемента.
 * @param {string} className - Класс элемента.
 * @param {string} text - Внутренний текст элемента, опционально.
 * @returns {HTMLElement} Созданный элемент
 */
const createDocumentElement = (tag, className, text) => {
  const element = document.createElement(tag);
  element.classList.add(className);

  if (text) {
    element.textContent = text;
  }

  return element;
};

/**
 * Проверяет является ли нажатая клавиша клавишей Escape.
 * @param {KeyboardEvent} evt - Событие клавиатуры.
 * @returns {boolean} Является ли клавиша Escape.
 */
const isEscapeKey = (evt) => evt.key === 'Escape';

/**
 * Проверяет массив на наличие дубликатов
 * @param {Array} array - Массив элементов
 * @returns {boolean} Есть ли в массиве дубликаты
 */
const isHaveDuplicates = (array) => array.some((item, idx) => array.indexOf(item) !== idx);

export {getRandomInteger, getRandomArrayElement, createIntGenerator, createDocumentElement, isEscapeKey, isHaveDuplicates};
