<template>
    <div class="contributions-chart">
        <div class="chart">
            <a-typography-title level="4" class="month" v-for="(month, index) in monthLabels" :key="index"
                                :style="{ gridColumn: month.gridColumn }">{{ month.name }}
            </a-typography-title>
            <a-typography-text class="day-label" v-for="(day, index) in filteredDayLabels" :key="index"
                               :style="{ gridRow: index * 2 + 2 }">{{ day }}
            </a-typography-text>
            <div
                    v-for="(day, index) in contributions"
                    :key="index"
                    :class="['day', getContributionClass(day)]"
                    :style="{
          gridRow: getDayGridRow(day.date),
          gridColumn: getDayGridColumn(day.date) + 1
        }"
                    :title="day.title"
            ></div>
        </div>
        <div class="legend">
            <div class="legend-item" v-for="(item, index) in legendItems" :key="index">
                <div class="legend-color" :class="item.class"></div>
                <a-typography-text>{{ item.label }}</a-typography-text>
            </div>
        </div>
    </div>
</template>

<script>
export default {
	name: "ContributionsChartAntd",
	data() {
		let contributions = [];

		async function fetchData() {
			const response = await fetch('./mocks/github-dataset.json');
			const data = await response.json();
			console.log(data)

			contributions = data.map((item) => ({
				date: new Date(item.created_at),
				count: item.count,
			}));

			console.log("contributions", contributions)
		}

		fetchData();

		return {
			contributions: contributions,
		};
	},
	computed: {
		filteredDayLabels() {
			return ["Mon", "Wed", "Fri"];
		},
		monthLabels() {
			const labels = [];
			let previousMonth = null;

			this.contributions.forEach((day) => {
				const month = day.date.toLocaleDateString("default", {month: "short"});
				const gridColumn = this.getDayGridColumn(day.date) + 1;

				if (previousMonth !== month) {
					labels.push({name: month, gridColumn});
					previousMonth = month;
				}
			});

			return labels;
		},
		legendItems() {
			return [
				{class: "no-contributions", label: "Less"},
				{class: "few-contributions", label: ""},
				{class: "some-contributions", label: ""},
				{class: "many-contributions", label: ""},
				{class: "max-contributions", label: "More"},
			];
		},
	},
	methods: {
		generateContributionsData() {
			const daysInYear = 365;
			const data = [];


			for (let i = 0; i < daysInYear; i++) {
				const date = new Date();
				date.setDate(date.getDate() - (daysInYear - i));
				const dateString = date.toISOString().slice(0, 10);
				const contributions = Math.floor(Math.random() * 8);

				data.push({
					date: dateString,
					contributions,
					title: `${contributions} contributions on ${dateString}`,
				});
			}

			return data;
		},
		getContributionClass(day) {
			const {contributions} = day;
			let className = "no-contributions";

			if (contributions >= 1 && contributions <= 2) {
				className = "few-contributions";
			} else if (contributions >= 3 && contributions <= 4) {
				className = "some-contributions";
			} else if (contributions >= 5 && contributions <= 6) {
				className = "many-contributions";
			} else if (contributions >= 7) {
				className = "max-contributions";
			}

			return className;
		},
		getDayGridRow(date) {
			return new Date(date).getDay() + 2;
		},
		getDayGridColumn(date) {
			const firstDate = new Date(this.contributions[0].date);
			const daysApart = Math.floor((new Date(date) - firstDate) / (1000 * 60 * 60 * 24));
			return Math.floor(daysApart / 7) + 1;
		},
	},
};
</script>

<style scoped>
.contributions-chart {
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

.chart {
    display: grid;
    grid-template-columns: 40px repeat(auto-fill, 14px);
    grid-template-rows: auto repeat(7, 14px);
    grid-row-gap: 2px;
    grid-column-gap: 2px;
    grid-auto-flow: column;
    margin-bottom: 8px;
}

.month {
    font-size: 11px;
    grid-row: 1;
}

.day-label {
    font-size: 11px;
    grid-column: 1;
    text-align: right;
}

.day {
    width: 12px;
    height: 12px;
}

.no-contributions {
    background-color: #ebedf0;
}

.few-contributions {
    background-color: #9be9a8;
}

.some-contributions {
    background-color: #40c463;
}

.many-contributions {
    background-color: #30a14e;
}

.max-contributions {
    background-color: #216e39;
}


.legend {
    display: flex;
    justify-content: flex-end;
}

.legend-item {
    display: flex;
    align-items: center;
    margin-left: 8px;
}

.legend-color {
    width: 20px;
    height: 20px;
}

.legend-label {
    margin-left: 4px;
}
</style>
