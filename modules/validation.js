let errorMessages;
const olderDate = require("./date");

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
 * ¿Qué sucede si quieres validar un rango de longitud (Min-Max)? => isMinMaxLength
 *
 * Es preferible tener funciones más pequeñas, que puedan ser ensambladas,
 * pero que hagan una solo casa y por ense tengan un solo motivo de cambio.
 */

function isEmpty(field, value) {
  if (value.trim() == "") {
    errorMessages += `          Empty ${field} field  \n`;
    return true;
  }
  return false;
}

function isNULL(field, value) {
  if (value == null) {
    errorMessages += `          Field ${field} is null \n`;
    return true;
  }
  return false;
}

function isUndefined(field, value) {
  if (value === undefined) {
    errorMessages += `          Field ${field} is undefined \n`;
    return true;
  }
  return false;
}

function IsMinLength(field, value, min) {
  if (value.length >= min) {
    return true;
  }
  errorMessages += `          Field ${field}is shorter than ${min.toString()}\n`;
  return false;
}

function isMaxLength(field, value, max) {
  if (value.length <= max) {
    return true;
  }
  errorMessages += `          Field ${field}is longer than ${max.toString()}\n`;
  return false;
}

function isMinMaxLength(field, value, min, max) {
  return IsMinLength(field, value, min) && isMaxLength(field, value, max);
}

function isString(field, value) {
  if (typeof value === "string") {
    return true;
  }
  errorMessages += `          Field ${field} is too short  \n`;
  return false;
}

function isLength(field, value, length) {
  if (value.length == length) {
    return true;
  }
  errorMessages += `          Field ${field} is not ${length} characters long \n`;
  return false;
}

/*
async function validateNullEmptyUndefindedLength(field, value, length) {
  // Review: value.trim() para ignorar espacios en blanco al inicio y al final.
  // de lo contrario el primer 'case' fallaría.
  // FIX: value.trim() to filter "     "
  switch (value.trim()) {
    case "":
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
*/

const validateID = async function (id) {
  // REVIEW: ¿Qué sucede si id no es un string?
  // Mejor: id && typeof id === 'string' && id.length != 35
  // FIX : individualizar functionalidades
  return (
    !isNULL("id", id) &&
    !isEmpty("id", id) &&
    !isUndefined("id", id) &&
    isString("id", id) &&
    isLength("id", id, 36)
  );
};

const validateTitle = async function (title) {
  return (
    !isNULL("title", title) &&
    !isEmpty("title", title) &&
    !isUndefined("title", title) &&
    isString("title", title) &&
    isMaxLength("title", title, 255)
  );
};

const validateAuthor = async function (author) {
  return (
    !isNULL("author", author) &&
    !isEmpty("author", author) &&
    !isUndefined("author", author) &&
    isString("author", author) &&
    isMaxLength("author", author, 100)
  );
};

const validateDate = function (date) {
  // REVIEW: Los 3 valores comparados son valores falsos (falsy)
  // por ende puedes hacer
  //  if (date) { ... }

  // FIX: usar date as Truthy en olderDate()
  try {
    if (olderDate(date)) {
      return true;
    } else {
      errorMessages += "          Invalid date \n";

      return false;
    }
  } catch (error) {
    errorMessages += "          Invalid date \n";
    return false;
  }
};

const validateModificationDate = async function (modifiedDate) {
  return validateDate(modifiedDate);
};

const validatePublicationDate = async function (publishedDate) {
  return (
    publishedDate === null || publishedDate == "" || validateDate(publishedDate)
  );
};

function isValidURL(string) {
  const res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res !== null;
}

const validateURL = async function (url, publishedDate) {
  if (publishedDate != null && publishedDate != "") {
    if (url != "" && url != null && isValidURL(url)) {
      const articleURL = new URL(url);
      if (`${articleURL.protocol}//` == "https://") {
        return true;
      }
      errorMessages += "          Invalid protocol \n";
      return false;
    }
    errorMessages += "          Missing URL \n";
    return false;
  }
  return true;
};

const validateKeywords = async function (keywords) {
  if (keywords) {
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
      const validKeyworks = keywords.filter(
        (keyword) => typeof keyword === "string" && keyword.trim().length > 0
      );
      const allKeywordsAreValid = validKeyworks.length === keywords.length;
      if (allKeywordsAreValid) {
        return true;
      }
      /*
      while (i < keywords.length && areValidStringValues) {
        areValidStringValues =
          typeof keywords[i] === "string" && keywords[i] != "";
        i += 1;
      }
      */
      errorMessages += "          Not all keywords are valid strings \n";
      return false;
    }
    if (keywords.length < 1)
      errorMessages += "          There is no keyword \n";
    else errorMessages += "          There are too much keywords \n";
    return false;
  }
  errorMessages += "          keywords field is falsy \n";
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
  // FIX: isInteger() y truthy value
  if (readMins) {
    if (Number.isInteger(readMins) && readMins >= 1 && readMins <= 20) {
      return true;
    }
    if (readMins < 1) errorMessages += "          Too few reading minutes \n";
    else errorMessages += "          Too much reading minutes \n";
    return false;
  }
  if (readMins == undefined)
    errorMessages += "          Missing readMins field \n";
  else errorMessages += "          readMins field is not accurate \n";
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

// FIX: crear articleValidationReview y returnResult
async function articleValidationReview(article) {
  errorMessages = "";
  await Promise.all([
    validateID(article.id),
    validateTitle(article.title),
    validateAuthor(article.author),
    validateModificationDate(article.modifiedAt),
    validatePublicationDate(article.publishedAt),
    validateURL(article.url, article.publishedAt),
    validateKeywords(article.keywords),
    validateReadMins(article.readMins),
  ]);
  return errorMessages;
}

async function returnResult(article, fileName) {
  const resultErrors = await articleValidationReview(article);
  if (resultErrors == "") {
    console.log(`VALID   - ${fileName}\n`);
    return "";
  }
  console.log(`INVALID - ${fileName}\n${errorMessages}`);
  return errorMessages;
}

async function articleValidation(article, fileName) {
  let articleIsValid = true;
  errorMessages = "";
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
    return "";
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
module.exports = Object.freeze({
  articleValidationReview,
  returnResult,
  articleValidation,
  validateID,
  validateTitle,
  validateAuthor,
  validateModificationDate,
  validatePublicationDate,
  validateURL,
  validateKeywords,
  validateReadMins,
});
