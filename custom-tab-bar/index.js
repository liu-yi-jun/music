const app = getApp()
Component({
  data: {
    transition: 'none',
    show: true,
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
        pagePath: "/pages/home/home",
      iconPath: "/images/home.png",
      selectedIconPath: "/images/homeSelect.png"
      }, {
        pagePath: "/pages/tool/tool",
        iconPath: "/images/tool.png",
        selectedIconPath: "/images/toolSelect.png"
      },
      {
        pagePath: "/pages/square/square",
        iconPath: "/images/square.png",
        selectedIconPath: "/images/squareSelect.png"
      },
      {
        pagePath: "/pages/my/my",
        iconPath: "/images/my.png",
        selectedIconPath: "/images/mySelect.png"
      }
    ],
    showTabBarRedDot: false
  },
  methods: {
   
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url
      })
      // 出现闪烁现象，注册掉
      // this.setData({
      //   selected: data.index
      // })
    }
  },
  lifetimes: {
    ready: function() {
      // 页面被展示
      this.setData({
        transition: 'all .4s'
      })
    },
  },
})