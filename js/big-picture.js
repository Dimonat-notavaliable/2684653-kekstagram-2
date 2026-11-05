import {createDocumentElement, isEscapeKey} from './util.js';

const COMMENTS_BATCH_SIZE = 5;

const CommentAvatarSize = {
  WIDTH: 35,
  HEIGTH: 35
};

const bigPicture = document.querySelector('.big-picture');

const bigPictureDescription = bigPicture.querySelector('.social__caption');
const bigPictureImage = bigPicture.querySelector('.big-picture__img').querySelector('img');
const bigPictureLikesCount = bigPicture.querySelector('.likes-count');

const bigPictureCommentsList = bigPicture.querySelector('.social__comments');
const bigPictureCommentsLoader = bigPicture.querySelector('.comments-loader');
const bigPictureCommentsCount = bigPicture.querySelector('.social__comment-count');
const bigPictureTotalComments = bigPictureCommentsCount.querySelector('.social__comment-total-count');
const bigPictureShownComments = bigPictureCommentsCount.querySelector('.social__comment-shown-count');

let loadedComments = 0;
let currentCommentsList;

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
};

const createCommentElement = ({avatar, message, name}) => {
  const commentElement = createDocumentElement('li', 'social__comment');

  const commentAvatar = createDocumentElement('img', 'social__picture');
  commentAvatar.src = avatar;
  commentAvatar.alt = name;
  commentAvatar.width = CommentAvatarSize.WIDTH;
  commentAvatar.height = CommentAvatarSize.HEIGTH;
  commentElement.append(commentAvatar);

  commentElement.append(createDocumentElement('p', 'social__text', message));
  return commentElement;
};

const renderCommentsBatch = () => {
  const commentsBatch = document.createDocumentFragment();
  for (let i = 0; i < COMMENTS_BATCH_SIZE && loadedComments < currentCommentsList.length; i++) {
    commentsBatch.append(createCommentElement(currentCommentsList[loadedComments]));
    loadedComments++;
  }
  bigPictureCommentsList.append(commentsBatch);
  bigPictureShownComments.textContent = loadedComments;

  if (loadedComments === currentCommentsList.length) {
    bigPictureCommentsLoader.classList.add('hidden');
  }
};

const togglePictureModal = () => {
  bigPicture.classList.toggle('hidden');
  document.body.classList.toggle('modal-open');
};

const openBigPicture = ({url, description, likes, comments}) => {
  bigPictureDescription.textContent = description;
  bigPictureImage.src = url;
  bigPictureLikesCount.textContent = likes;

  bigPictureShownComments.textContent = comments.length;
  bigPictureTotalComments.textContent = comments.length;

  bigPictureCommentsList.innerHTML = '';
  currentCommentsList = comments;
  renderCommentsBatch();

  togglePictureModal();

  document.addEventListener('keydown', onDocumentKeydown);
};

function closeBigPicture () {
  togglePictureModal();

  bigPictureCommentsLoader.classList.remove('hidden');
  document.removeEventListener('keydown', onDocumentKeydown);
  loadedComments = 0;
}

bigPicture.addEventListener('click', (evt) => {
  if (evt.target.closest('.big-picture__cancel') || !evt.target.closest('.big-picture__preview')) {
    closeBigPicture();
  }
});
bigPictureCommentsLoader.addEventListener('click', () => renderCommentsBatch());

export {openBigPicture};
