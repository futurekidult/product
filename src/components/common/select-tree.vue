<template>
  <el-select
    ref="select"
    v-model="member"
    placeholder="请选择"
    clearable
    :disabled="disabled"
    @clear="clear"
  >
    <el-option
      ref="option"
      class="option"
      :value="optionData.id"
      :label="optionData.name"
    >
      <el-tree
        ref="tree"
        class="tree"
        :node-key="nodeKey"
        :data="data"
        :props="props"
        @node-click="handleNodeClick"
      />
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    nodeKey: {
      type: [String, Number],
      default: 'id'
    },
    props: {
      type: Object,
      default() {
        return {
          children: 'children',
          label: 'name'
        };
      }
    },
    value: {
      type: [String, Number],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['input'],
  data() {
    return {
      optionData: {
        id: '',
        name: ''
      },
      member: this.value
    };
  },
  watch: {
    value(val) {
      if (!this.isEmpty(this.data)) {
        this.init(val);
      }
    },
    data(val) {
      if (!this.isEmpty(val)) {
        this.init(this.member);
      }
    }
  },
  mounted() {
    if (!this.isEmpty(this.data)) {
      this.init(this.member);
    }
  },
  methods: {
    isEmpty(val) {
      for (let key in val) {
        return false;
      }
      return true;
    },
    handleNodeClick(data) {
      let label = this.props.name || 'name';
      this.$emit('input', data[this.nodeKey]);
      this.optionData.id = data[this.nodeKey];
      this.optionData.name = data[label];
      this.$refs.select.visible = false;
      this.member = data.id;
    },
    init(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(val);
          let node = this.$refs.tree.getNode(val);
          this.optionData.id = val;
          this.optionData.name = node.label;
        });
      } else {
        this.$refs.tree.setCurrentKey(null);
      }
    },
    clear() {
      this.$emit('input', '');
    }
  }
};
</script>

<style scoped>
.option {
  height: auto;
  line-height: 1;
  padding: 0;
  background-color: #fff;
}

.tree {
  padding: 0px 20px;
  font-weight: 400;
}
</style>
