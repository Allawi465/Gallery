export function makeSlideActive(itemEl, x, y, columnCount) {
    const xValue = Math.round(x * (columnCount - 1));
    const yValue = Math.round(y * (columnCount - 1));
    const activeIndex = yValue * columnCount + xValue;

    const activeItem = itemEl[activeIndex];

    gsap.to(itemEl, { opacity: 0.25, duration: 0.3 });
    gsap.to(activeItem, { opacity: 1, duration: 0.3 });
}