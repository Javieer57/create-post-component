let createPostForm = document.querySelector('#create-post-form');
let createPostMedia = document.querySelector('#create-post-media');
let mediaLabel = document.querySelector('[for="create-post-media"]');
let postsContainer = document.querySelector('#posts-container');

mediaLabel.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {
		e.target.click();
	}
});

createPostMedia.addEventListener('input', handleAddImg, false);

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
