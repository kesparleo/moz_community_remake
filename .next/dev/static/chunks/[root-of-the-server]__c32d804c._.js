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
"[project]/src/components/Hero.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Hero$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/Hero.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Tooltip.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const Hero = ({ logo, description, buttonText, buttonUrl })=>{
    _s();
    const [isTop, setIsTop] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Hero.useEffect": ()=>{
            const handleScroll = {
                "Hero.useEffect.handleScroll": ()=>{
                    setIsTop(window.scrollY < 10);
                }
            }["Hero.useEffect.handleScroll"];
            window.addEventListener("scroll", handleScroll);
            return ({
                "Hero.useEffect": ()=>window.removeEventListener("scroll", handleScroll)
            })["Hero.useEffect"];
        }
    }["Hero.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "home",
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Hero$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Hero$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero__text}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Hero$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero__content} ${isTop ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Hero$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].visible : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Hero$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hidden}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: logo,
                        alt: "",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Hero$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero__logo
                    }, void 0, false, {
                        fileName: "[project]/src/components/Hero.tsx",
                        lineNumber: 30,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/Hero.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Hero$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero__description,
                    children: description
                }, void 0, false, {
                    fileName: "[project]/src/components/Hero.tsx",
                    lineNumber: 32,
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
                            lineNumber: 39,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Hero.tsx",
                        lineNumber: 34,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/Hero.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Hero.tsx",
            lineNumber: 24,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/Hero.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Hero, "gcakJdrH0ytDcgGElSQOOeTdCss=");
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
"[project]/src/data/community.ts [client] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/components/CategorySelector.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const CategorySelector = ({ categories, selectedCategory, setSelectedCategory })=>{
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "category-selector",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "button__format",
                onClick: ()=>setOpen(!open),
                children: selectedCategory || "Categoria"
            }, void 0, false, {
                fileName: "[project]/src/components/CategorySelector.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "category-selector__list",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "category-selector__item",
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
                            className: "category-selector__item",
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
"[project]/src/components/List.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/List.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$community$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/community.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SearchBar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SearchBar.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CategorySelector$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CategorySelector.tsx [client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './Events/EventCard'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Tooltip.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
    facebook: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaFacebookF"], {}, void 0, false, {
        fileName: "[project]/src/components/List.tsx",
        lineNumber: 33,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    twitter: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaTwitter"], {}, void 0, false, {
        fileName: "[project]/src/components/List.tsx",
        lineNumber: 34,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0)),
    instagram: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaInstagram"], {}, void 0, false, {
        fileName: "[project]/src/components/List.tsx",
        lineNumber: 35,
        columnNumber: 14
    }, ("TURBOPACK compile-time value", void 0)),
    linkedin: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaLinkedinIn"], {}, void 0, false, {
        fileName: "[project]/src/components/List.tsx",
        lineNumber: 36,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    whatsapp: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaWhatsapp"], {}, void 0, false, {
        fileName: "[project]/src/components/List.tsx",
        lineNumber: 37,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    github: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaGithub"], {}, void 0, false, {
        fileName: "[project]/src/components/List.tsx",
        lineNumber: 38,
        columnNumber: 11
    }, ("TURBOPACK compile-time value", void 0)),
    telegram: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaTelegram"], {}, void 0, false, {
        fileName: "[project]/src/components/List.tsx",
        lineNumber: 39,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    youtube: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaYoutube"], {}, void 0, false, {
        fileName: "[project]/src/components/List.tsx",
        lineNumber: 40,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0))
};
const categoryIconMap = {
    Coding: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaCode"], {}, void 0, false, {
        fileName: "[project]/src/components/List.tsx",
        lineNumber: 44,
        columnNumber: 11
    }, ("TURBOPACK compile-time value", void 0)),
    "Artificial Intelligence": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaBrain"], {}, void 0, false, {
        fileName: "[project]/src/components/List.tsx",
        lineNumber: 45,
        columnNumber: 30
    }, ("TURBOPACK compile-time value", void 0)),
    Data: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaDatabase"], {}, void 0, false, {
        fileName: "[project]/src/components/List.tsx",
        lineNumber: 46,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    Networks: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaNetworkWired"], {}, void 0, false, {
        fileName: "[project]/src/components/List.tsx",
        lineNumber: 47,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    Cybersecurity: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaShieldAlt"], {}, void 0, false, {
        fileName: "[project]/src/components/List.tsx",
        lineNumber: 48,
        columnNumber: 18
    }, ("TURBOPACK compile-time value", void 0)),
    Design: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaPalette"], {}, void 0, false, {
        fileName: "[project]/src/components/List.tsx",
        lineNumber: 49,
        columnNumber: 11
    }, ("TURBOPACK compile-time value", void 0)),
    Hacking: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaUserSecret"], {}, void 0, false, {
        fileName: "[project]/src/components/List.tsx",
        lineNumber: 50,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0)),
    Cloud: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaCloud"], {}, void 0, false, {
        fileName: "[project]/src/components/List.tsx",
        lineNumber: 51,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)),
    Infrastructure: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaCogs"], {}, void 0, false, {
        fileName: "[project]/src/components/List.tsx",
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
    _s();
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("list");
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isMobile, setIsMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Communities.useEffect": ()=>{
            const updateIsMobile = {
                "Communities.useEffect.updateIsMobile": ()=>setIsMobile(window.innerWidth <= 1023)
            }["Communities.useEffect.updateIsMobile"];
            updateIsMobile(); // define valor inicial no client
            window.addEventListener("resize", updateIsMobile);
            return ({
                "Communities.useEffect": ()=>window.removeEventListener("resize", updateIsMobile)
            })["Communities.useEffect"];
        }
    }["Communities.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Communities.useEffect": ()=>{
            const handleResize = {
                "Communities.useEffect.handleResize": ()=>setIsMobile(window.innerWidth <= 1023)
            }["Communities.useEffect.handleResize"];
            window.addEventListener("resize", handleResize);
            return ({
                "Communities.useEffect": ()=>window.removeEventListener("resize", handleResize)
            })["Communities.useEffect"];
        }
    }["Communities.useEffect"], []);
    const allCategories = Array.from(new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$community$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["listaData"].flatMap((item)=>item.categories)));
    const [shuffledData, setShuffledData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Communities.useEffect": ()=>{
            const shuffled = [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$community$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["listaData"]
            ];
            for(let i = shuffled.length - 1; i > 0; i--){
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [
                    shuffled[j],
                    shuffled[i]
                ];
            }
            setShuffledData(shuffled);
        }
    }["Communities.useEffect"], []);
    const filteredData = shuffledData.filter((item)=>{
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || item.categories.includes(selectedCategory);
        return matchesSearch && matchesCategory;
    });
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
                                lineNumber: 115,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].secundario,
                                children: "Abaixo"
                            }, void 0, false, {
                                fileName: "[project]/src/components/List.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/List.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__intro,
                        children: "Lista de Comunidades de Tecnologia e Programação em Moçambique"
                    }, void 0, false, {
                        fileName: "[project]/src/components/List.tsx",
                        lineNumber: 118,
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
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/List.tsx",
                                lineNumber: 122,
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
                                    lineNumber: 126,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/List.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                text: "Lista / Grelha, apenas clique",
                                position: "down",
                                delay: 7000,
                                duration: 4000,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setView(view === "grid" ? "list" : "grid"),
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].button__format,
                                    children: view === "grid" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaList"], {}, void 0, false, {
                                        fileName: "[project]/src/components/List.tsx",
                                        lineNumber: 137,
                                        columnNumber: 34
                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaTh"], {}, void 0, false, {
                                        fileName: "[project]/src/components/List.tsx",
                                        lineNumber: 137,
                                        columnNumber: 47
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/List.tsx",
                                    lineNumber: 133,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/List.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/List.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/List.tsx",
                lineNumber: 113,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__items_container} ${view === "grid" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].grid_view : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list_view}`,
                children: filteredData.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__item,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: item.logo || "https://mozcomunidades.web.app/images/comunities/logo.png",
                                alt: item.title,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__logo
                            }, void 0, false, {
                                fileName: "[project]/src/components/List.tsx",
                                lineNumber: 148,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            view === "list" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__content,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__title,
                                        children: item.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/List.tsx",
                                        lineNumber: 159,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].categories,
                                        children: item.categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__category,
                                                children: [
                                                    categoryIconMap[cat],
                                                    cat
                                                ]
                                            }, cat, true, {
                                                fileName: "[project]/src/components/List.tsx",
                                                lineNumber: 165,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/List.tsx",
                                        lineNumber: 163,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__row,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__description,
                                                children: item.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/List.tsx",
                                                lineNumber: 173,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__more,
                                                href: `/community/${item.title.toLowerCase().replace(/\s+/g, "-")}`,
                                                children: "Saber mais"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/List.tsx",
                                                lineNumber: 174,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/List.tsx",
                                        lineNumber: 172,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].events,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Events, {
                                            communityNames: [
                                                item.title
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/List.tsx",
                                            lineNumber: 184,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/List.tsx",
                                        lineNumber: 183,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__social,
                                        children: socialOrder.map((key)=>item.social[key] && iconMap[key] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.social[key],
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"]['list__social-icon']} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"][`list__social-${key}`]}`,
                                                style: {
                                                    "--hover-color": item.color
                                                },
                                                children: iconMap[key]
                                            }, key, false, {
                                                fileName: "[project]/src/components/List.tsx",
                                                lineNumber: 191,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)) : null)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/List.tsx",
                                        lineNumber: 188,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__contact,
                                        children: item.mail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: `mailto:${item.mail}`,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"]['list__contact-button'],
                                            children: "Contactar"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/List.tsx",
                                            lineNumber: 209,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/List.tsx",
                                        lineNumber: 207,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/List.tsx",
                                lineNumber: 158,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].list__title,
                                href: `/community/${item.title.toLowerCase().replace(/\s+/g, "-")}`,
                                children: item.title
                            }, void 0, false, {
                                fileName: "[project]/src/components/List.tsx",
                                lineNumber: 219,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            !isMobile && view === "list" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].events,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Events, {
                                    communityNames: [
                                        item.title
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/List.tsx",
                                    lineNumber: 229,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/List.tsx",
                                lineNumber: 228,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, index, true, {
                        fileName: "[project]/src/components/List.tsx",
                        lineNumber: 147,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/src/components/List.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            filteredData.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$List$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"]['list__no-results'],
                children: "Nenhuma comunidade encontrada."
            }, void 0, false, {
                fileName: "[project]/src/components/List.tsx",
                lineNumber: 237,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/List.tsx",
        lineNumber: 112,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Communities, "KYlWZOt77makUEQvHr4ySKYUP/8=");
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
;
var _s = __turbopack_context__.k.signature();
;
;
;
const Navbar = ({ logo, items, theme, setTheme })=>{
    _s();
    const [menuOpen, setMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isTop, setIsTop] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [activeSection, setActiveSection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const toggleTheme = ()=>setTheme(theme === "light" ? "dark" : "light");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            const sections = document.querySelectorAll("section[id]");
            const onScroll = {
                "Navbar.useEffect.onScroll": ()=>{
                    const scrollY = window.scrollY;
                    setIsTop(scrollY < 10);
                    const scrollPos = scrollY + 120;
                    sections.forEach({
                        "Navbar.useEffect.onScroll": (sec)=>{
                            if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
                                setActiveSection(sec.id);
                            }
                        }
                    }["Navbar.useEffect.onScroll"]);
                }
            }["Navbar.useEffect.onScroll"];
            window.addEventListener("scroll", onScroll);
            return ({
                "Navbar.useEffect": ()=>window.removeEventListener("scroll", onScroll)
            })["Navbar.useEffect"];
        }
    }["Navbar.useEffect"], []);
    const [isMobile, setIsMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
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
                lineNumber: 40,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            setIsMobile(window.innerWidth <= 768);
            const handleResize = {
                "Navbar.useEffect.handleResize": ()=>setIsMobile(window.innerWidth <= 768)
            }["Navbar.useEffect.handleResize"];
            window.addEventListener("resize", handleResize);
            return ({
                "Navbar.useEffect": ()=>window.removeEventListener("resize", handleResize)
            })["Navbar.useEffect"];
        }
    }["Navbar.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navbar} ${isTop ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"]["navbar--top"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"]["navbar--scrolled"]}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navbar__logo,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: logo,
                    alt: "Logo Moz Communities",
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].logo
                }, void 0, false, {
                    fileName: "[project]/src/components/Navbar.tsx",
                    lineNumber: 70,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/Navbar.tsx",
                lineNumber: 69,
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
                                lineNumber: 78,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaMoon"], {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].icon
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 80,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar.tsx",
                            lineNumber: 76,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar.tsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    renderLinks()
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Navbar.tsx",
                lineNumber: 74,
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
                            lineNumber: 92,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaMoon"], {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].icon
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar.tsx",
                            lineNumber: 94,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar.tsx",
                        lineNumber: 90,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navbar__hamburger,
                        onClick: ()=>setMenuOpen(!menuOpen),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaBars"], {}, void 0, false, {
                            fileName: "[project]/src/components/Navbar.tsx",
                            lineNumber: 101,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar.tsx",
                        lineNumber: 97,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Navbar.tsx",
                lineNumber: 89,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            isMobile && menuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navbar__links} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Navbar$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].active}`,
                children: renderLinks()
            }, void 0, false, {
                fileName: "[project]/src/components/Navbar.tsx",
                lineNumber: 107,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Navbar.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Navbar, "ccSmHosm9kZkyLHI8KMOfvuo0PY=");
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
                            lineNumber: 19,
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
                            lineNumber: 28,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        "."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Footer.tsx",
                    lineNumber: 17,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/Footer.tsx",
                lineNumber: 16,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/Footer.tsx",
            lineNumber: 15,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/Footer.tsx",
        lineNumber: 14,
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
  "scroll-top": "ScrollTopButton-module__rYRroa__scroll-top",
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$ScrollTopButton$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/ScrollTopButton.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const ScrollTopButton = ()=>{
    _s();
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScrollTopButton.useEffect": ()=>{
            const toggleVisibility = {
                "ScrollTopButton.useEffect.toggleVisibility": ()=>{
                    setVisible(window.scrollY > 200);
                }
            }["ScrollTopButton.useEffect.toggleVisibility"];
            window.addEventListener("scroll", toggleVisibility);
            return ({
                "ScrollTopButton.useEffect": ()=>window.removeEventListener("scroll", toggleVisibility)
            })["ScrollTopButton.useEffect"];
        }
    }["ScrollTopButton.useEffect"], []);
    const scrollToTop = ()=>{
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$ScrollTopButton$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].scrollTop} ${visible ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$ScrollTopButton$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].show : ""}`,
        onClick: scrollToTop,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaArrowUp"], {}, void 0, false, {
            fileName: "[project]/src/components/ScrollTopButton.tsx",
            lineNumber: 25,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ScrollTopButton.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ScrollTopButton, "cz/DzCD06IMMsoBJ0A1IgCy1P5M=");
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
"[project]/src/assets/images/mz_logo.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/mz_logo.1f66bba0.png");}),
"[project]/src/assets/images/mz_logo.png.mjs { IMAGE => \"[project]/src/assets/images/mz_logo.png (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$mz_logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/images/mz_logo.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$mz_logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 1998,
    height: 715,
    blurWidth: 8,
    blurHeight: 3,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAADCAYAAACuyE5IAAAAbklEQVR42gFjAJz/AAAAAAAUCwMVGw4EHB4QBCAhEQUjIREFIx4QBCAHBAEHAB4QBCCTUhubqWMlta5iJNC1ZSTbs2Ul26hfI88xGwk5ABULAxYwGggzOSALPFYvD2JeMxBqXTMQalYvD2MWDAQZVrsUGvdWUgcAAAAASUVORK5CYII="
};
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
// pages/index.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Hero.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/List.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navbar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Navbar.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CollaborateButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CollaborateButton.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Footer.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScrollTopButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ScrollTopButton.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScrollToTop$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ScrollToTop.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$mz_logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$mz_logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/images/mz_logo.png.mjs { IMAGE => "[project]/src/assets/images/mz_logo.png (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
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
;
function Home({ theme, setTheme }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScrollTopButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScrollToTop$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navbar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                logo: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$mz_logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$mz_logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                logo: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$mz_logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$mz_logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                description: "Esta página foi criada exclusivamente para listar as comunidades de tecnologia e programação existentes em Moçambique...",
                buttonText: "Apreciar",
                buttonUrl: "#communities"
            }, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$List$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CollaborateButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                githubUrl: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["githubUrl"],
                mail: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["mail"]
            }, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                copyrightHolderName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["inspiration"],
                copyrightHolderUrl: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["inspirationUrl"],
                redesignAuthorName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["author"],
                redesignAuthorUrl: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$personal$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["authorUrl"]
            }, void 0, false, {
                fileName: "[project]/src/pages/index.tsx",
                lineNumber: 40,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__c32d804c._.js.map