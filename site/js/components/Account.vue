<template>
	<div>
		<div class="mdl-grid">
			<div class="mdl-cell mdl-cell--1-col mdl-cell--11-offset">
				<!--<button v-on:click="editBudget()">Edit Budget</button>-->
				<router-link class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" :to="{ name: 'editBudget', params: { accountID: this.$route.params.accountID }}" tag="button">Edit Budget</router-link>
			</div>
		</div>
		<div class="mdl-grid">
			<div class="mdl-cell mdl-cell--4-col">
				pie chart
			</div>
			<div class="mdl-cell mdl-cell--4-col">
				<h4>Expenses:</h4>
				<table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" v-if="expenses.length > 0">
					<thead>
					<tr>
						<th class="mdl-data-table__cell--non-numeric">Category</th>
						<th>Budgeted</th>
						<th>Spent</th>
						<th>Remaining</th>
						<th></th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="item in expenses">
						<td class="mdl-data-table__cell--non-numeric">{{ item.category }}</td>
						<td>{{ item.budgeted }}</td>
						<td>{{ item.spent }}</td>
						<td>{{ item.remaining }}</td>
						<td><i class="material-icons pointer" v-on:click="editExpense(item.id)">create</i></td>
					</tr>
					</tbody>
				</table>
				<button data-modal-open="addExpense"
						class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent mt-15">
					Add Expenditure
				</button>

			</div>
			<div class="mdl-cell mdl-cell--4-col">
				<h4>Income:</h4>
				<table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" v-if="expenses.length > 0">
					<thead>
					<tr>
						<th class="mdl-data-table__cell--non-numeric">Source</th>
						<th>Income</th>
						<th></th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="item in income">
						<td class="mdl-data-table__cell--non-numeric">{{ item.name }}</td>
						<td>{{ item.income }}</td>
						<td><i class="material-icons pointer" v-on:click="deleteIncome(item.id)">delete</i></td>
					</tr>
					</tbody>
				</table>
				<button data-modal-open="addIncome"
						class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent mt-15">
					Add Income
				</button>
			</div>
			<div class="modal" data-modal="addExpense">
				<div class="modal-content">
					<div class="mdl-grid">
						<div class="mdl-cell--1-col mdl-cell--11-offset">
							<i class="material-icons pointer" data-modal-close="addExpense">close</i>
						</div>
					</div>
					<form action="#">
						<div class="">
							<label for="expenseCategory">Category</label>
							<select id="expenseCategory" name="expenseCategory" v-model="expenseItem.category">
								<option v-for="(category, index) in categoryList" :value="index">{{ category }}</option>
							</select>
						</div>
						<br>
						<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
							<input class="mdl-textfield__input" type="number" id="value"
								   v-model="expenseItem.value">
							<label class="mdl-textfield__label" for="value">How Much was spent?</label>
						</div>
						<br>
						<button v-on:click.prevent="addExpenseItem()"
								class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
							Save
						</button>
					</form>
				</div>
			</div>
			<div class="modal" data-modal="addIncome">
				<div class="modal-content">
					<div class="mdl-grid">
						<div class="mdl-cell--1-col mdl-cell--11-offset">
							<i class="material-icons pointer" data-modal-close="addIncome">close</i>
						</div>
					</div>
					<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
						<input class="mdl-textfield__input" type="text" id="incomeName"
							   v-model="incomeItem.name">
						<label class="mdl-textfield__label" for="incomeName">Income Name</label>
					</div>
					<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
						<input class="mdl-textfield__input" type="number" id="incomeValue"
							   v-model="incomeItem.value">
						<label class="mdl-textfield__label" for="incomeValue">How Much?</label>
					</div>
					<button v-on:click.prevent="addIncome()"
							class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
						Save
					</button>
				</div>
			</div>
			<div class="modal" data-modal="editExpense">
				<div class="modal-content">
					<div class="mdl-grid">
						<div class="mdl-cell--1-col mdl-cell--11-offset">
							<i class="material-icons pointer" data-modal-close="editExpense">close</i>
						</div>
					</div>
					<div class="mdl-textfield mdl-js-textfield">
						<input class="mdl-textfield__input" type="text" id="editName"
							   :value="expenseItem.name" readonly>
					</div>
					<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
						<input class="mdl-textfield__input" type="number" id="editValue"
							   v-model="expenseItem.value">
						<label class="mdl-textfield__label" for="editValue">How much as been spent?</label>
					</div>
					<button v-on:click.prevent="saveEditedExpenseItem()"
							class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
						Save
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import _ from 'lodash';
	import store from '../storage';
	export default {
	    data() {
	      return {
	      	income: [],
	      	expenses: [],
	      	incomeItem: {
	      		value: 0,
	      		name: ''
	      	},
	      	expenseItem: {
	      		name: '',
	      		category: 0,
	      		value: 0,
	      		index: 0
	      	},
	      	categoryList: [
	      		"Groceries", "Gas", "Out to Eat", "Food"
	      	]
	      }
	    },
	    methods: {
	    	deleteIncome(id){
	    		var index = _.findIndex(this.income, function(o) { return o.id == id; });
	    		console.log(index);
	    		this.income.splice(index, 1);
	    	},
	    	editExpense(id){
				let index = _.findIndex(this.expenses, function(o) { return o.id == id; });
				let item = this.expenses[index];
				this.expenseItem.name = item.category;
				this.expenseItem.value = item.spent;
				this.expenseItem.index = index;
				var modal = $("[data-modal=editExpense]");
				var modalContent = modal.find(".modal-content");
				modalContent.css("top", "0");
				modal.show();
				modalContent.animate({top: '35%'}, 300);
	    	},
	    	saveEditedExpenseItem(){
	    		let item = this.expenses[this.expenseItem.index];
	    		item.spent = this.expenseItem.value;
	    		item.remaining = item.budgeted - item.spent;
	    		let params = {accountID: item.account_id, expenseID: item.id, spent: item.spent, remaining: item.remaining};
	    		this.$http.post('http://service.michaeldsmithjr.com/api/updateExpense?api_token=' + localStorage.getItem('api_token'), params).then((response)=>{
	    			this.expenses.splice(this.expenseItem.index, 1, item);
					this.expenseItem.index = 0;
					this.expenseItem.value = 0;
					this.expenseItem.name = '';
					$('[data-modal-close="editExpense"]').click();
	    		}).catch((err)=>{
	    			console.log(err);
	    		});
	    	},
	    	addExpenseItem(){
	    		let cat = this.categoryList;
	    		let ei = this.expenseItem
	    		let index = _.findIndex(this.expenses, function(o) { return o.category == cat[ei.category]; });
	    		if(index != -1){
	    			let item = this.expenses[index];
	    			item.spent += this.expenseItem.value;
	    			item.remaining = item.budgeted - item.spent;
	    			let params = {accountID: item.account_id, expenseID: item.id, spent: item.spent, remaining: item.remaining};
	    			this.$http.post('http://service.michaeldsmithjr.com/api/updateExpense?api_token=' + localStorage.getItem('api_token'), params).then((response)=>{
	    				this.expenses.splice(index, 1, item);
						this.expenseItem.value = 0;
						this.expenseItem.category = 0;
						var snackbar = document.querySelector('#toast');
						snackbar.MaterialSnackbar.showSnackbar({message: "Expense Item added to budget."});
						$('[data-modal-close="addExpense"]').click();
	    			}).catch((err)=>{
	    				console.log(err);
	    			});
	    		}
	    	},
	    	addIncome(){
	    		let item = {};
	    		item.name = this.incomeItem.name;
	    		item.value = this.incomeItem.value;
	    		let params = {accountID: this.$route.params.accountID, incomeName: item.name, incomeValue: item.value}
	    		this.$http.post("http://service.michaeldsmithjr.com/api/createIncomeItem?api_token=" + localStorage.getItem('api_token'), params).then((response)=>{
	    			this.incomeItem.name = '';
					this.incomeItem.value = 0;
					this.income.push(item);
					$('[data-modal-close="addIncome"]').click();
	    		}).catch((err)=>{
	    			console.log(err);
	    		});
	    	}
	    },
	    created(){
	    	this.income = store.accounts[this.$route.params.accountID].income_items;
	    	this.expenses = store.accounts[this.$route.params.accountID].expense_items;
			//this.income = [{id: 1, name: "Checking", value: 150.00}];
	    	//this.expenses = [{id: 1, name: "Checking", category: "Food", budgeted: 150.00, spent: 75.00, remaining: 75.00}];

			/*if(!store.accounts[vm.$route.params.accountID]){
				$("#loadingSpinner").addClass("is-active");
				$("#loadingSpinner").show();
				this.$http.get("https://jsonplaceholder.typicode.com/posts/1").then((response)=>{
					console.log("Fetch completed");
					$("#loadingSpinner").removeClass("is-active");
					$("#loadingSpinner").hide();
					store.accounts[vm.$route.params.accountID] = true;
					store.expenseItems[vm.$route.params.accountID] = this.expenses;
					store.incomeItems[vm.$route.params.accountID] = this.income;
				})
			}*/
			console.log(store);
	    },
	    mounted(){
	    	$("#rightIcon").hide();
	    	$('.modal').hide();
	    	$("#createIcon").off();
	    	$("#createIcon").click()
			$("[data-modal-open]").click(function (){
				var modalID = $(this).attr("data-modal-open");
				var modal = $("[data-modal="+modalID+"]");
				var modalContent = modal.find(".modal-content");
				modalContent.css("top", "0");
				modal.show();
				modalContent.animate({top: '35%'}, 300);
			});
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

<style>
	.modal{
		background-color: rgba(0,0,0,0.4);
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 1500;
	}

	.stop-scrolling{
		overflow: hidden;
	}

	.modal-content{
		position: fixed;
		top: 50%;
		left: 50%;
		background-color: white;
		width: 500px;
		padding: 20px;
		transform: translate(-50%, -50%);
		overflow: hidden;
		z-index: 999999;
	}

	.pointer{
		cursor: pointer;
	}
</style>