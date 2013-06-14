// handles the plugins dialog on content.php
var pluginsDialog = {

  init:function(){
  	
    $('#selectPlugin li').click(function(){
      $(this).parent().find('li').removeClass('selected');
      $(this).addClass('selected');
    });

    $('#AddPlugin').click(function(){

      var plugin = $('#selectPlugin li.selected a');

      if(plugin.length==0){
        message.showMessage('error', 'Please select a plugin.');
        return;
      }

      var editor = $('#desc');
      var uniqId = 'p-'+parseInt(new Date().getTime() / 1000);
      var name = plugin.attr('data-name');
      var type = plugin.attr('data-type');
      var render = plugin.attr('data-render');
      var config = plugin.attr('data-config')
      var html = '<div id="'+uniqId+'" data-type="'+type+'" data-name="'+name+'" data-render="'+render+'" data-config="'+config+'" class="plugin">' +
                    '<div>'+name+'</div><span class="marker" title="Module"></span>';

      if(config=='true'){
        html +=  '<a class="remove" href="#"></a><a class="config-plugin" href="#"></a></div>';
      }
      else{
        html += '<a class="remove" href="#"></a></div>';
      }

      $(editor).respondAppend(
        html
      );

      $('#PluginsDialog').modal('hide');
    
    });

  },

  // shows the slide show dialog
  show:function(){
    $('#PluginsDialog').modal('show');
  }
}

$(document).ready(function(){
  pluginsDialog.init();
});