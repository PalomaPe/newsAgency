let errorMessages;
('use strict');
const olderDate = require('./date');

async function validateNullEmptyUndefindedLength(field, value, length) {
  switch (value) {
    case '':
      {
        errorMessages += `          Missing ${field} field  \n`;
        return false;
      }
      break;
    case null:
      {
        errorMessages += `          Field ${field} is null \n`;
        return false;
      }
      break;
    case undefined:
      {
        errorMessages += `          Field ${field} is undefined \n`;
        return false;
      }
      break;
    default:
      if (value.length < length) {
        return true;
      }
      errorMessages += `          Field ${field}is longer than ${length.toString()}\n`;
      return false;
  }
}

const validateID = async function (id) {
  if (id != null && id.length == 36) return validateNullEmptyUndefindedLength('id', id, 37);
  return false;
};

const validateTitle = async function (title) {
  return validateNullEmptyUndefindedLength('title', title, 256);
};

const validateAuthor = async function (author) {
  return validateNullEmptyUndefindedLength('author', author, 101);
};

const validateDate = function (date) {
  if (typeof date !== 'undefined' && date != null && date != '') {
    try {
      /* let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      if (new Date(date).getTime() < currentDate.getTime()) { */
      if (olderDate(date)) {
        return true;
      }
      errorMessages += '          Invalid date \n';
      return false;
    } catch (error) {
      errorMessages += '          The date format is not valid \n';
      return false;
    }
  } else return false;
};

const validateModificationDate = async function (modifiedDate) {
  return validateDate(modifiedDate);
};

const validatePublicationDate = async function (publishedDate) {
  return (
    publishedDate === null || publishedDate == '' || validateDate(publishedDate)
  );
};

function isValidURL(string) {
  const res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  );
  return res !== null;
}

const validateURL = async function (url, publishedDate) {
  if (publishedDate != null && publishedDate != '') {
    if (url != '' && url != null && isValidURL(url)) {
      const articleURL = new URL(url);
      if (`${articleURL.protocol}//` == 'https://') {
        return true;
      }
      errorMessages += '          Invalid protocol \n';
      return false;
    }
    errorMessages += '          Missing URL \n';
    return false;
  }
  return true;
};

const validateKeywords = async function (keywords) {
  let areValidStringValues = true;
  if (typeof keywords !== 'undefined' && keywords != null) {
    let i = 0;
    if (keywords.length > 0 && keywords.length < 4) {
      while (i < keywords.length && areValidStringValues) {
        areValidStringValues = typeof keywords[i] === 'string' && keywords[i] != '';
        i++;
      }
      if (areValidStringValues) {
        return true;
      }
      errorMessages += '          Not all keywords are valid strings \n';
      return false;
    }
    if (keywords.length < 1) errorMessages += '          There is no keyword \n';
    else errorMessages += '          There are too much keywords \n';
    return false;
  }
  if (keywords == undefined) {
    return true;
  }
  errorMessages += '          keywords field is empty \n';
  return false;
};

const validateReadMins = async function (readMins) {
  if (readMins != (undefined && null && '')) {
    if (readMins >= 1 && readMins <= 20) {
      return true;
    }
    if (readMins < 1) errorMessages += '          Too few reading minutes \n';
    else errorMessages += '          Too much reading minutes \n';
    return false;
  }
  if (readMins == undefined) errorMessages += '          Missing readMins field \n';
  else errorMessages += '          readMins field is empty \n';
  return false;
};

async function articleValidation(article, fileName) {
  let articleIsValid = true;
  errorMessages = '';
  const results = await Promise.all([
    validateID(article.id),
    validateTitle(article.title),
    validateAuthor(article.author),
    validateModificationDate(article.modifiedAt),
    validatePublicationDate(article.publishedAt),
    validateURL(article.url, article.publishedAt),
    validateKeywords(article.keywords),
    validateReadMins(article.readMins),
  ]);
  results.forEach((result) => {
    articleIsValid = articleIsValid && result;
  });
  if (articleIsValid) {
    console.log(`VALID   - ${fileName}\n`);
    return '';
  }
  console.log(`INVALID - ${fileName}\n${errorMessages}`);
  return errorMessages;
}

module.exports = {
  articleValidation,
  validateID,
  validateTitle,
  validateAuthor,
  validateModificationDate,
  validatePublicationDate,
  validateURL,
  validateKeywords,
  validateReadMins,
};
