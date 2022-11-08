exports.data = {
    layout: "main.njk",
}

exports.render = function(data) {
    return `<ul>
        ${data.collections.project.map(function (project) {
            return `<li><a href="${exports.url(project.url)}">${project.data.title}</li></a>`
        }).join("\n")}
    </ul>`;
}

module.exports = exports;