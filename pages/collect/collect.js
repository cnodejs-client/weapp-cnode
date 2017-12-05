const app = getApp()
const Api = require('../../api')

Page({
	data: {},

	onLoad(options) {
		app.get(Api.topic.collect.list + options.loginname, {}, res => {
			res.success && this.setData({ topics: res.data })
		})
	},

	getTopicDetail(e) {
		wx.navigateTo({
			url: '/pages/topic/topic?id=' + e.currentTarget.dataset.id,
		})
	}
})