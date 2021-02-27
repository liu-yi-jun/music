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
    followGroupPaging: {
      pageSize: 10,
      pageIndex: 1,
      isNotData: false,
    },
    joinGroupPaging: {
      pageSize: 10,
      pageIndex: 1,
      isNotData: false,
    },
    settleGroupPaging: {
      pageSize: 10,
      pageIndex: 1,
      isNotData: false,
    },
    followGroups: [],
    settleGroup:[],
    joinGroup: [],
    groupName: '',
    barList: [{
        name: '入驻的小组'
      },
      {
        name: '加入的小组',
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
      this.getSettleGroup()
      this.getJoinGroup()
      this.pagingGetFollowGroup(this.data.groupName)

  
    }

  },
  getSettleGroup() {
    let settleGroupPaging = this.data.settleGroupPaging
    app.get(app.Api.pagingGetSettleGroup, {
      userId: app.userInfo.id,
      ...settleGroupPaging
    }).then(res => {
      if (res.length < settleGroupPaging.pageSize) {
        this.setData({
          'settleGroupPaging.isNotData': true
        })
      }
      this.setData({
        settleGroup: this.data.settleGroup.concat(this.isJoinGroup(res)),
        'settleGroupPaging.pageIndex': settleGroupPaging.pageIndex + 1
      })
    })
  },
  getJoinGroup() {
    let joinGroupPaging = this.data.joinGroupPaging
    app.get(app.Api.pagingGetJoinGroup, {
      userId: app.userInfo.id,
      ...joinGroupPaging
    }).then(res => {
      if (res.length < joinGroupPaging.pageSize) {
        this.setData({
          'joinGroupPaging.isNotData': true
        })
      }
      this.setData({
        joinGroup: this.data.joinGroup.concat(this.isJoinGroup(res)),
        'joinGroupPaging.pageIndex': joinGroupPaging.pageIndex + 1
      })
    })
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
        followGroups: this.data.followGroups.concat(this.isJoinGroup(res)),
        'followGroupPaging.pageIndex': followGroupPaging.pageIndex + 1
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
          group.groupDuty = item.groupDuty
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
  scrolltolower() {
    if (!this.data.settleGroupPaging.isNotData && this.data.actIndex === 0) {

    } else if (!this.data.joinGroupPaging.isNotData && this.data.actIndex === 1) {
      this.getJoinGroup()
    } else if (!this.data.followGroupPaging.isNotData && this.data.actIndex === 2) {
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