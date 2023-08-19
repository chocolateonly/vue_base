<template>
    <div>
        <!--图片预览组件 单张直接查看 多张先弹窗再查看 自动拼接http,无需处理-->
        <!--
        使用方法：
        <image-viewer ref='imageViewer'  />
        //图片 视频预览
        handleImgs(item) {
          this.$refs.imageViewer.handleImgs(item.file_data)
        },
        -->
        <el-image-viewer :zIndex='3000' v-if='imgViewerVisible' :on-close='closeImgViewer' :url-list='imgList'/>

        <el-dialog v-dialogDrag :title="title" :visible.sync="dialogViewVisible" width="40%" :close-on-click-modal="false">
            <template v-for="item in imgList">
                <el-image style="width: 200px;height: 150px;margin-right: 20px;" :src="item" :preview-src-list="imgList"></el-image>
            </template>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'imageViewer',
    components: {
        'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer')
    },
    data() {
        return {
            //查看图片
            baseUrl: process.env.UPLOADER_URL,
            imgList: [],
            imgViewerVisible: false,

            title: '查看图片',
            dialogViewVisible: false,  //图片弹窗关闭
        }
    },
    methods: {
        //图片 视频预览
        handleImgs(imgList) {
            if (imgList.length == 0) return this.$message({
                showClose: true,
                message: '暂无图片',
                type: 'warning'
            });

            this.imgList = [];
            imgList.forEach(it => {
                this.imgList.push(this.baseUrl + it.file_path);
            });
            if (this.imgList.length > 1) {
                //先弹窗处理
                this.dialogViewVisible = true
            } else {
                this.imgViewerVisible = true;
                this.showImgViewer();
            }

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
    }
};
</script>

<style lang='scss' scoped>

</style>
