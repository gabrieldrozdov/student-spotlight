// GD with GD animation
let homeHeaderTitleSmall = document.querySelector('.home-header-title-small');
let temp = "";
let colors = ['pink', 'green', 'blue', 'yellow', 'purple', 'red'];
let colorIndex = 0;
for (let letter of homeHeaderTitleSmall.innerText) {
	if (letter == " ") {
		letter = "&nbsp;";
	} else {
		colorIndex++;
		if (colorIndex >= colors.length) {
			colorIndex = 0;
		}
	}
	temp += `<span style="--primary: var(--${colors[colorIndex]}); animation-delay: -${colorIndex/3}s">${letter}</span>`;
}
homeHeaderTitleSmall.innerHTML = temp;

// Title text shadow
setTimeout(function() {
	let homeHeaderTitleBig = document.querySelector('.home-header-title-big');
	let homeHeaderTitleBigShadow = `-0px 0px var(--black)`;
	for (let i=0; i<25; i++) {
		homeHeaderTitleBigShadow += `, -${i/200}em ${i/200}em var(--black)`;
		homeHeaderTitleBig.style.textShadow = homeHeaderTitleBigShadow;
	}
}, 500)

// Helper function to shuffle array
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

// Previews
let homeMenuLinkPreviews = document.querySelectorAll('.home-menu-link-previews');
for (let homeMenuLinkPreview of homeMenuLinkPreviews) {
	let key = homeMenuLinkPreview.dataset.key;
	fetch(`/assets/data/${key}.json`)
		.then((response) => response.json())
		.then((json) => {
			let temp = `<div class='home-menu-link-preview-group'>`;

			let shuffledJSON = shuffleArray(json);

			for (let student of shuffledJSON) {
				if (!student['active']) {
					continue
				}
				let embeds = student["embeds"];

				let randomEmbed = Object.keys(embeds)[Math.floor(Math.random()*Object.keys(embeds).length)];
				let randomEmbedSafe = randomEmbed.toLowerCase().replace(/\s+/g, "-").replace(/[<>:"/\\|?*\x00-\x1F]/g, '').trim();

				let safeName = student['name'].toLowerCase().replace(/\s+/g, "-").replace(/[<>:"/\\|?*\x00-\x1F]/g, '').trim();

				temp += `
					<div class="home-menu-link-preview" style="transform: rotate(${Math.random()*8-4}deg);">
						<img class="home-menu-link-preview-thumbnail" src="/${key}/${safeName+"-"+randomEmbedSafe+".jpg"}">
						<div class="home-menu-link-preview-handle-1"></div>
						<div class="home-menu-link-preview-handle-2"></div>
						<div class="home-menu-link-preview-handle-3"></div>
						<div class="home-menu-link-preview-handle-4"></div>
					</div>
				`;
			}
			temp += `</div>`;
			temp += temp;
			homeMenuLinkPreview.innerHTML += temp;
		})
}