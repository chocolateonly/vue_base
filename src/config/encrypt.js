import {PUBLIC_KEY} from '@/config/index'
import '@/utils/jssm2.js'
import { JSSM3 } from '@/utils/jssm3.js'
const JM4_Obj = require('@/utils/jssm4.js');
const JM4 = JM4_Obj.JSSM4;



export default {
    // AES 加密
    encrypt(data) {
        let id = Math.random().toString();
        let secret = JSSM3(id);
        let sm4 = new JM4(secret);
        let data_s = JSON.stringify(data);
        let enData = sm4.encryptData_ECB(data_s);
        let sm2 = new JSSM2({});
        sm2.setPublicKey(PUBLIC_KEY);
        return {
            "data": enData,
            "key": sm2.encrypt(secret),
        }
    },

    // AES 解密
    decrypt(data) {
        let sm2 = new JSSM2({});
        return sm2.decrypt(data)
    }
}