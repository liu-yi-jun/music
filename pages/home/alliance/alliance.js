// pages/home/alliance/alliance.js
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
    // followGroupPaging: {
    //   pageSize: 20,
    //   pageIndex: 1,
    //   isNotData: false,
    // },
    groupPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false,
    },
    dialogShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    // this.pagingGetFollowGroup(this.data.groupName)
    this.pagingGetGroup(this.data.groupName)
  },
  pagingGetGroup(groupName) {
    let groupPaging = this.data.groupPaging
    app.get(app.Api.pagingGetGroup, {
      groupName,
      ...groupPaging
    }, {
      loading: false
    }).then((res) => {
      if (res.length < groupPaging.pageSize) {
        this.setData({
          'groupPaging.isNotData': true
        })
      }
      this.setData({
        groups: this.data.groups.concat(res),
        'groupPaging.pageIndex': groupPaging.pageIndex + 1
      })
    })
  },
  confirm(event) {
    this.setData({
      groups: [],
      groupName: event.detail.value,
      'groupPaging.isNotData': false,
      'groupPaging.pageIndex': 1
    }, () => this.pagingGetGroup(this.data.groupName))
  },



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
    if (!this.data.groupPaging.isNotData) {
      this.pagingGetGroup(this.data.groupName)
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
  goOtherHome(event) {
    if (authorize.isAuthorUserInfo()) {
      let id = event.target.dataset.id
      wx.navigateTo({
        url: `/pages/home/otherHome/otherHome?showGroupId=${id}`,
      })
    } else {
      this.setData({
        dialogShow: true
      })
    }
  },
  join() {
    if (authorize.isAuthorUserInfo()) {
      // 加入
    } else {
      this.setData({
        dialogShow: true
      })
    }
  }
})