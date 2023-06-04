
//获取hash
const hashApi =  '/api/index/getHash';

//获取首页数据
const homeListApi =  '/api/Home/index';
// //获取首页查看数据
const homeInfoApi =  '/api/Home/getInfo';
// 中小学登录
const loginApi =  '/api/Login/index';
// 登出
const logOutApi =  '/api/index/logout';

//发送验证码
const getVerifyApi =  '/api/login/getVerify';
//发送验证码
const regVerifyApi =  '/api/login/regVerify';

//资源列表
const nodesApi =  '/api/Index/info';
//修改密码
const modifyPasswordApi =  '/api/Index/modifyPassword';
// 忘记密码
const resetPassword =  '/api/login/resetPassword';
// 验证码
const codeApi =  '/api/Captcha';
// 登录日志
const loginLogList =  '/api/system.LoginLog/getList';
// 登录日志
const operateLogList =  '/api/system.OperateLog/getList';
// 登录日志资源
const resArrayList =  '/api/system.OperateLog/resArray';
// 登录日志(新)
const operateLogsList =  '/api/system.OperateCruxLog/getList';
// 登录日志资源
const resArraysList =  '/api/system.OperateCruxLog/resView';

//大数据对比接口
const dataListApi =  '/api/basic.CheckInfo/getData';

// 图片上传
const uploadApi =  '/api/index/uploads';

// 图片上传 无需token
const uploadApis =  'index/upload';

// 文件上传
const uploadFile =  '/api/index/upfiles';

//电子学生证
const studentCardListApi =  '/api/basic.StudentsWarn/getList';
//电子学生证详情
const studentCardDetailApi =  '/api/basic.StudentsWarn/getInfo';
//电子学生证处置
const studentCardHandleApi =  '/api/basic.StudentsWarn/actManage';

export  {
    resetPassword,
    uploadApi,
    uploadApis,
    uploadFile,
    regVerifyApi,
    getVerifyApi,
    hashApi,
    nodesApi,
    loginApi, //学校列表
    codeApi, // 登录
    logOutApi, //登出
    modifyPasswordApi,
    loginLogList,
    operateLogList,
    resArrayList,
    operateLogsList,
    resArraysList,
    dataListApi,
    // regionApi, //区县
    // switchUserRolesApi,
    homeInfoApi,
    homeListApi,
    studentCardListApi,
    studentCardHandleApi,
    studentCardDetailApi
}