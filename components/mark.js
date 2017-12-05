module.exports = {
	makeHead() {
		let mark = '#', cursor = this.data.inputContent.length + 1
		// if (this.data.inputContent.trim().length > 0) {
		// 	mark = '\n# '
		// 	cursor += 2
		// }
		let lastChar = this.data.inputContent.replace(this.data.inputContent.length - 1, '')
		this.setData({
			inputContent : this.data.inputContent + mark,
			cursor: this.data.inputContent.length + cursor,
			focus: true,
		})
	},
	makeBold() {
		this.setData({
			inputContent : this.data.inputContent + '****',
			cursor: this.data.inputContent.length + 2,
			focus: true,
		})
	},
	makeItalic() {
		this.setData({
			inputContent : this.data.inputContent + '**',
			cursor: this.data.inputContent.length + 1,
			focus: true,
		})
	},
	makeQuote() {
		let mark = '> ', cursor = this.data.inputContent.length + 2
		if (this.data.inputContent.trim().length > 0) {
			mark = '\n> '
			cursor += 2
		}
		this.setData({
			inputContent : this.data.inputContent + mark,
			cursor: cursor,
			focus: true,
		})
	},
	makeUl() {
		let mark = '* \n* \n* ', cursor = this.data.inputContent.length + 2
		if (this.data.inputContent.trim().length > 0) {
			mark = '\n* \n* \n* '
			cursor += 1
		}
		this.setData({
			inputContent : this.data.inputContent + mark,
			cursor: cursor,
			focus: true,
		})
	},
	makeOl() {
		let mark = '1. \n2. \n3. ', cursor = this.data.inputContent.length + 3
		if (this.data.inputContent.trim().length > 0) {
			mark = '\n1. \n2. \n3. '
			cursor += 1
		}
		this.setData({
			inputContent : this.data.inputContent + mark,
			cursor: cursor,
			focus: true,
		})
	},
	makeLink() {
		this.setData({
			inputContent : this.data.inputContent + '![](https://)',
			focus: true,
			cursor: this.data.inputContent.length + 2,
		})
	}
}