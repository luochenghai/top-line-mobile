<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
// // 引入的是封装后的axios的request
// import requset from '@/utils/request'
// requset({
//   method: 'get',
//   url: '/app/v1_1/articles',
//   params: {
//     channel_id: 0,
//     timestamp: Date.now(),
//     with_top: 1
//   }
// }).then(res => {
//   console.log(res.data)
// })
// export default {
//   name: 'App'
// }
</script>

<style lang="less">

</style>
