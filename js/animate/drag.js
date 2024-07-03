export function setupPressTimeline(sectionEl, scaleEl) {
    const images = sectionEl.querySelectorAll(".draggable_img");
    const pressTl = gsap.timeline({ paused: true, defaults: { duration: 0.4 } });

    pressTl.fromTo(images, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }, { clipPath: "polygon(2% 2%, 98% 2%, 98% 98%, 2% 98%)" });
    pressTl.to(scaleEl, { scale: 1.1 }, "<");

    return pressTl;
}