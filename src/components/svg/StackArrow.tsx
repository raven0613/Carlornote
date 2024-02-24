interface IIcon {
    classProps?: string;
}

export default function StackArrowIcon({ classProps }: IIcon) {
    return (
        <>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${classProps}`}>
                <path d="M8 12L12 8M12 8L16 12M12 8V20M4 4H20" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </>
    )
}