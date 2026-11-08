import { isEscapeKey, isHaveDuplicates } from './util.js';
import { sendData } from './api.js';
import { showSendMessage, showLoadError } from './data-error.js';

const HASHTAG_COUNT_LIMIT = 5;
const MAX_COMMENT_LENGTH = 140;
const ALLOWED_IMAGE_EXTENSIONS = ['jpeg', 'jpg', 'png'];

const ImageScale = {
  DEFAULT: 100,
  MIN: 25,
  MAX: 100,
  STEP: 25
};

const Effects = {
  chrome: {
    cssProperty: 'grayscale',
    minValue: 0,
    maxValue: 1,
    step: 0.1
  },
  sepia: {
    cssProperty: 'sepia',
    minValue: 0,
    maxValue: 1,
    step: 0.1
  },
  marvin: {
    cssProperty: 'invert',
    minValue: 0,
    maxValue: 100,
    step: 1,
    unit: '%'
  },
  phobos: {
    cssProperty: 'blur',
    minValue: 0,
    maxValue: 3,
    step: 0.1,
    unit: 'px'
  },
  heat: {
    cssProperty: 'brightness',
    minValue: 1,
    maxValue: 3,
    step: 0.1
  }
};

const uploadForm = document.querySelector('.img-upload__form');
const uploadPreview = uploadForm.querySelector('.img-upload__preview>img');

const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const uploadCancelButton = uploadForm.querySelector('.img-upload__cancel');

const fileInput = uploadForm.querySelector('.img-upload__input');
const scaleValue = uploadForm.querySelector('.scale__control--value');
const scaleSmaller = uploadForm.querySelector('.scale__control--smaller');
const scaleBigger = uploadForm.querySelector('.scale__control--bigger');

const effectsList = uploadForm.querySelector('.img-upload__effects');
const defaultEffectRadio = uploadForm.querySelector('#effect-none');
const effectLevel = uploadForm.querySelector('.img-upload__effect-level');
const effectLevelSlider = effectLevel.querySelector('.effect-level__slider');
const effectLevelValue = effectLevel.querySelector('.effect-level__value');

const hashtagInput = uploadForm.querySelector('.text__hashtags');
const commentInput = uploadForm.querySelector('.text__description');

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__field-wrapper--error'
});

noUiSlider.create(effectLevelSlider, {
  range: {
    min: 0,
    max: 100,
  },
  start: 0,
  step: 1,
  connect: 'lower',
});

const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

let hashtagErrorMessage = '';
let currentEffect = 'none';

/**
 * Форматирует пользовальский ввод, убрав пробельные символы с начала и конца
 * @param {string} value
 * @returns {string}
 */
const formatUserInput = (value) => value.trim(/\s+/g, '');

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
const enableFormEscape = () => {
  document.addEventListener('keydown', onDocumentKeydown);
};
const disableFormEscape = () => {
  document.removeEventListener('keydown', onDocumentKeydown);
};

const resetImageEffect = () => {
  defaultEffectRadio.checked = true;
  effectLevelValue.value = '';
  effectLevel.classList.add('hidden');

  uploadPreview.style.filter = '';
};
resetImageEffect();

const onEffectsListChange = () => {
  currentEffect = effectsList.querySelector('input[name=effect]:checked').value;
  const selectedEffectProperties = Effects[currentEffect];

  if (selectedEffectProperties) {
    effectLevel.classList.remove('hidden');
    effectLevelSlider.noUiSlider.updateOptions({
      range: {
        min: selectedEffectProperties.minValue,
        max: selectedEffectProperties.maxValue,
      },
      start: selectedEffectProperties.maxValue,
      step: selectedEffectProperties.step
    });
  } else {
    resetImageEffect();
  }
};

const onEffectLevelSliderUpdate = () => {
  const currentEffectLevel = effectLevelSlider.noUiSlider.get();
  effectLevelValue.value = currentEffectLevel;

  const selectedEffectProperties = Effects[currentEffect];
  if (selectedEffectProperties) {
    uploadPreview.style.filter = `${selectedEffectProperties.cssProperty}(${currentEffectLevel}${selectedEffectProperties.unit ?? ''})`;
  }
};

let currentImageScale = ImageScale.DEFAULT;
const changeImageScale = (value) => {
  const newScale = Math.min(ImageScale.MAX, Math.max(ImageScale.MIN, currentImageScale + value));
  scaleValue.value = `${newScale}%`;
  currentImageScale = newScale;
  uploadPreview.style.transform = `scale(${currentImageScale / 100})`;
};

const toggleFormOverlay = () => {
  uploadOverlay.classList.toggle('hidden');
  document.body.classList.toggle('modal-open');
};

const setDefaultFormValues = () => {
  fileInput.value = '';

  scaleValue.value = `${ImageScale.DEFAULT}%`;
  effectLevelValue.value = '';

  hashtagInput.value = '';
  commentInput.value = '';

  resetImageEffect();

  pristine.reset(); // Сбрасываем состояние Pristine
};

const openUploadForm = () => {
  const picture = fileInput.files[0];
  const fileName = picture.name.toLowerCase();

  if (ALLOWED_IMAGE_EXTENSIONS.some((ext) => fileName.endsWith(ext))) {
    uploadPreview.src = URL.createObjectURL(picture);
    toggleFormOverlay();
    enableFormEscape();
  } else {
    showLoadError('Получен неподдерживаемый формат файла, выберите другое изображение');
  }
};

function closeUploadForm () {
  toggleFormOverlay();
  setDefaultFormValues();
  disableFormEscape();
}

const onUploadFormSubmit = (evt) => {
  evt.preventDefault();

  if (pristine.validate()) {
    sendData(new FormData(evt.target))
      .then(() => {
        closeUploadForm();
        showSendMessage('Фотография загружена');
      })
      .catch((err) => {
        showSendMessage(err.message, false, disableFormEscape, enableFormEscape);
      });
  }
};

effectsList.addEventListener('change', onEffectsListChange);
effectLevelSlider.noUiSlider.on('update', onEffectLevelSliderUpdate);

hashtagInput.addEventListener('keydown', (evt) => evt.stopPropagation());
commentInput.addEventListener('keydown', (evt) => evt.stopPropagation());

scaleSmaller.addEventListener('click', () => changeImageScale(-ImageScale.STEP));
scaleBigger.addEventListener('click', () => changeImageScale(ImageScale.STEP));

fileInput.addEventListener('change', openUploadForm);
uploadForm.addEventListener('submit', onUploadFormSubmit);
uploadCancelButton.addEventListener('click', closeUploadForm);
