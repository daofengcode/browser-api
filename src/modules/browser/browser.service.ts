import { Injectable } from "@nestjs/common";
import { isNumeric } from "src/utils/number.helper";
import { ScreenshotRequest } from "./dto/screenshot.request";
import { HtmlRequest } from "./dto/html.request";
import { Chrome } from "src/utils/Chrome";
import config from "src/config";

@Injectable()
export class BrowserService {
    async getHtml(request: HtmlRequest) {
        let chrome: Chrome = null;
        try {
            chrome = await Chrome.create()
            let html = await chrome.getHtml(request)
            return html
        } catch (error) {
            throw error
        } finally {
            if (chrome) {
                chrome.close();
            }
        }
    }
    async screenshot(request: ScreenshotRequest) {
        let chrome: Chrome = null;
        try {
            chrome = await Chrome.create()
            let fileName = await chrome.screenshot(request)
            return fileName
        } catch (error) {
            throw error
        } finally {
            if (chrome) {
                chrome.close();
            }
        }
    }
}