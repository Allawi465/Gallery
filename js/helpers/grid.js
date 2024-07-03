export function setupGrid(listEl, columnCount) {
    gsap.set(listEl, { width: columnCount * 100 + "%", height: columnCount * 100 + "%" });
    const itemEl = listEl.querySelectorAll(".draggable_item");
    gsap.set(itemEl, { width: 100 / columnCount + "%", height: 100 / columnCount + "%" });
}