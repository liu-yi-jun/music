// pages/init/searchGroup/searchGroup.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    groupName: '',
    groups: [],
    searchGroupPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let groupName = options.groupName
    this.setData({
      groupName
    })
    this.searchGroup(groupName)
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
  },
  confirm(event) {
    this.setData({
      groups: [],
      groupName: event.detail.value,
      'searchGroupPaging.isNotData': false,
      'searchGroupPaging.pageIndex': 1
    }, () => this.searchGroup(this.data.groupName))
  },
  searchGroup(groupName) {
    let searchGroupPaging = this.data.searchGroupPaging
    app.get(app.Api.searchGroup, {
      groupName,
      ...searchGroupPaging,
      userId: app.userInfo.id
    },{
      loading: false
    }).then(res => {
      if (res.length < searchGroupPaging.pageSize) {
        this.setData({
          'searchGroupPaging.isNotData': true
        })
      }
      this.setData({
        groups: this.data.groups.concat(res),
        'searchGroupPaging.pageIndex': searchGroupPaging.pageIndex + 1
      })
    })
  },
  scrolltolower() {
    if (!this.data.searchGroupPaging.isNotData) {
      this.searchGroup(this.data.groupName)
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
  handlerGobackClick: app.handlerGobackClick
})