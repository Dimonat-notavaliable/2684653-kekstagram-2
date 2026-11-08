import { getRandomArrayElements } from './util.js';

const RANDOM_PHOTOS_COUNT = 10;

const filters = document.querySelector('.img-filters');

const defaultFilterButton = filters.querySelector('#filter-default');
const randomFilterButton = filters.querySelector('#filter-random');
const discussedFilterButton = filters.querySelector('#filter-discussed');

let activeFilter = defaultFilterButton;

const showFilters = () => {
  filters.classList.remove('img-filters--inactive');
};

const compareDiscussedPhotos = (photoA, photoB) => photoB.comments.length - photoA.comments.length;

const filterDiscussed = (photos) => photos.slice().sort(compareDiscussedPhotos);
const filterRandom = (photos) => getRandomArrayElements(photos, RANDOM_PHOTOS_COUNT);

const changeActiveFilter = (newFilter) => {
  activeFilter.classList.remove('img-filters__button--active');
  newFilter.classList.add('img-filters__button--active');
  activeFilter = newFilter;
};

const onFilterClick = (evt) => {
  if (evt.target !== activeFilter) {
    changeActiveFilter(evt.target);
  }
};

const setDefaultFilterClick = (callback) => {
  defaultFilterButton.addEventListener('click', (evt) => {
    onFilterClick(evt);
    callback();
  });
};

const setRandomFilterClick = (callback) => {
  randomFilterButton.addEventListener('click', (evt) => {
    onFilterClick(evt);
    callback();
  });
};


const setDiscussedilterClick = (callback) => {
  discussedFilterButton.addEventListener('click', (evt) => {
    onFilterClick(evt);
    callback();
  });
};

export {showFilters, setDefaultFilterClick, setRandomFilterClick, setDiscussedilterClick, filterDiscussed, filterRandom};
