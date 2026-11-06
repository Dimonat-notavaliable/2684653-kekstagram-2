import { isEscapeKey, isHaveDuplicates } from './util.js';

const HASHTAG_COUNT_LIMIT = 5;
const DEFAULT_IMAGE_SCALE = 100;
const MAX_COMMENT_LENGTH = 140;

const uploadForm = document.querySelector('.img-upload__form');

const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const uploadCancelButton = uploadForm.querySelector('.img-upload__cancel');

const fileInput = uploadForm.querySelector('.img-upload__input');
const scaleInput = uploadForm.querySelector('.scale__control--value');
const effectLevelInput = uploadForm.querySelector('.effect-level__value');

const hashtagInput = uploadForm.querySelector('.text__hashtags');
const commentInput = uploadForm.querySelector('.text__description');

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__field-wrapper--error'
});

/**
 * Форматирует пользовальский ввод, убрав пробельные символы с начала и конца
 * @param {string} value
 * @returns {string}
 */
const formatUserInput = (value) => value.trim(/\s+/g, '');

const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;
let hashtagErrorMessage = '';

/**
 * Валидировать хэштег
 * @param {string} value
 * @returns {boolean}
 */
const validateHashtag = (value) => {
  value = formatUserInput(value);
  if (value !== '') {
    const hashtags = formatUserInput(value).toLowerCase().split(/\s+/);

    if (hashtags.length > HASHTAG_COUNT_LIMIT) {
      hashtagErrorMessage = 'Превышено количество хэштегов';
      return false;
    }
    if (isHaveDuplicates(hashtags)) {
      hashtagErrorMessage = 'Хэштеги не должны повторяться';
      return false;
    }

    for (const hashtag of hashtags) {
      if (!hashtagRegex.test(hashtag)) {
        hashtagErrorMessage = 'Неверный формат хэштега';
        return false;
      }
    }
  }

  return true;
};
pristine.addValidator(hashtagInput, validateHashtag, () => hashtagErrorMessage);

/**
 * Валидирует комментарий
 * @param {string} value
 * @returns {boolean}
 */
const validateComment = (value) => formatUserInput(value).length <= MAX_COMMENT_LENGTH;
pristine.addValidator(commentInput, validateComment, 'Комментарий должен быть не длиннее 140 символов');

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeUploadForm();
  }
};

const toggleFormOverlay = () => {
  uploadOverlay.classList.toggle('hidden');
  document.body.classList.toggle('modal-open');
};

const setDefaultFormValues = () => {
  // fileInput.value = '';

  scaleInput.value = `${DEFAULT_IMAGE_SCALE}%`;
  effectLevelInput.value = '';

  hashtagInput.value = '';
  commentInput.value = '';

  pristine.reset(); // Сбрасываем состояние Pristine
};

const openUploadForm = () => {
  toggleFormOverlay();
  document.addEventListener('keydown', onDocumentKeydown);
};

function closeUploadForm () {
  toggleFormOverlay();
  setDefaultFormValues();
  document.removeEventListener('keydown', onDocumentKeydown);
}

const onUploadFormSubmit = (evt) => {
  if (!pristine.validate()) {
    evt.preventDefault();
  }
};

hashtagInput.addEventListener('keydown', (evt) => evt.stopPropagation());
commentInput.addEventListener('keydown', (evt) => evt.stopPropagation());

fileInput.addEventListener('change', openUploadForm);
uploadForm.addEventListener('submit', onUploadFormSubmit);
uploadCancelButton.addEventListener('click', closeUploadForm);
