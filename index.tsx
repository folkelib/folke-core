import * as ko from "knockout";
import Crossroads = require("crossroads");
import * as Hasher from "hasher";
import { React, ko_foreach, ko_ifdef } from "kjsx";

export class Page<T> {
    id: string;
    closing: boolean;
    /// The couple id,serializedParams uniquely identify a page
    serializedParams: string;
    params: Parameters<T>;
    element: JSX.Element;
}

export interface Popin {
    id: string;
    params: Parameters<any>;
}

export interface Parameters<T> {
    [x: string]: any;
    // resolve?: (value?: T | PromiseLike<T>) => void;
    // reject?: (error?: any) => void;
}

export type PageFactory = (props: any) => JSX.Element;

export interface Route<T> {
    route: string;
    onRoute: (parameter: Parameters<T>) => HTMLElement | Promise<HTMLElement>;
}

function isPromise<T>(a: any) : a is Promise<T> {
    return a.then !== undefined;
}

export class Application {
    popin = ko.observable<JSX.Element>();
    pages = ko.observableArray<HTMLElement>();
    routes: Route<any>[] = [];
    
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
    public addRoute<T>(route: Route<T>) {
        Crossroads.addRoute(route.route, (params: Parameters<T>) => {
           this.goToView(route, params);
        });
    }

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
    public async goToView<T>(route: Route<T>, params: Parameters<T>) {
        this.pages.splice(0);
        const ret = route.onRoute(params);
        if (isPromise(ret)) {
            this.pages.push(await ret);
        }
        else {
            this.pages.push(ret);
        }
    }

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
    public showPopin(view: JSX.Element) {
        this.popin(view);            
    }

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
     public hidePopin = () => {
        this.popin(null);
    }

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

export class FolkeView implements JSX.ElementClass {
    props: { app: Application };
    
    public render() {
        document.addEventListener("DOMContentLoaded", () => {
            for (const route of this.props.app.routes) {
                this.props.app.addRoute(route);
            }

            Crossroads.normalizeFn = Crossroads.NORM_AS_OBJECT;
            function parseHash(newHash: string) {
                Crossroads.parse(newHash);
            }
            Hasher.initialized.add(parseHash);
            Hasher.changed.add(parseHash);
            Hasher.init();
        });

        return <div>
            <div class="popin-background"  click={this.props.app.hidePopin}></div>
            { ko_ifdef(this.props.app.popin, p => p) }
            { this.props.app.pages }
        </div>
    }
}
