<template>
  <div>
    <img src="https://sign-in-ypd.oss-cn-chengdu.aliyuncs.com/%E9%A2%84%E8%A7%88%E5%9B%BE_%E5%8D%83%E5%9B%BE%E7%BD%91_%E7%BC%96%E5%8F%B735756891.png" style="width:100%" />
    <!-- 学生界面 -->
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

    <!-- 教师页面 -->
    <div v-else>
      <div v-if="classData.length>0">
        <img src="/static/tabs/add.png" @click="createClass" class="createBtn" />
        <div v-for="item in classData" :key="item">
          {{item.classname}}
          {{item.status?'开始':'未开始'}}
          {{item.teacher_name}}
        </div>
      </div>
      <div v-else>
        <van-empty
          image="https://sign-in-ypd.oss-cn-chengdu.aliyuncs.com/404.png"
          description="未创建任何课程"
        >
          <van-button
            type="danger"
            @click="createClass"
            color="linear-gradient(to right, #4bb0ff, #6149f6)"
          >
            创建课程
          </van-button>
        </van-empty>
      </div>
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
      classData:[],
      classId:'',
      right_width: 65,
      left_width: 65
    }
  },

  methods: {
    createClass(){
      wx.navigateTo({ url: "../createclass/main" });
    },
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
            } else {
              return false
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
    },
    getTeacherClass(){
      var data=store.state.role
      this.$http.post({
            url:"/getTeacherClass",
            data:data
        }).then(res =>{
            this.classData = []
            if (res.status == 201) {
              this.classData = []
            } else {
              const temp = res.data
              for (let index = 0; index < temp.length; index++) {
                const d = new Date(temp[index][3])
                const time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + temp[index][3].substring(16, 25)
                this.classData.push({id:temp[index][0],classname:temp[index][1], createtime: time, status:temp[index][4],teacher_name:temp[index][5]})
              }
            }
        })
    },
  },
  onShow () {
    this.getTeacherClass()
    this.getMyRole()
    var role = store.state.role
    if (role.role == 'teacher') {
      this.show = false
    } else {
      this.show = true
    }
    this.getLocation()
  }
}
</script>

<style scoped>
.bottom-button {
  width: 260px;
  height: 40px;
}
.createBtn{
  position: fixed;
  display: block;
  z-index: 99;
  top: 80%;
  right: 30px;
  width: 40px;
  height: 40px;
}
</style>
