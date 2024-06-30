const animatSvg = () => {

    const tl = gsap.timeline({
        defaults: {
            duration: 1,
            ease: "power2.inOut",
        },
    });

    new SplitType('.vakre-text', {
        types: 'words, chars',
        tagName: 'span'
    });

    new SplitType('.snap-text', {
        types: 'words, chars',
        tagName: 'span'
    });

    tl.set('.svg-flower', { visibility: 'visible', delay: 12.8, }, '<')
        .to('.svg-flower', {
            opacity: 1,
            rotation: 360,
        }, '<');

    tl.set('.svg-text', { visibility: 'visible' }, '<')
        .from('.svg-text', {
            duration: 1,
            opacity: 0,
            ease: "power2.out",
            rotationX: -90,
            delay: 0.5
        }, '<');

    tl.set('.vakre-text', { visibility: 'visible' }, '<')
        .from('.vakre-text span span', {
            rotationX: -90, duration: 0.6, ease: "power2.out", stagger: { amount: 0.6 },
            delay: 0.2
        }, '<');

    tl.set('.snap-text', { visibility: 'visible' }, '<')
        .from('.snap-text span span', {
            rotationX: -90, duration: 0.6, ease: "power2.out", stagger: { amount: 0.6 }
        }, '<');

    tl.set('.linje-text', { visibility: 'visible' }, '<')
        .from('.linje-text', {
            width: 0,
            alpha: 0,
            duration: 1,
            delay: 0.4,
            ease: "power2.out",
        }, '<');

    tl.set('.robel-text', { visibility: 'visible' }, '<')
        .from('.robel-text', {
            alpha: 0, x: 40, ease: "power1.easeOut",
        }, '<');

    tl.set('.mahta-text', { visibility: 'visible' }, '<')
        .from('.mahta-text', {
            alpha: 0, x: -40, ease: "power1.easeOut",
        }, '<');


    return tl;
};

export default animatSvg;