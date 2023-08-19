<template>
<!--  导入 上传文件及下载模板组件  -->
<!--
使用方法：
    <import-file ref='importFile' @getTemplate='getTemplate' page_hash='distributionPlanForSchoolList' upload_url='/metrics/import' @getList='onSearch' />
        // 导入模板下载
        getTemplate() {
            this.axios.post(metricsExportTemplateApi, {})
                .then(res => {
                    if (res.data.url) {
                        window.location.href = process.env.API_BASEURL + res.data.url;
                    }
                }).catch(e => e);
        },
        // 导入按钮操作
        handleImport() {
            this.$refs.importFile.open();
        },
-->
<!--
//导出
onExport() {
    this.axios.post(metricsResExportApi, {
        region_id: this.search_data.select_area,
        school_id: this.search_data.select_school
    }, { responseType: 'arraybuffer' })
        .then(res => {
            const aLink = document.createElement('a');
            let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
            aLink.href = window.URL.createObjectURL(blob);
            aLink.setAttribute('download', '各校指标分配' + '.xlsx');
            aLink.click();
            window.URL.revokeObjectURL(aLink.href);
            this.$message({
                message: '导出成功',
                type: 'success'
            })
        }).catch(e => e)
},

-->
  <div>
    <el-dialog :title="upload.title" v-dialogDrag class="dialogStyle" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url" :disabled="upload.isUploading" :data="scObj" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :on-error='handleFileError' :auto-upload="false" :before-upload="beforeUpload" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入xls/xlsx格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { hashApi } from '../api';
import {baseUrl} from "@/config";

export default {
  name:'importFile',
  props:['page_hash','upload_url'],
  data(){
    return{
      loading:null,
      scObj: {
        hash: '',
      },
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { token: localStorage.getItem('token') },
        // 上传的地址
        url: baseUrl + '/schools/import'
      },
    }
  },
  methods:{
    //打开
    open(){
      if(this.upload_url) this.upload.url = baseUrl + this.upload_url
      this.upload.open = true
    },
    //关闭
    close(){
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
    },
    //模板
    importTemplate(){
      this.$emit('importTemplate')
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
      // 打开加载层
      this.loading = this.$loading({
        lock: true,
        text: '正在导入...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)'
      });
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.loading.close();
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      if (response.code == 1) {
        this.$alert('导入完成，请到[导入结果]查看记录', '导入结果', {
          dangerouslyUseHTMLString: true,
          showClose: false,
        });
        this.$emit('getList');
      } else {
        this.$alert(response.msg, '导入失败', {
          dangerouslyUseHTMLString: true,
          showClose: false,
        });
      }
    },
    //文件上传失败
    handleFileError(res, file) {
      this.loading.close();
      this.$message({
        showClose: true,
        message: res.msg,
        type: "error"
      });
    },
    // 上传文件之前的钩子
    beforeUpload(file) {
      this.file = file.name;
    },
    // 提交上传文件
    async submitFileForm() {
      await this.getHash();
      this.$refs.upload.submit();
    },
    //获取Hash
    async getHash() {
      const res = await this.axios.post(hashApi, { page_hash: this.page_hash });
      if (res.data.code == 1) {
        this.scObj.hash = res.data.data;
      } else {
        this.$message({
          showClose: true,
          message: res.data.msg,
          type: 'error',
        });
      }
    },
  }
};
</script>

<style lang='scss' scoped>

</style>
