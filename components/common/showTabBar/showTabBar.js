// components/common/showTabBar/showTabBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabBarBtnShow: {
      type: Boolean
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
    switchTabBar() {
      console.log(this.getTabBar().data.show)
      this.getTabBar().setData({
        show: !this.getTabBar().data.show
      })
      this.setData({
        tabBarBtnShow: !this.data.tabBarBtnShow
      })
    },
  }
})
