<template>
  <div class="survey-title">
    调研进度表
  </div>

  <survey-schedule />

  <div class="survey-title">
    调研报告内容
  </div>

  <el-form
    label-width="110px"
    style="width: 50%"
  >
    <el-form-item label="使用场景">
      <el-input />
      <el-button type="text">
        + 新增
      </el-button>
    </el-form-item>
    <el-form-item
      v-for="(item, i) of usageScenario"
      :key="i"
      label=""
    >
      <el-input v-model="usageScenario[i]" />
    </el-form-item>
    <el-form-item label="用户痛点">
      <el-input
        type="textarea"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
    <el-form-item label="用户需求分析">
      <el-input
        type="textarea"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
    <el-form-item label="产品切入点">
      <el-input
        type="textarea"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
    <el-form-item>
      <el-collapse style="width: 100%">
        <el-collapse-item title="竞品信息">
          <el-form label-width="110px">
            <div>
              <el-form-item
                label="上传附件"
                style="margin-bottom: 18px"
              >
                <el-upload action="#">
                  <el-button type="primary">
                    点击上传
                  </el-button>
                </el-upload>
                <div class="attachment">
                  请上传png/jpg/jpeg等图片格式,单个文件不能超过5MB
                </div>
              </el-form-item>
              <el-form-item style="margin-bottom: 18px">
                <div class="attachment-list">
                  xx
                </div>
              </el-form-item>
              <el-form-item
                label="竞品链接"
                style="margin-bottom: 18px"
              >
                <el-input
                  type="textarea"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item
                label="竞品参数"
                style="margin-bottom: 18px"
              >
                <el-input
                  type="textarea"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item
                label="对标理由"
                style="margin-bottom: 18px"
              >
                <el-input
                  type="textarea"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
              <el-divider />
            </div>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-form-item>
    <el-form-item>
      <el-collapse style="width: 100%">
        <el-collapse-item title="新品信息">
          <el-form label-width="110px">
            <div class="analy-form_item">
              <el-form-item label="内箱尺寸/cm">
                <div style="display: flex">
                  <el-input class="analy-form_mar" />
                  <el-input class="analy-form_mar" />
                  <el-input />
                </div>
              </el-form-item>
              <el-form-item label="外箱尺寸/cm">
                <div style="display: flex">
                  <el-input class="analy-form_mar" />
                  <el-input class="analy-form_mar" />
                  <el-input />
                </div>
              </el-form-item>
              <el-form-item
                label="内箱重量/kg"
                style="margin-bottom: 18px"
              >
                <el-input />
              </el-form-item>
              <el-form-item
                label="外箱重量/kg"
                style="margin-bottom: 18px"
              >
                <el-input />
              </el-form-item>
            </div>
            <el-form-item
              label="头程费用"
              style="margin-bottom: 18px"
            >
              <div style="display: flex">
                <el-select class="analy-form_mar" />
                <el-input class="analy-form_mar" />
                <el-input disabled />
              </div>
            </el-form-item>
            <el-form-item
              label="尾程费用"
              style="margin-bottom: 18px"
            >
              <div style="display: flex">
                <el-select class="analy-form_mar" />
                <el-input class="analy-form_mar" />
                <el-input disabled />
              </div>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-form-item>
    <el-form-item label="上传附件">
      <el-upload action="#">
        <el-button type="primary">
          点击上传
        </el-button>
      </el-upload>
      <div class="attachment">
        支持office文档格式以及png/jpg/jpeg等图片格式,单个文件不能超过5MB
      </div>
    </el-form-item>
    <el-form-item>
      <div class="attachment-list">
        xx
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import SurveySchedule from '../../common/survey- schedule.vue';

export default {
  components: {
    SurveySchedule
  },
  data() {
    return {
      usageScenario: []
    };
  }
};
</script>

<style scoped>
.analy-form_item {
  display: grid;
  grid-template-columns: 48.5% 48.5%;
  gap: 18px;
}

.analy-form_mar {
  margin-right: 5px;
}
</style>
