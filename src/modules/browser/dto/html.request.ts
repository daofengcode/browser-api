import { IsNotEmpty } from "class-validator";

export class HtmlRequest {
    @IsNotEmpty({ message: 'URL parameters cannot be empty' })
    url: string
}