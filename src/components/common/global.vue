<script>
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

export default {
  reviewOptions,
  heymeLink,
  haomiLink,
  defaultTime,
  unterminatedStateCode,
  categoryProductMap
};
</script>
