(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common/http'), require('@angular/platform-browser'), require('@ionic/angular'), require('rxjs/operators'), require('pdf-lib'), require('@pdf-lib/fontkit'), require('pdfjs-dist'), require('@angular/common'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('pdf-annotator', ['exports', '@angular/core', '@angular/common/http', '@angular/platform-browser', '@ionic/angular', 'rxjs/operators', 'pdf-lib', '@pdf-lib/fontkit', 'pdfjs-dist', '@angular/common', '@angular/forms'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["pdf-annotator"] = {}, global.ng.core, global.ng.common.http, global.ng.platformBrowser, global.angular, global.rxjs.operators, global.pdfLib, global.fontkitModule, global.pdfjsLib, global.ng.common, global.ng.forms));
})(this, (function (exports, core, http, platformBrowser, angular, operators, pdfLib, fontkitModule, pdfjsLib, common, forms) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var fontkitModule__namespace = /*#__PURE__*/_interopNamespace(fontkitModule);
    var pdfjsLib__namespace = /*#__PURE__*/_interopNamespace(pdfjsLib);

    var PDF_ANNOTATOR_CONFIG = new core.InjectionToken('PDF_ANNOTATOR_CONFIG');

    var PdfManagerService = /** @class */ (function () {
        function PdfManagerService(http, config) {
            var _a;
            this.http = http;
            this.base = (_a = config === null || config === void 0 ? void 0 : config.pdfApiUrl) !== null && _a !== void 0 ? _a : 'http://localhost:3500/api';
        }
        PdfManagerService.prototype.listDocuments = function (userId, search) {
            var params = new http.HttpParams().set('userId', userId);
            if (search)
                params = params.set('search', search);
            return this.http.get(this.base + "/pdf/list", { params: params });
        };
        PdfManagerService.prototype.uploadDocument = function (file, userId, userName) {
            var form = new FormData();
            form.append('pdf', file);
            form.append('userId', userId);
            if (userName)
                form.append('userName', userName);
            return this.http.post(this.base + "/pdf/upload", form);
        };
        PdfManagerService.prototype.getPdfUrl = function (docId) {
            return this.base + "/pdf/" + docId;
        };
        PdfManagerService.prototype.saveAnnotatedPdf = function (docId, pdfBlob, userId, fileName, annotationSummary, userName) {
            var form = new FormData();
            form.append('pdf', pdfBlob, fileName);
            form.append('userId', userId);
            if (userName)
                form.append('userName', userName);
            if (annotationSummary)
                form.append('annotationSummary', JSON.stringify(annotationSummary));
            return this.http.post(this.base + "/pdf/" + docId + "/save", form);
        };
        PdfManagerService.prototype.getDocumentInfo = function (docId) {
            return this.http.get(this.base + "/pdf/" + docId + "/info");
        };
        PdfManagerService.prototype.deleteDocument = function (docId) {
            return this.http.delete(this.base + "/pdf/" + docId);
        };
        PdfManagerService.prototype.logAction = function (payload) {
            return this.http.post(this.base + "/history", payload);
        };
        PdfManagerService.prototype.getHistory = function (docId, limit, offset) {
            if (limit === void 0) { limit = 100; }
            if (offset === void 0) { offset = 0; }
            var params = new http.HttpParams().set('limit', limit).set('offset', offset);
            return this.http.get(this.base + "/history/" + docId, { params: params });
        };
        PdfManagerService.prototype.getHistorySummary = function (docId) {
            return this.http.get(this.base + "/history/" + docId + "/summary");
        };
        PdfManagerService.prototype.getSignatures = function (userId) {
            return this.http.get(this.base + "/signatures/" + userId);
        };
        PdfManagerService.prototype.saveSignature = function (userId, signatureData, signatureName, isDefault) {
            return this.http.post(this.base + "/signatures", {
                userId: userId, signatureData: signatureData, signatureName: signatureName, isDefault: isDefault,
            });
        };
        PdfManagerService.prototype.setDefaultSignature = function (sigId) {
            return this.http.put(this.base + "/signatures/" + sigId + "/default", {});
        };
        PdfManagerService.prototype.deleteSignature = function (sigId) {
            return this.http.delete(this.base + "/signatures/" + sigId);
        };
        return PdfManagerService;
    }());
    PdfManagerService.decorators = [
        { type: core.Injectable }
    ];
    PdfManagerService.ctorParameters = function () { return [
        { type: http.HttpClient },
        { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [PDF_ANNOTATOR_CONFIG,] }] }
    ]; };

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
        function accept(f) { if (f !== void 0 && typeof f !== "function")
            throw new TypeError("Function expected"); return f; }
        var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
        var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
        var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
        var _, done = false;
        for (var i = decorators.length - 1; i >= 0; i--) {
            var context = {};
            for (var p in contextIn)
                context[p] = p === "access" ? {} : contextIn[p];
            for (var p in contextIn.access)
                context.access[p] = contextIn.access[p];
            context.addInitializer = function (f) { if (done)
                throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
            var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
            if (kind === "accessor") {
                if (result === void 0)
                    continue;
                if (result === null || typeof result !== "object")
                    throw new TypeError("Object expected");
                if (_ = accept(result.get))
                    descriptor.get = _;
                if (_ = accept(result.set))
                    descriptor.set = _;
                if (_ = accept(result.init))
                    initializers.unshift(_);
            }
            else if (_ = accept(result)) {
                if (kind === "field")
                    initializers.unshift(_);
                else
                    descriptor[key] = _;
            }
        }
        if (target)
            Object.defineProperty(target, contextIn.name, descriptor);
        done = true;
    }
    ;
    function __runInitializers(thisArg, initializers, value) {
        var useValue = arguments.length > 2;
        for (var i = 0; i < initializers.length; i++) {
            value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
        }
        return useValue ? value : void 0;
    }
    ;
    function __propKey(x) {
        return typeof x === "symbol" ? x : "".concat(x);
    }
    ;
    function __setFunctionName(f, name, prefix) {
        if (typeof name === "symbol")
            name = name.description ? "[".concat(name.description, "]") : "";
        return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
    }
    ;
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
        return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
            desc = { enumerable: true, get: function () { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar)
                        ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || Array.prototype.slice.call(from));
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
        function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
        function verb(n, f) { if (g[n]) {
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); };
            if (f)
                i[n] = f(i[n]);
        } }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    var ownKeys = function (o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o)
                if (Object.prototype.hasOwnProperty.call(o, k))
                    ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k = ownKeys(mod), i = 0; i < k.length; i++)
                if (k[i] !== "default")
                    __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }
    function __classPrivateFieldIn(state, receiver) {
        if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function"))
            throw new TypeError("Cannot use 'in' operator on non-object");
        return typeof state === "function" ? receiver === state : state.has(receiver);
    }
    function __addDisposableResource(env, value, async) {
        if (value !== null && value !== void 0) {
            if (typeof value !== "object" && typeof value !== "function")
                throw new TypeError("Object expected.");
            var dispose, inner;
            if (async) {
                if (!Symbol.asyncDispose)
                    throw new TypeError("Symbol.asyncDispose is not defined.");
                dispose = value[Symbol.asyncDispose];
            }
            if (dispose === void 0) {
                if (!Symbol.dispose)
                    throw new TypeError("Symbol.dispose is not defined.");
                dispose = value[Symbol.dispose];
                if (async)
                    inner = dispose;
            }
            if (typeof dispose !== "function")
                throw new TypeError("Object not disposable.");
            if (inner)
                dispose = function () { try {
                    inner.call(this);
                }
                catch (e) {
                    return Promise.reject(e);
                } };
            env.stack.push({ value: value, dispose: dispose, async: async });
        }
        else if (async) {
            env.stack.push({ async: true });
        }
        return value;
    }
    var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };
    function __disposeResources(env) {
        function fail(e) {
            env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1)
                        return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async)
                            return s |= 2, Promise.resolve(result).then(next, function (e) { fail(e); return next(); });
                    }
                    else
                        s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1)
                return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError)
                throw env.error;
        }
        return next();
    }
    function __rewriteRelativeImportExtension(path, preserveJsx) {
        if (typeof path === "string" && /^\.\.?\//.test(path)) {
            return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
                return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
            });
        }
        return path;
    }
    var tslib_es6 = {
        __extends: __extends,
        __assign: __assign,
        __rest: __rest,
        __decorate: __decorate,
        __param: __param,
        __esDecorate: __esDecorate,
        __runInitializers: __runInitializers,
        __propKey: __propKey,
        __setFunctionName: __setFunctionName,
        __metadata: __metadata,
        __awaiter: __awaiter,
        __generator: __generator,
        __createBinding: __createBinding,
        __exportStar: __exportStar,
        __values: __values,
        __read: __read,
        __spread: __spread,
        __spreadArrays: __spreadArrays,
        __spreadArray: __spreadArray,
        __await: __await,
        __asyncGenerator: __asyncGenerator,
        __asyncDelegator: __asyncDelegator,
        __asyncValues: __asyncValues,
        __makeTemplateObject: __makeTemplateObject,
        __importStar: __importStar,
        __importDefault: __importDefault,
        __classPrivateFieldGet: __classPrivateFieldGet,
        __classPrivateFieldSet: __classPrivateFieldSet,
        __classPrivateFieldIn: __classPrivateFieldIn,
        __addDisposableResource: __addDisposableResource,
        __disposeResources: __disposeResources,
        __rewriteRelativeImportExtension: __rewriteRelativeImportExtension,
    };

    var PdfAnnotatorModalComponent = /** @class */ (function () {
        function PdfAnnotatorModalComponent(modalCtrl, http, zone, toastCtrl, alertCtrl, cdr, sanitizer, pdfSvc, config) {
            var _a, _b;
            this.modalCtrl = modalCtrl;
            this.http = http;
            this.zone = zone;
            this.toastCtrl = toastCtrl;
            this.alertCtrl = alertCtrl;
            this.cdr = cdr;
            this.sanitizer = sanitizer;
            this.pdfSvc = pdfSvc;
            this.canManageGuide = false;
            // Context Menu state
            this.contextMenu = {
                show: false,
                x: 0,
                y: 0,
                targetId: '',
                targetType: ''
            };
            // Tool modes
            this.toolMode = 'none';
            this.shapeType = 'rect';
            this.showShapeMenu = false;
            this.showShapeDropdown = false;
            this.shapeNoStroke = false;
            // Shape-specific color settings (separate from brush)
            this.shapeStrokeColor = '#000000';
            this.shapeFillColor = '#ffffff';
            this.shapeFillEnabled = false;
            this.shapeStrokeSize = 2;
            // Mac Preview-style color swatches
            this.shapeColorSwatches = [
                '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#ffffff',
                '#ff0000', '#ff4500', '#ff9900', '#ffcc00', '#00b050', '#00b0f0', '#0070c0', '#7030a0',
                '#ff00ff', '#ff69b4', '#4169e1', '#20b2aa', '#228b22', '#8b4513', '#a0522d', '#dc143c'
            ];
            this.shapeFillSwatches = [
                '#ffffff', '#f2f2f2', '#e6e6e6', '#d9d9d9', '#cccccc', '#b7b7b7', '#999999', '#000000',
                '#ffcccc', '#ffe5cc', '#fffacc', '#ccffcc', '#ccf5ff', '#cce0ff', '#e5ccff', '#ffccf2',
                '#ff9999', '#ffcc99', '#ffff99', '#99ff99', '#99f2ff', '#99bbff', '#cc99ff', '#ff99ee'
            ];
            this.brushColor = '#0000FF';
            this.brushSize = 3;
            this.highlightColor = '#ffff00';
            this.highlightSize = 20;
            this.eraserSize = 20;
            this.pageNo = 1;
            this.pageCount = 0;
            this.PAGE_CHUNK = 10;
            this.loadedUntilPage = 0;
            this.isLoadingChunk = false;
            this.zoom = 1; // 0.5 - 3
            this.viewMode = 'single';
            this.pages = []; // Array [1, 2, ..., pageCount]
            this.isLoading = false;
            this.loadingMessage = '';
            this.saveProgress = 0;
            this.renderingPages = new Set();
            this.renderedPages = new Set();
            this.textBoxes = [];
            this.imageStamps = [];
            this.shapeStamps = [];
            this.signatureStamps = [];
            this.dateStamps = [];
            this.pdfFormFields = [];
            this.formFieldCounter = 0;
            this.activeFormFieldId = null;
            // Modal & Preview States
            this.showSignaturePad = false;
            this.showSignaturePicker = false;
            this.showPreviewOverlay = false;
            this.previewUrl = null;
            this.previewPages = []; // Array of base64 image URLs for preview
            this.previewIsFiltered = false; // true when showing annotated-pages-only preview
            this.previewTotalPages = 0;
            this.isLoadingAllPreview = false;
            this.pageThumbnails = []; // Array of base64 thumbnail images
            this.showThumbnails = true; // Toggle for thumbnails sidebar
            this.lastSavedBlob = null;
            this.lastSavedFileName = '';
            this.signatureCtx = null;
            this.isDrawingSignature = false;
            this.signaturePoints = [];
            this.signatureStrokes = [];
            this.bufferCanvas = null;
            // Signature pen settings
            this.signaturePenColor = '#000000';
            this.signaturePenSize = 2.5;
            // Quick Mark Stamp settings
            this.markType = 'check';
            this.formFieldType = 'checkbox';
            this.markColor = '#000000';
            this.markSize = 32; // px at 100% zoom (will be scaled)
            this.showMarkOptions = false;
            // Date Stamp Settings
            this.dateColor = '#000000';
            this.dateFontSize = 16;
            this.showDateOptions = false;
            // Saved Signatures (from database)
            this.savedSignatures = [];
            this.isLoadingSignatures = false;
            this.userId = '';
            this.userName = '';
            this.documentId = null;
            this.detailId = '';
            this.edocId = '';
            this.isCancelMode = false;
            // Digital ID settings
            this.showDigitalId = true;
            // Thumbnail sidebar state
            this.thumbInsertIndex = -1; // -1 = closed; 0 = before page 1; i = after page i
            this.thumbDropdownTargetIndex = -1;
            // ------------------------------------
            // User Guide Modal State
            // ------------------------------------
            this.showUserGuidePanel = false;
            this.isLoadingGuide = false;
            this.isEditingGuide = false;
            this.userGuideContent = '';
            this.tempGuideContent = '';
            this.thumbDropdownTop = 0; // Fixed-position Y coord for insert dropdown
            this.thumbInsertAtIndex = -1; // the slot index where file upload was triggered
            // ── History Panel ────────────────────────────────────────────────────────
            this.showHistoryPanel = false;
            this.historyEntries = [];
            this.isLoadingHistory = false;
            // Insert blank page
            this.showInsertMenu = false;
            this.showThumbInsertMenu = false;
            this.insertOrientation = 'portrait';
            // Page-operation undo stack (insert / delete page)
            this.pageHistoryStack = [];
            this.strokes = {};
            this.shapes = {};
            this.redoStack = {};
            this.activeStroke = null;
            this.activeShape = null;
            this.activeCanvasRect = null;
            this.activePointerId = null;
            this.activeObjectId = null;
            this.activeObjectType = null;
            this.activePointerType = '';
            this.renderRequested = false;
            this.isRenderingAll = false;
            this.renderDebounceTimer = null;
            this.isDragging = false;
            this.dragTextBoxId = null;
            this.dragOffsetX = 0;
            this.dragOffsetY = 0;
            // Resize state
            this.isResizing = false;
            this.resizeTextBoxId = null;
            // Image drag state
            this.isDraggingImage = false;
            this.dragImageId = null;
            this.isResizingImage = false;
            this.resizeImageId = null;
            // ShapeStamp drag/resize state
            this.isDraggingShape = false;
            this.dragShapeId = null;
            this.isResizingShape = false;
            this.resizeShapeId = null;
            this.resizeObserver = null;
            this.isScrollNavigating = false;
            this.basePdfBytes = null;
            /** PDF page aspect ratios (width/height) per page number, populated at load time */
            this.pdfPageAspects = new Map();
            /** PDF page rotations (0/90/180/270) per page number, populated at load time from pdf-lib */
            this.pdfPageRotations = new Map();
            this.revNo = 1;
            this.pdfDocProxy = null;
            this.currentViewport = null;
            // default text style
            this.textColor = '#0000FF';
            this.textFontSize = 16;
            this.pendingSignatureDataUrl = null;
            this.activeTextBoxId = null;
            this.SETTINGS_KEY = 'esign_pdf_annotator_settings';
            /* ================= Zoom & Resize ================= */
            this.lastParentWidth = 0;
            this.lastFitPageNo = -1;
            this.signaturesApiUrl = (_a = config === null || config === void 0 ? void 0 : config.signaturesApiUrl) !== null && _a !== void 0 ? _a : 'http://localhost:3500/api/signatures';
            this.pdfWorkerSrc = (_b = config === null || config === void 0 ? void 0 : config.pdfWorkerSrc) !== null && _b !== void 0 ? _b : '/assets/pdf.worker.min.mjs';
        }
        PdfAnnotatorModalComponent.prototype.toggleDateOptions = function () {
            this.showDateOptions = !this.showDateOptions;
        };
        PdfAnnotatorModalComponent.prototype.addDateStampAndShowOptions = function () {
            this.addDateStamp();
            this.showDateOptions = true;
        };
        PdfAnnotatorModalComponent.prototype.setDateColor = function (color) {
            this.dateColor = color;
            this.saveSettings();
        };
        PdfAnnotatorModalComponent.prototype.changeDateFontSize = function (delta) {
            var newSize = this.dateFontSize + delta;
            if (newSize >= 8 && newSize <= 100) {
                this.dateFontSize = newSize;
                this.saveSettings();
            }
        };
        /** Log an action to the ruts-pdf history API (fire-and-forget) */
        PdfAnnotatorModalComponent.prototype.logHistory = function (actionType, detail, pageNumber) {
            if (detail === void 0) { detail = {}; }
            if (!this.documentId || !this.userId)
                return;
            this.pdfSvc.logAction({
                documentId: this.documentId,
                userId: this.userId,
                actionType: actionType,
                actionDetail: detail,
                pageNumber: pageNumber !== null && pageNumber !== void 0 ? pageNumber : this.pageNo,
                userName: this.userName,
            }).subscribe();
            // Also add to local panel immediately
            this.historyEntries.unshift({
                id: Date.now(),
                document_id: this.documentId,
                user_id: this.userId,
                action_type: actionType,
                action_detail: detail,
                page_number: pageNumber !== null && pageNumber !== void 0 ? pageNumber : this.pageNo,
                user_name: this.userName,
                user_position: '',
                ip_address: '',
                created_at: new Date().toISOString(),
            });
        };
        PdfAnnotatorModalComponent.prototype.toggleHistoryPanel = function () {
            this.showHistoryPanel = !this.showHistoryPanel;
            if (this.showHistoryPanel && this.documentId && this.historyEntries.length === 0) {
                this.loadHistoryFromApi();
            }
        };
        PdfAnnotatorModalComponent.prototype.loadHistoryFromApi = function () {
            var _this = this;
            if (!this.documentId)
                return;
            this.isLoadingHistory = true;
            this.pdfSvc.getHistory(this.documentId, 100).subscribe({
                next: function (res) {
                    _this.historyEntries = res.data;
                    _this.isLoadingHistory = false;
                },
                error: function () { _this.isLoadingHistory = false; },
            });
        };
        PdfAnnotatorModalComponent.prototype.getHistoryActionIcon = function (type) {
            var map = {
                sign: 'finger-print', text: 'text', draw: 'brush',
                highlight: 'color-fill-outline', shape: 'shapes-outline', image: 'image-outline',
                page_insert: 'add-circle-outline', page_delete: 'trash-outline',
                date_stamp: 'calendar', save: 'save-outline', upload: 'cloud-upload-outline', open: 'open-outline',
            };
            return map[type] || 'ellipse-outline';
        };
        PdfAnnotatorModalComponent.prototype.getHistoryActionLabel = function (type) {
            var map = {
                sign: 'ลงลายเซ็น', text: 'เพิ่มข้อความ', draw: 'วาด', highlight: 'ไฮไลท์',
                shape: 'รูปทรง', image: 'รูปภาพ', page_insert: 'แทรกหน้า', page_delete: 'ลบหน้า',
                date_stamp: 'วันที่', save: 'บันทึก', upload: 'นำเข้า', open: 'เปิดเอกสาร',
            };
            return map[type] || type;
        };
        Object.defineProperty(PdfAnnotatorModalComponent.prototype, "canUndoPageOp", {
            get: function () { return this.pageHistoryStack.length > 0; },
            enumerable: false,
            configurable: true
        });
        PdfAnnotatorModalComponent.prototype.savePageSnapshot = function () {
            if (!this.basePdfBytes)
                return;
            // Deep-clone annotation arrays and records so mutations don't affect snapshot
            var cloneArr = function (a) { return a.map(function (x) { return (Object.assign({}, x)); }); };
            var cloneRec = function (r) {
                var e_1, _g;
                var out = {};
                try {
                    for (var _h = __values(Object.keys(r)), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var k = _j.value;
                        out[Number(k)] = __spreadArray([], __read(r[Number(k)]));
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_g = _h.return)) _g.call(_h);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return out;
            };
            this.pageHistoryStack.push({
                bytes: this.basePdfBytes.slice(0),
                pageNo: this.pageNo,
                textBoxes: cloneArr(this.textBoxes),
                imageStamps: cloneArr(this.imageStamps),
                shapeStamps: cloneArr(this.shapeStamps),
                signatureStamps: cloneArr(this.signatureStamps),
                dateStamps: cloneArr(this.dateStamps),
                pdfFormFields: cloneArr(this.pdfFormFields),
                strokes: cloneRec(this.strokes),
                shapes: cloneRec(this.shapes),
                redoStack: cloneRec(this.redoStack),
            });
            // Keep last 20 snapshots
            if (this.pageHistoryStack.length > 20)
                this.pageHistoryStack.shift();
        };
        PdfAnnotatorModalComponent.prototype.undoPageOp = function () {
            return __awaiter(this, void 0, void 0, function () {
                var snapshot, copy, loadingTask, _g, tmpDoc, _1, toast, err_1;
                var _this = this;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            snapshot = this.pageHistoryStack.pop();
                            if (!snapshot)
                                return [2 /*return*/];
                            this.showInsertMenu = false;
                            this.isLoading = true;
                            this.loadingMessage = 'กำลังย้อนกลับ...';
                            this.cdr.detectChanges();
                            _h.label = 1;
                        case 1:
                            _h.trys.push([1, 11, 12, 13]);
                            this.basePdfBytes = snapshot.bytes;
                            this.textBoxes = snapshot.textBoxes;
                            this.imageStamps = snapshot.imageStamps;
                            this.shapeStamps = snapshot.shapeStamps;
                            this.signatureStamps = snapshot.signatureStamps;
                            this.dateStamps = snapshot.dateStamps;
                            this.pdfFormFields = snapshot.pdfFormFields || [];
                            this.strokes = snapshot.strokes;
                            this.shapes = snapshot.shapes;
                            this.redoStack = snapshot.redoStack;
                            copy = this.basePdfBytes.slice(0);
                            if (this.pdfDocProxy) {
                                this.pdfDocProxy.destroy();
                                this.pdfDocProxy = null;
                            }
                            loadingTask = pdfjsLib__namespace.getDocument({ data: copy });
                            _g = this;
                            return [4 /*yield*/, loadingTask.promise];
                        case 2:
                            _g.pdfDocProxy = _h.sent();
                            this.pageCount = this.pdfDocProxy.numPages;
                            this.loadedUntilPage = Math.min(this.loadedUntilPage, this.pageCount);
                            this.pages = Array.from({ length: this.loadedUntilPage }, function (_, i) { return i + 1; });
                            this.pages.forEach(function (p) { return _this.ensurePage(p); });
                            this.pdfPageAspects.clear();
                            this.pdfPageRotations.clear();
                            _h.label = 3;
                        case 3:
                            _h.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, pdfLib.PDFDocument.load(copy)];
                        case 4:
                            tmpDoc = _h.sent();
                            tmpDoc.getPages().forEach(function (pg, idx) {
                                var _g = pg.getSize(), width = _g.width, height = _g.height;
                                _this.pdfPageAspects.set(idx + 1, width / height);
                                _this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
                            });
                            return [3 /*break*/, 6];
                        case 5:
                            _1 = _h.sent();
                            return [3 /*break*/, 6];
                        case 6:
                            this.pageNo = Math.min(snapshot.pageNo, this.pageCount);
                            this.renderedPages.clear();
                            this.renderingPages.clear();
                            return [4 /*yield*/, this.generateThumbnails()];
                        case 7:
                            _h.sent();
                            return [4 /*yield*/, this.renderAllPages()];
                        case 8:
                            _h.sent();
                            this.scrollToPage(this.pageNo);
                            return [4 /*yield*/, this.toastCtrl.create({
                                    message: 'ย้อนกลับเรียบร้อยแล้ว',
                                    duration: 2000,
                                    color: 'success',
                                    position: 'bottom'
                                })];
                        case 9:
                            toast = _h.sent();
                            return [4 /*yield*/, toast.present()];
                        case 10:
                            _h.sent();
                            return [3 /*break*/, 13];
                        case 11:
                            err_1 = _h.sent();
                            console.error('undoPageOp error:', err_1);
                            return [3 /*break*/, 13];
                        case 12:
                            this.isLoading = false;
                            this.loadingMessage = '';
                            this.cdr.detectChanges();
                            return [7 /*endfinally*/];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
        Object.defineProperty(PdfAnnotatorModalComponent.prototype, "activeTextBox", {
            get: function () {
                var _this = this;
                return this.textBoxes.find(function (t) { return t.id === _this.activeTextBoxId; }) || null;
            },
            enumerable: false,
            configurable: true
        });
        PdfAnnotatorModalComponent.prototype.close = function () {
            this.unlockOrientation();
            this.modalCtrl.dismiss();
        };
        Object.defineProperty(PdfAnnotatorModalComponent.prototype, "drawMode", {
            get: function () { return this.toolMode === 'draw' || (this.toolMode === 'none' && this.activeObjectType === 'signature'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PdfAnnotatorModalComponent.prototype, "eraserMode", {
            get: function () { return this.toolMode === 'eraser'; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PdfAnnotatorModalComponent.prototype, "highlightMode", {
            get: function () { return this.toolMode === 'highlight'; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PdfAnnotatorModalComponent.prototype, "shapeMode", {
            get: function () { return this.toolMode === 'shape' || (this.toolMode === 'none' && this.activeObjectType === 'shape'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PdfAnnotatorModalComponent.prototype, "textPlaceMode", {
            get: function () { return this.toolMode === 'text' || (this.toolMode === 'none' && this.activeObjectType === 'text'); },
            enumerable: false,
            configurable: true
        });
        PdfAnnotatorModalComponent.prototype.ngOnInit = function () {
            this.strokes = {};
            this.shapes = {};
            this.redoStack = {};
            this.textBoxes = [];
            this.imageStamps = [];
            this.shapeStamps = [];
            this.signatureStamps = [];
            this.dateStamps = [];
            this.activeStroke = null;
            this.activeShape = null;
            this.activeTextBoxId = null;
            this.activeObjectId = null;
            this.activeObjectType = null;
            this.pendingSignatureDataUrl = null;
            this.toolMode = 'none';
            this.pageNo = 1;
            this.zoom = 1;
            this.savedSignatures = [];
            this.showSignaturePad = false;
            this.showSignaturePicker = false;
            this.showPreviewOverlay = false;
            this.previewUrl = null;
            this.lastSavedBlob = null;
            this.lastSavedFileName = '';
            this.isDrawingSignature = false;
            this.signaturePoints = [];
            this.signatureStrokes = [];
            this.isLoadingSignatures = false;
            this.isDragging = false;
            this.dragTextBoxId = null;
            this.isResizing = false;
            this.resizeTextBoxId = null;
            this.isDraggingImage = false;
            this.dragImageId = null;
            this.isResizingImage = false;
            this.resizeImageId = null;
            this.contextMenu.show = false;
            this.showShapeMenu = false;
            this.loadSettings(); // Restore user preferences
            this.cdr.detectChanges();
        };
        PdfAnnotatorModalComponent.prototype.saveSettings = function () {
            var settings = {
                brushColor: this.brushColor,
                brushSize: this.brushSize,
                highlightColor: this.highlightColor,
                highlightSize: this.highlightSize,
                eraserSize: this.eraserSize,
                textColor: this.textColor,
                textFontSize: this.textFontSize,
                dateColor: this.dateColor,
                dateFontSize: this.dateFontSize,
                shapeType: this.shapeType,
                shapeStrokeColor: this.shapeStrokeColor,
                shapeFillColor: this.shapeFillColor,
                shapeFillEnabled: this.shapeFillEnabled,
                shapeStrokeSize: this.shapeStrokeSize,
                shapeNoStroke: this.shapeNoStroke
            };
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
        };
        PdfAnnotatorModalComponent.prototype.loadSettings = function () {
            try {
                var saved = localStorage.getItem(this.SETTINGS_KEY);
                if (saved) {
                    var settings = JSON.parse(saved);
                    if (settings.brushColor)
                        this.brushColor = settings.brushColor;
                    if (settings.brushSize)
                        this.brushSize = settings.brushSize;
                    if (settings.highlightColor)
                        this.highlightColor = settings.highlightColor;
                    if (settings.highlightSize)
                        this.highlightSize = settings.highlightSize;
                    if (settings.eraserSize)
                        this.eraserSize = settings.eraserSize;
                    if (settings.textColor)
                        this.textColor = settings.textColor;
                    if (settings.textFontSize)
                        this.textFontSize = settings.textFontSize;
                    if (settings.dateColor)
                        this.dateColor = settings.dateColor;
                    if (settings.dateFontSize)
                        this.dateFontSize = settings.dateFontSize;
                    if (settings.shapeType)
                        this.shapeType = settings.shapeType;
                    if (settings.shapeStrokeColor)
                        this.shapeStrokeColor = settings.shapeStrokeColor;
                    if (settings.shapeFillColor)
                        this.shapeFillColor = settings.shapeFillColor;
                    if (settings.shapeFillEnabled !== undefined)
                        this.shapeFillEnabled = settings.shapeFillEnabled;
                    if (settings.shapeStrokeSize)
                        this.shapeStrokeSize = settings.shapeStrokeSize;
                    if (settings.shapeNoStroke !== undefined)
                        this.shapeNoStroke = settings.shapeNoStroke;
                }
            }
            catch (e) {
                console.warn('Failed to load settings from localStorage', e);
            }
        };
        Object.defineProperty(PdfAnnotatorModalComponent.prototype, "visibleTextBoxes", {
            get: function () { return this.getTextBoxesForPage(this.pageNo); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PdfAnnotatorModalComponent.prototype, "visibleImageStamps", {
            get: function () { return this.getImageStampsForPage(this.pageNo); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PdfAnnotatorModalComponent.prototype, "visibleSignatures", {
            get: function () { return this.getSignatureStampsForPage(this.pageNo); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PdfAnnotatorModalComponent.prototype, "visibleDateStamps", {
            get: function () { return this.getDateStampsForPage(this.pageNo); },
            enumerable: false,
            configurable: true
        });
        PdfAnnotatorModalComponent.prototype.getTextBoxesForPage = function (p) { return this.textBoxes.filter(function (t) { return t.page === p; }); };
        PdfAnnotatorModalComponent.prototype.getImageStampsForPage = function (p) { return this.imageStamps.filter(function (i) { return i.page === p; }); };
        PdfAnnotatorModalComponent.prototype.getRegularImageStampsForPage = function (p) { return this.imageStamps.filter(function (i) { return i.page === p && !i.id.startsWith('mark_'); }); };
        PdfAnnotatorModalComponent.prototype.getMarkStampsForPage = function (p) { return this.imageStamps.filter(function (i) { return i.page === p && i.id.startsWith('mark_'); }); };
        PdfAnnotatorModalComponent.prototype.getShapeStampsForPage = function (p) { return this.shapeStamps.filter(function (s) { return s.page === p; }); };
        PdfAnnotatorModalComponent.prototype.getSignatureStampsForPage = function (p) { return this.signatureStamps.filter(function (s) { return s.page === p; }); };
        PdfAnnotatorModalComponent.prototype.getDateStampsForPage = function (p) { return this.dateStamps.filter(function (d) { return d.page === p; }); };
        PdfAnnotatorModalComponent.prototype.getMarkSvgContent = function (markType, color) {
            var c = color || '#000000';
            if (markType === 'check') {
                return "<polyline points=\"12,52 42,82 88,18\" stroke=\"" + c + "\" stroke-width=\"10\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/>";
            }
            else if (markType === 'cross') {
                return "<line x1=\"15\" y1=\"15\" x2=\"85\" y2=\"85\" stroke=\"" + c + "\" stroke-width=\"10\" stroke-linecap=\"round\"/>" +
                    ("<line x1=\"85\" y1=\"15\" x2=\"15\" y2=\"85\" stroke=\"" + c + "\" stroke-width=\"10\" stroke-linecap=\"round\"/>");
            }
            else {
                return "<circle cx=\"50\" cy=\"50\" r=\"38\" fill=\"" + c + "\"/>";
            }
        };
        /** Lock screen orientation to portrait while annotating */
        PdfAnnotatorModalComponent.prototype.lockOrientation = function () {
            return __awaiter(this, void 0, void 0, function () {
                var orientation, _2;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            _g.trys.push([0, 3, , 4]);
                            orientation = screen.orientation;
                            if (!(orientation && orientation.lock)) return [3 /*break*/, 2];
                            return [4 /*yield*/, orientation.lock('portrait-primary')];
                        case 1:
                            _g.sent();
                            _g.label = 2;
                        case 2: return [3 /*break*/, 4];
                        case 3:
                            _2 = _g.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /** Unlock screen orientation when leaving the annotator */
        PdfAnnotatorModalComponent.prototype.unlockOrientation = function () {
            try {
                var orientation = screen.orientation;
                if (orientation && orientation.unlock) {
                    orientation.unlock();
                }
            }
            catch (_) { /* ignore */ }
        };
        PdfAnnotatorModalComponent.prototype.ngAfterViewInit = function () {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            pdfjsLib__namespace.GlobalWorkerOptions.workerSrc = this.pdfWorkerSrc;
                            // Lock orientation to portrait so the PDF doesn't rotate during annotation
                            this.lockOrientation();
                            // Clear and reset canvases before loading new PDF
                            (_a = this.pdfCanvases) === null || _a === void 0 ? void 0 : _a.forEach(function (ref) {
                                var canvas = ref.nativeElement;
                                var ctx = canvas.getContext('2d');
                                if (ctx) {
                                    canvas.width = 0;
                                    canvas.height = 0;
                                    canvas.style.width = '0px';
                                    canvas.style.height = '0px';
                                }
                            });
                            (_b = this.annotCanvases) === null || _b === void 0 ? void 0 : _b.forEach(function (ref) {
                                var canvas = ref.nativeElement;
                                var ctx = canvas.getContext('2d');
                                if (ctx) {
                                    canvas.width = 0;
                                    canvas.height = 0;
                                    canvas.style.width = '0px';
                                    canvas.style.height = '0px';
                                }
                            });
                            // Ensure state is clean
                            this.strokes = {};
                            this.shapes = {};
                            this.redoStack = {};
                            this.activeStroke = null;
                            this.activeShape = null;
                            this.activeObjectId = null;
                            this.activeObjectType = null;
                            return [4 /*yield*/, this.loadPdfBytesAndInitPdfjs()];
                        case 1:
                            _g.sent();
                            this.zone.runOutsideAngular(function () {
                                _this.setupResizeAutoRender();
                            });
                            return [4 /*yield*/, this.fitWidth()];
                        case 2:
                            _g.sent();
                            this.syncToolModeStyles();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.syncToolModeStyles = function () {
            var _this = this;
            // Set touch-action: none for ALL active tool modes to prevent iPad scroll
            var hasActiveTool = this.toolMode !== 'none';
            this.pages.forEach(function (p) {
                var canvas = _this.getAnnotCanvas(p);
                if (canvas) {
                    canvas.style.touchAction = hasActiveTool ? 'none' : 'auto';
                }
            });
            this.updateCursor();
        };
        PdfAnnotatorModalComponent.prototype.ngOnDestroy = function () {
            var _this = this;
            if (this.resizeObserver)
                this.resizeObserver.disconnect();
            // Cleanup PDF.js document to free memory
            if (this.pdfDocProxy) {
                this.pdfDocProxy.destroy();
                this.pdfDocProxy = null;
            }
            // Clear all canvases to release memory
            this.pages.forEach(function (p) {
                var pdfCanvas = _this.getPdfCanvas(p);
                var annotCanvas = _this.getAnnotCanvas(p);
                if (pdfCanvas) {
                    var ctx = pdfCanvas.getContext('2d');
                    if (ctx)
                        ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
                    pdfCanvas.width = 0;
                    pdfCanvas.height = 0;
                }
                if (annotCanvas) {
                    var ctx = annotCanvas.getContext('2d');
                    if (ctx)
                        ctx.clearRect(0, 0, annotCanvas.width, annotCanvas.height);
                    annotCanvas.width = 0;
                    annotCanvas.height = 0;
                }
            });
            // Clear data arrays
            this.pageThumbnails = [];
            this.basePdfBytes = null;
            this.strokes = {};
            this.shapes = {};
            this.textBoxes = [];
            this.imageStamps = [];
            this.shapeStamps = [];
            this.signatureStamps = [];
            this.dateStamps = [];
        };
        /* ================= Keyboard Shortcuts ================= */
        PdfAnnotatorModalComponent.prototype.onDocumentPointerDown = function (event) {
            var _this = this;
            if (this.contextMenu.show) {
                var target = event.target;
                if (!target.closest('.custom-context-menu')) {
                    this.zone.run(function () {
                        _this.closeContextMenu();
                        _this.cdr.detectChanges();
                    });
                }
            }
        };
        PdfAnnotatorModalComponent.prototype.handleKeyboard = function (event) {
            // Undo: Ctrl+Z or Cmd+Z
            if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
                event.preventDefault();
                this.undo();
                return;
            }
            // Redo: Ctrl+Y or Ctrl+Shift+Z or Cmd+Shift+Z
            if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
                event.preventDefault();
                this.redo();
                return;
            }
            // Escape: exit modes
            if (event.key === 'Escape') {
                this.exitAllModes();
                return;
            }
            // Delete: remove active object
            if (event.key === 'Delete' || event.key === 'Backspace') {
                var activeEl = document.activeElement;
                // Don't delete if user is typing in a textarea or input
                if ((activeEl === null || activeEl === void 0 ? void 0 : activeEl.tagName) === 'TEXTAREA' || (activeEl === null || activeEl === void 0 ? void 0 : activeEl.tagName) === 'INPUT') {
                    return;
                }
                if (this.activeObjectId && this.activeObjectType) {
                    if (this.activeObjectType === 'text')
                        this.removeTextBox(this.activeObjectId);
                    else if (this.activeObjectType === 'shape')
                        this.removeShapeStamp(this.activeObjectId);
                    else if (this.activeObjectType === 'image')
                        this.removeImage(this.activeObjectId);
                    else if (this.activeObjectType === 'signature')
                        this.removeSignature(this.activeObjectId);
                    else if (this.activeObjectType === 'date')
                        this.removeDateStamp(this.activeObjectId);
                    this.activeObjectId = null;
                    this.activeObjectType = null;
                }
            }
        };
        PdfAnnotatorModalComponent.prototype.exitAllModes = function () {
            this.toolMode = 'none';
            this.showShapeMenu = false;
            this.activeTextBoxId = null;
            this.activeObjectId = null;
            this.activeObjectType = null;
            this.pendingSignatureDataUrl = null;
            this.closeContextMenu();
            this.syncToolModeStyles(); // Reset touch-action so iPad can scroll/pan PDF again
            this.updateCursor();
        };
        /* ================= User Guide Methods ================= */
        PdfAnnotatorModalComponent.prototype.toggleUserGuide = function (e) {
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            this.showUserGuidePanel = !this.showUserGuidePanel;
            if (this.showUserGuidePanel) {
                this.isEditingGuide = false;
                this.fetchGuideData();
            }
        };
        PdfAnnotatorModalComponent.prototype.fetchGuideData = function () {
            var _this = this;
            // Simulate API fetch
            this.isLoadingGuide = true;
            setTimeout(function () {
                // Logic for actual API fetch goes here (e.g. this.accessProviders.postData(...))
                _this.isLoadingGuide = false;
            }, 500);
        };
        PdfAnnotatorModalComponent.prototype.editGuide = function () {
            if (!this.canManageGuide)
                return;
            this.tempGuideContent = this.userGuideContent;
            this.isEditingGuide = true;
        };
        PdfAnnotatorModalComponent.prototype.cancelEditGuide = function () {
            this.isEditingGuide = false;
            this.tempGuideContent = '';
        };
        PdfAnnotatorModalComponent.prototype.saveGuide = function () {
            // Simulate API save
            this.userGuideContent = this.tempGuideContent;
            this.isEditingGuide = false;
            // Call API here to save permanently
            // e.g. this.accessProviders.postData({ content: this.userGuideContent }, 'save_guide.php')...
        };
        /* ================= Context Menu Methods ================= */
        PdfAnnotatorModalComponent.prototype.closeContextMenu = function () {
            if (this.contextMenu.show) {
                this.contextMenu.show = false;
                this.cdr.detectChanges();
            }
        };
        PdfAnnotatorModalComponent.prototype.onContextMenu = function (e, id, type) {
            e.preventDefault();
            e.stopPropagation();
            // Auto-switch to select mode when right clicking to ensure smooth UX
            if (this.toolMode !== 'none') {
                this.setToolMode('none');
            }
            // Position menu exactly at mouse
            this.contextMenu.x = e.clientX;
            this.contextMenu.y = e.clientY;
            this.contextMenu.targetId = id;
            this.contextMenu.targetType = type;
            this.contextMenu.show = true;
            // Force UI update immediately to prevent "slow" feeling
            this.cdr.detectChanges();
        };
        PdfAnnotatorModalComponent.prototype.getContextTargetObject = function () {
            var id = this.contextMenu.targetId;
            switch (this.contextMenu.targetType) {
                case 'text': return this.textBoxes.find(function (t) { return t.id === id; });
                case 'shape': return this.shapeStamps.find(function (s) { return s.id === id; });
                case 'image': return this.imageStamps.find(function (i) { return i.id === id; });
                case 'signature': return this.signatureStamps.find(function (s) { return s.id === id; });
                case 'date': return this.dateStamps.find(function (d) { return d.id === id; });
            }
            return null;
        };
        PdfAnnotatorModalComponent.prototype.getAllAnnotationsZIndices = function () {
            var all = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(this.textBoxes)), __read(this.shapeStamps)), __read(this.imageStamps)), __read(this.signatureStamps)), __read(this.dateStamps));
            return all.map(function (a) { return a.zIndex || 10; });
        };
        PdfAnnotatorModalComponent.prototype.contextBringToFront = function () {
            var obj = this.getContextTargetObject();
            if (obj) {
                var zs = this.getAllAnnotationsZIndices();
                var maxZ = zs.length ? Math.max.apply(Math, __spreadArray([], __read(zs))) : 10;
                obj.zIndex = maxZ + 1;
                this.closeContextMenu();
                this.cdr.detectChanges();
            }
        };
        PdfAnnotatorModalComponent.prototype.contextBringForward = function () {
            var obj = this.getContextTargetObject();
            if (obj) {
                obj.zIndex = (obj.zIndex || 10) + 1;
                this.closeContextMenu();
                this.cdr.detectChanges();
            }
        };
        PdfAnnotatorModalComponent.prototype.contextSendBackward = function () {
            var obj = this.getContextTargetObject();
            if (obj) {
                obj.zIndex = (obj.zIndex || 10) - 1;
                this.closeContextMenu();
                this.cdr.detectChanges();
            }
        };
        PdfAnnotatorModalComponent.prototype.contextSendToBack = function () {
            var obj = this.getContextTargetObject();
            if (obj) {
                var zs = this.getAllAnnotationsZIndices();
                var minZ = zs.length ? Math.min.apply(Math, __spreadArray([], __read(zs))) : 10;
                obj.zIndex = Math.max(1, minZ - 1);
                this.closeContextMenu();
                this.cdr.detectChanges();
            }
        };
        PdfAnnotatorModalComponent.prototype.deleteContextMenuTarget = function () {
            var id = this.contextMenu.targetId;
            switch (this.contextMenu.targetType) {
                case 'text':
                    this.removeTextBox(id);
                    break;
                case 'shape':
                    this.removeShapeStamp(id);
                    break;
                case 'image':
                    this.removeImage(id);
                    break;
                case 'signature':
                    this.removeSignature(id);
                    break;
                case 'date':
                    this.removeDateStamp(id);
                    break;
            }
            this.closeContextMenu();
        };
        /* ================= PDF load ================= */
        PdfAnnotatorModalComponent.prototype.loadPdfBytesAndInitPdfjs = function () {
            return __awaiter(this, void 0, void 0, function () {
                var buffer, loadingTask, _g, p, tmpDoc, _3, error_1, isTimeout, isNetwork, is404, msg, toast;
                var _this = this;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            this.isLoading = true;
                            this.loadingMessage = 'กำลังโหลด PDF...';
                            _h.label = 1;
                        case 1:
                            _h.trys.push([1, 9, 12, 13]);
                            return [4 /*yield*/, this.http
                                    .get(this.pdfUrl, { responseType: 'arraybuffer' })
                                    .pipe(operators.timeout(60000), operators.retry(2))
                                    .toPromise()];
                        case 2:
                            buffer = _h.sent();
                            if (!buffer) {
                                throw new Error('ไม่สามารถโหลดไฟล์ PDF ได้');
                            }
                            this.basePdfBytes = buffer;
                            loadingTask = pdfjsLib__namespace.getDocument({ data: buffer });
                            _g = this;
                            return [4 /*yield*/, loadingTask.promise];
                        case 3:
                            _g.pdfDocProxy = _h.sent();
                            this.pageCount = this.pdfDocProxy.numPages || 1;
                            // Initialize annotation data for ALL pages upfront
                            for (p = 1; p <= this.pageCount; p++)
                                this.ensurePage(p);
                            // Only render first chunk in the DOM
                            this.loadedUntilPage = Math.min(this.PAGE_CHUNK, this.pageCount);
                            this.pages = Array.from({ length: this.loadedUntilPage }, function (_, i) { return i + 1; });
                            _h.label = 4;
                        case 4:
                            _h.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, pdfLib.PDFDocument.load(buffer)];
                        case 5:
                            tmpDoc = _h.sent();
                            tmpDoc.getPages().forEach(function (pg, idx) {
                                var _g = pg.getSize(), width = _g.width, height = _g.height;
                                _this.pdfPageAspects.set(idx + 1, width / height);
                                // Store rotation so renderPage can force correct landscape/portrait viewport
                                _this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
                            });
                            return [3 /*break*/, 7];
                        case 6:
                            _3 = _h.sent();
                            return [3 /*break*/, 7];
                        case 7: 
                        // Generate thumbnails after loading PDF
                        return [4 /*yield*/, this.generateThumbnails()];
                        case 8:
                            // Generate thumbnails after loading PDF
                            _h.sent();
                            return [3 /*break*/, 13];
                        case 9:
                            error_1 = _h.sent();
                            console.error('Error loading PDF:', error_1);
                            isTimeout = (error_1 === null || error_1 === void 0 ? void 0 : error_1.name) === 'TimeoutError';
                            isNetwork = (error_1 === null || error_1 === void 0 ? void 0 : error_1.status) === 0;
                            is404 = (error_1 === null || error_1 === void 0 ? void 0 : error_1.status) === 404;
                            msg = 'ไม่สามารถโหลด PDF ได้ กรุณาลองใหม่อีกครั้ง';
                            if (isTimeout)
                                msg = 'โหลด PDF หมดเวลา (Timeout) กรุณาตรวจสอบการเชื่อมต่อ';
                            else if (isNetwork)
                                msg = 'ไม่สามารถเชื่อมต่อ Server ได้ กรุณาตรวจสอบเครือข่าย';
                            else if (is404)
                                msg = 'ไม่พบไฟล์ PDF บน Server กรุณาติดต่อผู้ดูแลระบบ';
                            return [4 /*yield*/, this.toastCtrl.create({
                                    message: msg,
                                    duration: 4000,
                                    color: 'danger',
                                    position: 'middle'
                                })];
                        case 10:
                            toast = _h.sent();
                            return [4 /*yield*/, toast.present()];
                        case 11:
                            _h.sent();
                            this.unlockOrientation();
                            this.modalCtrl.dismiss({ error: true, message: msg });
                            return [3 /*break*/, 13];
                        case 12:
                            this.isLoading = false;
                            this.loadingMessage = '';
                            return [7 /*endfinally*/];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.generateThumbnails = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            if (!this.pdfDocProxy)
                                return [2 /*return*/];
                            this.pageThumbnails = [];
                            return [4 /*yield*/, this.generateThumbnailsRange(1, this.loadedUntilPage)];
                        case 1:
                            _g.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.generateThumbnailsRange = function (from, to) {
            return __awaiter(this, void 0, void 0, function () {
                var scale, i, page, viewport, canvas, ctx;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            if (!this.pdfDocProxy)
                                return [2 /*return*/];
                            scale = 0.2;
                            i = from;
                            _g.label = 1;
                        case 1:
                            if (!(i <= to)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.pdfDocProxy.getPage(i)];
                        case 2:
                            page = _g.sent();
                            viewport = page.getViewport({ scale: scale });
                            canvas = document.createElement('canvas');
                            ctx = canvas.getContext('2d');
                            canvas.width = viewport.width;
                            canvas.height = viewport.height;
                            return [4 /*yield*/, page.render({ canvasContext: ctx, viewport: viewport }).promise];
                        case 3:
                            _g.sent();
                            this.pageThumbnails.push(canvas.toDataURL('image/png'));
                            _g.label = 4;
                        case 4:
                            i++;
                            return [3 /*break*/, 1];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.loadNextChunk = function () {
            return __awaiter(this, void 0, void 0, function () {
                var newEnd, prevEnd, p, p;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            if (this.isLoadingChunk || this.loadedUntilPage >= this.pageCount)
                                return [2 /*return*/];
                            this.isLoadingChunk = true;
                            newEnd = Math.min(this.loadedUntilPage + this.PAGE_CHUNK, this.pageCount);
                            prevEnd = this.loadedUntilPage;
                            return [4 /*yield*/, this.generateThumbnailsRange(prevEnd + 1, newEnd)];
                        case 1:
                            _g.sent();
                            for (p = prevEnd + 1; p <= newEnd; p++)
                                this.pages.push(p);
                            this.loadedUntilPage = newEnd;
                            this.cdr.detectChanges();
                            return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 50); })];
                        case 2:
                            _g.sent();
                            p = prevEnd + 1;
                            _g.label = 3;
                        case 3:
                            if (!(p <= newEnd)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.renderPage(p)];
                        case 4:
                            _g.sent();
                            _g.label = 5;
                        case 5:
                            p++;
                            return [3 /*break*/, 3];
                        case 6:
                            this.isLoadingChunk = false;
                            return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.goToPage = function (pageNum) {
            if (pageNum < 1 || pageNum > this.pageCount)
                return;
            this.pageNo = pageNum;
            this.scrollToPage(this.pageNo);
            // Re-fit width in case new page has different orientation (landscape vs portrait)
            this.fitWidth();
        };
        PdfAnnotatorModalComponent.prototype.toggleThumbnails = function () {
            this.showThumbnails = !this.showThumbnails;
        };
        /* ================= Insert Blank Page ================= */
        PdfAnnotatorModalComponent.prototype.insertBlankPage = function (where) {
            return __awaiter(this, void 0, void 0, function () {
                var pdfDoc, pages, refPage, _g, width, height, pageW, pageH, insertIndex, newBytes, shiftPage_1, shiftAnnotations, shiftRecord, copy, loadingTask, _h, tmpDoc, _4, toast, err_2, toast;
                var _this = this;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            if (!this.basePdfBytes)
                                return [2 /*return*/];
                            this.showInsertMenu = false;
                            this.isLoading = true;
                            this.loadingMessage = 'กำลังแทรกหน้าเปล่า...';
                            this.savePageSnapshot(); // บันทึก snapshot ก่อนแก้ไข
                            this.cdr.detectChanges();
                            _j.label = 1;
                        case 1:
                            _j.trys.push([1, 13, 16, 17]);
                            return [4 /*yield*/, pdfLib.PDFDocument.load(this.basePdfBytes)];
                        case 2:
                            pdfDoc = _j.sent();
                            pages = pdfDoc.getPages();
                            refPage = pages[this.pageNo - 1];
                            _g = refPage.getSize(), width = _g.width, height = _g.height;
                            pageW = void 0;
                            pageH = void 0;
                            if (this.insertOrientation === 'landscape') {
                                pageW = Math.max(width, height);
                                pageH = Math.min(width, height);
                            }
                            else {
                                pageW = Math.min(width, height);
                                pageH = Math.max(width, height);
                            }
                            insertIndex = where === 'before' ? this.pageNo - 1 : this.pageNo;
                            pdfDoc.insertPage(insertIndex, [pageW, pageH]);
                            return [4 /*yield*/, pdfDoc.save()];
                        case 3:
                            newBytes = _j.sent();
                            this.basePdfBytes = newBytes.buffer;
                            shiftPage_1 = insertIndex + 1;
                            shiftAnnotations = function (arr) { return arr.map(function (a) { return a.page >= shiftPage_1 ? Object.assign(Object.assign({}, a), { page: a.page + 1 }) : a; }); };
                            this.textBoxes = shiftAnnotations(this.textBoxes);
                            this.imageStamps = shiftAnnotations(this.imageStamps);
                            this.shapeStamps = shiftAnnotations(this.shapeStamps);
                            this.signatureStamps = shiftAnnotations(this.signatureStamps);
                            this.dateStamps = shiftAnnotations(this.dateStamps);
                            shiftRecord = function (rec) {
                                var e_2, _g;
                                var next = {};
                                try {
                                    for (var _h = __values(Object.keys(rec)), _j = _h.next(); !_j.done; _j = _h.next()) {
                                        var key = _j.value;
                                        var p = Number(key);
                                        next[p >= shiftPage_1 ? p + 1 : p] = rec[p];
                                    }
                                }
                                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                finally {
                                    try {
                                        if (_j && !_j.done && (_g = _h.return)) _g.call(_h);
                                    }
                                    finally { if (e_2) throw e_2.error; }
                                }
                                return next;
                            };
                            this.strokes = shiftRecord(this.strokes);
                            this.shapes = shiftRecord(this.shapes);
                            this.redoStack = shiftRecord(this.redoStack);
                            copy = this.basePdfBytes.slice(0);
                            if (this.pdfDocProxy) {
                                this.pdfDocProxy.destroy();
                                this.pdfDocProxy = null;
                            }
                            loadingTask = pdfjsLib__namespace.getDocument({ data: copy });
                            _h = this;
                            return [4 /*yield*/, loadingTask.promise];
                        case 4:
                            _h.pdfDocProxy = _j.sent();
                            this.pageCount = this.pdfDocProxy.numPages;
                            this.loadedUntilPage = Math.min(this.loadedUntilPage, this.pageCount);
                            this.pages = Array.from({ length: this.loadedUntilPage }, function (_, i) { return i + 1; });
                            this.pages.forEach(function (p) { return _this.ensurePage(p); });
                            // Refresh aspect ratios & rotations
                            this.pdfPageAspects.clear();
                            this.pdfPageRotations.clear();
                            _j.label = 5;
                        case 5:
                            _j.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, pdfLib.PDFDocument.load(copy)];
                        case 6:
                            tmpDoc = _j.sent();
                            tmpDoc.getPages().forEach(function (pg, idx) {
                                var _g = pg.getSize(), w = _g.width, h = _g.height;
                                _this.pdfPageAspects.set(idx + 1, w / h);
                                _this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
                            });
                            return [3 /*break*/, 8];
                        case 7:
                            _4 = _j.sent();
                            return [3 /*break*/, 8];
                        case 8:
                            // Navigate to the new blank page
                            this.pageNo = insertIndex + 1;
                            this.renderedPages.clear();
                            this.renderingPages.clear();
                            return [4 /*yield*/, this.generateThumbnails()];
                        case 9:
                            _j.sent();
                            return [4 /*yield*/, this.renderAllPages()];
                        case 10:
                            _j.sent();
                            this.scrollToPage(this.pageNo);
                            return [4 /*yield*/, this.toastCtrl.create({
                                    message: "\u0E41\u0E17\u0E23\u0E01\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E1B\u0E25\u0E48\u0E32" + (this.insertOrientation === 'portrait' ? 'แนวตั้ง' : 'แนวนอน') + "\u0E17\u0E35\u0E48\u0E2B\u0E19\u0E49\u0E32 " + this.pageNo + " \u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27",
                                    duration: 2000,
                                    color: 'success',
                                    position: 'bottom'
                                })];
                        case 11:
                            toast = _j.sent();
                            return [4 /*yield*/, toast.present()];
                        case 12:
                            _j.sent();
                            // Log to history
                            this.logHistory('page_insert', { where: where, orientation: this.insertOrientation, insertedAt: this.pageNo }, this.pageNo);
                            return [3 /*break*/, 17];
                        case 13:
                            err_2 = _j.sent();
                            console.error('insertBlankPage error:', err_2);
                            return [4 /*yield*/, this.toastCtrl.create({
                                    message: 'เกิดข้อผิดพลาดในการแทรกหน้า',
                                    duration: 2000,
                                    color: 'danger',
                                    position: 'bottom'
                                })];
                        case 14:
                            toast = _j.sent();
                            return [4 /*yield*/, toast.present()];
                        case 15:
                            _j.sent();
                            return [3 /*break*/, 17];
                        case 16:
                            this.isLoading = false;
                            this.loadingMessage = '';
                            this.cdr.detectChanges();
                            return [7 /*endfinally*/];
                        case 17: return [2 /*return*/];
                    }
                });
            });
        };
        /* ================= Delete Current Page ================= */
        PdfAnnotatorModalComponent.prototype.deletePage = function () {
            return __awaiter(this, void 0, void 0, function () {
                var alert;
                var _this = this;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            if (!this.basePdfBytes || this.pageCount <= 1)
                                return [2 /*return*/];
                            this.showInsertMenu = false;
                            return [4 /*yield*/, this.alertCtrl.create({
                                    header: 'ลบหน้าเอกสาร',
                                    message: "\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48 " + this.pageNo + " \u0E43\u0E0A\u0E48\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48? \u0E01\u0E32\u0E23\u0E01\u0E23\u0E30\u0E17\u0E33\u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E40\u0E23\u0E35\u0E22\u0E01\u0E04\u0E37\u0E19\u0E44\u0E14\u0E49",
                                    buttons: [
                                        { text: 'ยกเลิก', role: 'cancel' },
                                        {
                                            text: 'ลบหน้า',
                                            role: 'destructive',
                                            cssClass: 'alert-btn-danger',
                                            handler: function () { return _this.doDeletePage(); }
                                        }
                                    ]
                                })];
                        case 1:
                            alert = _g.sent();
                            return [4 /*yield*/, alert.present()];
                        case 2:
                            _g.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.doDeletePage = function () {
            return __awaiter(this, void 0, void 0, function () {
                var pdfDoc, deleteIndex, newBytes, deletedPage_1, filterAndShift, shiftDeleteRecord, copy, loadingTask, _g, tmpDoc, _5, toast, err_3, toast;
                var _this = this;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            if (!this.basePdfBytes)
                                return [2 /*return*/];
                            this.isLoading = true;
                            this.loadingMessage = 'กำลังลบหน้า...';
                            this.savePageSnapshot(); // บันทึก snapshot ก่อนลบ
                            this.cdr.detectChanges();
                            _h.label = 1;
                        case 1:
                            _h.trys.push([1, 13, 16, 17]);
                            return [4 /*yield*/, pdfLib.PDFDocument.load(this.basePdfBytes)];
                        case 2:
                            pdfDoc = _h.sent();
                            deleteIndex = this.pageNo - 1;
                            pdfDoc.removePage(deleteIndex);
                            return [4 /*yield*/, pdfDoc.save()];
                        case 3:
                            newBytes = _h.sent();
                            this.basePdfBytes = newBytes.buffer;
                            deletedPage_1 = this.pageNo;
                            filterAndShift = function (arr) { return arr
                                .filter(function (a) { return a.page !== deletedPage_1; })
                                .map(function (a) { return a.page > deletedPage_1 ? Object.assign(Object.assign({}, a), { page: a.page - 1 }) : a; }); };
                            this.textBoxes = filterAndShift(this.textBoxes);
                            this.imageStamps = filterAndShift(this.imageStamps);
                            this.shapeStamps = filterAndShift(this.shapeStamps);
                            this.signatureStamps = filterAndShift(this.signatureStamps);
                            this.dateStamps = filterAndShift(this.dateStamps);
                            shiftDeleteRecord = function (rec) {
                                var e_3, _g;
                                var next = {};
                                try {
                                    for (var _h = __values(Object.keys(rec)), _j = _h.next(); !_j.done; _j = _h.next()) {
                                        var key = _j.value;
                                        var p = Number(key);
                                        if (p === deletedPage_1)
                                            continue; // drop deleted page
                                        next[p > deletedPage_1 ? p - 1 : p] = rec[p];
                                    }
                                }
                                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                finally {
                                    try {
                                        if (_j && !_j.done && (_g = _h.return)) _g.call(_h);
                                    }
                                    finally { if (e_3) throw e_3.error; }
                                }
                                return next;
                            };
                            this.strokes = shiftDeleteRecord(this.strokes);
                            this.shapes = shiftDeleteRecord(this.shapes);
                            this.redoStack = shiftDeleteRecord(this.redoStack);
                            copy = this.basePdfBytes.slice(0);
                            if (this.pdfDocProxy) {
                                this.pdfDocProxy.destroy();
                                this.pdfDocProxy = null;
                            }
                            loadingTask = pdfjsLib__namespace.getDocument({ data: copy });
                            _g = this;
                            return [4 /*yield*/, loadingTask.promise];
                        case 4:
                            _g.pdfDocProxy = _h.sent();
                            this.pageCount = this.pdfDocProxy.numPages;
                            this.loadedUntilPage = Math.min(this.loadedUntilPage, this.pageCount);
                            this.pages = Array.from({ length: this.loadedUntilPage }, function (_, i) { return i + 1; });
                            this.pages.forEach(function (p) { return _this.ensurePage(p); });
                            // Refresh aspect ratios & rotations
                            this.pdfPageAspects.clear();
                            this.pdfPageRotations.clear();
                            _h.label = 5;
                        case 5:
                            _h.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, pdfLib.PDFDocument.load(copy)];
                        case 6:
                            tmpDoc = _h.sent();
                            tmpDoc.getPages().forEach(function (pg, idx) {
                                var _g = pg.getSize(), width = _g.width, height = _g.height;
                                _this.pdfPageAspects.set(idx + 1, width / height);
                                _this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
                            });
                            return [3 /*break*/, 8];
                        case 7:
                            _5 = _h.sent();
                            return [3 /*break*/, 8];
                        case 8:
                            // Navigate to the previous page (or page 1 if we deleted page 1)
                            this.pageNo = Math.min(deletedPage_1, this.pageCount);
                            this.renderedPages.clear();
                            this.renderingPages.clear();
                            return [4 /*yield*/, this.generateThumbnails()];
                        case 9:
                            _h.sent();
                            return [4 /*yield*/, this.renderAllPages()];
                        case 10:
                            _h.sent();
                            this.scrollToPage(this.pageNo);
                            return [4 /*yield*/, this.toastCtrl.create({
                                    message: "\u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48 " + deletedPage_1 + " \u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27",
                                    duration: 2000,
                                    color: 'success',
                                    position: 'bottom'
                                })];
                        case 11:
                            toast = _h.sent();
                            return [4 /*yield*/, toast.present()];
                        case 12:
                            _h.sent();
                            return [3 /*break*/, 17];
                        case 13:
                            err_3 = _h.sent();
                            console.error('deletePage error:', err_3);
                            return [4 /*yield*/, this.toastCtrl.create({
                                    message: 'เกิดข้อผิดพลาดในการลบหน้า',
                                    duration: 2000,
                                    color: 'danger',
                                    position: 'bottom'
                                })];
                        case 14:
                            toast = _h.sent();
                            return [4 /*yield*/, toast.present()];
                        case 15:
                            _h.sent();
                            return [3 /*break*/, 17];
                        case 16:
                            this.isLoading = false;
                            this.loadingMessage = '';
                            this.cdr.detectChanges();
                            return [7 /*endfinally*/];
                        case 17: return [2 /*return*/];
                    }
                });
            });
        };
        /* ================= Thumbnail Sidebar Wrappers ================= */
        PdfAnnotatorModalComponent.prototype.toggleThumbInsert = function (idx, event) {
            if (this.thumbInsertIndex === idx) {
                this.thumbInsertIndex = -1;
                return;
            }
            this.thumbInsertIndex = idx;
            if (event && event.currentTarget) {
                var btn = event.currentTarget;
                var rect = btn.getBoundingClientRect();
                // Center the dropdown vertically on the button
                this.thumbDropdownTop = rect.top + rect.height / 2;
            }
        };
        /** Insert a blank page at `afterIndex` (0 = before page 1, n = after page n) */
        PdfAnnotatorModalComponent.prototype.insertAtThumb = function (afterIndex, orientation) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            this.thumbInsertIndex = -1;
                            if (!this.basePdfBytes)
                                return [2 /*return*/];
                            // Navigate to the page around which we are inserting so insertBlankPage works correctly
                            this.insertOrientation = orientation;
                            if (!(afterIndex === 0)) return [3 /*break*/, 2];
                            this.pageNo = 1;
                            return [4 /*yield*/, this.insertBlankPage('before')];
                        case 1:
                            _g.sent();
                            return [3 /*break*/, 4];
                        case 2:
                            this.pageNo = afterIndex;
                            return [4 /*yield*/, this.insertBlankPage('after')];
                        case 3:
                            _g.sent();
                            _g.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.triggerThumbFileUpload = function (afterIndex) {
            this.thumbInsertIndex = -1;
            this.thumbInsertAtIndex = afterIndex;
            if (this.thumbFileInputRef) {
                this.thumbFileInputRef.nativeElement.value = '';
                this.thumbFileInputRef.nativeElement.click();
            }
        };
        PdfAnnotatorModalComponent.prototype.onThumbFileSelected = function (event) {
            return __awaiter(this, void 0, void 0, function () {
                var input, file, reader, arrayBuffer, importedPdf, mainPdf, importedPages, insertIndex, currentIndex, importedPages_1, importedPages_1_1, page, newBytes, insertedCount_1, shiftPage_2, shiftAnnotations, shiftRecord, copy, loadingTask, _g, tmpDoc, _6, toast, err_4, toast, toast;
                var e_4, _h;
                var _this = this;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            input = event.target;
                            if (!input.files || !input.files[0] || !this.basePdfBytes)
                                return [2 /*return*/];
                            file = input.files[0];
                            // Navigate to the correct insert position then trigger image upload
                            if (this.thumbInsertAtIndex === 0) {
                                this.pageNo = 1;
                            }
                            else {
                                this.pageNo = this.thumbInsertAtIndex;
                            }
                            if (!file.type.startsWith('image/')) return [3 /*break*/, 1];
                            reader = new FileReader();
                            reader.onload = function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var dataUrl, newPage, stamp;
                                return __generator(this, function (_g) {
                                    switch (_g.label) {
                                        case 0:
                                            dataUrl = e.target.result;
                                            if (!(this.thumbInsertAtIndex === 0)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.insertBlankPage('before')];
                                        case 1:
                                            _g.sent();
                                            return [3 /*break*/, 4];
                                        case 2: return [4 /*yield*/, this.insertBlankPage('after')];
                                        case 3:
                                            _g.sent();
                                            _g.label = 4;
                                        case 4:
                                            newPage = this.thumbInsertAtIndex === 0 ? 1 : this.thumbInsertAtIndex + 1;
                                            stamp = {
                                                id: 'img_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                                                page: newPage, x: 0, y: 0, width: 100, height: 100,
                                                dataUrl: dataUrl
                                            };
                                            this.imageStamps.push(stamp);
                                            this.cdr.detectChanges();
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            reader.readAsDataURL(file);
                            return [3 /*break*/, 25];
                        case 1:
                            if (!(file.type === 'application/pdf')) return [3 /*break*/, 22];
                            this.isLoading = true;
                            this.loadingMessage = 'กำลังแทรกไฟล์ PDF...';
                            this.savePageSnapshot();
                            this.cdr.detectChanges();
                            _j.label = 2;
                        case 2:
                            _j.trys.push([2, 17, 20, 21]);
                            return [4 /*yield*/, file.arrayBuffer()];
                        case 3:
                            arrayBuffer = _j.sent();
                            return [4 /*yield*/, pdfLib.PDFDocument.load(arrayBuffer)];
                        case 4:
                            importedPdf = _j.sent();
                            return [4 /*yield*/, pdfLib.PDFDocument.load(this.basePdfBytes)];
                        case 5:
                            mainPdf = _j.sent();
                            return [4 /*yield*/, mainPdf.copyPages(importedPdf, importedPdf.getPageIndices())];
                        case 6:
                            importedPages = _j.sent();
                            insertIndex = this.thumbInsertAtIndex;
                            currentIndex = insertIndex;
                            try {
                                for (importedPages_1 = __values(importedPages), importedPages_1_1 = importedPages_1.next(); !importedPages_1_1.done; importedPages_1_1 = importedPages_1.next()) {
                                    page = importedPages_1_1.value;
                                    mainPdf.insertPage(currentIndex, page);
                                    currentIndex++;
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (importedPages_1_1 && !importedPages_1_1.done && (_h = importedPages_1.return)) _h.call(importedPages_1);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                            return [4 /*yield*/, mainPdf.save()];
                        case 7:
                            newBytes = _j.sent();
                            this.basePdfBytes = newBytes.buffer;
                            insertedCount_1 = importedPages.length;
                            shiftPage_2 = insertIndex + 1;
                            shiftAnnotations = function (arr) { return arr.map(function (a) { return a.page >= shiftPage_2 ? Object.assign(Object.assign({}, a), { page: a.page + insertedCount_1 }) : a; }); };
                            this.textBoxes = shiftAnnotations(this.textBoxes);
                            this.imageStamps = shiftAnnotations(this.imageStamps);
                            this.shapeStamps = shiftAnnotations(this.shapeStamps);
                            this.signatureStamps = shiftAnnotations(this.signatureStamps);
                            this.dateStamps = shiftAnnotations(this.dateStamps);
                            shiftRecord = function (rec) {
                                var e_5, _g;
                                var next = {};
                                try {
                                    for (var _h = __values(Object.keys(rec)), _j = _h.next(); !_j.done; _j = _h.next()) {
                                        var key = _j.value;
                                        var p = Number(key);
                                        next[p >= shiftPage_2 ? p + insertedCount_1 : p] = rec[p];
                                    }
                                }
                                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                                finally {
                                    try {
                                        if (_j && !_j.done && (_g = _h.return)) _g.call(_h);
                                    }
                                    finally { if (e_5) throw e_5.error; }
                                }
                                return next;
                            };
                            this.strokes = shiftRecord(this.strokes);
                            this.shapes = shiftRecord(this.shapes);
                            this.redoStack = shiftRecord(this.redoStack);
                            copy = this.basePdfBytes.slice(0);
                            if (this.pdfDocProxy) {
                                this.pdfDocProxy.destroy();
                                this.pdfDocProxy = null;
                            }
                            loadingTask = pdfjsLib__namespace.getDocument({ data: copy });
                            _g = this;
                            return [4 /*yield*/, loadingTask.promise];
                        case 8:
                            _g.pdfDocProxy = _j.sent();
                            this.pageCount = this.pdfDocProxy.numPages;
                            this.pages = Array.from({ length: this.loadedUntilPage }, function (_, i) { return i + 1; });
                            this.pages.forEach(function (p) { return _this.ensurePage(p); });
                            this.pdfPageAspects.clear();
                            this.pdfPageRotations.clear();
                            _j.label = 9;
                        case 9:
                            _j.trys.push([9, 11, , 12]);
                            return [4 /*yield*/, pdfLib.PDFDocument.load(copy)];
                        case 10:
                            tmpDoc = _j.sent();
                            tmpDoc.getPages().forEach(function (pg, idx) {
                                var _g = pg.getSize(), w = _g.width, h = _g.height;
                                _this.pdfPageAspects.set(idx + 1, w / h);
                                _this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
                            });
                            return [3 /*break*/, 12];
                        case 11:
                            _6 = _j.sent();
                            return [3 /*break*/, 12];
                        case 12:
                            this.pageNo = shiftPage_2;
                            this.renderedPages.clear();
                            this.renderingPages.clear();
                            return [4 /*yield*/, this.generateThumbnails()];
                        case 13:
                            _j.sent();
                            return [4 /*yield*/, this.renderAllPages()];
                        case 14:
                            _j.sent();
                            this.scrollToPage(this.pageNo);
                            return [4 /*yield*/, this.toastCtrl.create({
                                    message: "\u0E41\u0E17\u0E23\u0E01\u0E44\u0E1F\u0E25\u0E4C PDF \u0E08\u0E33\u0E19\u0E27\u0E19 " + insertedCount_1 + " \u0E2B\u0E19\u0E49\u0E32\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27",
                                    duration: 2000,
                                    color: 'success',
                                    position: 'bottom'
                                })];
                        case 15:
                            toast = _j.sent();
                            return [4 /*yield*/, toast.present()];
                        case 16:
                            _j.sent();
                            this.logHistory('page_insert', { where: 'pdf_file', insertedAt: shiftPage_2, count: insertedCount_1 }, shiftPage_2);
                            return [3 /*break*/, 21];
                        case 17:
                            err_4 = _j.sent();
                            console.error('insert PDF error:', err_4);
                            return [4 /*yield*/, this.toastCtrl.create({
                                    message: 'เกิดข้อผิดพลาดในการแทรกไฟล์ PDF',
                                    duration: 2000,
                                    color: 'danger',
                                    position: 'bottom'
                                })];
                        case 18:
                            toast = _j.sent();
                            return [4 /*yield*/, toast.present()];
                        case 19:
                            _j.sent();
                            return [3 /*break*/, 21];
                        case 20:
                            this.isLoading = false;
                            this.loadingMessage = '';
                            if (this.thumbFileInputRef) {
                                this.thumbFileInputRef.nativeElement.value = '';
                            }
                            this.cdr.detectChanges();
                            return [7 /*endfinally*/];
                        case 21: return [3 /*break*/, 25];
                        case 22: return [4 /*yield*/, this.toastCtrl.create({
                                message: 'รองรับเฉพาะไฟล์รูปภาพและเอกสาร PDF ในขณะนี้',
                                duration: 2500, color: 'warning', position: 'bottom'
                            })];
                        case 23:
                            toast = _j.sent();
                            return [4 /*yield*/, toast.present()];
                        case 24:
                            _j.sent();
                            _j.label = 25;
                        case 25: return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.movePageToIndex = function (pageNum, direction) {
            return __awaiter(this, void 0, void 0, function () {
                var prevPageNo;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            if (!(direction === 'up' && pageNum > 1)) return [3 /*break*/, 2];
                            prevPageNo = this.pageNo;
                            this.pageNo = pageNum;
                            return [4 /*yield*/, this.swapPages(pageNum - 1, pageNum)];
                        case 1:
                            _g.sent();
                            this.pageNo = pageNum - 1;
                            this.scrollToPage(this.pageNo);
                            return [3 /*break*/, 4];
                        case 2:
                            if (!(direction === 'down' && pageNum < this.pageCount)) return [3 /*break*/, 4];
                            this.pageNo = pageNum;
                            return [4 /*yield*/, this.swapPages(pageNum, pageNum + 1)];
                        case 3:
                            _g.sent();
                            this.pageNo = pageNum + 1;
                            this.scrollToPage(this.pageNo);
                            _g.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.deleteSpecificPage = function (pageNum) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            if (this.pageCount <= 1)
                                return [2 /*return*/];
                            this.pageNo = pageNum;
                            return [4 /*yield*/, this.deletePage()];
                        case 1:
                            _g.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.insertBlankPageFromThumb = function (where) {
            this.showThumbInsertMenu = false;
            this.insertBlankPage(where);
        };
        PdfAnnotatorModalComponent.prototype.deletePageFromThumb = function () {
            this.deletePage();
        };
        /* ================= Move Page Up/Down ================= */
        PdfAnnotatorModalComponent.prototype.movePageUp = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            if (this.pageNo <= 1 || !this.basePdfBytes)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.swapPages(this.pageNo - 1, this.pageNo)];
                        case 1:
                            _g.sent();
                            this.pageNo = this.pageNo - 1;
                            this.scrollToPage(this.pageNo);
                            return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.movePageDown = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            if (this.pageNo >= this.pageCount || !this.basePdfBytes)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.swapPages(this.pageNo, this.pageNo + 1)];
                        case 1:
                            _g.sent();
                            this.pageNo = this.pageNo + 1;
                            this.scrollToPage(this.pageNo);
                            return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.swapPages = function (pageA, pageB) {
            return __awaiter(this, void 0, void 0, function () {
                var pdfDoc, idxA, idxB, _g, copyOfB, _h, copyOfA, newBytes, swapAnnot, swapRecord, copy, loadingTask, _j, tmpDoc, _7, err_5, toast;
                var _this = this;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            if (!this.basePdfBytes)
                                return [2 /*return*/];
                            this.savePageSnapshot();
                            this.isLoading = true;
                            this.loadingMessage = 'กำลังย้ายหน้า...';
                            this.cdr.detectChanges();
                            _k.label = 1;
                        case 1:
                            _k.trys.push([1, 13, 16, 17]);
                            return [4 /*yield*/, pdfLib.PDFDocument.load(this.basePdfBytes)];
                        case 2:
                            pdfDoc = _k.sent();
                            idxA = pageA - 1;
                            idxB = pageB - 1;
                            return [4 /*yield*/, pdfDoc.copyPages(pdfDoc, [idxB])];
                        case 3:
                            _g = __read.apply(void 0, [_k.sent(), 1]), copyOfB = _g[0];
                            return [4 /*yield*/, pdfDoc.copyPages(pdfDoc, [idxA])];
                        case 4:
                            _h = __read.apply(void 0, [_k.sent(), 1]), copyOfA = _h[0];
                            // Insert B at position A, then A at position B+1 (now shifted by 1)
                            pdfDoc.insertPage(idxA, copyOfB);
                            pdfDoc.insertPage(idxB + 1, copyOfA);
                            // Remove the original A (now at idxA+1) and original B (now at idxB+2)
                            pdfDoc.removePage(idxA + 1);
                            pdfDoc.removePage(idxB + 1);
                            return [4 /*yield*/, pdfDoc.save()];
                        case 5:
                            newBytes = _k.sent();
                            this.basePdfBytes = newBytes.buffer;
                            swapAnnot = function (arr) { return arr.map(function (a) {
                                if (a.page === pageA)
                                    return Object.assign(Object.assign({}, a), { page: pageB });
                                if (a.page === pageB)
                                    return Object.assign(Object.assign({}, a), { page: pageA });
                                return a;
                            }); };
                            this.textBoxes = swapAnnot(this.textBoxes);
                            this.imageStamps = swapAnnot(this.imageStamps);
                            this.shapeStamps = swapAnnot(this.shapeStamps);
                            this.signatureStamps = swapAnnot(this.signatureStamps);
                            this.dateStamps = swapAnnot(this.dateStamps);
                            swapRecord = function (rec) {
                                var e_6, _g;
                                var next = {};
                                try {
                                    for (var _h = __values(Object.keys(rec)), _j = _h.next(); !_j.done; _j = _h.next()) {
                                        var k = _j.value;
                                        var p = Number(k);
                                        if (p === pageA)
                                            next[pageB] = rec[p];
                                        else if (p === pageB)
                                            next[pageA] = rec[p];
                                        else
                                            next[p] = rec[p];
                                    }
                                }
                                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                                finally {
                                    try {
                                        if (_j && !_j.done && (_g = _h.return)) _g.call(_h);
                                    }
                                    finally { if (e_6) throw e_6.error; }
                                }
                                return next;
                            };
                            this.strokes = swapRecord(this.strokes);
                            this.shapes = swapRecord(this.shapes);
                            this.redoStack = swapRecord(this.redoStack);
                            copy = this.basePdfBytes.slice(0);
                            if (this.pdfDocProxy) {
                                this.pdfDocProxy.destroy();
                                this.pdfDocProxy = null;
                            }
                            loadingTask = pdfjsLib__namespace.getDocument({ data: copy });
                            _j = this;
                            return [4 /*yield*/, loadingTask.promise];
                        case 6:
                            _j.pdfDocProxy = _k.sent();
                            this.pageCount = this.pdfDocProxy.numPages;
                            this.loadedUntilPage = Math.min(this.loadedUntilPage, this.pageCount);
                            this.pages = Array.from({ length: this.loadedUntilPage }, function (_, i) { return i + 1; });
                            this.pages.forEach(function (p) { return _this.ensurePage(p); });
                            this.pdfPageAspects.clear();
                            this.pdfPageRotations.clear();
                            _k.label = 7;
                        case 7:
                            _k.trys.push([7, 9, , 10]);
                            return [4 /*yield*/, pdfLib.PDFDocument.load(copy)];
                        case 8:
                            tmpDoc = _k.sent();
                            tmpDoc.getPages().forEach(function (pg, idx) {
                                var _g = pg.getSize(), width = _g.width, height = _g.height;
                                _this.pdfPageAspects.set(idx + 1, width / height);
                                _this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
                            });
                            return [3 /*break*/, 10];
                        case 9:
                            _7 = _k.sent();
                            return [3 /*break*/, 10];
                        case 10:
                            this.renderedPages.clear();
                            this.renderingPages.clear();
                            return [4 /*yield*/, this.generateThumbnails()];
                        case 11:
                            _k.sent();
                            return [4 /*yield*/, this.renderAllPages()];
                        case 12:
                            _k.sent();
                            return [3 /*break*/, 17];
                        case 13:
                            err_5 = _k.sent();
                            console.error('swapPages error:', err_5);
                            return [4 /*yield*/, this.toastCtrl.create({
                                    message: 'เกิดข้อผิดพลาดในการย้ายหน้า',
                                    duration: 2000, color: 'danger', position: 'bottom'
                                })];
                        case 14:
                            toast = _k.sent();
                            return [4 /*yield*/, toast.present()];
                        case 15:
                            _k.sent();
                            return [3 /*break*/, 17];
                        case 16:
                            this.isLoading = false;
                            this.loadingMessage = '';
                            this.cdr.detectChanges();
                            return [7 /*endfinally*/];
                        case 17: return [2 /*return*/];
                    }
                });
            });
        };
        /* ================= Page helpers ================= */
        PdfAnnotatorModalComponent.prototype.ensurePage = function (p) {
            if (p === void 0) { p = this.pageNo; }
            if (!this.strokes[p])
                this.strokes[p] = [];
            if (!this.shapes[p])
                this.shapes[p] = [];
            if (!this.redoStack[p])
                this.redoStack[p] = [];
        };
        PdfAnnotatorModalComponent.prototype.getPdfCanvas = function (p) {
            return document.getElementById('pdfCanvas-' + p);
        };
        PdfAnnotatorModalComponent.prototype.getAnnotCanvas = function (p) {
            return document.getElementById('annotCanvas-' + p);
        };
        PdfAnnotatorModalComponent.prototype.onViewerScroll = function (event) {
            if (this.isScrollNavigating)
                return;
            var container = event.target;
            var scrollTop = container.scrollTop;
            var containerHeight = container.clientHeight;
            // Find which page is most visible
            for (var i = 1; i <= this.loadedUntilPage; i++) {
                var pageEl = document.getElementById('page-' + i);
                if (!pageEl)
                    continue;
                var pageTop = pageEl.offsetTop - container.offsetTop;
                var pageBottom = pageTop + pageEl.offsetHeight;
                var visibleTop = Math.max(scrollTop, pageTop);
                var visibleBottom = Math.min(scrollTop + containerHeight, pageBottom);
                var visibleHeight = visibleBottom - visibleTop;
                if (visibleHeight > containerHeight * 0.5) {
                    if (this.pageNo !== i) {
                        this.pageNo = i;
                        this.scrollThumbnailIntoView(i);
                        this.cdr.detectChanges();
                        this.fitWidth();
                    }
                    // Load next chunk when approaching the last loaded page
                    if (i >= this.loadedUntilPage - 5)
                        this.loadNextChunk();
                    break;
                }
            }
        };
        PdfAnnotatorModalComponent.prototype.prevPage = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            if (this.pageNo <= 1)
                                return [2 /*return*/];
                            this.pageNo -= 1;
                            this.scrollToPage(this.pageNo);
                            return [4 /*yield*/, this.fitWidth()];
                        case 1:
                            _g.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.zoomIn = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            this.zoom = Math.min(3, this.zoom + 0.1);
                            this.renderedPages.clear();
                            return [4 /*yield*/, this.renderAllPages()];
                        case 1:
                            _g.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.nextPage = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            if (this.pageNo >= this.pageCount)
                                return [2 /*return*/];
                            if (!(this.pageNo >= this.loadedUntilPage)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.loadNextChunk()];
                        case 1:
                            _g.sent();
                            _g.label = 2;
                        case 2:
                            this.pageNo += 1;
                            this.scrollToPage(this.pageNo);
                            return [4 /*yield*/, this.fitWidth()];
                        case 3:
                            _g.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.firstPage = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            if (this.pageNo === 1)
                                return [2 /*return*/];
                            this.pageNo = 1;
                            this.scrollToPage(this.pageNo);
                            return [4 /*yield*/, this.fitWidth()];
                        case 1:
                            _g.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.lastPage = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            if (this.pageNo === this.pageCount)
                                return [2 /*return*/];
                            // Jump to last loaded page; pre-load next chunk in background
                            this.pageNo = this.loadedUntilPage;
                            this.scrollToPage(this.pageNo);
                            return [4 /*yield*/, this.fitWidth()];
                        case 1:
                            _g.sent();
                            if (this.loadedUntilPage < this.pageCount)
                                this.loadNextChunk();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.zoomOut = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            this.zoom = Math.max(0.5, this.zoom - 0.1);
                            this.renderedPages.clear();
                            return [4 /*yield*/, this.renderAllPages()];
                        case 1:
                            _g.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.scrollToPage = function (pageNum) {
            var _this = this;
            this.isScrollNavigating = true;
            var pageEl = document.getElementById('page-' + pageNum);
            if (pageEl) {
                pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            // Also scroll thumbnail into view
            this.scrollThumbnailIntoView(pageNum);
            // Longer timeout for long documents - smooth scroll can take time
            setTimeout(function () {
                _this.isScrollNavigating = false;
            }, 1500);
        };
        PdfAnnotatorModalComponent.prototype.scrollThumbnailIntoView = function (pageNum) {
            var thumbEl = document.getElementById('thumb-' + pageNum);
            if (thumbEl) {
                thumbEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };
        PdfAnnotatorModalComponent.prototype.debouncedRenderVisible = function () {
            var _this = this;
            if (this.renderDebounceTimer) {
                clearTimeout(this.renderDebounceTimer);
            }
            this.renderDebounceTimer = setTimeout(function () {
                _this.renderAllPages();
            }, 200);
        };
        PdfAnnotatorModalComponent.prototype.renderAllPages = function () {
            return __awaiter(this, void 0, void 0, function () {
                var p;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            // Prevent concurrent render calls
                            if (this.isRenderingAll)
                                return [2 /*return*/];
                            this.isRenderingAll = true;
                            _g.label = 1;
                        case 1:
                            _g.trys.push([1, , 6, 7]);
                            p = 1;
                            _g.label = 2;
                        case 2:
                            if (!(p <= this.pageCount)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.renderPage(p)];
                        case 3:
                            _g.sent();
                            _g.label = 4;
                        case 4:
                            p++;
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            this.isRenderingAll = false;
                            return [7 /*endfinally*/];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        /** Compute zoom so the WIDEST page in the document fits within the container.
         *  This prevents landscape pages from overflowing and being clipped by overflow-x. */
        PdfAnnotatorModalComponent.prototype.fitWidth = function () {
            return __awaiter(this, void 0, void 0, function () {
                var parent, containerW, targetW, sameContainer, samePage, maxVpWidth, p, pg, vp, _8;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            if (!this.viewerContainerRef)
                                return [2 /*return*/];
                            parent = this.viewerContainerRef.nativeElement;
                            if (!(!parent || parent.clientWidth === 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 50); })];
                        case 1:
                            _g.sent();
                            return [2 /*return*/, this.fitWidth()];
                        case 2:
                            containerW = parent.clientWidth;
                            targetW = containerW - 40;
                            sameContainer = Math.abs(containerW - this.lastParentWidth) < 2;
                            samePage = this.pageNo === this.lastFitPageNo;
                            if (sameContainer && samePage)
                                return [2 /*return*/];
                            this.lastParentWidth = containerW;
                            this.lastFitPageNo = this.pageNo;
                            if (!(this.pages.length > 0)) return [3 /*break*/, 4];
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                        case 3:
                            _g.sent();
                            _g.label = 4;
                        case 4:
                            maxVpWidth = 0;
                            p = 1;
                            _g.label = 5;
                        case 5:
                            if (!(p <= this.pageCount)) return [3 /*break*/, 10];
                            _g.label = 6;
                        case 6:
                            _g.trys.push([6, 8, , 9]);
                            return [4 /*yield*/, this.pdfDocProxy.getPage(p)];
                        case 7:
                            pg = _g.sent();
                            vp = pg.getViewport({ scale: 1 });
                            if (vp.width > maxVpWidth)
                                maxVpWidth = vp.width;
                            return [3 /*break*/, 9];
                        case 8:
                            _8 = _g.sent();
                            return [3 /*break*/, 9];
                        case 9:
                            p++;
                            return [3 /*break*/, 5];
                        case 10:
                            if (maxVpWidth <= 0)
                                return [2 /*return*/]; // safety guard
                            this.zoom = targetW / maxVpWidth;
                            this.renderedPages.clear();
                            return [4 /*yield*/, this.renderAllPages()];
                        case 11:
                            _g.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.renderPage = function (p) {
            if (p === void 0) { p = this.pageNo; }
            return __awaiter(this, void 0, void 0, function () {
                var page, viewport, pdfCanvas, pdfCtx, dpr, pageWrapper, textLayerDiv, textContent, textLayer, e_7, annotCanvas_1, err_6;
                var _this = this;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            if (!this.pdfDocProxy || this.renderingPages.has(p) || this.renderedPages.has(p))
                                return [2 /*return*/];
                            this.renderingPages.add(p);
                            _g.label = 1;
                        case 1:
                            _g.trys.push([1, 10, 11, 12]);
                            return [4 /*yield*/, this.pdfDocProxy.getPage(p)];
                        case 2:
                            page = _g.sent();
                            // Store the true effective rotation from pdf.js, as it correctly handles inherited rotations
                            // from the PDF page tree (which pdf-lib's getRotation() sometimes misses).
                            // We will use this in saveDocument to know exactly how the user saw the page.
                            this.pdfPageRotations.set(p, page.rotate || 0);
                            viewport = page.getViewport({ scale: this.zoom });
                            if (p === this.pageNo)
                                this.currentViewport = viewport;
                            pdfCanvas = this.getPdfCanvas(p);
                            if (!pdfCanvas)
                                return [2 /*return*/];
                            pdfCtx = pdfCanvas.getContext('2d');
                            dpr = Math.min(window.devicePixelRatio || 1, 2);
                            pdfCanvas.width = Math.floor(viewport.width * dpr);
                            pdfCanvas.height = Math.floor(viewport.height * dpr);
                            pdfCanvas.style.width = viewport.width + 'px';
                            pdfCanvas.style.height = viewport.height + 'px';
                            pdfCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
                            pdfCtx.clearRect(0, 0, viewport.width, viewport.height);
                            return [4 /*yield*/, page.render({ canvasContext: pdfCtx, viewport: viewport }).promise];
                        case 3:
                            _g.sent();
                            pageWrapper = pdfCanvas.parentElement;
                            if (!pageWrapper) return [3 /*break*/, 8];
                            textLayerDiv = pageWrapper.querySelector('.textLayer');
                            if (!textLayerDiv) {
                                textLayerDiv = document.createElement('div');
                                textLayerDiv.className = 'textLayer';
                                pageWrapper.insertBefore(textLayerDiv, pdfCanvas.nextSibling);
                            }
                            textLayerDiv.innerHTML = '';
                            textLayerDiv.style.width = viewport.width + 'px';
                            textLayerDiv.style.height = viewport.height + 'px';
                            textLayerDiv.style.left = '0';
                            textLayerDiv.style.top = '0';
                            // Ensure scale factor is cleanly applied
                            textLayerDiv.style.setProperty('--scale-factor', viewport.scale.toString());
                            _g.label = 4;
                        case 4:
                            _g.trys.push([4, 7, , 8]);
                            return [4 /*yield*/, page.getTextContent()];
                        case 5:
                            textContent = _g.sent();
                            textLayer = new pdfjsLib__namespace.TextLayer({
                                textContentSource: textContent,
                                container: textLayerDiv,
                                viewport: viewport
                            });
                            return [4 /*yield*/, textLayer.render()];
                        case 6:
                            _g.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            e_7 = _g.sent();
                            console.warn('Failed to render text layer:', e_7);
                            return [3 /*break*/, 8];
                        case 8: 
                        // Small delay to ensure PDF content (fonts, text) are fully rendered
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                        case 9:
                            // Small delay to ensure PDF content (fonts, text) are fully rendered
                            _g.sent();
                            this.resizeAnnotCanvasTo(p, viewport.width, viewport.height);
                            annotCanvas_1 = this.getAnnotCanvas(p);
                            if (annotCanvas_1) {
                                // Run events outside Angular to eliminate Change Detection lag on 120Hz/240Hz Apple Pencils
                                this.zone.runOutsideAngular(function () {
                                    if (annotCanvas_1._hasPointerEvents)
                                        return;
                                    annotCanvas_1._hasPointerEvents = true;
                                    annotCanvas_1.addEventListener('pointerdown', function (e) { return _this.onCanvasPointerDown(e, p); });
                                    annotCanvas_1.addEventListener('pointermove', function (e) { return _this.onCanvasPointerMove(e, p); });
                                    annotCanvas_1.addEventListener('pointerup', function (e) { return _this.onCanvasPointerUp(e, p); });
                                    annotCanvas_1.addEventListener('pointerleave', function (e) { return _this.onCanvasPointerUp(e, p); });
                                    annotCanvas_1.addEventListener('pointercancel', function (e) { return _this.onCanvasPointerUp(e, p); });
                                });
                            }
                            this.redraw(p);
                            this.clampTextBoxesToView();
                            this.renderedPages.add(p);
                            return [3 /*break*/, 12];
                        case 10:
                            err_6 = _g.sent();
                            console.error("Error rendering page " + p + ":", err_6);
                            return [3 /*break*/, 12];
                        case 11:
                            this.renderingPages.delete(p);
                            if (this.renderingPages.size === 0) {
                                this.isLoading = false;
                                this.loadingMessage = '';
                                this.cdr.detectChanges();
                            }
                            return [7 /*endfinally*/];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.resizeAnnotCanvasTo = function (p, cssW, cssH) {
            var canvas = this.getAnnotCanvas(p);
            if (!canvas)
                return;
            var ctx = canvas.getContext('2d');
            // Cap DPR at 2 to reduce memory usage
            var dpr = Math.min(window.devicePixelRatio || 1, 2);
            // Force clear canvas before resizing to remove any artifacts
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = Math.floor(cssW * dpr);
            canvas.height = Math.floor(cssH * dpr);
            canvas.style.width = cssW + 'px';
            canvas.style.height = cssH + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.imageSmoothingEnabled = false;
        };
        PdfAnnotatorModalComponent.prototype.setupResizeAutoRender = function () {
            var _this = this;
            if (!this.viewerContainerRef)
                return;
            this.resizeObserver = new ResizeObserver(function () {
                _this.fitWidth();
            });
            this.resizeObserver.observe(this.viewerContainerRef.nativeElement);
        };
        /* ================= Tool Mode Toggles ================= */
        PdfAnnotatorModalComponent.prototype.setToolMode = function (mode) {
            this.toolMode = this.toolMode === mode ? 'none' : mode;
            this.showShapeMenu = false;
            this.syncToolModeStyles();
        };
        PdfAnnotatorModalComponent.prototype.updateCursor = function () {
            var _this = this;
            this.pages.forEach(function (p) {
                var canvas = _this.getAnnotCanvas(p);
                if (canvas) {
                    switch (_this.toolMode) {
                        case 'draw':
                        case 'shape':
                        case 'eraser':
                        case 'date':
                        case 'mark':
                        case 'formfield':
                            canvas.style.cursor = 'crosshair';
                            break;
                        case 'highlight':
                            canvas.style.cursor = 'cell';
                            break;
                        case 'text':
                            canvas.style.cursor = 'text';
                            break;
                        case 'signature':
                            canvas.style.cursor = 'copy'; // Or custom cursor if available
                            break;
                        default:
                            canvas.style.cursor = 'default';
                    }
                }
            });
        };
        /* ================= Size Adjustments ================= */
        PdfAnnotatorModalComponent.prototype.changeBrushSize = function (delta) {
            this.brushSize = Math.max(1, Math.min(50, this.brushSize + delta));
            this.saveSettings();
            this.cdr.detectChanges();
        };
        PdfAnnotatorModalComponent.prototype.setBrushColor = function (color) {
            this.brushColor = color;
            this.saveSettings();
            this.cdr.detectChanges();
        };
        PdfAnnotatorModalComponent.prototype.changeHighlightSize = function (delta) {
            this.highlightSize = Math.max(5, Math.min(100, this.highlightSize + delta));
            this.saveSettings();
            this.cdr.detectChanges();
        };
        PdfAnnotatorModalComponent.prototype.setHighlightColor = function (color) {
            this.highlightColor = color;
            this.saveSettings();
            this.cdr.detectChanges();
        };
        PdfAnnotatorModalComponent.prototype.changeTextFontSize = function (delta) {
            var _this = this;
            this.textFontSize = Math.max(8, Math.min(100, this.textFontSize + delta));
            if (this.activeTextBoxId) {
                var tb = this.textBoxes.find(function (t) { return t.id === _this.activeTextBoxId; });
                if (tb) {
                    tb.fontSize = this.textFontSize;
                    this.cdr.detectChanges();
                }
            }
            this.saveSettings();
            this.cdr.detectChanges();
        };
        PdfAnnotatorModalComponent.prototype.toggleDraw = function () { this.setToolMode('draw'); };
        PdfAnnotatorModalComponent.prototype.toggleEraser = function () { this.setToolMode('eraser'); };
        PdfAnnotatorModalComponent.prototype.toggleHighlight = function () { this.setToolMode('highlight'); };
        PdfAnnotatorModalComponent.prototype.enableTextPlaceMode = function () { this.setToolMode('text'); };
        PdfAnnotatorModalComponent.prototype.toggleShapeMenu = function () {
            this.showShapeMenu = !this.showShapeMenu;
            if (this.showShapeMenu) {
                this.toolMode = 'shape';
            }
        };
        PdfAnnotatorModalComponent.prototype.toggleShapeDropdown = function () {
            this.showShapeDropdown = !this.showShapeDropdown;
        };
        PdfAnnotatorModalComponent.prototype.selectShape = function (type) {
            this.shapeType = type;
            this.toolMode = 'shape';
            this.showShapeMenu = false;
            this.showShapeDropdown = false;
            this.saveSettings();
            this.updateCursor();
        };
        PdfAnnotatorModalComponent.prototype.setShapeStrokeColor = function (color) {
            var _this = this;
            this.shapeStrokeColor = color;
            if (this.activeObjectId && this.activeObjectType === 'shape') {
                var s = this.shapeStamps.find(function (x) { return x.id === _this.activeObjectId; });
                if (s)
                    s.strokeColor = color;
            }
            this.saveSettings();
        };
        PdfAnnotatorModalComponent.prototype.setShapeFillColor = function (color) {
            var _this = this;
            this.shapeFillColor = color;
            if (this.activeObjectId && this.activeObjectType === 'shape') {
                var s = this.shapeStamps.find(function (x) { return x.id === _this.activeObjectId; });
                if (s)
                    s.fillColor = color;
            }
            this.saveSettings();
        };
        PdfAnnotatorModalComponent.prototype.toggleShapeFill = function () {
            var _this = this;
            this.shapeFillEnabled = !this.shapeFillEnabled;
            if (this.activeObjectId && this.activeObjectType === 'shape') {
                var s = this.shapeStamps.find(function (x) { return x.id === _this.activeObjectId; });
                if (s)
                    s.fillColor = this.shapeFillEnabled ? this.shapeFillColor : 'none';
            }
            this.saveSettings();
        };
        PdfAnnotatorModalComponent.prototype.toggleShapeNoStroke = function () {
            var _this = this;
            this.shapeNoStroke = !this.shapeNoStroke;
            if (this.activeObjectId && this.activeObjectType === 'shape') {
                var s = this.shapeStamps.find(function (x) { return x.id === _this.activeObjectId; });
                if (s)
                    s.strokeColor = this.shapeNoStroke ? 'none' : this.shapeStrokeColor;
            }
            this.saveSettings();
        };
        PdfAnnotatorModalComponent.prototype.changeShapeStrokeSize = function (delta) {
            var _this = this;
            var s = this.shapeStrokeSize + delta;
            if (s >= 1 && s <= 20) {
                this.shapeStrokeSize = s;
                if (this.activeObjectId && this.activeObjectType === 'shape') {
                    var shape = this.shapeStamps.find(function (x) { return x.id === _this.activeObjectId; });
                    if (shape)
                        shape.strokeWidth = s;
                }
                this.saveSettings();
            }
        };
        /* ================= Annotation Canvas Events ================= */
        PdfAnnotatorModalComponent.prototype.getNormPos = function (e, p) {
            var _this = this;
            var rect = this.activeCanvasRect || (function () {
                var canvas = _this.getAnnotCanvas(p);
                return canvas ? canvas.getBoundingClientRect() : null;
            })();
            if (!rect)
                return { x: 0, y: 0, p: 0 };
            var nx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
            var ny = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
            var pressure = (typeof e.pressure === 'number' && e.pressure > 0) ? e.pressure : 0;
            return { x: nx, y: ny, p: pressure };
        };
        PdfAnnotatorModalComponent.prototype.finalizeActiveStroke = function () {
            if (!this.activeStroke && !this.activeShape)
                return;
            var needsDetection = false;
            if (this.activeStroke) {
                this.ensurePage();
                this.strokes[this.pageNo].push(this.activeStroke);
                this.activeStroke = null;
            }
            if (this.activeShape) {
                var sh = this.activeShape;
                this.activeShape = null;
                // Convert canvas shape → draggable ShapeStamp overlay
                var canvas = this.getAnnotCanvas(sh.page);
                if (canvas) {
                    var cw = canvas.clientWidth;
                    var ch = canvas.clientHeight;
                    var x1 = sh.startX * cw;
                    var y1 = sh.startY * ch;
                    var x2 = sh.endX * cw;
                    var y2 = sh.endY * ch;
                    var left = Math.min(x1, x2);
                    var top = Math.min(y1, y2);
                    var right = Math.max(x1, x2);
                    var bottom = Math.max(y1, y2);
                    // For line/arrow the bounding box can be tiny — ensure minimum 20px
                    var bw = Math.max(right - left, 20);
                    var bh = Math.max(bottom - top, 20);
                    var stamp = {
                        id: 'shs_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                        page: sh.page,
                        x: (left / cw) * 100,
                        y: (top / ch) * 100,
                        width: (bw / cw) * 100,
                        height: (bh / ch) * 100,
                        type: sh.type,
                        strokeColor: sh.color,
                        strokeWidth: sh.size,
                        viewWidth: cw,
                        fillColor: sh.fillColor,
                        // Fraction of the bbox where the original start/end points sit
                        startFracX: bw > 0 ? (x1 - left) / bw : 0,
                        startFracY: bh > 0 ? (y1 - top) / bh : 0,
                        endFracX: bw > 0 ? (x2 - left) / bw : 1,
                        endFracY: bh > 0 ? (y2 - top) / bh : 1,
                    };
                    this.shapeStamps.push(stamp);
                }
                // Single-draw: exit shape mode after drawing one shape
                this.toolMode = 'none';
                this.updateCursor();
                this.syncToolModeStyles();
                needsDetection = true;
            }
            this.activePointerId = null;
            this.activeCanvasRect = null;
            this.redraw(this.pageNo);
            if (needsDetection) {
                this.cdr.detectChanges();
            }
        };
        PdfAnnotatorModalComponent.prototype.removeShapeStamp = function (id) {
            this.shapeStamps = this.shapeStamps.filter(function (s) { return s.id !== id; });
            this.cdr.detectChanges();
        };
        PdfAnnotatorModalComponent.prototype.startShapeDrag = function (e, ssid) {
            var _this = this;
            if (this.toolMode !== 'none')
                return;
            this.closeContextMenu();
            this.activeObjectId = ssid;
            this.activeObjectType = 'shape';
            var stamp = this.shapeStamps.find(function (s) { return s.id === ssid; });
            if (!stamp)
                return;
            // Sync UI settings with the selected shape
            this.shapeType = stamp.type;
            if (stamp.strokeColor === 'none' || stamp.strokeColor === 'rgba(0,0,0,0)' || stamp.strokeColor === 'transparent') {
                this.shapeNoStroke = true;
            }
            else {
                this.shapeNoStroke = false;
                this.shapeStrokeColor = stamp.strokeColor;
            }
            if (!stamp.fillColor || stamp.fillColor === 'none' || stamp.fillColor === 'rgba(0,0,0,0)' || stamp.fillColor === 'transparent') {
                this.shapeFillEnabled = false;
            }
            else {
                this.shapeFillEnabled = true;
                this.shapeFillColor = stamp.fillColor;
            }
            this.shapeStrokeSize = stamp.strokeWidth || this.shapeStrokeSize;
            this.isDraggingShape = true;
            this.dragShapeId = ssid;
            var canvasRect = this.getDragCanvasRect(stamp.page);
            var startXpx = (stamp.x / 100) * canvasRect.width;
            var startYpx = (stamp.y / 100) * canvasRect.height;
            this.dragOffsetX = e.clientX - canvasRect.left - startXpx;
            this.dragOffsetY = e.clientY - canvasRect.top - startYpx;
            var move = function (ev) {
                ev.preventDefault();
                if (!_this.isDraggingShape || !_this.dragShapeId)
                    return;
                var s = _this.shapeStamps.find(function (x) { return x.id === _this.dragShapeId; });
                if (!s)
                    return;
                s.x = ((ev.clientX - canvasRect.left - _this.dragOffsetX) / canvasRect.width) * 100;
                s.y = ((ev.clientY - canvasRect.top - _this.dragOffsetY) / canvasRect.height) * 100;
                _this.cdr.detectChanges();
            };
            var up = function () {
                _this.isDraggingShape = false;
                _this.dragShapeId = null;
                window.removeEventListener('pointermove', move);
                window.removeEventListener('pointerup', up);
            };
            window.addEventListener('pointermove', move);
            window.addEventListener('pointerup', up);
        };
        PdfAnnotatorModalComponent.prototype.startShapeResize = function (ev, shapeId, direction) {
            var _this = this;
            if (direction === void 0) { direction = 'se'; }
            if (ev.button === 2 || ev.ctrlKey)
                return;
            ev.stopPropagation();
            ev.preventDefault();
            var stamp = this.shapeStamps.find(function (s) { return s.id === shapeId; });
            if (!stamp)
                return;
            // Sync UI settings with the selected shape
            this.activeObjectId = shapeId;
            this.activeObjectType = 'shape';
            this.shapeType = stamp.type;
            if (stamp.strokeColor === 'none' || stamp.strokeColor === 'rgba(0,0,0,0)' || stamp.strokeColor === 'transparent') {
                this.shapeNoStroke = true;
            }
            else {
                this.shapeNoStroke = false;
                this.shapeStrokeColor = stamp.strokeColor;
            }
            if (!stamp.fillColor || stamp.fillColor === 'none' || stamp.fillColor === 'rgba(0,0,0,0)' || stamp.fillColor === 'transparent') {
                this.shapeFillEnabled = false;
            }
            else {
                this.shapeFillEnabled = true;
                this.shapeFillColor = stamp.fillColor;
            }
            this.shapeStrokeSize = stamp.strokeWidth || this.shapeStrokeSize;
            this.isResizingShape = true;
            this.resizeShapeId = shapeId;
            var canvasRect = this.getDragCanvasRect(stamp.page);
            var startX = ev.clientX;
            var startY = ev.clientY;
            var startW = stamp.width;
            var startH = stamp.height;
            var startSX = stamp.x;
            var startSY = stamp.y;
            var move = function (e) {
                e.preventDefault();
                if (!_this.isResizingShape || !_this.resizeShapeId)
                    return;
                var s = _this.shapeStamps.find(function (x) { return x.id === _this.resizeShapeId; });
                if (!s)
                    return;
                var dx = ((e.clientX - startX) / canvasRect.width) * 100;
                var dy = ((e.clientY - startY) / canvasRect.height) * 100;
                var nw = startW, nh = startH, nx = startSX, ny = startSY;
                if (direction.includes('e'))
                    nw = Math.max(2, startW + dx);
                if (direction.includes('w')) {
                    nw = Math.max(2, startW - dx);
                    nx = startSX + (startW - nw);
                }
                if (direction.includes('s'))
                    nh = Math.max(2, startH + dy);
                if (direction.includes('n')) {
                    nh = Math.max(2, startH - dy);
                    ny = startSY + (startH - nh);
                }
                s.width = nw;
                s.height = nh;
                s.x = nx;
                s.y = ny;
                _this.cdr.detectChanges();
            };
            var up = function () {
                _this.isResizingShape = false;
                _this.resizeShapeId = null;
                window.removeEventListener('pointermove', move);
                window.removeEventListener('pointerup', up);
            };
            window.addEventListener('pointermove', move);
            window.addEventListener('pointerup', up);
        };
        /** Returns arrow rotation angle in degrees — used in SVG template to avoid Math in template */
        PdfAnnotatorModalComponent.prototype.getArrowAngleDeg = function (ss) {
            return (180 / Math.PI) * Math.atan2(ss.endFracY - ss.startFracY, ss.endFracX - ss.startFracX);
        };
        PdfAnnotatorModalComponent.prototype.onCanvasPointerDown = function (e, p) {
            var _this = this;
            // Prevent default touch behavior (scroll, zoom) when any tool is active
            if (this.toolMode !== 'none') {
                e.preventDefault();
            }
            // Finalize previous stroke if it exists
            if (this.activeStroke || this.activeShape) {
                this.finalizeActiveStroke();
            }
            // iPad Palm Rejection / Multi-touch handling
            if (this.activePointerId !== null) {
                if (e.pointerType === 'pen') {
                    // ALWAYS trust a new pen touch. If pointerup was delayed, cut it off and start fresh.
                    this.activeStroke = null;
                    this.activeShape = null;
                }
                else if (this.activePointerType === 'pen') {
                    return; // Strongly ignore touch if pen is currently active
                }
                else {
                    // Trust the newest touch if no pen is involved
                    this.activeStroke = null;
                    this.activeShape = null;
                }
            }
            // Deselect any active element when clicking on the empty canvas
            this.zone.run(function () {
                if (_this.activeTextBoxId !== null || _this.activeObjectId !== null) {
                    _this.activeTextBoxId = null;
                    _this.activeObjectId = null;
                    _this.activeObjectType = null;
                    _this.cdr.detectChanges();
                }
            });
            var canvas = this.getAnnotCanvas(p);
            if (!canvas)
                return;
            this.activeCanvasRect = canvas.getBoundingClientRect();
            this.ensurePage(p);
            this.pageNo = p; // Mark this page as current for mode consistency
            switch (this.toolMode) {
                case 'draw':
                case 'highlight':
                case 'shape':
                    canvas.setPointerCapture(e.pointerId);
                    this.activePointerId = e.pointerId;
                    this.activePointerType = e.pointerType;
                    if (this.toolMode === 'draw' || this.toolMode === 'highlight') {
                        var isHighlight = this.toolMode === 'highlight';
                        this.activeStroke = {
                            id: 's_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                            color: isHighlight ? this.highlightColor : this.brushColor,
                            size: isHighlight ? this.highlightSize : this.brushSize,
                            points: [this.getNormPos(e, p)],
                            isHighlight: isHighlight
                        };
                    }
                    else if (this.toolMode === 'shape') {
                        var pos = this.getNormPos(e, p);
                        this.activeShape = {
                            id: 'sh_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                            page: p,
                            type: this.shapeType,
                            startX: pos.x,
                            startY: pos.y,
                            endX: pos.x,
                            endY: pos.y,
                            color: this.shapeNoStroke ? 'rgba(0,0,0,0)' : this.shapeStrokeColor,
                            size: this.shapeNoStroke ? 0 : this.shapeStrokeSize,
                            fillColor: this.shapeFillEnabled ? this.shapeFillColor : undefined
                        };
                    }
                    this.redoStack[p] = [];
                    break;
                case 'eraser':
                    this.eraseAtPoint(e, p);
                    break;
                case 'date': {
                    var rect = canvas.getBoundingClientRect();
                    var mouseX = e.clientX - rect.left;
                    var mouseY = e.clientY - rect.top;
                    var now = new Date();
                    var day = String(now.getDate()).padStart(2, '0');
                    var month = String(now.getMonth() + 1).padStart(2, '0');
                    var year = now.getFullYear();
                    var thaiYear = year + 543;
                    var dateText = day + "/" + month + "/" + thaiYear;
                    // Normalize mouse x/y to 0..100
                    var xNormalized = (mouseX / rect.width) * 100;
                    var yNormalized = (mouseY / rect.height) * 100;
                    this.dateStamps.push({
                        id: 'date_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                        page: p,
                        x: xNormalized - 5,
                        y: yNormalized - 1,
                        text: dateText,
                        color: this.dateColor,
                        fontSize: this.dateFontSize
                    });
                    // Log to history
                    this.logHistory('date_stamp', { page: p, text: dateText }, p);
                    this.toolMode = 'none';
                    this.updateCursor();
                    break;
                }
                case 'mark': {
                    var rect = canvas.getBoundingClientRect();
                    var mouseX = e.clientX - rect.left;
                    var mouseY = e.clientY - rect.top;
                    var sizePx = this.markSize;
                    var dataUrl = this.generateMarkDataUrl(this.markType, this.markColor, sizePx * 2);
                    var xPct = ((mouseX - sizePx / 2) / rect.width) * 100;
                    var yPct = ((mouseY - sizePx / 2) / rect.height) * 100;
                    var wPct = (sizePx / rect.width) * 100;
                    var hPct = (sizePx / rect.height) * 100;
                    this.imageStamps.push({
                        id: 'mark_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                        page: p, x: xPct, y: yPct, width: wPct, height: hPct,
                        dataUrl: dataUrl,
                        markType: this.markType,
                        markColor: this.markColor,
                    });
                    this.logHistory('image', { type: 'mark', markType: this.markType }, p);
                    break;
                }
                case 'formfield': {
                    var rect = canvas.getBoundingClientRect();
                    var mouseX = e.clientX - rect.left;
                    var mouseY = e.clientY - rect.top;
                    var type = this.formFieldType;
                    var defaultW = type === 'text' ? 28 : 4.5;
                    var defaultH = type === 'text' ? 4 : 4.5;
                    var newId = 'ff_' + Date.now() + '_' + Math.random().toString(16).slice(2);
                    this.pdfFormFields.push({
                        id: newId,
                        page: p,
                        type: type,
                        x: Math.max(0, (mouseX / rect.width) * 100 - defaultW / 2),
                        y: Math.max(0, (mouseY / rect.height) * 100 - defaultH / 2),
                        width: defaultW,
                        height: defaultH,
                        fieldName: type + "_" + ++this.formFieldCounter,
                        radioGroupName: type === 'radio' ? 'radioGroup_1' : undefined,
                        fontSize: 12,
                        borderVisible: true,
                    });
                    this.activeFormFieldId = newId;
                    this.logHistory('image', { type: 'formfield', fieldType: type }, p);
                    break;
                }
                case 'signature':
                    if (this.pendingSignatureDataUrl) {
                        this.placeSignatureOnPage(e, p);
                    }
                    break;
                case 'text':
                    this.placeTextBoxOnPage(e, p);
                    break;
                default:
                    // Do nothing for 'none' or 'signature' (if no data URL)
                    break;
            }
            // Only run detectChanges for modes that modify the Angular template.
            // Canvas-only modes (draw/highlight/shape/eraser) don't need it.
            var canvasOnlyMode = this.toolMode === 'draw' || this.toolMode === 'highlight'
                || this.toolMode === 'shape' || this.toolMode === 'eraser'
                || this.toolMode === 'mark' || this.toolMode === 'formfield';
            if (!canvasOnlyMode) {
                this.cdr.detectChanges();
            }
        };
        PdfAnnotatorModalComponent.prototype.onCanvasPointerMove = function (e, p) {
            var e_8, _g;
            var _this = this;
            if (this.activePointerId !== null && e.pointerId !== this.activePointerId)
                return;
            // Prevent default touch handling during active drawing
            if (this.activeStroke || this.activeShape) {
                e.preventDefault();
            }
            if (this.activeStroke) {
                var events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
                if (!events || events.length === 0)
                    events = [e];
                var startIdx_1 = Math.max(0, this.activeStroke.points.length - 1);
                var canvasRect = this.activeCanvasRect;
                try {
                    for (var events_1 = __values(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
                        var ev = events_1_1.value;
                        var pt = this.getNormPos(ev, p);
                        if (this.activeStroke.points.length > 0 && canvasRect) {
                            var lastPt = this.activeStroke.points[this.activeStroke.points.length - 1];
                            // Skip physically tiny sub-pixel movements (less than 1.5px) to drastically reduce rendering overhead/lag
                            var dx = (pt.x - lastPt.x) * canvasRect.width;
                            var dy = (pt.y - lastPt.y) * canvasRect.height;
                            if (dx * dx + dy * dy < 2.25)
                                continue; // 1.5px squared
                            // Exponential Moving Average to smooth Apple Pencil hardware pressure & coordinate jitter
                            pt.x = (pt.x * 0.4) + (lastPt.x * 0.6);
                            pt.y = (pt.y * 0.4) + (lastPt.y * 0.6);
                            pt.p = (pt.p * 0.2) + (lastPt.p * 0.8);
                        }
                        this.activeStroke.points.push(pt);
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (events_1_1 && !events_1_1.done && (_g = events_1.return)) _g.call(events_1);
                    }
                    finally { if (e_8) throw e_8.error; }
                }
                // Incremental render for zero-latency drawing
                if (!this.renderRequested) {
                    this.renderRequested = true;
                    var strokeToDraw_1 = this.activeStroke; // capture local reference
                    requestAnimationFrame(function () {
                        if (strokeToDraw_1) {
                            if (strokeToDraw_1.isHighlight) {
                                // Highlight strokes must be fully redrawn each frame (no incremental draw)
                                // to prevent the alpha opacity from multiplying on top of itself at overlapping line joints.
                                _this.redraw(p, true);
                            }
                            else {
                                _this.drawStrokeIncremental(p, strokeToDraw_1, startIdx_1);
                            }
                        }
                        _this.renderRequested = false;
                    });
                }
            }
            else if (this.activeShape) {
                var pos = this.getNormPos(e, p);
                this.activeShape.endX = pos.x;
                this.activeShape.endY = pos.y;
                if (!this.renderRequested) {
                    this.renderRequested = true;
                    requestAnimationFrame(function () {
                        _this.redraw(p, true);
                        _this.renderRequested = false;
                    });
                }
            }
            else if (this.toolMode === 'eraser' && e.buttons === 1) {
                this.eraseAtPoint(e, p);
            }
        };
        PdfAnnotatorModalComponent.prototype.onCanvasPointerUp = function (e, p) {
            if (this.activePointerId !== null && e.pointerId === this.activePointerId) {
                e.preventDefault();
                this.finalizeActiveStroke();
                var canvas = this.getAnnotCanvas(p);
                if (canvas && canvas.hasPointerCapture(e.pointerId)) {
                    canvas.releasePointerCapture(e.pointerId);
                }
                this.activePointerId = null;
                this.activePointerType = '';
            }
        };
        PdfAnnotatorModalComponent.prototype.placeSignatureOnPage = function (e, p) {
            var _this = this;
            var canvas = this.getAnnotCanvas(p);
            if (!canvas)
                return;
            var rect = canvas.getBoundingClientRect();
            var mouseX = e.clientX - rect.left;
            var mouseY = e.clientY - rect.top;
            var dataUrl = this.pendingSignatureDataUrl;
            // Load the image to get its real aspect ratio
            var img = new Image();
            img.onload = function () { return __awaiter(_this, void 0, void 0, function () {
                var sigWidthPercent, pdfAspect, canvasAspect, imgNaturalAspect, sigHeightPercent, x, y, now, thaiYear, dateStr, timeStr, digitalId, _g, stamp;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            sigWidthPercent = 15;
                            pdfAspect = this.pdfPageAspects.get(p);
                            canvasAspect = rect.width / rect.height;
                            imgNaturalAspect = img.width / img.height;
                            sigHeightPercent = pdfAspect
                                ? sigWidthPercent * (pdfAspect / imgNaturalAspect)
                                : sigWidthPercent * (img.height / img.width) * canvasAspect;
                            x = (mouseX / rect.width) * 100 - (sigWidthPercent / 2);
                            y = (mouseY / rect.height) * 100 - (sigHeightPercent / 2);
                            now = new Date();
                            thaiYear = now.getFullYear() + 543;
                            dateStr = now.getDate().toString().padStart(2, '0') + "/" + (now.getMonth() + 1).toString().padStart(2, '0') + "/" + thaiYear;
                            timeStr = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0') + ":" + now.getSeconds().toString().padStart(2, '0') + " +07'00'";
                            if (!this.userId) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.hashUserId(this.userId)];
                        case 1:
                            _g = _h.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _g = '';
                            _h.label = 3;
                        case 3:
                            digitalId = _g;
                            stamp = {
                                id: 'sig_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                                page: p,
                                x: x,
                                y: y,
                                width: sigWidthPercent,
                                height: sigHeightPercent,
                                dataUrl: dataUrl,
                                digitalId: digitalId,
                                signDate: dateStr,
                                signTime: timeStr
                            };
                            this.signatureStamps.push(stamp);
                            // Log to history
                            this.logHistory('sign', { page: p, x: stamp.x, y: stamp.y, digitalId: stamp.digitalId }, p);
                            this.pendingSignatureDataUrl = null;
                            this.toolMode = 'none';
                            this.updateCursor();
                            this.cdr.detectChanges();
                            return [2 /*return*/];
                    }
                });
            }); };
            img.src = dataUrl;
        };
        /** Generate SHA-256 based Digital ID from userId */
        PdfAnnotatorModalComponent.prototype.hashUserId = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var encoder, data, hashBuffer, hashArray, hashHex, e_9, hash, i, ch;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            _g.trys.push([0, 2, , 3]);
                            encoder = new TextEncoder();
                            data = encoder.encode(userId);
                            return [4 /*yield*/, crypto.subtle.digest('SHA-256', data)];
                        case 1:
                            hashBuffer = _g.sent();
                            hashArray = Array.from(new Uint8Array(hashBuffer));
                            hashHex = hashArray.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
                            // Take first 10 hex chars for a shorter but still unique ID
                            return [2 /*return*/, "DID-" + hashHex.substring(0, 10).toUpperCase()];
                        case 2:
                            e_9 = _g.sent();
                            hash = 0;
                            for (i = 0; i < userId.length; i++) {
                                ch = userId.charCodeAt(i);
                                hash = ((hash << 5) - hash) + ch;
                                hash = hash & hash;
                            }
                            return [2 /*return*/, "DID-" + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /** Log signature placement to database for reference/audit */
        PdfAnnotatorModalComponent.prototype.logSignatureToDatabase = function (digitalId, signDate, pageNumber) {
            if (!this.userId || !digitalId)
                return;
            var isoDate = signDate.toISOString().replace('T', ' ').substring(0, 19);
            this.http.post(this.signaturesApiUrl, {
                aksi: 'log_signature',
                digital_id: digitalId,
                user_id: this.userId,
                sign_date: isoDate,
                document_name: this.fileName || '',
                page_number: pageNumber,
                detail_id: this.detailId || '',
                edoc_id: this.edocId || ''
            }).subscribe(function (res) {
                if (res === null || res === void 0 ? void 0 : res.success) {
                    console.log('Signature logged:', digitalId);
                }
                else {
                    console.warn('Failed to log signature:', res === null || res === void 0 ? void 0 : res.msg);
                }
            }, function (err) { return console.error('Error logging signature:', err); });
        };
        PdfAnnotatorModalComponent.prototype.placeTextBoxOnPage = function (e, p) {
            var canvas = this.getAnnotCanvas(p);
            if (!canvas)
                return;
            var rect = canvas.getBoundingClientRect();
            var mouseX = e.clientX - rect.left;
            var mouseY = e.clientY - rect.top;
            // Normalize position to 0..100
            var x = (mouseX / rect.width) * 100;
            var y = (mouseY / rect.height) * 100;
            // Default size in percentages
            var widthPercent = 6;
            var heightPercent = 5; // Reduced from 10%
            this.textBoxes.push({
                id: 't_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                page: p,
                x: x,
                y: y,
                width: widthPercent,
                height: heightPercent,
                text: '',
                color: this.textColor,
                fontSize: this.textFontSize,
                bold: true,
                italic: false,
                align: 'left'
            });
            this.activeTextBoxId = this.textBoxes[this.textBoxes.length - 1].id;
            this.toolMode = 'none';
            this.syncToolModeStyles();
            this.updateCursor();
            this.cdr.detectChanges();
            // Log to history
            this.logHistory('text', { page: p, fontSize: this.textFontSize, color: this.textColor }, p);
            // Auto-focus the textarea to show keyboard immediately
            setTimeout(function () {
                var textBoxEl = document.querySelector('.text-box.active textarea');
                if (textBoxEl) {
                    textBoxEl.focus();
                }
            }, 100);
        };
        /* ================= Eraser ================= */
        PdfAnnotatorModalComponent.prototype.changeEraserSize = function (delta) {
            var newSize = this.eraserSize + delta;
            if (newSize >= 5 && newSize <= 200) {
                this.eraserSize = newSize;
                this.saveSettings();
            }
        };
        PdfAnnotatorModalComponent.prototype.eraseAtPoint = function (e, p) {
            var pos = this.getNormPos(e, p);
            // Scale threshold based on eraser size. 
            // Default size 20 matches ~0.02 threshold roughly
            var threshold = (this.eraserSize / 1000);
            // Check strokes
            this.strokes[p] = this.strokes[p].filter(function (stroke) {
                return !stroke.points.some(function (pt) { return Math.abs(pt.x - pos.x) < threshold && Math.abs(pt.y - pos.y) < threshold; });
            });
            // Check shapes
            this.shapes[p] = this.shapes[p].filter(function (shape) {
                var centerX = (shape.startX + shape.endX) / 2;
                var centerY = (shape.startY + shape.endY) / 2;
                var halfW = Math.abs(shape.endX - shape.startX) / 2;
                var halfH = Math.abs(shape.endY - shape.startY) / 2;
                return !(pos.x >= centerX - halfW - threshold &&
                    pos.x <= centerX + halfW + threshold &&
                    pos.y >= centerY - halfH - threshold &&
                    pos.y <= centerY + halfH + threshold);
            });
            this.redraw(p);
        };
        /* ================= Drawing ================= */
        PdfAnnotatorModalComponent.prototype.calcLineWidth = function (base, pressure) {
            if (!pressure)
                return base;
            return Math.max(1, base * (0.6 + pressure * 1.8));
        };
        PdfAnnotatorModalComponent.prototype.redraw = function (p, includeActive) {
            var e_10, _g, e_11, _h;
            if (p === void 0) { p = this.pageNo; }
            if (includeActive === void 0) { includeActive = false; }
            var canvas = this.getAnnotCanvas(p);
            if (!canvas)
                return;
            var ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
            var dpr = window.devicePixelRatio || 1;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
            this.ensurePage(p);
            try {
                // Draw all static annotations for this specific page
                for (var _j = __values(this.strokes[p]), _k = _j.next(); !_k.done; _k = _j.next()) {
                    var s = _k.value;
                    this.drawStroke(ctx, p, s);
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (_k && !_k.done && (_g = _j.return)) _g.call(_j);
                }
                finally { if (e_10) throw e_10.error; }
            }
            try {
                for (var _l = __values(this.shapes[p]), _m = _l.next(); !_m.done; _m = _l.next()) {
                    var sh = _m.value;
                    this.drawShape(ctx, p, sh);
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (_m && !_m.done && (_h = _l.return)) _h.call(_l);
                }
                finally { if (e_11) throw e_11.error; }
            }
            // Draw active if this is the target page
            if (includeActive && p === this.pageNo) {
                if (this.activeStroke)
                    this.drawStroke(ctx, p, this.activeStroke);
                if (this.activeShape)
                    this.drawShape(ctx, p, this.activeShape);
            }
        };
        PdfAnnotatorModalComponent.prototype.drawStroke = function (ctx, p, s) {
            var canvas = this.getAnnotCanvas(p);
            if (!canvas)
                return;
            var dpr = window.devicePixelRatio || 1;
            var w = canvas.width / dpr;
            var h = canvas.height / dpr;
            if (s.points.length < 2)
                return;
            if (s.isHighlight) {
                ctx.save();
                ctx.globalAlpha = 0.4;
                // Highlighters multiply against the background to feel like real markers
                ctx.globalCompositeOperation = 'multiply';
                ctx.strokeStyle = s.color;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = s.size;
                // Draw as a single continuous path without multiple beginPath() calls
                // to ensure overlapping joints do not amplify the alpha transparency.
                ctx.beginPath();
                for (var i = 0; i < s.points.length; i++) {
                    var pt = s.points[i];
                    if (i === 0) {
                        ctx.moveTo(pt.x * w, pt.y * h);
                    }
                    else {
                        ctx.lineTo(pt.x * w, pt.y * h);
                    }
                }
                ctx.stroke();
                ctx.restore();
                return;
            }
            ctx.strokeStyle = s.color;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            // To support pressure-sensitive width AND butter-smooth curves,
            // we use segmented quadratic bezier curves passing through midpoints
            for (var i = 1; i < s.points.length; i++) {
                var prevPrev = i > 1 ? s.points[i - 2] : s.points[i - 1];
                var prev = s.points[i - 1];
                var curr = s.points[i];
                var startX = (prevPrev.x + prev.x) / 2 * w;
                var startY = (prevPrev.y + prev.y) / 2 * h;
                var endX = (prev.x + curr.x) / 2 * w;
                var endY = (prev.y + curr.y) / 2 * h;
                ctx.lineWidth = this.calcLineWidth(s.size, curr.p);
                ctx.beginPath();
                if (i === 1) {
                    ctx.moveTo(prev.x * w, prev.y * h);
                    ctx.lineTo(endX, endY);
                }
                else if (i === s.points.length - 1) {
                    ctx.moveTo(startX, startY);
                    ctx.quadraticCurveTo(prev.x * w, prev.y * h, curr.x * w, curr.y * h);
                }
                else {
                    ctx.moveTo(startX, startY);
                    ctx.quadraticCurveTo(prev.x * w, prev.y * h, endX, endY);
                }
                ctx.stroke();
            }
        };
        PdfAnnotatorModalComponent.prototype.drawStrokeIncremental = function (p, s, startIdx) {
            var canvas = this.getAnnotCanvas(p);
            if (!canvas)
                return;
            var ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
            var dpr = window.devicePixelRatio || 1;
            var w = canvas.width / dpr;
            var h = canvas.height / dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.strokeStyle = s.color;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            var renderStart = Math.max(1, startIdx);
            for (var i = renderStart; i < s.points.length; i++) {
                var prevPrev = i > 1 ? s.points[i - 2] : s.points[i - 1];
                var prev = s.points[i - 1];
                var curr = s.points[i];
                var startX = (prevPrev.x + prev.x) / 2 * w;
                var startY = (prevPrev.y + prev.y) / 2 * h;
                var endX = (prev.x + curr.x) / 2 * w;
                var endY = (prev.y + curr.y) / 2 * h;
                ctx.lineWidth = this.calcLineWidth(s.size, curr.p);
                ctx.beginPath();
                if (i === 1) {
                    ctx.moveTo(prev.x * w, prev.y * h);
                    ctx.lineTo(endX, endY);
                }
                else if (i === s.points.length - 1) {
                    ctx.moveTo(startX, startY);
                    ctx.quadraticCurveTo(prev.x * w, prev.y * h, curr.x * w, curr.y * h);
                }
                else {
                    ctx.moveTo(startX, startY);
                    ctx.quadraticCurveTo(prev.x * w, prev.y * h, endX, endY);
                }
                ctx.stroke();
            }
        };
        PdfAnnotatorModalComponent.prototype.drawShape = function (ctx, p, sh) {
            var canvas = this.getAnnotCanvas(p);
            if (!canvas)
                return;
            var dpr = window.devicePixelRatio || 1;
            var w = canvas.width / dpr;
            var h = canvas.height / dpr;
            var x1 = sh.startX * w;
            var y1 = sh.startY * h;
            var x2 = sh.endX * w;
            var y2 = sh.endY * h;
            ctx.strokeStyle = sh.color;
            ctx.lineWidth = sh.size;
            ctx.beginPath();
            switch (sh.type) {
                case 'rect':
                    ctx.rect(x1, y1, x2 - x1, y2 - y1);
                    if (sh.fillColor) {
                        ctx.fillStyle = sh.fillColor;
                        ctx.fill();
                    }
                    break;
                case 'circle': {
                    var cx = (x1 + x2) / 2;
                    var cy = (y1 + y2) / 2;
                    var rx = Math.abs(x2 - x1) / 2;
                    var ry = Math.abs(y2 - y1) / 2;
                    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                    if (sh.fillColor) {
                        ctx.fillStyle = sh.fillColor;
                        ctx.fill();
                    }
                    break;
                }
                case 'line':
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    break;
                case 'arrow': {
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                    var angle = Math.atan2(y2 - y1, x2 - x1);
                    var headLen = 15;
                    ctx.beginPath();
                    ctx.moveTo(x2, y2);
                    ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
                    ctx.moveTo(x2, y2);
                    ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
                    break;
                }
            }
            ctx.stroke();
        };
        /* ================= Undo/Redo per page ================= */
        PdfAnnotatorModalComponent.prototype.canUndo = function () {
            this.ensurePage(this.pageNo);
            return this.strokes[this.pageNo].length > 0 || this.shapes[this.pageNo].length > 0;
        };
        PdfAnnotatorModalComponent.prototype.canRedo = function () {
            this.ensurePage(this.pageNo);
            return this.redoStack[this.pageNo].length > 0;
        };
        PdfAnnotatorModalComponent.prototype.undo = function () {
            this.ensurePage(this.pageNo);
            var item = this.strokes[this.pageNo].pop();
            if (!item)
                item = this.shapes[this.pageNo].pop();
            if (!item)
                return;
            this.redoStack[this.pageNo].push(item);
            this.redraw(this.pageNo);
        };
        PdfAnnotatorModalComponent.prototype.redo = function () {
            this.ensurePage(this.pageNo);
            var item = this.redoStack[this.pageNo].pop();
            if (!item)
                return;
            if ('points' in item)
                this.strokes[this.pageNo].push(item);
            else
                this.shapes[this.pageNo].push(item);
            this.redraw(this.pageNo);
        };
        PdfAnnotatorModalComponent.prototype.clearAnnotations = function () {
            var _this = this;
            this.ensurePage(this.pageNo);
            this.strokes[this.pageNo] = [];
            this.shapes[this.pageNo] = [];
            this.redoStack[this.pageNo] = [];
            this.textBoxes = this.textBoxes.filter(function (t) { return t.page !== _this.pageNo; });
            this.imageStamps = this.imageStamps.filter(function (i) { return i.page !== _this.pageNo; });
            this.signatureStamps = this.signatureStamps.filter(function (s) { return s.page !== _this.pageNo; });
            this.dateStamps = this.dateStamps.filter(function (d) { return d.page !== _this.pageNo; });
            this.redraw(this.pageNo);
        };
        /* ================= TextBox Operations ================= */
        PdfAnnotatorModalComponent.prototype.selectTextBox = function (id, ev) {
            ev.stopPropagation();
            this.activeTextBoxId = id;
        };
        PdfAnnotatorModalComponent.prototype.onTextBoxPointerDown = function (ev, id) {
            ev.stopPropagation();
            this.activeTextBoxId = id;
            this.startDrag(ev, id);
        };
        PdfAnnotatorModalComponent.prototype.clearTextSelection = function () {
            this.activeTextBoxId = null;
        };
        PdfAnnotatorModalComponent.prototype.getDragCanvasRect = function (p) {
            var canvas = this.getAnnotCanvas(p);
            return canvas ? canvas.getBoundingClientRect() : new DOMRect();
        };
        PdfAnnotatorModalComponent.prototype.startDrag = function (e, textBoxId) {
            var _this = this;
            if (this.toolMode !== 'none')
                return;
            this.closeContextMenu();
            // Set both activeTextBoxId (for UI) and global active object (for Delete key)
            this.activeTextBoxId = textBoxId;
            this.activeObjectId = textBoxId;
            this.activeObjectType = 'text';
            var tb = this.textBoxes.find(function (t) { return t.id === textBoxId; });
            if (!tb)
                return;
            // Sync UI settings with the selected text box
            this.textColor = tb.color || this.textColor;
            this.textFontSize = tb.fontSize || this.textFontSize;
            // If user tapped directly on textarea to type, do not initiate dragging or blurring.
            var target = e.target;
            if (target.tagName.toLowerCase() === 'textarea') {
                return;
            }
            var textBoxEl = e.currentTarget;
            // Lock touch-action during drag to prevent iPad scroll
            textBoxEl.style.touchAction = 'none';
            // Disable textarea to prevent iPadOS Scribble during drag
            var textareaEl = textBoxEl === null || textBoxEl === void 0 ? void 0 : textBoxEl.querySelector('textarea');
            if (textareaEl) {
                textareaEl.blur();
                textareaEl.setAttribute('readonly', 'true');
                textareaEl.style.pointerEvents = 'none';
            }
            this.isDragging = true;
            this.dragTextBoxId = textBoxId;
            var canvasRect = this.getDragCanvasRect(tb.page);
            // Convert current % position to pixels for initial offset calculation
            var startXpx = (tb.x / 100) * canvasRect.width;
            var startYpx = (tb.y / 100) * canvasRect.height;
            this.dragOffsetX = e.clientX - canvasRect.left - startXpx;
            this.dragOffsetY = e.clientY - canvasRect.top - startYpx;
            var move = function (ev) {
                ev.preventDefault();
                if (!_this.isDragging || !_this.dragTextBoxId)
                    return;
                var t = _this.textBoxes.find(function (x) { return x.id === _this.dragTextBoxId; });
                if (!t)
                    return;
                var mouseXpx = ev.clientX - canvasRect.left - _this.dragOffsetX;
                var mouseYpx = ev.clientY - canvasRect.top - _this.dragOffsetY;
                // Back to normalized
                t.x = (mouseXpx / canvasRect.width) * 100;
                t.y = (mouseYpx / canvasRect.height) * 100;
                _this.cdr.detectChanges();
            };
            var up = function () {
                _this.isDragging = false;
                _this.dragTextBoxId = null;
                // Restore touch-action so iPad can scroll PDF again
                textBoxEl.style.touchAction = '';
                // Restore textarea after drag
                if (textareaEl) {
                    textareaEl.removeAttribute('readonly');
                    textareaEl.style.pointerEvents = '';
                }
                window.removeEventListener('pointermove', move);
                window.removeEventListener('pointerup', up);
            };
            window.addEventListener('pointermove', move);
            window.addEventListener('pointerup', up);
        };
        PdfAnnotatorModalComponent.prototype.startTextBoxDrag = function (ev, textBoxId) {
            ev.preventDefault();
            ev.stopPropagation();
            var tb = this.textBoxes.find(function (t) { return t.id === textBoxId; });
            if (!tb)
                return;
            this.activeTextBoxId = textBoxId;
            this.startDrag(ev, textBoxId);
        };
        PdfAnnotatorModalComponent.prototype.onTextBoxInput = function (event, tb) {
            var textarea = event.target;
            var lines = tb.text.split('\n');
            var maxLineWidthPx = 30;
            var measureSpan = document.createElement('span');
            measureSpan.style.cssText = "position: absolute; visibility: hidden; white-space: pre; font-family: 'THSarabunNew', sans-serif; font-size: " + tb.fontSize * this.zoom + "px; font-weight: " + (tb.bold ? 'bold' : 'normal') + "; font-style: " + (tb.italic ? 'italic' : 'normal') + ";";
            lines.forEach(function (line) {
                measureSpan.textContent = line || ' ';
                document.body.appendChild(measureSpan);
                var lineWidth = measureSpan.offsetWidth + 18; // 18px = border(2) + container padding(6) + textarea padding(6) + buffer(4)
                if (lineWidth > maxLineWidthPx)
                    maxLineWidthPx = lineWidth;
                document.body.removeChild(measureSpan);
            });
            var canvasRect = this.getDragCanvasRect(tb.page);
            if (canvasRect.width > 0 && canvasRect.height > 0) {
                // Apply width first so DOM reflects correct wrapping before height measurement
                tb.width = Math.min(95, (maxLineWidthPx / canvasRect.width) * 100);
                this.cdr.detectChanges();
                // Reset height to 0 so scrollHeight reflects actual content (including any soft-wrapping)
                textarea.style.height = '0px';
                var contentHeightPx = textarea.scrollHeight;
                textarea.style.height = contentHeightPx + 'px'; // prevent scroll flicker
                var minHeightPx = (tb.fontSize * 1.4 * this.zoom) + 6;
                var finalHeightPx = Math.max(contentHeightPx, minHeightPx);
                // +6px for container top+bottom padding (3px each side)
                tb.height = Math.min(95, ((finalHeightPx + 6) / canvasRect.height) * 100);
            }
            this.cdr.detectChanges();
            // Clear inline style — container is now updated, CSS `height: 100%` takes over
            textarea.style.height = '';
        };
        PdfAnnotatorModalComponent.prototype.onTextBoxFocus = function (id) {
            this.activeTextBoxId = id;
            this.activeObjectId = id;
            this.activeObjectType = 'text';
            var tb = this.textBoxes.find(function (t) { return t.id === id; });
            if (tb) {
                this.textColor = tb.color || this.textColor;
                this.textFontSize = tb.fontSize || this.textFontSize;
            }
        };
        /* ================= TextBox Resize ================= */
        PdfAnnotatorModalComponent.prototype.startResize = function (ev, textBoxId) {
            var _this = this;
            if (ev.button === 2 || ev.ctrlKey)
                return;
            ev.stopPropagation();
            ev.preventDefault();
            var tb = this.textBoxes.find(function (t) { return t.id === textBoxId; });
            if (!tb)
                return;
            // Sync UI settings
            this.activeTextBoxId = textBoxId;
            this.activeObjectId = textBoxId;
            this.activeObjectType = 'text';
            this.textColor = tb.color || this.textColor;
            this.textFontSize = tb.fontSize || this.textFontSize;
            this.isResizing = true;
            this.resizeTextBoxId = textBoxId;
            var canvasRect = this.getDragCanvasRect(tb.page);
            var startX = ev.clientX;
            var startY = ev.clientY;
            var startW_norm = tb.width;
            var startH_norm = tb.height;
            var move = function (e) {
                e.preventDefault();
                if (!_this.isResizing || !_this.resizeTextBoxId)
                    return;
                var t = _this.textBoxes.find(function (x) { return x.id === _this.resizeTextBoxId; });
                if (!t)
                    return;
                var deltaX_px = e.clientX - startX;
                var deltaY_px = e.clientY - startY;
                t.width = Math.max(5, startW_norm + (deltaX_px / canvasRect.width) * 100);
                t.height = Math.max(2, startH_norm + (deltaY_px / canvasRect.height) * 100);
                _this.cdr.detectChanges();
            };
            var up = function () {
                _this.isResizing = false;
                _this.resizeTextBoxId = null;
                window.removeEventListener('pointermove', move);
                window.removeEventListener('pointerup', up);
            };
            window.addEventListener('pointermove', move);
            window.addEventListener('pointerup', up);
        };
        PdfAnnotatorModalComponent.prototype.startResizeRight = function (ev, textBoxId) {
            var _this = this;
            if (ev.button === 2 || ev.ctrlKey)
                return;
            ev.stopPropagation();
            ev.preventDefault();
            var tb = this.textBoxes.find(function (t) { return t.id === textBoxId; });
            if (!tb)
                return;
            this.activeTextBoxId = textBoxId;
            this.activeObjectId = textBoxId;
            this.activeObjectType = 'text';
            var canvasRect = this.getDragCanvasRect(tb.page);
            var startX = ev.clientX;
            var startW = tb.width;
            var move = function (e) {
                e.preventDefault();
                var deltaX = (e.clientX - startX) / canvasRect.width * 100;
                tb.width = Math.max(5, Math.min(95 - tb.x, startW + deltaX));
                _this.cdr.detectChanges();
            };
            var up = function () { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
            window.addEventListener('pointermove', move);
            window.addEventListener('pointerup', up);
        };
        PdfAnnotatorModalComponent.prototype.startResizeLeft = function (ev, textBoxId) {
            var _this = this;
            if (ev.button === 2 || ev.ctrlKey)
                return;
            ev.stopPropagation();
            ev.preventDefault();
            var tb = this.textBoxes.find(function (t) { return t.id === textBoxId; });
            if (!tb)
                return;
            this.activeTextBoxId = textBoxId;
            this.activeObjectId = textBoxId;
            this.activeObjectType = 'text';
            var canvasRect = this.getDragCanvasRect(tb.page);
            var startX = ev.clientX;
            var startTbX = tb.x;
            var startTbW = tb.width;
            var move = function (e) {
                e.preventDefault();
                var deltaX = (e.clientX - startX) / canvasRect.width * 100;
                var newX = Math.max(0, startTbX + deltaX);
                var newW = Math.max(5, startTbW - deltaX);
                if (newX + newW <= 98) {
                    tb.x = newX;
                    tb.width = newW;
                }
                _this.cdr.detectChanges();
            };
            var up = function () { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
            window.addEventListener('pointermove', move);
            window.addEventListener('pointerup', up);
        };
        PdfAnnotatorModalComponent.prototype.removeTextBox = function (textBoxId) {
            this.textBoxes = this.textBoxes.filter(function (t) { return t.id !== textBoxId; });
            if (this.activeTextBoxId === textBoxId)
                this.activeTextBoxId = null;
            this.cdr.detectChanges();
        };
        PdfAnnotatorModalComponent.prototype.clampOneTextBox = function (tb) {
            // Both tb.x, tb.y, tb.width, tb.height are in 0-100 units
            tb.x = Math.max(0, Math.min(tb.x, 100 - tb.width));
            tb.y = Math.max(0, Math.min(tb.y, 100 - tb.height));
        };
        PdfAnnotatorModalComponent.prototype.clampTextBoxesToView = function () {
            var _this = this;
            this.textBoxes.forEach(function (tb) { return _this.clampOneTextBox(tb); });
        };
        /* ================= Image Stamp Operations ================= */
        PdfAnnotatorModalComponent.prototype.triggerImageUpload = function () {
            var _a, _b;
            (_b = (_a = this.fileInputRef) === null || _a === void 0 ? void 0 : _a.nativeElement) === null || _b === void 0 ? void 0 : _b.click();
        };
        PdfAnnotatorModalComponent.prototype.normalizeImageToPng = function (dataUrl) {
            return new Promise(function (resolve) {
                var img = new Image();
                img.onload = function () {
                    var canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL('image/png'));
                };
                img.onerror = function () { return resolve(dataUrl); }; // fallback: keep original
                img.src = dataUrl;
            });
        };
        PdfAnnotatorModalComponent.prototype.onImageSelected = function (event) {
            var _this = this;
            var input = event.target;
            if (!input.files || !input.files[0])
                return;
            var file = input.files[0];
            var reader = new FileReader();
            reader.onload = function (e) { return __awaiter(_this, void 0, void 0, function () {
                var _a, rawDataUrl, dataUrl, img;
                var _this = this;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            rawDataUrl = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                            return [4 /*yield*/, this.normalizeImageToPng(rawDataUrl)];
                        case 1:
                            dataUrl = _g.sent();
                            img = new Image();
                            img.onload = function () {
                                var w = img.naturalWidth;
                                var h = img.naturalHeight;
                                // Scale display size (px) to at most 30% of canvas width, min 5%
                                var canvasRect = _this.getDragCanvasRect(_this.pageNo);
                                var cw = canvasRect.width || 600;
                                var ch = canvasRect.height || 800;
                                var maxPx = Math.min(cw * 0.4, ch * 0.4);
                                if (w > maxPx || h > maxPx) {
                                    if (w > h) {
                                        h = (h / w) * maxPx;
                                        w = maxPx;
                                    }
                                    else {
                                        w = (w / h) * maxPx;
                                        h = maxPx;
                                    }
                                }
                                _this.imageStamps.push({
                                    id: 'img_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                                    page: _this.pageNo,
                                    x: ((cw / 2 - w / 2) / cw) * 100,
                                    y: ((ch / 2 - h / 2) / ch) * 100,
                                    width: (w / cw) * 100,
                                    height: (h / ch) * 100,
                                    dataUrl: dataUrl
                                });
                                _this.logHistory('image', { type: 'upload' }, _this.pageNo);
                                _this.cdr.detectChanges();
                            };
                            img.src = dataUrl;
                            return [2 /*return*/];
                    }
                });
            }); };
            reader.readAsDataURL(file);
            input.value = ''; // Reset for same file selection
        };
        PdfAnnotatorModalComponent.prototype.startImageDrag = function (e, imgId) {
            var _this = this;
            if (this.toolMode !== 'none')
                return;
            this.closeContextMenu();
            this.activeObjectId = imgId;
            this.activeObjectType = 'image';
            var img = this.imageStamps.find(function (i) { return i.id === imgId; });
            if (!img)
                return;
            this.isDraggingImage = true;
            this.dragImageId = imgId;
            var canvasRect = this.getDragCanvasRect(img.page);
            var startXpx = (img.x / 100) * canvasRect.width;
            var startYpx = (img.y / 100) * canvasRect.height;
            this.dragOffsetX = e.clientX - canvasRect.left - startXpx;
            this.dragOffsetY = e.clientY - canvasRect.top - startYpx;
            var move = function (ev) {
                ev.preventDefault();
                if (!_this.isDraggingImage || !_this.dragImageId)
                    return;
                var i = _this.imageStamps.find(function (x) { return x.id === _this.dragImageId; });
                if (!i)
                    return;
                var mouseXpx = ev.clientX - canvasRect.left - _this.dragOffsetX;
                var mouseYpx = ev.clientY - canvasRect.top - _this.dragOffsetY;
                i.x = (mouseXpx / canvasRect.width) * 100;
                i.y = (mouseYpx / canvasRect.height) * 100;
                _this.cdr.detectChanges();
            };
            var up = function () {
                _this.isDraggingImage = false;
                _this.dragImageId = null;
                window.removeEventListener('pointermove', move);
                window.removeEventListener('pointerup', up);
            };
            window.addEventListener('pointermove', move);
            window.addEventListener('pointerup', up);
        };
        PdfAnnotatorModalComponent.prototype.startImageResize = function (ev, imageId, direction) {
            var _this = this;
            if (direction === void 0) { direction = 'se'; }
            if (ev.button === 2 || ev.ctrlKey)
                return;
            ev.stopPropagation();
            ev.preventDefault();
            var img = this.imageStamps.find(function (i) { return i.id === imageId; });
            if (!img)
                return;
            this.isResizingImage = true;
            this.resizeImageId = imageId;
            var canvasRect = this.getDragCanvasRect(img.page);
            var startX = ev.clientX;
            var startY = ev.clientY;
            var startW_norm = img.width;
            var startH_norm = img.height;
            var startX_norm = img.x;
            var startY_norm = img.y;
            var aspectRatio = startW_norm / startH_norm;
            var move = function (e) {
                e.preventDefault();
                if (!_this.isResizingImage || !_this.resizeImageId)
                    return;
                var i = _this.imageStamps.find(function (x) { return x.id === _this.resizeImageId; });
                if (!i)
                    return;
                var deltaX_norm = ((e.clientX - startX) / canvasRect.width) * 100;
                var deltaY_norm = ((e.clientY - startY) / canvasRect.height) * 100;
                var isShift = e.shiftKey; // Maintain aspect ratio if shift is pressed
                var newW = startW_norm;
                var newH = startH_norm;
                var newX = startX_norm;
                var newY = startY_norm;
                if (direction.includes('e')) {
                    newW = Math.max(2, startW_norm + deltaX_norm);
                }
                if (direction.includes('w')) {
                    newW = Math.max(2, startW_norm - deltaX_norm);
                    newX = startX_norm + (startW_norm - newW);
                }
                if (direction.includes('s')) {
                    newH = Math.max(2, startH_norm + deltaY_norm);
                }
                if (direction.includes('n')) {
                    newH = Math.max(2, startH_norm - deltaY_norm);
                    newY = startY_norm + (startH_norm - newH);
                }
                // Maintain aspect ratio for corner handles or if Shift is held
                if (isShift || direction.length > 1) {
                    if (direction.includes('e') || direction.includes('w')) {
                        newH = newW / aspectRatio;
                        if (direction.includes('n')) {
                            newY = startY_norm + (startH_norm - newH);
                        }
                    }
                    else {
                        newW = newH * aspectRatio;
                        if (direction.includes('w')) {
                            newX = startX_norm + (startW_norm - newW);
                        }
                    }
                }
                i.width = newW;
                i.height = newH;
                i.x = newX;
                i.y = newY;
                _this.cdr.detectChanges();
            };
            var up = function () {
                _this.isResizingImage = false;
                _this.resizeImageId = null;
                window.removeEventListener('pointermove', move);
                window.removeEventListener('pointerup', up);
            };
            window.addEventListener('pointermove', move);
            window.addEventListener('pointerup', up);
        };
        PdfAnnotatorModalComponent.prototype.removeImage = function (imageId) {
            this.imageStamps = this.imageStamps.filter(function (i) { return i.id !== imageId; });
            this.cdr.detectChanges();
        };
        /* ================= Signature Pad ================= */
        PdfAnnotatorModalComponent.prototype.openSignaturePad = function () {
            var _this = this;
            this.showSignaturePad = true;
            this.signaturePoints = [];
            this.signatureStrokes = [];
            // Initialize canvas after modal is shown
            setTimeout(function () {
                _this.initSignatureCanvas();
            }, 100);
        };
        PdfAnnotatorModalComponent.prototype.closeSignaturePad = function () {
            this.showSignaturePad = false;
            this.signaturePoints = [];
            this.signatureStrokes = [];
        };
        PdfAnnotatorModalComponent.prototype.setSignaturePenColor = function (color) {
            this.signaturePenColor = color;
        };
        PdfAnnotatorModalComponent.prototype.changeSignaturePenSize = function (delta) {
            var newSize = this.signaturePenSize + delta;
            if (newSize >= 1 && newSize <= 10) {
                this.signaturePenSize = newSize;
            }
        };
        PdfAnnotatorModalComponent.prototype.initSignatureCanvas = function () {
            var _a;
            var canvas = (_a = this.signatureCanvasRef) === null || _a === void 0 ? void 0 : _a.nativeElement;
            if (!canvas)
                return;
            // Responsive canvas size based on container
            var container = canvas.parentElement;
            var containerWidth = container ? container.clientWidth - 4 : 400;
            var dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(containerWidth * dpr);
            canvas.height = Math.floor((containerWidth / 2) * dpr);
            canvas.style.width = containerWidth + 'px';
            canvas.style.height = (containerWidth / 2) + 'px';
            this.signatureCtx = canvas.getContext('2d');
            if (this.signatureCtx) {
                this.signatureCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
                this.signatureCtx.strokeStyle = this.signaturePenColor;
                this.signatureCtx.lineWidth = this.signaturePenSize;
                this.signatureCtx.lineCap = 'round';
                this.signatureCtx.lineJoin = 'round';
            }
            // Remove old listeners first (prevents duplicates)
            canvas.removeEventListener('pointerdown', this.boundOnSigStart);
            canvas.removeEventListener('pointermove', this.boundOnSigMove);
            canvas.removeEventListener('pointerup', this.boundOnSigEnd);
            canvas.removeEventListener('pointerleave', this.boundOnSigEnd);
            this.boundOnSigStart = this.onSignatureStart.bind(this);
            this.boundOnSigMove = this.onSignatureMove.bind(this);
            this.boundOnSigEnd = this.onSignatureEnd.bind(this);
            canvas.addEventListener('pointerdown', this.boundOnSigStart);
            canvas.addEventListener('pointermove', this.boundOnSigMove);
            canvas.addEventListener('pointerup', this.boundOnSigEnd);
            canvas.addEventListener('pointerleave', this.boundOnSigEnd);
        };
        PdfAnnotatorModalComponent.prototype.getSignaturePos = function (e) {
            var canvas = this.signatureCanvasRef.nativeElement;
            var rect = canvas.getBoundingClientRect();
            return {
                x: (e.clientX - rect.left),
                y: (e.clientY - rect.top)
            };
        };
        PdfAnnotatorModalComponent.prototype.onSignatureStart = function (e) {
            e.preventDefault();
            this.isDrawingSignature = true;
            var pos = this.getSignaturePos(e);
            this.signaturePoints = [pos];
        };
        PdfAnnotatorModalComponent.prototype.onSignatureMove = function (e) {
            if (!this.isDrawingSignature || !this.signatureCtx)
                return;
            e.preventDefault();
            var pos = this.getSignaturePos(e);
            this.signaturePoints.push(pos);
            // Redraw everything for smooth Bezier rendering
            this.redrawSignatureCanvas();
        };
        PdfAnnotatorModalComponent.prototype.onSignatureEnd = function (e) {
            if (!this.isDrawingSignature)
                return;
            this.isDrawingSignature = false;
            if (this.signaturePoints.length >= 2) {
                this.signatureStrokes.push({
                    points: __spreadArray([], __read(this.signaturePoints)),
                    color: this.signaturePenColor,
                    size: this.signaturePenSize
                });
            }
            this.signaturePoints = [];
        };
        PdfAnnotatorModalComponent.prototype.redrawSignatureCanvas = function () {
            var e_12, _g;
            var _a;
            var canvas = (_a = this.signatureCanvasRef) === null || _a === void 0 ? void 0 : _a.nativeElement;
            if (!canvas || !this.signatureCtx)
                return;
            var ctx = this.signatureCtx;
            var dpr = Math.min(window.devicePixelRatio || 1, 2);
            var w = canvas.width / dpr;
            var h = canvas.height / dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);
            // Draw guide line at ~70% height
            ctx.save();
            ctx.setLineDash([6, 4]);
            ctx.strokeStyle = '#d1d5db';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(20, h * 0.7);
            ctx.lineTo(w - 20, h * 0.7);
            ctx.stroke();
            ctx.restore();
            try {
                // Draw all saved strokes
                for (var _h = __values(this.signatureStrokes), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var stroke = _j.value;
                    this.drawBezierStroke(ctx, stroke.points, stroke.color, stroke.size);
                }
            }
            catch (e_12_1) { e_12 = { error: e_12_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_g = _h.return)) _g.call(_h);
                }
                finally { if (e_12) throw e_12.error; }
            }
            // Draw current active stroke
            if (this.signaturePoints.length >= 2) {
                this.drawBezierStroke(ctx, this.signaturePoints, this.signaturePenColor, this.signaturePenSize);
            }
        };
        PdfAnnotatorModalComponent.prototype.drawBezierStroke = function (ctx, points, color, size, scale) {
            if (scale === void 0) { scale = 1; }
            if (points.length < 2)
                return;
            ctx.strokeStyle = color;
            ctx.lineWidth = size * scale;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(points[0].x * scale, points[0].y * scale);
            if (points.length === 2) {
                ctx.lineTo(points[1].x * scale, points[1].y * scale);
            }
            else {
                // Quadratic Bezier smoothing through midpoints
                for (var i = 1; i < points.length - 1; i++) {
                    var midX = (points[i].x + points[i + 1].x) / 2 * scale;
                    var midY = (points[i].y + points[i + 1].y) / 2 * scale;
                    ctx.quadraticCurveTo(points[i].x * scale, points[i].y * scale, midX, midY);
                }
                // Connect to last point
                var last = points[points.length - 1];
                ctx.lineTo(last.x * scale, last.y * scale);
            }
            ctx.stroke();
        };
        PdfAnnotatorModalComponent.prototype.clearSignaturePad = function () {
            this.signaturePoints = [];
            this.signatureStrokes = [];
            this.redrawSignatureCanvas();
        };
        /** Render strokes at high resolution on an offscreen canvas and auto-crop */
        PdfAnnotatorModalComponent.prototype.trimSignatureCanvas = function () {
            var e_13, _g;
            var _a;
            var srcCanvas = (_a = this.signatureCanvasRef) === null || _a === void 0 ? void 0 : _a.nativeElement;
            if (!srcCanvas)
                return '';
            // Get the CSS size of the on-screen canvas
            var cssW = srcCanvas.clientWidth || 400;
            var cssH = srcCanvas.clientHeight || 200;
            // Render at 8x CSS size for crisp PDF output
            var exportScale = 8;
            var offW = Math.floor(cssW * exportScale);
            var offH = Math.floor(cssH * exportScale);
            var offCanvas = document.createElement('canvas');
            offCanvas.width = offW;
            offCanvas.height = offH;
            var ctx = offCanvas.getContext('2d');
            ctx.clearRect(0, 0, offW, offH);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            try {
                // Draw all strokes scaled up with their original color/size (no guide line)
                for (var _h = __values(this.signatureStrokes), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var stroke = _j.value;
                    if (stroke.points.length < 2)
                        continue;
                    this.drawBezierStroke(ctx, stroke.points, stroke.color, stroke.size, exportScale);
                }
            }
            catch (e_13_1) { e_13 = { error: e_13_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_g = _h.return)) _g.call(_h);
                }
                finally { if (e_13) throw e_13.error; }
            }
            // Include any active points
            if (this.signaturePoints.length >= 2) {
                this.drawBezierStroke(ctx, this.signaturePoints, this.signaturePenColor, this.signaturePenSize, exportScale);
            }
            // Auto-crop to content bounds
            var imgData = ctx.getImageData(0, 0, offW, offH);
            var data = imgData.data, width = imgData.width, height = imgData.height;
            var top = height, left = width, right = 0, bottom = 0;
            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    var alpha = data[(y * width + x) * 4 + 3];
                    if (alpha > 10) {
                        if (y < top)
                            top = y;
                        if (y > bottom)
                            bottom = y;
                        if (x < left)
                            left = x;
                        if (x > right)
                            right = x;
                    }
                }
            }
            // No content found
            if (top > bottom || left > right)
                return offCanvas.toDataURL('image/png');
            // Add padding
            var pad = Math.round(4 * exportScale);
            top = Math.max(0, top - pad);
            left = Math.max(0, left - pad);
            bottom = Math.min(height - 1, bottom + pad);
            right = Math.min(width - 1, right + pad);
            var trimW = right - left + 1;
            var trimH = bottom - top + 1;
            var trimCanvas = document.createElement('canvas');
            trimCanvas.width = trimW;
            trimCanvas.height = trimH;
            var trimCtx = trimCanvas.getContext('2d');
            trimCtx.drawImage(offCanvas, left, top, trimW, trimH, 0, 0, trimW, trimH);
            return trimCanvas.toDataURL('image/png');
        };
        PdfAnnotatorModalComponent.prototype.saveSignature = function () {
            var _a;
            var canvas = (_a = this.signatureCanvasRef) === null || _a === void 0 ? void 0 : _a.nativeElement;
            var totalPoints = this.signatureStrokes.reduce(function (sum, s) { return sum + s.points.length; }, 0);
            if (!canvas || totalPoints < 2) {
                this.closeSignaturePad();
                return;
            }
            var dataUrl = this.trimSignatureCanvas();
            this.placeSignatureOnCanvas(dataUrl);
            this.closeSignaturePad();
        };
        PdfAnnotatorModalComponent.prototype.startSignatureDrag = function (e, sigId) {
            var _this = this;
            if (this.toolMode !== 'none')
                return;
            this.closeContextMenu();
            this.activeObjectId = sigId;
            this.activeObjectType = 'signature';
            var sig = this.signatureStamps.find(function (s) { return s.id === sigId; });
            if (!sig)
                return;
            var canvasRect = this.getDragCanvasRect(sig.page);
            var startXpx = (sig.x / 100) * canvasRect.width;
            var startYpx = (sig.y / 100) * canvasRect.height;
            var offsetX = e.clientX - canvasRect.left - startXpx;
            var offsetY = e.clientY - canvasRect.top - startYpx;
            var move = function (ev) {
                ev.preventDefault();
                var s = _this.signatureStamps.find(function (x) { return x.id === sigId; });
                if (!s)
                    return;
                var mouseXpx = ev.clientX - canvasRect.left - offsetX;
                var mouseYpx = ev.clientY - canvasRect.top - offsetY;
                s.x = (mouseXpx / canvasRect.width) * 100;
                s.y = (mouseYpx / canvasRect.height) * 100;
                _this.cdr.detectChanges();
            };
            var up = function () {
                window.removeEventListener('pointermove', move);
                window.removeEventListener('pointerup', up);
            };
            window.addEventListener('pointermove', move);
            window.addEventListener('pointerup', up);
        };
        PdfAnnotatorModalComponent.prototype.startSignatureResize = function (ev, sigId, direction) {
            var _this = this;
            if (direction === void 0) { direction = 'se'; }
            if (ev.button === 2 || ev.ctrlKey)
                return;
            ev.stopPropagation();
            ev.preventDefault();
            var sig = this.signatureStamps.find(function (s) { return s.id === sigId; });
            if (!sig)
                return;
            var canvasRect = this.getDragCanvasRect(sig.page);
            var startX = ev.clientX;
            var startY = ev.clientY;
            var startW_norm = sig.width;
            var startH_norm = sig.height;
            var startX_norm = sig.x;
            var startY_norm = sig.y;
            var aspectRatio = startW_norm / startH_norm;
            var move = function (e) {
                e.preventDefault();
                var s = _this.signatureStamps.find(function (x) { return x.id === sigId; });
                if (!s)
                    return;
                var deltaX_norm = ((e.clientX - startX) / canvasRect.width) * 100;
                var deltaY_norm = ((e.clientY - startY) / canvasRect.height) * 100;
                var isShift = e.shiftKey;
                var newW = startW_norm;
                var newH = startH_norm;
                var newX = startX_norm;
                var newY = startY_norm;
                if (direction.includes('e')) {
                    newW = Math.max(2, startW_norm + deltaX_norm);
                }
                if (direction.includes('w')) {
                    newW = Math.max(2, startW_norm - deltaX_norm);
                    newX = startX_norm + (startW_norm - newW);
                }
                if (direction.includes('s')) {
                    newH = Math.max(2, startH_norm + deltaY_norm);
                }
                if (direction.includes('n')) {
                    newH = Math.max(2, startH_norm - deltaY_norm);
                    newY = startY_norm + (startH_norm - newH);
                }
                // Maintain aspect ratio for corners or if Shift is held
                if (isShift || direction.length > 1) {
                    if (direction.includes('e') || direction.includes('w')) {
                        newH = newW / aspectRatio;
                        if (direction.includes('n')) {
                            newY = startY_norm + (startH_norm - newH);
                        }
                    }
                    else {
                        newW = newH * aspectRatio;
                        if (direction.includes('w')) {
                            newX = startX_norm + (startW_norm - newW);
                        }
                    }
                }
                s.width = newW;
                s.height = newH;
                s.x = newX;
                s.y = newY;
                _this.cdr.detectChanges();
            };
            var up = function () {
                window.removeEventListener('pointermove', move);
                window.removeEventListener('pointerup', up);
            };
            window.addEventListener('pointermove', move);
            window.addEventListener('pointerup', up);
        };
        PdfAnnotatorModalComponent.prototype.removeSignature = function (sigId) {
            this.signatureStamps = this.signatureStamps.filter(function (s) { return s.id !== sigId; });
            this.cdr.detectChanges();
        };
        /* ================= Saved Signatures (Database) ================= */
        // Open signature picker modal
        PdfAnnotatorModalComponent.prototype.openSignaturePickerOrPad = function () {
            var _this = this;
            // If user has saved signatures, show picker
            if (this.savedSignatures.length > 0) {
                this.showSignaturePicker = true;
            }
            else {
                // Otherwise, load from API first
                this.loadSavedSignatures().then(function () {
                    if (_this.savedSignatures.length > 0) {
                        _this.showSignaturePicker = true;
                    }
                    else {
                        // No saved signatures, open draw pad
                        _this.openSignaturePad();
                    }
                });
            }
        };
        PdfAnnotatorModalComponent.prototype.closeSignaturePicker = function () {
            this.showSignaturePicker = false;
        };
        // Load saved signatures from API
        PdfAnnotatorModalComponent.prototype.loadSavedSignatures = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, err_7;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            if (!this.userId) {
                                console.warn('userId is not set, cannot load signatures');
                                return [2 /*return*/];
                            }
                            this.isLoadingSignatures = true;
                            _g.label = 1;
                        case 1:
                            _g.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, this.http.post(this.signaturesApiUrl, {
                                    aksi: 'get_signatures',
                                    user_id: this.userId
                                }).toPromise()];
                        case 2:
                            response = _g.sent();
                            if (response === null || response === void 0 ? void 0 : response.success) {
                                this.savedSignatures = response.signatures || [];
                            }
                            else {
                                console.error('Failed to load signatures:', response === null || response === void 0 ? void 0 : response.msg);
                            }
                            return [3 /*break*/, 5];
                        case 3:
                            err_7 = _g.sent();
                            console.error('Error loading signatures:', err_7);
                            return [3 /*break*/, 5];
                        case 4:
                            this.isLoadingSignatures = false;
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        // Save current signature to database
        PdfAnnotatorModalComponent.prototype.saveSignatureToDatabase = function (signatureName) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var canvas, totalPoints, dataUrl, response, err_8;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            canvas = (_a = this.signatureCanvasRef) === null || _a === void 0 ? void 0 : _a.nativeElement;
                            totalPoints = this.signatureStrokes.reduce(function (sum, s) { return sum + s.points.length; }, 0);
                            if (!canvas || totalPoints < 2) {
                                return [2 /*return*/];
                            }
                            if (!this.userId) {
                                console.warn('userId is not set, cannot save signature');
                                this.saveSignature(); // Just use locally
                                return [2 /*return*/];
                            }
                            dataUrl = this.trimSignatureCanvas();
                            this.isLoadingSignatures = true;
                            _g.label = 1;
                        case 1:
                            _g.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, this.http.post(this.signaturesApiUrl, {
                                    aksi: 'save_signature',
                                    user_id: this.userId,
                                    signature_name: signatureName || '',
                                    signature_data: dataUrl
                                }).toPromise()];
                        case 2:
                            response = _g.sent();
                            if (response === null || response === void 0 ? void 0 : response.success) {
                                // Add to local list
                                this.savedSignatures.push({
                                    id: response.id,
                                    user_id: this.userId,
                                    signature_name: response.signature_name,
                                    signature_data: dataUrl,
                                    is_default: this.savedSignatures.length === 0,
                                    created_at: new Date().toISOString(),
                                    updated_at: new Date().toISOString()
                                });
                                // Also place the signature on canvas
                                this.placeSignatureOnCanvas(dataUrl);
                            }
                            else {
                                console.error('Failed to save signature:', response === null || response === void 0 ? void 0 : response.msg);
                                // Fallback: just use locally
                                this.saveSignature();
                            }
                            return [3 /*break*/, 5];
                        case 3:
                            err_8 = _g.sent();
                            console.error('Error saving signature:', err_8);
                            this.saveSignature();
                            return [3 /*break*/, 5];
                        case 4:
                            this.isLoadingSignatures = false;
                            this.closeSignaturePad();
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        // Use a saved signature from the list
        PdfAnnotatorModalComponent.prototype.useSavedSignature = function (sig) {
            this.placeSignatureOnCanvas(sig.signature_data);
            this.closeSignaturePicker();
        };
        PdfAnnotatorModalComponent.prototype.presentToast = function (msg) {
            return __awaiter(this, void 0, void 0, function () {
                var toast;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4 /*yield*/, this.toastCtrl.create({
                                message: msg,
                                duration: 2000,
                                position: 'top'
                            })];
                        case 1:
                            toast = _g.sent();
                            toast.present();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // Place signature image on canvas (Starts placement mode)
        PdfAnnotatorModalComponent.prototype.placeSignatureOnCanvas = function (dataUrl) {
            this.pendingSignatureDataUrl = dataUrl;
            this.toolMode = 'signature';
            this.updateCursor();
            this.presentToast('คลิกที่ PDF เพื่อวางลายเซ็น');
        };
        // Delete saved signature from database
        PdfAnnotatorModalComponent.prototype.deleteSavedSignature = function (sig, event) {
            return __awaiter(this, void 0, void 0, function () {
                var response, err_9;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            if (event) {
                                event.stopPropagation();
                            }
                            if (!this.userId)
                                return [2 /*return*/];
                            this.isLoadingSignatures = true;
                            _g.label = 1;
                        case 1:
                            _g.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, this.http.post(this.signaturesApiUrl, {
                                    aksi: 'delete_signature',
                                    id: sig.id,
                                    user_id: this.userId
                                }).toPromise()];
                        case 2:
                            response = _g.sent();
                            if (response === null || response === void 0 ? void 0 : response.success) {
                                this.savedSignatures = this.savedSignatures.filter(function (s) { return s.id !== sig.id; });
                            }
                            else {
                                console.error('Failed to delete signature:', response === null || response === void 0 ? void 0 : response.msg);
                            }
                            return [3 /*break*/, 5];
                        case 3:
                            err_9 = _g.sent();
                            console.error('Error deleting signature:', err_9);
                            return [3 /*break*/, 5];
                        case 4:
                            this.isLoadingSignatures = false;
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        // Set signature as default
        PdfAnnotatorModalComponent.prototype.setDefaultSignature = function (sig, event) {
            return __awaiter(this, void 0, void 0, function () {
                var response, err_10;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            if (event) {
                                event.stopPropagation();
                            }
                            if (!this.userId)
                                return [2 /*return*/];
                            _g.label = 1;
                        case 1:
                            _g.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.http.post(this.signaturesApiUrl, {
                                    aksi: 'set_default',
                                    id: sig.id,
                                    user_id: this.userId
                                }).toPromise()];
                        case 2:
                            response = _g.sent();
                            if (response === null || response === void 0 ? void 0 : response.success) {
                                // Update local list
                                this.savedSignatures.forEach(function (s) {
                                    s.is_default = (s.id === sig.id);
                                });
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            err_10 = _g.sent();
                            console.error('Error setting default:', err_10);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // Open signature pad from picker (to draw new one)
        PdfAnnotatorModalComponent.prototype.openSignaturePadFromPicker = function () {
            this.closeSignaturePicker();
            this.openSignaturePad();
        };
        // Trigger file input for signature upload
        PdfAnnotatorModalComponent.prototype.triggerSignatureUpload = function () {
            var _a, _b;
            (_b = (_a = this.signatureFileInputRef) === null || _a === void 0 ? void 0 : _a.nativeElement) === null || _b === void 0 ? void 0 : _b.click();
        };
        // Handle signature file selection
        PdfAnnotatorModalComponent.prototype.onSignatureFileSelected = function (event) {
            return __awaiter(this, void 0, void 0, function () {
                var input, file, reader;
                var _this = this;
                return __generator(this, function (_g) {
                    input = event.target;
                    if (!input.files || input.files.length === 0)
                        return [2 /*return*/];
                    file = input.files[0];
                    // Validate file type
                    if (!file.type.startsWith('image/')) {
                        console.error('Invalid file type:', file.type);
                        return [2 /*return*/];
                    }
                    reader = new FileReader();
                    reader.onload = function (e) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, dataUrl, err_11, response, err_12;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    dataUrl = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                                    if (!dataUrl)
                                        return [2 /*return*/];
                                    // Remove white background
                                    this.isLoadingSignatures = true;
                                    _g.label = 1;
                                case 1:
                                    _g.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, this.removeWhiteBackground(dataUrl)];
                                case 2:
                                    dataUrl = _g.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_11 = _g.sent();
                                    console.warn('Could not remove background:', err_11);
                                    return [3 /*break*/, 4];
                                case 4:
                                    if (!this.userId) return [3 /*break*/, 9];
                                    _g.label = 5;
                                case 5:
                                    _g.trys.push([5, 7, , 8]);
                                    return [4 /*yield*/, this.http.post(this.signaturesApiUrl, {
                                            aksi: 'save_signature',
                                            user_id: this.userId,
                                            signature_name: file.name.replace(/\.[^/.]+$/, ''),
                                            signature_data: dataUrl
                                        }).toPromise()];
                                case 6:
                                    response = _g.sent();
                                    if (response === null || response === void 0 ? void 0 : response.success) {
                                        this.savedSignatures.push({
                                            id: response.id,
                                            user_id: this.userId,
                                            signature_name: response.signature_name,
                                            signature_data: dataUrl,
                                            is_default: this.savedSignatures.length === 0,
                                            created_at: new Date().toISOString(),
                                            updated_at: new Date().toISOString()
                                        });
                                    }
                                    return [3 /*break*/, 8];
                                case 7:
                                    err_12 = _g.sent();
                                    console.error('Error uploading signature:', err_12);
                                    return [3 /*break*/, 8];
                                case 8: return [3 /*break*/, 10];
                                case 9:
                                    // No userId, just use directly
                                    this.placeSignatureOnCanvas(dataUrl);
                                    this.closeSignaturePicker();
                                    _g.label = 10;
                                case 10:
                                    this.isLoadingSignatures = false;
                                    // Reset input
                                    input.value = '';
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    reader.readAsDataURL(file);
                    return [2 /*return*/];
                });
            });
        };
        // Remove white/light background from image, making it transparent
        PdfAnnotatorModalComponent.prototype.removeWhiteBackground = function (dataUrl) {
            return new Promise(function (resolve, reject) {
                var img = new Image();
                img.onload = function () {
                    var canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    var ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject('Could not get canvas context');
                        return;
                    }
                    // Draw image
                    ctx.drawImage(img, 0, 0);
                    // Get pixel data
                    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    var data = imageData.data;
                    // Threshold for "white" - pixels with RGB all above this value will be made transparent
                    var threshold = 240;
                    // Also make near-white pixels semi-transparent for smoother edges
                    var softThreshold = 200;
                    for (var i = 0; i < data.length; i += 4) {
                        var r = data[i];
                        var g = data[i + 1];
                        var b = data[i + 2];
                        // Check if pixel is white/near-white
                        if (r > threshold && g > threshold && b > threshold) {
                            // Make fully transparent
                            data[i + 3] = 0;
                        }
                        else if (r > softThreshold && g > softThreshold && b > softThreshold) {
                            // Make semi-transparent for smoother edges
                            var avg = (r + g + b) / 3;
                            var alpha = Math.max(0, 255 - (avg - softThreshold) * (255 / (threshold - softThreshold)));
                            data[i + 3] = Math.min(data[i + 3], alpha);
                        }
                    }
                    // Put modified data back
                    ctx.putImageData(imageData, 0, 0);
                    // Return as PNG (supports transparency)
                    resolve(canvas.toDataURL('image/png'));
                };
                img.onerror = function () { return reject('Failed to load image'); };
                img.src = dataUrl;
            });
        };
        /* ================= PDF Form Fields ================= */
        PdfAnnotatorModalComponent.prototype.enableFormFieldMode = function (type) {
            this.formFieldType = type;
            this.toolMode = 'formfield';
            this.showMarkOptions = true;
            this.updateCursor();
            var labels = { text: 'Text Field', checkbox: 'Checkbox', radio: 'Radio Button' };
            this.presentToast("\u0E04\u0E25\u0E34\u0E01\u0E1A\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E27\u0E32\u0E07 " + labels[type]);
        };
        PdfAnnotatorModalComponent.prototype.getFormFieldsForPage = function (page) {
            return this.pdfFormFields.filter(function (f) { return f.page === page; });
        };
        PdfAnnotatorModalComponent.prototype.removeFormField = function (id) {
            this.pdfFormFields = this.pdfFormFields.filter(function (f) { return f.id !== id; });
            this.cdr.detectChanges();
        };
        PdfAnnotatorModalComponent.prototype.startFormFieldDrag = function (e, id) {
            var _this = this;
            if (e.button === 2 || e.ctrlKey)
                return;
            var target = e.target;
            if (target.closest('button') || target.classList.contains('resize-handle'))
                return;
            e.stopPropagation();
            e.preventDefault();
            this.activeFormFieldId = id;
            var ff = this.pdfFormFields.find(function (f) { return f.id === id; });
            if (!ff)
                return;
            var canvasRect = this.getDragCanvasRect(ff.page);
            var startXpx = (ff.x / 100) * canvasRect.width;
            var startYpx = (ff.y / 100) * canvasRect.height;
            var offsetX = e.clientX - canvasRect.left - startXpx;
            var offsetY = e.clientY - canvasRect.top - startYpx;
            var move = function (ev) {
                ev.preventDefault();
                var f = _this.pdfFormFields.find(function (x) { return x.id === id; });
                if (!f)
                    return;
                f.x = ((ev.clientX - canvasRect.left - offsetX) / canvasRect.width) * 100;
                f.y = ((ev.clientY - canvasRect.top - offsetY) / canvasRect.height) * 100;
                _this.cdr.detectChanges();
            };
            var up = function () {
                window.removeEventListener('pointermove', move);
                window.removeEventListener('pointerup', up);
            };
            window.addEventListener('pointermove', move);
            window.addEventListener('pointerup', up);
        };
        PdfAnnotatorModalComponent.prototype.startMarkDrag = function (e, markId) {
            var _this = this;
            if (e.button === 2 || e.ctrlKey)
                return;
            var target = e.target;
            if (target.closest('button') || target.classList.contains('pff-resize-handle'))
                return;
            e.stopPropagation();
            e.preventDefault();
            this.activeObjectId = markId;
            this.activeObjectType = 'image';
            this.cdr.detectChanges();
            var img = this.imageStamps.find(function (i) { return i.id === markId; });
            if (!img)
                return;
            var canvasRect = this.getDragCanvasRect(img.page);
            var offsetX = e.clientX - canvasRect.left - (img.x / 100) * canvasRect.width;
            var offsetY = e.clientY - canvasRect.top - (img.y / 100) * canvasRect.height;
            var move = function (ev) {
                ev.preventDefault();
                var i = _this.imageStamps.find(function (x) { return x.id === markId; });
                if (!i)
                    return;
                i.x = ((ev.clientX - canvasRect.left - offsetX) / canvasRect.width) * 100;
                i.y = ((ev.clientY - canvasRect.top - offsetY) / canvasRect.height) * 100;
                _this.cdr.detectChanges();
            };
            var up = function () {
                window.removeEventListener('pointermove', move);
                window.removeEventListener('pointerup', up);
            };
            window.addEventListener('pointermove', move);
            window.addEventListener('pointerup', up);
        };
        PdfAnnotatorModalComponent.prototype.startFormFieldResize = function (e, id, dir) {
            var _this = this;
            e.stopPropagation();
            e.preventDefault();
            var ff = this.pdfFormFields.find(function (f) { return f.id === id; });
            if (!ff)
                return;
            var canvasRect = this.getDragCanvasRect(ff.page);
            var startX = e.clientX;
            var startY = e.clientY;
            var origX = ff.x;
            var origY = ff.y;
            var origW = ff.width;
            var origH = ff.height;
            var move = function (ev) {
                ev.preventDefault();
                var f = _this.pdfFormFields.find(function (x) { return x.id === id; });
                if (!f)
                    return;
                var dx = ((ev.clientX - startX) / canvasRect.width) * 100;
                var dy = ((ev.clientY - startY) / canvasRect.height) * 100;
                if (dir.includes('e'))
                    f.width = Math.max(2, origW + dx);
                if (dir.includes('s'))
                    f.height = Math.max(2, origH + dy);
                if (dir.includes('w')) {
                    f.x = origX + dx;
                    f.width = Math.max(2, origW - dx);
                }
                if (dir.includes('n')) {
                    f.y = origY + dy;
                    f.height = Math.max(2, origH - dy);
                }
                _this.cdr.detectChanges();
            };
            var up = function () {
                window.removeEventListener('pointermove', move);
                window.removeEventListener('pointerup', up);
            };
            window.addEventListener('pointermove', move);
            window.addEventListener('pointerup', up);
        };
        PdfAnnotatorModalComponent.prototype.changeFormFieldFontSize = function (id, delta) {
            var _a;
            var ff = this.pdfFormFields.find(function (f) { return f.id === id; });
            if (!ff)
                return;
            ff.fontSize = Math.max(6, Math.min(72, ((_a = ff.fontSize) !== null && _a !== void 0 ? _a : 12) + delta));
            this.cdr.detectChanges();
        };
        PdfAnnotatorModalComponent.prototype.changeFormFieldSize = function (id, delta) {
            var ff = this.pdfFormFields.find(function (f) { return f.id === id; });
            if (!ff)
                return;
            if (ff.type === 'text') {
                ff.height = Math.max(1.5, Math.min(30, ff.height + delta));
            }
            else {
                var s = Math.max(1, Math.min(30, ff.width + delta));
                ff.width = s;
                ff.height = s;
            }
            this.cdr.detectChanges();
        };
        PdfAnnotatorModalComponent.prototype.toggleFormFieldBorder = function (id) {
            var _a;
            var ff = this.pdfFormFields.find(function (f) { return f.id === id; });
            if (!ff)
                return;
            ff.borderVisible = !((_a = ff.borderVisible) !== null && _a !== void 0 ? _a : true);
            this.cdr.detectChanges();
        };
        /* ================= Quick Mark Stamps ================= */
        PdfAnnotatorModalComponent.prototype.enableMarkMode = function (type) {
            this.markType = type;
            this.toolMode = 'mark';
            this.showMarkOptions = true;
            this.updateCursor();
            var labels = {
                check: '✓ เครื่องหมายถูก', cross: '✗ เครื่องหมายผิด', dot: '● จุด',
            };
            this.presentToast("\u0E04\u0E25\u0E34\u0E01\u0E1A\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E27\u0E32\u0E07 " + labels[type]);
        };
        PdfAnnotatorModalComponent.prototype.setMarkColor = function (color) {
            this.markColor = color;
        };
        PdfAnnotatorModalComponent.prototype.changeMarkSize = function (delta) {
            this.markSize = Math.max(12, Math.min(96, this.markSize + delta));
        };
        PdfAnnotatorModalComponent.prototype.changeMarkStampSize = function (id, delta) {
            var img = this.imageStamps.find(function (i) { return i.id === id; });
            if (!img)
                return;
            var newSize = Math.max(1, Math.min(25, img.width + delta * 0.5));
            img.width = newSize;
            img.height = newSize;
            if (img.markType && img.markColor) {
                img.dataUrl = this.generateMarkDataUrl(img.markType, img.markColor, Math.round(newSize * 10));
            }
            this.cdr.detectChanges();
        };
        PdfAnnotatorModalComponent.prototype.generateMarkDataUrl = function (type, color, sizePx) {
            var s = Math.round(sizePx);
            var canvas = document.createElement('canvas');
            canvas.width = s;
            canvas.height = s;
            var ctx = canvas.getContext('2d');
            var sw = Math.max(2, s * 0.10);
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = sw;
            if (type === 'check') {
                ctx.beginPath();
                ctx.moveTo(s * 0.12, s * 0.52);
                ctx.lineTo(s * 0.42, s * 0.82);
                ctx.lineTo(s * 0.88, s * 0.18);
                ctx.stroke();
            }
            else if (type === 'cross') {
                ctx.beginPath();
                ctx.moveTo(s * 0.15, s * 0.15);
                ctx.lineTo(s * 0.85, s * 0.85);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(s * 0.85, s * 0.15);
                ctx.lineTo(s * 0.15, s * 0.85);
                ctx.stroke();
            }
            else {
                ctx.beginPath();
                ctx.arc(s / 2, s / 2, s * 0.38, 0, Math.PI * 2);
                ctx.fill();
            }
            return canvas.toDataURL('image/png');
        };
        /* ================= Date Stamp ================= */
        PdfAnnotatorModalComponent.prototype.addDateStamp = function () {
            this.toolMode = 'date';
            this.updateCursor();
            this.presentToast('คลิกบนเอกสารเพื่อวางวันที่');
        };
        PdfAnnotatorModalComponent.prototype.startDateDrag = function (ev, dateId) {
            var _this = this;
            if (ev.button === 2 || ev.ctrlKey)
                return;
            ev.stopPropagation();
            var target = ev.target;
            if (target.closest('button'))
                return;
            ev.preventDefault();
            var ds = this.dateStamps.find(function (d) { return d.id === dateId; });
            if (!ds)
                return;
            var canvasRect = this.getDragCanvasRect(ds.page);
            var startXpx = (ds.x / 100) * canvasRect.width;
            var startYpx = (ds.y / 100) * canvasRect.height;
            var offsetX = ev.clientX - canvasRect.left - startXpx;
            var offsetY = ev.clientY - canvasRect.top - startYpx;
            var move = function (e) {
                e.preventDefault();
                var d = _this.dateStamps.find(function (x) { return x.id === dateId; });
                if (!d)
                    return;
                var mouseXpx = e.clientX - canvasRect.left - offsetX;
                var mouseYpx = e.clientY - canvasRect.top - offsetY;
                d.x = (mouseXpx / canvasRect.width) * 100;
                d.y = (mouseYpx / canvasRect.height) * 100;
                _this.cdr.detectChanges();
            };
            var up = function () {
                window.removeEventListener('pointermove', move);
                window.removeEventListener('pointerup', up);
            };
            window.addEventListener('pointermove', move);
            window.addEventListener('pointerup', up);
        };
        PdfAnnotatorModalComponent.prototype.removeDateStamp = function (dateId) {
            this.dateStamps = this.dateStamps.filter(function (d) { return d.id !== dateId; });
            this.cdr.detectChanges();
        };
        /* ================= Text Style ================= */
        PdfAnnotatorModalComponent.prototype.toggleBold = function () {
            if (this.activeTextBox) {
                this.activeTextBox.bold = !this.activeTextBox.bold;
                this.cdr.detectChanges();
            }
        };
        PdfAnnotatorModalComponent.prototype.toggleItalic = function () {
            if (this.activeTextBox) {
                this.activeTextBox.italic = !this.activeTextBox.italic;
                this.cdr.detectChanges();
            }
        };
        PdfAnnotatorModalComponent.prototype.setAlign = function (a) {
            if (this.activeTextBox) {
                this.activeTextBox.align = a;
                this.cdr.detectChanges();
            }
        };
        PdfAnnotatorModalComponent.prototype.setTextColor = function (color) {
            this.textColor = color;
            if (this.activeTextBox) {
                this.activeTextBox.color = color;
                this.cdr.detectChanges();
            }
            this.saveSettings();
        };
        /* ================= Serialize JSON ================= */
        PdfAnnotatorModalComponent.prototype.exportDrawingJson = function () {
            return JSON.stringify({
                version: 3,
                strokes: this.strokes,
                shapes: this.shapes,
                textBoxes: this.textBoxes,
                imageStamps: this.imageStamps,
                signatureStamps: this.signatureStamps,
                dateStamps: this.dateStamps
            });
        };
        /* ================= Save PDF (ALL PAGES) ================= */
        PdfAnnotatorModalComponent.prototype.renderOverlayToPngBytes = function (pageNo, pdfW, pdfH) {
            var e_14, _g, e_15, _h;
            var strokes = this.strokes[pageNo] || [];
            var shapes = this.shapes[pageNo] || [];
            var off = document.createElement('canvas');
            off.width = Math.floor(pdfW);
            off.height = Math.floor(pdfH);
            var ctx = off.getContext('2d');
            ctx.clearRect(0, 0, off.width, off.height);
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            var canvas = this.getAnnotCanvas(pageNo);
            var viewWidth = canvas ? canvas.clientWidth : 800;
            var thicknessScale = (pdfW / Math.max(1, viewWidth)) * 1.5;
            try {
                // Draw strokes
                for (var strokes_1 = __values(strokes), strokes_1_1 = strokes_1.next(); !strokes_1_1.done; strokes_1_1 = strokes_1.next()) {
                    var s = strokes_1_1.value;
                    if (!s.points.length)
                        continue;
                    if (s.isHighlight) {
                        ctx.save();
                        ctx.globalAlpha = 0.4;
                        ctx.globalCompositeOperation = 'multiply';
                    }
                    ctx.strokeStyle = s.color;
                    ctx.beginPath();
                    for (var i = 0; i < s.points.length; i++) {
                        var pt = s.points[i];
                        var x = pt.x * off.width;
                        var y = pt.y * off.height;
                        ctx.lineWidth = this.calcLineWidth(s.size, pt.p) * thicknessScale;
                        if (i === 0)
                            ctx.moveTo(x, y);
                        else
                            ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                    if (s.isHighlight)
                        ctx.restore();
                }
            }
            catch (e_14_1) { e_14 = { error: e_14_1 }; }
            finally {
                try {
                    if (strokes_1_1 && !strokes_1_1.done && (_g = strokes_1.return)) _g.call(strokes_1);
                }
                finally { if (e_14) throw e_14.error; }
            }
            try {
                // Draw shapes
                for (var shapes_1 = __values(shapes), shapes_1_1 = shapes_1.next(); !shapes_1_1.done; shapes_1_1 = shapes_1.next()) {
                    var sh = shapes_1_1.value;
                    var x1 = sh.startX * off.width;
                    var y1 = sh.startY * off.height;
                    var x2 = sh.endX * off.width;
                    var y2 = sh.endY * off.height;
                    ctx.strokeStyle = sh.color;
                    ctx.lineWidth = sh.size * thicknessScale;
                    ctx.beginPath();
                    switch (sh.type) {
                        case 'rect':
                            ctx.rect(x1, y1, x2 - x1, y2 - y1);
                            if (sh.fillColor) {
                                ctx.fillStyle = sh.fillColor;
                                ctx.fill();
                            }
                            break;
                        case 'circle': {
                            var cx = (x1 + x2) / 2;
                            var cy = (y1 + y2) / 2;
                            var rx = Math.abs(x2 - x1) / 2;
                            var ry = Math.abs(y2 - y1) / 2;
                            ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                            if (sh.fillColor) {
                                ctx.fillStyle = sh.fillColor;
                                ctx.fill();
                            }
                            break;
                        }
                        case 'line':
                            ctx.moveTo(x1, y1);
                            ctx.lineTo(x2, y2);
                            break;
                        case 'arrow': {
                            ctx.moveTo(x1, y1);
                            ctx.lineTo(x2, y2);
                            ctx.stroke();
                            var angle2 = Math.atan2(y2 - y1, x2 - x1);
                            var headLen = 15 * thicknessScale;
                            ctx.beginPath();
                            ctx.moveTo(x2, y2);
                            ctx.lineTo(x2 - headLen * Math.cos(angle2 - Math.PI / 6), y2 - headLen * Math.sin(angle2 - Math.PI / 6));
                            ctx.moveTo(x2, y2);
                            ctx.lineTo(x2 - headLen * Math.cos(angle2 + Math.PI / 6), y2 - headLen * Math.sin(angle2 + Math.PI / 6));
                            break;
                        }
                    }
                    ctx.stroke();
                }
            }
            catch (e_15_1) { e_15 = { error: e_15_1 }; }
            finally {
                try {
                    if (shapes_1_1 && !shapes_1_1.done && (_h = shapes_1.return)) _h.call(shapes_1);
                }
                finally { if (e_15) throw e_15.error; }
            }
            var b64 = off.toDataURL('image/png').split(',')[1];
            return Uint8Array.from(atob(b64), function (c) { return c.charCodeAt(0); });
        };
        // Helper to map visual percentage coordinates to physical PDF coordinates
        PdfAnnotatorModalComponent.prototype.getPdfPlacement = function (vxPercent, vyPercent, vwPercent, vhPercent, pageWidth, pageHeight, pageRotation) {
            var isRot = pageRotation === 90 || pageRotation === 270 || pageRotation === -90 || pageRotation === -270;
            // vW and vH are the dimensions of the visual canvas presented to the user
            // pdf-lib's getSize() gives unrotated dimensions. If it's rotated, the visual width is the page's Height, etc.
            var vW = isRot ? pageHeight : pageWidth;
            var vH = isRot ? pageWidth : pageHeight;
            var vx = (vxPercent / 100) * vW;
            var vy = (vyPercent / 100) * vH;
            var vw = (vwPercent / 100) * vW;
            var vh = (vhPercent / 100) * vH;
            var rotDeg = 0;
            var px = vx;
            var py = pageHeight - vy - vh;
            // The mapping handles drawing onto pdf-lib which uses bottom-left origin.
            if (pageRotation === 90 || pageRotation === -270) {
                // PDF page is rotated 90 CW visually. We draw elements 90 CCW to compensate for viewers rotating it later.
                rotDeg = 90;
                px = vy + vh;
                py = vx;
            }
            else if (pageRotation === 270 || pageRotation === -90) {
                // PDF page is rotated 90 CCW visually (270 CW). We draw elements 90 CW (-90).
                rotDeg = -90;
                px = pageWidth - (vy + vh);
                py = pageHeight - vx;
            }
            else if (pageRotation === 180 || pageRotation === -180) {
                // PDF page is upside down. We draw elements upside down (180).
                rotDeg = 180;
                px = pageWidth - vx;
                py = pageHeight - vy;
            }
            return { x: px, y: py, width: vw, height: vh, rotate: pdfLib.degrees(rotDeg), vW: vW, vH: vH };
        };
        PdfAnnotatorModalComponent.prototype.saveDocument = function () {
            var _a, _b, _c, _d, _e;
            return __awaiter(this, void 0, void 0, function () {
                var pdfDoc, fontkit, fontBytes, thaiFont, boldFontBytes, thaiFontBold, pdfPages, annotatedPageNums_1, batchSize, _loop_1, this_1, i, form, _g, _h, ff, pgIdx, pdfPage, _j, pgW, pgH, rotAngle, isRotated, vW, vH, fx, fw, fh, fy, borderW, opts, tf, cb, rg, pdfBytes, e_16;
                var e_17, _k;
                var _this = this;
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0:
                            if (!this.basePdfBytes)
                                return [2 /*return*/];
                            this.isLoading = true;
                            this.saveProgress = 1;
                            this.loadingMessage = 'กำลังเตรียมเอกสาร...';
                            this.cdr.detectChanges();
                            _l.label = 1;
                        case 1:
                            _l.trys.push([1, 14, 15, 16]);
                            return [4 /*yield*/, pdfLib.PDFDocument.load(this.basePdfBytes)];
                        case 2:
                            pdfDoc = _l.sent();
                            fontkit = fontkitModule__namespace.default || fontkitModule__namespace;
                            pdfDoc.registerFontkit(fontkit);
                            return [4 /*yield*/, fetch('/assets/fonts/THSarabunNew.ttf').then(function (r) { return r.arrayBuffer(); })];
                        case 3:
                            fontBytes = _l.sent();
                            return [4 /*yield*/, pdfDoc.embedFont(fontBytes)];
                        case 4:
                            thaiFont = _l.sent();
                            return [4 /*yield*/, fetch('/assets/fonts/THSarabunNew Bold.ttf').then(function (r) { return r.arrayBuffer(); })];
                        case 5:
                            boldFontBytes = _l.sent();
                            return [4 /*yield*/, pdfDoc.embedFont(boldFontBytes)];
                        case 6:
                            thaiFontBold = _l.sent();
                            pdfPages = pdfDoc.getPages();
                            annotatedPageNums_1 = new Set();
                            Object.keys(this.strokes).forEach(function (p) {
                                var _a;
                                if ((((_a = _this.strokes[+p]) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0)
                                    annotatedPageNums_1.add(+p);
                            });
                            Object.keys(this.shapes).forEach(function (p) {
                                var _a;
                                if ((((_a = _this.shapes[+p]) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0)
                                    annotatedPageNums_1.add(+p);
                            });
                            this.shapeStamps.forEach(function (ss) { return annotatedPageNums_1.add(ss.page); });
                            this.textBoxes.forEach(function (t) { return annotatedPageNums_1.add(t.page); });
                            this.imageStamps.forEach(function (img) { return annotatedPageNums_1.add(img.page); });
                            this.signatureStamps.forEach(function (s) { return annotatedPageNums_1.add(s.page); });
                            this.dateStamps.forEach(function (d) { return annotatedPageNums_1.add(d.page); });
                            batchSize = pdfPages.length > 100 ? 20 : 5;
                            _loop_1 = function (i) {
                                var pageNum, page, _m, width, height, canvas, cw, rotationAngle, isRot, vW, vH, hasStrokes, hasShapes, overlayPng, overlayImg, placement, toRgb, stampsForPage, stampsForPage_1, stampsForPage_1_1, ss, ssViewW, ssStrokeScale, pdfStrokeW, fillColor, strokeColor, placement, centerPt, pt1, pt2, headLen, angle, textForPage, textForPage_1, textForPage_1_1, tb, fontToUse, colorHex, txtColor, lines, lineHeight, canvas_1, canvasCW, canvasCH, padLeftPct, padTopPct, maxW, textStartXPct, currentVisualY, lines_1, lines_1_1, para, paraWords, segmenter, parts, i_1, line, paraWords_1, paraWords_1_1, word, testLine, textWidth, alignXVisual, finalLineWidth, baselineVisualY, pt, alignXVisual, finalLineWidth, baselineVisualY, pt, imgForPage, imgForPage_1, imgForPage_1_1, img, pngUrl, _o, bytes, embedded, placement, e_18, e_19_1, sigForPage, sigForPage_1, sigForPage_1_1, sig, bytes, embedded, placement, idFontSize, idLines, lineHeight, totalTextHeight, textVisualXPct, textStartYPct, li, lineBaselineVPct, pt, e_20, e_21_1, dateForPage, dateForPage_1, dateForPage_1_1, ds, hex, r, g, b, baselineVPct, pt;
                                var e_22, _p, e_23, _q, e_24, _r, e_25, _s, e_19, _t, e_21, _u, e_26, _v;
                                return __generator(this, function (_w) {
                                    switch (_w.label) {
                                        case 0:
                                            pageNum = i + 1;
                                            page = pdfPages[i];
                                            if (!(i % batchSize === 0 || i === pdfPages.length - 1)) return [3 /*break*/, 2];
                                            this_1.saveProgress = Math.round(((i + 1) / pdfPages.length) * 60);
                                            this_1.loadingMessage = "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1B\u0E23\u0E30\u0E21\u0E27\u0E25\u0E1C\u0E25\u0E2B\u0E19\u0E49\u0E32 " + (i + 1) + " / " + pdfPages.length;
                                            this_1.cdr.detectChanges();
                                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 0); })];
                                        case 1:
                                            _w.sent();
                                            _w.label = 2;
                                        case 2:
                                            // Skip pages with no annotations entirely
                                            if (!annotatedPageNums_1.has(pageNum))
                                                return [2 /*return*/, "continue"];
                                            _m = page.getSize(), width = _m.width, height = _m.height;
                                            canvas = this_1.getAnnotCanvas(pageNum);
                                            cw = canvas ? canvas.clientWidth : 800;
                                            rotationAngle = (_a = this_1.pdfPageRotations.get(pageNum)) !== null && _a !== void 0 ? _a : page.getRotation().angle;
                                            isRot = rotationAngle === 90 || rotationAngle === 270 || rotationAngle === -90 || rotationAngle === -270;
                                            vW = isRot ? height : width;
                                            vH = isRot ? width : height;
                                            hasStrokes = (((_b = this_1.strokes[pageNum]) === null || _b === void 0 ? void 0 : _b.length) || 0) > 0;
                                            hasShapes = (((_c = this_1.shapes[pageNum]) === null || _c === void 0 ? void 0 : _c.length) || 0) > 0;
                                            if (!(hasStrokes || hasShapes)) return [3 /*break*/, 4];
                                            overlayPng = this_1.renderOverlayToPngBytes(pageNum, vW, vH);
                                            return [4 /*yield*/, pdfDoc.embedPng(overlayPng)];
                                        case 3:
                                            overlayImg = _w.sent();
                                            placement = this_1.getPdfPlacement(0, 0, 100, 100, width, height, rotationAngle);
                                            page.drawImage(overlayImg, { x: placement.x, y: placement.y, width: placement.width, height: placement.height, rotate: placement.rotate });
                                            _w.label = 4;
                                        case 4:
                                            toRgb = function (hex) {
                                                if (!hex || hex === 'none' || hex.includes('rgba'))
                                                    return undefined;
                                                var cleanHex = hex.replace('#', '');
                                                if (cleanHex.length === 3)
                                                    cleanHex = cleanHex.split('').map(function (c) { return c + c; }).join('');
                                                if (cleanHex.length !== 6)
                                                    return undefined;
                                                return pdfLib.rgb(parseInt(cleanHex.substring(0, 2), 16) / 255, parseInt(cleanHex.substring(2, 4), 16) / 255, parseInt(cleanHex.substring(4, 6), 16) / 255);
                                            };
                                            stampsForPage = this_1.shapeStamps.filter(function (ss) { return ss.page === pageNum; });
                                            try {
                                                for (stampsForPage_1 = (e_22 = void 0, __values(stampsForPage)), stampsForPage_1_1 = stampsForPage_1.next(); !stampsForPage_1_1.done; stampsForPage_1_1 = stampsForPage_1.next()) {
                                                    ss = stampsForPage_1_1.value;
                                                    ssViewW = ss.viewWidth && ss.viewWidth > 0 ? ss.viewWidth : Math.max(1, cw);
                                                    ssStrokeScale = vW / ssViewW;
                                                    pdfStrokeW = ss.strokeWidth * ssStrokeScale;
                                                    fillColor = ss.fillColor ? toRgb(ss.fillColor) : undefined;
                                                    strokeColor = (ss.strokeColor && ss.strokeColor !== 'rgba(0,0,0,0)' && ss.strokeWidth > 0) ? toRgb(ss.strokeColor) : undefined;
                                                    placement = this_1.getPdfPlacement(ss.x, ss.y, ss.width, ss.height, width, height, rotationAngle);
                                                    if (ss.type === 'rect') {
                                                        page.drawRectangle({
                                                            x: placement.x,
                                                            y: placement.y,
                                                            width: placement.width,
                                                            height: placement.height,
                                                            rotate: placement.rotate,
                                                            color: fillColor,
                                                            borderColor: strokeColor,
                                                            borderWidth: strokeColor ? pdfStrokeW : undefined
                                                        });
                                                    }
                                                    else if (ss.type === 'circle') {
                                                        centerPt = this_1.getPdfPlacement(ss.x + ss.width / 2, ss.y + ss.height / 2, 0, 0, width, height, rotationAngle);
                                                        page.drawEllipse({
                                                            x: centerPt.x,
                                                            y: centerPt.y,
                                                            xScale: placement.width / 2,
                                                            yScale: placement.height / 2,
                                                            color: fillColor,
                                                            borderColor: strokeColor,
                                                            borderWidth: strokeColor ? pdfStrokeW : undefined
                                                        });
                                                    }
                                                    else if (ss.type === 'line' || ss.type === 'arrow') {
                                                        pt1 = this_1.getPdfPlacement(ss.x + ss.startFracX * ss.width, ss.y + ss.startFracY * ss.height, 0, 0, width, height, rotationAngle);
                                                        pt2 = this_1.getPdfPlacement(ss.x + ss.endFracX * ss.width, ss.y + ss.endFracY * ss.height, 0, 0, width, height, rotationAngle);
                                                        page.drawLine({
                                                            start: { x: pt1.x, y: pt1.y },
                                                            end: { x: pt2.x, y: pt2.y },
                                                            color: strokeColor || pdfLib.rgb(0, 0, 0),
                                                            thickness: strokeColor ? pdfStrokeW : 1
                                                        });
                                                        if (ss.type === 'arrow') {
                                                            headLen = 15 * ssStrokeScale;
                                                            angle = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x);
                                                            page.drawLine({
                                                                start: { x: pt2.x, y: pt2.y },
                                                                end: { x: pt2.x - headLen * Math.cos(angle - Math.PI / 6), y: pt2.y - headLen * Math.sin(angle - Math.PI / 6) },
                                                                color: strokeColor || pdfLib.rgb(0, 0, 0),
                                                                thickness: strokeColor ? pdfStrokeW : 1
                                                            });
                                                            page.drawLine({
                                                                start: { x: pt2.x, y: pt2.y },
                                                                end: { x: pt2.x - headLen * Math.cos(angle + Math.PI / 6), y: pt2.y - headLen * Math.sin(angle + Math.PI / 6) },
                                                                color: strokeColor || pdfLib.rgb(0, 0, 0),
                                                                thickness: strokeColor ? pdfStrokeW : 1
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                            catch (e_22_1) { e_22 = { error: e_22_1 }; }
                                            finally {
                                                try {
                                                    if (stampsForPage_1_1 && !stampsForPage_1_1.done && (_p = stampsForPage_1.return)) _p.call(stampsForPage_1);
                                                }
                                                finally { if (e_22) throw e_22.error; }
                                            }
                                            textForPage = this_1.textBoxes.filter(function (t) { return t.page === pageNum; });
                                            try {
                                                for (textForPage_1 = (e_23 = void 0, __values(textForPage)), textForPage_1_1 = textForPage_1.next(); !textForPage_1_1.done; textForPage_1_1 = textForPage_1.next()) {
                                                    tb = textForPage_1_1.value;
                                                    if (!tb.text.trim())
                                                        continue;
                                                    fontToUse = (tb.bold || tb.italic) ? thaiFontBold : thaiFont;
                                                    colorHex = tb.color || '#0000ff';
                                                    txtColor = toRgb(colorHex) || pdfLib.rgb(0, 0, 1);
                                                    lines = tb.text.split('\n');
                                                    lineHeight = tb.fontSize * 1.4;
                                                    canvas_1 = this_1.getAnnotCanvas(pageNum);
                                                    canvasCW = canvas_1 ? canvas_1.clientWidth : 800;
                                                    canvasCH = canvas_1 ? canvas_1.clientHeight : 1000;
                                                    padLeftPct = (4 / canvasCW) * 100;
                                                    padTopPct = (2 / canvasCH) * 100;
                                                    maxW = (tb.width / 100) * vW;
                                                    textStartXPct = tb.x + padLeftPct;
                                                    currentVisualY = ((tb.y + padTopPct) / 100) * vH;
                                                    try {
                                                        for (lines_1 = (e_24 = void 0, __values(lines)), lines_1_1 = lines_1.next(); !lines_1_1.done; lines_1_1 = lines_1.next()) {
                                                            para = lines_1_1.value;
                                                            if (!para) {
                                                                currentVisualY += lineHeight;
                                                                continue;
                                                            }
                                                            paraWords = [];
                                                            if (typeof Intl !== 'undefined' && Intl.Segmenter) {
                                                                segmenter = new Intl.Segmenter('th', { granularity: 'word' });
                                                                paraWords = Array.from(segmenter.segment(para)).map(function (s) { return s.segment; });
                                                            }
                                                            else {
                                                                parts = para.split(' ');
                                                                for (i_1 = 0; i_1 < parts.length; i_1++) {
                                                                    paraWords.push(parts[i_1]);
                                                                    if (i_1 < parts.length - 1)
                                                                        paraWords.push(' ');
                                                                }
                                                            }
                                                            line = '';
                                                            try {
                                                                for (paraWords_1 = (e_25 = void 0, __values(paraWords)), paraWords_1_1 = paraWords_1.next(); !paraWords_1_1.done; paraWords_1_1 = paraWords_1.next()) {
                                                                    word = paraWords_1_1.value;
                                                                    testLine = line + word;
                                                                    textWidth = fontToUse.widthOfTextAtSize(testLine, tb.fontSize);
                                                                    if (textWidth > maxW && line) {
                                                                        alignXVisual = (textStartXPct / 100) * vW;
                                                                        finalLineWidth = fontToUse.widthOfTextAtSize(line, tb.fontSize);
                                                                        if (tb.align === 'center')
                                                                            alignXVisual += (maxW / 2) - (finalLineWidth / 2);
                                                                        if (tb.align === 'right')
                                                                            alignXVisual += maxW - finalLineWidth;
                                                                        baselineVisualY = currentVisualY + (tb.fontSize * 0.95);
                                                                        pt = this_1.getPdfPlacement((alignXVisual / vW) * 100, (baselineVisualY / vH) * 100, 0, 0, width, height, rotationAngle);
                                                                        page.drawText(line, {
                                                                            x: pt.x,
                                                                            y: pt.y,
                                                                            size: tb.fontSize,
                                                                            font: fontToUse,
                                                                            color: txtColor,
                                                                            rotate: pt.rotate
                                                                        });
                                                                        line = word.replace(/^\s+/, '');
                                                                        currentVisualY += lineHeight;
                                                                    }
                                                                    else {
                                                                        line = testLine;
                                                                    }
                                                                }
                                                            }
                                                            catch (e_25_1) { e_25 = { error: e_25_1 }; }
                                                            finally {
                                                                try {
                                                                    if (paraWords_1_1 && !paraWords_1_1.done && (_s = paraWords_1.return)) _s.call(paraWords_1);
                                                                }
                                                                finally { if (e_25) throw e_25.error; }
                                                            }
                                                            if (line) {
                                                                alignXVisual = (textStartXPct / 100) * vW;
                                                                finalLineWidth = fontToUse.widthOfTextAtSize(line, tb.fontSize);
                                                                if (tb.align === 'center')
                                                                    alignXVisual += (maxW / 2) - (finalLineWidth / 2);
                                                                if (tb.align === 'right')
                                                                    alignXVisual += maxW - finalLineWidth;
                                                                baselineVisualY = currentVisualY + (tb.fontSize * 0.95);
                                                                pt = this_1.getPdfPlacement((alignXVisual / vW) * 100, (baselineVisualY / vH) * 100, 0, 0, width, height, rotationAngle);
                                                                page.drawText(line, {
                                                                    x: pt.x,
                                                                    y: pt.y,
                                                                    size: tb.fontSize,
                                                                    font: fontToUse,
                                                                    color: txtColor,
                                                                    rotate: pt.rotate
                                                                });
                                                                currentVisualY += lineHeight;
                                                            }
                                                        }
                                                    }
                                                    catch (e_24_1) { e_24 = { error: e_24_1 }; }
                                                    finally {
                                                        try {
                                                            if (lines_1_1 && !lines_1_1.done && (_r = lines_1.return)) _r.call(lines_1);
                                                        }
                                                        finally { if (e_24) throw e_24.error; }
                                                    }
                                                }
                                            }
                                            catch (e_23_1) { e_23 = { error: e_23_1 }; }
                                            finally {
                                                try {
                                                    if (textForPage_1_1 && !textForPage_1_1.done && (_q = textForPage_1.return)) _q.call(textForPage_1);
                                                }
                                                finally { if (e_23) throw e_23.error; }
                                            }
                                            imgForPage = this_1.imageStamps.filter(function (img) { return img.page === pageNum; });
                                            _w.label = 5;
                                        case 5:
                                            _w.trys.push([5, 15, 16, 17]);
                                            imgForPage_1 = (e_19 = void 0, __values(imgForPage)), imgForPage_1_1 = imgForPage_1.next();
                                            _w.label = 6;
                                        case 6:
                                            if (!!imgForPage_1_1.done) return [3 /*break*/, 14];
                                            img = imgForPage_1_1.value;
                                            _w.label = 7;
                                        case 7:
                                            _w.trys.push([7, 12, , 13]);
                                            if (!img.dataUrl.startsWith('data:image/png')) return [3 /*break*/, 8];
                                            _o = img.dataUrl;
                                            return [3 /*break*/, 10];
                                        case 8: return [4 /*yield*/, this_1.normalizeImageToPng(img.dataUrl)];
                                        case 9:
                                            _o = _w.sent();
                                            _w.label = 10;
                                        case 10:
                                            pngUrl = _o;
                                            bytes = Uint8Array.from(atob(pngUrl.split(',')[1]), function (c) { return c.charCodeAt(0); });
                                            return [4 /*yield*/, pdfDoc.embedPng(bytes)];
                                        case 11:
                                            embedded = _w.sent();
                                            placement = this_1.getPdfPlacement(img.x, img.y, img.width, img.height, width, height, rotationAngle);
                                            page.drawImage(embedded, { x: placement.x, y: placement.y, width: placement.width, height: placement.height, rotate: placement.rotate });
                                            return [3 /*break*/, 13];
                                        case 12:
                                            e_18 = _w.sent();
                                            console.error(e_18);
                                            return [3 /*break*/, 13];
                                        case 13:
                                            imgForPage_1_1 = imgForPage_1.next();
                                            return [3 /*break*/, 6];
                                        case 14: return [3 /*break*/, 17];
                                        case 15:
                                            e_19_1 = _w.sent();
                                            e_19 = { error: e_19_1 };
                                            return [3 /*break*/, 17];
                                        case 16:
                                            try {
                                                if (imgForPage_1_1 && !imgForPage_1_1.done && (_t = imgForPage_1.return)) _t.call(imgForPage_1);
                                            }
                                            finally { if (e_19) throw e_19.error; }
                                            return [7 /*endfinally*/];
                                        case 17:
                                            sigForPage = this_1.signatureStamps.filter(function (s) { return s.page === pageNum; });
                                            _w.label = 18;
                                        case 18:
                                            _w.trys.push([18, 25, 26, 27]);
                                            sigForPage_1 = (e_21 = void 0, __values(sigForPage)), sigForPage_1_1 = sigForPage_1.next();
                                            _w.label = 19;
                                        case 19:
                                            if (!!sigForPage_1_1.done) return [3 /*break*/, 24];
                                            sig = sigForPage_1_1.value;
                                            _w.label = 20;
                                        case 20:
                                            _w.trys.push([20, 22, , 23]);
                                            bytes = Uint8Array.from(atob(sig.dataUrl.split(',')[1]), function (c) { return c.charCodeAt(0); });
                                            return [4 /*yield*/, pdfDoc.embedPng(bytes)];
                                        case 21:
                                            embedded = _w.sent();
                                            placement = this_1.getPdfPlacement(sig.x, sig.y, sig.width, sig.height, width, height, rotationAngle);
                                            page.drawImage(embedded, { x: placement.x, y: placement.y, width: placement.width, height: placement.height, rotate: placement.rotate });
                                            // Draw Digital ID text to the right of signature (vertically centered)
                                            if (this_1.showDigitalId && (sig.digitalId || sig.signDate)) {
                                                idFontSize = 8;
                                                idLines = [];
                                                if (sig.signDate)
                                                    idLines.push(sig.signDate);
                                                if (sig.signTime)
                                                    idLines.push(sig.signTime);
                                                if (sig.digitalId)
                                                    idLines.push(sig.digitalId);
                                                lineHeight = idFontSize + 2;
                                                totalTextHeight = idLines.length * lineHeight;
                                                textVisualXPct = sig.x + sig.width + (4 / vW * 100);
                                                textStartYPct = sig.y + (sig.height / 2) - ((totalTextHeight / 2) / vH * 100);
                                                for (li = 0; li < idLines.length; li++) {
                                                    lineBaselineVPct = textStartYPct + ((li * lineHeight + idFontSize) / vH * 100);
                                                    pt = this_1.getPdfPlacement(textVisualXPct, lineBaselineVPct, 0, 0, width, height, rotationAngle);
                                                    page.drawText(idLines[li], {
                                                        x: pt.x,
                                                        y: pt.y,
                                                        size: idFontSize,
                                                        font: thaiFont,
                                                        color: pdfLib.rgb(0.2, 0.2, 0.2),
                                                        opacity: 1.0,
                                                        rotate: pt.rotate
                                                    });
                                                }
                                            }
                                            return [3 /*break*/, 23];
                                        case 22:
                                            e_20 = _w.sent();
                                            console.error(e_20);
                                            return [3 /*break*/, 23];
                                        case 23:
                                            sigForPage_1_1 = sigForPage_1.next();
                                            return [3 /*break*/, 19];
                                        case 24: return [3 /*break*/, 27];
                                        case 25:
                                            e_21_1 = _w.sent();
                                            e_21 = { error: e_21_1 };
                                            return [3 /*break*/, 27];
                                        case 26:
                                            try {
                                                if (sigForPage_1_1 && !sigForPage_1_1.done && (_u = sigForPage_1.return)) _u.call(sigForPage_1);
                                            }
                                            finally { if (e_21) throw e_21.error; }
                                            return [7 /*endfinally*/];
                                        case 27:
                                            dateForPage = this_1.dateStamps.filter(function (d) { return d.page === pageNum; });
                                            try {
                                                for (dateForPage_1 = (e_26 = void 0, __values(dateForPage)), dateForPage_1_1 = dateForPage_1.next(); !dateForPage_1_1.done; dateForPage_1_1 = dateForPage_1.next()) {
                                                    ds = dateForPage_1_1.value;
                                                    hex = ds.color.replace('#', '');
                                                    r = parseInt(hex.substring(0, 2), 16) / 255;
                                                    g = parseInt(hex.substring(2, 4), 16) / 255;
                                                    b = parseInt(hex.substring(4, 6), 16) / 255;
                                                    baselineVPct = ds.y + (ds.fontSize / vH * 100);
                                                    pt = this_1.getPdfPlacement(ds.x, baselineVPct, 0, 0, width, height, rotationAngle);
                                                    page.drawText(ds.text, {
                                                        x: pt.x, y: pt.y, size: ds.fontSize, font: thaiFont,
                                                        color: pdfLib.rgb(r, g, b), opacity: 1.0, rotate: pt.rotate
                                                    });
                                                }
                                            }
                                            catch (e_26_1) { e_26 = { error: e_26_1 }; }
                                            finally {
                                                try {
                                                    if (dateForPage_1_1 && !dateForPage_1_1.done && (_v = dateForPage_1.return)) _v.call(dateForPage_1);
                                                }
                                                finally { if (e_26) throw e_26.error; }
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            i = 0;
                            _l.label = 7;
                        case 7:
                            if (!(i < pdfPages.length)) return [3 /*break*/, 10];
                            return [5 /*yield**/, _loop_1(i)];
                        case 8:
                            _l.sent();
                            _l.label = 9;
                        case 9:
                            i++;
                            return [3 /*break*/, 7];
                        case 10:
                            // Bake PDF AcroForm fields (interactive text/checkbox/radio)
                            if (this.pdfFormFields.length > 0) {
                                form = pdfDoc.getForm();
                                try {
                                    for (_g = __values(this.pdfFormFields), _h = _g.next(); !_h.done; _h = _g.next()) {
                                        ff = _h.value;
                                        pgIdx = ff.page - 1;
                                        if (pgIdx < 0 || pgIdx >= pdfPages.length)
                                            continue;
                                        pdfPage = pdfPages[pgIdx];
                                        _j = pdfPage.getSize(), pgW = _j.width, pgH = _j.height;
                                        rotAngle = (_d = this.pdfPageRotations.get(ff.page)) !== null && _d !== void 0 ? _d : pdfPage.getRotation().angle;
                                        isRotated = rotAngle === 90 || rotAngle === 270 || rotAngle === -90 || rotAngle === -270;
                                        vW = isRotated ? pgH : pgW;
                                        vH = isRotated ? pgW : pgH;
                                        fx = (ff.x / 100) * vW;
                                        fw = (ff.width / 100) * vW;
                                        fh = (ff.height / 100) * vH;
                                        fy = pgH - (ff.y / 100) * vH - fh;
                                        borderW = ((_e = ff.borderVisible) !== null && _e !== void 0 ? _e : true) ? 1 : 0;
                                        opts = {
                                            x: fx, y: fy, width: fw, height: fh,
                                            borderWidth: borderW,
                                            borderColor: borderW ? pdfLib.rgb(0, 0, 0) : undefined,
                                            backgroundColor: pdfLib.rgb(1, 1, 1),
                                        };
                                        try {
                                            if (ff.type === 'text') {
                                                tf = form.createTextField(ff.fieldName);
                                                tf.addToPage(pdfPage, opts);
                                                if (ff.fontSize)
                                                    tf.setFontSize(ff.fontSize);
                                            }
                                            else if (ff.type === 'checkbox') {
                                                cb = form.createCheckBox(ff.fieldName);
                                                cb.addToPage(pdfPage, opts);
                                            }
                                            else if (ff.type === 'radio') {
                                                rg = void 0;
                                                try {
                                                    rg = form.getRadioGroup(ff.radioGroupName);
                                                }
                                                catch (_f) {
                                                    rg = form.createRadioGroup(ff.radioGroupName);
                                                }
                                                rg.addOptionToPage(ff.id, pdfPage, opts);
                                            }
                                        }
                                        catch (formErr) {
                                            console.warn('Form field error:', formErr);
                                        }
                                    }
                                }
                                catch (e_17_1) { e_17 = { error: e_17_1 }; }
                                finally {
                                    try {
                                        if (_h && !_h.done && (_k = _g.return)) _k.call(_g);
                                    }
                                    finally { if (e_17) throw e_17.error; }
                                }
                            }
                            this.saveProgress = 61;
                            this.loadingMessage = 'กำลัง Serialize PDF...';
                            this.cdr.detectChanges();
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 80); })];
                        case 11:
                            _l.sent();
                            this.revNo += 1;
                            return [4 /*yield*/, pdfDoc.save({ objectsPerTick: 20 })];
                        case 12:
                            pdfBytes = _l.sent();
                            this.lastSavedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
                            // Use original filename if provided, otherwise default to "annotated_rev..."
                            if (this.fileName) {
                                this.lastSavedFileName = this.fileName;
                            }
                            else {
                                this.lastSavedFileName = "annotated_rev" + this.revNo + "_" + Date.now() + ".pdf";
                            }
                            // Create preview using pdf.js to render pages as images
                            return [4 /*yield*/, this.generatePreviewPages()];
                        case 13:
                            // Create preview using pdf.js to render pages as images
                            _l.sent();
                            this.showPreviewOverlay = true;
                            return [3 /*break*/, 16];
                        case 14:
                            e_16 = _l.sent();
                            console.error(e_16);
                            this.presentToast('เกิดข้อผิดพลาดในการบันทึกเอกสาร');
                            return [3 /*break*/, 16];
                        case 15:
                            this.isLoading = false;
                            this.loadingMessage = '';
                            this.saveProgress = 0;
                            return [7 /*endfinally*/];
                        case 16: return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.generatePreviewPages = function () {
            return __awaiter(this, void 0, void 0, function () {
                var arrayBuffer, pdfDoc, total, pagesToRender, annotated_1, idx, pageNum, page, scale, viewport, canvas, ctx;
                var _this = this;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            if (!this.lastSavedBlob)
                                return [2 /*return*/];
                            this.previewPages = [];
                            return [4 /*yield*/, this.lastSavedBlob.arrayBuffer()];
                        case 1:
                            arrayBuffer = _g.sent();
                            return [4 /*yield*/, pdfjsLib__namespace.getDocument({ data: arrayBuffer }).promise];
                        case 2:
                            pdfDoc = _g.sent();
                            total = pdfDoc.numPages;
                            this.previewTotalPages = total;
                            if (total > 10) {
                                annotated_1 = new Set();
                                Object.keys(this.strokes).forEach(function (p) {
                                    var _a;
                                    if ((((_a = _this.strokes[+p]) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0)
                                        annotated_1.add(+p);
                                });
                                Object.keys(this.shapes).forEach(function (p) {
                                    var _a;
                                    if ((((_a = _this.shapes[+p]) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0)
                                        annotated_1.add(+p);
                                });
                                this.shapeStamps.forEach(function (ss) { return annotated_1.add(ss.page); });
                                this.textBoxes.forEach(function (t) { return annotated_1.add(t.page); });
                                this.imageStamps.forEach(function (img) { return annotated_1.add(img.page); });
                                this.signatureStamps.forEach(function (s) { return annotated_1.add(s.page); });
                                this.dateStamps.forEach(function (d) { return annotated_1.add(d.page); });
                                pagesToRender = annotated_1.size > 0 ? Array.from(annotated_1).sort(function (a, b) { return a - b; }) : [1];
                                this.previewIsFiltered = pagesToRender.length < total;
                            }
                            else {
                                pagesToRender = Array.from({ length: total }, function (_, i) { return i + 1; });
                                this.previewIsFiltered = false;
                            }
                            idx = 0;
                            _g.label = 3;
                        case 3:
                            if (!(idx < pagesToRender.length)) return [3 /*break*/, 7];
                            pageNum = pagesToRender[idx];
                            return [4 /*yield*/, pdfDoc.getPage(pageNum)];
                        case 4:
                            page = _g.sent();
                            scale = 1.5;
                            viewport = page.getViewport({ scale: scale });
                            canvas = document.createElement('canvas');
                            ctx = canvas.getContext('2d');
                            canvas.width = viewport.width;
                            canvas.height = viewport.height;
                            return [4 /*yield*/, page.render({ canvasContext: ctx, viewport: viewport }).promise];
                        case 5:
                            _g.sent();
                            this.previewPages.push(canvas.toDataURL('image/png'));
                            // Progress phase 2: generating preview (62–100%)
                            this.saveProgress = 62 + Math.round(((idx + 1) / pagesToRender.length) * 38);
                            this.loadingMessage = "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07 Preview \u0E2B\u0E19\u0E49\u0E32 " + pageNum + " / " + total;
                            this.cdr.detectChanges();
                            _g.label = 6;
                        case 6:
                            idx++;
                            return [3 /*break*/, 3];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.loadAllPreviewPages = function () {
            return __awaiter(this, void 0, void 0, function () {
                var arrayBuffer, pdfDoc, total, i, page, viewport, canvas, ctx;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            if (!this.lastSavedBlob || this.isLoadingAllPreview)
                                return [2 /*return*/];
                            this.isLoadingAllPreview = true;
                            this.previewPages = [];
                            this.cdr.detectChanges();
                            return [4 /*yield*/, this.lastSavedBlob.arrayBuffer()];
                        case 1:
                            arrayBuffer = _g.sent();
                            return [4 /*yield*/, pdfjsLib__namespace.getDocument({ data: arrayBuffer }).promise];
                        case 2:
                            pdfDoc = _g.sent();
                            total = pdfDoc.numPages;
                            i = 1;
                            _g.label = 3;
                        case 3:
                            if (!(i <= total)) return [3 /*break*/, 7];
                            return [4 /*yield*/, pdfDoc.getPage(i)];
                        case 4:
                            page = _g.sent();
                            viewport = page.getViewport({ scale: 1.5 });
                            canvas = document.createElement('canvas');
                            ctx = canvas.getContext('2d');
                            canvas.width = viewport.width;
                            canvas.height = viewport.height;
                            return [4 /*yield*/, page.render({ canvasContext: ctx, viewport: viewport }).promise];
                        case 5:
                            _g.sent();
                            this.previewPages.push(canvas.toDataURL('image/png'));
                            this.cdr.detectChanges();
                            _g.label = 6;
                        case 6:
                            i++;
                            return [3 /*break*/, 3];
                        case 7:
                            this.previewIsFiltered = false;
                            this.isLoadingAllPreview = false;
                            this.cdr.detectChanges();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PdfAnnotatorModalComponent.prototype.confirmSave = function () {
            var e_27, _g;
            if (!this.lastSavedBlob)
                return;
            // Log all signature stamps with Digital ID when confirmed and showDigitalId is enabled
            if (this.showDigitalId) {
                try {
                    for (var _h = __values(this.signatureStamps), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var sig = _j.value;
                        if (sig.digitalId) {
                            var now = new Date();
                            this.logSignatureToDatabase(sig.digitalId, now, sig.page);
                        }
                    }
                }
                catch (e_27_1) { e_27 = { error: e_27_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_g = _h.return)) _g.call(_h);
                    }
                    finally { if (e_27) throw e_27.error; }
                }
            }
            // Log save to history
            this.logHistory('save', {
                signatures: this.signatureStamps.length,
                textBoxes: this.textBoxes.length,
                drawings: Object.values(this.strokes).reduce(function (s, arr) { return s + arr.length; }, 0),
            }, 0);
            this.unlockOrientation();
            this.modalCtrl.dismiss({
                success: true,
                saved: true,
                blob: this.lastSavedBlob,
                fileName: this.lastSavedFileName,
                revNo: this.revNo
            });
        };
        PdfAnnotatorModalComponent.prototype.backToEdit = function () {
            this.showPreviewOverlay = false;
            this.previewUrl = null;
            this.previewPages = [];
        };
        return PdfAnnotatorModalComponent;
    }());
    PdfAnnotatorModalComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'app-pdf-annotator-modal',
                    template: "<ion-header [style.display]=\"showPreviewOverlay ? 'none' : ''\">\n  <ion-toolbar>\n    <!-- <ion-title>PDF Annotator</ion-title> -->\n    <ion-buttons slot=\"end\">\n      <ion-button fill=\"clear\" (click)=\"close()\">\n        <ion-icon name=\"close\"></ion-icon>\n      </ion-button>\n    </ion-buttons>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content class=\"annotator-content\" [scrollY]=\"false\">\n\n  <!-- Loading Spinner Overlay -->\n  <div class=\"loading-overlay\" *ngIf=\"isLoading\">\n    <div class=\"loading-content\" [class.loading-content--progress]=\"saveProgress > 0\">\n\n      <!-- Normal spinner when no save progress -->\n      <ng-container *ngIf=\"saveProgress === 0\">\n        <ion-spinner name=\"crescent\"></ion-spinner>\n        <p class=\"loading-msg\">{{ loadingMessage }}</p>\n      </ng-container>\n\n      <!-- Progress bar UI during save -->\n      <ng-container *ngIf=\"saveProgress > 0\">\n        <div class=\"save-progress-icon\">\n          <ion-icon name=\"document-text-outline\"></ion-icon>\n          <span class=\"save-progress-pct\">{{ saveProgress }}%</span>\n        </div>\n        <div class=\"save-progress-bar-track\">\n          <div class=\"save-progress-bar-fill\" [style.width.%]=\"saveProgress\"\n            [class.save-progress-bar-fill--preview]=\"saveProgress > 61\"\n            [class.save-progress-bar-fill--serializing]=\"saveProgress === 61\"></div>\n        </div>\n        <div class=\"save-progress-phases\">\n          <span [class.active]=\"saveProgress > 0 && saveProgress < 61\">\n            <ion-icon name=\"layers-outline\"></ion-icon> \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01 Annotations\n          </span>\n          <span [class.active]=\"saveProgress === 61\">\n            <ion-icon name=\"archive-outline\"></ion-icon> Serialize PDF\n          </span>\n          <span [class.active]=\"saveProgress > 61\">\n            <ion-icon name=\"image-outline\"></ion-icon> \u0E2A\u0E23\u0E49\u0E32\u0E07 Preview\n          </span>\n        </div>\n        <p class=\"loading-msg\">{{ loadingMessage }}</p>\n      </ng-container>\n\n    </div>\n  </div>\n\n  <!-- New Layout: Top Toolbars + Left Thumbnails + Center Viewer -->\n  <div class=\"annotator-layout-v2\">\n\n    <!-- Top Toolbar Row 1: Zoom & Navigation -->\n    <div class=\"toolbar-row toolbar-row--nav\">\n      <div class=\"toolbar-group\">\n        <button class=\"toolbar-btn\" (click)=\"toggleThumbnails()\" title=\"\u0E41\u0E2A\u0E14\u0E07/\u0E0B\u0E48\u0E2D\u0E19 Thumbnails\">\n          <ion-icon name=\"images-outline\"></ion-icon>\n        </button>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <div class=\"toolbar-group toolbar-group--zoom\">\n        <button class=\"toolbar-btn\" (click)=\"zoomOut()\" [disabled]=\"zoom <= 0.5\">\n          <ion-icon name=\"search-outline\"></ion-icon>\n          <ion-icon name=\"remove-outline\" class=\"zoom-icon\"></ion-icon>\n        </button>\n        <span class=\"toolbar-label\">{{ (zoom * 100) | number:'1.0-0' }}%</span>\n        <button class=\"toolbar-btn\" (click)=\"zoomIn()\" [disabled]=\"zoom >= 3\">\n          <ion-icon name=\"search-outline\"></ion-icon>\n          <ion-icon name=\"add-outline\" class=\"zoom-icon\"></ion-icon>\n        </button>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <div class=\"toolbar-group toolbar-group--pager\">\n        <button class=\"toolbar-btn\" (click)=\"firstPage()\" [disabled]=\"pageNo <= 1\" title=\"\u0E2B\u0E19\u0E49\u0E32\u0E41\u0E23\u0E01\">\n          <ion-icon name=\"play-skip-back\"></ion-icon>\n        </button>\n        <button class=\"toolbar-btn\" (click)=\"prevPage()\" [disabled]=\"pageNo <= 1\" title=\"\u0E2B\u0E19\u0E49\u0E32\u0E01\u0E48\u0E2D\u0E19\">\n          <ion-icon name=\"chevron-back\"></ion-icon>\n        </button>\n        <span class=\"toolbar-label\">\n          {{ pageNo }} / {{ pageCount || '?' }}\n          <span *ngIf=\"loadedUntilPage < pageCount\" class=\"chunk-indicator\"\n            [title]=\"'\u0E42\u0E2B\u0E25\u0E14\u0E41\u0E25\u0E49\u0E27 ' + loadedUntilPage + ' / ' + pageCount + ' \u0E2B\u0E19\u0E49\u0E32'\">\n            <ion-spinner *ngIf=\"isLoadingChunk\" name=\"crescent\" style=\"width:10px;height:10px;\"></ion-spinner>\n            <span *ngIf=\"!isLoadingChunk\">({{ loadedUntilPage }}\u2193)</span>\n          </span>\n        </span>\n        <button class=\"toolbar-btn\" (click)=\"nextPage()\" [disabled]=\"pageNo >= pageCount || isLoadingChunk\" title=\"\u0E2B\u0E19\u0E49\u0E32\u0E16\u0E31\u0E14\u0E44\u0E1B\">\n          <ion-icon name=\"chevron-forward\"></ion-icon>\n        </button>\n        <button class=\"toolbar-btn\" (click)=\"lastPage()\" [disabled]=\"pageNo >= pageCount || isLoadingChunk\" title=\"\u0E2B\u0E19\u0E49\u0E32\u0E2A\u0E38\u0E14\u0E17\u0E49\u0E32\u0E22 (\u0E42\u0E2B\u0E25\u0E14\u0E41\u0E25\u0E49\u0E27 {{ loadedUntilPage }} \u0E2B\u0E19\u0E49\u0E32)\">\n          <ion-icon name=\"play-skip-forward\"></ion-icon>\n        </button>\n      </div>\n\n      <div class=\"toolbar-spacer\"></div>\n\n      <!-- Insert Blank Page + Delete Page -->\n      <div class=\"tool-item insert-page-tool\">\n        <button class=\"toolbar-btn\" (click)=\"showInsertMenu = !showInsertMenu\" title=\"\u0E41\u0E17\u0E23\u0E01/\u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32\">\n          <ion-icon name=\"documents-outline\"></ion-icon>\n          <ion-icon name=\"chevron-down-outline\" class=\"shape-chevron\"></ion-icon>\n        </button>\n\n        <!-- Dropdown -->\n        <div class=\"insert-page-dropdown\" *ngIf=\"showInsertMenu\">\n          <div class=\"insert-page-backdrop\" (click)=\"showInsertMenu = false\"></div>\n          <div class=\"insert-page-menu\">\n\n            <!-- Section: \u0E41\u0E17\u0E23\u0E01\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E1B\u0E25\u0E48\u0E32 -->\n            <div class=\"insert-page-title\">\n              <ion-icon name=\"add-circle-outline\"></ion-icon> \u0E41\u0E17\u0E23\u0E01\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E1B\u0E25\u0E48\u0E32\n            </div>\n\n            <!-- Orientation Toggle -->\n            <div class=\"insert-orient-row\">\n              <span class=\"insert-orient-label\">\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A:</span>\n              <div class=\"insert-orient-group\">\n                <button class=\"insert-orient-btn\"\n                  [class.active]=\"insertOrientation === 'portrait'\"\n                  (click)=\"insertOrientation = 'portrait'\" title=\"\u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07\">\n                  <ion-icon name=\"phone-portrait-outline\"></ion-icon>\n                  <span>\u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07</span>\n                </button>\n                <button class=\"insert-orient-btn\"\n                  [class.active]=\"insertOrientation === 'landscape'\"\n                  (click)=\"insertOrientation = 'landscape'\" title=\"\u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19\">\n                  <ion-icon name=\"phone-landscape-outline\"></ion-icon>\n                  <span>\u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19</span>\n                </button>\n              </div>\n            </div>\n\n            <!-- Before / After -->\n            <button class=\"insert-page-btn\" (click)=\"insertBlankPage('before')\">\n              <ion-icon name=\"arrow-up-outline\"></ion-icon>\n              <span>\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49 <small>(\u0E2B\u0E19\u0E49\u0E32 {{ pageNo }})</small></span>\n            </button>\n            <button class=\"insert-page-btn\" (click)=\"insertBlankPage('after')\">\n              <ion-icon name=\"arrow-down-outline\"></ion-icon>\n              <span>\u0E2B\u0E25\u0E31\u0E07\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49 <small>(\u0E2B\u0E19\u0E49\u0E32 {{ pageNo + 1 }})</small></span>\n            </button>\n\n            <div class=\"insert-menu-divider\"></div>\n\n            <!-- Section: \u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32 -->\n            <div class=\"insert-page-title insert-page-title--danger\">\n              <ion-icon name=\"trash-outline\"></ion-icon> \u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32\n            </div>\n            <button class=\"insert-page-btn insert-page-btn--danger\"\n              [disabled]=\"pageCount <= 1\"\n              (click)=\"deletePage()\">\n              <ion-icon name=\"close-circle-outline\"></ion-icon>\n              <span>\u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49 <small>(\u0E2B\u0E19\u0E49\u0E32 {{ pageNo }})</small></span>\n            </button>\n\n            <div class=\"insert-menu-divider\"></div>\n\n            <!-- Section: \u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A -->\n            <button class=\"insert-page-btn insert-page-btn--undo\"\n              [disabled]=\"!canUndoPageOp\"\n              (click)=\"undoPageOp()\">\n              <ion-icon name=\"arrow-undo-outline\"></ion-icon>\n              <span>\u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E41\u0E17\u0E23\u0E01/\u0E25\u0E1A <small *ngIf=\"!canUndoPageOp\">(\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34)</small></span>\n            </button>\n\n          </div>\n        </div>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <div class=\"toolbar-group toolbar-group--save\">\n        <button class=\"toolbar-btn toolbar-btn--save\" (click)=\"saveDocument()\">\n          <ion-icon name=\"save-outline\"></ion-icon>\n          <span>\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01</span>\n        </button>\n        <!-- User Guide Toggle -->\n        <button class=\"toolbar-btn toolbar-btn--guide\" [class.active]=\"showUserGuidePanel\" (click)=\"toggleUserGuide($event)\" title=\"\u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\">\n          <ion-icon name=\"book\"></ion-icon>\n          <span style=\"font-weight: 500; font-size: 13px;\">\u0E41\u0E19\u0E30\u0E19\u0E33\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19</span>\n        </button>\n        <!-- History Panel Toggle -->\n        <button class=\"toolbar-btn\" [class.active]=\"showHistoryPanel\" (click)=\"toggleHistoryPanel()\" title=\"\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E41\u0E01\u0E49\u0E44\u0E02\">\n          <ion-icon name=\"time-outline\"></ion-icon>\n        </button>\n      </div>\n    </div>\n\n    <!-- Top Toolbar Row 2: Tools -->\n    <div class=\"toolbar-row toolbar-row--tools\">\n      <!-- Text Tool -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"textPlaceMode\" (click)=\"enableTextPlaceMode()\" title=\"\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\">\n          <ion-icon name=\"text\"></ion-icon>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"textPlaceMode\">\n          <button (click)=\"changeTextFontSize(-2)\" [disabled]=\"textFontSize <= 8\"><ion-icon\n              name=\"remove\"></ion-icon></button>\n          <span>{{ textFontSize }}</span>\n          <button (click)=\"changeTextFontSize(2)\" [disabled]=\"textFontSize >= 100\"><ion-icon\n              name=\"add\"></ion-icon></button>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#000\" (click)=\"setTextColor('#000000')\"\n              [class.active]=\"textColor === '#000000'\"></div>\n            <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setTextColor('#0000FF')\"\n              [class.active]=\"textColor === '#0000FF'\"></div>\n            <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setTextColor('#FF0000')\"\n              [class.active]=\"textColor === '#FF0000'\"></div>\n            <div class=\"color-dot color-dot--custom\" [style.background]=\"textColor\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\">\n              <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n              <input type=\"color\" [value]=\"textColor\" (input)=\"setTextColor($any($event.target).value)\">\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- Quick Mark Stamps + Form Fields -->\n      <div class=\"tool-item mark-tool-item\">\n        <button class=\"toolbar-btn mark-toolbar-btn\" [class.active]=\"showMarkOptions || toolMode === 'mark'\"\n          (click)=\"showMarkOptions = !showMarkOptions\" title=\"\u0E41\u0E1A\u0E1A\u0E1F\u0E2D\u0E23\u0E4C\u0E21\">\n          <!-- Fixed form icon: shows checkbox + radio + text rows -->\n          <svg width=\"22\" height=\"22\" viewBox=\"0 0 22 22\" fill=\"none\">\n            <rect x=\"1\" y=\"2\" width=\"7\" height=\"6\" rx=\"1.2\" stroke=\"currentColor\" stroke-width=\"1.6\"/>\n            <polyline points=\"2.5,5 4.2,7 7.5,3\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n            <line x1=\"10\" y1=\"5\" x2=\"21\" y2=\"5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n            <circle cx=\"4.5\" cy=\"14\" r=\"3.2\" stroke=\"currentColor\" stroke-width=\"1.6\"/>\n            <circle cx=\"4.5\" cy=\"14\" r=\"1.5\" fill=\"currentColor\"/>\n            <line x1=\"10\" y1=\"14\" x2=\"21\" y2=\"14\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n            <line x1=\"10\" y1=\"20\" x2=\"21\" y2=\"20\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n            <line x1=\"1\" y1=\"20\" x2=\"7.5\" y2=\"20\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n            <line x1=\"1\" y1=\"17.5\" x2=\"5\" y2=\"17.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n          </svg>\n          <span class=\"mark-btn-label\">\u0E41\u0E1A\u0E1A\u0E1F\u0E2D\u0E23\u0E4C\u0E21</span>\n          <ion-icon name=\"chevron-down-outline\" class=\"mark-chevron\"></ion-icon>\n        </button>\n\n        <div class=\"mark-popup\" *ngIf=\"showMarkOptions\">\n          <!-- Quick Marks section -->\n          <div class=\"mark-popup-section-label\">\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E2B\u0E21\u0E32\u0E22\u0E14\u0E48\u0E27\u0E19</div>\n          <div class=\"mark-quick-row\">\n            <button class=\"mark-quick-btn\" [class.active]=\"toolMode === 'mark' && markType === 'check'\"\n              (click)=\"enableMarkMode('check')\" title=\"\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E2B\u0E21\u0E32\u0E22\u0E16\u0E39\u0E01\">\n              <svg width=\"28\" height=\"28\" viewBox=\"0 0 28 28\"><polyline points=\"4,14 11,21 24,7\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/></svg>\n            </button>\n            <button class=\"mark-quick-btn\" [class.active]=\"toolMode === 'mark' && markType === 'cross'\"\n              (click)=\"enableMarkMode('cross')\" title=\"\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E2B\u0E21\u0E32\u0E22\u0E1C\u0E34\u0E14\">\n              <svg width=\"28\" height=\"28\" viewBox=\"0 0 28 28\"><line x1=\"5\" y1=\"5\" x2=\"23\" y2=\"23\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"23\" y1=\"5\" x2=\"5\" y2=\"23\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/></svg>\n            </button>\n            <button class=\"mark-quick-btn\" [class.active]=\"toolMode === 'mark' && markType === 'dot'\"\n              (click)=\"enableMarkMode('dot')\" title=\"\u0E08\u0E38\u0E14\">\n              <svg width=\"28\" height=\"28\" viewBox=\"0 0 28 28\"><circle cx=\"14\" cy=\"14\" r=\"9\" fill=\"currentColor\"/></svg>\n            </button>\n          </div>\n\n          <!-- Form Fields section -->\n          <div class=\"mark-popup-divider\"></div>\n          <div class=\"mark-popup-section-label\">\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E1F\u0E34\u0E25\u0E14\u0E4C\u0E41\u0E1A\u0E1A\u0E1F\u0E2D\u0E23\u0E4C\u0E21\u0E43\u0E2B\u0E21\u0E48</div>\n          <div class=\"mark-form-list\">\n            <button class=\"mark-form-row-btn\" [class.active]=\"toolMode === 'formfield' && formFieldType === 'text'\"\n              (click)=\"enableFormFieldMode('text')\" title=\"Text Field\">\n              <span class=\"mark-form-row-icon mark-form-row-icon--text\">Aa</span>\n              <span>Text Field</span>\n            </button>\n            <button class=\"mark-form-row-btn\" [class.active]=\"toolMode === 'formfield' && formFieldType === 'checkbox'\"\n              (click)=\"enableFormFieldMode('checkbox')\" title=\"Checkbox\">\n              <span class=\"mark-form-row-icon\">\n                <svg width=\"18\" height=\"18\" viewBox=\"0 0 18 18\"><rect x=\"1\" y=\"1\" width=\"16\" height=\"16\" rx=\"2.5\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\"/><polyline points=\"4,9 7,13 14,5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/></svg>\n              </span>\n              <span>Checkbox</span>\n            </button>\n            <button class=\"mark-form-row-btn\" [class.active]=\"toolMode === 'formfield' && formFieldType === 'radio'\"\n              (click)=\"enableFormFieldMode('radio')\" title=\"Radio Button\">\n              <span class=\"mark-form-row-icon\">\n                <svg width=\"18\" height=\"18\" viewBox=\"0 0 18 18\"><circle cx=\"9\" cy=\"9\" r=\"8\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"9\" cy=\"9\" r=\"4\" fill=\"currentColor\"/></svg>\n              </span>\n              <span>Radio Button</span>\n            </button>\n          </div>\n\n          <!-- Size + Color controls (compact, below fold) -->\n          <div class=\"mark-popup-divider\"></div>\n          <div class=\"mark-controls-row\">\n            <button (click)=\"changeMarkSize(-4)\" [disabled]=\"markSize <= 12\"><ion-icon name=\"remove\"></ion-icon></button>\n            <span class=\"mark-size-val\">{{ markSize }}</span>\n            <button (click)=\"changeMarkSize(4)\" [disabled]=\"markSize >= 96\"><ion-icon name=\"add\"></ion-icon></button>\n            <div class=\"color-dots\" style=\"margin-left: 6px;\">\n              <div class=\"color-dot\" style=\"background:#000\" (click)=\"setMarkColor('#000000')\" [class.active]=\"markColor === '#000000'\"></div>\n              <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setMarkColor('#0000FF')\" [class.active]=\"markColor === '#0000FF'\"></div>\n              <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setMarkColor('#FF0000')\" [class.active]=\"markColor === '#FF0000'\"></div>\n              <div class=\"color-dot\" style=\"background:#009900\" (click)=\"setMarkColor('#009900')\" [class.active]=\"markColor === '#009900'\"></div>\n              <div class=\"color-dot color-dot--custom\" [style.background]=\"markColor\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\">\n                <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n                <input type=\"color\" [value]=\"markColor\" (input)=\"setMarkColor($any($event.target).value)\">\n              </div>\n            </div>\n          </div>\n\n          <!-- Cancel / close popup -->\n          <div class=\"mark-popup-divider\"></div>\n          <button class=\"mark-cancel-btn\" (click)=\"showMarkOptions = false; toolMode = 'none'; updateCursor()\">\n            <ion-icon name=\"close-outline\"></ion-icon>\n            \u0E22\u0E01\u0E40\u0E25\u0E34\u0E01\n          </button>\n        </div>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <!-- Shapes \u2014 Dropdown -->\n      <div class=\"tool-item shape-tool-item\">\n        <!-- Main shape button: shows current shape icon, click to activate/toggle dropdown -->\n        <button class=\"toolbar-btn\" [class.active]=\"shapeMode\"\n          (click)=\"toolMode='shape'; showShapeDropdown=!showShapeDropdown\" title=\"\u0E23\u0E39\u0E1B\u0E17\u0E23\u0E07\">\n          <ion-icon [name]=\"shapeType === 'rect' ? 'square-outline'\n                          : shapeType === 'circle' ? 'ellipse-outline'\n                          : shapeType === 'line' ? 'remove-outline'\n                          : 'arrow-forward-outline'\"></ion-icon>\n          <ion-icon name=\"chevron-down-outline\" class=\"shape-chevron\"></ion-icon>\n        </button>\n\n        <!-- Dropdown: choose shape type -->\n        <div class=\"shape-dropdown\" *ngIf=\"showShapeDropdown\">\n          <button class=\"shape-dd-btn\" [class.active]=\"shapeType === 'rect'\" (click)=\"selectShape('rect')\"\n            title=\"\u0E2A\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E35\u0E48\u0E22\u0E21\">\n            <ion-icon name=\"square-outline\"></ion-icon>\n          </button>\n          <button class=\"shape-dd-btn\" [class.active]=\"shapeType === 'circle'\" (click)=\"selectShape('circle')\"\n            title=\"\u0E27\u0E07\u0E01\u0E25\u0E21\">\n            <ion-icon name=\"ellipse-outline\"></ion-icon>\n          </button>\n          <button class=\"shape-dd-btn\" [class.active]=\"shapeType === 'line'\" (click)=\"selectShape('line')\" title=\"\u0E40\u0E2A\u0E49\u0E19\">\n            <ion-icon name=\"remove-outline\"></ion-icon>\n          </button>\n          <button class=\"shape-dd-btn\" [class.active]=\"shapeType === 'arrow'\" (click)=\"selectShape('arrow')\"\n            title=\"\u0E25\u0E39\u0E01\u0E28\u0E23\">\n            <ion-icon name=\"arrow-forward-outline\"></ion-icon>\n          </button>\n        </div>\n\n        <!-- Options panel: stroke width, stroke color, fill color -->\n        <div class=\"shape-options-panel\" *ngIf=\"shapeMode\">\n\n          <!-- Stroke width -->\n          <div class=\"shape-opt-group\">\n            <span class=\"shape-opt-label\">\u0E02\u0E19\u0E32\u0E14</span>\n            <button class=\"sopt-btn\" (click)=\"changeShapeStrokeSize(-1)\" [disabled]=\"shapeStrokeSize <= 1\">\n              <ion-icon name=\"remove\"></ion-icon>\n            </button>\n            <span class=\"sopt-val\">{{ shapeStrokeSize }}</span>\n            <button class=\"sopt-btn\" (click)=\"changeShapeStrokeSize(1)\" [disabled]=\"shapeStrokeSize >= 20\">\n              <ion-icon name=\"add\"></ion-icon>\n            </button>\n          </div>\n\n          <div class=\"sopt-divider\"></div>\n\n          <!-- Stroke color (disabled when no-stroke is on) -->\n          <div class=\"shape-opt-group\">\n            <span class=\"shape-opt-label\">\u0E40\u0E2A\u0E49\u0E19\u0E02\u0E2D\u0E1A</span>\n            <!-- No stroke toggle -->\n            <button class=\"sopt-fill-toggle\" [class.active]=\"shapeNoStroke\" (click)=\"toggleShapeNoStroke()\"\n              title=\"\u0E44\u0E21\u0E48\u0E21\u0E35\u0E40\u0E2A\u0E49\u0E19\u0E02\u0E2D\u0E1A\">\n              <ion-icon name=\"ban-outline\"></ion-icon>\n            </button>\n            <div class=\"mac-color-grid\" [class.disabled]=\"shapeNoStroke\">\n              <div class=\"mac-swatch\" *ngFor=\"let c of shapeColorSwatches\" [style.background]=\"c\"\n                [class.active]=\"shapeStrokeColor === c && !shapeNoStroke\"\n                (click)=\"!shapeNoStroke && setShapeStrokeColor(c)\" [title]=\"c\"></div>\n            </div>\n            <div class=\"mac-custom-color\" [class.disabled]=\"shapeNoStroke\">\n              <div class=\"mac-swatch mac-swatch--current\" [style.background]=\"shapeStrokeColor\"></div>\n              <input type=\"color\" [value]=\"shapeStrokeColor\" (input)=\"setShapeStrokeColor($any($event.target).value)\"\n                [disabled]=\"shapeNoStroke\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\" />\n            </div>\n          </div>\n\n          <div class=\"sopt-divider\"></div>\n\n          <!-- Fill color -->\n          <div class=\"shape-opt-group\">\n            <span class=\"shape-opt-label\">\u0E2A\u0E35\u0E1E\u0E37\u0E49\u0E19</span>\n            <button class=\"sopt-fill-toggle\" [class.active]=\"shapeFillEnabled\" (click)=\"toggleShapeFill()\"\n              title=\"\u0E40\u0E1B\u0E34\u0E14/\u0E1B\u0E34\u0E14\u0E2A\u0E35\u0E1E\u0E37\u0E49\u0E19\">\n              <ion-icon [name]=\"shapeFillEnabled ? 'color-fill' : 'color-fill-outline'\"></ion-icon>\n            </button>\n            <div class=\"mac-color-grid\" [class.disabled]=\"!shapeFillEnabled\">\n              <div class=\"mac-swatch\" *ngFor=\"let c of shapeFillSwatches\" [style.background]=\"c\"\n                [class.active]=\"shapeFillColor === c && shapeFillEnabled\"\n                (click)=\"shapeFillEnabled && setShapeFillColor(c)\" [title]=\"c\"></div>\n            </div>\n            <div class=\"mac-custom-color\" [class.disabled]=\"!shapeFillEnabled\">\n              <div class=\"mac-swatch mac-swatch--current\" [style.background]=\"shapeFillColor\"></div>\n              <input type=\"color\" [value]=\"shapeFillColor\" (input)=\"setShapeFillColor($any($event.target).value)\"\n                [disabled]=\"!shapeFillEnabled\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E1E\u0E37\u0E49\u0E19\u0E40\u0E2D\u0E07\" />\n            </div>\n          </div>\n\n        </div>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <!-- Draw Tool -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"drawMode\" (click)=\"toggleDraw()\" title=\"\u0E27\u0E32\u0E14\">\n          <ion-icon name=\"brush\"></ion-icon>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"drawMode\">\n          <button (click)=\"changeBrushSize(-1)\" [disabled]=\"brushSize <= 1\"><ion-icon name=\"remove\"></ion-icon></button>\n          <span>{{ brushSize }}</span>\n          <button (click)=\"changeBrushSize(1)\" [disabled]=\"brushSize >= 50\"><ion-icon name=\"add\"></ion-icon></button>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#000\" (click)=\"setBrushColor('#000000')\"\n              [class.active]=\"brushColor === '#000000'\"></div>\n            <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setBrushColor('#0000FF')\"\n              [class.active]=\"brushColor === '#0000FF'\"></div>\n            <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setBrushColor('#FF0000')\"\n              [class.active]=\"brushColor === '#FF0000'\"></div>\n            <div class=\"color-dot color-dot--custom\" [style.background]=\"brushColor\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\">\n              <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n              <input type=\"color\" [value]=\"brushColor\" (input)=\"setBrushColor($any($event.target).value)\">\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- Highlight Tool -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"highlightMode\" (click)=\"toggleHighlight()\" title=\"\u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C\">\n          <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n            <!-- Marker Body -->\n            <path d=\"M18 2l4 4L9 19H5v-4L18 2z\"></path>\n            <path d=\"M14 6l4 4\"></path>\n            <!-- Highlight Line -->\n            <line x1=\"3\" y1=\"22\" x2=\"21\" y2=\"22\" stroke-width=\"3\"></line>\n          </svg>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"highlightMode\">\n          <button (click)=\"changeHighlightSize(-5)\" [disabled]=\"highlightSize <= 5\"><ion-icon\n              name=\"remove\"></ion-icon></button>\n          <span>{{ highlightSize }}</span>\n          <button (click)=\"changeHighlightSize(5)\" [disabled]=\"highlightSize >= 100\"><ion-icon\n              name=\"add\"></ion-icon></button>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#ffff00\" (click)=\"setHighlightColor('#ffff00')\"\n              [class.active]=\"highlightColor === '#ffff00'\" title=\"\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E07\"></div>\n            <div class=\"color-dot\" style=\"background:#00ff00\" (click)=\"setHighlightColor('#00ff00')\"\n              [class.active]=\"highlightColor === '#00ff00'\" title=\"\u0E40\u0E02\u0E35\u0E22\u0E27\"></div>\n            <div class=\"color-dot\" style=\"background:#00ffff\" (click)=\"setHighlightColor('#00ffff')\"\n              [class.active]=\"highlightColor === '#00ffff'\" title=\"\u0E1F\u0E49\u0E32\"></div>\n            <div class=\"color-dot\" style=\"background:#ff99c2\" (click)=\"setHighlightColor('#ff99c2')\"\n              [class.active]=\"highlightColor === '#ff99c2'\" title=\"\u0E0A\u0E21\u0E1E\u0E39\"></div>\n            <div class=\"color-dot\" style=\"background:#ffb366\" (click)=\"setHighlightColor('#ffb366')\"\n              [class.active]=\"highlightColor === '#ffb366'\" title=\"\u0E2A\u0E49\u0E21\"></div>\n            <div class=\"color-dot\" style=\"background:#d9b3ff\" (click)=\"setHighlightColor('#d9b3ff')\"\n              [class.active]=\"highlightColor === '#d9b3ff'\" title=\"\u0E21\u0E48\u0E27\u0E07\"></div>\n            <div class=\"color-dot color-dot--custom\" [style.background]=\"highlightColor\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\u0E23\u0E2B\u0E31\u0E2A HEX\">\n              <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n              <input type=\"color\" [value]=\"highlightColor\" (input)=\"setHighlightColor($any($event.target).value)\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\">\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- Eraser -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"eraserMode\" (click)=\"toggleEraser()\" title=\"\u0E22\u0E32\u0E07\u0E25\u0E1A (\u0E25\u0E1A\u0E40\u0E2A\u0E49\u0E19\u0E41\u0E25\u0E30\u0E23\u0E39\u0E1B\u0E17\u0E23\u0E07)\">\n          <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n            <path d=\"M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4C13.5 3.5 14.5 3.5 15 4L20 9C20.5 9.5 20.5 10.5 20 11L11 20H20V20Z\"/>\n            <path d=\"M17.5 15L9 6.5\"/>\n          </svg>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"eraserMode\">\n          <button (click)=\"changeEraserSize(-5)\" [disabled]=\"eraserSize <= 5\"><ion-icon name=\"remove\"></ion-icon></button>\n          <span>{{ eraserSize }}</span>\n          <button (click)=\"changeEraserSize(5)\" [disabled]=\"eraserSize >= 200\"><ion-icon name=\"add\"></ion-icon></button>\n        </div>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <!-- Insert Tools -->\n      <button class=\"toolbar-btn\" (click)=\"openSignaturePickerOrPad()\" title=\"\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\">\n        <ion-icon name=\"finger-print\"></ion-icon>\n      </button>\n      <button class=\"toolbar-btn toolbar-btn--toggle\" [class.active]=\"showDigitalId\"\n        (click)=\"showDigitalId = !showDigitalId\" title=\"\u0E41\u0E2A\u0E14\u0E07/\u0E0B\u0E48\u0E2D\u0E19 Digital ID\">\n        <ion-icon [name]=\"showDigitalId ? 'shield-checkmark' : 'shield-checkmark-outline'\"></ion-icon>\n        <span class=\"toggle-label\">DID</span>\n      </button>\n\n      <!-- Date Stamp with Options -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"showDateOptions\" (click)=\"addDateStampAndShowOptions()\"\n          title=\"\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\">\n          <ion-icon name=\"calendar\"></ion-icon>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"showDateOptions\">\n          <button (click)=\"changeDateFontSize(-2)\" [disabled]=\"dateFontSize <= 8\"><ion-icon\n              name=\"remove\"></ion-icon></button>\n          <span>{{ dateFontSize }}</span>\n          <button (click)=\"changeDateFontSize(2)\" [disabled]=\"dateFontSize >= 100\"><ion-icon\n              name=\"add\"></ion-icon></button>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#000\" (click)=\"setDateColor('#000000')\"\n              [class.active]=\"dateColor === '#000000'\"></div>\n            <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setDateColor('#0000FF')\"\n              [class.active]=\"dateColor === '#0000FF'\"></div>\n            <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setDateColor('#FF0000')\"\n              [class.active]=\"dateColor === '#FF0000'\"></div>\n            <div class=\"color-dot color-dot--custom\" [style.background]=\"dateColor\" title=\"\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\">\n              <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n              <input type=\"color\" [value]=\"dateColor\" (input)=\"setDateColor($any($event.target).value)\">\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <button class=\"toolbar-btn\" (click)=\"triggerImageUpload()\" title=\"\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E\">\n        <ion-icon name=\"image\"></ion-icon>\n      </button>\n      <input type=\"file\" #fileInput accept=\"image/*\" style=\"display:none\" (change)=\"onImageSelected($event)\">\n\n      <div class=\"toolbar-divider\"></div>\n\n      <!-- Undo/Redo -->\n      <button class=\"toolbar-btn\" (click)=\"undo()\" [disabled]=\"!canUndo()\" title=\"\u0E40\u0E25\u0E34\u0E01\u0E17\u0E33\">\n        <ion-icon name=\"arrow-undo\"></ion-icon>\n      </button>\n      <button class=\"toolbar-btn\" (click)=\"redo()\" [disabled]=\"!canRedo()\" title=\"\u0E17\u0E33\u0E0B\u0E49\u0E33\">\n        <ion-icon name=\"arrow-redo\"></ion-icon>\n      </button>\n      <button class=\"toolbar-btn toolbar-btn--danger\" (click)=\"clearAnnotations()\" title=\"\u0E25\u0E49\u0E32\u0E07\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14\">\n        <ion-icon name=\"trash\"></ion-icon>\n      </button>\n    </div>\n\n    <!-- Main Content Area: Thumbnails + Viewer -->\n    <div class=\"main-area\">\n\n      <!-- Left Thumbnails Sidebar -->\n      <aside class=\"thumbnails-sidebar\" *ngIf=\"showThumbnails\">\n        <div class=\"thumb-list\">\n\n          <!-- Top insert button (before page 1) -->\n          <div class=\"thumb-insert-row\">\n            <button class=\"thumb-add-btn\" (click)=\"toggleThumbInsert(0, $event)\" title=\"\u0E41\u0E17\u0E23\u0E01\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32 1\">\n              <ion-icon name=\"add\"></ion-icon>\n            </button>\n          </div>\n\n          <!-- Each thumbnail + its action bar + insert button after it -->\n          <ng-container *ngFor=\"let thumb of pageThumbnails; let i = index\">\n\n            <!-- Thumbnail card wrapper -->\n            <div class=\"thumb-card-wrap\">\n              <!-- Clickable thumbnail -->\n              <div class=\"thumb-card\" [class.active]=\"pageNo === i + 1\"\n                [id]=\"'thumb-' + (i + 1)\" (click)=\"goToPage(i + 1)\">\n                <div class=\"thumb-card__img-wrap\">\n                  <img [src]=\"thumb\" [alt]=\"'Page ' + (i + 1)\">\n                </div>\n                <span class=\"thumb-card__label\">{{ i + 1 }}</span>\n              </div>\n\n              <!-- Per-page action bar -->\n              <div class=\"thumb-card__actions\" (click)=\"$event.stopPropagation()\">\n                <button class=\"thumb-action-btn\" (click)=\"movePageToIndex(i + 1, 'up')\"\n                  [disabled]=\"i === 0\" title=\"\u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E02\u0E36\u0E49\u0E19\">\n                  <ion-icon name=\"chevron-up-outline\"></ion-icon>\n                </button>\n                <button class=\"thumb-action-btn\" (click)=\"movePageToIndex(i + 1, 'down')\"\n                  [disabled]=\"i === pageThumbnails.length - 1\" title=\"\u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E25\u0E07\">\n                  <ion-icon name=\"chevron-down-outline\"></ion-icon>\n                </button>\n                <button class=\"thumb-action-btn\" (click)=\"undoPageOp()\"\n                  [disabled]=\"!canUndoPageOp\" title=\"\u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A\">\n                  <ion-icon name=\"arrow-undo-outline\"></ion-icon>\n                </button>\n                <button class=\"thumb-action-btn thumb-action-btn--danger\"\n                  (click)=\"deleteSpecificPage(i + 1)\" [disabled]=\"pageCount <= 1\" title=\"\u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32\">\n                  <ion-icon name=\"trash-outline\"></ion-icon>\n                </button>\n              </div>\n            </div>\n\n            <!-- Insert button after each page -->\n            <div class=\"thumb-insert-row\">\n              <button class=\"thumb-add-btn\" (click)=\"toggleThumbInsert(i + 1, $event)\" title=\"\u0E41\u0E17\u0E23\u0E01\u0E2B\u0E19\u0E49\u0E32\">\n                <ion-icon name=\"add\"></ion-icon>\n              </button>\n            </div>\n\n          </ng-container>\n\n        </div>\n\n        <!-- Hidden file input -->\n        <input type=\"file\" #thumbFileInput accept=\"image/*,.pdf\" style=\"display:none\"\n          (change)=\"onThumbFileSelected($event)\">\n\n      </aside>\n\n      <!-- Insert Dropdown Overlay (outside aside \u2014 fixed position, no clipping) -->\n      <div class=\"thumb-insert-overlay\" *ngIf=\"thumbInsertIndex >= 0\"\n        [style.top.px]=\"thumbDropdownTop\">\n        <div class=\"thumb-insert-backdrop\" (click)=\"thumbInsertIndex = -1\"></div>\n        <div class=\"thumb-insert-menu\">\n          <button class=\"thumb-insert-opt\" (click)=\"insertAtThumb(thumbInsertIndex, 'portrait')\">\n            <ion-icon name=\"phone-portrait-outline\"></ion-icon>\n            \u0E2B\u0E19\u0E49\u0E32\u0E40\u0E1B\u0E25\u0E48\u0E32 \u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07\n          </button>\n          <button class=\"thumb-insert-opt\" (click)=\"insertAtThumb(thumbInsertIndex, 'landscape')\">\n            <ion-icon name=\"phone-landscape-outline\"></ion-icon>\n            \u0E2B\u0E19\u0E49\u0E32\u0E40\u0E1B\u0E25\u0E48\u0E32 \u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19\n          </button>\n          <button class=\"thumb-insert-opt\" (click)=\"triggerThumbFileUpload(thumbInsertIndex)\">\n            <ion-icon name=\"document-outline\"></ion-icon>\n            \u0E41\u0E17\u0E23\u0E01\u0E44\u0E1F\u0E25\u0E4C PDF/\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E\n          </button>\n        </div>\n      </div>\n\n      <!-- Viewer -->\n      <div class=\"viewer-wrapper\">\n        <div class=\"viewer-container\" #viewerContainer (scroll)=\"onViewerScroll($event)\">\n          <!-- Render all pages for continuous scroll -->\n          <div *ngFor=\"let p of pages\" class=\"page-container\" [attr.data-page]=\"p\" [id]=\"'page-' + p\">\n            <canvas [id]=\"'pdfCanvas-' + p\" class=\"pdf-canvas\"></canvas>\n            <canvas [id]=\"'annotCanvas-' + p\" class=\"annot-canvas\" [class.tools-active]=\"toolMode !== 'none'\"></canvas>\n\n            <!-- TextBoxes for this page -->\n            <div *ngFor=\"let tb of getTextBoxesForPage(p)\" class=\"text-box\" [class.active]=\"activeTextBoxId === tb.id\"\n              [style.left.%]=\"tb.x\" [style.top.%]=\"tb.y\" [style.width.%]=\"tb.width\" [style.height.%]=\"tb.height\"\n              [style.color]=\"tb.color\" [style.font-size.px]=\"tb.fontSize * zoom\"\n              [style.font-weight]=\"tb.bold ? 'bold' : 'normal'\" [style.font-style]=\"tb.italic ? 'italic' : 'normal'\"\n              [style.text-align]=\"tb.align\" [style.z-index]=\"tb.zIndex || 10\"\n              (pointerdown)=\"startDrag($event, tb.id)\" (contextmenu)=\"onContextMenu($event, tb.id, 'text')\">\n              <div class=\"tb-handle tb-handle--left\" (pointerdown)=\"startResizeLeft($event, tb.id)\"></div>\n              <textarea [(ngModel)]=\"tb.text\" (focus)=\"activeTextBoxId = tb.id\" (input)=\"onTextBoxInput($event, tb)\"\n                spellcheck=\"false\"></textarea>\n              <div class=\"tb-handle tb-handle--right\" (pointerdown)=\"startResizeRight($event, tb.id)\"></div>\n            </div>\n            <!-- ShapeStamps for this page (draggable/resizable SVG overlays) -->\n            <div *ngFor=\"let ss of getShapeStampsForPage(p)\" class=\"shape-stamp\" [style.left.%]=\"ss.x\"\n              [style.top.%]=\"ss.y\" [style.width.%]=\"ss.width\" [style.height.%]=\"ss.height\"\n              [style.z-index]=\"ss.zIndex || 10\" (pointerdown)=\"startShapeDrag($event, ss.id)\"\n              (contextmenu)=\"onContextMenu($event, ss.id, 'shape')\">\n              <button class=\"remove-btn\" (click)=\"removeShapeStamp(ss.id); $event.stopPropagation()\"><ion-icon name=\"close-outline\"></ion-icon></button>\n\n              <!-- SVG renders the actual shape inside the bounding box -->\n              <svg width=\"100%\" height=\"100%\" [attr.viewBox]=\"'0 0 100 100'\" preserveAspectRatio=\"none\"\n                style=\"overflow:visible; pointer-events:none\">\n                <!-- rect -->\n                <rect *ngIf=\"ss.type === 'rect'\" x=\"0\" y=\"0\" width=\"100\" height=\"100\"\n                  [attr.stroke]=\"ss.strokeColor || 'none'\" [attr.stroke-width]=\"ss.strokeWidth\"\n                  vector-effect=\"non-scaling-stroke\" [attr.fill]=\"ss.fillColor || 'none'\"></rect>\n                <!-- circle -->\n                <ellipse *ngIf=\"ss.type === 'circle'\" cx=\"50\" cy=\"50\" rx=\"50\" ry=\"50\"\n                  [attr.stroke]=\"ss.strokeColor || 'none'\" [attr.stroke-width]=\"ss.strokeWidth\"\n                  vector-effect=\"non-scaling-stroke\" [attr.fill]=\"ss.fillColor || 'none'\"></ellipse>\n                <!-- line -->\n                <line *ngIf=\"ss.type === 'line'\" [attr.x1]=\"ss.startFracX * 100\" [attr.y1]=\"ss.startFracY * 100\"\n                  [attr.x2]=\"ss.endFracX * 100\" [attr.y2]=\"ss.endFracY * 100\" [attr.stroke]=\"ss.strokeColor || '#000'\"\n                  [attr.stroke-width]=\"ss.strokeWidth\" vector-effect=\"non-scaling-stroke\" fill=\"none\"></line>\n                <!-- arrow -->\n                <g *ngIf=\"ss.type === 'arrow'\">\n                  <line [attr.x1]=\"ss.startFracX * 100\" [attr.y1]=\"ss.startFracY * 100\" [attr.x2]=\"ss.endFracX * 100\"\n                    [attr.y2]=\"ss.endFracY * 100\" [attr.stroke]=\"ss.strokeColor || '#000'\"\n                    [attr.stroke-width]=\"ss.strokeWidth\" vector-effect=\"non-scaling-stroke\" fill=\"none\">\n                  </line>\n                  <polygon [attr.points]=\"'0,-6 12,0 0,6'\" [attr.fill]=\"ss.strokeColor || '#000'\"\n                    [attr.transform]=\"'translate(' + (ss.endFracX*100) + ',' + (ss.endFracY*100) + ') rotate(' + getArrowAngleDeg(ss) + ')'\">\n                  </polygon>\n                </g>\n              </svg>\n\n              <!-- Resize handles (corner + edge) -->\n              <div class=\"resize-handle rh-nw\" (pointerdown)=\"startShapeResize($event, ss.id, 'nw')\"></div>\n              <div class=\"resize-handle rh-n\" (pointerdown)=\"startShapeResize($event, ss.id, 'n')\"></div>\n              <div class=\"resize-handle rh-ne\" (pointerdown)=\"startShapeResize($event, ss.id, 'ne')\"></div>\n              <div class=\"resize-handle rh-e\" (pointerdown)=\"startShapeResize($event, ss.id, 'e')\"></div>\n              <div class=\"resize-handle rh-se\" (pointerdown)=\"startShapeResize($event, ss.id, 'se')\"></div>\n              <div class=\"resize-handle rh-s\" (pointerdown)=\"startShapeResize($event, ss.id, 's')\"></div>\n              <div class=\"resize-handle rh-sw\" (pointerdown)=\"startShapeResize($event, ss.id, 'sw')\"></div>\n              <div class=\"resize-handle rh-w\" (pointerdown)=\"startShapeResize($event, ss.id, 'w')\"></div>\n            </div>\n\n            <!-- Regular image stamps (uploaded images, not marks) -->\n            <div *ngFor=\"let img of getRegularImageStampsForPage(p)\" class=\"image-stamp\"\n              [style.left.%]=\"img.x\"\n              [style.top.%]=\"img.y\" [style.width.%]=\"img.width\" [style.height.%]=\"img.height\"\n              [style.z-index]=\"img.zIndex || 10\" (pointerdown)=\"startImageDrag($event, img.id)\"\n              (contextmenu)=\"onContextMenu($event, img.id, 'image')\">\n              <button class=\"remove-btn\" (click)=\"removeImage(img.id); $event.stopPropagation()\"><ion-icon name=\"close-outline\"></ion-icon></button>\n              <img [src]=\"img.dataUrl\" />\n              <div class=\"resize-handle rh-nw\" (pointerdown)=\"startImageResize($event, img.id, 'nw')\"></div>\n              <div class=\"resize-handle rh-n\" (pointerdown)=\"startImageResize($event, img.id, 'n')\"></div>\n              <div class=\"resize-handle rh-ne\" (pointerdown)=\"startImageResize($event, img.id, 'ne')\"></div>\n              <div class=\"resize-handle rh-e\" (pointerdown)=\"startImageResize($event, img.id, 'e')\"></div>\n              <div class=\"resize-handle rh-se\" (pointerdown)=\"startImageResize($event, img.id, 'se')\"></div>\n              <div class=\"resize-handle rh-s\" (pointerdown)=\"startImageResize($event, img.id, 's')\"></div>\n              <div class=\"resize-handle rh-sw\" (pointerdown)=\"startImageResize($event, img.id, 'sw')\"></div>\n              <div class=\"resize-handle rh-w\" (pointerdown)=\"startImageResize($event, img.id, 'w')\"></div>\n            </div>\n\n            <!-- Mark stamps (check/cross/dot) \u2014 rendered as SVG, behaves like form field checkbox -->\n            <div *ngFor=\"let mk of getMarkStampsForPage(p)\" class=\"pdf-form-field pff-mark\"\n              [class.pff-active]=\"activeObjectId === mk.id\"\n              [style.left.%]=\"mk.x\" [style.top.%]=\"mk.y\"\n              [style.width.%]=\"mk.width\" [style.height.%]=\"mk.height\"\n              [style.z-index]=\"mk.zIndex || 10\"\n              (pointerdown)=\"startMarkDrag($event, mk.id)\"\n              (contextmenu)=\"onContextMenu($event, mk.id, 'image')\">\n\n              <!-- Options bar when active -->\n              <div class=\"pff-options-bar\" *ngIf=\"activeObjectId === mk.id\" (pointerdown)=\"$event.stopPropagation()\">\n                <span class=\"pff-opt-label\"><ion-icon name=\"resize-outline\"></ion-icon></span>\n                <button class=\"pff-opt-btn\" (click)=\"changeMarkStampSize(mk.id, -1)\" [disabled]=\"mk.width <= 1\" title=\"\u0E25\u0E14\u0E02\u0E19\u0E32\u0E14\">\n                  <ion-icon name=\"remove\"></ion-icon>\n                </button>\n                <span class=\"pff-opt-val\">{{ mk.width | number:'1.0-1' }}</span>\n                <button class=\"pff-opt-btn\" (click)=\"changeMarkStampSize(mk.id, 1)\" [disabled]=\"mk.width >= 25\" title=\"\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E19\u0E32\u0E14\">\n                  <ion-icon name=\"add\"></ion-icon>\n                </button>\n                <div class=\"pff-opt-sep\"></div>\n                <button class=\"pff-opt-btn pff-opt-delete\" (click)=\"removeImage(mk.id); $event.stopPropagation()\" title=\"\u0E25\u0E1A\">\n                  <ion-icon name=\"trash-outline\"></ion-icon>\n                </button>\n              </div>\n\n              <!-- SVG mark symbol fills the bounding box exactly -->\n              <div class=\"pff-inner\">\n                <svg width=\"100%\" height=\"100%\" viewBox=\"0 0 100 100\" style=\"pointer-events:none; overflow:visible\">\n                  <ng-container *ngIf=\"mk.markType === 'check'\">\n                    <polyline points=\"12,52 42,82 88,18\" [attr.stroke]=\"mk.markColor || '#000000'\" stroke-width=\"10\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/>\n                  </ng-container>\n                  <ng-container *ngIf=\"mk.markType === 'cross'\">\n                    <line x1=\"15\" y1=\"15\" x2=\"85\" y2=\"85\" [attr.stroke]=\"mk.markColor || '#000000'\" stroke-width=\"10\" stroke-linecap=\"round\"/>\n                    <line x1=\"85\" y1=\"15\" x2=\"15\" y2=\"85\" [attr.stroke]=\"mk.markColor || '#000000'\" stroke-width=\"10\" stroke-linecap=\"round\"/>\n                  </ng-container>\n                  <ng-container *ngIf=\"mk.markType === 'dot' || !mk.markType\">\n                    <circle cx=\"50\" cy=\"50\" r=\"38\" [attr.fill]=\"mk.markColor || '#000000'\"/>\n                  </ng-container>\n                </svg>\n              </div>\n\n              <div class=\"pff-resize-handle rh-nw\" (pointerdown)=\"startImageResize($event, mk.id, 'nw')\"></div>\n              <div class=\"pff-resize-handle rh-n\"  (pointerdown)=\"startImageResize($event, mk.id, 'n')\"></div>\n              <div class=\"pff-resize-handle rh-ne\" (pointerdown)=\"startImageResize($event, mk.id, 'ne')\"></div>\n              <div class=\"pff-resize-handle rh-e\"  (pointerdown)=\"startImageResize($event, mk.id, 'e')\"></div>\n              <div class=\"pff-resize-handle rh-se\" (pointerdown)=\"startImageResize($event, mk.id, 'se')\"></div>\n              <div class=\"pff-resize-handle rh-s\"  (pointerdown)=\"startImageResize($event, mk.id, 's')\"></div>\n              <div class=\"pff-resize-handle rh-sw\" (pointerdown)=\"startImageResize($event, mk.id, 'sw')\"></div>\n              <div class=\"pff-resize-handle rh-w\"  (pointerdown)=\"startImageResize($event, mk.id, 'w')\"></div>\n            </div>\n\n            <div *ngFor=\"let sig of getSignatureStampsForPage(p)\" class=\"signature-stamp\" [style.left.%]=\"sig.x\"\n              [style.top.%]=\"sig.y\" [style.width.%]=\"sig.width\" [style.height.%]=\"sig.height\"\n              [style.z-index]=\"sig.zIndex || 10\" (pointerdown)=\"startSignatureDrag($event, sig.id)\"\n              (contextmenu)=\"onContextMenu($event, sig.id, 'signature')\">\n              <button class=\"remove-btn\" (click)=\"removeSignature(sig.id); $event.stopPropagation()\"><ion-icon name=\"close-outline\"></ion-icon></button>\n              <img [src]=\"sig.dataUrl\" />\n              <div class=\"digital-id-label\" *ngIf=\"showDigitalId && (sig.digitalId || sig.signDate)\">\n                <span *ngIf=\"sig.signDate\">{{ sig.signDate }}</span>\n                <span *ngIf=\"sig.signTime\">{{ sig.signTime }}</span>\n                <span *ngIf=\"sig.digitalId\" class=\"did-text\">{{ sig.digitalId }}</span>\n              </div>\n              <div class=\"resize-handle rh-nw\" (pointerdown)=\"startSignatureResize($event, sig.id, 'nw')\"></div>\n              <div class=\"resize-handle rh-n\" (pointerdown)=\"startSignatureResize($event, sig.id, 'n')\"></div>\n              <div class=\"resize-handle rh-ne\" (pointerdown)=\"startSignatureResize($event, sig.id, 'ne')\"></div>\n              <div class=\"resize-handle rh-e\" (pointerdown)=\"startSignatureResize($event, sig.id, 'e')\"></div>\n              <div class=\"resize-handle rh-se\" (pointerdown)=\"startSignatureResize($event, sig.id, 'se')\"></div>\n              <div class=\"resize-handle rh-s\" (pointerdown)=\"startSignatureResize($event, sig.id, 's')\"></div>\n              <div class=\"resize-handle rh-sw\" (pointerdown)=\"startSignatureResize($event, sig.id, 'sw')\"></div>\n              <div class=\"resize-handle rh-w\" (pointerdown)=\"startSignatureResize($event, sig.id, 'w')\"></div>\n            </div>\n\n            <!-- PDF Form Fields for this page -->\n            <div *ngFor=\"let ff of getFormFieldsForPage(p)\" class=\"pdf-form-field\"\n              [class.pff-text]=\"ff.type === 'text'\"\n              [class.pff-checkbox]=\"ff.type === 'checkbox'\"\n              [class.pff-radio]=\"ff.type === 'radio'\"\n              [class.pff-no-border]=\"ff.borderVisible === false\"\n              [class.pff-active]=\"activeFormFieldId === ff.id\"\n              [style.left.%]=\"ff.x\" [style.top.%]=\"ff.y\"\n              [style.width.%]=\"ff.width\" [style.height.%]=\"ff.height\"\n              [style.z-index]=\"ff.zIndex || 20\"\n              (pointerdown)=\"startFormFieldDrag($event, ff.id)\">\n\n              <!-- Options bar (shown when active) -->\n              <div class=\"pff-options-bar\" *ngIf=\"activeFormFieldId === ff.id\" (pointerdown)=\"$event.stopPropagation()\">\n                <!-- Element size: all 3 types -->\n                <span class=\"pff-opt-label\">\n                  <ion-icon name=\"resize-outline\"></ion-icon>\n                </span>\n                <button class=\"pff-opt-btn\" (click)=\"changeFormFieldSize(ff.id, -0.5)\" [disabled]=\"(ff.type === 'text' ? ff.height : ff.width) <= 1.5\" title=\"\u0E25\u0E14\u0E02\u0E19\u0E32\u0E14\">\n                  <ion-icon name=\"remove\"></ion-icon>\n                </button>\n                <span class=\"pff-opt-val\">{{ (ff.type === 'text' ? ff.height : ff.width) | number:'1.0-1' }}</span>\n                <button class=\"pff-opt-btn\" (click)=\"changeFormFieldSize(ff.id, 0.5)\" [disabled]=\"(ff.type === 'text' ? ff.height : ff.width) >= 30\" title=\"\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E19\u0E32\u0E14\">\n                  <ion-icon name=\"add\"></ion-icon>\n                </button>\n                <div class=\"pff-opt-sep\"></div>\n                <!-- Font size: text only -->\n                <ng-container *ngIf=\"ff.type === 'text'\">\n                  <span class=\"pff-opt-label\">A</span>\n                  <button class=\"pff-opt-btn\" (click)=\"changeFormFieldFontSize(ff.id, -2)\" [disabled]=\"(ff.fontSize || 12) <= 6\" title=\"\u0E25\u0E14\u0E02\u0E19\u0E32\u0E14\u0E2D\u0E31\u0E01\u0E29\u0E23\">\n                    <ion-icon name=\"remove\"></ion-icon>\n                  </button>\n                  <span class=\"pff-opt-val\">{{ ff.fontSize || 12 }}</span>\n                  <button class=\"pff-opt-btn\" (click)=\"changeFormFieldFontSize(ff.id, 2)\" [disabled]=\"(ff.fontSize || 12) >= 72\" title=\"\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E19\u0E32\u0E14\u0E2D\u0E31\u0E01\u0E29\u0E23\">\n                    <ion-icon name=\"add\"></ion-icon>\n                  </button>\n                  <div class=\"pff-opt-sep\"></div>\n                </ng-container>\n                <!-- Border toggle -->\n                <button class=\"pff-opt-btn\" [class.pff-opt-active]=\"ff.borderVisible !== false\"\n                  (click)=\"toggleFormFieldBorder(ff.id)\" title=\"\u0E40\u0E2A\u0E49\u0E19\u0E02\u0E2D\u0E1A\">\n                  <ion-icon [name]=\"ff.borderVisible !== false ? 'square-outline' : 'square'\"></ion-icon>\n                </button>\n                <!-- Delete -->\n                <button class=\"pff-opt-btn pff-opt-delete\" (click)=\"removeFormField(ff.id)\" title=\"\u0E25\u0E1A\">\n                  <ion-icon name=\"trash-outline\"></ion-icon>\n                </button>\n              </div>\n\n              <div class=\"pff-inner\">\n                <span *ngIf=\"ff.type === 'text'\" class=\"pff-text-hint\">Aa {{ ff.fontSize || 12 }}pt</span>\n                <svg *ngIf=\"ff.type === 'checkbox'\" width=\"55%\" height=\"55%\" viewBox=\"0 0 18 18\" style=\"pointer-events:none\"><rect x=\"1\" y=\"1\" width=\"16\" height=\"16\" rx=\"2\" stroke=\"#3b82f6\" stroke-width=\"2\" fill=\"none\"/></svg>\n                <svg *ngIf=\"ff.type === 'radio'\" width=\"55%\" height=\"55%\" viewBox=\"0 0 18 18\" style=\"pointer-events:none\"><circle cx=\"9\" cy=\"9\" r=\"8\" stroke=\"#3b82f6\" stroke-width=\"2\" fill=\"none\"/></svg>\n              </div>\n\n              <div class=\"pff-resize-handle rh-nw\" (pointerdown)=\"startFormFieldResize($event, ff.id, 'nw')\"></div>\n              <div class=\"pff-resize-handle rh-n\"  (pointerdown)=\"startFormFieldResize($event, ff.id, 'n')\"></div>\n              <div class=\"pff-resize-handle rh-ne\" (pointerdown)=\"startFormFieldResize($event, ff.id, 'ne')\"></div>\n              <div class=\"pff-resize-handle rh-e\"  (pointerdown)=\"startFormFieldResize($event, ff.id, 'e')\"></div>\n              <div class=\"pff-resize-handle rh-se\" (pointerdown)=\"startFormFieldResize($event, ff.id, 'se')\"></div>\n              <div class=\"pff-resize-handle rh-s\"  (pointerdown)=\"startFormFieldResize($event, ff.id, 's')\"></div>\n              <div class=\"pff-resize-handle rh-sw\" (pointerdown)=\"startFormFieldResize($event, ff.id, 'sw')\"></div>\n              <div class=\"pff-resize-handle rh-w\"  (pointerdown)=\"startFormFieldResize($event, ff.id, 'w')\"></div>\n            </div>\n\n            <!-- Date Stamps for this page -->\n            <div *ngFor=\"let ds of getDateStampsForPage(p)\" class=\"date-stamp\" [style.left.%]=\"ds.x\"\n              [style.top.%]=\"ds.y\" [style.color]=\"ds.color\" [style.font-size.px]=\"ds.fontSize * zoom\"\n              [style.z-index]=\"ds.zIndex || 10\" (pointerdown)=\"startDateDrag($event, ds.id)\"\n              (contextmenu)=\"onContextMenu($event, ds.id, 'date')\">\n              <button class=\"remove-btn\" (click)=\"removeDateStamp(ds.id); $event.stopPropagation()\"><ion-icon name=\"close-outline\"></ion-icon></button>\n              {{ ds.text }}\n            </div>\n          </div>\n        </div>\n\n        <div class=\"hint\">\n          <div>\u2022 Keyboard: Ctrl+Z (Undo), Ctrl+Y (Redo), Escape (Exit mode), Delete (Remove selected)</div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- User Guide Panel (right slide-in drawer) -->\n  <div class=\"user-guide-drawer\" [class.open]=\"showUserGuidePanel\">\n    <div class=\"user-guide-drawer__backdrop\" (click)=\"showUserGuidePanel = false\"></div>\n    <div class=\"user-guide-drawer__panel\">\n      <div class=\"user-guide-drawer__header\">\n        <span><ion-icon name=\"book-outline\"></ion-icon> \u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19</span>\n        <button (click)=\"showUserGuidePanel = false\"><ion-icon name=\"close-outline\"></ion-icon></button>\n      </div>\n\n      <div class=\"user-guide-content-area\" *ngIf=\"!isLoadingGuide\">\n        <div *ngIf=\"!isEditingGuide\" class=\"guide-view-mode\">\n\n          <!-- Banner -->\n          <div class=\"guide-banner\">\n            <ion-icon name=\"rocket\"></ion-icon>\n            <div>\n              <strong>\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19\u0E07\u0E48\u0E32\u0E22\u0E21\u0E32\u0E01!</strong> \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E08\u0E32\u0E01\u0E41\u0E16\u0E1A\u0E14\u0E49\u0E32\u0E19\u0E1A\u0E19 \u0E41\u0E25\u0E49\u0E27\u0E04\u0E25\u0E34\u0E01\u0E2B\u0E23\u0E37\u0E2D\u0E25\u0E32\u0E01\u0E1A\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22\n              \u2014 \u0E01\u0E14 <code>Ctrl+Z</code> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A\u0E40\u0E2A\u0E21\u0E2D\u0E2B\u0E32\u0E01\u0E17\u0E33\u0E1E\u0E25\u0E32\u0E14\n            </div>\n          </div>\n\n          <!-- \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21 -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"text\" style=\"color:#60a5fa;\"></ion-icon> \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21 (Text)\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <div class=\"guide-step\">1</div>\n                <div class=\"guide-item__text\">\u0E01\u0E14\u0E44\u0E2D\u0E04\u0E2D\u0E19 <ion-icon name=\"text\" style=\"vertical-align:-2px;color:#60a5fa;\"></ion-icon> \u0E41\u0E25\u0E49\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01 <strong>\u0E02\u0E19\u0E32\u0E14\u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23</strong> \u0E41\u0E25\u0E30 <strong>\u0E2A\u0E35</strong> \u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E01\u0E48\u0E2D\u0E19\u0E27\u0E32\u0E07</div>\n              </div>\n              <div class=\"guide-item\">\n                <div class=\"guide-step\">2</div>\n                <div class=\"guide-item__text\">\u0E04\u0E25\u0E34\u0E01\u0E1A\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23 PDF \u2014 \u0E01\u0E25\u0E48\u0E2D\u0E07\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E08\u0E30\u0E1B\u0E23\u0E32\u0E01\u0E0F\u0E17\u0E31\u0E19\u0E17\u0E35 \u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22 <strong>\u0E01\u0E25\u0E48\u0E2D\u0E07\u0E08\u0E30\u0E02\u0E22\u0E32\u0E22\u0E15\u0E32\u0E21\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34</strong></div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"move-outline\" class=\"guide-item__icon\" style=\"color:#60a5fa;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E22\u0E49\u0E32\u0E22\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07:</strong> \u0E08\u0E31\u0E1A\u0E17\u0E35\u0E48 <em>\u0E40\u0E2A\u0E49\u0E19\u0E02\u0E2D\u0E1A</em> \u0E01\u0E25\u0E48\u0E2D\u0E07\u0E41\u0E25\u0E49\u0E27\u0E25\u0E32\u0E01\u0E44\u0E1B\u0E27\u0E32\u0E07\u0E44\u0E14\u0E49\u0E17\u0E38\u0E01\u0E17\u0E35\u0E48 (cursor \u0E08\u0E30\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E40\u0E1B\u0E47\u0E19\u0E25\u0E39\u0E01\u0E28\u0E23 4 \u0E17\u0E34\u0E28)</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"contract-outline\" class=\"guide-item__icon\" style=\"color:#60a5fa;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E1B\u0E23\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E01\u0E27\u0E49\u0E32\u0E07:</strong> \u0E25\u0E32\u0E01\u0E27\u0E07\u0E01\u0E25\u0E21\u0E2A\u0E35\u0E1F\u0E49\u0E32 <span class=\"guide-dot-demo\"></span> \u0E17\u0E35\u0E48\u0E0B\u0E49\u0E32\u0E22\u0E2B\u0E23\u0E37\u0E2D\u0E02\u0E27\u0E32\u0E01\u0E25\u0E48\u0E2D\u0E07 \u2014 \u0E04\u0E27\u0E32\u0E21\u0E2A\u0E39\u0E07\u0E08\u0E30\u0E1B\u0E23\u0E31\u0E1A\u0E15\u0E32\u0E21\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E40\u0E2D\u0E07</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"trash-outline\" class=\"guide-item__icon\" style=\"color:#f87171;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E25\u0E1A\u0E01\u0E25\u0E48\u0E2D\u0E07\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21:</strong> \u0E04\u0E25\u0E34\u0E01\u0E17\u0E35\u0E48\u0E40\u0E2A\u0E49\u0E19\u0E02\u0E2D\u0E1A\u0E01\u0E25\u0E48\u0E2D\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E25\u0E37\u0E2D\u0E01 \u0E41\u0E25\u0E49\u0E27\u0E01\u0E14 <code>Delete</code> \u0E2B\u0E23\u0E37\u0E2D\u0E04\u0E25\u0E34\u0E01\u0E02\u0E27\u0E32\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E14\u0E39\u0E40\u0E21\u0E19\u0E39</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- \u0E27\u0E32\u0E14\u0E41\u0E25\u0E30\u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"brush\" style=\"color:#fb7185;\"></ion-icon> \u0E27\u0E32\u0E14 / \u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C / \u0E22\u0E32\u0E07\u0E25\u0E1A\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"brush\" class=\"guide-item__icon\" style=\"color:#fb7185;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E1B\u0E32\u0E01\u0E01\u0E32 / \u0E14\u0E34\u0E19\u0E2A\u0E2D:</strong> \u0E25\u0E32\u0E01\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E27\u0E32\u0E14\u0E2D\u0E34\u0E2A\u0E23\u0E30 \u2014 \u0E1B\u0E23\u0E31\u0E1A <strong>\u0E02\u0E19\u0E32\u0E14\u0E40\u0E2A\u0E49\u0E19</strong> \u0E41\u0E25\u0E30 <strong>\u0E2A\u0E35</strong> \u0E08\u0E32\u0E01\u0E41\u0E16\u0E1A\u0E14\u0E49\u0E32\u0E19\u0E1A\u0E19 \u0E40\u0E2A\u0E49\u0E19\u0E08\u0E30\u0E23\u0E27\u0E21\u0E40\u0E1B\u0E47\u0E19 object \u0E40\u0E14\u0E35\u0E22\u0E27\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E22\u0E01\u0E1B\u0E32\u0E01\u0E01\u0E32</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"color-filter-outline\" class=\"guide-item__icon\" style=\"color:#fde68a;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C:</strong> \u0E25\u0E32\u0E01\u0E17\u0E31\u0E1A\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E19\u0E49\u0E19\u0E2A\u0E35 \u2014 \u0E21\u0E35\u0E2A\u0E35\u0E43\u0E2B\u0E49\u0E40\u0E25\u0E37\u0E2D\u0E01 6 \u0E2A\u0E35 \u0E2B\u0E23\u0E37\u0E2D\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E35\u0E40\u0E2D\u0E07\u0E44\u0E14\u0E49 \u0E1B\u0E23\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E2B\u0E19\u0E32\u0E44\u0E14\u0E49\u0E15\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"cut-outline\" class=\"guide-item__icon\" style=\"color:#94a3b8;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E22\u0E32\u0E07\u0E25\u0E1A:</strong> \u0E25\u0E32\u0E01\u0E1C\u0E48\u0E32\u0E19\u0E40\u0E2A\u0E49\u0E19\u0E27\u0E32\u0E14\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E25\u0E1A \u2014 \u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14\u0E22\u0E32\u0E07\u0E25\u0E1A\u0E44\u0E14\u0E49\u0E08\u0E32\u0E01\u0E41\u0E16\u0E1A\u0E14\u0E49\u0E32\u0E19\u0E1A\u0E19</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- \u0E23\u0E39\u0E1B\u0E23\u0E48\u0E32\u0E07 -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"shapes\" style=\"color:#a78bfa;\"></ion-icon> \u0E23\u0E39\u0E1B\u0E23\u0E48\u0E32\u0E07\u0E41\u0E25\u0E30\u0E40\u0E2A\u0E49\u0E19 (Shapes)\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"square-outline\" class=\"guide-item__icon\" style=\"color:#a78bfa;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>4 \u0E41\u0E1A\u0E1A:</strong> \u0E2A\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E35\u0E48\u0E22\u0E21 <ion-icon name=\"square-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> \u0E27\u0E07\u0E01\u0E25\u0E21 <ion-icon name=\"ellipse-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> \u0E40\u0E2A\u0E49\u0E19\u0E15\u0E23\u0E07 <ion-icon name=\"remove-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> \u0E25\u0E39\u0E01\u0E28\u0E23 <ion-icon name=\"arrow-forward-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> \u2014 \u0E01\u0E14\u0E25\u0E39\u0E01\u0E28\u0E23\u0E40\u0E25\u0E47\u0E01\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E41\u0E1A\u0E1A \u0E41\u0E25\u0E49\u0E27<strong>\u0E25\u0E32\u0E01\u0E1A\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23</strong></div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"color-palette\" class=\"guide-item__icon\" style=\"color:#fbbf24;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E1B\u0E23\u0E31\u0E1A\u0E2A\u0E35\u0E41\u0E25\u0E30\u0E02\u0E19\u0E32\u0E14\u0E40\u0E2A\u0E49\u0E19:</strong> \u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E2A\u0E35\u0E02\u0E2D\u0E1A, \u0E2A\u0E35\u0E1E\u0E37\u0E49\u0E19, \u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E2B\u0E19\u0E32\u0E40\u0E2A\u0E49\u0E19\u0E44\u0E14\u0E49\u0E08\u0E32\u0E01\u0E41\u0E16\u0E1A\u0E14\u0E49\u0E32\u0E19\u0E1A\u0E19 \u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E1B\u0E34\u0E14\u0E40\u0E2A\u0E49\u0E19\u0E02\u0E2D\u0E1A\u0E2B\u0E23\u0E37\u0E2D\u0E1B\u0E34\u0E14\u0E2A\u0E35\u0E1E\u0E37\u0E49\u0E19\u0E41\u0E22\u0E01\u0E01\u0E31\u0E19\u0E44\u0E14\u0E49</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"resize\" class=\"guide-item__icon\" style=\"color:#a78bfa;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E22\u0E49\u0E32\u0E22\u0E41\u0E25\u0E30\u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14:</strong> \u0E25\u0E32\u0E01\u0E15\u0E23\u0E07\u0E01\u0E25\u0E32\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E49\u0E32\u0E22 \u2014 \u0E25\u0E32\u0E01 handle 8 \u0E08\u0E38\u0E14\u0E23\u0E2D\u0E1A\u0E23\u0E39\u0E1B\u0E23\u0E48\u0E32\u0E07\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14 \u2014 \u0E04\u0E25\u0E34\u0E01\u0E02\u0E27\u0E32\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E08\u0E31\u0E14\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E0A\u0E31\u0E49\u0E19</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- \u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19 -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"finger-print\" style=\"color:#34d399;\"></ion-icon> \u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19 (Signature)\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"create-outline\" class=\"guide-item__icon\" style=\"color:#34d399;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E27\u0E32\u0E14\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19:</strong> \u0E01\u0E14 <ion-icon name=\"finger-print\" style=\"vertical-align:-2px;font-size:13px;color:#34d399;\"></ion-icon> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E1B\u0E34\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E48\u0E32\u0E07\u0E27\u0E32\u0E14 \u2014 \u0E1B\u0E23\u0E31\u0E1A\u0E2A\u0E35\u0E41\u0E25\u0E30\u0E02\u0E19\u0E32\u0E14\u0E1B\u0E32\u0E01\u0E01\u0E32 \u2014 \u0E01\u0E14 <strong>\"\u0E43\u0E0A\u0E49\u0E04\u0E23\u0E31\u0E49\u0E07\u0E19\u0E35\u0E49\"</strong> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E27\u0E32\u0E07\u0E1A\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"cloud-upload-outline\" class=\"guide-item__icon\" style=\"color:#34d399;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19:</strong> \u0E01\u0E14 <strong>\"\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49\u0E43\u0E0A\u0E49\u0E20\u0E32\u0E22\u0E2B\u0E25\u0E31\u0E07\"</strong> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E01\u0E47\u0E1A\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\u0E44\u0E27\u0E49\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A \u2014 \u0E04\u0E23\u0E31\u0E49\u0E07\u0E16\u0E31\u0E14\u0E44\u0E1B\u0E01\u0E14\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E44\u0E14\u0E49\u0E17\u0E31\u0E19\u0E17\u0E35</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"shield-checkmark-outline\" class=\"guide-item__icon\" style=\"color:#34d399;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>Digital ID (DID):</strong> \u0E01\u0E14\u0E1B\u0E38\u0E48\u0E21 <code>DID</code> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E41\u0E2A\u0E14\u0E07/\u0E0B\u0E48\u0E2D\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25 Digital ID \u0E43\u0E15\u0E49\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19 (\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48, \u0E40\u0E27\u0E25\u0E32, \u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49)</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 \u0E41\u0E25\u0E30\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"calendar\" style=\"color:#fb923c;\"></ion-icon> \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 \u0E41\u0E25\u0E30\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"calendar-outline\" class=\"guide-item__icon\" style=\"color:#fb923c;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34:</strong> \u0E01\u0E14 <ion-icon name=\"calendar\" style=\"vertical-align:-2px;font-size:13px;color:#fb923c;\"></ion-icon> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E41\u0E17\u0E23\u0E01\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19 \u2014 \u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14\u0E41\u0E25\u0E30\u0E2A\u0E35\u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23\u0E44\u0E14\u0E49 \u2014 \u0E25\u0E32\u0E01\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E49\u0E32\u0E22\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"image-outline\" class=\"guide-item__icon\" style=\"color:#fb923c;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E41\u0E17\u0E23\u0E01\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E:</strong> \u0E01\u0E14 <ion-icon name=\"image\" style=\"vertical-align:-2px;font-size:13px;color:#fb923c;\"></ion-icon> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E1F\u0E25\u0E4C\u0E23\u0E39\u0E1B\u0E08\u0E32\u0E01\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07 \u2014 \u0E25\u0E32\u0E01\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E22\u0E49\u0E32\u0E22 \u0E25\u0E32\u0E01 handle 8 \u0E08\u0E38\u0E14\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1B\u0E23\u0E31\u0E1A\u0E02\u0E19\u0E32\u0E14</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- \u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E2B\u0E19\u0E49\u0E32 -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"documents\" style=\"color:#f59e0b;\"></ion-icon> \u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"images-outline\" class=\"guide-item__icon\" style=\"color:#f59e0b;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>Thumbnail \u0E14\u0E49\u0E32\u0E19\u0E0B\u0E49\u0E32\u0E22:</strong> \u0E01\u0E14 <ion-icon name=\"images-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E41\u0E2A\u0E14\u0E07 \u2014 \u0E04\u0E25\u0E34\u0E01 thumbnail \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E01\u0E23\u0E30\u0E42\u0E14\u0E14\u0E44\u0E1B\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E31\u0E49\u0E19 \u2014 \u0E25\u0E32\u0E01 <ion-icon name=\"chevron-up-outline\" style=\"vertical-align:-2px;font-size:12px;\"></ion-icon><ion-icon name=\"chevron-down-outline\" style=\"vertical-align:-2px;font-size:12px;\"></ion-icon> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E23\u0E35\u0E22\u0E07\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E2B\u0E19\u0E49\u0E32</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"add-circle-outline\" class=\"guide-item__icon\" style=\"color:#f59e0b;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E41\u0E17\u0E23\u0E01/\u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32:</strong> \u0E01\u0E14\u0E44\u0E2D\u0E04\u0E2D\u0E19 <ion-icon name=\"documents-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> \u0E1A\u0E19\u0E41\u0E16\u0E1A\u0E14\u0E49\u0E32\u0E19\u0E1A\u0E19 \u2014 \u0E41\u0E17\u0E23\u0E01\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E1B\u0E25\u0E48\u0E32\u0E41\u0E19\u0E27\u0E15\u0E31\u0E49\u0E07/\u0E41\u0E19\u0E27\u0E19\u0E2D\u0E19 \u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E23\u0E37\u0E2D\u0E2B\u0E25\u0E31\u0E07\u0E2B\u0E19\u0E49\u0E32\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19 \u2014 \u0E25\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23 \u2014 \u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A\u0E44\u0E14\u0E49</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"search-outline\" class=\"guide-item__icon\" style=\"color:#f59e0b;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>\u0E0B\u0E39\u0E21:</strong> \u0E01\u0E14\u0E1B\u0E38\u0E48\u0E21 <code>+</code> / <code>\u2212</code> \u0E2B\u0E23\u0E37\u0E2D\u0E43\u0E0A\u0E49\u0E1B\u0E38\u0E48\u0E21\u0E0B\u0E39\u0E21\u0E1A\u0E19\u0E41\u0E16\u0E1A\u0E19\u0E33\u0E17\u0E32\u0E07 \u2014 \u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A\u0E15\u0E31\u0E49\u0E07\u0E41\u0E15\u0E48 50% \u0E16\u0E36\u0E07 300%</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- Keyboard Shortcuts -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"keypad\" style=\"color:#e2e8f0;\"></ion-icon> \u0E04\u0E35\u0E22\u0E4C\u0E25\u0E31\u0E14\u0E17\u0E35\u0E48\u0E04\u0E27\u0E23\u0E23\u0E39\u0E49\n            </h4>\n            <div class=\"guide-shortcuts-grid\">\n              <div class=\"guide-shortcut-card\">\n                <div class=\"guide-shortcut-card__keys\"><kbd>Ctrl</kbd><span>+</span><kbd>Z</kbd></div>\n                <div class=\"guide-shortcut-card__label\">\u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A (Undo)</div>\n              </div>\n              <div class=\"guide-shortcut-card\">\n                <div class=\"guide-shortcut-card__keys\"><kbd>Ctrl</kbd><span>+</span><kbd>Y</kbd></div>\n                <div class=\"guide-shortcut-card__label\">\u0E17\u0E33\u0E0B\u0E49\u0E33 (Redo)</div>\n              </div>\n              <div class=\"guide-shortcut-card\">\n                <div class=\"guide-shortcut-card__keys\"><kbd>Delete</kbd></div>\n                <div class=\"guide-shortcut-card__label\">\u0E25\u0E1A object \u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01</div>\n              </div>\n              <div class=\"guide-shortcut-card\">\n                <div class=\"guide-shortcut-card__keys\"><kbd>Esc</kbd></div>\n                <div class=\"guide-shortcut-card__label\">\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E42\u0E2B\u0E21\u0E14\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- Pro Tips -->\n          <div class=\"guide-protip\">\n            <div class=\"guide-protip__icon\"><ion-icon name=\"bulb\"></ion-icon></div>\n            <div class=\"guide-protip__body\">\n              <div class=\"guide-protip__title\">Pro Tips</div>\n              <ul class=\"guide-protip__list\">\n                <li>\u0E04\u0E25\u0E34\u0E01\u0E02\u0E27\u0E32\u0E1A\u0E19 object \u0E43\u0E14 \u0E46 \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E08\u0E31\u0E14\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E0A\u0E31\u0E49\u0E19 (Bring to Front / Send to Back)</li>\n                <li>\u0E01\u0E14 <code>Esc</code> \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E42\u0E2B\u0E21\u0E14\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E21\u0E37\u0E2D\u0E41\u0E25\u0E30\u0E01\u0E25\u0E31\u0E1A\u0E2A\u0E39\u0E48\u0E42\u0E2B\u0E21\u0E14\u0E1B\u0E01\u0E15\u0E34</li>\n                <li>\u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C\u0E17\u0E35\u0E48\u0E27\u0E32\u0E14\u0E14\u0E49\u0E27\u0E22 opacity \u0E15\u0E48\u0E33 \u2014 \u0E43\u0E0A\u0E49\u0E44\u0E2E\u0E44\u0E25\u0E17\u0E4C\u0E0B\u0E49\u0E2D\u0E19\u0E01\u0E31\u0E19\u0E2B\u0E25\u0E32\u0E22\u0E0A\u0E31\u0E49\u0E19\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E19\u0E49\u0E19\u0E2A\u0E35\u0E40\u0E02\u0E49\u0E21\u0E02\u0E36\u0E49\u0E19</li>\n                <li>\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\u0E44\u0E27\u0E49\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E0A\u0E49\u0E0B\u0E49\u0E33\u0E43\u0E19\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E2D\u0E37\u0E48\u0E19 \u0E46 \u0E44\u0E14\u0E49\u0E2A\u0E30\u0E14\u0E27\u0E01</li>\n              </ul>\n            </div>\n          </div>\n\n          <div class=\"guide-section\" *ngIf=\"userGuideContent && userGuideContent.trim() !== ''\">\n            <h4 class=\"guide-section__title\"><ion-icon name=\"megaphone\" style=\"color:#10b981;\"></ion-icon> \u0E1B\u0E23\u0E30\u0E01\u0E32\u0E28\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21</h4>\n            <div class=\"guide-raw-content\">{{ userGuideContent }}</div>\n          </div>\n\n          <button *ngIf=\"canManageGuide\" (click)=\"editGuide()\" class=\"guide-edit-btn\">\n            <ion-icon name=\"create-outline\"></ion-icon> \u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15\u0E1B\u0E23\u0E30\u0E01\u0E32\u0E28\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21\n          </button>\n        </div>\n\n        <div *ngIf=\"isEditingGuide\" style=\"display: flex; flex-direction: column; height: 100%;\">\n          <div style=\"font-size: 12px; color: #94a3b8; margin-bottom: 8px;\">\u0E04\u0E38\u0E13\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E43\u0E19\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E18\u0E23\u0E23\u0E21\u0E14\u0E32 \u0E2B\u0E23\u0E37\u0E2D Markdown (\u0E16\u0E49\u0E32\u0E21\u0E35\u0E01\u0E32\u0E23\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E15\u0E31\u0E27\u0E41\u0E1B\u0E25\u0E07)</div>\n          <textarea [(ngModel)]=\"tempGuideContent\" style=\"flex: 1; min-height: 300px; width: 100%; padding: 12px; background: rgba(0,0,0,0.2); border: 1px solid #334155; border-radius: 6px; color: #e8eaf6; font-size: 13.5px; resize: none; line-height: 1.5; outline: none; font-family: sans-serif;\" placeholder=\"\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E17\u0E35\u0E48\u0E19\u0E35\u0E48...\"></textarea>\n          \n          <div style=\"display: flex; gap: 8px; margin-top: 16px; padding-bottom: 20px;\">\n            <button (click)=\"cancelEditGuide()\" style=\"flex: 1; padding: 10px; background: transparent; border: 1px solid #475569; color: #94a3b8; border-radius: 6px; cursor: pointer; font-weight: 500;\">\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01</button>\n            <button (click)=\"saveGuide()\" style=\"flex: 1; padding: 10px; background: #3b82f6; border: none; color: #fff; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s;\">\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15</button>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- History Panel (right slide-in drawer) -->\n  <div class=\"annot-history-drawer\" [class.open]=\"showHistoryPanel\">\n    <div class=\"annot-history-drawer__backdrop\" (click)=\"showHistoryPanel = false\"></div>\n    <div class=\"annot-history-drawer__panel\">\n      <div class=\"annot-history-drawer__header\">\n        <span><ion-icon name=\"time-outline\"></ion-icon> \u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E41\u0E01\u0E49\u0E44\u0E02</span>\n        <button (click)=\"showHistoryPanel = false\"><ion-icon name=\"close-outline\"></ion-icon></button>\n      </div>\n\n      <div class=\"annot-history-loading\" *ngIf=\"isLoadingHistory\">\n        <ion-spinner name=\"dots\"></ion-spinner>\n      </div>\n\n      <div class=\"annot-history-list\" *ngIf=\"!isLoadingHistory\">\n        <div class=\"annot-history-entry\" *ngFor=\"let h of historyEntries\">\n          <div class=\"annot-history-entry__icon\" [class]=\"'hi-' + h.action_type\">\n            <ion-icon [name]=\"getHistoryActionIcon(h.action_type)\"></ion-icon>\n          </div>\n          <div class=\"annot-history-entry__body\">\n            <div class=\"annot-history-entry__title\">\n              {{ getHistoryActionLabel(h.action_type) }}\n              <span class=\"annot-history-entry__page\" *ngIf=\"h.page_number > 0\">\u0E2B\u0E19\u0E49\u0E32 {{ h.page_number }}</span>\n            </div>\n            <div class=\"annot-history-entry__user\">{{ h.user_name || h.user_id || '\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49' }}</div>\n            <div class=\"annot-history-entry__time\">{{ h.created_at | date:'dd/MM/yyyy HH:mm' }}</div>\n          </div>\n        </div>\n        <div class=\"annot-history-empty\" *ngIf=\"historyEntries.length === 0\">\n          <ion-icon name=\"time-outline\"></ion-icon>\n          <p>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34</p>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- Hidden file input for signature upload (always in DOM) -->\n  <input type=\"file\" #signatureFileInput accept=\"image/*\" style=\"display:none\"\n    (change)=\"onSignatureFileSelected($event)\">\n\n  <!-- Signature Pad Modal -->\n  <div class=\"signature-modal\" *ngIf=\"showSignaturePad\">\n    <div class=\"signature-modal__backdrop\" (click)=\"closeSignaturePad()\"></div>\n    <div class=\"signature-modal__content\">\n      <h3>\u0E25\u0E07\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19</h3>\n      <p class=\"signature-modal__hint\">\u0E27\u0E32\u0E14\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E43\u0E19\u0E01\u0E23\u0E2D\u0E1A\u0E14\u0E49\u0E32\u0E19\u0E25\u0E48\u0E32\u0E07 (\u0E22\u0E01\u0E1B\u0E32\u0E01\u0E01\u0E32\u0E41\u0E25\u0E49\u0E27\u0E27\u0E32\u0E14\u0E15\u0E48\u0E2D\u0E44\u0E14\u0E49)</p>\n\n      <!-- Pen Options -->\n      <div class=\"signature-modal__pen-options\">\n        <div class=\"pen-option-group\">\n          <span class=\"pen-option-label\">\u0E2A\u0E35:</span>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#000\" (click)=\"setSignaturePenColor('#000000')\"\n              [class.active]=\"signaturePenColor === '#000000'\"></div>\n            <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setSignaturePenColor('#0000FF')\"\n              [class.active]=\"signaturePenColor === '#0000FF'\"></div>\n            <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setSignaturePenColor('#FF0000')\"\n              [class.active]=\"signaturePenColor === '#FF0000'\"></div>\n          </div>\n        </div>\n        <div class=\"pen-option-group\">\n          <span class=\"pen-option-label\">\u0E02\u0E19\u0E32\u0E14:</span>\n          <button class=\"pen-size-btn\" (click)=\"changeSignaturePenSize(-0.5)\" [disabled]=\"signaturePenSize <= 1\">\n            <ion-icon name=\"remove\"></ion-icon>\n          </button>\n          <span class=\"pen-size-val\">{{ signaturePenSize }}</span>\n          <button class=\"pen-size-btn\" (click)=\"changeSignaturePenSize(0.5)\" [disabled]=\"signaturePenSize >= 10\">\n            <ion-icon name=\"add\"></ion-icon>\n          </button>\n        </div>\n      </div>\n\n      <canvas #signatureCanvas class=\"signature-modal__canvas\"></canvas>\n\n      <div class=\"signature-modal__actions\">\n        <ion-button fill=\"outline\" color=\"medium\" (click)=\"clearSignaturePad()\">\n          <ion-icon name=\"refresh\" slot=\"start\"></ion-icon>\n          \u0E25\u0E49\u0E32\u0E07\n        </ion-button>\n        <ion-button fill=\"outline\" color=\"danger\" (click)=\"closeSignaturePad()\">\n          <ion-icon name=\"close\" slot=\"start\"></ion-icon>\n          \u0E22\u0E01\u0E40\u0E25\u0E34\u0E01\n        </ion-button>\n        <ion-button fill=\"outline\" color=\"tertiary\" (click)=\"triggerSignatureUpload()\">\n          <ion-icon name=\"image-outline\" slot=\"start\"></ion-icon>\n          \u0E2D\u0E31\u0E1E\u0E42\u0E2B\u0E25\u0E14\u0E23\u0E39\u0E1B\n        </ion-button>\n        <ion-button fill=\"outline\" color=\"success\" (click)=\"saveSignatureToDatabase()\">\n          <ion-icon name=\"cloud-upload\" slot=\"start\"></ion-icon>\n          \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49\u0E43\u0E0A\u0E49\u0E20\u0E32\u0E22\u0E2B\u0E25\u0E31\u0E07\n        </ion-button>\n        <ion-button color=\"primary\" (click)=\"saveSignature()\">\n          <ion-icon name=\"checkmark\" slot=\"start\"></ion-icon>\n          \u0E43\u0E0A\u0E49\u0E04\u0E23\u0E31\u0E49\u0E07\u0E19\u0E35\u0E49\n        </ion-button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Signature Picker Modal -->\n  <div class=\"signature-picker-modal\" *ngIf=\"showSignaturePicker\">\n    <div class=\"signature-picker-modal__backdrop\" (click)=\"closeSignaturePicker()\"></div>\n    <div class=\"signature-picker-modal__content\">\n      <h3>\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19</h3>\n      <p class=\"signature-picker-modal__hint\">\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\u0E17\u0E35\u0E48\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49 \u0E2B\u0E23\u0E37\u0E2D\u0E27\u0E32\u0E14\u0E43\u0E2B\u0E21\u0E48</p>\n\n      <div class=\"signature-picker-modal__loading\" *ngIf=\"isLoadingSignatures\">\n        <ion-spinner name=\"crescent\"></ion-spinner>\n        <span>\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14...</span>\n      </div>\n\n      <div class=\"signature-picker-modal__list\" *ngIf=\"!isLoadingSignatures\">\n        <div class=\"signature-item\" *ngFor=\"let sig of savedSignatures\" (click)=\"useSavedSignature(sig)\">\n          <img [src]=\"sig.signature_data\" [alt]=\"sig.signature_name\" />\n          <div class=\"signature-item__info\">\n            <span class=\"signature-item__name\">{{ sig.signature_name }}</span>\n            <span class=\"signature-item__badge\" *ngIf=\"sig.is_default\">\u0E2B\u0E25\u0E31\u0E01</span>\n          </div>\n          <div class=\"signature-item__actions\">\n            <button class=\"signature-item__btn\" (click)=\"setDefaultSignature(sig, $event)\"\n              [class.active]=\"sig.is_default\" title=\"\u0E15\u0E31\u0E49\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E2B\u0E25\u0E31\u0E01\">\n              <ion-icon name=\"star\"></ion-icon>\n            </button>\n            <button class=\"signature-item__btn signature-item__btn--delete\" (click)=\"deleteSavedSignature(sig, $event)\"\n              title=\"\u0E25\u0E1A\">\n              <ion-icon name=\"trash\"></ion-icon>\n            </button>\n          </div>\n        </div>\n\n        <div class=\"signature-picker-modal__empty\" *ngIf=\"savedSignatures.length === 0\">\n          <ion-icon name=\"create-outline\"></ion-icon>\n          <p>\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\u0E17\u0E35\u0E48\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49</p>\n        </div>\n      </div>\n\n      <div class=\"signature-picker-modal__actions\">\n        <ion-button fill=\"outline\" color=\"medium\" (click)=\"closeSignaturePicker()\">\n          <ion-icon name=\"close\" slot=\"start\"></ion-icon>\n          \u0E1B\u0E34\u0E14\n        </ion-button>\n        <ion-button fill=\"outline\" color=\"secondary\" (click)=\"triggerSignatureUpload()\">\n          <ion-icon name=\"cloud-upload\" slot=\"start\"></ion-icon>\n          \u0E2D\u0E31\u0E1E\u0E42\u0E2B\u0E25\u0E14\u0E23\u0E39\u0E1B\n        </ion-button>\n        <ion-button color=\"primary\" (click)=\"openSignaturePadFromPicker()\">\n          <ion-icon name=\"create\" slot=\"start\"></ion-icon>\n          \u0E27\u0E32\u0E14\u0E25\u0E32\u0E22\u0E40\u0E0B\u0E47\u0E19\u0E43\u0E2B\u0E21\u0E48\n        </ion-button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Preview Overlay -->\n  <div class=\"preview-overlay\" *ngIf=\"showPreviewOverlay\">\n    <div class=\"preview-header\">\n      <div class=\"preview-title\">{{ isCancelMode ? '\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E01\u0E48\u0E2D\u0E19\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01' : '\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E01\u0E48\u0E2D\u0E19\u0E25\u0E07\u0E19\u0E32\u0E21' }}</div>\n      <div class=\"preview-actions\">\n        <ion-button fill=\"clear\" color=\"dark\" (click)=\"backToEdit()\">\n          <ion-icon slot=\"start\" name=\"arrow-back-outline\"></ion-icon>\n          \u0E01\u0E25\u0E31\u0E1A\u0E44\u0E1B\u0E41\u0E01\u0E49\u0E44\u0E02\n        </ion-button>\n        <ion-button color=\"success\" (click)=\"confirmSave()\">\n          <ion-icon slot=\"start\" name=\"checkmark-done-outline\"></ion-icon>\n          {{ isCancelMode ? '\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01' : '\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E41\u0E25\u0E30\u0E25\u0E07\u0E19\u0E32\u0E21' }}\n        </ion-button>\n      </div>\n    </div>\n    <div class=\"preview-scroll-area\">\n    <div class=\"preview-body\">\n      <div class=\"preview-filter-bar\" *ngIf=\"previewIsFiltered || isLoadingAllPreview\">\n        <ion-icon name=\"information-circle-outline\"></ion-icon>\n        <span>\u0E41\u0E2A\u0E14\u0E07\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E21\u0E35\u0E01\u0E32\u0E23\u0E41\u0E01\u0E49\u0E44\u0E02 ({{ previewPages.length }} / {{ previewTotalPages }} \u0E2B\u0E19\u0E49\u0E32)</span>\n        <ion-button fill=\"clear\" size=\"small\" (click)=\"loadAllPreviewPages()\" [disabled]=\"isLoadingAllPreview\">\n          <ion-spinner *ngIf=\"isLoadingAllPreview\" name=\"crescent\" slot=\"start\"></ion-spinner>\n          <span *ngIf=\"!isLoadingAllPreview\">\u0E41\u0E2A\u0E14\u0E07\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 {{ previewTotalPages }} \u0E2B\u0E19\u0E49\u0E32</span>\n          <span *ngIf=\"isLoadingAllPreview\">\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14...</span>\n        </ion-button>\n      </div>\n      <div class=\"preview-pages\" *ngIf=\"previewPages.length > 0\">\n        <img *ngFor=\"let page of previewPages; let i = index\" [src]=\"page\" [alt]=\"'Page ' + (i + 1)\"\n          class=\"preview-page-img\">\n      </div>\n      <div *ngIf=\"previewPages.length === 0\" class=\"preview-loading\">\n        <ion-spinner name=\"crescent\"></ion-spinner>\n        <p>\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14 Preview...</p>\n      </div>\n    </div>\n    </div>\n  </div>\n\n  <!-- Custom Context Menu -->\n  <div class=\"custom-context-menu\" *ngIf=\"contextMenu.show\" [style.left.px]=\"contextMenu.x\" [style.top.px]=\"contextMenu.y\">\n    <button class=\"menu-btn\" (click)=\"contextBringToFront()\">\n      <ion-icon name=\"arrow-up-circle-outline\"></ion-icon> \u0E19\u0E33\u0E44\u0E1B\u0E44\u0E27\u0E49\u0E2B\u0E19\u0E49\u0E32\u0E2A\u0E38\u0E14 (Bring to Front)\n    </button>\n    <button class=\"menu-btn\" (click)=\"contextBringForward()\">\n      <ion-icon name=\"chevron-up-outline\"></ion-icon> \u0E19\u0E33\u0E44\u0E1B\u0E02\u0E49\u0E32\u0E07\u0E2B\u0E19\u0E49\u0E32 (Bring Forward)\n    </button>\n    <button class=\"menu-btn\" (click)=\"contextSendBackward()\">\n      <ion-icon name=\"chevron-down-outline\"></ion-icon> \u0E2A\u0E48\u0E07\u0E44\u0E1B\u0E02\u0E49\u0E32\u0E07\u0E2B\u0E25\u0E31\u0E07 (Send Backward)\n    </button>\n    <button class=\"menu-btn\" (click)=\"contextSendToBack()\">\n      <ion-icon name=\"arrow-down-circle-outline\"></ion-icon> \u0E2A\u0E48\u0E07\u0E44\u0E1B\u0E44\u0E27\u0E49\u0E2B\u0E25\u0E31\u0E07\u0E2A\u0E38\u0E14 (Send to Back)\n    </button>\n    <div class=\"menu-divider\"></div>\n    <button class=\"menu-btn danger-btn\" (click)=\"deleteContextMenuTarget()\">\n      <ion-icon name=\"trash-outline\"></ion-icon> \u0E25\u0E1A (Delete)\n    </button>\n  </div>\n\n</ion-content>",
                    styles: ["@charset \"UTF-8\";:host{display:block;height:100%}.annotator-content{--background: #f1f5f9;height:100%;overflow:hidden;position:relative}.annotator-content::part(scroll){display:flex;flex-direction:column;height:100%;overflow:hidden}ion-header{box-shadow:0 2px 8px #0000000d}ion-header ion-toolbar{--background: #fff;--color: #1e293b;--padding-top: 8px;--padding-bottom: 8px}.annotator-layout{display:flex;height:100%;width:100%;min-height:0;overflow:hidden;position:relative}.annotator-layout-v2{display:flex;flex-direction:column;height:100%;width:100%;min-height:0;overflow:hidden}.toolbar-row{display:flex;align-items:center;background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:6px 12px;grid-gap:8px;gap:8px;flex-shrink:0}.toolbar-row--nav{background:#fff}.toolbar-row--tools{background:#f1f5f9;flex-wrap:wrap}.toolbar-group{display:flex;align-items:center;grid-gap:4px;gap:4px}.toolbar-group--zoom,.toolbar-group--pager{grid-gap:2px;gap:2px}.toolbar-group--save{margin-left:auto}.toolbar-divider{width:1px;height:24px;background:#e2e8f0;margin:0 8px}.toolbar-spacer{flex:1}.toolbar-label{font-size:12px;color:#64748b;min-width:50px;text-align:center}.toolbar-btn{display:flex;align-items:center;justify-content:center;grid-gap:4px;gap:4px;background:transparent;border:1px solid transparent;border-radius:6px;padding:6px 10px;cursor:pointer;transition:all .15s ease;color:#475569;font-size:13px}.toolbar-btn ion-icon{font-size:18px}.toolbar-btn .zoom-icon{font-size:10px;margin-left:-4px}.toolbar-btn:hover:not(:disabled){background:#e2e8f0}.toolbar-btn:disabled{opacity:.4;cursor:not-allowed}.toolbar-btn.active{background:#3b82f6;color:#fff;border-color:#2563eb}.toolbar-btn--guide{background:rgba(14,165,233,.1);color:#0ea5e9;border:1px solid rgba(14,165,233,.3);padding:6px 12px}.toolbar-btn--guide:hover{background:rgba(14,165,233,.2)}.toolbar-btn--guide.active{background:#0ea5e9;color:#fff;border-color:#0284c7}.toolbar-btn--save{background:linear-gradient(135deg,#22c55e 0%,#16a34a 100%);color:#fff;padding:7px 16px;font-weight:700;font-size:14px;border-radius:8px;border:1px solid #16a34a;box-shadow:0 2px 8px #22c55e59;letter-spacing:.2px;transition:all .2s ease}.toolbar-btn--save ion-icon{font-size:17px}.toolbar-btn--save:hover:not(:disabled){background:linear-gradient(135deg,#16a34a 0%,#15803d 100%);box-shadow:0 4px 14px #22c55e80;transform:translateY(-1px)}.toolbar-btn--save:active{transform:translateY(0);box-shadow:0 2px 6px #22c55e4d}.toolbar-btn--danger{color:#ef4444}.toolbar-btn--danger:hover{background:#fee2e2}.toolbar-btn--toggle{font-size:11px;padding:4px 6px;grid-gap:2px;gap:2px}.toolbar-btn--toggle ion-icon{font-size:14px}.toolbar-btn--toggle .toggle-label{font-size:9px;font-weight:600;letter-spacing:.5px}.tool-item{display:flex;align-items:center;grid-gap:4px;gap:4px}.tool-options{display:flex;align-items:center;grid-gap:4px;gap:4px;background:#f1f5f9;padding:4px 8px;border-radius:6px;border:1px solid #e2e8f0}.tool-options button{width:24px;height:24px;border:none;background:#fff;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center}.tool-options button:hover{background:#e2e8f0}.tool-options button:disabled{opacity:.4}.tool-options button ion-icon{font-size:14px}.tool-options span{font-size:11px;min-width:24px;text-align:center;color:#64748b}.color-dots{display:flex;grid-gap:4px;gap:4px;margin-left:4px}.color-dot{width:16px;height:16px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:all .15s ease;position:relative;overflow:hidden}.color-dot:hover{transform:scale(1.1)}.color-dot.active{border-color:#1e293b;box-shadow:0 0 0 2px #fff,0 0 0 4px currentColor}.color-dot--custom{box-shadow:0 0 0 1px #cbd5e1}.color-dot--custom input[type=color]{position:absolute;top:-10px;left:-10px;width:40px;height:40px;cursor:pointer;opacity:0}.color-dot--custom:hover{box-shadow:0 0 0 1.5px #94a3b8}.insert-page-tool{position:relative}.insert-page-tool .insert-badge-icon{font-size:11px!important;margin-left:-6px;margin-top:-8px;color:#22c55e}.insert-page-dropdown{position:absolute;top:calc(100% + 4px);right:0;z-index:500}.insert-page-backdrop{position:fixed;inset:0;z-index:499}.insert-page-menu{position:relative;z-index:500;background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:8px;box-shadow:0 6px 24px #00000024;min-width:220px;display:flex;flex-direction:column;grid-gap:4px;gap:4px}.insert-page-title{font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;padding:2px 6px 6px;border-bottom:1px solid #f1f5f9;margin-bottom:2px}.insert-page-btn{display:flex;align-items:center;grid-gap:10px;gap:10px;width:100%;padding:9px 12px;border:1px solid transparent;border-radius:7px;background:transparent;cursor:pointer;color:#334155;font-size:13px;text-align:left;transition:all .15s}.insert-page-btn small{color:#94a3b8;font-size:11px}.insert-page-btn ion-icon{font-size:16px;color:#3b82f6;flex-shrink:0}.insert-page-btn:hover:not(:disabled){background:#eff6ff;border-color:#bfdbfe;color:#1e40af}.insert-page-btn:hover:not(:disabled) ion-icon{color:#1d4ed8}.insert-page-btn:active:not(:disabled){background:#dbeafe}.insert-page-btn:disabled{opacity:.35;cursor:not-allowed}.insert-page-btn--danger ion-icon{color:#ef4444}.insert-page-btn--danger:hover:not(:disabled){background:#fff1f2;border-color:#fecaca;color:#b91c1c}.insert-page-btn--danger:hover:not(:disabled) ion-icon{color:#dc2626}.insert-page-btn--danger:active:not(:disabled){background:#fee2e2}.insert-page-btn--undo ion-icon{color:#f59e0b}.insert-page-btn--undo:hover:not(:disabled){background:#fffbeb;border-color:#fde68a;color:#92400e}.insert-page-btn--undo:hover:not(:disabled) ion-icon{color:#d97706}.insert-page-btn--undo:active:not(:disabled){background:#fef3c7}.insert-orient-row{display:flex;align-items:center;grid-gap:8px;gap:8px;padding:4px 6px 8px}.insert-orient-label{font-size:12px;color:#64748b;white-space:nowrap;flex-shrink:0}.insert-orient-group{display:flex;grid-gap:4px;gap:4px;flex:1}.insert-orient-btn{display:flex;align-items:center;grid-gap:5px;gap:5px;flex:1;justify-content:center;padding:6px 8px;border:1.5px solid #e2e8f0;border-radius:7px;background:#f8fafc;cursor:pointer;font-size:12px;color:#475569;transition:all .15s}.insert-orient-btn ion-icon{font-size:15px}.insert-orient-btn:hover{background:#f1f5f9;border-color:#cbd5e1}.insert-orient-btn.active{background:#eff6ff;border-color:#3b82f6;color:#1e40af;font-weight:600}.insert-orient-btn.active ion-icon{color:#3b82f6}.insert-page-title--danger{color:#ef4444!important;background:#fff1f2;border-radius:5px;padding:3px 6px 6px!important}.insert-menu-divider{height:1px;background:#f1f5f9;margin:2px 0 4px}.shape-tool-item{position:relative;display:flex;align-items:flex-start;grid-gap:4px;gap:4px;flex-wrap:nowrap}.shape-chevron{font-size:10px!important;margin-left:-2px;opacity:.7}.mark-tool-item{position:relative;display:flex;align-items:flex-start}.mark-toolbar-btn{display:flex!important;flex-direction:row!important;align-items:center!important;grid-gap:4px!important;gap:4px!important;padding:0 8px!important;min-width:unset!important}.mark-btn-label{font-size:11px;font-weight:600;white-space:nowrap;letter-spacing:-.01em}.mark-chevron{font-size:10px!important;opacity:.7}.mark-popup{position:absolute;top:calc(100% + 6px);left:0;z-index:300;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 6px 24px #00000024;padding:12px 14px;min-width:210px;display:flex;flex-direction:column;grid-gap:8px;gap:8px}.mark-popup-section-label{font-size:11px;font-weight:600;color:#64748b;letter-spacing:.02em}.mark-popup-divider{height:1px;background:#f1f5f9;margin:0}.mark-quick-row{display:flex;grid-gap:8px;gap:8px;align-items:center}.mark-quick-btn{width:44px;height:44px;border:1.5px solid #e2e8f0;border-radius:8px;background:#f8fafc;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#1e293b;padding:0;transition:background .12s,border-color .12s}.mark-quick-btn:hover{background:#e2e8f0}.mark-quick-btn.active{background:#dbeafe;border-color:#3b82f6;color:#1d4ed8}.mark-form-list{display:flex;flex-direction:column;grid-gap:2px;gap:2px}.mark-form-row-btn{display:flex;align-items:center;grid-gap:10px;gap:10px;width:100%;padding:7px 8px;border:none;border-radius:7px;background:transparent;cursor:pointer;color:#1e293b;font-size:13.5px;text-align:left;transition:background .1s}.mark-form-row-btn:hover{background:#f1f5f9}.mark-form-row-btn.active{background:#dbeafe;color:#1d4ed8}.mark-form-row-icon{width:24px;height:24px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.mark-form-row-icon--text{font-size:14px;font-weight:700;color:inherit}.mark-controls-row{display:flex;align-items:center;grid-gap:4px;gap:4px}.mark-controls-row button{width:24px;height:24px;border:1px solid #e2e8f0;border-radius:4px;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}.mark-controls-row button:hover{background:#e2e8f0}.mark-controls-row button:disabled{opacity:.4;cursor:default}.mark-size-val{min-width:22px;text-align:center;font-size:12px;font-weight:500}.mark-cancel-btn{width:100%;display:flex;align-items:center;justify-content:center;grid-gap:6px;gap:6px;padding:7px 0;border:none;border-radius:6px;background:#f1f5f9;color:#64748b;font-size:13px;font-weight:500;cursor:pointer;transition:background .15s,color .15s}.mark-cancel-btn ion-icon{font-size:16px}.mark-cancel-btn:hover{background:#fee2e2;color:#ef4444}.shape-dropdown{position:absolute;top:calc(100% + 4px);left:0;z-index:300;display:flex;flex-direction:column;grid-gap:2px;gap:2px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:6px;box-shadow:0 4px 16px #0000001f;min-width:46px}.shape-dropdown .shape-dd-btn{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border:1px solid transparent;border-radius:6px;background:transparent;cursor:pointer;color:#475569;transition:all .15s}.shape-dropdown .shape-dd-btn ion-icon{font-size:18px}.shape-dropdown .shape-dd-btn:hover{background:#f1f5f9;color:#1e293b}.shape-dropdown .shape-dd-btn.active{background:#3b82f6;color:#fff;border-color:#2563eb}.shape-options-panel{display:flex;align-items:center;grid-gap:8px;gap:8px;flex-wrap:wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:5px 10px;margin-left:2px}.shape-opt-group{display:flex;align-items:center;grid-gap:5px;gap:5px}.shape-opt-label{font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.4px;white-space:nowrap}.sopt-divider{width:1px;height:30px;background:#e2e8f0;flex-shrink:0}.sopt-btn{display:flex;align-items:center;justify-content:center;width:22px;height:22px;border:1px solid #e2e8f0;border-radius:4px;background:#fff;cursor:pointer;color:#475569;transition:background .12s}.sopt-btn ion-icon{font-size:13px}.sopt-btn:hover:not(:disabled){background:#e2e8f0}.sopt-btn:disabled{opacity:.35;cursor:not-allowed}.sopt-val{font-size:11px;font-weight:600;color:#475569;min-width:18px;text-align:center}.sopt-fill-toggle{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border:1px solid #e2e8f0;border-radius:5px;background:#fff;cursor:pointer;color:#94a3b8;transition:all .15s}.sopt-fill-toggle ion-icon{font-size:15px}.sopt-fill-toggle:hover{background:#f1f5f9;color:#475569}.sopt-fill-toggle.active{background:#3b82f6;color:#fff;border-color:#2563eb}.mac-color-grid{display:grid;grid-template-columns:repeat(8,16px);grid-gap:2px;gap:2px;transition:opacity .15s}.mac-color-grid.disabled{opacity:.3;pointer-events:none}.mac-swatch{width:16px;height:16px;border-radius:3px;border:1.5px solid rgba(0,0,0,.18);cursor:pointer;transition:transform .1s,box-shadow .1s;flex-shrink:0}.mac-swatch:hover{transform:scale(1.25);z-index:2;box-shadow:0 2px 6px #0003}.mac-swatch.active{transform:scale(1.15);box-shadow:0 0 0 2px #fff,0 0 0 3.5px #3b82f6;z-index:3}.mac-swatch--current{width:22px;height:22px;border-radius:4px;border:2px solid #cbd5e1;cursor:default;pointer-events:none}.mac-swatch--current:hover{transform:none}.mac-custom-color{display:flex;align-items:center;grid-gap:3px;gap:3px;transition:opacity .15s}.mac-custom-color.disabled{opacity:.3;pointer-events:none}.mac-custom-color input[type=color]{width:22px;height:22px;border:2px solid #cbd5e1;border-radius:4px;padding:1px;cursor:pointer;background:none}.mac-custom-color input[type=color]::-webkit-color-swatch-wrapper{padding:0}.mac-custom-color input[type=color]::-webkit-color-swatch{border:none;border-radius:2px}@media (max-width: 767px){.shape-options-panel{padding:4px 6px;grid-gap:5px;gap:5px}.mac-color-grid{grid-template-columns:repeat(8,13px)}.mac-color-grid .mac-swatch{width:13px;height:13px}}.main-area{display:flex;flex:1;min-height:0;overflow:hidden}.thumbnails-sidebar{width:148px;min-width:148px;background:#1a2232;display:flex;flex-direction:column;overflow:visible;position:relative;z-index:10}.thumb-list{flex:1;overflow-y:auto;overflow-x:visible;display:flex;flex-direction:column;align-items:center;padding:8px 0 16px;grid-gap:0;gap:0;scrollbar-width:thin;scrollbar-color:#334155 #1a2232}.thumb-list::-webkit-scrollbar{width:5px}.thumb-list::-webkit-scrollbar-track{background:#1a2232}.thumb-list::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}.thumb-card-wrap{width:120px;display:flex;flex-direction:column;border-radius:10px;overflow:hidden;box-shadow:0 3px 12px #0000004d;flex-shrink:0}.thumb-card{width:120px;background:#243044;border-radius:0;overflow:hidden;cursor:pointer;border:2.5px solid transparent;border-bottom:none;transition:border-color .15s}.thumb-card-wrap:hover>.thumb-card{border-color:#63b3ed66}.thumb-card-wrap:has(.thumb-card.active)>.thumb-card{border-color:#3b82f6}.thumb-card.active{border-color:#3b82f6}.thumb-card__img-wrap{padding:6px 6px 0;overflow:hidden;border-radius:8px 8px 0 0}.thumb-card__img-wrap img{width:100%;border-radius:5px;display:block;box-shadow:0 2px 8px #0006}.thumb-card__label{display:block;text-align:center;color:#94a3b8;font-size:11px;font-weight:500;padding:4px 0 3px}.thumb-card__actions{display:flex;align-items:center;justify-content:space-around;padding:5px 4px;background:#0f172a;border-top:1px solid #334155;border-radius:0 0 8px 8px}.thumb-action-btn{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border:1px solid #334155;border-radius:6px;background:#1e293b;color:#94a3b8;cursor:pointer;transition:all .15s;flex-shrink:0}.thumb-action-btn ion-icon{font-size:15px}.thumb-action-btn:hover:not(:disabled){background:#334155;color:#e2e8f0;border-color:#475569}.thumb-action-btn:disabled{opacity:.25;cursor:not-allowed}.thumb-action-btn--danger{color:#f87171;border-color:#7f1d1d;background:#1c0a0a}.thumb-action-btn--danger:hover:not(:disabled){background:#450a0a;border-color:#ef4444;color:#fca5a5}.thumb-insert-row{display:flex;align-items:center;justify-content:center;width:100%;padding:6px 0;position:relative;flex-shrink:0}.thumb-insert-slot{position:relative;display:flex;align-items:center;justify-content:center}.thumb-add-btn{width:32px;height:32px;border-radius:50%;border:2px solid #3b82f6;background:#1e40af;color:#93c5fd;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;box-shadow:0 2px 8px #3b82f666}.thumb-add-btn ion-icon{font-size:18px;font-weight:700}.thumb-add-btn:hover{background:#2563eb;color:#fff;transform:scale(1.1);box-shadow:0 4px 14px #3b82f680}.thumb-add-btn:active{transform:scale(.95)}.thumb-insert-dropdown{position:fixed;left:158px;z-index:2000;transform:translateY(-50%)}.thumb-insert-backdrop{position:fixed;inset:0;z-index:698}.thumb-insert-menu{position:relative;z-index:699;background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:8px;box-shadow:0 8px 32px #0000002e;min-width:210px;display:flex;flex-direction:column;grid-gap:2px;gap:2px}.thumb-insert-menu:before{content:\"\";position:absolute;left:-8px;top:50%;transform:translateY(-50%);border:8px solid transparent;border-right-color:#fff;border-left:none}.thumb-insert-opt{display:flex;align-items:center;grid-gap:10px;gap:10px;width:100%;padding:10px 14px;border:1px solid transparent;border-radius:8px;background:transparent;cursor:pointer;color:#1e293b;font-size:14px;font-family:inherit;text-align:left;transition:all .15s}.thumb-insert-opt ion-icon{font-size:18px;color:#3b82f6;flex-shrink:0}.thumb-insert-opt:hover{background:#eff6ff;border-color:#bfdbfe;color:#1e40af}.thumb-insert-opt:hover ion-icon{color:#1d4ed8}.thumb-insert-opt:active{background:#dbeafe}.viewer-wrapper{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}.viewer-container{flex:1;overflow-y:auto;overflow-x:auto;background:#f1f5f9;display:flex;flex-direction:column;align-items:center;padding:20px;grid-gap:20px;gap:20px}.page-container{position:relative;box-shadow:0 4px 12px #00000026;background:#fff;flex-shrink:0}.page-container .pdf-canvas,.page-container .annot-canvas{display:block}.page-container .annot-canvas{position:absolute;top:0;left:0;touch-action:none}@media (max-width: 767px){.toolbar-row{padding:4px 8px;grid-gap:4px;gap:4px;flex-wrap:wrap}.toolbar-row--tools{padding:6px 8px}.toolbar-btn{padding:4px 6px}.toolbar-btn ion-icon{font-size:16px}.toolbar-btn span{display:none}.toolbar-divider{margin:0 4px}.thumbnails-sidebar{width:80px;min-width:80px;padding:8px 4px}.thumbnail-item img{max-width:64px}.tool-options{display:none}.hint{display:none}}@media (max-width: 480px){.thumbnails-sidebar{display:none}.toolbar-label{min-width:30px;font-size:10px}}.sidebar{width:200px;min-width:200px;background:#1e293b;color:#fff;display:flex;flex-direction:column;padding:16px;z-index:100;box-shadow:4px 0 15px #0000001a;overflow-y:auto}.sidebar__section{margin-bottom:24px}.sidebar__section--nav{background:rgba(255,255,255,.05);padding:12px;border-radius:12px;margin-bottom:20px;display:flex;flex-direction:column;grid-gap:12px;gap:12px}.sidebar__section--save{margin-top:auto;padding-top:20px;border-top:1px solid rgba(255,255,255,.1)}.sidebar__title{font-size:11px;font-weight:700;color:#fff6;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}.sidebar__row{display:flex;grid-gap:8px;gap:8px;margin-bottom:8px}.sidebar__row--wrap{flex-wrap:wrap}.sidebar__btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;grid-gap:6px;gap:6px;padding:10px 4px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#fffc;font-size:11px;cursor:pointer;transition:all .2s;box-shadow:0 2px 4px #0000001a}.sidebar__btn ion-icon{font-size:20px}.sidebar__btn:hover:not([disabled]){background:rgba(255,255,255,.15);color:#fff;transform:translateY(-1px);box-shadow:0 4px 8px #0003}.sidebar__btn.active{background:#3b82f6;color:#fff;border-color:#60a5fa;box-shadow:0 4px 12px #3b82f666}.sidebar__btn[disabled]{opacity:.3;cursor:not-allowed}.sidebar__btn--signature{background:rgba(139,92,246,.1);border-color:#8b5cf64d;color:#a78bfa}.sidebar__btn--signature.active,.sidebar__btn--signature:hover:not([disabled]){background:#8b5cf6;color:#fff}.sidebar__btn--date{background:rgba(16,185,129,.1);border-color:#10b9814d;color:#34d399}.sidebar__btn--date.active,.sidebar__btn--date:hover:not([disabled]){background:#10b981;color:#fff}.sidebar__btn--warning{background:rgba(239,68,68,.1);border-color:#ef44444d;color:#f87171}.sidebar__btn--warning:hover:not([disabled]){background:#ef4444;color:#fff}.sidebar__btn--save{background:#10b981;color:#fff;flex-direction:row;grid-gap:10px;gap:10px;font-size:14px;font-weight:600;padding:14px;box-shadow:0 4px 12px #10b98140}.sidebar__btn--save:hover:not([disabled]){background:#059669;box-shadow:0 6px 18px #10b98166}.sidebar__btn--small{flex:0 0 calc(50% - 4px);padding:8px}.sidebar__picker{display:flex;align-items:center;grid-gap:8px;gap:8px;padding:6px 8px;margin-bottom:6px;border-radius:6px;background:rgba(255,255,255,.05)}.sidebar__picker label{font-size:11px;color:#fff9;min-width:60px}.sidebar__picker input[type=color]{width:24px;height:24px;border:2px solid rgba(255,255,255,.2);border-radius:4px;cursor:pointer;padding:0}.sidebar__picker input[type=range]{flex:1;max-width:50px}.sidebar__picker span{font-size:11px;color:#ffffffb3;min-width:20px;text-align:right}.main-content{flex:1;display:flex;flex-direction:column;height:100%;min-height:0;overflow:hidden;background:#cbd5e1}.topbar-desktop{display:flex;align-items:center;justify-content:center;padding:8px 20px;background:#fff;border-bottom:1px solid #e2e8f0;box-shadow:0 2px 4px #00000005;min-height:56px}.topbar-desktop__tools{display:flex;align-items:center;grid-gap:12px;gap:12px}.topbar-desktop__tool-btn{display:flex;align-items:center;grid-gap:6px;gap:6px;padding:8px 14px;border:none;border-radius:8px;background:#fff;color:#475569;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s ease;box-shadow:0 2px 5px #00000014}.topbar-desktop__tool-btn ion-icon{font-size:18px}.topbar-desktop__tool-btn:hover:not([disabled]){background:#f1f5f9;color:#1e293b;transform:translateY(-1px);box-shadow:0 4px 10px #0000001f}.topbar-desktop__tool-btn.active{background:#3b82f6;color:#fff}.topbar-desktop__tool-btn[disabled]{opacity:.4;cursor:not-allowed}.topbar-desktop .tool-option{display:flex;align-items:center;grid-gap:8px;gap:8px;background:#fff;padding:2px 8px;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 2px 5px #0000000d}.topbar-desktop .tool-option .size-controls{display:flex;align-items:center;grid-gap:4px;gap:4px;padding-left:8px;border-left:1px solid #e2e8f0}.topbar-desktop .tool-option .size-controls button{background:none;border:none;padding:4px;cursor:pointer;color:#64748b;display:flex;align-items:center}.topbar-desktop .tool-option .size-controls button:hover:not([disabled]){color:#3b82f6}.topbar-desktop .tool-option .size-controls button[disabled]{opacity:.3}.topbar-desktop .tool-option .size-controls .size-val{font-size:12px;font-weight:700;min-width:20px;text-align:center}.topbar-desktop .tool-option .size-controls .format-btn{background:none;border:none;border-radius:4px;padding:4px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#64748b;transition:all .2s}.topbar-desktop .tool-option .size-controls .format-btn:hover{background:#f1f5f9;color:#1e293b}.topbar-desktop .tool-option .size-controls .format-btn.active{color:#3b82f6;background:#eff6ff}.topbar-desktop .tool-option .size-controls .format-btn--text{font-family:serif;font-size:16px}.topbar-desktop .tool-option .size-controls .format-btn--text span{display:block;width:18px;text-align:center}.topbar-desktop .tool-option .size-controls .format-btn ion-icon{font-size:18px}.topbar-desktop .tool-option .size-controls .color-palette{display:flex;align-items:center;grid-gap:6px;gap:6px;margin-left:8px}.topbar-desktop .tool-option .size-controls .color-palette .color-dot{width:16px;height:16px;border-radius:50%;cursor:pointer;border:2px solid #e2e8f0;transition:transform .2s}.topbar-desktop .tool-option .size-controls .color-palette .color-dot:hover{transform:scale(1.2)}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.active{border-color:#3b82f6;transform:scale(1.1)}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.blue{background:#0000FF}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.red{background:#FF0000}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.black{background:#000000}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.green{background:#008000}.topbar-desktop__divider{width:1px;height:24px;background:#e2e8f0;margin:0 4px}.topbar-desktop__divider--small{height:16px;opacity:.6}.topbar-desktop .save-btn{background:#10b981;color:#fff;border:none;padding:8px 18px;border-radius:8px;font-weight:600;display:flex;align-items:center;grid-gap:8px;gap:8px;cursor:pointer;box-shadow:0 2px 4px #10b98133;margin-left:20px}.topbar-desktop .save-btn:hover{background:#059669}.topbar-pager,.topbar-zoom{display:flex;align-items:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:2px 6px;grid-gap:8px;gap:8px;height:38px}.topbar-pager__btn,.topbar-zoom__btn{background:transparent;border:none;padding:6px;cursor:pointer;color:#64748b;display:flex;align-items:center;border-radius:4px;transition:all .2s}.topbar-pager__btn:hover:not([disabled]),.topbar-zoom__btn:hover:not([disabled]){background:#f1f5f9;color:#3b82f6}.topbar-pager__btn[disabled],.topbar-zoom__btn[disabled]{opacity:.3;cursor:not-allowed}.topbar-pager__btn ion-icon,.topbar-zoom__btn ion-icon{font-size:16px}.topbar-pager__info,.topbar-pager__val,.topbar-zoom__info,.topbar-zoom__val{font-size:13px;font-weight:700;color:#475569;min-width:45px;text-align:center;-webkit-user-select:none;user-select:none}.topbar-zoom .fit-btn{font-size:11px;font-weight:700;text-transform:uppercase;color:#3b82f6;background:transparent;border:none;padding:4px 10px;cursor:pointer;letter-spacing:.5px}.topbar-zoom .fit-btn:hover{color:#2563eb;text-decoration:underline}.viewer-container{flex:1;overflow:auto!important;position:relative;padding:40px 20px;background:#cbd5e1;scrollbar-width:thin;-webkit-overflow-scrolling:touch;touch-action:auto;text-align:center}.page-container{position:relative;display:inline-block;margin-bottom:30px;background:#fff;box-shadow:0 10px 30px #00000026;text-align:left}.page-container.single-page{margin-bottom:0}.pdf-canvas{display:block}.annot-canvas{position:absolute;top:0;left:0;z-index:10;touch-action:auto;pointer-events:none}.annot-canvas.tools-active{pointer-events:auto;touch-action:none!important;-webkit-touch-callout:none!important;-webkit-user-select:none!important;user-select:none!important}.text-box{position:absolute;pointer-events:auto;border-radius:2px;border:1px solid transparent;background:transparent;display:flex;flex-direction:column;z-index:20;min-width:30px;min-height:20px;box-sizing:border-box;cursor:move;padding:3px}.text-box:hover{border-color:#c0c4cb}.text-box.active{border:1px solid #c0c4cb;background:transparent}.text-box textarea{width:100%;height:100%;border:none;background:transparent;padding:0 3px;resize:none;outline:none;font-family:\"THSarabunNew\",sans-serif;font-size:inherit;font-weight:inherit;font-style:inherit;text-align:inherit;color:inherit;overflow:hidden;display:block;line-height:1.4;box-sizing:border-box;cursor:text}.text-box .tb-handle{position:absolute;width:12px;height:12px;background:#1a73e8;border:2px solid #fff;border-radius:50%;top:50%;transform:translateY(-50%);cursor:ew-resize;z-index:27;display:none;box-shadow:0 1px 3px #00000040}.text-box .tb-handle--left{left:-6px}.text-box .tb-handle--right{right:-6px}.text-box.active .tb-handle{display:block}.image-stamp,.signature-stamp{position:absolute;pointer-events:auto;cursor:move;border:1px dashed transparent;z-index:20;touch-action:none}.image-stamp:hover,.signature-stamp:hover{border-color:#3b82f6}.image-stamp:hover .remove-btn,.signature-stamp:hover .remove-btn{opacity:1}.image-stamp img,.signature-stamp img{width:100%;height:100%;display:block;-webkit-user-select:none;user-select:none;pointer-events:none}.image-stamp.mark-stamp-active{outline:2px solid #3b82f6;outline-offset:2px;border-color:#3b82f6}.image-stamp.mark-stamp-active .resize-handle{opacity:1}.image-stamp.mark-stamp-active .remove-btn{opacity:1}.image-stamp .mark-options-bar{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translate(-50%);background:#1e293b;border:1px solid #334155;border-radius:8px;display:flex;align-items:center;grid-gap:1px;gap:1px;padding:3px 5px;z-index:50;white-space:nowrap;box-shadow:0 4px 14px #00000073;pointer-events:auto}.image-stamp .mark-options-bar .pff-opt-btn{width:24px;height:24px;border:none;background:transparent;color:#e2e8f0;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;padding:0;flex-shrink:0}.image-stamp .mark-options-bar .pff-opt-btn:hover{background:rgba(255,255,255,.1)}.image-stamp .mark-options-bar .pff-opt-btn.pff-opt-delete{color:#f87171}.image-stamp .mark-options-bar .pff-opt-btn.pff-opt-delete:hover{background:rgba(239,68,68,.2)}.image-stamp .mark-options-bar .pff-opt-btn[disabled]{opacity:.3;cursor:not-allowed;pointer-events:none}.image-stamp .mark-options-bar .pff-opt-val{font-size:11px;color:#e2e8f0;min-width:22px;text-align:center;font-weight:600;line-height:1}.image-stamp .mark-options-bar .pff-opt-label{font-size:11px;color:#94a3b8;margin:0 2px;display:flex;align-items:center}.image-stamp .mark-options-bar .pff-opt-label ion-icon{font-size:13px}.image-stamp .mark-options-bar .pff-opt-sep{width:1px;height:16px;background:#334155;margin:0 3px;flex-shrink:0}.shape-stamp{position:absolute;pointer-events:auto;cursor:move;border:1px dashed transparent;z-index:20;touch-action:none;overflow:visible}.shape-stamp svg{display:block;width:100%;height:100%;overflow:visible;pointer-events:none;-webkit-user-select:none;user-select:none}.shape-stamp:hover{border-color:#3b82f699}.shape-stamp:hover .remove-btn{opacity:1}.shape-stamp:hover .resize-handle{opacity:1}.signature-stamp img{mix-blend-mode:multiply}.signature-stamp .digital-id-label{position:absolute;left:100%;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;grid-gap:0;gap:0;pointer-events:none;white-space:nowrap;margin-left:6px}.signature-stamp .digital-id-label span{font-size:8px;color:#555;font-family:\"Courier New\",monospace;letter-spacing:.3px;line-height:1.4}.signature-stamp .remove-btn{position:absolute;top:-10px;left:-10px;width:20px;height:20px;background:#ef4444;color:#fff;border:none;border-radius:50%;font-size:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity .2s;z-index:26}.pdf-form-field{position:absolute;pointer-events:auto;cursor:move;box-sizing:border-box;touch-action:none;z-index:20}.pdf-form-field.pff-mark{border:1.5px solid #3b82f6;border-radius:3px;background:transparent;min-width:10px;min-height:10px}.pdf-form-field.pff-text{border:1.5px solid #3b82f6;border-radius:3px;background:rgba(219,234,254,.25);min-width:40px;min-height:14px}.pdf-form-field.pff-checkbox{border:1.5px solid #3b82f6;border-radius:3px;background:rgba(219,234,254,.2);min-width:14px;min-height:14px}.pdf-form-field.pff-radio{border:1.5px solid #3b82f6;border-radius:50%;background:rgba(219,234,254,.2);min-width:14px;min-height:14px}.pdf-form-field:hover{border-color:#1d4ed8}.pdf-form-field:hover .remove-btn{opacity:1}.pdf-form-field .pff-inner{width:100%;height:100%;display:flex;align-items:center;justify-content:center;pointer-events:none}.pdf-form-field .pff-text-hint{font-size:10px;color:#3b82f6;font-weight:600;opacity:.8;-webkit-user-select:none;user-select:none}.pdf-form-field .remove-btn{position:absolute;top:-8px;right:-8px;width:16px;height:16px;background:#ef4444;color:#fff;border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;opacity:0;transition:opacity .15s;z-index:30;pointer-events:auto}.pdf-form-field .resize-handle{opacity:0}.pdf-form-field:hover .resize-handle{opacity:1}.pdf-form-field.pff-no-border{border-color:transparent!important;background:rgba(219,234,254,.08)}.pdf-form-field.pff-active{outline:2px solid #3b82f6;outline-offset:1px}.pdf-form-field.pff-active .pff-resize-handle{opacity:1}.pdf-form-field:hover .pff-resize-handle{opacity:1}.pdf-form-field .pff-resize-handle{position:absolute;width:8px;height:8px;background:#3b82f6;border:1.5px solid #fff;border-radius:50%;z-index:25;touch-action:none;opacity:0;transition:opacity .15s}.pdf-form-field .pff-resize-handle.rh-nw{top:-4px;left:-4px;cursor:nw-resize}.pdf-form-field .pff-resize-handle.rh-n{top:-4px;left:calc(50% - 4px);cursor:n-resize}.pdf-form-field .pff-resize-handle.rh-ne{top:-4px;right:-4px;cursor:ne-resize}.pdf-form-field .pff-resize-handle.rh-e{top:calc(50% - 4px);right:-4px;cursor:e-resize}.pdf-form-field .pff-resize-handle.rh-se{bottom:-4px;right:-4px;cursor:se-resize}.pdf-form-field .pff-resize-handle.rh-s{bottom:-4px;left:calc(50% - 4px);cursor:s-resize}.pdf-form-field .pff-resize-handle.rh-sw{bottom:-4px;left:-4px;cursor:sw-resize}.pdf-form-field .pff-resize-handle.rh-w{top:calc(50% - 4px);left:-4px;cursor:w-resize}.pdf-form-field .pff-options-bar{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translate(-50%);background:#1e293b;border:1px solid #334155;border-radius:8px;display:flex;align-items:center;grid-gap:1px;gap:1px;padding:3px 5px;z-index:50;white-space:nowrap;box-shadow:0 4px 14px #00000073;pointer-events:auto}.pdf-form-field .pff-options-bar .pff-opt-btn{width:24px;height:24px;border:none;background:transparent;color:#e2e8f0;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;padding:0;flex-shrink:0}.pdf-form-field .pff-options-bar .pff-opt-btn:hover{background:rgba(255,255,255,.1)}.pdf-form-field .pff-options-bar .pff-opt-btn.pff-opt-active{background:rgba(59,130,246,.3);color:#60a5fa}.pdf-form-field .pff-options-bar .pff-opt-btn.pff-opt-delete{color:#f87171}.pdf-form-field .pff-options-bar .pff-opt-btn.pff-opt-delete:hover{background:rgba(239,68,68,.2)}.pdf-form-field .pff-options-bar .pff-opt-btn[disabled]{opacity:.3;cursor:not-allowed;pointer-events:none}.pdf-form-field .pff-options-bar .pff-opt-val{font-size:11px;color:#e2e8f0;min-width:22px;text-align:center;font-weight:600;line-height:1}.pdf-form-field .pff-options-bar .pff-opt-label{font-size:11px;color:#94a3b8;margin:0 2px;font-style:italic;font-weight:700;display:flex;align-items:center}.pdf-form-field .pff-options-bar .pff-opt-label ion-icon{font-size:13px}.pdf-form-field .pff-options-bar .pff-opt-sep{width:1px;height:16px;background:#334155;margin:0 3px;flex-shrink:0}.date-stamp{position:absolute;pointer-events:auto;cursor:move;padding:4px 8px;background:rgba(255,255,255,.8);border:1px dashed #ccc;border-radius:4px;white-space:nowrap;font-family:\"THSarabunNew\",sans-serif;z-index:20;touch-action:none}.date-stamp:hover{border-color:#3b82f6}.date-stamp:hover .remove-btn{opacity:1}.date-stamp .remove-btn{position:absolute;top:-8px;right:-8px;width:16px;height:16px;background:#ef4444;color:#fff;border:none;border-radius:50%;font-size:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity .2s}.resize-handle{position:absolute;width:10px;height:10px;background:#3b82f6;border:1px solid #fff;border-radius:50%;z-index:22;touch-action:none;display:none}.resize-handle.rh-nw{top:-5px;left:-5px;cursor:nw-resize}.resize-handle.rh-n{top:-5px;left:calc(50% - 5px);cursor:n-resize}.resize-handle.rh-ne{top:-5px;right:-5px;cursor:ne-resize}.resize-handle.rh-e{top:calc(50% - 5px);right:-5px;cursor:e-resize}.resize-handle.rh-se{bottom:-5px;right:-5px;cursor:se-resize}.resize-handle.rh-s{bottom:-5px;left:calc(50% - 5px);cursor:s-resize}.resize-handle.rh-sw{bottom:-5px;left:-5px;cursor:sw-resize}.resize-handle.rh-w{top:calc(50% - 5px);left:-5px;cursor:w-resize}.image-stamp:hover .resize-handle,.signature-stamp:hover .resize-handle,.shape-stamp:hover .resize-handle{display:block}@media (max-width: 991px){.topbar-desktop__tools{display:none}}@media (max-width: 767px){.annotator-layout{flex-direction:column}.sidebar{width:100%;height:auto;max-height:140px;min-width:0;order:2;flex-direction:row;flex-wrap:wrap;overflow-x:auto;overflow-y:auto;padding:8px 12px;grid-gap:8px;gap:8px;scrollbar-width:none;-ms-overflow-style:none;justify-content:center;align-items:flex-start}.sidebar::-webkit-scrollbar{display:none}.sidebar__section{margin-bottom:0;flex-shrink:0;display:flex;flex-direction:row;justify-content:center;align-items:center}.sidebar__section--nav,.sidebar__section--save,.sidebar__section .sidebar__title{display:none}.sidebar__row{margin-bottom:0;grid-gap:6px;gap:6px;display:flex;flex-wrap:wrap;justify-content:center}.sidebar__btn{width:48px;height:48px;flex:none;font-size:9px;padding:4px}.sidebar__btn ion-icon{font-size:20px}.sidebar__btn span{display:none}.topbar-desktop{display:flex;padding:8px 12px}.topbar-desktop .save-btn,.topbar-desktop .doc-title{display:none}.topbar-desktop .topbar-desktop__left{display:none}.topbar-desktop .topbar-desktop__center{margin:0 auto}.viewer{padding:10px}}.mobile-pager{display:none}@media (max-width: 767px){.mobile-pager{display:flex;position:absolute;top:60px;right:16px;z-index:10;background:rgba(0,0,0,.6);color:#fff;padding:4px 12px;border-radius:20px;font-size:12px;backdrop-filter:blur(4px)}}.loading-overlay{position:fixed;inset:0;z-index:20003;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);backdrop-filter:blur(4px)}.loading-overlay .loading-content{background:#fff;padding:32px 48px;border-radius:16px;text-align:center}.loading-overlay .loading-content ion-spinner{--color: #3b82f6;width:48px;height:48px}.loading-overlay .loading-content .loading-msg{margin-top:16px;font-size:14px;color:#334155}.loading-overlay .loading-content--progress{min-width:300px;padding:28px 32px}.loading-overlay .loading-content--progress .save-progress-icon{display:flex;align-items:center;justify-content:center;grid-gap:10px;gap:10px;margin-bottom:16px}.loading-overlay .loading-content--progress .save-progress-icon ion-icon{font-size:36px;color:#3b82f6}.loading-overlay .loading-content--progress .save-progress-icon .save-progress-pct{font-size:32px;font-weight:800;color:#1e293b;letter-spacing:-1px;line-height:1;min-width:64px;text-align:left}.loading-overlay .loading-content--progress .save-progress-bar-track{width:100%;height:10px;background:#e2e8f0;border-radius:99px;overflow:hidden;margin-bottom:14px}.loading-overlay .loading-content--progress .save-progress-bar-track .save-progress-bar-fill{height:100%;background:linear-gradient(90deg,#3b82f6 0%,#06b6d4 100%);border-radius:99px;transition:width .3s ease,background .5s ease}.loading-overlay .loading-content--progress .save-progress-bar-track .save-progress-bar-fill--preview{background:linear-gradient(90deg,#06b6d4 0%,#22c55e 100%)}.loading-overlay .loading-content--progress .save-progress-bar-track .save-progress-bar-fill--serializing{background:linear-gradient(90deg,#3b82f6 0%,#8b5cf6 50%,#3b82f6 100%);background-size:200% 100%;animation:shimmerBar 1.5s linear infinite}.loading-overlay .loading-content--progress .save-progress-phases{display:flex;justify-content:space-between;grid-gap:8px;gap:8px;margin-bottom:12px}.loading-overlay .loading-content--progress .save-progress-phases span{display:flex;align-items:center;grid-gap:4px;gap:4px;font-size:11.5px;color:#94a3b8;transition:color .3s}.loading-overlay .loading-content--progress .save-progress-phases span ion-icon{font-size:13px}.loading-overlay .loading-content--progress .save-progress-phases span.active{color:#3b82f6;font-weight:600}.loading-overlay .loading-content--progress .loading-msg{font-size:13px;color:#64748b;margin-top:4px}.signature-modal,.signature-picker-modal{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center}.signature-modal__backdrop,.signature-picker-modal__backdrop{position:absolute;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px)}.signature-modal__content,.signature-picker-modal__content{position:relative;background:#fff;padding:28px 36px;border-radius:20px;box-shadow:0 24px 60px #00000040;text-align:center;width:95%;max-width:500px}@media (max-width: 500px){.signature-modal__content,.signature-picker-modal__content{padding:20px}}.signature-modal__content h3,.signature-picker-modal__content h3{margin:0 0 8px;font-size:22px;font-weight:600;color:#1e293b}.signature-modal__hint,.signature-picker-modal__hint{margin:0 0 20px;font-size:14px;color:#64748b}.signature-modal__canvas,.signature-picker-modal__canvas{display:block;width:100%;height:auto;aspect-ratio:2/1;border:2px solid #e2e8f0;border-radius:12px;background:#fff;cursor:crosshair;touch-action:none}.signature-modal__actions,.signature-picker-modal__actions{display:flex;grid-gap:12px;gap:12px;justify-content:center;margin-top:24px;flex-wrap:wrap}.signature-modal__pen-options,.signature-picker-modal__pen-options{display:flex;align-items:center;justify-content:center;grid-gap:20px;gap:20px;margin-bottom:16px;padding:8px 16px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0}.signature-modal__pen-options .pen-option-group,.signature-picker-modal__pen-options .pen-option-group{display:flex;align-items:center;grid-gap:8px;gap:8px}.signature-modal__pen-options .pen-option-label,.signature-picker-modal__pen-options .pen-option-label{font-size:13px;color:#64748b;font-weight:500}.signature-modal__pen-options .pen-size-btn,.signature-picker-modal__pen-options .pen-size-btn{width:28px;height:28px;border:1px solid #e2e8f0;background:#fff;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}.signature-modal__pen-options .pen-size-btn:hover:not(:disabled),.signature-picker-modal__pen-options .pen-size-btn:hover:not(:disabled){background:#e2e8f0}.signature-modal__pen-options .pen-size-btn:disabled,.signature-picker-modal__pen-options .pen-size-btn:disabled{opacity:.4;cursor:not-allowed}.signature-modal__pen-options .pen-size-btn ion-icon,.signature-picker-modal__pen-options .pen-size-btn ion-icon{font-size:14px}.signature-modal__pen-options .pen-size-val,.signature-picker-modal__pen-options .pen-size-val{font-size:13px;font-weight:600;min-width:28px;text-align:center;color:#334155}.signature-picker-modal__list{flex:1;overflow-y:auto;max-height:40vh;padding:4px 0;margin:16px 0}.signature-item{display:flex;align-items:center;grid-gap:14px;gap:14px;padding:12px 14px;margin-bottom:8px;border:2px solid #e2e8f0;border-radius:12px;cursor:pointer;transition:all .15s}.signature-item:hover{border-color:#3b82f6;background:#f8fafc;transform:translate(4px)}.signature-item img{width:100px;height:50px;object-fit:contain;background:#fff;border-radius:6px;border:1px solid #e2e8f0}.signature-item__info{flex:1;display:flex;flex-direction:column;grid-gap:4px;gap:4px;text-align:left}.signature-item__name{font-size:14px;font-weight:500;color:#1e293b}.signature-item__badge{display:inline-block;padding:2px 8px;font-size:11px;font-weight:600;color:#3b82f6;background:#eff6ff;border-radius:10px;width:-moz-fit-content;width:fit-content}.signature-item__actions{display:flex;grid-gap:6px;gap:6px}.signature-item__btn{width:32px;height:32px;border:none;border-radius:8px;background:#f1f5f9;color:#64748b;display:flex;align-items:center;justify-content:center}.signature-item__btn:hover{background:#e2e8f0;color:#334155}.signature-item__btn.active{background:#fef3c7;color:#f59e0b}.signature-item__btn--delete:hover{background:#fee2e2;color:#ef4444}.hint{background:#f8fafc;padding:10px 20px;font-size:11px;color:#64748b;border-top:1px solid #e2e8f0}.preview-overlay{position:fixed;top:0;left:0;width:100%;height:100dvh;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);z-index:20001;display:flex;flex-direction:column;overflow:hidden;animation:fadeIn .3s ease-out}.preview-overlay .preview-header{flex-shrink:0;position:relative;background:#fff;padding:14px 24px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 12px #0000001f;z-index:20002}.preview-overlay .preview-header .preview-title{font-size:1.1rem;font-weight:700;color:#1f2937;display:flex;align-items:center;grid-gap:8px;gap:8px}.preview-overlay .preview-header .preview-title:before{content:\"\";display:inline-block;width:4px;height:20px;background:linear-gradient(180deg,#22c55e,#16a34a);border-radius:2px}.preview-overlay .preview-header .preview-actions{display:flex;grid-gap:10px;gap:10px;align-items:center}.preview-overlay .preview-header .preview-actions ion-button[fill=clear]{--color: #64748b;font-weight:500;font-size:14px}.preview-overlay .preview-header .preview-actions ion-button[color=success]{--background: linear-gradient(135deg, #22c55e 0%, #15803d 100%);--background-activated: #15803d;--background-hover: #16a34a;--color: #fff;--border-radius: 10px;--padding-start: 22px;--padding-end: 22px;--padding-top: 12px;--padding-bottom: 12px;--box-shadow: 0 4px 16px rgba(34, 197, 94, .45);font-weight:700;font-size:15px;letter-spacing:.3px;animation:confirmPulse 2.4s ease-in-out infinite}.preview-overlay .preview-scroll-area{flex:1;overflow-y:auto;overflow-x:hidden}.preview-overlay .preview-body{min-height:100%;padding:20px;display:flex;flex-direction:column;align-items:center}.preview-overlay .preview-body .preview-filter-bar{display:flex;align-items:center;grid-gap:8px;gap:8px;background:rgba(255,193,7,.15);border:1px solid rgba(255,193,7,.4);border-radius:8px;padding:8px 14px;margin-bottom:12px;width:100%;max-width:1100px;color:#ffe082;font-size:13px}.preview-overlay .preview-body .preview-filter-bar ion-icon{font-size:18px;flex-shrink:0}.preview-overlay .preview-body .preview-filter-bar span{flex:1}.preview-overlay .preview-body .preview-filter-bar ion-button{--color: #ffe082;--border-color: rgba(255, 193, 7, .5);border:1px solid rgba(255,193,7,.5);border-radius:6px;flex-shrink:0}.preview-overlay .preview-body iframe{width:100%;height:100%;max-width:1100px;background:white;border-radius:8px;box-shadow:0 10px 25px #0000004d}.preview-overlay .preview-body .preview-pages{display:flex;flex-direction:column;grid-gap:16px;gap:16px;max-width:1100px;width:100%}.preview-overlay .preview-body .preview-page-img{width:100%;background:white;border-radius:8px;box-shadow:0 4px 12px #00000026}.preview-overlay .preview-body .preview-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;grid-gap:16px;gap:16px}.preview-overlay .preview-body .preview-loading ion-spinner{--color: white;width:48px;height:48px}.preview-overlay .preview-body .preview-loading p{font-size:16px;margin:0}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes shimmerBar{0%{background-position:200% 0}to{background-position:-200% 0}}@keyframes confirmPulse{0%,to{box-shadow:0 4px 16px #22c55e73}50%{box-shadow:0 4px 24px #22c55ebf,0 0 0 4px #22c55e26}}::ng-deep .textLayer{position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;opacity:1;line-height:1;z-index:5;--scale-factor: 1}::ng-deep .textLayer>span,::ng-deep .textLayer>br{color:transparent!important;position:absolute;white-space:pre;cursor:text;transform-origin:0% 0%}::ng-deep .textLayer ::selection{background:rgba(59,130,246,.3);color:transparent!important}.annot-history-drawer,.user-guide-drawer{position:absolute;top:0;right:0;bottom:0;left:0;z-index:999;pointer-events:none}.annot-history-drawer.open,.user-guide-drawer.open{pointer-events:auto}.annot-history-drawer__backdrop,.user-guide-drawer__backdrop{position:absolute;inset:0;background:rgba(0,0,0,0);transition:background .3s}.annot-history-drawer.open .annot-history-drawer__backdrop,.user-guide-drawer.open .annot-history-drawer__backdrop,.annot-history-drawer.open .user-guide-drawer__backdrop,.user-guide-drawer.open .user-guide-drawer__backdrop{background:rgba(0,0,0,.45)}.annot-history-drawer__panel,.user-guide-drawer__panel{position:absolute;top:0;right:0;bottom:0;width:min(340px,92vw);background:#1e293b;border-left:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;transform:translate(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);box-shadow:-6px 0 28px #00000059}.annot-history-drawer.open .annot-history-drawer__panel,.user-guide-drawer.open .annot-history-drawer__panel,.annot-history-drawer.open .user-guide-drawer__panel,.user-guide-drawer.open .user-guide-drawer__panel{transform:translate(0)}.annot-history-drawer__header,.user-guide-drawer__header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 12px;border-bottom:1px solid rgba(255,255,255,.07);font-size:14px;font-weight:700;color:#e8eaf6}.annot-history-drawer__header ion-icon,.user-guide-drawer__header ion-icon{margin-right:6px;color:#6c8ef5;vertical-align:-2px}.annot-history-drawer__header button,.user-guide-drawer__header button{background:none;border:none;color:#8892b0;cursor:pointer;font-size:20px;display:flex;align-items:center}.annot-history-drawer__header button:hover,.user-guide-drawer__header button:hover{color:#e8eaf6}.annot-history-drawer__loading,.user-guide-drawer__loading{display:flex;align-items:center;justify-content:center;padding:40px;color:#8892b0}.annot-history-drawer__loading ion-spinner,.user-guide-drawer__loading ion-spinner{--color: #6c8ef5}.annot-history-list{flex:1;overflow-y:auto;padding:6px 0;scrollbar-width:thin;scrollbar-color:#334155 #1e293b}.annot-history-list::-webkit-scrollbar{width:5px}.annot-history-list::-webkit-scrollbar-track{background:#1e293b}.annot-history-list::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}.annot-history-entry{display:flex;align-items:flex-start;grid-gap:11px;gap:11px;padding:9px 14px;border-bottom:1px solid rgba(255,255,255,.04);transition:background .12s}.annot-history-entry:last-child{border-bottom:none}.annot-history-entry:hover{background:rgba(255,255,255,.03)}.annot-history-entry__icon{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px;background:rgba(108,142,245,.15);color:#6c8ef5}.annot-history-entry__icon.hi-sign{background:rgba(74,222,128,.15);color:#4ade80}.annot-history-entry__icon.hi-save{background:rgba(251,191,36,.15);color:#fbbf24}.annot-history-entry__icon.hi-page_delete{background:rgba(255,77,109,.15);color:#ff4d6d}.annot-history-entry__icon.hi-page_insert{background:rgba(94,234,212,.15);color:#5eead4}.annot-history-entry__icon.hi-upload{background:rgba(167,139,250,.15);color:#a78bfa}.annot-history-entry__icon.hi-draw{background:rgba(251,113,133,.15);color:#fb7185}.annot-history-entry__icon.hi-highlight{background:rgba(251,191,36,.15);color:#fbbf24}.annot-history-entry__icon.hi-text{background:rgba(147,197,253,.15);color:#93c5fd}.annot-history-entry__body{flex:1;min-width:0}.annot-history-entry__title{font-size:13px;font-weight:600;color:#e8eaf6;display:flex;align-items:center;grid-gap:6px;gap:6px}.annot-history-entry__page{font-size:11px;background:rgba(108,142,245,.15);color:#6c8ef5;padding:1px 6px;border-radius:10px;font-weight:400}.annot-history-entry__user{font-size:12px;color:#8892b0;margin-top:2px}.annot-history-entry__time{font-size:11px;color:#8892b08c;margin-top:1px}.annot-history-empty{display:flex;flex-direction:column;align-items:center;padding:56px 24px;color:#8892b0;grid-gap:10px;gap:10px}.annot-history-empty ion-icon{font-size:36px;opacity:.4}.annot-history-empty p{font-size:13px;margin:0}.custom-context-backdrop{position:fixed;inset:0;z-index:99998;cursor:pointer;touch-action:none}.custom-context-menu{position:fixed;z-index:99999;background:rgba(255,255,255,.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(0,0,0,.1);border-radius:8px;box-shadow:0 4px 16px #00000026;padding:4px;min-width:220px;display:flex;flex-direction:column}.custom-context-menu .menu-btn{display:flex;align-items:center;grid-gap:8px;gap:8px;width:100%;padding:8px 12px;border:none;background:transparent;cursor:pointer;font-size:13px;color:#334155;border-radius:4px;text-align:left;transition:background .1s}.custom-context-menu .menu-btn ion-icon{font-size:16px;color:#64748b}.custom-context-menu .menu-btn:hover{background:#3b82f6;color:#fff}.custom-context-menu .menu-btn:hover ion-icon{color:#fff}.custom-context-menu .menu-btn.danger-btn:hover{background:#ef4444;color:#fff}.custom-context-menu .menu-btn.danger-btn:hover ion-icon{color:#fff}.custom-context-menu .menu-divider{height:1px;background:rgba(0,0,0,.08);margin:4px 0}.user-guide-content-area{flex:1;overflow-y:auto;padding:20px;background:#0f172a}.guide-view-mode{display:flex;flex-direction:column;grid-gap:24px;gap:24px}.guide-banner{display:flex;grid-gap:12px;gap:12px;background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);border-radius:8px;padding:12px 14px;color:#eff6ff;font-size:13px;line-height:1.5}.guide-banner ion-icon{font-size:24px;color:#60a5fa;flex-shrink:0}.guide-banner code{background:rgba(255,255,255,.1);padding:2px 6px;border-radius:4px;font-size:11px;color:#93c5fd}.guide-section__title{display:flex;align-items:center;grid-gap:8px;gap:8px;font-size:15px;font-weight:600;color:#f8fafc;margin:0 0 12px}.guide-section__title ion-icon{font-size:18px}.guide-list{display:flex;flex-direction:column;grid-gap:12px;gap:12px}.guide-item{display:flex;grid-gap:10px;gap:10px;align-items:flex-start;background:rgba(255,255,255,.03);padding:12px;border-radius:8px;border:1px solid rgba(255,255,255,.05)}.guide-item__icon{font-size:16px;color:#94a3b8;margin-top:2px;flex-shrink:0}.guide-item__text{font-size:13px;line-height:1.5;color:#cbd5e1}.guide-item__text strong{color:#f8fafc;font-weight:600}.guide-item__text code{background:rgba(0,0,0,.3);padding:2px 5px;border-radius:4px;font-size:11px;color:#cbd5e1;border:1px solid rgba(255,255,255,.1)}.guide-step{width:20px;height:20px;border-radius:50%;background:#334155;color:#fff;font-size:11px;font-weight:bold;display:flex;align-items:center;justify-content:center;flex-shrink:0}.guide-raw-content{white-space:pre-wrap;color:#94a3b8;font-size:13px;line-height:1.6;background:rgba(0,0,0,.2);padding:12px;border-radius:8px;border:1px solid rgba(255,255,255,.05)}.guide-edit-btn{width:100%;padding:10px;background:rgba(108,142,245,.1);color:#818cf8;border:1px solid rgba(129,140,248,.3);border-radius:8px;cursor:pointer;font-weight:500;transition:all .2s;display:flex;align-items:center;justify-content:center;grid-gap:8px;gap:8px}.guide-edit-btn:hover{background:rgba(108,142,245,.15);border-color:#818cf880}.guide-dot-demo{display:inline-block;width:10px;height:10px;background:#1a73e8;border:2px solid #fff;border-radius:50%;vertical-align:middle;box-shadow:0 1px 3px #0000004d}.guide-shortcuts-grid{display:grid;grid-template-columns:1fr 1fr;grid-gap:10px;gap:10px}.guide-shortcut-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;grid-gap:6px;gap:6px}.guide-shortcut-card__keys{display:flex;align-items:center;grid-gap:4px;gap:4px}.guide-shortcut-card__keys kbd{background:#1e293b;border:1px solid #334155;border-bottom:2px solid #475569;border-radius:5px;padding:3px 7px;font-size:11px;font-family:monospace;color:#e2e8f0;line-height:1.4}.guide-shortcut-card__keys span{color:#64748b;font-size:12px}.guide-shortcut-card__label{font-size:12px;color:#94a3b8;line-height:1.3}.guide-protip{display:flex;grid-gap:12px;gap:12px;background:linear-gradient(135deg,rgba(251,191,36,.08) 0%,rgba(245,158,11,.05) 100%);border:1px solid rgba(251,191,36,.2);border-radius:10px;padding:14px}.guide-protip__icon ion-icon{font-size:22px;color:#fbbf24;flex-shrink:0}.guide-protip__title{font-size:13px;font-weight:700;color:#fde68a;margin-bottom:8px;letter-spacing:.3px}.guide-protip__list{margin:0;padding-left:16px;display:flex;flex-direction:column;grid-gap:6px;gap:6px}.guide-protip__list li{font-size:12.5px;color:#cbd5e1;line-height:1.5}.guide-protip__list li code{background:rgba(0,0,0,.25);padding:1px 5px;border-radius:4px;font-size:11px;color:#fde68a;border:1px solid rgba(251,191,36,.2)}\n"]
                },] }
    ];
    PdfAnnotatorModalComponent.ctorParameters = function () { return [
        { type: angular.ModalController },
        { type: http.HttpClient },
        { type: core.NgZone },
        { type: angular.ToastController },
        { type: angular.AlertController },
        { type: core.ChangeDetectorRef },
        { type: platformBrowser.DomSanitizer },
        { type: PdfManagerService },
        { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [PDF_ANNOTATOR_CONFIG,] }] }
    ]; };
    PdfAnnotatorModalComponent.propDecorators = {
        pdfUrl: [{ type: core.Input }],
        fileName: [{ type: core.Input }],
        canManageGuide: [{ type: core.Input }],
        pdfCanvases: [{ type: core.ViewChildren, args: ['pdfCanvas',] }],
        annotCanvases: [{ type: core.ViewChildren, args: ['annotCanvas',] }],
        fileInputRef: [{ type: core.ViewChild, args: ['fileInput', { static: false },] }],
        viewerContainerRef: [{ type: core.ViewChild, args: ['viewerContainer', { static: false },] }],
        signatureCanvasRef: [{ type: core.ViewChild, args: ['signatureCanvas', { static: false },] }],
        userId: [{ type: core.Input }],
        userName: [{ type: core.Input }],
        documentId: [{ type: core.Input }],
        detailId: [{ type: core.Input }],
        edocId: [{ type: core.Input }],
        isCancelMode: [{ type: core.Input }],
        signatureFileInputRef: [{ type: core.ViewChild, args: ['signatureFileInput', { static: false },] }],
        thumbFileInputRef: [{ type: core.ViewChild, args: ['thumbFileInput', { static: false },] }],
        onDocumentPointerDown: [{ type: core.HostListener, args: ['document:pointerdown', ['$event'],] }],
        handleKeyboard: [{ type: core.HostListener, args: ['window:keydown', ['$event'],] }]
    };

    // HttpClient must be provided by the host application:
    //   Angular 15+:  provideHttpClient()  in app.config.ts
    //   Angular 12-14: HttpClientModule    in AppModule imports
    var PdfAnnotatorModule = /** @class */ (function () {
        function PdfAnnotatorModule() {
        }
        PdfAnnotatorModule.forRoot = function (config) {
            return {
                ngModule: PdfAnnotatorModule,
                providers: [
                    { provide: PDF_ANNOTATOR_CONFIG, useValue: config },
                    PdfManagerService
                ]
            };
        };
        return PdfAnnotatorModule;
    }());
    PdfAnnotatorModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [PdfAnnotatorModalComponent],
                    imports: [common.CommonModule, forms.FormsModule, angular.IonicModule],
                    exports: [PdfAnnotatorModalComponent],
                    providers: [common.DatePipe, PdfManagerService],
                    schemas: [core.CUSTOM_ELEMENTS_SCHEMA]
                },] }
    ];

    /*
     * Public API Surface of pdf-annotator
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.PDF_ANNOTATOR_CONFIG = PDF_ANNOTATOR_CONFIG;
    exports.PdfAnnotatorModalComponent = PdfAnnotatorModalComponent;
    exports.PdfAnnotatorModule = PdfAnnotatorModule;
    exports.PdfManagerService = PdfManagerService;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=pdf-annotator.umd.js.map
