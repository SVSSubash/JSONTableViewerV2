import { ScriptSource } from "./htmlScript";

export class HTMLRenderer
{
    density:string = "";
    table:string = "";
    style:string = "";

    constructor(density:string, table:string, style:string)
    {
        this.density = density;
        this.table = table;
        this.style = style;
    }

    public renderHTML():string
    {
        let scriptSrc = new ScriptSource();
        let body:string = `<body class="${this.density}">
        <div id="nav"><span>JSON Table Viewer</span></div>
        <div id="intContent"></div>
        <div id="content">${this.table}</div>
        <div id="footer"></div>
        </body>`
        let head:string = `<head><style>${this.style}</style></head>`
        return `<!DOCTYPE html><html> ${head} ${body} ${scriptSrc.getScriptTag()}</html>`;
    }
}
