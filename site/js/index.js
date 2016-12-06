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

auth.checkAuth();

Vue.use(VueRouter);
Vue.use(VueResource);

/**
 * Gets the user information if the user is authenticated when they first visit
 */
if(auth.user.authenticated){
	Vue.http.get('https://service.michaeldsmithjr.com/api/user?api_token=' + localStorage.getItem('api_token')).then((response)=>{
		//console.log(response);
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
				store.incomeItemsSum[incomeItem.name] = incomeItem.income;
				store.totalIncome += incomeItem.income;
			});
		});
		//console.log(store);
		store.loaded = true;
	}).catch((err)=>{

	});
}


const Home = { template: '<div><h2>Home</h2><p>Money Manager is an application created by Michael Smith Jr for his CS4830 hack week project.' +
'It allows you to manage your expenses and income.  It provides graphs that help you to see where you are spending your money and ' +
'where you might possibly be able to save money. Lastly it allows you to create a budget for yourself and see just how closly you' +
' follow it.</p></div>' };

/**
 * Defines a guard to redirect users if they are authenticated on an non-auth protected route
 * @param to
 * @param from
 * @param next
 */
let loggedInGuard = (to, from, next)=>{
	if(auth.user.authenticated){
		next('/dashboard');
	}else{
		next();
	}
};

/**
 * Defines a guard to redirect users if not authenticated
 * @param to
 * @param from
 * @param next
 */
let authGuard = (to, from, next)=>{
	if(!auth.user.authenticated){
		next('/');
	}else{
		next();
	}
};

/**
 * Creates the Vue Router which handles all navigation within the application
 * @type {vuejs.Router<RootVueApp>}
 */
export let router = new VueRouter({

  base: __dirname,
  routes :[
    { path: '/', component: Home},
    { path: '/login', component: Login, beforeEnter: loggedInGuard},
    { path: '/register', component: Register, beforeEnter: loggedInGuard},
    { path: '/accounts', component: AccountList, beforeEnter: authGuard},
    { path: '/accounts/:accountID', name: 'accounts', component: Account, beforeEnter: authGuard},
	  { path: '/accounts/:accountID/editBudget', name: 'editBudget', component: EditAccount, beforeEnter: authGuard},
	  { path: '/dashboard', component: Dashboard, beforeEnter: authGuard},
	  { path: '/createBudget', component: CreateBudget, beforeEnter: authGuard}
  ]
});

/**
 * Defines the root Vue js instance
 * @type {vuejs.Vue}
 */
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
