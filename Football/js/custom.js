var selectedPlayersList = {},selectedPlayer,selectionCounter = 0;

$(function(){
	console.log("Here We load the Data");
});

$(".player").on("click",function(event){
	console.log("Player Clicked : "+event.target);
	selectedPlayer = $(event.target).attr("class").split(" ")[($(event.target).attr("class").split(" ").length - 1)];
	if(!$(event.target).hasClass("selectedPlayer"))
	{
		document.getElementById('infoDiv').style.display = 'block' ;
		document.getElementById('infoDiv').style.visibility = 'visible' ;
		document.getElementById('infoDiv').style.left = ( event.pageX - 20) + "px" ;
		//document.getElementById('infoDiv').style.right = (document.getElementById('infoDiv').style.left + 35 ) + "px" ;
		document.getElementById('infoDiv').style.top = (event.pageY +17) + "px" ;
		
		document.getElementById('triDiv').style.display = 'block' ;
		document.getElementById('triDiv').style.visibility = 'visible' ;
		document.getElementById('triDiv').style.left = (( event.pageX) )+ "px" ;
		// document.getElementById('triDiv').style.right = (document.getElementById('infoDiv').style.left + 30) + "px" ;
		document.getElementById('triDiv').style.top =  (event.pageY + 12) + "px" ;
		//document.getElementById('infoDiv').innerHTML = generatePlayerList();
		generatePlayerList();
	}	
	
});


function saveSelectedPlayer(){
	selectionCounter++;
	if(selectionCounter <= 11)
	{	
		var str = '<tr data-name="'+$("#infoDiv div.table-responsive table tr.selected").attr("data-name")+'" data-selectedPlayer="'+selectedPlayer+'" onclick="showRemovePlayerButton(this);">';
				str+='<td>'+$("#infoDiv div.table-responsive table tr.selected").attr("data-name")+'</td>';
				str+='<td>'+$("#infoDiv div.table-responsive table tr.selected").attr("data-position")+'</td>';
				str+='<td>'+$("#infoDiv div.table-responsive table tr.selected").attr("data-team")+'</td>';
			str+='</tr>';
		selectedPlayersList[$("#infoDiv div.table-responsive table tr.selected").attr("data-name")] = true;	
		$(".selectedPlayersList table").append(str);
		$("#triDiv").hide();
		$("#infoDiv").hide();
		$("."+selectedPlayer).addClass("selectedPlayer");
		if(selectionCounter == 11)
		{
			$(".hiddenPlayer").show(1000);
		}	
	}
	else
	{
		var str = '<tr data-name="'+$("#infoDiv div.table-responsive table tr.selected").attr("data-name")+'" data-selectedPlayer="'+selectedPlayer+'" onclick="showRemovePlayerButton(this);">';
			str+='<td>'+$("#infoDiv div.table-responsive table tr.selected").attr("data-name")+'</td>';
			str+='<td>Substitute</td>';
			str+='<td>'+$("#infoDiv div.table-responsive table tr.selected").attr("data-team")+'</td>';
		str+='</tr>';
		selectedPlayersList[$("#infoDiv div.table-responsive table tr.selected").attr("data-name")] = true;	
		$(".selectedPlayersList table").append(str);
		$("#triDiv").hide();
		$("#infoDiv").hide();
		$("."+selectedPlayer).addClass("selectedPlayer");
		if(selectionCounter == 16)
		{
			$(".alert.alert-success").show(1000);
		}	
	}	
}

function showRemovePlayerButton(obj)
{
	$(obj).append('<td><button class="btn btn-danger btn-xs" data-name="'+$(obj).attr("data-name")+'" data-selectedPlayer="'+$(obj).attr("data-selectedPlayer")+'" onclick="removePlayerFromList(this);">Remove</button</td>');
}

function removePlayerFromList(obj)
{
	$("."+$(obj).attr("data-selectedPlayer")).removeClass("selectedPlayer");
	$(obj).parent().parent().remove();
	//selectedPlayersList[$("#infoDiv div.table-responsive table tr td.selected").attr("data-name")] = true;
	delete selectedPlayersList[$(obj).attr("data-name")];
}

function closeDivs(){
	$("#triDiv").hide();
	$("#infoDiv").hide();
}

function generatePlayerList()
{
	$.ajax({
		url:"data/players.json",
		asyn:true,
		cache:false,
		success:function(data){
			var str='<div><div class="table-responsive"><table class="table"><tr><th>Player Name</th><th>Team</th><th>Position</th></tr>';
			for(var i = 0;i<data.length;i++)
			{
				if(undefined == selectedPlayersList[data[i].name])
				{	
					str+='<tr onclick="addPlayerToList(this);" title="'+data[i].position+'" data-position="'+data[i].position+'" data-name="'+data[i].name+'" data-team="'+data[i].team+'">';
						str+='<td>'+data[i].name+'</td>';
						str+='<td>'+data[i].team+'</td>';
						str+='<td>'+data[i].position+'</td>'
					str+='</tr>';
				}	
			}
			str+='</table></div><button type="button" style="visibility:hidden;" class="saveButton btn btn-primary btn-xs" onclick="saveSelectedPlayer();">Save</button><button type="button" class="btn btn-danger btn-xs" style="margin:0 0 0 23px;" onclick="closeDivs();">Cancel</button></div>';
			document.getElementById('infoDiv').innerHTML = str;
			return;
		},
		error:function(err)
		{
			console.log(err);
		}
	});
}

function addPlayerToList(obj)
{
	$("#infoDiv div.table-responsive table tr td.selected").removeClass("selected");
	$(obj).addClass("selected");
	$("#infoDiv button.saveButton").attr("style","visibility:block;");
}