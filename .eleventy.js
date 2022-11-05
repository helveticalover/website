// https://mahmoudashraf.dev/blog/how-to-optimize-and-lazyloading-images-on-eleventy/
// https://github.com/verlok/vanilla-lazyload/

const Image = require("@11ty/eleventy-img");

module.exports = function(config) {

	config.addPassthroughCopy("static/*.js");
	config.addPassthroughCopy("static/cgpicon.png");

	// Resize images and send to static directory
	config.addShortcode("image", async function (src, alt){
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
					(_acc, curr) => `${_acc} ${curr.srcset} ,`,
					""
				),
			}),
			{}
		);

		const fullSize = stats["jpeg"][stats["jpeg"].length - 1].url;

		const source = `<source type="image/webp" data-srcset="${srcset["webp"]}" >`;

		const img = `<img
			class="lazy"
			alt="${alt}"
			src="${selectedSrc.url}"
			data-src="${selectedSrc.url}"
			data-srcset="${srcset["jpeg"]}"
			width="${selectedSrc.width}"
			height="${selectedSrc.height}"
			data-width="${selectedSrc.width}"
			data-height="${selectedSrc.height}"
			onclick="showInModal('${fullSize}', '${alt}')">`;
	
		return `<picture>
			${source}
			${img}
		</picture>`;
	});
}