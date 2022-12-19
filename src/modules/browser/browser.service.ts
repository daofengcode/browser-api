import { HttpException, HttpStatus, Injectable, OnApplicationShutdown } from "@nestjs/common";
import { OnApplicationBootstrap } from "@nestjs/common/interfaces";
import puppeteer, { Browser, KnownDevices, Page } from 'puppeteer';
import { isNullOrWhitespace, uuid } from "src/utils/string.helper";
import * as fse from 'fs-extra'
import { isNumeric } from "src/utils/number.helper";
import { ScreenshotRequest } from "./dto/screenshot.request";
import { HtmlRequest } from "./dto/html.request";

@Injectable()
export class BrowserService implements OnApplicationShutdown, OnApplicationBootstrap {
    private browser: Browser;
    onApplicationBootstrap() {
        puppeteer.launch().then(b => {
            this.browser = b;
        })
    }
    onApplicationShutdown(signal?: string) {
        this.browser.close().then(() => {
            console.log("close browser.")
        });
    }
    private async setViewport(page: Page, width?: number, height?: number) {
        if (isNumeric(width) && isNumeric(height)) {
            await page.setViewport({
                width: width,
                height: height,
                deviceScaleFactor: 1,
            });
        }
    }

    private async createPage(deviceName?: string, width?: number, height?: number) {
        const page = await this.browser.newPage();
        if (isNullOrWhitespace(deviceName)) {
            page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36");
            await this.setViewport(page, width, height)
        } else {
            let device = KnownDevices[deviceName]
            if (device) {
                await page.setViewport(device.viewport)
                await page.setUserAgent(device.userAgent)
                await page.emulate(device);
            } else {
                throw new Error("The specified device name is invalid.")
            }
        }
        return page;
    }
    async getHtml(request: HtmlRequest) {
        // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        const page = await this.createPage(request.device, request.width, request.height);
        await page.goto(request.url, {
            waitUntil: 'networkidle2',
        });
        // const cdp = await page.target().createCDPSession();
        // const { data } = await cdp.send('Page.captureSnapshot', { format: 'mhtml' });
        // fs.appendFile('page.mhtml', data);
        // 获取HTML，包括单页面
        // https://github.com/puppeteer/puppeteer/issues/331#issuecomment-323010213
        let html = await page.evaluate(() => document.documentElement.outerHTML);
        // 保存文件，仅用于测试
        // fse.outputFile("a.html",html)
        // const html = await page.content();
        await page.close()
        return html
    }
    async screenshot(request: ScreenshotRequest) {
        const page = await this.createPage(request.device, request.width, request.height);
        await page.goto(request.url, {
            waitUntil: 'networkidle2',
        });
        var fileName = uuid() + ".png";
        await page.screenshot({ path: `./public/${fileName}` });
        await page.close()
        return fileName;
    }
}