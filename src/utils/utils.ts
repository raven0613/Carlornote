export function changeIndex({ targetIdx, originIdx, array }: { targetIdx: number, originIdx: number, array: any[] }): any[] {
    console.log("originIdx", originIdx)
    console.log("targetIdx", targetIdx)
    console.log("array", array)
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
    console.log("result", result)
    return result;
}