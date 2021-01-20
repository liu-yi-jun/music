// components/tool/select/select.js
Component({
  properties: {
    options: {
      type: Array,
      value: []
    },
  },
  data: {
    isShow: false,
    current: {}
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      console.log('attached')
    },
    created:function() {
      console.log('created')
    },
    detached: function() {
      console.log('detached')
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
   
    optionTap(e) {
      let dataset = e.target.dataset
      this.setData({
        current: dataset,
        isShow: false
      });

      // 调用父组件方法，并传参
      // this.triggerEvent("change", { ...dataset })
    },
    openClose() {
      this.setData({
        isShow: !this.data.isShow
      })
    },

    // 此方法供父组件调用
    close() {
      this.setData({
        isShow: false
      })
    }
  },
  lifetimes: {}
})