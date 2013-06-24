var preData = []
var preBus = []
// setInterval(function(){
// 	predictArrivals()

// 	//console.log(buses, stops)


// },1000)

function predictArrivals(){
	// Validating the data
	var horribleData = false
	preData = stops.filter(function(d,i){ return (d.pm != undefined && d.arrivals != undefined)}).sort(function(a,b){return a.pm - b.pm})

	var time = new Date().getTime()/1000

	preData.forEach(function(d,i,a){
		d.arrivals = d.arrivals.map(function(arrival){
			return arrival - (time - d.ts)
		}).filter(function(arrival){
			var test = (arrival > 0)
			//if (!test) { console.log("predictions gone bad")}
			return test
		})
	})

	preBuses = d3.entries(buses).filter(function(d){return (d.value.pm != undefined)}).map(function(d){return d.value.pm})

	preData.forEach(function(d,i,a){
		if (i+1 < a.length) {
			if (d.arrivals[0] > a[i+1].arrivals[0]) {
				var test = false
				preBuses.forEach(function(bus){
					if (d.pm <= bus && bus <= a[i+1].pm) { test = true}
				})
				if (!test) { horribleData = true}
			}
		} else {
			if (d.arrivals[0] > a[0].arrivals[0]) {
				var test = false
				preBuses.forEach(function(bus){
					if (d.pm <= bus && bus <= a[0].pm) { test = true}
				})
				if (!test) { horribleData = true}
			}
		}
	})
	//console.log(preData)
	if (!horribleData) {
		preData = d3.values(preData)
		var preStop = d3.scale.linear().domain(preData.map(function(d){return d.pm}))
			.range(preData.map(function(d,i){return i}))

		function nextStop(pm){
			var previous = Math.floor(preStop(pm))
			if (previous == preData.length -1) {
				return 0
			} else {
				return previous + 1
			}
		}

		preBuses = preBuses.map(function(Bpm){
			var pStop = Math.floor(preStop(Bpm))
			var nStop = nextStop(Bpm)

			var headway = d3.scale.linear()

			

	
			if (preData[nStop].arrivals[1] != undefined) {
				if (nStop == 0) {
					headway.domain([preData[pStop].pm, preData[pStop].pm + preData[nStop].pm])
				} else {
					headway.domain([preData[pStop].pm, preData[nStop].pm])
				}
				headway.range([preData[pStop].arrivals[0], preData[nStop].arrivals[1]])
			} else {
				if (pStop == 0) {
					pStop = preData.length - 1
				} else {
					pStop = pStop -1
				}
				if (nStop == 0) {
					nStop = preData.length - 1
				} else {
					nStop = nStop -1
				}
				if (nStop == 0) {
					headway.domain([preData[pStop].pm, preData[pStop].pm + preData[nStop].pm])
				} else {
					headway.domain([preData[pStop].pm, preData[nStop].pm])
				} 
				headway.range([preData[pStop].arrivals[0], preData[nStop].arrivals[1]])
			}

			
			console.log(headway.range())
			return [Bpm, headway(Bpm)],[Bpm, 0]
		})

		//console.log(preBuses)
	} else {
		//console.log("bad Data")
	}

	
	//console.log(time)
	preData = []

	stops.forEach(function(stop){
		//console.log(stop)
		if (stop.arrivals != undefined){
			var arrivals = stop.arrivals.map(function(arrival){
				return arrival - (time - stop.ts)
			})

			arrivals.filter(function(arrival){ return (arrival >= 0)})


			if (arrivals== undefined) { 
				console.log("wtf")
				arrivals = [-1]}
			preData = preData.concat([[stop.pm, arrivals]])
			//stop.arrivals = stop.arrivals.filter(function(d){ return (d >= 0)})
		}
	})
	var preBuses = []
	

	preData.sort(function(a,b){return a-b})
	stopBisect.domain(preData.map(function(d){return d[0]})).range(preData.map(function(d,i){return i}))
        
	d3.entries(buses).forEach(function(bus){


		if (bus.value.pm != undefined) {
			//console.log(bus)
			//console.log(bus.value.pm)
			var previousStop = Math.max(Math.floor(stopBisect(bus.value.pm)),0)
			//console.log(previousStop)
			var line = d3.scale.linear()
			if (previousStop + 1 < preData.length ) {
				line.domain([preData[previousStop][0], preData[previousStop+1][0] ])
				line.range([preData[previousStop][1][0], preData[previousStop+1][1][1]])
			} else {
				line.domain([preData[previousStop][0], preData[previousStop][0] + preData[0][0] ])
				line.range([preData[previousStop][1][0], preData[0][1][1]])
			}

			//console.log(preData[previousStop][1][0], line(bus.value.pm), preData[previousStop+1][1][0])
			preBuses = preBuses.concat([[bus.value.pm, [line(bus.value.pm)]], [bus.value.pm, [0]]])
			// if (preData[previousStop][0] <= bus.value.pm && bus.value.pm <= preData[previousStop+1][0] ) {

			// } else {
			// 	console.log("WTF")
			// }
		}

		
	})
	//console.log(preBuses)
	preData = preData.concat(preBuses)
	preData = preData.map(function(d){return [d[0], d[1][0]]})
	preData.sort(function(a,b){return a[0]-b[0]})

	preData.forEach(function(d,i,a){
		if (i+1 < a.length) {
		if (d[0] > a[i+1][0] ) {console.log("sort Sucks")}
		//if (d[1] > a[i+1][1] && a[i+1][1] != 0) { console.log("WFT")}
		}
	})

	
	//console.log(preData)
	predictions.range(preData.map(function(d){return d[1]})).domain(preData.map(function(d){return d[0]}))
	//paintRoute(shape)
}