function fixloop(lst) {
  //fix the loop error for path on globe
  var mynew = [];

  var left_right;


  for (var i = 0; i < lst.length - 1; i++) {

    if (lst[i][0] < 0 && lst[i + 1][0] > 0 && lst[i + 1][0] - lst[i][0] < 180) {
      left_right = true;

      break;
    } else if (lst[i][0] < 0 && lst[i + 1][0] > 0 && lst[i + 1][0] - lst[i][0] > 180) {
      left_right = false;
      break;
    } 
     left_right = -1;
  }

  if (left_right === -1) {
    return lst;
  }
  else if (left_right === true) {

    for (var i = 0; i < lst.length - 1; i++) {
      if (lst[i][0] < 0 && lst[i + 1][0] > 0 && lst[i + 1][0] - lst[i][0] < 180) {
        var newpt = [0, -lst[i][0] / (lst[i + 1][0] - lst[i][0]) * (lst[i + 1][1] - lst[i][1]) + lst[i][1]];
        //var newpt = [360, 1];
        mynew.push([(lst[i][0] + 0), lst[i][1]]);
        mynew.push(newpt);

      } else {

        mynew.push([(lst[i][0] + 0), lst[i][1]]);
      }
    }

    var last = lst[lst.length - 1]
    mynew.push([(lst[i][0]), last[1]]);

    return mynew;
  } else {

    for (var i = 0; i < lst.length - 1; i++) {
      mynew.push([(lst[i][0] + 360) % 360, lst[i][1]]);

    }

    var last = lst[lst.length - 1]
    mynew.push([(lst[i][0] + 360) % 360, last[1]]);

    return mynew;



  }

}


function reptojectMap(lst) {
  var mylst = []
  for (k in lst) {
    mylst.push(map.project(lst[k]));
  }

  return mylst;
}

function flyalone(tgt, ratio, dis) {



  /*  if (ratio<0.01 || ratio>0.99){
      var myzoom = null;

      if (ratio<0.2001) myzoom = 0.2-ratio;
      if (ratio>0.7999) myzoom = 1-ratio;

      myzoom = myzoom/0.1*8 + 3;





    }

    else*/

  var zoomspan = 6;
  var mypitch = 0;

  //var myzoom = Math.pow((Math.abs(ratio - 0.5)), 8) * 128 * 2 * 2 * 2 * 2 + 3; //[3,10]

  if (dis < 1000) zoomspan = 3 + dis / 1000 * 5;



  if (ratio < 0.01){
    myzoom = 10 - ratio / 0.01 * zoomspan;
    //mypitch = (0.005-Math.abs(ratio - 0.005))/0.005*60;
  }
  else if (ratio > 0.99){
    myzoom = 10 - (1 - ratio) / 0.01 * zoomspan;
    //mypitch = (0.005-Math.abs(ratio - 0.995))/0.005*60;
  }
  else myzoom = 10 - zoomspan;

  map.jumpTo({
    // These options control the ending camera position: centered at
    // the target, at zoom level 9, and north up.

    center: tgt,
    zoom: myzoom,
    //zoom:1,
    bearing: 0,
    pitch:mypitch,

    // These options control the flight curve, making it move
    // slowly and zoom out almost completely before starting
    // to pan.
    // This can be any easing function: it takes a number between
    // 0 and 1 and returns another number between 0 and 1.


    easing: function(t) {

      return t;
    }
  });

}

function flyZoomed(tgt, ratio, dis) {
  var zoomspan = null;
  zoomspan = dis / 100 * 4;
  if (dis < 50) zoomspan = 2;
  var mypitch = (0.5-Math.abs(ratio - 0.5))*80;
  var myzoom = Math.pow((Math.abs(ratio - 0.5)), 4) * 32 * 2 * zoomspan / 4 + (11 - zoomspan); //[7,11]
  if (dis < 0.1) {
    myzoom = 11;
    mypitch = 0;

  }


  map.jumpTo({
    // These options control the ending camera position: centered at
    // the target, at zoom level 9, and north up.

    center: tgt,
    zoom: myzoom-1,
    bearing: 0,
    pitch:mypitch,

    // These options control the flight curve, making it move
    // slowly and zoom out almost completely before starting
    // to pan.
    // This can be any easing function: it takes a number between
    // 0 and 1 and returns another number between 0 and 1.


    easing: function(t) {

      return t;
    }
  });
}



function flyto(tgt, spd) {

  map.flyTo({
    // These options control the ending camera position: centered at
    // the target, at zoom level 9, and north up.
    center: tgt,
    zoom: 11,
    bearing: 0,

    // These options control the flight curve, making it move
    // slowly and zoom out almost completely before starting
    // to pan.
    speed: spd, // make the flying slow
    curve: 1, // change the speed at which it zooms out

    // This can be any easing function: it takes a number between
    // 0 and 1 and returns another number between 0 and 1.



    easing: function(t) {
      $("#fake_track1").attr("opacity", 2 * Math.abs(0.5 - t));
      $("#fake_track2").attr("opacity", 2 * Math.abs(0.5 - t));

      return t;
    }
  });
}


function ZOOMOUT(spd) {

  map.flyTo({
    // These options control the ending camera position: centered at
    // the target, at zoom level 9, and north up.
    //center: tgt,
    zoom: 5,
    bearing: 0,

    // These options control the flight curve, making it move
    // slowly and zoom out almost completely before starting
    // to pan.
    speed: spd, // make the flying slow
    curve: 100, // change the speed at which it zooms out

    // This can be any easing function: it takes a number between
    // 0 and 1 and returns another number between 0 and 1.
    easing: function(t) {
      return t;
    }
  });
}

function ZOOMIN(spd) {

  map.flyTo({
    // These options control the ending camera position: centered at
    // the target, at zoom level 9, and north up.
    //center: tgt,
    zoom: 11,
    bearing: 0,

    // These options control the flight curve, making it move
    // slowly and zoom out almost completely before starting
    // to pan.
    speed: spd, // make the flying slow
    curve: 100, // change the speed at which it zooms out

    // This can be any easing function: it takes a number between
    // 0 and 1 and returns another number between 0 and 1.
    easing: function(t) {
      return t;
    }
  });
}


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

var getKey = function(placeList, i) { //get the certain node from the place list
  var item = 0;
  var key = null;
  for (k in placeList) {

    if (item === i) {
      key = k;
      break;
    }
    item++;

  }
  return key;
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
    var important = places[keys[i]][3].length + places[keys[i]][4].length + places[keys[i]][5].length;
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
  /*  if (dis < threshA || dis > threshB) {
   */
  for (var i = 0; i <= num; i++) {
    var t = i / num
    var node = interPt(nodeA, nodeB, t);
    lst.push(node);
  }
  /*  } else {
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
  */
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
    if (state === null) returnvalue = country;

    returnvalue = returnvalue.toUpperCase();
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


var mapw = $(window).width(),
  maph = $(window).height();
var width = mapw / 6,
  height = mapw / 6;
$("#control").css("height", maph - 300);
$("#tablepath").css("height", maph - 300);
$("#abouttb").css("top", maph + 100);
$("#teamtb").css("top", maph + 100 + $("#abouttb").height());
$("#map").css("width", mapw);
$("#map").css("height", maph);
$("#map").css("top", "0px");
$("#nowpath_title").css("top", maph - 75);
$("#nowpath_title").css("left", mapw / 6 + 30);
$("#tablepath").css("left", mapw / 6 + 30);
$("#tablepath").css("top", 195);
$("#page").css("height", maph);
$("#page").css("width", mapw);

//$("#map").fadeOut(0);

var margin = {
  top: 40,
  right: 40,
  bottom: 40,
  left: 40
};


var places_multi = {};
var route_multi = {};

var curPath = 0; //the path that is currently showing
var projection = d3.geo.orthographic()
  .scale(width / 2.1)
  .translate([width / 2, height / 2])
  .precision(1);
var graticule = d3.geo.graticule();
var target;
var myroute;
var CuRoute;
var CuRoute_blur;
var pastRoute;
var pastRoute_blur;
var places;
var route;
var routeRam; //route after randomness
var timeMark;
var timeBase;

var route_m; //data
var route_map; //svg path
var pastRoute_map;
var route_map_blur; //svg path
var pastRoute_map_blur;

var svgmap = d3.select("#draw").append("svg").attr("class", "svgmap")
  .attr("width", mapw)
  .attr("height", maph);

var svgpage = d3.select("#draw").append("svg").attr("class", "svgpage")
  .attr("width", mapw)
  .attr("height", maph);

var canvas = d3.select("#draw").append("canvas").attr("class", "mycanvas")
  .attr("width", width)
  .attr("height", height);
$(".mycanvas").css("transform", "translate(20px," + (maph - height - 50) + "px)");

var context = canvas.node().getContext("2d");
/*
d3.select("#draw").append("div").attr("id", "map")
  .attr("width", width)
  .attr("height", height);
*/



var svg0 = d3.select("#draw").append("svg").attr("class", "mysvg")
  .attr("width", mapw)
  .attr("height", maph);
var svg = svg0.append("g").attr("class", "globe");
$(".globe").css("transform", "translate(20px," + (maph - height - 50) + "px)");

var underbar = svgpage.append("rect")
  .attr("x", 0)
  .attr("y", maph - 100)
  .attr("width", mapw)
  .attr("height", 100)
  .attr("fill", "rgb(20,20,20)");

var underbar_mark = svgpage.append("rect")
  .attr("x", 0)
  .attr("y", maph - 100)
  .attr("width", mapw / 6 + 30)
  .attr("height", 4.5)
  .attr("fill", "#39a4e8");


var topbar = svgpage.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", mapw)
  .attr("height", 60)
  .attr("fill", "rgb(20,20,20)");

var mitlogo = d3.select("#draw").append("img").attr("class", "mitlogo");

$(".mitlogo")
  .attr("src", "img/mit_logo.png");

var toptitle = d3.select("#draw").append("div").append("p").attr("class", "toptitle")
  .text("MONITOUR")
  .attr("style", "left:" + (mapw / 2 - 50) + "px");

var toptitle = d3.select("#draw").append("div").append("p").attr("class", "menu")
  .text("About")
  .attr("style", "left:" + (mapw - 100) + "px");

var path = d3.geo.path()
  .projection(projection)
  .context(context);

var patho = d3.geo.path()
  .projection(projection);

var lineFunction = d3.svg.line()
  .x(function(d) {
    return d.x;
  })
  .y(function(d) {
    return d.y;
  })
  .interpolate("linear");


var sphere = {
  type: "Sphere"
};
var nodeNum; //total node amount
var nowNum = 1; //current node to target to
var oneMove_default = 200;
var oneMove = oneMove_default; //the interval for each focus
var countmove = 1;
var count = 0; //to measure the interval
var point;
var track;
var track_f;
var track_ff;


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
var nowMedia = 0;
var finishsign = 0;

//addPoly([]);

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

  places = getNode(places_multi, curPath);
  route = getNode(route_multi, curPath);
  routeRam = jQuery.extend(true, {}, route); //deep copy
  routeRam.coordinates = ramwhole(routeRam.coordinates, 0);
  route_m = jQuery.extend(true, {}, routeRam);
  route_m.coordinates = reptojectMap(route_m.coordinates);

  datelst.sort();
  var newdl = []
  for (i in datelst) {
    newdl.push(getDate(datelst[i]));
  }

  var minDate = newdl[0],
    maxDate = newdl[newdl.length - 1];

  xScale = d3.time.scale()
    .domain([minDate, maxDate])
    .range([mapw * 0.35, mapw * 0.9]);


  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .ticks(d3.time.month, 1)
    .tickFormat(d3.time.format('%b %Y'))
    .tickSize(5)
    .tickPadding(50);

  var pathNum = Object.size(places_multi); //how many path is in the data list
  //add check box for paths

  var id = 0;
  for (key in places_multi) {

    d3.select("#tablepath")
      .append("div")
      .attr("class", "thepaths")
      .attr("id", id).append("p")
      .text(key.toString().toUpperCase());
    id++;
  }

  var localnum = ($(window).height() - 300) / (id) * 0.8;
  $("#tablepath div").css("height", localnum + "px");

  $(document).ready(main); //run jquery after csv loaded so path button initialized

  nodeNum = route.coordinates.length //the total number of nodes

  svg.append("filter")
    .attr("id", "blur-effect-1")
    .append("feGaussianBlur")
    .attr("stdDeviation", 1);
  svg.append("filter")
    .attr("id", "blur-effect-2")
    .append("feGaussianBlur")
    .attr("stdDeviation", 1.5);

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

  route_map = svgmap.append("path")
    .attr("class", "route_map")
    .attr("d", lineFunction(route_m.coordinates))
    .attr("stroke", "white")
    .attr("stroke-width", "3px")
    .attr("fill", "none");
  route_map_blur = svgmap.append("path")
    .attr("class", "route_map_blur")
    .attr("d", lineFunction(route_m.coordinates))
    .attr("stroke", "white")
    .attr("stroke-width", "3px")
    .attr("fill", "none");


  CuRoute = svg.append("path") //current route
    .attr("class", "curroute")
  CuRoute_blur = svg.append("path") //current route
    .attr("class", "curroute_blur")


  pastRoute = svg.append("path") //current route
    .attr("class", "pastroute")
  pastRoute_blur = svg.append("path") //current route
    .attr("class", "pastroute_blur")
  pastRoute_map = svgmap.append("path") //current route
    .attr("class", "pastroute_map")
    .attr("stroke", "white")
    .attr("stroke-width", "3px")
    .attr("fill", "none");
  pastRoute_map_blur = svgmap.append("path") //current route
    .attr("class", "pastRoute_map_blur")
    .attr("stroke", "white")
    .attr("stroke-width", "3px")
    .attr("fill", "none");


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
    .on("click", function(d, i) {
      nowNum = i;
      updateContent(nowNum);
      moveToggle = false;
      cont = true; //loop not started
      count = oneMove_default - 0.01; //to measure the interval
      flyto(getNode(places, nowNum), 3);
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
    .attr("r", 5)
    .attr("fill", "none")
    .attr("stroke", "#39a4e8")
    .attr("stroke-width", "3px")
    .attr("transform", "translate(100,100)");

  track_f = svg0.append("g") //red circle
    .append("circle")
    .attr("class", "track")
    .attr("id", "fake_track2")
    .attr("r", 2)
    .attr("fill", "none")
    .attr("stroke", "#39a4e8")
    .attr("stroke-width", "3px")
    .attr("transform", "translate(" + mapw / 2 + "," + maph / 2 + ")");

  track_ff = svg0.append("g") //red circle
    .append("circle")
    .attr("class", "track")
    .attr("id", "fake_track1")
    .attr("r", 3)
    .attr("fill", "white")
    .attr("stroke", "white")
    .attr("stroke-width", "3px")
    .attr("transform", "translate(" + mapw / 2 + "," + maph / 2 + ")");

  svg0.append('g')
    .attr('class', 'xaxis')
    .attr('transform', 'translate(' + margin.left + ', ' + (maph - margin.top - margin.bottom) + ')')
    .call(xAxis);


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
      return "translate(" + myx + "," + (maph - margin.top - margin.bottom + 2.5) + ")";
    })
    .on("click", function(d, i) {
      nowNum = i;
      updateContent(nowNum);
      moveToggle = false;
      cont = false; //loop not started
      count = oneMove_default - 0.01; //to measure the interval
      flyto(getNode(places, nowNum), 3);

    });

  timeBase.append("rect")
    .attr("class", "timebaserect")
    .attr("y", 17)
    .attr("x", -0.75)
    .attr("width", 1.5)
    .attr("height", 10)
    .attr("fill", "rgb(100,100,100)")
    .on("mouseover", function() {

    });

  d3.select(".xaxis path").remove();


  d3.select(".xaxis").append("rect")
    .attr("x", mapw * 0.3)
    .attr("y", 5)
    .attr("width", mapw * 0.65)
    .attr("height", 40)
    .attr("stroke", "none")
    .attr("fill", "rgb(50,50,50)");


  d3.select(".xaxis").append("line")
    .attr("x1", mapw * 0.3)
    .attr("y1", 25)
    .attr("x2", mapw * 0.95)
    .attr("y2", 25)
    .attr("stroke-width", 1)
    .attr("stroke", "rgb(20,20,20)");


  timeMark = svg0.append("g") //time mark
    .append("rect")
    .attr("class", "timemark")
    .attr("transform", "translate(100," + (maph - margin.bottom) + ")");

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

var fps = d3.select("#fps span");

var time0 = Date.now(),
    time1;

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
        countmove = 2;
      } else {
        countmove = 1;
      }

      var local_scale = 1;
      if (count / oneMove <= 0.01 || count / oneMove >= 0.99) {//start and end
        if (dis >= 100) {//long distance path

          //local_scale = (0.5-Math.abs(0.5-count / oneMove))*19/20+1/20;
          local_scale = 1 / 25;//move slow
        } else if (dis > 0.1) local_scale = 1;//move slow
        else local_scale = 10;//move fast
      } else {//interval path
        if (dis >= 100) local_scale = 1;//regular speed
        else if (dis > 0.1)
          local_scale = 1;
        else
          local_scale = 10;
      }

      if (moveToggle) {
        if (Math.abs(count - oneMove) < countmove * local_scale) { //one move is finished, start the next one
          //if next one have notes, stop there,otherwise keep moving

          if (finishsign === 0) {

            updateContent(nowNum);
            cont = false;
            finishsign = 1;
          }

          var keys = Object.keys(places);
          var important = places[keys[nowNum]][3].length + places[keys[nowNum]][4].length + places[keys[nowNum]][5].length;
          if (important > 0) important = true;
          else important = false;

          if (!important) {
            if (nowNum + 1 != nodeNum) {
              count = 0;
              nowNum = nowNum + 1; //next node to target
              nowNum = nowNum % nodeNum; //cycle the loop
              moveToggle = true;
            } else {}


          } else if (cont) {
            updateContent(nowNum);
            cont = false;
            //moveToggle = false;
          }


        } else { //move is not finished
          count += countmove * local_scale;
          finishsign = 0;
        }
      }

      var timephase = count % oneMove; //the current phase of this move
      var phasePercentage = timephase / oneMove; //the completion percentage of the current move

      //phasePercentage = Math.sqrt(phasePercentage)||0;
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
      else
        pastData.coordinates = [];

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
      //console.log(phasePercentage);

      timeMark
        .attr("transform", "translate(" + xScale(getNode(places, nowNum)[2]) + "," + (maph - margin.top - margin.bottom + 2.5) + ")");

      track
        .attr("transform", translateAlong2(CuRoute.node(), (1)));


      var mylat, mylng;
      var raw = track.attr("transform")
      raw = raw.split("(")[1];
      raw = raw.split(")")[0];
      mylat = raw.split(",")[0];
      mylng = raw.split(",")[1];

      var p_r = projection.invert(
        [mylat, mylng]
      );


      point.attr("transform", function(d) { //rotate the nodes
        return "translate(" + projection(d.value) + ")";
      });

      var closeRate = Math.abs(0.5 - phasePercentage);

      //var test = closeRate * 0 + 1; //scale factor
      if (dis < 100) {
        //test = 1;
        flyZoomed(p_r, phasePercentage, dis);
      } else {
        flyalone(p_r, phasePercentage, dis);
      }

      var newlst = [
        [lat_old, lng_old], p_r
      ];


      if (lat_old < 0 && p_r[0] > 0 && p_r[0] - lat_old < 180) {

        var newpt = [0, -lat_old / (p_r[0] - lat_old) * (p_r[1] - lng_old) + lng_old]

        newlst = [
          [lat_old, lng_old], newpt, [p_r[0], p_r[1]]
        ];

      } else if (lat_old < 0 && p_r[0] > 0 && p_r[0] - lat_old > 180) {
        newlst = [
          [lat_old + 360, lng_old],
          [p_r[0], p_r[1] + 360]
        ];



      }

      route_m.coordinates = reptojectMap(newlst);
      route_map
        .attr("d", lineFunction(route_m.coordinates));
      route_map_blur
        .attr("d", lineFunction(route_m.coordinates));


      if (nowNum != 1) {
        console.log(fixloop(pastData.coordinates).length);

        pastRoute_map //create current route
          .attr("d", lineFunction(reptojectMap(fixloop(pastData.coordinates))));
        pastRoute_map_blur //create current route
          .attr("d", lineFunction(reptojectMap(fixloop(pastData.coordinates))));

      } else {
        pastRoute_map //create current route
          .attr("d", lineFunction([]));
        pastRoute_map_blur //create current route
          .attr("d", lineFunction([]));
      }

      track.attr("r", 4 * (trackscale % 1) + 2); //change the tracker's r according to closerate
      track_f.attr("r", 2 * (trackscale % 4) + 4); //change the tracker's r according to closerate

      context.beginPath(); //draw the outbound of the sphere
      path(sphere);
      context.lineWidth = 1;
      context.strokeStyle = "#999";
      context.stroke();
      context.fillStyle = "rgba(50,50,50,0.9)";
      context.fill();

      projection.clipAngle(90); //clip the back half of the land

      context.beginPath();
      path(land);
      context.fillStyle = "rgb(25,25,25)";
      context.fill();
      context.lineWidth = .5;
      context.strokeStyle = "#000";
      context.stroke();

      context.beginPath(); //grid
      path(grid);
      context.lineWidth = .2;
      context.strokeStyle = "rgba(119,119,119,.5)";
      context.stroke();


  time1 = Date.now();
  fps.text(Math.round(1000 / (time1 - time0)));
  time0 = time1;

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
    .on("click", function(d, i) {
      nowNum = i;
      updateContent(nowNum);
      moveToggle = false;
      cont = false; //loop not started
      count = oneMove_default - 0.000001; //to measure the interval
      flyto(getNode(places, nowNum), 3);

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
    .attr("stroke", "#39a4e8")
    .attr("stroke-width", "3px")
    .attr("transform", "translate(100,100)");

  track_f = svg0.append("g") //red circle
    .append("circle")
    .attr("class", "track")
    .attr("id", "fake_track2")
    .attr("r", 2)
    .attr("fill", "none")
    .attr("stroke", "#39a4e8")
    .attr("stroke-width", "3px")
    .attr("transform", "translate(" + mapw / 2 + "," + maph / 2 + ")");

  track_ff = svg0.append("g") //red circle
    .append("circle")
    .attr("class", "track")
    .attr("id", "fake_track1")
    .attr("r", 3)
    .attr("fill", "white")
    .attr("stroke", "white")
    .attr("stroke-width", "3px")
    .attr("transform", "translate(" + mapw / 2 + "," + maph / 2 + ")");

  $(".timeid").remove();

  timeBase = svg0.select(".timebase") //time mark
    .selectAll("g")
    .data(d3.entries(places))
    .enter().append("g")
    .attr("transform", function(d) {
      var myx = xScale(d.value[2]);
      return "translate(" + myx + "," + (maph - margin.top - margin.bottom + 2.5) + ")";
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
      count = oneMove_default - 0.01; //to measure the interval
      flyto(getNode(places, nowNum), 3);

      if (nowNum === 0) {
        nowNum = 1;
        count = 0;


      }

    });

  timeBase.append("rect")
    .attr("class", "timebaserect")
    .attr("y", 17)
    .attr("x", -0.75)
    .attr("width", 1.5)
    .attr("height", 10)
    .attr("fill", "#565656")
    .on("mouseover", function() {
      console.log("oer");
    });


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