<template>
	<div class="mdl-shadow--2dp">
		<form action="#">
		  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
		    <input class="mdl-textfield__input" type="text" id="email" v-model="credentials.email">
		    <label class="mdl-textfield__label" for="email">Email</label>
		  </div>
		  <br>
		  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
		    <input class="mdl-textfield__input" type="text" id="password" v-model="credentials.password">
		    <label class="mdl-textfield__label" for="password">Password</label>
		  </div>
		</form>
	</div>
</template>

<script>
	import auth from '../auth';
	  export default {
	    data() {
	      return {
	        // We need to initialize the component with any
	        // properties that will be used in it
	        credentials: {
	          email: '',
	          password: ''
	        },
	        error: ''
	      }
	    },
	    methods: {
	      submit() {
	        var credentials = {
	          email: this.credentials.email,
	          password: this.credentials.password
	        }
	        // We need to pass the component's this context
	        // to properly make use of http in the auth service
	        auth.login(this, credentials, 'secretquote')
	      }
	    },
	}
</script>