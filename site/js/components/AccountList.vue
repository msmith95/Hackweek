<template>
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
</template>

<script>
	 export default {
	    data() {
	      return {
	      	accountList: []
	      }
	    },
	    methods: {
	    },
	    created(){
	    	this.accountList = [{id: 1, name: "Checking", balance: 1500.00}]
	    },
	    mounted(){
			$("#backButton").show();
	    }
	}
</script>