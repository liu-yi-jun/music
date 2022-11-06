// pages/square/square.js
let app = getApp()
let common = require('../../assets/tool/common')
const tool = require('../../assets/tool/tool.js')
const core = require('../../assets/tool/core')
const authorize = require('../../assets/tool/authorize')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    switchBtn: 'together',
    // 控制右下角三角show
    tabBarBtnShow: false,
    // 控制隐藏栏
    hideBarShow: false,
    // 控制音乐播放
    play: false,
    windowWidth: 0,
    songName: '童话镇--暗杠',
    signInSums: [],
    yearMonth: '',
    day: '',
    squaredynamicsPaging: {
      pageSize: 20,
      pageIndex: 1,
      minID: 0
    },
    isNotData: false,
    dynamics: [],
    topics: [],
    song: {},
    squareGuide: false,
    scrollTop: 0,
    cross: false,
    leftGuide: true,
    dialogShow: false,
    showSignIn: false,
    type: 0,
    continuity: 0,
    continuitys: [false, false, false, false, false, false, false],
    alliances: [],
    requestId: [app.InfoId.signIn],
    msgAuthorizationShow: false,
    SignInThirty: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // toScrollTop() {
  //   this.setData({
  //     scrollTop: 0
  //   })
  // },
  onLoad: function (options) {
    this.flag = true
    this.oldScrollTop = 0
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.isGetSignInInfo = true
    if (!app.userInfo) {
      app.initLogin().then(() => {
        if (app.userInfo) {
         
          this.initSquare()
          this.getSignInInfo()
        } else {
          this.setData({
            dialogShow: true
          })
        }
      })
    } else {
      this.initSquare()
    }
  },
  getAlliance() {
    return new Promise((resolve, reject) => {
      app.get(app.Api.getSimpleAlliance, {
        pageSize: 5,
        pageIndex: 1
      }, {
        loading: false
      }).then(res => {
        this.setData({
          alliances: res
        })
        resolve()
      })
    })

  },
  getSignInInfo() {
    if (!this.isGetSignInInfo) return
    this.isGetSignInInfo = false
    app.get(app.Api.signInInfo, {
      userId: app.userInfo.id
    },{
      loading:false
    }).then((res) => {
      app.signInInfo = res
      let signInSums = this.handleSignInSum(app.userInfo.signInSum)
      this.setData({
        signInSums
      })
      if (res.everyday) {
        this.tabBarStatus = 2
        this.getTabBar().setData({
          show: false
        })
        // this.setData({
        //   tabBarBtnShow: true,
        //   showSignIn: true
        // })
      }
    })
  },
  handleGetUserInfo() {
    this.initSquare()
    this.getSignInInfo()
  },
  initSquare() {
    // let signInSums = this.handleSignInSum(app.signInInfo.signInSum)
    app.globalData.codePass = true
    this.getSquaredynamics()
    this.getAlliance()
    this.getTopic()
    this.getDate()

    // this.setData({
    //   signInSums
    // })
  },
  getTopic(e) {
    app.get(app.Api.allTopic,{
    },{
      loading:false
    }).then(res => {
      this.setData({
        topics: tool.arraySplit(res, 3)
      })
    })
  },
  getSquaredynamics() {
    let squaredynamicsPaging = this.data.squaredynamicsPaging
    return new Promise((resolve, reject) => {
      app.get(app.Api.getSquaredynamics, {
        ...squaredynamicsPaging,
        userId: app.userInfo.id
      }).then(res => {
        if (res.length < squaredynamicsPaging.pageSize) {
          this.data.isNotData = true
        }
        this.data.squaredynamicsPaging.minID = res.length ? res[res.length - 1].id : 0
        common.videoToImg(res,'videoUrl') 
        this.setData({
          dynamics: this.data.dynamics.concat(res)
        })
        resolve()
      })
    })
  },
  add0(m) {
    return m < 10 ? '0' + m : m
  },
  getDate() {
    var time = new Date();
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    this.setData({
      day: this.add0(d),
      yearMonth: this.add0(y) + '.' + this.add0(m)
    })
  },
  // 将签到天数进行处理
  handleSignInSum(signInSum) {
    signInSum = String(signInSum)
    while (signInSum.length < 4) {
      signInSum = '0' + signInSum
    }
    return signInSum.split("")
  },
  sendSingIn() {

  },
  singIn() {
    if (app.userInfo) {
      app.get(app.Api.sendSingIn, {
        userId: app.userInfo.id
      }).then(res => {
        let isSignIn = res.isSignIn
        if (!isSignIn) {
          this.authorizeMeg('singIn')
        } else {
          common.Toast('每天只能签到一次哦~')
        }
      })
    } else {
      this.setData({
        dialogShow: true
      })
    }
  },
  bulletSignIn() {
    this.authorizeMeg('everyDay')
  },
  authorizeMeg(classType) {
    common.showLoading('加载中...')
    authorize.newSubscription(this.data.requestId, {
      cancelText: '继续签到'
    }).then((res) => {
      wx.hideLoading()
      if (res.type === 1) {
        this.setData({
          msgAuthorizationShow: true
        })
        authorize.infoSubscribe(this.data.requestId).then(res => {
          this.setData({
            msgAuthorizationShow: false
          })
          this.toIssue(classType)
        })
      } else if (res.type === -1) {
        if (!res.result.confirm) {
          this.toIssue(classType)
        } else {
          // 去开启
          wx.openSetting({
            success(res) {}
          })
        }
      } else if (res.type === 0) {
        this.toIssue(classType)
      }
    })
  },
  toIssue(classType) {
    if (classType === 'singIn') {
      if (this.data.tabBarBtnShow) {
        this.tabBarStatus = 1
      } else {
        this.tabBarStatus = 2
      }
    } else if (classType === 'everyDay') {
      this.closeEveryday()
    }
    wx.navigateTo({
      url: `/pages/square/squarePost/squarePost?showSignIn=${true}`,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.init()
  },
  init() {
    // const query = wx.createSelectorQuery()
    // query.select('#recommendBackground').boundingClientRect()
    // query.exec(res => {
    //   this.setData({
    //     windowWidth: res[0].width
    //   })

    // })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    if (app.userInfo) {
      this.getSignInInfo()
    }
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
      if (app.userInfo) {
        if (!app.TabBar.squareTabBar) {
          app.TabBar.squareTabBar = this.getTabBar()
        }
        this.getTabBar().setIsNew()
      }
      // app.getNotice(this, app.userInfo.id)
    }
    if (app.userInfo && app.myGetUserInfo) {
      this.setData({
        dialogShow: false
      })
      app.myGetUserInfo = false
      this.initSquare()
    }
    if (app.squarePostBack || app.dynamicDeleteBack) {
      app.dynamicDeleteBack = false
      app.squarePostBack = false
      this.data.squaredynamicsPaging.minID = 0
      this.setData({
        dynamics: [],
        isNotData: false,
        'squaredynamicsPaging.pageIndex': 1
      }, () => {
        this.getSquaredynamics().then(() => {
          if (app.signInComplete) {
            this.setData({
              tabBarBtnShow: true,
            })
            this.getTabBar().setData({
              show: false
            }, () => {
              app.signInComplete = false
              console.log(app.signInInfo.signInSum, 2222222222222)
              this.setData({
                signInSums: this.handleSignInSum(app.signInInfo.signInSum)
              })
              if (app.signInInfo.seven) {
                // 已完成七天，包含七天
                if (app.signInInfo.showSeven) {
                  this.setData({
                    type: 3,
                    showSignIn: true
                  })
                } else {
                  if (app.signInInfo.signInSum !== 30) {
                    this.setData({
                      type: 1,
                      showSignIn: true
                    })
                  }
                }
              } else {
                let continuitys = this.data.continuitys
                for (let index = 0; index < app.signInInfo.continuity; index++) {
                  continuitys[index] = true
                }
                this.setData({
                  type: 2,
                  showSignIn: true,
                  continuitys,
                  continuity: app.signInInfo.continuity
                })
              }
              if (app.signInInfo.signInSum == 30) {
                this.setData({
                  SignInThirty: true
                })
              }
            })
          }
        })
      })
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
    this.data.squaredynamicsPaging.minID = 0
    this.setData({
      dynamics: [],
      alliances: [],
      isNotData: false,
      'squaredynamicsPaging.pageIndex': 1
    }, () => {
      this.getSquaredynamics().then(() => {
        wx.stopPullDownRefresh()
        this.getAlliance()
        this.pullDown = false
      })
    })
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let index
    if (app.globalData.squareIndex !== undefined) {
      index = app.globalData.squareIndex
      app.globalData.squareIndex = undefined
    } else {
      index = e.target.dataset.index
    }

    let dynamics = this.data.dynamics
    setTimeout(() => {
      app.post(app.Api.share, {
        table: dynamics[index].tableName,
        id: dynamics[index].id
      }, {
        loading: false
      }).then(res => {
        const dynamicList = this.selectComponent('#dynamicList');
        dynamicList.completeShare(index)

      })
    }, 3000)

  },
  // 播放音乐
  playSong(e) {
    let songUrl = e.currentTarget.dataset.songurl
    console.log(songUrl)
    this.marquee = this.selectComponent("#marquee");
    if (this.data.play) {
      wx.pauseBackgroundAudio({
        dataUrl: songUrl
      });
      this.marquee.pauseScroll()
    } else {
      wx.playBackgroundAudio({
        dataUrl: songUrl
      });
      this.marquee.startScroll(this.data.windowWidth)
    }
    this.setData({
      play: !this.data.play
    })
  },
  //切换btn 
  switchBtn(e) {
    const switchBtn = e.currentTarget.dataset.switchbtn
    if (switchBtn === this.switchBtn) return
    this.setData({
      switchBtn
    })
  },
  // 控制bar栏
  tap(e) {
    console.log('触发tap')
    let district = e.mark.district
    if (district) return;
    this.setData({
      tabBarBtnShow: true,
    })
    this.getTabBar().setData({
      show: false
    })
  },
  // 控制隐藏栏
  hideBar() {
    this.setData({
      hideBarShow: !this.data.hideBarShow
    })
  },
  goDeal() {
    if (app.userInfo) {
      wx.navigateTo({
        url: '/pages/square/deal/deal',
      })
    } else {
      this.setData({
        dialogShow: true
      })
    }

  },
  goSquarePost() {
    if (app.userInfo) {
      wx.navigateTo({
        url: '/pages/square/squarePost/squarePost',
      })
    } else {
      this.setData({
        dialogShow: true
      })
    }
  },
  goPerformance() {
    if (app.userInfo) {
      wx.navigateTo({
        url: '/pages/square/performance/performance',
      })
    } else {
      this.setData({
        dialogShow: true
      })
    }

  },
  goUnion() {
    wx.navigateTo({
      url: '/pages/square/union/union',
    })
  },
  goBand() {
    if (app.userInfo) {
      wx.navigateTo({
        url: '/pages/square/band/band',
      })
    } else {
      this.setData({
        dialogShow: true
      })
    }

  },
  toStoreSong() {
    this.setData({
      'song.isStore': !this.data.song.isStore
    }, () => {
      core.operateStore(app.Api.storeSong, {
        operate: this.data.song.isStore,
        relation: {
          userId: app.userInfo.id,
          songId: this.data.song.id,
        }
      })
    })
  },
  // goTopic(e) {
  //   let topicid = e.currentTarget.dataset.topicid
  //   wx.navigateTo({
  //     url: `/pages/square/topic/topic?topicId=${topicid}`,
  //   })
  // },
  deleteDynamic(e) {
    let index = e.detail.index
    common.showLoading('删除中')
    let dynamics = this.data.dynamics
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
        this.setData({
          dynamics
        })
        common.Toast('已删除')
      } else {
        dynamics.splice(index, 1)
        this.setData({
          dynamics
        })
        common.Toast('该动态已不存在')
      }
    })
  },
  completeLike(commenetBarData) {
    const dynamicList = this.selectComponent('#dynamicList');
    dynamicList.completeLike(commenetBarData)

  },
  completeStore(commenetBarData) {
    const dynamicList = this.selectComponent('#dynamicList');
    dynamicList.completeStore(commenetBarData)
  },
  onReachBottom() {
    if (!this.data.isNotData) {
      this.getSquaredynamics()
    }
  },
  scrolltolower() {
    if (!this.data.isNotData) {
      this.getSquaredynamics()
    }
  },
  click() {
    this.setData({
      hideBarShow: true,
      leftGuide: false
    }, () => {
      // setTimeout(() => {
      //   this.setData({
      //     cross: true
      //   }, () => {
      setTimeout(() => {
        let guide = wx.getStorageSync('guide')
        guide.square = false
        wx.setStorageSync('guide', guide)
        app.globalData.guide.square = false
        this.setData({
          squareGuide: false,
        }, () => {
          setTimeout(() => {
            this.setData({
              hideBarShow: false
            })
          }, 1000)
        })
      }, 1000)
      //   })
      // }, 1000)
    })
  },
  onPageScroll(e) {
    if (!this.pullDown && !this.prohibit) {
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
  // move(e) {

  //   if (this.getTabBar().data.show) {
  //     this.setData({
  //       tabBarBtnShow: true,
  //     })
  //     this.getTabBar().setData({
  //       show: false
  //     })
  //   }
  // },
  fullscreenchange(e) {
    let fullScreen = e.detail.fullScreen //值true为进入全屏，false为退出全屏
    if (!fullScreen) { //退出全屏
      this.prohibit = false
      console.log('退出全屏', this.tempScrollTop)
      // console.log('111', this.tempScrollTop ? this.tempScrollTop : this.data.scrollTop)
      // setTimeout(() => {
      //   this.setData({
      //     scrollTop: this.tempScrollTop ? this.tempScrollTop : this.data.scrollTop
      //   })
      // }, 100)

      if (this.show) {
        this.getTabBar().setData({
          show: true
        })
      }
    } else { //进入全屏
      this.prohibit = true
      console.log('进入全屏')
      // this.tempScrollTop = this.scrollTop
      this.show = this.getTabBar().data.show
      if (this.getTabBar().data.show) {
        this.getTabBar().setData({
          show: false
        })
      }
    }

  },
  closeSignIn() {
    this.closeEveryday()
    this.recovery()
    this.setData({
      showSignIn: false
    })
  },
  recovery() {
    if (this.tabBarStatus === 2) {
      this.tabBarStatus = 0
      this.setData({
        tabBarBtnShow: false,
      })
      this.getTabBar().setData({
        show: true
      })
    } else if (this.tabBarStatus === 1) {
      this.tabBarStatus = 0
      this.setData({
        tabBarBtnShow: true,
      })
      this.getTabBar().setData({
        show: false
      })
    }
  },
  closeEveryday() {
    app.signInInfo.everyday = 0
    app.post(app.Api.closeEveryday, {
      userId: app.userInfo.id
    }, {
      loading: false
    }).then(() => {

    })
  },

  determine() {
    this.recovery()
    this.setData({
      showSignIn: false
    })
  },
  cancelmove() {
    return false
  },
  goAllianceDetail(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `/pages/square/performance/allianceDetail/allianceDetail?id=${id}&index=${index}`,
    })
  },
  closeThirty() {
    this.setData({
      SignInThirty: false
    })
  }
})