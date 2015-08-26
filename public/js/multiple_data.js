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

var translateAlong2 = function(path, m) {
  var l = path.getTotalLength();
  var p = path.getPointAtLength(m * l);
  return "translate(" + p.x + "," + p.y + ")"; //Move marker
}

var distanceSQ = function(nodeA, nodeB) {
  return (nodeA[0] - nodeB[0]) * (nodeA[0] - nodeB[0]) + (nodeA[1] - nodeB[1]) * (nodeA[1] - nodeB[1]);
}

function getDate(time) {
  var myDate = new Date(time * 1000);
  return myDate;
}

var cleanLst = function(places, thresh) {
  //delete the first data if distance is too close

  var num = Object.size(places);
  var keys = Object.keys(places);

  for (var i = 0; i < num - 1; i++) {
    var a = [places[keys[i]][0], places[keys[i]][1]];
    var b = [places[keys[i + 1]][0], places[keys[i + 1]][1]];
    var dis = distanceSQ(a, b);
    var important = places[keys[i]][3].length + places[keys[i]][4].length + places[keys[i]][5].length + places[keys[i]][6].length;
    if (important > 0) important = true;
    else important = false;

    if (dis < thresh && (!important)) {
      delete places[keys[i]];
    }

  }
}

Math.seed = function(s) {
  return function() {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
};

var randomDir = function(nodeA, nodeB) {
  //create a noise route between A and B, for distance that is more than thresh
  //by insert num of new nodes in between
  var lst = [];
  var dis = distanceSQ(nodeA, nodeB);
  var threshA = 1;
  var threshB = 600;

  var num = Math.round(Math.sqrt(dis));
  var ratio = num / 30;

  if (num < 10) {
    num = 10;
  }
  if (dis < threshA || dis > threshB) {
    for (var i = 0; i <= num; i++) {
      var t = i / num
      var node = interPt(nodeA, nodeB, t);
      lst.push(node);
    }
  } else {
    lst.push(nodeA);
    var start = nodeA;

    for (var i = 0; i < num; i++) {
      var dir = [(nodeB[0] - start[0]) / (num + 1 - i), (nodeB[1] - start[1]) / (num + 1 - i)];
      var random1 = Math.seed(i + 1);
      var random2 = Math.seed(random1());
      Math.random = Math.seed(random2());
      var ram = [(Math.random() - 1) * ratio, (Math.random() - 1) * ratio];
      var node = [start[0] + dir[0] + ram[0], start[1] + dir[1] + ram[1]];
      lst.push(node);
      start = node;
    }
    lst.push(nodeB);
  }
  return lst;
}

var ramwhole = function(lst, upto) { //randomnize the whole list
  var mylst = [];
  if (upto === 0) {
    for (var i = 0; i < lst.length - 1; i++) {
      var temp = randomDir(lst[i], lst[i + 1]);
      mylst.push.apply(mylst, temp);
    }
    return mylst;
  } else {
    for (var i = 0; i < upto; i++) {
      var temp = randomDir(lst[i], lst[i + 1]);
      mylst.push.apply(mylst, temp);
    }
    return mylst;



  }



}

var revGeocoding = function(lat, lng, id) {
  var returnvalue = null;
  var mystr = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=AIzaSyBG1a8rdla5buwncdaUp8gQCKp_ePgI6wA&language=en';

  $.when($.getJSON(mystr)).done(function(data) {
    var country = null;
    var state = null;
    var city = null;
    var addr = data.results[0].address_components;

    for (i in addr) {
      var type = addr[i].types[0]
      if (type === "country") country = addr[i].short_name;
      if (type === "administrative_area_level_1") state = addr[i].short_name;
      if (type === "locality") city = addr[i].short_name;
    }

    returnvalue = city + ", " + state + ", " + country;

    if (city === null) returnvalue = state + ", " + country;

    d3.select("#" + id).append("text") //show text on each point
      .attr("y", -10)
      .attr("x", 10)
      .attr("dy", ".71em")
      .attr("class", "locName")
      .text(function(d) {
        return returnvalue;
      });
  });
}

var removetext = function(id) {
  d3.selectAll(".mypoints" + " text")
    .remove();
}

var lineFunction = d3.svg.line()
  .x(function(d) {
    return d[0];
  })
  .y(function(d) {
    return d[1];
  })
  .interpolate("linear");


var lineFunction = d3.svg.line()
  .x(function(d) {
    return d[0];
  })
  .y(function(d) {
    return d[1];
  })
  .interpolate("linear");

function ratioDir(data, m, projection) {
  var interpolate = d3.scale.linear()
    .domain([0, 1])
    .range([1, data.length + 1]);

  var flooredX = Math.floor(interpolate(m));
  var interpolatedLine = data.slice(0, flooredX); //previous segments

  if (flooredX > 0 && flooredX < data.length) { //iteration is not done
    var weight = interpolate(m) - flooredX; //calculate the weight on this segment

    var nodeA = data[flooredX - 1];
    var nodeB = data[flooredX];
    var target = interPt(nodeA, nodeB, weight);


    /*        var myY = data[flooredX][1] * weight + data[flooredX - 1][1] * (1 - weight);
            var myX = data[flooredX][0] * weight + data[flooredX - 1][0] * (1 - weight);
    */
    interpolatedLine.push(target); //add the current segment
  }

  return interpolatedLine;


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
var margin = {
  top: 40,
  right: 40,
  bottom: 40,
  left: 40
};


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
var CuRoute_blur;
var pastRoute;
var pastRoute_blur;
var places;
var route;
var routeRam;
var timeMark;
var timeBase;


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
var oneMove_default = 60;
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

var datelst = [];
var xScale;
var trackscale = 0;
var moveToggle = false;
var cont = false;


////////////////////////////////////////////////////////////////////////////////////////////////////////

d3.tsv("new_monitor_sim.tsv", function(error, data) {
  //d3.csv("test.csv", function(error, data) {
  //data is numbered by the row number... 
  //head is not counted as a row.
  //each item in the data list is a dictionary, key is indicated by the head

  var num = data.length;
  for (var i = 0; i < num; i++) {
    places_multi[data[i]["deviceID"]] = {};
  };

  for (var i = 0; i < num; i++) {
    var date = getDate(data[i]["timestamp"]);
    datelst.push(data[i]["timestamp"]);
    var title = data[i]["title"];
    var video = data[i]["video"];
    var story = data[i]["story"];
    var image = data[i]["img"];

    var lat = +data[i]["latitude"],
      lng = +data[i]["longitude"];

    places_multi[data[i]["deviceID"]][data[i]["sequence"]] = [lng, lat, date, title, video, story, image];
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

  places = getNode(places_multi, curPath);
  route = getNode(route_multi, curPath);
  routeRam = jQuery.extend(true, {}, route); //deep copy
  routeRam.coordinates = ramwhole(routeRam.coordinates, 0);

  datelst.sort();
  var newdl = []
  for (i in datelst) {
    newdl.push(getDate(datelst[i]));
  }

  var minDate = newdl[0],
    maxDate = newdl[newdl.length - 1];

  xScale = d3.time.scale()
    .domain([minDate, maxDate])
    .range([margin.left, width - margin.right * 3]);


  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(d3.time.month, 1)
    .tickFormat(d3.time.format('%b %Y'))
    .tickSize(5)
    .tickPadding(5);

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

  svg.append("filter")
    .attr("id", "blur-effect-1")
    .append("feGaussianBlur")
    .attr("stdDeviation", 2);



  target = svg.append("g") //rotate the globe 
    .attr("class", "target")
    .append("circle")
    .attr("cx", 25)
    .attr("cy", 25)
    .attr("r", 10)
    .style("display", "none");

  myroute = svg.append("path")
    .datum(routeRam)
    .attr("class", "route")
    .attr("d", patho)
    .attr("stroke-dasharray", "2,2");


  CuRoute = svg.append("path") //current route
    .attr("class", "curroute")
  CuRoute_blur = svg.append("path") //current route
    .attr("class", "curroute_blur")


  pastRoute = svg.append("path") //current route
    .attr("class", "pastroute")
  pastRoute_blur = svg.append("path") //current route
    .attr("class", "pastroute_blur")

  point = svg.append("g")
    .attr("class", "points")
    .selectAll("g")
    .data(d3.entries(places))
    .enter().append("g")
    .attr("id", function(d, i) {
      return "point" + i;
    })
    .attr("class", "mypoints")
    .attr("transform", function(d) {
      return "translate(" + projection(d.value) + ")";
    })
    .on("mouseover", function(d, i) {
      revGeocoding(d.value[1], d.value[0], "point" + i);
    })
    .on("mouseout", function(d, i) {
      removetext("point" + i);
    })
    .on("click", function(d, i) {
      nowNum = i;
      updateContent(nowNum);
      moveToggle = false;
      cont = false; //loop not started
      count = oneMove_default - 0.01; //to measure the interval


    })


  ;


  point.append("circle") //show circle on each point
    .attr("r", 1.5);

  /*  point.attr("add", function(d,i){
      revGeocoding(d.value[1],d.value[0],"point"+i);
    });
  */
  /*  point.append("text") //show text on each point
      .attr("y", 10)
      .attr("dy", ".71em")
      .attr("class", "locName")
      .text(function(d) {
        return d.key.split("_")[1].split(" ")[0].split(",")[0];
      });*/

  track = svg.append("g") //red circle
    .append("circle")
    .attr("class", "track")
    .attr("r", 2)
    .attr("fill", "none")
    .attr("stroke", "rgba(206, 18, 18, 0.8)")
    .attr("stroke-width", "1px")
    .attr("transform", "translate(100,100)");

  svg0.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(' + margin.left + ', ' + (height - margin.top - margin.bottom) + ')')
    .call(xAxis);

  timeMark = svg0.append("g") //time mark
    .append("circle")
    .attr("class", "timemark")
    .attr("r", 3)
    .attr("fill", "none")
    .attr("stroke", "rgba(206, 18, 18, 0.8)")
    .attr("stroke-width", "3px")
    .attr("transform", "translate(100," + (height - margin.top - margin.bottom) + ")");

  timeBase = svg0.append("g").attr("class", "timebase") //time mark
    .selectAll("g")
    .data(d3.entries(places))
    .enter().append("g")
    .attr("class", "timeid")
    .attr("id", function(d, i) {
      return "timeid" + i;
    })
    .attr("transform", function(d) {
      var myx = xScale(d.value[2]);
      return "translate(" + myx + "," + (height - margin.top - margin.bottom + 2.5) + ")";
    })
    .on("click", function(d, i) {
      nowNum = i;
      updateContent(nowNum);
      moveToggle = false;
      cont = false; //loop not started
      count = oneMove_default - 0.01; //to measure the interval

    });

  timeBase.append("circle")
    .attr("r", 2)
    .attr("fill", "rgba(18, 18, 206, 0.8)")
    .attr("stroke", "none")
    .attr("stroke-width", "1px")

  initContent();



  lat_old = getNode(places, (nowNum - 1 + nodeNum) % nodeNum)[0];
  lng_old = getNode(places, (nowNum - 1 + nodeNum) % nodeNum)[1];

  //the target of this move
  lat = getNode(places, nowNum)[0];
  lng = getNode(places, nowNum)[1];

  //d3.json("countries.geo.json", function(error, topo) {
  d3.json("world-110m.json", function(error, topo) {
    if (error) throw error;
    //var land = topojson.feature(topo, topo.features.properties.geometry),
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

    //////the timmer//////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    d3.timer(function() {

      trackscale += 0.2;
      lat_old = getNode(places, (nowNum - 1 + nodeNum) % nodeNum)[0];
      lng_old = getNode(places, (nowNum - 1 + nodeNum) % nodeNum)[1];

      //the target of this move
      lat = getNode(places, nowNum)[0];
      lng = getNode(places, nowNum)[1];


      var dis = distanceSQ([lat_old, lng_old], [lat, lng]);

      if (dis < 100) {
        countmove = 10;
      } else {
        countmove = 1;
      }


      if (moveToggle) {
        if (Math.abs(count - oneMove) < countmove) { //one move is finished, start the next one
          //if next one have notes, stop there,otherwise keep moving
          var keys = Object.keys(places);
          var important = places[keys[nowNum]][3].length + places[keys[nowNum]][4].length + places[keys[nowNum]][5].length + places[keys[nowNum]][6].length;
          if (important > 0) important = true;
          else important = false;

          if (!important) {


            if (nowNum + 1 != nodeNum) {
              count = 0;
              nowNum = nowNum + 1; //next node to target
              nowNum = nowNum % nodeNum; //cycle the loop
              moveToggle = true;
            }


          } else if (cont) {
            updateContent(nowNum);
            cont = false;
            //moveToggle = false;
          }


        } else { //move is not finished

          count += countmove;
        }
      }

      var timephase = count % oneMove; //the current phase of this move
      var phasePercentage = timephase / oneMove; //the completion percentage of the current move

      if (moveToggle)
        if (phasePercentage === 0) phasePercentage = 1;
      context.clearRect(0, 0, width, height);

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



      pastData = { //create current route data
        type: "LineString",
        coordinates: []
      }

      var pastcoo = [];
      var routeRam2 = jQuery.extend(true, {}, route); //deep copy
      pastcoo = ramwhole(routeRam2.coordinates, nowNum - 1);

      if (nowNum != 1)
        pastData.coordinates = pastcoo;

      pastRoute //create current route
        .datum(pastData)
        .attr("class", "pastroute")
        .attr("d", patho);
      pastRoute_blur //create current route
        .datum(pastData)
        .attr("class", "pastroute_blur")
        .attr("d", patho);


      var myD = patho(routeRam); //redo the projection

      myroute //reset the route drawn on the map
        .attr("class", "route")
        .attr("d", myD);

      curData = { //create current route data
        type: "LineString",
        coordinates: []
      }

      var curcoo = [
        [lat_old, lng_old],
        [lat, lng]
      ];
      curcoo = randomDir(curcoo[0], curcoo[1]);
      curcoo = ratioDir(curcoo, phasePercentage);

      curData.coordinates = curcoo;

      CuRoute //create current route
        .datum(curData)
        .attr("class", "curroute")
        .attr("d", patho);
      CuRoute_blur //create current route
        .datum(curData)
        .attr("class", "curroute_blur")
        .attr("d", patho);


      //console.log("Current Path:" + curPath + "||Current Node:" + nowNum + "||Total Node:" + nodeNum);
      timeMark
        .attr("transform", "translate(" + xScale(getNode(places, nowNum)[2]) + "," + (height - margin.top - margin.bottom + 2.5) + ")");
      //console.log(phasePercentage);

      track
        .attr("transform", translateAlong2(CuRoute.node(), (1)));

      point.attr("transform", function(d) { //rotate the nodes
        return "translate(" + projection(d.value) + ")";
      });

      var closeRate = Math.abs(0.5 - phasePercentage);

      var test = closeRate * 1 + 1; //scale factor
      if (dis < 800) {
        test = 1.5;
      }

      //move the camera and rescale the canvas
      var ptnow = [-width / 2 * (test - 1), -height / 2 * (test - 1)];
      svg.attr("transform", "translate(" + ptnow + ")scale(" + test + ")");
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.translate(ptnow[0], ptnow[1]);
      context.scale(test, test);

      track.attr("r", 2 * (trackscale % 1) + 1); //change the tracker's r according to closerate

      context.beginPath(); //draw the outbound of the sphere
      path(sphere);
      context.lineWidth = 1;
      context.strokeStyle = "#999";
      context.stroke();

      projection.clipAngle(180); //clip the grid and land, 180 means no clipping

      context.beginPath(); //land
      path(land);
      context.fillStyle = "rgba(52,53,67,0.1)";
      context.fill();

      projection.clipAngle(90); //clip the back half of the land

      context.beginPath();
      path(land);
      context.fillStyle = "#343543";
      context.fill();
      context.lineWidth = .5;
      context.strokeStyle = "#000";
      context.stroke();

      context.beginPath(); //grid
      path(grid);
      context.lineWidth = .2;
      context.strokeStyle = "rgba(119,119,119,.5)";
      context.stroke();



      /*        precanvas.insert("path", ".graticule")
                .datum(topojson.mesh(world, world.objects.countries, function(a, b) {
                  return a !== b;
                }))
                .attr("class", "boundary")
                .attr("d", pre_path);
      */


      //projection.clipAngle(180); //clip the back half of the land

    });
  });

  d3.select(self.frameElement).style("height", height + "px");
});


//update content after selecting a specific path
var update = function(current) {
  places = getNode(places_multi, current);
  route = getNode(route_multi, current);
  routeRam = jQuery.extend(true, {}, route); //deep copy
  routeRam.coordinates = ramwhole(routeRam.coordinates, 0);

  target
    .attr("class", "target")
    .append("circle")
    .attr("cx", 25)
    .attr("cy", 25)
    .attr("r", 10)
    .style("display", "none");

  myroute
    .datum(routeRam)
    .attr("class", "route")
    .attr("d", patho);

  CuRoute
    .attr("class", "curroute")
  CuRoute_blur
    .attr("class", "curroute_blur")


  $(".points").remove();
  point = svg.append("g")
    .attr("class", "points")
    .selectAll("g")
    .data(d3.entries(places))
    .enter().append("g")
    .attr("id", function(d, i) {
      return "point" + i;
    })
    .attr("class", "mypoints")
    .attr("transform", function(d) {
      return "translate(" + projection(d.value) + ")";
    })
    .on("mouseover", function(d, i) {
      revGeocoding(d.value[1], d.value[0], "point" + i);
    })
    .on("mouseout", function(d, i) {
      removetext("point" + i);
    })
    .on("click", function(d, i) {
      nowNum = i;
      updateContent(nowNum);
      moveToggle = false;
      cont = false; //loop not started
      count = oneMove_default - 0.1; //to measure the interval

    })

  ;

  point.append("circle") //show circle on each point
    .attr("r", 1.5);


  $(".track").remove();
  track = svg.append("g") //red circle
    .append("circle")
    .attr("class", "track")
    .attr("r", 2)
    .attr("fill", "none")
    .attr("stroke", "rgba(206, 18, 18, 0.8)")
    .attr("stroke-width", "1px")
    .attr("transform", "translate(100,100)");

  $(".timebase").remove();

  timeBase = svg0.append("g").attr("class", "timebase") //time mark
    .selectAll("g")
    .data(d3.entries(places))
    .enter().append("g")
    .attr("transform", function(d) {
      var myx = xScale(d.value[2]);
      return "translate(" + myx + "," + (height - margin.top - margin.bottom + 2.5) + ")";
    })
    .attr("class", "timeid")
    .attr("id", function(d, i) {
      return "timeid" + i;
    })
    .on("click", function(d, i) {
      nowNum = i;
      updateContent(nowNum);
      moveToggle = false;
      cont = false; //loop not started
      count = oneMove_default - 0.1; //to measure the interval

    });

  timeBase.append("circle")
    .attr("r", 2)
    .attr("fill", "rgba(18, 18, 206, 0.8)")
    .attr("stroke", "none")
    .attr("stroke-width", "1px")


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

  updateContent(0);

}

//main jquery function
var main = function() {
  $("#tablepath div").click( //click the new route button, change the display to the new one
    function() {
      $("#tablepath div").removeClass("active");
      $(this).addClass("active");

      var thisid = $(this).attr("id");
      curPath = +thisid;
      update(curPath);
      moveToggle = false;
      cont = false; //loop not started
    }
  );

  $("#tablepath div").mouseover( //hover the new route, will show the preview of this one
    function(event) {
      //console.log($(this).attr("id")      );

      var precanvas = d3.select("#pre").append("svg")
        .attr("id", "preview");
      var myY = null
      myY = event.pageY;
      if (myY < 625)
        precanvas.attr("style", "top:" + myY + "px;");
      else
        precanvas.attr("style", "bottom:" + 100 + "px;");

      var pre_id = $(this).attr("id"); //the id for the preview
      var pre_places = getNode(places_multi, +pre_id);
      var pre_route = getNode(route_multi, +pre_id);

      var pre_projection = d3.geo.equirectangular()
        .scale(50)
        .rotate([205, 0])
        .translate([150, 75])
        .precision(1);

      var pre_path = d3.geo.path()
        .projection(pre_projection);


      d3.json("world-110m.json", function(error, world) {
        if (error) throw error;

        precanvas.insert("path", ".graticule")
          .datum(topojson.feature(world, world.objects.land))
          .attr("fill", "#858585")
          .attr("class", "land")
          .attr("d", pre_path);

        precanvas.append("path")
        .datum(pre_route)
        .attr("stroke-width", "1.52px")
        .attr("stroke", "#ffed94")
        .attr("fill", "none")
        .attr("d", pre_path);

      });
    }
  );

  $("#tablepath div").mouseout( //move out of the mouse, will undo the preview
    function() {
      d3.select("#preview").remove();
    }
  );



  $("#next").click(
    function() {


      if (moveToggle) {
        count = 0;
        nowNum = nowNum + 1; //next node to target
        //nowNum = nowNum % nodeNum; //cycle the loop

        /*if (nowNum === 0) {
          nowNum = 1;
          moveToggle = false;
        }*/

      }

      if (nowNum === nodeNum) { //about to finish the last loop
        count = 0;
        nowNum = 1; //skip the first move
        moveToggle = false;
        //cont = false;
        updateContent(0);
      } else
        moveToggle = true;

      //animations when next button is clicked

      updateContent(nowNum);
      cont = true; //loop starts


    }
  );

  $("#stop").click(
    function() {
      cont = false; //loop starts
      moveToggle = false;
    }
  );


  $("#prev_c").click(
    function() {
      console.log("previous");
    }
  );

  $("#next_c").click(
    function() {
      console.log("next");
    }
  );














};

var initContent = function() {

  d3.select("#story")
    .append("p")
    .text(getNode(places, 0)[5])

  d3.select("#title")
    .append("p")
    .text(getNode(places, 0)[3])

  d3.select("#img")
    .append("img")
    .attr("src", getNode(places, 0)[6]);

  d3.select("#video")
    .append("iframe")
    .attr("src", getNode(places, 0)[4]);


  $("#story p").fadeOut(0).fadeIn(1000);
  $("#title p").fadeOut(0).fadeIn(1000);
  $("#img img").fadeOut(0).fadeIn(1000);
  $("#video iframe").fadeOut(0).fadeIn(1000);


}



var updateContent = function(num) {

  $("#story p").fadeOut(500, function() {
    $(this).remove()
    d3.select("#story")
      .append("p")
      .text(getNode(places, num)[5]);
    $("#story p").fadeOut(0).fadeIn(500);

  });
  $("#title p").fadeOut(500, function() {
    $(this).remove()
    d3.select("#title")
      .append("p")
      .text(getNode(places, num)[3]);
    $("#title p").fadeOut(0).fadeIn(500);


  });

  $("#img img").fadeOut(500, function() {
    $(this).remove();
    d3.select("#img")
      .append("img")
      .attr("src", getNode(places, num)[6]);
    $("#img img").fadeOut(0).fadeIn(500);

  });

  $("#video iframe").fadeOut(500, function() {
    $(this).remove();
    d3.select("#video")
      .append("iframe")
      .attr("src", getNode(places, num)[4]);
    $("#video iframe").fadeOut(0).fadeIn(500);

  });
}