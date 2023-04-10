import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

const routes = [
	{
		path: '/',
		name: 'Home', // Replace with the desired route name
		component: App,
	},
	// Add more routes as needed
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
