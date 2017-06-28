$("#menu-toggle").click(function(e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});

function removeList(id){
  $("#list-"+id).remove();
}

function addListItem(data){
  var element = $(document.createElement('ul'))
                  .addClass('list-group')
                  .attr('id','list-'+data.BBL)
                  .append(
                    $(document.createElement('li'))
                      .addClass('list-group-item')
                      .append(
                        $(document.createElement('a'))
                          .click(function(){
                            removeList(data.BBL);
                          })
                          .addClass('remove')
                          .attr('href','javascript:void(0)')
                          .append(
                            $(document.createElement('i'))
                              .addClass('glyphicon glyphicon-remove')
                            ))
                          .append('<strong>BBL: </strong>'+data.BBL))
                  .append(
                    $(document.createElement('li'))
                      .addClass('list-group-item')
                      .html('<strong>Floors: </strong>'+data.numFloors))
                  .append(
                    $(document.createElement('li'))
                      .addClass('list-group-item')
                      .html('<strong>Building Area: </strong>'+data.bldgArea))
                  .append(
                    $(document.createElement('li'))
                      .addClass('list-group-item')
                      .html('<strong>Lot Area: </strong>'+data.lotArea))
                  .append(
                    $(document.createElement('li'))
                      .addClass('list-group-item')
                      .html('<strong>Lot Type: </strong>'+data.lotType));

 $('#lists').prepend(element);
}
