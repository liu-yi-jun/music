// pages/my/my.js
let app = getApp()
const common = require('../../assets/tool/common')
const upload = require('../../assets/request/upload')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 控制右下角三角show
    tabBarBtnShow: false,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  // 设置用户信息
  setUserInfo() {
    this.setData({
      userInfo: app.userInfo
    })
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
      // app.getNotice(this, app.userInfo.id)
    }
    this.setUserInfo()
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
  // 控制bar栏
  tap() {
    // this.setData({
    //   tabBarBtnShow: true
    // })
    // this.getTabBar().setData({
    //   show: false
    // })
  },
  goSong() {
    wx.navigateTo({
      url: '/pages/my/song/song',
    })
  },
  goEditData() {
    wx.navigateTo({
      url: '/pages/my/editData/editData',
    })
  },
  gofollowMass(e) {
    wx.navigateTo({
      url: `/pages/my/followMass/followMass`,
    })
  },
  goInvitation() {
    let userId = app.userInfo.id
    wx.navigateTo({
      url: `/pages/my/invitation/invitation?userId=${userId}`,
    })
  },
  goStore() {
    wx.navigateTo({
      url: '/pages/my/store/store',
    })
  },
  goInformation() {
    wx.navigateTo({
      url: '/pages/my/information/information',
    })
  },
  goSong() {
    wx.navigateTo({
      url: '/pages/my/song/song',
    })
  },
  previewImage() {
    common.previewImage([app.userInfo.avatarUrl])
  },
  async changeImg(e) {
     let Mymark = e.mark.Mymark
     if(Mymark) return
    try {
      let {
        tempFilePaths
      } = await common.chooseImage(1)
      common.showLoading('更换中')
      let bgWalls = await this.uploadImg(tempFilePaths)
      let result = await this.changeBgWall(bgWalls[0])
      console.log(tempFilePaths, bgWalls, result)
      app.userInfo.bgWall = bgWalls[0]
      this.setData({
        userInfo: app.userInfo
      })
      common.Toast('更换成功')
    } catch (err) {
      common.Toast(err)
      wx.hideLoading()
    }
  },
  uploadImg(tempImgParhs) {
    return new Promise((resolve, reject) => {
      let option = {
          userId: app.userInfo.id,
          type: 'image',
          module: 'users'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadManyImg(app.Api.uploadImg, tempImgParhs, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  changeBgWall(bgWall) {
    return new Promise((resolve, reject) => {
      let userId = app.userInfo.id
      app.post(app.Api.changeBgWall, {
        userId,
        bgWall
      }, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  }
})