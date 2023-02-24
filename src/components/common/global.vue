<script>
import {
  setOrderStateColor,
  setApproveStateColor,
  setProductStateColor,
  setReviewStateColor,
  setQuestionStateColor,
  setPricingStateColor,
  setPackageStateColor,
  setDemandReviewStateColor,
  setSampleStateColor,
  setMouldStateColor,
  setQuotationStateColor,
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
      return setPricingStateColor(row.state);
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
  { prop: 'platform', label: '平台', min_width: 200 },
  { prop: 'demand_quantity', label: '需求数量', min_width: 100 },
  { prop: 'demand_time', label: '需求日期', width: 200 },
  { prop: 'has_verify', label: '有无认证', min_width: 100 },
  { prop: 'supplier_id', label: '供应商ID', width: 100 },
  {
    prop: 'purchase_specialist',
    label: '采购员',
    min_width: 150
  },
  { prop: 'estimated_finish_time', label: '计划完成时间', width: 200 },
  { prop: 'actual_finish_time', label: '实际完成时间', width: 200 },
  {
    prop: 'state',
    label: '状态',
    min_width: 200,
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
  { prop: 'pricing_id', label: '关联定价ID', width: 110, fixed: 'left' },
  { prop: 'final_price', label: '最终定价' },
  {
    prop: 'supplier_id',
    label: '供应商ID',
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
  { prop: 'operations_specialist', label: '运营专员', width: 200 },
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
      return setPackageStateColor(row.state);
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
      return setPricingStateColor(row.state);
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
  orderTableColumn,
  pricingTableColumn,
  patentTableColumn,
  demandTableColumn,
  packageTableColumn,
  questionTableColumn,
  productTableColumn,
  supplierTableColumn,
  sampleAllTableColumn,
  userTestTableColumn,
  userTemplateTableColumn,
  mouldAllTableColumn,
  priceAllTableColumn,
  quotationListTableColumn,
  sampleMessageTableColumn
};
</script>
