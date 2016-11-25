<template>
    <div>
        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp horiz-center">
            <thead>
            <tr>
                <th class="mdl-data-table__cell--non-numeric">Account Name</th>
                <th class="mdl-data-table__cell--non-numeric">Current Budgeted Amount</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="category in categories">
                <td class="mdl-data-table__cell--non-numeric">{{ category.name }}</td>
                <td>
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="number" id="value"
                               :value="category.budgeted">
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        <button data-modal-open="addExpense"
                class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent padding-top">
            Save Changes
        </button>
    </div>
</template>
<style>

</style>
<script>
    export default{
        data(){
            return{
                categories: []
            }
        },
        created(){
	    	this.categories = [{id: 1, name: "Food", budgeted: 150.00}]
	    }
    }
</script>
