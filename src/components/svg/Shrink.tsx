interface IIcon {
    classProps?: string;
}

export default function ShrinkIcon({ classProps }: IIcon) {
    return (
        <>
            <svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none" className={`${classProps}`}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M23 26l-7-7-7 7M9 6l7 7 7-7" />
            </svg>
        </>
    )
}