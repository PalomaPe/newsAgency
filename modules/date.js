/**
 * REVIEW:
 *  El objeto Date ya soporta comparación por si mismo.
 *  Soporte los operadores: >, <, <= or >=
 *
 *  Es decir podrías hacer, date < new Date();
 *
 *  O pudes también comparar numéricamente con los segundos transcurridos.
 *  date.
 *    date.getTime() < (new Date()).getTime()
 *    date.getTime() < Date.now()
 */

// FIX: usar date como Thruthy, usar Date().getTime().

function olderDate(date) {
  if (date) {
    let currentDate = new Date();
    currentDate = currentDate.setHours(0, 0, 0, 0); // Apéndice A: campos publishedAt y modifiedAt siempre estarán es pasado
    return new Date(date).getTime() < currentDate;
  }
  return false;
}

/*
 function olderDate(date) {
  const currentDate = new Date();
  const aDate = new Date(date);
  const todayDay = currentDate.getDate();
  const todayMonth = currentDate.getMonth();
  const todayYear = currentDate.getFullYear();
  const aDay = aDate.getDate();
  const aMonth = aDate.getMonth();
  const aYear = aDate.getFullYear();

  if (aYear < todayYear) {
    return true;
  }
  if (aYear == todayYear) {
    if (aMonth < todayMonth) {
      return true;
    }
    if (aMonth == todayMonth) {
      if (aDay < todayDay) {
        return true;
      }
      return false;
    }
    return false;
  }
  return false;
}

*/

module.exports = olderDate;
