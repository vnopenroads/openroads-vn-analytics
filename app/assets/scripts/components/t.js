import React, {
  PropTypes
} from 'react';
import {
  getContext
} from 'recompose';
import en from '../../locales/source/en.json';
import vi from '../../locales/vi.json';


export const translate = (language, str) => {
  if (language === 'en' && en[str]) {
    return en[str];
  } else if (language === 'vi' && vi[str]) {
    return vi[str];
  }

  if (language === 'en' && process.env.DS_ENV !== 'production') {
    console.warn('No english translation for', str);
  }

  return str;
};


const T = ({ language, children: str }) => {
  if (language === 'en' && en[str]) {
    return <span>{en[str]}</span>;
  } else if (language === 'vi' && vi[str]) {
    return <span>{vi[str]}</span>;
  }

  if (language === 'en' && process.env.DS_ENV !== 'production') {
    console.warn('No english translation for', str);
  }

  return <span>{str}</span>;
};


T.propTypes = {
  language: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired
};


export default getContext({ language: PropTypes.string })(T);
