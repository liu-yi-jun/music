// pages/my/fansFollow/fnasFollow.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchBtn: 'fans',
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    userFollowPaging: {
      pageSize: 10,
      pageIndex: 1,
      isNotData: false
    },
    userFanPaging: {
      pageSize: 10,
      pageIndex: 1,
      isNotData: false
    },
    follows: [],
    fans: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let otherId = parseInt(option.otherId)
    if (option.flag) {
      this.setData({
        switchBtn: option.flag
      })
    }
    this.setData({
      isMy: otherId === app.userInfo.id
    })
    this.getUserFollow(otherId)
    this.getUserFan(otherId)
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
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
  scrolltolower() {
    let {
      userFollowPaging,
      userFanPaging,
      switchBtn
    } = this.data
    if (switchBtn === 'follow' && !userFollowPaging.isNotData) {
      this.getUserFollow()
    } else if (switchBtn === 'fans' && !userFanPaging.isNotData) {
      this.getUserFan()
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
  handlerGobackClick: app.handlerGobackClick,
  //切换btn 
  switchBtn(e) {
    const switchBtn = e.currentTarget.dataset.switchbtn
    if (switchBtn === this.switchBtn) return
    this.setData({
      switchBtn
    })
  }
})