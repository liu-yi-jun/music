// pages/my/my.js
let app = getApp()
let socket = require('../../assets/request/socket')
const common = require('../../assets/tool/common')
const upload = require('../../assets/request/upload')
const authorize = require('../../assets/tool/authorize')
const tool = require('../../assets/tool/tool')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    // 控制右下角三角show
    tabBarBtnShow: false,
    userInfo: {},
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
      minID: 0,
      isNotData: false
    },
    groupdPaging: {
      pageSize: 20,
      pageIndex: 1,
      minID: 0,
      isNotData: false
    },
    momentPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false
    },
    seconds: [
      [],
      []
    ],
    doubleMoment: [
      [],
      []
    ],
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
            name: '乐队瞬间'
          },
          {
            name: '二手乐器'
          },
          {
            name: '票务转让'
          },
        ]
      }
    ],
    actIndexArr: [0, 0],
    noticeNumbe: 0,
    showHideBar: false,

    applyShow: false,
    feedbackContent: '',
    showCode: false,
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.flag = true
    this.oldScrollTop = 0
    if (app.userInfo) {
      this.getPersonalAlliance(app.userInfo.id)
      this.getBand(app.userInfo.id)
      this.getSecond(app.userInfo.id)
      this.getTicket(app.userInfo.id)
      this.getSquareDynamics(app.userInfo.id)
      this.getGroupdDynamics(app.userInfo.id)
      this.getBandmoment(app.userInfo.id)
    }
  },
  onPageScroll(e) {
    if (!this.pullDown) {
      if (this.flag) {
        this.flag = false
        setTimeout(() => {
          this.oldScrollTop = e.scrollTop
          this.flag = true
        }, 1000)
      }
      if (e.scrollTop - this.oldScrollTop > 100) {
        if (!this.data.tabBarBtnShow) {
          this.getTabBar().setData({
            show: false
          })
          this.setData({
            tabBarBtnShow: true
          })
        }
      } else {
        if (this.data.tabBarBtnShow) {
          this.getTabBar().setData({
            show: true
          })
          this.setData({
            tabBarBtnShow: false
          })
        }
      }
    }

  },
  // touchstart(e) {
  //   if (!app.userInfo) return
  //   this.startX = e.changedTouches[0].clientX
  //   this.startY = e.changedTouches[0].clientY
  // },
  // touchend(e) {
  //   if (!app.userInfo) return
  //   this.endX = e.changedTouches[0].clientX
  //   this.endY = e.changedTouches[0].clientY
  //   let direction = tool.GetSlideDirection(this.startX, this.startY, this.endX, this.endY)
  //   if (direction === 1) {
  //     // 上
  //     if (!this.data.tabBarBtnShow) {
  //       this.getTabBar().setData({
  //         show: false
  //       })
  //       this.setData({
  //         tabBarBtnShow: true
  //       })
  //     }
  //   } else if (direction === 2) {
  //     // 下
  //     if (this.data.tabBarBtnShow) {
  //       this.getTabBar().setData({
  //         show: true
  //       })
  //       this.setData({
  //         tabBarBtnShow: false
  //       })
  //     }
  //   }
  // },
  completeGetUserInfo() {
    app.myGetUserInfo = true
    this.setUserInfo()
  },
  getBandmoment(id) {
    return new Promise((resolve, reject) => {
      let momentPaging = this.data.momentPaging
      app.get(app.Api.mybandmoment, {
        ...momentPaging,
        userId: id
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
        momentPaging.pageIndex = momentPaging.pageIndex + 1
        this.setData({
          doubleMoment
        })
        resolve()
      })
    })
  },
  getSquareDynamics(id) {
    let squarePaging = this.data.squarePaging
    app.get(app.Api.getMysquareDynamics, {
      ...squarePaging,
      userId: id
    }).then(res => {
      if (res.length < squarePaging.pageSize) {
        this.data.squarePaging.isNotData = true
      }
      this.data.squarePaging.minID = res.length ? res[res.length - 1].id : 0
      this.setData({
        squareDynamics: this.data.squareDynamics.concat(res),
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
        this.data.groupdPaging.isNotData = true
      }
      this.data.groupdPaging.minID = res.length ? res[res.length - 1].id : 0
      this.setData({
        groupdDynamics: this.data.groupdDynamics.concat(res)
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

  onReachBottom() {
    if (!app.userInfo) return
    let {
      alliancePaging,
      bandsPaging,
      secondPaging,
      ticketPaging,
      squarePaging,
      groupdPaging,
      momentPaging,
      actIndexArr
    } = this.data
    if (actIndexArr[0] === 0 && actIndexArr[1] === 0 && !groupdPaging.isNotData) {
      // 获取小组动态
      this.getGroupdDynamics(app.userInfo.id)
    } else if (actIndexArr[0] === 0 && actIndexArr[1] === 1 && !squarePaging.isNotData) {
      // 获取广场动态
      this.getSquareDynamics(app.userInfo.id)
    } else if (actIndexArr[0] === 1 && actIndexArr[1] === 0 && !alliancePaging.isNotData) {
      // 获取小组活动
      this.getPersonalAlliance(app.userInfo.id)
    } else if (actIndexArr[0] === 1 && actIndexArr[1] === 1 && !bandsPaging.isNotData) {
      // 获取组乐队
      this.getBand(app.userInfo.id)
    } else if (actIndexArr[0] === 1 && actIndexArr[1] === 2 && !momentPaging.isNotData) {
      // 获取乐队瞬间
      this.getBandmoment(app.userInfo.id)
    } else if (actIndexArr[0] === 1 && actIndexArr[1] === 3 && !secondPaging.isNotData) {
      // 获取二手乐器
      this.getSecond(app.userInfo.id)
    } else if (actIndexArr[0] === 1 && actIndexArr[1] === 4 && !ticketPaging.isNotData) {
      // 获取票务
      this.getTicket(app.userInfo.id)
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
    this.pullDown = true
    if (app.userInfo) {
      this.data.squarePaging.isNotData = false
      this.data.squarePaging.pageIndex = 1
      this.data.squarePaging.minID = 0
      this.data.groupdPaging.isNotData = false
      this.data.groupdPaging.pageIndex = 1
      this.data.groupdPaging.minID = 0
      this.data.alliancePaging.isNotData = false
      this.data.alliancePaging.pageIndex = 1
      this.data.bandsPaging.isNotData = false
      this.data.bandsPaging.pageIndex = 1
      this.data.secondPaging.isNotData = false
      this.data.secondPaging.pageIndex = 1
      this.data.ticketPaging.isNotData = false
      this.data.ticketPaging.pageIndex = 1
      this.data.momentPaging.isNotData = false
      this.data.momentPaging.pageIndex = 1
      this.data.seconds = [
        [],
        []
      ]
      this.data.doubleMoment = [
        [],
        []
      ]
      this.data.alliances = []
      this.data.bands = []
      this.data.tickets = []
      this.data.groupdDynamics = []
      this.data.squareDynamics = []
      this.setUserInfo()
      // 获取新消息数量
      this.getNoticeNumber(app.userInfo.id)
      // 获取广场动态
      this.getSquareDynamics(app.userInfo.id)
      // 获取小组动态
      this.getGroupdDynamics(app.userInfo.id)
      // 获取小组活动
      this.getPersonalAlliance(app.userInfo.id)
      // 获取组乐队
      this.getBand(app.userInfo.id)
      // 获取二手乐器
      this.getSecond(app.userInfo.id)
      // 获取乐队瞬间
      this.getBandmoment(app.userInfo.id)
      // 获取二手票务
      this.getTicket(app.userInfo.id).then(() => {
        wx.stopPullDownRefresh()
        this.pullDown = false
      })
    } else {
      wx.stopPullDownRefresh()
    }
  },
  deleteDynamic(e) {
    let index = e.detail.index
    common.showLoading('删除中')
    let dynamics, actIndexArr = this.data.actIndexArr
    if (actIndexArr[1] === 0) {
      // 小组
      dynamics = this.data.groupdDynamics
    } else {
      // 广场
      dynamics = this.data.squareDynamics
    }
    let {
      tableName,
      id
    } = dynamics[index]
    app.post(app.Api[tableName + 'Delete'], {
      tableName,
      id
    }, {
      loading: false
    }).then(res => {
      console.log(res)
      if (res.affectedRows) {
        dynamics.splice(index, 1)
        if (actIndexArr[1] === 0) {
          this.setData({
            groupdDynamics: dynamics
          })
        } else {
          this.setData({
            squareDynamics: dynamics
          })
        }
        common.Toast('已删除')
      } else {
        dynamics.splice(index, 1)
        if (actIndexArr[1] === 0) {
          this.setData({
            groupdDynamics: dynamics
          })
        } else {
          this.setData({
            squareDynamics: dynamics
          })
        }
        common.Toast('该动态已不存在')
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let index;
    if (app.globalData.squareIndex !== undefined) {
      index = app.globalData.squareIndex
      app.globalData.squareIndex = undefined
    } else {
      index = e.target.dataset.index
    }
    let dynamics, actIndexArr = this.data.actIndexArr
    if (actIndexArr[1] === 0) {
      // 小组
      dynamics = this.data.groupdDynamics
    } else {
      // 广场
      dynamics = this.data.squareDynamics
    }
    setTimeout(() => {
      app.post(app.Api.share, {
        table: dynamics[index].tableName,
        id: dynamics[index].id
      }, {
        loading: false
      }).then(res => {
        let dynamicList = null
        if (actIndexArr[1] === 0) {
          dynamicList = this.selectComponent('#groupdDynamics');
        } else {
          dynamicList = this.selectComponent('#squareDynamics');
        }
        dynamicList.completeShare(index)

      })
    }, 3000)
  },
  // 控制bar栏
  tap() {
    if (!app.userInfo) return
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
  handleGetUserInfo(e) {
    console.log(e);
    if (!this.data.check) {
      common.Tip('请仔细阅读并勾选同意《Music Monster用户须知》')
      return
    }
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: (data) => {
        if (!app.userInfo) {
          app.post(app.Api.register, {
            userInfo: data.userInfo,
            codeCheck: wx.getStorageSync('codeCheck')
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

    // wx.getUserProfile({
    //   desc: '用于完善个人资料',
    //   success: (data) => {
    //     wx.getUserInfo({
    //       withCredentials: true,
    //       success: userDate=> {
    //         console.log(userDate)
    //         if (!app.userInfo) {
    //           app.post(app.Api.register, {
    //             userInfo: data.userInfo,
    //             encryptedData: userDate.encryptedData,
    //             iv: userDate.iv
    //           }, {
    //             loading: false
    //           }).then(res => {
    //             app.userInfo = res.userInfo
    //             socket.initSocketEvent()
    //             this.completeGetUserInfo()
    //           })
    //         }
    //       }
    //     })

    //   }
    // })

  },
  goInformation() {
    wx.navigateTo({
      url: '/pages/my/information/information',
    })
    // this.authorizeNotice([app.InfoId.like, app.InfoId.content, app.InfoId.reply]).then(res => {

    // })
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
  },
  toCode() {
    app.post(app.Api.generateCode, {
      userId: app.userInfo.id
    }, {
      loading: ['生成中...']
    }).then((res) => {
      this.setData({
        code: res,
        showCode: true,
        showHideBar: false
      })
    })
  },
  cancelPopup() {
    this.setData({
      showCode: false
    })
  },
  complete() {
    wx.setClipboardData({
      data: this.data.code,
      success: res => {
        this.cancelPopup()
      }
    })

  },

  touchmove() {
    return
  }
})