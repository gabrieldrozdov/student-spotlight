const previewObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		let elmnt = entry.target;
		if (entry.isIntersecting) {
			let embedContent = elmnt.querySelector('.student-embed-content');
			setTimeout(() => {
				embedContent.style.transition = `${Math.random()*.5+.5}s cubic-bezier(0.22, 1, 0.36, 1)`;
				embedContent.style.transform = `scale(1) rotate(${Math.random()*6-3}deg) translateY(0%)`;
			}, 50);
			previewObserver.unobserve(elmnt);
		} else {
			// iframe.src = "";
		}
	});
});

// Animate in previews
for (let embed of document.querySelectorAll('.student-embed-container')) {
	let embedContent = embed.querySelector('.student-embed-content');
	embedContent.style.transform = `scale(0) rotate(${Math.random()*180-90}deg) translateY(${Math.random()*100}%)`;

	previewObserver.observe(embed);

	embed.addEventListener('mouseenter', () => {
		let iframe = embed.querySelector('iframe');
		iframe.src = iframe.dataset.src;
	})
	embed.addEventListener('mouseleave', () => {
		let iframe = embed.querySelector('iframe');
		iframe.src = "";
	})
}

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

// Animate in index
let indexDelay = 0;
for (let indexLink of document.querySelectorAll('.index-link')) {
	indexLink.addEventListener('click', closeIndex);
	setTimeout(() => {
		indexLink.dataset.init = 1;
	}, indexDelay*50)
	indexDelay++;
}

// Dynamic nav
for (let student of document.querySelectorAll('.student')) {
	studentObserver.observe(student);
}

// Title
let colors = ['pink', 'green', 'blue', 'yellow', 'purple', 'red'];
function generateTitle() {
	// Split into spans
	let title = document.querySelector('.header-title');
	let words = title.innerText.split(' ');
	let tempHTML = '';
	for (let word of words) {
		tempHTML += `<span>${word}</span> `;
	}
	title.innerHTML = tempHTML;

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

	title.style.transform = 'scale(1)';
}
generateTitle();

// Nav
function toggleMenu() {
	let menu = document.querySelector(".nav-menu");
	if (parseInt(menu.dataset.active) == 1) {
		menu.dataset.active = 0;
	} else {
		menu.dataset.active = 1;
	}
}
function toggleIndex() {
	let index = document.querySelector('.index');
	let indexToggle = document.querySelector('.nav-students');
	if (parseInt(index.dataset.active) == 1) {
		index.dataset.active = 0;
		indexToggle.dataset.active = 0;
	} else {
		index.dataset.active = 1;
		indexToggle.dataset.active = 1;
	}
}
function closeIndex() {
	let index = document.querySelector('.index');
	let indexToggle = document.querySelector('.nav-students');
	index.dataset.active = 0;
	indexToggle.dataset.active = 0;
}