export default function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=flags,name,capital,languages,population`
  );
}
