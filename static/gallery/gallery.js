class Gallery {
    #targetHeight = 400;
    constructor(targetHeight) {
        this.#targetHeight = targetHeight;
        window.addEventListener('resize', (e) => this.sizeGalleries());
        this.sizeGalleries();
        this.sizeGalleries();
    }

    sizeGalleries()
    {
        const galleries = document.getElementsByClassName("gallery");
        for (let gallery of galleries)
        {
            this.sizeImages(gallery);
        }
    }

    sizeImages(container)
    {
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
            this.#calculateScaledRows(sumr, R);

            let samples = sumr.map((dat) => dat.scaledHeight);
            let newDeviation = this.#getDeviation(samples, this.#targetHeight);

            // If adding image to row increases deviation, add it to new row
            if (newDeviation > deviation)
            {
                dat.sum -= w_h;
                dat.images.pop();

                dat = {};
                dat.sum = w_h;
                dat.images = [img];
                sumr.push(dat);

                this.#calculateScaledRows(sumr, R);
                samples = sumr.map((dat) => dat.scaledHeight);
                newDeviation = this.#getDeviation(samples, this.#targetHeight);
            }

            deviation = newDeviation;
        }

        this.#scaleRowsToTarget(sumr);
    }

    #calculateScaledRows(rows, R)
    {
        for (let dat of rows)
        { 
            let margin = this.#parseSize(this.#getPadding().left);
            let R_1 = R - 2 * dat.images.length * margin;

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

    #scaleRowsToTarget(rows)
    {
        for (let dat of rows)
        { 
            for (let img of dat.images)
            {
                img.height = dat.scaledHeight;

                let margin = this.#getPadding();
                img.style.marginLeft = margin.left;
                img.style.marginRight = margin.left;
                img.style.marginTop = margin.top;
                img.style.marginBottom = margin.top;
            }
        }
    }

    #getPadding()
    {
        let marginLeft = getComputedStyle(document.documentElement).getPropertyValue('--gallery-margin-left');
        let marginTop = getComputedStyle(document.documentElement).getPropertyValue('--gallery-margin-top');
        return {
            top: marginTop ? marginTop : "0px",
            left: marginLeft ? marginLeft : "0px",
        };
    }

    #parseSize(str)
    {
        str = str.replace(/\s/g, "");
        return parseInt(str.substring(0, str.length - 2));
    }

    #getMean(samples)
    {
        let sum = 0;
        let N = samples.length;
        for (let x of samples)
        {
            sum += x;
        }
        return sum / N;
    }

    #getDeviation(samples, mean)
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
}