<template>
  <div 
    v-if="show"
    style="display: flex;"
    :class="mode"
    class="delete-item"
    @click="deleteItem"
  >
    <el-icon class="delete-icon">
      <Delete :size="20" />
    </el-icon>
    <el-button
      type="text"
      class="delete-btn"
    >
      {{ content }}
    </el-button>
  </div>
</template>

<script>
import { Delete } from '@element-plus/icons-vue';
export default {
  components: {
    Delete
  },
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

.delete-item,
.delete-btn,
.delete-btn:hover {
  color: red;
}

.delete-btn,
.delete-icon {
   height: 20px; 
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

.supplier-delete_btn {
  margin-left: 150px;
  margin-bottom: 10px;
}

.order-delete_btn {
  margin-left: 20px;
  margin-top: 8px;
}

.project-delete_btn { 
  margin-left: 110px; 
  margin-bottom: 10px; 
}
</style>