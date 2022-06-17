export const formatterTime = (val) => {
  if (val !== 0 && val !== undefined) {
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

export const getTask = (val) => {
  let task = {
    10: 'demand',
    20: 'product_survey',
    30: 'product_survey',
    40: 'product_survey',
    50: 'product_survey',
    60: 'product_survey',
    70: 'product_survey',
    80: 'product_survey',
    90: 'product_survey',
    100: 'product_survey',
    110: 'product_survey',
    120: 'product_survey',
    130: 'product_survey',
    140: 'product_survey',
    150: 'product_survey',
    160: 'product_survey',
    170: 'product_survey',
    180: 'product_survey',
    190: 'product_survey',
    191: 'product_survey',
    200: 'product_survey',
    210: 'product_survey',
    220: 'product_survey',
    230: 'product_survey',
    240: 'product_survey',
    250: 'product_survey',
    260: 'product_survey',
    270: 'product_survey',
    280: 'product_survey',
    290: 'product_survey',
    300: 'product_project',
    310: 'product_project',
    320: 'price',
    330: 'product_project',
    340: 'product_project',
    350: 'product_project',
    360: 'product_patent',
    370: 'product_patent',
    380: 'product_patent',
    390: 'product_patent',
    400: 'product_patent',
    410: 'product_mould',
    420: 'sample_proofing',
    421: 'sample_proofing',
    430: 'sample_test',
    440: 'sample_test',
    450: 'sample_test',
    460: 'sample_test',
    470: 'sample_test',
    480: 'sample_test',
    490: 'sample_test',
    500: 'sample_test',
    510: 'sample_test',
    520: 'sample_test',
    530: 'sample_test',
    540: 'sample_test',
    550: 'sample_test',
    560: 'sample_test',
    570: 'sample_test',
    580: 'sample_base',
    590: 'price',
    600: 'product_order',
    610: 'product_order',
    620: 'product_order',
    630: 'product_order',
    640: 'product_order',
    650: 'product_order',
    660: 'product_order',
    670: 'product_packager',
    680: 'product_packager',
    690: 'mould_design',
    700: 'mould_prototype',
    710: 'mould_prototype',
    720: 'mould_mouldopen',
    730: 'mould_mouldopen',
    740: 'mould_mouldtest',
    750: 'mould_mouldtest',
    760: 'supplier'
  };
  let value = task[val].split('_');
  return value;
};

export const checkValid = (val) => {
  return {
    max: val,
    message: `长度不超过${val}个字符`
  };
};
