/* eslint-disable no-undef */

const createStrip = async () => {
  const name = document.querySelector('input#name').value;
  const length = +document.querySelector('input#length').value;
  const offset = +document.querySelector('input#offset').value;

  const strip = await request('POST', '/api/v1/strips', {
    name,
    length,
    offset,
  });
  window.location = `/strip/${strip.id}`;
};

window.onload = () => {};
