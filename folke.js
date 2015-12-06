define(["require", "exports", "knockout", "crossroads", "hasher"], function (require, exports, ko, Crossroads, Hasher) {
    var Page = (function () {
        function Page() {
        }
        return Page;
    })();
    exports.Page = Page;
    var Application = (function () {
        function Application() {
            var _this = this;
            this.pages = ko.observableArray();
            this.popin = ko.observable(null);
            this.defaultRoute = null;
            this.defaultRoutePriority = 0;
            this.hidePopin = function () {
                _this.popin(null);
            };
        }
        Application.prototype.addRoute = function (route, onRoute, priority) {
            var _this = this;
            if (priority === void 0) { priority = 0; }
            if (typeof onRoute === "string") {
                Crossroads.addRoute(route, function (params) {
                    _this.goToView(onRoute, params);
                });
                if (priority > this.defaultRoutePriority || this.defaultRoutePriority === 0) {
                    this.defaultRoute = function (params) { return _this.goToView(onRoute, params); };
                    this.defaultRoutePriority = priority || 0;
                }
            }
            else {
                Crossroads.addRoute(route, function (params) {
                    onRoute(params);
                });
                if (priority > this.defaultRoutePriority || this.defaultRoutePriority === 0) {
                    this.defaultRoute = onRoute;
                    this.defaultRoutePriority = priority || 0;
                }
            }
        };
        Application.prototype.goToView = function (viewId, params) {
            var views = this.pages();
            for (var _i = 0; _i < views.length; _i++) {
                var view = views[_i];
                view.closing = true;
            }
            this.popin(null);
            var ret = this.showPage(viewId, params, true, true);
            for (var i = 0; i < views.length; i++) {
                var view = views[i];
                if (view.closing) {
                    this.pages.splice(i, 1);
                    i--;
                }
            }
            return ret;
        };
        Application.prototype.registerComponent = function (path, id) {
            ko.components.register(id, { viewModel: { require: path + "/" + id }, template: { require: 'text!' + path + "/" + id + '.html' } });
        };
        Application.prototype.showPopin = function (viewId, params) {
            var _this = this;
            if (params === void 0) { params = {}; }
            if (params && params.resolve) {
                // If this is called from a popin that replaces another popin: keep the promise
                this.popin({ id: viewId, params: params });
            }
            else {
                return new Promise(function (resolve, reject) {
                    params.reject = reject;
                    params.resolve = resolve;
                    _this.popin({ id: viewId, params: params });
                });
            }
        };
        Application.prototype.showPage = function (viewId, params, before, main) {
            var _this = this;
            if (params === void 0) { params = {}; }
            if (before === void 0) { before = false; }
            if (main === void 0) { main = false; }
            return new Promise(function (resolve, reject) {
                var serializedParams = JSON.stringify(params);
                params.reject = reject;
                params.resolve = resolve;
                var views = _this.pages();
                for (var _i = 0; _i < views.length; _i++) {
                    var view_1 = views[_i];
                    if (view_1.id == viewId && view_1.serializedParams == serializedParams) {
                        view_1.closing = false;
                        return;
                    }
                }
                var view = { id: viewId, closing: false, serializedParams: serializedParams, params: params };
                if (before)
                    _this.pages.unshift(view);
                else
                    _this.pages.push(view);
            });
        };
        Application.prototype.start = function () {
            var _this = this;
            ko.applyBindings(this);
            if (this.defaultRoute) {
                Crossroads.addRoute('', function (params) { return _this.defaultRoute(params); });
            }
            Crossroads.normalizeFn = Crossroads.NORM_AS_OBJECT;
            function parseHash(newHash) {
                Crossroads.parse(newHash);
            }
            Hasher.initialized.add(parseHash);
            Hasher.changed.add(parseHash);
            Hasher.init();
        };
        return Application;
    })();
    exports.Application = Application;
    exports.__esModule = true;
    exports["default"] = new Application();
});
