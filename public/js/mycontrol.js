var initContent = function() {

  d3.select("#story")
    .append("p")
    .text(getNode(places, 0)[4])

  d3.select("#title")
    .append("p")
    .text(getNode(places, 0)[3])

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
    }
  );

  $("#tablepath div").mouseover( //hover the new route, will show the preview of this one
    function(event) {
      //console.log($(this).attr("id")      );
      d3.select("#pre").attr("style", "width:300px;");

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
      } else
        moveToggle = true;

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
        mynav.append("div").text("Home").attr("id", "home");
        mynav.append("div").text("Visualization").attr("id", "viz");
        mynav.append("div").text("About").attr("id", "about");
        mynav.append("div").text("Team").attr("id", "team");
        mynav.transition()
          .duration(500)
          .attr("style", "opacity:1;");

        $("#home").click(
          function() {
            inithome(500);
          }
        );


        $("#viz").click(
          function() {
            console.log("viz");
            $("#tablepath").fadeIn(500);
            $("#draw").fadeIn(500);
            $("#control").fadeIn(500);
            $("#pre").fadeIn(500);

            $("#abouttb").fadeOut(500);

            $("#teamtb").fadeOut(500);
          }
        );

        $("#about").click(
          function() {
            console.log("about");
            $("#tablepath").fadeOut(500);
            $("#draw").fadeOut(500);
            $("#control").fadeOut(500);
            $("#pre").fadeOut(500);

            $("#teamtb").fadeOut(500);

            $("#abouttb").fadeIn(500);
          }
        );

        $("#team").click(
          function() {
            console.log("team");
            $("#tablepath").fadeOut(500);
            $("#draw").fadeOut(500);
            $("#control").fadeOut(500);
            $("#pre").fadeOut(500);

            $("#abouttb").fadeOut(500);

            $("#teamtb").fadeIn(500);

          }
        );



        /*        $("#tablepath").fadeOut(500);
                $("#draw").fadeOut(500);
                $("#control").fadeOut(500);
                $("#pre").fadeOut(500);
        */

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



};

var inithome = function(time) {

  $("#tablepath").fadeOut(time);
  $("#draw").fadeOut(time);
  $("#control").fadeOut(time);
  $("#pre").fadeOut(time);
  
  $("#abouttb").fadeOut(time);

  $("#teamtb").fadeOut(time);

}