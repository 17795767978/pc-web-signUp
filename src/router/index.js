import Vue from 'vue';
import Router from 'vue-router';

const home = r => require.ensure([], () => r(require('../views/home/Index')), 'home');
const realName = r => require.ensure([], () => r(require('../views/realName/Index')), 'realName');
// 乐队报名
const addMemberInfo = r => require.ensure([], () => r(require('../views/addMemberInfo/')), 'addMemberInfo');
// 成员信息完善
const bandSignUp = r => require.ensure([], () => r(require('../views/bandSignUp/')), 'bandSignUp');
// 经纪人完善报名信息
const agentSignUp = r => require.ensure([], () => r(require('../views/agentSignUp/')), 'agentSignUp');
// 乐队确认
const bandConfirmation = r => require.ensure([], () => r(require('../views/bandConfirmation/')), 'bandConfirmation');
const agentConfirmation = r => require.ensure([], () => r(require('../views/agentConfirmation/')), 'agentConfirmation');

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: home
    },
    {
      path: '/real-name',
      component: realName
    },
    {
      path: '/band-confirmation',
      component: bandConfirmation
    },
    {
      path: '/agent-confirmation',
      component: agentConfirmation
    },
    {
      path: '/band-signUp',
      component: bandSignUp
    },
    {
      path: '/add-memberInfo',
      component: addMemberInfo
    },
    {
      path: '/agent-signUp',
      component: agentSignUp
    }
  ],
  scrollBehavior () {
    return { x: 0, y: 0 };
  }
});
