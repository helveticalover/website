var modals = document.getElementsByClassName("modal");

for (let modal of modals)
{
    var background = modal.querySelector(".modal-background");
    var modalImg = modal.querySelector(".modal-img");
    var captionText = modal.querySelector(".modal-caption");
    
    function showInModal(src, alt) {
        modalImg.src = src;
        captionText.innerHTML = alt;
        modalImg.onload = function () {
            modal.classList.remove("hidden");
            modal.classList.add("displayed");
        }
    }
    
    var span = modal.querySelector(".modal-close");
    span.onclick = function() {
        modal.classList.remove("displayed");
        modal.classList.add("hidden");
    }
    
    background.onclick = span.onclick;
}