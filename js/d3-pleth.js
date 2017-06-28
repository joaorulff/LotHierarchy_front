'use strict';

var myApp = {};

myApp.margins = {top: 10, bottom: 30, left: 25, right: 15};
myApp.cw = 200;
myApp.ch = 400;
myApp.dt = [];

myApp.svg = undefined;
myApp.map = undefined;
myApp.diffDict = undefined;


myApp.getLotsDiff = function(selectedYear){

    $.ajax({
        url: "https://bbl-vis-api.herokuapp.com/diff",
        type: 'GET',
        data: {year: selectedYear},
        async: false,
        cache: false,
        timeout: 30000,
        error: function(){
            return true;
        },
        success: function(msg){
            myApp.diffDict = msg;
        }
    });
}

myApp.loadGeoJson = function(file, map, svg, state)
{
    d3.json(file, function(error, data)
    {
        var loadedData = data.geometries;
        myApp.buildMapConic(loadedData, map, svg, state);
    });
}

myApp.appendSvg = function(div)
{
    var svg = d3.select(div).append('svg')
        .attr('width', myApp.cw + myApp.margins.left + myApp.margins.right)
        .attr('height', myApp.ch + myApp.margins.top + myApp.margins.bottom);

    myApp.svg = svg;

    return svg;
}

myApp.fillHeaders = function(year){

    $("#previousHeader").text((parseInt(year)-1)).css('text-align','center');
    $("#currentHeader").text(year).css('text-align','center');
    $("#nextHeader").text((parseInt(year)+1)).css('text-align','center');

}

myApp.appendMapGroup = function(svg)
{
   var map = svg.append('g')
        .attr('class', 'map-area')
        .attr('width', myApp.cw)
        .attr('height', myApp.ch)
        .attr('transform', 'translate('+ myApp.margins.left +','+ myApp.margins.top +')' );

    myApp.map = map;

    return map;
}

myApp.buildMapConic = function(data, map, svg, state)
{

    function zoomed() {
      //this two lines bellow are the previous version, where only a map performs zoom at a time
      //value.style("stroke-width", 1.5 / d3.event.transform.k + "px");
      //value.attr("transform", d3.event.transform); // updated for d3 v4

      $.each(myApp.allMaps, function(index, value) {
         value.style("stroke-width", 1.5 / d3.event.transform.k + "px");
         value.attr("transform", d3.event.transform); // updated for d3 v4
     });

}

    var projection = d3.geoMercator()
                        .center([-73.97, 40.78])
                     	.scale(150000)
            				.translate([(myApp.cw)/2, (myApp.ch) /2]);
   var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

    svg.call(zoom);

    var path = d3.geoPath()
        .projection(projection);

// for eliminate coordinates moves, comment this call
//     map.call(
//        d3.drag().on("drag",
//        function(){
//           $.each(myApp.allMaps, function(index, value) {
//             value.attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")");
//          });
//     }));

    map.selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("d", path)
        .style('stroke', 'white')
        .style('fill', function(d,i){
            var BBLID = d["BBL"];
            if(state != 'current'){
                if(myApp.diffDict[state]['added'].indexOf(BBLID) >= 0){
                    return "blue";
                }else if(myApp.diffDict[state]['removed'].indexOf(BBLID) >= 0){
                    return "orange";
                }else{
                    return 'gray';
                }
            }else{
                if(myApp.diffDict['before']['added'].indexOf(BBLID) >= 0){
                   return "blue";
                   }
                else if(myApp.diffDict['after']['removed'].indexOf(BBLID) >= 0){
                    return "orange";
                }else{
                    return 'gray';
                }

            }
    })
    .on("click", function(d, i){
        addListItem(d);
    })
    ;

}

myApp.run = function(year)
{

    myApp.fillHeaders(year);
    myApp.getLotsDiff(year);

    var path = "data/"+(year-1)+".json";
    var previousSVG = myApp.appendSvg("#previousMap");
    var previouMap  =  myApp.appendMapGroup(previousSVG);
    myApp.loadGeoJson(path, previouMap, previousSVG, 'before');

    path = "data/"+(year)+".json";
    var currentSVG = myApp.appendSvg("#currentMap");
    var currentMap = myApp.appendMapGroup(currentSVG);
    myApp.loadGeoJson(path, currentMap, currentSVG, 'current');


    path = "data/"+(parseInt(year)+1)+".json";
    var nextSVG = myApp.appendSvg("#nextMap");
    var nextMap = myApp.appendMapGroup(nextSVG);
    myApp.loadGeoJson(path, nextMap, nextSVG, 'after');

    myApp.allMaps = [previouMap,currentMap,nextMap];

}

myApp.test = function(){

    var yearSelected = $("#bblSelect option:selected").text();
    myApp.run(yearSelected);

}
