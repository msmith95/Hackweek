<template>
    <div>
        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
            <thead>
            <tr>
                <th class="mdl-data-table__cell--non-numeric">Account Name</th>
                <th>Current Projected Balance</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="category in categories">
                <td class="mdl-data-table__cell--non-numeric">{{ category.name }}</td>
                <td>
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="number" id="value"
                               :value="category.budgeted">
                        <label class="mdl-textfield__label" for="value">Budgeted Amount</label>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
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
