import store from '../store/index';
import router from '../router';

export const getCategoryList = async () => {
  try {
    await store.dispatch('demand/getCategoryList');
  } catch (err) {
    return;
  }
};

export const getDemandDetail = async (id, type, flag = true) => {
  let url = '';
  if (type === 'review') {
    url = `/demand-list/review/${id}`;
  } else if (type === 'detail') {
    url = `/demand-list/${id}`;
  } else {
    url = `/demand-list/edit/${id}`;
  }
  try {
    getCategoryList();
    await store.dispatch('demand/getDemandDetail', {
      params: {
        demand_id: id
      },
      type
    });
    if (flag) {
      router.push(url);
    }
  } catch (err) {
    return;
  }
};
