// components/common/commentList/commentList.js
const app = getApp()
const core = require('../../../assets/tool/core')
const common = require('../../../assets/tool/common')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentArr: {
      type: Object,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toReply(e) {

      let {
        commentindex,
        replyindex
      } = e.currentTarget.dataset
      console.log('replyindex', replyindex)
      console.log('commentindex', commentindex)
      let reply = null
      let commentArr = this.properties.commentArr
      let comment = commentArr[commentindex]
      console.log('comment', comment)
      if (replyindex !== undefined) {
        reply = comment.replyArr[replyindex]
      }
      console.log(comment, 111111111111111111111);
      this.triggerEvent('toReply', {
        indexObject: {
          commentindex,
          replyindex
        },

        param: {
          noticeUserId: reply ? reply.replyPersonId : comment.commenterId,
          originContent: reply ? reply.replyContent : comment.commentContent,
          commentId: comment.id,
          parentReplyId: reply ? reply.replyPersonId : -1,
          parentAvatar: reply ? reply.replyPersonAvatar : comment.commenterAvatar,
          parentName: reply ? reply.replyPersonName : comment.commenterName,
          replyPersonId: app.userInfo.id,
          replyPersonAvatar: app.userInfo.avatarUrl,
          replyPersonName: app.userInfo.nickName
        }
      })
    },
    goPersonal(e) {
      let userId = e.currentTarget.dataset.userid
      console.log('1111111111111111111111', userId)
      wx.navigateTo({
        url: `/pages/my/invitation/invitation?userId=${userId}`,
      })
    },
    longpress(e) {
      let {
        commentindex,
        replyindex
      } = e.currentTarget.dataset
      let commentArr = this.data.commentArr
      let userId, table, id
      if (replyindex !== undefined) {
        table = 'reply'
        userId = commentArr[commentindex].replyArr[replyindex].replyPersonId
        id = commentArr[commentindex].replyArr[replyindex].id
      } else {
        userId = commentArr[commentindex].commenterId
        table = 'comment'
        id = commentArr[commentindex].id
      }
      if (app.userInfo.id === userId) {
        wx.showActionSheet({
          itemList: ['删除'],
          success: res => {
            app.post(app.Api['delete' + table], {
              id
            }).then(data => {
              // 修改
              if (data.affectedRows) {
                if (replyindex !== undefined) { 
                  commentArr[commentindex].replyArr.splice(replyindex, 1)
                 
                }else {
                  commentArr.splice(commentindex, 1)
                }
                common.Toast('已删除')
                this.setData({
                  commentArr
                })
              } else {
                common.Toast('删除失败，请稍后重试')
              }
            })
          }
        })
      } else {
        wx.showActionSheet({
          itemList: ['举报'],
          success: res => {
            core.handleReport({
              userId: app.userInfo.id,
              theme: table,
              themeId: id
            })
          }
        })
      }
    },
  }
})