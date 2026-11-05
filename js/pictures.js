import { createAllPosts } from './data.js';
import { openBigPicture } from './big-picture.js';

const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

const newPicturesFragment = document.createDocumentFragment();

createAllPosts().forEach(({url, description, likes, comments}) => {
  const pictureElement = pictureTemplate.cloneNode(true);

  const pictureImage = pictureElement.querySelector('.picture__img');
  pictureImage.src = url;
  pictureImage.alt = description;

  pictureElement.querySelector('.picture__likes').textContent = likes;
  pictureElement.querySelector('.picture__comments').textContent = comments.length;

  pictureElement.addEventListener('click', () => openBigPicture({url, description, likes, comments}));

  newPicturesFragment.append(pictureElement);
});

picturesContainer.append(newPicturesFragment);
