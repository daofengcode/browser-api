import puppeteer, { Browser, KnownDevices, Page } from 'puppeteer';
import config from 'src/config';
import IRequest from 'src/interfaces/IRequest';
import { isNumeric } from './number.helper';
import { isNullOrWhitespace, uuid } from './string.helper';

export class Chrome {
    private readonly browser: Browser;
    private readonly proxyServer?: string;
    private readonly proxyUsername?: string;
    private readonly proxyPassword?: string;

    private constructor(browser: Browser, proxyServer?: string, proxyUsername?: string, proxyPassword?: string) {
        this.browser = browser
        this.proxyServer = proxyServer
        this.proxyUsername = proxyUsername
        this.proxyPassword = proxyPassword
    }
    public static async create() {
        let option = config()
        if (isNullOrWhitespace(option.PROXY_SERVER)) {
            return new Chrome(await puppeteer.launch());
        } else {
            var browser = await puppeteer.launch({
                args: [`--proxy-server=${option.PROXY_SERVER.trim()}`]
            });
            return new Chrome(browser, option.PROXY_SERVER, option.PROXY_USERNAME, option.PROXY_PASSWORD)
        }
    }
    async close() {
        await this.browser.close()
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
    async createPage(deviceName?: string, width?: number, height?: number) {
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
        if (this.proxyUsername && this.proxyPassword) {
            await page.authenticate({
                username: this.proxyUsername.trim(),
                password: this.proxyPassword.trim()
            });
        }
        // page.on('request', event => {
        //     console.log(event.resourceType())
        // })
        return page;
    }
    async getHtml(request: IRequest) {
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
    async screenshot(request: IRequest) {
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