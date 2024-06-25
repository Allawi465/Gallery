export function draggableSections() {
    $(".draggable_section").each(function (index) {
        let sectionEl = $(this);
        let canvasEl = $(this).find(".draggable_canvas");
        let handleClass = "draggable_list";
        let listEl = $(this).find("." + handleClass);
        let itemClass = ".draggable_item";
        let itemEl = $(this).find(".draggable_item");
        let scaleEl = $(this).find(".draggable-scale");
        let itemOpacity = itemEl.css("opacity");
        let columnCount = 5;
        let maxItems = columnCount * columnCount;

        // Function to adjust number of items in grid
        function adjustItems() {
            if (itemEl.length % columnCount === 0) {
                itemEl.last().remove();
                itemEl = $(this).find(itemClass);
            }

            // store totalItems
            let totalItems = itemEl.length;
            // if totalItems exceeds maxItems allowed in our grid, remove the extra items
            for (let i = maxItems; i < totalItems; i++) {
                itemEl.eq(i).remove();
            }
            // if totalItems is less than maxItems in our grid
            while (totalItems < maxItems) {
                // fill in extra spaces with clones of original items
                itemEl.each(function (index) {
                    if (totalItems < maxItems) {
                        $(this).clone().appendTo(listEl);
                        totalItems = totalItems + 1;
                    }
                });
            }
            // update itemEl var include the new clones
            itemEl = $(this).find(itemClass);

            // set sizes on listEl and items
            gsap.set(listEl, { width: columnCount * 100 + "%", height: columnCount * 100 + "%" });
            gsap.set(itemEl, { width: 100 / columnCount + "%", height: 100 / columnCount + "%" });
        }

        // Initial adjustments
        adjustItems();

        // GSAP timeline for dragging effects
        let pressTl = gsap.timeline({
            paused: true,
            defaults: {
                duration: 0.7
            }
        });
        gsap.fromTo(canvasEl, { opacity: 0 }, { opacity: 1 });

        let images = $(this).find(".draggable_img");
        pressTl.fromTo(images, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }, { clipPath: "polygon(2% 2%, 98% 2%, 98% 98%, 2% 98%)" });
        pressTl.to(scaleEl, { scale: 1.1 }, "<");

        // Function to handle slide activation
        function makeSlideActive(x, y) {
            let xValue = Math.round(x * (columnCount - 1)) + 1;
            let yValue = Math.round(y * (columnCount - 1)) + 1;
            let activeIndex = (yValue - 1) * columnCount + xValue - 1;
            let activeItem = itemEl.eq(activeIndex);
            gsap.to(activeItem, { opacity: 1, duration: 0.3 });
        }

        // Initialize Dragdealer slider
        let slider = new Dragdealer(canvasEl[0], {
            handleClass: handleClass,
            x: 0.5,
            y: 0.5,
            steps: columnCount,
            horizontal: true,
            vertical: true,
            speed: 0.05,
            loose: false,
            slide: true,
            requestAnimationFrame: true,
            dragStartCallback: function (x, y) {
                sectionEl.addClass("is-grabbing");
                pressTl.play();
            },
            dragStopCallback: function (x, y) {
                sectionEl.removeClass("is-grabbing");
                pressTl.reverse();
            },
            callback: function (x, y) {
                makeSlideActive(x, y);
            }
        });

        // Generate positions for autoplay
        let gridPositions = [];
        for (let y = 0; y < columnCount; y++) {
            for (let x = 0; x < columnCount; x++) {
                gridPositions.push({ x: x / (columnCount - 1), y: y / (columnCount - 1) });
            }
        }

        // Autoplay functionality
        let autoplayInterval = 7000; // Adjust as needed
        let autoplayIntervalId;

        function autoPlaySlider() {
            // Get a random position from the grid
            let randomIndex = Math.floor(Math.random() * gridPositions.length);
            let position = gridPositions[randomIndex];

            // Use GSAP to animate the slider values
            gsap.to(slider, {
                duration: 1.5, // Adjust duration for smoothness
                ease: "power2.inOut",
                onUpdate: () => {
                    slider.setValue(position.x, position.y);
                },
                onComplete: () => {
                    makeSlideActive(position.x, position.y); // Update active slide after animation completes
                }
            });

            // Trigger the pressTl timeline for autoplay
            sectionEl.addClass("is-grabbing");
            pressTl.play();
            setTimeout(() => {
                sectionEl.removeClass("is-grabbing");
                pressTl.reverse();
            }, 1000); // Adjust the duration as needed
        }

        function startAutoplay() {
            autoplayIntervalId = setInterval(autoPlaySlider, autoplayInterval);
        }

        function stopAutoplay() {
            clearInterval(autoplayIntervalId);
        }

        // Start autoplay initially
        startAutoplay();

        // Pause autoplay on user interaction
        canvasEl.on("mousedown touchstart", function () {
            stopAutoplay();
            pressTl.play();
        });

        // Resume autoplay when user stops interacting
        canvasEl.on("mouseup touchend", function () {
            startAutoplay();
            pressTl.reverse();
        });

        // Ensure initial active slide
        makeSlideActive(slider.getValue()[0], slider.getValue()[1]);
    });
}


/* export function draggableSections(autoplayInterval = 3000) {
    $(".draggable_section").each(function () {
        let sectionEl = $(this);
        let canvasEl = $(this).find(".draggable_canvas");
        let handleClass = "draggable_list";
        let listEl = $(this).find("." + handleClass);
        let itemClass = ".draggable_item";
        let textEl = $(this).find(".draggable_title_text");
        let itemEl = $(this).find(".draggable_item");
        let scaleEl = $(this).find(".draggable-scale");
        let itemOpacity = itemEl.css("opacity");
        let columnCount = 5;
        let maxItems = columnCount * columnCount;

        if (itemEl.length % columnCount === 0) {
            itemEl.last().remove();
            itemEl = $(this).find(itemClass);
        }

        let totalItems = itemEl.length;
        for (let i = maxItems; i < totalItems; i++) {
            itemEl.eq(i).remove();
        }
        while (totalItems < maxItems) {
            itemEl.each(function () {
                if (totalItems < maxItems) {
                    $(this).clone().appendTo(listEl);
                    totalItems++;
                }
            });
        }
        itemEl = $(this).find(itemClass);

        gsap.set(listEl, { width: columnCount * 100 + "%", height: columnCount * 100 + "%" });
        gsap.set(itemEl, { width: 100 / columnCount + "%", height: 100 / columnCount + "%" });
        gsap.fromTo(canvasEl, { opacity: 0 }, { opacity: 1 });

        let images = $(this).find(".draggable_img");
        let pressTl = gsap.timeline({ paused: true, defaults: { duration: 0.4 } });
        pressTl.fromTo(images, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }, { clipPath: "polygon(2% 2%, 98% 2%, 98% 98%, 2% 98%)" });
        pressTl.to(scaleEl, { scale: 1.1 }, "<");
        pressTl.to(textEl, { filter: "blur(30px)", opacity: 0, yPercent: 100 }, "<");

        function makeSlideActive(x, y) {
            let xValue = Math.round(x * (columnCount - 1)) + 1;
            let yValue = Math.round(y * (columnCount - 1)) + 1;
            let activeIndex = (yValue - 1) * columnCount + xValue - 1;
            let activeItem = itemEl.eq(activeIndex);
            textEl.text(activeItem.find(".draggable_title").text());
            gsap.to(activeItem, { opacity: 1, duration: 0.3 });

            let centerX = (columnCount / 2 - xValue) * 100 / columnCount;
            let centerY = (columnCount / 2 - yValue) * 100 / columnCount;

            gsap.to(listEl, { xPercent: centerX, yPercent: centerY, duration: 0.3 });
        }

        let slider = new Dragdealer(canvasEl[0], {
            handleClass: handleClass,
            x: 0.5,
            y: 0.5,
            steps: columnCount,
            horizontal: true,
            vertical: true,
            speed: 0.1,
            loose: false,
            slide: true,
            requestAnimationFrame: true,
            dragStartCallback: function () {
                sectionEl.addClass("is-grabbing");
                gsap.to(itemEl, { opacity: itemOpacity, duration: 0.15 });
                pressTl.play();
            },
            dragStopCallback: function () {
                sectionEl.removeClass("is-grabbing");
                pressTl.reverse();
            },
            callback: function (x, y) {
                makeSlideActive(x, y);
            }
        });

        function autoPlaySlider() {
            let currentValue = slider.getValue();
            let nextX = currentValue[0] + 1 / columnCount; // Adjust the step size as needed
            if (nextX > 1) {
                nextX = 0; // Restart from the beginning when reaching the end
            }
            slider.setValue(nextX, currentValue[1], true); // Set true to animate the slider
        }

        let autoplayIntervalId = setInterval(autoPlaySlider, autoplayInterval);

        // Pause autoplay when user interacts with the slider
        canvasEl.on("mousedown touchstart", function () {
            clearInterval(autoplayIntervalId);
        });

        // Resume autoplay when user stops interacting with the slider
        canvasEl.on("mouseup touchend", function () {
            autoplayIntervalId = setInterval(autoPlaySlider, autoplayInterval);
        });

        // Initial call to makeSlideActive to update text and opacity
        makeSlideActive(slider.getValue()[0], slider.getValue()[1]);
    });
} */