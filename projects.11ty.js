exports.data = {
    layout: "layouts/gallery.njk",
}

exports.render = async function(data) {
    let projects = await Promise.all(data.collections.project.reverse().map(async function (project) {
        if (project.data.thumbnail) {
            const img = await exports.image("static/images/" + project.data.thumbnail, project.data.blurb);
            return `<a href="${exports.url(project.url)}">${img}</a>`;
        }
    })).then(function (projects) {
        return projects.join("\n");
    });

    return `${projects}`;
}

module.exports = exports;