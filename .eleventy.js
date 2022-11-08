// https://mahmoudashraf.dev/blog/how-to-optimize-and-lazyloading-images-on-eleventy/
// https://github.com/verlok/vanilla-lazyload/

const Image = require("@11ty/eleventy-img");

module.exports = function(config) {

	config.addPassthroughCopy("static/**/*.js");
	config.addPassthroughCopy("static/**/*.css");
	config.addPassthroughCopy("static/cgpicon.png");

	// Resize images and send to static directory
	config.addAsyncShortcode("image", async function (src, alt){
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

		const fullSize = `${config.getFilter("url")(stats["jpeg"][stats["jpeg"].length - 1].url)}`;
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
			data-height="${selectedSrc.height}">`;
	
		return `<picture>
			${source}
			<a href="javascript:showInModal('${fullSize}', '${alt}')">${img}</a>
		</picture>`;
	});

	return {
		pathPrefix: "/website/",
	};
}