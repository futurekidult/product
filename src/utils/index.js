export const formatterTime = (val) => {
  if (val !== 0) {
    let date = new Date(val * 1000);
    let year = `${date.getFullYear()}-`;
    let month = `${
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    }-`;
    let day = `${date.getDay() < 10 ? `0${date.getDay()}` : date.getDay()}  `;
    let hour = `${
      date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
    }:`;
    let minute = `${
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    }:`;
    let second = `${
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    }`;
    return year + month + day + hour + minute + second;
  } else {
    return '';
  }
};

export const timestamp = (val) => {
  let date = new Date(val);
  return date.getTime() / 1000;
};
