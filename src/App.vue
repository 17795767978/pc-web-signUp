<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  // import { getToken } from './utils/auth';

  export default {
  name: 'App'
  /* created () {
    if (!getToken()) {
      this.$router.replace({
        path: '/'
      });
    }
  } */
};
</script>

<style lang="scss" scoped>
</style>
