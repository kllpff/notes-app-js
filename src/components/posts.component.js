import {Component} from "../core/component";
import {apiService} from "../services/api.service";
import {TransformService} from "../services/transform.service"
import {renderPost} from "../templates/post.template";

export class PostsComponent extends Component {
	constructor(id, {loader}) {
		super(id);
		this.loader = loader
	}

	init() {
		this.$el.addEventListener('click', buttonHandler.bind(this))
	}

	async onShow() {
		this.loader.show()
		const fbData = await apiService.fetchPosts()
		const posts = TransformService.fbObjectToArray(fbData)
		const html = posts.map(post => renderPost(post, {withButton: true}))
		this.loader.hide()
		this.$el.insertAdjacentHTML('afterbegin', html.join(' '))
	}

	onHide() {
		this.$el.innerHTML = '';
	}
}

function buttonHandler(event) {
	const $el = event.target
	const id = $el.dataset.id
	let title = $el.dataset.title

	let postData = {
		id,
		title
	}

	if (id) {
		let favorites = JSON.parse(localStorage.getItem('favorites')) || []

		if (favorites.find(i => i.id === id)) {
			$el.textContent = 'Save'
			$el.classList.add('button-primary')
			$el.classList.remove('button-danger')
			favorites = favorites.filter(i => i.id !== id)
		} else {
			$el.classList.remove('button-primary')
			$el.classList.add('button-danger')
			$el.textContent = 'Delete'
			favorites.push(postData)
		}

		localStorage.setItem('favorites', JSON.stringify(favorites))
	}
}