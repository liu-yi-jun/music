// pages/home/myGroup/myGroup.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    followGroups: [],
    followGroupPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false,
    },
    myGroups: [],
    groupName: '',
    barList: [{
        name: '我的小组',
      },
      {
        name: '关注的小组'
      },
    ],
    actIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    if (app.userInfo) {
      this.pagingGetFollowGroup(this.data.groupName)
      this.getMyGroup()
    }

  },
  getMyGroup() {
    console.log('getMyGroup')
    app.get(app.Api.myGroup, {
      userId: app.userInfo.id
    }).then(res => {
      console.log(res)
      this.setData({
        myGroups: this.isJoinGroup(res)
      })
    })
  },
  isJoinGroup(groups) {
    if (groups.length === 0 || !app.groupInfo) {
      return groups
    }
    app.groupInfo.myGrouList.forEach((item, index) => {
      groups.forEach(group => {
        console.log(group.id, item.groupId);
        if (group.id == item.groupId) {
          if (item.groupDuty === -1) {
            group.isJoin = -1
          } else {
            group.isJoin = 1
          }
          return
        }
      })
    })
    return groups
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
        followGroups: this.data.followGroups.concat(res),
        'followGroupPaging.pageIndex': followGroupPaging.pageIndex + 1
      })
    })
  },
  scrolltolower() {
    if (!this.data.followGroupPaging.isNotData && this.data.actIndex === 2) {
      this.pagingGetFollowGroup(this.data.groupName)
    }
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