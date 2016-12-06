<template>
	<div>
		<div class="mdl-shadow--2dp wide-form">
			<form action="#">
                <p class="hiddenError">Invalid username or password</p>
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
				<button v-on:click.prevent="submit()" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
				Login
				</button>
			</form>
		</div>
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
	          password: ''
	        },
	        error: ''
	      }
	    },
	    methods: {
            /**
             * Submits the login request using the auth provider
             */
	      submit() {
	        var credentials = {
	          email: this.credentials.email,
	          password: this.credentials.password
	        }
	        $(".hiddenError").hide();
	        auth.login(this, credentials)

	      }
	    },
	}
</script>