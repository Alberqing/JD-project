import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './router';
import { createStore } from './store';

declare let process: Window & { client: any };

if (process.client) {
    require('./registerServiceWorker');
}

Vue.config.productionTip = false;

export function createApp(context: any = {}) {
    const router = createRouter();
    const store = createStore();
    // console.log(context);
    if (context) {
        store.replaceState(Object.assign(store.state, context));
    }
    const app = new Vue({
        router,
        store,
        render: (h) => h(App),
    });
    return { app, router, store };
}
