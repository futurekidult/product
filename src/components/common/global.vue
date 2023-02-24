<script>
import {
  setApproveStateColor,
  setSampleStateColor,
  setMouldStateColor,
  setQuotationStateColor,
  setPriceStateColor,
  setStateColor
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

const sampleAllTableColumn = [
  { prop: 'id', label: '样品ID', width: 100, fixed: 'left' },
  {
    prop: 'product_name',
    label: '关联产品名称',
    fixed: 'left',
    min_width: 150
  },
  { prop: 'product_id', label: '关联产品ID', width: 110, is_link: true },
  { prop: 'pricing_id', label: '关联定价ID', width: 110 },
  { prop: 'estimated_finish_time', label: '计划完成时间', width: 200 },
  { prop: 'actual_finish_time', label: '实际完成时间', width: 200 },
  { prop: 'purchase_specialist', label: '采购员', width: 200 },
  {
    prop: 'state',
    label: '状态',
    min_width: 150,
    formatter: (row) => {
      return setSampleStateColor(row.state);
    },
    getSpecialProp: (row) => {
      return row.state_desc;
    }
  },
  {
    prop: 'test_result',
    label: '测试结果',
    min_width: 100,
    formatter: (row) => {
      return setStateColor(row.test_result);
    },
    getSpecialProp: (row) => {
      return row.test_result_desc;
    }
  }
];

const userTestTableColumn = [
  { prop: 'id', label: '用户测试申请ID', min_width: 150, fixed: 'left' },
  {
    prop: 'creator',
    label: '申请人',
    fixed: 'left',
    min_width: 100
  },
  { prop: 'submit_time', label: '提交时间', width: 200 },
  { prop: 'user_experience_duration', label: '用户体验时长', min_width: 200 },
  { prop: 'estimated_finish_time', label: '期望完成日期', width: 200 },
  { prop: 'sample_demand_quantity', label: '样品需求数', min_width: 150 },
  { prop: 'review_finish_time', label: '评审完成时间', width: 200 },
  {
    prop: 'review_state',
    label: '评审状态',
    min_width: 150,
    fixed: 'right',
    formatter: (row) => {
      return setApproveStateColor(row.review_state);
    },
    getSpecialProp: (row) => {
      return row.review_state_desc;
    }
  }
];

const userTemplateTableColumn = [
  { prop: 'id', label: '测试用户ID', min_width: 150, fixed: 'left' },
  {
    prop: 'creator',
    label: '创建人',
    fixed: 'left',
    min_width: 100
  },
  { prop: 'create_time', label: '创建时间', width: 200 },
  { prop: 'delivery_time', label: '寄样完成时间', width: 200 },
  { prop: 'upload_time', label: '结果上传时间', width: 200 },
  { prop: 'username', label: '用户姓名', min_width: 120 },
  { prop: 'is_delivered_desc', label: '是否已寄样', min_width: 120 },
  {
    prop: 'state',
    label: '测试状态',
    min_width: 120,
    formatter: (row) => {
      return setSampleStateColor(row.state);
    },
    getSpecialProp: (row) => {
      return row.state_desc;
    }
  },
  {
    prop: 'test_result_file',
    label: '测试结果文件',
    width: 150,
    is_operation: true
  }
];

const mouldAllTableColumn = [
  { prop: 'id', label: '模具ID', width: 100, fixed: 'left' },
  {
    prop: 'name',
    label: '模具名称',
    fixed: 'left',
    min_width: 150
  },
  {
    prop: 'mould_factory',
    label: '开模工厂名称',
    min_width: 150
  },
  { prop: 'create_time', label: '创建时间', width: 200 },
  { prop: 'creator', label: '创建人' },
  { prop: 'estimated_finish_time', label: '计划完成时间', width: 200 },
  { prop: 'actual_finish_time', label: '实际完成时间', width: 200 },
  {
    prop: 'state',
    label: '状态',
    width: 150,
    formatter: (row) => {
      return setMouldStateColor(row.state);
    },
    getSpecialProp: (row) => {
      return row.state_desc;
    }
  }
];

const priceAllTableColumn = [
  { prop: 'id', label: '定价ID', width: 100, fixed: 'left' },
  {
    prop: 'related_product_name',
    label: '关联产品名称',
    fixed: 'left',
    min_width: 150
  },
  {
    prop: 'related_product_id',
    label: '关联产品ID',
    width: 110
  },
  { prop: 'market_desc', label: '市场' },
  { prop: 'platform', label: '平台', min_width: 150 },
  { prop: 'purchase_principal', label: '采购负责人', min_width: 100 },
  { prop: 'estimated_finish_time', label: '计划完成时间', width: 200 },
  { prop: 'first_submit_time', label: '首次报价时间', width: 200 },
  { prop: 'current_quote_count', label: '当前已有报价', min_width: 120 },
  {
    prop: 'state',
    label: '状态',
    formatter: (row) => {
      return setPriceStateColor(row.state);
    },
    getSpecialProp: (row) => {
      return row.state_desc;
    }
  }
];

const quotationListTableColumn = [
  { prop: 'id', label: '报价ID', width: 100, fixed: 'left' },
  {
    prop: 'supplier_name',
    label: '供应商名称',
    fixed: 'left',
    min_width: 200,
    is_link: true
  },
  {
    prop: 'purchase_specialist',
    label: '采购员'
  },
  { prop: 'create_time', label: '报价时间', width: 200 },
  { prop: 'quote_amount_rmb', label: '报价', min_width: 150 },
  { prop: 'target_price', label: '采购目标价', width: 100, is_operation: true },
  { prop: 'quote_validity', label: '报价有效期', width: 200 },
  {
    prop: 'state',
    label: '状态',
    fixed: 'right',
    formatter: (row) => {
      return setQuotationStateColor(row.state);
    },
    getSpecialProp: (row) => {
      return row.state_desc;
    }
  },
  { prop: 'confirm_time', label: '最终确定定价时间', width: 200 }
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
  supplierTableColumn,
  sampleAllTableColumn,
  userTestTableColumn,
  userTemplateTableColumn,
  mouldAllTableColumn,
  priceAllTableColumn,
  quotationListTableColumn
};
</script>
