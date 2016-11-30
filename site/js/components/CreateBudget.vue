<template>
    <div>
        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp horiz-center">
            <thead>
            <tr>
                <th class="mdl-data-table__cell--non-numeric">Budget Item</th>
                <th class="mdl-data-table__cell--non-numeric">Current Budgeted Amount</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="category in categories">
                <td class="mdl-data-table__cell--non-numeric">{{ category.category }}</td>
                <td>
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="number" id="value"
                               :value="category.budgeted">
                    </div>
                </td>
                <td>
                    <i class="material-icons pointer" v-on:click="deleteItem(item.id)">delete</i>
                </td>
            </tr>
            </tbody>
        </table>
        <button v-on:click="saveBudget()"
                class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent padding-top">
            Save Budget
        </button>
        <div class="modal" data-modal="addBudgetCategory">
            <div class="modal-content">
                <div class="mdl-grid">
                    <div class="mdl-cell--1-col mdl-cell--11-offset">
                        <i class="material-icons pointer" data-modal-close="addBudgetCategory">close</i>
                    </div>
                </div>
                <div class="mdl-textfield mdl-js-textfield">
                    <label for="addCategory">Category</label>
                    <select id="addCategory" name="expenseCategory" v-model="addedCategory.index">
                        <option v-for="(category, index) in categoryList" :value="index">{{ category }}</option>
                    </select>
                </div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="number" id="addBudget"
                           v-model="addedCategory.budgeted">
                    <label class="mdl-textfield__label" for="addBudget">Amount you want to budget?</label>
                </div>
                <button v-on:click.prevent="addCategory()"
                        class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                    Save
                </button>
            </div>
        </div>
    </div>
</template>
<style>

</style>
<script>
    import _ from 'lodash';
    import store from '../storage';
    export default{
        data(){
            return{
                categories: [],
                categoryList: [
	      		    "Groceries", "Gas", "Out to Eat", "Food"
	      	    ],
	      	    addedCategory: {
	      	        name: '',
	      	        index: 0,
	      	        budgeted: 0
	      	    }
            }
        },
        methods: {
            addCategory(){
                let item = {};
                item.category = this.categoryList[this.addedCategory.index];
                item.budgeted = this.addedCategory.budgeted;
                item.spent = 0;
                item.remaining = item.budgeted;
                this.categories.push(item);
                this.addedCategory.index = 0;
                this.addedCategory.budgeted = 0;
                $("[data-modal-close=addBudgetCategory]").click();
                var snackbar = document.querySelector('#toast');
                snackbar.MaterialSnackbar.showSnackbar({message: "Expense Category added to budget."});
                $('[data-modal-close="addExpense"]').click();
            },
            deleteItem(id){
                var index = _.findIndex(this.categories, function(o) { return o.id == id; });
	    		console.log(index);
	    		this.categories.splice(index, 1);
            },
            saveBudget(){
                let params = {accountID: this.$route.query.id, expenseItems: this.categories}
                let vm = this;
                this.$http.post('http://service.michaeldsmithjr.com/api/createBudget?api_token=' + localStorage.getItem('api_token'), params).then((response)=>{
                    store.accounts[params.accountID].expense_items = response.body;
                    vm.$router.push('/accounts/' + params.accountID)
                }).catch((err)=>{
                    console.log(err);
                });
            }
        },
	    mounted(){
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
                var modal = $("[data-modal=addBudgetCategory]");
				var modalContent = modal.find(".modal-content");
				modalContent.css("top", "0");
				modal.show();
				modalContent.animate({top: '35%'}, 300);
			});
			$("#rightIcon").show();
	    }
    }
</script>
