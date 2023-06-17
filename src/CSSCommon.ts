export class CSSCommon
{
    resetCSSCommon:string = `html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
        display: block;
    }
    ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }`

    cssLayoutCommon = `            
    * {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    body {
        box-sizing: border-box;
        block-size: 100vh;
        display: flex;
        flex-direction: column;
        background-image: linear-gradient(black, rgb(68, 68, 68));
    }
    #nav {
        block-size: 5%;
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
    }
    #nav span{
        margin-left:2rem;
    }
    #intContent
    {
        block-size: 8%;
    }
    #content {
        block-size: 100%;
        overflow: scroll;
        margin:1rem;
    }
    #footer{
        block-size: 2.5%;
        margin-bottom: 1rem;
    }`;

    cssTableCommon:string = `table {
        display: grid;
        grid-template-columns: auto;
        justify-content: stretch;
    }
    thead, tbody, tr{
        display:contents;
    }
    th, td
    {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border: solid;
        border-right-width: 0px;
        border-left-width: 0px;
        border-top-width: 1px;
        margin-top:-1px;
        border-bottom-width: 1px;
        padding:.5rem;
        white-space:nowrap;
    }
    td > span,th > span{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        inline-size: auto;
        border-radius: 10px;
        color: black;
        font-weight: bold;
        padding: 0 1em 0 1em;
    }
    [contenteditable]:focus
    {
        outline:0px solid rgb(0, 0, 0);
        background-color: rgb(148, 231, 236);
        color:black;
        font-weight: bold;
    }
    table{
        position: relative;
    }
    table>thead>tr>th{
        position: -webkit-sticky;
        position: sticky;
        top:-1px;
    }`;

    public getCSSCommonStyling():string
    {
        return this.resetCSSCommon + this.cssLayoutCommon + this.cssTableCommon;
    }
}