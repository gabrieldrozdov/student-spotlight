const fs = require('fs');
const puppeteer = require('puppeteer');
const data = require('./data.json');

async function fetchPreviewImage(url, dir, name) {
	let safeName = name.toLowerCase().replace(/\s+/g, "-").replace(/[<>:"/\\|?*\x00-\x1F]/g, '').trim();
	let browser;
	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage({
			headless: 'new', // or true
		});

		// Set viewport dimensions
		await page.setViewport({
			width: 1600,
			height: 900,
		});

		await page.goto(url);

		await new Promise(resolve => setTimeout(resolve, 2000));
		
		await page.screenshot({ path: `${dir}/${safeName}.jpg`});
	
		await browser.close();
	} catch (err) {
		console.error('Navigation timeout:', `${dir}/${safeName}.jpg`);
	} finally {
		if (browser) {
			await browser.close();
		}
	}
};

// Metadata
const meta = `
	<meta name="author" content="GD with GD">
	<meta name="keywords" content="Teaching, Pedagogy, Graphic Design, Web Design, Web Development, Creative Coding, Branding, Visual Identity">
	<meta name="description" content="TODO">
	<meta property="og:url" content="https://spotlight.gdwithgd.com/">
	<meta name="og:title" property="og:title" content="Student Spotlight">
	<meta property="og:description" content="TODO">
	<meta property="og:image" content="/assets/meta/opengraph.png">
	<link rel="icon" type="png" href="/assets/meta/favicon.png"></link>
`;

function generatePages() {
	let homeMenuHTML = '';

	// Generate menu
	let menuHTML = "";
	for (let entry of data) {
		// Skip if not active
		if (!entry['active']) {
			continue
		}

		let dir = entry['slug'];
		const projectData = require(`./assets/data/${entry['slug']}.json`);
		let numberOfProjects = projectData.length;

		menuHTML += `
			<a href="/${dir}/" class="nav-menu-link">
				<div class="nav-menu-link-subtitle">${entry['subtitle']}</div>
				<div class="nav-menu-link-title">${entry['title']}</div>
				<div class="nav-menu-link-projects">${numberOfProjects} student projects</div>
			</a>
		`;

		homeMenuHTML += `
			<a href="/${dir}/" class="home-menu-link">
				<div class="home-menu-link-info-container">
					<div class="home-menu-link-info">
						<div class="home-menu-link-subtitle">${entry['subtitle']}</div>
						<h2 class="home-menu-link-title">${entry['title']}</h2>
						<div class="home-menu-link-projects">${numberOfProjects} student projects</div>
					</div>
				</div>
				<div class="home-menu-link-previews" data-key="${dir}"></div>
			</a>
		`;
	}

	for (let entry of data) {
		// Skip if not active
		if (!entry['active']) {
			continue
		}

		// Fetch data
		const projectData = require(`./assets/data/${entry['slug']}.json`);
		let dir = entry['slug'];

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

				// Fetch preview if not fetched before
				let imageName = embedKey.toLowerCase().replace(/\s+/g, "-").replace(/[<>:"/\\|?*\x00-\x1F]/g, '').trim();
				if (!fs.existsSync(`./${dir}/${id}-${imageName}.jpg`)){
					fetchPreviewImage(student['embeds'][embedKey], dir, id+"-"+embedKey);
				}

				let embedData = student['embeds'][embedKey];
				embeds += `
					<div class="student-embed-container">
						<div class="student-embed-content">
							<a class="student-embed" href="${embedData}" target="_blank">
								<div class="student-embed-preview">
									<img class="student-embed-preview-thumbnail" src="${id}-${imageName}.jpg">
									<iframe class="student-embed-preview-iframe" data-src="${embedData}"></iframe>
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
						<h3 class="student-info-name"><a href="#${id}">${student['name']}</a></h3>
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
			indexHTML += `<a href="#${id}" class="index-link" data-init="0">${student['name']}</a>`;
		}

		// Info
		let infoBasic = '';
		for (let item of entry['infoBasic']) {
			infoBasic += `<div class="header-info-sidebar-item">${item}</div>`;
		}

		let infoLinks = '';
		for (let item of entry['infoLinks']) {
			infoLinks += `<a href="${item[1]}" class="header-info-sidebar-link" target="_blank">${item[0]}</a>`;
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
					<div class="nav">
						<a class="nav-logo" href="/">Student<br>Spotlight!</a>
						<div class="nav-spacer"></div>
						<button class="nav-toggle" onclick="toggleMenu()">Menu</button>
						<button class="nav-toggle nav-students" onclick="toggleIndex()">Students</button>
					</div>

					<nav class="nav-menu" data-active="0">
						<div class="nav-menu-links">
							${menuHTML}
						</div>
						<button class="nav-menu-close" onclick="toggleMenu()">Close<br>Menu</button>
					</nav>
			
					<div class="index" data-active="0">
						${indexHTML}
					</div>
			
					<header class="header">
						<div class="header-subtitle-container">
							<div class="header-subtitle">${entry['subtitle']}</div>
						</div>
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
						${studentsHTML}
					</main>
					
					<footer class="footer">
						<a href="#">Jump back to the top!</a>
						<a href="/">Check out more student projects!</a>
						<a href="https://gdwithgd.com/" target="_blank">More from GD with GD!</a>
					</footer>
				</div>

				<script src="/project.js"></script>
			</body>
			</html>
		`;

		// Check if directory already exists
		// If not, create directory
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}

		// Create index file in directory
		fs.writeFile(`${dir}/index.html`, projectHTML, err => {
			if (err) {
				console.error(err);
			}
		});
	}

	// Create homepage
	let homepageHTML = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Student Spotlight</title>
			<link rel="stylesheet" href="/style.css">
			${meta}
		</head>
		<body>
			<div class="home">
				<header class="home-header">
					<div class="home-header-title-container">
						<h1 class="home-header-title">
							<a class="home-header-title-small" href="https://gdwithgd.com/" target="_blank">GD with GD</a>
							<span class="home-header-title-big">Student<br>Spotlight</span>
						</h1>
					</div>
					<div class="home-header-desc-container">
						<p class="home-header-desc">
							Welcome to the GD with GD Student Spotlight! On this site, you’ll find projects completed by students during courses taught by <a href="https://gabrieldrozdov.com/" target="_blank">Gabriel Drozdov</a>, A.K.A. <a href="https://gdwithgd.com/" target="_blank">GD with GD</a>. Find all of my courses and assignments at the <a href="https://classroom.gdwithgd.com/" target="_blank">GD with GD Classroom</a>!
						</p>
					</div>
				</header>

				<nav class="home-menu" data-active="0">
					${homeMenuHTML}
				</nav>

				<footer class="home-footer">
					<p>
						Interested in learning more about graphic design, typography, and web development? Check out <a href="https://gdwithgd.com/" target="_blank">GD with GD</a> for more resources!
					</p>
					<p>
						If your work is featured on this site and you’d like it to be removed, please <a href="mailto:gabriel@noreplica.com" target="_blank">send me an email</a> and I’ll update the site!
					</p>
				</footer>
			</div>

			<script src="/home.js"></script>
		</body>
		</html>
	`;
	fs.writeFile(`index.html`, homepageHTML, err => {
		if (err) {
			console.error(err);
		}
	});
}
generatePages();