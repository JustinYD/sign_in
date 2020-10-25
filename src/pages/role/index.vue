<template>
  <div >
    <div  class="stuOrTea">
      <van-row>
      <van-col span="12">
        <van-empty
          class="custom-image"
          image="/static/images/teacher.png"
        >
          <van-button plain type="info" open-type='getUserInfo' @click="register('teacher')">
            我是老师
          </van-button>
        </van-empty>
      </van-col>
      <van-col span="12">
        <van-empty
          class="custom-image"
          image="/static/images/student.png"
        >
          <van-button plain type="info" open-type='getUserInfo' @click="register('student')">
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
                  store.commit('changeOpenid', res.data.openid)
                  wx.hideLoading()			   
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
      mpvue.navigateTo({url: '../register/main'})
      // console.log(store.state.role)
    },
    test () {
      var that = this
      Dialog.alert({
        message: '地址信息',
        showCancelButton: true
      }).then(() => {
        that.$http.get({
            url:"/getlw_10"
        }).then(res =>{
            console.log(res)
        })
      }).catch(() => {
        console.log('no')
      })
    }
  },
  onShow () {
    var that = this
    var role = store.state.role
    if (role.role == '') {
      wx.showToast({
        title: '请登录',
        image: '/static/images/error.png',
        duration: 2000
      })
    }
    // } else {
    //   wx.switchTab({url: '../../pages/index/main'})
    // }
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
