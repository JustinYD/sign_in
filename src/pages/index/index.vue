<template>
  <div @click="clickHandle">
    {{motto}}
    <van-button
      @click="test"
      type="default"
    >默认按钮
    </van-button>
    <van-dialog
      id="van-dialog"
    />
    <van-notify
      id="van-notify"
    />
    <van-button
      @click="main"
      type="primary"
    >主要按钮
    </van-button>
    <van-button type="info">
      信息按钮</van-button>
    <van-button
      type="warning">警告按钮
    </van-button>
    <van-button type="danger">
      危险按钮</van-button>
  </div>
</template>

<script>
import Dialog from '../../../static/vant/dialog/dialog'
export default {
  data () {
    return {
      motto: 'Hello miniprograme',
      address: ''
    }
  },

  methods: {
    main () {
      var that = this
      wx.getSetting({
          success: function(e) {
            let userLocation = e.authSetting["scope.userLocation"]
            if(typeof(userLocation)=="undefined"){  // 用户第一次授权地理位置
                //1、获取当前位置坐标
              wx.getLocation({
                type: 'wgs84',
                success: res => {
                  console.log(res)
                  //2、根据坐标获取当前位置名称，显示在顶部:逆地址解析
                  that.address = res.latitude+','+res.longitude
                }
              })
            }else{  // 用户点了允许授权之后 又设置不允许获取位置的处理
            }
          }
        })
    },
    test () {
      Dialog.alert({
        message: '弹窗内容',
        showCancelButton: true
      }).then(() => {
        console.log('yes')
      }).catch(() => {
        console.log('no')
      })
    },
    clickHandle (ev) {
      this.motto = 'fuck!!!!'
    }
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style scoped>
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
