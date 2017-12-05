const app = getApp()
const weMark = require('../../assets/js/wemark')
const Api = require('../../api')

Page({

	data: {
		tab: 0,
		winHeight: wx.getSystemInfoSync().windowHeight
	},

	onLoad() {
		this.setData({ winHeight: wx.getSystemInfoSync().windowHeight })
		app.get(Api.message.list, {
			mdrender: false,
			accesstoken: wx.getStorageSync('access_token')
		}, res => {
			if (res.success) {
				res.data.hasnot_read_messages.forEach((item, i) => {
					res.data.hasnot_read_messages[i].reply.content = this.markdownParse(item.reply.content)
				})
				this.setData({
					unReadMessage: res.data.hasnot_read_messages,
					messages: res.data.hasnot_read_messages.concat(res.data.has_read_messages)
				})
			}
		})
	},

	markdownParse(text) {
		let content = ''
		weMark.parse(text, res => {
			content = res
		})
		return content
	},

	handleTabToggle(e) {
		this.setData({ tab: parseInt(e.currentTarget.dataset.tab) })
	},

	switchContent(e) {
		this.setData({ tab: e.detail.current })
	},

	getTopicDetail(e){
		let topic_id = parseInt(e.currentTarget.dataset.topic_id),
			 msg_id = parseInt(e.currentTarget.dataset.msg_id),
			 to_user = e.currentTarget.dataset.user,
			 readed = e.currentTarget.dataset.read

		wx.navigateTo({
			url: '/pages/topic/topic?id=' + topic_id + '&to_view=' + to_user,
			success: _ => {
				if (!readed) {
					this.markMessageReadedOne(msg_id)
				}
			}
		})
	},
	markMessageReadedOne(msg_id) {
		app.post(Api.message.mark.one + msg_id, {
			accesstoken: wx.getStorageSync('access_token')
		}, res => {
			if (res.success) {
				let unReadMessageIndex = this.getMessageIndexById(this.data.unReadMessage, msg_id),
					 allMessageIndex = this.getMessageIndexById(this.data.messages, msg_id)
				let unReadMessage = this.data.unReadMessage,
					 messages = this.data.messages
				if (typeof unReadMessageIndex !== 'undefined') unReadMessage[unReadMessageIndex].has_read = true
				if (typeof allMessageIndex !== 'undefined') messages[allMessageIndex].has_read = true

				this.setData({
					unReadMessage: unReadMessage, messages: messages
				})
			}
		})
	},
	getMessageIndexById(messages, id) {
		messages.forEach((item, i) => {
			if (item.id === id) {
				return i
			}
		})
	},

	markMessageReadedAll(e) {
		wx.showModal({
			title: '全部标记为已读？',
			showCancel: true,
			success: res => {
				if (res.confirm) {
					this.markMessageReadedAllRequest()
				}
			}
		})
	},
	markMessageReadedAllRequest() {
		app.post(Api.message.mark.all, {
			accesstoken: wx.getStorageSync('access_token')
		}, res => {
			if (res.success) {
				wx.showToast({ title: '标记成功' })
				let messages = this.data.messages
				messages.forEach((item, i) => {
					messages[i].has_read = true
				})
				this.setData({ unReadMessage: [], messages: messages })
			}
		})
	}
})