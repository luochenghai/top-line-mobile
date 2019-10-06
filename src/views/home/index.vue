<template>
  <div class="home">
      <!-- 头部导航 -->
      <!-- <van-nav-bar title="首页" fixed></van-nav-bar> -->
       <van-nav-bar fixed>
         <!-- 自定义标题内容 -->
         <van-button
         class="search-btn"
         slot="title"
         icon="search"
         round
         type='info'
         size='small'
         @click="$router.push('/search')"
         >搜索</van-button>
       </van-nav-bar>
  <!-- /导航栏 -->
 <!-- 频道列表 -->
      <van-tabs v-model="active">
        <!-- 频道列表 -->
        <van-tab :title= "channel.name" v-for= 'channel in channels' :key= 'channel.id' >
          <!-- {{channel.name}} -->
         <van-pull-refresh v-model= "channel.pullDownLoading" @refresh="onRefresh">
             <!-- <p>刷新次数: {{ count }}</p> -->

            <!-- 所以我们首先要将数据进行改造，为每个频道添加自定义数据：
            文章列表、loading状态、finished 结束状态： -->
            <!-- channel.loading 该频道  channel.finished 该频道结束状态-->
             <van-list v-model= "channel.loading" :finished= "channel.finished"  finished-text="没有更多了"  @load="onLoad">
               <!-- van-cell 中遍历channels中的aticles -->
               <!--注意：article.art_id 超出js安全整数范围被 json-bigint 转换成对象了，
               但是 key 只能绑定字符串或是数字，所以这里要把它转为字符串来绑定给这个 key -->

              <!-- 具体内容 articles 是个数组，里面存放的是getAllArticle()从后查询的文章数据 results (对象) ，article 相当是文章对象-->
                <van-cell
                  v-for= "article in channel.articles"
                  :key= "article.art_id.toString()"
                  :title= "article.title"
                  @click="$router.push({
                    name:'article',
                    params:{
                     articleId:article.art_id.toString()
                    }
                  })"
                  >

                    <!-- 图片，作者名字，评论数量，发布日期 -->
                      <div slot="label">
                          <!-- 图片用到宫格组件 -->
                          <van-grid :border="false" :column-num="3">
                              <van-grid-item v-for= "(img,index) in article.cover.images" :key= "index" >
                                <van-image height="80" :src= "img"  lazy-load >
                                  <template v-slot:loading>
                                    <van-loading type="circular" size="20" color="#1989fa" vertical>加载中...</van-loading>
                                  </template>
                                </van-image>
                              </van-grid-item>
                          </van-grid>
                          <!-- 内容 -->
                          <div class="article_info">
                            <div class="meta">
                            <span>{{article.aut_name}}</span>
                            <span>{{article.comm_count}}评论</span>
                            <!-- 使用过滤器处理相对时间 -->
                            <span>{{article.pubdate | relativeTime}}</span>
                            </div>
                          </div>
                      </div>
                </van-cell>
                 <!-- /具体内容 -->
             </van-list>

          </van-pull-refresh>
        </van-tab>
     </van-tabs>

      <!-- 频道管理 -->
      <!-- 面包按钮 -->
      <div slot="nav-right" class="wap-nav" @click="isChannelEditShow=true">
        <van-icon name="wap-nav" size='24' />
      </div>
      <!-- /面包按钮 -->
      <!-- /面包按钮  van-tabs 提供了左右插槽 来放图标-->
      <!-- 弹窗 -->
      <van-popup v-model="isChannelEditShow" position="bottom" :style="{ height: '95%'}"
        close-icon-position="top-left" closeable  round>
        <!-- 我的频道 -->
         <div>
            <van-cell title="我的频道" :border="false">
                <van-button type="danger"
                    size="mini"
                    @click= "isEdit = !isEdit">
                    {{isEdit ? '完成':'编辑'}}
                </van-button>
            </van-cell>
            <!-- 宫格 -->
            <van-grid :gutter="10">
                <van-grid-item
                  v-for= "(channel,index) in channels"
                  :key= "channel.id"
                  icon="photo-o"
                  :text= "channel.name"
                  @click= "onUserChannelClick (channel,index)"
                >
                <!-- 点击编辑时频道上出现的 删除图标 -->
                 <van-icon v-show ="isEdit"
                 class="close-icon"
                 slot="icon"
                 name='close'
                size='20px'/>
                </van-grid-item>
          </van-grid>
         </div>
        <!-- /我的频道 -->

        <!-- 频道推荐 -->
         <div>
            <van-cell title="频道推荐" :border="false"></van-cell>
            <!-- 宫格 -->
            <van-grid :gutter="10">
                <van-grid-item
                v-for= "channel in remainingChannels"
                :key= "channel.id" icon="photo-o"
                :text= "channel.name"
                @click="onAddChannel(channel)"
                />
          </van-grid>
         </div>
         <!-- /频道推荐 -->
      </van-popup>
      <!-- /频道管理 -->
  </div>
</template>

<script>

import { getUserOrDefaultChannels, getAllChannels, resetUserChannels, deleteUserChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
import { mapState } from 'vuex' // 要用来判断用户是否登录
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'HomeIndex', // 起这个名字是为了在测试工具中很容易找到这个模块

  data () {
    return {
      isChannelEditShow: false, // 弹窗
      active: 2,
      channels: [], // 保存我的频道信息
      loading: false,
      finished: false,
      count: 0,
      isLoading: false,
      allChannels: [], // 获取所有频道
      isEdit: false

    }
  },
  // 弄一个计算属性返回当前频道
  computed: {
    ...mapState(['user']), // 映射到本地
    currentChannel () {
      //  active 这个值和channels 对象数组中的下标相对对应，代表每个频道
      return this.channels[this.active]
    },
    // 封装一个计算属性来获取剩余频道
    remainingChannels () {
      // 设能与频道 =  所有频道 - 我的频道
      const remainingchannels = [] // 剩余频道
      this.allChannels.forEach(channel => {
        const index = this.channels.findIndex(item => item.id === channel.id)
        if (index === -1) {
          // 没找到，就是剩余的 添加到剩余
          remainingchannels.push(channel)
        }
      })
      return remainingchannels
    }
  },
  created () {
    this.loadUserOrDefaultChannels() // 调用获取新闻频道函数
    this.loadAllChannels()
  },
  methods: {
    /**
     * 我的频道点击处理函数
     * add by lch in 20190925
    */
    async onUserChannelClick (channel, index) {
      if (this.isEdit) {
        // 如果时编辑状态 ，进行移除
        this.channels.splice(index, 1) // 将数据从试图删除，但是刷新后还在
        // 持久化
        if (this.user) {
          // 登录状态，删除后台数据库的记录,调用封装的删除用户指定的频道函数
          await deleteUserChannels(channel.id)
        } else {
          // 未登录 删除本地存存储
          // 注意：本地存储中的数据无法像操作 js 数据成员一样来修改
          // 如果想要修改，则重新存储实现修改
          // removeItem(channel.id) 这是不行的
          setItem('channels', this.channels)
        }
      } else {
        // 非编辑状态，进行跳转，并且关闭弹窗
        this.active = index
        this.isChannelEditShow = false
      }
    },
    // 点击剩余频道向我的频道列表里添加频道
    async onAddChannel (channel) {
      // 添加到我的频道
      this.channels.push(channel)
      // 持久化
      if (this.user) {
        // 已经登录：请求存到后端
        const channels = [] // 临时数组用来存储截取到的平道列表往后端存

        // 处理提取要重置的频道列表
        this.channels.slice(1).forEach((item, index) => {
          channels.push({
            id: item.id,
            seq: index + 2
          })
        })
        // 请求重置
        await resetUserChannels(channels)
      } else {
        // 没登陆 ，往本地存储
        setItem('channels', this.channels)
      }
    },
    // 在首页中调用 获取频道列表
    async loadUserOrDefaultChannels () {
      // 开始的时候还没有考虑频道管理这件事儿，所以为了简单，这里直接获取了所有频道列表，现在要更具用户是否登录来获取频道
      // const { data } = await getAllChannels()
      let channels = [] // 用来存储当前查询的频道
      if (this.user) {
        // 登录就从后台获取
        const { data } = await getUserOrDefaultChannels()
        channels = data.data.channels
      } else {
        // 没登陆先从本地存储获取
        const localChannels = getItem('channels')
        if (localChannels) {
          // 如果存在。就赋值给chathis.channelsnnels
          channels = localChannels
        } else {
          // 如果本地存储有没有，在获取默认推荐的
          const { data } = await getUserOrDefaultChannels()
          channels = data.data.channels
        }
      }

      // 定制频道数据内容(后台返回的数据值由频道ID和频道name)
      channels.forEach(channel => {
        channel.articles = [] // 新增频道的文章列表这个属性 用来保存当前频道文章
        channel.loading = false // 上拉加载更多
        channel.finished = false // 频道的加载结束的状态
        channel.timestamp = null // 用于获取下一页数据的时间戳（页码）
        channel.pullDownLoading = false //
      })
      // console.log(data) // 打印出来看下
      // 将数据保存到
      // this.channels = data.data.channels
      this.channels = channels // this.channels 指的的是data 的数据
    },

    /**
    * 获取所有频道 是为了得到 剩余频道
    *
   */
    async loadAllChannels () {
      const { data } = await getAllChannels()
      console.log(data)
      this.allChannels = data.data.channels
    },

    // 获取频道文章
    async onLoad () {
      const currentChannel = this.currentChannel
      const { data } = await getArticles({
        channelId: currentChannel.id,
        // 1.第一页数据传递当前时间戳
        // 下一页数据传递上一页返回数据结果中的 pre_timestamp
        timestamp: currentChannel.timestamp || Date.now(),
        withTop: 1
      })
      //  console.log(data)
      // 2.将得到文章列表添加到当前频道.articles中
      const { pre_timestamp: preTimestamp, results } = data.data
      currentChannel.articles.push(...results)
      // 3. 本次onLoad 数据加载完毕，将loading 设置为false
      currentChannel.loading = false
      // 4.判断数据是否还有下一页
      if (!preTimestamp) {
        currentChannel.finished = true
      } else {
        // 还有数据，将本次得到的 preTimestamp 存储到当前频道，用于加载下一页数据
        currentChannel.timestamp = preTimestamp
      }
    },

    // 下拉刷新
    async onRefresh () {
      const currentChannel = this.currentChannel
      const { data } = await getArticles({
        channelId: currentChannel.id,
        timestamp: Date.now(),
        withTop: 1
      })
      // 下拉刷新，将每次拿到的数据放到当前频道的文章列表顶部
      currentChannel.articles.unshift(...data.data.results)

      // 数据加载完毕，将当前频道的下拉刷新 loading 关闭
      currentChannel.pullDownLoading = false

      this.$toast('刷新成功')
    }
  }

}

</script>

<style lang="less" scoped>
.home {
  .van-tabs {
  /deep/ .van-tabs__wrap {
        position:fixed;
        top:51px;
        z-index: 2;
        left: 0;
        right: 0;
        }
  /deep/ .van-tabs__content {
      margin-bottom: 50px;
      margin-top:90px;
    }

  }
  .article_info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .meta span {
      margin-right:45px;
    }
  }
  .wap-nav {
    // position: absolute;
    position: absolute;
    top:46px;
    right:0;
    z-index:3;
    background-color: #fff;
    opacity: 0.9;
  }
  .close-icon {
    position: absolute;
    top :-5px;
    right:-5px;
  }
.search-btn {
  width: 100%;
  background-color: #5babfb;
}
}
</style>
