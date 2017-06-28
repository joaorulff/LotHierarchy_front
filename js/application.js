$("#menu-toggle").click(function(e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});

function removeList(id){
  $("#list-"+id).remove();
}

function addListItem(data){
  var lot_type = {0:'Mixed or Unknown',
                  1: 'Block Assemblage',
                  2: 'Waterfront',
                  3:'Corner',
                  4:'Through',
                  5:'Inside',
                  6: 'Interior Lot',
                  7: 'Island Lot',
                  8: 'Alley Lot'}
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
                      .html('<strong>Building Area (ft²): </strong>'+data.bldgArea))
                  .append(
                    $(document.createElement('li'))
                      .addClass('list-group-item')
                      .html('<strong>Lot Area (ft²): </strong>'+data.lotArea))
                  .append(
                    $(document.createElement('li'))
                      .addClass('list-group-item')
                      .html('<strong>Lot Type: </strong>'+ lot_type[data.lotType]));

 $('#lists').prepend(element);
}
