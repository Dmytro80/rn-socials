export default function getCurrentDate(separator = " ") {
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];
  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth();
  let year = newDate.getFullYear();
  let hour = newDate.getHours();
  let minutes = newDate.getMinutes();

  return `${date < 10 ? `0${date}` : `${date}`}${separator}${
    months[month]
  }${","}${separator}${year}${separator}${"|"}${separator}${
    hour < 10 ? `0${hour}` : `${hour}`
  }${":"}${minutes < 10 ? `0${minutes}` : `${minutes}`}`;
}
