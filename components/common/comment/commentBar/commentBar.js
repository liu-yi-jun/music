// components/common/comment/commentBar/commentBar.js
const app = getApp()
const core = require('../../../../assets/tool/core')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commenetBarData: {
      type: Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
  },
  created(){
    console.log(this.properties)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 触发父级事件，并传递值
    toComment() {
      this.triggerEvent('toComment')
    },
    toLike() {
      let commenetBarData = this.data.commenetBarData
      commenetBarData.isLike = !commenetBarData.isLike
      commenetBarData.isLike?++commenetBarData.likes:--commenetBarData.likes
      this.setData({
        commenetBarData
      },()=> {
        core.operateLike(app.Api[commenetBarData.likeUrl],{
          operate: commenetBarData.isLike,
          relation: {
            userId: app.userInfo.id,
            themeId: commenetBarData.themeId
          },
          extra: {
            otherId: commenetBarData.otherId,
            avatarUrl: app.userInfo.avatarUrl,
            nickName: app.userInfo.nickName,
            themeTitle: commenetBarData.themeTitle
          }
        }).then(res=>{
          console.log( this.triggerEvent)
          this.triggerEvent('completeLike',{
            commenetBarData
          })
        })
      })
    },
    toStore() {
      let commenetBarData = this.data.commenetBarData
      commenetBarData.isStore = !commenetBarData.isStore
      commenetBarData.isStore?++commenetBarData.store:--commenetBarData.store
      console.log(commenetBarData,33333333);
      this.setData({
        commenetBarData
      },()=> {
        core.operateStore(app.Api[commenetBarData.storeUrl],{
          operate: commenetBarData.isStore,
          relation: {
            userId: app.userInfo.id,
            themeId: commenetBarData.themeId
          }
        }).then(res=>{
          console.log(res)
          this.triggerEvent('completeStore',{
            commenetBarData
          })
        })
      })
    },
  }
})
