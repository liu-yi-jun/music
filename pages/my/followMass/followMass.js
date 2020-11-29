// pages/my/followMass/followMass.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    groups: [],
    groupName: '',
    followGroupPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.pagingGetFollowGroup(this.data.groupName)
  },
  confirm(event) {
    this.setData({
        groups: [],
        groupName: event.detail.value,
        'followGroupPaging.isNotData': false,
        'followGroupPaging.pageIndex': 1
      }, () => this.pagingGetFollowGroup(this.data.groupName))
  },
  // 获取所有关注的小组
  pagingGetFollowGroup(groupName) {
    let followGroupPaging = this.data.followGroupPaging
    app.get(app.Api.pagingGetFollowGroup, {
      groupName,
      userId: app.userInfo.id,
      ...followGroupPaging
    }, {
      loading: false
    }).then(res => {
      if (res.length < followGroupPaging.pageSize) {
        this.setData({
          'followGroupPaging.isNotData': true
        })
      }
      this.setData({
        groups: this.data.groups.concat(res),
        'followGroupPaging.pageIndex': followGroupPaging.pageIndex + 1
      })
    })
  },
  scrolltolower() {
    if (!this.data.followGroupPaging.isNotData) {
      this.pagingGetFollowGroup(this.data.groupName)
    }
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

})