// components/common/playRecord/playRecord.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    voiceUrl: {
      type:String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    current: 0,
    progressBox: {}
  },
  lifetimes:{
    created() {
      this.initAudio()
    },
    detached() {
      this.endSound()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
     // 初始化
     initAudio() {
      this.innerAudioContext = wx.createInnerAudioContext()
      this.innerAudioContext.onPlay(() => {
        console.log('开始播放录音')
      })
      this.innerAudioContext.onTimeUpdate(() => {
        console.log('音频播放进度更新事件')
        let {
          duration,
          currentTime
        } = this.innerAudioContext
        console.log(duration, currentTime)
        this.drawCircle(currentTime * (2 / duration))
      })
      this.innerAudioContext.onEnded(() => {
        this.drawCircle(0)
        console.log('// 录音播放结束')
        this.setData({
          current: 0
        })
      })
      this.innerAudioContext.onPause(() => {
        console.log('onPause')
        this.setData({
          current: 0
        })
      })
    },
    // 播放
    playSound() {
      this.getProgressBoxInfo()
      // let voiceUrl = this.data.showContent.voiceUrl
      this.innerAudioContext.src = this.data.voiceUrl
      this.innerAudioContext.play()
      this.setData({
        current: 1
      })

    },
    // 暂停
    pauseSound() {
      console.log(1)
      this.innerAudioContext.pause()
    },
    // 结束
    endSound() {
      this.drawCircle(0)
      this.innerAudioContext.stop()
    },
    // 获取宽高
    getProgressBoxInfo() {
      this.createSelectorQuery().select('#progress_box').boundingClientRect(rect => {
        console.log(rect.width, rect.height)
        this.setData({
          progressBox: {
            width: rect.width,
            height: rect.height
          }
        })
      }).exec()
    },
    // 绘画
    drawCircle: function (step) {
      console.log(step)
      let {
        width,
        height
      } = this.data.progressBox
      var ctx = wx.createCanvasContext('canvasProgress', this);
      ctx.setLineWidth(width*0.018);
      ctx.setStrokeStyle('#fff');
      ctx.setLineCap('round')
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, height / 2 *0.87, -0.5 * Math.PI, (step - 0.5) * Math.PI, false);
      ctx.stroke();
      ctx.draw()
    },
   
  }
})