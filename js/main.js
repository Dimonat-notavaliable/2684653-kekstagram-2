import {renderPosts} from './pictures.js';
import { debounce } from './util.js';
import './picture-upload-form.js';
import { getData } from './api.js';
import { showLoadError } from './data-error.js';
import { setDefaultFilterClick, setRandomFilterClick, setDiscussedilterClick, filterDiscussed, filterRandom } from './img-filters.js';

const DEBOUNCE_COOLDOWN = 500;

getData()
  .then((pictures) => {
    renderPosts(pictures);
    setDefaultFilterClick(
      debounce(() => renderPosts(pictures), DEBOUNCE_COOLDOWN)
    );
    setDiscussedilterClick(
      debounce(() => renderPosts(pictures, filterDiscussed), DEBOUNCE_COOLDOWN)
    );
    setRandomFilterClick(
      debounce(() => renderPosts(pictures, filterRandom), DEBOUNCE_COOLDOWN)
    );
  })
  .catch((err) => {
    showLoadError(err.message);
  });
