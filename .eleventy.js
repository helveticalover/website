// https://mahmoudashraf.dev/blog/how-to-optimize-and-lazyloading-images-on-eleventy/
// https://github.com/verlok/vanilla-lazyload/
// https://github.com/benjaminrancourt/eleventy-plugin-files-minifier/blob/main/src/files-minifier.js
// https://github.com/luwes/lite-vimeo-embed

const Image = require("@11ty/eleventy-img");
const htmlmin = require("html-minifier");
const CleanCSS = require("clean-css");
const { minify } = require("terser");
const isProduction = typeof process.env.NODE_ENV === "string" && process.env.NODE_ENV === "production";

module.exports = function(config) {
	config.addPassthroughCopy("static/GitHub-Mark*-64px.png");
	config.addPassthroughCopy("static/In-Blue-128.png");
	config.addPassthroughCopy("static/resume.pdf");
	config.addPassthroughCopy("static/3d/*");
	config.addPassthroughCopy("static/previews/*");

	// Minify HTML, CSS and JS
	config.addTransform("files-minifier", async function (value, outputPath) {
		if (!isProduction) {
			return value;
		}

		const pathEndBy = (extension) => outputPath.includes(extension);

		// CSS
		if (pathEndBy(".css")) {
			return new CleanCSS({}).minify(value).styles;
		}
	
		// HTML
		if (pathEndBy(".html")) {
			const config = {
				collapseBooleanAttributes: true, // Omit attribute values from boolean attributes
				collapseWhitespace: true, // Collapse white space that contributes to text nodes in a document tree
				decodeEntities: true, // Use direct Unicode characters whenever possible
				html5: true, // Parse input according to HTML5 specifications
				minifyCSS: true, // Minify CSS in style elements and style attributes (uses clean-css)
				minifyJS: true, // Minify JavaScript in script elements and event attributes (uses UglifyJS)
				removeComments: true, // Strip HTML comments
				removeEmptyAttributes: true, // Remove all attributes with whitespace-only values
				removeEmptyElements: false, // Remove all elements with empty contents
				sortAttributes: true, // Sort attributes by frequency
				sortClassName: true, // Sort style classes by frequency
				useShortDoctype: true, // Replaces the doctype with the short (HTML5) doctype
			};

			return htmlmin.minify(value, config);
		}

		// JS
		try {
			const minified = await minify(value);
			return minified.code;
		} catch (err) {
			console.error("Terser error: ", err);
		}

		return value;
	});

	// Resize images and send to static directory
	let imageShortcode = async function (content, src, alt, wrapperFields, lazy = true) {
		if (!alt) {
			throw new Error(`Missing \`alt\` on image from: ${src}`);
		}

		const widths = lazy ? [100, 640, 1024] : [1024, "auto"];
		let stats = await Image("static/images/" + src, {
			widths: widths,
			urlPath: "/static/images/",
			outputDir: "./_site/static/images/",
		});

		const srcset = Object.keys(stats).reduce(
			(acc, format) => ({
				...acc,
				[format]: stats[format].reduce(
					function(_acc, curr) {
						let url = (_acc.length > 0 ? ", " : "") + `${config.getFilter("url")(curr.srcset)}`;
						return `${_acc}${url}`;
					},
				""),
			}),
			{}
		);

		srcset["sizes"] = stats["jpeg"].reduce(
			function(_acc, curr) {
				let size = (_acc.length > 0 ? ", " : "") + `${curr.width}w`;
				return `${_acc}${size}`;	
			},
		"");

		const selectedSrc = stats["jpeg"][0];
		const largestSrc = stats["jpeg"][stats["jpeg"].length - 1];
		const srcUrl = `${config.getFilter("url")(selectedSrc.url)}`;
		const source = `<source type="image/webp"
			${ lazy ? `` : `srcset="${config.getFilter("url")(stats["webp"][0].url)}"` }
			${ lazy ?
				`data-srcset="${srcset["webp"]}"
				 data-sizes="${srcset["sizes"]}"` : ``
			}>`;

		const img = `<img 
			${ lazy ? `class="lazy"` : `` }
			alt="${alt}"
			src="${srcUrl}"
			data-src="${srcUrl}"
			data-srcset="${srcset["jpeg"]}"
			data-sizes="${srcset["sizes"]}"
			width="${selectedSrc.width}"
			height="${selectedSrc.height}"
			data-width="${selectedSrc.width}"
			data-height="${selectedSrc.height}"
			data-maxWidth="${ lazy ? largestSrc.width : selectedSrc.width }"
			data-maxHeight="${ lazy ? largestSrc.height : selectedSrc.height }">`;

		wrapperFields = wrapperFields ? wrapperFields : "";
	
		return `<a ${wrapperFields} 
			class="modal-image"
			data-modalSrc="${config.getFilter("url")(largestSrc.url)}"
			data-modalAlt="${alt}"
			data-modalTarget="modal">
			<div class="media-wrapper">
			<div class="media-overlay">
				${content}
			</div>
			<picture>
				${source}
				${img}
			</picture>
		</div></a>`;
	};

	let embedShortcode = function (src, alt, lazy = true) {
		return `<div class="media-wrapper">
		<iframe 
		${ lazy ? 'class="lazy"' : '' }
		data-src="${src}"
		title="${alt}"
		frameborder="0"
		allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
		width="640"
		height="360"
		data-width="640"
		data-height="360"></iframe>
		</div>`;
	};

	let vimeoShortcode = async function(videoId) {
		let stats = await Image("static/images/" + videoId + ".jpg", {
			widths: [640],
			urlPath: "/static/images/",
			outputDir: "./_site/static/images/",
		});
		let thumbnail = stats["jpeg"][stats["jpeg"].length - 1];

		return `<style>
		lite-vimeo#vimeo${videoId} { background-image: url('${config.getFilter("url")(thumbnail.url)}') !important; }
		</style>
		<div class="media-wrapper">
		<lite-vimeo
		videoid="${ videoId }"
		width="640"
		height="360"
		data-width="640"
		data-height="360"
		id="vimeo${videoId}">
			<div class="ltv-playbtn"></div>
		</lite-vimeo>
		</div>`;
	};

	config.addPairedAsyncShortcode("image", imageShortcode);

	config.addShortcode("embed", embedShortcode);

	config.addAsyncShortcode("vimeo", vimeoShortcode);

	config.addPairedAsyncShortcode("media", async function (content, src, alt, wrapperFields, lazy = true) {
		if (/^(ftp|http|https):\/\/[^ "]+$/.test(src)) {
			if (/vimeo/.test(src)) {
				let videoId = /\/([0-9]+)$/.exec(src)[1];
				return await vimeoShortcode(videoId);
			}
			return embedShortcode(src, alt, lazy);
		}
		return await imageShortcode(content, src, alt, wrapperFields, lazy);
	});

	config.addPairedShortcode("scoped", function (content, scopeId) {
		let addScope = content.replace(/<style[^>]*>(.*)<\/style>/g, function (whole, styles) {
			let selectors = styles.replace(/([^;{}]+){([^}]*)}/g, function (whole, selector, properties) {
				return `#${scopeId} ${selector}{${properties}}`;
			});
			return `<style>${selectors}</style>`
		});
		return `<div id="${scopeId}">${addScope}</div>`;
	});

	config.addShortcode("preview", function(imgSrc) {
		if (!imgSrc) {
			return "";
		}
		return `<video autoplay loop muted playsinline>
		<source src="${config.getFilter("url")("/static/previews/" + imgSrc.substring(0, imgSrc.lastIndexOf(".")) + ".webm")}" type="video/webm" />
		<source src="${config.getFilter("url")("/static/previews/" + imgSrc.substring(0, imgSrc.lastIndexOf(".")) + ".mp4")}" type="video/mp4" />
		</video>`;
	});

	config.addShortcode("enumerate", function(list) {
		return list.map(function(value, i) {
			value = i == 0 ? value.charAt(0).toUpperCase() + value.slice(1) : value;
			return i != list.length - 1 ? value + ", " : value + "."
		}).join("");;
	});

	config.addFilter("year", function(date) {
		let d = new Date(date);
		if (!d) {
			return date;
		}
		return `${d.getFullYear()}`;
	});

	return {
		pathPrefix: "/website/",
	};
}