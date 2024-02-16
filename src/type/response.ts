export interface IResponse {
    code: number, 
    status: "SUCCESS" | "FAIL",
    message: string,
    data: any,
    failedData?: string
}