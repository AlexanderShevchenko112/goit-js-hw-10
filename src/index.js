import './css/styles.css';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries.js';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
let searchQuery = ``;
const input = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryCard = document.querySelector('.country-info');

input.addEventListener('input', debounce(getCountryInfo, DEBOUNCE_DELAY));

function getCountryInfo(event) {
  searchQuery = event.target.value.trim();
  if (searchQuery === ``) {
    return;
  }
  fetchCountries(searchQuery)
    .then(response => {
      if (!response.ok) {
        resetCountryCard();
        resetCountriesList();
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
      return response.json();
    })
    .then(countries => {
      console.log(countries);
      if (countries.length > 10) {
        resetCountryCard();
        resetCountriesList();
        Notiflix.Notify.warning(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        resetCountryCard();
        createCountrieslistMarkup(countries);
      } else if (countries.length === 1) {
        resetCountriesList();
        createCountryCardMarkup(countries);
      }
    })
    .catch(error => {
      console.log(error);
    });
}
function resetCountryCard() {
  countryCard.innerHTML = '';
}

function resetCountriesList() {
  countryList.innerHTML = '';
}

function createCountrieslistMarkup(countries) {
  const listMarkup = countries
    .map(country => {
      return `<p class="country-name">
        <span class="country-flag">
        <img src="${country.flags.svg}" width="20px" height="20px">
        </span> <b>${country.name.official}</b>
        </p>`;
    })
    .join(``);
  countryList.innerHTML = listMarkup;
}

function createCountryCardMarkup(countries) {
  const cardMarkup = countries
    .map(country => {
      return `<div class="country-card">
    <p class="country-name">
        <span class="country-flag">
        <img src="${country.flags.svg}" width="50px" height="20px">
        </span> <b>${country.name.official}</b>
    </p>
    <ul class="list">
    <li>
    <p class="decription-text"> <b>Capital:</b> ${country.capital}</p>
    </li>
    <li>
    <p class="decription-text"> <b>Population:</b> ${country.population}</p>
    </li>
    <li>
    <p class="decription-text"> <b>Languages:</b> ${Object.values(
      country.languages
    )}</p>
    </li>
    </ul>
</div>`;
    })
    .join(``);
  countryCard.innerHTML = cardMarkup;
}
