<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar title="登录"/>
      <!-- 登录表单 -->

      <!-- 4. 绑定第三方校验规则 -->
      <!-- ValidationObserver 组件会渲染成一个form 表单
      可以通过ref 调用这个组件的方法:validate 来进行js 验证
      -->

      <ValidationObserver tag='form' ref='loginForm'>
        <!-- required|phone 不能有空格 -->
      <ValidationProvider tag='div' name='手机号' rules='required|phone' v-slot= '{errors}'>
      <van-field
        v-model= 'user.mobile'
        required
        label="手机号"
        placeholder="请输入手机号"
        :error-message='errors[0]'/>
      </ValidationProvider>

      <ValidationProvider tag='div' name='验证码' rules='required' v-slot= '{errors}'>
      <van-field
        v-model= 'user.code'
        type="password"
        label="验证码"
        placeholder="请输入验证码"
        required
        :error-message='errors[0]'
      />
      </ValidationProvider>
        </ValidationObserver>
     <div class="login-btn">
       <!-- 给登录按钮绑定 loading 属性 -->
       <van-button type="info" :loading="isLoginLoading" @click="onLogin">登录</van-button>
     </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'LoginIndex',
  data () {
    return {
      isLoginLoading: false,
      user: {
        mobile: '17673051343',
        code: '246810'
      }
    }
  },
  methods: {
    // 然后在登录页面中登录成功以后将后端返回的 token 等数据通过提交
    //  mutation 的方式保存到 Vuex 容器中：
    ...mapMutations(['setUser']), // 映射

    // 登录处理函数
    async onLogin () {
      try {
        const isValid = await this.$refs.loginForm.validate()
        if (!isValid) {
          return
        }

        // 提交表单 登录时 loading
        this.isLoginLoading = true
        const { data } = await login(this.user)
        console.log(data)
        this.$toast.success('登录成功')
        this.setUser(data.data) // 在上面映射之后,在这里调用 将登陆成功的用户状态（token）保存到 Vuex 容器中
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

<style lang="less" scoped>
.login {
  .login-btn {
    padding: 20px;
    .van-button {
      width: 100%;
    }
  }
}
</style>
