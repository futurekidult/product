<template>
  <div 
    v-if="show"
    style="display: flex;"
    :class="mode"
    class="delete-item"
  >
    <div @click="deleteItem">
      <img 
        src="../../assets/images/delete.png"
      >
    </div>
    <el-button
      type="text"
      class="delete-btn"
      @click="deleteItem"
    >
      {{ content }}
    </el-button>
  </div>
</template>

<script>
export default {
  props: ['mode', 'show' , 'id' , 'list', 'content'],
  emits: ['get-list'],
  data() {
    return {
      totalList: this.list
    }
  },
  watch: {
    list(val) {
      this.totalList = val;
    }
  },
  methods: {
    deleteItem() {
      this.totalList.splice(this.id, 1);
      this.$emit('get-list', this.totalList);
    }
  }
}
</script>

<style scoped>
.delete-item {
  cursor: pointer;
}

.delete-btn {
   height: 20px; 
   color: #606266;
}

.delete-btn:hover {
  color: red;
}

.demand-btn {
  margin-left: 120px;
  margin-bottom: 10px;
}

.user_analysis-btn {
  margin-left: 20px;
  margin-top: 5px;
}

.test-user_btn,
.test-question_btn {
  margin-left: 100px;
  margin-bottom: 10px;
}

.supplier-btn {
  margin-left: 150px;
  margin-bottom: 10px;
}
</style>