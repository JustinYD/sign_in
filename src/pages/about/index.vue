<template>
  <div>
    <div v-for="item in testData" :key="item">
    </div>
    <van-cell
      is-link
      title="个人信息"
      icon="manager-o"
      link-type="navigateTo"
      url="../myself/main"
    />
    <van-cell
      is-link
      title="我的课程"
      icon="star-o"
      link-type="navigateTo"
      url="../role/main"
    />
    <van-cell
      is-link
      title="我的考勤"
      icon="clock-o"
      link-type="navigateTo"
      url="../role/main"
    />
  </div>
</template>

<script>
import store from '../../utils/store'
export default {
  data () {
    return {
      motto: 'Hello miniprograme',
      address: {},
      testData:[{
        name:'sdsd'
      },
      {
        name:'啊啊啊啊'
      }]
    }
  },

  methods: {
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
    test () {
      var that = this
      this.getLocation()
    }
  },

  onShow(){
    this.role=store.state.role
    console.log(this.role)
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
