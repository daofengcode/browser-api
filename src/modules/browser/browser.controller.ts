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
        return await this.browserService.getHtml(request)
    }
    @Post('screenshot')
    async screenshot(@Body() request: ScreenshotRequest) {
        return await this.browserService.screenshot(request)
    }
}