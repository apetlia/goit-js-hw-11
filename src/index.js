import * as bootstrap from 'bootstrap';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Pixabay from './pixabay-api';
import refs from './refs';

const pixabay = new Pixabay();

refs.form.addEventListener('submit', onFormSubmit);

refs.btnLoadMore.addEventListener('click', onButtonClick);

function onFormSubmit(evt) {
  evt.preventDefault();
  refs.btnLoadMore.hidden = true;

  const searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
  clearGallaryContainer();

  pixabay.query = searchQuery;
  pixabay.page = 1;
  pixabay
    .getData()
    .then(isDataExist)
    .then(data => {
      refs.galleryDiv.insertAdjacentHTML('beforeend', renderCards(data));
      refs.btnLoadMore.hidden = false;
    })
    .catch(onErrorOccurred);
}

function onButtonClick() {
  pixabay.page += 1;
  pixabay
    .getData()
    .then(isDataExist)
    .then(data => {
      refs.galleryDiv.insertAdjacentHTML('beforeend', renderCards(data));
    })
    .catch(onErrorOccurred);
}

function onErrorOccurred(err) {
  if (err.response?.status === 400) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    refs.btnLoadMore.hidden = true;
  }
}

function isDataExist(res) {
  //   console.log(res);
  if (res.data.totalHits === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    throw new Error(res);
  } else if (res.data.hits.length === 0) {
    Notify.info("We're sorry, but you've reached the end of search results.");

    refs.btnLoadMore.hidden = true;
    throw new Error(res);
  }

  return res.data.hits;
}

function renderCards(cards) {
  return cards
    .map(card => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = card;

      const template = `
        <div class="photo-card">
          <img src=${webformatURL} alt="${tags}" loading="lazy" />
          <div class="info shadow-sm bg-white rounded rounded-bottom">
            <p class="info-item">
              <b>Likes</b><br>
              ${likes}
            </p>
            <p class="info-item">
              <b>Views</b><br>
              ${views}
            </p>
            <p class="info-item">
              <b>Comments</b><br>
              ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b><br>
              ${downloads}
            </p>
          </div>
        </div>`;

      return template;
    })
    .join('');
}

function clearGallaryContainer() {
  refs.galleryDiv.innerHTML = '';
}
