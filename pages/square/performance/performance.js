// pages/square/performance/performance.js
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
    alliances: [],
    festivals: [],
    liveHouse: [],
    alliancePaging: {
      pageSize: 20,
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
    },
    barList: [
      // {
      //   name: 'LiveHouse',
      // },
      // {
      //   name: '音乐节'
      // },
      {
        name: '小组活动'
      }
    ],
    actIndex: 0


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    // this.getLiveHouse()
    // this.getMusicFestival()
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
    return new Promise((resolve, reject) => {
      let alliancePaging = this.data.alliancePaging
      app.get(app.Api.getAlliance, {
        ...alliancePaging,
      }, {
        loading: false
      }).then(res => {
        if (res.length < alliancePaging.pageSize) {
          alliancePaging.isNotData = true
        }
        alliancePaging.pageIndex = alliancePaging.pageIndex + 1
        this.setData({
          alliances: this.data.alliances.concat(res),
        })
        resolve()
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
    if (app.alliancePostBack || app.allianceDeleteBack) {
      app.alliancePostBack = false
      app.allianceDeleteBack = false
      this.data.alliancePaging.isNotData = false
      this.data.alliancePaging.pageIndex = 1
      this.data.alliances = []
      this.getAlliance()
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
  },
  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    let {
      alliancePaging,
      actIndex
    } = this.data
    if (actIndex === 0) {
      alliancePaging.isNotData = false
      alliancePaging.pageIndex = 1
      this.data.alliances = []
      this.getAlliance().then(() => {
        this._freshing = false
        this.setData({
          triggered: false
        })
      })
    }

  },
  scrolltolower() {
    let {
      alliancePaging,
      festivalPaging,
      actIndex
    } = this.data
    if (actIndex === 0 && !alliancePaging.isNotData) {
      this.getAlliance()
    }
    // } else if (actIndex === 1 && !festivalPaging.isNotData) {
    //   this.getMusicFestival()
    // } else if (actIndex === 0) {
    //      this.getAlliance()
    // }
  },
  goAlliancePost() {

    wx.navigateTo({
      url: '/pages/square/performance/alliancePost/alliancePost',
    })
  },
  completeLike(commenetBarData) {
    let actIndex = this.data.actIndex
    if (actIndex === 1) {
      const mussicList = this.selectComponent('#mussicList');
      mussicList.completeLike(commenetBarData)
    } else if (actIndex === 0) {
      const LiveHouse = this.selectComponent('#LiveHouse');
      LiveHouse.completeLike(commenetBarData)

    }


  },
  completeStore(commenetBarData) {
    let actIndex = this.data.actIndex
    if (actIndex === 1) {
      const mussicList = this.selectComponent('#mussicList');
      mussicList.completeStore(commenetBarData)
    } else if (actIndex === 0) {
      const LiveHouse = this.selectComponent('#LiveHouse');
      LiveHouse.completeStore(commenetBarData)
    }
  },
  doItemDelete(data) {
    let index = parseInt(data.index)
    this.data.alliances.splice(index, 1)
    this.setData({
      alliances: this.data.alliances
    })
  },
})