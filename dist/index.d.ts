/// <reference types="knockout" />
export declare class Page<T> {
    id: string;
    closing: boolean;
    serializedParams: string;
    params: T;
    element: JSX.Element;
}
export declare type PageFactory = (props: any) => JSX.Element;
export interface Route<T> {
    route: string;
    onRoute: (parameter: T) => HTMLElement | Promise<HTMLElement>;
}
export declare class Application {
    popin: KnockoutObservable<HTMLElement>;
    pages: KnockoutObservableArray<HTMLElement>;
    routes: Route<any>[];
    addRoute<T>(route: Route<T>): void;
    goToView<T>(route: Route<T>, params: T): Promise<void>;
    /**
     * Shows a pop-in
     * @param view The view
     * @returns A promise with the choice of the user
     */
    showPopin(view: JSX.Element): void;
    /**
     * Shows a confirm pop-in (with the 'popin-confirm' name)
     * @param title The title
     * @param message The message
     */
    /**
     * Hides the pop-in
     */
    hidePopin: () => void;
}
export declare class FolkeView implements JSX.ElementClass {
    props: {
        app: Application;
    };
    render(): HTMLElement;
}
