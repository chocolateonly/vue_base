import {
  Message
} from 'element-ui'

export function message(title) {
  // uni.showToast({
  // 	icon: 'none',
  // 	title: title
  // })
  Message({
    showClose: true,
    message: title,
    type: "warning"
  });
}
//  success/warning/info/error
export function messageType(message, type) {
  Message({
    showClose: true,
    message,
    type
  });
}
// 名字验证
export function names(value, txt) {
  if (value.length > 0) {
    return true;
  }
  Message({
    showClose: true,
    message: "请输入" + txt,
    type: "warning"
  });
  return false
}
// 未输入状态
export function nameto(value, title) {
  if (value != '' && value != null && value.toString().length > 0) {
    return true;
  }
  Message({
    showClose: true,
    message: title + '不能为空',
    type: "warning"
  });
  return false
}
// 图片长度小于5
export function imgLength(value, title) {
  if (value.length > 0 && value != '') {
    return true;
  }
  Message({
    showClose: true,
    message: title + '不能少于1张',
    type: "warning"
  });
  return false
}
/**
 * 账号验证
 */
export function accountNum(value) {
  if (value.length == 0) {
    Message({
      showClose: true,
      message: "请输入账号",
      type: "warning"
    });
    return false
  }

  let reg = /^[a-zA-Z0-9]{4,18}$/
  if (reg.test(value)) {
    return true;
  }

  // if( /^[a-zA-Z0-9]{6,18}$/.test( password ) ) {
  // 	alert( 'ok' );
  // }
  Message({
    showClose: true,
    message: "账号必须是4或18位字母和数字",
    type: "warning"
  });
  return false
}

/**
 * 手机验证
 */
export function checkPhone(value) {
  if (value.length == 0) {
    Message({
      showClose: true,
      message: "请输入手机号",
      type: "warning"
    });
    return false
  }
  let regt = /^(1[3-9][0-9])\d{8}$/;
  let reg = /^1\d{10}$/
  if (regt.test(value) && reg.test(value)) {
    return true;
  }
  Message({
    showClose: true,
    message: "手机号格式错误",
    type: "warning"
  });
  return false
}
/**
 * 联系方式,座机号码第一位是0
 */
export function checkTel(value) {
  if (value.length == 0 || value == '') {
    Message({
      showClose: true,
      message: "请输入联系电话",
      type: "warning"
    });
    return false
  }
  // let reg = /^([0-1][3-9][0-9][0-9])\d{10}$/;
  // let reg = /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[23456789]\d{9})$)/;
  let reg = /^(((\d{3,4}-)?[0-9]{7,8})|(1(3|4|5|6|7|8|9)\d{9}))$/
  if (reg.test(value)) {
    return true;
  }
  Message({
    showClose: true,
    message: "联系电话格式错误",
    type: "warning"
  });
  return false
}
/**
 * 密码验证
 */
export function checkPwd(value) {
  if (value.length >= 8) {
    return true;
  }
  if (value.length == 0) {
    Message({
      showClose: true,
      message: "请输入密码",
      type: "warning"
    });
  } else {
    Message({
      showClose: true,
      message: "密码必须大于8位",
      type: "warning"
    });
  }

  return false
}
/**
 * 验证码验证
 */
export function checkCode(value) {
  if (value.length == 6 || value.length == 4) {
    return true;
  }
  Message({
    showClose: true,
    message: "验证码错误",
    type: "warning"
  });
  return false
}
/**
 * 身份证验证
 */
export function checkIdCard(value) {
  let reg = /^\d{15}|\d{18}$/
  if (reg.test(value)) {
    return true;
  }
  Message({
    showClose: true,
    message: "身份证必须是15或18位数字",
    type: "warning"
  });
  return false
}
/**
 * 银行卡验证
 */
export function checkBankCard(value) {
  let reg = /^([1-9]{1})(\d{14}|\d{15}|\d{16}|\d{18})$/
  if (reg.test(value)) {
    return true;
  }
  Message({
    showClose: true,
    message: "请输入正确的银行卡号",
    type: "warning"
  });
  return false
}
/* 邮箱验证方法一 */
/* export function checkeEmail(value) {
	if (value.length > 3 & ~value.indexOf('@')) {
		return true;
	}
	toast('邮箱地址不合法');
	return false
} */

/* 邮箱验证方法二 */
export function checkeEmail(value) {
  let reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
  if (reg.test(value)) {
    return true;
  }
  Message({
    showClose: true,
    message: "邮箱地址不合法",
    type: "warning"
  });
  return false
}
