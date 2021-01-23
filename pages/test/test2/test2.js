// pages/test/test2/test2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initAudio()
    this.initRecorde()
  },
  init() {
    this.backgroundAudioManager = wx.getBackgroundAudioManager()

    this.backgroundAudioManager.title = '此时此刻'
    this.backgroundAudioManager.epname = '此时此刻'
    this.backgroundAudioManager.singer = '许巍'
    // // 设置了 src 之后会自动播放
    // backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
  },
  initRecorde() {
    this.recorderManager = wx.getRecorderManager()

    this.recorderManager.onStart(() => {
      console.log('recorder start')
    })
    this.recorderManager.onPause(() => {
      console.log('recorder pause')
    })
    this.recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      const {
        tempFilePath
      } = res
      this.setData({
        tempFilePath
      })
    })
    this.recorderManager.onFrameRecorded((res) => {
      const {
        frameBuffer
      } = res
      console.log('frameBuffer.byteLength', frameBuffer.byteLength)
    })
  },

  initAudio() {
    this.innerAudioContext = wx.createInnerAudioContext()
   
    this.innerAudioContext.onPlay(() => {
      console.log('start')
    })
    this.innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  play() {
    this.innerAudioContext && this.innerAudioContext.destroy()
    this.initAudio()
    this.innerAudioContext.src = this.data.tempFilePath
    this.innerAudioContext.play()
  },
  start() {
    this.innerAudioContext.src = 'http://m10.music.126.net/20210120230403/9ce5dc1c7fe42ed3de1e7cc837f53daa/ymusic/a9c1/47f7/e72a/eeca0e403e1aa21dc60ca590be3db3f0.mp3'
    this.innerAudioContext.play()
    const options = {
      duration: 30000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'aac',
      frameSize: 50
    }

    this.recorderManager.start(options)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  choose(){
    wx.chooseMessageFile({
      count:1,
      type:'file',
      extension: ['mp3','wav'],
      success (res) {
        const tempFilePaths = res.tempFiles
        console.log('tempFilePaths',tempFilePaths)
      }
    })
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
  onUnload: function () {

  },

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