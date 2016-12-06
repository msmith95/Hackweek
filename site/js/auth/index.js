const API_URL = 'https://service.michaeldsmithjr.com/api/';
const LOGIN_URL = API_URL + 'login';
const SIGNUP_URL = API_URL + 'register';
import store from '../storage/index.js';
import _ from 'lodash';

export default {

  // User object will let us check authentication status
  user: {
    authenticated: false
  },

	/**
	 * Sends a request to the login server and handles any errors. Upon successful login
	 * it will also load all of the users accounts
	 * @param context - Vue.js context
	 * @param creds - Login credentials
	 */
  login(context, creds) {
    context.$http.post(LOGIN_URL, creds).then((data) => {
      localStorage.setItem('api_token', data.body.api_token);
      _.forEach(data.body.accounts, function(value){
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
          console.log("finished parsing");
          store.loaded = true;
      });
      this.user.authenticated = true;
      console.log(data);
      context.$router.push('/dashboard');

    }).catch((err)=>{
		$(".hiddenError").show();
    })
  },

	/**
	 * Sends a request to the register endpoint and handles any errors
	 * @param context - Vue.js context
	 * @param creds - Credentials to register with
	 */
  signup(context, creds) {
    context.$http.post(SIGNUP_URL, creds).then((data) => {
      //console.log(data.body);
      localStorage.setItem('api_token', data.body.api_token);
      this.user.authenticated = true;
        store.loaded = true;
      context.$router.push('/dashboard');

    }).catch((err)=>{
      //console.log(err);
      _.forEach(err.body, function(value){
		  $("#message").append(value + "<br>");
	  });
      $("#message").show();
    });
  },

	/**
	 * Logges out the user by removing the API token from storage
	 * and setting the authenticated variable to false.
	 */
	logout() {
		localStorage.removeItem('api_token');
		this.user.authenticated = false;
  },
	/**
	 * Determines whether a user is logged in by the presence of the
	 * API token
	 */
  checkAuth() {
    let jwt = localStorage.getItem('api_token');
    this.user.authenticated = !!jwt;
  }
};