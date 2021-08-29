import '../styles.css';

import { notice } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import * as Confirm from '@pnotify/confirm';
import '@pnotify/confirm/dist/PNotifyConfirm.css';

import debounce from 'lodash.debounce';

import CountriesApiService from './country-search';
import refs from './refs';

import countryCardTpl from '../templates/country-card.hbs';
import countriesListTpl from '../templates/countries-list.hbs';

const countriesApiService = new CountriesApiService();
let noticeIsActive = false;

refs.input.addEventListener('input', debounce(onCountryInput, 500));

function onCountryInput(e) {
  countriesApiService.searchQuery = e.target.value;

  if (countriesApiService.searchQuery.length === 0) {
    clearMarkup();
    return;
  }

  countriesApiService
    .fetchCountries()
    .then(data => {
      if (data.status === 404) {
        throw new Error();
      }

      if (data.length > 10) {
        if (noticeIsActive) {
          return;
        }
        onTooManyMatchesFound();
        return;
      }

      if (data.length > 1 && data.length < 11) {
        renderMarkup(countriesListTpl(data));
        return;
      }

      if (data.length === 1) {
        renderMarkup(countryCardTpl(data));
        return;
      }
    })
    .catch(error => {
      onError();
      e.target.value = '';
    });
}

function renderMarkup(markup) {
  refs.countryContainer.innerHTML = markup;
}

function clearMarkup() {
  refs.countryContainer.innerHTML = '';
}

function onTooManyMatchesFound() {
  noticeIsActive = true;

  setTimeout(() => {
    noticeIsActive = false;
  }, 2300);

  notice({
    type: 'notice',
    text: 'Too many matches found. Please enter a more specific query!',
    styling: 'pinctheme',
    mode: 'dark',
    modules: new Map([
      [
        Confirm,
        {
          confirm: true,
          buttons: [
            {
              text: 'Got it',
              primary: true,
              click: notice => {
                notice.close();
              },
            },
          ],
        },
      ],
    ]),
    autoOpen: 'false',
    delay: 2000,
  });
}
