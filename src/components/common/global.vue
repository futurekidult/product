<script>
import {
  setApproveStateColor,
  setProductStateColor,
  setDemandReviewStateColor
} from '../../utils/index.js';

const reviewOptions = [
  {
    label: '请选择',
    value: -1,
    disabled: true
  },
  {
    label: '通过',
    value: 1
  },
  {
    label: '不通过',
    value: 0
  }
];

const heymeLink =
  'https://docs.dingtalk.com/i/nodes/qXomz1wAyjKVXOMMQezxW3Y9pRBx5OrE?nav=share&navQuery=spaceId%3D9JOGO7YJjJAJeG4Q';

const haomiLink =
  'https://docs.dingtalk.com/i/nodes/jkB7yl4ZK3vV6Z99aRLeVPMX2O6oxqw0?nav=share&navQuery=spaceId%3DxMEGYV9n6db25zoQ';

const defaultTime = new Date(2000, 1, 1, 23, 59, 59);

//终止前状态对应阶段二进制表示方法
const unterminatedStateCode = {
  10: 0b00000000111,
  20: 0b00000001111,
  30: 0b00000001111,
  40: 0b00000011111,
  50: 0b00111111111,
  60: 0b01111111111,
  70: 0b11111111111
};

//产品定位与项目调研映射
const categoryProductMap = {
  0b11: {
    0: 0b111111,
    10: 0b000011,
    20: 0b000011,
    30: 0b000111,
    40: 0b011111,
    50: 0b011111,
    60: 0b111111
  },
  0b10: {
    0: 0b010011,
    10: 0b000011,
    20: 0b000011,
    50: 0b010011
  },
  0b01: {
    0: 0b111001,
    20: 0b000001,
    40: 0b011001,
    50: 0b011001,
    60: 0b111001
  },
  0b00: {
    0: 0b010001,
    20: 0b000001,
    50: 0b010001
  }
};

const supplierTableColumn = [
  { prop: 'id', label: '供应商ID', width: 100, fixed: 'left' },
  { prop: 'name', label: '供应商名称', fixed: 'left', min_width: 150 },
  { prop: 'type', label: '供应商类型', min_width: 100 },
  { prop: 'cooperation_level', label: '合作等级', min_width: 150 },
  { prop: 'purchase_specialist', label: '采购员' },
  { prop: 'create_time', label: '创建时间', width: 200 },
  { prop: 'approval_time', label: '审批完成时间', width: 200 },
  {
    prop: 'state',
    label: '状态',
    width: 100,
    formatter: (row) => {
      return setApproveStateColor(row.state);
    },
    getSpecialProp: (row) => {
      return row.state_desc;
    }
  }
];

const demandTableColumn = [
  { prop: 'id', label: '需求ID', width: 100, fixed: 'left' },
  { prop: 'name', label: '产品名称', fixed: 'left', min_width: 150 },
  { prop: 'product_id', label: '关联产品ID', width: 100, 'is-link': true },
  { prop: 'creator_desc', label: '创建人' },
  { prop: 'ding_dept_desc', label: '所属部门', min_width: 150 },
  { prop: 'create_time', label: '创建时间', width: 200 },
  { prop: 'review_finish_time', label: '评审完成时间', width: 200 },
  {
    prop: 'state',
    label: '状态',
    width: 100,
    formatter: (row) => {
      return setDemandReviewStateColor(row.state);
    },
    getSpecialProp: (row) => {
      return row.state_desc;
    }
  },
  {
    prop: 'review_failed_reason',
    label: '不通过原因',
    width: 100,
    'is-reason': true
  }
];
const productTableColumn = [
  { prop: 'id', label: '产品ID', width: 100, fixed: 'left' },
  { prop: 'name', label: '产品名称', fixed: 'left', min_width: 150 },
  { prop: 'demand_id', label: '关联需求ID', width: 100, 'is-link': true },
  { prop: 'category', label: '品类' },
  { prop: 'positioning_desc', label: '产品定位', min_width: 100 },
  { prop: 'project_administrator', label: '项目管理员', width: 200 },
  { prop: 'create_time', label: '创建时间', width: 200 },
  {
    prop: 'state',
    label: '状态',
    width: 100,
    formatter: (row) => {
      return setProductStateColor(row.state);
    },
    getSpecialProp: (row) => {
      return row.state_desc;
    }
  }
];

const pagination = Object.freeze({
  current_page: 1,
  page_size: 10
});

export default {
  reviewOptions,
  heymeLink,
  haomiLink,
  pagination,
  defaultTime,
  unterminatedStateCode,
  categoryProductMap,
  demandTableColumn,
  productTableColumn,
  supplierTableColumn
};
</script>
