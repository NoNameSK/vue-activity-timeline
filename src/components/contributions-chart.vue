<template>
    <div class="contributions-chart">
        <div>
            <div class="total-contributions">
                Total contributions: {{ totalContributions }}
            </div>
            <div class="chart">
                <div class="month" v-for="(month, index) in monthLabels" :key="index"
                     :style="{ gridColumn: index * 4 + 2 }">{{ month.name }}
                </div>
                <div class="day-label" v-for="(day, index) in filteredDayLabels" :key="index"
                     :style="{ gridRow: index * 2 + 2 }">{{ day }}
                </div>
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
                <div class="legend-label">Less</div>
                <div class="legend-item" v-for="(item, index) in legendItems" :key="index">
                    <div class="legend-color" :class="item.class"></div>
                    <div class="legend-label">{{ item.label }}</div>
                </div>
                <div class="legend-label">More</div>
            </div>
        </div>

        <div class="year-selector">
            <a-radio-group class="year-selector-container" :value="selectedYear" @input="handleYearInput" button-style="solid">
                <a-radio-button v-for="year in years" :key="year" :value="year" style="display: block;">
                    {{ year }}
                </a-radio-button>
            </a-radio-group>
        </div>
    </div>
</template>

<script>
import {Radio} from 'ant-design-vue';

export default {
	name: "ContributionsChart",
	components: {
		[Radio.Group.name]: Radio.Group,
		[Radio.Button.name]: Radio.Button
	},
	data() {
		return {
			fetchedData: [],
			contributions: [],
			selectedYear: new Date().getFullYear(),
			years: Array.from({length: 12}, (_, i) => 2012 + i),
		};
	},
	computed: {
		totalContributions() {
			return this.contributions.reduce((sum, day) => sum + day.contributions, 0);
		},
		filteredDayLabels() {
			return ["Mon", "Wed", "Fri"];
		},
		monthLabels() {
			const labels = [];
			let previousMonth = null;

			this.contributions.forEach((day) => {
				const month = new Date(day.date).toLocaleDateString("default", {month: "short"});
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
				{class: "no-contributions", label: ""},
				{class: "few-contributions", label: ""},
				{class: "some-contributions", label: ""},
				{class: "many-contributions", label: ""},
				{class: "max-contributions", label: ""},
			];
		},
	},
	methods: {
		handleYearInput(event) {
			this.selectedYear = event.target.value;
			this.changeYear();
		},
		async fetchData() {
			const response = await fetch('./mocks/github-dataset.json');
			const data = await response.json();
			this.fetchedData = data;
			this.contributions = this.generateContributionsData(this.selectedYear);
		},
		generateContributionsData(year) {
			const startDate = new Date(year, 0, 1);
			const endDate = new Date(year, 11, 31);
			const daysInYear = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
			const data = [];

			for (let i = 0; i < daysInYear; i++) {
				const date = new Date(startDate);
				date.setDate(date.getDate() + i);
				const dateString = date.toISOString().slice(0, 10);

				const contributions = this.fetchedData.filter(pool => new Date(pool.created_at).toISOString().slice(0, 10) === dateString).length;

				data.push({
					date: dateString,
					contributions,
					title: `${contributions} contributions on ${dateString}`,
				});
			}

			return data;
		},
		changeYear() {
			this.fetchData();
			this.$emit('yearChanged', this.selectedYear);
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
	watch: {
		selectedYear(newValue) {
			this.$emit("year-changed", newValue);
		},
	},
	mounted() {
		this.fetchData();
	},
};
</script>


<style>
.ant-radio-button-wrapper:before {
    display: none;
}

.year-selector .ant-radio-button-wrapper {
    border: none;
    margin-right: 10vh;
}
.year-selector-container {
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    margin-bottom: 16px;
}

.total-contributions {
    margin-left: 16px;
    font-weight: bold;
}

.contributions-chart {
    gap: 5vh;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
