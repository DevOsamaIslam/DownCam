let submitURL = document.querySelector('#submit-url')
if (submitURL)
	submitURL.addEventListener('click', () => {
		let url = document.querySelector('#tab-url input').value
		url = url.replace(/\s/g, '')
		let urlTest = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
		if (!url.match(urlTest)) {
			alert('Invalid URL given')
			return
		}
		url = encodeURIComponent(url)
		// Process url upload
		fetch('/api/url/', {
				method: 'POST',
				headers: {
					'Content-Type': 'Application/json'
				},
				body: JSON.stringify({
					url
				})
			})
			.then(res => res.json())
			.then(data => {
				let wrapper = document.querySelector('.qrcode-wrapper.url')
				wrapper.innerHTML = ''
				let img = document.createElement('img')
				img.src = data
				wrapper.appendChild(img)
			})
	})



let submitText = document.querySelector('#submit-freetext')
if (submitText)
	submitText.addEventListener('click', () => {
		let text = document.querySelector('#tab-freetext textarea').value
		if (!text) {
			alert('Invalid text given')
			return
		}
		if (text.length > 10000) {
			alert('Max length reached!')
			return
		}
		// Process text upload
		fetch('/api/text/', {
				method: 'POST',
				headers: {
					'Content-Type': 'Application/json'
				},
				body: JSON.stringify({
					text
				})
			})
			.then(res => res.json())
			.then(data => {
				let wrapper = document.querySelector('.qrcode-wrapper.freetext')
				wrapper.innerHTML = ''
				let img = document.createElement('img')
				img.src = data.qrcode
				wrapper.appendChild(img)
				// let link = document.createElement('a')
				// link.href = data.url
				// link.target = '_blank'
				// link.innerHTML = 'GO'
				// link.className = 'btn waves-effect'
				// wrapper.appendChild(link)
			})
	})



let tabFile = document.querySelector('#tab-file')
if (tabFile)
	tabFile.querySelector('#submit-file').addEventListener('click', e => {
		e.preventDefault()

		let form = tabFile.querySelector('form')
		let fileData = form.querySelector('input[type=file]')

		// check file size
		if (!fileData.files[0]) {
			alert('No file selected')
			return
		}
		if (fileData.files[0].size > (1024 * 1024 * 30)) {
			alert('File size is above 30 MB')
			return
		}
		let progressContainer = tabFile.querySelector('.progress-bar')
		let progressBar = tabFile.querySelector('.progress-bar .progress .determinate')
		let progressText = tabFile.querySelector('span#progress-value')

		const request = new XMLHttpRequest()
		request.open('POST', '/api/upload')

		request.upload.addEventListener('progress', e => {
			progressContainer.style.display = 'initial'
			let total = e.total
			let loaded = e.loaded
			let percent = e.lengthComputable ? (loaded / total) * 100 : 0
			progressBar.style.width = `${percent.toFixed(1)}%`
			progressText.innerHTML = `${Math.round(percent)}%`
		})

		request.setRequestHeader('enctype', 'multipart/form-data')
		let data = new FormData(form)

		request.send(data)
		request.onload = function () {
			if (this.status === 413) {
				alert('File too large')
			} else if (this.status === 200) {
				let data = JSON.parse(this.response)
				progressContainer.style.display = 'none'
				let wrapper = tabFile.querySelector('.qrcode-wrapper')
				wrapper.innerHTML = ''
				let img = document.createElement('img')
				img.src = data.qrcode
				wrapper.appendChild(img)

				// let link = document.createElement('a')
				// link.href = data.url
				// link.target = '_blank'
				// link.innerHTML = 'GO'
				// link.className = 'btn waves-effect'
				// wrapper.appendChild(link)
			}
		}
	})