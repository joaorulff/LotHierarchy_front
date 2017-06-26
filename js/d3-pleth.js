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
    
    $("#previousHeader").text((parseInt(year)-1));
    $("#currentHeader").text(year);
    $("#nextHeader").text((parseInt(year)+1));
    
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
    map.style("stroke-width", 1.5 / d3.event.transform.k + "px");
      // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
      map.attr("transform", d3.event.transform); // updated for d3 v4
}
    
    var projection = d3.geoMercator()
  					.center([-73.94, 40.70])
  					.scale(150000)
  					.translate([(myApp.cw)/2, (myApp.ch) /2]);
    
   var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);
    
    svg.call(zoom);

    var path = d3.geoPath()
        .projection(projection);
    
    map.selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("d", path)
        .style('stroke', 'rgb(0,0,0)')
        .style('fill', function(d,i){
            var BBLID = d["BBL"];
            if(state != 'current'){
                if(myApp.diffDict[state]['added'].indexOf(BBLID) >= 0){
                    return "blue";
                }else if(myApp.diffDict[state]['removed'].indexOf(BBLID) >= 0){
                    return "red";
                }else{
                    return '#E3FBFC';
                }
            }else{
                return '#E3FBFC';
            }
    });

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
    
    
    

}

myApp.test = function(){
    
    var yearSelected = $("#bblSelect option:selected").text();
    myApp.run(yearSelected);

}
