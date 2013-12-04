var checkOutput = false;

/**
* Function called when an input is provided and needs to be executed
* The starting point of the action!!
**/
function executeInstructions()
{
	var input = document.getElementById('inputValue').value;
	try{
		/*
		* Create an anonymous function with the input as the body
		*/
		var F=new Function (input);
		/*
		* Execute the function and store the output in a variable
		*/
		var ret = F();
		if(!checkOutput)
		{
			logGenerals(ret);
			checkOutput = false;
		}
	}
	catch(ex)
	{
		logErrors(ex.message);
	}
	
}

/**
* This method logs the errors occured to the browser
*/
function logErrors(op)
{
	var div = document.createElement('div');
	div.innerHTML = op;
	div.className = "alert alert-danger";
	$('#output').prepend(div);
}

/**
* This method logs the general outcomes to the browser
*/
function logGenerals(op)
{
	var div = document.createElement('div');
	div.innerHTML = '<< '+op;
	div.className = "alert alert-warning output";
	$('#output').prepend(div);
}

/**
* This method logs the console outputs to the browser
*/
function logConsoles(op)
{
	var div = document.createElement('div');
	div.innerHTML = op;
	div.className = "alert alert-info";
	$('#output').prepend(div);
}

/*
* This part is used to override the console object.
* Here I am attaching my own functionality for the console.log method
*/		
window.console = {
  log: function () {
	var l = arguments.length, i = 0,checkOutput = true;
	for (; i < l; i++) {
	  logConsoles(arguments[i]);
	}
  }
};
