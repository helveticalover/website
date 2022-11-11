exports.data = {
    layout: "layouts/gallery.njk",
}

exports.render = async function(data) {
    let style = `<style>
    .image-wrapper .image-overlay {
        background-color: rgb(255, 255, 255);
        background-color: rgba(255, 255, 255, 0.7);
        opacity: 0;
        transition: opacity 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .image-wrapper:hover .image-overlay {
        opacity: 1;
    }
    .image-wrapper .image-overlay > div {
        padding: 50px;
        max-width: 500px;
    }
    </style>`
    let projects = await Promise.all(data.collections.project.reverse().map(async function (project) {
        let overlayContent = `<div>
            <h1>${project.data.title}</h1>
            <p>${project.data.blurb}<br/><i>${project.data.tools}</i></p>
        </div>`;
        if (project.data.thumbnail) {
            const img = await exports.image(overlayContent, "static/images/" + project.data.thumbnail, project.data.blurb);
            return `<a href="${exports.url(project.url)}">${img}</a>`;
        }
    })).then(function (projects) {
        return projects.join("\n");
    });

    return `${style}
    ${projects}`;
}

module.exports = exports;