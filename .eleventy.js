// https://mahmoudashraf.dev/blog/how-to-optimize-and-lazyloading-images-on-eleventy/
// https://github.com/verlok/vanilla-lazyload/
// https://github.com/benjaminrancourt/eleventy-plugin-files-minifier/blob/main/src/files-minifier.js

const Image = require("@11ty/eleventy-img");
const htmlmin = require("html-minifier");
const CleanCSS = require("clean-css");
const { minify } = require("terser");
const isProduction = typeof process.env.NODE_ENV === "string" && process.env.NODE_ENV === "production";

module.exports = function(config) {
	config.addPassthroughCopy("static/cgpicon.png");
	config.addPassthroughCopy("static/GitHub-Mark*-64px.png");
	config.addPassthroughCopy("static/In-Blue-128.png");
	config.addPassthroughCopy("static/resume.pdf");

	// Minify HTML, CSS and JS
	config.addTransform("files-minifier", async function (value, outputPath) {
		if (!isProduction)
		{
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
	config.addPairedAsyncShortcode("image", async function (content, src, alt, wrapperFields) {
		if (!alt) {
			throw new Error(`Missing \`alt\` on image from: ${src}`);
		}

		let stats = await Image(src, {
			widths: [100, 640, 1024, 2048],
			urlPath: "/static/images/",
			outputDir: "./_site/static/images/",
		});

		let selectedSrc = stats["jpeg"][0];

		const srcset = Object.keys(stats).reduce(
			(acc, format) => ({
				...acc,
				[format]: stats[format].reduce(
					function(_acc, curr) {
						let url = `${config.getFilter("url")(curr.srcset)}`;
						return `${_acc} ${url} ,`;
					},
				""),
			}),
			{}
		);

		const largestSrc = stats["jpeg"][stats["jpeg"].length - 1];
		const srcUrl = `${config.getFilter("url")(selectedSrc.url)}`;
		const source = `<source type="image/webp" data-srcset="${srcset["webp"]}" >`;

		const img = `<img
			class="lazy"
			alt="${alt}"
			src="${srcUrl}"
			data-src="${srcUrl}"
			data-srcset="${srcset["jpeg"]}"
			width="${selectedSrc.width}"
			height="${selectedSrc.height}"
			data-width="${selectedSrc.width}"
			data-height="${selectedSrc.height}"
			data-maxWidth="${largestSrc.width}"
			data-maxHeight="${largestSrc.height}">`;
	
		return `<a ${wrapperFields} 
			class="modal-image"
			data-modalSrc="${config.getFilter("url")(largestSrc.url)}"
			data-modalAlt="${alt}"
			data-modalTarget="modal">
			<div class="image-wrapper">
			<div class="image-overlay">
				${content}
			</div>
			<picture>
				${source}
				${img}
			</picture>
		</div></a>`;
	});

	config.addShortcode("enumerate", function(list) {
		return list.map(function(value, i) {
			value = i == 0 ? value.charAt(0).toUpperCase() + value.slice(1) : value;
			return i != list.length - 1 ? value + ", " : value + "."
		}).join("");;
	});

	return {
		pathPrefix: "/website/",
	};
}