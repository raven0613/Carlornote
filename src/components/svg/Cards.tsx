interface IIcon {
    classProps?: string;
    handleClick?: () => void;
}

export default function CardsIcon({ classProps, handleClick }: IIcon) {
    return (
        <>
            <svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" version="1.1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" className={`${classProps}`}>
                <path d="m1.75 11 6.25 3.25 6.25-3.25m-12.5-3 6.25 3.25 6.25-3.25m-6.25-6.25-6.25 3.25 6.25 3.25 6.25-3.25z" />
            </svg>
        </>
    )
}