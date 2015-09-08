var nowPage = 0;
var allPage = 4;



var initContent = function() {

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
    .text(getKey(places_multi, 0).toUpperCase());

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
  console.log(num);


  if (num != 0 && cont === true) {
    console.log("zoomout");
    //fly(getNode(places, nowNum));
    //flyto(getNode(places, nowNum),3);
    cont === true;
  }

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
      .text(getNode(places, num)[3]);
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



//main jquery function

var main = function() {
  inithome(0);

  $("#tablepath div").click( //click the new route button, change the display to the new one
    function() {
      $("#tablepath div").removeClass("active");
      $(this).addClass("active");

      var thisid = $(this).attr("id");
      curPath = +thisid;
      update(curPath);
      moveToggle = false;
      cont = false; //loop not started
      //flyto(getNode(places, nowNum),0.8);
      $("#tablepath").fadeOut(500);

      d3.select("#nowpath_title")
        .select("p").remove();

      d3.select("#nowpath_title")
        .append("p")
        .text(getKey(places_multi, curPath).toUpperCase());



    }
  );

  $("#tablepath div").mouseover( //hover the new route, will show the preview of this one
    function(event) {

      d3.select("#pre").attr("style", "width:300px; display:block;");

      var precanvas = d3.select("#pre").append("svg")
        .attr("id", "preview");
      var myY = null
      myY = event.pageY - 160;

      precanvas.attr("style", "top:" + myY + "px;");

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
          .attr("stroke", "#fffcf0")
          .attr("fill", "none")
          .attr("d", pre_path);

      });
    }
  );

  $("#tablepath div").mouseout( //move out of the mouse, will undo the preview
    function() {
      d3.select("#preview").remove();
      d3.select("#pre").attr("style", "width:0px;");
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

        console.log("zoomout");
        //flyto(getNode(places, nowNum),3);



      } else {

        console.log("zoomout");


        moveToggle = true;

      }

      //animations when next button is clicked



      updateContent(nowNum);
      cont = true; //loop starts

      finishsign = 0;
    }
  );

  $("#stop").click(
    function() {
      cont = false; //loop starts
      moveToggle = false;
      finishsign = 0;
    }
  );


  $("#prev_c").click(
    function() {
      var len = $(".media_in").length

      $("#media" + nowMedia).hide();
      nowMedia--;
      if (nowMedia < 0) nowMedia = len - 1;

      if (!($("#media" + nowMedia).attr("src").length > 0)) {
        nowMedia++;
        nowMedia = nowMedia % len;
      }
      $("#media" + nowMedia).fadeIn(500);
    }
  );

  $("#next_c").click(
    function() {
      var len = $(".media_in").length

      $("#media" + nowMedia).hide();
      nowMedia++;
      nowMedia = nowMedia % len;

      if (!($("#media" + nowMedia).attr("src").length > 0)) {
        nowMedia--;
        if (nowMedia < 0) nowMedia = len - 1;
      }
      $("#media" + nowMedia).fadeIn(500);
    }
  );

  var localcontrol = true;
  $("#nowpath_title").click(
    function() {
      if (localcontrol) {
        $("#tablepath").fadeIn(500);
        localcontrol = false;
      } else {
        $("#tablepath").fadeOut(500);
        localcontrol = true;
      }
    }
  )


  var hover = 0;
  $("#menu").hover(
    function() {
      if (hover === 0) { //the time that I move in
        hover = 1;
        d3.select("#menu").attr("style", "height:30px; ");
        d3.select("#menu").transition()
          .duration(500)
          .attr("style", "height:200px; background-color: rgba(39,39,50,0.95);");

        var mynav = d3.select("#menu").append("nav").attr("class", "mynav").attr("style", "opacity:0;");
        mynav.append("div").text("Home").attr("id", "home").attr("class", "page0");
        mynav.append("div").text("Visualization").attr("id", "viz").attr("class", "page1");
        mynav.append("div").text("About").attr("id", "about").attr("class", "page2");
        mynav.append("div").text("Team").attr("id", "team").attr("class", "page3");
        mynav.transition()
          .duration(500)
          .attr("style", "opacity:1;");

        $("#home").click(
          function() {
            changePage(0);
          }
        );

        $("#viz").click(
          function() {
            changePage(1);
          }
        );

        $("#about").click(
          function() {
            //changePage(2);
            $("#abouttb").get(0).scrollIntoView();

          }
        );

        $("#team").click(
          function() {
            //changePage(3);
            $("#teamtb").get(0).scrollIntoView();

          }
        );

      } else { //the time that I move out
        hover = 0;
        d3.select("#menu")
          .transition()
          .duration(500)
          .attr("style", "height:30px; background-color : rgba(100,100,100,0.2)");

        $(".mynav").fadeOut(500, function() {
          $(this).remove();
        })

      }
    });


  $(window).bind('mousewheel DOMMouseScroll', function(event) {
    if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
      // scroll up

    } else {
      // scroll down
      nowPage++;
      if (nowPage == 3) nowPage = 2;

      changePage(nowPage);
    }
  });

};

var inithome = function(time) {

  $("#tablepath").fadeOut(time);
  $("#draw").fadeOut(time);

  $("#map").fadeOut(time);
  $("#control").fadeOut(time);
  $("#pre").fadeOut(time);

  $("#abouttb").fadeOut(time);

  $("#teamtb").fadeOut(time);

  $("#hometb").fadeIn(500);
  $("#nowpath_title").fadeOut(time);

  nowPage = 0;

}

var changePage = function(page) {

  if (page === 0) {
    inithome(500);
    $("#map").fadeOut(0);
  } else if (page === 1) {
    $("html, body").animate({
      scrollTop: 0
    }, "fast");

    // flyto(getNode(places, nowNum),3);

    //$("#tablepath").fadeIn(500);
    $("#draw").fadeIn(500);
    $("#map").fadeIn(500);
    $("#control").fadeIn(500);
    $("#pre").fadeIn(500);

    $("#abouttb").fadeOut(500);

    $("#teamtb").fadeOut(500);

    $("#hometb").fadeOut(500);
    $("#nowpath_title").fadeIn(500);

  }
  /*else if (page === 2) {
      $("#tablepath").fadeOut(500);
      $("#draw").fadeOut(500);
      $("#control").fadeOut(500);
      $("#pre").fadeOut(500);

      $("#teamtb").fadeOut(500);

      $("#abouttb").fadeIn(500);

      $("#hometb").fadeOut(500);



    } else if (page === 3) {
        $("#tablepath").fadeOut(500);
        $("#draw").fadeOut(500);
        $("#control").fadeOut(500);
        $("#pre").fadeOut(500);

        $("#abouttb").fadeOut(500);

        $("#teamtb").fadeIn(500);

        $("#hometb").fadeOut(500);



      }
*/
}