<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar
      title="登录"
      left-arrow/>
      <!-- 登录表单 -->
    <van-cell-group>
      <van-field
        v-model= 'user.mobile'
        required
        clearable
        label="手机号"
        placeholder="请输入手机号"
      />

      <van-field
        v-model= 'user.code'
        type="password"
        label="验证码"
        placeholder="请输入验证码"
        required
      />
     </van-cell-group>
     <div class="login-btn">
       <!-- 给登录按钮绑定 loading 属性 -->
       <van-button type="info" :loading="isLoginLoading" @click="onLogin">登录</van-button>
     </div>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      isLoginLoading: false,
      user: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    // 登录处理函数
    async onLogin () {
      try {
        // 提交表单 登录时 loading
        this.isLoginLoading = true
        const { data } = await login(this.user)
        this.$toast.success('登录成功')
        console.log(data)
        // 登录成功之后 关闭
        this.isLoginLoading = false
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        }
      }
      // 无论登录成功还是失败 都要关闭
      this.isLoginLoading = false
    }
  }
}
</script>

<style lang='less' scoped>
  .login-btn {
    padding: 20px;
    .van-button {
      width: 100%;
    }
  }
</style>
