// pages/my/song/song.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    songPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false,
    },
    songs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.getMyStoreSong()
    wx.onBackgroundAudioStop(() => {
      let songs = this.data.songs
      songs[this.oldIndex].isPlay = false
      this.setData({
        songs
      })
    })
  },
  playSong(e) {
    let index = e.currentTarget.dataset.index
    let songs = this.data.songs
    let songUrl = songs[index].songUrl
    let oldIndex = this.oldIndex
    if (oldIndex === undefined) {
      this.oldIndex = index
      songs[index].isPlay = true
      wx.playBackgroundAudio({
        dataUrl: songUrl
      });
      this.setData({
        songs
      })
      return
    }
    if (oldIndex === index) {
      console.log(11111111111111111)
      if (songs[oldIndex].isPlay) {
        songs[oldIndex].isPlay = false
        wx.stopBackgroundAudio()
      } else {
        songs[oldIndex].isPlay = true
        wx.playBackgroundAudio({
          dataUrl: songUrl,
        });
      }
    } else {
      console.log('songs',songs)
      if (songs[oldIndex].isPlay) {
        songs[oldIndex].isPlay = false
        // wx.stopBackgroundAudio()
      }
      console.log('oldIndex',this.oldIndex,'index',index )
      this.oldIndex = index
      songs[index].isPlay = true
      console.log('songs',songs)
      wx.playBackgroundAudio({
        dataUrl: songUrl,
      });
    }
    this.setData({
      songs
    })

  },
  getMyStoreSong() {
    let songPaging = this.data.songPaging
    app.get(app.Api.getMyStoreSong, {
      userId: app.userInfo.id,
      ...songPaging
    }).then(res => {
      if (res.length < songPaging.pageSize) {
        this.setData({
          'songPaging.isNotData': true
        })
      }
      this.setData({
        songs: this.data.songs.concat(res),
        'songPaging.pageIndex': songPaging.pageIndex + 1
      })
    })
  },
  scrolltolower() {
    if (!this.data.songPaging.isNotData) {
      this.getMyStoreSong()
    }
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

  },
  handlerGobackClick: app.handlerGobackClick
})