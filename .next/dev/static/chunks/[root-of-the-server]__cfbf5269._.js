(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/src/styles/Hero.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "--hero-logo": "Hero-module__fqhYwW__--hero-logo",
  "bounce": "Hero-module__fqhYwW__bounce",
  "hero": "Hero-module__fqhYwW__hero",
  "hero__button": "Hero-module__fqhYwW__hero__button",
  "hero__buttons": "Hero-module__fqhYwW__hero__buttons",
  "hero__content": "Hero-module__fqhYwW__hero__content",
  "hero__description": "Hero-module__fqhYwW__hero__description",
  "hero__logo": "Hero-module__fqhYwW__hero__logo",
  "hero__text": "Hero-module__fqhYwW__hero__text",
  "hidden": "Hero-module__fqhYwW__hidden",
  "visible": "Hero-module__fqhYwW__visible",
});
}),
"[project]/src/styles/Tooltip.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "tooltipFadeIn": "Tooltip-module__VfJNqa__tooltipFadeIn",
  "tooltip__content": "Tooltip-module__VfJNqa__tooltip__content",
  "tooltip__down": "Tooltip-module__VfJNqa__tooltip__down",
  "tooltip__left": "Tooltip-module__VfJNqa__tooltip__left",
  "tooltip__right": "Tooltip-module__VfJNqa__tooltip__right",
  "tooltip__up": "Tooltip-module__VfJNqa__tooltip__up",
  "tooltip__wrapper": "Tooltip-module__VfJNqa__tooltip__wrapper",
});
}),
"[project]/src/components/Tooltip.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Tooltip$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/Tooltip.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
const Tooltip = ({ text, delay = 3000, duration, position = 'up', children })=>{
    _s();
    const wrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [triggered, setTriggered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Tooltip.useEffect": ()=>{
            if (!wrapperRef.current || triggered) return;
            const observer = new IntersectionObserver({
                "Tooltip.useEffect": ([entry])=>{
                    if (entry.isIntersecting) {
                        setTriggered(true);
                        observer.disconnect();
                    }
                }
            }["Tooltip.useEffect"], {
                threshold: 0.25
            });
            observer.observe(wrapperRef.current);
            return ({
                "Tooltip.useEffect": ()=>observer.disconnect()
            })["Tooltip.useEffect"];
        }
    }["Tooltip.useEffect"], [
        triggered
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Tooltip.useEffect": ()=>{
            if (!triggered) return;
            const showTimer = window.setTimeout({
                "Tooltip.useEffect.showTimer": ()=>setVisible(true)
            }["Tooltip.useEffect.showTimer"], delay);
            return ({
                "Tooltip.useEffect": ()=>clearTimeout(showTimer)
            })["Tooltip.useEffect"];
        }
    }["Tooltip.useEffect"], [
        triggered,
        delay
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Tooltip.useEffect": ()=>{
            if (!visible || !duration) return;
            const hideTimer = window.setTimeout({
                "Tooltip.useEffect.hideTimer": ()=>setVisible(false)
            }["Tooltip.useEffect.hideTimer"], duration);
            return ({
                "Tooltip.useEffect": ()=>clearTimeout(hideTimer)
            })["Tooltip.useEffect"];
        }
    }["Tooltip.useEffect"], [
        visible,
        duration
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        ref: wrapperRef,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Tooltip$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tooltip__wrapper,
        children: [
            children,
            visible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Tooltip$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tooltip__content} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Tooltip$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"][`tooltip__${position}`]}`,
                children: text
            }, void 0, false, {
                fileName: "[project]/src/components/Tooltip.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Tooltip.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Tooltip, "arlPqpWSo1WZF3PP/uoaGNwaVBA=");
_c = Tooltip;
const __TURBOPACK__default__export__ = Tooltip;
var _c;
__turbopack_context__.k.register(_c, "Tooltip");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useIsTop.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useIsTop",
    ()=>useIsTop
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useIsTop(offset = 10) {
    _s();
    const [isTop, setIsTop] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useIsTop.useEffect": ()=>{
            let ticking = false;
            const handleScroll = {
                "useIsTop.useEffect.handleScroll": ()=>{
                    if (!ticking) {
                        window.requestAnimationFrame({
                            "useIsTop.useEffect.handleScroll": ()=>{
                                setIsTop(window.scrollY < offset);
                                ticking = false;
                            }
                        }["useIsTop.useEffect.handleScroll"]);
                        ticking = true;
                    }
                }
            }["useIsTop.useEffect.handleScroll"];
            window.addEventListener("scroll", handleScroll);
            handleScroll();
            return ({
                "useIsTop.useEffect": ()=>window.removeEventListener("scroll", handleScroll)
            })["useIsTop.useEffect"];
        }
    }["useIsTop.useEffect"], [
        offset
    ]);
    return isTop;
}
_s(useIsTop, "gcakJdrH0ytDcgGElSQOOeTdCss=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Hero.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Hero$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/Hero.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Tooltip.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useIsTop$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useIsTop.ts [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const Hero = ({ description, buttonText, buttonUrl })=>{
    _s();
    const isTop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useIsTop$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useIsTop"])(10);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "home",
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Hero$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Hero$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero__text}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Hero$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero__content} ${isTop ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Hero$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].visible : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Hero$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hidden}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/mz_logo.png",
                        alt: "Logo",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Hero$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero__logo
                    }, void 0, false, {
                        fileName: "[project]/src/components/Hero.tsx",
                        lineNumber: 22,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/Hero.tsx",
                    lineNumber: 21,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Hero$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero__description,
                    children: description
                }, void 0, false, {
                    fileName: "[project]/src/components/Hero.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Hero$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero__buttons,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        text: "Clique e encontre a sua comunidade",
                        position: "down",
                        duration: 12000,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: buttonUrl,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Hero$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero__button,
                            children: buttonText
                        }, void 0, false, {
                            fileName: "[project]/src/components/Hero.tsx",
                            lineNumber: 31,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Hero.tsx",
                        lineNumber: 26,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/Hero.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Hero.tsx",
            lineNumber: 16,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/Hero.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Hero, "jAFzDJqddvP1f1Db9SkXDg8yyCw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useIsTop$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useIsTop"]
    ];
});
_c = Hero;
const __TURBOPACK__default__export__ = Hero;
var _c;
__turbopack_context__.k.register(_c, "Hero");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/List.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "button__format": "List-module__33HuFG__button__format",
  "destaque": "List-module__33HuFG__destaque",
  "events": "List-module__33HuFG__events",
  "grid-view": "List-module__33HuFG__grid-view",
  "list": "List-module__33HuFG__list",
  "list-view": "List-module__33HuFG__list-view",
  "list__actions": "List-module__33HuFG__list__actions",
  "list__categories": "List-module__33HuFG__list__categories",
  "list__category": "List-module__33HuFG__list__category",
  "list__contact": "List-module__33HuFG__list__contact",
  "list__contact-button": "List-module__33HuFG__list__contact-button",
  "list__content": "List-module__33HuFG__list__content",
  "list__description": "List-module__33HuFG__list__description",
  "list__header": "List-module__33HuFG__list__header",
  "list__heading": "List-module__33HuFG__list__heading",
  "list__intro": "List-module__33HuFG__list__intro",
  "list__item": "List-module__33HuFG__list__item",
  "list__items-container": "List-module__33HuFG__list__items-container",
  "list__logo": "List-module__33HuFG__list__logo",
  "list__more": "List-module__33HuFG__list__more",
  "list__row": "List-module__33HuFG__list__row",
  "list__social": "List-module__33HuFG__list__social",
  "list__social-icon": "List-module__33HuFG__list__social-icon",
  "list__title": "List-module__33HuFG__list__title",
  "secundario": "List-module__33HuFG__secundario",
});
}),
"[project]/src/hooks/useCommunities.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCommunities",
    ()=>useCommunities
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function parsePgArray(value) {
    if (Array.isArray(value)) return value;
    if (typeof value !== "string") return [];
    return value.replace(/^{|}$/g, "").split(",").filter(Boolean);
}
function useCommunities() {
    _s();
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("list");
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isMobile, setIsMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [communities, setCommunities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCommunities.useEffect": ()=>{
            const updateIsMobile = {
                "useCommunities.useEffect.updateIsMobile": ()=>setIsMobile(window.innerWidth <= 1023)
            }["useCommunities.useEffect.updateIsMobile"];
            updateIsMobile();
            window.addEventListener("resize", updateIsMobile);
            return ({
                "useCommunities.useEffect": ()=>window.removeEventListener("resize", updateIsMobile)
            })["useCommunities.useEffect"];
        }
    }["useCommunities.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCommunities.useEffect": ()=>{
            async function load() {
                try {
                    const res = await fetch("/api/communities");
                    if (!res.ok) {
                        console.warn(`⚠️ Falha ao chamar API de comunidades: HTTP ${res.status} - ${res.statusText}`);
                        setCommunities([]);
                        return;
                    }
                    const data = await res.json();
                    if (!Array.isArray(data)) {
                        console.warn("⚠️ API não retornou array de comunidades:", data);
                        setCommunities([]);
                        return;
                    }
                    const normalized = data.map({
                        "useCommunities.useEffect.load.normalized": (item)=>({
                                ...item,
                                categories: parsePgArray(item.categories),
                                social: item.social ?? {}
                            })
                    }["useCommunities.useEffect.load.normalized"]);
                    console.log("✅ Comunidades carregadas com sucesso:", normalized.length, "registos");
                    setCommunities(normalized.sort({
                        "useCommunities.useEffect.load": ()=>Math.random() - 0.5
                    }["useCommunities.useEffect.load"]));
                } catch (err) {
                    let message = "Erro desconhecido ao carregar comunidades";
                    if (err instanceof Error) message = err.message;
                    console.error("❌ Erro ao buscar comunidades:", message, "\nDetalhes:", err);
                    setCommunities([]);
                }
            }
            load();
        }
    }["useCommunities.useEffect"], []);
    const allCategories = Array.from(new Set(communities.flatMap((c)=>c.categories)));
    const filteredData = communities.filter((c)=>c.title.toLowerCase().includes(searchTerm.toLowerCase()) && (!selectedCategory || c.categories.includes(selectedCategory)));
    return {
        view,
        setView,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        isMobile,
        communities,
        filteredData,
        allCategories
    };
}
_s(useCommunities, "jSAE/5ilgZHc5gRQJdvRfNNxVxU=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/SearchBar.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "expanded": "SearchBar-module__gLWCjG__expanded",
  "search__bar": "SearchBar-module__gLWCjG__search__bar",
  "search__bar__icon": "SearchBar-module__gLWCjG__search__bar__icon",
  "search__bar__input": "SearchBar-module__gLWCjG__search__bar__input",
});
}),
"[project]/src/components/SearchBar.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$SearchBar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/SearchBar.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const SearchBar = ({ searchTerm, setSearchTerm })=>{
    _s();
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$SearchBar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].search__bar} ${expanded ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$SearchBar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expanded : ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$SearchBar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].search__bar__icon,
                onClick: ()=>setExpanded(!expanded),
                "aria-label": "Pesquisar",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaSearch"], {}, void 0, false, {
                    fileName: "[project]/src/components/SearchBar.tsx",
                    lineNumber: 16,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/SearchBar.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                placeholder: "Pesquisar por nome...",
                value: searchTerm,
                onChange: (e)=>setSearchTerm(e.target.value),
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$SearchBar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].search__bar__input
            }, void 0, false, {
                fileName: "[project]/src/components/SearchBar.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/SearchBar.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(SearchBar, "DuL5jiiQQFgbn7gBKAyxwS/H4Ek=");
_c = SearchBar;
const __TURBOPACK__default__export__ = SearchBar;
var _c;
__turbopack_context__.k.register(_c, "SearchBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/CategorySelector.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "button__format": "CategorySelector-module__TV0RKG__button__format",
  "category__selector": "CategorySelector-module__TV0RKG__category__selector",
  "category__selector__item": "CategorySelector-module__TV0RKG__category__selector__item",
  "category__selector__list": "CategorySelector-module__TV0RKG__category__selector__list",
});
}),
"[project]/src/components/CategorySelector.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CategorySelector$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/CategorySelector.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
const CategorySelector = ({ categories, selectedCategory, setSelectedCategory })=>{
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CategorySelector$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].category__selector,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CategorySelector$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].button__format,
                onClick: ()=>setOpen(!open),
                children: selectedCategory || "Categoria"
            }, void 0, false, {
                fileName: "[project]/src/components/CategorySelector.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CategorySelector$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].category__selector__list,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CategorySelector$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].category__selector__item,
                        onClick: ()=>{
                            setSelectedCategory("");
                            setOpen(false);
                        },
                        children: "Todas"
                    }, void 0, false, {
                        fileName: "[project]/src/components/CategorySelector.tsx",
                        lineNumber: 23,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    categories.slice().sort().map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CategorySelector$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].category__selector__item,
                            onClick: ()=>{
                                setSelectedCategory(cat);
                                setOpen(false);
                            },
                            children: cat
                        }, cat, false, {
                            fileName: "[project]/src/components/CategorySelector.tsx",
                            lineNumber: 33,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/CategorySelector.tsx",
                lineNumber: 22,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/CategorySelector.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CategorySelector, "xG1TONbKtDWtdOTrXaTAsNhPg/Q=");
_c = CategorySelector;
const __TURBOPACK__default__export__ = CategorySelector;
var _c;
__turbopack_context__.k.register(_c, "CategorySelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/Events.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "events__button": "Events-module__nzsUqW__events__button",
  "events__card": "Events-module__nzsUqW__events__card",
  "events__container": "Events-module__nzsUqW__events__container",
  "events__date": "Events-module__nzsUqW__events__date",
  "events__image": "Events-module__nzsUqW__events__image",
  "events__no-results": "Events-module__nzsUqW__events__no-results",
  "events__title": "Events-module__nzsUqW__events__title",
});
}),
"[project]/src/assets/images/django_event.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/django_event.540cd70f.png");}),
"[project]/src/assets/images/django_event.png.mjs { IMAGE => \"[project]/src/assets/images/django_event.png (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/events.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "eventsData",
    ()=>eventsData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$django_event$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$django_event$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/images/django_event.png.mjs { IMAGE => "[project]/src/assets/images/django_event.png (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
;
const eventsData = [
    {
        title: "",
        communities: [
            "Django Girls Moz",
            'Pyladies Maputo'
        ],
        date: "2026-03-21",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$django_event$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$django_event$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useUpcomingEvent.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUpcomingEvents",
    ()=>useUpcomingEvents
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$events$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/events.ts [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useUpcomingEvents(communityNames) {
    _s();
    const [upcomingEvents, setUpcomingEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useUpcomingEvents.useEffect": ()=>{
            const now = new Date();
            const filtered = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$events$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["eventsData"].filter({
                "useUpcomingEvents.useEffect.filtered": (event)=>{
                    const eventDate = new Date(event.date);
                    return eventDate >= now && (!communityNames || event.communities.some({
                        "useUpcomingEvents.useEffect.filtered": (c)=>communityNames.includes(c)
                    }["useUpcomingEvents.useEffect.filtered"]));
                }
            }["useUpcomingEvents.useEffect.filtered"]);
            setUpcomingEvents(filtered);
        }
    }["useUpcomingEvents.useEffect"], [
        communityNames
    ]);
    return upcomingEvents;
}
_s(useUpcomingEvents, "mMNN2CDd+4G2Ud4mT9xSgHfS3B0=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/EventCard.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Events$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/Events.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useUpcomingEvent$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useUpcomingEvent.ts [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
const Events = ({ communityNames })=>{
    _s();
    const upcomingEvents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useUpcomingEvent$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useUpcomingEvents"])(communityNames);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Events$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].events__container,
        children: upcomingEvents.map((event, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Events$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].events__card,
                children: [
                    event.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: event.image,
                        alt: event.title,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Events$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].events__image
                    }, void 0, false, {
                        fileName: "[project]/src/components/EventCard.tsx",
                        lineNumber: 12,
                        columnNumber: 27
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Events$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].events__title,
                        children: event.title
                    }, void 0, false, {
                        fileName: "[project]/src/components/EventCard.tsx",
                        lineNumber: 13,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Events$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].events__date,
                        children: new Date(event.date).toLocaleDateString()
                    }, void 0, false, {
                        fileName: "[project]/src/components/EventCard.tsx",
                        lineNumber: 14,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    event.link && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: event.link,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Events$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].events__button,
                        children: "Participar"
                    }, void 0, false, {
                        fileName: "[project]/src/components/EventCard.tsx",
                        lineNumber: 16,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, idx, true, {
                fileName: "[project]/src/components/EventCard.tsx",
                lineNumber: 11,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)))
    }, void 0, false, {
        fileName: "[project]/src/components/EventCard.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Events, "QiOUKiP17kXJHZqIB+HUT4jERqc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useUpcomingEvent$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useUpcomingEvents"]
    ];
});
_c = Events;
const __TURBOPACK__default__export__ = Events;
var _c;
__turbopack_context__.k.register(_c, "Events");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/data.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "socialOrder",
    ()=>socialOrder
]);
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/communityCard.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/List.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$EventCard$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/EventCard.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$data$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/data.ts [client] (ecmascript)");
;
;
;
;
;
;
const iconMap = {
    facebook: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaFacebookF"], {}, void 0, false, {
        fileName: "[project]/src/components/communityCard.tsx",
        lineNumber: 34,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    twitter: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaTwitter"], {}, void 0, false, {
        fileName: "[project]/src/components/communityCard.tsx",
        lineNumber: 35,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0)),
    instagram: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaInstagram"], {}, void 0, false, {
        fileName: "[project]/src/components/communityCard.tsx",
        lineNumber: 36,
        columnNumber: 14
    }, ("TURBOPACK compile-time value", void 0)),
    linkedin: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaLinkedinIn"], {}, void 0, false, {
        fileName: "[project]/src/components/communityCard.tsx",
        lineNumber: 37,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    whatsapp: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaWhatsapp"], {}, void 0, false, {
        fileName: "[project]/src/components/communityCard.tsx",
        lineNumber: 38,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    github: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaGithub"], {}, void 0, false, {
        fileName: "[project]/src/components/communityCard.tsx",
        lineNumber: 39,
        columnNumber: 11
    }, ("TURBOPACK compile-time value", void 0)),
    telegram: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaTelegram"], {}, void 0, false, {
        fileName: "[project]/src/components/communityCard.tsx",
        lineNumber: 40,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    youtube: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaYoutube"], {}, void 0, false, {
        fileName: "[project]/src/components/communityCard.tsx",
        lineNumber: 41,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0))
};
const categoryIconMap = {
    Coding: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaCode"], {}, void 0, false, {
        fileName: "[project]/src/components/communityCard.tsx",
        lineNumber: 45,
        columnNumber: 11
    }, ("TURBOPACK compile-time value", void 0)),
    "Artificial Intelligence": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaBrain"], {}, void 0, false, {
        fileName: "[project]/src/components/communityCard.tsx",
        lineNumber: 46,
        columnNumber: 30
    }, ("TURBOPACK compile-time value", void 0)),
    Data: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaDatabase"], {}, void 0, false, {
        fileName: "[project]/src/components/communityCard.tsx",
        lineNumber: 47,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    Networks: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaNetworkWired"], {}, void 0, false, {
        fileName: "[project]/src/components/communityCard.tsx",
        lineNumber: 48,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    Cybersecurity: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaShieldAlt"], {}, void 0, false, {
        fileName: "[project]/src/components/communityCard.tsx",
        lineNumber: 49,
        columnNumber: 18
    }, ("TURBOPACK compile-time value", void 0)),
    Design: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaPalette"], {}, void 0, false, {
        fileName: "[project]/src/components/communityCard.tsx",
        lineNumber: 50,
        columnNumber: 11
    }, ("TURBOPACK compile-time value", void 0)),
    Hacking: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaUserSecret"], {}, void 0, false, {
        fileName: "[project]/src/components/communityCard.tsx",
        lineNumber: 51,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0)),
    Cloud: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaCloud"], {}, void 0, false, {
        fileName: "[project]/src/components/communityCard.tsx",
        lineNumber: 52,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)),
    Infrastructure: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaCogs"], {}, void 0, false, {
        fileName: "[project]/src/components/communityCard.tsx",
        lineNumber: 53,
        columnNumber: 19
    }, ("TURBOPACK compile-time value", void 0))
};
const CommunityCard = ({ item, view, isMobile })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__item,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: item.logo || "https://mozcomunidades.web.app/images/comunities/logo.png",
                alt: item.title,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__logo
            }, void 0, false, {
                fileName: "[project]/src/components/communityCard.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            view === "list" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__content,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__title,
                        children: item.title
                    }, void 0, false, {
                        fileName: "[project]/src/components/communityCard.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].categories,
                        children: item.categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__category,
                                children: [
                                    categoryIconMap[cat],
                                    " ",
                                    cat
                                ]
                            }, cat, true, {
                                fileName: "[project]/src/components/communityCard.tsx",
                                lineNumber: 71,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/components/communityCard.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__row,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__description,
                                children: item.description
                            }, void 0, false, {
                                fileName: "[project]/src/components/communityCard.tsx",
                                lineNumber: 78,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__more,
                                href: `/community/${item.title.toLowerCase().replace(/\s+/g, "-")}`,
                                children: "Saber mais"
                            }, void 0, false, {
                                fileName: "[project]/src/components/communityCard.tsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/communityCard.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].events,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$EventCard$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            communityNames: [
                                item.title
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/communityCard.tsx",
                            lineNumber: 89,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/communityCard.tsx",
                        lineNumber: 88,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__social,
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$data$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["socialOrder"].map((key)=>item.social[key] && iconMap[key] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                href: item.social[key],
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"]['list__social-icon']} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"][`list__social-${key}`]}`,
                                style: {
                                    "--hover-color": item.color
                                },
                                children: iconMap[key]
                            }, key, false, {
                                fileName: "[project]/src/components/communityCard.tsx",
                                lineNumber: 96,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)) : null)
                    }, void 0, false, {
                        fileName: "[project]/src/components/communityCard.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__contact,
                        children: item.mail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `mailto:${item.mail}`,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"]['list__contact-button'],
                            children: "Contactar"
                        }, void 0, false, {
                            fileName: "[project]/src/components/communityCard.tsx",
                            lineNumber: 112,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/communityCard.tsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/communityCard.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__title,
                href: `/community/${item.title.toLowerCase().replace(/\s+/g, "-")}`,
                children: item.title
            }, void 0, false, {
                fileName: "[project]/src/components/communityCard.tsx",
                lineNumber: 122,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            !isMobile && view === "list" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].events,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$EventCard$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    communityNames: [
                        item.title
                    ]
                }, void 0, false, {
                    fileName: "[project]/src/components/communityCard.tsx",
                    lineNumber: 132,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/communityCard.tsx",
                lineNumber: 131,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/communityCard.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = CommunityCard;
const __TURBOPACK__default__export__ = CommunityCard;
var _c;
__turbopack_context__.k.register(_c, "CommunityCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/List.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/List.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCommunities$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useCommunities.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SearchBar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SearchBar.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CategorySelector$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CategorySelector.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Tooltip.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$communityCard$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/communityCard.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
const Communities = ()=>{
    _s();
    const { view, setView, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, isMobile, filteredData, allCategories } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCommunities$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useCommunities"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "communities",
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__background}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__heading,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].destaqie,
                                children: "Veja"
                            }, void 0, false, {
                                fileName: "[project]/src/components/List.tsx",
                                lineNumber: 26,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].secundario,
                                children: "Abaixo"
                            }, void 0, false, {
                                fileName: "[project]/src/components/List.tsx",
                                lineNumber: 27,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/List.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__intro,
                        children: "Lista de Comunidades de Tecnologia e Programação em Moçambique"
                    }, void 0, false, {
                        fileName: "[project]/src/components/List.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__actions,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                text: "Pesquise por nome",
                                position: "left",
                                duration: 4000,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SearchBar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    searchTerm: searchTerm,
                                    setSearchTerm: setSearchTerm
                                }, void 0, false, {
                                    fileName: "[project]/src/components/List.tsx",
                                    lineNumber: 34,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/List.tsx",
                                lineNumber: 33,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                text: "Busque por categoria",
                                duration: 6000,
                                delay: 5000,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CategorySelector$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    categories: allCategories,
                                    selectedCategory: selectedCategory,
                                    setSelectedCategory: setSelectedCategory
                                }, void 0, false, {
                                    fileName: "[project]/src/components/List.tsx",
                                    lineNumber: 37,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/List.tsx",
                                lineNumber: 36,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                text: "Lista / Grelha",
                                position: "down",
                                delay: 7000,
                                duration: 4000,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setView(view === "grid" ? "list" : "grid"),
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].button__format,
                                    children: view === "grid" ? "List" : "Grid"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/List.tsx",
                                    lineNumber: 44,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/List.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/List.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/List.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__items_container} ${view === "grid" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].grid_view : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list_view}`,
                children: filteredData.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$communityCard$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        item: item,
                        view: view,
                        isMobile: isMobile
                    }, index, false, {
                        fileName: "[project]/src/components/List.tsx",
                        lineNumber: 53,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/src/components/List.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            filteredData.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"]['list__no-results'],
                children: "Nenhuma comunidade encontrada."
            }, void 0, false, {
                fileName: "[project]/src/components/List.tsx",
                lineNumber: 57,
                columnNumber: 37
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/List.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Communities, "2lhHOyfq8buVRRZy2gTeb7dWLQk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCommunities$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useCommunities"]
    ];
});
_c = Communities;
const __TURBOPACK__default__export__ = Communities;
var _c;
__turbopack_context__.k.register(_c, "Communities");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/Navbar.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active": "Navbar-module__P48_Aa__active",
  "button__format": "Navbar-module__P48_Aa__button__format",
  "icon": "Navbar-module__P48_Aa__icon",
  "logo": "Navbar-module__P48_Aa__logo",
  "navbar": "Navbar-module__P48_Aa__navbar",
  "navbar--scrolled": "Navbar-module__P48_Aa__navbar--scrolled",
  "navbar--top": "Navbar-module__P48_Aa__navbar--top",
  "navbar__action": "Navbar-module__P48_Aa__navbar__action",
  "navbar__hamburger": "Navbar-module__P48_Aa__navbar__hamburger",
  "navbar__hamburger_and_theme": "Navbar-module__P48_Aa__navbar__hamburger_and_theme",
  "navbar__icons": "Navbar-module__P48_Aa__navbar__icons",
  "navbar__links": "Navbar-module__P48_Aa__navbar__links",
  "navbar__logo": "Navbar-module__P48_Aa__navbar__logo",
  "theme-toggle": "Navbar-module__P48_Aa__theme-toggle",
  "theme__toggle": "Navbar-module__P48_Aa__theme__toggle",
});
}),
"[project]/src/hooks/useMediaQuery.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMediaQuery",
    ()=>useMediaQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useMediaQuery(query) {
    _s();
    const [matches, setMatches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMediaQuery.useEffect": ()=>{
            const media = window.matchMedia(query);
            setMatches(media.matches);
            const listener = {
                "useMediaQuery.useEffect.listener": ()=>setMatches(media.matches)
            }["useMediaQuery.useEffect.listener"];
            media.addEventListener("change", listener);
            return ({
                "useMediaQuery.useEffect": ()=>media.removeEventListener("change", listener)
            })["useMediaQuery.useEffect"];
        }
    }["useMediaQuery.useEffect"], [
        query
    ]);
    return matches;
}
_s(useMediaQuery, "/aV7jSECvYA0Ea4uAEPK2AzROhs=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useScrollSpy.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useScrollSpy",
    ()=>useScrollSpy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useScrollSpy(offset = 120) {
    _s();
    const [isTop, setIsTop] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [activeSection, setActiveSection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useScrollSpy.useEffect": ()=>{
            const sections = document.querySelectorAll("section[id]");
            let ticking = false;
            const onScroll = {
                "useScrollSpy.useEffect.onScroll": ()=>{
                    if (!ticking) {
                        window.requestAnimationFrame({
                            "useScrollSpy.useEffect.onScroll": ()=>{
                                const scrollY = window.scrollY;
                                setIsTop(scrollY < 10);
                                const scrollPos = scrollY + offset;
                                sections.forEach({
                                    "useScrollSpy.useEffect.onScroll": (sec)=>{
                                        if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
                                            setActiveSection(sec.id);
                                        }
                                    }
                                }["useScrollSpy.useEffect.onScroll"]);
                                ticking = false;
                            }
                        }["useScrollSpy.useEffect.onScroll"]);
                        ticking = true;
                    }
                }
            }["useScrollSpy.useEffect.onScroll"];
            window.addEventListener("scroll", onScroll);
            onScroll();
            return ({
                "useScrollSpy.useEffect": ()=>window.removeEventListener("scroll", onScroll)
            })["useScrollSpy.useEffect"];
        }
    }["useScrollSpy.useEffect"], [
        offset
    ]);
    return {
        isTop,
        activeSection
    };
}
_s(useScrollSpy, "d0kHZCUViainQxVdrwn7Gg/7Z6Y=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Navbar.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/Navbar.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useMediaQuery.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useScrollSpy$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useScrollSpy.ts [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
const Navbar = ({ items, theme, setTheme })=>{
    _s();
    const [menuOpen, setMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isMobile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useMediaQuery"])("(max-width: 768px)");
    const { isTop, activeSection } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useScrollSpy$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useScrollSpy"])(120);
    const toggleTheme = ()=>setTheme(theme === "light" ? "dark" : "light");
    const renderLinks = ()=>items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
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
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].someOtherClass} ${activeSection === item.id ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navbar__action : ""}`,
                children: item.label
            }, item.id, false, {
                fileName: "[project]/src/components/Navbar.tsx",
                lineNumber: 17,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navbar} ${isTop ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"]["navbar--top"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"]["navbar--scrolled"]}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navbar__logo,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: "/mz_logo.png",
                    alt: "Logo Moz Communities",
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].logo
                }, void 0, false, {
                    fileName: "[project]/src/components/Navbar.tsx",
                    lineNumber: 38,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/Navbar.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            !isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navbar__links} ${menuOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].active : ""}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navbar__icons,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].theme__toggle,
                            onClick: toggleTheme,
                            children: theme === "light" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaSun"], {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].icon
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 46,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaMoon"], {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].icon
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 48,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar.tsx",
                            lineNumber: 44,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar.tsx",
                        lineNumber: 43,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    renderLinks()
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Navbar.tsx",
                lineNumber: 42,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navbar__hamburger_and_theme,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].theme__toggle,
                        onClick: toggleTheme,
                        children: theme === "light" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaSun"], {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].icon
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar.tsx",
                            lineNumber: 60,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaMoon"], {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].icon
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar.tsx",
                            lineNumber: 62,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar.tsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navbar__hamburger,
                        onClick: ()=>setMenuOpen(!menuOpen),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaBars"], {}, void 0, false, {
                            fileName: "[project]/src/components/Navbar.tsx",
                            lineNumber: 69,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar.tsx",
                        lineNumber: 65,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Navbar.tsx",
                lineNumber: 57,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            isMobile && menuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navbar__links} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].active}`,
                children: renderLinks()
            }, void 0, false, {
                fileName: "[project]/src/components/Navbar.tsx",
                lineNumber: 75,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Navbar.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Navbar, "gruxDBkq4wJaM44ZHndxNJtWpKY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useMediaQuery$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useMediaQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useScrollSpy$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useScrollSpy"]
    ];
});
_c = Navbar;
const __TURBOPACK__default__export__ = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/CollaborateButton.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "collaborate": "CollaborateButton-module__F-Q4GG__collaborate",
  "collaborate-wrapper": "CollaborateButton-module__F-Q4GG__collaborate-wrapper",
  "hero__github": "CollaborateButton-module__F-Q4GG__hero__github",
});
}),
"[project]/src/components/CollaborateButton.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CollaborateButton$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/CollaborateButton.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Tooltip.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
;
;
;
;
;
const CollaborateButton = ({ mail, githubUrl })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        id: "contact",
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CollaborateButton$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"]['collaborate-wrapper'],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                text: "Colabore com uma mensagem",
                position: "up",
                duration: 3000,
                delay: 4000,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    href: `mailto:${mail}?subject=Colaboração%20com%20o%20projecto`,
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CollaborateButton$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].collaborate,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaEnvelope"], {}, void 0, false, {
                        fileName: "[project]/src/components/CollaborateButton.tsx",
                        lineNumber: 17,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/CollaborateButton.tsx",
                    lineNumber: 13,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/CollaborateButton.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                text: "⭐ Deixe uma estrela",
                position: "down",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    href: githubUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CollaborateButton$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero__github,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaGithub"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CollaborateButton$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"]['hero__github-icon']
                    }, void 0, false, {
                        fileName: "[project]/src/components/CollaborateButton.tsx",
                        lineNumber: 28,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/CollaborateButton.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/CollaborateButton.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/CollaborateButton.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = CollaborateButton;
const __TURBOPACK__default__export__ = CollaborateButton;
var _c;
__turbopack_context__.k.register(_c, "CollaborateButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/Footer.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "footer": "Footer-module__UDEoiW__footer",
  "footer__bottom": "Footer-module__UDEoiW__footer__bottom",
  "footer__content": "Footer-module__UDEoiW__footer__content",
  "footer__link": "Footer-module__UDEoiW__footer__link",
});
}),
"[project]/src/components/Footer.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Footer$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/Footer.module.css [client] (css module)");
;
;
const Footer = ({ copyrightHolderName, copyrightHolderUrl, redesignAuthorName, redesignAuthorUrl })=>{
    const currentYear = new Date().getFullYear();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Footer$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].footer,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Footer$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].footer__content,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Footer$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].footer__bottom,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: [
                        "© ",
                        currentYear,
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: copyrightHolderUrl,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Footer$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].footer__link,
                            children: copyrightHolderName
                        }, void 0, false, {
                            fileName: "[project]/src/components/Footer.tsx",
                            lineNumber: 18,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        ". Todos direitos reservados. Remodelação visual e técnica independente por ",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: redesignAuthorUrl,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Footer$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].footer__link,
                            children: redesignAuthorName
                        }, void 0, false, {
                            fileName: "[project]/src/components/Footer.tsx",
                            lineNumber: 27,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        "."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Footer.tsx",
                    lineNumber: 16,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/Footer.tsx",
                lineNumber: 15,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/Footer.tsx",
            lineNumber: 14,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/Footer.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Footer;
const __TURBOPACK__default__export__ = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/ScrollTopButton.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "scroll__top": "ScrollTopButton-module__rYRroa__scroll__top",
  "show": "ScrollTopButton-module__rYRroa__show",
});
}),
"[project]/src/components/ScrollTopButton.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$ScrollTopButton$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/ScrollTopButton.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
const ScrollTopButton = ()=>{
    _s();
    const visible = useScrollThreshold(200);
    const scrollToTop = ()=>{
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$ScrollTopButton$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].scroll__top} ${visible ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$ScrollTopButton$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].show : ""}`,
        onClick: scrollToTop,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaArrowUp"], {}, void 0, false, {
            fileName: "[project]/src/components/ScrollTopButton.tsx",
            lineNumber: 17,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ScrollTopButton.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ScrollTopButton, "Z/c7XOpwVl/+BAy41DsgacGfXTw=", true);
_c = ScrollTopButton;
const __TURBOPACK__default__export__ = ScrollTopButton;
var _c;
__turbopack_context__.k.register(_c, "ScrollTopButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ScrollToTop.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
const ScrollToTop = ()=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScrollToTop.useEffect": ()=>{
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }["ScrollToTop.useEffect"], [
        router.asPath
    ]);
    return null;
};
_s(ScrollToTop, "vQduR7x+OPXj6PSmJyFnf+hU7bg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ScrollToTop;
const __TURBOPACK__default__export__ = ScrollToTop;
var _c;
__turbopack_context__.k.register(_c, "ScrollToTop");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/personal.ts [client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/pages/index.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Hero.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/List.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navbar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Navbar.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CollaborateButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CollaborateButton.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Footer.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScrollTopButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ScrollTopButton.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScrollToTop$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ScrollToTop.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/personal.ts [client] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScrollTopButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScrollToTop$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navbar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
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
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                description: "Está pagina foi criada exclusivamente para listar as comunidades de técnologia e programação existentes em Moçambique. É provável que não estejam todas na lista, para isso criamos um meio de submissão abaixo de comunidades para posterior publicação na página.",
                buttonText: "Apreciar",
                buttonUrl: "#communities"
            }, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CollaborateButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                githubUrl: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["githubUrl"],
                mail: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["mail"]
            }, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                copyrightHolderName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["inspiration"],
                copyrightHolderUrl: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["inspirationUrl"],
                redesignAuthorName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["author"],
                redesignAuthorUrl: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["authorUrl"]
            }, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/index.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/index.tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/index\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/index.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__cfbf5269._.js.map