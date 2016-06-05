export function twoDigits(value: number) {
    return value < 10 ? "0" + value : value;
}

export function isObservable<T>(o: T | KnockoutObservable<T>): o is KnockoutObservable<T> {
    return (<KnockoutObservable<T>>o).apply !== undefined;
}