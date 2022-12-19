import { IsNotEmpty } from "class-validator";

export class HtmlRequest {
    @IsNotEmpty({ message: 'URL parameters cannot be empty' })
    url: string
    width?: number
    height?: number
    /** 模拟设备 */
    device?:string
}