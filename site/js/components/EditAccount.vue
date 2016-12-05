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
                               v-model="category.budgeted">
                    </div>
                </td>
                <td>
                    <i class="material-icons pointer" v-on:click="deleteItem(category.id)">delete</i>
                </td>
            </tr>
            </tbody>
        </table>
        <button v-on:click="updateBudget()"
                class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent padding-top">
            Save Changes
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
        <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored fab" v-on:click="addBudgetCategory()">
            <i class="material-icons">add</i>
        </button>
    </div>
</template>
<style>

</style>
<script>
    import store from '../storage';
    import _ from 'lodash';
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
                item.id = null;
                item.category = this.categoryList[this.addedCategory.index];
                item.budgeted = this.addedCategory.budgeted;
                item.spent = 0;
                item.remaining = item.budgeted;
                this.categories.push(item);
                $("[data-modal-close=addBudgetCategory]").click();
                var snackbar = document.querySelector('#toast');
                snackbar.MaterialSnackbar.showSnackbar({message: "Expense Category added to budget."});
                $('[data-modal-close="addExpense"]').click();
            },
            deleteItem(id){
                var index = _.findIndex(this.categories, function(o) { return o.id == id; });
                let params = {accountID: this.$route.params.accountID, expenseID: id};
                this.$http.post("https://service.michaeldsmithjr.com/api/deleteBudgetItem?api_token=" + localStorage.getItem('api_token'), params).then((response)=>{
                    if(response.ok){
                        console.log(index);
	    		        this.categories.splice(index, 1);
	    		        var snackbar = document.querySelector('#toast');
                        snackbar.MaterialSnackbar.showSnackbar({message: "Expense Category successfully deleted"});
                    }
                }).catch((err)=>{
                    console.log(err);
                });

            },
            updateBudget(){
                let params = {accountID: this.$route.params.accountID, budgetItems: this.categories};
                let vm = this;
                this.$http.post("https://service.michaeldsmithjr.com/api/updateBudget?api_token=" + localStorage.getItem('api_token'), params).then((response)=>{
                    vm.$router.go(-1);
                }).catch((err)=>{
                    console.log(err);
                });
            },
            addBudgetCategory(){
                var modal = $("[data-modal=addBudgetCategory]");
				var modalContent = modal.find(".modal-content");
				modalContent.css("top", "0");
				modal.show();
				modalContent.animate({top: '35%'}, 300);
            }
        },
        created(){
	    	this.categories = store.accounts[this.$route.params.accountID].expense_items;
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
	    }
    }
</script>
