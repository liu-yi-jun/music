// components/common/commentList/commentList.js
const app = getApp()
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
      console.log(comment,111111111111111111111);
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
  }
})