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
import CreateBudget from './components/CreateBudget.vue';
import store from './storage/index.js';
import _ from 'lodash';
//import {router} from './router.js';

auth.checkAuth();

Vue.use(VueRouter);
Vue.use(VueResource);

if(auth.user.authenticated){
	Vue.http.get('http://service.michaeldsmithjr.com/api/user?api_token=' + localStorage.getItem('api_token')).then((response)=>{
		console.log(response);
		_.forEach(response.body.accounts, function(value){
			store.accounts[value.id] = value;
		});
		console.log(store);
	}).catch((err)=>{

	});
}

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
	  { path: '/dashboard', component: Dashboard},
	  { path: '/createBudget', component: CreateBudget}
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
