
var animate_path = function(){

      for (k in route_multi) { //add paths
        var name = k.toString();
        var newlst = fixloop2(route_multi[k].coordinates);
        var lstprojected = reptojectMap0(newlst);

        var lineraw = curvePath(curvePath(curvePath(curvePath(curvePath(lstprojected)))));
        console.log(".overall_path_"+name);

        d3.select(".overall_path_"+name).transition()
                       .delay(0)
                       .duration(15000)
                       .attrTween("d", getSmoothInterpolation(lineraw));//need a reference to the function

      }

  
}



var switchDetail = function(show) {

  if (show) {
    d3.select("#detail_button p").text("Hide Detail");
    d3.select("#detail_button img").attr("src", "img/down_arrow.png");
    detail_control = false;

    $('#device_icon').show();
    $('#distance').show();
    $('#days').show();
    $(".underbar").css("bottom",0);


  } else {

    d3.select("#detail_button p").text("Show Detail");
    d3.select("#detail_button img").attr("src", "img/up_arrow.png");
    detail_control = true;
    $(".underbar").css("bottom",-150);


  }



/*  var dis = 150 * show;
  var dur = 1000;


  d3.select("#detail_button").transition()
    .style("top", (maph - 73 - dis) + "px").duration(dur);

/*  underbar.transition()
    .attr("y", maph - 100 - dis)
    .attr("height", 100 + dis)
    .duration(dur);
  underbar_mark.transition()
    .attr("y", maph - 100 - dis)
    .duration(dur);
*/
/*  d3.select(".mycanvas").transition()
    .attr("style", "transform: translate(20px," + (maph - height - 60 - dis) + "px)").duration(dur);

  d3.select(".globe").transition()
    .attr("style", "transform: translate(20px," + (maph - height - 60 - dis) + "px)").duration(dur);

  d3.select("#nowpath_title").transition()
    .style("top", (maph - 75 - dis) + "px").duration(dur);

  timeBase.transition()
    .attr("transform", function(d) {
      var myx = xScale(d.value[2]);
      return "translate(" + myx + "," + (maph - margin.top - margin.bottom + 2.5 - dis) + ")";
    }).duration(dur);

  timeMark.transition()
    .attr("transform", "translate(" + xScale(getNode(places, nowNum)[2]) + "," + (maph - margin.top - margin.bottom + 2.5 - dis) + ")")
    .duration(dur);

  d3.select('.xaxis').transition()
    .attr('transform', 'translate(' + margin.left + ', ' + (maph - margin.top - margin.bottom - dis) + ')')
    .duration(dur);

  d3.select('#device_icon').transition()
    .style("top", (maph - 10 - dis) + "px")
    .duration(dur);
  d3.select('#distance').transition()
    .style("top", (maph + 10 - dis) + "px")
    .duration(dur);

  d3.select('#days').transition()
    .style("top", (maph + 75 - dis) + "px")
    .duration(dur);

  d3.select('#tablepath').transition()
    .style("top", (maph - 650 - dis) + "px")
    .duration(dur);*/

  //$("#nowpath_title").css("top", maph - 75-dis);

}


var initContent = function() {
  timeMark
    .attr("transform", "translate(" + xScale(getNode(places, nowNum)[2]) + "," + (20 + 2.5) + ")");

  d3.select("#number")
    .append("p")
    .text("01");


  d3.select("#story")
    .append("p")
    .text(getNode(places, 0)[4]);

  d3.select("#title")
    .append("p")
    .text(getNode(places, 0)[3].toUpperCase());

  d3.select("#Coordnum")
    .append("p")
    .text(getNode(places, 0)[0] + "  |  " + getNode(places, 0)[1]);

  d3.select("#nowpath_title")
    .append("p")
    .text(Object.keys(places_multi)[0].toUpperCase());

  revGeocoding(getNode(places, 0)[1], getNode(places, 0)[0], "location");

  var media = getNode(places, 0)[5].split(",");
  var img = [];
  var video = [];
  for (k in media) {
    if (media[k].indexOf(".jpg") > -1 || media[k].indexOf(".png") > -1 || media[k].indexOf(".gif") > -1) {
      img.push(media[k]);
    } else if (media[k].indexOf("youtube") > -1 || media[k].indexOf("vimeo") > -1) {
      video.push(media[k]);
    }
  }

  if (img.length === 0) img = [""];
  if (video.length === 0) video = [""];

  for (k in img)
    d3.select("#media_update")
    .append("img")
    .attr("id", "media" + k)
    .attr("class", "media_in")
    .attr("src", img[k]);

  for (k in video) {
    var thisnum = (+k + img.length);
    d3.select("#media_update")
      .append("iframe")
      .attr("id", "media" + thisnum)
      .attr("class", "media_in")
      .attr("src", video[k])
      .attr("width", 240)
      .attr("height", 240)
      .attr("allowfullscreen", "")
      .attr("webkitallowfullscreen", "")
      .attr("mozallowfullscreen", "");
  }

  $("#story p").fadeOut(0).fadeIn(1000);
  $("#title p").fadeOut(0).fadeIn(1000);
  $(".media_in").hide();
  $("#media0").show();

  $("#media_update").fadeOut(0).fadeIn(1000);

  $(".arrow").fadeOut(0);
  if ($("#media0").attr("src").length > 0 || $("#media1").attr("src").length > 0) { //have content
    $(".arrow").fadeIn(500);
  }


}



var updateContent = function(num) {

  if (num != 0 && cont === true) {
    cont === true;
  }

  timeMark
    .attr("transform", "translate(" + xScale(getNode(places, nowNum)[2]) + "," + (20 + 2.5) + ")");

  $(".keynum").fadeOut(500, function() {
    d3.select("#distance .keynum")
      .text(nowDis(pastData.coordinates));
    d3.select("#days .keynum")
      .text(nowDays(nowNum));

    $(".keynum").fadeOut(0).fadeIn(500);
  });


  $("#Coord p").fadeOut(500, function() {
    $(this).remove()
    d3.select("#Coord")
      .append("p")
      .text("Coord");
    $("#Coord p").fadeOut(0).fadeIn(500);
  });

  $("#Coordnum p").fadeOut(500, function() {
    $(this).remove()
    d3.select("#Coordnum")
      .append("p")
      .text(getNode(places, num)[0] + "  |  " + getNode(places, num)[1]);
    $("#Coordnum p").fadeOut(0).fadeIn(500);
  });

  $("#number p").fadeOut(500, function() {
    var strnum = nowNum;
    if (strnum.toString().length === 1) strnum = "0" + strnum.toString();

    $(this).remove()
    d3.select("#number")
      .append("p")
      .text(strnum);
    $("#number p").fadeOut(0).fadeIn(500);
  });

  $("#story p").fadeOut(500, function() {
    $(this).remove()
    d3.select("#story")
      .append("p")
      .text(getNode(places, num)[4]);
    $("#story p").fadeOut(0).fadeIn(500);
  });

  $("#title p").fadeOut(500, function() {
    $(this).remove()
    d3.select("#title")
      .append("p")
      .text(getNode(places, num)[3].toUpperCase());
    $("#title p").fadeOut(0).fadeIn(500);

  });

  $("#location").fadeOut(500, function() {
    $(this).remove();
    d3.select("#control").append("div").attr("id", "location");
    revGeocoding(getNode(places, num)[1], getNode(places, num)[0], "location");
    $("#location").fadeIn(500);
  })

  $("#media_update").fadeOut(500, function() {
    $(this).remove();
    d3.select("#media").append("div").attr("id", "media_update")
    var media = getNode(places, num)[5].split(",");
    var img = [];
    var video = [];
    for (k in media) {
      if (media[k].indexOf(".jpg") > -1 || media[k].indexOf(".png") > -1 || media[k].indexOf(".gif") > -1) {
        img.push(media[k]);
      }
      if (media[k].indexOf("youtube") > -1 || media[k].indexOf("vimeo") > -1) {
        video.push(media[k]);
      }
    }

    if (img.length === 0) img = [""];
    if (video.length === 0) video = [""];

    for (k in img) {
      d3.select("#media_update")
        .append("img")
        .attr("id", "media" + k)
        .attr("class", "media_in")
        .attr("src", img[k]);
    }

    for (k in video) {
      var cnum = +k + img.length;
      d3.select("#media_update")
        .append("iframe")
        .attr("id", "media" + cnum)
        .attr("class", "media_in")
        .attr("src", video[k])
        .attr("width", 240)
        .attr("height", 240)
        .attr("allowfullscreen", "")
        .attr("webkitallowfullscreen", "")
        .attr("mozallowfullscreen", "");
    }


    $("#media_update").fadeOut(0);
    $(".media_in").hide();
    $("#media0").show();
    $("#media_update").fadeIn(500);

    if ($("#media0").attr("src").length > 0 || $("#media1").attr("src").length > 0) { //have content
      $(".arrow").fadeIn(500);



    } else $(".arrow").fadeOut(0);

  });



}