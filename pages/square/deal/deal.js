// pages/square/deal/deal.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    secondPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false
    },
    ticketPaging: {
      pageSize: 3,
      pageIndex: 1,
      isNotData: false
    },
    tickets: [],
    doubleSeconds: [
      [],
      []
    ],
    // 品牌，型号
    // 二手商品搜索关键词
    brand: '',
    // 票务搜索关键词
    title: '',
    barList: [{
        name: '二手器乐',
      },
      {
        name: '票务转让'
      },
    ],
    actIndex: 0,
    tempValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.searchSeconds(this.data.brand)
    this.searchTickets(this.data.title)
  },
  searchSeconds(brand) {
    return new Promise((resolve, reject) => {
      let secondPaging = this.data.secondPaging
      app.get(app.Api.searchSeconds, {
        ...secondPaging,
        userId: app.userInfo.id,
        brand
      }).then(res => {
        if (res.length < secondPaging.pageSize) {
          secondPaging.isNotData = true
        }
        let doubleSeconds = this.data.doubleSeconds
        res.forEach(item => {
          if (doubleSeconds[0].length > doubleSeconds[1].length) {
            doubleSeconds[1].push(item)
          } else {
            doubleSeconds[0].push(item)
          }
        })
        secondPaging.pageIndex = secondPaging.pageIndex + 1
        this.setData({
          doubleSeconds
        })
        resolve()
      })
    })

  },
  searchTickets(title) {
    return new Promise((resolve, reject) => {
      let ticketPaging = this.data.ticketPaging
      app.get(app.Api.searchTickets, {
        ...ticketPaging,
        userId: app.userInfo.id,
        title
      }).then(res => {
        if (res.length < ticketPaging.pageSize) {
          ticketPaging.isNotData = true
        }
        ticketPaging.pageIndex = ticketPaging.pageIndex + 1
        this.setData({
          tickets: this.data.tickets.concat(res),
        })
        resolve()
      })
    })
  },
  searchInput(event) {
    this.setData({
      tempValue: event.detail.value,
    })
  },
  confirm(event) {
    let value = event.detail.value
    let actIndex = this.data.actIndex
    if (actIndex === 0) {
      let secondPaging = this.data.secondPaging
      secondPaging.isNotData = false
      secondPaging.pageIndex = 1
      this.data.doubleSeconds = [
        [],
        []
      ]
      this.data.brand = value ? value : this.data.tempValue
      this.searchSeconds(this.data.brand)
    } else if (actIndex === 1) {
      let ticketPaging = this.data.ticketPaging
      ticketPaging.isNotData = false
      ticketPaging.pageIndex = 1
      this.data.tickets = []
      this.data.title = value ? value : this.data.tempValue
      this.searchTickets(this.data.title)
    }
  },
  completeSecondStore(commenetBarData) {
    const dynamicList = this.selectComponent('#second');
    dynamicList.completeStore(commenetBarData)
  },
  completeTicketStore(commenetBarData) {
    const dynamicList = this.selectComponent('#ticket');
    dynamicList.completeStore(commenetBarData)
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
    if (app.secondIssueBack || app.secondDeleteBack) {
      app.secondIssueBack = false
      app.secondDeleteBack = false
      let secondPaging = this.data.secondPaging
      secondPaging.isNotData = false
      secondPaging.pageIndex = 1
      this.data.doubleSeconds = [
        [],
        []
      ]
      this.data.brand = ''
      this.searchSeconds(this.data.brand)
    }
    if (app.ticketIssueBack || app.ticketDeleteBack) {
      app.ticketIssueBack = false
      app.ticketDeleteBack = false
      let ticketPaging = this.data.ticketPaging
      ticketPaging.isNotData = false
      ticketPaging.pageIndex = 1
      this.data.tickets = []
      this.data.title = ''
      this.searchTickets(this.data.title)
    }
  },
  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    let {
      secondPaging,
      ticketPaging,
      actIndex
    } = this.data
    if (actIndex === 0) {
      secondPaging.isNotData = false
      secondPaging.pageIndex = 1
      this.data.doubleSeconds = [
        [],
        []
      ]
      this.searchSeconds(this.data.brand).then(() => {
        this._freshing = false
        this.setData({
          triggered: false
        })
      })
    } else if (actIndex === 1) {
      ticketPaging.isNotData = false
      ticketPaging.pageIndex = 1
      this.data.tickets = []
      this.searchTickets(this.data.title).then(() => {
        this._freshing = false
        this.setData({
          triggered: false
        })
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
      this.searchSeconds(this.data.brand)
    } else if (actIndex === 1 && !ticketPaging.isNotData) {
      this.searchTickets(this.data.title)
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
      actIndex,
      tempValue: '',
      groupName: ''
    })
  },
  storeDeal() {
    wx.navigateTo({
      url: '/pages/square/deal/storeDeal/storeDeal',
    })
  },
  goSecondIssue() {
    wx.navigateTo({
      url: '/pages/square/deal/secondIssue/secondIssue',
    })
  },
  goTicketIssue() {
    wx.navigateTo({
      url: '/pages/square/deal/ticketIssue/ticketIssue',
    })
  }
})