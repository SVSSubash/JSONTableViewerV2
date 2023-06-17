// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { JSONManager } from './index';

console.log("start");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "json-table-viewer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('json-table-viewer.ViewTableV2', () => {
		// The code you place here will be executed every time your command is executed
		let content:any = vscode.window.activeTextEditor?.document.getText();
		
		let panel = vscode.window.createWebviewPanel('JSONTable', 'JSON -> HTML Table', vscode.ViewColumn.One, { enableScripts: true });
		panel.webview.html = JSONManager.getHTML(content);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
