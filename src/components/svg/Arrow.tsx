interface IIcon {
    classProps?: string;
}

export default function ArrowIcon({ classProps }: IIcon) {
    return (
        <>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${classProps}`}>
                <path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </>
    )
}