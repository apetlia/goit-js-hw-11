import axios from 'axios';

class Pixabay {
  constructor(key = '36515340-d2bd45b3d1303b51fd4615e59') {
    this.key = key;
    this._page = 1;
    this._searchQuery = '';
    this._onPerPage = 15;
    this.currentHits = 0;
    this.totalHits = 0;
  }

  async getData() {
    const config = {
      method: 'get',
      baseURL: 'https://pixabay.com/api/',
      params: {
        page: this._page,
        per_page: this._onPerPage,
        key: this.key,
        q: this._searchQuery,
        image_type: 'photo',
        safesearch: true,
        orientation: 'horizontal',
      },
    };

    this.currentHits = this.page * this.perPage;
    return await axios(config);
  }

  get page() {
    return this._page;
  }

  set page(newPage) {
    this._page = newPage;
  }

  get perPage() {
    return this._onPerPage;
  }

  set perPage(newPerPage) {
    this._onPerPage = newPerPage;
  }

  get query() {
    return this._searchQuery;
  }
  set query(newQuery) {
    this._searchQuery = newQuery;
    this.currentHits = 0;
    this.totalHits = 0;
    this._page = 1;
  }
}

export default Pixabay;
