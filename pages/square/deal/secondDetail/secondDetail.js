// pages/square/deal/secondDetail/secondDetail.js
const app = getApp()
const tool = require('../../../../pages/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    param:{},
    commenetBarData:{}
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
  getSecondDetail(id,table,type) {
    let commentPaging = this.data.commentPaging
    app.get(app.Api.secondDetailAndCommont, {
      id,
      ...commentPaging,
      table,
      type,
      userId: app.userInfo.id
    }).then(res => {
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
            themeTitle: res.detail.title,
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
    if (param.themeId) {
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
  },
  toComment(e) {
    // console.log(e.detail.showTextara)
    this.setData({
      showTextara: true,
      param: {
        theme: this.table,
        themeId: this.data.detail.id,
        commenterId: app.userInfo.id,
        commenterAvatar: app.userInfo.avatarUrl,
        commenterName: app.userInfo.nickName
      }
    })
  },
  toReply(e) {
    this.setData({
      showTextara: true,
      param: e.detail.param,
      indexObject: e.detail.indexObject
    })
  },
  scrolltolower() {
    if (!this.data.IsNoData) this.getSecondDetail(this.data.detail.id,this.table)
  },
})