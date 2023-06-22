import { CSSCommon } from "./CSSCommon";
import { CSSOptionsSetter } from "./CSSOptions";
import { JsonViewer} from "./jsonInput";
import { HTMLRenderer } from "./htmlView";
const vscode = require("vscode");

export class JSONManager
{
    public static getHTML(jsonData:string):string
    {
        // 1. Get configuration
        let jsonTableViewerConfiguration = vscode.workspace.getConfiguration("jsonTableViewer");
        let jsonTableViewerTheme:string = "";
        let jsonTableViewerDensity:string = "";
        let jsonTableViewerFontStyle:string = "";
        let jsonShowBraceNumbers:boolean = true;
        if (jsonTableViewerConfiguration) 
        {
            jsonTableViewerTheme = jsonTableViewerConfiguration.get("jsonTableViewerTheme");
            jsonTableViewerDensity = jsonTableViewerConfiguration.get("jsonTableViewerDensity");
            jsonTableViewerFontStyle = jsonTableViewerConfiguration.get("jsonTableViewerFontStyle");
            jsonShowBraceNumbers = jsonTableViewerConfiguration.get("jsonShowBraceNumbers");
        }

        // 2. Get Table
        let viewer = new JsonViewer(false);
        let tableString = viewer.getTable(jsonData,0,jsonShowBraceNumbers);

        // 3. Get Common Styling
        let cssCommon = new CSSCommon();
        let cssCommonStyling = cssCommon.getCSSCommonStyling();

        // 4. Get theme styling
        let cssOptionsSetter = new CSSOptionsSetter(jsonTableViewerTheme,jsonTableViewerDensity,jsonTableViewerFontStyle);

        // 5. Get Global Styling
        let globalCSSStyling = cssCommonStyling + cssOptionsSetter.getTheme() + cssOptionsSetter.getDensity() + cssOptionsSetter.getFontStyle();

        // 6. Render HTML
        let htmlRenderer = new HTMLRenderer(jsonTableViewerDensity,tableString,globalCSSStyling);
        return htmlRenderer.renderHTML();
    }
}








