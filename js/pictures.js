import { openBigPicture } from './big-picture.js';
import { showFilters } from './img-filters.js';

const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

const renderPosts = (posts, filterFunction = null) => {
  if (filterFunction) {
    posts = filterFunction(posts);
  }

  const newPicturesFragment = document.createDocumentFragment();
  posts.forEach(({url, description, likes, comments}) => {
    const pictureElement = pictureTemplate.cloneNode(true);

    const pictureImage = pictureElement.querySelector('.picture__img');
    pictureImage.src = url;
    pictureImage.alt = description;

    pictureElement.querySelector('.picture__likes').textContent = likes;
    pictureElement.querySelector('.picture__comments').textContent = comments.length;

    pictureElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      openBigPicture({url, description, likes, comments});
    });

    newPicturesFragment.append(pictureElement);
  });

  picturesContainer.querySelectorAll('.picture').forEach((e) => e.remove());
  picturesContainer.append(newPicturesFragment);
  showFilters();
};

export {renderPosts};
