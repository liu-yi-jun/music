// pages/square/deal/storeDeal/storeDeal.js
const app = getApp()
const tool = require('../../../../assets/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchBtn: 'second',
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    secondPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false
    },
    ticketPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false
    },
    seconds: [],
    tickets: [],
    // 品牌，型号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.getMySeconds()
    this.getMyTickets()
  },
  completeSecondStore(commenetBarData) {
    const dynamicList = this.selectComponent('#second');
    dynamicList.completeStore(commenetBarData)
  },
  completeTicketStore(commenetBarData) {
    const dynamicList = this.selectComponent('#ticket');
    dynamicList.completeStore(commenetBarData)
  },
  getMySeconds() {
    let secondPaging = this.data.secondPaging
    app.get(app.Api.myStoreSecond, {
      ...secondPaging,
      userId: app.userInfo.id,
    }).then(res => {
      if (res.length < secondPaging.pageSize) {
        this.setData({
          'secondPaging.isNotData': true
        })
      }
      let seconds = this.data.seconds
      if(seconds.length === 1) {
        seconds = [...seconds[0]]
      } else if(seconds.length === 2) {
        seconds = [...seconds[0], ...seconds[1]]
      }
      seconds = seconds.concat(res)
      seconds = tool.arraySplit(seconds, 0, 2)
      this.setData({
        seconds,
        'secondPaging.pageIndex': secondPaging.pageIndex + 1
      })
    })
  },
  getMyTickets() {
    let ticketPaging = this.data.ticketPaging
    app.get(app.Api.myStoreTicket, {
      ...ticketPaging,
      userId: app.userInfo.id,
    }).then(res => {
      if (res.length < ticketPaging.pageSize) {
        this.setData({
          'ticketPaging.isNotData': true
        })
      }
      this.setData({
        tickets: this.data.tickets.concat(res),
        'ticketPaging.pageIndex': ticketPaging.pageIndex + 1
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
  scrolltolower() {
    let {
      secondPaging,
      ticketPaging,
      switchBtn
    } = this.data
    if (switchBtn === 'second' && !secondPaging.isNotData) {
      this.getMySeconds()
    } else if (switchBtn === 'ticket' && !ticketPaging.isNotData) {
      this.getMyTickets()
    }
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