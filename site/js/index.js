import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './components/App.vue';
import auth from './auth/index.js';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import AccountList from './components/AccountList.vue';
import Account from './components/Account.vue';
import EditAccount from './components/EditAccount.vue';
import Dashboard from './components/Dashboard.vue';
import _ from 'lodash';
//import {router} from './router.js';

auth.checkAuth();
console.log(router);

Vue.use(VueRouter);
Vue.use(VueResource);

const Home = { template: '<div><h2>Home</h2></div>' };

export let router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes :[
    { path: '/', component: Home },
    { path: '/login', component: Login},
    { path: '/register', component: Register},
    { path: '/accounts', component: AccountList},
    { path: '/accounts/:accountID', name: 'accounts', component: Account},
	  { path: '/accounts/:accountID/editBudget', name: 'editBudget', component: EditAccount},
	  { path: '/dashboard', component: Dashboard}
  ]
});

// router.routes = [
//     { path: '/', component: Home },
//     { path: '/login', component: Login}
//   ];

const app = new Vue({
  router:router,
  el: '#app',
  data: {
  	user: auth.user
  },
  updated(){
  	this.$nextTick(function () {
	    var el = $("#app");
	       componentHandler.upgradeElements(el);
	   	});
  	},
	methods:{
  		goBack(){
  			this.$router.back();
		}
	}
});
