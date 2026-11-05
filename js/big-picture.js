import {createDocumentElement, isEscapeKey} from './util.js';

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

const openBigPicture = ({url, description, likes, comments}) => {
  bigPictureDescription.textContent = description;
  bigPictureImage.src = url;
  bigPictureLikesCount.textContent = likes;

  bigPictureShownComments.textContent = comments.length;
  bigPictureTotalComments.textContent = comments.length;

  const commentsFragment = document.createDocumentFragment();
  comments.forEach((comment) => commentsFragment.append(createCommentElement(comment)));

  bigPictureCommentsList.innerHTML = '';
  bigPictureCommentsList.append(commentsFragment);

  bigPictureCommentsCount.classList.add('hidden');
  bigPictureCommentsLoader.classList.add('hidden');

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
};


function closeBigPicture () {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');

  bigPictureCommentsCount.classList.remove('hidden');
  bigPictureCommentsLoader.classList.remove('hidden');
  document.removeEventListener('keydown', onDocumentKeydown);
}

bigPicture.addEventListener('click', (evt) => {
  if (evt.target.closest('.big-picture__cancel') || !evt.target.closest('.big-picture__preview')) {
    closeBigPicture();
  }
});

export {openBigPicture};
