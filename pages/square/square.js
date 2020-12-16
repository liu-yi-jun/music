// pages/square/square.js
let app = getApp()
let common = require('../../assets/tool/common')
const tool = require('../../assets/tool/tool.js')
const core = require('../../assets/tool/core')
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
      pageIndex: 1
    },
    isNotData: false,
    dynamics: [],
    topics: [],
    song: {},
    squareGuide: false,
    scrollTop: 0,
    cross: false,
    leftGuide: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  toScrollTop() {
    this.setData({
      scrollTop: 0
    })
  },
  onLoad: function (options) {
    console.log('squareGuidesquareGuidesquareGuide', app.globalData.guide.square)
    console.log(app.globalData.guide)
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    let signInSums = this.handleSignInSum(app.userInfo.signInSum)
    this.getSquaredynamics()
    this.getTopic()
    this.getDate()
    this.getRandomSong()
    this.setData({
      signInSums
    })


    wx.onBackgroundAudioStop(() => {
      this.marquee.pauseScroll()
      this.setData({
        play: false
      })
    })
  },
  getRandomSong() {
    app.get(app.Api.getRandomSong, {
      userId: app.userInfo.id
    }).then(res => {
      this.setData({
        song: res[0]
      })
    })
  },
  getTopic(e) {
    app.get(app.Api.allTopic).then(res => {
      this.setData({
        topics: tool.arraySplit(res, 3)
      })
    })
  },
  getSquaredynamics() {
    let squaredynamicsPaging = this.data.squaredynamicsPaging
    app.get(app.Api.getSquaredynamics, {
      ...squaredynamicsPaging,
      userId: app.userInfo.id
    }).then(res => {
      if (res.length < squaredynamicsPaging.pageSize) {
        this.setData({
          isNotData: true
        })
      }
      console.log('app.globalData.guide.square',app.globalData.guide.square)
      if (app.globalData.guide.square) {
        this.getTabBar().setData({
          show: false,
        })
        this.setData({
          tabBarBtnShow: true,
        }, () => {
          this.setData({
            squareGuide: app.globalData.guide.square,
          })
        })
      }
      this.setData({
        dynamics: this.data.dynamics.concat(res),
        'squaredynamicsPaging.pageIndex': squaredynamicsPaging.pageIndex + 1
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
    app.post(app.Api.sendSingIn, {
      userId: app.userInfo.id
    }).then(res => {
      let isSignIn = res.isSignIn
      if (!isSignIn) {
        common.Toast('签到成功', 1500, 'success')
        this.setData({
          signInSums: this.handleSignInSum(app.userInfo.signInSum + 1)
        })
      } else {
        common.Toast('每天只需签到一次哦~')
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.init()
  },
  init() {
    const query = wx.createSelectorQuery()
    query.select('#recommendBackground').boundingClientRect()
    query.exec(res => {
      this.setData({
        windowWidth: res[0].width
      })

    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
      // app.getNotice(this, app.userInfo.id)
    }
    if (app.squarePostBack) {
      app.squarePostBack = false
      this.setData({
        dynamics: [],
        isNotData: false,
        'squaredynamicsPaging.pageIndex': 1
      }, () => {
        this.getSquaredynamics()
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let index = e.target.dataset.index
    let dynamics = this.data.dynamics
    setTimeout(() => {
      app.post(app.Api.share, {
        table: dynamics[index].tableName,
        id: dynamics[index].id
      }, {
        loading: false
      }).then(res => {
        dynamics[index].share++
        this.setData({
          dynamics
        })
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
      hideBarShow: false
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
    wx.navigateTo({
      url: '/pages/square/deal/deal',
    })
  },
  goSquarePost() {
    wx.navigateTo({
      url: '/pages/square/squarePost/squarePost',
    })
  },
  goPerformance() {
    wx.navigateTo({
      url: '/pages/square/performance/performance',
    })
  },
  goUnion() {
    wx.navigateTo({
      url: '/pages/square/union/union',
    })
  },
  goBand() {
    wx.navigateTo({
      url: '/pages/square/band/band',
    })
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
  completeLike(commenetBarData) {
    const dynamicList = this.selectComponent('#dynamicList');
    dynamicList.completeLike(commenetBarData)

  },
  completeStore(commenetBarData) {
    const dynamicList = this.selectComponent('#dynamicList');
    dynamicList.completeStore(commenetBarData)
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
      setTimeout(() => {
        this.setData({
          cross: true
        }, () => {
          setTimeout(() => {
            let guide = wx.getStorageSync('guide')
            guide.square = false
            wx.setStorageSync('guide', guide)
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
        })
      }, 1000)
    })
  },

})