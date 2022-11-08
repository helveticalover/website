exports.data = {
    layout: "main.njk",
}

exports.render = async function(data) {
    let projects = await Promise.all(data.collections.project.map(async function (project) {
        if (project.data.thumbnail)
        {
            let img = await exports.image("static/images/" + project.data.thumbnail, project.data.blurb);
            return `<li><a href="${exports.url(project.url)}">${img}</a></li>`;
        }
        else
        {
            return `<li><a href="${exports.url(project.url)}">${project.data.title}</a></li>`;
        }
    })).then(function (projects) {
        return projects.join("\n");
    });
    return `<ul>
        ${projects}
    </ul>`;
}

module.exports = exports;