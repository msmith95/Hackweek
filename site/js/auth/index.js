// import {router} from '../index';

const API_URL = 'http://service.michaeldsmithjr.com/api/';
const LOGIN_URL = API_URL + 'login';
const SIGNUP_URL = API_URL + 'register';

export default {

  // User object will let us check authentication status
  user: {
    authenticated: false
  },

  // Send a request to the login URL and save the returned JWT
  login(context, creds, redirect) {
    context.$http.post(LOGIN_URL, creds, (data) => {
      localStorage.setItem('api_token', data.api_token);

      this.user.authenticated = true;
      console.log(data);
      this.$router.push('/dashboard');
      // Redirect to a specified route
      // if(redirect) {
      //   router.go(redirect);
      // }

    }).error((err) => {
      context.error = err;
    });
  },

  signup(context, creds, redirect) {
    context.$http.post(SIGNUP_URL, creds, (data) => {
      localStorage.setItem('api_token', data.api_token);

      this.user.authenticated = true;

      console.log(data);
      this.$router.push('/dashboard');
      // if(redirect) {
      //   router.go(redirect);
      // }

    }).then((err) => {
      context.error = err;
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