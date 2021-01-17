// components/tool/analysis/analysis.js
let oldCent = -50
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    v0: 0.025,
    a: 0.3,
    oldCent: -50,
    analysis: {},
    line: 440,
    // -50--+50
    centRange: 100,
    spots: [],
    // 圆位于哪里上下波动 width/1.5 
    // 越大距离左边越近
    seat: 1.55,
    // 小球半径
    radius: 5,
    // 轨迹点的密集程度（值越大越稀疏）
    dense: 4,
    // 轨迹点最多的数量
    pointCount: 100,
    // 整体颜色
    color: '#FF5791',
    letter: 'D#',
    // 返回的音调与基础音调的误差
    disparity: 2,
    standard: [{
        name: 'E2',
        frequency: 82.41
      },
      {
        name: 'A2',
        frequency: 110
      },
      {
        name: 'D3',
        frequency: 146.83
      },
      {
        name: 'G3',
        frequency: 196
      },
      {
        name: 'B3',
        frequency: 246.95
      }, {
        name: 'E4',
        frequency: 329.64
      }
    ],
    // 当前校验的下标
    standardCurrent: 0,
    // 是否自动
    isAuto: true,
    // 玄的之前的宽度 logo移动的范围 / 5
    stringWidt: 0,
    logoTranslateX: 0,
    circleCenterX: 0,
    circleCenterY: 0,
    box: {
      // 矩形
      rectW: 31,
      rectH: 21,
      rectR: 3,
      // 三角形
      tH: 8,
      tD: 3
    }
  },
  lifetimes: {
    created: function () {
      this.can = true
      this.canPonit = true
      this.initrecorderManager()
      this.initSocket()
      this.initCentBox()
      this.start()

    },
    ready: function () {
      this.initStringWidt()
      wx.createSelectorQuery().in(this)
        .select('#canvas')
        .fields({
          node: true,
          size: true,
        })
        .exec(this.initCanvas.bind(this))
    },

    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      this.stop()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initCentBox() {
      // canvas绘制网络图片需保存至本地
      wx.getImageInfo({
        src: 'http://cdn.eigene.cn/analysis/dialogRed.png', //服务器返回的图片地址，需加入downloadFile白名单
        success: res => {
          console.log('initCentBox', res)
          this.redCentBoxPath = res.path
        },
      });
      wx.getImageInfo({
        src: 'http://cdn.eigene.cn/analysis/dialogGreen.png', //服务器返回的图片地址，需加入downloadFile白名单
        success: res => {
          this.GreenCentBoxPath = res.path
        },
      });
    },
    initStringWidt() {
      let query = wx.createSelectorQuery().in(this)
      let standard = this.data.standard
      query.select('#column').boundingClientRect(rect => {
        this.setData({
          stringWidt: rect.width / (standard.length - 1)
        })
      }).exec();
    },
    initCanvas(res) {
      const width = res[0].width
      const height = res[0].height
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')
      const dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
      this.width = width
      this.height = height
      this.canvas = canvas
      this.ctx = ctx
      console.log(ctx)
      // this.setData({

      // })
      // this.test()
    },
    drawCentBox(oldCent) {
      let width = this.width
      let height = this.height
      let ctx = this.ctx
      let {
        seat,
        radius,
        centRange,
        box,
        color,
        analysis
      } = this.data
      let y = ((oldCent + centRange / 2) * (height - 2 * radius)) / centRange
      let circleCenterX = width / seat
      let circleCenterY = height - radius - y

      let A = {
        x: circleCenterX,
        y: circleCenterY - (radius * 2)
      }
      let B = {
        x: A.x - box.tD,
        y: A.y - box.tH
      }
      let C = {
        x: A.x + box.tD,
        y: A.y - box.tH
      }

      let E1 = {
        x: A.x - box.rectW / 2,
        y: A.y - box.tH
      }
      let p1 = {
        x: A.x - box.rectW / 2 + box.rectR,
        y: A.y - box.tH
      }
      let p2 = {
        x: A.x - box.rectW / 2,
        y: A.y - box.tH - box.rectR
      }
      let E2 = {
        x: A.x - box.rectW / 2,
        y: A.y - box.tH - box.rectH
      }
      let p3 = {
        x: A.x - box.rectW / 2,
        y: A.y - box.tH - box.rectH + box.rectR
      }
      let p4 = {
        x: A.x - box.rectW / 2 + box.rectR,
        y: A.y - box.tH - box.rectH
      }
      let E3 = {
        x: A.x + box.rectW / 2,
        y: A.y - box.tH - box.rectH
      }
      let p5 = {
        x: A.x + box.rectW / 2 - box.rectR,
        y: A.y - box.tH - box.rectH
      }
      let p6 = {
        x: A.x + box.rectW / 2,
        y: A.y - box.tH - box.rectH + box.rectR
      }
      let E4 = {
        x: A.x + box.rectW / 2,
        y: A.y - box.tH
      }
      let p7 = {
        x: A.x + box.rectW / 2,
        y: A.y - box.tH - box.rectR
      }
      let p8 = {
        x: A.x + box.rectW / 2 - box.rectR,
        y: A.y - box.tH
      }
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      ctx.fillStyle = color
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.arcTo(E1.x, E1.y, p2.x, p2.y, box.rectR)
      ctx.lineTo(p3.x, p3.y);
      ctx.arcTo(E2.x, E2.y, p4.x, p4.y, box.rectR)
      ctx.lineTo(p5.x, p5.y);
      ctx.arcTo(E3.x, E3.y, p6.x, p6.y, box.rectR)
      ctx.lineTo(p7.x, p7.y);
      ctx.arcTo(E4.x, E4.y, p8.x, p8.y, box.rectR)
      ctx.lineTo(C.x, C.y);
      ctx.closePath();
      ctx.fill()
      ctx.stroke();
      if (analysis.cent) {
        // 画字体
        ctx.font = "12px";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white"
        ctx.fillText(analysis.cent, A.x, A.y - box.tH - box.rectH / 2);
      }

    },
    drawLine() {
      let width = this.width
      let height = this.height
      let ctx = this.ctx
      let color = this.data.color
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    },
    drawBall(oldCent) {
      let width = this.width
      let height = this.height
      let ctx = this.ctx
      let {
        seat,
        radius,
        centRange
      } = this.data
      let y = ((oldCent + centRange / 2) * (height - 2 * radius)) / centRange
      ctx.beginPath();
      ctx.arc(width / seat, height - radius - y, radius, 0, Math.PI * 2);
      // ctx.shadowBlur = 5;
      // ctx.shadowColor = "white";
      ctx.fillStyle = "white"
      ctx.strokeStyle = "white"
      ctx.fill();
      ctx.stroke();
      // this.setData({
      //   circleCenterX: width / seat,
      //   circleCenterY: height - radius - y
      // })
    },
    drawTrajectory(oldCent, newCent) {
      let ctx = this.ctx
      let width = this.width
      let height = this.height
      let {
        spots,
        radius,
        seat,
        dense,
        pointCount,
        centRange
      } = this.data
      let y = ((oldCent + centRange / 2) * (height - 2 * radius)) / centRange
      ctx.beginPath();
      ctx.lineWidth = 3;
      // ctx.shadowBlur = 5;
      // ctx.shadowColor = "white";
      var gradient = ctx.createLinearGradient(0, 0, width / seat, 0);
      gradient.addColorStop(0, 'rgba(255,255,255,0)');
      gradient.addColorStop(1, "white");
      ctx.strokeStyle = gradient;
      // ctx.moveTo(width / seat, height - radius - y);
      spots.unshift({
        x: width / seat,
        y: height - radius - y,
      })
      if (spots.length >= 3) {
        ctx.moveTo(spots[0].x, spots[0].y);
        let i
        for (i = 1; i < spots.length - 2; i++) {
          var xc = (spots[i].x + spots[i + 1].x) / 2;
          var yc = (spots[i].y + spots[i + 1].y) / 2;
          ctx.quadraticCurveTo(spots[i].x, spots[i].y, xc, yc);
        }
        ctx.quadraticCurveTo(spots[i].x, spots[i].y, spots[i + 1].x, spots[i + 1].y);
        ctx.stroke();
      }

      // for (var i = 0; i < spots.length - 1; i++) {
      //   var x_mid = (spots[i].x + spots[i + 1].x) / 2;
      //   var y_mid = (spots[i].y + spots[i + 1].y) / 2;
      //   var cp_x1 = (x_mid + spots[i].x) / 2;
      //   var cp_x2 = (x_mid + spots[i + 1].x) / 2;
      //   ctx.quadraticCurveTo(cp_x1, spots[i].y, x_mid, y_mid);
      //   ctx.quadraticCurveTo(cp_x2, spots[i + 1].y, spots[i + 1].x, spots[i + 1].y);
      // }
      // ctx.stroke();
      if (spots.length > pointCount) {
        spots.pop()
      }
      spots.forEach((item, index) => {
        item.x = item.x - dense
      })
      // if (spots.length == 0) {
      //   spots.push({
      //     x: width / seat,
      //     y: height - radius - y,
      //   })
      // } else {
      // if (oldCent === newCent || (newCent - oldCent > 10 && newCent - oldCent < 20)) {
      // console.log('关键点')
      // if (this.canPonit) {
      //   this.canPonit = false
      //   setTimeout(() => {
      //     // 关键的点
      //     spots.splice(1, 0, {
      //       x: width / seat,
      //       y: height - radius - y,
      //     })
      //     if (spots.length > pointCount) {
      //       spots.pop()
      //     }
      //     this.canPonit = true
      //   }, 200)
      // }


      // }
      // spots[0] = {
      //   x: width / seat,
      //   y: height - radius - y,
      // }
      // }
    },
    motionBall(oldCent, newCent) {
      let ctx = this.ctx
      let canvas = this.canvas
      // let line = this.data.line
      // if (frequency >= line * 2) {
      //   frequency = line * 2
      // }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawLine()
      this.drawBall(oldCent)
      this.drawCentBox(oldCent)
      this.drawTrajectory(oldCent, newCent)
      // setTimeout(()=>{

      // },200)
    },
    initSocket() {
      // app.socket.on('completeAnalysis', (data) => {
      // })
    },
    initSocket() {
      app.socket.on('completeAnalysis2', (data) => {
        if (this.can) {
          console.log(data)
          this.can = false
          this.v0 = this.data.v0
          // 拐点渲染次数
          this.inflection = 1
          console.log(data)
          if (data.cent > 50) {
            data.cent = 50
          }
          this.baseCent = this.data.oldCent
          if (data.cent > this.data.oldCent) {
            this.direction = 'up'
            this.realizationPainting(data)
            console.log('向上')
          } else if (data.cent < this.data.oldCent) {
            this.direction = 'down'
            this.realizationPainting(data)
            console.log('向下')
          } else {
            this.can = true
          }
        }
      })
    },
    // test() {
    //   oldCent++
    //   console.log(oldCent)
    //   this.motionBall(oldCent)

    //   this.point = this.canvas.requestAnimationFrame(this.test.bind(this))

    //   if (oldCent >= 100) {
    //     this.canvas.cancelAnimationFrame(this.point)
    //   }
    // },
    realizationPainting(data) {
      console.log('realizationPainting')
      let color;
      let analysis = data
      let disparity = this.data.disparity
      let line = this.data.line


      analysis.pitchFirst = data.pitch ? data.pitch.charAt(0) : ''
      analysis.pitchTwo = data.pitch ? data.pitch.charAt(1) : ''
      if (this.direction == 'up') {
        this.data.oldCent = (this.data.oldCent + this.v0 >= data.cent) ? data.cent : (this.data.oldCent + this.v0)

      } else {
        this.data.oldCent = (this.data.oldCent - this.v0 <= data.cent) ? data.cent : (this.data.oldCent - this.v0)
      }
      if (Math.abs(data.frequency - line) <= disparity && Math.abs(this.data.oldCent) <= 5) {
        color = '#3DDB62'
      } else {
        color = '#FF5791'
      }
      if (color !== this.data.color) {
        this.setData({
          color
        })
        this.motionBall(this.data.oldCent, data.cent)
      } else {
        this.motionBall(this.data.oldCent, data.cent)
      }
      // 校准哪一个 + logo位置
      this.calibration(data.frequency)
      if (this.direction == 'up') {
        if (data.cent <= this.data.oldCent) {
          if (this.inflection && this.data.oldCent === data.cent) {
            // 是拐点让它继续咨询inflection次
            this.inflection--
          } else {
            this.setData({
              analysis
            })
            this.canvas.cancelAnimationFrame(this.point)
            this.can = true
            return
          }

        }
      } else {
        if (data.cent >= this.data.oldCent) {
          if (this.inflection && this.data.oldCent === data.cent) {
            // 是拐点让它继续咨询inflection次
            this.inflection--
          } else {
            this.setData({
              analysis
            })
            this.canvas.cancelAnimationFrame(this.point)
            this.can = true
            return
          }
        }
      }
      if (this.data.oldCent - this.baseCent >= (data.cent - this.baseCent) / 2) {
        if (this.direction == 'up') {
          this.v0 = (this.v0 - this.data.a <= 2) ? 2 : this.v0 - this.data.a
        } else {
          this.v0 = this.v0 + this.data.a
        }
      } else {
        if (this.direction == 'up') {
          this.v0 = this.v0 + this.data.a
        } else {
          this.v0 = (this.v0 - this.data.a <= 2) ? 2 : this.v0 - this.data.a
        }
      }

      this.point = this.canvas.requestAnimationFrame(this.realizationPainting.bind(this, data))
    },
    calibration(frequency) {
      let {
        isAuto,
        standardCurrent,
        standard,
        stringWidt
      } = this.data
      let logoTranslateX = 0
      if (frequency >= standard[standard.length - 1].frequency) {
        standardCurrent = standard.length - 1
        logoTranslateX = stringWidt * (standard.length - 1) + 8
      } else if (frequency >= standard[4].frequency) {
        standardCurrent = ((frequency - standard[4].frequency) - (standard[standard.length - 1].frequency - frequency) > 0) ? standard.length - 1 : 4
        logoTranslateX = (stringWidt * 4) + stringWidt * (frequency - standard[4].frequency) / (standard[standard.length - 1].frequency - standard[4].frequency)
      } else if (frequency >= standard[3].frequency) {
        standardCurrent = ((frequency - standard[3].frequency) - (standard[4].frequency - frequency) > 0) ? 4 : 3
        logoTranslateX = (stringWidt * 3) + stringWidt * (frequency - standard[3].frequency) / (standard[4].frequency - standard[3].frequency)
      } else if (frequency >= standard[2].frequency) {
        standardCurrent = ((frequency - standard[2].frequency) - (standard[3].frequency - frequency) > 0) ? 3 : 2
        logoTranslateX = (stringWidt * 2) + stringWidt * (frequency - standard[2].frequency) / (standard[3].frequency - standard[2].frequency)
      } else if (frequency >= standard[1].frequency) {
        standardCurrent = ((frequency - standard[1].frequency) - (standard[2].frequency - frequency) > 0) ? 2 : 1
        logoTranslateX = (stringWidt * 1) + stringWidt * (frequency - standard[1].frequency) / (standard[2].frequency - standard[1].frequency)
      } else if (frequency >= standard[0].frequency) {
        standardCurrent = ((frequency - standard[0].frequency) - (standard[1].frequency - frequency) > 0) ? 1 : 0
        logoTranslateX = (stringWidt * 0) + stringWidt * (frequency - standard[0].frequency) / (standard[1].frequency - standard[0].frequency)
      } else {
        standardCurrent = 0
        logoTranslateX = -8
      }
      if (isAuto) {
        this.setData({
          standardCurrent,
          line: this.data.standard[standardCurrent].frequency,
          logoTranslateX
        })
      } else {
        this.setData({
          logoTranslateX
        })
      }
    },
    changeAuto() {
      this.setData({
        isAuto: !this.data.isAuto,
        standardCurrent: -1
      })
    },
    initrecorderManager() {
      this.recorderManager = wx.getRecorderManager()
      this.innerAudioContext = wx.createInnerAudioContext()
      this.innerAudioContext.onPlay(() => {
        console.log('开始播放录音')
      })
      this.innerAudioContext.onEnded(() => {
        console.log('// 录音播放结束')
      })
      this.recorderManager.onError((err) => {
        console.log(err, '// 录音失败的回调处理');
      });
      this.recorderManager.onStart(() => {
        console.log('// 录音开始')
      })
      this.recorderManager.onStop((res) => {
        console.log('// 录音结束')
        const tempFilePath = res.tempFilePath
        this.innerAudioContext.src = tempFilePath
        if (!this.isStop) {
          console.log('开始新一轮录音')
          this.start()
        }
      })
      this.recorderManager.onFrameRecorded((res) => {
        // console.log(res.frameBuffer)
        let array = new Int16Array(res.frameBuffer)
        // window
        // if (array.length >= 800) {
        //   // 切
        //   array = array.subarray(0, 800)
        // } else {
        //   // 加
        //   array = this.concatenate(Int16Array, array, new Int16Array(800 - array.length))
        // }
        this.analysis(Array.prototype.slice.call(array))
      })
    },

    analysis(endArry) {
      app.socket.emit('analysis2', endArry);
    },
    concatenate(resultConstructor, ...arrays) {
      let totalLength = 0;
      for (let arr of arrays) {
        totalLength += arr.length;
      }
      let result = new resultConstructor(totalLength);
      let offset = 0;
      for (let arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
      }
      return result;
    },

    stop() {
      this.recorderManager.stop()
      this.isStop = true
    },

    start() {
      this.isStop = false
      const options = {
        duration: 600000, //指定录音采样时间100ms
        sampleRate: 8000, //采样率最低8k
        numberOfChannels: 1, //录音通道数
        encodeBitRate: 32000, //8k采样率对应16k~48k
        format: 'pcm', //音频格式，有效值acc/mp3/wav/pcm
        // frameSize: 3.2,          //指定帧大小，单位KB
        frameSize: 1.6, //指定帧大小，单位KB
        // frameSize: 0.8, //指定帧大小，单位KB
        audioSource: 'auto',
      };

      this.recorderManager.start(options)

    },
    string(e) {
      if (!this.data.isAuto) {
        let index = e.currentTarget.dataset.index
        this.setData({
          standardCurrent: index,
          line: this.data.standard[index].frequency
        })
      }
    },
  }
})