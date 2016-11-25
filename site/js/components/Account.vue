<template>
	<div>
		<div class="mdl-grid">
			<div class="mdl-cell mdl-cell--1-col mdl-cell--11-offset">
				<button v-on:click="editBudget()">Edit Budget</button>
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
						<td><i class="material-icons pointer">delete</i></td>
					</tr>
					</tbody>
				</table>
				<button data-modal-open="addExpense"
						class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
					Add New Expense Item
				</button>

			</div>
			<div class="mdl-cell mdl-cell--4-col">
				<h4>Income:</h4>
				<table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" v-if="expenses.length > 0">
					<thead>
					<tr>
						<th class="mdl-data-table__cell--non-numeric">Income</th>
						<th class="mdl-data-table__cell--non-numeric">Category</th>
						<th>Value</th>
						<th></th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="item in income">
						<td class="mdl-data-table__cell--non-numeric">{{ item.name }}</td>
						<td class="mdl-data-table__cell--non-numeric">{{ item.category }}</td>
						<td>{{ item.value }}</td>
						<td><i class="material-icons pointer" v-on:click="deleteIncome(item.id)">delete</i></td>
					</tr>
					</tbody>
				</table>
				<button data-modal-open="addIncome"
						class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
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
							Login
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
					<p>This is a test modal.</p>
					<button data-modal-close="addIncome">Close</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import _ from 'lodash';
	export default {
	    data() {
	      return {
	      	income: [],
	      	expenses: [],
	      	incomeItem: {
	      		category: 0,
	      		value: 0
	      	},
	      	expenseItem: {
	      		name: '',
	      		category: 0,
	      		value: 0
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
	    	editBudget(){

	    	},
	    	addExpenseItem(){
	    		let cat = this.categoryList;
	    		let ei = this.expenseItem
	    		let index = _.findIndex(this.expenses, function(o) { return o.category == cat[ei.category]; });
	    		if(index != -1){
	    			let item = this.expenses[index];
	    			item.spent += this.expenseItem.value;
	    			this.expenses.splice(index, 1, item);
	    			this.expenseItem.value = 0;
	    			this.expenseItem.category = 0;
	    			var snackbar = document.querySelector('#toast');
	    			snackbar.MaterialSnackbar.showSnackbar({message: "Expense Item added to budget."});
	    			$('[data-modal-close="addExpense"]').click();
	    		}
	    	}
	    },
	    created(){
	    	this.income = [{id: 1, name: "Checking", category: "Work", value: 150.00}];
	    	this.expenses = [{id: 1, name: "Checking", category: "Food", budgeted: 150.00, spent: 75.00, remaining: 75.00}];
	    },
	    mounted(){
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