import NewAxios from "./httpClass";
//公钥
export const PUBLIC_KEY = ``

export const baseUrl = process.env.NODE_ENV === 'production' ?
    "https://rsbi-api.relationshipapp.com/" : //正式
    "https://rsbi-staging.relationshipapp.com/" //测试


const cidServiceAxios = new NewAxios({
    baseURL:baseUrl,
    timeout:50000000000000
})

//
const service = cidServiceAxios.instance

export { service}
