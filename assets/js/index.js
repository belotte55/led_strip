/* eslint-disable no-undef */

const createStrip = async () => {
  const name = document.querySelector('input#name').value;
  const length = +document.querySelector('input#length').value;

  const strip = await request('POST', '/api/v1/strips', {
    name,
    length,
  });
  window.location = `/strip/${strip.id}`;
};

window.onload = () => {};
