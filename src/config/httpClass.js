import axios from "axios";

class NewAxios{
    instance;
    constructor(options) {
        this.instance = axios.create({
            baseURL:options.baseURL,
            timeout: options.timeout
        });

        this.instance.interceptors.request.use(
            (config) => {
                if (config && config.headers) {
                    config.headers['token'] = localStorage.getItem('token') || ''
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        this.instance.interceptors.response.use(
            (res) => {
                // 对响应数据做点什么
                if (res.data.token && res.data.token !== "") {
                    //覆盖localstorage中token
                    localStorage.setItem("token", res.data.token);
                } else if (res.data.code === 100 || res.data.code === 101 || res.data.code === 102 || res.data.code === 103) {
                    localStorage.removeItem('token');
                    setTimeout(() => {
                        window.location.href = '/'

                    }, 1000);
                }
                return res;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }
}
export default NewAxios