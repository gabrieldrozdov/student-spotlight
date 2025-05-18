const fs = require('fs');
const puppeteer = require('puppeteer');
const data = require('./data.json');

// (async () => {
// 	const browser = await puppeteer.launch(); // use `{ headless: "new" }` for newer Chromium behavior
// 	const page = await browser.newPage();

// 	await page.goto('https://example.com', { waitUntil: 'networkidle2' });

// 	await page.screenshot({ path: 'screenshot.png', fullPage: true });

// 	await browser.close();
// })();

// Metadata
const meta = `
	<meta name="author" content="No Replica">
	<meta name="keywords" content="Graphic Design, Web Design, Web Development, Creative Coding, Branding, Visual Identity, Studio, Agency">
	<meta name="description" content="A new studio merging design and development to craft bespoke digital experiences.">
	<meta property="og:url" content="https://noreplica.com/">
	<meta name="og:title" property="og:title" content="No Replica">
	<meta property="og:description" content="A new studio merging design and development to craft bespoke digital experiences.">
	<meta property="og:image" content="/assets/meta/opengraph.png">
	<link rel="icon" type="png" href="/assets/meta/favicon.png"></link>
`;

function generatePages() {
	for (let entry of data) {
		// Skip if not active
		if (!entry['active']) {
			continue
		}

		// Fetch data
		const projectData = require(`./assets/data/${entry['slug']}.json`);

		// Students
		let studentsHTML = '';
		let indexHTML = '';
		for (let student of projectData) {
			let id = student['name'].toLowerCase().replace(/\s+/g, "-");

			// Links
			let links = '';
			for (let linkData of student['links']) {
				links += `<a class="student-info-link" href="${linkData['url']}" target="_blank">${linkData['name']}</a>`;
			}

			// Embeds
			let embeds = '';
			for (let embedKey in student['embeds']) {
				let embedData = student['embeds'][embedKey];
				embeds += `
					<div class="student-embed-container">
						<div class="student-embed-content">
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
			studentsHTML += `
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
			indexHTML += `<a href="#${id}" class="index-link" data-init="0">${studentData['name']}</a>`;
		}

		// Info
		let infoBasic = '';
		for (let item of entry['infoBasic']) {
			infoBasic += `<div class="header-info-sidebar-item">${item}</div>`;
		}

		let infoLinks = '';
		for (let item of entry['infoLinks']) {
			infoLinks += `<a href="${item[1]}">${item[0]}</a>`;
		}

		let projectHTML = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Student Spotlight | ${entry['title']}</title>
				<link rel="stylesheet" href="/style.css">
				${meta}
			</head>
			<body>
				<div class="container">
					<a class="return" href="/">More<br>Projects</a>
			
					<nav class="index" data-active="0">
						${indexHTML}
					</nav>
			
					<header class="header">
						<div class="header-subtitle">Student Spotlight!</div>
						<h1 class="header-title">${entry['title']}</h1>
						<div class="header-info">
							<div class="header-info-sidebar">
								<div class="header-info-sidebar-section">
									<h2 class="header-info-sidebar-title">Info</h2>
									${infoBasic}
								</div>
			
								<div class="header-info-sidebar-section">
									<h2 class="header-info-sidebar-title">Links</h2>
									${infoLinks}
								</div>
							</div>
							<div class="header-info-desc">
								${entry['infoDesc']}
							</div>
							<div class="header-info-handle-1"></div>
							<div class="header-info-handle-2"></div>
							<div class="header-info-handle-3"></div>
							<div class="header-info-handle-4"></div>
						</div>
					</header>
					<main class="students">
						${students}
					</main>
				</div>
			
				<script src="/project.js"></script>
			</body>
			</html>
		`;

		// Check if directory already exists
		// If not, create directory
		let dir = key;
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}

		// Create index file in directory
		fs.writeFile(`${key}/index.html`, projectHTML, err => {
			if (err) {
				console.error(err);
			}
		});
	}
}
generatePages();