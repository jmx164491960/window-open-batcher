<template>
  <div id="app">
    <button @click="batchOpen">打开多个网站</button>
  </div>
</template>

<script>
import windowOpenBatcher from './windowOpenBatcher';
export default {
  name: 'App',
  created() {

  },
  methods: {
    batchOpen() {
      windowOpenBatcher.open(
        [
          // 'https://www.baidu.com',
          // 'https://www.npmjs.com/',
          // 'https://juejin.im'
          'http://localhost:8080',
          'http://localhost:8080',
          'http://localhost:8080'
        ],
        () => {
          alert('xxxx');
        }
      )
    }
  }
}
</script>
