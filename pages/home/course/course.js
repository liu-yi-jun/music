// pages/home/course/course.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
const common = require('../../../assets/tool/common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    coursePaging: {
      pageSize: 3,
      pageIndex: 1,
      isNotData: false,
      minID: 0
    },
    courses: [],
    // 是否是自己的小组
    isMyGroup: false,
    groupDuty: 0,
    triggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showGroupId = options.showGroupId
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    let isMyGroup = options.showGroupId == app.userInfo.groupId
    this.getCourses().then(() => {
      if (!this.data.courses.length) {
        if (!isMyGroup || app.userInfo.groupDuty == -1 || app.userInfo.groupDuty == 2) {
          return common.Tip('暂时还没有打卡信息，等待管理员或组长发布').then(res=> {
            wx.navigateBack()
          })
        }
      }
    })
    this.setData({
      groupDuty: app.userInfo.groupDuty,
      isMyGroup
    })
  },
  // 获取分页课程信息
  getCourses() {
    let {
      coursePaging
    } = this.data
    return new Promise((resolve, reject) => {
      app.get(app.Api.getCourses, {
        ...coursePaging,
        groupId: this.showGroupId
      }, {
        loading: false
      }).then(res => {
        if (res.length < coursePaging.pageSize) {
          coursePaging.isNotData = true
        }
        coursePaging.minID = res.length ? res[res.length - 1].id : 0
        this.setData({
          courses: this.data.courses.concat(res)
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
    if (app.addCourseBack || app.courseDeleteBack) {
      let coursePaging = this.data.coursePaging
      app.courseDeleteBack = false
      app.addCourseBack = false
      this.data.courses = []
      coursePaging.isNotData = false
      coursePaging.pageIndex = 1
      coursePaging.minID = 0
      this.getCourses()
    }
  },
  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    let coursePaging = this.data.coursePaging
    coursePaging.isNotData = false
    coursePaging.pageIndex = 1
    coursePaging.minID = 0
    this.data.courses = []
    this.getCourses().then(() => {
      this._freshing = false
      this.setData({
        triggered: false
      })
    })
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
  scrolltolower() {
    if (!this.data.coursePaging.isNotData) {
      this.getCourses()
    }
  },
  handlerGobackClick: app.handlerGobackClick,
  goAddCourse() {
    wx.navigateTo({
      url: '/pages/home/course/addCourse/addCourse',
    })
  }
})