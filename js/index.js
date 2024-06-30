import vers from "./animate/vers.js"
import animatSvg from "./animate/svg.js";

document.addEventListener("DOMContentLoaded", function () {
    const mainTimeline = gsap.timeline();
    const galleryTimeline = animateCanvas();
    const svgTimeline = animatSvg();
    const versTimeline = vers();

    mainTimeline.add(versTimeline, 0);
    mainTimeline.add(svgTimeline, 0);
    mainTimeline.add(galleryTimeline, svgTimeline.duration());

    document.querySelectorAll(".draggable_section").forEach(initDraggableSection);
});

let autoPlayTimeline;

function initDraggableSection(sectionEl) {
    const canvasEl = sectionEl.querySelector(".draggable_canvas");
    const listEl = sectionEl.querySelector(".draggable_list");
    const itemClass = ".draggable_item";
    const scaleEl = sectionEl.querySelector(".draggable-scale");
    let itemEl = sectionEl.querySelectorAll(itemClass);
    const columnCount = 5;
    const maxItems = columnCount * columnCount;

    adjustItemCount(sectionEl, listEl, itemEl, itemClass, columnCount, maxItems);
    setupGrid(listEl, columnCount);
    const pressTl = setupPressTimeline(sectionEl, scaleEl);
    itemEl = sectionEl.querySelectorAll(itemClass); // Re-query itemEl after adjustments
    const slider = initializeDragdealer(sectionEl, canvasEl, itemEl, columnCount, pressTl);

    // Ensure the middle item is active
    makeSlideActive(itemEl, 0.5, 0.5, columnCount);

    // Conditionally start autoplay
    if (!isTabletOrMobile()) {
        autoPlaySlider(slider, itemEl, columnCount, sectionEl);
    }

    // Add event listener for window resize to handle autoplay
    window.addEventListener('resize', () => {
        if (!isTabletOrMobile()) {
            stopAutoPlay();
        }
    }, { passive: true });
}

function isTabletOrMobile() {
    return window.innerWidth <= 1024; // Adjust this value based on your specific requirements
}

function adjustItemCount(sectionEl, listEl, itemEl, itemClass, columnCount, maxItems) {
    if (itemEl.length % columnCount === 0) {
        listEl.removeChild(itemEl[itemEl.length - 1]);
        itemEl = sectionEl.querySelectorAll(itemClass);
    }

    let totalItems = itemEl.length;

    for (let i = maxItems; i < totalItems; i++) {
        itemEl[i].remove();
    }

    while (totalItems < maxItems) {
        itemEl.forEach(item => {
            if (totalItems < maxItems) {
                listEl.appendChild(item.cloneNode(true));
                totalItems++;
            }
        });
        itemEl = sectionEl.querySelectorAll(itemClass); // Update itemEl
    }
}

function setupGrid(listEl, columnCount) {
    gsap.set(listEl, { width: columnCount * 100 + "%", height: columnCount * 100 + "%" });
    const itemEl = listEl.querySelectorAll(".draggable_item");
    gsap.set(itemEl, { width: 100 / columnCount + "%", height: 100 / columnCount + "%" });
}


function setupPressTimeline(sectionEl, scaleEl) {
    const images = sectionEl.querySelectorAll(".draggable_img");
    const pressTl = gsap.timeline({ paused: true, defaults: { duration: 0.4 } });

    pressTl.fromTo(images, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }, { clipPath: "polygon(2% 2%, 98% 2%, 98% 98%, 2% 98%)" });
    pressTl.to(scaleEl, { scale: 1.1 }, "<");

    return pressTl;
}

function makeSlideActive(itemEl, x, y, columnCount) {
    const xValue = Math.round(x * (columnCount - 1));
    const yValue = Math.round(y * (columnCount - 1));
    const activeIndex = yValue * columnCount + xValue;

    const activeItem = itemEl[activeIndex];

    gsap.to(itemEl, { opacity: 0.25, duration: 0.3 });
    gsap.to(activeItem, { opacity: 1, duration: 0.3 });
}

function initializeDragdealer(sectionEl, canvasEl, itemEl, columnCount, pressTl) {
    const slider = new Dragdealer(canvasEl, {
        handleClass: "draggable_list",
        x: 0.5,
        y: 0.5,
        steps: columnCount,
        horizontal: true,
        vertical: true,
        speed: 0.085,
        loose: false,
        slide: true,
        requestAnimationFrame: true,
        dragStartCallback: function () {
            sectionEl.classList.add("is-grabbing");
            gsap.to(itemEl, { opacity: 0.25, duration: 0.15 });
            pressTl.play();
            stopAutoPlay();
        },
        dragStopCallback: function () {
            sectionEl.classList.remove("is-grabbing");
            pressTl.reverse();
        },
        callback: function (x, y) {
            makeSlideActive(itemEl, x, y, columnCount);
        }
    });

    // Set the slider to the middle position immediately
    slider.setValue(0.5, 0.5);
    makeSlideActive(itemEl, 0.5, 0.5, columnCount);

    return slider;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function autoPlaySlider(slider, itemEl, columnCount, sectionEl) {
    const positions = [];

    // Calculate the positions for each item
    itemEl.forEach((item, index) => {
        const x = (index % columnCount) / (columnCount - 1);
        const y = Math.floor(index / columnCount) / (columnCount - 1);
        positions.push({ x, y });
    });

    // Shuffle positions
    let shuffledPositions = shuffleArray(positions.slice());

    let currentIndex = 0;

    // Calculate the middle index position
    const middleIndex = positions.findIndex(pos => pos.x === 0.5 && pos.y === 0.5);
    if (middleIndex !== -1) {
        currentIndex = middleIndex;
    }

    autoPlayTimeline = gsap.timeline({ repeat: -1 });

    function moveToNextPosition() {
        const pos = shuffledPositions[currentIndex];
        autoPlayTimeline.to(slider, {
            duration: 7,
            ease: "power1.inOut",
            onUpdate: function () {
                slider.setValue(pos.x, pos.y);
            },
            onComplete: function () {
                makeSlideActive(itemEl, pos.x, pos.y, columnCount);
                currentIndex = (currentIndex + 1) % shuffledPositions.length;
                if (currentIndex === 0) {
                    shuffledPositions = shuffleArray(positions.slice());
                }
                autoPlayTimeline.call(moveToNextPosition)
            }
        });
    }

    const initialPos = positions[middleIndex];
    slider.setValue(initialPos.x, initialPos.y);
    makeSlideActive(itemEl, initialPos.x, initialPos.y, columnCount);

    setTimeout(() => {
        moveToNextPosition();
        autoPlayTimeline.play();
    }, 25000); // 7-second delay before autoplay starts
}

function stopAutoPlay() {
    if (autoPlayTimeline) {
        autoPlayTimeline.pause();
    }
}


function animateCanvas() {
    const tl = gsap.timeline({
        defaults: {},
    });
    tl.fromTo(".draggable_canvas", { opacity: 0 }, { opacity: 1, duration: 1, ease: "power4.inOut", visibility: 'visible' });
    return tl;
}




/* let autoPlayTimeline;

document.querySelectorAll(".draggable_section").forEach(initDraggableSection);

function initDraggableSection(sectionEl) {
    const canvasEl = sectionEl.querySelector(".draggable_canvas");
    const listEl = sectionEl.querySelector(".draggable_list");
    const itemClass = ".draggable_item";
    const scaleEl = sectionEl.querySelector(".draggable-scale");
    let itemEl = sectionEl.querySelectorAll(itemClass);
    const columnCount = 5;
    const maxItems = columnCount * columnCount;

    adjustItemCount(sectionEl, listEl, itemEl, itemClass, columnCount, maxItems);
    setupGrid(listEl, columnCount);
    animateCanvas(canvasEl);
    const pressTl = setupPressTimeline(sectionEl, scaleEl);
    itemEl = sectionEl.querySelectorAll(itemClass); // Re-query itemEl after adjustments
    const slider = initializeDragdealer(sectionEl, canvasEl, itemEl, columnCount, pressTl);

    // Ensure the middle item is active
    makeSlideActive(itemEl, 0.5, 0.5, columnCount);

    // Conditionally start autoplay
    if (!isTabletOrMobile()) {
        autoPlaySlider(slider, itemEl, columnCount, sectionEl);
    }

    // Add event listener for window resize to handle autoplay
    window.addEventListener('resize', () => {
        if (!isTabletOrMobile()) {
            stopAutoPlay();
        }
    }, { passive: true });
}

function isTabletOrMobile() {
    return window.innerWidth <= 1024; // Adjust this value based on your specific requirements
}

function adjustItemCount(sectionEl, listEl, itemEl, itemClass, columnCount, maxItems) {
    if (itemEl.length % columnCount === 0) {
        listEl.removeChild(itemEl[itemEl.length - 1]);
        itemEl = sectionEl.querySelectorAll(itemClass);
    }

    let totalItems = itemEl.length;

    for (let i = maxItems; i < totalItems; i++) {
        itemEl[i].remove();
    }

    while (totalItems < maxItems) {
        itemEl.forEach(item => {
            if (totalItems < maxItems) {
                listEl.appendChild(item.cloneNode(true));
                totalItems++;
            }
        });
        itemEl = sectionEl.querySelectorAll(itemClass); // Update itemEl
    }
}

function setupGrid(listEl, columnCount) {
    gsap.set(listEl, { width: columnCount * 100 + "%", height: columnCount * 100 + "%" });
    const itemEl = listEl.querySelectorAll(".draggable_item");
    gsap.set(itemEl, { width: 100 / columnCount + "%", height: 100 / columnCount + "%" });
}

function animateCanvas(canvasEl) {
    gsap.fromTo(canvasEl, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power4.inOut" });
}

function setupPressTimeline(sectionEl, scaleEl) {
    const images = sectionEl.querySelectorAll(".draggable_img");
    const pressTl = gsap.timeline({ paused: true, defaults: { duration: 0.4 } });

    pressTl.fromTo(images, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }, { clipPath: "polygon(2% 2%, 98% 2%, 98% 98%, 2% 98%)" });
    pressTl.to(scaleEl, { scale: 1.1 }, "<");

    return pressTl;
}

function makeSlideActive(itemEl, x, y, columnCount) {
    const xValue = Math.round(x * (columnCount - 1));
    const yValue = Math.round(y * (columnCount - 1));
    const activeIndex = yValue * columnCount + xValue;

    const activeItem = itemEl[activeIndex];

    gsap.to(itemEl, { opacity: 0.25, duration: 0.3 });
    gsap.to(activeItem, { opacity: 1, duration: 0.3 });
}

function initializeDragdealer(sectionEl, canvasEl, itemEl, columnCount, pressTl) {
    const slider = new Dragdealer(canvasEl, {
        handleClass: "draggable_list",
        x: 0.5,
        y: 0.5,
        steps: columnCount,
        horizontal: true,
        vertical: true,
        speed: 0.045,
        loose: false,
        slide: true,
        requestAnimationFrame: true,
        dragStartCallback: function () {
            sectionEl.classList.add("is-grabbing");
            gsap.to(itemEl, { opacity: 0.25, duration: 0.15 });
            pressTl.play();
            stopAutoPlay();
        },
        dragStopCallback: function () {
            sectionEl.classList.remove("is-grabbing");
            pressTl.reverse();
        },
        callback: function (x, y) {
            makeSlideActive(itemEl, x, y, columnCount);
        }
    });

    // Set the slider to the middle position immediately
    slider.setValue(0.5, 0.5);
    makeSlideActive(itemEl, 0.5, 0.5, columnCount);

    return slider;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function autoPlaySlider(slider, itemEl, columnCount, sectionEl) {
    const positions = [];

    // Calculate the positions for each item
    itemEl.forEach((item, index) => {
        const x = (index % columnCount) / (columnCount - 1);
        const y = Math.floor(index / columnCount) / (columnCount - 1);
        positions.push({ x, y });
    });

    // Shuffle positions
    let shuffledPositions = shuffleArray(positions.slice());

    let currentIndex = 0;

    // Calculate the middle index position
    const middleIndex = positions.findIndex(pos => pos.x === 0.5 && pos.y === 0.5);
    if (middleIndex !== -1) {
        currentIndex = middleIndex;
    }

    autoPlayTimeline = gsap.timeline({ repeat: -1 });

    function moveToNextPosition() {
        const pos = shuffledPositions[currentIndex];
        autoPlayTimeline.to(slider, {
            duration: 7,
            ease: "power1.inOut",
            onUpdate: function () {
                slider.setValue(pos.x, pos.y);
            },
            onComplete: function () {
                makeSlideActive(itemEl, pos.x, pos.y, columnCount);
                currentIndex = (currentIndex + 1) % shuffledPositions.length;
                if (currentIndex === 0) {
                    shuffledPositions = shuffleArray(positions.slice());
                }
                autoPlayTimeline.call(moveToNextPosition)
            }
        });
    }

    const initialPos = positions[middleIndex];
    slider.setValue(initialPos.x, initialPos.y);
    makeSlideActive(itemEl, initialPos.x, initialPos.y, columnCount);

    setTimeout(() => {
        moveToNextPosition();
        autoPlayTimeline.play();
    }, 7000); // 7-second delay before autoplay starts
}

function stopAutoPlay() {
    if (autoPlayTimeline) {
        autoPlayTimeline.pause();
    }
} */