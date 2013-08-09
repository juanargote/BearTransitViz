var icons

d3.json("icons.json", function(data){
	// loads the lineart for the icons
	icons = data
})

function loadIcon(){
	var item = d3.select(this)
	var icon = d3.select(this).attr("class")
	d3.timer(function(){
		if (icons != undefined){
			if (icons[icon] != undefined){
				item.attr("d",icons[icon])
				return true
			}
		}
	})
}

// the interphase consists of:
	// the menu that pops up with the information about the selected stop
	// the legend that shows the colorscale

var inter = {
	"svg":0,
	"subdiv":0, // the div where text is going to be displayed
}

// MENU

inter.menu = d3.select("#menu div") // initial position of the menu
	.style("opacity",0)
	.style("z-index",0)
	.style("top","300px")

d3.selectAll("#menu *") // defines the click for all childen of the element #menu 
	.on("click", function(){
		if (inter.menu.style("opacity") != 0){
			inter.hideMenu()
		}
	})
	.on("mouseover",function(){ inter.menu.style("cursor","pointer")})

inter.hideMenu = function(){ 
	if (inter.menu.style("z-index") != 0) {
		inter.menu.transition().style("top", "300px").style("opacity",0).style("z-index",0)
	}
}

inter.showMenu = function(){
	if (inter.menu.style("z-index") == 0) {
		inter.menu.transition().style("top", "0px").style("opacity",1).style("z-index",1)
	}
}

inter.menuSVG = inter.menu.append("svg") // creates the svg
	.style("position","absolute")
	.style("left",-50)
	.style("top",-50)

inter.menuSVG.append("g").attr("transform", "translate(50,50)scale(2)") // creates a group to place some icons
	.call(function(sel){
		sel.append("circle")
		.attr("r", 20)
		.attr("cx",0)
		.attr("cy",0)
	})
	.call(function(sel){
		sel.append("path")
		.attr("class","BusStop")
		.each(loadIcon)
	})
	
inter.menuSVG.append("g").attr("transform", "translate(50,50)scale(2)rotate(270)") // creates a group to place some icons
	.append("path")
	.attr("class","BusStopDirection")
	.each(loadIcon)

inter.title = inter.menu.append("h1").text("Arrivals")
inter.subtitle = inter.menu.append("h3").text("stop name")
inter.first = inter.menu.append("h2").text("1 min")
inter.second = inter.menu.append("h2").text("1 min")

inter.hide = inter.hideMenu
inter.show = inter.showMenu

// LEGEND

var legend = {}

legend.append = function(){
legend.window =  d3.select("#legend")

legend.svg =  d3.select("#legend svg")

legend.width = +legend.window.style("width").slice(0,-2)
legend.height = +legend.window.style("height").slice(0,-2)

legend.background = legend.svg.append("rect").attr("width","100%").attr("height","100%").style("fill","white")

legend.rect = legend.svg.append("rect").attr("transform","translate("+(legend.width*0.3)+","+(legend.height*0.05)+")").attr("width","20%").attr("height","90%")

var gradient = legend.svg.append("svg:defs")
  .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "90%")
    .attr("x2", "0%")
    .attr("y2", "10%")

color.domain().forEach(function(d,i){
var ext = d3.extent(color.domain())
var col = color.range()[i]

gradient.append("svg:stop")
    .attr("offset", function(){return ((d - ext[0])/(ext[1]-ext[0])*100) + "%" })
    .attr("stop-color", col)
    .attr("stop-opacity", 1);

})
colorscale = d3.scale.linear().domain([d3.min(color.domain().map(function(d){return d/60})), d3.max(color.domain().map(function(d){return d/60}))])
	.range([legend.height,0])

coloraxis = d3.svg.axis()
	    .scale(colorscale)
	    .orient("right")
	    .ticks(4);

legend.svg.append("g").attr("transform","translate("+(legend.width*0.5)+","+(legend.height*0.05)+")scale(0.9)")
	.attr("class", "axis")
	.call(coloraxis)
	.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -legend.width*0.2)
		.attr("x", -legend.height/2)
		.attr("dy", "-.50em")
		.attr("font-size", "100%")
		.style("text-anchor", "middle")
		.text("Time until the next arrival (min)")

legend.rect.attr("fill","url(#gradient)")
}

legend.append()

