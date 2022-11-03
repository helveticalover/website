const PADDING = 10;

function logElementEvent(eventName, element) {
    console.log(Date.now(), eventName, element.getAttribute("data-src"));
}

var callback_enter = function (element) {
    logElementEvent("🔑 ENTERED", element);
};
var callback_exit = function (element) {
    logElementEvent("🚪 EXITED", element);
};
var callback_loading = function (element) {
    logElementEvent("⌚ LOADING", element);
};
var callback_loaded = function (element) {
    logElementEvent("👍 LOADED", element);
};
var callback_error = function (element) {
    logElementEvent("💀 ERROR", element);
    element.src =
        "https://via.placeholder.com/440x560/?text=Error+Placeholder";
};
var callback_finish = function () {
    logElementEvent("✔️ FINISHED", document.documentElement);
};
var callback_cancel = function (element) {
    logElementEvent("🔥 CANCEL", element);
};

window.lazyLoadOptions = {
    threshold: 0,
    callback_enter: callback_enter,
    callback_exit: callback_exit,
    callback_cancel: callback_cancel,
    callback_loading: callback_loading,
    callback_loaded: callback_loaded,
    callback_error: callback_error,
    callback_finish: callback_finish
};

window.addEventListener(
"LazyLoad::Initialized",
	function (e) {
		console.log(e.detail.instance);
	},
	false
);

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
    const TARGET_HEIGHT = 500;

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

    let sumr = [];
    sumr[0] = {
        sum: 0,
        images: [],
    };
    let dat = sumr[sumr.length - 1];

    let deviation = Number.MAX_VALUE;
    let imgs = container.getElementsByTagName("img");
    for (let img of imgs)
    {
        let h = img.dataset.height;
        let w = img.dataset.width;
        let w_h = w / h;

        // Try add image to existing row
        dat.sum += w_h;
        dat.images.push(img);
        calculateScaledRows(sumr, R);

        let samples = sumr.map((dat) => dat.scaledHeight);
        let newDeviation = getDeviation(samples, TARGET_HEIGHT);

        // If adding image to row increases deviation, add it to new row
        if (newDeviation > deviation)
        {
            dat.sum -= w_h;
            dat.images.pop();

            console.log("Finished row: ", dat.images.length, dat.sum * TARGET_HEIGHT);
            dat = {};
            dat.sum = w_h;
            dat.images = [img];
            sumr.push(dat);

            calculateScaledRows(sumr, R);
            samples = sumr.map((dat) => dat.scaledHeight);
            newDeviation = getDeviation(samples, TARGET_HEIGHT);
        }

        deviation = newDeviation;
        console.log("Deviation", deviation);
    }
    // console.log(sumr);

    scaleRowsToTarget(sumr);

    return sumr;
}

function calculateScaledRows(rows, R)
{
    for (let dat of rows)
    { 
        let R_1 = R - 2 * dat.images.length * PADDING;

        for (let img of dat.images)
        {
            let h = img.dataset.height;
            let w = img.dataset.width;

            let num = R_1 * w;
            let div = h * dat.sum;
            let w_1 = Math.floor(num / div);
            let h_1 = Math.floor(w_1 * h / w);
            dat.scaledHeight = h_1;
        }
    }
}

function scaleRowsToTarget(rows)
{
    for (let dat of rows)
    { 
        for (let img of dat.images)
        {
            img.width = dat.scaledHeight * img.dataset.width / img.dataset.height;
            img.height = dat.scaledHeight;
            img.style.padding = PADDING + "px";
        }
    }
}

function getMean(samples)
{
    let sum = 0;
    let N = samples.length;
    for (let x of samples)
    {
        sum += x;
    }
    return sum / N;
}

function getDeviation(samples, mean)
{
    let denom = samples.length;
    let deviation = 0;
    for (let x of samples)
    {
        deviation = (x - mean) * (x - mean);
    }
    deviation /= (denom - 1);
    return Math.sqrt(deviation);
}