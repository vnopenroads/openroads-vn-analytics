import sectionFields from './section-fields';

module.exports.getSectionValue = function (property, value) {
  if (sectionFields[property] && sectionFields[property].strings) {
    return sectionFields[property].strings.options[value];
  } else {
    return value;
  }
};
