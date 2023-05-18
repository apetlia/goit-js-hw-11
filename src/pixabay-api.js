import axios from 'axios';

class Pixabay {
  constructor(key = '36515340-d2bd45b3d1303b51fd4615e59') {
    this.key = key;
    this._page = 1;
    this._searchQuery = '';
    this._totalHits = 0;
  }

  getData() {
    const config = {
      method: 'get',
      baseURL: 'https://pixabay.com/api/',
      params: {
        page: this._page,
        per_page: 99,
        key: this.key,
        q: this._searchQuery,
        image_type: 'photo',
        safesearch: true,
        orientation: 'horizontal',
      },
    };

    return axios(config);
  }

  get page() {
    return this._page;
  }

  set page(newPage) {
    this._page = newPage;
  }

  get query() {
    return this._searchQuery;
  }
  set query(newQuery) {
    this._searchQuery = newQuery;
  }
}

export default Pixabay;
