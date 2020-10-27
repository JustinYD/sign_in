<template>
  <div>
    <div>
      <van-row>
          <van-cell-group>
            <van-field
              :value="classname"
              required
              clearable
              label="课程名称"
              placeholder="请输入课程名称"
              @change="onChangeClassName"
            />
          </van-cell-group>
          <button plain class="submitBtn" @click="submit">
            创建课程
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
      classname: '',
      show: true,
      right_width: 65,
      left_width: 65
    }
  },

  methods: {
    onChangeClassName(event) {
    // event.detail 为当前输入的值
      this.classname = event.mp.detail;
    },
    submit(){
      var data=store.state.role
      data.classname=this.classname,
      console.log(data)
      this.$http.post({
            url:"/createClass",
            data:data
        }).then(res =>{
            if (res.status == 200) {
              wx.showToast({
                title: res.msg, //提示的内容,
                icon: 'success', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {
                  wx.navigateBack();
                }
              });
            } else{
              wx.showToast({
                title: res.msg, //提示的内容,
                icon: 'none', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
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
    this.classname=''
  }
}
</script>

<style scoped>
.submitBtn{
  margin-top: 90%;
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
