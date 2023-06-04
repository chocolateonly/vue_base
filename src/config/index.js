import NewAxios from "./httpClass";
//项目名称
export const TITLE_ENV = '后台管理平台'
//公钥
export const PUBLIC_KEY = '-----BEGIN EC PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA49IXLP9h2eHpZaCqM2W3\n' +
    'pDR16n+X7WvATQ0nIRg7gCb6JNwmRy3Ucv9MzEKSJ+CKarq78zefDo7O07k/N7TM\n' +
    'LOu2Zmn7o/GZiDK9EJ/FZPdTxCSS1zq2XN+HtMdEgQucYcN0+qbvkEjKwP74iL8C\n' +
    'JfgudbuVmxPfEKp8mLSDIzPPvakkeHS7hydiip2mIAiOVixCcb/w+Js5P48iMaVD\n' +
    '8P6BIFH6GzuuEVr6U/Wk+8eWRaW0VmqGnZpqh/nyUSv5xsN9rlF9I8Yki9IWoNU8\n' +
    'Pfjy5GMCKoPS7xsiD8cWRuj2sx4oqSsUdbqvmDexmr5etQZyUgIOkvJuP5boPy62\n' +
    'bQIDAQAB\n' +
    '-----END EC PUBLIC KEY-----';

export const baseUrl = process.env.NODE_ENV === 'production' ?
    "https://rsbi-api.relationshipapp.com/" : //正式
    "http://xwcs.xyruxue.com" //测试


const cidServiceAxios = new NewAxios({
    baseURL:baseUrl,
    timeout:50000000000000
})

//
const service = cidServiceAxios.instance

export { service}
