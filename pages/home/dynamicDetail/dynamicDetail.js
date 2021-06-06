// pages/home/dynamicDetail/dynamicDetail.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
const core = require('../../../assets/tool/core')
const common = require('../../../assets/tool/common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    showTextara: false,
    param: {},
    detail: {},
    commentArr: [],
    commentPaging: {
      pageSize: 30,
      pageIndex: 1,
    },
    indexObject: {},
    IsNoData: false,
    commentSum: 0,
    commenetBarData: {},
    list: [{
      name: '举报',
      open_type: '',
      functionName: 'handleReport'
    }],
    isSquare: false,
    isPlay: false,
    intoId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    // 注意布尔值传递后变成字符串
    let param = options.param
    param = JSON.parse(param)
    this.isComment = param.isComment
    this.isStore = param.isStore
    this.isLike = param.isLike
    this.table = param.table
    this.dynamicDetailAndCommont(param.id, this.table, 'detail', )
    this.setData({
      isSquare: options.isSquare
    })
  },

  // 初始化声音条实例
  initSound() {
    // wx.setInnerAudioOption({
    //   obeyMuteSwitch: false
    // })
    this.innerSoundContext = wx.createInnerAudioContext()
    this.innerSoundContext.onPlay(() => {
      console.log('开始播放录音')
    })
    this.innerSoundContext.onTimeUpdate(() => {
      console.log('音频播放进度更新事件')
      let {
        duration,
        currentTime
      } = this.innerSoundContext
      console.log(duration, currentTime)
    })
    this.innerSoundContext.onEnded(() => {
      console.log('// 录音播放结束')
      this.setData({
        isPlay: false
      })
    })
    this.innerSoundContext.onStop(() => {
      console.log('onStop')
      this.setData({
        isPlay: false
      })
    })
    this.innerSoundContext.onPause(() => {
      console.log('onPause')
      this.setData({
        isPlay: false
      })
    })
  },
  playRecord() {
    if (!this.innerSoundContext) {
      let voiceUrl = this.data.detail.voiceUrl
      this.initSound()
      this.innerSoundContext.src = voiceUrl
    }
    if (this.data.isPlay) {
      this.innerSoundContext.pause()
      this.setData({
        isPlay: false
      })
    } else {
      this.innerSoundContext.play()
      this.setData({
        isPlay: true
      })
    }

  },
  dynamicDetailAndCommont(id, table, type) {
    let commentPaging = this.data.commentPaging
    app.get(app.Api.dynamicDetailAndCommont, {
      id,
      ...commentPaging,
      table,
      type
    }).then(res => {
      if (this.isComment) {
        setTimeout(() => {
          this.isComment = false
          this.toComment()
        }, 200)
      }
      if (res.commentArr.length < commentPaging.pageSize) {
        this.setData({
          IsNoData: true
        })
      }
      commentPaging.pageIndex = commentPaging.pageIndex + 1
      if (res.detail) {
        this.setData({
          detail: res.detail,
          commenetBarData: {
            otherId: res.detail.userId,
            themeTitle: res.detail.introduce,
            likes: res.detail.likes,
            share: res.detail.share,
            store: res.detail.store,
            isLike: this.isLike,
            isStore: this.isStore,
            themeId: res.detail.id,
            likeUrl: `${this.table}Like`,
            storeUrl: `${this.table}Store`
          }
        })
        if (app.groupInfo) {
          app.groupInfo.myGrouList.forEach((item, index) => {
            if (item.groupId === res.detail.groupId && item.groupDuty !== -1) {
              // 如果是加入的小组才能评论
              return this.flag = true
            }
          })
        }
      }
      this.setData({
        commentArr: this.data.commentArr.concat(res.commentArr),
        commentPaging
      })
    }).catch(err => {
      console.log(err);
      common.Toast('该动态已不存在')
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
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
    this.innerSoundContext && this.innerSoundContext.destroy()
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
  goPersonal(e) {
    let userId = this.data.detail.userId
    wx.navigateTo({
      url: `/pages/my/invitation/invitation?userId=${userId}`,
    })
  },
  onShareAppMessage: function () {
    setTimeout(() => {
      app.post(app.Api.share, {
        table: this.table,
        id: this.data.detail.id
      }).then(res => {
        console.log(res)
        this.setData({
          'detail.share': this.data.detail.share + 1,
          'commenetBarData.share': this.data.detail.share + 1
        })
      })
    }, 3000)

  },
  handlerGobackClick: app.handlerGobackClick,
  preview(e) {
    let src = e.currentTarget.dataset.src
    let detail = this.data.detail
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: detail.pictureUrls // 需要预览的图片http链接列表
    })
  },
  completeCommentOrReply(e) {
    let param = e.detail
    let commentArr = this.data.commentArr
    param.releaseTime = '刚刚'
    console.log(param)
    if (!param.isReply) {
      // 属于评论的，将内容插入到commentArr的第一个
      this.data.detail.comment++
      this.setData({
        detail: this.data.detail,
        intoId: 'comment'
      })
      commentArr.unshift(param)
    } else {
      // 属于回复表，分两种情况
      let {
        commentindex,
        replyindex
      } = this.data.indexObject
      if (commentArr[commentindex].replyArr === undefined) commentArr[commentindex].replyArr = [];
      commentArr[commentindex].replyArr.push(param)
      this.setData({
        intoId: 'commentIndex_' + commentindex
      })
    }
    this.setData({
      commentArr
    })
  },
  completeLike(e) {
    let commenetBarData = e.detail.commenetBarData
    console.log(commenetBarData)
    let detail = this.data.detail
    detail.isLike = commenetBarData.isLike
    detail.likes = commenetBarData.likes
    this.setData({
      detail,
      commenetBarData
    })
    let pages = getCurrentPages();
    let beforePage = pages[pages.length - 2];
    beforePage.completeLike(commenetBarData)
  },
  completeStore(e) {
    let commenetBarData = e.detail.commenetBarData
    let detail = this.data.detail
    detail.isStore = commenetBarData.isStore
    detail.store = commenetBarData.store
    this.setData({
      detail,
      commenetBarData
    })
    let pages = getCurrentPages();
    let beforePage = pages[pages.length - 2];
    beforePage.completeStore(commenetBarData)
  },
  toComment(e) {

    if (this.flag || this.table == 'squaredynamics') {
      this.setData({
        showTextara: true,
        param: {
          type: '小组动态',
          themeUserId: this.data.detail.userId,
          themeTitle: this.data.detail.introduce,
          theme: this.table,
          themeId: this.data.detail.id,
          commenterId: app.userInfo.id,
          commenterAvatar: app.userInfo.avatarUrl,
          commenterName: app.userInfo.nickName
        }
      })
    } else {
      common.Tip('您还未成为该小组成员，暂不能发表评论')
    }

  },
  toReply(e) {
    if (this.flag || this.table == 'squaredynamics') {
      // 加入通知的一些参数
      let param = e.detail.param
      param.theme = this.table
      param.themeId = this.data.detail.id
      param.themeTitle = this.data.detail.introduce
      param.isReply = true
      this.setData({
        showTextara: true,
        param,
        indexObject: e.detail.indexObject
      })
    } else {
      common.Tip('您还未成为该小组成员，暂不能回复评论')
    }
  },
  scrolltolower() {
    if (!this.data.IsNoData) this.dynamicDetailAndCommont(this.data.detail.id, this.table)
  },
  showMenu(e) {
    if (app.userInfo.id === this.data.detail.userId) {
      let list = this.data.list
      list[0] = {
        name: '删除',
        open_type: '',
        functionName: 'hadleDelete'
      }
      this.setData({
        list
      }, () => {
        this.selectComponent('#menu').show();
      })
    } else {
      this.selectComponent('#menu').show();
    }
  },
  // handleStore() {
  //   let detail = this.data.detail
  //   core.operateStore(app.Api[this.table + 'Store'], {
  //     operate: true,
  //     relation: {
  //       userId: app.userInfo.id,
  //       themeId: detail.id
  //     },
  //   }).then(res => {
  //     if (res.modify) {
  //       common.Toast('收藏成功')
  //     } else {
  //       common.Toast('动态已存在')
  //     }
  //   })
  // },
  handleReport() {
    core.handleReport({
      userId: app.userInfo.id,
      theme: this.table,
      themeId: this.data.detail.id
    })
  },
  hadleDelete(e) {
    common.Tip('是否删除该动态', '提示', '确认', true).then(res => {
      if (res.confirm) {
        console.log('用户点击确定')
        this.deleteDynamic(e)
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    })
  },
  deleteDynamic(e) {
    common.showLoading('删除中')
    let detail = this.data.detail
    let {
      tableName,
      id
    } = detail
    console.log(tableName, id)
    app.post(app.Api[tableName + 'Delete'], {
      tableName,
      id,
      // groupId: app.groupInfo.id
    }, {
      loading: false
    }).then(res => {
      console.log(res)
      if (res.affectedRows) {
        common.Toast('已删除')
        setTimeout(() => {
          app.dynamicDeleteBack = true
          wx.navigateBack()
        }, 1500)
      } else {
        common.Toast('该动态已不存在')
      }
    })
  },
})