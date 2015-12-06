import * as ko from "knockout";
import * as Crossroads from "crossroads";
import * as Hasher from "hasher";
import * as promise from "es6-promise";

export class Page {
    closing: boolean;
    id: string;
    /// The couple id,serializedParams uniquely idendify a page
    serializedParams: string;
    params: Parameters<any>;
}

export interface Popin {
    id: string;
    params: Parameters<any>;
}

export interface Parameters<T> {
    [x: string]: any;
    resolve?: (value?: T | Thenable<T>) => void;
    reject?: (error?: any) => void;
}

export class Application {
    private pages: KnockoutObservableArray<Page> = ko.observableArray<Page>();
    private popin = ko.observable<Popin>(null);
    
    private defaultRoute: (parameters: Parameters<any>) => void = null;
    private defaultRoutePriority: number = 0;
    
    public addRoute(route: string, onRoute: ((parameters: Parameters<any>) => void)|string, priority: number = 0) {
        if (typeof onRoute === "string") {
            Crossroads.addRoute(route, (params: Parameters<any>) => {
                this.goToView(onRoute, params);
            });
            if (priority > this.defaultRoutePriority || this.defaultRoutePriority === 0) {
                this.defaultRoute = params => this.goToView(onRoute, params);
                this.defaultRoutePriority = priority || 0;
            }
        } else {
            Crossroads.addRoute(route, (params: Parameters<any>) => {
                onRoute(params);
            });

            if (priority > this.defaultRoutePriority || this.defaultRoutePriority === 0) {
                this.defaultRoute = onRoute;
                this.defaultRoutePriority = priority || 0;
            }
        }
    }

    public goToView(viewId: string, params: Parameters<any>) {
        var views = this.pages();

        for (let view of views) {
            view.closing = true;
        }

        this.popin(null);
        var ret = this.showPage(viewId, params, true, true);
        
        for (let i = 0; i < views.length; i++) {
            let view = views[i];
            if (view.closing) {
                this.pages.splice(i, 1);
                i--;
            }
        }
        return ret;
    }

    public registerComponent(path: string, id: string) {
        ko.components.register(id, { viewModel: { require: path + "/" + id }, template: { require: 'text!' + path + "/" + id + '.html' } });
    }
    
    public showPopin<T>(viewId: string, params: Parameters<T> = {}) {
        if (params && params.resolve) {
            // If this is called from a popin that replaces another popin: keep the promise
            this.popin({ id: viewId, params: params });
            // TODO need to return something?
        } else {
            return new Promise<T>((resolve, reject) => {
                params.reject = reject;
                params.resolve = resolve;
                this.popin({ id: viewId, params: params });
            });
        }
    }
    
    public hidePopin = () => {
        this.popin(null);
    }

    public showPage<T>(viewId: string, params: Parameters<T> = {}, before: boolean = false, main: boolean = false) {
        return new Promise<T>((resolve, reject) => {
            var serializedParams = JSON.stringify(params);
            params.reject = reject;
            params.resolve = resolve;
            var views = this.pages();
            for (let view of views) {
                if (view.id == viewId && view.serializedParams == serializedParams) {
                    view.closing = false;
                    return;
                }
            }

            var view: Page = { id: viewId, closing: false, serializedParams: serializedParams, params: params };
            if (before)
                this.pages.unshift(view);
            else
                this.pages.push(view);
        });
    }

    public start() {
        ko.applyBindings(this);
        if (this.defaultRoute) {
            Crossroads.addRoute('', (params: Parameters<any>) => this.defaultRoute(params));
        }

        Crossroads.normalizeFn = Crossroads.NORM_AS_OBJECT;
        function parseHash(newHash) {
            Crossroads.parse(newHash);
        }
        Hasher.initialized.add(parseHash);
        Hasher.changed.add(parseHash);
        Hasher.init();
    }
}

export default new Application();