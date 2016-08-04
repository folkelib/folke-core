import * as ko from 'knockout';

export function twoDigits(value: number) {
    return value < 10 ? "0" + value : value;
}

export function isObservable<T>(o: T | ko.Observable<T>): o is ko.Observable<T> {
    return (<ko.Observable<T>>o).apply !== undefined;
}