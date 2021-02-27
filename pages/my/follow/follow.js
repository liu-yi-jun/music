// pages/my/follow/follow.js
const app = getApp()
const tool = require('../../../assets/tool/tool')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    barList: [{
      name: '关注的用户',
    }],
    actIndex: 0,
    follows: [],
    userFollowPaging: {
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
    this.getUserFollow(otherId)
  },
  getUserFollow(otherId) {
    let userFollowPaging = this.data.userFollowPaging
    app.get(app.Api.getUserFollow, {
      userId: app.userInfo.id,
      otherId,
      ...userFollowPaging
    }).then(res => {
      if (res.length < userFollowPaging.pageSize) {
        this.setData({
          'userFollowPaging.isNotData': true
        })
      }
      this.setData({
        follows: this.data.follows.concat(res),
        'userFollowPaging.pageIndex': userFollowPaging.pageIndex + 1
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
      userFollowPaging,
    } = this.data
    if (!userFollowPaging.isNotData) {
      this.getUserFollow()
    }
  },
})