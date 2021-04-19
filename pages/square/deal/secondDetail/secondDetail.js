// pages/square/deal/secondDetail/secondDetail.js
const app = getApp()
const tool = require('../../../../assets/tool/tool')
const core = require('../../../../assets/tool/core')
const common = require('../../../../assets/tool/common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    commentArr: [],
    commentPaging: {
      pageSize: 30,
      pageIndex: 1,
    },
    // 回复插入的位置
    indexObject: {},
    IsNoData: false,
    // 评论或回复的参数
    param: {},
    commenetBarData: {},
    list: [{
      name: '举报',
      open_type: '',
      functionName: 'handleReport'
    }]
    // list: [{
    //   name: '分享',
    //   open_type: 'share',
    //   functionName: ''
    // }, {
    //   name: '收藏',
    //   open_type: '',
    //   functionName: 'handleStore'
    // }, {
    //   name: '举报',
    //   open_type: '',
    //   functionName: 'handleReport'
    // }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    this.table = 'second'
    this.getSecondDetail(id, this.table, 'detail')
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)

  },
  getSecondDetail(id, table, type) {
    let commentPaging = this.data.commentPaging
    app.get(app.Api.secondDetailAndCommont, {
      id,
      ...commentPaging,
      table,
      type,
      userId: app.userInfo.id
    }).then(res => {
      console.log(res, '111111111111')
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
            // themeTitle: res.detail.title,
            themeTitle: res.detail.brand,
            likes: res.detail.likes,
            share: res.detail.share,
            store: res.detail.store,
            isLike: res.detail.isLike,
            isStore: res.detail.isStore,
            themeId: res.detail.id,
            likeUrl: `${this.table}Like`,
            storeUrl: `${this.table}Store`
          }
        })
      }
      this.setData({
        commentArr: this.data.commentArr.concat(res.commentArr),
        commentPaging
      })
    }).catch(err => {
      common.Toast('该二手乐已不存在')
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
        detail: this.data.detail
      })
      commentArr.unshift(param)
    } else {
      // 属于回复表，分两种情况
      let {
        commentindex,
        replyindex
      } = this.data.indexObject
      if (commentArr[commentindex].replyArr === undefined) commentArr[commentindex].replyArr = [];
      commentArr[commentindex].replyArr.unshift(param)
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
    beforePage.completeSecondStore && beforePage.completeSecondStore(commenetBarData)
  },
  toComment(e) {
    // console.log(e.detail.showTextara)
    this.setData({
      showTextara: true,
      param: {
        type: '二手乐器',
        themeUserId: this.data.detail.userId,
        themeTitle: this.data.detail.brand,
        theme: this.table,
        themeId: this.data.detail.id,
        commenterId: app.userInfo.id,
        commenterAvatar: app.userInfo.avatarUrl,
        commenterName: app.userInfo.nickName
      }
    })
  },
  toReply(e) {
    // 加入通知的一些参数
    let param = e.detail.param
    param.theme = this.table
    param.themeId = this.data.detail.id
    param.themeTitle = this.data.detail.brand
    param.isReply = true
    this.setData({
      showTextara: true,
      param,
      indexObject: e.detail.indexObject
    })
  },
  scrolltolower() {
    if (!this.data.IsNoData) this.getSecondDetail(this.data.detail.id, this.table)
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
  handleStore() {
    let detail = this.data.detail
    core.operateStore(app.Api[this.table + 'Store'], {
      operate: true,
      relation: {
        userId: app.userInfo.id,
        themeId: detail.id
      },
    }).then(res => {
      if (res.modify) {
        common.Toast('收藏成功')
      } else {
        common.Toast('动态已存在')
      }
    })
  },
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
    app.post(app.Api[this.table + 'Delete'], {
      tableName: this.table,
      id: detail.id
    }, {
      loading: false
    }).then(res => {
      if (res.affectedRows) {
        common.Toast('已删除')
        setTimeout(() => {
          app.secondDeleteBack = true
          wx.navigateBack()
        }, 1500)
      } else {
        common.Toast('该器乐已不存在')
      }
    })
  },
})