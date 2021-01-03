// pages/my/privateLetter/privateLetter.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
// const io = require('../../../assets/tool/weapp.socket.io')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    to: {},
    messages: [],
    myId: 0,
    footer: '',
    keyBoardHeight: 0,
    first: true,
    message: '',
    formH: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.onKeyboardHeightChange(res => {
      this.keyBoardChange(res.height)
    })
    let to = JSON.parse(options.to)
    this.setData({
      to,
      myId: app.userInfo.id
    })
    console.log(options.otherId)
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.setMessages(to.userId)
    this.WhachMessage()
  },
  getFormH() {
    const query = wx.createSelectorQuery();
    query.select('#form').boundingClientRect();
    query.exec(res => {
      let formH = parseInt(res[0].height);
      this.setData({
        formH
      })
    })
  },
  keyBoardChange(height) {
    this.getFormH()
    
    if (this.data.first) {
      this.setData({
        first: false
      })
    } else {
      let keyBoardHeight = height
      this.setData({
        keyBoardHeight
      },()=> {
        // this.getFormH()
      })
      if (keyBoardHeight === 0) {
        this.setData({
          keyBoardHeight
        },()=> {
          setTimeout(()=> {
        
          },300)
         
        })
      }
    }
  },
  WhachMessage() {
    let userId = this.data.to.userId
    app.onMessage('privateMessage', (from, to, message) => {
      console.log('成功')
      if (from.userId === userId) {
        let messages = this.data.messages
        messages.push({
          fromId: from.userId,
          toId: to.userId,
          message
        })
        this.setData({
          messages,
          footer: `message${messages.length-1}`
        })
      }
    })
  },

  setMessages(userId) {
    let threas = wx.getStorageSync('threas')
    let messages = threas ? (threas[userId] ? threas[userId].messages : []) : []
    this.setData({
      messages,
      footer: `message${messages.length-1}`
    })
  },
  getValue(e) {
    clearTimeout(this.point)
    this.point = setTimeout(() => {
      this.setData({
        message: e.detail.value
      })
    }, 100)
  },
  formSubmit(e) {
    let message = this.data.message
    let to = this.data.to
    let from = {
      userId: app.userInfo.id,
      avatarUrl: app.userInfo.avatarUrl,
      nickName: app.userInfo.nickName
    }
    app.socket.emit("message", from, to, message);
    // 设置data.messages
    let messages = this.data.messages
    messages.push({
      fromId: from.userId,
      toId: to.userId,
      message
    })
    this.setData({
      messages,
      footer: `message${messages.length-1}`
    })
    // 设置Storage 》》messages
    let threas = wx.getStorageSync('threas')
    if (!threas) {
      threas = {}
    }
    if (!threas[to.userId]) {
      threas[to.userId] = {
        userId: to.userId,
        avatarUrl: to.avatarUrl,
        nickName: to.nickName,
        messages: [],
        newNum: 0,
        lastMessage: ''
      }
    }
    threas[to.userId].lastMessage = message
    threas[to.userId].messages.push({
      fromId: from.userId,
      toId: to.userId,
      message
    })
    wx.setStorage({
      data: threas,
      key: 'threas',
    })
  },

  //获取聚焦(软键盘弹出)
  focus: function(e) {
    this.getFormH()
    this.setData({
      footer:this.data.footer
    })
  },

  //失去聚焦(软键盘消失)
  blur: function(e) {
    // this.setData({
    //   footer:this.data.footer
    // })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getFormH()
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
    app.offMessage('privateMessage')
    let threas = wx.getStorageSync('threas')
    let userId = this.data.to.userId
    if (threas && threas[userId]) threas[userId].newNum = 0
    wx.setStorage({
      data: threas,
      key: 'threas',
    })
    // 获取当前页面栈
    let pages = getCurrentPages();
    // 最后一个元素为当前页面,-1 为当前页面的数据 ,-2 为你上一页的数据 
    let prevPage = pages[pages.length - 2];
    console.log(prevPage, userId)
    prevPage.setData({
      [`userMessage.${userId}.newNum`]: 0
    })
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