<template>
  <div>
    <div v-if="classData.length > 0">
        <div v-for="item in classData" :key="item">
          <div class="ClassList" @click="getClassTemp(item)">
            <h3 style="font-weight:600">课程标记：{{item.startTag}} </h3>
            <h5 style="color:grey;margin-top:5px">总人数：{{item.sum}}</h5>
            <h5 style="color:lightgrey;margin-top:5px">开始时间：{{item.createtime}}</h5>
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
        url: '../item_detail/main?obj=' + JSON.stringify(item)
      })
    },
    getTeacherClass(data){
      this.$http.post({
            url:"/getItemHistory",
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
              console.log(temp)
              for (let index = 0; index < temp.length; index++) {
                const d = new Date(temp[index][1])
                const time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + temp[index][1].substring(16, 25)
                this.classData.push({class_id:this.classTemp.id ,teacher_id:this.role.openid,startTag:temp[index][0], createtime: time, sum:temp[index][2]})
              }
            }
        })
    },
  },

  onShow(){
    this.role=store.state.role
    var role = store.state.role
  },
  // test.js
  onLoad(options) {
      var temp=JSON.parse(options.obj)
      this.classTemp=temp
      this.role=store.state.role
      var data={
        class_id:temp.id,
        teacher_id:this.role.openid
      }
      this.getTeacherClass(data)
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
  border-left: 4px rgb(218, 171, 17) solid;
  background-color: rgb(247, 237, 206) ;
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
