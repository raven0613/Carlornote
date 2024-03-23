interface IIcon {
    classProps?: string;
    handleClick?: () => void;
}

export default function CloseIcon({ classProps, handleClick }: IIcon) {
    return (
        <>
            <span className={`rounded-full w-full h-full shrink-0 before:absolute before:content-[''] before:left-1/2 before:-translate-x-1/2 before:w-[1px] before:h-4 before:bg-zinc-600 before:rotate-45 before:top-1/2 before:-translate-y-1/2 
            after:absolute after:content-[''] after:left-1/2 after:-translate-x-1/2 after:w-[1px] after:h-4 after:bg-zinc-600 after:-rotate-45 after:top-1/2 after:-translate-y-1/2 ${classProps}`}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClick && handleClick();
                }}
            />
        </>
    )
}