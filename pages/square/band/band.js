// pages/square/band/band.js
let common = require('../../../assets/tool/common')
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    qiniuUrl: app.qiniuUrl,
    excludeHeight: 0,
    bands: [],
    barList: [{
        name: '乐队瞬间',
      },
      {
        name: '一起组乐队',
      }
    ],
    actIndex: 0,
    triggered: false,
    bandPagin: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false,
      minID: 0
    },
    momentPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false,
      minID: 0
    },
    doubleMoment: [
      [],
      []
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.getBands()
    this.getMoment()
  },
  // 获取分页乐队瞬间
  getMoment() {
    return new Promise((resolve, reject) => {
      let momentPaging = this.data.momentPaging
      app.get(app.Api.getMoment, {
        ...momentPaging,
        userId: app.userInfo.id
      }).then(res => {
        if (res.length < momentPaging.pageSize) {
          momentPaging.isNotData = true
        }
        let doubleMoment = this.data.doubleMoment
        res.forEach(item => {
          if (doubleMoment[0].length > doubleMoment[1].length) {
            doubleMoment[1].push(item)
          } else {
            doubleMoment[0].push(item)
          }
        })
        momentPaging.minID = res.length ? res[res.length - 1].id : 0
        this.setData({
          doubleMoment
        })
        resolve()
      })
    })
  },
  // 获取分页组队信息
  getBands() {
    let bandPagin = this.data.bandPagin
    return new Promise((resolve, reject) => {
      app.get(app.Api.getBands, {
        ...bandPagin
      }, {
        loading: false
      }).then(res => {
        console.log(res)
        if (res.length < bandPagin.pageSize) {
          bandPagin.isNotData = true
        }
        bandPagin.minID = res.length ? res[res.length - 1].id : 0
        this.setData({
          bands: this.data.bands.concat(res),
        })
      })
      resolve()
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
    let {
      bandPagin,
      momentPaging
    } = this.data
    if (app.bandBack || app.bandDeleteBack) {
      app.bandBack = false
      app.bandDeleteBack = false
      bandPagin.pageIndex = 1
      bandPagin.minID = 0
      bandPagin.isNotData = false
      this.data.bands = []
      this.getBands()
    }
    if (app.momentBack || app.momentDeleteBack) {
      app.momentBack = false
      app.momentDeleteBack = false
      momentPaging.pageIndex = 1
      momentPaging.minID = 0
      momentPaging.isNotData = false
      this.data.doubleMoment = [
        [],
        []
      ]
      this.getMoment()
    }
  },
  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    let {
      bandPagin,
      momentPaging,
      actIndex
    } = this.data
    if (actIndex === 0) {
      momentPaging.isNotData = false
      momentPaging.minID = 0
      momentPaging.pageIndex = 1
      this.data.doubleMoment = [
        [],
        []
      ]
      this.getMoment().then(() => {
        this._freshing = false
        this.setData({
          triggered: false
        })
      })
    } else if (actIndex === 1) {
      bandPagin.isNotData = false
      bandPagin.pageIndex = 1
      bandPagin.minID = 0
      this.data.bands = []
      this.getBands().then(() => {
        this._freshing = false
        this.setData({
          triggered: false
        })
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
  scrolltolower() {
    let {
      bandPagin,
      momentPaging,
      actIndex
    } = this.data
    if (!momentPaging.isNotData && actIndex === 0) {
      this.getMoment()
    } else if (!bandPagin.isNotData && actIndex === 1) {
      this.getBands()
    }
  },
  toIssueMoment() {
    common.chooseVideo(['album', 'camera']).then(res => {
      let tempFilePath = JSON.stringify(res.tempFilePath)
      wx.navigateTo({
        url: `/pages/square/band/IssueMoment/IssueMoment?tempFilePath=${tempFilePath}`,
      })
    })
  },
  toIssueTeam() {
    wx.navigateTo({
      url: '/pages/square/band/issueTeam/issueTeam',
    })
  },
  switchBtn(e) {
    let actIndex = e.detail.actIndex
    if (this.data.actIndex === actIndex) {
      return
    }
    this.setData({
      actIndex
    })
  },
})