var inter = {
	"window":0, //this is the d3 selection of the interphase popup menu (a <div> element)
	"svg":0,
	"subdiv":0, // the div where text is going to be displayed
}




inter.window = d3.select("body").append("div").attr("id", "iwindow")
	

inter.subdiv = inter.window.append("div")
	.attr("id","isubdiv")
	.on("click", function(){
		if (inter.window.style("opacity") == 0){
			// inter.show()
		} else {
			inter.hide()
		}
	})
	.on("mouseover",function(){ inter.subdiv.style("cursor","pointer")})

inter.svg = inter.window.append("svg").attr("width", 200).attr("height", 200)
.on("click", function(){
		if (inter.window.style("opacity") == 0){
			// inter.show()
		} else {
			inter.hide()
		}
	})
	.on("mouseover",function(){ inter.svg.style("cursor","pointer")})

inter.g1 = inter.svg.append("g").attr("transform", "translate(100,100)scale(2)")
inter.g2 = inter.svg.append("g").attr("transform", "translate(100,100)scale(2)rotate(0)")

inter.g1.append("circle").attr("r", 20).attr("cx",0).attr("cy",0)

inter.g1.append("path").attr("d", "M-8.5,11.5V12h-1h-1h-1v-0.5c0-0.276,0.224-0.5,0.5-0.5h0.5V1H-13c-0.276,0-0.5-0.224-0.5-0.5v-9c0-0.276,0.224-0.5,0.5-0.5 h3c0.276,0,0.5,0.224,0.5,0.5v0.047V1v10H-9C-8.724,11-8.5,11.224-8.5,11.5z M11.75-8c0-0.553-0.447-1-1-1h-11c-0.553,0-1,0.447-1,1c-1.381,0-2.5,1.119-2.5,2.5v13c0,1.381,1.119,2.5,2.5,2.5v1c0,0.552,0.28,1,0.625,1h1.25c0.345,0,0.625-0.448,0.625-1v-1h8v1 c0,0.552,0.28,1,0.625,1h1.25c0.345,0,0.625-0.448,0.625-1v-1c1.381,0,2.5-1.119,2.5-2.5v-13C14.25-6.881,13.131-8,11.75-8zM12.75-6c0,0.552-0.448,1-1,1h-13c-0.552,0-1-0.448-1-1s0.448-1,1-1h13C12.302-7,12.75-6.552,12.75-6z M13.25-3v6 c0,0.553-0.448,1-1,1h-14c-0.552,0-1-0.448-1-1v-6c0-0.552,0.448-1,1-1h14C12.802-4,13.25-3.552,13.25-3z M-0.5,5.562v1.312C-0.5,7.497-1.003,8-1.625,8h-0.562C-2.498,8-2.75,7.748-2.75,7.438V5.562C-2.75,5.252-2.498,5-2.188,5h1.125 C-0.751,5-0.5,5.252-0.5,5.562z M13.25,5.562v1.875C13.25,7.748,12.998,8,12.688,8h-0.562C11.503,8,11,7.497,11,6.875V5.562C11,5.252,11.251,5,11.562,5h1.125C12.998,5,13.25,5.252,13.25,5.562z")
	.style("fill", "GoldenRod")

inter.g2.append("path").attr("d", "M-14.142-14.142c-7.811,7.811-7.811,20.474,0,28.284C-10.237,18.047,0,28.284,0,28.284s10.237-10.237,14.142-14.142c7.811-7.811,7.811-20.474,0-28.284S-6.332-21.953-14.142-14.142z M12.375,12.375c-6.834,6.834-17.915,6.834-24.749,0c-6.834-6.834-6.834-17.915,0-24.749c6.834-6.834,17.915-6.834,24.749,0C19.208-5.54,19.208,5.54,12.375,12.375z")
	.style("fill", "grey ")

inter.title = inter.subdiv.style("text-align","center").style("display","block").style("vertical-align","middle").style("background-color","white").append("h1").text("Arrivals")
inter.subtitle = inter.subdiv.append("h3").text("stop name")
inter.first = inter.subdiv.append("h2").text("1 min")
inter.second = inter.subdiv.append("h2").text("1 min")

inter.hide = function(){
	inter.window.transition().style("top", (+inter.window.style("top").slice(0,-2) + 200) + "px").style("opacity",0).style("z-index",-2)
}

inter.show = function(){
	inter.window.transition().style("top", (+inter.window.style("top").slice(0,-2) - 200) + "px").style("opacity",1).style("z-index",1)
}

var leyend = {}

leyend.append = function(){
leyend.window = d3.select("body").append("div").attr("class","leyend")

leyend.svg = leyend.window.append("svg").attr("width","100%").attr("height","100%")

leyend.width = +leyend.window.style("width").slice(0,-2)
leyend.height = +leyend.window.style("height").slice(0,-2)

leyend.svg.append("rect").attr("transform","translate(0,"+(leyend.height*0.05)+")").attr("width","30%").attr("height","90%")

var gradient = leyend.svg.append("svg:defs")
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
colorscale = d3.scale.linear().domain(color.domain()).range([leyend.height,0])

coloraxis = d3.svg.axis()
	    .scale(colorscale)
	    .orient("right");

leyend.svg.append("g").attr("transform","translate("+(leyend.width*0.3)+","+(leyend.height*0.05)+")scale(0.9)")
	.attr("class", "axis")
		.call(coloraxis)

leyend.svg.select("rect").attr("fill","url(#gradient)")
}

leyend.append()

