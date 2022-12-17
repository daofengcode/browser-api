import { Body, Controller, Post } from "@nestjs/common";
import { isNumeric } from "src/utils/number.helper";
import { BrowserService } from "./browser.service";
import { HtmlRequest } from "./dto/html.request";
import { ScreenshotRequest } from "./dto/screenshot.request";

@Controller('browser')
export class BrowserController {
    constructor(
        private browserService: BrowserService
    ) { }

    @Post('html')
    async html(@Body() request: HtmlRequest) {
        return await this.browserService.getHtml(request.url)
    }
    @Post('screenshot')
    async screenshot(@Body() request: ScreenshotRequest) {
        let height = isNumeric(request.height) ? parseInt(request.height.toString()) : 1080;
        let width = isNumeric(request.width) ? parseInt(request.width.toString()) : 1920;
        let fileName = await this.browserService.screenshot(request.url, width, height)
        return fileName
    }
}