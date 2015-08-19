Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

var getNode = function(placeList, i) { //get the certain node from the place list
  var item = 0;
  var node = null;
  for (k in placeList) {

    if (item === i) {
      node = placeList[k];
      break;
    }
    item++;

  }
  return node;
}

var interPt = function(ptA, ptB, t) {
  //the the interval point between point A and point B, at the t position
  //solve the problem of crossing the zero lat line
  var x = null;
  var y = (ptB[1] - ptA[1]) * t + ptA[1];

  if (ptA[0] >= 0 && ptB[0] >= 0 || ptA[0] <= 0 && ptB[0] <= 0) {
    x = (ptB[0] - ptA[0]) * t + ptA[0];
  } else if (Math.abs(ptA[0] - ptB[0]) < 180) {
    x = (ptB[0] - ptA[0]) * t + ptA[0];
  } else {
    x = ((ptB[0] + 360) % 360 - (ptA[0] + 360) % 360) * t + (ptA[0] + 360) % 360;
  }
  return [x, y];
}

var translateAlong = function(path, m) {
  var l = path.getTotalLength();

  return function(i) {
    return function(t) {
      var p = path.getPointAtLength(m * l);
      return "translate(" + p.x + "," + p.y + ")"; //Move marker
    }
  }
}

var distanceSQ = function(nodeA, nodeB) {
  return (nodeA[0] - nodeB[0]) * (nodeA[0] - nodeB[0]) + (nodeA[1] - nodeB[1]) * (nodeA[1] - nodeB[1]);
}

function getDate(time){
    var myDate = new Date( time *1000);
    return myDate;
}

/*var places_multi_test = {
  path1: {
    HNL: [-157 - 55 / 60 - 21 / 3600, 21 + 19 / 60 + 07 / 3600],
    HKG: [113 + 54 / 60 + 53 / 3600, 22 + 18 / 60 + 32 / 3600],
    SVO: [37 + 24 / 60 + 53 / 3600, 55 + 58 / 60 + 22 / 3600],
    HAV: [-82 - 24 / 60 - 33 / 3600, 22 + 59 / 60 + 21 / 3600],
    CCS: [-66 - 59 / 60 - 26 / 3600, 10 + 36 / 60 + 11 / 3600],
    UIO: [-78 - 21 / 60 - 31 / 3600, 0 + 06 / 60 + 48 / 3600]
  },
  path2: {
    BOS: [-71.115704, 42.410161],
    HKG: [113 + 54 / 60 + 53 / 3600, 22 + 18 / 60 + 32 / 3600]
  },
  path3: {
    BOS: [-71.115704, 42.410161],
    BKL: [-122.252430,37.866487]
  }
};*/

var width = 960,
  height = 960;



var places_multi = {};
var route_multi = {};

var curPath = 1; //the path that is currently showing
var projection = d3.geo.orthographic()
  .scale(width / 2.1)
  .translate([width / 2, height / 2])
  .precision(.5);
var graticule = d3.geo.graticule();
var target;
var myroute;
var CuRoute;
var places;
var route;

var canvas = d3.select("#draw").append("canvas").attr("class", "mycanvas")
  .attr("width", width)
  .attr("height", height);

var context = canvas.node().getContext("2d");

var svg0 = d3.select("#draw").append("svg").attr("class", "mysvg")
  .attr("width", width)
  .attr("height", height);
var svg = svg0.append("g");

var path = d3.geo.path()
  .projection(projection)
  .context(context);

var patho = d3.geo.path()
  .projection(projection);

var sphere = {
  type: "Sphere"
};
var nodeNum; //total node amount
var nowNum = 1; //current node to target to
var oneMove_default = 100;
var oneMove = oneMove_default; //the interval for each focus
var countmove = 1;
var count = 0; //to measure the interval
var point;
var track;

var lat_old = 0;
var lng_old = 0;
var lat = 0;
var lng = 0;
var scaleFactor = 1;
var transx = 0;
var transy = 0;
var nowx = 0;
var nowy = 0;

/*var xScale = d3.time.scale()
    .domain([t0, t3])
    .range([t0, t3].map(d3.time.scale()
      .domain([t1, t2])
      .range([0, width])));
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////

d3.csv("new_monitor_sim.csv", function(error, data) {
  //data is numbered by the row number... 
  //head is not counted as a row.
  //each item in the data list is a dictionary, key is indicated by the head

  var num = data.length;
  for (var i = 0; i < num; i++) {
    places_multi[data[i]["deviceID"]] = {};
  };
  for (var i = 0; i < num; i++) {
    var date = getDate(data[i]["timestamp"]);
    var Date = date.getDate();
    var Month = date.getMonth()+1;
    var Year = date.getFullYear();


    places_multi[data[i]["deviceID"]][data[i]["sequence"]] = [+data[i]["longitude"], +data[i]["latitude"],Date, Month, Year];
  };

  for (k in places_multi) {
    route_multi[k] = {};
    route_multi[k].type = "LineString";
    route_multi[k].coordinates = [];
    for (m in places_multi[k])
      route_multi[k].coordinates.push(places_multi[k][m]);
  }

  places = getNode(places_multi, curPath);
  route = getNode(route_multi, curPath);

  var pathNum = Object.size(places_multi); //how many path is in the data list
  //add check box for paths

  var id = 0;
  for (key in places_multi) {

    d3.select("#tablepath")
      .append("div")
      .attr("class", "thepaths")
      .attr("id", id).append("p")
      .text(key);
      id++;
  }


  $(document).ready(main); //run jquery after csv loaded so path button initialized

  nodeNum = route.coordinates.length //the total number of nodes



  svg.append('rect')
    .attr('class', 'overlay')
    .attr('width', width)
    .attr('height', height)
    .attr("fill", "black");

  target = svg.append("g")
    .attr("class", "target")
    .append("circle")
    .attr("cx", 25)
    .attr("cy", 25)
    .attr("r", 10)
    .style("display", "none");
  myroute = svg.append("path")
    .datum(route)
    .attr("class", "route")
    .attr("d", patho);

  CuRoute = svg.append("path") //current route
    .attr("class", "curroute")

  point = svg.append("g")
    .attr("class", "points")
    .selectAll("g")
    .data(d3.entries(places))
    .enter().append("g")
    .attr("transform", function(d) {
      return "translate(" + projection(d.value) + ")";
    });

  track = svg.append("g")
    .append("circle")
    .attr("class", "track")
    .attr("r", 4)
    .attr("fill", "none")
    .attr("stroke", "rgba(206, 18, 18, 0.6)")
    .attr("stroke-width", "3px")
    .attr("transform", "translate(100,100)");

  point.append("circle") //show circle on each point
    .attr("r", 2);

/*  point.append("text") //show text on each point
    .attr("y", 10)
    .attr("dy", ".71em")
    .attr("class", "locName")
    .text(function(d) {
      return d.key.split("_")[1].split(" ")[0].split(",")[0];
    });*/

  lat_old = getNode(places, (nowNum - 1 + nodeNum) % nodeNum)[0];
  lng_old = getNode(places, (nowNum - 1 + nodeNum) % nodeNum)[1];

  //the target of this move
  lat = getNode(places, nowNum)[0];
  lng = getNode(places, nowNum)[1];


  d3.json("world-110m.json", function(error, topo) {
    if (error) throw error;

    var land = topojson.feature(topo, topo.objects.land),
      grid = graticule();


    var startN = null; //the starting point of the path
    for (k in places) {
      startN = places[k];
      break;
    }
    var endN = null; //the end point of the path
    for (k in places) {
      endN = places[k];
    }


    d3.timer(function() {

      if (Math.abs(count - oneMove) < countmove) { //one move is finished, start the next one
        count = 0
        nowNum = nowNum + 1;//next node to target
        nowNum = nowNum % nodeNum; //cycle the loop

        if (nowNum === 0) nowNum = 1; //skip the first move
      }

      lat_old = getNode(places, (nowNum - 1 + nodeNum) % nodeNum)[0];
      lng_old = getNode(places, (nowNum - 1 + nodeNum) % nodeNum)[1];

      //the target of this move
      lat = getNode(places, nowNum)[0];
      lng = getNode(places, nowNum)[1];

      
      var dis = distanceSQ([lat_old, lng_old], [lat, lng]);
      
      if (dis < 100) {
        countmove = 10;
      } else { countmove = 1;
      }
      
      var timephase = count % oneMove; //the current phase of this move
      var phasePercentage = timephase / oneMove; //the completion percentage of the current move

      context.clearRect(0, 0, width, height);
      count +=countmove;
      //rate the closeness to nodes
      //0.5: close! at nodes
      //0: far! at the middle of two nodes

      var intertarget = interPt([lat_old, lng_old], [lat, lng], phasePercentage);

      target /*.transition()*/
        .attr("cx", intertarget[0])
        .attr("cy", intertarget[1]);



      //change the projection based on rotate value
      //projection.rotate([speed * (Date.now() - start), -15]).clipAngle(90);
      projection.rotate([-target.attr("cx"), -target.attr("cy")]).clipAngle(90);


      patho = d3.geo.path().projection(projection); //rotate the path
      var myD = patho(route); //redo the projection

      myroute //reset the route drawn on the map
        .attr("class", "route")
        .attr("d", myD);

      curData = { //create current route data
        type: "LineString",
        coordinates: []
      }

      curData.coordinates.push([lat_old, lng_old]);
      curData.coordinates.push([lat, lng]);


      CuRoute //create current route
        .datum(curData)
        .attr("class", "curroute")
        .attr("d", patho);



      console.log("Current Path:" + curPath + "||Current Node:" + nowNum + "||Total Node:" + nodeNum);
      console.log(phasePercentage);

      
      //if dis is small enough, jump to the next node
/*      if(dis<100)
      track.transition()
        .attrTween("transform", translateAlong(CuRoute.node(), 0));
      else*/
      track.transition()
        .attrTween("transform", translateAlong(CuRoute.node(), phasePercentage));
      
      point.attr("transform", function(d) { //rotate the nodes
        return "translate(" + projection(d.value) + ")";
      });

      var closeRate = Math.abs(0.5 - phasePercentage);

      var test = closeRate * 3 + 1;//scale factor
      if (dis < 100) {
        test = 2.5;
      }

      //move the camera and rescale the canvas
      var ptnow = [-width / 2 * (test - 1), -height / 2 * (test - 1)];
      svg.attr("transform", "translate(" + ptnow + ")scale(" + test + ")");
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.translate(ptnow[0], ptnow[1]);
      context.scale(test, test);

      track.attr("r", closeRate * 10+2); //change the tracker's r according to closerate

      context.beginPath(); //draw the outbound of the sphere
      path(sphere);
      context.lineWidth = 3;
      context.strokeStyle = "#000";
      context.stroke();
      context.fillStyle = "#0b0e0f";
      context.fill();

      projection.clipAngle(180); //clip the grid and land, 180 means no clipping

      context.beginPath();
      path(land);
      context.fillStyle = "#0d0d08";
      context.fill();

      context.beginPath();
      path(grid);
      context.lineWidth = .5;
      context.strokeStyle = "rgba(119,119,119,.5)";
      context.stroke();

      projection.clipAngle(90); //clip the back half of the land

      context.beginPath();
      path(land);
      context.fillStyle = "#616161";
      context.fill();
      context.lineWidth = .5;
      context.strokeStyle = "#000";
      context.stroke();

      projection.clipAngle(0); //clip the back half of the land






    });
  });



  d3.select(self.frameElement).style("height", height + "px");
});



//update content after selecting a specific path
var update = function(current) {
  places = getNode(places_multi, current);
  route = getNode(route_multi, current);

  target
    .attr("class", "target")
    .append("circle")
    .attr("cx", 25)
    .attr("cy", 25)
    .attr("r", 10)
    .style("display", "none");

  myroute
    .datum(route)
    .attr("class", "route")
    .attr("d", patho);

  CuRoute
    .attr("class", "curroute")



  $(".points").remove();
  point = svg.append("g")
    .attr("class", "points")
    .selectAll("g")
    .data(d3.entries(places))
    .enter().append("g")
    .attr("transform", function(d) {
      return "translate(" + projection(d.value) + ")";
    });
  point.append("circle") //show circle on each point
    .attr("r", 2);

/*  point.append("text") //show text on each point
    .attr("y", 10)
    .attr("dy", ".71em")
    .attr("class", "locName")
    .text(function(d) {
      return d.key.split("_")[1].split(" ")[0].split(",")[0];
    });*/

  nodeNum = route.coordinates.length; //the total number of nodes
  nowNum = 1; //current node to target to
  oneMove = oneMove_default; //the interval for each focus
  count = 0; //to measure the interval

}

//main jquery function
var main = function() {
  $(".thepaths").click(
    function() {
      var thisid = $(this).attr("id");
      curPath = +thisid;
      update(curPath);
    }
  );
};