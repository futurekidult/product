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

export const downloadFile = (val, name) => {
  let blob = new Blob([val]);
  let link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const previewFile = (val) => {
  let a = document.createElement('a');
  a.href = val;
  a.click();
};

export const getFile = (e) => {
  let { file } = e;
  const formData = new FormData();
  formData.append('file', file);
  return formData;
};
