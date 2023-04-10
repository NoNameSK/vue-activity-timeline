<template>
    <div class="main-container">
        <contributions-chart @year-changed="handleYearChanged"></contributions-chart>
        <contribution-activity />
    </div>
</template>

<script>

import ContributionsChart from "@/components/contributions-chart.vue";
import ContributionActivity from "@/components/contribution-activity.vue";

export default {
	name: 'App',
	components: {
      ContributionActivity,
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

.main-container {
    display: grid;
    place-items: center;
}
</style>
