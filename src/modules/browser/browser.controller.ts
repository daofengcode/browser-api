import { Body, Controller, Post } from "@nestjs/common";
import { BrowserService } from "./browser.service";
import { HtmlRequest } from "./dto/html.request";

@Controller('browser')
export class BrowserController {
    constructor(
        private browserService: BrowserService
    ) { }

    @Post('html')
    async html(@Body() request: HtmlRequest) {
        return await this.browserService.getHtml(request.url)
    }
}