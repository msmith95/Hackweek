<template>
    <div>
        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp horiz-center">
          <thead>
            <tr>
              <th class="mdl-data-table__cell--non-numeric">Account Name</th>
              <th>Current Projected Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="account in accountList">
              <td class="mdl-data-table__cell--non-numeric"><router-link :to="{ name: 'accounts', params: { accountID: account.id }}">{{ account.name }}</router-link></td>
              <td>{{ account.balance }}</td>
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
                           :value="account.name">
                    <label class="mdl-textfield__label" for="addName">Account Name</label>
                </div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="number" id="addBalance"
                           v-model="account.currentBalance">
                    <label class="mdl-textfield__label" for="addBalance">Current Account Balance</label>
                </div>
                <button v-on:click.prevent="saveAccount()"
                        class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                    Save
                </button>
            </div>
        </div>
    </div>
</template>

<script>
	 export default {
	    data() {
	      return {
	      	accountList: [],
	      	account:{
	      	    name: '',
	      	    currentBalance: 0
	      	}
	      }
	    },
	    methods: {
	        saveAccount(){
	            $("[data-modal-close=addAccount]").click();
	        }
	    },
	    created(){
	    	this.accountList = [{id: 1, name: "Checking", balance: 1500.00}]
	    },
	    mounted(){
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
			$("#rightIcon").off();
			$("#rightIcon").click(function(){
                var modal = $("[data-modal=addAccount]");
				var modalContent = modal.find(".modal-content");
				modalContent.css("top", "0");
				modal.show();
				modalContent.animate({top: '35%'}, 300);
			});
			$("#rightIcon").show();
	    }
	}
</script>