import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './components/App.vue';
import auth from './auth/index.js';
import Login from './components/Login.vue';

auth.checkAuth();

Vue.use(VueRouter);
Vue.use(VueResource);

const Home = { template: '<div><h2>Home</h2></div>' };

export const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login}
  ]
});
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
  	}
});
