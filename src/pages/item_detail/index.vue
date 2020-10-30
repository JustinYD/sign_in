<template>
  <div>
    <div class="warp">
      <!-- <ec-canvas id="mychart-dom-bar" canvas-id="mychart-bar" @ec="ec"></ec-canvas> -->
      <ec-canvas id="mychart-dom-bar" canvas-id="mychart-bar" :echarts="echarts"></ec-canvas>
      <mpvue-echarts :echarts="echarts" :onInit="echartInit" />
    </div>
    <div>
      <div v-for="item in no_sign_data" :key="item">
          <div class="noClassList">
            <span style="font-weight:600">姓名：{{item.student_name}} </span><van-tag type="danger">未打卡</van-tag>
            <h5 style="color:grey;margin-top:3px">班级：{{item.majorName}}</h5>
            <h5 style="color:grey;margin-top:3px">学号：{{item.student_number}}</h5>
          </div>
        </div>
        <div v-for="item in sign_data" :key="item">
          <div class="ClassList">
            <span style="font-weight:600"> {{item.student_name}} </span><van-tag type="success">已打卡</van-tag>
            <h5 style="color:grey;margin-top:3px">班级：{{item.majorName}}</h5>
            <h5 style="color:grey;margin-top:3px">学号：{{item.student_number}}</h5>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import store from '../../utils/store'
import Dialog from "../../../static/vant/dialog/dialog"
// import * as echarts from '../../utils/echarts'
import mpvueEcharts from 'mpvue-echarts'
function initChart (canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  })
  canvas.setChart(chart)
  var option = {
    backgroundColor: '#ffffff',
    color: ['#37A2DA', '#32C5E9', '#67E0E3', '#91F2DE', '#FFDB5C', '#FF9F7F'],
    series: [{
      label: {
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: [0, '60%'],
      data: [{
        value: 55,
        name: '北京'
      }, {
        value: 20,
        name: '武汉'
      }, {
        value: 10,
        name: '杭州'
      }, {
        value: 20,
        name: '广州'
      }, {
        value: 38,
        name: '上海'
      }
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }]
  }
  chart.setOption(option)
  return chart
}
export default {
  components: {
    mpvueEcharts
  },
  data () {
    return {
      motto: 'Hello miniprograme',
      show:true,
      address: {},
      classData:[],
      sign_sum:0,
      no_sign_sum:0,
      sign_data:[],
      no_sign_data:[],
      majorData:[],
      studentClassData:[],
      studentClass:{},
      classTemp:{},
      classId:'',
      changeFlag:false
    }
  },

  methods: {
    echartInit (canvas, width, height) {
      return initChart(canvas, width, height)
    },
    getTeacherClass(data){
      this.$http.post({
            url:"/getItemDetail",
            data:data
        }).then(res =>{
            this.sign_sum=0
            this.no_sign_sum=0
            this.sign_data=[]
            this.no_sign_data=[]
            this.majorData=[]
            wx.showToast({
                title: res.msg, //提示的内容,
                icon: 'none', //图标,
                duration: 2000, //延迟时间,
              });
            if (res.status == 201) {
              this.classData = []
            } else {
              const temp = res.data
              const temp_major = res.major_data
              const temp_status = res.status_data
              for (let index = 0; index < temp_major.length; index++) {
                this.majorData.push({majorName:temp_major[index][0], sum: temp_major[index][1]})
              }
              for (let index = 0; index < temp_status.length; index++) {
                if (temp_status[index][0] == '0') {
                  this.no_sign_sum=temp_status[index][1]
                } else {
                  this.sign_sum=temp_status[index][1]
                }
              }
              for (let index = 0; index < temp.length; index++) {
                const d = new Date(temp[index][7])
                const d1 = new Date(temp[index][8])
                var status = false
                const time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + temp[index][7].substring(16, 25)
                const time1 = d1.getFullYear() + '-' + (d1.getMonth() + 1) + '-' + d1.getDate() + ' ' + temp[index][8].substring(16, 25)
                if (temp[index][13] == '1') {
                  status = true
                  this.sign_data.push({
                    teacher_id:temp[index][2],
                    teacher_name:temp[index][3],
                    student_id:temp[index][4],
                    student_name:temp[index][5],
                    class_id:temp[index][0],
                    class_name:temp[index][1],
                    sign_time: time, 
                    create_time: time1, 
                    startTag:temp[index][10],
                    student_number:temp[index][14],
                    majorName:temp[index][9],
                    status:status})
                } else {
                  status = false
                  this.no_sign_data.push({
                    teacher_id:temp[index][2],
                    teacher_name:temp[index][3],
                    student_id:temp[index][4],
                    student_name:temp[index][5],
                    class_id:temp[index][0],
                    class_name:temp[index][1],
                    sign_time: time, 
                    create_time: time1, 
                    student_number:temp[index][14],
                    startTag:temp[index][10],
                    majorName:temp[index][9],
                    status:status})
                }
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
      this.getTeacherClass(temp)
  }
}
</script>

<style scoped>
.wrap {
  width: 100%;

  height: 300px;
}
.aboutImg {
  width: 100%;
}
.createBtn {
  position: fixed;
  display: block;
  z-index: 99;
  top: 60%;
  right: 30px;
  width: 40px;
  height: 40px;
}
.noClassList {
  width: 90%;
  margin: 10px auto;
  background: rgb(255, 255, 255);
  padding: 5px;
  border-left: 4px rgb(250, 3, 77) solid;
  background-color: rgb(255, 235, 241);
  border-radius: 5px;
}
.ClassList {
  width: 90%;
  margin: 10px auto;
  background: rgb(255, 255, 255);
  padding: 5px;
  border-left: 4px rgb(9, 207, 241) solid;
  background-color: #ecf9ff;
  border-radius: 5px;
}
.teacherClassList {
  width: 90%;
  margin: 10px auto;
  background: rgb(255, 255, 255);
  padding: 5px;
  border-left: 4px rgb(218, 171, 17) solid;
  background-color: rgb(247, 237, 206);
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
.submitForm {
  height: 28px;
  margin: 10px 0;
  padding: 5px 10%;
  border-bottom: rgb(52, 132, 236) 1px solid;
}
</style>
