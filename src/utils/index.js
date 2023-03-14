import store from '../store/index';

export const formatterTime = (val) => {
  if (val !== 0 && val !== undefined) {
    let date = new Date(val * 1000);
    let year = `${date.getFullYear()}-`;
    let month = `${
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    }-`;
    let day = `${
      date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    }  `;
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
  if (val !== undefined) {
    let date = new Date(val);
    return date.getTime() / 1000;
  } else {
    return 0;
  }
};

export const download = (href, filename, type) => {
  const a = document.createElement('a');
  a.href = href;
  if (type === 'download') {
    a.download = filename;
  } else {
    a.target = '_blank';
  }
  document.body.appendChild(a);
  a.click();
  a.remove();
};

export const previewOrDownloadFile = (url, filename = '', type) => {
  fetch(url, {
    mode: 'cors'
  })
    .then((res) => {
      return res.blob();
    })
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      download(blobUrl, filename, type);
      window.URL.revokeObjectURL(blobUrl);
    });
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
    20: 'product_survey_market',
    30: 'product_survey_platform',
    40: 'product_survey_analysis',
    50: 'product_survey_plan',
    51: 'product_survey_plan',
    60: 'product_survey_risk',
    70: 'product_survey_user',
    80: 'product_survey_user',
    90: 'product_survey_user',
    100: 'product_survey_user',
    110: 'product_survey_user',
    130: 'product_survey_user',
    140: 'product_survey_user',
    150: 'product_survey_user',
    160: 'product_survey_user',
    170: 'product_survey_user',
    180: 'product_survey_user',
    190: 'product_survey_user',
    191: 'product_survey_user',
    200: 'product_survey_user',
    210: 'product_survey_user',
    220: 'product_survey_user',
    230: 'product_survey_user',
    240: 'product_survey_user',
    250: 'product_survey_user',
    260: 'product_survey_user',
    270: 'product_survey_user',
    280: 'product_survey_user',
    290: 'product_survey_user',
    300: 'product_project',
    310: 'product_project',
    320: 'price',
    330: 'product_project',
    340: 'product_project',
    350: 'product_project',
    360: 'product_patent_contract',
    370: 'product_patent_contract',
    380: 'product_patent_contract',
    390: 'product_patent_patent-report',
    400: 'product_patent_patent-report',
    410: 'product_mould',
    420: 'sample_proofing',
    421: 'sample_proofing',
    430: 'sample_test_quality',
    435: 'sample_test_quality',
    440: 'sample_test_quality',
    445: 'sample_test_quality',
    450: 'sample_test_quality',
    451: 'sample_test_quality',
    460: 'sample_test_quality',
    470: 'sample_test_agency',
    480: 'sample_test_agency',
    490: 'sample_test_agency',
    500: 'sample_test_user',
    510: 'sample_test_user',
    520: 'sample_test_user',
    530: 'sample_test_user',
    540: 'sample_test_user',
    550: 'sample_test_user',
    560: 'sample_test_user',
    570: 'sample_test_user',
    580: 'sample_base',
    590: 'price',
    600: 'product_order_sku',
    610: 'product_order_sku',
    620: 'product_order_contract',
    630: 'product_order_contract',
    640: 'product_order_pre-production-sample',
    650: 'product_order_pre-production-sample',
    660: 'product_order_pre-production-sample',
    670: 'product_package',
    680: 'product_package',
    690: 'mould_design',
    700: 'mould_prototype',
    710: 'mould_prototype',
    720: 'mould_mould-open',
    730: 'mould_mould-open',
    740: 'mould_mould-test',
    750: 'mould_mould-test',
    755: 'supplier_supplier-qualification-update',
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
  if (data) {
    for (let key in data) {
      childrenFunc(data[key]);
    }
    localStorage.setItem('list', JSON.stringify(data));
    let result = JSON.parse(localStorage.getItem('list'));
    return result;
  } else {
    await store.dispatch('getOrganizationList');
    getOrganizationList();
  }
};

export const childrenFunc = (data) => {
  if (data.member_list) {
    data.children = data.children.concat(data.member_list);
    if (JSON.stringify(data.children) === '[]') {
      data.disabled = true;
    }
    for (let key in data.children) {
      childrenFunc(data.children[key]);
    }
  }
};

export const changeDemandColor = (val) => {
  if (val === 20) {
    return 'warning';
  } else if (val === 30) {
    return 'success';
  } else {
    return 'danger';
  }
};

export const setDisabledDate = (time) => {
  return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
};

//设置状态颜色
export const setStateColor = (state) => {
  let className = '';
  switch (state) {
    case 10:
    case 20:
      className = 'result-ing';
      break;
    case 2:
    case 30:
    case 50:
    case 0:
      className = 'result-fail';
      break;
    case 1:
    case 40:
      className = 'result-pass';
      break;
    case 3:
      className = 'result-ignore';
      break;
    default:
  }
  return className;
};

//设置需求评审状态颜色
export const setDemandReviewStateColor = (state) => {
  if (state === 20) {
    return 'result-ing';
  } else if (state === 30) {
    return 'result-pass';
  } else if (state === 40) {
    return 'result-fail';
  } else {
    return '';
  }
};

//设置产品所处阶段颜色
export const setProductStateColor = (state) => {
  if (state === 30 || state === 90) {
    return 'result-fail';
  } else if (state === 80) {
    return 'result-pass';
  } else {
    return 'result-ing';
  }
};

//设置评审状态颜色
export const setReviewStateColor = (state) => {
  if (state === 10) {
    return 'result-ing';
  } else if (state === 30) {
    return 'result-pass';
  } else {
    return 'result-fail';
  }
};

//设置项目进度计划表状态颜色
export const setProductScheduleStateColor = (state) => {
  if (state === 10) {
    return 'result-ing';
  } else if (state === 20) {
    return 'result-pass';
  } else {
    return 'result-fail';
  }
};

//设置定价状态颜色
export const setPricingStateColor = (state) => {
  if (state <= 20) {
    return 'result-ing';
  } else {
    return 'result-pass';
  }
};
//设置包材状态颜色
export const setPackageStateColor = (state) => {
  if (state === 10) {
    return 'result-ing';
  } else {
    return 'result-pass';
  }
};

//设置样品状态颜色
export const setSampleStateColor = (state) => {
  if (state <= 25) {
    return 'result-ing';
  } else if (state === 30) {
    return 'result-pass';
  } else {
    return 'result-fail';
  }
};

//设置测试问题状态颜色
export const setQuestionStateColor = (state) => {
  if (state === 10) {
    return 'result-ing';
  } else if (state === 20) {
    return 'result-pass';
  } else {
    return 'result-ignore';
  }
};

//设置下单状态颜色
export const setOrderStateColor = (state) => {
  if (state <= 30) {
    return 'result-ing';
  } else {
    return 'result-pass';
  }
};

//页码重置
export const resetPagination = (pagination, page, size) => {
  pagination.current_page = page;
  pagination.page_size = size;
};

//设置审批状态颜色
export const setApproveStateColor = (state) => {
  if (state === 10 || state === 5) {
    return 'result-ing';
  } else if (state === 20) {
    return 'result-fail';
  } else {
    return 'result-pass';
  }
};

//设置模具状态颜色
export const setMouldStateColor = (state) => {
  if (state === 40) {
    return 'result-pass';
  } else {
    return 'result-ing';
  }
};

//设置调价页面总状态颜色
export const setQuotationStateColor = (state) => {
  if (state === 20 || state === 30) {
    return 'result-pass';
  } else if (state === 10) {
    return 'result-ignore';
  } else {
    return 'result-fail';
  }
};

//设置调研进度颜色
export const setSurveyScheduleStateColor = (state) => {
  if (state === 10 || state === 20) {
    return 'result-ing';
  } else if (state >= 40) {
    return 'result-pass';
  } else if (state === 30 || state === 35) {
    return 'result-fail';
  } else {
    return '';
  }
};

//表单项重置，并移除校验结果
export const resetFormFields = (form) => {
  setTimeout(() => {
    form.resetFields();
  }, 100);
};

//设置tab入口
export const setEntry = (name, tab) => {
  if (store.state.entry !== 'workbench') {
    store.commit(name, tab);
  }
};

//判断草稿状态下，平台调研表单所有属性值是否为空值
export const checkPlatformValueAllEmpty = (form) => {
  let isEmpty = true;
  for (let item in form) {
    if (item === 'images' && form[item].length > 0) {
      isEmpty = false;
    } else if (item !== 'images' && form[item]) {
      isEmpty = false;
    }
  }
  return isEmpty;
};

//判断草稿状态下，产品方案表单所有属性值是否为空值
export const checkPlanValueAllEmpty = (form) => {
  let isEmpty = true;
  for (let item in form) {
    if (item === 'attachment' && form[item].length > 0) {
      isEmpty = false;
    } else if (item === 'usage_scenario' && form[item][0].length !== 0) {
      isEmpty = false;
    } else if (
      item !== 'attachment' &&
      item !== 'usage_scenario' &&
      form[item]
    ) {
      isEmpty = false;
    }
  }
  return isEmpty;
};

//草稿状态下将数据为-1, 0的处理为空
export const handleExceptionData = (arr, obj) => {
  arr.forEach((item) => {
    if (obj[item] === -1 || obj[item] === 0) {
      obj[item] = '';
    }
  });
};

//(平台调研，产品方案，供应商)将数据为空值的属性变成0, -1传递给后端
export const changeRequestValue = (negativeArr, zeroArr, obj) => {
  negativeArr.forEach((item) => {
    if (obj[item] === '') {
      obj[item] = -1;
    }
  });
  zeroArr.forEach((item) => {
    if (obj[item] === '') {
      obj[item] = 0;
    }
  });
};
