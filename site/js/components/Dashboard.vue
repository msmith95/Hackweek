<template>
    <div>
        <h1>Dashboard</h1>
        <p>The dashboard shows data that has been aggregates from all of the accounts you have added to the system.
            It allows you to see everything at a glance before looking at everything account by account</p>
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--4-col" id="totalExpenses">

            </div>
            <div class="mdl-cell mdl-cell--4-col" id="totalIncome">

            </div>
            <div class="mdl-cell mdl-cell--4-col" id="expensesVsIncome">

            </div>
        </div>
    </div>
</template>
<style>
</style>
<script type="text/javascript">
    import _ from 'lodash';
	import store from '../storage';
    export default{
        data(){
            return{

            }
        },
        created(){
            $("#backButton").hide();

        },
        methods: {
            /**
             * Draws the expense chart using Google charts
             */
        	createExpenseChart(){
        		console.log(google);
                let expenseData = new google.visualization.DataTable();
                expenseData.addColumn('string', 'Category');
                expenseData.addColumn('number', 'Spent');
                _.forEach(store.expenseItemsSum, function(value, key){
                    expenseData.addRow([key, value]);
                });
                let options = {'title':'Breakdown of expenses by category',
                    'width':400,
                    'height':300};
                let totalExpenses = new google.visualization.PieChart(document.getElementById('totalExpenses'));
                totalExpenses.draw(expenseData, options);
            },
            /**
             * Draws the income chart using Google charts
             */
            createIncomeChart(){
        		let incomeData = new google.visualization.DataTable();
        		incomeData.addColumn('string', 'Source');
        		incomeData.addColumn('number', 'Amount');
        		_.forEach(store.incomeItemsSum, function(value, key){
        			incomeData.addRow([key, value]);
                });
        		let options = {'title': 'Breakdown of income by source',
                    'width': 400,
                    'height': 300};
        		let totalIncome = new google.visualization.PieChart(document.getElementById('totalIncome'));
        		totalIncome.draw(incomeData, options);
            },
            /**
             * Draws the income vs expense chart using Google charts
             */
            createIncomeExpenseChart(){
            	let data = new google.visualization.DataTable();
            	data.addColumn('string', 'Type');
            	data.addColumn('number', 'Amount');
            	data.addRows([
            		['Expenses', store.totalExpense],
                    ['Income', store.totalIncome]
                ]);
                let options = {'title': "Expenses vs Income",
                    'width': 400,
                    'income': 300};
                let chart = new google.visualization.PieChart(document.getElementById('expensesVsIncome'));
                chart.draw(data, options);
            }
        },
        /**
         * Shows the loading spinner while loading the google charts library.
         * Calls the functions to create the charts once the library is loaded
         */
        mounted(){
        	if(!google.visualization){
        		let spinner = $("#loadingSpinner");
        		spinner.addClass("is-active");
        		spinner.show();
        		let vm = this;
                google.charts.load('current', {'packages':['corechart']});
        		google.charts.setOnLoadCallback(function(){
                    spinner.hide();
                    spinner.removeClass("is-active");
                    vm.createExpenseChart();
                    vm.createIncomeChart();
                    vm.createIncomeExpenseChart();
                })
            }else{
        		this.createExpenseChart();
        		this.createIncomeChart();
        		this.createIncomeExpenseChart();
            }
        }
    }
</script>
