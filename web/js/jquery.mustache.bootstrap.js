(function ($) {
        // Configure jquery-Mustache to warn on missing templates (to aid debugging)
        $.Mustache.options.warnOnMissingTemplates = true;

        // Loading templates embedded in the DOM. (HTML)
        $(function () { 
                // Add all templates found in the DOM (it will search for <script> blocks which 
                // are of type 'text/html'.  Nb: jQuery.onReady must have fired before calling. 
                $.Mustache.addFromDom();
        });


//        // Load a single template.
//        $.Mustache.load('/demo/list.html')
//                .done(function () {
//                        var output = $('#demo-list');
//
//                        output.append($.Mustache.render('demo-list', { items: [
//                                {name: "Foo"},
//                                {name: "Bar"}
//                            ] }));
//                });
           
           listItems();
           function updateItem(id)
           {
                $.ajax('/app_dev.php/edit/'+id, {
                    success: function(data) {
                        $.Mustache.load('/demo/edit.html')
                        .done(function () {
                            var output = $('#demo-edit');
                            output.append($.Mustache.render('demo-edit', data));
                        });
                    }
                });
           }
           
           
           
           function listItems()
           {
                $.ajax('/app_dev.php/list', {
                      success: function(data) {
                         $.Mustache.load('/demo/list.html')
                        .done(function () {
                            var output = $('#demo-list');

                            output.html($.Mustache.render('demo-list', { items: data }));
                            output.find('.demo-edit').click(function(event) {
                                updateItem($(this).data('id'));
                            });
                            output.find('.demo-delete').click(function(event) {
                                event.preventDefault();
                                deleteItem($(this).data('id'));
                            });
                            
           $('#demo-address').change(function(event) {
               console.log("$(this).val()="+$(this).val());
                pinAddress($(this).val());
            });
                            

                        });
                      },
                      error: function() {
                         $('#notification-bar').text('An error occurred');
                      }
                   });
                   initComplete();
           }
           
           function deleteItem(id)
           {
                $.ajax('/app_dev.php/delete/'+id, {
                    success: function(data) {
                        listItems();
                    }
                });
           }   
           var gapiUrl = 'http://maps.googleapis.com/maps/api/geocode/json?address=';
           function pinAddress(adr) {
               console.log("adr="+adr);
               $.ajax(gapiUrl+adr, {
                    success: function(data) {
                        var myLatLng = data.results[0].geometry.location;
                        //{lat: -25.363, lng: 131.044};
                        var map = new google.maps.Map(document.getElementById('map'), {
                          zoom: 4,
                          center: myLatLng
                        });

                        var marker = new google.maps.Marker({
                          position: myLatLng,
                          map: map,
                          title: data.results[0].formatted_address
                        });
                    }
                });
           }
           //pinAddress('1600+Amphitheatre+Parkway,+Mountain+View,+CA');
           
           function initComplete() {
               console.log("init complete, length="+$('#geocomplete').length);
        var options = {
          map: ".map_canvas"
        };
        
        $("#geocomplete").geocomplete(options)
          .bind("geocode:result", function(event, result){
            $.log("Result: " + result.formatted_address);
          })
          .bind("geocode:error", function(event, status){
            $.log("ERROR: " + status);
          })
          .bind("geocode:multiple", function(event, results){
            $.log("Multiple: " + results.length + " results found");
          });
        
        $("#find").click(function(){
          $("#geocomplete").trigger("geocode");
        });
        
        $("#examples a").click(function(){
          $("#geocomplete").val($(this).text()).trigger("geocode");
          return false;
        });
        }

})(jQuery);

function initMap(adr) {
    console.log('Init map');
    var myLatLng = {lat: -25.363, lng: 131.044};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: myLatLng
    });

    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: 'Hello World!'
    });
}