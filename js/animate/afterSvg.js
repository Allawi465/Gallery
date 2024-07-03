const animatAfterSvg = () => {

    const tl = gsap.timeline({
        defaults: {
            duration: 1,
            ease: "power2.inOut",
        },
    });

    tl.to('.svg-flower', {
        opacity: 0, rotation: -360, ease: "power1.out", delay: 19,
    }, ">").to('.svg-text', {
        opacity: 0,
        rotationX: -90,
    }, "<").to('.vakre-text span span', {
        rotationX: -90, duration: 0.6, stagger: { amount: 0.6 },
        opacity: 0
    }, '<').to('.snap-text span span', {
        rotationX: -90, duration: 0.6, stagger: { amount: 0.6 }, opacity: 0
    }, '<').to('.linje-text', {
        width: 0,
        alpha: 0,
        ease: "power2.out",
    }, '<').to('.robel-text', {
        alpha: 0, x: 15, ease: "power1.easeOut", opacity: 0, delay: 0.4, duration: 1
    }, '<').to('.mahta-text', {
        alpha: 0, x: -15, ease: "power1.easeOut", opacity: 0, duration: 1
    }, '<').set('.svg-container', { display: 'none' }, '>')
        .set('.outside-container', { display: 'none' }, '<')


    return tl;
};

export default animatAfterSvg;