const iframeObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		let elmnt = entry.target;
		if (entry.isIntersecting) {
			let iframe = elmnt.querySelector('iframe');
			iframe.src = iframe.dataset.src;
			let embedContent = elmnt.querySelector('.student-embed-content');
			embedContent.style.transition = `${Math.random()*.5+.5}s cubic-bezier(0.25, 1, 0.5, 1)`;
			setTimeout(() => {
				embedContent.style.transform = ``;
			}, 10);
			iframeObserver.unobserve(elmnt);
		} else {
			// iframe.src = "";
		}
	});
});

const studentObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		let elmnt = entry.target;
		if (entry.isIntersecting) {
			for (let indexLink of document.querySelectorAll('.index-link')) {
				indexLink.dataset.active = 0;
			}
			let id = elmnt.id;
			let indexLink = document.querySelector(`.index-link[href="#${id}"]`);
			indexLink.dataset.active = 1;
		} else {
			
		}
	});
}, {
	rootMargin: '-400px', // Example offset values
});

function generatePage() {
	let temp = "";
	let indexTemp = '';
	for (let key in data) {
		let studentData = data[key];
		let id = studentData['name'].toLowerCase().replace(/\s+/g, "-");

		// Links
		let links = '';
		for (let linkData of studentData['links']) {
			links += `
				<a class="student-info-link" href="${linkData['url']}" target="_blank">${linkData['name']}</a>
			`;
		}

		// Embeds
		let embeds = '';
		for (let embedKey in studentData['embeds']) {
			let embedData = studentData['embeds'][embedKey];
			embeds += `
				<div class="student-embed-container">
					<div class="student-embed-content" style="transform: scale(0) rotate(${Math.random()*180-90}deg) translate(${Math.random()*200-100}%, ${Math.random()*100-50}%);">
						<a class="student-embed" href="${embedData}" target="_blank" style="transform: rotate(${Math.random()*4-2}deg);">
							<div class="student-embed-iframe">
								<iframe data-src="${embedData}" sandbox="allow-scripts allow-same-origin" loading="lazy"></iframe>
							</div>
							<div class="student-embed-label">${embedKey}</div>
							<div class="student-embed-handle-1"></div>
							<div class="student-embed-handle-2"></div>
							<div class="student-embed-handle-3"></div>
							<div class="student-embed-handle-4"></div>
						</a>
					</div>
				</div>
			`;
		}

		// Put it all together
		temp += `
			<div class="student" id="${id}">
				<div class="student-info">
					<h3 class="student-info-name"><a href="#${id}">${studentData['name']}</a></h3>
					<div class="student-info-links">
						${links}
					</div>
				</div>
				<div class="student-embeds">
					${embeds}
				</div>
			</div>
		`;

		// Add to index
		indexTemp += `<a href="#${id}" class="index-link" data-init="0">${studentData['name']}</a>`;
	}

	// Add to DOM
	let students = document.querySelector('.students');
	students.innerHTML = temp;
	let index = document.querySelector('.index');
	index.innerHTML = indexTemp;

	// Animate in index
	let indexDelay = 0;
	for (let indexLink of index.querySelectorAll('.index-link')) {
		setTimeout(() => {
			indexLink.dataset.init = 1;
		}, indexDelay*50)
		indexDelay++;
	}

	// Lazy load iframes
	for (let embed of document.querySelectorAll('.student-embed-container')) {
		iframeObserver.observe(embed);
	}

	// Dynamic nav
	for (let student of document.querySelectorAll('.student')) {
		studentObserver.observe(student);
	}
}
generatePage();

// Title
let colors = ['pink', 'green', 'blue', 'yellow', 'purple', 'red'];
function generateTitle() {
	let title = document.querySelector('.header-title');
	let spans = title.querySelectorAll('span');
	let delay = 0;
	let colorIndex = 0;
	let titleLength = title.innerText.length;
	for (let span of spans) {
		let temp = '';
		for (let letter of span.innerText) {
			temp += `<span style="--primary: var(--${colors[colorIndex]}); animation-delay: -${titleLength-delay/10}s">${letter}</span>`;
			delay++;
			colorIndex++;
			if (colorIndex >= colors.length) {
				colorIndex = 0;
			}
		}
		span.innerHTML = temp;
	}
}
generateTitle();