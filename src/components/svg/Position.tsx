interface IIcon {
    classProps?: string;
}

export default function PositionIcon({ classProps }: IIcon) {
    return (
        <>
            <svg fill="currentColor" width="100%" height="100%" viewBox="0 0 200 200" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" className={`${classProps}`}><title /><path d="M150,34.94c-27.5-27.5-72-27.5-100,0a70.49,70.49,0,0,0-8,90l33.5,48a30.4,30.4,0,0,0,49.5,0l33.5-48A71.18,71.18,0,0,0,150,34.94Zm-8.5,78.5-33.5,48a10.31,10.31,0,0,1-16.5,0l-33.5-48a50.14,50.14,0,0,1,6-64.5c20-20,52-20,71.5,0a50.19,50.19,0,0,1,6,64.5Zm-41.5-67a35,35,0,1,0,35,35A34.78,34.78,0,0,0,100,46.44Zm0,50a15,15,0,1,1,15-15A14.73,14.73,0,0,1,100,96.44Z" /></svg>
        </>
    )
}

{/* <svg height="100" width="100" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40.528 40.528">
    <g>
        <path d="M20.264,0C11.749,0,4.847,6.903,4.847,15.417c0,5.054,5.432,14.649,9.847,21.613
		c2.957,4.664,8.183,4.664,11.14,0c4.415-6.965,9.847-16.559,9.847-21.613C35.681,6.902,28.779,0,20.264,0z M20.264,22.667
		c-4.234,0-7.667-3.433-7.667-7.667s3.433-7.667,7.667-7.667s7.667,3.433,7.667,7.667S24.498,22.667,20.264,22.667z"/>
    </g>
</svg> */}