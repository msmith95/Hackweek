<template>
    <div>
        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp horiz-center">
          <thead>
            <tr>
              <th class="mdl-data-table__cell--non-numeric">Account Name</th>
              <th>Current Projected Balance</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="account in accountList">
              <td class="mdl-data-table__cell--non-numeric"><router-link :to="{ name: 'accounts', params: { accountID: account.id }}">{{ account.name }}</router-link></td>
              <td>{{ account.balance }}</td>
              <td><i class="material-icons pointer" v-on:click="deleteAccount(account.id)">delete</i></td>
            </tr>
          </tbody>
        </table>
        <div class="modal" data-modal="addAccount">
            <div class="modal-content">
                <div class="mdl-grid">
                    <div class="mdl-cell--1-col mdl-cell--11-offset">
                        <i class="material-icons pointer" data-modal-close="addAccount">close</i>
                    </div>
                </div>
                <div class="mdl-textfield mdl-js-textfield">
                    <input class="mdl-textfield__input" type="text" id="addName"
                           v-model="account.name">
                    <label class="mdl-textfield__label" for="addName">Account Name</label>
                </div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="number" id="addBalance"
                           v-model="account.balance">
                    <label class="mdl-textfield__label" for="addBalance">Current Account Balance</label>
                </div>
                    <button v-on:click.prevent="saveAccount()"
                                     class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                    Save
                </button>
            </div>
        </div>
        <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored fab" v-on:click="addAccount()">
            <i class="material-icons">add</i>
        </button>
    </div>
</template>

<script type="text/javascript">
    import store from '../storage';
    import Vue from 'vue';
	 export default {
	    data() {
	      return {
	      	accountList: [],
	      	account:{
	      	    name: '',
	      	    balance: 0
	      	}
	      }
	    },
	    methods: {
            /**
             * Saves a new account by making the request to the service, handling any errors,
             * and updating the UI
             */
	        saveAccount(){
	            let vm = this;
	            this.$http.post("https://service.michaeldsmithjr.com/api/createAccount?api_token=" + localStorage.getItem('api_token'), this.account).then((response)=>{
	                 console.log(response);
	                 let account = {id: response.body.id, name: response.body.name, balance: response.body.balance};
	                 store.accounts[account.id] = account;
	                 $("[data-modal-close=addAccount]").click();
                     vm.$router.push('/createBudget?id='+account.id);
	            }).catch((err)=>{
	                console.log(err);
	            });

	        },
            /**
             * Deletes an account by making the request to the service, handling any errors,
             * and updating the UI
             * @param id - ID of account to be deleted
             */
	        deleteAccount(id){
	            let vm = this;
	            let params = {accountID: id};
	            this.$http.post("https://service.michaeldsmithjr.com/api/deleteAccount?api_token=" + localStorage.getItem('api_token'), params).then((response)=>{
	                if(response.ok){
	                    Vue.delete(vm.accountList, params.accountID);
	                    var snackbar = document.querySelector('#toast');
						snackbar.MaterialSnackbar.showSnackbar({message: "Account successfully deleted"});
	                }
	            }).catch((err)=>{
	                console.log(err);
	            });
	        },
            /**
             * Shows the modal to add an account
             */
	        addAccount(){
	            var modal = $("[data-modal=addAccount]");
				var modalContent = modal.find(".modal-content");
				modalContent.css("top", "0");
				modal.show();
				modalContent.animate({top: '35%'}, 300);
			}
	    },
         /**
          * Performs a redirect if the state store is not loaded and
          * hides all modals and shows the back button
          */
	    mounted(){
	        this.accountList = store.accounts;
	        if(!store.loaded){
	            this.$router.push('/');
	            return;
	        }
			$("#backButton").show();
			$('.modal').hide();
			$("[data-modal-close]").click(function (){
				var modalID = $(this).attr("data-modal-close");
				var modal = $("[data-modal="+modalID+"]");
				var modalContent = modal.find(".modal-content");
				modalContent.animate({top: '-50%'}, 300, function (){
					modal.hide();
				});
			});
	    }
	}
</script>