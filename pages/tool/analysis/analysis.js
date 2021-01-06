// pages/tool/analysis/analysis.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    analysis: {},
    line: 440,
    spots: [],
    // 圆位于哪里上下波动 width/1.5 
    // 越大距离左边越近
    seat: 1.3,
    // 小球半径
    radius: 4,
    // 轨迹点的密集程度（值越大越稀疏）
    dense: 130,
    // 轨迹点最多的数量
    pointCount: 8,
    // 整体颜色
    color: '#FF5791',
    letter: 'D#',
    // 返回的音调与基础音调的误差
    disparity: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.can = true
    this.initrecorderManager()
    this.initSocket()
    wx.createSelectorQuery()
      .select('#canvas')
      .fields({
        node: true,
        size: true,
      })
      .exec(this.initCanvas.bind(this))
    this.start()
  },
  // 在电脑上1px 就是1物理像素,那么就不用加dpr转化了

  // 1px 在苹果678 中 等于 2物理像素 ， 所以dpr = 2/1 = 2
  // 1px 在苹果678plus 中 等于 3物理像素 ， 所以dpr = 3/1 = 3

  // 元素style w = 300px, h = 300px
  // 苹果678 w = 600物理像素, h = 600物理像素 
  // 苹果678plus  w = 900物理像素, h = 900物理像素 

  // canvas本身 默认是w = 300， h = 150
  // 改为
  // canvas本身 默认是w = 300， h = 300
  // 再改为
  // 苹果678 w = 600物理像素, h = 600物理像素 
  // 苹果678plus w = 900物理像素, h = 900物理像素 

  // 绘画时按设置的来300px 300px
  // 那么就要对绘制的图形进行缩放,使它在不同设备能够正常像素

  // 总结:可以将画布上的像素认为是物理像素
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
  drawBall(frequency) {
    let width = this.width
    let height = this.height
    let ctx = this.ctx
    let {
      seat,
      radius,
      line
    } = this.data
    let y = (frequency * (height - 2 * radius)) / (2 * line)
    ctx.beginPath();
    ctx.arc(width / seat, height - radius - y, radius, 0, Math.PI * 2);
    // ctx.shadowBlur = 5;
    // ctx.shadowColor = "white";
    ctx.fillStyle = "white"
    ctx.strokeStyle = "white"
    ctx.fill();
    ctx.stroke();
  },
  drawTrajectory(frequency) {
    let ctx = this.ctx
    let width = this.width
    let height = this.height
    let {
      spots,
      radius,
      seat,
      line,
      dense,
      pointCount
    } = this.data
    let y = (frequency * (height - 2 * radius)) / (2 * line)
    ctx.beginPath();
    ctx.lineWidth = 3;
    // ctx.shadowBlur = 5;
    // ctx.shadowColor = "white";
    var gradient = ctx.createLinearGradient(0, 0, width / seat, 0);
    gradient.addColorStop(0, 'rgba(255,255,255,0)');
    gradient.addColorStop(1, "white");
    ctx.strokeStyle = gradient;
    ctx.moveTo(width / seat, height - radius - y);
    for (var i = 0; i < spots.length - 1; i++) {
      var x_mid = (spots[i].x + spots[i + 1].x) / 2;
      var y_mid = (spots[i].y + spots[i + 1].y) / 2;
      var cp_x1 = (x_mid + spots[i].x) / 2;
      var cp_x2 = (x_mid + spots[i + 1].x) / 2;
      ctx.quadraticCurveTo(cp_x1, spots[i].y, x_mid, y_mid);
      ctx.quadraticCurveTo(cp_x2, spots[i + 1].y, spots[i + 1].x, spots[i + 1].y);
    }
    ctx.stroke();
    spots.forEach((item, index) => {
      item.x = item.x - dense
    })
    spots.unshift({
      x: width / seat,
      y: height - radius - y,
    })
    if (spots.length > pointCount) {
      spots.pop()
    }
  },
  motionBall(frequency) {
    let ctx = this.ctx
    let canvas = this.canvas
    let line = this.data.line
    if (frequency >= line * 2) {
      frequency = line * 2
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawLine()
    this.drawBall(frequency)
    this.drawTrajectory(frequency)
  },
  onUnload: function () {
    this.stop()
  },
  initSocket() {
    app.socket.on('completeAnalysis', (data) => {
      let disparity = this.data.disparity
      let line = this.data.line
      console.log(data)
      if (this.can) {
        this.can = false
        setTimeout(() => {
          this.can = true
          let color
          if (Math.abs(data.frequency - line) <= disparity) {
            color = '#3DDB62'
          } else {
            color = '#FF5791'
          }
          if (color !== this.data.color) {
            this.setData({
              color
            }, () => {
              this.motionBall(data.frequency)
            })
          } else {
            this.motionBall(data.frequency)
          }
          let analysis = data
          analysis.pitchFirst = data.pitch.charAt(0)
          analysis.pitchTwo = data.pitch.charAt(1)
          this.setData({
            analysis
          })
        }, 100)
      }
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
      console.log(res.frameBuffer)
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
    app.socket.emit('analysis', endArry);
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // onLoad: function (options) {
  //   this.initrecorderManager()
  //   this.initSocket()
  //   this.initCanvas()
  //   this.start()
  // },
  // initCanvas() {
  //   // const width = res[0].width
  //   // const height = res[0].height
  //   // const canvas = res[0].node
  //   // const ctx = canvas.getContext('2d')
  //   // const dpr = wx.getSystemInfoSync().pixelRatio
  //   // canvas.width = width * dpr
  //   // canvas.height = height * dpr
  //   // ctx.scale(dpr, dpr)
  //   const ctx = wx.createCanvasContext('canvas')
  //   console.log(ctx)
  //   this.width = 300
  //   this.height = 300
  //   // this.canvas = canvas
  //   this.ctx = ctx
  // },
  // drawLine() {
  //   let width = this.width
  //   let height = this.height
  //   let ctx = this.ctx
  //   let color = this.data.color
  //   ctx.beginPath();
  //   ctx.strokeStyle = color;
  //   ctx.lineWidth = 1;
  //   ctx.moveTo(0, height / 2);
  //   ctx.lineTo(width, height / 2);
  //   ctx.stroke();
  // },
  // drawBall(frequency) {
  //   let width = this.width
  //   let height = this.height
  //   let ctx = this.ctx
  //   let {
  //     seat,
  //     radius,
  //     line
  //   } = this.data
  //   let y = (frequency * (height - 2 * radius)) / (2 * line)
  //   ctx.beginPath();
  //   ctx.arc(width / seat, height - radius - y, radius, 0, Math.PI * 2);
  //   ctx.shadowBlur = 5;
  //   ctx.shadowColor = "white";
  //   ctx.fillStyle = "white"
  //   ctx.strokeStyle = "white"
  //   ctx.fill();
  //   ctx.stroke();
  // },
  // drawTrajectory(frequency) {
  //   let ctx = this.ctx
  //   let width = this.width
  //   let height = this.height
  //   let {
  //     spots,
  //     radius,
  //     seat,
  //     line,
  //     dense,
  //     pointCount
  //   } = this.data
  //   let y = (frequency * (height - 2 * radius)) / (2 * line)
  //   ctx.beginPath();
  //   ctx.lineWidth = 3;
  //   ctx.shadowBlur = 5;
  //   ctx.shadowColor = "white";
  //   var gradient = ctx.createLinearGradient(0, 0, width / seat, 0);
  //   gradient.addColorStop(0, 'rgba(255,255,255,0)');
  //   gradient.addColorStop(1, "white");
  //   ctx.strokeStyle = gradient;
  //   ctx.moveTo(width / seat, height - radius - y);
  //   for (var i = 0; i < spots.length - 1; i++) {
  //     var x_mid = (spots[i].x + spots[i + 1].x) / 2;
  //     var y_mid = (spots[i].y + spots[i + 1].y) / 2;
  //     var cp_x1 = (x_mid + spots[i].x) / 2;
  //     var cp_x2 = (x_mid + spots[i + 1].x) / 2;
  //     ctx.quadraticCurveTo(cp_x1, spots[i].y, x_mid, y_mid);
  //     ctx.quadraticCurveTo(cp_x2, spots[i + 1].y, spots[i + 1].x, spots[i + 1].y);
  //   }
  //   ctx.stroke();
  //   spots.forEach((item, index) => {
  //     item.x = item.x - dense
  //   })
  //   spots.unshift({
  //     x: width / seat,
  //     y: height - radius - y,
  //   })
  //   if (spots.length > pointCount) {
  //     spots.pop()
  //   }
  // },
  // motionBall(frequency) {
  //   let ctx = this.ctx
  //   let line = this.data.line
  //   if (frequency >= line * 2) {
  //     frequency = line * 2
  //   }
  //   ctx.clearRect(0, 0, this.width, this.height);
  //   this.drawLine()
  //   this.drawBall(frequency)
  //   this.drawTrajectory(frequency)
  // },
  // drawLine() {
  //   let width = this.width
  //   let height = this.height
  //   let ctx = this.ctx
  //   let color = this.data.color
  //   ctx.beginPath();
  //   ctx.strokeStyle = color;
  //   ctx.lineWidth = 1;
  //   ctx.moveTo(0, height / 2);
  //   ctx.lineTo(width, height / 2);
  //   ctx.stroke();
  // },
  // drawBall(frequency) {
  //   let width = this.width
  //   let height = this.height
  //   let ctx = this.ctx
  //   let {
  //     seat,
  //     radius,
  //     line
  //   } = this.data
  //   let y = (frequency * (height - 2 * radius)) / (2 * line)
  //   ctx.beginPath();
  //   ctx.arc(width / seat, height - radius - y, radius, 0, Math.PI * 2);
  //   ctx.shadowBlur = 5;
  //   ctx.shadowColor = "white";
  //   ctx.fillStyle = "white"
  //   ctx.strokeStyle = "white"
  //   ctx.fill();
  //   ctx.stroke();
  // },
  // drawTrajectory(frequency) {
  //   let ctx = this.ctx
  //   let width = this.width
  //   let height = this.height
  //   let {
  //     spots,
  //     radius,
  //     seat,
  //     line,
  //     dense,
  //     pointCount
  //   } = this.data
  //   let y = (frequency * (height - 2 * radius)) / (2 * line)
  //   ctx.beginPath();
  //   ctx.lineWidth = 3;
  //   ctx.shadowBlur = 5;
  //   ctx.shadowColor = "white";
  //   var gradient = ctx.createLinearGradient(0, 0, width / seat, 0);
  //   gradient.addColorStop(0, 'rgba(255,255,255,0)');
  //   gradient.addColorStop(1, "white");
  //   ctx.strokeStyle = gradient;
  //   ctx.moveTo(width / seat, height - radius - y);
  //   for (var i = 0; i < spots.length - 1; i++) {
  //     var x_mid = (spots[i].x + spots[i + 1].x) / 2;
  //     var y_mid = (spots[i].y + spots[i + 1].y) / 2;
  //     var cp_x1 = (x_mid + spots[i].x) / 2;
  //     var cp_x2 = (x_mid + spots[i + 1].x) / 2;
  //     ctx.quadraticCurveTo(cp_x1, spots[i].y, x_mid, y_mid);
  //     ctx.quadraticCurveTo(cp_x2, spots[i + 1].y, spots[i + 1].x, spots[i + 1].y);
  //   }
  //   ctx.stroke();
  //   spots.forEach((item, index) => {
  //     item.x = item.x - dense
  //   })
  //   spots.unshift({
  //     x: width / seat,
  //     y: height - radius - y,
  //   })
  //   if (spots.length > pointCount) {
  //     spots.pop()
  //   }
  // },
  // motionBall(frequency) {
  //   let ctx = this.ctx
  //   let canvas = this.canvas
  //   let line = this.data.line
  //   if (frequency >= line * 2) {
  //     frequency = line * 2
  //   }
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   this.drawLine()
  //   this.drawBall(frequency)
  //   this.drawTrajectory(frequency)
  // },
})