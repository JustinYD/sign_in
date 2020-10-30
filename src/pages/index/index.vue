<template>
  <div>
    <img
      src="https://sign-in-ypd.oss-cn-chengdu.aliyuncs.com/%E9%A2%84%E8%A7%88%E5%9B%BE_%E5%8D%83%E5%9B%BE%E7%BD%91_%E7%BC%96%E5%8F%B735756891.png"
      style="width:100%"
    />
    <!-- 学生界面 -->
    <div v-if="show">
      <van-dialog
        id="van-dialog"
      />
      <!-- 已经添加的课程，只显示可打卡课程 -->
      <div
        v-if="startStudentClassData.length > 0"
      >
        <van-dialog
          id="van-dialog"
        />
        <div
          v-for="item in startStudentClassData"
          :key="item"
        >
          <div
            class="startClassList"
            @click="sign_in_class(item)"
          >
            <h3
              style="font-weight:600"
            > {{item.class_name}}
            </h3>
            <h5
              style="color:grey;margin-top:5px"
            >任课教师：{{item.teacher_name}}
            </h5>
            <h5
              style="color:lightgrey;margin-top:5px"
            >课程编号：{{item.class_id}}
            </h5>
          </div>
        </div>
      </div>
      <!-- 学生未添加任何课程 -->
      <div v-else>
        <van-empty
          image="https://sign-in-ypd.oss-cn-chengdu.aliyuncs.com/404.png"
          description="没有课程需要打卡！"
        >
        </van-empty>
      </div>
    </div>

    <!-- 教师页面 -->
    <div v-else>
      <van-dialog
        id="van-dialog"
      />
      <div
        v-if="startClassData.length>0 || stopClassData.length>0"
      >
        <img
          src="/static/tabs/add.png"
          @click="createClass"
          class="createBtn"
        />
        <div
          class="teacherStartClassList"
          v-for="item in startClassData"
          :key="item"
          @click="stop_my_class(item)"
        >
          <h3
            style="font-weight:600"
          > {{item.classname}}
          </h3>
          <h5
            style="color:grey;margin-top:5px"
          >{{item.status?'打卡中':'未开始'}}
          </h5>
          <h5
            style="color:lightgrey;margin-top:5px"
          >课程编号：{{item.id}}
          </h5>
        </div>
        <div
          class="teacherStopClassList"
          v-for="item in stopClassData"
          :key="item"
          @click="start_my_class(item)"
        >
          <h3
            style="font-weight:600"
          > {{item.classname}}
          </h3>
          <h5
            style="color:grey;margin-top:5px"
          >{{item.status?'打卡中':'未开始'}}
          </h5>
          <h5
            style="color:lightgrey;margin-top:5px"
          >课程编号：{{item.id}}
          </h5>
        </div>
        <van-popup
          v-bind:show="startFlag"
          closeable
          close-icon="close"
          position="bottom"
          z-index="100"
          custom-style="height: 50%"
          @close="closeChange"
        >
          <div
            style="margin-top:50px"
          >
            <van-row>
              <van-cell-group>
                <van-field
                  :value="startTag"
                  required
                  clearable
                  label="课堂标记"
                  placeholder="请输入本次课堂标记"
                  @change="onStartTag"
                />
              </van-cell-group>
              <button
                plain
                class="submitBtn"
                @click="startClass"
              >
                提交
              </button>
            </van-row>
          </div>
        </van-popup>
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
      startFlag:false,
      startClassData:[],
      stopClassData:[],
      startStudentClassData:[],
      stopStudentClassData:[],
      classId:'',
      startTag:'',
      classtemp: {},
      right_width: 65,
      left_width: 65,
      clearTimeSet:null,
      startTemp:{},
      distance:''
    }
  },

  methods: {
    getDis(data){
      this.$http.post({
                url:"/getdistance",
                data:data
              }).then(res =>{
                  if (res.status == 200) {
                    this.distance=res.data
                    console.log(this.distance)
                  }
              })
		},
    onStartTag(event) {
    // event.detail 为当前输入的值
      this.startTag = event.mp.detail;
    },
    sign_in_class(item){
      var role=store.state.role
      Dialog.confirm({
            message: '确定打卡《'+ item.class_name + '》该门课程吗？',
            }).then(() => {
              this.getLocation()
              var getDis={
                lat:this.address.lat,
                lng:this.address.lng,
                mlat:item.mlat,
                mlng:item.mlng
              }
              this.getDis(getDis)
              if (this.distance < 100) {
                this.$http.post({
                  url:"/sign_in",
                  data:item
                }).then(res =>{
                    if (res.status == 200) {
                      wx.showToast({
                        title: '打卡成功', //提示的内容,
                        icon: 'success', //图标,
                        duration: 2000, //延迟时间,
                      });
                    } else{
                      wx.showToast({
                        title: '打卡失败', //提示的内容,
                        icon: 'none', //图标,
                        duration: 2000, //延迟时间,
                      });
                    }
                })
              } else {
                wx.showToast({
                    title: '打卡失败!不在打卡范围内!', //提示的内容,
                    icon: 'none', //图标,
                    duration: 4000, //延迟时间,
                });
              }
            }).catch(()=>{
          })
    },
    startClass(){
      this.getLocation()
      var data=this.startTemp
      data.startTag=this.startTag
      data.mlat=this.address.lat
      data.mlng=this.address.lng
      this.$http.post({
                url:"/startOrStopClass",
                data:data
              }).then(res =>{
                  if (res.status == 200) {
                    wx.showToast({
                      title: res.msg, //提示的内容,
                      icon: 'success', //图标,
                      duration: 2000, //延迟时间,
                      success:res=>{
                        this.getTeacherClass()
                      }
                    });
                  } else{
                    wx.showToast({
                      title: res.msg, //提示的内容,
                      icon: 'none', //图标,
                      duration: 2000, //延迟时间,
                    });
                  }
                  this.startFlag=false
              })
    },
    start_my_class(item){
      var role=store.state.role
      var data={
        id:item.id,
        status:true,
        classname:item.classname,
        startTag:''
      }
      this.startTemp=data
      Dialog.confirm({
            message: '确定开始打卡《'+ data.classname + '》该门课程吗？',
            }).then(() => {
              this.startTag=''
              this.startFlag=true
            }).catch(()=>{
          })
    },
    stop_my_class(item){
      var role=store.state.role
      var data={
        id:item.id,
        status:false,
        classname:item.classname,
        teacher_id:role.openid,
        startTag:this.startTag
      }
      Dialog.confirm({
            message: '确定结束打卡《'+ item.classname + '》该门课程吗？',
            }).then(() => {
              this.$http.post({
                url:"/startOrStopClass",
                data:data
              }).then(res =>{
                  if (res.status == 200) {
                    wx.showToast({
                      title: res.msg, //提示的内容,
                      icon: 'success', //图标,
                      duration: 2000, //延迟时间,
                      success:res=>{
                        this.getTeacherClass()
                      }
                    });
                  } else{
                    wx.showToast({
                      title: res.msg, //提示的内容,
                      icon: 'none', //图标,
                      duration: 2000, //延迟时间,
                    });
                  }
              })
            }).catch(()=>{
          })
    },
    createClass(){
      wx.navigateTo({ url: "../createclass/main" });
    },
    createStudentClass(){
      wx.navigateTo({ url: "../createclass/main" });
    },
    onClose() {
      this.show = false
      console.log('关闭')
    },
    closeChange(){
      this.startFlag=false
      this.getTeacherClass()
    },
    getClassTemp(item){
      this.classTemp=item
      console.log(item)
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
                  that.address.lng = res.longitude
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
            this.startClassData = []
            this.stopClassData = []
            if (res.status == 201) {
              this.classData = []
            } else {
              const temp = res.data
              for (let index = 0; index < temp.length; index++) {
                const d = new Date(temp[index][3])
                const time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + temp[index][3].substring(16, 25)
                if(temp[index][4]){
                  this.startClassData.push({id:temp[index][0],classname:temp[index][1], createtime: time, status:true,teacher_name:temp[index][5]})
                }else{
                  this.stopClassData.push({id:temp[index][0],classname:temp[index][1], createtime: time, status:false,teacher_name:temp[index][5]})
                }
              }
            }
        })
    },
    getStudentClass(){
      var data=store.state.role
      this.$http.post({
            url:"/getStudentSignClass",
            data:data
        }).then(res =>{
            this.startStudentClassData = []
            this.stopStudentClassData = []
            if (res.status == 201) {
              this.startStudentClassData = []
              this.stopStudentClassData = []  
            } 
            else if(res.status == 200){
              const temp = res.data
              for (let index = 0; index < temp.length; index++) {
                const d = new Date(temp[index][8])
                const time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + temp[index][8].substring(16, 25)
                this.startStudentClassData.push({
                    teacher_id:temp[index][2],
                    teacher_name:temp[index][3],
                    student_id:temp[index][4],
                    student_name:temp[index][5],
                    class_id:temp[index][0],
                    class_name:temp[index][1],
                    createtime: time, 
                    status:true,
                    startTag:temp[index][10],
                    mlat:temp[index][11],
                    mlng:temp[index][12]})
              }
            } else {
              this.startStudentClassData = []
              this.stopStudentClassData = []  
            }
        })
    },
    setTime() //设置定时器
    {
      this.clearTimeSet=setInterval(() => {
        this.getStudentClass()
      }, 1000);
    }
  },
  onShow () {
    this.getMyRole()
    var role = store.state.role
    if (role.role == 'teacher') {
      this.show = false
      this.getTeacherClass()
    } else {
      this.show = true
      this.setTime()
    }
    this.getLocation()
  },
  onHide() {
    clearInterval(this.clearTimeSet)
  }
}
</script>

<style scoped>
.bottom-button {
  width: 260px;
  height: 40px;
}
.createBtn {
  position: fixed;
  display: block;
  z-index: 99;
  top: 80%;
  right: 30px;
  width: 40px;
  height: 40px;
}
.startClassList {
  width: 90%;
  margin: 10px auto;
  background: rgb(255, 255, 255);
  padding: 5px;
  border-left: 5px rgb(9, 207, 241) solid;
  background-color: #ecf9ff;
  border-radius: 5px;
}
.stopClassList {
  width: 90%;
  margin: 10px auto;
  background: rgb(255, 255, 255);
  padding: 5px;
  border-left: 5px rgb(172, 3, 250) solid;
  background-color: rgb(245, 232, 252);
  border-radius: 5px;
}
.teacherStartClassList {
  width: 90%;
  margin: 10px auto;
  background: rgb(255, 255, 255);
  padding: 5px;
  border-left: 5px rgb(9, 207, 241) solid;
  background-color: #ecf9ff;
  border-radius: 5px;
}
.teacherStopClassList {
  width: 90%;
  margin: 10px auto;
  background: rgb(255, 255, 255);
  padding: 5px;
  border-left: 5px rgb(187, 50, 250) solid;
  background-color: rgb(250, 243, 253);
  border-radius: 5px;
}
.submitBtn {
  margin-top: 20px;
  width: 80%;
  color: white;
  border-color: rgb(52, 132, 236);
  background: rgb(52, 132, 236);
}
.submitBtn:active {
  background: rgb(134, 173, 224);
  border-color: rgb(134, 173, 224);
}
</style>
