import { HttpException, HttpStatus, Injectable, OnApplicationShutdown } from "@nestjs/common";
import { OnApplicationBootstrap } from "@nestjs/common/interfaces";
import puppeteer, { Browser } from 'puppeteer';
import { join } from 'path';
import { uuid } from "src/utils/string.helper";

@Injectable()
export class BrowserService implements OnApplicationShutdown, OnApplicationBootstrap {
    private browser: Browser;
    onApplicationBootstrap() {
        console.log("onApplicationBootstrap");
        puppeteer.launch().then(b => {
            this.browser = b;
        })
    }
    onApplicationShutdown(signal?: string) {
        console.log("onApplicationShutdown"); // e.g. "SIGINT"
        this.browser.close().then(() => {
            console.log("close browser.")
        });
    }
    private async createPage() {
        const page = await this.browser.newPage();
        page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36");
        return page;
    }
    async getHtml(url: string) {
        // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        const page = await this.createPage();
        await page.goto(url);
        const html = await page.content();
        await page.close()
        return html
    }
    async screenshot(url: string) {
        const page = await this.createPage();
        await page.goto(url, {
            waitUntil: 'networkidle2',
        });
        var fileName = uuid() + ".png";
        await page.screenshot({ path: `./public/${fileName}` });
        await page.close()
        return fileName;
    }
}