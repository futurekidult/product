import '../assets/css/table.css';

export default (app) => {
  app.directive('fit-columns', {
    mounted(el, binding) {
      setTimeout(() => {
        adjustColumnWidth(el, binding.value);
      }, 50);
    },
    updated(el, binding) {
      el.classList.add('r-table');
      setTimeout(() => {
        adjustColumnWidth(el, binding.value);
      }, 50);
    }
  });
};

const adjustColumnWidth = (table, padding = 0) => {
  const colgroup = table.querySelector('colgroup');
  const colDefs = [...colgroup.querySelectorAll('col')];
  colDefs.forEach((col) => {
    const clsName = col.getAttribute('name');
    const cells = [
      ...table.querySelectorAll(`td.${clsName}`),
      ...table.querySelectorAll(`th.${clsName}`)
    ];
    if (cells[0]?.classList?.contains?.('leave-alone')) {
      return;
    }
    const widthList = cells.map((el) => {
      return el.querySelector('.cell')?.scrollWidth || 0;
    });
    const max = Math.max(...widthList);
    table.querySelectorAll(`col[name=${clsName}]`).forEach((el) => {
      const oldWidth = el.offsetWidth;
      if (max > oldWidth) {
        el.setAttribute('width', max + padding);
      }
    });
  });
};
