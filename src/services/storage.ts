import localforage from "localforage";
localforage.setDriver([localforage.INDEXEDDB, localforage.LOCALSTORAGE]);
const load = async <T>(key: string): Promise<T | null> => {
    return localforage.getItem(key);
};

const save = (key: string, data: { [key: string]: any }) => {
    return localforage.setItem(key, data);
};

const remove = (key: string) => {
    return localforage.removeItem(key);
};

export const storage = {
    load,
    save,
    remove
};
