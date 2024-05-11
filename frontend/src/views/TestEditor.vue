<template>
  <el-card :size="20" class="container mt-3 mx-auto mt-4">
        <el-form
            status-icon
            ref="newsFormRef"
            label-width="120px"
            label-position="top"
            :model="newsForm"
            :rules="newsFormRules"
        >
            <!-- Title -->
            <el-form-item label="">
              <div style="display: flex; justify-content: center align-items: center;">
                <span>Title&nbsp;:&nbsp;</span>
                <el-input v-model="newsForm.title"></el-input>
              </div>
            </el-form-item>
            <!-- Content -->
            <el-form-item label="Content" >
                <Editor
                    :submitAndClearEditor="submitAndClearEditor"
                    @emitOnEditorChange="handleEditorChange"
                    @emitOnSubmitAndEditorClear="handleSubmitAndEditorClear"
                />
            </el-form-item>
            <!-- ...省略 Category 和 cover-->
            <!-- 送審按鈕 儲存按鈕 回復按鈕-->
            <el-form-item>
                <el-popconfirm
                      title="Are you sure to submit to Inspector？"
                      cancel-button-text="no"
                      confirm-button-text="yes"
                      @confirm="submitForm(newsFormRef)"
                    >
                  <template #reference>
                    <el-button size="medium" class="custom-button" type="primary">submit</el-button>
                  </template>
                </el-popconfirm>
                    <span style="margin: 0 30px;"></span>
                <el-popconfirm
                  title="Are you sure to save content to DB？"
                  cancel-button-text="no"
                  confirm-button-text="yes"
                  @confirm="saveForm(newsFormRef)"
                >
                  <template #reference>
                    <el-button size="medium" class="custom-button" type="primary">save</el-button>
                  </template>
                </el-popconfirm>
                <span style="margin: 0 30px;"></span>
                
                <el-popconfirm
                  title="Are you sure to retrieve content from DB？"
                  cancel-button-text="no"
                  confirm-button-text="yes"
                  @confirm="retrieveForm(newsFormRef)"
                >
                  <template #reference>
                    <el-button size="medium" class="custom-button" type="primary">retrieve</el-button>
                  </template>
                </el-popconfirm>
            </el-form-item>
        </el-form>
  </el-card>
</template>

<script setup>
import { ElInput } from 'element-plus';
import Editor from '@/components/Editor.vue'
import { ref, reactive } from 'vue'
import { ElPopconfirm } from 'element-plus';

const submitAndClearEditor = ref(false)

const newsForm = reactive({
    content: '',
})

const handleEditorChange = async (content) => {
    newsForm.content = await content
}

const saveForm = async (newsFormRef) => {
}

const submitForm = async (newsFormRef) => {
}
const retrieveForm = async (newsFormRef) => {
}

const handleSubmitAndEditorClear = async (value) => {
    submitAndClearEditor.value = await value
}
</script>
<style>
.custom-button {
    border-radius: 50px;
    background-color: #1890ff;
    color: #fff;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
}
</style>