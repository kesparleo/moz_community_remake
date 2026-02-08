module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[externals]/react [external] (react, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react", () => require("react"));

module.exports = mod;
}),
"[project]/src/components/Hero/Hero.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "--hero-logo": "Hero-module__JgYmMq__--hero-logo",
  "bounce": "Hero-module__JgYmMq__bounce",
  "hero": "Hero-module__JgYmMq__hero",
  "hero__button": "Hero-module__JgYmMq__hero__button",
  "hero__buttons": "Hero-module__JgYmMq__hero__buttons",
  "hero__content": "Hero-module__JgYmMq__hero__content",
  "hero__description": "Hero-module__JgYmMq__hero__description",
  "hero__logo": "Hero-module__JgYmMq__hero__logo",
  "hero__text": "Hero-module__JgYmMq__hero__text",
  "hidden": "Hero-module__JgYmMq__hidden",
  "visible": "Hero-module__JgYmMq__visible",
});
}),
"[project]/src/components/Tooltip/Tooltip.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const Tooltip = ({ text, delay = 3000, duration, position = 'up', children })=>{
    const wrapperRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [triggered, setTriggered] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!wrapperRef.current || triggered) return;
        const observer = new IntersectionObserver(([entry])=>{
            if (entry.isIntersecting) {
                setTriggered(true);
                observer.disconnect();
            }
        }, {
            threshold: 0.25
        });
        observer.observe(wrapperRef.current);
        return ()=>observer.disconnect();
    }, [
        triggered
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!triggered) return;
        const showTimer = window.setTimeout(()=>setVisible(true), delay);
        return ()=>clearTimeout(showTimer);
    }, [
        triggered,
        delay
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!visible || !duration) return;
        const hideTimer = window.setTimeout(()=>setVisible(false), duration);
        return ()=>clearTimeout(hideTimer);
    }, [
        visible,
        duration
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
        ref: wrapperRef,
        className: "tooltip__wrapper",
        children: [
            children,
            visible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                className: `tooltip__content tooltip__${position}`,
                children: text
            }, void 0, false, {
                fileName: "[project]/src/components/Tooltip/Tooltip.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Tooltip/Tooltip.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Tooltip;
}),
"[project]/src/components/Hero/Hero.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2f$Hero$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Hero/Hero.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2f$Tooltip$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Tooltip/Tooltip.tsx [ssr] (ecmascript)");
;
;
;
;
const Hero = ({ logo, description, buttonText, buttonUrl })=>{
    const [isTop, setIsTop] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const handleScroll = ()=>{
            setIsTop(window.scrollY < 10);
        };
        window.addEventListener("scroll", handleScroll);
        return ()=>window.removeEventListener("scroll", handleScroll);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
        id: "home",
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2f$Hero$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].hero} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2f$Hero$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].hero__text}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2f$Hero$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].hero__content} ${isTop ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2f$Hero$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].visible : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2f$Hero$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].hidden}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                        src: logo,
                        alt: "",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2f$Hero$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].hero__logo
                    }, void 0, false, {
                        fileName: "[project]/src/components/Hero/Hero.tsx",
                        lineNumber: 30,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/Hero/Hero.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2f$Hero$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].hero__description,
                    children: description
                }, void 0, false, {
                    fileName: "[project]/src/components/Hero/Hero.tsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2f$Hero$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].hero__buttons,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2f$Tooltip$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        text: "Clique e encontre a sua comunidade",
                        position: "down",
                        duration: 12000,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                            href: buttonUrl,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2f$Hero$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].hero__button,
                            children: buttonText
                        }, void 0, false, {
                            fileName: "[project]/src/components/Hero/Hero.tsx",
                            lineNumber: 39,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Hero/Hero.tsx",
                        lineNumber: 34,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/Hero/Hero.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Hero/Hero.tsx",
            lineNumber: 24,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/Hero/Hero.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Hero;
}),
"[externals]/react/jsx-runtime [external] (react/jsx-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-runtime", () => require("react/jsx-runtime"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/components/List/List.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "button__format": "List-module__rZUNCG__button__format",
  "destaque": "List-module__rZUNCG__destaque",
  "events": "List-module__rZUNCG__events",
  "grid-view": "List-module__rZUNCG__grid-view",
  "list": "List-module__rZUNCG__list",
  "list-view": "List-module__rZUNCG__list-view",
  "list__actions": "List-module__rZUNCG__list__actions",
  "list__categories": "List-module__rZUNCG__list__categories",
  "list__category": "List-module__rZUNCG__list__category",
  "list__contact": "List-module__rZUNCG__list__contact",
  "list__contact-button": "List-module__rZUNCG__list__contact-button",
  "list__content": "List-module__rZUNCG__list__content",
  "list__description": "List-module__rZUNCG__list__description",
  "list__header": "List-module__rZUNCG__list__header",
  "list__heading": "List-module__rZUNCG__list__heading",
  "list__intro": "List-module__rZUNCG__list__intro",
  "list__item": "List-module__rZUNCG__list__item",
  "list__items-container": "List-module__rZUNCG__list__items-container",
  "list__logo": "List-module__rZUNCG__list__logo",
  "list__more": "List-module__rZUNCG__list__more",
  "list__row": "List-module__rZUNCG__list__row",
  "list__social": "List-module__rZUNCG__list__social",
  "list__social-icon": "List-module__rZUNCG__list__social-icon",
  "list__title": "List-module__rZUNCG__list__title",
  "secundario": "List-module__rZUNCG__secundario",
});
}),
"[project]/src/data/community.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "listaData",
    ()=>listaData
]);
const listaData = [
    {
        logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQGbZY6Q5sgsEA/company-logo_200_200/B4DZiPlE7PH8AI-/0/1754755518848/qa_community_moz_logo?e=1771459200&v=beta&t=HDsfj-w9EiFgwLDd2XTFybqbK2Bw9KpIjHeWK_ySr60',
        title: 'QA Community Moz',
        description: 'A primeira comunidade moçambicana dedicada a Quality Assurance (QA) e Testes Automatizados, criada para unir profissionais, partilhar conhecimento e elevar a qualidade do software no país.',
        website: 'https://mozqacommunity.conexarmanagement.com',
        mail: 'https://mozqacommunity.conexarmanagement.com/contato',
        social: {
            whatsapp: 'https://chat.whatsapp.com/K61wQYR8KPPEXpBNgNejla?mode=gi_t',
            linkedin: 'https://www.linkedin.com/company/qa-community-moz'
        },
        color: '#31378aff',
        categories: [
            'Coding'
        ]
    },
    {
        logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQFtj0fOo53rkQ/company-logo_200_200/company-logo_200_200/0/1695041071092?e=1771459200&v=beta&t=FK0UsiTT_DFA43z-7SqaME2-Jaq2SreuuDYaE8OjdxE',
        title: 'Pyladies Maputo',
        description: 'Comunidade local que apoia e promove a participação de mulheres na programação em Python, oferecendo encontros, formação prática e redes de apoio para fomentar competências técnicas e inclusão no sector tecnológico em Maputo.',
        website: '',
        mail: 'maputo@pyladies.com',
        social: {
            instagram: 'https://www.instagram.com/pyladiesmaputo',
            twitter: 'https://x.com/pyladiesmaputo',
            linkedin: 'https://www.linkedin.com/company/pyladies-maputo',
            whatsapp: 'https://chat.whatsapp.com/IVxKNCPTbZH9xbjpHxuBA2',
            github: 'https://github.com/pyladies-maputo'
        },
        color: '#6e318aff',
        categories: [
            'Coding'
        ]
    },
    {
        logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQEq9FQO8CF3cg/company-logo_200_200/company-logo_200_200/0/1729162204438/dsai_for_moz_logo?e=1771459200&v=beta&t=nQUQeTZmjqYh1fzvri1vONGMd3GjeGGpj8pA5t-ksoo',
        title: 'DSAI For Moz',
        description: 'Comunidade orientada para Dados, Ciência de Dados e Inteligência Artificial, focada na construção de capacidade técnica, partilha de conhecimento e promoção de aplicações de data science e IA para resolver desafios locais e ampliar competências no ecossistema tecnológico.',
        website: 'https://dsai.co.mz',
        social: {
            whatsapp: 'https://chat.whatsapp.com/IcqlFviLiHIBD3DBNBXfgc',
            linkedin: 'https://www.linkedin.com/company/dsai-for-moz',
            github: 'https://github.com/DSAI-For-Moz'
        },
        color: '#3498db',
        categories: [
            'Artificial Intelligence',
            'Data'
        ]
    },
    {
        logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQFu68cby66G8w/company-logo_100_100/company-logo_100_100/0/1682616794107/djangogirlsmoz_logo?e=1771459200&v=beta&t=qgc_Iy3Q4-MqIj68IX51WvfpghRjyzUXGoPxWtZi1EM',
        title: 'Django Girls Moz',
        description: 'Workshop de um dia dedicado a Python e Django, direcionado especialmente a mulheres, que visa introduzir programação, desenvolvimento web e boas práticas, oferecendo um ambiente de aprendizagem prático, inclusivo e de empoderamento tecnológico',
        website: '',
        social: {
            whatsapp: 'https://chat.whatsapp.com/7ufLDMUUPFO54UHmqH8rR8',
            linkedin: 'https://www.linkedin.com/company/djangogirlsmoz',
            twitter: 'https://twitter.com/djangogirlsmoz',
            instagram: 'https://www.instagram.com/djangogirlsmoz'
        },
        color: '#e98834ff',
        categories: [
            'Coding'
        ]
    },
    {
        logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQEJWR8lFdk6yw/company-logo_200_200/company-logo_200_200/0/1698048505986?e=1771459200&v=beta&t=33Eek2w7C_8tMSIxhW0mJKHGAWvhw3mUrdopZrvHhg4',
        title: 'MozDevz',
        description: 'Maior comunidade tecnológica de Moçambique, reunindo desenvolvedores, estudantes e profissionais de TI, com foco em programação, inovação e projectos colaborativos, promovendo capacitação, eventos e networking no ecossistema digital nacional.',
        website: 'https://www.mozdevz.org',
        mail: 'contacto@mozdevz.org',
        social: {
            facebook: 'https://www.facebook.com/mozdevz',
            linkedin: 'https://www.linkedin.com/company/mozdevz',
            instagram: 'https://www.instagram.com/mozdevz',
            twitter: 'https://x.com/mozdevz',
            telegram: 'https://t.me/MozDevz',
            youtube: 'https://www.youtube.com/@mozdevz6592',
            whatsapp: 'https://chat.whatsapp.com/LqHu2T0jIJT74U8Q04gKEn',
            github: 'https://github.com/mozdevz'
        },
        color: '#5e5e5eff',
        categories: [
            'Coding'
        ]
    },
    {
        logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQFYkGScKvniSA/company-logo_200_200/company-logo_200_200/0/1728759049864/data_driven_communitymz_logo?e=1771459200&v=beta&t=_WLPuqdHsPl6QpGaDzq6HCgZVGX5PJXpz1ti_pfiCLk',
        title: 'Data Driven CommunityMZ',
        description: 'Um espaço dinâmico dedicado a conectar profissionais de dados e tecnologia. Aqui, promovemos a troca de conhecimentos, o aprendizado contínuo e a colaboração entre membros, com foco em discutir tendências, melhores práticas e inovações na área. Junte-se a nós para compartilhar experiências, participar de eventos e transformar dados em soluções impactantes!',
        website: '',
        mail: 'datacommunitymz@gmail.com',
        social: {
            linkedin: 'https://www.linkedin.com/company/data-driven-communitymz',
            instagram: 'https://www.instagram.com/datadrivencommunity.mz',
            whatsapp: 'https://chat.whatsapp.com/JYdKuoGYvEuCLS0jNUTho1',
            youtube: 'https://www.youtube.com/@datadrivencommunitymz'
        },
        color: '#030836ff',
        categories: [
            'Data'
        ]
    },
    {
        logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQE1eJmFJGGJfg/company-logo_200_200/company-logo_200_200/0/1724060766992/maputo_frontenders_logo?e=1771459200&v=beta&t=WnKLhla8YenTe_QCE-3GpCGiwh4ETuGZknVUQFul7kY',
        title: 'Maputo Frontenders',
        description: 'Grupo de entusiastas e profissionais de front-end em Maputo que promovem a troca de experiências sobre tecnologias web (HTML, CSS, JavaScript, frameworks modernos), formação contínua e networking na comunidade local.',
        website: 'https://www.maputofrontenders.dev',
        mail: 'contacto@maputofrontenders.com',
        social: {
            instagram: 'https://www.instagram.com/mptfrontenders',
            linkedin: 'https://linkedin.com/company/maputo-frontenders',
            twitter: 'https://twitter.com/mptfrontenders',
            youtube: 'https://www.youtube.com/@mptfrontenders',
            github: 'https://github.com/Maputo-Frontenders'
        },
        color: '#000',
        categories: [
            'Coding'
        ]
    },
    {
        logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQE5yJ5cQ9PJcw/company-logo_200_200/company-logo_200_200/0/1680002627533?e=1771459200&v=beta&t=qLsSZp-asWguFQD94rZqUQhu72FPNwxHvZEj6foKI_Y',
        title: 'MozFlutter',
        description: 'Comunidade técnica dedicada ao desenvolvimento com Flutter em Moçambique, focada na partilha de conhecimento, boas práticas, eventos e colaboração entre programadores, estudantes e profissionais da área.',
        website: '',
        mail: 'mozflutter.contacto@gmail.com',
        social: {
            whatsapp: 'https://chat.whatsapp.com/LDCa69V6G6m2EPvHlLEjiz',
            twitter: 'https://x.com/mozflutter',
            facebook: 'https://www.facebook.com/flutterMoz',
            instagram: 'https://www.instagram.com/mozflutter',
            linkedin: 'https://www.linkedin.com/company/fluttermoz',
            github: 'https://github.com/mozflutter'
        },
        color: '#1abc9c',
        categories: [
            'Coding'
        ]
    },
    {
        logo: 'https://mozcomunidades.web.app/images/comunities/laravelmaputocommunity.png',
        title: 'Laravel Maputo Commnunity',
        description: 'Grupo dedicado ao intercâmbio de diversos interessados do mundo Laravel, canal onde diversas mentes podem unir seu potêncial para resolver questões do dia a dia e divertir-se.',
        website: '',
        social: {
            whatsapp: 'https://chat.whatsapp.com/BBsDgZGoLZmBEyVXZS8fy2'
        },
        color: '#c0392b',
        categories: [
            'Coding'
        ]
    },
    {
        logo: 'https://mozcomunidades.web.app/images/comunities/jsmaputocommunity.png',
        title: 'JS Maputo Commnunity',
        description: 'Comunidade que reúne programadores e entusiastas para partilhar conhecimento sobre linguagens, frameworks e ferramentas do ecossistema JavaScript, promover encontros técnicos, discutir boas práticas e estimular a colaboração local em desenvolvimento web e aplicações modernas.',
        website: 'https://jsmaputo.web.app',
        mail: 'info@jsmaputocommunity.org',
        social: {
            instagram: 'https://instagram.com/jsmaputocommunity',
            facebook: 'https://facebook.com/jsmaputocommunity',
            whatsapp: 'https://chat.whatsapp.com/1ZXaVqxGSM99MbMbnqPtur'
        },
        color: '#8dca2bff',
        categories: [
            'Coding'
        ]
    },
    {
        logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQHhhbAfhW4cDg/company-logo_200_200/B4DZV80e8OHwAQ-/0/1741555890716?e=1771459200&v=beta&t=sWSsyC-HCzqfeoWruwjFhtU__IKPid45p1vTTU2QOCc',
        title: 'MozCyber',
        description: 'Comunidade dedicada em capacitar jovens moçambicanos em habilidades essenciais em cibersegurança, incluindo Hacking para deteção de vulnerabilidades e as principais técnicas de defesa usadas nos sistemas digitais.',
        website: 'https://www.mozcyber.org',
        mail: 'mozcyber.community@gmail.com',
        social: {
            linkedin: 'https://www.linkedin.com/company/mozcyber',
            instagram: 'https://www.instagram.com/mozcyberr'
        },
        color: '#141414ff',
        categories: [
            'Networks',
            'Cybersecurity',
            'Hacking'
        ]
    },
    {
        logo: 'https://media.licdn.com/dms/image/v2/D4E0BAQFdIuuYirXEnw/company-logo_200_200/B4EZkY7TnrHoAI-/0/1757059825212?e=1771459200&v=beta&t=2xZTMVo9ultY3eItWs-bdVNwqY1_2o80opX4ScZog8A',
        title: 'InfraMZ',
        description: 'Comunidade focada em capacitar talentos nas áreas de Infraestrutura de TI: Redes, Windows, Linux, Cloud e Virtualização. Local para aprender de forma prática e explorar as tecnologias actuais a serem usadas pelas empresas moçambicanas.',
        website: '',
        social: {
            linkedin: 'https://www.linkedin.com/company/inframz',
            instagram: 'https://www.instagram.com/infra.mz',
            whatsapp: 'https://chat.whatsapp.com/L6ktaUPCW3NJxdRy87bTHH?mode=ems_copy_t'
        },
        color: '#133b10ff',
        categories: [
            'Networks',
            'Cloud',
            'Infrastructure'
        ]
    },
    {
        logo: 'https://d2oi1rqwb0pj00.cloudfront.net/community/nio_1762857433105_50.webp',
        title: 'Designer Confiado',
        description: 'Um ecossistema vibrante e colaborativo nascido em Moçambique, mas aberto a todos os criativos de língua portuguesa. Somos o ponto de encontro ideal para designers gráficos, editores, ilustradores e outros profissionais que procuram aprendizagem contínua, valorização profissional e apoio mútuo. ',
        website: 'https://nas.io/designerconfiado',
        social: {
            linkedin: 'https://www.linkedin.com/company/designerconfiado',
            facebook: 'https://www.facebook.com/DesignerConfiado',
            instagram: 'https://www.instagram.com/designerconfiado',
            whatsapp: 'https://chat.whatsapp.com/EUsyuYOpLtIElEtnpzxdsL'
        },
        color: '#6edf11ff',
        categories: [
            'Design'
        ]
    },
    {
        logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQFzdt-q71CqCg/company-logo_200_200/B4DZwgpxS5I8AQ-/0/1770074347613/pythonmozambique_logo?e=1772064000&v=beta&t=ndfC9sSv-aexakhubF9urujTKsnjr9m4_7fA-yHg8Gc',
        title: 'Python Mozambique Community',
        description: 'Comunidade nacional dedicada à promoção e desenvolvimento da linguagem Python em Moçambique. Atuamos como um ecossistema de inovação que conecta profissionais e estudantes, oferecendo partilha de conhecimento técnico, mentoria e colaboração em projetos de código aberto para impulsionar a excelência tecnológica e o crescimento da indústria de software no país.',
        website: '',
        mail: 'python.community.moz@gmail.com',
        social: {
            linkedin: 'https://www.linkedin.com/company/pythonmozambique',
            instagram: 'https://www.instagram.com/pythonmozambique',
            whatsapp: 'https://chat.whatsapp.com/Lqlzo70Im7B8DzXLWWFKsX',
            github: 'https://github.com/pythonmozambique',
            facebook: 'https://www.facebook.com/pymoz'
        },
        color: '#0e33d8ff',
        categories: [
            'Coding'
        ]
    },
    {
        logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQH_y0CI5iWiFQ/company-logo_200_200/B4DZmXHMtwHsAI-/0/1759176871987?e=1772064000&v=beta&t=bvB-g2kOOf6vbVWBX2UkQctpJN2A0_GKooIjNdBtGeg',
        title: 'PyLadies Beira',
        description: 'O PyLadies é uma comunidade internacional de mentoria que tem como missão promover, educar e fortalecer a comunidade Python, apoiando mulheres a tornarem-se participantes ativas e líderes na área de tecnologia e na comunidade Python.',
        website: '',
        mail: 'beira@pyladies.com',
        social: {
            linkedin: 'https://www.linkedin.com/company/pyladiesbeira',
            instagram: 'https://www.instagram.com/pyladiesbeira',
            twitter: 'https://x.com/pyladiesbeira',
            whatsapp: 'https://chat.whatsapp.com/D5Wa1Vbt3oP4Ne4Cj1HSSJ'
        },
        color: 'rgb(22, 10, 126)',
        categories: [
            'Coding'
        ]
    },
    {
        logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQGRoHLSnuTM6A/company-logo_200_200/B4DZqsExxrIgAI-/0/1763823525994?e=1772064000&v=beta&t=prswaWiGQhoMp21a982Fdl9vZ5BW2OhiAq-An4c-Zek',
        title: 'Network Communiity',
        description: 'A Network Community é uma iniciativa dedicada a formar e capacitar estudantes, entusiastas e profissionais em Redes e Tecnologias da Informação, oferecendo cursos práticos, acessíveis e alinhados ao mercado de trabalho, promovendo a partilha de conhecimento, a inclusão digital, a inovação tecnológica e o desenvolvimento profissional em Moçambique e além-fronteiras.',
        website: '',
        mail: 'networkcommunitymz@gmail.com',
        social: {
            linkedin: 'https://www.linkedin.com/company/network-communiity'
        },
        color: 'rgb(22, 10, 126)',
        categories: [
            'Networks',
            'Cybersecurity'
        ]
    }
];
}),
"[project]/src/components/SearchBar/SearchBar.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [ssr] (ecmascript)");
;
;
;
const SearchBar = ({ searchTerm, setSearchTerm })=>{
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: `search-bar ${expanded ? "expanded" : ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                className: "search-bar__icon",
                onClick: ()=>setExpanded(!expanded),
                "aria-label": "Pesquisar",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaSearch"], {}, void 0, false, {
                    fileName: "[project]/src/components/SearchBar/SearchBar.tsx",
                    lineNumber: 16,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/SearchBar/SearchBar.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                type: "text",
                placeholder: "Pesquisar por nome...",
                value: searchTerm,
                onChange: (e)=>setSearchTerm(e.target.value),
                className: "search-bar__input"
            }, void 0, false, {
                fileName: "[project]/src/components/SearchBar/SearchBar.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/SearchBar/SearchBar.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = SearchBar;
}),
"[project]/src/components/CategorySelector/CategorySelector.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const CategorySelector = ({ categories, selectedCategory, setSelectedCategory })=>{
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "category-selector",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                className: "button__format",
                onClick: ()=>setOpen(!open),
                children: selectedCategory || "Categoria"
            }, void 0, false, {
                fileName: "[project]/src/components/CategorySelector/CategorySelector.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                className: "category-selector__list",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                        className: "category-selector__item",
                        onClick: ()=>{
                            setSelectedCategory("");
                            setOpen(false);
                        },
                        children: "Todas"
                    }, void 0, false, {
                        fileName: "[project]/src/components/CategorySelector/CategorySelector.tsx",
                        lineNumber: 23,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    categories.slice().sort().map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                            className: "category-selector__item",
                            onClick: ()=>{
                                setSelectedCategory(cat);
                                setOpen(false);
                            },
                            children: cat
                        }, cat, false, {
                            fileName: "[project]/src/components/CategorySelector/CategorySelector.tsx",
                            lineNumber: 33,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/CategorySelector/CategorySelector.tsx",
                lineNumber: 22,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/CategorySelector/CategorySelector.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = CategorySelector;
}),
"[project]/src/assets/images/django_event.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/django_event.540cd70f.png");}),
"[project]/src/assets/images/django_event.png.mjs { IMAGE => \"[project]/src/assets/images/django_event.png (static in ecmascript, tag client)\" } [ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$django_event$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/images/django_event.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$django_event$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 509,
    height: 856,
    blurWidth: 5,
    blurHeight: 8,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAICAYAAAAx8TU7AAAAnUlEQVR42g3L2w6BYADA8e8i8jm3oZxdNJFW5tC0jBrNmpEZl2bzDN7/zwP8hFQkVruFb40IbJOu0Ud06hqJY3Lbr3jfE9JthOjVGly9GZ9zzPf14HlKETJfZmz0OLgul3VAstwgKoUa1mhCPPfIAp9s4SAmJUnYrBIOmxynf2G1EbuqykDNMdYkrl4mMjXEQFXQcgp6MY9RKWDrRX6szDpdnPQNUgAAAABJRU5ErkJggg=="
};
}),
"[project]/src/data/events.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "eventsData",
    ()=>eventsData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$django_event$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$django_event$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/images/django_event.png.mjs { IMAGE => "[project]/src/assets/images/django_event.png (static in ecmascript, tag client)" } [ssr] (structured image object with data url, ecmascript)');
;
const eventsData = [
    {
        title: "",
        communities: [
            "Django Girls Moz",
            'Pyladies Maputo'
        ],
        date: "2026-03-21",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$django_event$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$django_event$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
        link: ""
    },
    {
        title: "Formação Online Intensiva de QA (Quality Assurance)",
        communities: [
            'QA Community Moz'
        ],
        date: "2026-02-12",
        image: 'https://media.licdn.com/dms/image/v2/D4D22AQFvqaFJpOBHBQ/feedshare-shrink_800/B4DZuO4o72HwAg-/0/1767628781000?e=1770249600&v=beta&t=xhuhVTUs675keb0Wm0FC8HOpzWmA6-ZGgnAaDgwqvzQ',
        link: "https://wa.me/258844086711?text=Ol%C3%A1!%20Gostaria%20de%20me%20inscrever%20no%20evento%20%22Forma%C3%A7%C3%A3o%20Online%20Intensiva%20de%20QA%20(Quality%20Assurance)%22%20da%20Moz%20QA%20Community."
    }
];
}),
"[project]/src/components/Events/EventCard.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$events$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/events.ts [ssr] (ecmascript)");
;
;
;
const Events = ({ communityNames })=>{
    const [upcomingEvents, setUpcomingEvents] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const now = new Date();
        const filtered = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$events$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["eventsData"].filter((event)=>{
            const eventDate = new Date(event.date);
            return eventDate >= now && (!communityNames || event.communities.some((c)=>communityNames.includes(c)));
        });
        setUpcomingEvents(filtered);
    }, [
        communityNames
    ]);
    if (upcomingEvents.length === 0) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "events__container",
        children: upcomingEvents.map((event, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "events__card",
                children: [
                    event.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                        src: event.image,
                        alt: event.title,
                        className: "events__image"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Events/EventCard.tsx",
                        lineNumber: 30,
                        columnNumber: 27
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "events__title",
                        children: event.title
                    }, void 0, false, {
                        fileName: "[project]/src/components/Events/EventCard.tsx",
                        lineNumber: 31,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "events__date",
                        children: new Date(event.date).toLocaleDateString()
                    }, void 0, false, {
                        fileName: "[project]/src/components/Events/EventCard.tsx",
                        lineNumber: 32,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    event.link && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                        href: event.link,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "events__button",
                        children: "Participar"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Events/EventCard.tsx",
                        lineNumber: 34,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, idx, true, {
                fileName: "[project]/src/components/Events/EventCard.tsx",
                lineNumber: 29,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)))
    }, void 0, false, {
        fileName: "[project]/src/components/Events/EventCard.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Events;
}),
"[project]/src/components/List/List.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/List/List.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$community$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/community.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SearchBar$2f$SearchBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SearchBar/SearchBar.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CategorySelector$2f$CategorySelector$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CategorySelector/CategorySelector.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Events$2f$EventCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Events/EventCard.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2f$Tooltip$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Tooltip/Tooltip.tsx [ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
const iconMap = {
    facebook: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaFacebookF"], {}, void 0, false, {
        fileName: "[project]/src/components/List/List.tsx",
        lineNumber: 33,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    twitter: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaTwitter"], {}, void 0, false, {
        fileName: "[project]/src/components/List/List.tsx",
        lineNumber: 34,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0)),
    instagram: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaInstagram"], {}, void 0, false, {
        fileName: "[project]/src/components/List/List.tsx",
        lineNumber: 35,
        columnNumber: 14
    }, ("TURBOPACK compile-time value", void 0)),
    linkedin: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaLinkedinIn"], {}, void 0, false, {
        fileName: "[project]/src/components/List/List.tsx",
        lineNumber: 36,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    whatsapp: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaWhatsapp"], {}, void 0, false, {
        fileName: "[project]/src/components/List/List.tsx",
        lineNumber: 37,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    github: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaGithub"], {}, void 0, false, {
        fileName: "[project]/src/components/List/List.tsx",
        lineNumber: 38,
        columnNumber: 11
    }, ("TURBOPACK compile-time value", void 0)),
    telegram: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaTelegram"], {}, void 0, false, {
        fileName: "[project]/src/components/List/List.tsx",
        lineNumber: 39,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    youtube: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaYoutube"], {}, void 0, false, {
        fileName: "[project]/src/components/List/List.tsx",
        lineNumber: 40,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0))
};
const categoryIconMap = {
    Coding: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaCode"], {}, void 0, false, {
        fileName: "[project]/src/components/List/List.tsx",
        lineNumber: 44,
        columnNumber: 11
    }, ("TURBOPACK compile-time value", void 0)),
    "Artificial Intelligence": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaBrain"], {}, void 0, false, {
        fileName: "[project]/src/components/List/List.tsx",
        lineNumber: 45,
        columnNumber: 30
    }, ("TURBOPACK compile-time value", void 0)),
    Data: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaDatabase"], {}, void 0, false, {
        fileName: "[project]/src/components/List/List.tsx",
        lineNumber: 46,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    Networks: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaNetworkWired"], {}, void 0, false, {
        fileName: "[project]/src/components/List/List.tsx",
        lineNumber: 47,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    Cybersecurity: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaShieldAlt"], {}, void 0, false, {
        fileName: "[project]/src/components/List/List.tsx",
        lineNumber: 48,
        columnNumber: 18
    }, ("TURBOPACK compile-time value", void 0)),
    Design: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaPalette"], {}, void 0, false, {
        fileName: "[project]/src/components/List/List.tsx",
        lineNumber: 49,
        columnNumber: 11
    }, ("TURBOPACK compile-time value", void 0)),
    Hacking: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaUserSecret"], {}, void 0, false, {
        fileName: "[project]/src/components/List/List.tsx",
        lineNumber: 50,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0)),
    Cloud: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaCloud"], {}, void 0, false, {
        fileName: "[project]/src/components/List/List.tsx",
        lineNumber: 51,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)),
    Infrastructure: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaCogs"], {}, void 0, false, {
        fileName: "[project]/src/components/List/List.tsx",
        lineNumber: 52,
        columnNumber: 19
    }, ("TURBOPACK compile-time value", void 0))
};
const socialOrder = [
    "instagram",
    "linkedin",
    "facebook",
    "twitter",
    "whatsapp",
    "github",
    "telegram",
    "youtube"
];
const Communities = ()=>{
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("list");
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [isMobile, setIsMobile] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const updateIsMobile = ()=>setIsMobile(window.innerWidth <= 1023);
        updateIsMobile(); // define valor inicial no client
        window.addEventListener("resize", updateIsMobile);
        return ()=>window.removeEventListener("resize", updateIsMobile);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const handleResize = ()=>setIsMobile(window.innerWidth <= 1023);
        window.addEventListener("resize", handleResize);
        return ()=>window.removeEventListener("resize", handleResize);
    }, []);
    const allCategories = Array.from(new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$community$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["listaData"].flatMap((item)=>item.categories)));
    const [shuffledData, setShuffledData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const shuffled = [
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$community$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["listaData"]
        ];
        for(let i = shuffled.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [
                shuffled[j],
                shuffled[i]
            ];
        }
        setShuffledData(shuffled);
    }, []);
    const filteredData = shuffledData.filter((item)=>{
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || item.categories.includes(selectedCategory);
        return matchesSearch && matchesCategory;
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
        id: "communities",
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].list} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].list__background}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].list__header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].list__heading,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].destaqie,
                                children: "Veja"
                            }, void 0, false, {
                                fileName: "[project]/src/components/List/List.tsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].secundario,
                                children: "Abaixo"
                            }, void 0, false, {
                                fileName: "[project]/src/components/List/List.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/List/List.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].list__intro,
                        children: "Lista de Comunidades de Tecnologia e Programação em Moçambique"
                    }, void 0, false, {
                        fileName: "[project]/src/components/List/List.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].list__actions,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2f$Tooltip$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                text: "Pesquise por nome",
                                position: "left",
                                duration: 4000,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SearchBar$2f$SearchBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    searchTerm: searchTerm,
                                    setSearchTerm: setSearchTerm
                                }, void 0, false, {
                                    fileName: "[project]/src/components/List/List.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/List/List.tsx",
                                lineNumber: 122,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2f$Tooltip$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                text: "Busque por categoria",
                                duration: 6000,
                                delay: 5000,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CategorySelector$2f$CategorySelector$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    categories: allCategories,
                                    selectedCategory: selectedCategory,
                                    setSelectedCategory: setSelectedCategory
                                }, void 0, false, {
                                    fileName: "[project]/src/components/List/List.tsx",
                                    lineNumber: 126,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/List/List.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2f$Tooltip$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                text: "Lista / Grelha, apenas clique",
                                position: "down",
                                delay: 7000,
                                duration: 4000,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setView(view === "grid" ? "list" : "grid"),
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].button__format,
                                    children: view === "grid" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaList"], {}, void 0, false, {
                                        fileName: "[project]/src/components/List/List.tsx",
                                        lineNumber: 137,
                                        columnNumber: 34
                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaTh"], {}, void 0, false, {
                                        fileName: "[project]/src/components/List/List.tsx",
                                        lineNumber: 137,
                                        columnNumber: 47
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/List/List.tsx",
                                    lineNumber: 133,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/List/List.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/List/List.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/List/List.tsx",
                lineNumber: 113,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].list__items_container} ${view === "grid" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].grid_view : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].list_view}`,
                children: filteredData.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].list__item,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                src: item.logo || "https://mozcomunidades.web.app/images/comunities/logo.png",
                                alt: item.title,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].list__logo
                            }, void 0, false, {
                                fileName: "[project]/src/components/List/List.tsx",
                                lineNumber: 148,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            view === "list" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].list__content,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].list__title,
                                        children: item.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/List/List.tsx",
                                        lineNumber: 159,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].categories,
                                        children: item.categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].list__category,
                                                children: [
                                                    categoryIconMap[cat],
                                                    cat
                                                ]
                                            }, cat, true, {
                                                fileName: "[project]/src/components/List/List.tsx",
                                                lineNumber: 165,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/List/List.tsx",
                                        lineNumber: 163,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].list__row,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].list__description,
                                                children: item.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/List/List.tsx",
                                                lineNumber: 173,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].list__more,
                                                href: `/community/${item.title.toLowerCase().replace(/\s+/g, "-")}`,
                                                children: "Saber mais"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/List/List.tsx",
                                                lineNumber: 174,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/List/List.tsx",
                                        lineNumber: 172,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].events,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Events$2f$EventCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            communityNames: [
                                                item.title
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/List/List.tsx",
                                            lineNumber: 184,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/List/List.tsx",
                                        lineNumber: 183,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].list__social,
                                        children: socialOrder.map((key)=>item.social[key] && iconMap[key] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.social[key],
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['list__social-icon']} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"][`list__social-${key}`]}`,
                                                style: {
                                                    "--hover-color": item.color
                                                },
                                                children: iconMap[key]
                                            }, key, false, {
                                                fileName: "[project]/src/components/List/List.tsx",
                                                lineNumber: 191,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)) : null)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/List/List.tsx",
                                        lineNumber: 188,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].list__contact,
                                        children: item.mail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: `mailto:${item.mail}`,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['list__contact-button'],
                                            children: "Contactar"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/List/List.tsx",
                                            lineNumber: 209,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/List/List.tsx",
                                        lineNumber: 207,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/List/List.tsx",
                                lineNumber: 158,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].list__title,
                                href: `/community/${item.title.toLowerCase().replace(/\s+/g, "-")}`,
                                children: item.title
                            }, void 0, false, {
                                fileName: "[project]/src/components/List/List.tsx",
                                lineNumber: 219,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            !isMobile && view === "list" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].events,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Events$2f$EventCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    communityNames: [
                                        item.title
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/List/List.tsx",
                                    lineNumber: 229,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/List/List.tsx",
                                lineNumber: 228,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, index, true, {
                        fileName: "[project]/src/components/List/List.tsx",
                        lineNumber: 147,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/src/components/List/List.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            filteredData.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['list__no-results'],
                children: "Nenhuma comunidade encontrada."
            }, void 0, false, {
                fileName: "[project]/src/components/List/List.tsx",
                lineNumber: 237,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/List/List.tsx",
        lineNumber: 112,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Communities;
}),
"[project]/src/components/Navbar/Navbar.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [ssr] (ecmascript)");
;
;
;
const Navbar = ({ logo, items, theme, setTheme })=>{
    const [menuOpen, setMenuOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isTop, setIsTop] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [activeSection, setActiveSection] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const toggleTheme = ()=>setTheme(theme === "light" ? "dark" : "light");
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const sections = document.querySelectorAll("section[id]");
        const onScroll = ()=>{
            const scrollY = window.scrollY;
            setIsTop(scrollY < 10);
            const scrollPos = scrollY + 120;
            sections.forEach((sec)=>{
                if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
                    setActiveSection(sec.id);
                }
            });
        };
        window.addEventListener("scroll", onScroll);
        return ()=>window.removeEventListener("scroll", onScroll);
    }, []);
    const [isMobile, setIsMobile] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const renderLinks = ()=>items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                href: `#${item.id}`,
                onClick: (e)=>{
                    e.preventDefault();
                    const section = document.getElementById(item.id);
                    if (section) {
                        section.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }
                    setMenuOpen(false);
                },
                className: activeSection === item.id ? "navbar__action" : "",
                children: item.label
            }, item.id, false, {
                fileName: "[project]/src/components/Navbar/Navbar.tsx",
                lineNumber: 40,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)));
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setIsMobile(window.innerWidth <= 768);
        const handleResize = ()=>setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return ()=>window.removeEventListener("resize", handleResize);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
        className: `navbar ${isTop ? "navbar--top" : "navbar--scrolled"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "navbar__logo",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                    src: logo,
                    alt: "Logo Moz Communities",
                    className: "--logo"
                }, void 0, false, {
                    fileName: "[project]/src/components/Navbar/Navbar.tsx",
                    lineNumber: 70,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/Navbar/Navbar.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            !isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: `navbar__links ${menuOpen ? "active" : ""}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "navbar__icons",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "theme-toggle",
                            onClick: toggleTheme,
                            children: theme === "light" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaSun"], {
                                className: "icon"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                lineNumber: 78,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaMoon"], {
                                className: "icon"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                lineNumber: 80,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar/Navbar.tsx",
                            lineNumber: 76,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar/Navbar.tsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    renderLinks()
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Navbar/Navbar.tsx",
                lineNumber: 74,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "navbar__hamburger-and-theme",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "theme-toggle",
                        onClick: toggleTheme,
                        children: theme === "light" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaSun"], {
                            className: "icon"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar/Navbar.tsx",
                            lineNumber: 92,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaMoon"], {
                            className: "icon"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar/Navbar.tsx",
                            lineNumber: 94,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar/Navbar.tsx",
                        lineNumber: 90,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "navbar__hamburger",
                        onClick: ()=>setMenuOpen(!menuOpen),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaBars"], {}, void 0, false, {
                            fileName: "[project]/src/components/Navbar/Navbar.tsx",
                            lineNumber: 101,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar/Navbar.tsx",
                        lineNumber: 97,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Navbar/Navbar.tsx",
                lineNumber: 89,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            isMobile && menuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "navbar__links active",
                children: renderLinks()
            }, void 0, false, {
                fileName: "[project]/src/components/Navbar/Navbar.tsx",
                lineNumber: 107,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Navbar/Navbar.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Navbar;
}),
"[project]/src/components/Collaborate/CollaborateButton.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "collaborate": "CollaborateButton-module__Cg0Efq__collaborate",
  "collaborate-wrapper": "CollaborateButton-module__Cg0Efq__collaborate-wrapper",
  "hero__github": "CollaborateButton-module__Cg0Efq__hero__github",
});
}),
"[project]/src/components/Collaborate/CollaborateButton.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Collaborate$2f$CollaborateButton$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Collaborate/CollaborateButton.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2f$Tooltip$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Tooltip/Tooltip.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
;
;
;
;
;
const CollaborateButton = ({ mail, githubUrl })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        id: "contact",
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Collaborate$2f$CollaborateButton$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['collaborate-wrapper'],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2f$Tooltip$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                text: "Colabore com uma mensagem",
                position: "up",
                duration: 3000,
                delay: 4000,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: `mailto:${mail}?subject=Colaboração%20com%20o%20projecto`,
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Collaborate$2f$CollaborateButton$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].collaborate,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaEnvelope"], {}, void 0, false, {
                        fileName: "[project]/src/components/Collaborate/CollaborateButton.tsx",
                        lineNumber: 17,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/Collaborate/CollaborateButton.tsx",
                    lineNumber: 13,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/Collaborate/CollaborateButton.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2f$Tooltip$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                text: "⭐ Deixe uma estrela",
                position: "down",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: githubUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Collaborate$2f$CollaborateButton$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].hero__github,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaGithub"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Collaborate$2f$CollaborateButton$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"]['hero__github-icon']
                    }, void 0, false, {
                        fileName: "[project]/src/components/Collaborate/CollaborateButton.tsx",
                        lineNumber: 28,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/Collaborate/CollaborateButton.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/Collaborate/CollaborateButton.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Collaborate/CollaborateButton.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = CollaborateButton;
}),
"[project]/src/components/Footer/Footer.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "footer": "Footer-module__Grjkva__footer",
  "footer__bottom": "Footer-module__Grjkva__footer__bottom",
  "footer__content": "Footer-module__Grjkva__footer__content",
  "footer__link": "Footer-module__Grjkva__footer__link",
});
}),
"[project]/src/components/Footer/Footer.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Footer/Footer.module.css [ssr] (css module)");
;
;
const Footer = ({ copyrightHolderName, copyrightHolderUrl, redesignAuthorName, redesignAuthorUrl })=>{
    const currentYear = new Date().getFullYear();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footer,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footer__content,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footer__bottom,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    children: [
                        "© ",
                        currentYear,
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                            href: copyrightHolderUrl,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footer__link,
                            children: copyrightHolderName
                        }, void 0, false, {
                            fileName: "[project]/src/components/Footer/Footer.tsx",
                            lineNumber: 19,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        ". Todos direitos reservados. Remodelação visual e técnica independente por ",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                            href: redesignAuthorUrl,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footer__link,
                            children: redesignAuthorName
                        }, void 0, false, {
                            fileName: "[project]/src/components/Footer/Footer.tsx",
                            lineNumber: 28,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        "."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Footer/Footer.tsx",
                    lineNumber: 17,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/Footer/Footer.tsx",
                lineNumber: 16,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/Footer/Footer.tsx",
            lineNumber: 15,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/Footer/Footer.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Footer;
}),
"[project]/src/components/ScrollTopButton/ScrollTopButton.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "scroll-top": "ScrollTopButton-module__bZl0Ra__scroll-top",
  "show": "ScrollTopButton-module__bZl0Ra__show",
});
}),
"[project]/src/components/ScrollTopButton/ScrollTopButton.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScrollTopButton$2f$ScrollTopButton$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ScrollTopButton/ScrollTopButton.module.css [ssr] (css module)");
;
;
;
;
const ScrollTopButton = ()=>{
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const toggleVisibility = ()=>{
            setVisible(window.scrollY > 200);
        };
        window.addEventListener("scroll", toggleVisibility);
        return ()=>window.removeEventListener("scroll", toggleVisibility);
    }, []);
    const scrollToTop = ()=>{
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScrollTopButton$2f$ScrollTopButton$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].scrollTop} ${visible ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScrollTopButton$2f$ScrollTopButton$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].show : ""}`,
        onClick: scrollToTop,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaArrowUp"], {}, void 0, false, {
            fileName: "[project]/src/components/ScrollTopButton/ScrollTopButton.tsx",
            lineNumber: 25,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ScrollTopButton/ScrollTopButton.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = ScrollTopButton;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[project]/src/components/ScrollToTop.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
;
;
const ScrollToTop = ()=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [
        router.asPath
    ]);
    return null;
};
const __TURBOPACK__default__export__ = ScrollToTop;
}),
"[project]/src/assets/images/mz-logo.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/mz-logo.1f66bba0.png");}),
"[project]/src/assets/images/mz-logo.png.mjs { IMAGE => \"[project]/src/assets/images/mz-logo.png (static in ecmascript, tag client)\" } [ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$mz$2d$logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/images/mz-logo.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$mz$2d$logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 1998,
    height: 715,
    blurWidth: 8,
    blurHeight: 3,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAADCAYAAACuyE5IAAAAbklEQVR42gFjAJz/AAAAAAAUCwMVGw4EHB4QBCAhEQUjIREFIx4QBCAHBAEHAB4QBCCTUhubqWMlta5iJNC1ZSTbs2Ul26hfI88xGwk5ABULAxYwGggzOSALPFYvD2JeMxBqXTMQalYvD2MWDAQZVrsUGvdWUgcAAAAASUVORK5CYII="
};
}),
"[project]/src/data/personal.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "author",
    ()=>author,
    "authorUrl",
    ()=>authorUrl,
    "githubUrl",
    ()=>githubUrl,
    "inspiration",
    ()=>inspiration,
    "inspirationUrl",
    ()=>inspirationUrl,
    "mail",
    ()=>mail
]);
const githubUrl = "https://github.com/kesparleo/moz_community_remake";
const author = "Kespar";
const mail = 'kespar299@gmail.com';
const authorUrl = "https://linktr.ee/leokespar";
const inspiration = "MozComunidades";
const inspirationUrl = "https://mozcomunidades.web.app";
}),
"[project]/src/pages/index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
// pages/index.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2f$Hero$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Hero/Hero.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/List/List.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navbar$2f$Navbar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Navbar/Navbar.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Collaborate$2f$CollaborateButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Collaborate/CollaborateButton.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2f$Footer$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Footer/Footer.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScrollTopButton$2f$ScrollTopButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ScrollTopButton/ScrollTopButton.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScrollToTop$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ScrollToTop.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$mz$2d$logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$mz$2d$logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/images/mz-logo.png.mjs { IMAGE => "[project]/src/assets/images/mz-logo.png (static in ecmascript, tag client)" } [ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/personal.ts [ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
function Home({ theme, setTheme }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScrollTopButton$2f$ScrollTopButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScrollToTop$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navbar$2f$Navbar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                logo: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$mz$2d$logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$mz$2d$logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                theme: theme,
                setTheme: setTheme,
                items: [
                    {
                        id: 'home',
                        label: 'Topo'
                    },
                    {
                        id: 'communities',
                        label: 'Lista'
                    },
                    {
                        id: 'contact',
                        label: 'Contacto'
                    }
                ]
            }, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2f$Hero$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                logo: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$mz$2d$logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$mz$2d$logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                description: "Esta página foi criada exclusivamente para listar as comunidades de tecnologia e programação existentes em Moçambique...",
                buttonText: "Apreciar",
                buttonUrl: "#communities"
            }, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2f$List$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Collaborate$2f$CollaborateButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                githubUrl: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["githubUrl"],
                mail: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["mail"]
            }, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2f$Footer$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                copyrightHolderName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["inspiration"],
                copyrightHolderUrl: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["inspirationUrl"],
                redesignAuthorName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["author"],
                redesignAuthorUrl: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["authorUrl"]
            }, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/src/pages/_app.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MyApp
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$index$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/index.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
function MyApp({ Component, pageProps }) {
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return 'light';
        //TURBOPACK unreachable
        ;
        const saved = undefined;
    });
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [
        theme
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Component, {
        ...pageProps,
        theme: theme,
        setTheme: setTheme
    }, void 0, false, {
        fileName: "[project]/src/pages/_app.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0365cc22._.js.map