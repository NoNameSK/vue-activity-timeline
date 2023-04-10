<template>
    <div class="calendar-container">
        <a-calendar v-model:value="value" @panelChange="onPanelChange"/>
    </div>
</template>

<script>
import {defineComponent, ref} from 'vue';

export default defineComponent({
    name: 'CalendarView',
    setup() {
        const value = ref();
        const onPanelChange = (value, mode) => {
            console.log(value, mode);
        };

        return {
            value,
            onPanelChange,
        };
    },
});
</script>

<style scoped>
.calendar-container .ant-picker-calendar .ant-picker-calendar-header {
    display: flex;
    flex-direction: column;
}

.calendar-container .ant-picker-calendar .ant-picker-calendar-week-number {
    display: flex;
    flex-direction: row;
}

.calendar-container .ant-picker-calendar .ant-picker-calendar-week-number .ant-picker-calendar-cell {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
