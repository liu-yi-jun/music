// pages/my/fans/fans.js
const app = getApp()
const tool = require('../../../assets/tool/tool')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    barList: [{
      name: '我的粉丝',
    }],
    actIndex: 0,
    fans: [],
    userFanPaging: {
      pageSize: 10,
      pageIndex: 1,
      isNotData: false
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    tool.navExcludeHeight(this)
    let otherId = parseInt(options.otherId)
    this.getUserFan(otherId)
  },
  getUserFan(otherId) {
    let userFanPaging = this.data.userFanPaging
    app.get(app.Api.getUserFan, {
      userId: app.userInfo.id,
      otherId,
      ...userFanPaging
    }).then(res => {
      if (res.length < userFanPaging.pageSize) {
        this.setData({
          'userFanPaging.isNotData': true
        })
      }
      this.setData({
        fans: this.data.fans.concat(res),
        'userFanPaging.pageIndex': userFanPaging.pageIndex + 1
      })
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
  handlerGobackClick: app.handlerGobackClick,
  scrolltolower() {
    let {
      userFanPaging
    } = this.data
    if (!userFanPaging.isNotData) {
      this.getUserFan()
    }
  },
})