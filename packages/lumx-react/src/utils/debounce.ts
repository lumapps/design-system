export function debounce(func: (...args: any) => any, debounceTime: number) {
    let timeout: any;
    return function debouncedFunction(...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), debounceTime);
    };
}
