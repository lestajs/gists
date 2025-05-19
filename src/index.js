import './style/reset.css'
import './style/style.css'
const { mountWidget, camelToKebab } = lesta
import config from './config.js'
import { Gists } from './script/gists.js'
import home from './widgets/home/index.js'
import results from './widgets/results/index.js'
import search from './widgets/search/index.js'
const root = document.getElementById('root')

const app = {
	widgets: {
		home,
		results,
		search
	},
	widget: null,
	gists: new Gists(),
	selectors: (name) => '.' + camelToKebab(name),
	mountWidget: async (name) => {
		app.widget?.unmount()
		app.widget = await mountWidget(app.widgets[name], root, app, name)
	},
	mountWidgetSearch: (node) => mountWidget(app.widgets.search, node, app),
	transition: async () => {
		console.log(app.widget.nodepath)
		if (app.widget.nodepath !== 'home') return
		const transition = document.startViewTransition(() => app.mountWidget('results'))
		await transition.finished
	}
}

app.gists.fetch(config.baseurl).then((value) => value ? app.mountWidget('results') : app.mountWidget('home'))
