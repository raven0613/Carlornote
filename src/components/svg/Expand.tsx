interface IIcon {
    classProps?: string;
}

export default function ExpandIcon({ classProps }: IIcon) {
    return (
        <>
            <svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none" className={`${classProps}`}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l7 7 7-7M23 12l-7-7-7 7" />
            </svg>
        </>
    )
}