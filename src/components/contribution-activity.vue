<template>
    <div>
        <a-timeline v-if="Object.keys(filteredContributions).length">
            <template v-for="(contributions, date) in filteredContributions" :key="date">
                <a-timeline-item >
                    <div class="date">{{ date }}</div>
                    <div class="commits">Commits: {{ contributions.commits }}</div>
                    <div class="pulls">Pull Requests: {{ contributions.pulls }}</div>
                </a-timeline-item>
            </template>
        </a-timeline>
        <div v-else>No data</div>
    </div>
</template>

<script>
export default {
    name: 'ContributionActivity',
    data() {
        return {
            rawContributions: [],
        };
    },
    computed: {
        fromDate() {
            return this.$route.query.from || `${new Date().getFullYear()}-01-01`;
        },
        toDate() {
            return this.$route.query.to || `${new Date().getFullYear()}-12-31`;
        },
        sortedContributions() {
            const contributions = this.rawContributions.map((item) => {
                return {
                    date: item.created_at.split(' ')[0],
                    commits: item.type === 'PushEvent' ? 1 : 0,
                    pulls: item.type === 'PullRequestEvent' ? 1 : 0,
                };
            });

            return contributions.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            }).reduce((acc, curr) => {
                const dateKey = `${new Date(curr.date).getFullYear()}-${(new Date(curr.date).getMonth() + 1).toString().padStart(2, '0')}`;
                if (!acc[dateKey]) {
                    acc[dateKey] = { commits: 0, pulls: 0 };
                }
                acc[dateKey].commits += curr.commits;
                acc[dateKey].pulls += curr.pulls;
                return acc;
            }, {});
        },
        filteredContributions() {
            const fromDate = new Date(this.fromDate);
            const toDate = new Date(this.toDate);

            return Object.entries(this.sortedContributions).filter(([date]) => {
                const entryDate = new Date(date);
                return entryDate >= fromDate && entryDate <= toDate;
            }).reduce((acc, [date, contributions]) => {
                acc[date] = contributions;
                return acc;
            }, {});
        },
    },
    async created() {
        const response = await fetch('./mocks/github-dataset.json');
        const data = await response.json();
        this.rawContributions = data;
    },
};
</script>

<style scoped>
.date {
    font-weight: bold;
}

.commits,
.pulls {
    margin-left: 1em;
}
</style>
