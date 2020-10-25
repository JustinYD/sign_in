<template>
  <div>
    <div v-if="show">
    <van-dialog
      id="van-dialog"
    />

    <van-toast
      id="van-toast" />
    <van-empty
      description="未添加任何课程"
    >
      <van-button
        type="danger"
        @click="test"
        class="bottom-button"
      >
        {{motto}}
      </van-button>
    </van-empty>
  </div>
  <div v-else>
    <van-cell-group>
      <van-cell
        title="单元格"
        value="内容"
        @click="test1"
      />
      <van-cell
        title="单元格"
        value="内容"
      />
      <van-cell
        title="单元格"
        value="内容"
      />
    </van-cell-group>
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
      motto: 'Hello miniprograme',
      address: {},
      show: true,
      right_width: 65,
      left_width: 65
    }
  },

  methods: {
    onClose() {
      this.show = false
      console.log('关闭')
    },
    getLocation () {
      var that = this
      wx.getSetting({
          success: function(e) {
            let userLocation = e.authSetting["scope.userLocation"]
            if(typeof(userLocation)=="undefined"){  // 用户第一次授权地理位置
                //1、获取当前位置坐标
              wx.getLocation({
                type: 'wgs84',
                success: res => {
                  //2、根据坐标获取当前位置名称，显示在顶部:逆地址解析
                  that.address.lat = res.latitude
                  that.address.lon = res.longitude
                }
              })
            }else{  // 用户点了允许授权之后 又设置不允许获取位置的处理
              wx.getLocation({
                type: 'wgs84',
                success: res => {
                  //2、根据坐标获取当前位置名称，显示在顶部:逆地址解析
                  that.address.lat = res.latitude
                  that.address.lon = res.longitude
                }
              })
            }
          }
        })
    },
    test1(){
      wx.redirectTo({url: '../role/main'})
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
        mpvue.redirectTo({url:'../role/main'})
      })
    },
    clickHandle (ev) {
      this.motto = 'fuck!!!!'
    }
  },
  onShow () {
    var that = this
    var role = store.state.role
    console.log(role)
    if (role.role == 'teacher') {
      this.show = false
    } else {
      this.show = true
    }
    this.getLocation()
    this.motto = store.state.msg
  }
}
</script>

<style scoped>
.bottom-button {
  width: 260px;
  height: 40px;
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
