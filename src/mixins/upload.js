import { hashApi, uploadApi } from '../api';
import { message } from '../assets/js/common';
/*
*使用方法：
<el-upload :action='upload.action' :headers='upload.headers' list-type='picture-card'
                                               :file-list='item.files' :data='upload.data'
                                               :on-preview='handlePictureCardPreview' :limit='1'
                                               :on-remove='(file,fileList)=>handleRemove(file,fileList,"driver_data",index)'
                                               :on-success='(res,file)=>handleAvatarSuccess(res,file,"driver_data",index)'
                                               :on-error='handleAvatarError' :on-exceed='handleExceed'
                                               :before-upload='beforeAvatarUpload'>
                                          <i class='el-icon-plus'></i>
                                    </el-upload>
                                    * //超限隐藏上传按钮
                                    <el-upload :action='checkIdCardPicApi()' :headers='upload.headers' list-type='picture-card'
                                                     :file-list='form.front_file.files' :data='upload.data'
                                                     :on-preview='handlePictureCardPreview' :limit='1'
                                                     :on-remove='(file,fileList)=>handleRemove(file,fileList,"front_file")'
                                                     :on-success='(res,file)=>handleAvatarSuccess(res,file,"front_file")'
                                                     :on-error='handleAvatarError' :on-exceed='handleExceed'
                                                     :before-upload='beforeAvatarUpload'
                                                     :class="form.front_file.files.length>=1?'upload-hide':''">
                                                <span>上传身份证正面</span>
                                          </el-upload>
*
* */
export default {
  data(){
    return{

      fileListImg: [],//上传图片列表
      limit: 9,
      baseUrl: process.env.UPLOADER_URL,
      //图片预览
      imgViewerVisible: false,
      imgList: [],
      disabled:false,
      upload:{
        //上传图片
        action: uploadApi,
        headers:{
          'token': localStorage.getItem('token')// 图片上传获取token
        },
        data:{
          hash:'',
          source: 'sourceimg',
          source_id: 0,
          source_type: 'img',
        }
      },
      need_upload_hash:true
    }
  },
  created() {
    if(this.need_upload_hash) this.getHashData()
  },
  methods:{
    //获取hash
    async getHashData() {
      const datas = {
        page_hash: 'upload'
      };
      const res = await this.axios.post(hashApi, datas)
      if (res.data.code == 1) {
        this.upload.data.hash = res.data.data;
      } else {
        this.$message({
          showClose: true,
          message: res.data.msg,
          type: "error"
        });
      }
    },
    // 查看图片-通用
    handlePictureCardPreview(file) {
      console.log(file)
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
    //上传删除
    handleRemove(file, fileList, key, index) {
      console.log('reomve---')
      if ((!(this.form[key] instanceof Array)) && this.form[key] instanceof Object) {
        const fileIndex = this.form[key].files.findIndex(it => it.file_id == file.file_id)
        if (fileIndex > -1) this.form[key].files.splice(fileIndex, 1);
        return;
      }

      if (file.status != 'success') {
        return;
      }
      let arr = arguments.length == 4 ? this.form[key][index].files : this.form[key].files;
      arr.map((item, i) => {
        if (item.file_id == file.file_id) {
          if (arguments.length == 4) {
            this.form[key][index].files.splice(i, 1);
          } else {
            this.form[key].files.splice(i, 1);
          }
        }
      });
      this.$forceUpdate()
    },
    //图片上传成功
    handleAvatarSuccess(res, file, key, index) {

      if (res.code == 1) {
        if (arguments.length == 4) {
          this.form[key][index].files.push({
            url: this.baseUrl + (res.data ? res.data.file_path : res.url),
            file_id: res.data ? res.data.file_id : res.file_id
          });
        } else {
          this.form[key].files.push({
            url: this.baseUrl + (res.data ? res.data.file_path : res.url),
            file_id: res.data ? res.data.file_id : res.file_id
          });
        }
        this.disabled = false;
      } else {
        message(res.msg);
        if(arguments.length != 4) this.form[key].files.pop()
      }
      this.getHashData()
    },
    // 上传失败
    handleAvatarError(res, file) {
      console.log(res)
      this.getHashData()
      message(res.msg);
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
      const isLt1M = file.size / 1024 / 1024 < 20;
      if (!isJPEG && !isPNG) {
        this.$message.error('上传图片只能是 JPG、PNG、JPEG 格式!');
        this.disabled = false;
        return false;
      } else if (!isLt1M) {
        this.$message.error('上传图片大小不能超过 20MB!');
        this.disabled = false;
        return false;
      }
    },
    beforeVideoUpload(file) {
      this.disabled = true;
      let name = file.name.substring(file.name.lastIndexOf('.') + 1);
      let filemp4 = file.size / 1024 / 1024 < 50;
      let videoType = ['MP4', 'mp4', 'mov', 'avi', 'wmv', 'flv', 'asf', 'f4v'];

      if (videoType.indexOf(name) == -1) {
        this.$message.error('上传视频只能是MP4、mp4、mov、avi、wmv、flv、asf、f4v格式!');
        this.disabled = false;
        return false;
      } else if (!filemp4) {
        this.$message.error('上传视频大小不能超过 50MB!');
        this.disabled = false;
        return false;
      }

    },
    //文件预览
    preview(file) {
      if (!file.response) {
        window.open(file.url ? file.url : this.baseUrl + file.file_path, '_blank');
      } else {
        window.open(this.baseUrl + file.response.url, '_blank');
      }
    }
  }
}
