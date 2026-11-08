import { isEscapeKey } from './util.js';

const ERROR_SHOW_TIME = 5000;

const loadingErrorTemplate = document.querySelector('#data-error').content.querySelector('.data-error');

const sendErrorTemplate = document.querySelector('#error').content.querySelector('.error');
const sendSuccessTemplate = document.querySelector('#success').content.querySelector('.success');

let showingmessageClass = 'success';

const showLoadError = (errorText) => {
  const errorElement = loadingErrorTemplate.cloneNode(true);
  errorElement.querySelector('.data-error__title').textContent = errorText;

  document.body.append(errorElement);

  setTimeout(() => {
    errorElement.remove();
  }, ERROR_SHOW_TIME);
};

const showSendMessage = (messageText, isSuccess = true, onShow, onRemove) => {
  const messageElement = isSuccess ? sendSuccessTemplate.cloneNode(true) : sendErrorTemplate.cloneNode(true);
  showingmessageClass = isSuccess ? 'success' : 'error';

  const messageCloseButton = messageElement.querySelector(`.${showingmessageClass}__button`);

  messageElement.querySelector(`.${showingmessageClass}__title`).textContent = messageText;

  const onDocumentKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      removeSendMessage();
    }
  };

  function removeSendMessage () {
    messageElement.remove();
    document.removeEventListener('keydown', onDocumentKeydown);

    onRemove?.();
  }

  document.addEventListener('keydown', onDocumentKeydown);
  messageCloseButton.addEventListener('click', () => {
    removeSendMessage();
  });
  messageElement.addEventListener('click', (evt) => {
    if (!evt.target.closest(`.${showingmessageClass}__inner`)) {
      removeSendMessage();
    }
  });

  document.body.append(messageElement);
  onShow?.();
};

export {showLoadError, showSendMessage};
