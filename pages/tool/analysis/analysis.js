// pages/tool/analysis/analysis.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    analysis:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initrecorderManager()
    this.initSocket()
  },
  onUnload: function () {
    this.stop()
  },
  initSocket() {
    app.socket.on('completeAnalysis', (data) => {
      console.log(data)
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
      if(!this.isStop){
        console.log('开始新一轮录音')
        this.start()
      }
   

    })
    this.recorderManager.onFrameRecorded((res) => {
      let Array = new Int16Array(res.frameBuffer)
      let newArray
      if (Array.length >= 800) {
        // 切
        newArray = Array.subarray(0, 800)
      } else {
        // 加
        newArray = this.concatenate(Int8Array, Array, new Int8Array(800 - Array.length))
      }
      let endArry = []
      newArray.forEach(element => {
        endArry.push(element)
      })
      this.analysis(endArry)
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
      duration: 10000, //指定录音采样时间100ms
      sampleRate: 8000, //采样率最低8k
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 32000, //8k采样率对应16k~48k
      format: 'pcm', //音频格式，有效值acc/mp3/wav/pcm
      // frameSize: 3.2,          //指定帧大小，单位KB
      frameSize: 0.8, //指定帧大小，单位KB
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