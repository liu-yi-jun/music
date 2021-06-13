// components/common/issueHead/issueHead.js
Component({
  behaviors: ['wx://form-field-button'],
  /**
   * 组件的属性列表
   */
  properties: {
    avatarUrl: {
      type: String,
      value: ''
    },
    nickName: {
      type: String,
      value: ''
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
    submit() {
      this.triggerEvent('formSubmit')
    }
  }
})
