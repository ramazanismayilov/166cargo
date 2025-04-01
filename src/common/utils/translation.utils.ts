export const mapTranslation = (item: any) => {
    return {
        ...item,
        translations: undefined,
        ...Object.fromEntries(item.translations.map((t: any) => [t.field, t.value])),
    };
};