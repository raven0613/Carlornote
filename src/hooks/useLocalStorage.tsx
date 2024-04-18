import React, { useEffect, useRef, useState } from "react";

interface IUseLocalStorage {
    storageKey: string;
}

export default function useLocalStorage({ storageKey }: IUseLocalStorage) {
    // const data = useRef<string>("");
    // const [data, setData] = useState("")
    // console.log("storageKey", storageKey)
    // console.log("useLocalStorage data", data)

    function saveLocalStorage(saveSata: string) {
        if (!saveSata) return;
        const localStorage = window?.localStorage;
        if (!localStorage) return;
        localStorage.setItem(storageKey, saveSata);
        // data.current = saveSata;
        // setData(saveSata)
    }

    function removeLocalStorage() {
        // console.log("window", window)
        const localStorage = window?.localStorage;
        if (!localStorage) return;
        localStorage.removeItem(storageKey);
        // data.current = "";
        // setData("")
    }

    useEffect(() => {
        const localStorage = window?.localStorage;
        if (!localStorage) return;
        // data.current = localStorage.getItem(storageKey) ?? "";
        // setData(localStorage.getItem(storageKey) ?? "")
    }, [storageKey]);

    return {
        saveStorage: saveLocalStorage,
        removeStorage: removeLocalStorage,
        // storageData: data
        storageData: typeof window === "undefined" ? "" : window.localStorage.getItem(storageKey) ?? ""
    };
}