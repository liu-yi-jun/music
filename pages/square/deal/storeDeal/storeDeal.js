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
    doubleSeconds: [
      [],
      []
    ],
    tickets: [],
    // 品牌，型号
    barList: [{
      name: '二手器乐',
    },
    {
      name: '票务转让'
    },
  ],
  actIndex: 0
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
      console.log(res)
      if (res.length < secondPaging.pageSize) {
        this.setData({
          'secondPaging.isNotData': true
        })
      }
      let doubleSeconds = this.data.doubleSeconds

      res.forEach(item => {
        if (doubleSeconds[0].length > doubleSeconds[1].length) {
          doubleSeconds[1].push(item)
        } else {
          doubleSeconds[0].push(item)
        }
      })
      // let seconds = this.data.seconds
      // if(seconds.length === 1) {
      //   seconds = [...seconds[0]]
      // } else if(seconds.length === 2) {
      //   seconds = [...seconds[0], ...seconds[1]]
      // }
      // seconds = seconds.concat(res)
      // seconds = tool.arraySplit(seconds, 0, 2)
      this.setData({
        doubleSeconds,
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
    if (app.secondDeleteBack) {
      this.setData({
        doubleSeconds: [
          [],
          []
        ],
        brand: '',
        'secondPaging.isNotData': false,
        'secondPaging.pageIndex': 1
      }, () => this.getMySeconds())
    }
    if (app.ticketDeleteBack) {
      this.setData({
        tickets: [],
        title: '',
        'ticketPaging.isNotData': false,
        'ticketPaging.pageIndex': 1
      }, () => {
        this.getMyTickets()
      })
    }
  },
  scrolltolower() {
    let {
      secondPaging,
      ticketPaging,
      actIndex
    } = this.data
    if (actIndex === 0 && !secondPaging.isNotData) {
      this.getMySeconds()
    } else if (actIndex === 1 && !ticketPaging.isNotData) {
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
    let actIndex = e.detail.actIndex
    if (actIndex === this.data.actIndex) return
    this.setData({
      actIndex
    })
  }
})