import { downloadApi } from '../api/enroll';
import axios from '../utils/axios';

/*
 * // 打开加载层
 const loadingObj = this.$loading({
 lock: true,
 text: '正在导出...',
 spinner: 'el-icon-loading',
 background: 'rgba(0, 0, 0, 0.3)'
 });
 let params = {
 realName: this.search.keyword,
 };
 this.$exportFile(provinceAccountExportApi, params, 'excel', '省级账号','post');
 loadingObj.close();
 * */
export async function exportFile(url, params, type, name, methods) {
    let res
    if (methods == 'get') {
        res = await this.axios.get(url, params, { responseType: 'arraybuffer' });
    } else {
        res = await this.axios.post(url, params, { responseType: 'arraybuffer' });
    }
    const tempBlob = new Blob([res.data], { type: 'application/json' })
    // 通过 FileReader 读取这个 blob
    const reader = new FileReader()
    reader.onload = e => {
        const res1 = e.target.result
        // 此处对fileReader读出的结果进行JSON解析
        // 可能会出现错误，需要进行捕获
        try {
            const json = JSON.parse(res1)
            //正常json数据格式
            this.$message({
                showClose: true,
                message: json.msg,
                type: 'error'
            });
        } catch (error) {
            // // 该异常为无法将字符串转为json
            // // 说明返回的数据是一个流文件
            // // 不需要处理该异常，只需要捕获即刻
            if (type == 'pdf') {
                const blob = new Blob([res.data], { type: 'application/pdf' })
                const aLink = document.createElement('a');
                aLink.href = URL.createObjectURL(blob);
                aLink.setAttribute('download', name + '.pdf'); // 设置下载文件名称
                aLink.click();
            } else if (type == 'excel') {
                const aLink = document.createElement('a');
                let blob = new Blob([res.data], {
                    type: 'application/vnd.ms-excel'
                });
                aLink.href = URL.createObjectURL(blob);
                aLink.setAttribute('download', name + '.xlsx'); // 设置下载文件名称
                aLink.click();
            } else if (type == 'zip') {
                const aLink = document.createElement('a');
                let blob = new Blob([res.data], { type: 'application/zip' });
                aLink.href = URL.createObjectURL(blob);
                aLink.setAttribute('download', name + '.zip'); // 设置下载文件名称
                aLink.click();
            } else {
                const aLink = document.createElement('a');
                let blob = new Blob([res.data]);
                aLink.href = URL.createObjectURL(blob);
                aLink.setAttribute('download', name); // 设置下载文件名称
                aLink.click();
            }
        }
    }
    reader.readAsText(tempBlob)
}

// 下载资源文件 图片 视频 pdf
// const url = file.url
// if (!url) return this.$message({
//     message: '暂无资源文件',
//     type: 'warning'
// });
//
// const lastOf = url.lastIndexOf('/'); // '/'所在的最后位置
// const originalName = url.substr(lastOf + 1); //截取文件名称和后缀   输出：挽风.jpg
export async function handleDownload(file) {
    if (file.url) {
        let url = '';
        if (file.url) url = file.url.replace(process.env.SOURCE_URL, process.env.UPLOADER_URL);
        const aLink = document.createElement('a');
        aLink.href = url;
        aLink.setAttribute('download', file.originalName); // 设置下载文件名称
        aLink.click();
        return;
    }
    const formData = new FormData();
    formData.append('filePath', file.filePath);
    formData.append('fileName', file.originalName);
    const res = await axios.post(`${downloadApi}`, formData, {
        responseType: 'blob' //重要代码
    });
    const tempBlob = new Blob([res.data], { type: 'application/json' });
    const reader = new FileReader();
    reader.onload = e => {
        const res1 = e.target.result;
        // 此处对fileReader读出的结果进行JSON解析
        // 可能会出现错误，需要进行捕获
        try {
            const json = JSON.parse(res1);
            //正常json数据格式
            this.$message({
                showClose: true,
                message: json.msg,
                type: 'error'
            });
        } catch (error) {
            // // 该异常为无法将字符串转为json
            // // 说明返回的数据是一个流文件
            // // 不需要处理该异常，只需要捕获即刻
            const blob = new Blob([res.data]);
            const aLink = document.createElement('a');
            aLink.href = URL.createObjectURL(blob);
            aLink.setAttribute('download', file.originalName); // 设置下载文件名称
            aLink.click();
        }
    };
    reader.readAsText(tempBlob);
}
