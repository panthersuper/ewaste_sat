   var lineFunction0 = d3.svg.line()
     .x(function(d) {
       return d[0];
     })
     .y(function(d) {
       return d[1];
     })
     .interpolate("linear");


function getSmoothInterpolation(data) {
    return function(){//return a reference to this function
  var interpolate = d3.scale.linear()
      .domain([0, 1])
      .range([1, data.length + 1]);

  return function(t) {

      var flooredX = Math.floor(interpolate(t));
      var interpolatedLine = data.slice(0, flooredX);//previous segments
          
      if(flooredX > 0 && flooredX < data.length) {//iteration is not done
          var weight = interpolate(t) - flooredX;//calculate the weight on this segment
          var myY = data[flooredX].y * weight + data[flooredX-1].y * (1-weight);
          var myX = data[flooredX].x * weight + data[flooredX-1].x * (1-weight);
          
          interpolatedLine.push({"x": myX,"y": myY });//add the current segment

          }

      return lineFunction(interpolatedLine);
      }
    }
  }





var cleanlst_dis = function(lst) {
	//clean lst based on overall distance
	var orilst = lst;
	for (var i = 0; i < orilst.length; i++) {
		var pt1 = orilst[i]

		var mark = 0;


		for (var j = 0; j < orilst.length; j++) {
			if (i != j) {
				var pt2 = orilst[j];
				var dis = getDistanceFromLatLonInKm(pt1[0],pt1[1], pt2[0],pt2[1]);
				if (dis < 300){
					mark = 1;
					
				}
			}
		}
		if (mark != 0) {
			orilst.splice(i, 1);
			i--;



		}
	}

	return orilst;


}

var revGeocoding_class = function(lat, lng, myclass) {
	var returnvalue = null;
	if (lng<-180) lng = lng+360;

	var mystr = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=AIzaSyBG1a8rdla5buwncdaUp8gQCKp_ePgI6wA&language=en';

	$.when($.getJSON(mystr)).done(function(data) {
		var country = null;
		var state = null;
		var city = null;
		var addr = null;
		if(data.results[0]!=undefined)
			addr = data.results[0].address_components;
		else{
			//console.log(lng, lat);

		}

		for (i in addr) {
			var type = addr[i].types[0]
			if (type === "country") country = addr[i].short_name;
			if (type === "administrative_area_level_1") state = addr[i].short_name;
			if (type === "locality") city = addr[i].short_name;
		}
		if(country==="US")
			returnvalue = city + ", " + state;
		else returnvalue = city + ", " + state + ", " + country;

		if (city === null) returnvalue = state + ", " + country;
		if (state === null) returnvalue = country;
		if (returnvalue===null) returnvalue="";

		returnvalue = returnvalue.toUpperCase();
		d3.select("." + myclass).append("p") //show text on each point
			.attr("class", "locName")
			.text(returnvalue);
	});
}

function reptojectMap0(lst) {
	var mylst = []
	for (k in lst) {
		mylst.push(map0.project(lst[k]));
	}

	return mylst;
}

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

		var zeroY = map0.project([-70, 33.928033]).y;
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

	var firstDate = getNode(place, 0)[2];
	var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
	var secondDate = getNode(place, length - 1)[2];

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

	d3.select(window).on('resize', function() {
		console.log("...");
		count1 = 0;
	});


	function resize() {
		// update width
		map0.fitBounds(bound);

		d3.selectAll(".overall_path").remove();
		d3.selectAll(".mapnodes").remove();

		var count1 = 0;
		for (k in route_multi) { //add paths
			var name = k.toString();
			var newlst = fixloop2(route_multi[k].coordinates);
			var lstprojected = reptojectMap0(newlst);

			var lineraw = curvePath(curvePath(curvePath(curvePath(curvePath(lstprojected)))));
			var linedata = lineFunction(lineraw);
			var linedata0 = lineFunction(lineraw.slice(0, 1));

			lineGraph = d3.select(".allroutes").append("path").attr("class", "overall_path overall_path_"+name)
				.attr("stroke", "rgba(255,255,255,0.3)")
				.attr("stroke-width", "1.5px")
				.attr("fill", "none").attr("d", linedata0).attr("opacity", 1).style("position", "relative").attr("id", count1).attr("name", name) /*.style("display","none")*/ ;

			count1++;

		}

		var lstImp = []; //starting and ending node list

		for (k in route_multi) { //add nodes
			var nodes0 = fixloop2(route_multi[k].coordinates);
			var nodes = reptojectMap0(nodes0); //each path node list

			for (var j = 1; j < nodes.length - 1; j++) {
				d3.select(".allroutes").append("circle").attr("class", "mapnodes") //add all nodes
					.attr("cx", nodes[j].x).attr("cy", nodes[j].y)
					.attr("r", 1).attr("fill", "rgb(150,150,150)");
			}

/*			lstImp.push(nodes0[0]);
			lstImp.push(nodes0[nodes.length - 1]);
*/
			d3.select(".allroutes").append("circle").attr("class", "mapnodes") //add all first nodes
				.attr("cx", nodes[0].x).attr("cy", nodes[0].y).attr("ox", nodes0[0][0]).attr("oy", nodes0[0][1])
				.attr("r", 3).attr("fill", "#39a4e8")
				.on("mouseover", function(){

					d3.select(this).attr("r", 6);
					var info = d3.select(".extra_info").append("div").attr("class", "info").attr("style", "background:rgba(255,255,255,0.8);position:absolute;border-radius: 10px;left:" + (d3.mouse(this)[0] + 20) + "px;top:" + (d3.mouse(this)[1] + 10) + "px ");
					info.append("div").attr("class", "pop_city_name");
					revGeocoding_class(d3.select(this).attr("oy"), d3.select(this).attr("ox"), "pop_city_name");

				})
				.on("mouseout", function(){
					d3.select(this).attr("r", 3);
					d3.selectAll(".info").remove();
				});

			d3.select(".allroutes").append("circle").attr("class", "mapnodes") //add all last nodes
				.attr("cx", nodes[nodes.length - 1].x).attr("cy", nodes[nodes.length - 1].y).attr("ox", nodes0[nodes0.length-1][0]).attr("oy", nodes0[nodes0.length-1][1])
				.attr("r", 3).attr("fill", "#ace25a")
				.on("mouseover", function(){
					d3.select(this).attr("r", 6);
					var info = d3.select(".extra_info").append("div").attr("class", "info").attr("style", "background:rgba(255,255,255,0.8);position:absolute;border-radius: 10px;left:" + (d3.mouse(this)[0] + 20) + "px;top:" + (d3.mouse(this)[1] + 10) + "px ");
					info.append("div").attr("class", "pop_city_name");


					var lx = d3.select(this).attr("ox");
					var ly = d3.select(this).attr("oy");
					if (lx<-180) {
						revGeocoding_class(ly, (+lx+360), "pop_city_name");

					}else 
						revGeocoding_class(ly, lx, "pop_city_name");

				})
				.on("mouseout", function(){
					d3.select(this).attr("r", 3);
					d3.selectAll(".info").remove();

				});
		}

		//add city name with cleaned list
/*		var citylst = cleanlst_dis(lstImp);
*/
		d3.selectAll(".citynames").remove();
/*		for (k in citylst) {
			var loc = citylst[k];

			loc = map0.project(loc);
			var key = k;
			//console.log(key);
			d3.select(".extra_info").append("div").attr("class", "citynames citynames"+key).attr("style", "position:absolute;left:"+(loc.x-5)+"px;top:"+(loc.y-10)+"px;"); //current route

			//if($(".citynames"+key).find("p").length === 0)
			//revGeocoding_class(citylst[k][1], citylst[k][0], "citynames"+key);

		}*/



		d3.selectAll(".overall_path").on("mouseover", function() {

			var myid = +d3.select(this).attr("id");
			var myinfo = getNode(route_multi, myid).coordinates;
			d3.select(this).attr("stroke", "white").attr("stroke-width", "3.5px").style("z-index", 11);
			var info = d3.select(".extra_info").append("div").attr("class", "info").attr("style", "width:200px;background:rgba(255,255,255,0.8);position:absolute;border-radius: 10px;left:" + (d3.mouse(this)[0] + 20) + "px;top:" + (d3.mouse(this)[1] + 10) + "px ");
			info.append("h4").text("" + d3.select(this).attr("name").toUpperCase());

			var departure = info.append("div").attr("class", "departure");
			departure.append("strong").append("p").text("DEPARTURE");
			var pos = getNode(route_multi, myid).coordinates[0];
			revGeocoding_class(pos[1], pos[0], "departure");

			var arrival = info.append("div").attr("class", "arrival");
			arrival.append("strong").append("p").text("ARRIVAL");
			var llst = getNode(route_multi, myid).coordinates;
			var pos2 = llst[llst.length - 1];
			revGeocoding_class(pos2[1], pos2[0], "arrival");

			var duration = info.append("div").attr("class", "duration");
			duration.append("strong").append("p").text("DURATION");
			duration.append("p").text(allDays_w(myid) + " days");

			var distance = info.append("div").attr("class", "distance");
			distance.append("strong").append("p").text("DISTANCE");
			distance.append("p").text(Dis_w(getNode(route_multi, myid).coordinates) + " km");

			;

		});


		d3.selectAll(".overall_path").on("mouseout", function() {
			d3.select(this).attr("stroke", "rgba(255,255,255,0.3)").attr("stroke-width", "1.5px");
			d3.selectAll(".info").remove();
		});

		d3.selectAll(".overall_path").on("click", function() {
			console.log("clicked");
			var myid = +d3.select(this).attr("id");


			changePage(1);

			//////////////////////////////////////////////////////////////////update path number

			$("#tablepath div").removeClass("active");
			$(this).addClass("active");

			var thisid = $(this).attr("id");
			curPath = +thisid;
			update(myid);
			moveToggle = false;
			cont = false; //loop not started
			$("#tablepath").fadeOut(100);

			d3.select("#nowpath_title")
				.select("p").remove();

			d3.select("#nowpath_title")
				.append("p")
				.text(Object.keys(places_multi)[curPath].toUpperCase());

			localcontrol = true;



		});



	}
	var count1 = 0;
	d3.timer(function() {
		if (count1 < 5) {
			resize();
			count1++;
		}

	});


});

var addElement = function() {

}