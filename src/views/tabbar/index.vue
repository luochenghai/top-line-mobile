<template>
  <div>
       <!-- 承载视图 -->
      <router-view></router-view>
      <!-- 底部导航 -->
        <van-tabbar v-model="active" active-color="green" route>
        <van-tabbar-item name="home" icon="home-o" to="/">首页</van-tabbar-item>
        <van-tabbar-item name="search" icon="chat-o">问答</van-tabbar-item>
        <van-tabbar-item name="friends" icon="video-o">视频</van-tabbar-item>
        <van-tabbar-item name="setting" icon="contact" to="/my">
        {{$store.state.user ? '我的' : '未登录'}}
        </van-tabbar-item>
        </van-tabbar>
      <!-- /底部导航 -->
  </div>
</template>

<script>
export default {
  name: 'TabbarIndex',
  data () {
    return {
      active: 'name'
    }
  }
}
</script>

<style>

</style>
