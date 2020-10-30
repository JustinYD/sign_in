<template>
  <div>
    <img src="https://sign-in-ypd.oss-cn-chengdu.aliyuncs.com/%E9%A2%84%E8%A7%88%E5%9B%BE_%E5%8D%83%E5%9B%BE%E7%BD%91_%E7%BC%96%E5%8F%B736012789.png" class="aboutImg" />
    <div v-if="show">
      <van-row>
        <van-col offset="1" span="22">
          <div class="itemList"> 
            <van-cell
              is-link
              title="个人信息"
              icon="manager-o"
              @click="getMyRole"
            />
          </div>
          <div class="itemList"> 
            <van-cell
              is-link
              title="我的课程"
              icon="star-o"
              link-type="navigateTo"
              url="../myclass/main"
            />
          </div>
          <div class="itemList"> 
            <van-cell
              is-link
              title="学生考勤记录"
              icon="clock-o"
              link-type="navigateTo"
              url="../sign_history/main"
            />
          </div>
          <div class="itemList"> 
            <van-cell
              is-link
              title="退出/切换角色"
              icon="exchange"
              link-type="navigateTo"
              url="../role/main"
            />
          </div>
        </van-col>
      </van-row>
    </div>
    <div v-else>
      <van-row type="flex" justify="center">
        <van-col offset="1" span="22">
          <div class="itemList"> 
            <van-cell
              is-link
              title="个人信息"
              icon="manager-o"
              @click="getMyRole"
            />
          </div>
          <div class="itemList"> 
            <van-cell
              is-link
              title="我的课程"
              icon="star-o"
              link-type="navigateTo"
              url="../myclass/main"
            />
          </div>
          <div class="itemList"> 
            <van-cell
              is-link
              title="历史考勤记录"
              icon="clock-o"
              link-type="navigateTo"
              url="../sign_history/main"
            />
          </div>
          <div class="itemList"> 
            <van-cell
              is-link
              title="退出/切换角色"
              icon="exchange"
              link-type="navigateTo"
              url="../role/main"
            />
          </div>
        </van-col>
      </van-row>
    </div>
    <van-divider
      contentPosition="center"
      customStyle="color: lightgrey; border-color: #1989fa; font-size: 12px;margin-top:25%"
    >
      Designed By @杨培懂
    </van-divider>
  </div>
</template>

<script>
import store from '../../utils/store'
export default {
  data () {
    return {
      motto: 'Hello miniprograme',
      show:true,
      address: {}
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
    },
    getMyRole(){
      var that=this
      var data=store.state.role
      this.$http.post({
            url:"/getMyRole",
            data:data
        }).then(res =>{
            if (res.status==200) {
              var data=res.data[0]
              var role={}
              if(data[2]=='student'){
                role.name=data[1]
                role.stuNum=data[3]
                role.className=data[4]
                role.role=data[2]
                role.sex=data[5]
                role.openid=store.state.role.openid
              }else{
                role.openid=store.state.role.openid
                role.name=data[1]
                role.role=data[2]
                role.tel=data[3]
              }
              store.commit('changeRole', role)
              wx.navigateTo({ url: "../myself/main" });
            } else {
              return false
            }
        })
    }
  },

  onShow(){
    this.role=store.state.role
    var role = store.state.role
    if (role.role == 'teacher') {
      this.show = true
    } else {
      this.show = false
    }
    this.getLocation()
  }
}
</script>

<style scoped>
.aboutImg{
  width: 100%;
}
.itemList{
  margin: 10px 0;
  background: rgb(37, 152, 247);
  padding: 1px;
  border-radius: 8px;
}
</style>
