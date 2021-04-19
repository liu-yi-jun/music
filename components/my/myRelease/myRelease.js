// components/my/myRelease/myRelease.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    release:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    alliances: [{
      id: 1,
      title: '111',
      avatarUrl: '',
      pictureUrls: [''],
      pictureUrls: '',
      organization: '浙江',
      activityTime: '2021-1'
    }],
    bands: [{
      title:444444,
      existArr:[{instrumentsUrl:'',instrumentsName:'1111'},{instrumentsUrl:'',instrumentsName:'1111'},{instrumentsUrl:'',instrumentsName:'1111'}],
      recruitArr:[{instrumentsUrl:'',instrumentsName:'1111'},{instrumentsUrl:'',instrumentsName:'1111'},{instrumentsUrl:'',instrumentsName:'1111'}]
    }],
    second:[
      {}
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goPersonal(e) {
      let userId = e.currentTarget.dataset.userid
      wx.navigateTo({
        url: `/pages/my/invitation/invitation?userId=${userId}`,
      })
    },
    goAllianceDetail(e) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/square/performance/allianceDetail/allianceDetail?id=${id}`,
      })
    },
    toBandDetail(e) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/square/band/bandDetail/bandDetail?id=${id}`,
      })
    },
    toSecondDetail(e) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/square/deal/secondDetail/secondDetail?id=${id}`,
      })
    },
  },

})