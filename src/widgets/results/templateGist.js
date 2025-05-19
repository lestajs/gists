

export default function (gist) {
	const description = gist.description.replace(/\.$/, '')
	const links = (hashtags = []) => hashtags.reduce((acc, h, i) => acc + `<a href="#${h}">${h}</a>`, '')
	return `
		 <article>
				<a href="${gist.html_url}" target="_blank" rel="noopener noreferrer">
					<h3>${description || 'No description'}</h3>
				</a>
				<div class="time">Created ${gist.created_ago} / Updated ${gist.updated_ago}</div>
				<div class="icons">
					<div>
						<svg version="1.1"  fill="none" stroke="#101010" stroke-width="8" stroke-miterlimit="10"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
							<circle class="st0" cx="50" cy="40" r="20"/>
							<path class="st0" d="M8.6,90.1c1-3,2.5-5.6,4.3-7.8c1.8-2.2,4-4,6.4-5.3c2.4-1.2,5-1.9,7.8-1.9h11.5H50h11.5H73c2.8,0,5.4,0.7,7.8,1.9c2.4,1.2,4.5,3.1,6.4,5.3c1.8,2.2,3.3,4.9,4.3,7.8"/>
						</svg>
						<span>${gist.owner}</span>
					</div>
					<div>
						<svg version="1.1" fill="none" stroke="#101010" stroke-width="8" stroke-miterlimit="10" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
							<path d="M79.8,70.1c2.8,0,5.3-1.1,7.1-2.9c1.8-1.8,2.9-4.3,2.9-7.1v-15v-15c0-2.8-1.1-5.3-2.9-7.1c-1.8-1.8-4.3-2.9-7.1-2.9h-30h-30c-2.8,0-5.3,1.1-7.1,2.9c-1.8,1.8-2.9,4.3-2.9,7.1v15v15c0,2.8,1.1,5.3,2.9,7.1c1.8,1.8,4.3,2.9,7.1,2.9h10v12.8c0,2.7,3.2,4,5.1,2.1l14.9-14.9C49.8,70.1,79.8,70.1,79.8,70.1z"/>
						</svg>
						<span>${gist.comments}</span>
					</div>
					<div>
						<svg version="1.1" fill="none" stroke="#101010" stroke-width="8" stroke-miterlimit="10" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
							<path class="st0" d="M22.3,52.3l32,32c3.1,3.1,8.2,3.1,11.3,0l18.7-18.7c3.1-3.1,3.1-8.2,0-11.3l-32-32c-1.5-1.5-3.5-2.3-5.7-2.3H28c-4.4,0-8,3.6-8,8v18.7C20,48.8,20.8,50.8,22.3,52.3z"/>
						</svg>
						<span>${ links(gist.hashtags) }</span>
					</div>
				</div>
		</article>
`
}