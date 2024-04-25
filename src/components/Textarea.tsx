import { useEffect, useRef, useState } from "react";

// 字串的最後一行要被加上一個 tab
function getLastTabAddedString(string: string) {
    if (!string.includes("\n")) return "\t" + string;
    const lines = string.split("\n");
    const beforeLastLine = lines.slice(0, -1).reduce((pre, curr, i) => {
        if (i === 0) return curr;
        return `${pre}\n${curr}`
    }, "")

    const lastLine = "\t" + (lines.at(-1) ?? "");
    return beforeLastLine + "\n" + lastLine;
}

// 字串的最後一行的第一個空格或是 tab 要被刪除
function getLastTabDeletedString(string: string) {
    if (string[0] !== "\t" && string[0] !== " " && !string.includes("\n")) return string;
    if (!string.includes("\n")) return string.slice(1);
    const lines = string.split("\n");
    const beforeLastLine = lines.slice(0, -1).reduce((pre, curr, i) => {
        if (i === 0) return curr;
        return `${pre}\n${curr}`
    }, "")
    const needBack = (lines.at(-1) ?? "")[0] === "\t" || (lines.at(-1) ?? "")[0] === " ";
    const lastLine = needBack ? lines.at(-1)?.slice(1) : lines.at(-1);
    return beforeLastLine + "\n" + lastLine;
}

interface ITextarea {
    text: string, 
    handleUpdate: (value: string) => void, 
    handleWheel?: (e: React.WheelEvent<HTMLTextAreaElement>) => void,
    classProps?: string
}

export default function Textarea({ text, handleUpdate, handleWheel, classProps }: ITextarea) {
    const [value, setValue] = useState(text);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const selectionRef = useRef<{ start: number, end: number }>({ start: 0, end: 0 });

    useEffect(() => {
        if (text === value) return;
        setValue(text);
    }, [text, value])

    // 設定游標位置
    useEffect(() => {
        if (!value) selectionRef.current = { start: 0, end: 0 };
        textareaRef.current?.setSelectionRange(selectionRef.current.start, selectionRef.current.end);
    }, [value])

    return (
        <>
            <textarea ref={textareaRef}
                onWheel={(e) => {
                    handleWheel && handleWheel(e);
                }}
                onChange={(e) => {
                    const selectionStart = e.currentTarget.selectionStart;
                    const selectionEnd = e.currentTarget.selectionEnd;
                    selectionRef.current = { start: selectionStart, end: selectionEnd };
                    setValue(e.target.value);
                    handleUpdate(e.target.value)
                    // handleUpdateElement({ ...textData, content: e.target.value });
                    // handleSetDirty();
                }}
                onKeyDown={(e) => {
                    const selectionStart = e.currentTarget.selectionStart;
                    const selectionEnd = e.currentTarget.selectionEnd;

                    // 退格
                    if (e.shiftKey && e.key === "Tab") {
                        e.preventDefault();
                        if (selectionStart === selectionEnd) {

                            // 遇到沒空格了就不退格
                            if (value[selectionStart - 1] !== "\t" && value[selectionStart - 1] !== " ") return;
                            const newText = `${value.slice(0, selectionStart - 1)}${value.slice(selectionEnd)}`
                            setValue(newText);
                            // handleUpdateElement({ ...textData, content: newText });
                            handleUpdate(newText)
                            // 因為前面會被減少一個 tab，所以的值要 - 1
                            selectionRef.current = { start: selectionStart - 1, end: selectionEnd - 1 };
                            return;
                        }
                        const leftSide = value.slice(0, selectionStart);
                        const middleText = value.slice(selectionStart, selectionEnd);
                        const rightSide = value.slice(selectionEnd);
                        const leftResult = getLastTabDeletedString(leftSide);
                        // 被選起來的字串中，每一行最前面有 tab 或空格的話都要退一格，因為是用換行符來切割，所以除了第一行以外都要把換行符加回來
                        const middleResult = middleText.split("\n").map((item, i) => {
                            if (i === 0) return item;
                            if (item[0] === "\t" || item[0] === " ") return "\n" + item.slice(1);
                            return "\n" + item;
                        }).join("");
                        // rightSide 的字串不會被動到
                        const result = `${leftResult}${middleResult}${rightSide}`;
                        // console.log("result", result)
                        setValue(result);
                        handleUpdate(result)
                        // handleUpdateElement({ ...textData, content: result });
                        // start: 因為前面會被減少一個 tab，所以 start 的值要 - 1
                        // end: 因為中間會被減少一些 tabs，所以 end 的值要從最後面開始算
                        selectionRef.current = { start: selectionStart - 1, end: result.length - rightSide.length };
                        return;
                    }
                    // 空格
                    if (e.key === "Tab") {
                        e.preventDefault();

                        if (selectionStart === selectionEnd) {
                            const newText = `${value.slice(0, selectionStart)}\t${value.slice(selectionEnd)}`;
                            setValue(newText);
                            handleUpdate(newText)
                            // handleUpdateElement({ ...textData, content: newText });
                            selectionRef.current = { start: selectionStart + 1, end: selectionEnd + 1 };
                            return;
                        }
                        const leftSide = value.slice(0, selectionStart);
                        const middleText = value.slice(selectionStart, selectionEnd);
                        const rightSide = value.slice(selectionEnd);
                        const leftResult = getLastTabAddedString(leftSide);
                        // 被選起來的字串中，每一行最前面都加一個 tab，因為是用換行符來切割，所以除了第一行以外都要把換行符加回來
                        const middleResult = middleText.split("\n").map((item, i) => {
                            if (i === 0) return item;
                            return `\n\t${item}`;
                        }).join("");
                        const result = `${leftResult}${middleResult}${rightSide}`;
                        // console.log("result", result)
                        setValue(result);
                        handleUpdate(result)
                        // handleUpdateElement({ ...textData, content: result });
                        // console.log(JSON.stringify(result))
                        // start: 因為前面會被增加一個 tab，所以 start 的值要 + 1
                        // end: 因為中間會被加入一些 tabs，所以 end 的值要從最後面開始算
                        selectionRef.current = { start: selectionStart + 1, end: result.length - rightSide.length };
                    }

                }}
                className={`textbox_textarea textInput w-full flex-1 p-2 rounded-md whitespace-pre-wrap outline-none resize-none bg-white/5 ${classProps}
                    `}
                value={value} />
        </>
    )
}