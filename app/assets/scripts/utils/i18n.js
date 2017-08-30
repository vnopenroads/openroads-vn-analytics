'use strict';
import React from 'react';

let currentLang = 'en';

const STRINGS = {
  en: require('../../locales/source/en.json'),
  vi: require('../../locales/vi.json')
};

export function setLanguage (lang) {
  currentLang = lang;
}

export function getLanguage () {
  return currentLang;
}

export function getLanguageName () {
  return getAvailableLanguages().find(l => l.key === getLanguage()).name;
}

export function getAvailableLanguages () {
  return [
    {key: 'en', name: 'English'},
    {key: 'vi', name: 'Vietnamese'}
  ];
}

export function isValidLanguage (key) {
  return !!getAvailableLanguages().find(l => l.key === key);
}

export function t (string, replace = {}, isReactEnabled = null) {
  if (!STRINGS[currentLang][string]) {
    if (process.env.DS_ENV === 'testing') {
      throw new Error(`Missing (${currentLang}) translation for (${string})`);
    }
    if (process.env.DS_ENV !== 'production') {
      markMissing(string);
      // console.warn(`Missing (${currentLang}) translation for (${string})`);
    }
  }

  // Autodetect if the string is react enabled by checking for any
  // react component. If isReactEnabled value is not null, we assume the
  // passed value.
  if (isReactEnabled === null) {
    // Autodetect.
    isReactEnabled = Object.values(replace).some(o => React.isValidElement(o));
  }

  let res = STRINGS[currentLang][string] || string;
  let regex = new RegExp(`({[a-z0-9-]+})`);
  let pieces = res.split(regex).filter(o => o !== '');
  Object.keys(replace).forEach(repKey => {
    let index = pieces.indexOf(`{${repKey}}`);
    if (index !== -1) {
      pieces[index] = replace[repKey];
    }
  });

  if (isReactEnabled) {
    // Add a key to each react component.
    // Return as an array to be handled by react.
    return pieces.map((o, i) => {
      // Is it a react component?
      if (React.isValidElement(o)) {
        // Clone the element adding a key if there isn't one.
        return React.cloneElement(o, {key: o.key || `i18n-piece-${i}`});
      }
      return o;
    });
  } else {
    // Return as normal string.
    return pieces.join('');
  }
}

//
// Language helper to cache the missing translation for easier access.
// Used for development only.
//

let missingTranslationCache = {};

function markMissing (string) {
  let cache = missingTranslationCache;
  let l = getLanguage();

  if (!cache[l]) {
    cache[l] = [];
  }

  if (cache[l].indexOf(string) === -1) {
    cache[l].push(string);
  }
}

window.getMissingTranslations = () => missingTranslationCache;
window.getMissingTranslationsJSON = () => JSON.stringify(missingTranslationCache, null, '  ');
