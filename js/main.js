/**
 * Проверяет что длина строки не превышает заданный лимит
 * @param {string} toCheck - Строка для проверки
 * @param {number} limit - Лимит длины
 * @returns {boolean} Результат проверки
 */
const checkLength = (toCheck, limit) => toCheck.length <= limit;

/**
 * Проверяет является ли строка палиндромом, без учета пробелов и регистра
 * @param {string} toCheck - Строка для проверки
 * @returns {boolean} Результат проверки
 */
const isPalindrome = (toCheck) => {
  const preparedString = toCheck.replaceAll(' ', '').toLowerCase();
  for (let i = 0; i < preparedString.length / 2; i++) {
    if (preparedString[i] !== preparedString[preparedString.length - i - 1]) {
      return false;
    }
  }
  return true;
};

/**
 *
 * @param {string | number} toParse
 * @returns {number}
 */
const parseNumberString = (toParse) => {
  let resultString = '';
  toParse = toParse.toString();
  for (let i = 0; i < toParse.length; i++) {
    if (!Number.isNaN(parseInt(toParse[i], 10))) {
      resultString += toParse[i];
    }
  }
  return parseInt(resultString, 10);
};


checkLength('проверяемая строка', 20);
isPalindrome('Лёша на полке клопа нашёл ');
parseNumberString('2023 год');
