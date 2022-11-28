let createPostForm = document.querySelector('#create-post-form');
let createPostMedia = document.querySelector('#create-post-media');
let createPostText = document.querySelector('#create-post-txt');
let createPostSubmitBtn = document.querySelector('#create-post-submit-btn');
let mediaLabel = document.querySelector('[for="create-post-media"]');
let postsContainer = document.querySelector('#posts-container');

mediaLabel.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {
		e.target.click();
	}
});

createPostForm.addEventListener('submit', handleSubmit, false);
createPostMedia.addEventListener('input', handleAddImg, false);

createPostText.addEventListener('input', watchInputs, false);
createPostMedia.addEventListener('change', watchInputs, false);

function watchInputs() {
	if (createPostText.value === '' && createPostMedia.value === '') {
		createPostSubmitBtn.setAttribute('disabled', 'true');
		createPostForm.removeEventListener('submit', handleSubmit, false);
	} else {
		createPostSubmitBtn.removeAttribute('disabled');
		createPostForm.addEventListener('submit', handleSubmit, false);
	}
}

watchInputs();

async function handleSubmit(e) {
	e.preventDefault();

	let postContent = {
		text: createPostText.value,
		img: createPostMedia.files[0],
	};

	let post = await createPost(postContent);
	cleanCreatePost();
	postsContainer.insertAdjacentHTML('afterbegin', post);
}

function cleanCreatePost() {
	createPostText.value = '';
	createPostMedia.value = '';
	watchInputs();
}

async function createPost(postContent) {
	let header = generateHeader();
	let body = await generateBody(postContent);
	let footer = generateFooter();

	let post = `
		<article class="post">
			<div class="post__wrapper">
				${header}
				${body}
			</div>
			${footer}
		</article>
	`;

	return post;
}

async function generateBody(postContent) {
	let bodyContent = await generateBodyContent(postContent);

	let body = `
		<div class="post__body">
			${bodyContent}
		</div>
	`;

	return body;
}

async function generateBodyContent(postContent) {
	// https://benhoyt.com/writings/dont-sanitize-do-escape/
	let content = '';

	if (postContent.text) {
		content += `
			<p class="post__text">
				${postContent.text}
			</p>
		`;
	}

	if (postContent.img) {
		content += await generatePostImg(postContent.img);
	}

	return content;
}

function generatePostImg(fileImg) {
	// https://codepen.io/Anveio/pen/XzYBzX
	let reader = new FileReader();

	return new Promise((resolve, reject) => {
		reader.onerror = () => {
			reader.abort();
			reject(new DOMException('Problem parsing input file.'));
		};

		reader.onload = () => {
			resolve(`<img class="post__img" src="${reader.result}" alt="" />`);
		};
		reader.readAsDataURL(fileImg);
	});
}

function generateHeader() {
	// https://observablehq.com/@mbostock/date-formatting
	let date = new Date(),
		currentDate = date.toLocaleString(undefined, {
			month: 'short',
			day: '2-digit',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		});

	let header = `
		<header class="post__header">
			<img class="post__avatar" src="avatar.png" alt="" />

			<div class="post__meta">
				<p class="post__user"></p>
				<time class="post__time" datetime="">${currentDate}</time>
			</div>
		</header>
	`;

	return header;
}

function generateFooter() {
	let footer = `
		<footer class="post__footer">
			<div class="post__footer-wrapper">
				<button class="post__react-btn">
					<img class="post__react-btn-icon" src="thumb-up-outline.svg" alt="" />
					React
				</button>
				<button class="post__react-btn">
					<img class="post__react-btn-icon" src="comment-multiple-outline.svg" alt="" />
					Comment
				</button>
				<button class="post__react-btn">
					<img class="post__react-btn-icon" src="share-outline.svg" alt="" />
					Share
				</button>
			</div>
		</footer>
	`;

	return footer;
}

function handleAddImg(e) {
	const file = e.target.files[0];

	if (isValidImage(file)) {
		generateImgPreview(file);
	}
}

function generateImgPreview(file) {
	let reader = new FileReader(),
		mediaContainer = document.querySelector('#create-post-media-wrap');

	reader.readAsDataURL(file);
	reader.onloadend = () => {
		let preview = `
			<figure class="create-post__media-item">
				<button type="button" aria-label="delete image">
					<img src="close.svg" alt="" />
				</button>
				<img src="${reader.result}" alt="" />
			</figure>	
		`;

		mediaContainer.innerHTML = preview;

		let closeBtn = mediaContainer.querySelector('button');
		closeBtn.addEventListener('click', removeImg, false);
	};
}

function removeImg(e) {
	e.currentTarget.parentElement.remove();
	createPostMedia.value = '';
	watchInputs();
}

function isValidImage(file) {
	let isValid = isValidFileSize(file) && isValidFileSize(file);
	return isValid;
}

function isValidFileType(file) {
	const fileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
	return fileTypes.includes(file.type);
}

function isValidFileSize(file) {
	return file.size < 1048576;
}
