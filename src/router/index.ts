import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
    {
        path: '/app/test',
        name: 'home',
        component: Home,
    },
];

export function createRouter() {
    return new VueRouter({
        mode: 'history',
        // base: process.env.BASE_URL,
        routes,
    });
}
