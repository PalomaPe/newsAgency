function dateToFileRotateFileName() {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  day = day.toString();
  month = month.toString();
  if (day.length == 1) day = `0${day}`;
  if (month.length == 1) month = `0${month}`;
  const filename = `application-${date.getFullYear()}-${month}-${day}.log`;
  return filename;
}

module.exports = dateToFileRotateFileName;
