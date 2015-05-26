var sliderEffects=true;
var heightDifference=0;

var visualParams=new Object();
visualParams["slideTreshold"]=2; //this is the maximum dimension difference to stop the slide timers, if you change the divisor(the below variable) you might have to increase or decrease this value to adapt to the new divisor. Else the slide operation might never end.
visualParams["slideDivisor"]=4; //this value changes the sliding rate. The bigger the number the slower the fade. Should be larger than 1
visualParams["fadeTreshold"]=0.05; //this is the maximum opacity difference to stop the fade timers, if you change the divisor(the below variable) you might have to increase or decrease this value to adapt to the new divisor. Else the fade operation might never end.
visualParams["fadeDivisor"]=4; //this value changes the fading rate. The bigger the number the slower the fade. Should be larger than 1

/* private functions for slider */
function lockSlider(e)
{
	if (!e) e=window.event; //if IE, use window.event
	var obj=(e.srcElement)?e.srcElement:e.target;
	obj.initialPos=e.clientX;

	obj.prevSib.initialWidth=parseInt(obj.prevSib.style.width);
	obj.nextSib.initialWidth=parseInt(obj.nextSib.style.width);
	document.activeSlider=obj;
	if (sliderEffects)
		obj.className="slider_active";

	return false;
}

function unlockSlider(e)
{
	if (!e) e=window.event;
	//var obj=(e.srcElement)?e.srcElement:e.target;
	var obj=document.activeSlider;
	if (!obj)
		return true;
	if (sliderEffects)
		obj.className=(((e.srcElement)?e.srcElement:e.target)!=obj)?"slider":"slider_hover";
	obj.initialPos=false;
	
	if (obj.getAttribute("callbackFunction"))
		eval(obj.getAttribute("callbackFunction") + '(obj);');

	// Reset the event
	obj.onmousedown=lockSlider;
	
	document.activeSlider=false;
	
	//if (EsriUtils.isIE)
	//{
		document.onmousemove=moveSlider;
		document.onmouseup=unlockSlider;
	//}

	return document.activeSlider;
}

function moveSlider(e)
{
	if (!e) e=window.event;
	//var obj=(e.srcElement)?e.srcElement:e.target;
	var obj=document.activeSlider;
	if (!obj.initialPos)
		return false;
	var prevSibWidth=obj.prevSib.initialWidth + e.clientX - obj.initialPos;
	var nextSibWidth=obj.nextSib.initialWidth - e.clientX + obj.initialPos;
	if (prevSibWidth<0 || nextSibWidth<0)
		return false;
	obj.prevSib.style.width=prevSibWidth + "px";
	obj.nextSib.style.width=nextSibWidth + "px";
	obj.style.height=(Math.max(obj.prevSib.offsetHeight, obj.nextSib.offsetHeight) + heightDifference) + "px";	
	
	//if (EsriUtils.isIE)
	//{
		document.onmousemove=moveSlider;
		document.onmouseup=unlockSlider;
	//}
}

function collapseSlider(e)
{
	if (!e) e=window.event; //if IE, use window.event
	var obj=(e.srcElement)?e.srcElement:e.target;
	var totalWidth=parseInt(obj.prevSib.style.width)+parseInt(obj.nextSib.style.width);
	
	//var condition=(parseInt(obj.prevSib.style.width)>parseInt(obj.nextSib.style.width));
	//fadeNSlide((condition)?obj.prevSib:obj.nextSib, 0, -1, true, true, function(o) {setOpacity(o, 1);fadeNSlide((condition)?obj.nextSib:obj.prevSib, totalWidth, 1, true, true, function (o) {if (obj.getAttribute("callbackFunction")) eval(obj.getAttribute("callbackFunction") + '(obj);');});});
	
	if (parseInt(obj.prevSib.style.width) > 0)
		fadeNSlide(obj.prevSib, 0, -1, true, true, function(o) {setOpacity(o, 1);fadeNSlide(obj.nextSib, totalWidth, 1, true, true, function (o) {if (obj.getAttribute("callbackFunction")) eval(obj.getAttribute("callbackFunction") + '(obj);');});});
	else
		fadeNSlide(obj.prevSib, 250, 1, true, true, function(o) {setOpacity(o, 1);fadeNSlide(obj.nextSib, totalWidth - 250, -1, true, true, function (o) {if (obj.getAttribute("callbackFunction")) eval(obj.getAttribute("callbackFunction") + '(obj);');});});
}

/*
This function slides the given object (*obj*), to the given *newDimension*.
While sliding, it also changes the opacity of the *obj* in the given direction. In normal cases *opcDirection* should be positive(i.e. +1) if the *newDimension* is larger than the current height, and negative if the *newDimension* is smaller then the current height.
*init* MUST BE TRUE ALWAYS, it indicates that YOU call this function, not itself.
*callbackFunc* is called when the sliding operation finishes with passing the *obj* as its only parameter.
*/
function fadeNSlide(obj, newDimension, opcDirection, horizontalSlide, init, callbackFunc)
{
	var propertyName=(horizontalSlide)?"Width":"Height";
	
	if (obj.slideTimer) //if there is an ongoing slide
		clearTimeout(obj.slideTimer); //cancel it
		
	if (init) //if it is a start function, called by USER
	{
		obj["old" + propertyName]=(obj.style[propertyName.toLowerCase()])?parseInt(obj.style[propertyName.toLowerCase()]):obj["offset" + propertyName]; //set the old height if available forum CSS, and if not from the offsetHeight property.
		obj.slideCallback=callbackFunc; //assign the callbackFunc to object's slideCallback property
	}

	var currentDimension=(obj.style[propertyName.toLowerCase()])?parseInt(obj.style[propertyName.toLowerCase()]):obj["offset" + propertyName]; //get the current height, seperate from the above *oldHeight*. This is needed for the iteration.
  	if (Math.abs(Math.round(currentDimension-newDimension))>visualParams["slideTreshold"]) //check if the difference between the *currentDimension* and the desired height is above the the defined treshold value
	{
		obj.style[propertyName.toLowerCase()]=Math.round(currentDimension + (newDimension - currentDimension)/visualParams["slideDivisor"]) + "px"; //decrease the difference by difference/4 for a non-linear and a smooth slide
		var opacity=(parseInt(obj.style[propertyName.toLowerCase()])-obj["old" + propertyName])/(newDimension-obj["old" + propertyName]); //calculate the opacity by getting the ratio of the *currentDimension* and the desired height
		if (opcDirection<0) //if direction is negative, substitute the opacity from 1, since 1 is the maximum opacity
			opacity=1-opacity;
		setOpacity(obj, opacity); //set the calculated opacity
		obj.slideTimer=setTimeout("fadeNSlide(document.getElementById('" + obj.id + "'), " + newDimension + ", " + opcDirection + ", " + horizontalSlide + ");", 25); //set new instance, which will be called after 25ms
	}
	else //if the difference is below the defined threshold, time to stop :)
	{
		obj.style[propertyName.toLowerCase()]=newDimension + "px"; //set the height to the desired height for an exact match
		setOpacity(obj, (newDimension<obj["old" + propertyName])?0:1); //set opacity
		if (obj.slideCallback) obj.slideCallback(obj); //call the callbackFunc if it is defined
	}
	if (window.onscroll)
		window.onscroll(); //there might be a scroll change so if a function is assigned to window.onscroll, call it.
}

function setOpacity(obj, opacity)
{
	if (document.all) //if IE
		obj.style.filter="alpha(opacity=" + opacity*100 + ")"; //use filter-alpha
	else //if not IE
		obj.style.opacity=opacity; //use CSS opacity
}


/* end of private functions for sliders */

function initSliders()
{
	sliderEffects=sliderEffects && (getCSSRule(".slider_hover") && getCSSRule(".slider_active"));
	var divElements=document.getElementsByTagName("div");
	for (var i=0; i<divElements.length; i++)
		if (divElements[i].className=="slider")
		{
			divElements[i].onmousedown=lockSlider;
			//divElements[i].ondblclick=collapseSlider;			
			divElements[i].onmouseup=unlockSlider;
			divElements[i].onmousemove=moveSlider;
			divElements[i].ondragstart=
			divElements[i].onselectstart=function() {return false};
			//REAL previous sibling determination
			divElements[i].prevSib=divElements[i].previousSibling;
			while (divElements[i].prevSib.nodeName!="DIV")
				divElements[i].prevSib=divElements[i].prevSib.previousSibling;
			//determined and assigned the REAL previous sibling object to objects prevSib property
			//REAL next sibling determination
			divElements[i].nextSib=divElements[i].nextSibling;
			while (divElements[i].nextSib.nodeName!="DIV")
				divElements[i].nextSib=divElements[i].nextSib.nextSibling;
			//determined and assigned the REAL next sibling object to objects nextSib property
			if (sliderEffects)
			{			
				divElements[i].onmouseover=function() {if(!this.initialPos)this.className="slider_hover"};
				divElements[i].onmouseout=function() {if(!this.initialPos)this.className="slider"};
			}
			
			divElements[i].style.height=Math.max(divElements[i].prevSib.offsetHeight, divElements[i].nextSib.offsetHeight) + "px";
			heightDifference=parseInt(divElements[i].style.height) - divElements[i].offsetHeight;
		}
	document.activeSlider=false;
	//if (EsriUtils.isIE)
	//{
		document.onmousemove=moveSlider;
		document.onmouseup=unlockSlider;
	//}
	document.onselectstart=function() {return !document.activeSlider};
	document.ondragstart=document.onselectstart;
}

/** external code begins **/
function getCSSRule(ruleName, deleteFlag) {
	if (document.styleSheets)
	{
		for (var i=0; i<document.styleSheets.length; i++)
		{
			var styleSheet=document.styleSheets[i];
			var ii=0;
			var cssRule=false;
			do
			{
				if (styleSheet.cssRules)
					cssRule = styleSheet.cssRules[ii];
				else
					cssRule = styleSheet.rules[ii];
				if (cssRule)
				{
					if (cssRule.selectorText==ruleName)
					{
						if (deleteFlag=='delete')
						{
							if (styleSheet.cssRules)
								styleSheet.deleteRule(ii);
							else
								styleSheet.removeRule(ii);
							return true;
						}
						else
							return cssRule;
					}
				}
				ii++;
			}
			while (cssRule)
		}
	}
	return false;
}
/** external code ends **/
