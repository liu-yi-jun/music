// components/square/dynamicList/dynamicList.js
const core = require('../../../assets/tool/core')
const common = require('../../../assets/tool/common')
const tool = require('../../../assets/tool/tool')
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dynamics: {
      type: Array,
      value: []
    },
    isInvitation: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    myId: 0
  },
  /**
   * 组件的方法列表
   */
  lifetimes: {
    attached: function () {
      this.setData({
        myId: app.userInfo.id
      })
    },
    detached: function () {
      this.innerSoundContext && this.innerSoundContext.destroy()
    }
  },
  pageLifetimes: {
    hide: function () {
      // 页面被隐藏
      this.innerSoundContext && this.innerSoundContext.stop()
    },
  },
  methods: {
    extend() {
      wx.showActionSheet({
        itemList: ['举报'],
        success: res => {
          console.log(res)
          if (res.tapIndex === 1) {
            // 分享
          } // 举报

        }
      })
    },
    delete(e) {
      common.Tip('是否删除该动态', '提示', '确认', true).then(res => {
        if (res.confirm) {
          console.log('用户点击确定')
          this.deleteDynamic(e)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      })
    },
    deleteDynamic(e) {
      common.showLoading('删除中')
      let index = e.currentTarget.dataset.index
      let dynamics = this.data.dynamics
      let {
        tableName,
        id
      } = dynamics[index]
      console.log(tableName, id)
      app.post(app.Api[tableName + 'Delete'], {
        tableName,
        id
      }, {
        loading: false
      }).then(res => {
        console.log(res)
        if (res.affectedRows) {
          dynamics.splice(index, 1)
          this.setData({
            dynamics
          })
          common.Toast('已删除')
        }
      })
    },
    // 初始化声音条实例
    initSound() {
      // wx.setInnerAudioOption({
      //   obeyMuteSwitch: false
      // })
      this.innerSoundContext = wx.createInnerAudioContext()
      this.innerSoundContext.onPlay(() => {
        console.log('开始播放录音')
      })
      this.innerSoundContext.onTimeUpdate(() => {
        console.log('音频播放进度更新事件')
        let {
          duration,
          currentTime
        } = this.innerSoundContext
        console.log(duration, currentTime)
      })
      this.innerSoundContext.onEnded(() => {
        console.log('// 录音播放结束')
        let dynamics = this.data.dynamics
        dynamics[this.oldIndex].isPlay = false
        this.setData({
          dynamics
        })
      })
      this.innerSoundContext.onStop(() => {
        console.log('// 录音结束')
        let dynamics = this.data.dynamics
        dynamics[this.oldIndex].isPlay = false
        this.setData({
          dynamics
        })
      })
      this.innerSoundContext.onPause(() => {
        console.log('onPause')
        this.innerSoundContext.stop()
      })
    },
    playRecord(e) {
      console.log(e)
      let {
        voiceurl: voiceUrl,
        index
      } = e.currentTarget.dataset
      let dynamics = this.data.dynamics
      let flag = false
      if (this.oldIndex !== index) {
        flag = true
      } else if (!dynamics[index].isPlay) {
        flag = true
      }
      if (flag) {
        if (this.oldIndex !== undefined) {
          dynamics[this.oldIndex].isPlay = false
        }
        this.oldIndex = index
        dynamics[index].isPlay = true
        this.setData({
          dynamics
        })
        this.innerSoundContext && this.innerSoundContext.destroy()
        this.initSound()
        this.innerSoundContext.src = voiceUrl
        this.innerSoundContext.play()
      }

    },
    toLike(e) {
      let index = e.currentTarget.dataset.index
      let dynamics = this.properties.dynamics
      let content = dynamics[index]
      content.isLike = !content.isLike
      content.isLike ? ++content.likes : --content.likes
      // 是引用可以不用赋值
      // dynamics[index] = content
      this.setData({
        dynamics
      }, () => {
        core.operateLike(app.Api[content.tableName + 'Like'], {
          operate: content.isLike,
          relation: {
            userId: app.userInfo.id,
            themeId: content.id
          },
          extra: {
            otherId: content.userId,
            avatarUrl: app.userInfo.avatarUrl,
            nickName: app.userInfo.nickName,
            themeTitle: content.introduce
          }
        })
      })
    },
    goComment(e) {
      let index = e.currentTarget.dataset.index
      this.index = index
      let content = this.properties.dynamics[index]
      let {
        isLike,
        isStore,
        id
      } = content
      let param = {
        id,
        isLike,
        isStore,
        isComment: true,
        table: content.tableName
      }
      param = JSON.stringify(param)
      wx.navigateTo({
        url: `/pages/home/dynamicDetail/dynamicDetail?param=${param}`
      })
    },
    dynamicDetail(e) {
      let notDo = e.mark.notDo
      if (notDo) return;
      let index = e.currentTarget.dataset.index
      this.index = index
      let content = this.properties.dynamics[index]
      let {
        isLike,
        isStore,
        id,
      } = content
      let param = {
        id,
        isLike,
        isStore,
        table: content.tableName
      }
      param = JSON.stringify(param)
      wx.navigateTo({
        url: `/pages/home/dynamicDetail/dynamicDetail?param=${param}`
      })
    },
    goOtherHome(e) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/home/otherHome/otherHome?showGroupId=${id}`,
      })
    },
    goPersonal(e) {
      let userId = e.currentTarget.dataset.userid
      wx.navigateTo({
        url: `/pages/my/invitation/invitation?userId=${userId}`,
      })
    },
    completeLike(commenetBarData) {
      let dynamics = this.properties.dynamics
      let content = dynamics[this.index]
      content.isLike = commenetBarData.isLike
      content.likes = commenetBarData.likes
      this.setData({
        dynamics
      })
    },
    completeStore(commenetBarData) {
      let dynamics = this.properties.dynamics
      let content = dynamics[this.index]
      content.isStore = commenetBarData.isStore
      content.store = commenetBarData.store
      this.setData({
        dynamics
      })
    },
    previewImage(e) {
      let {
        i,
        j
      } = e.currentTarget.dataset
      let pictureUrls = this.properties.dynamics[i].pictureUrls
      common.previewImage(pictureUrls, pictureUrls[j])
    }
  }
})