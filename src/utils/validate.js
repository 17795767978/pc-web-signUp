import Vue from 'vue';
import VeeValidate, {Validator} from 'vee-validate';
import {checkCode, checkDate, checkProv} from './index';
import zhCN from 'vee-validate/dist/locale/zh_CN';

const config = {
  errorBagName: 'errors',
  delay: 0,
  locale: 'zh_CN',
  events: 'blur',
  inject: true
};

Vue.use(VeeValidate, config);

Validator.localize('zh_CN', zhCN);

const dictionary = {
  zh_CN: {
    messages: {
      email: function () {
        return '请输入正确的邮箱格式';
      },
      required: function (field) {
        return '请输入' + field;
      }
    },
    attributes: {
      userName: '姓名',
      telephone: '手机号',
      captcha: '验证码',
      gender: '性别',
      idCard: '身份证号',
      bandName: '乐队名称',
      academy: '院校名称',
      summary: '乐队简介',
      identity: '对内身份',
      weight: '身高',
      height: '体重',
      introduction: '简介',
      highUnit: '院校',
      leaderName: '队长姓名'
    }
  }
};

Validator.localize(dictionary);

// 手机号
Validator.extend('telephone', {
  getMessage: field => {
    return '请输入正确的' + field;
  },
  validate: value => {
    return value.length === 11 && /^1[34578]\d{9}$/.test(value);
  }
});

// 姓名
Validator.extend('userName', {
  getMessage: field => field + '必须是中文汉字',
  validate: value => {
    return /^[\u4e00-\u9fa5]+$/.test(value);
  }
});

// 密码
Validator.extend('password', {
  getMessage: field => field + '必须是8-16位非纯数字',
  validate: value => {
    return /^(?![0-9]*$)[a-zA-Z0-9_]{8, 16}$/.test(value);
  }
});

// 确认密码
Validator.extend('confirmPassword', {
  getMessage: field => field + '两次输入密码不一致',
  validate: (value, originValue) => {
    return value === originValue;
  }
});

// 验证码
Validator.extend('captcha', {
  getMessage: field => field + '必须是6位数字',
  validate: value => {
    return /^\d{6}$/.test(value);
  }
});

// 身份证
Validator.extend('idCard', {
  getMessage: field => field + '输入有误',
  validate: value => {
    if (checkCode(value)) {
      let date = value.substring(6, 14);
      if (checkDate(date)) {
        if (checkProv(value.substring(0, 2))) {
          return true;
        }
      }
    }
    return false;
  }
});

// 身高
Validator.extend('weight', {
  getMessage: field => field + '输入有误',
  validate: value => {
    return /^(0{1}|[1-9]\d{0,3}|.{0})$/.test(value);
  }
});

// 体重
Validator.extend('height', {
  getMessage: field => field + '输入有误',
  validate: value => {
    return /^(0(\.\d{1}){0,1}|[1-8]\d{1,3}(\.\d{1}){0,1}|9\d{1,2}(\.\d{1}){0,1}|999(\.0){0,1}|.{0})$/.test(value);
  }
});
