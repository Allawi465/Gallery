export function animateCanvas() {
    const tl = gsap.timeline({
        defaults: {},
    });
    tl.set('.header', { visibility: 'visible', delay: 20, }, '<')
        .set('.draggable_section', { display: 'flex', }, '<')
        .set('.footer-wrapper', { visibility: 'visible', }, '<')
        .set('.header', { visibility: 'visible', }, '<')
        .fromTo(".draggable_canvas", { opacity: 0 }, { opacity: 1, duration: 1, ease: "power4.inOut", visibility: 'visible' }, '<')
        .set('.svg-footer', { visibility: 'visible', }, '<')
        .to('.svg-flower-bottom', { opacity: 1, rotation: 360, scale: 1, }, '<')
        .set('.svg-text-bottom', { visibility: 'visible' }, '<')
        .from('.svg-text-bottom', { opacity: 0, ease: "power2.out", rotationX: -90, }, '<');
    return tl;
}