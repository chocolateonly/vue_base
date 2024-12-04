<!--
<upload-file :uploadUrl="url" :data="fileList" :isCheckProgress="true" :uploadRule="{
        artType: artType,
        // 支持的文件格式
        acceptType: [
          {
            type: 'pdf', //video img word excel pdf
            limit: limit,
            minM: '',
            maxM: 20,
          },
        ],
        tip: '请上传文件，格式为PDF，文件大小不超过20M',
      }" @changeFile="list => changeFile('upload_video', list)" @changeFileStatus="changeFileStatus" />
-->
<template>
    <div>
        <el-upload ref="upload" :limit="upload.limit" :file-list="fileList" :accept="upload.accept" :list-type="listType"
            :headers="upload.headers" :action="upload.url" :disabled="upload.isUploading" :data="upload.data"
            :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :on-error='handleFileError'
            :before-upload="beforeUpload" :on-exceed="handleExceed" :on-remove="handleRemove" :on-preview="uploadClick"
                   :drag="canDrag" :http-request="onHttpUpload" :class="fileList.length==upload.limit?'hide':''">
            <template v-if="canDrag">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">
                    {{ uploadRule.tip }}
                    <slot name="otherBtn"></slot>
                </div>
            </template>
            <slot></slot>
            <slot name="uploadButton"></slot>
        </el-upload>

        <el-dialog v-dialogDrag :visible.sync="previewShow" top="5vh" width="90%" :close-on-click-modal="false">
            <FilePreview :previewUrl="previewUrl" :previewType="previewType" />
        </el-dialog>
    </div>
</template>

<script>
import { uploadHalfApi } from '../api/enroll';
import FilePreview from './filePreview.vue';

export default {
    name: 'uploadFile',
    components: { FilePreview },
    props: {
        data: {
            type: Array,
            default: () => {
                return [];
            }
        },
        canDrag: {
            type: Boolean,
            default: true
        },
        // 记录上传过程
        isCheckProgress: {
            type: Boolean,
            default: false
        },
        listType: {
            type: String,
            default: ''
        },
        uploadUrl: {
            type: String,
            default: ''
        },
        uploadRule: {
            type: Object,
            default: () => {
                return {
                    otherParams: {},
                    artType: '声乐作品',
                    // 支持的文件格式
                    acceptType: [
                        {
                            type: 'video', //video img word excel pdf
                            limit: 1,
                            minM: 10,
                            maxM: 1024
                        }
                    ],
                    tip: ''
                };
            }
        },
    },
    data() {
        return {
            //取得资源
            fileList: [
                // {name: '', url: ''},
            ],
            upload: {
                // 是否禁用上传
                isUploading: false,
                accept: '.mp4',
                // 设置上传的请求头部
                headers: { token: localStorage.getItem('token') },
                // headers: { token:'OKMA0dREv+neJ1OgcSYrd1SCIAgCoIXwjoahBUZ6ykwnmnJ5kVmkUU8Qs5L59OocI3ZWVxkkQF+B9rf/3UCWuQ==' },
                // 上传的地址
                // url:'http://223.75.196.188:20030/oss/upload',
                url: uploadHalfApi,
                limit: 0,
                data: {
                    artType: '',
                    contentType: '',
                    oldPath: ''
                },
                // 支持的文件格式
                acceptType: []
            },
            // 文本文件: text/plain .jpg, .JPG, .jpeg, .JPEG, .png, .PNG, .gif, GIF, .bmp, .BMP, .doc, .docx, .pdf, .xls, .xlsx
            types: {
                video: {
                    type: '.mp4,.MP4' //,.mov,.MOV ,.mpg2,.MPG2
                },
                img: {
                    type: '.jpg, .JPG'
                },
                word: {
                    type: '.DOCX,.docx,.DOC,.doc'
                },
                excel: {
                    type: '.xlsx,.XLSX,.xls,.XLS'
                },
                pdf: {
                    type: '.pdf,.PDF'
                },
                jpgPng: {
                    type: '.jpg, .JPG, .png, .PNG,.jpeg,.JPEG,'
                }
            },

            previewShow: false,
            previewType: '',
            previewUrl: '',
            //图标
            file_small_path: 'data:image/png;base64,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'

        };
    },
    watch: {
        data: {
            handler(val) {
                if (this.fileList.length == 0) this.fileList = val;
                // 上传了某种类型就只能再上传同类型了
                // if (val.length > 0) {
                //     const file = val[0];
                //     let fileName = file.name.substring(file.name.lastIndexOf('.') + 1);
                //     const typeObj = this.upload.acceptType.find(item => item.accept.includes(fileName));
                //     if (typeObj) {
                //         this.upload.accept = this.types[typeObj.type].type;
                //         this.upload.limit = typeObj.limit;
                //     }
                // }
            }
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            if (this.uploadUrl) this.upload.url = this.uploadUrl;
            this.upload.accept = this.uploadRule.acceptType.map(item => item.accept).join(',');

            this.uploadRule.acceptType.forEach((item, index) => {
                this.upload.accept += (this.types[item.type].type + ',');
                this.upload.data.artType = this.uploadRule.artType;
                // if (item.limit > this.upload.limit) this.upload.limit = item.limit;
                this.upload.limit += item.limit;
                this.upload.acceptType[index] = { ...this.uploadRule.acceptType[index], accept: this.types[item.type].type };
            });

            this.upload.data = {
                ...this.upload.data,
                ...this.uploadRule.otherParams
            };
        },
        async onHttpUpload(params) {
            const { data, file } = params;
            this.upload.isUploading = true;
            try {
                let res;
                //正常上传
                // if (file.size < 999 * 1024 * 1024) {
                if (true) {
                    const formData = new FormData();
                    for (let key in data) {
                        formData.append(key, data[key]);
                    }
                    formData.append('file', file);
                    res = await this.axios.post(this.upload.url, formData, {
                        headers: {
                            ...this.uploadRule.headers,
                            'content-type': 'multipart/form-data'
                        },
                        // 监听进度
                        onUploadProgress: (e) => {
                            const percent = (e.loaded / e.total) * 100;
                            // console.log(percent,'percent');
                            params.onProgress({ percent });
                        }
                    });
                    if (res.data) {
                        params.onSuccess(res.data);
                    } else {
                        params.onError();
                    }
                } else {
                    //大文件上传
                    data.file = file;
                    res = await this.uploadByPieces(this.upload.url, data);
                    return res;
                }

            } catch (e) {
                params.onError(e);
            }
        },
        // 大文件上传
        async uploadByPieces(url, { fileName, file }) {
            const chunkSize = 5 * 1024 * 1024;//5MB-片
            const chunkCount = Math.ceil(file.size / chunkSize);//总片数
            //获取当前chunk数据
            const getChunkInfo = (file, index) => {
                let start = index * chunkSize;
                let end = Math.min(file.size, start + chunkSize);
                let chunk = file.slice(start, end);
                return { start, end, chunk };
            };
            // 分片上传接口
            const uploadChunk = async (data) => {
                await this.axios.post(this.upload.url, data, {
                    headers: {
                        ...this.uploadRule.headers,
                        'content-type': 'multipart/form-data'
                    }
                });
            };
            //针对单个文件进行chunk上传
            const readChunk = (index) => {
                const { chunk } = getChunkInfo(file, index);
                let fetchForm = new FormData();
                fetchForm.append('chunk', chunk);
                fetchForm.append('index', index);
                fetchForm.append('chunkCount', chunkCount);
                return uploadChunk(fetchForm);
            };
            //针对每个文件进行chunk处理
            const promiseList = [];
            try {
                for (let index = 0; index < chunkCount; ++index) {
                    promiseList.push(readChunk(index));
                }
                return await Promise.all(promiseList);
            } catch (e) {
                return e;
            }
        },
        // 文件上传中处理 http-request方式请求时无效
        handleFileUploadProgress(event, file, fileList) {
            this.upload.isUploading = true;
            // 打开加载层
            // this.loading = this.$loading({
            //     lock: true,
            //     text: '正在上传...',
            //     spinner: 'el-icon-loading',
            //     background: 'rgba(0, 0, 0, 0.3)'
            // });
        },

        //上传文件成功
        handleFileSuccess(res) {
            // console.log(res, '成功', this.upload.data);
            if (!res) return;
            this.upload.isUploading = false;
            if (res && res.code == 1) {
                if (res.data) this.fileList.push({
                    name: this.upload.data.originalName,
                    url: res.data,
                    originalName: this.upload.data.originalName,
                    size: this.upload.data.fileSize,
                    type: this.upload.data.file_type
                });
                this.$emit('changeFile', this.fileList, res.data);
                this.$emit('changeFileStatus', 1);
            } else {
                this.$emit('changeFileStatus', 1);

                if (res.data && res.data.length > 0 && res.data[0].errMsg !== '') {
                    this.$message.error(res.data[0].errMsg);
                } else {
                    this.$message.error(res.msg);
                }
            }
        },
        //删除文件
        handleRemove(file, fileList) {
            this.fileList = fileList;
            //可上传多类型处理
            // if (this.uploadRule.acceptType.length > 0) {
            //     if (this.fileList.length == 0) this.init();
            // }
            if (!(file.status && file.status == 'ready')) this.$emit('changeFile', this.fileList);
        },
        //上传失败
        handleFileError(res) {
            console.log(res, '失败');
            this.$emit('changeFileStatus', 1);
            this.upload.isUploading = false;
            this.$message({
                showClose: true,
                message: res.msg || '上传超时',
                type: 'error'
            });

            //可上传多类型处理
            // if (this.uploadRule.acceptType.length > 0) {
            //     if (this.fileList.length == 0) this.init();
            // }
        },
        // 判断上传文件之前的钩子
        beforeUpload(file) {
            let fileName = file.name.substring(file.name.lastIndexOf('.') + 1);
            const suffix = this.upload.accept.includes(fileName);
            if (!suffix) {
                this.$message({
                    message: '请按照提示格式上传',
                    type: 'error'
                });
                return false;
            }
            // console.log('file',file,fileName);
            // console.log('this.uploadRule.acceptType',this.upload.acceptType);
            const typeObj = this.upload.acceptType.find(item => item.accept.includes(fileName));
            // console.log('上传的文件类型',typeObj);
            if (!typeObj) return;
            this.upload.data.contentType = file.type;
            this.upload.data.originalName = file.name;
            this.upload.data.fileSize = file.size;
            this.upload.data.file_type = fileName;

            //同类型限制判断
            const flag = this.fileList.filter(item => item.type == fileName);

            // console.log(flag,this.fileList,fileName,'aa',flag.length,typeObj.limit);
            if (flag.length >= typeObj.limit) {
                this.$message.error(`当前类型上传不能超过${typeObj.limit}个!`);
                return false;
            }

            const isGt = (file.size / 1024 / 1024) < typeObj.minM;
            const isLt = (file.size / 1024 / 1024) > typeObj.maxM;

            // 限制文件的大小
            if (typeObj.minM !== '' && isGt) {
                this.$message.error(`上传资源大小不能小于${typeObj.minM}MB!`);
                return false;
            }

            if (isLt) {
                if (typeObj.maxM == 1024) {
                    this.$message.error(`上传资源大小不能超过1G!`);
                } else {
                    this.$message.error(`上传资源大小不能超过${typeObj.maxM}MB!`);
                }
                return false;
            }

            // 上传了某种类型就只能再上传同类型了
            // this.upload.accept = this.types[typeObj.type].type;
            // this.upload.limit = typeObj.limit;

            // 需记录上传过程时 isCheckProgress true
            if (this.isCheckProgress) this.$emit('changeFileStatus', 1);

        },
        //限制上传个数警告
        handleExceed(files, fileList) {

            if (fileList.length + files.length > this.upload.limit) {
                this.$message({
                    showClose: true,
                    message: `最多上传${this.upload.limit}个`,
                    type: 'warning'
                });
            }
        },
        //点击上传文件预览
        async uploadClick(file) {
            this.filetype = file.name.split('.')[1];
            if (this.filetype == 'doc' || this.filetype == 'docx' || this.filetype == 'DOC' || this.filetype == 'DOCX') {
                this.previewShow = true;
                this.previewUrl = file.url;
                this.previewType = '.docx';
            } else if (this.filetype == 'xls' || this.filetype == 'xlsx' || this.filetype == 'XLS' || this.filetype == 'XLSX') {
                this.previewShow = true;
                this.previewUrl = file.url;
                this.previewType = '.xlsx';
            } else {
                window.open(`${file.url}`, '_blank');
            }
        },
    }
};
</script>

<style scoped lang="scss">
.hide {
    /deep/ .el-upload--picture-card {
        width: 0px;
        display: none;
    }
}
</style>
