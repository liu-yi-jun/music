// components/common/authorization/authorization.js

let socket = require('../../../assets/request/socket')
let authorize = require('../../../assets/tool/authorize')
const {
  Tip
} = require('../../../assets/tool/common')
const common = require('../../../assets/tool/common')
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dialogShow: {
      type: Boolean,
      value: false
    },
    codeCheck: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    msgAuthorizationShow: false,
    check: false,
    requestId: [app.InfoId.examine, app.InfoId.joinGroup, app.InfoId.signIn]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel() {
      this.setData({
        dialogShow: false
      })
    },
    //获取用户点击的是允许还是拒绝
    handleGetUserInfo(data) {
      if (!this.data.check) {
        common.Tip('请仔细阅读并勾选同意《Music Monster用户须知》')
        return
      }
      let codeCheck = wx.getStorageSync('codeCheck')
      wx.getUserProfile({
        desc: '用于完善个人资料',
        success: (data) => {
          console.log(data);
          if (!app.userInfo) {
            app.post(app.Api.register, {
              userInfo: data.userInfo,
              codeCheck: codeCheck ? codeCheck : this.data.codeCheck
            }, {
              loading: false
            }).then(res => {
              app.userInfo = res.userInfo
              socket.initSocketEvent()
              this.setData({
                dialogShow: false
              })
              common.Toast('授权成功', 1500, 'success')
              app.myGetUserInfo = true
              this.triggerEvent('handleGetUserInfo', data)
            })
          } else {
            this.setData({
              dialogShow: false
            })
            common.Toast('已授权成功', 1500, 'success')
            this.triggerEvent('handleGetUserInfo', data)
          }
        }
      })
    },
    checkboxChange(e) {
      this.setData({
        check: !this.data.check
      }, () => {
        if (this.data.check) {
          authorize.newSubscription(this.data.requestId, {
            cancelText: '取消'
          }).then((res) => {
            wx.hideLoading()
            if (res.type === 1) {
              common.Tip('为了更好通知到您，需要您授权相应权限，请接下来按照提示操作').then(res => {
                this.setData({
                  msgAuthorizationShow: true
                })
                authorize.infoSubscribe(this.data.requestId).then(res => {
                  this.setData({
                    msgAuthorizationShow: false
                  })
                })
              })
            } else if (res.type === -1) {
              if (res.result.confirm) {
                // 去开启
                wx.openSetting({
                  success(res) {}
                })
              }
            }
          })
        }
      })
    },
    goUserNotice() {
      wx.navigateTo({
        url: '/pages/my/agreement/agreement',
      })
    }
  },

})