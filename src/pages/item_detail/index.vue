<template>
  <div>
    <div class="wrap" v-if="chart">
      <mpvue-echarts :echarts="echarts" :onInit="ecBarInit" canvasId="bar" />
    </div>
    <div class="wrap" v-if="chart1">
      <mpvue-echarts :echarts="echarts" :onInit="ecBarInit1" canvasId="scatter" />
    </div>
    <div style="margin-bottom:10%">
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
import * as echarts from 'echarts/dist/echarts.min'
import mpvueEcharts from 'mpvue-echarts'
let barChart, scatterChart,tmp
function getBarOption (sign_sum,no_sign_sum) {
  return {
    color: ['rgb(9, 207, 241)', 'rgb(250, 3, 77)'],
    title: {
        text: '打卡统计',
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}'
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['已打卡', '未打卡']
    },
    series: [
        {
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [{value: sign_sum, name: '已打卡'},
                {value: no_sign_sum, name: '未打卡'}],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
    // tooltip: {
    //     trigger: 'item',
    //     formatter: '{b}: {c} '
    // },
    // legend: {
    //     orient: 'vertical',
    //     left: 10,
    //     data: ['已打卡', '未打卡']
    // },
    // series: [
    //     {
    //         name: '打卡数据',
    //         type: 'pie',
    //         radius: ['50%', '70%'],
    //         avoidLabelOverlap: false,
    //         label: {
    //             show: false,
    //             position: 'center'
    //         },
    //         emphasis: {
    //             label: {
    //                 show: true,
    //                 fontSize: '30',
    //                 fontWeight: 'bold'
    //             }
    //         },
    //         labelLine: {
    //             show: false
    //         },
    //         data: [
    //             {value: sign_sum, name: '已打卡'},
    //             {value: no_sign_sum, name: '未打卡'}
    //         ]
    //     }
    // ]
  }
}

function getBarOption1 (nameList,data) {
  return {
    color: ['#000080', '#FF9F7F', '#ff0080', '#C9C9C9', '#E066FF', '#C0FF3E','red'],
    tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} '
    },
    title: {
        text: '专业统计',
        left: 'center'
    },
    legend: {
        orient: 'vertical',
        left: 10,
        data: nameList
    },
    series: [
        {
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            type: 'pie',
            radius: ['50%', '70%'],
            data: data
        }
    ]
  }
}
export default {
  components: {
    mpvueEcharts
  },
  onShareAppMessage () {},
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
      majorData:[{name:'无',value:1}],
      majorName:['无'],
      studentClassData:[],
      studentClass:{},
      classTemp:{},
      classId:'',
      changeFlag:false,
      echarts,
      chart:false,
      chart1:false
    }
  },
  
  methods: {
    ecBarInit(canvas, width, height) {
        barChart = echarts.init(canvas, null, {
          width: width,
          height: height
        })
        canvas.setChart(barChart)
        barChart.setOption(getBarOption(this.sign_sum,this.no_sign_sum))
        return barChart
      },
      ecBarInit1(canvas, width, height) {
        scatterChart = echarts.init(canvas, null, {
          width: width,
          height: height
        })
        canvas.setChart(scatterChart)
        scatterChart.setOption(getBarOption1(this.majorName,this.majorData))
        return scatterChart
      },
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
            this.majorName=[]
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
                this.majorData.push({name:temp_major[index][0], value: temp_major[index][1]})
                this.majorName.push(temp_major[index][0])
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
              this.chart=true
              this.chart1=true
            }
        })
    },
  },

  onShow(){
    this.role=store.state.role
    var role = store.state.role
    this.sign_sum=0
    this.no_sign_sum=0
    this.sign_data=[]
    this.no_sign_data=[]
    this.majorData=[]
    this.majorName=[]
    this.chart=false
    this.chart1=false
    this.getTeacherClass(tmp)
  },
  onHide(){
    this.sign_sum=0
    this.no_sign_sum=0
    this.sign_data=[]
    this.no_sign_data=[]
    this.majorData=[]
    this.majorName=[]
    this.chart=false
    this.chart1=false
  },
  // test.js
  onLoad(options) {
      var temp=JSON.parse(options.obj)
      tmp=temp
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
