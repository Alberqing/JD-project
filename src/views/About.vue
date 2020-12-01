<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>



<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

export const PAGE_ROUTE = '/about1111';
export const LAZY_LOAD = false;


export default {
  name: 'About',
};
</script>