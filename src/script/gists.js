export class Gists {
	constructor() {
		this.data = []
		this.filteredGists = []
		this.size = 5
		this.rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
		this.url = new URL(window.location)
		this.value = this.url.searchParams.get('q') || ''
	}
	mapData(gists) {
		return gists.sort((a, b) => {
			const dateDiff = new Date(b.updated_at) - new Date(a.updated_at)
			return dateDiff !== 0 ? dateDiff : b.comments - a.comments
		}).map(gist => ({
			...gist,
			created_ago: this.timeAgo(gist.created_at),
			updated_ago: this.timeAgo(gist.updated_at)
		}))
	}
	async fetch(url) {
		const cache = JSON.parse(localStorage.getItem('gists-cache'))
		if (cache && Date.now() - cache.lastUpdated < 12 * 60 * 60 * 1000) {
			this.data = cache.data
			return this.value
		}
		try {
			const response = await fetch(url)
			this.data = await response.json()
			console.time('sortAndMap')
			this.data.gists = this.mapData(this.data.gists)
			console.timeEnd('sortAndMap')
			localStorage.setItem('gists-cache', JSON.stringify({ data: this.data, lastUpdated: Date.now() }))
			return this.value
		} catch (error) {
			console.error(error)
			throw error
		}
	}
	update(value) {
		if (!value) return
		this.value = value.trim().toLowerCase()
		this.url.searchParams.set('q', value)
		window.history['pushState'](null, '', this.url)
	}
	query(value) {
		clearTimeout(this.searchTimeout)
		if (!value) return []
		return new Promise(resolve => {
			this.searchTimeout = setTimeout(() => {
				const arr = this.data.hashtags.filter(tag => tag.toLowerCase().includes(value.toLowerCase()))
				resolve(arr)
			}, 300)
		})
	}
	filter(gists, value) {
		return gists.filter(gist => {
			const searchValue = value.toLowerCase()
			const descriptionMatch = gist.description && gist.description.toLowerCase().includes(searchValue)
			const hashtagsMatch = gist.hashtags && gist.hashtags.some(tag => tag.toLowerCase().includes(searchValue))
			return descriptionMatch || hashtagsMatch
		})
	}
	search() {
		this.filteredGists = this.value ? this.filter(this.data.gists, this.value) : []
	}
	reset() {
		this.update('')
		this.filteredGists = this.data.gists
	}
	paginate(current) {
		const start = Math.max(0, (current - 1) * this.size)
		const end = Math.min(start + this.size, this.filteredGists.length)
		const result = this.filteredGists.slice(start, end)
		return {
			result: result,
			total: this.filteredGists.length,
			count: Math.ceil(this.filteredGists.length / this.size)
		}
	}
	timeAgo(value) {
		const date = new Date(value)
		const now = new Date()
		const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
		
		if (diffDays === 0) return 'today'
		if (diffDays === 1) return 'yesterday'
		
		if (diffDays > 30) {
			const diffMonths = Math.floor(diffDays / 30)
			if (diffMonths >= 12) {
				return this.rtf.format(-Math.floor(diffMonths / 12), 'year')
			}
			return this.rtf.format(-diffMonths, 'month')
		}
		return this.rtf.format(-diffDays, 'day')
	}
}