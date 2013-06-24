// function paintRoute(canvas, box, predictions){
//   routeProjected = canvas.datum()
//   if (canvas.node().getContext) {
//     var ctx = canvas.node().getContext("2d");
//     ctx.clearRect(0, 0, canvas.node().width, canvas.node().height)
//     for (var i = 0; i < routeProjected.length - 1; i++) {
//       var lingrad = ctx.createLinearGradient(routeProjected[i][0] - box.left, routeProjected[i][1] - box.top,routeProjected[i+1][0] - box.left,routeProjected[i+1][1] - box.top);
//       lingrad.addColorStop(0, color(predictions(routeProjected[i][2])));
//       data.arrivals.forEach(function(d){
//         if (d.length > 2) {
//           if (routeProjected[i][2] <= d[0] && d[0] <= routeProjected[i+1][2]) {
//             var loc = (d[0] - routeProjected[i][2])/(routeProjected[i+1][2]-routeProjected[i][2])
//             lingrad.addColorStop(loc, color(d[1]));
//             lingrad.addColorStop(loc, color(0));
//           }
//         }
//       })
//       lingrad.addColorStop(1, color(predictions(routeProjected[i+1][2])));

//       ctx.lineWidth = 8
//       ctx.lineCap = "round"
//       ctx.lineJoin = "round"
//       ctx.strokeStyle = lingrad;
//       ctx.beginPath();
//       ctx.moveTo(routeProjected[i][0] - box.left, routeProjected[i][1] - box.top);
//       ctx.lineTo(routeProjected[i+1][0] - box.left, routeProjected[i+1][1] - box.top);
//       ctx.stroke();
//     };
//     for (var i = 0; i < routeProjected.length - 1; i++) {
//       data.arrivals.forEach(function(d){
//         if (d.length > 2) {
//           if (routeProjected[i][2] <= d[0] && d[0] <= routeProjected[i+1][2]) {
//             var loc = (d[0] - routeProjected[i][2])/(routeProjected[i+1][2]-routeProjected[i][2])
//             var locX = loc * (routeProjected[i+1][0] - routeProjected[i][0])
//             var locY = loc * (routeProjected[i+1][1] - routeProjected[i][1])
//             ctx.fillStyle = "black";
//             ctx.beginPath();
//               ctx.arc(routeProjected[i][0] - box.left + locX, routeProjected[i][1] - box.top + locY,6,0,Math.PI*2,true); // Outer circle
//               ctx.fill();
//             }
//           }
//         })
//     };
//   }
// }

// function updateData(){
//   // this script should update the data considering the current time, it doesnt rely on receiving the new prediction
//   var time = new Date()
//   var elapsed = (time.getTime() - data.time.getTime() ) / (1000 * 1)
//   data.arrivals = data.arrivals.map(function(d,i){
//     if (d.length > 2){
//       // then this is a bus, the bus moves
//       var speed = (data.arrivals[i+1][0] - d[0]) / data.arrivals[i+1][1]
//       if (speed < 0) { console.log (speed)}
//       return [d[0] + speed * elapsed, d[1], d[2] ]
//     } else {
//       // then this is a control location, it does not move
//       return [d[0], d[1] - elapsed]
//     }
//   })
//   data.pre = []
//   data.arrivals.forEach(function(d){
//     if (d.length > 2){
//       data.pre = data.pre.concat( [[d[0], d[1]], [d[0], d[2]]])
//     } else {
//       data.pre = data.pre.concat([d])
//     }
//   })

//   // I will need to fix this in the future
//   data.time = time
//   data.buses = data.arrivals.filter(function(d){ return d.length > 2}).map(function(d){return d[0]})
//   predictions = predictions.domain(data.pre.map(function(d){return d[0]})).range(data.pre.map(function(d){return d[1]}))
// }

// function updateVisual() {
//   d3.timer(function(elapsed){
//     var canvas = d3.select("#MapCanvas")
//     try {
//       updateData()
//       paintRoute(canvas, box, predictions)
//       //console.log("hello")
//     } catch(err) { console.log(err)}
//   })
// }

// //d3.keys(d3.set(predictions.domain().filter(function(d1){ return ( predictions.domain().filter(function(d2){ return d2 == d1 }).length > 1)})))

// function updatePrediction() {
  

//   var fake_data = {
//     "routeID": "01",
//     "time": new Date(),
//     "arrivals": [[0,60], [1, 60, 0], [3000, 10], [5000, 60, 0], [9718, 60]] // each pair represents a location and the time until the next arrival
//     // if there is a third value it has to be 0 and it means that is the location of one bus
//   }
//   data.time = fake_data.time

//   fake_data.arrivals.forEach(function(d){
//     if (d.length > 2){
//       data.pre = data.pre.concat( [[d[0], d[1]], [d[0], d[2]]])
//     } else {
//       data.pre = data.pre.concat([d])
//     }
//   })
//   //data.arrivals = fake_data.arrivals
//   console.log(data)
//   data.arrivals = fake_data.arrivals
//   data.buses = fake_data.arrivals.filter(function(d){ return d.length > 2}).map(function(d){return d[0]})
//   predictions = d3.scale.linear().domain(data.arrivals.map(function(d){return d[0]})).range(data.arrivals.map(function(d){return d[1]}))

//   setInterval( function(){
//     d3.json("shapes.json", function(dat){
//       //at this point the data variable should include the realtime predictions and the location of the buses 

//       //predictions = data.features[0].geometry.coordinates
//       //data = [[10,10], [4100, 20], [4100, 0], [9000, 5]]
//       //predictions.domain(data.arrivals.map(function(d){return d[0]})).range(data.arrivals.map(function(d){return d[1]}))
      
//       //buses = d3.set(predictions.domain().filter(function(d1){ return ( predictions.domain().filter(function(d2){ return d2 == d1 }).length > 1)})).values().map(function(d){return +d})
//     })
//   },5000)
// }

// // Add the div for the map
// d3.select("body").append("div").attr("id", "map")

// var color = d3.scale.linear().range(["green", "yellow", "red"]).domain([0, 30, 60])
// var box
// var predictions
// var data = {"buses":[], "arrivals":[], "pre": [], "time": "placeholder"}


// var overlay = new google.maps.OverlayView();

// // loading the route Data (I'm using the Urban Data Challenge data)
// d3.json("shapes.json", function(data){

//   // Add the container when the overlay is added to the map.
//   overlay.onAdd = function() {
//     // Add the div for the overlays
//     var layer = d3.select(this.getPanes().overlayLayer).append("div")
//         .attr("class", "stations");
    
//     // Add an SVG just in case
//     var svg = layer.append("svg").attr("id","MapSvg")

//     overlay.draw = function() {

//       // Remove the existing Canvas (resizing an existing canvas can generate errors because of the size exciding 8000px)
//       d3.selectAll("#MapCanvas").remove()

//       // Add a new canvas
//       var canvas = layer.append("canvas").attr("id","MapCanvas").style("opacity", 0.8)

//       // Get the google maps Projection
//       var projection = this.getProjection()
//       var googleMapProjection = function (coordinates) {
//         var googleCoordinates = new google.maps.LatLng(coordinates[1], coordinates[0]);
//         var pixelCoordinates = projection.fromLatLngToDivPixel(googleCoordinates);        
//         return [pixelCoordinates.x, pixelCoordinates.y].concat(coordinates.slice(2));
//       }

//       var route = data.features[0].geometry.coordinates
//       console.log(route)
//       console.log(d3.max(route.map(function(d){return d[2]})))
//       var routeProjected = route.map(googleMapProjection)
//       //predictions = route
//       // to be deleted
//       //color.domain(d3.extent(route, function(d){return d[2]}))
      
//       // creating a box large enough to contain all the points in the route
//       var extBorder = 10
//       box = { "left": d3.min(routeProjected, function(d){return d[0]}) - extBorder,
//               "top": d3.min(routeProjected, function(d){return d[1]}) - extBorder }

//       box.width = d3.max(routeProjected, function(d){return d[0]}) - box.left + extBorder 
//       box.height = d3.max(routeProjected, function(d){return d[1]}) - box.top + extBorder

//       // Making the canvas the same size as the box
//       canvas.style("left", box.left + "px")
//             .style("top", box.top + "px")
//             .style("width", box.width + "px")
//             .style("height", box.height + "px")

//       canvas.node().width = box.width
//       canvas.node().height = box.height
      
//       canvas.datum(routeProjected)
//       console.log(canvas)
//       console.log(box)
//       console.log(predictions)

//       // paint the route on the canvas
//       paintRoute(canvas, box, predictions)
//     };
//   };

//   // Bind our overlay to the map…
//   overlay.setMap(map);
// })

// d3.json("1_34.json", function(data){console.log(data)})


// updateVisual()

// updatePrediction()
