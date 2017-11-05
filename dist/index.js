"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ko = require("knockout");
var Crossroads = require("crossroads");
var Hasher = require("hasher");
var kjsx_1 = require("kjsx");
var Page = /** @class */ (function () {
    function Page() {
    }
    return Page;
}());
exports.Page = Page;
function isPromise(a) {
    return a.then !== undefined;
}
var Application = /** @class */ (function () {
    function Application() {
        var _this = this;
        this.popin = ko.observable();
        this.pages = ko.observableArray();
        this.routes = [];
        /**
         * Shows a confirm pop-in (with the 'popin-confirm' name)
         * @param title The title
         * @param message The message
         */
        // public confirm(title: string, message: string): PromiseLike<boolean> {
        //     return this.showPopin<boolean>('popin-confirm', { title: title, message: message });
        // }
        /**
         * Hides the pop-in
         */
        this.hidePopin = function () {
            _this.popin(null);
        };
        // /**
        //  * Shows a component without hidding already displayed components
        //  * @param viewId The view id (see registerComponent)
        //  * @param params The parameters for the page
        //  * @param before If the page must be shown above the current pages
        //  * @param main Not used (TODO ?)
        //  */
        // public showPage<T>(viewId: string, params: Parameters<T> = {}, before: boolean = false, main: boolean = false): Promise<T> {
        //     return new Promise<T>((resolve, reject) => {
        //         var serializedParams = JSON.stringify(params);
        //         params.reject = reject;
        //         params.resolve = resolve;
        //         var views = this.pages();
        //         for (let view of views) {
        //             if (view.id === viewId && view.serializedParams == serializedParams) {
        //                 view.closing = false;
        //                 return;
        //             }
        //         }
        //         var view: Page<T> = { id: viewId, closing: false, serializedParams: serializedParams, params: params, element: this.props.pages[viewId](params) };
        //         if (before)
        //             this.pages.unshift(view);
        //         else
        //             this.pages.push(view);
        //     });
        // }
    }
    // // TODO see if it useful to have an array instead of one only page
    // private pages = ko.observableArray<Page<any>>();
    // private popin = ko.observable<Popin>(null);
    // private defaultRoute: ((parameters: Parameters<any>) => void) | undefined = undefined;
    // private defaultRoutePriority: number = 0;
    // /**
    //  * Adds a route handler
    //  * @param route The route. May contain {example} for mandatory parameters, :example: for optional parameters.
    //  *              * is a wildcard to for "everything until the end".
    //  * @param onRoute A function that will be called when the route is called. May also be a component id, in which
    //  *                case this.goToView will be called for this component.
    //  * @param priority The priority, used to create a default route (higher number is more priority).
    //  */
    Application.prototype.addRoute = function (route) {
        var _this = this;
        Crossroads.addRoute(route.route, function (params) {
            _this.goToView(route, params);
        });
    };
    //     if (typeof onRoute === "string") {
    //         const newRoute = Crossroads.addRoute(route, (params: Parameters<any>) => {
    //             this.goToView(onRoute, params);
    //         });
    //         if (priority > this.defaultRoutePriority || this.defaultRoutePriority === 0) {
    //             this.defaultRoute = params => this.goToView(onRoute, params);
    //             this.defaultRoutePriority = priority || 0;
    //         }
    //     } else {
    //         const newRoute = Crossroads.addRoute(route, (params: Parameters<any>) => {
    //             onRoute(params);
    //         });
    //         if (priority > this.defaultRoutePriority || this.defaultRoutePriority === 0) {
    //             this.defaultRoute = onRoute;
    //             this.defaultRoutePriority = priority || 0;
    //         }
    //     }
    // }
    // /**
    //  * Shows a component and hides all the components that are already displayed (including popins).
    //  * @param viewId The component to show
    //  * @param params The parameters for the component
    //  */
    Application.prototype.goToView = function (route, params) {
        return __awaiter(this, void 0, void 0, function () {
            var ret, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.pages.splice(0);
                        ret = route.onRoute(params);
                        if (!isPromise(ret)) return [3 /*break*/, 2];
                        _b = (_a = this.pages).push;
                        return [4 /*yield*/, ret];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [3 /*break*/, 3];
                    case 2:
                        this.pages.push(ret);
                        _c.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // public goToView(viewId: string, params: Parameters<any>): Promise<any> {
    //     var views = this.pages();
    //     for (let view of views) {
    //         view.closing = true;
    //     }
    //     this.popin(null);
    //     var ret = this.showPage(viewId, params, true, true);
    //     for (let i = 0; i < views.length; i++) {
    //         let view = views[i];
    //         if (view.closing) {
    //             this.pages.splice(i, 1);
    //             i--;
    //         }
    //     }
    //     return ret;
    // }
    /**
     * Shows a pop-in
     * @param view The view
     * @returns A promise with the choice of the user
     */
    Application.prototype.showPopin = function (view) {
        this.popin(view);
    };
    return Application;
}());
exports.Application = Application;
var FolkeView = /** @class */ (function () {
    function FolkeView() {
    }
    FolkeView.prototype.render = function () {
        var _this = this;
        document.addEventListener("DOMContentLoaded", function () {
            for (var _i = 0, _a = _this.props.app.routes; _i < _a.length; _i++) {
                var route = _a[_i];
                _this.props.app.addRoute(route);
            }
            Crossroads.normalizeFn = Crossroads.NORM_AS_OBJECT;
            function parseHash(newHash) {
                Crossroads.parse(newHash);
            }
            Hasher.initialized.add(parseHash);
            Hasher.changed.add(parseHash);
            Hasher.init();
        });
        return kjsx_1.React.createElement("div", null,
            kjsx_1.React.createElement("div", { class: "popin-background", click: this.props.app.hidePopin }),
            kjsx_1.ko_ifdef(this.props.app.popin, function (p) { return p; }),
            this.props.app.pages);
    };
    return FolkeView;
}());
exports.FolkeView = FolkeView;
