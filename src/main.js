import { createApp } from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import VueApexCharts from 'vue3-apexcharts'
import router from './router';


const app = createApp(App);
app.use(router)
app.use(Antd);
app.use(VueApexCharts);
app.mount('#app');
