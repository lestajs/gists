import template from './index.html'
import './home.css'

export default {
	template: template,
	name: 'home',
	nodes() {
		return {
			searchContainer: {}
		}
	},
	mounted() {
		this.app.mountWidgetSearch(this.node.searchContainer.target)
	}
}