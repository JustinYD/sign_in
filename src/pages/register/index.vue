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
              :value="name"
              required
              clearable
              label="姓名"
              placeholder="请输入姓名"
              @change="onChangeName"
            />
            <van-field
              :value="stuNum"
              required
              type="digit"
              clearable
              label="学号"
              placeholder="请输入学号"
              @change="onChangeNum"
            />
            <van-field
              :value="className"
              required
              clearable
              label="班级"
              placeholder="请输入班级"
              @change="onChangeClass"
            />
            <van-field
              :value="sex"
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
            登录/注册
          </button>
        
      </van-row>
    </div>
    <div v-else-if="role.role=='teacher'">
      <van-row>
          <van-cell-group>
            <van-field
              :value="name"
              required
              clearable
              label="姓名"
              placeholder="请输入姓名"
              @change="onChangeName"
            />
            <van-field
              :value="tel"
              required
              type="digit"
              clearable
              label="手机号"
              placeholder="请输入手机号"
              @change="onChangeTel"
            />
            
          </van-cell-group>
          <button plain class="submitBtn" @click="submitTea">
            登录/注册
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
      name:'',
      tel:'',
      stuNum: '',
      sex: '男',
      setSexFlag:false,
      className: '',
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
      this.name = event.mp.detail;
    },
    onChangeNum(event) {
    // event.detail 为当前输入的值
      this.stuNum = event.mp.detail;
    },
    onChangeTel(event) {
    // event.detail 为当前输入的值
      this.tel = event.mp.detail;
    },
    onChangeClass(event) {
    // event.detail 为当前输入的值
      this.className = event.mp.detail;
    },
    onChangeSex(event) {
      this.sex=event.mp.detail.value;
      this.setSexFlag = false
    },
    onClickLeft(){
      console.log(1)
    },
    submit(){
      var data={
        openid:this.role.openid,
        name:this.name,
        className:this.className,
        stuNum: this.stuNum,
        sex: this.sex,
        role:this.role.role
      }
      console.log(data)
      this.$http.post({
            url:"/regStu",
            data:data
        }).then(res =>{
            console.log(res)
            if (res.status == 200) {
              store.commit('changeRole', data)
              wx.showToast({
                title: res.msg, //提示的内容,
                icon: 'success', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {
                  mpvue.switchTab({url:'/pages/index/main'})
                }
              });
            } else if(res.status == 201) {
              store.commit('changeRole', data)
              wx.showToast({
                title: res.msg, //提示的内容,
                icon: 'success', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {
                  mpvue.switchTab({url:'/pages/index/main'})
                }
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
      var data={
        openid:this.role.openid,
        name:this.name,
        tel:this.tel,
        role:this.role.role
      }
      this.$http.post({
            url:"/regTea",
            data:data
        }).then(res =>{
            console.log(res)
            if (res.status == 200) {
              store.commit('changeRole', data)
              wx.showToast({
                title: res.msg, //提示的内容,
                icon: 'success', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {
                  mpvue.switchTab({url:'/pages/index/main'})
                }
              });
            } else if(res.status == 201) {
              store.commit('changeRole', data)
              wx.showToast({
                title: res.msg, //提示的内容,
                icon: 'success', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {
                  mpvue.switchTab({url:'/pages/index/main'})
                }
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
    test1(){
      console.log(this.name,this.stuNum,this.className)
      Dialog.alert({
        message: this.name,
      }).then(() => {
        // on close
      });
      // mpvue.switchTab({url:'/pages/index/main'})
    },
    getOpenId(role){  //获取用户的openid
			let _this=this
			wx.login({
			  success(res) {
			  	  	if (res.code) {
				      // 发起网络请求
				      wx.request({
				        url: 'https://api.weixin.qq.com/sns/jscode2session',
				        data: {
				            appid:'wx94de1f8bea88c043',  //开发者appid
				            secret:'a2050000a960ee55972f64eec7e4cfbd', //开发者AppSecret(小程序密钥)	
				            grant_type:"authorization_code",  //默认authorization_code
				            js_code: res.code    //wx.login登录获取的code值
				        },
				        success(res) {
                  _this.role.openid= res.data.openid
                  wx.hideLoading()			   
						}
				      })
				    } else {
				      console.log('登录失败！' + res.errMsg)
				    }
			  }
      })
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
    var role = store.state.role
    this.role=role
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
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}
.all {
  width: 7.5rem;
  height: 1rem;
  background-color: blue;
}
.all:after {
  display: block;
  content: '';
  clear: both;
}
.left {
  float: left;
  width: 3rem;
  height: 1rem;
  background-color: red;
}

.right {
  float: left;
  width: 4.5rem;
  height: 1rem;
  background-color: green;
}
</style>
