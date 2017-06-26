'use strict';

var dataGenerator = {};

dataGenerator.ranges = ["classA", "classB", "classC", "classC", "classD"];
dataGenerator.sets = ["Brazil", "EUA", "Canada"];

dataGenerator.generateData = function(selectedYear){
    
    var dict = undefined;
    var dataset = [];
//    
//    
//    for(var set = 0; set < dataGenerator.sets.length; set++){
//        
//        
//        var currentObj = {key: dataGenerator.sets[set]};
//        
//        for(var rangeIndex = 0; rangeIndex < dataGenerator.ranges.length; rangeIndex++){
//            
//            currentObj[dataGenerator.ranges[rangeIndex]] = Math.random()*1000;
//            
//        }
//        
//        dataset.push(currentObj);
//    }
//    
//    console.log("FIRST", dataset);
    
    
    $.ajax({
        url: "https://bbl-vis-api.herokuapp.com/histogram",
        type: 'GET',
        data: {year: selectedYear},
        async: false,
        cache: false,
        timeout: 30000,
        error: function(){
            return true;
        },
        success: function(msg){ 
            dict = msg;
        }
    });

    
    var beforeOBJ = {key: 'before'};
    beforeOBJ['added'] = dict['before']['added'];
    beforeOBJ['removed'] = dict['before']['removed'];
    beforeOBJ['total'] = dict['before']['total'];
    
    var afterOBJ = {key: 'after'};
    afterOBJ['added'] = dict['after']['added'];;
    afterOBJ['removed'] = dict['after']['removed'];;
    afterOBJ['total'] = dict['after']['total'];;
    
    dataset.push(beforeOBJ, afterOBJ);
    
    
    return dataset;
    
}