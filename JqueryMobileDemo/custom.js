function createHeaderModule(obj)
{
	$(obj.container).append('<ul class=\"'+obj.attributes.class+'\" id=\"'+obj.attributes.id+'\" ></ul>');
	return obj.attributes.id;
}

function createHeaderContent(id,obj)
{
	for(var i in obj)
	{
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

function createHeaderNavigationElementsWithoutLinks(id,obj)
{
	$('#'+id).append('<li><a href=\"'+obj.link+'\">'+obj.title+'</a></li>');
}
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

function createContentForm(obj)
{
	var str = '<form method=\"post\" action=\"'+obj.action+'\"><div data-role=\"fieldcontain\"><ul>';
	for(var i=0;i<obj.fields.length;i++)
	{
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