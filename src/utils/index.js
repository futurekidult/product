export const formatterTime = (val) => {
  if (val !== 0 && val !== undefined) {
    let date = new Date(val * 1000);
    let year = `${date.getFullYear()}-`;
    let month = `${
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    }-`;
    let day = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}  `;
    let hour = `${
      date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
    }:`;
    let minute = `${
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    }:`;
    let second = `${
      date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
    }`;
    return year + month + day + hour + minute + second;
  } else {
    return '';
  }
};

export const timestamp = (val) => {
  if(val !== undefined) {
    let date = new Date(val);
    return date.getTime() / 1000;
  } else {
    return 0;
  }
};

export const downloadFile = (val, name) => {
  let link = document.createElement('a');
  link.href = val;
  link.target = '_blank';
  link.download = name;
  link.click();
};

export const previewFile = (val) => {
  let a = document.createElement('a');
  a.target = '_blank';
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
    670: 'product_package',
    680: 'product_package',
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

export const checkFile = (val) => {
  return {
    max: val,
    message: `不能超过${val}个`
  };
};

export const changeTimestamp = (obj, str) => {
  obj[str] = formatterTime(obj[str]);
};

export const getOrganizationList = async () => {
  let data = JSON.parse(localStorage.getItem('organization'));
  if(data) {
     for (let key in data) {
      childrenFunc(data[key]);
    }
    localStorage.setItem('list', JSON.stringify(data));
    let result = JSON.parse(localStorage.getItem('list'));
    return result;
  } else {
     await this.$store.dispatch('getOrganizationList');
     getOrganizationList();
  }
}

export const childrenFunc = (data) => {
  if (data.member_list) {
    data.children = data.children.concat(data.member_list);
    if(JSON.stringify(data.children) === '[]') {
      data.disabled = true;
    }
    for(let key in data.children) {
      childrenFunc(data.children[key]);
    } 
  }
}