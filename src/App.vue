<template>
    <div>
        <contributions-chart @year-changed="handleYearChanged"></contributions-chart>
    </div>
</template>

<script>

import ContributionsChart from "@/components/contributions-chart.vue";

export default {
	name: 'App',
	components: {
		ContributionsChart,
	},
	methods: {
		handleYearChanged(year) {
			this.$router.push({
				query: {
					from: `${year}-01-01`,
					to: `${year}-12-31`,
				},
			});
		},
	},
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
