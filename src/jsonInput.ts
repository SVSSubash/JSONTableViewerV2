export class JsonViewer{

    strict:boolean = false;
    counter:number = 0;

    propertyDictionary:object = new Object(); // use this for uniquely identifying each node.
    propertyTitleDictionary:object = new Object(); // use this for the main title of all properties.

    mainPhoenixObject:object = new Object(); // this is the regenerated JSON object with object properties sanitized, that is all objects have same properties.

    globalStringHeader:string = "";
    globalStringTableValue:string = "";
    table = "";

    columnNumber = 0;
    rowNumber = 1;

    globalMaxRowNumber = 2;
    globalColumnCount:number = 0;
    arrayStartColumnNumber = 0;

    headerCount:number = 0;

    constructor(strict:boolean = false) 
    {   
        this.strict = strict;
    }

    // This method is used to get the property dictionary of all properties.
    private getPropertyTitleDictionary(jsonText:string,depth:number,parentProp:string="root",parentNodePropValueType:string=""):void
    {
        let d:number = depth;
        let jsonObj = JSON.parse(jsonText);
        let type:string = this.getType(jsonObj);
        let rootIsArray:boolean = false;

        if(parentProp == "root" && type == "array")
        {
            rootIsArray = true;
        }

        if(type == "array")
        {
            parentNodePropValueType = "array";
            for(var i = 0; i < jsonObj.length; i++)
            {
                if(this.getType(jsonObj[i]) == "string")
                {
                    prop = "";
                    break;
                }
                let val = JSON.stringify(jsonObj[i]);
                this.getPropertyTitleDictionary(val,d,parentProp,"array");
            }
        }
        else if(type == "object")
        {
            for(var prop in jsonObj)
            {
                let val = JSON.stringify(jsonObj[prop]);
                this.getPropertyTitleDictionary(val,d + 1,prop,this.getType(jsonObj[prop]));
                if(prop + d + parentProp in this.propertyDictionary && !rootIsArray && this.strict)
                {
                    console.log("duplicate property name");
                    throw new Error("duplicate property name");   
                }
                else if(prop + d + parentProp in this.propertyDictionary)
                {
                    return;
                }

                var x = prop + d + parentProp;
                // @ts-ignore
                this.propertyDictionary[(prop + d + parentProp)]= d;
                // @ts-ignore
                this.propertyTitleDictionary[this.counter] = {Prop: prop, Depth: d, ParentProp: parentProp, ParentNodePropValueType: parentNodePropValueType, Obj: jsonObj[prop]};
                this.counter++;
            }
        }
        else if(type == "stringArray")
        {
                prop = "";
                if(prop + d + parentProp in this.propertyDictionary && !rootIsArray && this.strict)
                {
                    console.log("duplicate property name");
                    throw new Error("duplicate property name");   
                }
                else if(prop + d + parentProp in this.propertyDictionary)
                {
                    return;
                }
                // @ts-ignore
                this.propertyDictionary[prop + d + parentProp] = d;
                // @ts-ignore
                this.propertyTitleDictionary[this.counter] = {Prop: prop, Depth: d, ParentProp: parentProp, ParentNodePropValueType: parentNodePropValueType, Obj: jsonObj[prop]};
                this.counter++;
        }
    }

    // This is the entry point to get the title dictionary.
    public getTable(sourceJson:string,depth:number,jsonShowBraceNumbers:boolean=true):string
    {
        let rootType:string = this.getType(JSON.parse(sourceJson));

        // Getting title dictionary.
        this.getPropertyTitleDictionary(sourceJson,0,"root",rootType);

        // Create new title root object.
        this.createNewRootObject();

        // Create table header.
        this.createTableHeader(jsonShowBraceNumbers);

        // Get table values.
        // this.getValues(JSON.stringify(this.mainPhoenixObject),sourceJson);
        this.createTableBody(sourceJson);

        // Get the final table.
        return this.createTable();
    }

    private createTable():string
    {
        this.table = '<table>';
        this.table = this.table + this.globalStringHeader + this.globalStringTableValue;
        this.table = this.table + '</table>';
        console.log(this.table);
        return this.table;
    }

    private createTableHeader(jsonShowBraceNumbers:boolean=true):void
    {
        this.headerCount++;
        this.globalStringHeader = "<thead><tr><th><span data-column-number='" + this.headerCount + "' style='background-color:red'>ROOT</span></th>\n";
        this.headerCount++;
        this.tableHeader(this.mainPhoenixObject,0,jsonShowBraceNumbers);
        this.globalStringHeader = this.globalStringHeader + "</tr></thead>"
    }

    private createTableBody(sourceJson:string):void
    {
        let sourceObj = JSON.parse(sourceJson);
        this.globalStringTableValue = "<tbody>\n";
        let type:string = this.getType(this.mainPhoenixObject)
        if(type == "stringArray" || type == "array")
        {
            if(type == "array")
            {
                type = "ObjectArray";
            }
            let typePrinted = false;
            for(var i = 0; i < sourceObj.length; i++)
            {
                this.columnNumber = 0;
                this.rowNumber = this.globalMaxRowNumber;
                this.columnNumber++;
                if(typePrinted == false)
                {
                    this.globalStringTableValue = this.globalStringTableValue + '<tr><td scope=col data-column-number="' + this.columnNumber + '" style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '">' + '<span style="background-color: greenyellow;">' + type + '</span></td>\n';
                    typePrinted = true;
                }
                else
                {
                    this.globalStringTableValue = this.globalStringTableValue + '<tr><td scope=col data-column-number="' + this.columnNumber +'" style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '">' + '</td>\n';
                }
                this.columnNumber++;
                this.globalStringTableValue = this.globalStringTableValue + '<td scope=col data-column-number="' + this.columnNumber +'" style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '">' + '<span style="background-color: greenyellow;">' + i + '</span></td>\n'; // [
                // @ts-ignore
                this.getTableFromValuesWithPlacement(JSON.stringify(this.mainPhoenixObject[0]),JSON.stringify(sourceObj[i]));
                this.columnNumber++;
                this.globalStringTableValue = this.globalStringTableValue + '<td scope=col data-column-number="' + this.columnNumber + '" style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '"></td>\n'; // ]
                this.globalStringTableValue = this.globalStringTableValue + "</tr>\n";
            }
        }
        else
        {
            this.columnNumber = 1;
            this.rowNumber = this.globalMaxRowNumber;
            this.globalStringTableValue = this.globalStringTableValue + '<tr><td data-column-number="' + this.columnNumber + '" style="grid-row:'+ this.rowNumber + ';grid-column:' + this.columnNumber + '">'+'<span style="background-color: greenyellow;">' + type + '</span></td>\n';
            this.getTableFromValuesWithPlacement(JSON.stringify(this.mainPhoenixObject),sourceJson);
            this.globalStringTableValue = this.globalStringTableValue + "</tr>\n";
        }

        this.globalStringTableValue = this.globalStringTableValue + "</tbody>"
    }

    private getValues(rootTitleJson:string,valueJson:string)
    {
        let rootTitleObject = JSON.parse(rootTitleJson);
        let rootTitleObjectType:string = this.getType(rootTitleObject);

        let valueObj:any = null;
        if(valueJson != undefined)
        {
            valueObj = JSON.parse(valueJson);
        }
        else
        {

            if(rootTitleObjectType == "array")
            {
                valueObj = new Array();
                valueObj[0] = new Object();
            }
            else if(rootTitleObjectType == "stringArray")
            {
                valueObj = new Array();
            }
            else
            {
                valueObj = new Object();
            }
        }
        let valueObjectType:string = this.getType(valueObj);

        if(rootTitleObjectType == "array")
        {
            for(var i = 0; i < valueObj.length; i++)
            {
                this.getValues(JSON.stringify(rootTitleObject[0]),JSON.stringify(valueObj[i]));
            }
        }
        else if(rootTitleObjectType == "stringArray")
        {
            for(var i = 0; i < valueObj.length; i++)
            {
                console.log(valueObj[i]);
            }
        }
        else if(rootTitleObjectType == "object")
        {
            for(var prop in rootTitleObject)
            {
                if(this.getType(rootTitleObject[prop]) !== "string")
                {
                    this.getValues(JSON.stringify(rootTitleObject[prop]),JSON.stringify(valueObj[prop]));
                }
                else
                {
                    console.log(prop + ":" + valueObj[prop]);
                }
            }
        }
    }

    private getTableFromValues(rootTitleJson:string,valueJson:string)
    {
        let rootTitleObject = JSON.parse(rootTitleJson);
        let rootTitleObjectType:string = this.getType(rootTitleObject);

        let valueObj:any = null;
        if(valueJson != undefined)
        {
            valueObj = JSON.parse(valueJson);
        }
        else
        {

            if(rootTitleObjectType == "array")
            {
                valueObj = new Array();
                valueObj[0] = new Object();
            }
            else if(rootTitleObjectType == "stringArray")
            {
                valueObj = new Array();
            }
            else
            {
                valueObj = new Object();
            }
        }
        let valueObjectType:string = this.getType(valueObj);

        if(rootTitleObjectType == "array")
        {
            this.globalStringTableValue = this.globalStringTableValue + "<td scope=col>prop</td>\n";

            this.globalStringTableValue = this.globalStringTableValue + "<td scope=col>[</td>\n";

            for(var i = 0; i < valueObj.length; i++)
            {
                this.getTableFromValues(JSON.stringify(rootTitleObject[0]),JSON.stringify(valueObj[i]));
            }

            this.globalStringTableValue = this.globalStringTableValue + "<td scope=col>]</td>\n";
        }
        else if(rootTitleObjectType == "stringArray")
        {
            this.globalStringTableValue = this.globalStringTableValue + "<td scope=col>prop</td>\n";

            this.globalStringTableValue = this.globalStringTableValue + "<td scope=col>[</td>\n";
            
            for(var i = 0; i < valueObj.length; i++)
            {
                console.log(valueObj[i]);
                this.globalStringTableValue = this.globalStringTableValue + "<td scope=col>" + valueObj[i] + "</td>\n";
            }

            this.globalStringTableValue = this.globalStringTableValue + "<td scope=col>]</td>\n";
        }
        else if(rootTitleObjectType == "object")
        {
            this.globalStringTableValue = this.globalStringTableValue + "<td scope=col>{</td>\n";

            for(var prop in rootTitleObject)
            {
                if(this.getType(rootTitleObject[prop]) !== "string")
                {
                    this.getTableFromValues(JSON.stringify(rootTitleObject[prop]),JSON.stringify(valueObj[prop]));
                }
                else
                {
                    console.log(prop + ":" + valueObj[prop]);
                    this.globalStringTableValue = this.globalStringTableValue + "<td scope=col>" + valueObj[prop] +"</td>\n";
                }
            }

            this.globalStringTableValue = this.globalStringTableValue + "<td scope=col>}</td>\n";
        }
    }

    innerArrayRowNumber:number = 0;

    private getTableFromValuesWithPlacement(rootTitleJson:string,valueJson:string):void
    {
        let rootTitleObject = JSON.parse(rootTitleJson);
        let rootTitleObjectType:string = this.getType(rootTitleObject);

        let valueObj:any = null;
        if(valueJson != undefined)
        {
            valueObj = JSON.parse(valueJson);
        }
        else
        {
            if(rootTitleObjectType == "array")
            {
                valueObj = new Array();
                valueObj[0] = new Object();
            }
            else if(rootTitleObjectType == "stringArray")
            {
                valueObj = new Array();
            }
            else
            {
                valueObj = new Object();
            }
        }
        let valueObjectType:string = this.getType(valueObj);

        if(rootTitleObjectType == "array")
        {
            let startColumnNumber = this.columnNumber;
            let startRowNumber = this.rowNumber;
            this.arrayStartColumnNumber = this.columnNumber;

            for(var i = 0; i < valueObj.length; i++)
            {
                this.columnNumber = startColumnNumber;

                if(this.columnNumber < this.arrayStartColumnNumber)
                {
                    this.rowNumber = this.globalMaxRowNumber;
                }

                this.columnNumber++;
                this.globalStringTableValue = this.globalStringTableValue + '<td scope=col data-column-number="' + this.columnNumber + '" style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '">'+ '<span style="background-color: greenyellow;">' + i + '</span></td>\n'; // [

                this.getTableFromValuesWithPlacement(JSON.stringify(rootTitleObject[0]),JSON.stringify(valueObj[i]));
                
                this.columnNumber++;
                this.globalStringTableValue = this.globalStringTableValue + '<td scope=col data-column-number="' + this.columnNumber +'" style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '"></td>\n'; // ]
                
                this.rowNumber++;
            }

            if(this.rowNumber > this.globalMaxRowNumber)
            {
                this.globalMaxRowNumber = this.rowNumber;
            }

            this.rowNumber = startRowNumber;
        }
        else if(rootTitleObjectType == "stringArray")
        {
            let startColumnNumber = this.columnNumber;
            let startRowNumber = this.rowNumber;
            this.arrayStartColumnNumber = this.columnNumber;

            if(valueObj.length == 0)
            {
                this.columnNumber++;
                this.globalStringTableValue = this.globalStringTableValue + '<td scope=col data-column-number="' + this.columnNumber +'" style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '">' + '<span style="background-color: greenyellow;"></span></td>\n'; // [
                
                this.columnNumber++;
                this.globalStringTableValue = this.globalStringTableValue + '<td scope=col contenteditable data-column-number="' + this.columnNumber +'" style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '"></td>\n';

                this.columnNumber++;
                this.globalStringTableValue = this.globalStringTableValue + '<td scope=col data-column-number="' + this.columnNumber +'" style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '"></td>\n'; // ]
            }

            for(var i = 0; i < valueObj.length; i++)
            {
                if(this.columnNumber < this.arrayStartColumnNumber)
                {
                    this.rowNumber = this.globalMaxRowNumber;
                }

                this.columnNumber = startColumnNumber;

                this.columnNumber++;
                this.globalStringTableValue = this.globalStringTableValue + '<td scope=col data-column-number="' + this.columnNumber + '" style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '">' + '<span style="background-color: greenyellow;">' + i + '</span></td>\n'; // [
            
                this.columnNumber++;
                this.globalStringTableValue = this.globalStringTableValue + '<td scope=col contenteditable data-column-number="' + this.columnNumber + '" style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '">' + valueObj[i] + '</td>\n';

                this.columnNumber++;
                this.globalStringTableValue = this.globalStringTableValue + '<td scope=col data-column-number="' + this.columnNumber + '" style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '"></td>\n'; // ]

                this.rowNumber++;
            }

            if(this.rowNumber > this.globalMaxRowNumber)
            {
                this.globalMaxRowNumber = this.rowNumber;
            }

            this.rowNumber = startRowNumber;
        }
        else if(rootTitleObjectType == "object")
        {
            this.columnNumber++;
            this.globalStringTableValue = this.globalStringTableValue + '<td scope=col data-column-number="' + this.columnNumber +'" style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '"></td>\n'; // {

            for(var prop in rootTitleObject)
            {
                let type = this.getType(rootTitleObject[prop]);
                let propType = "";
                let bgColor = "";
                if(type !== "string")
                {
                    if(type == "stringArray")
                    {
                        propType = "StringArray";
                        bgColor = "rgb(55, 169, 197)";
                    }
                    else if(type == "array")
                    {
                        propType = "ObjectArray";
                        bgColor = "YellowGreen";
                    }
                    else 
                    {
                        propType = "Obj";
                        bgColor = "Orange";
                    }
                    this.columnNumber++;
                    this.globalStringTableValue = this.globalStringTableValue + '<td scope=col data-column-number="' + this.columnNumber + '" style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '">' + '<span style="background-color:' + bgColor +';">' +propType + '</span></td>\n'; // prop
                    this.getTableFromValuesWithPlacement(JSON.stringify(rootTitleObject[prop]),JSON.stringify(valueObj[prop]));
                }
                else
                {
                    this.columnNumber++;
                    this.globalStringTableValue = this.globalStringTableValue + '<td scope=col contenteditable data-column-number="' + this.columnNumber + '" style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '">' + valueObj[prop] + '</td>\n';
                }
            }

            this.columnNumber++;
            this.globalStringTableValue = this.globalStringTableValue + '<td scope=col data-column-number="' + this.columnNumber + '" style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '"></td>\n'; // }
        }

        if(this.columnNumber == this.globalColumnCount)
        {
            this.arrayStartColumnNumber = 1;
        }
    }

    // This is the working backup of getTableFromValuesWithPlacement.
    private getTableFromValuesWithPlacementBackup(rootTitleJson:string,valueJson:string):void
    {
        let rootTitleObject = JSON.parse(rootTitleJson);
        let rootTitleObjectType:string = this.getType(rootTitleObject);

        let valueObj:any = null;
        if(valueJson != undefined)
        {
            valueObj = JSON.parse(valueJson);
        }
        else
        {
            if(rootTitleObjectType == "array")
            {
                valueObj = new Array();
                valueObj[0] = new Object();
            }
            else if(rootTitleObjectType == "stringArray")
            {
                valueObj = new Array();
            }
            else
            {
                valueObj = new Object();
            }
        }
        let valueObjectType:string = this.getType(valueObj);

        if(rootTitleObjectType == "array")
        {
            let startColumnNumber = this.columnNumber;
            let startRowNumber = this.rowNumber;
            this.arrayStartColumnNumber = this.columnNumber;

            for(var i = 0; i < valueObj.length; i++)
            {
                this.columnNumber = startColumnNumber;

                if(this.columnNumber < this.arrayStartColumnNumber)
                {
                    this.rowNumber = this.globalMaxRowNumber;
                }

                this.columnNumber++;
                this.globalStringTableValue = this.globalStringTableValue + '<td scope=col style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '">'+ '<span style="background-color: greenyellow;">' + i + '</span></td>\n'; // [

                this.getTableFromValuesWithPlacement(JSON.stringify(rootTitleObject[0]),JSON.stringify(valueObj[i]));
                
                this.columnNumber++;
                this.globalStringTableValue = this.globalStringTableValue + '<td scope=col style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '"></td>\n'; // ]
                
                this.rowNumber++;
            }

            if(this.rowNumber > this.globalMaxRowNumber)
            {
                this.globalMaxRowNumber = this.rowNumber;
            }

            this.rowNumber = startRowNumber;
        }
        else if(rootTitleObjectType == "stringArray")
        {
            let startColumnNumber = this.columnNumber;
            let startRowNumber = this.rowNumber;
            this.arrayStartColumnNumber = this.columnNumber;

            if(valueObj.length == 0)
            {
                this.columnNumber++;
                this.globalStringTableValue = this.globalStringTableValue + '<td scope=col style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '">' + '<span style="background-color: greenyellow;"></span></td>\n'; // [
                
                this.columnNumber++;
                this.globalStringTableValue = this.globalStringTableValue + '<td scope=col contenteditable style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '"></td>\n';

                this.columnNumber++;
                this.globalStringTableValue = this.globalStringTableValue + '<td scope=col style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '"></td>\n'; // ]
            }

            for(var i = 0; i < valueObj.length; i++)
            {
                if(this.columnNumber < this.arrayStartColumnNumber)
                {
                    this.rowNumber = this.globalMaxRowNumber;
                }

                this.columnNumber = startColumnNumber;

                this.columnNumber++;
                this.globalStringTableValue = this.globalStringTableValue + '<td scope=col style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '">' + '<span style="background-color: greenyellow;">' + i + '</span></td>\n'; // [
            
                this.columnNumber++;
                this.globalStringTableValue = this.globalStringTableValue + '<td scope=col contenteditable style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '">' + valueObj[i] + '</td>\n';

                this.columnNumber++;
                this.globalStringTableValue = this.globalStringTableValue + '<td scope=col style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '"></td>\n'; // ]

                this.rowNumber++;
            }

            if(this.rowNumber > this.globalMaxRowNumber)
            {
                this.globalMaxRowNumber = this.rowNumber;
            }

            this.rowNumber = startRowNumber;
        }
        else if(rootTitleObjectType == "object")
        {
            this.columnNumber++;
            this.globalStringTableValue = this.globalStringTableValue + '<td scope=col style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '"></td>\n'; // {

            for(var prop in rootTitleObject)
            {
                let type = this.getType(rootTitleObject[prop]);
                let propType = "";
                let bgColor = "";
                if(type !== "string")
                {
                    if(type == "stringArray")
                    {
                        propType = "StringArray";
                        bgColor = "rgb(55, 169, 197)";
                    }
                    else if(type == "array")
                    {
                        propType = "ObjectArray";
                        bgColor = "YellowGreen";
                    }
                    else 
                    {
                        propType = "Obj";
                        bgColor = "Orange";
                    }
                    this.columnNumber++;
                    this.globalStringTableValue = this.globalStringTableValue + '<td scope=col style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '">' + '<span style="background-color:' + bgColor +';">' +propType + '</span></td>\n'; // prop
                    this.getTableFromValuesWithPlacement(JSON.stringify(rootTitleObject[prop]),JSON.stringify(valueObj[prop]));
                }
                else
                {
                    this.columnNumber++;
                    this.globalStringTableValue = this.globalStringTableValue + '<td scope=col contenteditable style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '">' + valueObj[prop] + '</td>\n';
                }
            }

            this.columnNumber++;
            this.globalStringTableValue = this.globalStringTableValue + '<td scope=col style="grid-row:' + this.rowNumber + ';grid-column:' + this.columnNumber + '"></td>\n'; // }
        }

        if(this.columnNumber == this.globalColumnCount)
        {
            this.arrayStartColumnNumber = 1;
        }
    }

    private createNewRootObject():void
    {
        let phoenixObject:object = new Object();
        var keys = Object.keys(this.propertyTitleDictionary)
        
        // Grouping the properties by parent property.
        for(var i = 0; i < keys.length; i++)
        {
            // @ts-ignore
            if(this.propertyTitleDictionary[i].ParentProp in phoenixObject)
            {
                // @ts-ignore
                 if(this.propertyTitleDictionary[i].ParentNodePropValueType == "array")
                {
                    // @ts-ignore
                    phoenixObject[this.propertyTitleDictionary[i].ParentProp][0][this.propertyTitleDictionary[i].Prop] = "";
                }
                else
                {
                    // @ts-ignore
                    phoenixObject[this.propertyTitleDictionary[i].ParentProp][this.propertyTitleDictionary[i].Prop] = "";
                }
            }
            else
            {
                // @ts-ignore
                if(this.propertyTitleDictionary[i].ParentNodePropValueType == "stringArray")
                {
                    // @ts-ignore
                    phoenixObject[this.propertyTitleDictionary[i].ParentProp] = new Array();
                } // @ts-ignore
                else if(this.propertyTitleDictionary[i].ParentNodePropValueType == "array")
                {
                    // @ts-ignore
                    phoenixObject[this.propertyTitleDictionary[i].ParentProp] = new Array();
                    // @ts-ignore
                    phoenixObject[this.propertyTitleDictionary[i].ParentProp][0] = new Object();
                    // @ts-ignore
                    phoenixObject[this.propertyTitleDictionary[i].ParentProp][0][this.propertyTitleDictionary[i].Prop] = "";
                }
                else
                {
                    // @ts-ignore
                    phoenixObject[this.propertyTitleDictionary[i].ParentProp] = new Object();
                    // @ts-ignore
                    phoenixObject[this.propertyTitleDictionary[i].ParentProp][this.propertyTitleDictionary[i].Prop] = "";
                }
            }
        }

        var phoKey = Object.keys(phoenixObject)

        for(var i = 0; i < phoKey.length; i++)
        {
            // @ts-ignore
            if(this.getType(phoenixObject[phoKey[i]]) == "array")
            {
                // @ts-ignore
                for(var prop in phoenixObject[phoKey[i]][0])
                {
                    if(phoKey.indexOf(prop) !== -1)
                    {
                        // @ts-ignore
                        (phoenixObject[phoKey[i]])[0][prop] = phoenixObject[prop];
                    }
                }
            }
            else
            {
                // @ts-ignore
                for(var prop in (phoenixObject[phoKey[i]]) as object)
                {
                    if(phoKey.indexOf(prop) !== -1)
                    {
                        // @ts-ignore
                        phoenixObject[phoKey[i]][prop] = phoenixObject[prop];
                    }
                }
            }
        }

        // @ts-ignore
        this.mainPhoenixObject = phoenixObject["root"];
        //console.log(JSON.stringify(this.mainPhoenixObject));
    }

    globalViewNumber:number = 1;

    // Generate the table header
    private tableHeader(jsonTitleObj:object, depth:number,jsonShowBraceNumbers:boolean=true):void
    {
        let viewNumber:string = this.globalViewNumber.toString();
        let viewNumberForColumn:number = this.globalViewNumber;

        if(!jsonShowBraceNumbers)
        {
            viewNumber = ""
        }

        let type = this.getType(jsonTitleObj);

        if (type == "stringArray")
        {
            this.globalViewNumber++;

            this.globalStringHeader = this.globalStringHeader + '<th data-viewNumber="' + viewNumberForColumn + '" data-column-number="' + this.headerCount +'" scope=col style="color:purple">[' + viewNumber + '</th>\n';
            this.headerCount++;

            this.globalStringHeader = this.globalStringHeader + "<th data-column-number='" + this.headerCount +"' scope=col style='color:purple'>'StringArray'</th>\n";
            this.headerCount++;

            this.globalStringHeader = this.globalStringHeader + "<th data-viewNumber='" + viewNumberForColumn + "' data-column-number='" + this.headerCount +"'scope=col style='color:purple'>]" + viewNumber + "</th>\n";
            this.headerCount++;
        }
        if (type == "array")
        {
            this.globalViewNumber++;

            this.globalStringHeader = this.globalStringHeader + "<th data-viewNumber='" + viewNumberForColumn + "' data-column-number='" + this.headerCount +"' scope=col style='color:purple'>[" + viewNumber + "</th>\n";
            this.headerCount++;

            // @ts-ignore
            this.tableHeader(jsonTitleObj[0],depth,jsonShowBraceNumbers);

            this.globalStringHeader = this.globalStringHeader + "<th data-viewNumber='" + viewNumberForColumn + "' data-column-number='" + this.headerCount + "' scope=col style='color:purple'>]" + viewNumber + "</th>\n";
            this.headerCount++;
        } 
        else if (type == "object")
        {
            this.globalViewNumber++;

            depth++;
            var propCount = 0;

            this.globalStringHeader = this.globalStringHeader + "<th data-viewNumber='" + viewNumberForColumn + "' data-column-number='" + this.headerCount + "' scope=col style='color:#ff0303'>{" + viewNumber + "</th>\n";
            this.headerCount++;

            for (let x in jsonTitleObj) 
            {
                propCount++;
                //str = "("+ "Depth" + ":" + depth + ")" + "(PropCount:" + propCount+ ")" +  x;
                //let str = '<th scope=col>('+ "D" + ":" + depth + ")" + "(P:" + propCount+ ")" +  x + "</th>\n";
                let str = '<th scope=col data-column-number="' + this.headerCount + '">' + x + '</th>\n';
                this.headerCount++;
                this.globalStringHeader = this.globalStringHeader + str;
                // @ts-ignore
                this.tableHeader(jsonTitleObj[x],depth,jsonShowBraceNumbers);
            }

            this.globalStringHeader = this.globalStringHeader + "<th data-viewNumber='" + viewNumberForColumn + "' data-column-number='" + this.headerCount + "' scope=col style='color:#ff0303'>}" + viewNumber + "</th>\n";
            this.headerCount++;
        } 
        else if (type == "string")
        {

        } 
        else 
        {

        }

        if(this.headerCount > this.globalColumnCount)
        {
            this.globalColumnCount = this.headerCount;
        }
    }

    private tableHeaderBackup(jsonTitleObj:object, depth:number):void
    {
        var viewNumber = this.globalViewNumber ;

        var type = this.getType(jsonTitleObj);

        if (type == "stringArray")
        {
            this.globalViewNumber++;

            this.globalStringHeader = this.globalStringHeader + '<th data-viewNumber="' + viewNumber + '" data-column-number="' + this.headerCount +'" scope=col style="color:purple">[' + viewNumber + '<input type="button" data-column-number="' + this.headerCount + '" value="+" onclick="hideColumns(this)" /></th>\n';
            this.headerCount++;

            this.globalStringHeader = this.globalStringHeader + "<th data-column-number='" + this.headerCount +"' scope=col style='color:purple'>'StringArray'</th>\n";
            this.headerCount++;

            this.globalStringHeader = this.globalStringHeader + "<th data-viewNumber='" + viewNumber + "' data-column-number='" + this.headerCount +"'scope=col style='color:purple'>]" + viewNumber + "</th>\n";
            this.headerCount++;
        }
        if (type == "array")
        {
            this.globalViewNumber++;

            this.globalStringHeader = this.globalStringHeader + "<th data-viewNumber='" + viewNumber + "' data-column-number='" + this.headerCount +"' scope=col style='color:purple'>[" + viewNumber + "<input type='button' data-column-number='" + this.headerCount + "' value='+' onclick='hideColumns(this)' /></th>\n";
            this.headerCount++;

            // @ts-ignore
            this.tableHeader(jsonTitleObj[0],depth);

            this.globalStringHeader = this.globalStringHeader + "<th data-viewNumber='" + viewNumber + "' data-column-number='" + this.headerCount + "' scope=col style='color:purple'>]" + viewNumber + "</th>\n";
            this.headerCount++;
        } 
        else if (type == "object")
        {
            this.globalViewNumber++;

            depth++;
            var propCount = 0;

            this.globalStringHeader = this.globalStringHeader + "<th data-viewNumber='" + viewNumber + "' data-column-number='" + this.headerCount + "' scope=col style='color:#ff0303'>{" + viewNumber + "<input type='button' data-column-number='" + this.headerCount + "' value='+' onclick='hideColumns(this)' /></th>\n";
            this.headerCount++;

            for (let x in jsonTitleObj) 
            {
                propCount++;
                //str = "("+ "Depth" + ":" + depth + ")" + "(PropCount:" + propCount+ ")" +  x;
                //let str = '<th scope=col>('+ "D" + ":" + depth + ")" + "(P:" + propCount+ ")" +  x + "</th>\n";
                let str = '<th scope=col data-column-number="' + this.headerCount + '">' + x + '</th>\n';
                this.headerCount++;
                this.globalStringHeader = this.globalStringHeader + str;
                // @ts-ignore
                this.tableHeader(jsonTitleObj[x],depth);
            }

            this.globalStringHeader = this.globalStringHeader + "<th data-viewNumber='" + viewNumber + "' data-column-number='" + this.headerCount + "' scope=col style='color:#ff0303'>}" + viewNumber + "</th>\n";
            this.headerCount++;
        } 
        else if (type == "string")
        {

        } 
        else 
        {

        }

        if(this.headerCount > this.globalColumnCount)
        {
            this.globalColumnCount = this.headerCount;
        }
    }
    // Used to get the type of the object.
    private getType(val:any):string
    {
        if(Array.isArray(val))
        {
            if(val.length == 0)
            {
                return "stringArray";
            }
            
            for(var i = 0; i < val.length; i++)
            {
                if(typeof val[i] == 'string')
                {
                    return "stringArray";
                }
                else
                {
                    return "array";
                }
            }
        }
        else if (typeof val == 'string'){
            return "string";
        }
        else if (val != null && typeof val == 'object'){
            return "object";
        } 
        else {
            return "other";
        }

        return "";
    }
}
