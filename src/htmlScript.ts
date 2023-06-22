export class ScriptSource
{
    private getScript():string
    {
        let scriptString = `
        function hideColumns(object){

            console.log(object);
            console.log(document);
            console.log(document.body);
            let viewNumber = object.getAttribute("data-viewNumber");
            console.log(viewNumber);

            let nodes = document.querySelectorAll("[data-viewNumber='" + viewNumber +"']")
            console.log(nodes);

            let number1 = +(nodes[0].getAttribute("data-column-number"));
            let number2 = +(nodes[2].getAttribute("data-column-number"));

            console.log("number1 :" + number1)
            console.log("number2 :" + number2 )

            if(number1 > number2){
                for(var i = (+number2) ; i <= number1; i++){
                    console.log("here");
                    var columns = document.querySelectorAll('[data-column-number="' + i +'"]')
                    for(var y = 0; y < columns.length; y++){
                        console.log("here2");
                        columns[y].style.display = "none";
                    }
                }
            }else{
                console.log("aha");
                for(var i = (+number1) ; i <= number2; i++){
                    console.log("here3");
                    var columns = document.querySelectorAll('[data-column-number="' + i +'"]')
                    for(var y = 0; y < columns.length; y++){
                        console.log("here4");
                        columns[y].style.display="none";
                    }
                }
            }
        }
        hideColumns(1);`
        return scriptString;
    }

    public getScriptTag():string
    {
        return '<script>' + this.getScript() + '</script>';
    }
}
