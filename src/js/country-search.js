const BASE_URL = 'https://restcountries.eu/rest/v2';

export default class CountriesApiService {
  constructor() {
    this.searchQuery = '';
  }

  fetchCountries() {
    return fetch(`${BASE_URL}/name/${this.searchQuery}`).then(response => response.json());
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
