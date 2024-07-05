import {
    vers,
    animatSvg,
    animateCanvas,
    setupPressTimeline,
    animatAfterSvg
} from "./animate/index.js";
import { setupGrid, makeSlideActive, isTabletOrMobile, shuffleArray } from "./helpers/index.js";

document.addEventListener("DOMContentLoaded", function () {
    const mainTimeline = gsap.timeline();
    const versTimeline = vers();
    const svgTimeline = animatSvg();
    const afterSvgTimeline = animatAfterSvg();
    const galleryTimeline = animateCanvas();

    mainTimeline.add(versTimeline, 0);
    mainTimeline.add(svgTimeline, 0);
    mainTimeline.add(afterSvgTimeline, 0);
    mainTimeline.add(galleryTimeline, 0);

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

    adjustItemCount(sectionEl, listEl, itemEl, itemClass, maxItems);
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

function adjustItemCount(sectionEl, listEl, itemEl, itemClass, maxItems) {
    let totalItems = itemEl.length;

    for (let i = maxItems; i < totalItems; i++) {
        itemEl[i].remove();
    }

    while (totalItems < maxItems) {
        for (let i = 0; i < itemEl.length && totalItems < maxItems; i++) {
            listEl.appendChild(itemEl[i].cloneNode(true));
            totalItems++;
        }
        itemEl = sectionEl.querySelectorAll(itemClass);
    }
}


function initializeDragdealer(sectionEl, canvasEl, itemEl, columnCount, pressTl) {
    const slider = new Dragdealer(canvasEl, {
        handleClass: "draggable_list",
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

    autoPlayTimeline = gsap.timeline({ repeat: -1, paused: true });

    function moveToNextPosition() {
        const pos = shuffledPositions[currentIndex];
        autoPlayTimeline.to(slider, {
            duration: 10,
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
                moveToNextPosition();
            }
        });
    }

    const initialPos = positions[middleIndex];
    slider.setValue(initialPos.x, initialPos.y);
    makeSlideActive(itemEl, initialPos.x, initialPos.y, columnCount);

    setTimeout(() => {
        moveToNextPosition();
        autoPlayTimeline.play();
    }, 26000); // 7-second delay before autoplay starts
}


function stopAutoPlay() {
    if (autoPlayTimeline) {
        autoPlayTimeline.pause();
    }
}