// pages/square/performance/performance.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchBtn: 'LiveHouse',
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    alliances: [],
    festivals: [],
    liveHouse: [],
    alliancePaging: {
      pageSize: 10,
      pageIndex: 1,
      isNotData: false
    },
    festivalPaging: {
      pageSize: 10,
      pageIndex: 1,
      isNotData: false
    },
    livehousePaging: {
      pageSize: 10,
      pageIndex: 1,
      isNotData: false
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.getLiveHouse()
    this.getMusicFestival()
    this.getAlliance()
  
   
  },
  getLiveHouse() {
    let livehousePaging = this.data.livehousePaging
    app.get(app.Api.getLiveHouse, {
      ...livehousePaging,
      userId: app.userInfo.id
    }).then(res => {
      if (res.length < livehousePaging.pageSize) {
        this.setData({
          'livehousePaging.isNotData': true
        })
      }
      this.setData({
        liveHouse: this.data.liveHouse.concat(res),
        'livehousePaging.pageIndex': livehousePaging.pageIndex + 1
      })
    })
  },
  getMusicFestival() {
    let festivalPaging = this.data.festivalPaging
    app.get(app.Api.getFestival, {
      ...festivalPaging,
      userId: app.userInfo.id
    }, {
      loading: false
    }).then(res => {
      if (res.length < festivalPaging.pageSize) {
        this.setData({
          'festivalPaging.isNotData': true
        })
      }
      this.setData({
        festivals: this.data.festivals.concat(res),
        'festivalPaging.pageIndex': festivalPaging.pageIndex + 1
      })
    })
  },
  getAlliance() {
    let alliancePaging = this.data.alliancePaging
    app.get(app.Api.getAlliance, {
      ...alliancePaging,
    }, {
      loading: false
    }).then(res => {
      if (res.length < alliancePaging.pageSize) {
        this.setData({
          'alliancePaging.isNotData': true
        })
      }
      this.setData({
        alliances: this.data.alliances.concat(res),
        'alliancePaging.pageIndex': alliancePaging.pageIndex + 1
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
    if (app.alliancePostBack) {
      app.alliancePostBack = false
      this.setData({
        alliances: [],
        'alliancePaging.isNotData': false,
        'alliancePaging.pageIndex': 1
      }, () => {
        this.getAlliance()
      })
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
  scrolltolower() {
    let {
      alliancePaging,
      festivalPaging,
      switchBtn
    } = this.data
    if (switchBtn === 'advance' && !alliancePaging.isNotData) {
      this.getAlliance()
    } else if (switchBtn === 'mussic' && !festivalPaging.isNotData) {
      this.getMusicFestival()
    } else if (switchBtn === 'LiveHouse') {
      this.getLiveHouse()
    }
  },
  goAlliancePost() {

    wx.navigateTo({
      url: '/pages/square/performance/alliancePost/alliancePost',
    })
  },
  completeLike(commenetBarData) {
    let switchBtn = this.data.switchBtn
    if (switchBtn === 'mussic') {
      const mussicList = this.selectComponent('#mussicList');
      mussicList.completeLike(commenetBarData)
    } else if (switchBtn === 'LiveHouse') {


    }


  },
  completeStore(commenetBarData) {
    let switchBtn = this.data.switchBtn
    if (switchBtn === 'mussic') {
      const mussicList = this.selectComponent('#mussicList');
      mussicList.completeStore(commenetBarData)
    } else if (switchBtn === 'LiveHouse') {

    }
  },
})