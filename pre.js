var pre = {
  "busData": {}
}

//initialize firebase
var fbuses = new Firebase("https://beartransitviz.firebaseio.com/bear-transit/raw_location");  
var fstops = new Firebase("https://beartransitviz.firebaseio.com/bear-transit/stops_prediction");
var busesPRE
var stopsPRE



fbuses.once("value", function(s){
  busesPRE = s.val()
  pre.buses = d3.entries(busesPRE).filter(function(bus){return bus.value.pm != undefined}).map(function(bus){ bus.value.id = bus.key; return bus.value})
})

fstops.once("value", function(s){
  stopsPRE = s.val()
  pre.stops = stopsPRE.filter(function(stop){return stop.pm != undefined})

})

fbuses.on("child_changed", function(s) {
  busesPRE[s.name()] = s.val()
  pre.buses.forEach(function(bus){
    if (bus.id == s.name()) {
      bus.ts = s.val().ts
      bus.pm = s.val().pm
    }
  })
})

fstops.on("child_changed", function(s) {
  stopsPRE[s.name()] = s.val()
  pre.stops = stopsPRE.filter(function(stop){return stop.pm != undefined})
})





pre.lastStop = function(pm){ //postmile of the bus
      var STOPS = pre.stops.sort(function(a,b){return a.pm - b.pm})
      var i
      
      for (i = 0; i < STOPS.length; i++) {
        if (STOPS[i].pm > pm) {
          return i-1
        }
      }
      if (pre.links.slice(-1)[0] < pm && pm < STOPS[0].pm + pre.links.slice(-1)[0]) {
        return STOPS.length - 1
      }
      return STOPS.length - 1 // returns index of the last stop NOT ID
    }

pre.nextStop = function(index){ // index of the last stop
  var STOPS = pre.stops.map(function(a){return a})
  var i = STOPS.shift()
  STOPS.push(i)
  return STOPS[index] // returns element for the stop
}

pre.prevStop = function(index){ // index of the last stop
  var STOPS = pre.stops.map(function(a){return a})
  var i = STOPS.pop()
  STOPS.unshift(i)
  return STOPS[index] // returns element for the stop
}

pre.process = function(){
  pre.stops = pre.stops.filter(function(d){return d.id!="loop"})
  //pre.stops.push({"id":"loop", "pm": pre.links.slice(-1)[0]+ pre.stops[0].pm, "ts":pre.stops[0].ts, "arrivals": pre.stops[0].arrivals.map(function(d){return d}) })
  // pre.buses = pre.buses.filter(function(d){return d.id!="loop"})
  // pre.buses.forEach(function(bus){
  //  pre.buses.push({
  //   "id":"loop",
  //   "pm": bus.pm 
  //  }) 
  // })
  //pre.stops.push({"id":"loop", "pm": pre.links.slice(-1)[0]+ pre.stops[0].pm, "ts":pre.stops[0].ts, "arrivals": pre.stops[0].arrivals.map(function(d){return d}) })
  pre.buses = pre.buses.map(function(bus){
    if (bus.pm < pre.stops[0].pm) {
      console.log("why????")
      bus.pm = bus.pm + pre.links.slice(-1)[0]
    }
    return bus
  })
  pre.buses.forEach(function(bus){
    if (bus.pm < pre.stops[0].pm) { 
        bus.pm = bus.pm + pre.links.slice(-1)[0]
      } 
  })


  var time = new Date().getTime()
  pre.buses.forEach(function(bus){

    var i = pre.lastStop(bus.pm)
    var last = pre.stops[i]
    var next = pre.nextStop(i)
    bus.last = last
    // if the bus is too close to a stop it should ignore it
    try {
      var interpolate

      // if (Math.abs(bus.pm - next.pm) < 0) {
      //   console.log("bus approaching")
      //   if (bus.speed == undefined) {
      //     console.log("no speed")
      //     bus.speed = 15/3600
      //   }
      //   interpolate = function(a){
      //     return bus.next + (time - bus.ts)/1000
      //   }
      // } else {
        
      // }
      var dis
      if (i == pre.stops.length - 1) {
        dis = (pre.links.slice(-1)[0] - bus.pm)
        
        nextpm = pre.links.slice(-1)[0]
      }else {
        dis = (next.pm - bus.pm)
        nextpm = next.pm
      }

      if (dis > 0.08) {
        bus.speed = dis / next.arrivals[0]
      } else {
        if (bus.speed == undefined) {bus.speed = 15/3600}
      }


      bus.next = time/1000 + 120
      if (bus.pm == undefined) {console.log("WTF")}
      bus.pm = bus.pm + (time -bus.ts)/1000 * bus.speed
      if (bus.pm > pre.links.slice(-1)[0] + pre.stops[0].pm) { 
        bus.pm = bus.pm - pre.links.slice(-1)[0]
      } 


      //console.log(pre.links)
      //if (bus.pm > pre.links.slice(-1)[0]){ bus.pm = bus.pm - pre.links.slice(-1)[0]}
      bus.ts = time
      i = pre.lastStop(bus.pm)
      bus.last = pre.stops[i]
      
      if (last.arrivals[0] + last.ts > time/1000 && last.pm < bus.pm) {
        //console.log([last, next])
      interpolate = d3.scale.linear().domain([last.pm, nextpm]).range([last.arrivals[0] + last.ts, next.arrivals[1] + next.ts])
      bus.next = interpolate(bus.pm)
      } else {
        last.arrivals.shift()
        //console.log([last, next])
      }


    } catch (err) {}
  })
}

pre.predictions = function(){
  pre.buses = pre.buses.map(function(bus){
    if (bus.pm < pre.stops[0].pm) {
      console.log("why????")
      bus.pm = bus.pm + pre.links.slice(-1)[0]
    }
    return bus
  })

  var time = new Date().getTime()
  pre.events = []
  pre.buses.forEach(function(d){
      if (d.pm < pre.stops[0].pm){console.log("error")}
      if (isNaN(d.pm) || isNaN(d.next) || isNaN(d.ts) ) { console.log(d)}
      if (d.next == undefined) {console.log(d)}
      pre.events.push({"pm":d.pm,"time":d.next, "type" : "bus"})
      pre.events.push({"pm":d.pm,"time":d.ts/1000, "type" : "bus"})
  })

  pre.stops.forEach(function(stop,index,array){
    var next = pre.nextStop(index)
    var last = pre.prevStop(index)
    if (stop.arrivals[0] + stop.ts < last.arrivals[0] + last.ts){
      var test = false // test wether to check if the datapoint makes sense
      pre.buses.forEach(function(bus){
        if (bus.last == undefined) {console.log(stop, bus); s=true}
        if (last.pm == bus.last.pm ) { test = true}
      })
      if (!test) { stop.arrivals.shift() } 
    } 
    if (!isNaN(stop.arrivals[0] + stop.ts)) {
      pre.events.push({"pm":stop.pm, "time": stop.arrivals[0] + stop.ts, "type" : "stop"})
    } else {console.log(stop)}  
  })

  pre.events.push({
    "pm": pre.stops[0].pm + pre.links.slice(-1)[0],
    "time": pre.stops[0].arrivals[0] + pre.stops[0].ts,
    "type":"stop"
  })

  pre.events.sort(function(a,b){
    if (a.pm == b.pm) { return b.time - a.time} else {
    return a.pm - b.pm}
  })

  // var events = pre.events.filter(function(event){return event.pm >= pre.links.slice(-1)[0]}).map(function(e){
  //   var pm = e.pm - pre.links.slice(-1)[0]; 
  //   var time = e.time
  //   var type = e.type
  //   return {"pm":pm, "time":time, "type": type}
  // })
  // pre.events = events.concat(pre.events)
  //console.log(d3.min(pre.events.map(function(d){return d.pm})))
  pre.events.forEach(function(d,i,a){
    var n = i+1
    if (n == a.length) { n = 0}
    if (d > a[n] && a[n].type != "bus" && d.type != "bus") {console.log("WTF")}

  })
  
  
  pre.events.forEach(function(d){
    if (isNaN(d.pm) || isNaN(d.time) ) { console.log(d)}
  })

  

  pre.predict = d3.scale.linear().domain(pre.events.map(function(e){return e.pm})).range(pre.events.map(function(e){return e.time}))
}
