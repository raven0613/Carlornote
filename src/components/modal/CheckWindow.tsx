"use client"
interface ICheckWindow {
    data: any;
    handleClose: () => void;
    handleConfirm: () => void;
    text: string;
}

export default function CheckWindow({ data, handleClose, handleConfirm, text }: ICheckWindow) {
    // console.log("data", data)
    // console.log("handleConfirm", handleConfirm)
    return (
        <>
            <div className={`checkWindow w-72 h-48 bg-white shadow-md rounded-md px-10 py-12 flex flex-col justify-between items-center`} onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
            }}>
                <p className="text-slate-600 pointer-events-none">{text}</p>
                <div className="flex gap-2">
                    <button className="checkWindow w-12 h-8 rounded-md border border-sky-500 hover:bg-sky-200 duration-150" onClick={() => {
                        handleConfirm();
                    }}>確定</button>
                    <button className="w-12 h-8 bg-sky-500 rounded-md text-white hover:bg-sky-700 duration-150" onClick={() => {
                        handleClose();
                    }}>取消</button>
                </div>
            </div>
        </>
    )
}