<template>
    <!--    在线查看文件-->
    <div>
        <!--  图片 img-->
        <el-image-viewer :zIndex='3000' v-if="previewType=='img'" :url-list='[previewUrl]' />

        <el-dialog title="查看" v-else v-dialogDrag :visible.sync="previewShow" top="5vh" width="90%" append-to-body :close-on-click-modal="false">
            <FilePreview :previewUrl="previewUrl" :previewType="previewType" />
        </el-dialog>

    </div>
</template>

<script>
import FilePreview from './filePreview.vue';
import { handleDownload } from './exportfile';

export default {
    name: 'FileViewDialog',
    components: {
        FilePreview,
        'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer')
    },
    data() {
        return {
            previewShow: false,
            previewType: '',
            previewUrl: ''
        };
    },
    methods: {
        open(file) {
            if (!file.url) return this.$message({
                message: '暂无资源文件'
            });
            let type = file.type;
            let url = '';
            if (file.url) url = file.url.replace(process.env.SOURCE_URL, process.env.UPLOADER_URL);
            if (!type) type = file.url.substring(file.url.lastIndexOf('.') + 1);
            if (['.DOCX', '.docx', '.DOC', '.doc'].includes('.' + type)) {
                this.previewShow = true;
                this.previewUrl = url;
                this.previewType = '.docx';
            } else if (['.xlsx', '.XLSX', '.xls', '.XLS'].includes('.' + type)) {
                this.previewShow = true;
                this.previewUrl = url;
                this.previewType = '.xlsx';
            }
                // else if (['.pdf,.PDF'].includes(type)) {
                //     this.previewShow = true;
                //     this.previewUrl = file.url;
                //     this.previewType = '.pdf';
                // } else if (['.mp4,.MP4,.mpg2,.MPG2,.mov,.MOV'].includes(type)) {
                //     this.previewShow = true;
                //     this.previewUrl = file.url;
                //     this.previewType = 'video';
                // }else if (['.jpg, .JPG, .jpeg, .JPEG'].includes(type)) {
                //     this.previewUrl = file.url;
                //     this.previewType = 'img';
            // }
            else {
                window.open(url, '_blank');
                // this.handleDownload(file)
            }
        },
        // 下载
        async handleDownload(file) {
            await handleDownload({ originalName: file.originalName, filePath: 'byz', url: file.url });
        }
    }
};
</script>

<style lang="scss" scoped>

</style>
