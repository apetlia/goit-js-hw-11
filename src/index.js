import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Pixabay from './pixabay-api';
import SimpleLightbox from 'simplelightbox';
import throttle from 'lodash.throttle';

import refs from './refs';

const pixabay = new Pixabay();
const gallery = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onFormSubmit);

async function onFormSubmit(evt) {
  evt.preventDefault();
  clearGallaryContainer();
  refs.endResults.hidden = true;

  const searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
  pixabay.query = searchQuery;

  try {
    await getPixabayDataAndUpdateUI();

    Notify.success(`Hooray! We found ${pixabay.totalHits} images.`);
    window.addEventListener('scroll', infinityScroll);
  } catch (error) {
    onErrorOccurred(error);
  }
}

async function getNextPixabayData() {
  if (pixabay.currentHits > pixabay.totalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    window.removeEventListener('scroll', infinityScroll);
    refs.endResults.hidden = false;

    return;
  }

  try {
    pixabay.page += 1;
    await getPixabayDataAndUpdateUI();
  } catch (error) {
    onErrorOccurred(error);
  }
}

function onErrorOccurred(err) {
  console.log(err);
}

function checkResponse(res) {
  if (res.data.totalHits === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    throw new Error('No result');
  }

  pixabay.totalHits = res.data.totalHits;

  return res.data.hits;
}

function createCardsMarkup(cards) {
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
      <a href="${largeImageURL}" class="shadow">
        <div class="photo-card ">
         <div class="photo-card__thumb">
            <img src=${webformatURL} alt="${tags}" loading="lazy" />
          </div>
          <div class="photo-card__info shadow bg-white ">
            <p class="photo-card__item">
              <b>Likes</b><br>
              ${likes}
            </p>
            <p class="photo-card__item">
              <b>Views</b><br>
              ${views}
            </p>
            <p class="photo-card__item">
              <b>Comments</b><br>
              ${comments}
            </p>
            <p class="photo-card__item">
              <b>Downloads</b><br>
              ${downloads}
            </p>
          </div>
        </div>
       </a>`;

      return template;
    })
    .join('');
}

function clearGallaryContainer() {
  refs.galleryDiv.innerHTML = '';
}

async function getPixabayDataAndUpdateUI() {
  const response = await pixabay.getData();
  const data = checkResponse(response);
  refs.galleryDiv.insertAdjacentHTML('beforeend', createCardsMarkup(data));
  gallery.refresh();
}

const infinityScroll = throttle(() => {
  let res =
    window.pageYOffset + 2 * window.innerHeight >= document.body.offsetHeight;

  if (res) {
    getNextPixabayData();
  }
}, 500);
