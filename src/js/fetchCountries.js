import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const refs = {
  input: document.querySelector('#search-box'),
  countriesList: document.querySelector('.country-list'),
  countriesInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, 300));

function onInput(e) {
  let name = e.target.value;
  let newName = name.trim();
  refs.countriesList.innerHTML = '';
  refs.countriesInfo.innerHTML = '';
  
  if (name === '') {
    return
  }

  fetchCountries(newName).then(country => {
    console.log(country.length);

    if (country.length > 10) {
      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
    }
    if (country.length >= 2 && country.length < 10) {
      refs.countriesInfo.innerHTML = '';
      renderCountriesList(country);
    }
    if (country.length === 1) {
      refs.countriesList.innerHTML = '';
      renderCountriesInfo(country);
    }
  });
}

function renderCountriesList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `<li>
      <img src="${flags.svg}" alt="flag" width=30 height=20/>
      <p>${name.official}</p>
    </li>`;
    })
    .join('');

  return (refs.countriesList.innerHTML = markup);
}

function renderCountriesInfo(countries) {
  const markup = countries
    .map(({ name, flags, capital, population, languages }) => {
    //   console.log(name)
      return `<li>
                <div>
                    <img src="${flags.svg}" alt="flag" width=30 height=20/>
                    <p>${name.official}</p>
                    <p>Capital: ${capital}</p>
                    <p>Population: ${population}</p>
                    <p>Languages: ${Object.values(languages)}</p>
                </div>
            </li>`;
    })
    .join('');
  return (refs.countriesInfo.innerHTML = markup);
}

const BASE_URL = 'https://restcountries.com/v3.1/name/';
const params = 'name,capital,population,flags,languages';

function fetchCountries(name) {
  return fetch(`${BASE_URL}${name}?fields=${params}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => {
      refs.countriesList.innerHTML = '';
      refs.countriesInfo.innerHTML = '';
      return Notiflix.Notify.failure(
        'Oops, there is no country with that name'
      );
    });
}
