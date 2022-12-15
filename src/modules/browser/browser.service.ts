import { HttpException, HttpStatus, Injectable, OnApplicationShutdown } from "@nestjs/common";
import { OnApplicationBootstrap } from "@nestjs/common/interfaces";
import puppeteer, { Browser } from 'puppeteer';

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
    async getHtml(url: string) {
        // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        const page = await this.browser.newPage();
        page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36");
        await page.goto(url, {
            //wait for content to load 
            waitUntil: 'networkidle0',
        });
        const html = await page.content();
        page.close()
        return html
    }
}