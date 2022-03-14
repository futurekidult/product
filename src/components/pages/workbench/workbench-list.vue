<template>
  <base-breadcrumb />
  <el-badge
    :value="getLength"
    size="mini"
    class="item"
  />
  <el-tabs v-model="activeName">
    <el-tab-pane
      label="待办事项"
      name="todolist"
    >
      <todo-list />
    </el-tab-pane>
    <el-tab-pane
      label="通知"
      name="inform"
    >
      <inform-list />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import TodoList from './todo-list.vue';
import InformList from './inform-list.vue';

export default {
  components: {
    TodoList,
    InformList
  },
  provide() {
    return {
      getList: this.getTable
    };
  },
  data() {
    return {
      activeName: 'todolist'
    };
  },
  computed: {
    getLength() {
      return this.$store.getters['workbench/getLength'];
    }
  },
  created() {
    this.getTable();
  },
  methods: {
    async getTable() {
      await this.$store.dispatch('workbench/getData');
    }
  }
};
</script>

<style scoped>
.el-badge {
  position: absolute;
  left: 78px;
  top: 70px;
}
</style>
