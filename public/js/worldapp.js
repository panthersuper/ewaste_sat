Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

var curvePath = function(lst) {
	//a list of points
	var R = 500;

	var newlst = []
	for (var i = 0; i < lst.length - 1; i++) {
		var pt1 = [lst[i].x, lst[i].y];
		var pt2 = [lst[i + 1].x, lst[i + 1].y];

		var dist = distance(pt1, pt2);

		var totalY = (pt1[1] + pt2[1]) / 2;
		var disY = R - Math.sqrt(R * R - (dist / 2) * (dist / 2));

		var zeroY = map.project([-70, 33.928033]).y;
		if (totalY < zeroY) disY = -disY;

		newlst.push(lst[i]);

		if (dist > 10) {

			var newx = (pt1[0] + pt2[0]) / 2;
			var newy = (pt1[1] + pt2[1]) / 2 + disY;


			var newpt = {
				"x": newx,
				"y": newy
			};


			newlst.push(newpt);

		}



	}

	newlst.push(lst[lst.length - 1]);
	return newlst;


}

function Dis_w(lst) {
  //calculate the travel distanse from the beginning to the current note
  var mydis = 0;
  for (var i = 0; i < lst.length - 1; i++) {

    mydis += getDistanceFromLatLonInKm(lst[i][0], lst[i][1], lst[i + 1][0], lst[i + 1][1]);
  }


  mydis = Math.round(mydis * 10) / 10;

  return mydis;
}

function allDays_w(Num) {
  //calculate the days taveled 
  var place = getNode(places_multi, Num);
  var length = Object.size(place);

  var firstDate = getNode(place,0)[2];
  var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  var secondDate = getNode(place,length-1)[2];

  var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));

  return diffDays;
}

var places_multi = {};
var route_multi = {};
var lineFunction = d3.svg.line()
	.x(function(d) {
		return d.x;
	})
	.y(function(d) {
		return d.y;
	})
	.interpolate("linear");


d3.tsv("new_monitor_sim.tsv", function(error, data) {
	var num = data.length;
	for (var i = 0; i < num; i++) {
		places_multi[data[i]["deviceID"]] = {};
	};

	for (var i = 0; i < num; i++) {
		var date = getDate(data[i]["timestamp"]);
		var title = data[i]["title"];
		var video = data[i]["video"];
		var story = data[i]["story"];
		var media = data[i]["media"];

		var lat = +data[i]["latitude"],
			lng = +data[i]["longitude"];

		places_multi[data[i]["deviceID"]][data[i]["sequence"]] = [lng, lat, date, title, story, media];
	};

	for (k in places_multi) { //clean the place list, get rid of redundant points
		cleanLst(places_multi[k], 0.3);
	}

	for (k in places_multi) {
		route_multi[k] = {};
		route_multi[k].type = "LineString";
		route_multi[k].coordinates = [];
		for (m in places_multi[k])
			route_multi[k].coordinates.push(places_multi[k][m]);
	}

	d3.select(window).on('resize', function(){
		count = 0;

	});

	function resize() {
		// update width
		map.fitBounds(bound);

		d3.selectAll("path").remove();
		d3.selectAll("circle").remove();

		var count = 0;
		for (k in route_multi) { //add paths

			var name = k.toString();
			var newlst = fixloop2(route_multi[k].coordinates);
			var lstprojected = reptojectMap(newlst);

			var linedata = lineFunction(curvePath(curvePath(curvePath(curvePath(curvePath(lstprojected))))));

			d3.select(".allroutes").append("path") //current route
				.attr("stroke", "white")
				.attr("stroke-width", "1px")
				.attr("fill", "none").attr("d", linedata).attr("opacity", 1).style("position", "relative").attr("id", count).attr("name", name);
			count++;

		}

		for (k in route_multi) { //add nodes
			var nodes = reptojectMap(fixloop2(route_multi[k].coordinates));
			for (j in nodes) {
				d3.select(".allroutes").append("circle").attr("class", "mapnodes") //current route
					.attr("cx", nodes[j].x).attr("cy", nodes[j].y)
					.attr("r", 2).attr("fill", "#39a4e8");


			}
		}

		d3.selectAll("path").on("mouseover", function() {
			var myid = +d3.select(this).attr("id");
			var myinfo = getNode(route_multi,myid).coordinates;
			d3.select(this).attr("stroke", "#fc9003").attr("stroke-width", "3.5px").style("z-index", 1);
			var info = d3.select(".extra_info").append("div").attr("class", "info").attr("style","width:200px;background:rgba(255,255,255,0.8);position:absolute;border-radius: 10px;left:"+(d3.mouse(this)[0]+20)+"px;top:"+(d3.mouse(this)[1]+10)+"px ");
			info.append("h4").text(""+d3.select(this).attr("name").toUpperCase());
			
			var duration = info.append("div").attr("class", "departure");
			duration.append("strong").append("p").text("DEPARTURE");
			duration.append("p").text("...");
			var duration = info.append("div").attr("class", "arrival");
			duration.append("strong").append("p").text("ARRIVAL");
			duration.append("p").text("...");


			var duration = info.append("div").attr("class", "duration");
			duration.append("strong").append("p").text("DURATION");
			duration.append("p").text(allDays_w(myid)+" days");

			var distance = info.append("div").attr("class", "distance");
			distance.append("strong").append("p").text("DISTANCE");
			distance.append("p").text(Dis_w(getNode(route_multi,myid).coordinates)+" km");

			;






		});

		d3.selectAll("path").on("mouseout", function() {
			d3.select(this).attr("stroke", "white").attr("stroke-width", "1px");
			d3.selectAll(".info").remove();

		});

	}

		var count = 0;
		d3.timer(function() {
				if(count<5){
					resize();
					count++;

				}

		});


});

var addElement = function() {

}