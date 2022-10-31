const TARGET_HEIGHT = 350;

sizeGalleries();
window.addEventListener('resize', (e) => sizeGalleries());

function sizeGalleries()
{
    const galleries = document.getElementsByClassName("gallery");
    for (let gallery of galleries)
    {
        sizeImages(gallery);
    }
}

// Images are scaled to the same height and added to a row until they surpass
// the target row width. Then each row is scaled to the target row width.
function sizeImages(container)
{
    console.log("=== RESIZING IMAGES ===");

    // TODO: move this to a config
    let p = 10;

    let rect = container.getBoundingClientRect();
    let R;
    if (rect.width)
    {
        R = Math.floor(rect.width);
    }
    else
    {
        R = Math.floor(rect.right - rect.left);
    }

    console.log("Target row width: ", R);

    let sumr = [];
    sumr[0] = {
        sum: 0,
        images: [],
    };
    let dat = sumr[sumr.length - 1];

    let imgs = container.getElementsByTagName("img");
    for (let img of imgs)
    {
        let h = img.dataset.height;
        let w = img.dataset.width;
        let w_h = w / h;
        let sum_1 = dat.sum + w_h;

        if (dat.images.length > 0 && TARGET_HEIGHT * sum_1 > R)
        {
            console.log("Finished row: ", dat.images.length, dat.sum * TARGET_HEIGHT);
            dat = {};
            dat.sum = w_h;
            dat.images = [img];
            sumr.push(dat);
        }
        else
        {
            dat.sum += w_h;
            dat.images.push(img);
        }
    }

    console.log("Finished row: ", dat.images.length, dat.sum * TARGET_HEIGHT);

    for (let dat of sumr)
    { 
        let R_1 = R - 2 * dat.images.length * p;

        for (let img of dat.images)
        {
            let h = img.dataset.height;
            let w = img.dataset.width;

            let num = R_1 * w;
            let div = h * dat.sum;
            let w_1 = num / div;
            let h_1 = w_1 * h / w;

            console.log(w_1, h_1);

            img.width = w_1;
            img.height = h_1;
            img.style.padding = p + "px";
        }
    }
}