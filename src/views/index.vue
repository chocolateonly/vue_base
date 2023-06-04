<template>
  <div class='counseling'>
    <el-form ref='search' :model='search' label-width='120px' inline style='margin-top: 20px'>
      <el-form-item label='SN号/学生姓名'>
        <el-input placeholder='请输入SN号/学生姓名' v-model.trim='search.keyword' clearable size='small'></el-input>
      </el-form-item>
      <el-form-item label='起始时间'>
        <el-date-picker v-model='search.start_time' type='datetime' format='yyyy-MM-dd HH:mm:ss' value-format='yyyy-MM-dd HH:mm:ss' placeholder='起始时间' size='small' />
      </el-form-item>
      <el-form-item label='截止时间'>
        <el-date-picker v-model='search.end_time' type='datetime' format='yyyy-MM-dd HH:mm:ss' value-format='yyyy-MM-dd HH:mm:ss' placeholder='截止时间' size='small' />
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click='onSearch' size='small'>查询</el-button>
        <el-button @click='onReset' size='small'>重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data='tableData' border v-loading='isLoading' element-loading-background='rgba(0, 0, 0, 0.4)' :max-height='tableHeight' size='medium' style='width: 100%'>
      <template v-for='(item,index) in tableHead'>
        <el-table-column :prop='item.prop' :label='item.title' :min-width='item.minWidth' align='center' :key="index">
        </el-table-column>
      </template>

      <el-table-column label='操作' fixed='right' width='200'>
        <template slot-scope='scope'>
          <el-button @click='handleDetail(scope.row)' type='primary' size='mini'>详情</el-button>
          <el-button @click='onHandler(scope.row)' type='warning' size='mini' :disabled='scope.row.status==1'>处置
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class='pagination'>
      <el-pagination background :current-page.sync='page' :page-sizes='pageSizes' :page-size='pageSize' layout='prev, pager, next, sizes,total' :total='total' class='pagination' @size-change='handleSizeChange' @current-change='handleCurrentChange' :hide-on-single-page='total<minTotalPageSize' />
    </div>

    <!--     详情-->
    <el-dialog title='详情' :visible.sync='showDialog' width='50%' center @close='closeDetail'>
      <el-row :gutter='10'>
        <el-col :span='12'>
          <div>基础信息</div>
          <el-form :model='detail'>
            <el-form-item label='IMEI号:'>{{ detail.imei_code }}</el-form-item>
            <el-form-item label='学生姓名:'>{{ detail.student_name }}</el-form-item>
            <el-form-item label='班级:'>{{ detail.class_name }}</el-form-item>
            <el-form-item label='围栏名称:'>{{ detail.fence_name }}</el-form-item>
            <el-form-item label='触发状态:'>{{ detail.fence_type_name }}</el-form-item>
            <el-form-item label='触发时间:'>{{ detail.warn_time }}</el-form-item>
            <template v-if='detail.remark'>
              <el-form-item label='处置图片:'>

              </el-form-item>
              <template v-for='(item,index) in detail.file_data'>
                <el-image :key="index" :src='baseUrl+item.file_path' style='width: 60px;height: 60px' @click='handlePictureCardPreview({url:baseUrl+item.file_path})'></el-image>
              </template>
              <el-form-item label='处置结果:'>{{ detail.remark }}</el-form-item>
              <el-form-item label='处置时间:'>{{ detail.update_time }}</el-form-item>
            </template>
          </el-form>
        </el-col>
        <el-col :span='12'>
          <div>位置信息</div>

          <div id='map' class='container'></div>
        </el-col>
      </el-row>
    </el-dialog>

    <!--    处置-->
    <el-dialog title='处置' :visible.sync='showHandleDialog' width='30%' center @close='close'>

      <el-form ref='ruleForm' :model='form' label-width='120px'>
        <el-form-item label='处置图片:'>
          <el-upload :action='action' :headers='headers' list-type='picture-card' :file-list='fileListImg' :on-preview='handlePictureCardPreview' :limit='limit' :on-remove='handleRemove' :on-success='handleAvatarSuccess' :on-error='handleAvatarError' :on-exceed='handleExceed' :before-upload='beforeAvatarUpload'>
            <i class='el-icon-plus'></i>
          </el-upload>
        </el-form-item>
        <el-form-item label='处置结果:' prop='remark'>
          <el-input v-model='form.remark' type='textarea' :autosize="{ minRows: 4, maxRows: 6 }" />
        </el-form-item>

      </el-form>

      <span slot='footer' class='dialog-footer'>
                <el-button type='primary' @click='onSubmit' :disabled='disabled'>提交</el-button>
            </span>

    </el-dialog>

    <el-image-viewer :zIndex='3000' v-if='imgViewerVisible' :on-close='closeImgViewer' :url-list='imgList' />
  </div>
</template>

<script>

import pages from './../mixins/pages';
import { studentCardListApi, uploadApi, studentCardHandleApi, hashApi, studentCardDetailApi } from './../api/index';
import {baseUrl} from "@/config";

export default {
  name: 'list',
  components: {
    'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer')
  },
  data() {
    return {
      form: {
        id: '',
        remark: ''
      },
      tableHead: [
        { title: 'ID', prop: 'id', minWidth: 100 },
        { title: 'IMEI号', prop: 'imei_code', minWidth: 100 },
        { title: '学生姓名', prop: 'student_name', minWidth: 100 },
        { title: '班级', prop: 'class_name', minWidth: 100 },
        { title: '围栏名称', prop: 'fence_name', minWidth: 100 },
        { title: '触发状态', prop: 'fence_type_name', minWidth: 100 },
        { title: '触发时间', prop: 'warn_time', minWidth: 100 },
        { title: '处置状态', prop: 'status_name', minWidth: 100 }
      ],
      showHandleDialog: false,
      showDialog: false,
      action: uploadApi,
      fileListImg: [],//上传图片列表
      limit: 9,
      fileList: [],//图片id
      baseUrl: baseUrl,
      imgViewerVisible: false,
      imgList: [],
      disabled: false,
      rules: {
        remark: [
          { required: true, message: '请输入处置结果', trigger: 'blur' }
        ]
      },
      hash: '',
      detail: {
        file_data: []
      },
      map: null,

    };
  },

  computed: {
    headers() {
      return {
        'token': localStorage.getItem('token')// 图片上传获取token
      };
    }
  },
  mixins: [pages],
  mounted() {
    this.getHash();

  },
  methods: {
    //关闭详情
    closeDetail() {
      this.showDialog = false;
      this.detail = {
        file_data: []
      };
    },
    //关闭处置
    close() {
      this.form = {
        id: '',
        remark: ''
      };
      this.fileListImg = [];
      this.fileList = [];
      this.imgList = [];
      this.showHandleDialog = false;
      this.$refs['ruleForm'].resetFields();
    },
    async getHash() {
      const datas = {
        page_hash: 'studentCardHash'
      };
      const res = await this.axios.post(hashApi, datas);
      if (res.data.code == 1) {
        this.hash = res.data.data;
      } else {
        this.$message({
          showClose: true,
          message: res.data.msg,
          type: 'error'
        });
      }
    },
    //提交
    onSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.axios.post(studentCardHandleApi, {
            id: this.form.id,
            image_ids: this.fileList.length > 0 ? this.fileList.join(',') : '',
            remark: this.form.remark,
            hash: this.hash
          }).then(res => {
            if (res.data.code == 1) {
              this.$message({
                message: '提交成功',
                type: 'success'
              });
              this.close();
              this.getTableData()
            } else {
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: 'error'
              });
            }
            this.getHash();
          }).catch(() => {

            this.getHash();
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //重置
    onReset() {
      this.search = {
        keyword: '',
        start_time: '',
        end_time: ''
      };
      this.onSearch();
    },
    getMap() {

    },
    //查看详情
    handleDetail(item) {
      this.axios.post(studentCardDetailApi, {
        id: item.id
      }).then((res) => {
        if (res.data.code == 1) {
          this.detail = res.data.data;
          this.showDialog = true;
          this.getMap();
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          });
        }
      }).catch(() => {

      });
    },
    //处置
    onHandler(item) {
      console.log(item);
      this.form.id = item.id;
      this.showHandleDialog = true;
    },
    async getTableData() {
      try {
        this.isLoading = true;
        const res = await this.axios.post(studentCardListApi, {
          curr: this.page,
          pageSize: this.pageSize,
          ...this.search
        });
        this.isLoading = false;
        if (res.data.code == 1) {
          this.tableData = res.data.data.data;
          this.total = res.data.data.total
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          });
        }

      } catch (e) {
        this.isLoading = false;
      }
    },
    // 查看图片-通用
    handlePictureCardPreview(file) {
      this.showImgViewer();
      this.imgList = [file.url];
    },
    showImgViewer() {
      this.imgViewerVisible = true;
      const m = (e) => {
        e.preventDefault();
      };
      document.body.style.overflow = 'hidden';
      document.addEventListener('touchmove', m, false); // 禁止页面滑动
    },
    closeImgViewer() {
      this.imgViewerVisible = false;
      const m = (e) => {
        e.preventDefault();
      };
      document.body.style.overflow = 'auto';
      document.removeEventListener('touchmove', m, true);
    },
    //图片删除
    handleRemove(file, fileList) {
      if (file.status != 'success') {
        return;
      }
      let arr = this.fileListImg;
      arr.map((item, i) => {
        if (item.file_id == file.file_id) {
          this.fileList.splice(i, 1);
          this.fileListImg.splice(i, 1);
        }
      });
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      if (res.code == 1) {
        this.fileList.push(res.data.file_id);
        this.fileListImg.push({ url: this.baseUrl + res.data.file_path, file_id: res.data.file_id });
        this.disabled = false;
      } else {
        this.$message.error(res.msg);
      }
    },
    // 上传失败
    handleAvatarError(res, file) {
      this.$message.error(res.msg);
    },
    //限制上传数量
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${fileList.length} 个文件`);
    },
    //上传图片之前处理参数数据
    beforeAvatarUpload(file) {
      this.disabled = true;
      const isJPEG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt1M = file.size / 1024 / 1024 < 10;
      if (!isJPEG && !isPNG) {
        this.$message.error('上传图片只能是 JPG、PNG、JPEG 格式!');
        this.disabled = false;
        return false;
      } else if (!isLt1M) {
        this.$message.error('上传图片大小不能超过 10MB!');
        this.disabled = false;
        return false;
      }
    }

  }
};
</script>

<style scoped lang="scss">
.counseling {
  height: 100%;
}

.container {
  width: 100%;
  height: 500px;
}

///deep/ .el-upload-list--picture-card .el-upload-list__item {
//  width: 100px;
//  height: 100px;
//}
///deep/ .el-upload--picture-card {
//  width: 100px;
//  height: 100px;
//  line-height: 110px;
//}
</style>
