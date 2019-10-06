<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      title="个人信息"
      left-arrow
      right-text="保存"
      @click-left="$router.push('/my')"
      @click-right="onSaveProfile"
    />
    <!-- /导航栏 -->

    <!-- 用户信息 -->
    <van-cell-group>
      <!-- 《3》注册头像的点击事件，绑定处理函数 -->
      <van-cell title="头像" is-link @click="onShowFile">
        <van-image
          round
          width="30"
          height="30"
          :src="user.photo"
        />
      </van-cell>
      <van-cell title="昵称"
      :value= "user.name"
      is-link
      @click="isEditNameShow=true"/>

      <van-cell title="性别"
      :value= "user.gender ===1 ? '女':'男'"
      is-link
      @click="isEditGenderShow=true"
      />
      <van-cell
      title="生日"
      :value= "user.birthday"
      is-link
      @click="isEditBirthdayShow=true"
      />
    </van-cell-group>
      <!-- /用户信息 -->
      <!-- 《1》添加一个 file 类型的 input，设置 hidden 隐藏 -->

      <!-- 头像上传触发的 file 类型的 input -->
      <input type="file" hidden ref="file">
      <!-- /头像上传触发的 file 类型的 input -->

      <!-- 编辑用户昵称 -->
      <van-dialog
       v-model="isEditNameShow"
       title="用户昵称"
       show-cancel-button
      >
       <van-field
       :value= "user.name"
       placeholder="请输入用户名"
       @input= "onUserNameInput"/>
      </van-dialog>
      <!-- /编辑用户昵称 -->

       <!-- 编辑用户性别 -->
      <van-action-sheet
       v-model="isEditGenderShow"
       :actions="[
        { name: '男', value:0},
        { name: '女', value:1}
      ]"
       cancel-text="取消"
       @select="onGenderSelect"
      />
      <!-- /编辑用户性别 -->

      <!-- 用户生日 -->
      <van-popup
        v-model="isEditBirthdayShow"
        position="bottom"
        :style="{ height: '45%' }"
      >
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          :min-date="minDate"
          @confirm = "onDatetimeConfirm"
          @cancel="isEditBirthdayShow=false"
        />
      </van-popup>

      <!-- /用户生日 -->
  </div>
</template>

<script>
import { getProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import { formatDate } from '@/utils/date'
export default {
  name: 'UserIndex',
  data () {
    return {
      user: {}, // 用户个人资料
      isEditNameShow: false,
      inputUserName: '', // 存储编辑用户输入的内容
      isEditGenderShow: false, // 是否显示性别
      isEditBirthdayShow: false,
      minDate: new Date(1870, 1, 1),
      currentDate: new Date() // 默认被选中的时间

    }
  },
  // 《2》为了方便，封装一个计算属性获取 ref 引用的 file
  computed: {
    file () {
      return this.$refs.file
    }
  },
  created () {
    this.loadUserProfile()
  },
  // 《5》在 mounted 中给 file 注册 change 事件，处理预览图片
  // 初始化的时候操作 DOM
  mounted () {
    // 注册 file 的 change 事件，预览图片
    this.file.onchange = () => {
      // 设置 img 的 src
      this.user.photo = window.URL.createObjectURL(this.file.files[0])
    }
  },
  methods: {
    async loadUserProfile () {
      const { data } = await getProfile()
      this.user = data.data
    },
    // 《4》在处理函数中，手动触发 file 的点击事件
    onShowFile () {
      // 手动触发 input 的点击事件
      this.file.click()
    },
    async onSaveProfile () {
      // loading
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁止背景点击
        loadingType: 'spinner',
        message: '更新中'
      })
      try {
        // 如果用户上传了头像才请求提交更新用户头像
        const photo = this.file.files[0]
        if (photo) {
          // 请求提交
          await updateUserPhoto(this.file.files[0])
        }
        // 更新普通数据信息（昵称、性别、生日）
        await updateUserProfile(this.user)

        // 关闭弹窗loading
        toast.clear()
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        console.log(err)
        // 关闭弹窗loading
        toast.clear()
        // 提示失败
        this.$toast.fail('更新失败')
      }
    },
    onUserNameInput (value) {
      console.log(value)
      this.user.name = value
    },
    onGenderSelect (item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.user.gender = item.value
      this.isEditGenderShow = false
    },
    onDatetimeConfirm (value) {
      // 修改数据
      this.user.birthday = formatDate(value)
      // 关闭弹层
      this.isEditBirthdayShow = false
    }

  }
}
</script>

<style>

</style>
