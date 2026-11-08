import {renderPosts} from './pictures.js';
import './picture-upload-form.js';
import { getData } from './api.js';
import { showLoadError } from './data-error.js';


getData()
  .then((pictures) => {
    renderPosts(pictures);
  })
  .catch((err) => {
    showLoadError(err.message);
  });
