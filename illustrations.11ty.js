exports.data = {
    layout: "gallery.11ty.js",
}

exports.render = async function(data) {
    const lazyLoadImage = async (img) => await this.image("static/images/" + img.src, img.alt);
    return Promise.all(data["illustrations"].map((img) => lazyLoadImage(img)))
        .then((illustrations) => illustrations.join("\n\t\t"));
}

module.exports = exports;