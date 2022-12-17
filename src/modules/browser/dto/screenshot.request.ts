import { IsNotEmpty } from "class-validator";

export class ScreenshotRequest{
    @IsNotEmpty({ message: 'URL parameters cannot be empty' })
    url: string   
}