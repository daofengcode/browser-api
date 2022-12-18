import { HttpException, HttpStatus, Injectable, OnApplicationShutdown } from "@nestjs/common";
import { OnApplicationBootstrap } from "@nestjs/common/interfaces";
import puppeteer, { Browser } from 'puppeteer';
import { uuid } from "src/utils/string.helper";
import * as fse from 'fs-extra'

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
    private async createPage() {
        const page = await this.browser.newPage();
        page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36");
        return page;
    }
    async getHtml(url: string) {
        // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        const page = await this.createPage();
        await page.goto(url);
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
    async screenshot(url: string, width: number, height: number) {
        const page = await this.createPage();
        await page.setViewport({
            width: width,
            height: height,
            deviceScaleFactor: 1,
        });
        await page.goto(url, {
            waitUntil: 'networkidle2',
        });
        var fileName = uuid() + ".png";
        await page.screenshot({ path: `./public/${fileName}` });
        await page.close()
        return fileName;
    }
}