
var shape
var color = d3.scale.linear().range(["gold", "navy"]).domain([0, 1.5*60])
var predictions = d3.scale.linear()
var buses = {}
var stops = {}
var stopBisect = d3.scale.linear()
// Catchment Areas Variables
var walkingSpeed = 4 / Math.sqrt(2) //[km/hr]
var catchmentStopId = null
var lastUpdate
var r1 = null
var center
var catch1 = new google.maps.Circle()
var catch1Options = {fillColor:'gray',
                      fillOpacity:0.5,
                      strokeColor:"black",
                      strokeOpacity:1,
                      strokeWeight:2}

function initializeFirebase() {
  var f = new Firebase("https://beartransitviz.firebaseio.com/bear-transit/raw_location");
  var fStops = new Firebase("https://beartransitviz.firebaseio.com/bear-transit/stops_prediction");
  d3.timer(function(){ // makes sure the div has been created, otherwise we would not be able to plot anything
    if (!d3.select("#Overlay").empty()) {

      f.once("value", function(s) { // downloads the list of buses, updates the list of buses, creates an svg for each bus (calls the add circle) and deletes any bus svg that already exists


        buses = s.val()
        console.log(s.val())
        console.log(d3.entries(buses).filter(function(d,i,a) {return d.value.pm != undefined}))
        var d3buses = d3.select("#OverlaySvg").selectAll(".buses").data(d3.entries(buses).filter(function(d,i,a) {return d.value.pm != undefined}))
        
        d3buses.enter().append("svg")
          .attr("class","buses")
          .attr("id", function(d){return d.key})
          
        d3buses.exit().remove()

        d3.json("P.json",function(data){
          pre.links = data.features[0].geometry.coordinates.map(function(link){ return link[2]})
          data.features.forEach(function(s){ // for each shape
            shape = s
            // predictions.domain(shape.geometry.coordinates.map(function(d){return d[2]}))
            //   .range(shape.geometry.coordinates.map(function(d,i){return i}))
            //paintRoute(shape)

            console.log(d3buses)
            d3buses.each(addBus)
              .each(function(d){ relocate(this, pmTOlonlat(d.value.pm, shape) )}) //[d.value.lon, d.value.lat]

            
          })
        })
        d3.json("P_Stops.json", function(data){ // eventually this data will come from the firebase


        d3.select("#OverlaySvg").selectAll(".stops").data(data.features).enter()
          .append("svg")
          .attr("class","stops")
          .attr("id",function(d,i){return "STOP"+i})
          .each(addStop)
          .each(function(d){ relocate(this, d.geometry.coordinates)})
          .on("click",selectStop)
        })
      });
      
      f.on("child_changed", function(s) {

      });

      f.on("child_removed", function(s) {
        var d3buses = d3.select("#OverlaySvg").selectAll(".buses").data(d3.entries(buses))
        d3buses.exit().remove()
      });

      fStops.once("value",function(s){
        stops = s.val()
        console.log(stops)
        
      var coordinates = d3.entries(stops).map(function(d){ return d.value.pm})
        console.log(coordinates)
        
        // for (var stop in stops) {
        //   stop.arrivals = [1,10,30]
        // } 
        
      })

      fStops.on("child_changed", function(s){
        stops[s.name()] = s.val()
        //console.log(stops)
      })

      return true
    }
  })  
}

function relocate(svg, array) {
  var xy = overlay.projection(array)
  d3.select(svg)
    .style("left",(xy[0] - d3.select(svg).style("width").slice(0,-2)/2) + "px")
    .style("top",(xy[1] - d3.select(svg).style("height").slice(0,-2)/2) + "px")
}

function locateBuses(){
  pre.buses.forEach(function(s){
    try{
      d3.select("#" + s.id).each(function(d){ relocate(this, pmTOlonlat(s.pm, shape))})
    } catch (error) {
      console.log(error)
    }
  })
}

function eraseCatchmentAreas(){
  catch1.setMap(null)
}

function setCatchmentAreas(){

  try{    
          var now = new Date().getTime()/1000
          var arrivals = pre.stops.filter(function(d){return d.id == catchmentStopId})[0].arrivals
          var ts = pre.stops.filter(function(d){return d.id == catchmentStopId})[0].ts
          r1 = Math.max(10,1000*((arrivals[0] + ts - now)/3600)*walkingSpeed)
          catch1.setRadius(r1)
          catch1.setOptions(catch1Options)
          catch1.setCenter(center)
          catch1.setMap(map)
        } catch (err) {
          console.log('index not found')
        }  
}

function addStop(d) { // adds a circle (if there is not one there already) and resizes the svg so that the circle is in the center
  var radius = 7.5
  var border = 4
  var d3Stops = d3.select(this)

  d3Stops.selectAll("circle").data([d]).enter().append("circle").attr("r", radius)
    .attr("cx",(radius+border))
    .attr("cy",(radius+border))
    .on("click", function(d){
      center = new google.maps.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0])
      map.panTo(center)
      console.log(d)
      if (catchmentStopId == null || catchmentStopId != d.properties.stop_id){
        catchmentStopId = d.properties.stop_id
        setCatchmentAreas()
      } else {
        catchmentStopId = null
        eraseCatchmentAreas()
      }
      
    })
    .on("mouseover", function(){
      d3.select(this).style("fill", "red").style("cursor","pointer")
    })
    .on("mouseout", function(){
      d3.select(this).style("fill", "navy")
    })

  d3.select(this)
    .style("width",(2*(radius + border)) + "px")
    .style("height",(2*(radius + border)) + "px")

  d3Stops.selectAll(".stops circle").style("fill","navy").style("stroke-width", border).style("stroke", "whitesmoke")
}

function selectStop(d) {
  var d3Stops = d3.select(this)

  //d3Stops.select("circle").style("fill","green")
}

function addBus(d) { // adds a circle (if there is not one there already) and resizes the svg so that the circle is in the center
  var radius = 10
  var border = 5
  var d3buses = d3.select(this)

  d3buses.append("circle").attr("r", radius)
    .attr("cx",(radius+border))
    .attr("cy",(radius+border))
    
  var xy = overlay.projection([d.value.lon, d.value.lat])

  d3.select(this)
    .style("width",(2*(radius + border)) + "px")
    .style("height",(2*(radius + border)) + "px")

  d3buses.selectAll(".buses circle").style("fill","gold").style("stroke-width", border).style("stroke", "navy")
}

function pmTOlonlat(pm, shape){
  //console.log(shape)
  if (pm == undefined){
    pm = 0
  }

  var coor = shape.geometry.coordinates
  var latScale = d3.scale.linear().domain(coor.map(function(d){return d[2]})).range(coor.map(function(d){return d[1]}))
  var lonScale = d3.scale.linear().domain(coor.map(function(d){return d[2]})).range(coor.map(function(d){return d[0]}))
        
  return [lonScale(pm), latScale(pm)]
}

function paintRoute(shape){
  // I need to check if is the correct shape
      var extBorder = 6
      var projectedCoordinates = shape.geometry.coordinates.map(function(d){return overlay.projection(d)}) 
      d3.selectAll(".links").remove()
      shape.geometry.coordinates.forEach(function(d,i,a){
        
        if (i + 1  < a.length) {
          var projectedLink = [projectedCoordinates[i], projectedCoordinates[i+1]]

          var canvas = d3.select("#OverlayCanvas").append("canvas").attr("class","links").attr("id","LINK"+i)
          var box = {
            "left": d3.min([projectedCoordinates[i][0], projectedCoordinates[i+1][0]]) - extBorder,
            "top": d3.min([projectedCoordinates[i][1], projectedCoordinates[i+1][1]]) - extBorder
          }
          box.width = d3.max([projectedCoordinates[i][0], projectedCoordinates[i+1][0]]) - box.left + extBorder 
          box.height = d3.max([projectedCoordinates[i][1], projectedCoordinates[i+1][1]]) - box.top + extBorder
          
          canvas.style("left", box.left + "px")
            .style("top", box.top + "px")
            .style("width", box.width + "px")
            .style("height", box.height + "px")

          canvas.node().width = box.width
          canvas.node().height = box.height
          
          canvas.datum(projectedLink.map(function(d){
            return [d[0] - box.left, d[1]- box.top ].concat(d.slice(2))
          }))

          paintLink(canvas)
        }
      })
}

function paintLink(canvas){
  // var BUSES = pre.buses.map(function(bus){
  //   var b = bus.pm
  //   if (b < pre.stops[0] ) {b = b - pre.links.slice(-1)[0]}
  //     return b
  // })

  if (canvas.node().getContext) {
    var projectedLink = canvas.datum()
    var ctx = canvas.node().getContext("2d");
    var lingrad = ctx.createLinearGradient(projectedLink[0][0], projectedLink[0][1],projectedLink[1][0],projectedLink[1][1]);
    var linkLength = projectedLink[1][2]-projectedLink[0][2]

    // projectedLink.forEach(function(d){
    //   if (d[2] < pre.stops[0].pm){
    //     d[2] = d[2] + pre.links.slice(-1)[0]
    //   }
    // })
    // projectedLink.forEach(function(d){
    //   if (pre.stops[0].pm <= d[2] && d[2] <= pre.links.slice(-1)[0]+pre.stops[0].pm){} else {console.log("WFT")}
    // })
    pre.events.filter(function(d){return d.type == "bus"}).forEach(function(bus){
      if (projectedLink[0][2] <= bus.pm && bus.pm <= projectedLink[1][2]) {
        var loc = (bus.pm - projectedLink[0][2])/linkLength
        if (0 <= loc && loc <= 1) {
          var c1 = predictions(bus.pm - 0.001)
          if (!isNaN(c1)){lingrad.addColorStop(loc, color(c1))}
          var c2 = predictions(bus.pm + 0.001)
          if (!isNaN(c2)){lingrad.addColorStop(loc, color(c2))}
        } else {
          console.log(bus)
        }
      }
    })
    // pre.buses.forEach(function(bus){
    //   if (projectedLink[0][2] <= bus.pm && bus.pm <= projectedLink[1][2]) {
    //     if (pre.stops[0].pm <= bus.pm && bus.pm <= pre.links.slice(-1)[0]+pre.stops[0].pm){ console.log(bus.pm)} else {console.log("WFT")}
    //     var loc = (bus.pm - projectedLink[0][2])/linkLength
    //     if (0 <= loc && loc <= 1) {
    //       var c1 = predictions(bus.pm - 0.001)
    //       if (!isNaN(c1)){lingrad.addColorStop(loc, color(c1))}
    //       var c2 = predictions(bus.pm + 0.001)
    //       if (!isNaN(c2)){lingrad.addColorStop(loc, color(c2))}
    //     } else {
    //       console.log(bus)
    //     }
    //   }
    // })
    
    // BUSES.forEach(function(bus){
    //   if (projectedLink[0][2] <= bus && bus <= projectedLink[1][2]) {
    //     if (pre.links.slice(-1)[0]<= bus && bus <= pre.stops[0].pm + pre.links.slice(-1)[0]){ console.log(bus, pre.events, pre.buses)} else {}
    //     var loc = (bus - projectedLink[0][2])/linkLength
    //     if (0 <= loc && loc <= 1) {
    //       var c1 = predictions(bus - 0.001)
    //       if (!isNaN(c1)){lingrad.addColorStop(loc, color(c1))}
    //       var c2 = predictions(bus + 0.001)
    //       if (!isNaN(c2)){lingrad.addColorStop(loc, color(c2))}
    //     } else {
    //       console.log(bus)
    //     }
    //   }
    // })

    var c1 = (predictions(projectedLink[0][2]))
    var c2 = (predictions(projectedLink[1][2]))

    if (!isNaN(c1)){lingrad.addColorStop(0, color(c1))} else {lingrad.addColorStop(0, "black")}
    if (!isNaN(c2)){lingrad.addColorStop(1, color(c2)); } else {lingrad.addColorStop(0, "black")}

    ctx.lineWidth = 5
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = lingrad;
    ctx.beginPath();
    ctx.moveTo(projectedLink[0][0], projectedLink[0][1]);
    ctx.lineTo(projectedLink[1][0], projectedLink[1][1]);
    ctx.stroke();
  }
}