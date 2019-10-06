<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
    fixed
    left-arrow
    @click-left="$router.back()"
    title='文章详情'>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 加载中 loading -->
    <van-loading class="article-loading" v-if= "loading"/>
    <!-- /加载中 loading -->

  <!-- 文章详情 -->
   <div class='detail' v-else-if= "article.title">
        <h3 class="title">{{article.title}}</h3>
        <div class="author">
            <van-image
                round
                width='1rem'
                height='1rem'
                fit='fill'
                :src= "article.aut_photo"/>
            <div class="text">
                <p class="name">{{article.aut_name}}</p>
                <p class="time">{{article.pubdate | relativeTime}}</p>
            </div>

            <!-- 关注按钮 -->
            <van-button round
            size='small'
            :type="article.is_followed ? 'default' :'info'"
            @click="onFollow"
            >{{article.is_followed ? '已关注': '+关注'}}</van-button>
            <!-- /关注按钮 -->

        </div>
        <!-- 文章内容区 -->
        <div class="content" v-html= 'article.content'></div>
        <div class="zan">
        <!-- 点赞按钮 -->
       <van-button
          round
          size='small'
          hairline
          :type="article.attitude ===1 ? 'default':'primary' "
          plain
          icon='good-job-o'
          @click="onLike"
       >{{article.attitude ===1 ? '取消点赞':'+点赞'}}</van-button>
        <!-- /点赞按钮 -->
             &nbsp;&nbsp;&nbsp;&nbsp;

    <!-- 不喜欢按钮 -->
   <van-button
      round
      size='small'
      hairline
      :type="article.attitude ===0 ? 'default':'danger'"
      plain
      icon='delete'
      @click="onDislike"
      >{{article.attitude ===0 ? '取消不喜欢':'不喜欢'}}</van-button>
        </div>
    </div>
   <!-- /文章详情 -->
   <!-- 加载失败提示 -->
    <div class='error' v-else>
       <p>网络超时，点击 <a href="#" @click.prevent="loadArticle">刷新</a>试一试</p>
    </div>
  <!-- /加载失败提示 -->

    <!-- 文章评论  组件-->
    <!-- 将文章详情组件中的文章id通过 Props 传递给文章评论子组件 -->
     <article-comment :article-id = "$route.params.articleId"/>
    <!-- /文章评论 -->
  </div>
</template>

<script>
import { getArticle, likeArticle, unLikeArticle, addDislike, deleteDislike } from '@/api/article'
import { followUser, unFollowUser } from '@/api/user'
import ArticleComment from './components/comment' // 引入评论组件

export default {
  name: 'ArticleIndex',
  components: {
    ArticleComment
  },
  data () {
    return {
      loading: true,
      article: {
        // title: 'hello world',
        // content: '<p> hello world </p>',
        // aut_name: 'LPZ',
        // pubdate: '4天前',
        // aut_photo: 'http://toutiao.meiduo.site/FsyeQUotMscq-vji-2ZDiXrc44k5'
      }
    }
  },
  created () {
    this.loadArticle()
  },
  methods: {
    // 对文章不喜欢
    onDislike () {
      const { attitude } = this.article
      let articleId = this.article.aut_id.toString()
      if (attitude === 0) {
        deleteDislike(articleId)
        this.article.attitude = -1
      } else {
        addDislike(articleId)
        this.article.attitude = 0
      }
    },

    // 点赞文章
    onLike () {
      const { attitude } = this.article
      const articleId = this.article.aut_id.toString()
      if (attitude === 1) {
        // 已经点赞 ，则取消点赞
        unLikeArticle(articleId)
        this.article.attitude = -1
      } else {
        likeArticle(articleId)
        this.article.attitude = 1
      }
    },

    // 关注用户
    onFollow () {
      const { is_followed: isFollowed, aut_id: autId } = this.article
      if (isFollowed) {
        // 已经关注 ，则取消关注
        unFollowUser(autId)
        // this.article.is_followed = false
      } else {
        followUser(autId)
        // this.article.is_followed = true
      }

      // 修改数据
      this.article.is_followed = !isFollowed
    },
    async loadArticle () {
      // 开始加载为true
      this.loading = true
      // 要用try catch  不然的话，如果请求失败 就不往后执行了
      try {
        const { data } = await getArticle(this.$route.params.articleId)
        this.article = data.data
      } catch (err) {
        console.log(err)
      }
      // 加载完为false
      this.loading = false
    }
  }

}
</script>

<style lang='less' scoped>
 .article-container {
   position: absolute;
   left: 0;
   top:0;
   overflow-y:scroll;
   width: 100%;
   height: 100%;
 }
.article-loading {
  padding-top:100px;
  text-align: center;
}
.error{
    font-size: 14px;
    padding-top:100px;
    text-align: center;
}
.detail {
  padding:50px 10px;
  .title {
    font-size: 16px;
  }
  .zan {
    text-align: center;
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left:10px;
      line-height: 1.3;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
   font-size: 16px;
   overflow: hidden;
   white-space: pre-wrap;
   word-break: break-all;
   /deep/ img{
     max-width: 100%;
     background:#f9f9f9 ;
   }
  }
}
</style>
