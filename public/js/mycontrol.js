var nowPage = 0;
var allPage = 4;
var detail_control = true;

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
      $("#tablepath").fadeOut(100);

      d3.select("#nowpath_title")
        .select("p").remove();

      d3.select("#nowpath_title")
        .append("p")
        .text(Object.keys(places_multi)[curPath].toUpperCase());

      localcontrol = true;

    }
  );

  $("#tablepath div").mouseover( //hover the new route, will show the preview of this one
    function(event) {

      d3.select("#pre").attr("style", "width:300px; display:block;"); //

      var precanvas = d3.select("#pre").append("svg")
        .attr("id", "preview");
      var myY = null
      myY = event.pageY - 160;

      precanvas.attr("style", "top:" + (myY + 24) + "px;");

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
      //if(next_control)
      if (next_control) {
        next_control = false;
        switchDetail(0);

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
          next_control = true;

        } else {

          moveToggle = true;

        }

        //animations when next button is clicked



        updateContent(nowNum);
        cont = true; //loop starts

        finishsign = 0;


      }


    }
  );

  $("#stop").click(
    function() {
      cont = false; //loop starts
      moveToggle = false;
      finishsign = 0;
      next_control = true;
    }
  );


  $(".prev_c").click(
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

  $(".next_c").click(
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
        $("#tablepath").fadeIn(100);
        localcontrol = false;
      } else {
        $("#tablepath").fadeOut(100);
        localcontrol = true;
      }
    }
  )

  var localcontrol2 = true;
  $(".menu").click(
    function() {
      if (localcontrol2) {
        $(".menucontent").fadeIn(100);
        localcontrol2 = false;
      } else {
        $(".menucontent").fadeOut(100);
        localcontrol2 = true;

      }
    }
  );

  $("#team").click(
    function() {
      $(".hidden_info").show();
      $(".menucontent").fadeOut(100);
      localcontrol2 = true;

      $("#aboutbk").fadeOut(0).fadeIn(200);
      $("#teamtb").fadeOut(0).fadeIn(200);
    }
  );

  $("#teamtb img").click(
    function() {
      $(".hidden_info").hide();
      $("#aboutbk").fadeOut(0);
      $("#teamtb").css("display", "inline").fadeOut(0);
    }
  );

  $("#intro").click(
    function() {
      $(".hidden_info").show();

      $(".menucontent").fadeOut(100);
      localcontrol2 = true;

      $("#aboutbk").fadeOut(0).fadeIn(200);
      $("#abouttb").fadeOut(0).fadeIn(200);
    }
  );

  $("#abouttb img").click(
    function() {
      $(".hidden_info").hide();
      $("#aboutbk").fadeOut(0);
      $("#abouttb").fadeOut(0);
    }
  );

  $("#detail_button").click(
    function() {
      if (detail_control) {
        switchDetail(1);
      } else {
        switchDetail(0);
      }
    }
  );

  $("#explore").click(
    function() {

            $(".home").fadeOut(1000, function() {

              $("#info_0").fadeIn(1000, function() {
                $(this).delay(4000).fadeOut(1000, function() {
                  $("#info_1").fadeIn(1000, function() {
                    $(this).delay(7000).fadeOut(1000, function() {
                      $("#info_2").fadeIn(1000, function() {
                        $(this).delay(2000).fadeOut(1000, function() {
                          locreplay = false;
                          locloop = false; //to stop the loop
                          resize();
                          animate_path();
                          $("#info_3").fadeIn(5000);
                        });
                      });
                    });
                  });
                });
              });
            });

/*      $(".home").fadeOut(1000, function() {

        $("#info_0").fadeIn(0, function() {
          $(this).fadeOut(0, function() {
            $("#info_1").fadeIn(0, function() {
              $(this).fadeOut(0, function() {
                $("#info_2").fadeIn(0, function() {
                  $(this).fadeOut(0, function() {
                    locreplay = false;
                    locloop = false; //to stop the loop
                    resize();
                    animate_path();
                    $("#info_3").fadeIn(0);
                  });
                });
              });
            });
          });
        });
      });
*/


      //$(".underbar_back").fadeIn(1000);
    }
  );

  var mystyle = true;
  $(".change_Map").click(function() {
    if (mystyle) {
      mystyle = false;

      $(".change_map_mark").css("left", "50%");

      map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/dark-v8', //hosted style id
      });

    } else {
      mystyle = true;

      $(".change_map_mark").css("left", "0%");

      map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-v8',
      });


    }



  });


  $(".hint").click(function() {
    $(this).remove();

  })

  $("#globe").click(function() {
    $(".overall_map").fadeIn(1000);
    $(".draw").fadeOut(0);
    $("#control").fadeOut(0);
    $("#pre").fadeOut(0);
    //$(".underbar_back").fadeIn(1000);
    locloop = false; //to stop the loop
    resize();
    animate_path();
    locreplay = false;


  });


  $(".underbar_back div").click( //the "replay" button
    function() {
      if (locreplay) {
        locreplay = false;
        locloop = false; //to stop the loop
        resize();
        animate_path();
        //$($(".underbar_back")).fadeOut(1000);
      }
    }
  );



};

var inithome = function(time) {

  $("#draw").fadeOut(time);
  $("#control").fadeOut(time);
  $("#pre").fadeOut(time);
  $("#hometb").fadeIn(500);


  nowPage = 0;

}

var changePage = function(page) {
  if (page === 0) {
    inithome(500);
  } else if (page === 1) {
    $("html, body").animate({
      scrollTop: 0
    }, "fast");

    $(".draw").fadeOut(0).fadeIn(1000);
    $("#pre").fadeOut(0).fadeIn(1000);
    $("#control").fadeOut(0).fadeIn(1000);
    $(".overall_map").fadeOut(0);
    $(".home").fadeOut(0);
    //$(".underbar_back").fadeOut(0);

  }

}