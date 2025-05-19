import './result.css'
import template from './index.html'
import templateGist from './templateGist'

export default {
	template,
	params: {
		searchWidget: null
	},
	proxies: {
		results: [],
		count: 0,
		total: 0,
		current: 1,
		opened: false
	},
	setters: {
		current(v) {
			this.method.update(v)
			return v
		}
	},
	handlers: {
		opened(v) {
			document[`${v ? 'add' : 'remove'}EventListener`]('pointerdown', this.method.outside)
		}
	},
	nodes() {
		return {
			searchContainer: {},
			searchInfo: {
				_text: () => `found ${this.proxy.total} of ${this.app.gists.data.total} lestajs gists`
			},
			resultContent: {
				innerHTML: () => this.proxy.results.reduce((acc, g, i) => acc + templateGist(g), ''),
			},
			resultInfo: {
				hidden: () => this.proxy.results.length,
				_text: () => this.app.gists.value.trim() ? 'No matching gists found.' : 'Type to search gists.'
			},
			nav: {
				selector: 'nav',
				hidden: () => !this.proxy.results.length,
			},
			prevBtn: {
				disabled: () => this.proxy.current === 1,
				onclick: () => this.proxy.current--
			},
			paginationInfo: {
				_text: () => `Page ${this.proxy.current} of ${this.proxy.count || 1}`
			},
			nextBtn: {
				disabled: () => this.proxy.current === this.proxy.count,
				onclick: () => this.proxy.current++
			},
			allBtn: {
				onclick: this.method.reset
			},
			newBtn: {
				onclick: () => this.proxy.opened = !this.proxy.opened
			},
			dropdown: {
				hidden: () => !this.proxy.opened,
				innerHTML: () => {
					const hashtags = '#lestajs #your_tag #another_tag'
					return `<p>1. Create a gist at gist.github.com using this description format:</p>
					<b>"Short summary. ${hashtags}"</b>
					<p>2. Include files with meaningful names.</p>
					<p>3. Add full details in the first comment (optional but recommended).</p>
					<button class="primary" onclick="window.open('https://gist.github.com', '_blank')">Open</button>`
				}
			}
		}
	},
	methods: {
		reset() {
			this.app.gists.reset()
			this.param.searchWidget.action.clear()
			this.proxy.current = 1
		},
		outside(event) {
			if (this.node.newBtn.target.contains(event.target)) return
			if (!this.node.dropdown.target.contains(event.target)) this.proxy.opened = false
		},
		update(v) {
			({ result: this.proxy.results, count: this.proxy.count, total: this.proxy.total } = this.app.gists.paginate(v))
		},
	},
	created() {
		this.app.gists.search(this.app.gists.value)
		this.method.update(1)
	},
	async mounted() {
		this.param.searchWidget = await this.app.mountWidgetSearch(this.node.searchContainer.target)
		let value
		window.addEventListener('hashchange', () => {
			if (!location.hash) return
			value = window.location.hash.slice(1)
			history.replaceState(null, '', ' ')
			this.param.searchWidget.action.search(value)
		})
		window.addEventListener('popstate', (event) => {
			if (window.location.hash) return
			const url = new URL(window.location.href)
			const searchParams = url.searchParams
			const value = searchParams.get('q')
			value ? this.param.searchWidget.action.search(value) : (location.href = '/')
		})
	},
	refreshed() {
		this.app.gists.search()
		this.proxy.current = 1
	}
}