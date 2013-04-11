/**
 * File Name : CustomFunctions.js
 * Author : Rahul Rout
 * Date : 08-02-2013
 * Description : This file is used for the custom functions that are used for the 3d visual 
 * generation of Sammons Algorithm. The functions here use Three.js, D3.js and Jquery for the viz generation. 
 */

var jsonPath;
var linksLinfo = null,linksCoordinatesForSource = null,linksCoordinatesForTarget = null;

function initializeData()
{
	d3.json('js/data.json',function(json){
		
				linksCoordinatesForSource = new Array();
				linksCoordinatesForTarget = new Array();
				nodeCoordinates = json.Cood;
				/**
				 * This part if commented for the links array generation - Start
				 */
				linksInfo = json.graph.relations;
				for(var i=0;i<linksInfo.length;i++)
				{
						linksCoordinatesForSource.push({id:nodeCoordinates[linksInfo[i].source].id.trim(),value:linksInfo[i].value,
						xs:nodeCoordinates[linksInfo[i].source].x,ys:nodeCoordinates[linksInfo[i].source].y,zs:nodeCoordinates[linksInfo[i].source].z});
						
						linksCoordinatesForTarget.push({id:nodeCoordinates[linksInfo[i].target].id.trim(),value:linksInfo[i].value,
						xs:nodeCoordinates[linksInfo[i].target].x,ys:nodeCoordinates[linksInfo[i].target].y,zs:nodeCoordinates[linksInfo[i].target].z});
				}	
				/**
				 * This part if commented for the links array generation - Ends
				 */
				init();
				animate();
	});
}