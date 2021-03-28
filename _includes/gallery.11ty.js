exports.data = {
    layout: "main.11ty.js",
};

exports.render = function(data) {
    return `
    <div class="gallery" id="id_gallery">
        ${data.content}
    </div>
    <script language="javascript" src="/static/gallery.js"></script>
    <script type="module" async>
        import Lazyload from "https://cdn.skypack.dev/vanilla-lazyload";
        const lazyload = new Lazyload();
    </script>
    `;
};

module.exports = exports;