export default function filterObj(object: Object) {
    const isEmpty = (value: any) => value === '' || value === null || value === undefined;

    return Object.fromEntries(
        Object.entries(object).filter(([key, value]) => !isEmpty(value))
    );
}