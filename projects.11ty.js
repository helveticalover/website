exports.data = {
    layout: "gallery.njk",
}

exports.render = async function(data) {
    let overlays = [];

    let projects = await Promise.all(data.collections.project.map(async function (project) {
        if (project.data.thumbnail) {
            return await exports.image("static/images/" + project.data.thumbnail, project.data.blurb);
        }
    })).then(function (projects) {
        return projects.join("\n");
    });

    return `${projects}`;
}

module.exports = exports;