// pages/square/band/bandDetail/bandDetail.js
let app = getApp()
const tool = require('../../../../assets/tool/tool')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    commentArr: [],
    commentPaging: {
      pageSize: 30,
      pageIndex: 1,
    },
    IsNoData: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    let id = parseInt(options.id)
    this.table = 'band'
    this.getBandDetailAndCommont(id, this.table, 'detail')
  },
  getBandDetailAndCommont(id, table, type) {
    let commentPaging = this.data.commentPaging
    app.get(app.Api.bandDetailAndCommont, {
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
        res.detail.existArr = tool.arraySplit(JSON.parse(res.detail.recruitArr), 4)
        res.detail.recruitArr = tool.arraySplit(JSON.parse(res.detail.recruitArr), 4)
        this.setData({
          detail: res.detail,
          commenetBarData: {
            otherId: res.detail.userId,
            themeTitle: res.detail.introduce,
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
  scrolltolower() {
    if (!this.data.IsNoData) this.dynamicDetailAndCommont(this.data.detail.id, this.table)
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
  handlerGobackClick: app.handlerGobackClick,
  toApplication(e) {
    let detail = this.data.detail
    let recruits = JSON.stringify(detail.recruitArr)
    wx.navigateTo({
      url: `/pages/square/band/application/application?recruits=${recruits}&bandId=${detail.id}&userId=${detail.userId}`,
    })
  }
})