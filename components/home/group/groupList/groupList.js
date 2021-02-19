// components/home/group/groupList/groupList.js
let app = getApp()
let common = require('../../../../assets/tool/common')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    groups: {
      type: Array,
      value: []
    },
    isMyGroup: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dialogShow: false,
    // 控制弹出框
    joinShow: false,
    applyShow: false,
    applyContent: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goOtherHome(event) {
      console.log('eventevent', event)
      if (app.userInfo) {
        let id = event.currentTarget.dataset.id
        if (this.data.isMyGroup) {
          app.switchData.isSwitchGroup = true
          let group = this.data.groups[event.currentTarget.dataset.index]
          app.post(app.Api.switchGroup, {
            groupId: group.id,
            groupName: group.groupName,
            groupDuty: group.groupDuty,
            userId: app.userInfo.id
          }).then((res) => {
            wx.navigateBack({
              delta: 2,
            })
          })
        } else {
          wx.navigateTo({
            url: `/pages/home/otherHome/otherHome?showGroupId=${id}`,
          })
        }
      } else {
        this.setData({
          dialogShow: true
        })
      }
    },
    joinGroup(groupInfo) {
      // 加入
      app.post(app.Api.joinGroup, {
        groupId: groupInfo.id,
        groupName: groupInfo.groupName,
        userId: app.userInfo.id,
        examine: groupInfo.examine
      }).then(res => {
        app.userInfo = res.userInfo
        if (app.groupInfo) {
          app.groupInfo.myGrouList = res.myGrouList
        } else {
          app.groupInfo = {}
          app.groupInfo.myGrouList = res.myGrouList
        }
        groupInfo.isJoin = 1
        this.setData({
          groups: this.data.groups
        })
      }).catch(err => err)
    },
    showJoin(e) {
      let index = e.currentTarget.dataset.index
      let groupInfo = this.data.groups[index]
      this.groupInfo = groupInfo
      if (app.userInfo) {
        // if (app.groupInfo) {
        //   if (app.groupInfo.myGrouList.length >= 5) {
        //     wx.showModal({
        //       title: '提示',
        //       content: '最多只允许加入5个小组哦~',
        //       showCancel: false
        //     })
        //   } else {
        //     this.setData({
        //       joinShow: true
        //     })
        //   }
        // } else {
        //   // app.switchData.isSwitchGroup = true
        //   // this.joinGroup(groupInfo)
        //   this.setData({
        //     joinShow: true
        //   })
        // }
        this.setData({
          joinShow: true
        })


      } else {
        this.setData({
          dialogShow: true
        })
      }
    },
    yesJoin() {
      let groupInfo = this.groupInfo

      if (groupInfo.examine) {
        this.setData({
          applyShow: true,
          joinShow: false
        })
      } else {
        this.setData({
          joinShow: false
        })
        app.switchData.isSwitchGroup = true
        this.joinGroup(groupInfo)
      }
    },
    noJoin() {
      this.setData({
        joinShow: false
      })
    },
    cancelApply() {
      this.setData({
        applyShow: false
      })
    },
    inputApply(e) {
      let applyContent = e.detail.value
      this.setData({
        applyContent
      })
    },
    apply() {
      let applyContent = this.data.applyContent
      let groupInfo = this.groupInfo
      if (!applyContent) {
        common.Tip('请输入内容')
        return
      }
  
      app.post(app.Api.joinGroup, {
        groupId: groupInfo.id,
        groupName: groupInfo.groupName,
        userId: app.userInfo.id,
        examine: groupInfo.examine
      }).then(res => {
        if (app.groupInfo) {
          app.groupInfo.myGrouList = res.myGrouList
        } else {
          app.groupInfo = {}
          app.groupInfo.myGrouList = res.myGrouList
        }
        groupInfo.isJoin = -1
        
        let from = {
          userId: app.userInfo.id,
          nickName: app.userInfo.nickName
        },
        to = {
          userIdList:res.userIdList
        },
        message = {
          type: 1,
          jsonDate: {
            groupId: groupInfo.id,
            groupName: groupInfo.groupName,
            applyContent,
            isNew: 1,
            status: 0
          }
        }
        app.socket.emit("sendSystemMsg", from, to, message);
        app.switchData.isSwitchGroup = true
        this.setData({
          groups: this.data.groups,
          applyShow: false
        })
      }).catch(err => err)
    },
  }
})