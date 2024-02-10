interface IControlPanel {
    handleDrag: (type: "text") => void;
}

export default function ControlPanel({ handleDrag }: IControlPanel) {
    return (
        <>
            <main className="absolute">
                <button className="w-10 h-10 bg-cyan-700"
                    onMouseDown={() => {
                        handleDrag("text");
                    }}
                />
            </main>
        </>
    )
}