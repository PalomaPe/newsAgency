let errorMessages;
const olderDate = require('./date');

/**
 * REVIEW:
 * Idealmente vas a querer tener varios validadores reutilizables
 * IsEmpty()
 * IsNull()
 * IsMinLength()
 *
 * Como buena practica de coding, las funciones deberina tener solo una razon de cambio.
 * En este caso, necesitas el valor, mas la longitud minima requerida
 *
 * ¿Qué sucede si quieres validar un rango de longitud (Min-Max)?
 *
 * Es preferible tener funciones más pequeñas, que puedan ser ensambladas,
 * pero que hagan una solo casa y por ense tengan un solo motivo de cambio.
 */
async function validateNullEmptyUndefindedLength(field, value, length) {
  // Review: value.trim() para ignorar espacios en blanco al inicio y al final.
  // de lo contrario el primer 'case' fallaría.
  switch (value) {
    case '':
      errorMessages += `          Missing ${field} field  \n`;
      return false;
    case null:
      errorMessages += `          Field ${field} is null \n`;
      return false;
    case undefined:
      errorMessages += `          Field ${field} is undefined \n`;
      return false;
    default:
      if (value.length <= length) {
        return true;
      }
      errorMessages += `          Field ${field}is longer than ${length.toString()}\n`;
      return false;
  }
}

const validateID = async function (id) {
  // REVIEW: ¿Qué sucede si id no es un string?
  // Mejor: id && typeof id === 'string' && id.length != 35
  if (id != null && id.length > 35) return validateNullEmptyUndefindedLength('id', id, 36);

  errorMessages += '          Field id is shorter than 36\n';
  return false;
};

const validateTitle = async function (title) {
  return validateNullEmptyUndefindedLength('title', title, 255);
};

const validateAuthor = async function (author) {
  return validateNullEmptyUndefindedLength('author', author, 100);
};

const validateDate = function (date) {
  // REVIEW: Los 3 valores comparados son valores falsos (falsy)
  // por ende puedes hacer
  //  if (date) { ... }
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
      /**
       * Una forma legible de optimizar esta logica seria utilizando las funciones de array.
       *
       * const validKeyworks = keywords.filter(keyword => typeof keyword === 'string' && keyword.trim().length > 0);
       * const allKeywordsAreValid = validKeyworks.length === keywords.length;
       * if (!allKeywordsAreValid) {
       *   ...
       * }
       */
      while (i < keywords.length && areValidStringValues) {
        areValidStringValues = typeof keywords[i] === 'string' && keywords[i] != '';
        i += 1;
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
  /**
   * REVIEW: Utiliza Number.isInteger() para comprobar si es un numero.
   *
   * if (!Number.isInteger(readMins) || (readMins >= 1 && readMins <= 20)) {
   *    ...
   * }
   */
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

/**
 * REVIEW:
 *  El único motivo por el cual la función necesita el parámetro fileName
 *  es para indicar que el archivo no es válido.
 *
 *  Mi recomendación es hacer que la función devuelva el mensaje de error,
 *  y sea la función que llama quien imprima o no el mensaje con el fileName.
 *
 *  De este modo, la función articleValidation solo se enfoca en validar el article
 *  y no en cómo mostrar el mensaje.
 *
 *  Adicionalmente
 *   - ¿Qué sucede si tienes el artículo, lo quieres validar, pero no tiene el fileName?
 */
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

/**
 * REVIEW:
 *  Dado que los objetos en JavaScript son valores por referencia,
 *  lo correcto sería exportar una definición freeze que no pueda ser modificada.
 *
 *   module.exports = Object.freeze({
 *     articleValidation,
 *     validateID,
 *     ...
 *     ...
 *   });
 */
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
