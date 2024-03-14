import { IBoardElement } from "@/type/card";

export function changeIndex({ targetIdx, originIdx, array }: { targetIdx: number, originIdx: number, array: any[] }): any[] {
    // console.log("originIdx", originIdx)
    // console.log("targetIdx", targetIdx)
    // console.log("array", array)
    if (targetIdx === originIdx) return array;
    const result = [];
    let temp = array[originIdx];
    for (let i = 0; i < array.length; i++) {
        if (i === originIdx) continue;
        if (i === targetIdx) {
            if (result.length === targetIdx) {
                result.push(temp);
                result.push(array[i]);
            }
            else {
                result.push(array[i]);
                result.push(temp);
            }
            continue;
        }
        result.push(array[i]);
    }
    // console.log("result", result)
    return result;
}

export function getResizedSize(originWidth: number, originHeight: number) {
    const imageAspectRatio = originWidth / originHeight;
    let width = originWidth;
    let height = originHeight;
    if (originWidth > originHeight && originWidth >= 800) {
        width = 800;
        height = width / imageAspectRatio;
    }
    else if (originHeight > originWidth && originHeight >= 400) {
        height = 400;
        width = height * imageAspectRatio;
    }
    return { width, height }
}

export function handleChangeZIndex(id: string, to: "top" | "bottom", elements: IBoardElement[]) {
    // console.log("id", id)
    const filteredElements = elements.filter(item => item.id !== id);
    const selectedElement = elements.find(item => item.id === id);
    if (!selectedElement) return;
    if (to === "bottom") {
        if (selectedElement.id === elements.at(0)?.id) return;
        return [selectedElement, ...filteredElements];
    }
    else if (to === "top") {
        if (selectedElement.id === elements.at(-1)?.id) return;
        return [...filteredElements, selectedElement];
    }
}