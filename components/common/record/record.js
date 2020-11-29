// components/common/record/record.js
const common = require('../../../assets/tool/common')
Component({
  /**
   * 组件的属性列表
   */
  properties: {

    // 录音时长 单位s
    recordTime: {
      type: Number,
      value: 60
    },
    // 每多少毫秒渲染一次
    interval: {
      type: Number,
      value: 100
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 是否显示
    recordMaskShow: false
  },
  lifetimes:{
    created() {
      this.initRecorder()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 外部调用开始
    startRecord() {
      // 显示
      this.setData(({
        recordMaskShow: true
      }))
      const options = {
        duration: this.data.recordTime * 1000,
        format: 'mp3',
      }
      let second = 3
      let interval = setInterval(()=> {
        if(second == 0) {
          clearInterval(interval)
          common.Toast('开始录音')
          this.recorderManager.start(options)
        return
        }
        common.Toast(`${second} s`,800)
        --second
      },1000) 
       
  
    },
    // 初始化录音
    initRecorder() {
      let recorderManager = wx.getRecorderManager()
      recorderManager.onStart(() => {
        console.log('onStart')
        // 录音计数
        this.recordingCount(this.data.recordTime)
      })
      recorderManager.onPause(() => {
        this.recorderManager.stop()
      })
      recorderManager.onStop((res) => {
        console.log('onStop', res)
        common.Toast('录音结束', 1500, 'success')
        clearInterval(this.loop);
        this.drawCircle(0)
        this.triggerEvent('recordResult', {
          tempFilePath : res.tempFilePath,
          duration: Math.floor(res.duration / 1000)
        })
        this.setData({
          recordMaskShow: false
        })
      })
      this.recorderManager = recorderManager
    },
    // 录音计数
    recordingCount: function (totalTime) {
      let count = 0
      const interval = this.data.interval
      const total = totalTime * 1000 / interval
      console.log(totalTime, interval, total)
      this.loop = setInterval(() => {
        console.log(count, 'count')
        if (count < total) {
          this.drawCircle(count * (1.5 / total))
          count++;
        } else {
          this.recorderManager.stop()
        }
      }, interval)
    },
    // 画圈
    drawCircle: function (step) {
      this.createSelectorQuery().select('#progress_box').boundingClientRect(rect => {
        let width = rect.width
        let height = rect.height
        var ctx = wx.createCanvasContext('canvasProgress', this);
        ctx.setLineWidth(2);
        ctx.setStrokeStyle('#fff');
        ctx.setLineCap('round')
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, height / 2 - 4, -1.25 * Math.PI, (-1.25 + step) * Math.PI, false);
        ctx.stroke();
        ctx.draw()
      }).exec()
      console.log(step)
    },
    // 停止录音
    stopRecord(){
      this.recorderManager.stop()
    },
    // 阻止滑动遮罩时后面scroll还会滚动
    touchmove() {
      return
    }
  }
})