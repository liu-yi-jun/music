// pages/square/band/bandDetail/bandDetail.js
let app = getApp()
const tool = require('../../../../assets/tool/tool')
const core = require('../../../../assets/tool/core')
const common = require('../../../../assets/tool/common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    detail: {},
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    commentArr: [],
    commentPaging: {
      pageSize: 30,
      pageIndex: 1,
    },
    IsNoData: false,
    list: [{
      name: '举报',
      open_type: '',
      functionName: 'handleReport'
    }],
    intoId:''
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
        res.detail.uploadExists = JSON.parse(res.detail.existArr)
        res.detail.uploadRecruits = JSON.parse(res.detail.recruitArr)
        res.detail.existArr = tool.arraySplit(JSON.parse(res.detail.existArr), 4)
        res.detail.recruitArr = tool.arraySplit(JSON.parse(res.detail.recruitArr), 4)
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
    }).catch(err => {
      console.log(err);
      // common.Toast('该一起组乐队已不存在')
      // setTimeout(() => {
      //   wx.navigateBack()
      // }, 1500)
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
    if (app.bandBack) {
      this.setData({
        'commentPaging.pageIndex': 1,
        IsNoData: false,
      }, () => {
        this.getBandDetailAndCommont(this.data.detail.id, this.table, 'detail')
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


    }
    this.setData({
      commentArr
    })
  },
  toComment(e) {
    this.setData({
      showTextara: true,
      param: {
        type: '一组乐队',
        themeUserId: this.data.detail.userId,
        themeTitle: this.data.detail.title,
        theme: this.table,
        themeId: this.data.detail.id,
        commenterId: app.userInfo.id,
        commenterAvatar: app.userInfo.avatarUrl,
        commenterName: app.userInfo.nickName
      }
    })
  },
  toReply(e) {
    let param = e.detail.param
    param.theme = this.table
    param.themeId = this.data.detail.id
    param.themeTitle = this.data.detail.title
    param.isReply = true
    this.setData({
      showTextara: true,
      param,
      indexObject: e.detail.indexObject
    })
  },
  handlerGobackClick: app.handlerGobackClick,
  toApplication(e) {
    let detail = this.data.detail
    if(detail.userId === app.userInfo.id) {
      return  common.Toast('请邀请其他人参加！')
    }
    let recruits = JSON.stringify(detail.recruitArr)
    wx.navigateTo({
      url: `/pages/square/band/application/application?recruits=${recruits}&bandId=${detail.id}&userId=${detail.userId}`,
    })
  },
  goPersonal(e) {
    let userId = e.currentTarget.dataset.userid
    wx.navigateTo({
      url: `/pages/my/invitation/invitation?userId=${userId}`,
    })
  },
  showMenu(e) {
    if (app.userInfo.id === this.data.detail.userId) {
      let list = [{
        name: '编辑',
        open_type: '',
        functionName: 'handleEdit'
      }, {
        name: '删除',
        open_type: '',
        functionName: 'hadleDelete'
      }]
      this.setData({
        list
      }, () => {
        this.selectComponent('#menu').show();
      })
    } else {
      this.selectComponent('#menu').show();
    }
  },
  handleEdit(e) {
    let detail = JSON.stringify(this.data.detail)
    wx.navigateTo({
      url: `/pages/square/band/issueTeam/issueTeam?detail=${detail}&isEdit=1`,
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
  handleReport() {
    core.handleReport({
      userId: app.userInfo.id,
      theme: this.table,
      themeId: this.data.detail.id
    })
  },
  deleteDynamic(e) {
    common.showLoading('删除中')
    let detail = this.data.detail
    let {
      id
    } = detail
    console.log(this.table, 1);
    app.post(app.Api[this.table + 'Delete'], {
      tableName: this.table,
      id
    }, {
      loading: false
    }).then(res => {
      console.log(res)
      if (res.affectedRows) {
        common.Toast('已删除')
        setTimeout(() => {
          app.bandDeleteBack = true
          wx.navigateBack()
        }, 1500)
      } else {
        common.Toast('删除失败，请稍后再试')
      }
    })
  },
})