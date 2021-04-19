// components/common/comment/inputBox/inputBox.js
const common = require('../../../../assets/tool/common')
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showTextara: {
      type: Boolean
    },
    param: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    keyBoardHeight: 0,
    first: true,
    comment: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    keyBoardChange(height) {
      //键盘高度改变时调用
      // bindkeyboardheightchange="keyBoardChange"安卓不能使用，因为点击空白处没有监听到
      // console.log(e.detail.height, '2222')
      //键盘收起,修改showTextara
      //注意keyBoardChange刚开始时调用了多次，第一次高度为不正确,这时不应该设置showTextara为false
      if (this.data.first) {
        this.setData({
          first: false
        })
      } else {
        let keyBoardHeight = height + 'px'
        console.log(keyBoardHeight, '2222')

        this.setData({
          keyBoardHeight
        })
        if (keyBoardHeight === '0px') {
          this.setData({
            keyBoardHeight
          }, () => {
            this.setData({
              showTextara: false
            })
          })
        }
      }
    },
    sendComment(comment) {
      let param = this.properties.param
      return new Promise((resolve, reject) => {
        app.post(app.Api.sendComment, {
          commentContent: comment,
          ...param
        }, {
          loading: ['发布中...'],
          toast: ['发布失败，请重试']
        }).then(res => resolve(res)).catch(err => reject(err))
      })
    },
    sendReply(comment) {
      let param = this.properties.param
      return new Promise((resolve, reject) => {
        app.post(app.Api.sendReply, {
          replyContent: comment,
          ...param
        }, {
          loading: ['发布中...'],
          toast: ['发布失败，请重试']
        }).then(res => resolve(res)).catch(err => reject(err))
      })
    },
    formSubmit(e) {
      let comment = e.detail.value.comment
      let isReply = this.properties.param.isReply
      if (comment) {
        if (!isReply) {
          // 评论文章
          this.sendComment(comment).then((res) => {
            let insertId = res.insertId
            common.Toast('评论已发布')
            this.setData({
              comment: ''
            })
            this.triggerEvent('completeCommentOrReply', {
              ...this.properties.param,
              commentContent: comment,
              id: insertId
            })
            wx.hideKeyboard()
          })
        } else {
          // 回复评论
          this.sendReply(comment).then((res) => {
            let insertId = res.insertId
            common.Toast('回复已发布')
            this.setData({
              comment: ''
            })
            this.triggerEvent('completeCommentOrReply', {
              ...this.properties.param,
              replyContent: comment,
              id: insertId
            })
            wx.hideKeyboard()
          })
        }
      } else {
        wx.hideKeyboard()
      }
    },
  },
  lifetimes: {
    created() {},
    // 在组件实例进入页面节点树时执行
    attached: function () {
      wx.onKeyboardHeightChange(res => {
        console.log(res.height, '1111')
        this.keyBoardChange(res.height)
      })
    },
  }
})