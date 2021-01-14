// pages/square/deal/deal.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
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
    tickets: [],
    doubleSeconds: [
      [],
      []
    ],
    // 品牌，型号
    // 二手商品搜索关键词
    brand: '',
    // 票务搜索关键词
    title: ''
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
    let secondPaging = this.data.secondPaging
    app.get(app.Api.searchSeconds, {
      ...secondPaging,
      userId: app.userInfo.id,
      brand
    }).then(res => {
      if (res.length < secondPaging.pageSize) {
        this.setData({
          'secondPaging.isNotData': true
        })
      }
      // let seconds = this.data.seconds
      // if(seconds.length === 1) {
      //   seconds = [...seconds[0]]
      // } else if(seconds.length === 2) {
      //   seconds = [...seconds[0], ...seconds[1]]
      // }
      // seconds = seconds.concat(res)
      // seconds = tool.arraySplit(seconds, 0, 2)

      let doubleSeconds = this.data.doubleSeconds

      res.forEach(item => {
        if (doubleSeconds[0].length > doubleSeconds[1].length) {
          doubleSeconds[1].push(item)
        } else {
          doubleSeconds[0].push(item)
        }
      })

      this.setData({
        doubleSeconds,
        'secondPaging.pageIndex': secondPaging.pageIndex + 1
      })
    })
  },
  searchTickets(title) {
    let ticketPaging = this.data.ticketPaging
    app.get(app.Api.searchTickets, {
      ...ticketPaging,
      userId: app.userInfo.id,
      title
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
  confirm(event) {
    let value = event.detail.value
    let switchBtn = this.data.switchBtn
    if (switchBtn === 'second') {
      this.setData({
        doubleSeconds: [[],[]],
        brand: value,
        'secondPaging.isNotData': false,
        'secondPaging.pageIndex': 1
      }, () => this.searchSeconds(this.data.brand))
    } else if (switchBtn === 'ticket') {
      this.setData({
        tickets: [],
        title: value,
        'ticketPaging.isNotData': false,
        'ticketPaging.pageIndex': 1
      }, () => this.searchTickets(this.data.title))

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
    if (app.secondIssueBack) {
      app.secondIssueBack = false
      this.setData({
        doubleSeconds: [[],[]],
        brand: '',
        'secondPaging.isNotData': false,
        'secondPaging.pageIndex': 1
      }, () => this.searchSeconds(this.data.brand))

    }
    if (app.ticketIssueBack) {
      app.ticketIssueBack = false
      this.setData({
        tickets: [],
        title: '',
        'ticketPaging.isNotData': false,
        'ticketPaging.pageIndex': 1
      }, () => {
        this.searchTickets(this.data.title)
      })
    }
  },
  scrolltolower() {
    console.log(this.data.band)
    let {
      secondPaging,
      ticketPaging,
      switchBtn
    } = this.data
    if (switchBtn === 'second' && !secondPaging.isNotData) {
      this.searchSeconds(this.data.brand)
    } else if (switchBtn === 'ticket' && !ticketPaging.isNotData) {
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
    const switchBtn = e.currentTarget.dataset.switchbtn
    if (switchBtn === this.switchBtn) return
    this.setData({
      switchBtn
    })
  },
  storeDeal() {
    wx.navigateTo({
      url: '/pages/square/deal/storeDeal/storeDeal',
    })
  }
})