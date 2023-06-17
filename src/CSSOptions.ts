export class CSSOptionsSetter
{
    theme:string = "dark";
    density:string = "small";
    fontStyle:string = "italic";

    // Themeing variables.
    // Table themes
    darkCSSTableTheme = `table{
        /*background-color:#212529;*/
        color:white;
        }
        
        th{
        background-color:#212529;
        }
        
        th,td{
        border-color:#373b3e;
        }
        
        table tbody tr:nth-of-type(odd) td{
        background-color: #2c3034;
        }

        table tbody tr:nth-of-type(even) td{
        background-color: #212529;
        }`;
    
    blueCSSTableTheme = `table{
        /*background-color:#d5e6fa;*/
        color:black;
        }
        
        th{
        background-color:#007bff;
        }
        
        th,td{
        border-color:#c5ddf8;
        }
        
        table tbody tr:nth-of-type(odd) td{
        background-color: #91bfef;
        }
        
        table tbody tr:nth-of-type(even) td{
        background-color: #d5e6fa;;
            }`;

    pinkCSSTableTheme = `table{
        /*background-color:rgb(248, 236, 236);*/
        color:black;
        }
        
        th{
        background-color:#dd9da3;
        }
        
        th,td{
        border-color:#f7dcde;
        }
        
        table tbody tr:nth-of-type(odd) td{
        background-color: #f5c6cb;
        }
        
        table tbody tr:nth-of-type(even) td{
        background-color: rgb(248, 236, 236);
        }`;

    lightCSSTableTheme = `table{
        /*background-color:rgba(248, 236, 236, 0);*/
        color:black;
        }

        th{
        background-color:rgb(230, 246, 250);
        }

        th,td{
        border-color:#d5d5d7;
        }

        table tbody tr:nth-of-type(odd) td{
        background-color: #e6e6e6;
        }
        
        table tbody tr:nth-of-type(even) td{
        background-color: white;
        }`;

    // Layout themes
    darkCSSLayoutTheme = `#nav {
        background-color: rgb(15, 15, 15);
        color: white;
    }
    #intContent{
        background-color: rgb(39, 39, 39);
    }
    #footer{
        background-color: blueviolet;
    }
    body{
        background-color: black;
    }`;

    lightCSSLayoutTheme = `#nav {
        background-color: rgb(37, 184, 221);
        color: white;
    }
    #intContent{
        background-color: rgb(168, 231, 250);
    }
    #footer{
        background-color: blueviolet;
    }
    body{
        background-color: black;
    }`;

    blueCSSLayoutTheme = `#nav {
                background-color: #007bff;
                color: white;
            }
            #intContent{
                background-color: rgb(218, 218, 218);
            }
            #footer{
                background-color: rgb(161, 82, 235);
            }
            body{
                background-color: white;
            }`;
        
    pinkCSSLayoutTheme = `#nav {
        background-color: #dd9da3;
        color: black;
        font-weight: bold;
    }
    #intContent{
        background-color: rgb(218, 218, 218);
    }
    #footer{
        background-color: rgb(230, 171, 11);
    }
    body{
        background-color: white;
    }`;
    
    // Density Setting
    small:string = `.small{
        font-size: .75rem;
    }`;

    medium:string = `.medium{
        font-size: .80rem;
    }`;

    large:string = `.large{
        font-size: .85rem;
    }`;

    // Font Style theme
    italicFontStyle = `
    *{
     font-style: italic !important;   
    }`

    normallFontStyle = ` 
    *{
     font-style: normal !important;   
    }`

    constructor(theme:string,density:string,fontStyle:string)
    {
        this.theme = theme;
        this.density = density;
        this.fontStyle = fontStyle;
    }

    public getTheme():string
    {
        return this.getLayoutTheme() + this.getTableTheme();
    }

    private getLayoutTheme():string
    {
        if(this.theme.toUpperCase() == "" || this.theme.toUpperCase() == "DARK")
        {
            return this.darkCSSLayoutTheme;
        }
        else if(this.theme.toUpperCase() == "PINK")
        {
            return this.pinkCSSLayoutTheme;
        }
        else if(this.theme.toUpperCase() == "BLUE")
        {
            return this.blueCSSLayoutTheme;
        }
        else if(this.theme.toUpperCase() == "LIGHT")
        {
            return this.lightCSSLayoutTheme;
        }
        else 
        {
            return this.darkCSSLayoutTheme;
        }
    }

    private getTableTheme():string
    {   
        if(this.theme.toUpperCase() == "" || this.theme.toUpperCase() == "DARK")
        {
            return this.darkCSSTableTheme;
        }
        else if(this.theme.toUpperCase() == "PINK")
        {
            return this.pinkCSSTableTheme;
        }
        else if(this.theme.toUpperCase() == "BLUE")
        {
            return this.blueCSSTableTheme;
        }
        else if(this.theme.toUpperCase() == "LIGHT")
        {
            return this.lightCSSTableTheme;
        }
        else 
        {
            return this.darkCSSTableTheme;
        }
    }

    public getDensity():string
    {
        if(this.density == "" || this.density.toUpperCase() == "SMALL")
        {
            return this.small;
        }
        else if(this.density.toUpperCase() == "MEDIUM")
        {
            return this.medium;
        }
        else if(this.density.toUpperCase() == "LARGE")
        {
            return this.large;
        }
        else
        {
            return this.small;
        }
    }

    public getFontStyle():string
    {
        if(this.fontStyle.toUpperCase() == "" || this.fontStyle.toUpperCase() == "NORMAL")
        {
            return this.normallFontStyle;
        }
        else 
        {
            return this.italicFontStyle;
        }
    }   
}