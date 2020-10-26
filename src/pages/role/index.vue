<template>
  <div >
    <div  class="stuOrTea">
      <van-row>
      <van-col span="12">
        <van-empty
          class="custom-image"
          image="https://sign-in-ypd.oss-cn-chengdu.aliyuncs.com/te.png"
        >
          <van-button plain type="info" open-type='getUserInfo' @click="isLogin('teacher')">
            我是老师
          </van-button>
        </van-empty>
      </van-col>
      <van-col span="12">
        <van-empty
          class="custom-image"
          image="https://sign-in-ypd.oss-cn-chengdu.aliyuncs.com/st.png"
        >
          <van-button plain type="info" open-type='getUserInfo' @click="isLogin('student')">
            我是学生
          </van-button>
        </van-empty>
      </van-col>
    </van-row>
    </div>
    
  </div>
</template>

<script>
import store from '../../utils/store'
export default {
  data () {
    return {
      motto: 'Hello miniprograme',
      address: {},
      show: true
    }
  },

  methods: {
    isLogin(role){	
      wx.showLoading({
        title: '加载中...' 
      })	
			var _this=this;
	    wx.getSetting({
	      success(res) {    	          	 
	        if (!res.authSetting['scope.userInfo']) {//未授权getUserInfo            	
	            wx.authorize({
	              scope: 'scope.getUserInfo',
	              success(res) {	                
	                _this.getOpenId(role)
	              },
	              fail(err){
                  console.log(err)
                  wx.hideLoading()
	              }
	            })
	        }else{//已授权
	          wx.getUserInfo({
	            success(res) {	
	              _this.getOpenId(role)
	            },
	            fail(err) {
                console.log(err)
                wx.hideLoading()
	            }
	          })
	        }
	      }
	    })
	  },
    getOpenId(role){  //获取用户的openid
      let _this=this
      console.log(store.state.role.openid)
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
                  store.commit('changeStu', role)
                  store.commit('changeOpenid', res.data.openid)
                  wx.hideLoading() 
                  mpvue.navigateTo({url: '../register/main'}) 
						}
				      })
				    } else {
				      console.log('登录失败！' + res.errMsg)
				    }
			  }
      })
		},
    routeHome(){
      wx.switchTab({url: '../index/main'})
    },
    register(role){
      this.isLogin()
      store.commit('changeStu', role)
      // console.log(store.state.role)
    },
    test () {
      
    }
  },
  onShow () {
    var that = this
    var role = store.state.role
    if (role.role == '') {
      wx.showToast({
        title: '请登录',
        icon:'none',
        duration: 2000
      })
    } else {
      // wx.switchTab({url: '../../pages/index/main'})
    }
    this.motto = store.state.msg
  }
}
</script>

<style scoped>
.bottom-button {
  width: 260px;
  height: 40px;
}
.stuOrTea{
  margin-top:50%
}
</style>
