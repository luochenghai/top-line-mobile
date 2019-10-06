<template>
  <div class="search-result">
    <!-- 导航栏 -->
    <!--  重点哟 -->
    <van-nav-bar
        :title="`${$route.params.q}的搜索结果`"
        left-arrow
        fixed
        @click-left="$router.back()"
       />
    <!--/导航栏 -->

     <!-- 文章列表 -->
      <van-list
      class="articles-list"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
        <van-cell
          v-for= "article in list"
          :key= "article.art_id.toString()"
          :title= "article.title"
        />
      </van-list>
     <!--/文章列表 -->
  </div>
</template>

<script>
import { getSearch } from '@/api/search'
export default {
  name: 'SearchResult',
  data () {
    return {
      page: 1,
      list: [],
      loading: false,
      finished: false
    }
  },
  methods: {
    onClickLeft () {
      // Toast('返回')
    },
    async onLoad () {
      // 异步更新数据
      // 1.获取数据
      const { data } = await getSearch({
        page: this.page,
        perPage: 20,
        q: this.$route.params.q
      })

      // 2.保存数据到list
      const { results } = data.data
      this.list.push(...results)
      // 3.获取成功后关闭加载状态
      this.loading = false

      // 4.判断数据是否全部加载完成
      if (results.length) {
        // 如果有数据 就更新页码
        this.page++
      } else {
        // 没有，则不再load
        this.finished = true
      }
    }
  }
}
</script>

<style lang='less' scoped>
  .search-result {

    .van-nav-bar__title {
      color: #ffff;
    }
    .van-nav-bar .van-icon{
      color: #ffff;
    }
    .articles-list {
      margin-top: 46px;
    }
  }
</style>
