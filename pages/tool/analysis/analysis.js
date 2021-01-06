// pages/tool/analysis/analysis.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    analysis: {},
    line: 440,
    spots: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initrecorderManager()
    this.initSocket()
    wx.createSelectorQuery()
      .select('#canvas')
      .fields({
        node: true,
        size: true,
      })
      .exec(this.init.bind(this))
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
  init(res) {
    // 解决不同设备中一致性
    const width = res[0].width
    const height = res[0].height
    const canvas = res[0].node
    console.log(canvas)
    const ctx = canvas.getContext('2d')
    const dpr = wx.getSystemInfoSync().pixelRatio
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)


    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    // 绘制球
    ctx.arc(width / 1.5, height - 10, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'red'
    // ctx.lineWidth = 1;
    // 	填充当前绘图（路径）。
    ctx.fill();
    // 绘制已定义的路径。
    ctx.stroke();
    this.drawLine(ctx, width, height)
    this.ctx = ctx
    this.width = width
    this.height = height
    this.canvas = canvas
  },
  drawLine(ctx, width, height) {
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  },
  motionBall(frequency, ctx, width, height, canvas) {
    if(frequency >= this.data.line * 2) {
      frequency = this.data.line * 2
    }
    console.log('画')
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    let line = this.data.line
    this.drawLine(ctx, width, height)
    ctx.beginPath();
    // // 圆心
    let y = (frequency * (height - 2 * 10)) / (2 * line)
    console.log('y', y)
    ctx.arc(width / 1.5, height - 10 - y, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'red'
    ctx.fill();
    // // 绘制已定义的路径。
    ctx.stroke();
    ctx.beginPath();

    let spots = this.data.spots
    // 第一种方式
    ctx.moveTo(width / 1.5, height - 10 - y);
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
      item.x = item.x - 20
    })
    spots.unshift({
      x: width / 1.5,
      y: height - 10 - y,
    })
    if (spots.length > 100) {
      spots.pop()
    }
  },

  onUnload: function () {
    this.stop()
  },
  initSocket() {
    app.socket.on('completeAnalysis', (data) => {
      console.log(data)
      this.motionBall(data.frequency, this.ctx, this.width, this.height, this.canvas)
      this.setData({
        analysis: data
      })
    })
  },
  initrecorderManager() {
    console.log(1)
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
  play() {
    console.log('播放')
    this.innerAudioContext.play()
  },
  stop() {
    this.recorderManager.stop()
    this.isStop = true
  },
  pause() {
    this.recorderManager.pause()
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})