const vers = () => {
    new SplitType('.korinter-vers-1', {
        types: 'words, chars',
        tagName: 'span'
    });

    new SplitType('.korinter-13', {
        types: 'words, chars',
        tagName: 'span'
    });

    new SplitType('.Mark-vers', {
        types: 'words, chars',
        tagName: 'span'
    });

    new SplitType('.mark-10', {
        types: 'words, chars',
        tagName: 'span'
    });

    const tl = gsap.timeline({
        defaults: {
            ease: 'power1.inout',
            stagger: { amount: 1 },
        },
    });

    tl.to('#svg-loading', {
        opacity: 0,
        duration: 1,
        delay: 2.2,
        scale: 0,
    });

    tl.set('.korinter-vers-1', { visibility: 'visible' }, '<')
        .from('.korinter-vers-1 span span', {
            yPercent: -200, duration: 0.7, ease: "power1.out", stagger: { amount: 0.7 }
        }, '<');

    tl.set('.korinter-13', { visibility: 'visible' }, '<')
        .from('.korinter-13 span span', {
            opacity: 0, duration: 1, delay: 0.5, ease: "power1.out", stagger: { amount: 0.8 }
        }, '<');

    tl.to('.korinter-vers-1 span span', {
        opacity: 0,
        delay: 4,
        yPercent: -12,
        duration: 0.2,
    }, '>');

    tl.to('.korinter-13 span span', {
        opacity: 0,
        yPercent: -12,
        duration: 0.2,
    }, '<');

    tl.set('.korinter-vers-1', { visibility: 'hidden', display: "none", }, '>')
    tl.set('.korinter-vers-1', { visibility: 'hidden', display: "none", }, '<')

    tl.set('.Mark-vers', { visibility: 'visible', yPercent: -30 })
        .from('.Mark-vers span span', {
            yPercent: -200, duration: 0.7, ease: "power1.out", stagger: { amount: 0.7 }
        }, '>');

    tl.set('.mark-10', { visibility: 'visible', yPercent: -95 }, '<')
        .from('.mark-10 span span', {
            opacity: 0, duration: 1, ease: "power1.out", stagger: { amount: 0.8 }
        }, '<');

    tl.to('.Mark-vers', {
        opacity: 0, delay: 4, duration: 0.8, delay: 0.5, stagger: { amount: 0.8 }, scale: 0,
    });

    tl.to('.mark-10', {
        opacity: 0, duration: 0.8, stagger: { amount: 0.8 }, scale: 0
    }, '<');

    tl.to('.clip-path-top', {
        height: "100vh",
        width: "100vw",
        duration: 1,
        background: "#0D0D0D"
    }, '<');

    tl.to('.clip-path-bottom', {
        height: "100vh",
        width: "100vw",
        duration: 1,
        background: "#0D0D0D"
    }, '<');

    tl.to('.clip-path-top', {
        height: "0px",
        width: "0px",
        duration: 1,
        ease: "power2.out",
        background: "#414328"
    },);

    tl.to('.clip-path-bottom', {
        height: "0px",
        width: "0px",
        duration: 1,
        ease: "power2.out",
        background: "#414328"
    }, '<');

    tl.set('.Mark-vers', { visibility: 'hidden', display: "none", }, '<')
    tl.set('.mark-10', { visibility: 'hidden', display: "none", }, '<')

    return tl;
}

export default vers;