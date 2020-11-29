// pages/home/course/course.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    pageSize: 10,
    pageIndex: 1,
    courses: [],
    isNoData: false,
    // 是否是自己的小组
    isMyGroup: false,
    groupDuty: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let showGroupId = options.showGroupId
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.getCourses()
    this.setData({
      groupDuty: app.userInfo.groupDuty,
      isMyGroup: showGroupId == app.userInfo.groupId
    })
  },
  // 获取分页课程信息
  getCourses() {
    let {
      pageSize,
      pageIndex
    } = this.data
    app.get(app.Api.getCourses, {
      pageSize,
      pageIndex
    }).then(res => {
      if (res.length < pageSize) {
        this.setData({
          isNoData: true
        })
      }
      this.setData({
        courses: this.data.courses.concat(res),
        pageIndex: pageIndex + 1
      })
      console.log(res)
      // res.forEach((item)=> {
      //   item.introduce = tool.cutstr(item.introduce, 32)
      // })
      // console.log(res)
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
    if (app.addCourseBack) {
      this.setData({
        courses: [],
        pageSize: 10,
        isNoData: false,
        pageIndex: 1
      }, () => {
        this.getCourses()
      })
      app.addCourseBack = false
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
  scrolltolower() {
    if (!this.data.isNoData) {
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