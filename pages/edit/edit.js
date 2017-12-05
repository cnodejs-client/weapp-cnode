const app = getApp()
const Api = require('../../api')
const markdown = require('../../components/mark.js')

Page(Object.assign({
	
	data: {
		tab: 0,
		tabs: [
			{ text: '问答', name: 'ask' },
			{ text: '分享', name: 'share' },
			{ text: '招聘', name: 'job' },
			{ text: '客户端测试', name: 'dev' },
		],
		title: '',
		inputContent: '',
	},

	onLoad(options) {
		if (options.tab == 3) options.tab = 0
		this.setData(options)

		if (options.topic_id) {
			wx.showLoading({ })
			app.get(Api.topic.detail + options.topic_id, {
				mdrender: false,
			}, res => {
				if (res.success) {
					this.setData({
						title: res.data.title,
						inputContent: res.data.inputContent,
						tab: this.getTabForName(res.data.tab)
					})
				}
				wx.hideLoading()
			})
		}
	},

	getTabForName(name) {
		let tab = 0
		this.data.tabs.forEach((item, i) => {
			if (item.name === name) tab = i
		})
		return tab
	},

	handlePickerChang(e) {
		this.setData({ tab: parseInt(e.detail.value) })
	},
	handleTitleInput(e) {
		this.setData({ title: e.detail.value })
	},
	handleContentInput(e) {
		console.log(e.detail.cursor)
		this.setData({ inputContent: e.detail.value })
	},

	handleFormSubmit(e) {
		if (this.data.title.trim().length < 10) {
			wx.showToast({
				image: '/assets/images/warn.png',
				title: '标题太短',
			})
			return false
		}
		if (this.data.inputContent.trim().length === 0) {
			wx.showToast({
				image: '/assets/images/warn.png',
				title: '请输入内容',
			})
			return false
		}
		let formData = {
			accesstoken: wx.getStorageSync('access_token'),
			tab: this.data.tabs[this.data.tab].name,
			title: this.data.title,
			inputContent: this.data.inputContent,
		}

		let url = !this.data.topic_id ? Api.topic.create : Api.topic.update
		app.post(url, formData, res => {
			if (res.success) {
				wx.showToast({ image: '/assets/images/success.png', title: '发布成功' })
				setTimeout(() => {
					wx.navigateBack({ })
				}, 1000)
			} else {
				wx.showToast({ image: '/assets/images/error.png', title: '发布失败' })
			}
		})
	},

}, markdown))