<template>
  <div>
    <!-- 老师 -->
    <div v-if="show">
      <div v-if="classData.length > 0">
        <div v-for="item in classData" :key="item">
          <div class="teacherClassList" @click="getClassTemp(item)">
            <h3 style="font-weight:600"> {{item.classname}} </h3>
            <h5 style="color:grey;margin-top:5px">课程编号：{{item.id}}</h5>
            <h5 style="color:lightgrey;margin-top:5px">{{item.createtime}}</h5>
          </div>
        </div>
      </div>
      <div v-else>
        <van-empty
          image="https://sign-in-ypd.oss-cn-chengdu.aliyuncs.com/404.png"
          description="没有课程打卡记录！"
        >
        </van-empty>
      </div>
    </div>
    <!-- 学生 -->
    <div v-else>
      <van-dialog id="van-dialog" />
      <div v-if="studentClassData.length > 0">
        <div v-for="item in studentClassData" :key="item">
          <div v-if="item.status" class="ClassList" @click="getClassTemp(item)">
            <span style="font-weight:600"> {{item.class_name}} </span><van-tag type="success">已打卡</van-tag>
            <h5 style="color:grey;margin-top:5px">任课教师：{{item.teacher_name}}</h5>
            <h5 style="color:lightgrey;margin-top:5px">课程编号：{{item.class_id}}</h5>
            <h5 style="color:lightgrey;margin-top:5px">打卡时间：{{item.sign_time}}</h5>
          </div>
          <div v-else class="noClassList" @click="getClassTemp(item)">
            <span style="font-weight:600"> {{item.class_name}} </span><van-tag type="danger">未打卡</van-tag>
            <h5 style="color:grey;margin-top:5px">任课教师：{{item.teacher_name}}</h5>
            <h5 style="color:lightgrey;margin-top:5px">课程编号：{{item.class_id}}</h5>
            <h5 style="color:lightgrey;margin-top:5px">上课时间：{{item.create_time}}</h5>
          </div>
        </div>
      </div>
      <div v-else>
        <van-empty
          image="https://sign-in-ypd.oss-cn-chengdu.aliyuncs.com/404.png"
          description="没有任何打卡记录！"
        >
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
    getClassTemp(item){
      wx.navigateTo({
        url: '../item_history/main?obj=' + JSON.stringify(item)
      })
    },
    getId(id){
      this.classId = id
    },
    getDelStudentClass(item){
      this.studentClass = item
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
            url:"/getStudentSignHistory",
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
                const d = new Date(temp[index][7])
                const d1 = new Date(temp[index][8])
                var status = false
                const time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + temp[index][7].substring(16, 25)
                const time1 = d1.getFullYear() + '-' + (d1.getMonth() + 1) + '-' + d1.getDate() + ' ' + temp[index][8].substring(16, 25)
                if (temp[index][13] == '1') {
                  status = true
                } else {
                  status = false
                }
                this.studentClassData.push({
                  teacher_id:temp[index][2],
                  teacher_name:temp[index][3],
                  student_id:temp[index][4],
                  student_name:temp[index][5],
                  class_id:temp[index][0],
                  class_name:temp[index][1],
                  sign_time: time, 
                  create_time: time1, 
                  startTag:temp[index][10],
                  status:status})
              }
            }
        })
    },
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
.noClassList{
  width: 90%;
  margin: 10px auto;
  background: rgb(255, 255, 255);
  padding: 5px;
  border-left: 4px rgb(250, 3, 77) solid;
  background-color:  rgb(255, 235, 241) ;
  border-radius: 5px;
}
.ClassList{
  width: 90%;
  margin: 10px auto;
  background: rgb(255, 255, 255);
  padding: 5px;
  border-left: 4px rgb(9, 207, 241) solid;
  background-color: #ecf9ff;
  border-radius: 5px;
}
.teacherClassList{
  width: 90%;
  margin: 10px auto;
  background: rgb(255, 255, 255);
  padding: 5px;
  border-left: 4px rgb(248, 56, 136) solid;
  background-color: rgb(255, 245, 249) ;
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
