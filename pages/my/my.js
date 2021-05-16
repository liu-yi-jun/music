// pages/my/my.js
let app = getApp()
let socket = require('../../assets/request/socket')
const common = require('../../assets/tool/common')
const upload = require('../../assets/request/upload')
const authorize = require('../../assets/tool/authorize')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    // 控制右下角三角show
    tabBarBtnShow: false,
    userInfo: {},
    dynamicsPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false
    },
    alliancePaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false
    },
    bandsPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false
    },
    secondPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false
    },
    ticketPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false
    },
    squarePaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false
    },
    groupdPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false
    },
    seconds: [
      [],
      []
    ],
    dynamics: [],
    alliances: [],
    groupdDynamics: [],
    squareDynamics: [],
    bands: [],
    tickets: [],
    barList: [{
        name: '动态',
        children: [{
            name: '小组'
          },
          {
            name: '广场'
          }
        ]
      },
      {
        name: '发布',
        children: [{
            name: '小组活动'
          },
          {
            name: '一起组乐队'
          },
          {
            name: '二手乐器'
          },
          {
            name: '票务转让'
          }
        ]
      }
    ],
    actIndexArr: [0, 0],
    noticeNumbe: 0,
    showHideBar: false,
    myReleasePagin: {
      pageSize: 18,
      pageIndex: 1,
      isNotData: false
    },
    release: [],
    applyShow: false,
    feedbackContent: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.userInfo) {
      // this.getDynamics(app.userInfo.id)
      this.getPersonalAlliance(app.userInfo.id)
      this.getBand(app.userInfo.id)
      this.getSecond(app.userInfo.id)
      this.getTicket(app.userInfo.id)
      this.getSquareDynamics(app.userInfo.id)
      this.getGroupdDynamics(app.userInfo.id)
      // this.getmyRelease(app.userInfo.id)
    }
  },

  completeGetUserInfo() {
    app.myGetUserInfo = true
    // this.getDynamics(app.userInfo.id)
    this.getmyRelease(app.userInfo.id)
    this.setUserInfo()
  },
  getSquareDynamics(id) {
    let squarePaging = this.data.squarePaging
    app.get(app.Api.getMysquareDynamics, {
      ...squarePaging,
      userId: id
    }).then(res => {
      if (res.length < squarePaging.pageSize) {
        this.setData({
          'squarePaging.isNotData': true
        })
      }
      this.setData({
        squareDynamics: this.data.squareDynamics.concat(res),
        'squarePaging.pageIndex': squarePaging.pageIndex + 1
      })
    })
  },
  getGroupdDynamics(id) {
    let groupdPaging = this.data.groupdPaging
    app.get(app.Api.getMygroupdDynamics, {
      ...groupdPaging,
      userId: id
    }).then(res => {
      if (res.length < groupdPaging.pageSize) {
        this.setData({
          'groupdPaging.isNotData': true
        })
      }
      this.setData({
        groupdDynamics: this.data.groupdDynamics.concat(res),
        'groupdPaging.pageIndex': groupdPaging.pageIndex + 1
      })
    })
  },
  getTicket(id) {
    return new Promise((resolve, reject) => {
      let ticketPaging = this.data.ticketPaging
      app.get(app.Api.myTicket, {
        ...ticketPaging,
        userId: id
      }).then(res => {
        if (res.length < ticketPaging.pageSize) {
          this.setData({
            'ticketPaging.isNotData': true
          })
        }
        resolve()
        this.setData({
          tickets: this.data.tickets.concat(res),
          'ticketPaging.pageIndex': ticketPaging.pageIndex + 1
        })
      })
    })

  },
  getSecond(id) {
    let secondPaging = this.data.secondPaging
    app.get(app.Api.mySecond, {
      ...secondPaging,
      userId: id
    }).then(res => {
      if (res.length < secondPaging.pageSize) {
        this.setData({
          'secondPaging.isNotData': true
        })
      }
      let seconds = this.data.seconds

      res.forEach(item => {
        if (seconds[0].length > seconds[1].length) {
          seconds[1].push(item)
        } else {
          seconds[0].push(item)
        }
      })

      this.setData({
        seconds,
        'secondPaging.pageIndex': secondPaging.pageIndex + 1
      })
    })
  },
  getBand(id) {
    let bandsPaging = this.data.bandsPaging
    app.get(app.Api.myBand, {
      ...bandsPaging,
      userId: id
    }).then(res => {
      if (res.length < bandsPaging.pageSize) {
        this.setData({
          'bandsPaging.isNotData': true
        })
      }
      this.setData({
        bands: this.data.bands.concat(res),
        'bandsPaging.pageIndex': bandsPaging.pageIndex + 1
      })
    })
  },
  getmyRelease(id) {
    return new Promise((resolve, reject) => {
      let myReleasePagin = this.data.myReleasePagin
      app.get(app.Api.myRelease, {
        ...myReleasePagin,
        userId: id
      }).then(res => {
        if (res.length < myReleasePagin.pageSize) {
          this.setData({
            'myReleasePagin.isNotData': true
          })
        }
        this.setData({
          release: this.data.release.concat(res),
          'myReleasePagin.pageIndex': myReleasePagin.pageIndex + 1
        })
        resolve()
      })
    })

  },
  getNoticeNumber(id) {
    app.get(app.Api.noticeNumbe, {
      userId: id
    }, {
      loading: false
    }).then(res => {
      let noticeNumbe = res.noticeNumbe
      let systemMsg = wx.getStorageSync('systemMsg')
      if (systemMsg) {
        systemMsg.forEach(item => {
          if (item.message.jsonDate.isNew) noticeNumbe++
        })
      }
      this.setData({
        noticeNumbe
      })
    })
  },
  getPersonalAlliance(id) {
    let alliancePaging = this.data.alliancePaging
    app.get(app.Api.personalAlliance, {
      ...alliancePaging,
      userId: id
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
  // getDynamics(id) {
  //   let dynamicsPaging = this.data.dynamicsPaging
  //   app.get(app.Api.getDynamics, {
  //     ...dynamicsPaging,
  //     userId: id
  //   }).then(res => {
  //     if (res.length < dynamicsPaging.pageSize) {
  //       this.setData({
  //         'dynamicsPaging.isNotData': true
  //       })
  //     }
  //     this.setData({
  //       dynamics: this.data.dynamics.concat(res),
  //       'dynamicsPaging.pageIndex': dynamicsPaging.pageIndex + 1
  //     })
  //   })
  // },
  onReachBottom() {
    let {
      dynamicsPaging,
      alliancePaging,
      actIndex
    } = this.data
    if (actIndex === 0 && !dynamicsPaging.isNotData) {
      // this.getDynamics()
    } else if (actIndex === 1 && !alliancePaging.isNotData) {
      this.getPersonalAlliance()
    }
  },
  // 设置用户信息
  setUserInfo() {
    this.setData({
      userInfo: app.userInfo
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
    if (app.userInfo) {
      this.setUserInfo()
      this.getNoticeNumber(app.userInfo.id)
    }
    if (app.backGroup) {
      app.backGroup = false
      let e = {
        currentTarget: {
          dataset: {
            path: '/pages/home/home'
          }
        }
      }
      this.getTabBar().switchTab(e)
    }
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
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
    if (app.userInfo) {
      this.setData({
        'squarePaging.isNotData': false,
        'squarePaging.pageIndex': 1,
        'groupdPaging.isNotData': false,
        'groupdPaging.pageIndex': 1,
        'alliancePaging.isNotData': false,
        'alliancePaging.pageIndex': 1,
        'bandsPaging.isNotData': false,
        'bandsPaging.pageIndex': 1,
        'secondPaging.isNotData': false,
        'secondPaging.pageIndex': 1,
        'ticketPaging.isNotData': false,
        'ticketPaging.pageIndex': 1,
        seconds: [
          [],
          []
        ],
        dynamics: [],
        alliances: [],
        bands: [],
        tickets: [],
        groupdDynamics: [],
        squareDynamics: [],
      }, () => {
        this.setUserInfo()
        this.getNoticeNumber(app.userInfo.id)
        this.getSquareDynamics(app.userInfo.id)
        this.getGroupdDynamics(app.userInfo.id)
        this.getPersonalAlliance(app.userInfo.id)
        this.getBand(app.userInfo.id)
        this.getSecond(app.userInfo.id)
        this.getTicket(app.userInfo.id).then(() => {
          wx.stopPullDownRefresh()
        })
      })
    }
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
  // 控制bar栏
  tap() {
    this.setData({
      tabBarBtnShow: true
    })
    this.getTabBar().setData({
      show: false
    })
  },

  goEditData() {
    wx.navigateTo({
      url: '/pages/my/editData/editData',
    })
  },
  goFollow(e) {
    let otherId = app.userInfo.id
    wx.navigateTo({
      url: `/pages/my/follow/follow?otherId=${otherId}`,
    })
  },
  goInvitation() {
    let userId = app.userInfo.id
    wx.navigateTo({
      url: `/pages/my/invitation/invitation?userId=${userId}`,
    })
  },
  goStore() {
    wx.navigateTo({
      url: '/pages/my/store/store',
    })
  },

  goFans(e) {
    let otherId = app.userInfo.id
    wx.navigateTo({
      url: `/pages/my/fans/fans?otherId=${otherId}`,
    })
  },

  previewImage() {
    common.previewImage([app.userInfo.avatarUrl])
  },
  async changeImg(e) {
    let Mymark = e.mark.Mymark
    if (Mymark) return
    try {
      let {
        tempFilePaths
      } = await common.chooseImage(1)
      common.showLoading('更换中')
      let bgWalls = await this.uploadImg(tempFilePaths)
      let result = await this.changeBgWall(bgWalls[0])
      console.log(tempFilePaths, bgWalls, result)
      app.userInfo.bgWall = bgWalls[0]
      this.setData({
        userInfo: app.userInfo
      })
      common.Toast('更换成功')
    } catch (err) {
      common.Toast(err)
      wx.hideLoading()
    }
  },
  uploadImg(tempImgParhs) {
    return new Promise((resolve, reject) => {
      let option = {
          userId: app.userInfo.id,
          type: 'image',
          module: 'users'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadManyImg(app.Api.uploadImg, tempImgParhs, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  changeBgWall(bgWall) {
    return new Promise((resolve, reject) => {
      let userId = app.userInfo.id
      app.post(app.Api.changeBgWall, {
        userId,
        bgWall
      }, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  //切换btn 
  switchBtn(e) {
    this.setData({
      actIndexArr: e.detail.actIndexArr
    })
  },
  switchHideBar() {
    this.setData({
      showHideBar: !this.data.showHideBar
    })
  },
  handleGetUserInfo(data) {
    if (!this.data.check) {
      common.Tip('请仔细阅读并勾选同意《Music Monster用户须知》')
      return
    }
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: (data) => {
        if (!app.userInfo) {
          app.post(app.Api.register, {
            userInfo: data.userInfo
          }, {
            loading: false
          }).then(res => {
            app.userInfo = res.userInfo
            socket.initSocketEvent()
            this.completeGetUserInfo()
          })
        }
      }
    })
  },
  goInformation() {
    wx.navigateTo({
      url: '/pages/my/information/information',
    })
    this.authorizeNotice([app.InfoId.like, app.InfoId.content, app.InfoId.reply]).then(res => {

    })
  },
  authorizeNotice(requestId) {
    return new Promise((resolve, reject) => {
      authorize.alwaysSubscription(requestId).then(res => {
        resolve(res)
      }).catch(err => resolve())
    })

  },
  toFeedback() {
    this.setData({
      applyShow: true,
      showHideBar: false
    })
  },
  cancelApply() {
    this.setData({
      applyShow: false
    })
  },
  inputApply(e) {
    let feedbackContent = e.detail.value
    this.setData({
      feedbackContent
    })
  },
  commitFeedback() {
    if (!this.data.feedbackContent) return common.Toast('写点建议吧!')

    app.post(app.Api.feedback, {
      userId: app.userInfo.id,
      feedbackContent: this.data.feedbackContent
    }).then(() => {
      common.Toast('感谢您的反馈!')
      this.setData({
        applyShow: false
      })
    })
  },
  closeBarWrap(e) {
    if (e.mark.district) return;
    this.setData({
      showHideBar: false
    })
  },
  // sendinfo() {
  //   app.post(app.Api.sendSubscribeInfo,{
  //     msgtype
  //   }).then(res => {
  //     console.log(res);
  //   })
  // },
  toAbout() {
    this.setData({
      showHideBar: false
    })
    wx.navigateTo({
      url: '/pages/my/about/about',
    })

  },
  checkboxChange(e) {
    this.setData({
      check: !this.data.check
    })
  },
  goUserNotice() {
    wx.navigateTo({
      url: '/pages/my/agreement/agreement',
    })
  }
})