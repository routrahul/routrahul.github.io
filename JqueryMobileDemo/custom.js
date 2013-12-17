/**
* This method creates the main header module.
* Here we create the placeholder which contains the elements to create the header bar
*/
function createHeaderModule(obj)
{
	$(obj.container).append('<ul class=\"'+obj.attributes.class+'\" id=\"'+obj.attributes.id+'\" ></ul>');
	return obj.attributes.id;
}

/**
* This method creates the elements inside the header bar with general information like the logo image and company name
*/
function createGeneralHeader(id,obj)
{
	$('#'+id).append('<li><img border=\"0\" src=\"'+obj.logo+'\" alt="logo"/><h3>'+obj.name+'</h3></li>');
}

/**
* This method creates the elements inside the header bar with more specific information
* liek the links to different navigation sections and the drop downs.
*/
function createHeaderContent(id,obj)
{
	for(var i in obj)
	{
		// I check if the object being parsed has any subnav elements
		if(obj[i].subnav === undefined)
		{
			createHeaderNavigationElementsWithoutLinks(id,obj[i]);
		}
		else
		{
			createHeaderNavigationElementsWithLinks(id,obj[i]);
		}
	}
}

/**
* Used to create the navigation links
*/
function createHeaderNavigationElementsWithoutLinks(id,obj)
{
	$('#'+id).append('<li><a href=\"'+obj.link+'\">'+obj.title+'</a></li>');
}

/**
* Used to create the navigation drop down
*/
function createHeaderNavigationElementsWithLinks(id,obj)
{
	var str = '<li><div data-role=\"\"><select>';
	str+='<option>'+obj.title+'</option>';
	for(var i=0;i<obj.subnav.length;i++)
	{
		str+='<option>'+obj.subnav[i].title+'</option>';
	}
	str +='</select></div></li>';
	$('#'+id).append(str);
}

/**
*This method creates the content placeholder
*/
function createContentPlaceHolder(obj)
{
	var str ='<h1>'+obj.title+'</h1>';
	str +='<p>'+obj.subtitle+'</p>';
	$(obj.container).append(str);
	for(var i in obj.attributes)
	{
		$(obj.container).attr(obj.attributes.i,obj.attributes[i]);
	}	
}

/**
*This method creates the Form for the page
*/
function createContentForm(obj)
{
	var str = '<form method=\"post\" action=\"'+obj.action+'\"><div data-role=\"fieldcontain\"><ul>';
	for(var i=0;i<obj.fields.length;i++)
	{
		//This switch is used to check the type of element we are rendering 
		switch(obj.fields[i].type)
		{
			case "text":
				str += '<li><label>'+obj.fields[i].label+'</label><input id=\"'+obj.fields[i].id+'\" name=\"'+obj.fields[i].name+'\" type=\"'+obj.fields[i].type+'\"  value=\"'+obj.fields[i].value+'\"\></li>';
				break;
			case "submit":
				str += '<li><input name=\"'+obj.fields[i].name+'\" type=\"'+obj.fields[i].type+'\"  value=\"'+obj.fields[i].value+'\"\></li>';
				break;
			case "select":	
				str += '<li><label>'+obj.fields[i].label+'</label><select id=\"'+obj.fields[i].id+'\" name=\"'+obj.fields[i].name+'\">';
				for(var j=0;j<obj.fields[i].options.length;j++)
				{
					if(obj.fields[i].options[j].selected == true)
					{
						str += '<option value=\"'+obj.fields[i].options[j].value+'\" selected="true">'+obj.fields[i].options[j].text+'</option>';
					}
					else
					{
						str += '<option value=\"'+obj.fields[i].options[j].value+'\" >'+obj.fields[i].options[j].text+'</option>';
					}		
				}
				str += '</select></li>';
				break;
		}
	}
	$(obj.container).append(str);
}

$( document ).ready(function() {
		
		var obj = jQuery.parseJSON( '{"general":{"logo":"assets/images/logo.png","name":"Company Name"},"navigation":[{"title":"Home","link":"index.html"},{"title":"Products","link":"product.html","subnav":[{"title":"Webapps","link":"webapps"},{"title":"Mobile Apps","link":"mobile-apps"}]}],"modules":[{"type":"navigation","container":"#header","title":"Top Navigation","attributes":{"class":"topNavigation","id":"topNavigation"}},{"type":"content","title":"Hi Welcome to mobile development","subtitle":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.","container":"#maincontent","attributes":{"class":"topContent"}},{"type":"form","title":"Registration Form","action":"submit.aspx","name":"registrationform","container":"#maincontent","attributes":{"class":"registrationform"},"fields":[{"id":"firstname","label":"First Name","name":"fname","type":"text","value":""},{"id":"email","label":"Email","name":"email","type":"text","value":""},{"id":"countries","label":"Country","name":"countries","type":"select","options":[{"value":"","text":"Select Country"},{"value":"in","text":"India","selected":"true"},{"value":"us","text":"United Stated"},{"value":"uk","text":"United Kingdom"},{"value":"cn","text":"Canada"}]},{"id":"submit","name":"submit","type":"submit","value":"Submit"}],"rules":{"fname":"required","email":{"required":"true","email":"true"}},"messages":{"fname":"Enter your firstname","email":{"required":"Please enter a valid email address","minlength":"Please enter a valid email address"}}}]}' );
		var idOfNavigationBar = createHeaderModule(obj.modules[0]);
		createGeneralHeader(idOfNavigationBar,obj.general);
		createHeaderContent(idOfNavigationBar,obj.navigation);
		createContentPlaceHolder(obj.modules[1]);
		createContentForm(obj.modules[2]);
	});