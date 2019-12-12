// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TreeViewProvider } from './TreeViewProvider';
// 导入 WebView.ts 下的 createWebView 方法
import { createWebView } from './WebView';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let page = 1;

export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "hupuexplore" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.hupu.fresh', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World!');
	});
	vscode.commands.registerCommand('extension.hupu.next', () => {
		page++;
		TreeViewProvider.initTreeViewItem(page);
	});
	vscode.commands.registerCommand('extension.hupu.prev', () => {
		if (page > 1) {
			page--;
		}
		TreeViewProvider.initTreeViewItem(page);
	});
	// 实现树视图的初始化
	TreeViewProvider.initTreeViewItem(page);
	// 还记得我们在 TreeViewProvider.ts 文件下 TreeItemNode 下创建的 command 吗？
	// 创建了 command 就需要注册才能使用
	// label 就是 TreeItemNode->command 里 arguments 传递过来的
	context.subscriptions.push(vscode.commands.registerCommand('itemClick', async (label, href) => {
		// vscode.window.showInformationMessage(label);
		const webView = createWebView(context, vscode.ViewColumn.Active, label, href);
		context.subscriptions.push(await webView);
	}));
	// context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
