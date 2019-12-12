import { TreeItemNode } from './TreeViewProvider';
import { TreeItemCollapsibleState } from 'vscode';

const cheerio = require('cheerio');
const superagent = require('superagent');

export async function getCnData(page: number) {
    let hotNews: {
        title: any; // 获取新闻标题
        href: any; // 获取新闻网页链接
    }[] = [];
    await superagent.get(`https://bbs.hupu.com/bxj-${page}`).then((res: { text: any; }) => {
        // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res
        // 抓取热点新闻数据
        hotNews = getHotNews(res);
    });
    return hotNews.map(
        item => new TreeItemNode(
            item.title as string,
            item.href as string,
            TreeItemCollapsibleState.None as TreeItemCollapsibleState,
        )
    );
}

let getHotNews = (res: { text: any; }) => {
    let hotNews: {
        title: any; // 获取新闻标题
        href: any; // 获取新闻网页链接
    }[] = [];
    // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res.text中。

    /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
       以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
     */
    let $ = cheerio.load(res.text);

    // 找到目标数据所在的页面元素，获取数据
    $('a.truetit').each((idx: any, ele: any) => {
        // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
        let href = "https://bbs.hupu.com/" + $(ele).attr('href') + "";
        // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
        let news = {
            title: $(ele).text(),        // 获取新闻标题
            href: href    // 获取新闻网页链接
        };
        hotNews.push(news);              // 存入最终结果数组
    });
    return hotNews;
};