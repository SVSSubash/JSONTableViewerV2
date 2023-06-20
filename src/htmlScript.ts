export class ScriptSource
{
    private getScript():string
    {
        let scriptString = `
        function hideColumns(viewNumber){

            console.log(document);
            //let viewNumber = object.getAttribute("data-viewNumber");
            console.log(viewNumber);

            let nodes = document.querySelectorAll("[data-viewNumber='" + viewNumber +"']")

            let number1 = nodes[0].getAttribute("data-columnNumber");
            let number2 = nodes[1].getAttribute("data-columnNumber");

            console.log("number1 :" + number1)
            console.log("number2 :" + number2 )

            if(number1 > number2){
                for(var i = (+number2) + 1; i <= number1; i++){
                    var columns = document.querySelectorAll('[data-columnNumber="' + i +'"]')
                    for(var y = 0; y < columns.length; y++){
                        columns[y].style.display = "none";
                    }
                }
            }else{
                for(var i = (+number1) + 1; i <= number2; i++){
                    var columns = document.querySelectorAll('[data-columnNumber="' + i +'"]')
                    for(var y = 0; y < columns.length; y++){
                        columns[y].style.display="none";
                    }
                }
            }
        }`
        return scriptString;
    }

    public getScriptTag():string
    {
        return '<script>' + this.getScript() + '</script>';
    }
}