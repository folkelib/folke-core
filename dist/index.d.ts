import * as promise from "es6-promise";
export declare class Page {
    closing: boolean;
    id: string;
    serializedParams: string;
    params: Parameters<any>;
}
export interface Popin {
    id: string;
    params: Parameters<any>;
}
export interface Parameters<T> {
    [x: string]: any;
    resolve?: (value?: T | promise.Thenable<T>) => void;
    reject?: (error?: any) => void;
}
export declare class Application {
    private pages;
    private popin;
    private defaultRoute;
    private defaultRoutePriority;
    /**
     * Adds a route handler
     * @param route The route. May contain {example} for mandatory parameters, :example: for optional parameters.
     *              * is a wildcard to for "everything until the end".
     * @param onRoute A function that will be called when the route is called. May also be a component id, in which
     *                case this.goToView will be called for this component.
     * @param priority The priority, used to create a default route (higher number is more priority).
     */
    addRoute(route: string, onRoute: ((parameters: Parameters<any>) => void) | string, priority?: number): void;
    /**
     * Shows a component and hides all the components that are already displayed (including popins).
     * @param viewId The component to show
     * @param params The parameters for the component
     */
    goToView(viewId: string, params: Parameters<any>): promise.Promise<any>;
    /**
     * Registers a component with knockout that have a code and a template of the same name and in the same directory
     * @param path The directory in which the component is
     * @param id The id of the component. Must be the same as the names of the script and the HTML template files (minus the extension)
     */
    registerComponent(path: string, id: string): void;
    /**
     * Shows a pop-in
     * @param viewId The view id (must have been registered with registerComponent)
     * @param params The params for the popin
     * @returns A promise with the choice of the user
     */
    showPopin<T>(viewId: string, params?: Parameters<T>): promise.Promise<T>;
    /**
     * Shows a confirm pop-in (with the 'popin-confirm' name)
     * @param title The title
     * @param message The message
     */
    confirm(title: string, message: string): promise.Promise<boolean>;
    /**
     * Hides the pop-in
     */
    hidePopin: () => void;
    /**
     * Shows a component without hidding already displayed components
     * @param viewId The view id (see registerComponent)
     * @param params The parameters for the page
     * @param before If the page must be shown above the current pages
     * @param main Not used (TODO ?)
     */
    showPage<T>(viewId: string, params?: Parameters<T>, before?: boolean, main?: boolean): promise.Promise<T>;
    /**
     * The entry point. Should be called when everything is ready.
     */
    start(): void;
}
declare var _default: Application;
export default _default;
