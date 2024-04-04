import React, { useEffect, useRef, useState } from "react";

interface IUseLocalStorage {
    storageKey: string;
}

export default function useLocalStorage({ storageKey }: IUseLocalStorage) {
    const data = useRef<string>("");
    // console.log("storageKey", storageKey)

    function saveLocalStorage(saveSata: string) {
        if (!saveSata) return;
        const localStorage = window?.localStorage;
        if (!localStorage) return;
        localStorage.setItem(storageKey, saveSata);
    }

    function removeLocalStorage() {
        console.log("window", window)
        const localStorage = window?.localStorage;
        if (!localStorage) return console.log("ㄟㄟㄟ");
        localStorage.removeItem(storageKey);
        console.log("remove")
    }

    useEffect(() => {
        const localStorage = window?.localStorage;
        if (!localStorage) return;
        data.current = localStorage.getItem(storageKey) ?? "";
    }, [storageKey]);

    return {
        saveStorage: saveLocalStorage,
        removeStorage: removeLocalStorage,
        storageData: data.current
    };
}