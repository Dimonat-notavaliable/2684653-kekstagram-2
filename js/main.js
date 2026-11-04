const POST_COUNT = 25;

const POST_DESCRIPTIONS = [
  'Крутое фото',
  'Ловлю момент',
  'Фотографировал на тапок',
  'Анапа 2007',
  'Где настраивается перспектива?',
  'Ссылочка на мой тг: @bababoy_1990 :)',
  'Прост)))',
  'Ставьте лайки',
  'Люблю пиццу',
  'Не придумал описание...'
];
const COMMENT_MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
const COMMENTERS = [
  'Евлампий Ангельский',
  'Кай Энжел',
  'Мэдкид',
  'Вася Пупкин',
  'Оля Пупкина',
  'Марат Башаров',
  'Марат Башкатов',
  'Дядя Ваня',
  'XXX_Winner_XXX',
  'Тетя Таня',
  'Кен Канеки',
  'pr0sto1_chel',
  'Пифагор',
  'Одиссей'
];

const AvatarId = {
  MIN: 1,
  MAX: 6
};
const LikesCount = {
  MIN: 15,
  MAX: 255
};
const CommentCount = {
  MIN: 0,
  MAX: 30
};

const photos = [];

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

const genPostId = createIntGenerator();
const genCommentId = createIntGenerator();

/**
 * Создает комментарий
 * @returns {object} Комментарий
 */
const createComment = () => {
  let message = getRandomArrayElement(COMMENT_MESSAGES);

  // Определяем нужно ли второе сообщение в комментарии
  if (getRandomInteger(1, 2) === 2) {
    let secondMessage = getRandomArrayElement(COMMENT_MESSAGES);
    while (secondMessage === message) {
      secondMessage = getRandomArrayElement(COMMENT_MESSAGES);
    }
    message = `${message} ${secondMessage}`;
  }

  return {
    id: genCommentId(),
    avatar: `img/avatar-${getRandomInteger(AvatarId.MIN, AvatarId.MAX)}.svg`,
    message: message,
    name: getRandomArrayElement(COMMENTERS)
  };
};

/**
 * Создает пост
 * @returns {object} Пост
 */
const createPost = () => {
  const postId = genPostId();
  return {
    id: postId,
    url: `photos/${postId}.jpg`,
    description: getRandomArrayElement(POST_DESCRIPTIONS),
    likes: getRandomInteger(LikesCount.MIN, LikesCount.MAX),
    comments: Array.from({length: getRandomInteger(CommentCount.MIN, CommentCount.MAX)}, createComment)
  };
};

/**
 * Создает все посты, отображаемые на странице
 * @param {number} postCount - Количество постов на странице
 */
const createAllPosts = (postCount) => {
  for (let i = 0; i < postCount; i++) {
    photos.push(createPost());
  }
};

createAllPosts(POST_COUNT);
