import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
    {
        path: '/app/test',
        name: 'home',
        component: () => import(/* webpackChunkName:"photo" */'../views/Home.vue'),
    },
];

export function createRouter() {
    return new VueRouter({
        mode: 'history',
        base: process.env.BASE_URL,
        routes,
    });
}
