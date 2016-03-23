import * as ko from "knockout";
import * as Crossroads from "crossroads";
import * as Hasher from "hasher";
import * as promise from "es6-promise";

export class Page {
    closing: boolean;
    id: string;
    /// The couple id,serializedParams uniquely identify a page
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
    // TODO see if it useful to have an array instead one only page
    private pages: KnockoutObservableArray<Page> = ko.observableArray<Page>();
    private popin = ko.observable<Popin>(null);
    
    private defaultRoute: (parameters: Parameters<any>) => void = null;
    private defaultRoutePriority: number = 0;
    
    /**
     * Adds a route handler
     * @param route The route. May contain {example} for mandatory parameters, :example: for optional parameters.
     *              * is a wildcard to for "everything until the end".
     * @param onRoute A function that will be called when the route is called. May also be a component id, in which
     *                case this.goToView will be called for this component.
     * @param priority The priority, used to create a default route (higher number is more priority).
     */
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

    /**
     * Shows a component and hides all the components that are already displayed (including popins).
     * @param viewId The component to show
     * @param params The parameters for the component
     */
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

    /**
     * Registers a component with knockout that have a code and a template of the same name and in the same directory
     * @param path The directory in which the component is
     * @param id The id of the component. Must be the same as the names of the script and the HTML template files (minus the extension)
     */
    public registerComponent(path: string, id: string) {
        ko.components.register(id, { viewModel: { require: path + "/" + id }, template: { require: 'text!' + path + "/" + id + '.html' } });
    }
    
    /**
     * Shows a pop-in
     * @param viewId The view id (must have been registered with registerComponent)
     * @param params The params for the popin
     * @returns A promise with the choice of the user
     */
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

    /**
     * Shows a confirm pop-in (with the 'popin-confirm' name)
     * @param title The title
     * @param message The message
     */
    public confirm(title: string, message: string) {
        return this.showPopin<boolean>('popin-confirm', { title: title, message: message });
    }
    
    /**
     * Hides the pop-in
     */
     public hidePopin = () => {
        this.popin(null);
    }

    /**
     * Shows a component without hidding already displayed components
     * @param viewId The view id (see registerComponent)
     * @param params The parameters for the page
     * @param before If the page must be shown above the current pages
     * @param main Not used (TODO ?)
     */
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

    /**
     * The entry point. Should be called when everything is ready.
     */
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