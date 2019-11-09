# trqrequire
**Simple, single file require module to fetch files, scripts and API data with a simple and easily adaptable syntax**

* Installation
>trqrequire is based on jQuery, make sure you are importing it before using the library
>
>Then clone or download this repository and simply add the file ``require.js`` to your index.html before any other script
* Getting started
    * trqrequire provides a very simple framework to organize your requirements in each of your files, start by calling the function ``newStack()`` which will initialize the requirements stack and some other stuff
    * then, add each requirement using the function ``require``
    >Examples
    
        // Require and make available an script
        require('./myScript.js');
        // Fetch local file (contents will be available on txt.value)
        const txt = require('./myTextFile.txt');
        // Fetch data from REST get resource (contents will be available on apidata.value)
        const apidata = require('/myApiGetResource');
    * Once you have all your requirements defined, call the function ``_begin()`` passing a callback with all your code in it, it is inside this callback where you will have access to the scripts' definitions and data values
    >Example

        _begin(function() {
            console.log(varFromScript);
            console.log(requiredFile.value);
            console.log(apidata.value);
        });

