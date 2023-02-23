<script>
import {
  setOrderStateColor,
  setApproveStateColor,
  setProductStateColor,
  setReviewStateColor,
  setSampleStateColor,
  setQuestionStateColor,
  setPricingPackageStateColor,
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
  { prop: 'product_id', label: '关联产品ID', width: 100, is_link: true },
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
    is_operation: true
  }
];

const pricingTableColumn = [
  { prop: 'id', label: '定价ID', width: 100, fixed: 'left' },
  { prop: 'market_desc', label: '市场', min_width: 100 },
  { prop: 'platform', label: '平台', min_width: 100 },
  { prop: 'final_confirmed_price', label: '最终确认定价', min_width: 150 },
  { prop: 'estimated_finish_time', label: '计划完成时间', width: 200 },
  { prop: 'first_submit_time', label: '首次提交报价时间', width: 200 },
  { prop: 'confirm_time', label: '最终确认定价时间', width: 200 },
  { prop: 'related_sample_count', label: '关联样品流程数', min_width: 150 },
  {
    prop: 'state',
    label: '状态',
    width: 100,
    fixed: 'right',
    formatter: (row) => {
      return setPricingPackageStateColor(row.state);
    },
    getSpecialProp: (row) => {
      return row.state_desc;
    }
  }
];

const patentTableColumn = [
  { prop: 'id', label: '专利申请ID', width: 100, fixed: 'left' },
  { prop: 'applicant', label: '申请人' },
  { prop: 'submit_time', label: '提交时间', width: 200 },
  { prop: 'review_time', label: '评审完成时间', width: 200 },
  { prop: 'patent_types', label: '专利类型' },
  {
    prop: 'review_state',
    label: '评审状态',
    width: 200,
    formatter: (row) => {
      return setReviewStateColor(row.review_state);
    },
    getSpecialProp: (row) => {
      return row.review_state_desc;
    }
  }
];

const sampleMessageTableColumn = [
  { prop: 'id', label: '样品ID', width: 100, fixed: 'left' },
  { prop: 'pricing_id', label: '关联定价ID', width: 110, fixed: 'left' },
  { prop: 'platform', label: '平台', min_width: 100 },
  { prop: 'demand_quantity', label: '需求数量', min_width: 100 },
  { prop: 'demand_time', label: '需求日期', width: 200 },
  { prop: 'has_verify', label: '有无认证', min_width: 100 },
  { prop: 'supplier_id', label: '供应商ID', width: 100 },
  {
    prop: 'purchase_specialist',
    label: '采购员',
    min_width: 100
  },
  { prop: 'estimated_finish_time', label: '计划完成时间', width: 200 },
  { prop: 'actual_finish_time', label: '实际完成时间', width: 200 },
  {
    prop: 'state',
    label: '状态',
    min_width: 100,
    formatter: (row) => {
      return setSampleStateColor(row.state);
    },
    getSpecialProp: (row) => {
      return row.state_desc;
    }
  }
];

const questionTableColumn = [
  { prop: 'id', label: '问题ID', width: 100, fixed: 'left' },
  {
    prop: 'sample_id',
    label: '关联样品ID',
    width: 110,
    fixed: 'left',
    is_link: true
  },
  { prop: 'pricing_id', label: '关联定价ID', width: 110, fixed: 'left' },
  { prop: 'name', label: '问题名称', min_width: 150 },
  {
    prop: 'consequence',
    label: '后果描述',
    min_width: 250,
    is_description: true
  },
  { prop: 'record_time', label: '记录时间', width: 200 },
  { prop: 'source', label: '问题来源', min_width: 150 },
  { prop: 'purchase_specialist', label: '采购员', min_width: 100 },
  { prop: 'resolve_time', label: '解決时间', width: 200 },
  {
    prop: 'state',
    label: '状态',
    min_width: 100,
    formatter: (row) => {
      return setQuestionStateColor(row.state);
    },
    getSpecialProp: (row) => {
      return row.state_desc;
    }
  },
  {
    prop: 'ignore_reason_id',
    label: '原因',
    min_width: 100,
    is_operation: true
  }
];

const orderTableColumn = [
  { prop: 'id', label: '订单ID', width: 100, fixed: 'left' },
  {
    prop: 'sample_id',
    label: '关联样品ID',
    width: 110,
    fixed: 'left',
    is_link: true
  },
  { prop: 'pricing_id', label: '关联定价ID', width: 110, fixed: 'left' },
  { prop: 'final_price', label: '最终定价' },
  {
    prop: '供应商ID',
    label: 'supplier_id',
    width: 100
  },
  { prop: 'estimated_finish_time', label: '计划完成时间', width: 200 },
  { prop: 'actual_finish_time', label: '实际完成时间', width: 200 },
  { prop: 'pre_production_sample_quantity', label: '大货样套数' },
  {
    prop: 'state',
    label: '状态',
    fixed: 'right',
    formatter: (row) => {
      return setOrderStateColor(row.state);
    },
    getSpecialProp: (row) => {
      return row.state_desc;
    }
  }
];

const packageTableColumn = [
  { prop: 'id', label: '包材ID', width: 100, fixed: 'left' },
  { prop: 'pricing_id', label: '关联定价ID', width: 110, fixed: 'left' },
  { prop: 'operations_specialist', label: '运营专业', width: 200 },
  { prop: 'estimated_finish_time', label: '计划完成时间', width: 200 },
  { prop: 'actual_finish_time', label: '实际完成时间', width: 200 },
  {
    prop: 'result_path',
    label: '结果文件地址',
    min_width: 150,
    tooltip: true
  },
  {
    prop: 'state',
    label: '状态',
    fixed: 'right',
    formatter: (row) => {
      return setPricingPackageStateColor(row.state);
    },
    getSpecialProp: (row) => {
      return row.state_desc;
    }
  }
];

const productTableColumn = [
  { prop: 'id', label: '产品ID', width: 100, fixed: 'left' },
  { prop: 'name', label: '产品名称', fixed: 'left', min_width: 150 },
  { prop: 'demand_id', label: '关联需求ID', width: 100, is_link: true },
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
  orderTableColumn,
  pricingTableColumn,
  patentTableColumn,
  demandTableColumn,
  packageTableColumn,
  questionTableColumn,
  productTableColumn,
  supplierTableColumn,
  sampleMessageTableColumn
};
</script>
