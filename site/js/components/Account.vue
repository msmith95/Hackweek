<template>
	<div>
		<div class="mdl-grid">
			<div class="mdl-cell mdl-cell--1-col mdl-cell--11-offset">
				<!--<button v-on:click="editBudget()">Edit Budget</button>-->
				<router-link class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" :to="{ name: 'editBudget', params: { accountID: this.$route.params.accountID }}" tag="button">Edit Budget</router-link>
			</div>
		</div>
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--4-col" id="accountExpensesVsIncome">

            </div>
            <div class="mdl-cell mdl-cell--4-col" id="accountExpenses">

            </div>
            <div class="mdl-cell mdl-cell--4-col" id="accountIncome">

            </div>
        </div>
		<div class="mdl-grid">
			<div class="mdl-cell mdl-cell--4-col">

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

<script type="text/javascript">
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
	      	],
            totalIncome:0,
            totalExpense:0
	      }
	    },
	    methods: {
	    	deleteIncome(id){
	    		let index = _.findIndex(this.income, function(o) { return o.id == id; });
	    		let params = {accountID: this.$route.params.accountID, incomeID: id};
	    		this.$http.post("https://service.michaeldsmithjr.com/api/deleteIncomeItem?api_token=" + localStorage.getItem('api_token'), params).then((response)=>{
	    		    console.log(index);
	    		    this.totalIncome -= this.income[index].value;
	    		    this.income.splice(index, 1);
                    this.createAccountIncomeChart();
                    this.createAccountExpenseVsIncomeChart();
	    		    let snackbar = document.querySelector('#toast');
					snackbar.MaterialSnackbar.showSnackbar({message: "Income successfully deleted"});
	    		}).catch((err)=>{
	    		    console.log(err);
	    		});
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
	    		this.$http.post('https://service.michaeldsmithjr.com/api/updateExpense?api_token=' + localStorage.getItem('api_token'), params).then((response)=>{
                    this.totalExpense -= this.expenses[this.expenseItem.index].spent;
                    this.totalExpense += item.spent;
                    this.expenses.splice(this.expenseItem.index, 1, item);
                    this.createAccountExpenseChart();
                    this.createAccountExpenseVsIncomeChart();
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
	    			this.$http.post('https://service.michaeldsmithjr.com/api/updateExpense?api_token=' + localStorage.getItem('api_token'), params).then((response)=>{
                        this.totalExpense += item.spent;
	    				this.expenses.splice(index, 1, item);
	    				this.createAccountExpenseChart();
	    				this.createAccountExpenseVsIncomeChart();
						this.expenseItem.value = 0;
						this.expenseItem.category = 0;
						let snackbar = document.querySelector('#toast');
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
	    		item.income = this.incomeItem.value;
	    		let params = {accountID: this.$route.params.accountID, incomeName: item.name, incomeValue: item.value}
	    		this.$http.post("https://service.michaeldsmithjr.com/api/createIncomeItem?api_token=" + localStorage.getItem('api_token'), params).then((response)=>{
	    			this.totalIncome += item.income;
	    			this.incomeItem.name = '';
					this.incomeItem.value = 0;
					this.income.push(item);
                    this.createAccountIncomeChart();
                    this.createAccountExpenseVsIncomeChart();
					$('[data-modal-close="addIncome"]').click();
	    		}).catch((err)=>{
	    			console.log(err);
	    		});
	    	},
            createAccountExpenseChart(){
                let expenseData = new google.visualization.DataTable();
                expenseData.addColumn('string', 'Category');
                expenseData.addColumn('number', 'Spent');
                let vm = this;
                _.forEach(this.expenses, function(value){
                    expenseData.addRow([value.category, value.spent]);
                    vm.totalExpense += value.spent;
                });
                let options = {'title':'Breakdown of expenses by category',
                    'width':400,
                    'height':300};
                let totalExpenses = new google.visualization.PieChart(document.getElementById('accountExpenses'));
                totalExpenses.draw(expenseData, options);
            },
            createAccountIncomeChart(){
                let incomeData = new google.visualization.DataTable();
                incomeData.addColumn('string', 'Source');
                incomeData.addColumn('number', 'Amount');
                let vm = this;
                _.forEach(this.income, function(value){
                    incomeData.addRow([value.name, value.income]);
                    vm.totalIncome += value.income;
                });
                let options = {'title': 'Breakdown of income by source',
                    'width': 400,
                    'height': 300};
                let totalIncome = new google.visualization.PieChart(document.getElementById('accountIncome'));
                totalIncome.draw(incomeData, options);
            },
            createAccountExpenseVsIncomeChart(){
                let data = new google.visualization.DataTable();
                data.addColumn('string', 'Type');
                data.addColumn('number', 'Amount');
                data.addRows([
                    ['Expenses', this.totalExpense],
                    ['Income', this.totalIncome]
                ]);
                let options = {'title': "Expenses vs Income",
                    'width': 400,
                    'income': 300};
                let chart = new google.visualization.PieChart(document.getElementById('accountExpensesVsIncome'));
                chart.draw(data, options);
            }
	    },
	    created(){
	    	this.income = store.accounts[this.$route.params.accountID].income_items;
	    	this.expenses = store.accounts[this.$route.params.accountID].expense_items;
			console.log(store);
	    },
	    mounted(){
            this.createAccountExpenseChart();
            this.createAccountIncomeChart();
            this.createAccountExpenseVsIncomeChart();
	    	$('.modal').hide();
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