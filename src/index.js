import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');
inputEl.addEventListener('input', debounce(onInputName, DEBOUNCE_DELAY));

function onInputName(event) {
  event.preventDefault();
  const countryName = event.target.value.trim();
  if (countryName === '') {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
    return;
  }

  fetchCountries(countryName).then(checkArrayLength).catch(fail);
}

function checkArrayLength(array) {
  if (array.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (array.length >= 2 && array.length <= 10) {
    countryInfoEl.innerHTML = '';

    createCountryList(array);
  } else if (array.length === 1) {
    countryListEl.innerHTML = '';
    createCountryCard(array);
  }
}

function createCountryCard(array) {
  const countryObj = array[0];
  const { name, capital, population, flags, languages } = countryObj;
  const coutryCard = `<ul class='country-info-list nolist'>
                <li class='country-info-item'><img src ='${flags.svg}'
                 alt ='flag of ${name.official}' width ='40' height ='30'/>    
                <p> ${name.official}</p></li>
                <li class='country-info-item'><span>Capital:</span> ${capital}</li>
                <li class='country-info-item'><span>Population: </span>${population}</li>
                <li class='country-info-item'><span>Languages:</span> ${Object.values(
                  languages
                )}</li>
                </ul>`;
  addCardToHTML(coutryCard);
}

function createCountryList(array) {
  let countryList = '';
  for (let { flags, name } of array) {
    countryList += `<li class='country-list-item'><img src='${flags.svg}' 
        alt='flag of ${name.official}'width ='30' height ='20'/><p> ${name.official}</p></li>`;
  }
  addListToHTML(countryList);
}

function addCardToHTML(element) {
  countryInfoEl.innerHTML = element;
}
function addListToHTML(element) {
  countryListEl.innerHTML = element;
}
function fail() {
     countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
  Notify.failure('Oops, there is no country with that name');
}
