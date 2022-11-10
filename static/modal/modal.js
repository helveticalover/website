var modals = document.getElementsByClassName("modal");

for (let modal of modals)
{
    var background = modal.querySelector(".modal-background");
    var modalImg = modal.querySelector(".modal-img");
    var captionText = modal.querySelector(".modal-caption");
    
    var span = modal.querySelector(".modal-close");
    span.onclick = function() {
        modal.classList.remove("displayed");
        modal.classList.add("hidden");
    }
    
    background.onclick = span.onclick;
}

function showInModal(id) {
    const img = document.getElementById(id);
    const srcs = img.getAttribute("srcset").split(",");
    const largest = srcs[srcs.length - 2].match(/(\S*\b)/g)[0];
    
    for (let modal of modals)
    {
        const modalImg = modal.querySelector(".modal-img");
        const captionText = modal.querySelector(".modal-caption");

        modalImg.src = largest;
        captionText.innerHTML = img.alt;
        modalImg.onload = function () {
            modal.classList.remove("hidden");
            modal.classList.add("displayed");
        }
    }
}