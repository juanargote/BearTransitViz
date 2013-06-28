var inter = {}


var ControlDiv = d3.select("body").append("div").attr("id", "stopMenu").on("click", function(){d3.select(this).transition().style("top", "500px")}).attr("class","textC")

ControlDiv.append("div").style("position","absolute").style("width","100%").style("top","100px").style("left","0%").style("height","100%")
	.style("background-color","white").style("z-index",-1).style("border-radius","20px").style("border-style","solid").style("border-color","Gainsboro")

ControlDivSvg = ControlDiv.append("div")

ControlSvg = ControlDivSvg.append("svg").attr("width", 200).attr("height", 200).attr("class", "center") //.style("left", function(){ return +ControlDiv.style("left").slice(0,-2) + (+ControlDiv.style("width").slice(0,-2))/2 - 100})

ControlG = ControlSvg.append("g").attr("transform", "translate(100,100)scale(3)")
	
ControlG.append("circle").attr("r", 20).attr("cx",0).attr("cy",0).style("fill", "MidnightBlue").on("mouseover", function(){d3.select(this).style("fill", "Navy")})
	.on("mouseout", function(){d3.select(this).style("fill", "MidnightBlue")})
	.style("stroke", "Gainsboro")
	.style("stroke-width", 3)

ControlG.append("path").attr("d", "M-8.5,11.5V12h-1h-1h-1v-0.5c0-0.276,0.224-0.5,0.5-0.5h0.5V1H-13c-0.276,0-0.5-0.224-0.5-0.5v-9c0-0.276,0.224-0.5,0.5-0.5 h3c0.276,0,0.5,0.224,0.5,0.5v0.047V1v10H-9C-8.724,11-8.5,11.224-8.5,11.5z M11.75-8c0-0.553-0.447-1-1-1h-11c-0.553,0-1,0.447-1,1c-1.381,0-2.5,1.119-2.5,2.5v13c0,1.381,1.119,2.5,2.5,2.5v1c0,0.552,0.28,1,0.625,1h1.25c0.345,0,0.625-0.448,0.625-1v-1h8v1 c0,0.552,0.28,1,0.625,1h1.25c0.345,0,0.625-0.448,0.625-1v-1c1.381,0,2.5-1.119,2.5-2.5v-13C14.25-6.881,13.131-8,11.75-8zM12.75-6c0,0.552-0.448,1-1,1h-13c-0.552,0-1-0.448-1-1s0.448-1,1-1h13C12.302-7,12.75-6.552,12.75-6z M13.25-3v6 c0,0.553-0.448,1-1,1h-14c-0.552,0-1-0.448-1-1v-6c0-0.552,0.448-1,1-1h14C12.802-4,13.25-3.552,13.25-3z M-0.5,5.562v1.312C-0.5,7.497-1.003,8-1.625,8h-0.562C-2.498,8-2.75,7.748-2.75,7.438V5.562C-2.75,5.252-2.498,5-2.188,5h1.125 C-0.751,5-0.5,5.252-0.5,5.562z M13.25,5.562v1.875C13.25,7.748,12.998,8,12.688,8h-0.562C11.503,8,11,7.497,11,6.875V5.562C11,5.252,11.251,5,11.562,5h1.125C12.998,5,13.25,5.252,13.25,5.562z")
	.style("fill", "GoldenRod")

// ControlSvg.append("g").attr("transform", "translate(100,100)scale(3)rotate(0)")
// 	.append("path").attr("d", "M-14.142-14.142c-7.811,7.811-7.811,20.474,0,28.284C-10.237,18.047,0,28.284,0,28.284s10.237-10.237,14.142-14.142c7.811-7.811,7.811-20.474,0-28.284S-6.332-21.953-14.142-14.142z M12.375,12.375c-6.834,6.834-17.915,6.834-24.749,0c-6.834-6.834-6.834-17.915,0-24.749c6.834-6.834,17.915-6.834,24.749,0C19.208-5.54,19.208,5.54,12.375,12.375z")
// 	.style("fill", "white ")
// 	.style("stroke", "grey")

ControlDiv.append("text").text("hello click here for the box to go away")
ControlDiv.append("p")
ControlDiv.append("text").text("hello click here for the box to go away")
