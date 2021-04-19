// pages/square/performance/liveHouseDetail/liveHouseDetail.js
const app = getApp()
const tool = require('../../../../assets/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    current: 'datum',
    detail: {},
    commenetBarData: {},
    // 评论分页
    commentPaging: {
      pageSize: 30,
      pageIndex: 1
    },
    IsNoData: false,
    commentArr: [],
    barList: [{
        name: '详情',
      },
      {
        name: '讨论区'
      },
    ],
    actIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    console.log(options)
    let id = Number(options.id)
    console.log(id)
    this.tableName = options.tableName
    this.getDetail(id)
    this.getComment(id)
  },
  getComment(id) {
    console.log(this.tableName + 'Comment')
    let commentPaging = this.data.commentPaging
    app.get(app.Api[this.tableName + 'Comment'], {
      id,
      ...commentPaging
    }).then(res => {
      if (res.commentArr.length < commentPaging.pageSize) {
        this.setData({
          IsNoData: true
        })
      }
      commentPaging.pageIndex = commentPaging.pageIndex + 1
      this.setData({
        commentArr: this.data.commentArr.concat(res.commentArr),
        commentPaging
      })
    })
  },
  getDetail(id) {
    console.log(this.tableName + 'Detail')
    app.get(app.Api[this.tableName + 'Detail'], {
      id,
      userId: app.userInfo.id
    }).then(res => {
      let detail = res[0]
      detail.showIntroduce = detail.showIntroduce.replace(/<ul.*?>|<\/ul>|<li.*?>|<\/li>/g, '').replace(/\?/g, '').replace(/jpg/g, 'jpg?')
      this.setData({
        detail,
        commenetBarData: {
          likes: detail.likes,
          share: detail.share,
          store: detail.store,
          isLike: detail.isLike,
          isStore: detail.isStore,
          themeId: detail.id,
          likeUrl: `${this.tableName}Like`,
          storeUrl: `${this.tableName}Store`
        }
      })
    })
  },
  //切换btn 
  switchBtn(e) {
    let actIndex = e.detail.actIndex
    if (actIndex === this.data.actIndex) return
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
    setTimeout(() => {
      app.post(app.Api.share, {
        table: 'musicfestival',
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
    // console.log(e.detail.showTextara)
    this.setData({
      showTextara: true,
      param: {
        theme: this.tableName,
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
    let actIndex = this.data.actIndex
    if (!this.data.IsNoData && actIndex === 1) this.getComment(this.data.detail.id)
  }
})