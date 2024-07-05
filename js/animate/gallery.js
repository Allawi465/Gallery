export function animateCanvas() {
    const tl = gsap.timeline({
        defaults: {},
    });
    tl.fromTo(".draggable_canvas", { opacity: 0 }, { opacity: 1, duration: 1, ease: "power4.inOut", visibility: 'visible', delay: 19.5 }, '<')
        .set('.header', { visibility: 'visible', }, '<')
        .set('.footer-wrapper', { visibility: 'visible', }, '<')
        .set('.svg-flower-bottom', { visibility: 'visible', }, '<')
        .to('.svg-flower-bottom', { opacity: 1, rotation: 360, }, '<')
        .set('.svg-text-bottom', { visibility: 'visible' }, '<')
        .from('.svg-text-bottom', { opacity: 0, duration: 1, delay: 0.5, ease: "power1.out", }, '<')
        .set('.date', { visibility: 'visible' }, '<')
        .from('.date', {
            opacity: 0, duration: 1, ease: "power1.out",
        }, '<')
        .set('.sted', { visibility: 'visible' }, '<')
        .from('.sted', {
            opacity: 0, duration: 1, ease: "power1.out",
        }, '<');
    return tl;
}