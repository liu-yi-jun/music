// pages/home/welcome/welcome.js

let app = getApp()
const common = require('../../../assets/tool/common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var scene = decodeURIComponent(options.scene);
    let groupId = scene.split("=")[1]
    this.simpleGroupInfo(groupId)
    this.initLogin()
  },
  simpleGroupInfo(groupId) {
    app.get(app.Api.simpleGroupInfo, {
      groupId
    }).then(res => {
      this.setData({
        groupInfo: res
      })
      console.log(res);
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  into() {
    if (app.userInfo) {

      console.log('进入');
      this.joinGroup()
    } else {
      this.setData({
        dialogShow: true
      })
    }

  },
  joinGroup() {
    let groupInfo = this.data.groupInfo
    return new Promise((resolve, reject) => {
      app.post(app.Api.simpleJoinGroup, {
        groupId: groupInfo.id,
        groupName: groupInfo.groupName,
        userId: app.userInfo.id
      }).then(res => {
        common.Tip(`恭喜您成功加入${groupInfo.groupName}`, '提示', '确认').then(res => {
          wx.reLaunch({
            url: '/pages/home/home'
          })
        })

      }).catch(err => reject(err))
    })

  },
  initLogin() {
    let token = wx.getStorageSync('wx-token')
    if (token) {
      wx.checkSession({
        success: () => {
          this.getServerUserInfo()
        },
        fail: () => {
          this.login()
        }
      })
    } else {
      this.login()
    }
  },
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          App.getToken(res.code).then(() => {
            this.getServerUserInfo()
            resolve()
          })
        },
        fail: err => reject(err)
      })
    })
  },
  getServerUserInfo() {
    app.get(app.Api.getServerUserInfo, {}, {
      loading: false
    }).then(res => {
      if (res.userInfo) {
        // 有用户信息，存入app
        app.userInfo = res.userInfo
      } else {
        // 没有用户信息等待用户授权
      }

    })
  },
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

  }
})