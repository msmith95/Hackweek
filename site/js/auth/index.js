// import {router} from '../index';

const API_URL = 'https://service.michaeldsmithjr.com/api/';
//const API_URL = 'http://hackweek-service.dev/api/';
const LOGIN_URL = API_URL + 'login';
const SIGNUP_URL = API_URL + 'register';
import store from '../storage/index.js';
import _ from 'lodash';

export default {

  // User object will let us check authentication status
  user: {
    authenticated: false
  },

  // Send a request to the login URL and save the returned JWT
  login(context, creds, redirect) {
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
      });
      this.user.authenticated = true;
      console.log(data);
      context.$router.push('/dashboard');
      // Redirect to a specified route
      // if(redirect) {
      //   router.go(redirect);
      // }

    })
  },

  signup(context, creds, redirect) {
    context.$http.post(SIGNUP_URL, creds).then((data) => {
      debugger;
      console.log(data.body);
      localStorage.setItem('api_token', data.body.api_token);
      this.user.authenticated = true;

      context.$router.push('/dashboard');
      // if(redirect) {
      //   router.go(redirect);
      // }

    }).catch((err)=>{
      console.log(err);
    });
  },

  // To log out, we just need to remove the token
  logout() {
    localStorage.removeItem('api_token');
    this.user.authenticated = false;
  },

  checkAuth() {
    var jwt = localStorage.getItem('api_token');
    if(jwt) {
      this.user.authenticated = true;
    }
    else {
      this.user.authenticated = false;
    }
  },

  // The object to be passed as a header for authenticated requests
  getAuthHeader() {
    return {
      'Authorization': 'Bearer ' + localStorage.getItem('api_token')
    };
  }
};