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
                            console.log("length="+$('#demo-address').length);
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
           }
           
           function deleteItem(id)
           {
                $.ajax('/app_dev.php/delete/'+id, {
                    success: function(data) {
                        listItems();
                    }
                });
           }   
           var gapiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDy0RByTQl7pQ1HwW9IxwgYmQemJKjUklA&address=';
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


})(jQuery);

function initMap(adr) {
    console.log('Init map');
    var myLatLng = {lat: -25.363, lng: 131.044};
//https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyAYDI2oJKL73riaHmA0j4S6trGlFpwkZE0
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