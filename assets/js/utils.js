/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */

const getQueryParams = () => location.search.substring(1).split('&').reduce((acc, param) => {
  const [key, value] = param.split('=');
  acc[key] = value;
  return acc;
}, {});

const getCookies = () => document.cookie.split('; ').reduce((acc, param) => {
  const [key, value] = param.split('=');
  acc[key] = value;
  return acc;
}, {});

const setCookie = (key, value) => {
  document.cookie = `${key}=${value}; Max-Age=${60 * 60 * 24 * 365}; path=/`;
};

const request = (method, path, payload) => new Promise((resolve) => {
  const url = `${path}`;

  const xhr = new XMLHttpRequest();
  xhr.open(method, url);

  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.send(payload ? JSON.stringify(payload) : '');

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      try {
        return resolve(JSON.parse(xhr.responseText));
      } catch (error) {
        return resolve(xhr.responseText);
      }
    }
  };
});

const registerToken = () => {
  const queryParams = getQueryParams();

  if (queryParams.token) {
    setCookie('token', queryParams.token);
  }
};

registerToken();
