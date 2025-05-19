import './search.css'
import template from './index.html'

export default {
	template,
	proxies: {
		value: '',
		index: -1,
		list: []
	},
	setters: {
		index(v) {
			this.node.searchList.target.children[this.proxy.index]?.classList.remove('active')
			return v === this.proxy.list.length ? 0 : v === -2 ? this.proxy.list.length - 1 : v
		}
	},
	handlers: {
		index(v) {
			if (!this.proxy.list[v]) return
			this.node.searchInput.target.value = this.proxy.list[v]
			this.node.searchList.target.children[v]?.classList.add('active')
		}
	},
	nodes() {
		return {
			clear: {
				hidden: () => !this.proxy.value,
				onclick: this.method.clear
			},
			searchInput: {
				value: () => this.proxy.value,
				onkeydown: this.method.keyDownAction,
				oninput: this.method.updateList,
				onfocus: this.method.updateList
			},
			searchList: {
				innerHTML: () => this.proxy.list.reduce((acc, t, i) => acc + `<li data-index="${i}">${t}</li>`, ''),
				onclick: this.method.clickLi
			}
		}
	},
	actions: ['clear', 'search'],
	methods: {
		clickLi(event) {
			const target = event.target.closest('li')
			if (target) {
				const value = this.proxy.list[+target.dataset.index]
				this.node.searchInput.target.value = value
				this.method.search(value)
			}
		},
		keyDownAction(event) {
			const actions = {
				'Enter': () => this.method.search(event.target.value),
				'ArrowDown': () => this.proxy.index++,
				'ArrowUp': () => this.proxy.index--
			}
			actions[event.key]?.()
		},
		clear() {
			this.proxy.value = ''
			this.node.searchInput.target.focus()
			this.proxy.list = []
		},
		outside(event) {
			if (!this.container.target.contains(event.target)) this.proxy.list = []
		},
		getList() {
			return this.app.gists.query(this.proxy.value)
		},
		async updateList(event) {
			this.proxy.index = -1
			this.proxy.value = event.target.value
			this.proxy.list = await this.method.getList()
			document[`${this.proxy.list.length ? 'add' : 'remove'}EventListener`]('pointerdown', this.method.outside)
		},
		async search(value) {
			this.proxy.list = []
			this.proxy.value = value
			this.app.gists.update(value)
			await this.app.transition()
			this.app.widget.refresh({ cause: 'search', data: { value }})
		}
	},
	created() {
		this.proxy.value = this.app.gists.value
	}
}