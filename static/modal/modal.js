var modals = document.getElementsByClassName("modal");

for (let modal of modals)
{
    var background = modal.querySelector(".background");
    var modalImg = modal.querySelector(".modal-content");
    var captionText = modal.querySelector(".modal-caption");
    
    function showInModal(src, alt) {
        modalImg.src = src;
        captionText.innerHTML = alt;
        modalImg.onload = function () {
            modal.classList.remove("hidden");
            modal.classList.add("displayed");
        }
    }
    
    var span = modal.querySelector(".close");
    span.onclick = function() {
        modal.classList.remove("displayed");
        modal.classList.add("hidden");
    }
    
    background.onclick = span.onclick;
}