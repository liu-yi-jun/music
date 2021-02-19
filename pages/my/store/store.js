// pages/my/store/store.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    courses: [],
    alliances: [],
    dynamics: [],
    coursePaging: {
      pageSize: 10,
      pageIndex: 1,
      isNotData: false
    },
    alliancePaging: {
      pageSize: 10,
      pageIndex: 1,
      isNotData: false
    },
    dynamicPaging: {
      pageSize: 10,
      pageIndex: 1,
      isNotData: false
    },
    barList: [{
        name: '动态',
      },
      {
        name: '课程'
      },
      {
        name: '联盟活动'
      },
      {
        name: '演出咨讯'
      }
    ],
    actIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyStoreCourse()
    this.getmyStoreAlliance()
    this.getMyStoreDynamic()
  },
  // 获取分页动态信息
  getMyStoreDynamic() {
    let dynamicPaging = this.data.dynamicPaging
    app.get(app.Api.myStoreDynamic, {
      userId: app.userInfo.id,
      ...dynamicPaging
    }).then(res => {
      if (res.length < dynamicPaging.pageSize) {
        this.setData({
          'dynamicPaging.isNotData': true
        })
      }
      this.setData({
        dynamics: this.data.dynamics.concat(res),
        'dynamicPaging.pageIndex': dynamicPaging.pageIndex + 1
      })
    })
  },
  // 获取分页联盟信息
  getmyStoreAlliance() {
    let alliancePaging = this.data.alliancePaging
    app.get(app.Api.myStoreAlliance, {
      userId: app.userInfo.id,
      ...alliancePaging
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
  // 获取分页课程信息
  getMyStoreCourse() {
    let coursePaging = this.data.coursePaging
    app.get(app.Api.myStoreCourse, {
      userId: app.userInfo.id,
      ...coursePaging
    }).then(res => {
      if (res.length < coursePaging.pageSize) {
        this.setData({
          'coursePaging.isNotData': true
        })
      }
      this.setData({
        courses: this.data.courses.concat(res),
        'coursePaging.pageIndex': coursePaging.pageIndex + 1
      })
    })
  },
  scrolltolower() {
    let {
      coursePaging,
      alliancePaging,
      dynamicPaging,
      actIndex
    } = this.data
    if (actIndex === 0 && !dynamicPaging.isNotData) {
      this.getMyStoreDynamic()
    } else if (actIndex === 1 && !coursePaging.isNotData) {
      this.getMyStoreCourse()
    } else if (actIndex === 2 && !alliancePaging.isNotData) {
      this.getmyStoreAlliance()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
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
  completeLike(commenetBarData) {
    const dynamicList = this.selectComponent('#dynamicList');
    dynamicList.completeLike(commenetBarData)

  },
  completeStore(commenetBarData) {
    const dynamicList = this.selectComponent('#dynamicList');
    dynamicList.completeStore(commenetBarData)
  },

  //切换btn 
  switchBtn(e) {
    let actIndex = e.detail.actIndex
    if (actIndex === this.data.actIndex) return
    this.setData({
      actIndex
    })
  }
})