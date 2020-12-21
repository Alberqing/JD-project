import { createApp } from './main';

const { app, router, store } = createApp();

declare let window: Window & { __INITIAL_STATE__: any };

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
    app.$mount('#app');
});
