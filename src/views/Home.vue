<template>
  <div class="home">
    {{title}}
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
import { createStore } from '../store';

// export const PAGE_ROUTE = '/home1111';

export default {
	name: 'Home',
	data() {
		return {
			title: '',
		}
	},
	components: {
	// HelloWorld,
	},
	mounted() {
		const { title } = window.__INITIAL_STATE__;
		console.log(title);
		this.title = title;
	}
};
</script>
