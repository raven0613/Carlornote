interface IIcon {
    classProps?: string;
}

export default function UnlockIcon({ classProps }: IIcon) {
    return (
        <>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${classProps}`}>
                <path d="M12 14V16M8.11972 5.02477C8.55509 3.28699 10.1272 2 12 2C14.2091 2 16 3.79086 16 6V9M7 21H17C18.1046 21 19 20.1046 19 19V11C19 9.89543 18.1046 9 17 9H7C5.89543 9 5 9.89543 5 11V19C5 20.1046 5.89543 21 7 21Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </>
    )
}

// <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path fillRule="evenodd" clipRule="evenodd" d="M11 4C10.4477 4 10 4.44772 10 5V8H15.0658C15.9523 7.99995 16.7161 7.99991 17.3278 8.08215C17.9833 8.17028 18.6117 8.36902 19.1213 8.87868C19.631 9.38835 19.8297 10.0167 19.9179 10.6722C20.0001 11.2839 20.0001 12.0477 20 12.9342V17.0658C20.0001 17.9523 20.0001 18.7161 19.9179 19.3278C19.8297 19.9833 19.631 20.6117 19.1213 21.1213C18.6117 21.631 17.9833 21.8297 17.3278 21.9179C16.7161 22.0001 15.9523 22.0001 15.0658 22H8.93414C8.04767 22.0001 7.28387 22.0001 6.67222 21.9179C6.0167 21.8297 5.38835 21.631 4.87869 21.1213C4.36902 20.6117 4.17028 19.9833 4.08215 19.3278C3.99991 18.7161 3.99995 17.9523 4 17.0658V12.9342C3.99995 12.0477 3.99991 11.2839 4.08215 10.6722C4.17028 10.0167 4.36902 9.38835 4.87869 8.87868C5.38835 8.36902 6.0167 8.17028 6.67222 8.08214C7.05704 8.03041 7.50208 8.01124 8.00001 8.00415V5C8.00001 3.34315 9.34316 2 11 2H13.0625C14.6848 2 16 3.31516 16 4.9375V5C16 5.55228 15.5523 6 15 6C14.4477 6 14 5.55228 14 5V4.9375C14 4.41973 13.5803 4 13.0625 4H11ZM12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13Z" fill="#323232" />
// </svg>