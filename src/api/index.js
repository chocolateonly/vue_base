import {service} from "@/config";

const loginApi = data =>{
  return service({
      url:'',
      method:'post',
      data
  })
}

const getListApi = data =>{
    return service({
        url:'',
        method:'get',
        params:data
    })
}

export default {
    loginApi,
    getListApi
}