<template>
  <div>
    <!-- 老师 -->
    <div v-if="show">
      <div v-if="classData.length > 0">
        <van-dialog id="van-dialog" />
        <img src="/static/tabs/add.png" @click="createClass" class="createBtn" />
        <div v-for="item in classData" :key="item">
          <van-swipe-cell
            id="swipe-cell"
            right-width="60"
            left-width="60"
            async-close
            @close="onClose"
          >
            <div class="classList" @click="getClassTemp(item)">
              <h3 style="font-weight:600"> {{item.classname}} </h3>
              <h5 style="color:grey;margin-top:5px">课程编号：{{item.id}}</h5>
              <h5 style="color:lightgrey;margin-top:5px">{{item.createtime}}</h5>
              
            </div>
            <view slot="right" style="height:100%">
              <van-button type="danger" @click="getId(item.id)">
                删除
              </van-button>
            </view>
            <view slot="left" style="height:100%">
              <van-button type="primary" @click="getClassTemp(item)">
                修改
              </van-button>
            </view>
          </van-swipe-cell>
        </div>
        <van-popup
          v-bind:show="changeFlag"
          closeable
          close-icon="close"
          position="bottom"
          z-index="100"
          custom-style="height: 50%"
          @close="closeChange"
        >
          <div style="margin-top:50px">
            <van-row>
              <van-cell-group>
                <van-field
                  :value="classTemp.classname"
                  required
                  clearable
                  label="课程名称"
                  placeholder="请输入课程名称"
                  @change="onChangeClassName"
                />
                </van-cell-group>
                <button plain class="submitBtn" @click="updateClass">
                  修改课程
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
    <!-- 学生 -->
    <div v-else>
      <van-dialog id="van-dialog" />
      <div v-if="studentClassData.length > 0">
        <img src="/static/tabs/add.png" @click="createStudentClass" class="createBtn" />
        <div v-for="item in studentClassData" :key="item">
          <van-swipe-cell
            id="swipe-cell"
            right-width="60"
            async-close
            @close="onStudentClose"
          >
            <div class="classList" @click="getClassTemp(item)">
              <h3 style="font-weight:600"> {{item.class_name}} </h3>
              <h5 style="color:grey;margin-top:5px">任课教师：{{item.teacher_name}}</h5>
              <h5 style="color:lightgrey;margin-top:5px">课程编号：{{item.class_id}}</h5>
              <h5 style="color:lightgrey;margin-top:5px">添加时间：{{item.createtime}}</h5>
            </div>
            <view slot="right" style="height:100%">
              <van-button type="danger" @click="getDelStudentClass(item)">
                删除
              </van-button>
            </view>
          </van-swipe-cell>
        </div>
      </div>
      <div v-else>
        <van-empty
          image="https://sign-in-ypd.oss-cn-chengdu.aliyuncs.com/404.png"
          description="未添加任何课程"
        >
          <van-button
            type="danger"
            @click="createStudentClass"
            color="linear-gradient(to right, #4bb0ff, #6149f6)"
          >
            添加课程
          </van-button>
        </van-empty>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../../utils/store'
import Dialog from "../../../static/vant/dialog/dialog"
export default {
  data () {
    return {
      motto: 'Hello miniprograme',
      show:true,
      address: {},
      classData:[],
      studentClassData:[],
      studentClass:{},
      classTemp:{},
      classId:'',
      changeFlag:false
    }
  },

  methods: {
    onChangeClassName(event) {
    // event.detail 为当前输入的值
      this.classTemp.classname = event.mp.detail;
    },
    closeChange(){
      this.changeFlag=false
      this.getTeacherClass()
    },
    getClassTemp(item){
      this.classTemp=item
    },
    getId(id){
      this.classId = id
    },
    getDelStudentClass(item){
      this.studentClass = item
    },
    updateClass(){
      var temp = this.classTemp
      this.$http.post({
            url:"/updateClass",
            data:temp
        }).then(res =>{
            if (res.status == 200) {
              wx.showToast({
                title: res.msg, //提示的内容,
                icon: 'success', //图标,
                duration: 2000, //延迟时间,
                success: res => {
                  this.changeFlag=false
                  this.getTeacherClass()
                }
              });
            } else {
              return false
            }
        })
    },
    deleteTeacherClass(id){
      var data={
        id:id,
        teacher_openid:store.state.role.openid
      }
      this.$http.post({
            url:"/deleteClass",
            data:data
        }).then(res =>{
            if (res.status == 200) {
              wx.showToast({
                title: res.msg, //提示的内容,
                icon: 'success', //图标,
                duration: 2000, //延迟时间,
                success: res => {
                  this.getTeacherClass()
                }
              });
            } else {
              return false
            }
        })
    },
    delStudentClass(item){
      this.$http.post({
            url:"/deleteStudentClass",
            data:item
        }).then(res =>{
            if (res.status == 200) {
              wx.showToast({
                title: res.msg, //提示的内容,
                icon: 'success', //图标,
                duration: 2000, //延迟时间,
                success: res => {
                  this.getStudentClass()
                }
              });
            } else {
              return false
            }
        })
    },
    onStudentClose(event) {
      const { position, instance } = event.mp.detail;
      switch (position) {
        case 'left':
        case 'cell':
          instance.close();
          break;
        case 'right':
          Dialog.confirm({
            message: '确定从我的课程删除《'+ this.studentClass.class_name + '》吗？',
          }).then(() => {
            this.delStudentClass(this.studentClass)
            instance.close();
          }).catch(()=>{
            instance.close();
          });
          break;
      }
    },
    onClose(event) {
      const { position, instance } = event.mp.detail;
      switch (position) {
        case 'left':
          Dialog.confirm({
            message: '确定修改吗？',
          }).then(() => {
            this.changeFlag=true
            instance.close();
          }).catch(()=>{
            instance.close();
          });
          break;
        case 'cell':
          instance.close();
          break;
        case 'right':
          Dialog.confirm({
            message: '确定删除吗？',
          }).then(() => {
            this.deleteTeacherClass(this.classId)
            instance.close();
          }).catch(()=>{
            instance.close();
          });
          break;
      }
    },
    getTeacherClass(){
      var data=store.state.role
      this.$http.post({
            url:"/getTeacherClass",
            data:data
        }).then(res =>{
            this.classData = []
            wx.showToast({
                title: res.msg, //提示的内容,
                icon: 'none', //图标,
                duration: 2000, //延迟时间,
              });
            if (res.status == 201) {
              this.classData = []
            } else {
              const temp = res.data
              for (let index = 0; index < temp.length; index++) {
                const d = new Date(temp[index][3])
                const time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + temp[index][3].substring(16, 25)
                this.classData.push({id:temp[index][0],classname:temp[index][1], createtime: time, status:temp[index][4]})
              }
            }
        })
    },
    getStudentClass(){
      var data=store.state.role
      this.$http.post({
            url:"/getStudentClass",
            data:data
        }).then(res =>{
            this.studentClassData = []
            wx.showToast({
                title: res.msg, //提示的内容,
                icon: 'none', //图标,
                duration: 2000, //延迟时间,
              });
            if (res.status == 201) {
              this.studentClassData = []
            } 
            else if(res.status == 200) {
              const temp = res.data
              for (let index = 0; index < temp.length; index++) {
                const d = new Date(temp[index][8])
                const time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + temp[index][8].substring(16, 25)
                this.studentClassData.push({
                  teacher_id:temp[index][0],
                  teacher_name:temp[index][1],
                  student_id:temp[index][2],
                  student_name:temp[index][3],
                  class_id:temp[index][4],
                  class_name:temp[index][5],
                  createtime: time, 
                  status:temp[index][7]})
              }
            }
        })
    },
    createClass(){
      wx.navigateTo({ url: "../createclass/main" });
    },
    createStudentClass(){
      wx.navigateTo({ url: "../createclass/main" });
    }
  },

  onShow(){
    this.role=store.state.role
    var role = store.state.role
    if (role.role == 'teacher') {
      this.show = true
      this.getTeacherClass()
    } else {
      this.show = false
      this.getStudentClass()
    }
  }
}
</script>

<style scoped>
.aboutImg{
  width: 100%;
}
.createBtn{
  position: fixed;
  display: block;
  z-index: 99;
  top: 60%;
  right: 30px;
  width: 40px;
  height: 40px;
}
.classList{
  width: 90%;
  margin: 10px auto;
  background: rgb(255, 255, 255);
  padding: 5px;
  border-left: 5px rgb(250, 94, 3) solid;
  background-color: rgb(252, 240, 233) ;
  border-radius: 5px;
}
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
</style>
