<template>
  <div>
     <!-- 搜索框 -->
      <form action="/">
        <van-search
            v-model="searchText"
            placeholder="请输入搜索关键词"
            show-action
            @search="onSearch(searchText)"
            @cancel="onCancel"
        />
      </form>
     <!-- /搜索框 -->

     <!-- 联想建议 -->
  <van-cell-group v-if="searchText">
      <van-cell
        icon="search"
        v-for= "item in suggestions"
        :key= 'item'
        @click= "onSearch(item)">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <van-icon
            slot="icon"
            name="search"
            style="line-height: inherit;"
        />
        <!-- <div slot="title">{{item}}</div> 原来的-->
        <!-- 高亮的 -->
         <div slot="title" v-html= 'highLight(item)'></div>
        </van-cell>
   </van-cell-group>
     <!-- /联想建议 -->

     <!-- 历史记录 -->
     <van-cell-group v-else>
        <van-cell title="历史记录">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template v-if='isDeleteShow'>
          <span style="margin-right:10px" @click="searchHistories=[]">全部删除</span>
          <span style="margin-right:5px" @click="isDeleteShow=false">完成</span>
        </template>
        <van-icon
            v-else
            slot="right-icon"
            name="delete"
            style="line-height: inherit;"
            size='20px'
           @click="isDeleteShow=true"
        />
        </van-cell>
        <van-cell :title="item" v-for="(item,index) in searchHistories" :key='item' @click="onSearch(item)">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <van-icon
            slot="right-icon"
            name="close"
            style="line-height: inherit;"
            v-show='isDeleteShow'
            @click="searchHistories.splice(index,1)"
        />
        </van-cell>
      </van-cell-group>
      <!-- /历史记录 -->

  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { setItem, getItem } from '@/utils/storage'
import { debounce } from 'lodash'
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: ' ',
      suggestions: [],
      // searchHistories: [] // 保存搜素历史结果 然后当触发搜索页面跳转之前记录历史记录 add by lch 20190926
      searchHistories: getItem('search-histories') || [], // 边输入 边获取
      isDeleteShow: false
    }
  },
  watch: {
    searchHistories (newValue) {
      // 刷新后就没有了，要存在本地
      setItem('search-histories', newValue)
    },
    // 加入防抖处理
    searchText: debounce(async function (newValue) {
      // 先根据newValue的长度判断 输入框是否发生变化  (trim()去空格)
      if (!newValue.trim().length) {
        // 如果长度为0 表示没有输入变化
        return
      }
      const { data } = await getSearchSuggestions(newValue)
      // console.log(data)
      this.suggestions = data.data.options
    }, 1000)

  },
  methods: {

    onSearch (q) {
      if (!q.trim().length) {
        return
      }
      // *****************************************************20190926add保存搜索历史
      // 记录历史记录
      const searchHistories = this.searchHistories // 初始为空
      const index = searchHistories.findIndex(item => {
        return item.trim().toLowerCase() === q.trim().toLowerCase()
      })
      // 如果已经存在，则将其移除
      if (index !== -1) {
        searchHistories.splice(index, 1)
      }
      // 将最新的搜索记录添加到最前面
      searchHistories.unshift(q)
      // 刷新后就没有了，要存在本地
      // 虽然在监听器中进行了存储，但是页面跳转后，页面就被销毁了，需要在这里手动存储下
      setItem('search-histories', searchHistories)
      // *********************************************20190926add保存搜索历史

      // 跳转到搜索结果页面（重点）
      this.$router.push({
        name: 'search-result',
        params: {
          q
        }
      })
    },
    onCancel () {},

    highLight (str) {
      const reg = new RegExp(this.searchText, 'gi') // 动态生成查找的条件 正则表达式
      return str.replace(reg, `<span style='color:red;'>${this.searchText}</span>`)
    }
  }
}
</script>

<style>

</style>
