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

module.exports = olderDate;
