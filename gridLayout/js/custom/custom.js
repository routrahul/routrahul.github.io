var gridster = null,scale;
var dashboardImage = ["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","8.jpg","9.jpg","10.jpg","11.jpg"];
function initializeGridster()
{
	gridster = $(".gridster ul")
	.gridster({
		widget_margins : [ 10, 10 ],
		widget_base_dimensions : [150,150],
		resize : {
			enabled : false,
			stop : function(e, ui, $widget) {
			}
		}
	}).data('gridster');
	gridster.disable();
}

function createGridsterContent()
{
	var str = '';
	scale = Math.floor($('.gridster' ).width() / 150) - 1;
	var countX = 1,countY = 1;
	for(var i=0;i<25;i++)
	{
		if(countY > scale)
		{
			countY = 1;
	        countX++;
		}
		str='<li data-sizex="1" data-sizey="1" data-row="'+countX+'" data-col="'+countY+'">';
			str+='<div class="panel panel-default">';
				str+='<div class="panel-body">';
					str+='<div style="width:100%;height:100%;">';
					str+='<img height="100%" width="100%" src="/ResponsiveGridLayout/externalResources/'+dashboardImage[Math.floor(Math.random() * (dashboardImage.length -1))]+'"></img>';
					str+='</div>';
				str+='</div>';
			str+='</div>';
		str+='</li>';
		$(".gridster ul").append(str);
		countY++;
	}	
}


function handleResize() {
	try{
		$('head [generated-from="gridster"]:not(:last)').remove();
		scale = Math.floor($('.gridster' ).width() / 150);
		var sizeOfBoxes = 150 * scale;
		var spaceLeftAfterRendering = $('.gridster' ).width()- sizeOfBoxes;
		var spaceBetweenWidgets = (spaceLeftAfterRendering / scale) / 2;
		gridster.resize_widget_dimensions({widget_margins : [ spaceBetweenWidgets, 15 ]});
		var obj = $('.gridster li');
		var countX = 1,countY = 1;
		for(var i=0;i<obj.length;i++)
		{
			if(countY > scale)
			{
				countY = 1;
		        countX++;
			}
			$(obj[i]).attr('data-row',countX);
			$(obj[i]).attr('data-col',countY);
			countY++;
		}
	}
	catch(ex)
	{
		console.log(ex);
	}
	/*
	gridster.resize_widget_dimensions({
		widget_base_dimensions : [ a, b ]
	});
	*/
}


$( window ).resize(function() {
	handleResize();
});	

createGridsterContent();
initializeGridster();