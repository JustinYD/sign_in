<template>
  <div>
    <div v-if="role.role=='student'">
      <van-dialog
        id="van-dialog"
      />
      <van-toast
        id="van-toast" />
      <van-row>
          <van-cell-group>
            <van-field
              :value="role.name"
              required
              clearable
              label="姓名"
              placeholder="请输入姓名"
              @change="onChangeName"
            />
            <van-field
              :value="role.stuNum"
              required
              type="digit"
              clearable
              label="学号"
              placeholder="请输入学号"
              @change="onChangeNum"
            />
            <van-field
              :value="role.className"
              required
              clearable
              label="班级"
              placeholder="请输入班级"
              @change="onChangeClass"
            />
            <van-field
              :value="role.sex"
              required
              clearable
              label="性别"
              placeholder="请选择性别"
              @click="setSex"
            />
            <div v-show="setSexFlag">
              <van-picker :columns="options" @change="onChangeSex" />
            </div>
            
          </van-cell-group>
          <button plain class="submitBtn" @click="submit">
            更新
          </button>
        
      </van-row>
    </div>
    <div v-else-if="role.role=='teacher'">
      <van-row>
          <van-cell-group>
            <van-field
              :value="role.name"
              required
              clearable
              label="姓名"
              placeholder="请输入姓名"
              @change="onChangeName"
            />
            <van-field
              :value="role.tel"
              required
              type="digit"
              clearable
              label="手机号"
              placeholder="请输入手机号"
              @change="onChangeTel"
            />
            
          </van-cell-group>
          <button plain class="submitBtn" @click="submitTea">
            更新
          </button>
      </van-row>
      <van-dialog
        id="van-dialog"
      />
    </div>
  </div>
  
</template>

<script>
import store from '../../utils/store'
import Dialog from '../../../static/vant/dialog/dialog'
import Toast from '../../../static/vant/toast/toast';
export default {
  data () {
    return {
      options: ['男', '女'],
      motto: 'Hello miniprograme',
      address: {},
      role:{},
      setSexFlag:false,
      show: true,
      right_width: 65,
      left_width: 65
    }
  },

  methods: {
    setSex(){
      this.setSexFlag = true
    },
    onChangeName(event) {
    // event.detail 为当前输入的值
      this.role.name = event.mp.detail;
    },
    onChangeNum(event) {
    // event.detail 为当前输入的值
      this.role.stuNum = event.mp.detail;
    },
    onChangeTel(event) {
    // event.detail 为当前输入的值
      this.role.tel = event.mp.detail;
    },
    onChangeClass(event) {
    // event.detail 为当前输入的值
      this.role.className = event.mp.detail;
    },
    onChangeSex(event) {
      this.role.sex=event.mp.detail.value;
      this.setSexFlag = false
    },
    onClickLeft(){
      console.log(1)
    },
    submit(){
      var data=this.role
      this.$http.post({
            url:"/updateInfo",
            data:data
        }).then(res =>{
            if (res.status == 200) {
              store.commit('changeRole', data)
              wx.showToast({
                title: res.msg, //提示的内容,
                icon: 'success', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透
              });
            }
            else {
              wx.showToast({
                title: res.msg, //提示的内容,
                icon: 'none', //图标,
                duration: 2000, //延迟时间,
                mask: true
              });
            }
            
        })
      
    },
    submitTea(){
      var data=this.role
      this.$http.post({
            url:"/updateInfo",
            data:data
        }).then(res =>{
            if (res.status == 200) {
              store.commit('changeRole', data)
              wx.showToast({
                title: res.msg, //提示的内容,
                icon: 'success', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
              });
            } else {
              wx.showToast({
                title: res.msg, //提示的内容,
                icon: 'none', //图标,
                duration: 2000, //延迟时间,
                mask: true
              });
            }
            
        })
    },
    test1(){
      console.log(this.name,this.stuNum,this.className)
      Dialog.alert({
        message: this.name,
      }).then(() => {
        // on close
      });
      // mpvue.switchTab({url:'/pages/index/main'})
    },
    test () {
      var that = this
      Dialog.alert({
        message: '地址信息',
        showCancelButton: true
      }).then(() => {
        // that.$http.get({
        //     url:"/getlw_10"
        // }).then(res =>{
        //     console.log(res)
        // })
        console.log(this.address)
      }).catch(() => {
        console.log('no')
      })
    },
  },
  onShow () {
    this.role=store.state.role
  }
}
</script>

<style scoped>
.submitBtn{
  margin-top: 20px;
  width: 80%;
  color: white;
  border-color:rgb(52, 132, 236);
  background: rgb(52, 132, 236);
}
.submitBtn:active{
  background: rgb(134, 173, 224);
  border-color: rgb(134, 173, 224);
}
.submitForm{
  height: 28px;
  margin: 10px 0;
  padding: 5px 10%;
  border-bottom:rgb(52, 132, 236) 1px solid;
}
</style>
