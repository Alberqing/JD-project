<template>
  <div class="home">
    {{pageData.title}}
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
			// title: '',
		}
	},
	components: {
	// HelloWorld,
	},
	computed: {
        pageData() {
            return this.$store.state.pageData;
        },
    },
};
</script>
<style>
	.home {
		font-size: 0.1rem;
		color: red;
	}
</style>
