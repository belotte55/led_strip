/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable no-bitwise */

'use strict';

const pickrs = [];

const picker = (element, defaultColor, callbacks, options = {}) => {
  const pickr = Pickr.create({
    default: defaultColor,
    el: element,
    theme: 'monolith',
    comparison: true,
    defaultRepresentation: 'HEXA',

    swatches: [
      'rgba(244, 67, 54, 1)',
      'rgba(233, 30, 99, 1)',
      'rgba(156, 39, 176, 1)',
      'rgba(103, 58, 183, 1)',
      'rgba(63, 81, 181, 1)',
      'rgba(33, 150, 243, 1)',
      'rgba(3, 169, 244, 1)',
      'rgba(0, 188, 212, 1)',
      'rgba(0, 150, 136, 1)',
      'rgba(76, 175, 80, 1)',
      'rgba(139, 195, 74, 1)',
      'rgba(205, 220, 57, 1)',
      'rgba(255, 235, 59, 1)',
      'rgba(255, 193, 7, 1)',
      'rgba(255, 255, 255, 1)',
      'rgba(0, 0, 0, 1)',
    ],

    components: {
      // Main components
      preview: true,
      opacity: true,
      hue: true,

      // Input / output Options
      interaction: {
        hex: true,
        rgba: true,
        hsla: true,
        hsva: true,
        cmyk: true,
        input: true,
        clear: true,
        save: true,
      },
    },
    ...options,
  });
  Object.keys(callbacks).forEach((key) => {
    pickr.on(key, callbacks[key]);
  });

  return pickr;
};

const rainbow = (numOfSteps, step) => {
  let r;
  let g;
  let b;
  const h = step / numOfSteps;
  const i = (h * 6) | 0;
  const f = h * 6 - i;
  const q = 1 - f;
  switch (i % 6) {
    case 0: r = 1; g = f; b = 0;
      break;
    case 1: r = q; g = 1; b = 0;
      break;
    case 2: r = 0; g = 1; b = f;
      break;
    case 3: r = 0; g = q; b = 1;
      break;
    case 4: r = f; g = 0; b = 1;
      break;
    case 5: r = 1; g = 0; b = q;
      break;
    default:
      break;
  }
  return `#${`000000${(((r * 0xFF | 0) * 0x010000) + ((g * 0xFF | 0) * 0x000100) + ((b * 0xFF | 0) * 0x000001)).toString(16)}`.slice(-6)}`;
};

const setRandomPixels = () => {
  let pixels;
  let i = 0;
  do {
    pixels = generateRandomPixels(255, true);
    i += 1;
  } while (pixels.includes(null) && i < 10);
  applyPixels(pixels);
};

let randomPixelsLiveInterval;
const setRandomPixelsLive = () => {
  document.querySelector('#randomLive').style.display = 'none';
  document.querySelector('#randomLiveStop').style.display = 'inline-block';
  randomPixelsLiveInterval = true;
  randomPixelsLiveInterval = setInterval(() => {
    generateRandomPixels(300);
  }, 1000);
};

const stopRandomPixelsLive = () => {
  if (randomPixelsLiveInterval) {
    clearInterval(randomPixelsLiveInterval);
    document.querySelector('#randomLive').style.display = 'inline-block';
    document.querySelector('#randomLiveStop').style.display = 'none';
  }
};

const setRainbowPixels = () => {
  const pixels = [];
  pickrs.forEach((pickr, index) => {
    const pixel = rainbow(pickrs.length, index);
    pickr.setColor(pixel);
    pixels.push(pixel);
  });
  request('PATCH', `/api/v1/strips/${strip.id}/pixels`, { pixels });
};

const applyPixels = (pixels) => {
  pickrs.forEach((pickr, index) => {
    pickr.setColor(pixels[index]);
  });
  request('PATCH', `/api/v1/strips/${strip.id}/pixels`, { pixels });
};

function switchColors(range = 255) {
  let r;
  let g;
  let b;
  let iterations = 0;
  const sep = (range) / 3;
  do {
    r = Math.floor(Math.random() * range);
    g = Math.floor(Math.random() * range);
    b = Math.floor(Math.random() * range);
    iterations += 1;
  } while ((Math.abs(r - g) < sep || Math.abs(g - b) < sep || Math.abs(r - b) < sep) && iterations < 100);

  return `#${Math.floor(r / 16).toString(16)}${(r % 16).toString(16)}${Math.floor(g / 16).toString(16)}${(g % 16).toString(16)}${Math.floor(b / 16).toString(16)}${(b % 16).toString(16)}`;
}

const generateRandomPixels = (range, doNotApply) => {
  const pixels = [];
  pickrs.forEach((pickr) => {
    const color = switchColors(range);
    if (!doNotApply) {
      pickr.setColor(color);
    }
    pixels.push(color.length === 7 ? color : null);
  });
  if (!doNotApply) {
    request('PATCH', `/api/v1/strips/${strip.id}/pixels`, { pixels });
  }
  return pixels;
};

const setColorOnEachPixel = (color) => {
  const pixels = [];
  pickrs.forEach((pickr) => {
    pickr.setColor(color);
    pixels.push(color);
  });
  request('PATCH', `/api/v1/strips/${strip.id}/pixels`, { pixels });
};

const removeStrip = async (stripId) => {
  await request('DELETE', `/api/v1/strips/${stripId}`);
  window.location = '/';
};

window.onload = () => {
  const modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  const pixels = document.querySelectorAll('div.pixel > div.pickr');
  pixels.forEach((pixel) => {
    const updatePixel = (instance, rgba) => {
      const [r, g, b, a] = rgba;
      const color = (r | 0) * 0x010000 + (g | 0) * 0x000100 + (b | 0) * 0x000001;
      const brightness = (a * 255) | 0;
      request('PATCH', `/api/v1/strips/${strip.id}/pixel/${pixel.id}`, { color, brightness });
      instance.applyColor(true);
    };
    const callbacks = {
      changestop: (_color, instance) => updatePixel(instance, instance.getColor().toRGBA()),
      swatchselect: (_color, instance) => updatePixel(instance, instance.getColor().toRGBA()),
    };
    pickrs.push(picker(pixel, `#${pixel.parentNode.dataset.rgba.substring(2)}`, callbacks));
  });
  const setAllButton = document.querySelector('#setAll');
  picker(setAllButton, '#FFFFFFFF', {
    changestop: (_color, instance) => setColorOnEachPixel(instance.getColor().toHEXA().toString()),
    swatchselect: (_color, instance) => setColorOnEachPixel(instance.getColor().toHEXA().toString()),
  }, {
    useAsButton: true,
  });
};
