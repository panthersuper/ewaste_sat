    var importantPath = function(lst) {
      //var important = places[keys[nowNum]][3].length + places[keys[nowNum]][4].length + places[keys[nowNum]][5].length;
      var myvar = 0;

      for (k in lst) {
        var a = lst[k][3];
        var b = lst[k][4];
        var c = lst[k][5];
        myvar += (a + b + c).length;
      }

      if (myvar > 0) return true;
      else return false;



    }


    function resize() {
      // update width

      map0.fitBounds(bound);

      d3.selectAll(".overall_path").remove();
      d3.selectAll(".mapnodes").remove();
      d3.selectAll(".mapnodes_first").remove();

      var count1 = 0;
      for (k in route_multi) { //add paths
        var name = k.toString();
        var testlst = route_multi[k].coordinates;

        var newlst = fixloop2(route_multi[k].coordinates);
        var lstprojected = reptojectMap0(newlst);

        var lineraw = curvePath(curvePath(curvePath(curvePath(curvePath(lstprojected)))));
        var linedata = lineFunction(lineraw);
        var linedata0 = lineFunction(lineraw.slice(0, 1));

        if (!importantPath(testlst)) {//add the path that don't have additional information
          lineGraph = d3.select(".allroutes").append("path").attr("class", "overall_path overall_path_" + name).attr("haveinfo", false)
            .attr("stroke", "rgba(255,255,255,0.3)")
            .attr("stroke-width", "1.5px")
            .attr("fill", "none").attr("d", linedata0).attr("opacity", 1).style("position", "absolute").attr("id", count1).attr("name", name);


          d3.select(".allroutes").append("circle").attr("class", "overall_path overall_path_circle_" + name) //add animation circle on each path
            .attr("r", 1)
            .attr("cx", lineraw[0].x)
            .attr("cy", lineraw[0].y)
            .attr("fill", "rgba(255,255,255,0.8)");
        }
        count1++;

      }

      count1 = 0;
      for (k in route_multi) { //add paths
        var name = k.toString();
        var testlst = route_multi[k].coordinates;

        var newlst = fixloop2(route_multi[k].coordinates);
        var lstprojected = reptojectMap0(newlst);

        var lineraw = curvePath(curvePath(curvePath(curvePath(curvePath(lstprojected)))));
        var linedata = lineFunction(lineraw);
        var linedata0 = lineFunction(lineraw.slice(0, 1));

        if (importantPath(testlst)) {//add path that have information
          lineGraph = d3.select(".allroutes").append("path").attr("class", "overall_path overall_path_" + name).attr("haveinfo", true)
            .attr("stroke", "#39a4e8")
            .attr("stroke-width", "1.5px")
            .attr("fill", "none").attr("d", linedata0).attr("opacity", 1).style("position", "absolute").attr("id", count1).attr("name", name);


          d3.select(".allroutes").append("circle").attr("class", "overall_path overall_path_circle_" + name) //add animation circle on each path
            .attr("r", 1)
            .attr("cx", lineraw[0].x)
            .attr("cy", lineraw[0].y)
            .attr("fill", "rgba(255,255,255,0.8)");
        }
        count1++;

      }

      for (k in route_multi) { //add nodes
        var nodes0 = fixloop2(route_multi[k].coordinates);
        var nodes = reptojectMap0(nodes0); //each path node list

        d3.select(".allroutes").append("circle").attr("class", "mapnodes_first") //add all first nodes
          .attr("cx", nodes[0].x).attr("cy", nodes[0].y).attr("ox", nodes0[0][0]).attr("oy", nodes0[0][1])
          .attr("r", 3).attr("fill", "rgb(22, 160, 133)")
          .on("mouseover", function() {

            d3.select(this).attr("r", 6);
            var info = d3.select(".extra_info").append("div").attr("class", "info").attr("style", "background:rgba(255,255,255,0.8);position:absolute;border-radius: 10px;left:" + (d3.mouse(this)[0] + 20) + "px;top:" + (d3.mouse(this)[1] + 10) + "px ");
            info.append("div").attr("class", "pop_city_name");
            revGeocoding_class(d3.select(this).attr("oy"), d3.select(this).attr("ox"), "pop_city_name");

          })
          .on("mouseout", function() {
            d3.select(this).attr("r", 3);
            d3.selectAll(".info").remove();
          });

      }

      //d3.selectAll(".citynames").remove();

      d3.selectAll(".overall_path").on("mouseover", function() {

        var haveinfo = d3.select(this).attr("haveinfo");

        var myid = +d3.select(this).attr("id");
        var myinfo = getNode(route_multi, myid).coordinates;
        d3.select(this).attr("stroke-width", "3.5px");



        var info = d3.select(".extra_info").append("div").attr("class", "info").attr("style", "width:200px;background:rgba(255,255,255,0.8);position:absolute;border-radius: 10px;left:" + (d3.mouse(this)[0] + 20) + "px;top:" + (d3.mouse(this)[1] + 10) + "px ");
        info.append("h4").text("" + d3.select(this).attr("name").toUpperCase());

        if(haveinfo === "true"){
          info.append("img").attr("class", "infoicon2")
            .attr("src", "img/info_icon.png");

          var myinfo = info.append("div").attr("class", "myinfo");
          myinfo.append("strong").append("p").text("Narrative Path");
        }
        else {
          var myinfo = info.append("div").attr("class", "myinfo");
          myinfo.append("strong").append("p").text("");




        }

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

      });

      d3.selectAll(".overall_path").on("mouseout", function() {
        d3.select(this).attr("stroke-width", "1.5px");
        d3.selectAll(".info").remove();
      });

      d3.selectAll(".overall_path").on("click", function() {
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

        if(pathview === 0){
          pathview++;

          $(".individual").fadeIn(1000);


        }


      });

    }

    var locloop = true;
    var myloop = function() {
      locreplay = true;
      ! function loop() {
        if (locloop)
          for (k in route_multi) { //add paths
            var name = k.toString();
            d3.select(".overall_path_circle_" + name).transition()
              .ease("linear")
              .duration(2000)
              .attrTween("transform", translateAlong(d3.select(".overall_path_" + name).node()))
              .each("end", loop);



          }
      }();

      $(".overall").fadeIn(1000);


      for (k in route_multi) { //add paths
        var nodes0 = fixloop2(route_multi[k].coordinates);
        var nodes = reptojectMap0(nodes0); //each path node list


        d3.select(".allroutes").append("circle").attr("class", "mapnodes") //add all last nodes
          .attr("cx", nodes[nodes.length - 1].x).attr("cy", nodes[nodes.length - 1].y).attr("ox", nodes0[nodes0.length - 1][0]).attr("oy", nodes0[nodes0.length - 1][1])
          .attr("r", 3).attr("fill", "rgb(211, 84, 0)")
          .on("mouseover", function() {
            d3.select(this).attr("r", 6);
            var info = d3.select(".extra_info").append("div").attr("class", "info").attr("style", "background:rgba(255,255,255,0.8);position:absolute;border-radius: 10px;left:" + (d3.mouse(this)[0] + 20) + "px;top:" + (d3.mouse(this)[1] + 10) + "px ");
            info.append("div").attr("class", "pop_city_name");

            var lx = d3.select(this).attr("ox");
            var ly = d3.select(this).attr("oy");
            if (lx < -180) {
              revGeocoding_class(ly, (+lx + 360), "pop_city_name");

            } else
              revGeocoding_class(ly, lx, "pop_city_name");

          })
          .on("mouseout", function() {
            d3.select(this).attr("r", 3);
            d3.selectAll(".info").remove();

          });

      }
    }



    var animate_path = function() {

      for (k in route_multi) { //add paths
        var name = k.toString();
        var newlst = fixloop2(route_multi[k].coordinates);
        var lstprojected = reptojectMap0(newlst);

        var lineraw = curvePath(curvePath(curvePath(curvePath(curvePath(lstprojected)))));

        if (locloop === true)
          d3.select(".overall_path_" + name).transition()
          .delay(0)
          .duration(12000)
          .attrTween("d", getSmoothInterpolation(lineraw)) //need a reference to the function
          .each("end", myloop);

        else
          d3.select(".overall_path_" + name).transition()
          .delay(0)
          .duration(12000)
          .attrTween("d", getSmoothInterpolation(lineraw)) //need a reference to the function
          .each("end", function() {
            locloop = true;
            myloop();
          });


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
        $(".underbar").css("bottom", 0);


      } else {

        d3.select("#detail_button p").text("Show Detail");
        d3.select("#detail_button img").attr("src", "img/up_arrow.png");
        detail_control = true;
        $(".underbar").css("bottom", -150);


      }
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

/*      if (num != 0 && cont === true) {
        cont === true;
      }*/

      timeMark
        .attr("transform", "translate(" + xScale(getNode(places, nowNum)[2]) + "," + (20 + 2.5) + ")");



        d3.select("#distance .keynum")
          .text(nowDis(pastData.coordinates));
        d3.select("#days .keynum")
          .text(nowDays(nowNum));



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