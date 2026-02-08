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
"[project]/src/data/community.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*
import type { ListaItem } from "./types";

export const listaData: ListaItem[] = [
  
  
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
    categories: ['Coding']
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
    categories: ['Coding']
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
    }
    ,
    color: '#3498db',
    categories: ['Artificial Intelligence', 'Data']
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
    categories: ['Coding']
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
    categories: ['Coding']
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
    categories: ['Data']
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
    categories: ['Coding']
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
    categories: ['Coding']
  },
  {
    logo: 'https://mozcomunidades.web.app/images/comunities/laravelmaputocommunity.png',
    title: 'Laravel Maputo Commnunity',
    description: 'Grupo dedicado ao intercâmbio de diversos interessados do mundo Laravel, canal onde diversas mentes podem unir seu potêncial para resolver questões do dia a dia e divertir-se.',
    website: '',
    social: {
      whatsapp: 'https://chat.whatsapp.com/BBsDgZGoLZmBEyVXZS8fy2',
    },
    color: '#c0392b',
    categories: ['Coding']
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
    categories: ['Coding']
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
    categories: ['Networks', 'Cybersecurity', 'Hacking']
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
    categories: ['Networks', 'Cloud', 'Infrastructure']
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
    categories: ['Design']
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
    categories: ['Coding']
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
    categories: ['Coding']
  },
  {
    logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQGRoHLSnuTM6A/company-logo_200_200/B4DZqsExxrIgAI-/0/1763823525994?e=1772064000&v=beta&t=prswaWiGQhoMp21a982Fdl9vZ5BW2OhiAq-An4c-Zek',
    title: 'Network Communiity',
    description: 'A Network Community é uma iniciativa dedicada a formar e capacitar estudantes, entusiastas e profissionais em Redes e Tecnologias da Informação, oferecendo cursos práticos, acessíveis e alinhados ao mercado de trabalho, promovendo a partilha de conhecimento, a inclusão digital, a inovação tecnológica e o desenvolvimento profissional em Moçambique e além-fronteiras.',
    website: '',
    mail: 'networkcommunitymz@gmail.com',
    social: {
      linkedin: 'https://www.linkedin.com/company/network-communiity',
    },
    color: 'rgb(22, 10, 126)',
    categories: ['Networks', 'Cybersecurity']
  }
];
*/ __turbopack_context__.s([]);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/CommunityProfile.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actions": "CommunityProfile-module__WZRIBa__actions",
  "back__button": "CommunityProfile-module__WZRIBa__back__button",
  "community-profile__card": "CommunityProfile-module__WZRIBa__community-profile__card",
  "community-profile__logo": "CommunityProfile-module__WZRIBa__community-profile__logo",
  "community__profile": "CommunityProfile-module__WZRIBa__community__profile",
  "community__profile__card": "CommunityProfile-module__WZRIBa__community__profile__card",
  "community__profile__categories": "CommunityProfile-module__WZRIBa__community__profile__categories",
  "community__profile__category": "CommunityProfile-module__WZRIBa__community__profile__category",
  "community__profile__contact": "CommunityProfile-module__WZRIBa__community__profile__contact",
  "community__profile__contact__button": "CommunityProfile-module__WZRIBa__community__profile__contact__button",
  "community__profile__description": "CommunityProfile-module__WZRIBa__community__profile__description",
  "community__profile__link": "CommunityProfile-module__WZRIBa__community__profile__link",
  "community__profile__logo": "CommunityProfile-module__WZRIBa__community__profile__logo",
  "community__profile__social": "CommunityProfile-module__WZRIBa__community__profile__social",
  "community__profile__social__icon": "CommunityProfile-module__WZRIBa__community__profile__social__icon",
  "community__profile__title": "CommunityProfile-module__WZRIBa__community__profile__title",
  "community__profile__website": "CommunityProfile-module__WZRIBa__community__profile__website",
  "icon": "CommunityProfile-module__WZRIBa__icon",
  "theme__toggle": "CommunityProfile-module__WZRIBa__theme__toggle",
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
"[project]/src/components/EventCard.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$events$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/events.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Events$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/Events.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const Events = ({ communityNames })=>{
    _s();
    const [upcomingEvents, setUpcomingEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Events.useEffect": ()=>{
            const now = new Date();
            const filtered = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$events$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["eventsData"].filter({
                "Events.useEffect.filtered": (event)=>{
                    const eventDate = new Date(event.date);
                    return eventDate >= now && (!communityNames || event.communities.some({
                        "Events.useEffect.filtered": (c)=>communityNames.includes(c)
                    }["Events.useEffect.filtered"]));
                }
            }["Events.useEffect.filtered"]);
            setUpcomingEvents(filtered);
        }
    }["Events.useEffect"], [
        communityNames
    ]);
    if (upcomingEvents.length === 0) {
        return null;
    }
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
                        lineNumber: 30,
                        columnNumber: 27
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Events$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].events__title,
                        children: event.title
                    }, void 0, false, {
                        fileName: "[project]/src/components/EventCard.tsx",
                        lineNumber: 31,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$Events$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].events__date,
                        children: new Date(event.date).toLocaleDateString()
                    }, void 0, false, {
                        fileName: "[project]/src/components/EventCard.tsx",
                        lineNumber: 32,
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
                        lineNumber: 34,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, idx, true, {
                fileName: "[project]/src/components/EventCard.tsx",
                lineNumber: 29,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)))
    }, void 0, false, {
        fileName: "[project]/src/components/EventCard.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Events, "mMNN2CDd+4G2Ud4mT9xSgHfS3B0=");
_c = Events;
const __TURBOPACK__default__export__ = Events;
var _c;
__turbopack_context__.k.register(_c, "Events");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/pages/community/[id].tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$community$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/community.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CommunityProfile$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/CommunityProfile.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$EventCard$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/EventCard.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
const iconMap = {
    facebook: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaFacebookF"], {}, void 0, false, {
        fileName: "[project]/src/pages/community/[id].tsx",
        lineNumber: 37,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    twitter: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaTwitter"], {}, void 0, false, {
        fileName: "[project]/src/pages/community/[id].tsx",
        lineNumber: 38,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0)),
    instagram: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaInstagram"], {}, void 0, false, {
        fileName: "[project]/src/pages/community/[id].tsx",
        lineNumber: 39,
        columnNumber: 14
    }, ("TURBOPACK compile-time value", void 0)),
    linkedin: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaLinkedinIn"], {}, void 0, false, {
        fileName: "[project]/src/pages/community/[id].tsx",
        lineNumber: 40,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    whatsapp: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaWhatsapp"], {}, void 0, false, {
        fileName: "[project]/src/pages/community/[id].tsx",
        lineNumber: 41,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    github: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaGithub"], {}, void 0, false, {
        fileName: "[project]/src/pages/community/[id].tsx",
        lineNumber: 42,
        columnNumber: 11
    }, ("TURBOPACK compile-time value", void 0)),
    telegram: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaTelegram"], {}, void 0, false, {
        fileName: "[project]/src/pages/community/[id].tsx",
        lineNumber: 43,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    youtube: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaYoutube"], {}, void 0, false, {
        fileName: "[project]/src/pages/community/[id].tsx",
        lineNumber: 44,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0))
};
const categoryIconMap = {
    Coding: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaCode"], {}, void 0, false, {
        fileName: "[project]/src/pages/community/[id].tsx",
        lineNumber: 48,
        columnNumber: 11
    }, ("TURBOPACK compile-time value", void 0)),
    "Artificial Intelligence": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaBrain"], {}, void 0, false, {
        fileName: "[project]/src/pages/community/[id].tsx",
        lineNumber: 49,
        columnNumber: 30
    }, ("TURBOPACK compile-time value", void 0)),
    Data: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaDatabase"], {}, void 0, false, {
        fileName: "[project]/src/pages/community/[id].tsx",
        lineNumber: 50,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    Networks: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaNetworkWired"], {}, void 0, false, {
        fileName: "[project]/src/pages/community/[id].tsx",
        lineNumber: 51,
        columnNumber: 13
    }, ("TURBOPACK compile-time value", void 0)),
    Cybersecurity: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaShieldAlt"], {}, void 0, false, {
        fileName: "[project]/src/pages/community/[id].tsx",
        lineNumber: 52,
        columnNumber: 18
    }, ("TURBOPACK compile-time value", void 0)),
    Design: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaPalette"], {}, void 0, false, {
        fileName: "[project]/src/pages/community/[id].tsx",
        lineNumber: 53,
        columnNumber: 11
    }, ("TURBOPACK compile-time value", void 0)),
    Hacking: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaUserSecret"], {}, void 0, false, {
        fileName: "[project]/src/pages/community/[id].tsx",
        lineNumber: 54,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0)),
    Cloud: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaCloud"], {}, void 0, false, {
        fileName: "[project]/src/pages/community/[id].tsx",
        lineNumber: 55,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)),
    Infrastructure: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaCogs"], {}, void 0, false, {
        fileName: "[project]/src/pages/community/[id].tsx",
        lineNumber: 56,
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
const CommunityProfile = ({ theme, setTheme })=>{
    _s();
    const toggleTheme = ()=>setTheme(theme === "light" ? "dark" : "light");
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
    const community = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$community$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["listaData"].find((item)=>item.title.toLowerCase().replace(/\s+/g, "-") === id);
    if (!community) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        children: "Comunidade não encontrada"
    }, void 0, false, {
        fileName: "[project]/src/pages/community/[id].tsx",
        lineNumber: 82,
        columnNumber: 26
    }, ("TURBOPACK compile-time value", void 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CommunityProfile$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].community__profile,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "community-profile__content",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CommunityProfile$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].community__profile__card,
                style: {
                    "--community-color": community.color
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CommunityProfile$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actions,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CommunityProfile$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].back__button,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>window.history.back(),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaArrowLeft"], {}, void 0, false, {
                                        fileName: "[project]/src/pages/community/[id].tsx",
                                        lineNumber: 96,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/community/[id].tsx",
                                    lineNumber: 95,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/community/[id].tsx",
                                lineNumber: 94,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CommunityProfile$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].theme__toggle,
                                onClick: toggleTheme,
                                children: theme === "light" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaSun"], {
                                    className: "icon"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/community/[id].tsx",
                                    lineNumber: 101,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaMoon"], {
                                    className: "icon"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/community/[id].tsx",
                                    lineNumber: 103,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/community/[id].tsx",
                                lineNumber: 99,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/community/[id].tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: community.logo,
                        alt: community.title,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CommunityProfile$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].community__profile__logo
                    }, void 0, false, {
                        fileName: "[project]/src/pages/community/[id].tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "community-profile__content",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CommunityProfile$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].community__profile__title,
                                children: community.title
                            }, void 0, false, {
                                fileName: "[project]/src/pages/community/[id].tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CommunityProfile$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].community__profile__categories,
                                children: community.categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CommunityProfile$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].community__profile__category,
                                        children: [
                                            categoryIconMap[cat],
                                            " ",
                                            cat
                                        ]
                                    }, cat, true, {
                                        fileName: "[project]/src/pages/community/[id].tsx",
                                        lineNumber: 118,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/community/[id].tsx",
                                lineNumber: 116,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CommunityProfile$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].community__profile__description,
                                children: community.description
                            }, void 0, false, {
                                fileName: "[project]/src/pages/community/[id].tsx",
                                lineNumber: 124,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CommunityProfile$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].community__profile__link,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaLink"], {}, void 0, false, {
                                        fileName: "[project]/src/pages/community/[id].tsx",
                                        lineNumber: 129,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    community.website ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CommunityProfile$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].community__profile__website,
                                        href: community.website,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        children: community.website.replace(/^(https?:\/\/)?(www\.)?/, "")
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/community/[id].tsx",
                                        lineNumber: 131,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "list__no-website",
                                        children: "sem site"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/community/[id].tsx",
                                        lineNumber: 140,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/community/[id].tsx",
                                lineNumber: 128,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CommunityProfile$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].community__profile__social,
                                children: socialOrder.map((key)=>community.social[key] && iconMap[key] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: community.social[key],
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CommunityProfile$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].community__profile__social__icon,
                                        style: {
                                            "--hover-color": community.color
                                        },
                                        children: iconMap[key]
                                    }, key, false, {
                                        fileName: "[project]/src/pages/community/[id].tsx",
                                        lineNumber: 147,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)) : null)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/community/[id].tsx",
                                lineNumber: 144,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CommunityProfile$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].community__profile__contact,
                                children: community.mail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `mailto:${community.mail}`,
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$CommunityProfile$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].community__profile__contact__button,
                                    children: "Contactar"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/community/[id].tsx",
                                    lineNumber: 167,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/community/[id].tsx",
                                lineNumber: 165,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "events",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$EventCard$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    communityNames: [
                                        community.title
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/community/[id].tsx",
                                    lineNumber: 177,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/community/[id].tsx",
                                lineNumber: 176,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/community/[id].tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/community/[id].tsx",
                lineNumber: 87,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/pages/community/[id].tsx",
            lineNumber: 86,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/pages/community/[id].tsx",
        lineNumber: 85,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CommunityProfile, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = CommunityProfile;
const __TURBOPACK__default__export__ = CommunityProfile;
var _c;
__turbopack_context__.k.register(_c, "CommunityProfile");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/community/[id].tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/community/[id]";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/community/[id].tsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/community/[id].tsx\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/community/[id].tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__7acc0350._.js.map