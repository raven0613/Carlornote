interface IIcon {
    classProps?: string;
}

export default function OKIcon({ classProps }: IIcon) {
    return (
        <>
            <svg width="100%" height="100%" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" color="#000000"> <title id="okIconTitle">Ok</title> <polyline points="4 13 9 18 20 7" className={`${classProps}`} /> </svg>
        </>
    )
}
