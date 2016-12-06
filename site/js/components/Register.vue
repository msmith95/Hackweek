<template>
	<div class="mdl-shadow--2dp wide-form">
		<form action="#">
            <p class="hiddenError" id="message"></p>
			<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
				<input class="mdl-textfield__input" type="text" id="email" v-model="credentials.email">
				<label class="mdl-textfield__label" for="email">Email</label>
			</div>
		<br>
			<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
				<input class="mdl-textfield__input" type="password" id="password" v-model="credentials.password">
				<label class="mdl-textfield__label" for="password">Password</label>
			</div>
		<br>
			<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
				<input class="mdl-textfield__input" type="password" id="confirm_password" v-model="credentials.password_confirmation">
				<label class="mdl-textfield__label" for="password">Confirm Password</label>
			</div>
		<br>
			<button v-on:click.prevent="submit()" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
			Register
			</button>
		</form>
	</div>
</template>

<style>
	.wide-form{
		width:512px;
		padding-left:15px;
		padding-bottom:15px;
		margin-top: 15px;
		margin-left:auto;
		margin-right:auto;
	}
</style>

<script type="text/javascript">
	import auth from '../auth';
	  export default {
	    data() {
	      return {
	        credentials: {
	          email: '',
	          password: '',
	          password_confirmation: ''
	        },
	        error: ''
	      }
	    },
	    methods: {
            /**
             * Submits the register request with the auth provider
             */
	      submit() {
	      	$(".hiddenError").hide();
	      	$("#message").empty();
	        let credentials = {
	          email: this.credentials.email,
	          password: this.credentials.password,
	          password_confirmation: this.credentials.password_confirmation
	        }
            auth.signup(this, credentials)
	      }
	    },
	}
</script>