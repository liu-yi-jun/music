// components/square/band/composeBand/composeBand.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bands:{
      type:Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bands: [{
      name: '七和弦吉他小组'
    },{
      name: '音韵吉他小组'
    },{
      name: '星空吉他小组'
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toIssueTeam() {
      wx.navigateTo({
        url: '/pages/square/band/issueTeam/issueTeam',
      })
    },
    toBandDetail(e) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/square/band/bandDetail/bandDetail?id=${id}`,
      })
    }
  }
})
