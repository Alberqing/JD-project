import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export function createStore() {
    return new Vuex.Store({
        state: {
            title: '',
        },
        getters: {
            title: (state) => {
                return state.title;
            },
        },
    });
}
