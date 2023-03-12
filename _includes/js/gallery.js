class Gallery {
    #targetHeight = 500;
    #lastRowAllowance = 200;
    constructor(targetHeight) {
        this.#targetHeight = targetHeight ? targetHeight : this.#targetHeight;
        window.addEventListener('resize', () => this.sizeGalleries());
        if (document.readyState === "complete")
        {
            this.sizeGalleries();
        }
        window.addEventListener('DOMContentLoaded', () => {
            this.sizeGalleries();
        });
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
            media: [],
        };
        let dat = sumr[sumr.length - 1];

        let deviation = Number.MAX_VALUE;
        let wrappers = container.getElementsByClassName("media-wrapper");
        for (let wrapper of wrappers)
        {
            let md = wrapper.querySelector("picture>img, iframe, lite-vimeo");
            let h = md.dataset.height;
            let w = md.dataset.width;
            let w_h = w / h;

            // Try add image to existing row
            dat.sum += w_h;
            dat.media.push({
                content: md,
                wrapper: wrapper,
            });
            this.#calculateScaledRows(sumr, R);

            let samples = sumr.map((dat) => dat.scaledHeight);
            let newDeviation = this.#getDeviation(samples, this.#targetHeight);

            // If adding image to row increases deviation, add it to new row
            if (newDeviation > deviation)
            {
                dat.sum -= w_h;
                dat.media.pop();

                dat = {};
                dat.sum = w_h;
                dat.media = [{
                    content: md,
                    wrapper: wrapper,
                }];
                sumr.push(dat);

                this.#calculateScaledRows(sumr, R);
                samples = sumr.map((dat) => dat.scaledHeight);
                newDeviation = this.#getDeviation(samples, this.#targetHeight);
            }

            deviation = newDeviation;
        }

        if (dat.scaledHeight - this.#targetHeight > this.#lastRowAllowance)
        {
            dat.scaledHeight = this.#targetHeight + this.#lastRowAllowance;
        }
        this.#scaleRowsToTarget(sumr);
    }

    #calculateScaledRows(rows, R)
    {
        for (let dat of rows)
        { 
            let margin = this.#parseSize(this.#getItemMargin().left);
            let R_1 = R - 2 * (dat.media.length - 1) * margin;

            for (let md of dat.media)
            {
                let h = md.content.dataset.height;
                let w = md.content.dataset.width;

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
        let margin = this.#getItemMargin();
        for (let j = 0; j < rows.length; j++)
        { 
            let dat = rows[j];
            for (let i = 0; i < dat.media.length; i++)
            {
                let md = dat.media[i];
                let scaledHeight = dat.scaledHeight;
                md.wrapper.style.height = scaledHeight + "px";
                md.wrapper.style.width = (scaledHeight * md.content.dataset.width / md.content.dataset.height) + "px";
                md.wrapper.style.marginLeft = (i == 0 ? "0px" : margin.left);
                md.wrapper.style.marginRight = (i == dat.media.length - 1 ? "0px" : margin.left);
                md.wrapper.style.marginTop = (j == 1 ? "0px" : margin.top);
                md.wrapper.style.marginBottom = (j == rows.length ? "0px" : margin.top);
            }
        }
    }

    #getItemMargin()
    {
        let marginLeft = getComputedStyle(document.documentElement).getPropertyValue('--gallery-item-margin-left');
        let marginTop = getComputedStyle(document.documentElement).getPropertyValue('--gallery-item-margin-top');
        return {
            top: marginTop ? marginTop : "0px",
            left: marginLeft ? marginLeft : "0px",
        };
    }

    #parseSize(str)
    {
        str = str.replace(/\s/g, "");
        str = str.replace(/[A-Za-z]+$/g, "");
        return parseInt(str);
    }

    #getMaxImageHeight()
    {
        let vh = getComputedStyle(document.documentElement).getPropertyValue('--gallery-image-max-height');
        vh = vh.replace(/\s/g, "")
        vh = vh.replace(/[A-Za-z]+$/g, "");
        vh = parseInt(vh);
        return Math.round(window.innerHeight / (100 / vh));
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