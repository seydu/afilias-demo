(function ($) {
        // Configure jquery-Mustache to warn on missing templates (to aid debugging)
        $.Mustache.options.warnOnMissingTemplates = true;

        // Loading templates embedded in the DOM. (HTML)
        $(function () { 
                // Add all templates found in the DOM (it will search for <script> blocks which 
                // are of type 'text/html'.  Nb: jQuery.onReady must have fired before calling. 
                $.Mustache.addFromDom();
        });

           //Load the list
           listItems();
           
           //Runs an Ajax call that updates the item. The controller will redirect to the list
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
           
           
           /**
            * Creates the list: runs an Ajax call and uses a moustache template
            * to render the json result
            * @returns {undefined}
            */
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

                        });
                      },
                      error: function() {
                         $('#notification-bar').text('An error occurred');
                      }
                   });
           }
           
           /**
            * Deletes a given item.
            * 
            * It uses an Ajax call. After the result it rebuilds the list
            * @param {type} id
            * @returns {undefined}
            */
           function deleteItem(id)
           {
                $.ajax('/app_dev.php/delete/'+id, {
                    success: function(data) {
                        listItems();
                    }
                });
           }   
           
           //('1600+Amphitheatre+Parkway,+Mountain+View,+CA');


})(jQuery);
