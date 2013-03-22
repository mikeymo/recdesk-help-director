bTooltipShouldBeMade = true;
var constShowTimeout = 300;
var constHideTimeout = 750;
var ShowNum = 0;
var HideNum = 0;
var TShowTime = new Array();
var THideTime = new Array();
var Positioned = new Array();
var divRightPadding = 100;
var epsilon = 30;
var eventClientX, eventClientY, eventPageX, eventPageY;
function clearTooltipHideIfNecessary(objid)
{
	if (HideNum == objid)
	{
		window.clearTimeout(THideTime[HideNum]);
		THideTime[HideNum];
		HideNum = 0;
	}
}
function TMouseOverF(objid) 
{ 
	return "clearTooltipHideIfNecessary(\"" + objid + "\");";
}
function TMouseOutF(objid) 
{
	return "TooltipHide(\"" + objid + "\");";
}

document.showItem = function(objid)
{
	var curobj = document.getElementById("Tooltip_"+objid);
	var curBrowser = getBrowserType();
	var x=-1; var dx = 20; var y=-1; var dy = 20;
	{
		if (eventPageX) 
			x =  eventPageX;
		else if (eventClientX)
			x = eventClientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
		else x = 0;
	}
	{
		if (eventPageY) 
			y = eventPageY;
		else if (eventClientY)
			y = eventClientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
		else y = 0;
	}
	curobj.style.left = x + dx + 10 + "px";
	curobj.style.top = y + dy + 10 + "px";
	curobj.style.display = "block";

	{
		var visArea = new Object;
		if (curBrowser.indexOf("MSIE") != -1)
		{ 
			visArea.left    = document.documentElement.scrollLeft;
			visArea.top     = document.documentElement.scrollTop;
			visArea.width   = document.documentElement.offsetWidth;
			visArea.height  = document.documentElement.offsetHeight;
		}
		if (curBrowser.indexOf("Nav6") != -1)
		{
			visArea.left    = document.documentElement.scrollLeft;
			visArea.top     = document.documentElement.scrollTop;
			visArea.width   = window.innerWidth;
			visArea.height  = window.innerHeight;
		}
		if (curBrowser.indexOf("Opera") != -1)
		{ 
			visArea.left    = document.body.scrollLeft;
			visArea.top     = document.body.scrollTop;
			visArea.width   = window.innerWidth;
			visArea.height  = window.innerHeight;
		}
		visArea.right   = visArea.left + visArea.width;
		visArea.bottom  = visArea.top + visArea.height;

		var divArea = new Object;
		divArea.left    = x + dx + 30;
		divArea.top     = y + dy + 30;

		if (curBrowser.indexOf("MSIE") != -1)
		{ 
			divArea.width   = curobj.scrollWidth;
			divArea.height  = curobj.scrollHeight;
		}
		if (curBrowser.indexOf("Nav6") != -1)
		{
			divArea.width   = curobj.offsetWidth;
			divArea.height  = curobj.offsetHeight;
		}
		if (curBrowser.indexOf("Opera") != -1)
		{
			divArea.width   = curobj.offsetWidth;
			divArea.height  = curobj.offsetHeight;
		}    
		divArea.right   = divArea.left + divArea.width;
		divArea.bottom  = divArea.top + divArea.height;

		var extraR = divArea.right - visArea.right;
		if (extraR > 0)
			divArea.left -= extraR + 16;
		var extraL = visArea.left - divArea.left;
		if (extraL > 0)
			divArea.left += extraL + 10;
		var extraB = divArea.bottom - visArea.bottom;
		if (extraB > 0)
			divArea.top -= extraB + 16;
		var extraT = visArea.top - divArea.top;
		if (extraT > 0)
			divArea.top += extraT + 10;

		curobj.style.left = divArea.left -20 + "px";
		curobj.style.top  = divArea.top  -20 + "px";
		
		var oTable = document.getElementById(curobj.id + "table");
		oTable.style.width = $(curobj).width() + "px";
		curobj.style.left = divArea.left - 30 + "px";
		curobj.style.top  = divArea.top  - 30 + "px";
	}
	Positioned[objid] = true;
	TShowTime[objid] = null;
}
function ShowItem(event, objid)
{
	eventClientX = event.clientX;
	eventClientY = event.clientY;
	eventPageX = event.pageX;
	eventPageY = event.pageY;

	document.showItem(objid);

	ShowNum = objid;
	THideTime[objid] = null;
}
function HideTooltipById(objid)
{
	var curobj = document.getElementById("Tooltip_"+objid);
	curobj.style.display = "none";
	var oTable = document.getElementById(curobj.id + "table");
	oTable.style.width = "100%";
}
function TooltipShow(event, objid)
{
	if (HideNum == objid)
	{
		window.clearTimeout(THideTime[HideNum]);
		THideTime[HideNum];
		HideNum = 0;
		return;
	}
	if (HideNum != 0)
	{
		var HideTimeout = THideTime[HideNum];
		window.clearTimeout(HideTimeout);
		HideTooltipById(HideNum);
		HideNum = 0;
		ShowItem(event, objid);
		return;
	}
	var ShowTimeout = null;
	if (ShowNum != 0)
		ShowTimeout = TShowTime[ShowNum]; 
	if (ShowTimeout != null) 
	{ 
		window.clearTimeout(ShowTimeout); 
		HideTooltipById(ShowNum);
		ShowItem(event, objid);
	} 
	else
	{
		var TimeoutFunction = function(objid)
		{
			document.showItem(objid);
		}//TimeoutFunction
		
		ShowNum = objid;
		eventClientX = event.clientX;
		eventClientY = event.clientY;
		eventPageX = event.pageX;
		eventPageY = event.pageY;
		TShowTime[objid] = window.setTimeout(function(){TimeoutFunction(objid)}, constShowTimeout);
	}
}
function TooltipHideTimed(objid, hideTimeout)
{
	var ShowTimeout = null;
	if (ShowNum != 0)
		ShowTimeout = TShowTime[ShowNum];
	if (ShowTimeout != null && document.getElementById("Tooltip_"+ShowNum).style.display == "none")
	{
		window.clearTimeout(ShowTimeout);
		TShowTime[ShowNum] = null;
		ShowNum = 0;
		return;
	}
	var TimeoutFunction = function(objid)
	{
		HideTooltipById(objid);
		THideTime[objid] = null;
		HideNum = 0;
		ShowNum = 0; 
	}
	THideTime[objid] = window.setTimeout(function(){TimeoutFunction(objid)}, hideTimeout);
	HideNum = objid;
}
function TooltipHide(objid)
{
	TooltipHideTimed(objid, constHideTimeout);
}
function HideAndMove(objid)
{
	TooltipHideTimed(objid, 0);
	window.open("#id_" + objid, "_self");
}

function getBrowserType()
{
var BODY_EL = (document.compatMode && document.compatMode != "BackCompat")?
document.documentElement : 
document.body ? document.body : null;
var user_Agent = navigator.userAgent.toLowerCase();
var Agent_version = navigator.appVersion;
var isOpera = !!(window.opera && document.getElementById);
var isOpera6 = isOpera && !document.defaultView;
var isOpera7 = isOpera && !isOpera6;
var isMSIE = (user_Agent.indexOf("msie") != -1) && document.all && BODY_EL && !isOpera;
var isMSIE6 = isMSIE && parseFloat(Agent_version.substring(Agent_version.indexOf("MSIE")+5)) >= 5.5;
var isNN4 = (document.layers && typeof document.classes != "undefined");
var isNN6 = (!isOpera && document.defaultView && typeof document.defaultView.getComputedStyle != "undefined");
var isW3C_compatible = !isMSIE && !isNN6 && !isOpera && document.getElementById;
if (isOpera6)return "Opera6";
if (isOpera7)return "Opera7";
if (isMSIE)return "MSIE";
if (isMSIE6)return "MSIE6";
if(isNN4)return "Nav4";
if(isNN6)return "Nav6";
if (isW3C_compatible) return "w3c";
return null;
}
function attachMyAttrib(anElement, aName, aValue)
{
	if (getBrowserType().indexOf("MSIE") != -1)
	{
		anElement[aName] = aValue;
	}
	else
	{
		var myNewAttr = document.createAttribute(aName);
		myNewAttr.value = aValue;
		var myOldAttr = anElement.setAttributeNode(myNewAttr);
	}
}
$(document).ready(function()
{
	if (document.DrExplain_Make_Tooltips)
		return;
		
	var wndImgs = $(".de_wndimg");
	
	if (!wndImgs || wndImgs.length == 0) 
		return;
	var areas = $("area");
	for (var i=0; i<areas.length; i++)
	{
		var curid = areas[i].href.substring(areas[i].href.lastIndexOf("#")+4, areas[i].href.length);
		attachMyAttrib(areas[i], "id", "area_"+curid);
	}
	for (var i = 0; i < wndImgs.length; ++i)
		if (getBrowserType().indexOf("MSIE") != -1)
		{
			wndImgs[i].alt = "";
		}
		else
		{
			var altAttr = wndImgs[i].getAttributeNode("alt");
			if (altAttr)
				wndImgs[i].removeAttributeNode(altAttr);
		}
		
	var divs = $(".de_ctrl");
	for (var i=0; i<divs.length; i++)
	{
		var curid = divs[i].getElementsByTagName("table")[0].rows[0].cells[0].firstChild.name;
		if (curid.lastIndexOf('id_')!= -1)
			curid = curid.substring(3, curid.length);
			
		if (curid != "top")
		{
			var apparea = document.getElementById("area_" + curid);
			
			var curTooltip = document.createElement("div");
			var oTable = document.createElement("table");
			curTooltip.appendChild(oTable);
			var oRow = oTable.insertRow(-1);
			var oCell = oRow.insertCell(-1);
			var clonedDiv = divs[i].cloneNode(true);
			oCell.appendChild(clonedDiv);
			curTooltip.className = "b-tree m-tree__contextMenu description_on_page cloned_node";
			curTooltip.style.position = "absolute";
			curTooltip.style.display = "none";
			curTooltip.style.zIndex = "100";
			curTooltip.id = "Tooltip_" + curid;
			
			oTable.id = curTooltip.id + "table";
			oTable.className = "b-tree__layout";
			oTable.cellSpacing = "0";
			oTable.style.borderStyle = "none";
			oTable.style.width = "100%";
			oTable.style.fontSize = "10pt";
			oTable.style.textDecoration = "none";
			
			//Remove [Top] links from divs
			var curTrs = curTooltip.getElementsByTagName("tr");
			var trsToRemove = new Array();
			for (var k = 0; k < curTrs.length; ++k)
				if (curTrs[k].className.indexOf("topLinkRow") != -1)
					curTrs[k].parentNode.removeChild(curTrs[k]);
			//End of removing [Top] links from divs

			document.body.appendChild(curTooltip);
			if (bTooltipShouldBeMade)
			{
				
				var timgs = curTooltip.getElementsByTagName("img");
				for (var j = 0; j < timgs.length; ++j)
					if (timgs[j].className && timgs[j].className.indexOf("de_ctrlbullet") != -1)
						timgs[j].parentNode.removeChild(timgs[j]);
						
				var ps = curTooltip.getElementsByTagName("p");
				for	(var j = 0; j < ps.length; ++j)
					if (ps[j].style.marginLeft == "50px")
						ps[j].style.marginLeft = "0px";

				var curBrowser = getBrowserType();
				if (curBrowser.indexOf("MSIE") == -1)
				{
					attachMyAttrib(apparea, "onmouseover","javascript:TooltipShow(event,\""+curid+"\");");
					attachMyAttrib(apparea, "onmouseout", "javascript:TooltipHide(\""+curid+"\");");
					attachMyAttrib(apparea, "onclick", "javascript:HideAndMove(\"" + curid + "\");");
					attachMyAttrib(document.getElementById("Tooltip_"+curid), "onmouseover", TMouseOverF(curid)); 
					attachMyAttrib(document.getElementById("Tooltip_"+curid), "onmouseout", TMouseOutF(curid)); 
					if (curBrowser.indexOf("Opera") != -1)
					{
						apparea.removeAttributeNode(apparea.getAttributeNode("href"));
						attachMyAttrib(apparea, "onclick", "javascript:HideAndMove(\"" +curid+ "\");");
						apparea.parentNode.style.cursor = 'pointer';
					}
				}
				else
				{
					apparea.attachEvent('onmouseover', Function("TooltipShow(event,\""+curid+"\")"));
					apparea.attachEvent('onmouseout', Function("TooltipHide(\""+curid+"\")"));
					apparea.attachEvent('onclick', Function("HideAndMove(\"" +curid+ "\");"));
					document.getElementById("Tooltip_"+curid).attachEvent("onmouseover", Function(TMouseOverF(curid))); 
					document.getElementById("Tooltip_"+curid).attachEvent("onmouseout", Function(TMouseOutF(curid))); 
				}
			}
		}
	}
	document.DrExplain_Make_Tooltips = "done";
	
	var app = DR_EXPLAIN;
	app.urlEncoder.doBindOpenNextPageWithEncodedStringToLinksInClonedNode();
});