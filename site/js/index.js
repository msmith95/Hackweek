import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
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
	Vue.http.get('https://service.michaeldsmithjr.com/api/user?api_token=' + localStorage.getItem('api_token')).then((response)=>{
		console.log(response);
		_.forEach(response.body.accounts, function(value){
			store.accounts[value.id] = value;
			_.forEach(value.expense_items, function(expenseItem){
				if(store.expenseItemsSum[expenseItem.category]){
					store.expenseItemsSum[expenseItem.category] += expenseItem.spent;
					store.totalExpense += expenseItem.spent;
				}else{
					store.expenseItemsSum[expenseItem.category] = expenseItem.spent;
					store.totalExpense += expenseItem.spent;
				}
			});
			_.forEach(value.income_items, function(incomeItem){
				store.incomeItemsSum[incomeItem.name] = incomeItem.value;
				store.totalIncome += incomeItem.value;
			});
		});
		console.log(store);
	}).catch((err)=>{

	});
}


const Home = { template: '<div><h2>Home</h2><p>Money Manager is an application created by Michael Smith Jr for his CS4830 hack week project.' +
'It allows you to manage your expenses and income.  It provides graphs that help you to see where you are spending your money and ' +
'where you might possibly be able to save money. Lastly it allows you to create a budget for yourself and see just how closly you' +
' follow it.</p></div>' };

let loggedInGuard = (to, from, next)=>{
	if(auth.user.authenticated){
		next('/dashboard');
	}else{
		next();
	}
};

let authGuard = (to, from, next)=>{
	if(!auth.user.authenticated){
		next('/');
	}else{
		next();
	}
};

export let router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes :[
    { path: '/', component: Home, beforeEnter: loggedInGuard },
    { path: '/login', component: Login, beforeEnter: loggedInGuard},
    { path: '/register', component: Register, beforeEnter: loggedInGuard},
    { path: '/accounts', component: AccountList, beforeEnter: authGuard},
    { path: '/accounts/:accountID', name: 'accounts', component: Account, beforeEnter: authGuard},
	  { path: '/accounts/:accountID/editBudget', name: 'editBudget', component: EditAccount, beforeEnter: authGuard},
	  { path: '/dashboard', component: Dashboard, beforeEnter: authGuard},
	  { path: '/createBudget', component: CreateBudget, beforeEnter: authGuard}
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
  	user: auth.user,
    store: store
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
		},
		logout(){
  			auth.logout();
  			window.location = "/";
		}
	}
});
