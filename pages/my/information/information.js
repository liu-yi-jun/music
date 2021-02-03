// pages/my/information/information.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    switchBtn: 'system',
    informPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false
    },
    systemPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false
    },
    informs: [],
    systems: [],
    userMessage: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    // this.getInform()
    // this.getSystem()
    // // 获取消息数据
    // this.getThreas()
    // this.WhachMessage()
  },
  // 监听数据，更新视图
  WhachMessage() {
    app.onMessage('userMessage', (from, to, message) => {
      let userMessage = this.data.userMessage
      if (!userMessage[from.userId]) {
        userMessage[from.userId] = {
          userId: from.userId,
          avatarUrl: from.avatarUrl,
          nickName: from.nickName,
          lastMessage: '',
          newNum: 0
        }
      }
      console.log('userMessage', from.userId, userMessage)
      userMessage[from.userId].lastMessage = tool.cutstr(message, 20)
      userMessage[from.userId].newNum++
      this.setData({
        userMessage
      })
    })
  },
  // 获取消息数据
  getThreas() {
    let threas = wx.getStorageSync('threas')
    let userMessage = {}
    for (let key in threas) {
      userMessage[key] = {
        userId: threas[key].userId,
        avatarUrl: threas[key].avatarUrl,
        nickName: threas[key].nickName,
        lastMessage: tool.cutstr(threas[key].lastMessage, 20),
        newNum: threas[key].newNum
      }
    }
    this.setData({
      userMessage
    })
  },
  getSystem() {
    let systemPaging = this.data.systemPaging
    app.get(app.Api.getSystem, {
      userId: app.userInfo.id,
      ...systemPaging
    }).then(res => {
      if (res.length < systemPaging.pageSize) {
        this.setData({
          'systemPaging.isNotData': true
        })
      }
      this.setData({
        systems: this.data.systems.concat(res),
        'systemPaging.pageIndex': systemPaging.pageIndex + 1
      })
    })
  },
  getInform() {
    let informPaging = this.data.informPaging
    app.get(app.Api.getInform, {
      userId: app.userInfo.id,
      ...informPaging
    }).then(res => {
      if (res.length < informPaging.pageSize) {
        this.setData({
          'informPaging.isNotData': true
        })
      }
      this.setData({
        informs: this.data.informs.concat(res),
        'informPaging.pageIndex': informPaging.pageIndex + 1
      })
      console.log(res)
    })
  },
  scrolltolower() {
    let {
      informPaging,
      systemPaging,
      switchBtn
    } = this.data
    if (switchBtn === 'inform' && !informPaging.isNotData) {
      this.getInform()
    } else if (switchBtn === 'system' && !systemPaging.isNotData) {
      this.getSystem()
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
    app.offMessage('userMessage')
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
  },
  completeLike(commenetBarData) {},
  completeStore(commenetBarData) {}
})