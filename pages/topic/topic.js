const Api = require('../../api')
const weMark = require('../../assets/js/wemark')
const app = getApp()
const markdown = require('../../components/mark.js')

Page(Object.assign({

	data: {
		inputContent: '',
		replyToUser: {name: '', id: ''},
		topic: { title: '', good: false,  },
		showDialog: false,
	},

	onLoad(options) {
		wx.showLoading({})
		const accessToken = wx.getStorageSync('access_token')
		this.setData({ 
			accessToken: accessToken.length < 1 ? false : accessToken,
			author_id: app._.id,
			winHeight: wx.getSystemInfoSync().windowHeight,
		}, _ => {
			this.getTopicData(options.id, _ => {
				if (options.to_view) this.setData({ to_view: options.to_view })
				wx.hideLoading()
			})
		})
	},

	getTopicData(id, cb) {
		let params = {mdrender: false}
		this.data.accessToken && (params['accesstoken'] = this.data.accessToken)
		app.get(Api.topic.detail + id, params, res => {
			if (res.success) {
				res.data.content = this.markdownParse(res.data.content)
				res.data.replies[1] && res.data.replies.forEach((item, i) => {
					res.data.replies[i].content = this.markdownParse(item.content)
				})
				this.setData({ topic: res.data }, _ => {
					typeof cb === 'function' && cb()
				})
			} else {
				wx.showToast({
					image: '/assets/images/error.png',
					title: '请求异常',
				})
			}
		})
	},

	markdownParse(text) {
		let parseText = ''
		weMark.parse(text, res => { parseText = res })
		return parseText
	},

	handleCollect(e) {
		if (!this.data.topic.is_collect) {
			app.post(Api.topic.collect.create, {
				accesstoken: this.data.accessToken,
				topic_id: this.data.topic.id
			}, res => {
				res && wx.showToast({
					title: res.success ? '收藏成功' : '收藏失败',
				})
				if (res.success) {
					let topic = this.data.topic
					topic.is_collect = true
					this.setData({ topic: topic })
				}
			})
		} else {
			app.post(Api.topic.collect.cancel, {
				accesstoken: this.data.accessToken,
				topic_id: this.data.topic.id
			}, res => {
				wx.showToast({
					title: res.success ? '取消成功' : '取消失败',
				})
				if (res.success) {
					let topic = this.data.topic
					topic.is_collect = false
					this.setData({ topic: topic })
				}
			})
		}
	},

	updateTopic() {
		wx.navigateTo({
			url: '/pages/edit/edit?topic_id=' + this.data.topic.id,
		})
	},
	
	getUserCenter(e) {
		wx.navigateTo({
			url: '/pages/user/user?loginname=' + e.currentTarget.dataset.loginname,
		})
	},

	handleReplyGood(e) {
		let reply_id = e.currentTarget.dataset.reply_id
		let i = e.currentTarget.dataset.index
		app.post(Api.topic.reply.ups + reply_id + '/ups', {
			accesstoken: this.data.accessToken
		}, res => {
			if (res.success) {
				wx.showToast({ image: '/assets/images/success.png' })
				let topic = this.data.topic
				topic.replies[i].is_uped = !topic.replies[i].is_uped
				this.setData({ topic: topic })
			} else {
				wx.showToast({ image: '/assets/images/error.png' })
			}
		})
	},
	handleReplyInput(e) {
		this.setData({ inputContent: e.detail.value })
	},

	handleReplyComment(e) {
		let replyToUser = {
			name: '@' + e.currentTarget.dataset.reply_to + ' ',
			id: e.currentTarget.dataset.reply_id
		}

		let content = this.data.inputContent
		if (this.data.replyToUser.name.indexOf('@') >= 0) {
			content = content.replace(this.data.replyToUser.name, '')
		}
		this.setData({
			showDialog: true,
			replyToUser: replyToUser,
			inputContent: content + replyToUser.name,
			focus: true,
			cursor: this.data.inputContent.length + replyToUser.name.length
		})
	},
	handleReplySubmit(e) {
		let content = this.data.inputContent.trim()
		if (content.length === 0) {
			wx.showToast({
				image: '/assets/images/warn.png',
				title: '内容不能为空'
			})
			return false
		}

		let data = { content: this.data.inputContent }
		if (this.data.replyToUser.name.indexOf('@') >= 0 && this.data.replyToUser.id) {
			if (this.data.inputContent.indexOf(this.data.replyToUser.name) >= 0) {
				data.reply_id = this.data.replyToUser.id
			}
		}

		this.replySubmitRequest(data, res => {
			if (res.success) {
				wx.showToast({ image: '/assets/images/success.png' })
				let topic = this.data.topic
				topic.reply_count += 1
				topic.replies.push({
					id: res.reply_id,
					author: {
						loginname: app._.loginname,
						avatar_url: app._.avatar_url
					},
					content: this.markdownParse(data.content),
					create_at: Date(),
					is_uped: false,
					ups: [],
					reply_id: null,
				})
				this.setData({ inputContent: '', topic: topic })
			} else {
				wx.showToast({ image: '/assets/images/error.png', title: '回复失败' })
			}
		})
	},

	replySubmitRequest(data, cb) {
		Object.assign( data, {accesstoken: this.data.accessToken} )
		app.post(Api.topic.reply.create + this.data.topic.id + '/replies', data, res => {
			typeof cb === 'function' && cb(res)
		})
	},

	handleFocus() {
		this.setData({ focus: true })
	},
	handleBlur() {
		// this.setData({ focus: false })
	},
	showDialog() {
		this.setData({ showDialog: true, focus: true })
	},
	toggleDialog() {
		this.setData({
			focus: !this.data.showDialog,
			showDialog: !this.data.showDialog
		});
	},

	onShareAppMessage() {
		return {
			title: '【CNODE】' + this.data.topic.title,
			path: this.route + '?id=' + this.data.topic.id
		}
	},
}, markdown))