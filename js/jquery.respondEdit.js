currnode = null;

jQuery.fn.swap = function(b){ 
	b = jQuery(b)[0]; 
	var a = this[0]; 
	var t = a.parentNode.insertBefore(document.createTextNode(''), a); 
	b.parentNode.insertBefore(a, b); 
	t.parentNode.insertBefore(b, t); 
	t.parentNode.removeChild(t); 
	return this; 
};

(function($){  
  $.fn.respondEdit = function () {

	// create menu
	var menu =  '<div class="editorMenu primary">' +
				'<a class="bold" href="#" title="Bold Text (select text first)"></a>' +
				'<a class="italic" href="#" title="Italicize Text (select text first)"></a>' +
				'<a class="link" href="#" title="Add Link (select text first)"></a>' +
				'<a class="code" href="#" title="Add code"></a>' +
				'<a class="h1" href="#" title="Add Headline"></a>' +
				'<a class="h2" href="#" title="Add Headline"></a>' +
				'<a class="h3" href="#" title="Add Headline"></a>' +
				'<a class="p" href="#" title="Add a Paragraph"></a>' +
				'<a class="q" href="#" title="Add Block Quote"></a>' +
				'<a class="ul" href="#" title="Add a List"></a>' +
				'<a class="table" href="#" title="Add Table"></a>' +
				'<a class="hr" href="#" title="Add a Horizontal Rule"></a>' +
				'<a class="img" href="#" title="Add an Image"></span>' +
				'<a class="slideshow" href="#" title="Add a Slideshow"></a>' +
				'<a class="map" href="#" title="Add a Map"></a>' +
				'<a class="twitter" href="#" title="Add your Twitter&reg; feed"></a>' +
				'<a class="like" href="#" title="Add Facebook&reg; Like button"></a>' +
				'<a class="comments" href="#" title="Add Facebook&reg; comments"></a>' +
				'<a class="youtube" href="#" title="Add a video"></span>' +
				'<a class="byline" href="#" title="Add a By Line"></span>' +
				'<a class="list" href="#" title="Add a list of pages"></span>' +
				'<a class="file" href="#" title="Add a File"></a>' +
				'<a class="form" href="#" title="Add a Form"></a>' +
				'<a class="html" href="#" title="Add HTML"></a>' + 
				'<a class="syntax" href="#" title="Add Code Block"></a>';

   	menu += '<a class="plugins" href="#" title="Plugins"></a>';
   	menu += '<a class="settings" href="#" title="Page Settings"></a>';
   	menu += '<a class="preview" href="#" title="Preview"></a>';
   	menu += '<a class="more" href="#" title="Layout options..."></a>';
   
   	menu += '</div>';
   
   	// create bottom menu
   	var submenu =  '<div class="editorMenu secondary">' +
	   '<a class="cols" href="#" title="Add a 50/50 Column Layout"></a>' +
	   '<a class="cols73" href="#" title="Add a 70/30 Column Layout"></a>' +
	   '<a class="cols37" href="#" title="Add a 30/70 Column Layout"></a>' +
	   '<a class="cols333" href="#" title="Add a 33/33/33 Column Layout"></a>' +
	   '<a class="single" href="#" title="Add a Full Column Layout"></a>' +
	   '<a class="load" href="#" title="Load New Layout"></a></div>';
   
	   
   	var editor = '<div class="block row-fluid sortable">' +
		'<a class="removeBlock" href="#"></a><a class="up" href="#"></a><a class="down" href="#"></a>' +
		'<div class="col span12"><div class="p">' +
		'<div class="content" contentEditable="true"></div>' +
		'<span class="marker">P</span>' +
		'<a class="remove" href="#"></a>' +
		'</div>' +
		'</div></div>';
	
	var context = this;
			
	// parse HTML
	function parseHTML(top){

  		function parseModules(node){
			var children = $(node).children();
			var response = '';

			for(x=0; x<children.length; x++){
		  		var node = children[x];
		 
		  	if(node.nodeName=='P'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='p-'+parseInt(new Date().getTime() / 1000);
				var cssclass = $(node).attr('class');
				if(cssclass==undefined || cssclass=='')cssclass='';
			
				response+= '<div id="'+id+'" class="p" data-id="'+id+'" data-cssclass="'+cssclass+'">' +
					'<div class="content" contentEditable="true">' + $(node).html() + '</div>' +
					'<span class="marker">P</span>' +
					'<a class="remove" href="#"></a><a class="config" href="#"></a>' +
					'</div>';
		  	}

		  	if(node.nodeName=='TABLE'){
	            var id = $(node).attr('id');
	            if(id==undefined || id=='')id='h1-'+parseInt(new Date().getTime() / 1000);
	            var cssclass = $(node).attr('class');
	            if(cssclass==undefined || cssclass=='')cssclass='';

	            var columns = $(node).attr('data-columns');

	           	var rows = '';

	           	var tr = $(node).find('thead tr');

	           	rows += '<thead><tr>';

	           	var ths = $(tr).find('th');

				for(var d=0; d<ths.length; d++){
					rows += '<th contentEditable="true" class="col-'+(d+1)+'">'+$(ths[d]).html()+'</td>';
				}

	           	rows += '</tr></thead>';

	            var trs = $(node).find('tbody tr');

	            rows += '<tbody>';

	            for(var t=0; t<trs.length; t++){
					rows += '<tr class="row-'+(t+1)+'">';
					var tds = $(trs[t]).find('td');

					for(var d=0; d<tds.length; d++){
						rows += '<td contentEditable="true" class="col-'+(d+1)+'">'+$(tds[d]).html()+'</td>';
					}

					rows += '</tr>';
				}

				 rows += '</tbody>';
	            
	            var table = '<div id="'+id+'" class="table" data-id="'+id+'" data-cssclass="'+cssclass+'"><table class="'+cssclass+'" data-columns="'+columns+'">'+
                        rows + '</table>' +
                        '<span class="addColumn"><a class="addColumn btn" href="#">Add Column</a></span>' +
          				'<span class="addRow"><a class="addRow btn" href="#">Add Row</a></span>' +
                        '<span class="marker">T</span><a class="remove" href="#"></a><a class="config" href="#"></a>'+
                        '</div>';

            	response += table;
          	}
		  
		  	if(node.nodeName=='BLOCKQUOTE'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='bq-'+parseInt(new Date().getTime() / 1000);
				var cssclass = $(node).attr('class');
				if(cssclass==undefined || cssclass=='')cssclass='';
			
				response+= '<div id="'+id+'" class="q" data-id="'+id+'" data-cssclass="'+cssclass+'">' +
					'<div class="content" contentEditable="true">' + $(node).html() + '</div>' +
					'<span class="marker"></span>' +
					'<a class="remove" href="#"></a><a class="config" href="#"></a>' +
					'</div>';
		  	}
		  
		  	if(node.nodeName=='UL'){
				var lis = $(node).children();
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='ul-'+parseInt(new Date().getTime() / 1000);
				var cssclass = $(node).attr('class');
				if(cssclass==undefined || cssclass=='')cssclass='';
			
				response+= '<div id="'+id+'" class="ul" data-id="'+id+'" data-cssclass="'+cssclass+'">';
			
				for(y=0; y<lis.length; y++){
					response+= '<div class="content" contentEditable="true">' + $(lis[y]).html() + '</div>';
				}
			  
				response+= '<span class="marker"></span>';
				response+= '<a class="remove" href="#"></a><a class="config" href="#"></a>';
				response+= '</div>';
		  	}
		  
		  	if(node.nodeName=='H1'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='h1-'+parseInt(new Date().getTime() / 1000);
				var cssclass = $(node).attr('class');
				if(cssclass==undefined || cssclass=='')cssclass='';
			
				response+= '<div id="'+id+'" class="h1" data-id="'+id+'" data-cssclass="'+cssclass+'">'+
					'<div contentEditable="true">' + $(node).html() + '</div><span class="marker">H1</span><a class="remove" href="#"></a><a class="config" href="#"></a><a class="config" href="#"></a>'+
					'</div>';
		  	}
		  
		  	if(node.nodeName=='HR'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='hr-'+parseInt(new Date().getTime() / 1000);
				var cssclass = $(node).attr('class');
			  	if(cssclass==undefined || cssclass=='')cssclass='';
			  	response+= '<div id="'+id+'" class="hr" data-id="'+id+'" data-cssclass="'+cssclass+'">' +
					'<div></div>' +
					'<span class="marker"></span>' +
					'<a class="remove" href="#"></a><a class="config" href="#"></a>' +
					'</div>';
		  	}
		  
		  	if(node.nodeName=='H2'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='h2-'+parseInt(new Date().getTime() / 1000);
				var cssclass = $(node).attr('class');
				if(cssclass==undefined || cssclass=='')cssclass='';
				
				response+= '<div id="'+id+'" class="h2" data-id="'+id+'" data-cssclass="'+cssclass+'">'+
					'<div contentEditable="true">' + $(node).html() + '</div><span class="marker">H2</span><a class="remove" href="#"></a><a class="config" href="#"></a>'+
					'</div>';
		  	}
		  
		  	if(node.nodeName=='H3'){
		  		var id = $(node).attr('id');
		  		if(id==undefined || id=='')id='h3-'+parseInt(new Date().getTime() / 1000);
				var cssclass = $(node).attr('class');
				if(cssclass==undefined || cssclass=='')cssclass='';
		  
		  		response+= '<div id="'+id+'" class="h3" data-id="'+id+'" data-cssclass="'+cssclass+'">'+
					'<div contentEditable="true">' + $(node).html() + '</div><span class="marker">H3</span><a class="remove" href="#"></a><a class="config" href="#"></a>'+
					'</div>';
		  	}

		  	if(node.nodeName=='PRE'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='syntax-'+parseInt(new Date().getTime() / 1000);
				
				response+= '<div id="'+id+'" class="syntax" data-id="'+id+'" data-cssclass="prettyprint linenums pre-scrollable">'+
					'<pre class="prettyprint linenums pre-scrollable">' + $(node).html() + '</pre>' +
					'<pre class="non-pretty">' + $(node).html() + '</pre>' +
					'<span class="marker"></span><a class="remove" href="#"></a>'+
					'</div>';
		  	}
		  
		  	if(node.nodeName=='DIV'){
				var className = $(node).attr('class');

				if(className=='l-image')className = ' left';
				else if(className=='r-image')className = ' right';
				else if(className=='o-image')className = '';

				var rel = $(node).find('a').attr('rel');
				if(rel==undefined || rel=='')rel='';

				var src = $(node).find('img').attr('src');
				var href = $(node).find('a').attr('href');
				var i_id = $(node).find('img').attr('id');
				var html = $(node).find('p').html();
			
				// set constraints
				var width = $(node).attr('data-width');
				var height = $(node).attr('data-height');
				var constraints = '';
			
				if(width!=''&&height!=''){
			  		if(!isNaN(width)&&!isNaN(height)){ // set constraints
					constraints = ' data-width="'+width+'" data-height="'+height+'"';
			  	}
			}
			
		   
		  	var id = $(node).attr('id');
		  
		  	if(id==undefined || id=='')id='i-'+parseInt(new Date().getTime() / 1000);
		  
		  	if(className==' left'){
				response+= '<div id="'+id+'" class="i' + className + '"'+constraints+' data-id="'+id+'" data-cssclass="'+cssclass+'">';
				if(href==undefined){
			  		response+='<div class="img"><img id="'+i_id+'" src="' + src + '"></div>';
				}
				else{
			  		response+='<div class="img hasUrl"><img id="'+i_id+'" src="' + src + '" data-url="' + href + '"></div>';
				}
				response+='<div class="content" contentEditable="true">' + html + '</div><span class="marker"></span><a class="remove" href="#"></a><a class="config" href="#"></a>';
				response+='</div>';
		  	}
		  	else if(className==' right'){
				response+= '<div id="'+id+'" class="i' + className + '"'+constraints+' data-id="'+id+'" data-cssclass="'+cssclass+'">';
				response+='<div class="content" contentEditable="true">' + html + '</div>';
				if(href==undefined){
			  		response+='<div class="img"><img id="'+i_id+'" src="' + src + '"></div>';
				}
				else{
			  		response+='<div class="img hasUrl"><img id="'+i_id+'" src="' + src + '" data-url="' + href + '"></div>';
				}
				response+='<span class="marker"></span><a class="remove" href="#"></a><a class="config" href="#"></a>';
				response+='</div>';
		  	}
		  	else{
				response+= '<div id="'+id+'" class="i"'+constraints+' data-id="'+id+'" data-cssclass="'+cssclass+'">';
				if(href==undefined){
			  		response+= '<div class="img"><img id="'+i_id+'" src="' + src + '"></div>';
				}
				else{
			  		response+= '<div class="img hasUrl"><img id="'+i_id+'" src="' + src + '" data-url="' + href + '"></div>';
				}
				response+= '<span class="marker"></span><a class="remove" href="#"></a><a class="config" href="#"></a></div>';
		  	}
		}

		if(node.nodeName=='PLUGIN'){
			var id = $(node).attr('id');
			var type = $(node).attr('type');
			var name = $(node).attr('name');
			var render = $(node).attr('render');
			var config = $(node).attr('config');
		  	if(id==undefined || id=='')id='d-'+parseInt(new Date().getTime() / 1000);

		  	//var attrs = $(node).attr();
		  	var nvps = '';

		  	var attrs = $(node).get(0).attributes;
			
			$.each(attrs, function(i, attrib)
			{
			  var name = attrib.name;
			  var value = attrib.value;

			  if(name != 'id' && name != 'type' && name != 'name' && name != 'render' && name != 'config'){
			  	nvps += 'data-' + name + '="' + value +'" ';
			  }
			});

			response+= '<div id="'+id+'" data-type="'+type+'" data-name="'+name+'" data-render="'+render+'" data-config="'+config+'" ' + nvps + 'class="plugin"><div>'+name+'</div><span class="marker" title="Module"></span>';
		 
			if(config=='true'){
		        response +=  '<a class="remove" href="#"></a><a class="config-plugin" href="#"></a></div>';
	      	}
	      	else{
		        response += '<a class="remove" href="#"></a></div>';
	      	}
		}
		  
	  	if(node.nodeName=='MODULE'){
			var name = $(node).attr('name');
			var id = $(node).attr('id');
			
			if(id==undefined || id=='')id='s-'+parseInt(new Date().getTime() / 1000);
			
			if(name=='slideshow'){
		  		var width = $(node).attr('width');  
			  	if(width==undefined || width==''){
					width = '300';
			  	}
			  	var height = $(node).attr('height'); 
			  	if(height==undefined || height==''){
					height = '200';
			  	}
			  
			  	var menu = $(context).find('a.slideshow');
			  	var imgs = $(node).find('img');
			  
			  	response+= '<div id="' + id + '" class="slideshow" data-width="'+width+'" data-height="'+height+'"><div>' +
			  		'<button type="button" class="addImage"></button>';
			
			  	for(var y=0; y<imgs.length; y++){
					var caption = $(imgs[y]).attr('title');
					imghtml = $('<div>').append($(imgs[y]).clone()).remove().html();
					response +='<span class="image">' + imghtml + '<span class="caption"><input type="text" value="'+caption+'" placeholder="Enter caption" maxwidth="140"></span><a class="remove" href="#"></a></span>';
			  	}
			
			  	response += '</div><span class="marker" title="Module"></span><a class="remove" href="#"></a>' +
					'<em class="size">'+
					width+'px x '+height+'px'+
					'</em>'+
					'</div>';
			}

			if(name=='gallery'){
		  		var menu = $(context).find('a.gallery');
			  	var imgs = $(node).find('img');
			  
			  	response+= '<div id="' + id + '" class="gallery"><div>' +
			  		'<button type="button" class="addImage gallery"></button>';
			
			  	for(var y=0; y<imgs.length; y++){
					var caption = $(imgs[y]).attr('title');
					imghtml = $('<div>').append($(imgs[y]).clone()).remove().html();
					response +='<span class="image">' + imghtml + '<span class="caption"><input type="text" value="'+caption+'" placeholder="Enter caption" maxwidth="140"></span><a class="remove" href="#"></a></span>';
			  	}
			
			  	response += '</div><span class="marker" title="Module"></span><a class="remove" href="#"></a>' +
					'</div>';
			}
			
			if(name=='twitter'){
		  		var id = $(node).attr('id');
			  	if(id==undefined || id=='')id='t-'+parseInt(new Date().getTime() / 1000);
			  
			  	var username = $(node).attr('username');
			  	if(username==undefined)username='';
			  	response+= '<div id="'+id+'" class="twitter"><div><input type="text" value="' + username + '" spellcheck="false" maxlength="15" placeholder="twittername"></div><span class="marker" title="Module"></span><a class="remove" href="#"></a></div>';
			}
			
			if(name=='like'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='f-'+parseInt(new Date().getTime() / 1000);
				
				response+= '<div id="'+id+'" class="like"><div><em>Facebook Like Button</em></div><span class="marker" title="Module"></span><a class="remove" href="#"></a></div>';
			}

			if(name=='blog'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='b-'+parseInt(new Date().getTime() / 1000);
				
				response+= '<div id="'+id+'" class="blog"><div><em>Blog posts</em></div><span class="marker" title="Module"></span><a class="remove" href="#"></a></div>';
			}

			if(name=='comments'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='c-'+parseInt(new Date().getTime() / 1000);
				
				response+= '<div id="'+id+'" class="comments"><div><em>Facebook comments</em></div><span class="marker" title="Module"></span><a class="remove" href="#"></a></div>';
			}

			if(name=='byline'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='b-'+parseInt(new Date().getTime() / 1000);
				
				response+= '<div id="'+id+'" class="byline"><div class="placeholder">By Author on Day, Mon DD at HH:MM AM</div><span class="marker" title="Module"></span><a class="remove" href="#"></a></div>';
			}
			
			if(name=='html'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='h-'+parseInt(new Date().getTime() / 1000);
				
				var h = $(node).html();
				response+= '<div id="'+id+'" class="html"><textarea>'+h+'</textarea><span class="marker" title="Module"></span><a class="remove" href="#"></a></div>';
			}
			
			if(name=='youtube'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='y-'+parseInt(new Date().getTime() / 1000);
				
				var h = $(node).html();
				response+= '<div id="'+id+'" class="youtube"><textarea placeholder="Paste HTML embed code here">'+h+'</textarea><span class="marker" title="Module"></span><a class="remove" href="#"></a></div>';
			}
			
			if(name=='vimeo'){
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='v-'+parseInt(new Date().getTime() / 1000);
				
				var h = $(node).html();
				response+= '<div id="'+id+'" class="vimeo"><textarea placeholder="Paste HTML embed code here">'+h+'</textarea><span class="marker" title="Module"></span><a class="remove" href="#"></a></div>';
			}
			
			if(name=='map'){
		  		var address = $(node).attr('address');
			  	if(address==undefined)address='';
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='m-'+parseInt(new Date().getTime() / 1000);
		  
			  	response+= '<div id="'+id+'" class="map"><div><input type="text" value="' + address + '" spellcheck="false" maxlength="512" placeholder="1234 Main Street, Some City, LA 90210"></div><span class="marker" title="Module"></span><a class="remove" href="#"></a></div>';
			}
			
			if(name=='featured'){
			  	var type = $(node).attr('type');
			  	var label = $(node).attr('label');
			  	if(type==undefined)type='';
			  	if(label==undefined)label='';
				var id = $(node).attr('id');
				if(id==undefined || id=='')id='f-'+parseInt(new Date().getTime() / 1000);
			  
				response+= '<div id="'+id+'" data-label="'+label+'" data-type="'+type+'" class="featured"><div>Featuring '+label+'</div><span class="marker" title="Module"></span><a class="remove" href="#"></a></div>';
			}
			
			if(name=='cart'){
			  	var id = $(node).attr('id');
			  	if(id==undefined || id=='')id='f-'+parseInt(new Date().getTime() / 1000);
				
			  	response+= '<div id="'+id+'" class="cart"><div>Add to Cart Widget</div><span class="marker" title="Module"></span><a class="remove" href="#"></a></div>';
			}
			
			if(name=='list'){
		  		var display = $(node).attr('display');
			  	var id = $(node).attr('id');
			  	if(id==undefined || id=='')id='l-'+parseInt(new Date().getTime() / 1000);
			  
			  	var type = $(node).attr('type');
			  	var label = $(node).attr('label');
			  	var desclength = $(node).attr('desclength');
			  	var length = $(node).attr('length');
			  	var orderby = $(node).attr('orderby');
			  	var groupby = $(node).attr('groupby');
			  	var pageresults = $(node).attr('pageresults');
			  	if(type==undefined)type='';
				if(label==undefined)label='';
				if(desclength==undefined)desclength='250';
				if(length==undefined)length='';
				if(orderby==undefined)orderby='';
				if(groupby==undefined)groupby='';
				if(pageresults==undefined)pageresults='';
				
			  	chtml = '<div id="'+id+'" data-display="'+display+'" data-type="'+type+'" class="list"' +
					' data-label="' + label + '"' +
					' data-desclength="' + desclength + '"' +
					' data-length="' + length + '" data-orderby="' + orderby + '" data-groupby="' + groupby + '" data-pageresults="' + pageresults + '">' +
					' <div>List '+label+' </div><span class="marker" title="Module"></span><a class="remove" href="#"></a><a class="config-list" href="#"></a></div>';

			  	response += chtml;
			  
			}
			
			if(name=='file'){
		  		var file = $(node).attr('file');
			  	var desc = $(node).attr('description');
			  	var id = $(node).attr('id');
			  	if(id==undefined || id=='')id='f-'+parseInt(new Date().getTime() / 1000);
			  
			  	response+= '<div id="'+id+'" class="file"><div><em>'+file+'</em><input type="text" value="'+desc+'" spellcheck="false" maxlength="256" placeholder="Description for the file"></div><span class="marker" title="Module"></span><a class="remove" href="#"></a></div>';
			}
			
			if(name=='form'){
				var id = $(node).attr('id');
				response+= '<div id="'+id+'" class="form"><div>';
				
				var fields = $(node).find('.control-group');
				
				for(y=0; y<fields.length; y++){
			  		fhtml = $('<div>').append($(fields[y]).clone()).remove().html();
				  	response += '<span class="field-container">';
				  	response += fhtml;
				  	response += '<a class="remove-field" href="#"></a><span class="marker-field" title="Field"></span>';
				  	response += '</span>';
				}
				
				response+= '</div><span class="marker" title="Module"></span><a class="remove" href="#"></a>';
				response+= '<input type="button" value="Add Field" class="btn addField"></div>';
			 }
		  }
		}
		
		return response;
	}
	  
  	var html = '';
	  
  	var blocks = $(top).find('div.block');
	  
  	if(blocks.length==0){
		html += '<div id="block-000" class="block sortable">';
		html += parseModules(top);
		html += '<span class="blockActions"><span>#block-000 .block.row-fluid</span><a class="up" href="#"></a><a class="down" href="#"></a><a class="config-block" href="#"></a><a class="removeBlock" href="#"></a></span></div>'; 
	}
	else{
		// walk through blocks
		for(var y=0; y<blocks.length; y++){
	  		var id = $(blocks[y]).attr('id');
		  	var cssclass = $(blocks[y]).attr('class');
		  	var cssclass_readable = '.' + global.replaceAll(cssclass, ' ', '.');
		  	
		  	cssclass = jQuery.trim(global.replaceAll(cssclass, 'block', ''));
		  	cssclass = jQuery.trim(global.replaceAll(cssclass, 'row-fluid', ''));

			if(id==undefined || id=='')id='undefined';
  
		  	html += '<div id="'+id+'" class="block row-fluid" data-cssclass="' + cssclass + '">';        
		  
		  	// determine if there are columns
		  	var cols = $(blocks[y]).find('.col');
  
			for(var z=0; z<cols.length; z++){
				var className = $(cols[z]).attr('class'); 

		  		html += '<div class="'+className+' sortable">';
		  		html += parseModules(cols[z]);
		  		html += '</div>';
		  }

		  html += '<span class="blockActions"><span>#'+ id + ' ' + cssclass_readable + '</span><a class="up" href="#"></a><a class="down" href="#"></a><a class="config-block" href="#"></a><a class="removeBlock" href="#"></a></span></div>';
		}
	  }

	  return html;
	}
	
	var response = parseHTML(this);
   
  	$(this).html(menu+submenu+response); 
  
	$(this).addClass('editor');
	 
	$('div.sortable').sortable({handle:'span.marker', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6'});
	
	$(this).respondHandleEvents();
	
	// determines where to append new content
	function appendHere(html){
	
	  var blocks = $(context).find('div.block');
	  var length = blocks.length;

	  // check currnode.className==undefined 

	 //if(uc)

	  if(currnode && currnode.nodeName != undefined){
	  	var temp = $(currnode).after(html).get(0);

		var added = $(temp).next();
		
		$(added).find('div, input[type=text], textarea, th[contentEditable=true]:first-child').focus();
		
		currnode = $(added).find('div');
	  }
	  else{
	  	var curr = blocks[length-1]; // get last block
		
		var cols = $(curr).find('div.col');
		
		if(cols.length>0){
		  curr = cols[cols.length-1];
		}
		
		// append!
		$(curr).append(html);
		$(curr).find('div').focus(); // yarhh! focus
	  }
	}
	
	// handle bold menu item
	$(this).find('div.editorMenu a.bold').click(function(){
	  document.execCommand("Bold", false, null);
	  return false;
	});
	
	// handle italic menu item
	$(this).find('div.editorMenu a.italic').click(function(){
	  document.execCommand("Italic", false, null);
	  return false;
	});

	// handle code menu item
	$(this).find('div.editorMenu a.code').click(function(){

	  var text = global.getSelectedText();
	  var html = '<code>'+text+'</code>';

	  document.execCommand("insertHTML", false, html);
	  return false;
	});

	// handle syntax menu item
	$(this).find('div.editorMenu a.syntax').click(function(){

	  codeBlockDialog.show();

	  return false;
	});
	
	// handle link menu item
	$(this).find('div.editorMenu a.link').click(function(){
	  
	  content.showLinkDialog(); 
	  //var p=prompt("URL:");
	  //if(p)document.execCommand("CreateLink", false, p);
	  return false;
	});

	// handle load new layout
	$(this).find('div.editorMenu a.load').click(function(){
	  
	  loadLayoutDialog.show(); 

	  return false;
	});

	// handle plugins dialog
	$(this).find('div.editorMenu a.plugins').click(function(){
	  
	  pluginsDialog.show(); 

	  return false;
	});
 
	// handle page settings
	$(this).find('div.editorMenu a.settings').click(function(){
	  
	  pageSettingsDialog.show(); 

	  return false;
	});

	// handle p menu item
	$(this).find('div.editorMenu a.p').click(function(){
	  var editor = this.parentNode.parentNode;
	  var length = $(editor).find('.p').length + 1;
	  var uniqId = 'paragraph-'+ length;
  
	  appendHere(
		  '<div id="'+uniqId+'" class="p" data-id="'+uniqId+'" data-cssclass="">'+
		  '<div contentEditable="true"></div><span class="marker">P</span><a class="remove" href="#"></a><a class="config" href="#"></a>'+
		  '</div>'
	  );

	  $(editor).respondHandleEvents();
	  
	  return false;
	});

	 // handle table menu item
	$(this).find('div.editorMenu a.table').click(function(){
	  var editor = this.parentNode.parentNode;

	  var length = $(editor).find('table').length + 1;
	  var uniqId = 'table-'+ length;

	  appendHere(
		  '<div id="'+uniqId+'" class="table" data-id="'+uniqId+'" data-cssclass="">'+
		  '<table class="table table-striped table-bordered col-2" data-columns="2">'+
		  '<thead><tr">'+
		  '<th contentEditable="true" class="col-1"></th>'+
		  '<th contentEditable="true" class="col-2"></th>'+
		  '</tr></thead>'+
		  '<tbody><tr class="row-1">'+
		  '<td contentEditable="true" class="col-1"></td>'+
		  '<td contentEditable="true" class="col-2"></td>'+
		  '</tr></tbody>'+
		  '</table>'+
		  '<span class="addColumn"><a class="addColumn btn" href="#">Add Column</a></span>' +
		  '<span class="addRow"><a class="addRow btn" href="#">Add Row</a></span><span class="marker">T</span><a class="remove" href="#"></a><a class="config" href="#"></a>'+
		  '</div>'
	  );

	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle blockquote menu item
	$(this).find('div.editorMenu a.q').click(function(){
	  var editor = this.parentNode.parentNode;

	  var length = $(editor).find('.q').length + 1;
	  var uniqId = 'quote-'+ length;

	  appendHere(
		  '<div id="'+uniqId+'" class="q" data-id="'+uniqId+'" data-cssclass="">'+
		  '<div contentEditable="true"></div><span class="marker"></span><a class="remove" href="#"></a><a class="config" href="#"></a>'+
		  '</div>'
	  );

	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle html menu item
	$(this).find('div.editorMenu a.html').click(function(){
	  var editor = this.parentNode.parentNode;

	  var length = $(editor).find('.html').length + 1;
	  var uniqId = 'html-'+ length;

	  appendHere('<div id="'+uniqId+'" class="html"><textarea></textarea><span class="marker"></span><a class="remove" href="#"></a></div>');

	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle youtube menu item
	$(this).find('div.editorMenu a.youtube').click(function(){
	  var editor = this.parentNode.parentNode;

	  var length = $(editor).find('.youtube').length + 1;
	  var uniqId = 'youtube-'+ length;

	  appendHere('<div id="'+uniqId+'" class="youtube"><textarea placeholder="Paste HTML embed code here"></textarea><span class="marker"></span><a class="remove" href="#"></a></div>');

	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle vimeo menu item
	$(this).find('div.editorMenu a.vimeo').click(function(){
	  var editor = this.parentNode.parentNode;
	  
	  var length = $(editor).find('.vimeo').length + 1;
	  var uniqId = 'vimeo-'+ length;
	  
	  appendHere('<div id="'+uniqId+'" class="vimeo"><textarea placeholder="Paste HTML embed code here"></textarea><span class="marker"></span><a class="remove" href="#"></a></div>');

	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle source menu item
	$(this).find('div.editorMenu a.layout').click(function(){
	  var editor = this.parentNode.parentNode;

	  if($(this).hasClass('visible')){
		$(editor).find('span.blockActions').css('display', 'none');
		$(this).removeClass('visible');
		$(editor).removeClass('advanced');
	  }
	  else{
		$(editor).find('span.blockActions').css('display', 'block');
		$(this).addClass('visible');
		$(editor).addClass('advanced');
	  }
	  
	  return false;
	});
	
	// handle ul menu item
	$(this).find('div.editorMenu a.ul').click(function(){
	  var editor = this.parentNode.parentNode;

	  var length = $(editor).find('.ul').length + 1;
	  var uniqId = 'ul-'+ length;
	  
	  appendHere(
		  '<div id="'+uniqId+'" class="ul" data-id="'+uniqId+'" data-cssclass=""><div contentEditable="true"></div><span class="marker"></span><a class="remove" href="#"></a><a class="config" href="#"></a>' +
		  '</div>');
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle hr menu item
	$(this).find('div.editorMenu a.hr').click(function(){
	  var editor = this.parentNode.parentNode;

	  var length = $(editor).find('.hr').length + 1;
	  var uniqId = 'hr-'+ length;
	  
	  appendHere('<div id="'+uniqId+'" class="hr" data-id="'+uniqId+'" data-cssclass="">'+
		  '<div></div><span class="marker"></span><a class="remove" href="#"></a><a class="config" href="#"></a>' +
		  '</div>');
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
   
	
	// handle img menu item
	$(this).find('div.editorMenu a.img').click(function(){
	  
	  imagesDialog.show('image', -1);
	 
	  return false;
	});
	
	// handle slideshow
	$(this).find('div.editorMenu a.slideshow').click(function(){
	  var editor = this.parentNode.parentNode;

	  var length = $(editor).find('.slideshow').length + 1;
	  var uniqId = 'slideshow-'+ length;

	  content.showSlideShowDialog(uniqId);
	
	  return false;
	});

	// handle gallery
	$(this).find('div.editorMenu a.gallery').click(function(){
	  var editor = this.parentNode.parentNode;
	  
	  var length = $(editor).find('.gallery').length + 1;
	  var uniqId = 'gallery-'+ length;
	  
	  var html = '<div id="' + uniqId + '" class="gallery"><div>' +
			'<button type="button" class="addImage gallery"></button>' +
			'</div><span class="marker" title="Module"></span><a class="remove" href="#"></a>' +
			'</div>';

	  appendHere(
		html
	  );

	  $(editor).respondHandleEvents();
	
	  return false;
	});
	
	// handle map
	$(this).find('div.editorMenu a.map').click(function(){
	  var editor = this.parentNode.parentNode;

	  var length = $(editor).find('.map').length + 1;
	  var uniqId = 'map-'+ length;
	  
	  appendHere(
		'<div id="'+uniqId+'" class="map"><div><input type="text" value="" spellcheck="false" maxlength="512" placeholder="1234 Main Street, Some City, LA 90210"></div><span class="marker" title="Module"></span><a class="remove" href="#"></a></div>'
	  );
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle twitter
	$(this).find('div.editorMenu a.twitter').click(function(){
	  var editor = this.parentNode.parentNode;

	  var length = $(editor).find('.twitter').length + 1;
	  var uniqId = 'twitter-'+ length;
	
	  appendHere(
		'<div id="'+uniqId+'" class="twitter"><div><input type="text" value="" spellcheck="false" maxlength="15" placeholder="twittername"></div><span class="marker" title="Module"></span><a class="remove" href="#"></a></div>'
	  );
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle like
	$(this).find('div.editorMenu a.like').click(function(){
	  var editor = this.parentNode.parentNode;

	  var length = $(editor).find('.like').length + 1;
	  var uniqId = 'like-'+ length;
	
	  appendHere(
		'<div id="'+uniqId+'" class="like"><div><em>Facebook Like Button</em></div><span class="marker" title="Module"></span><a class="remove" href="#"></a></div>'
	  );
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});

	// handle comments
	$(this).find('div.editorMenu a.comments').click(function(){
	  var editor = this.parentNode.parentNode;

	  var length = $(editor).find('.comments').length + 1;
	  var uniqId = 'comments-'+ length;
	
	  appendHere(
		'<div id="'+uniqId+'" class="comments"><div><em>Facebook Comments</em></div><span class="marker" title="Module"></span><a class="remove" href="#"></a></div>'
	  );
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});

	// handle byline
	$(this).find('div.editorMenu a.byline').click(function(){
	  var editor = this.parentNode.parentNode;

	  var length = $(editor).find('.byline').length + 1;
	  var uniqId = 'byline-'+ length;
	
	  appendHere(
		'<div id="'+uniqId+'" class="byline"><div class="placeholder">By Author on Day, Mon DD at HH:MM AM</div><span class="marker" title="Module"></span><a class="remove" href="#"></a></div>'
	  );
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle files
	$(this).find('div.editorMenu a.file').click(function(){
	  imagesDialog.show('file', -1);
	  return false;
	});
	
	// handle form
	$(this).find('div.editorMenu a.form').click(function(){

	  var editor = this.parentNode.parentNode;

	  var length = $(editor).find('.form').length + 1;
	  var uniqId = 'form-'+ length;
	  
	  appendHere(
		'<div id="'+uniqId+'" class="form"><div>' +
		'</div><span class="marker" title="Module"></span><a class="remove" href="#"></a>' + 
		'<input type="button" value="Add Field" class="btn addField">' +
		'</div>'
	  );
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle h1 menu item
	$(this).find('div.editorMenu a.h1').click(function(){
	  var editor = this.parentNode.parentNode;

	  var length = $(editor).find('.h1').length + 1;
	  var uniqId = 'h1-'+ length;
	
	  appendHere(
		'<div id="'+uniqId+'" class="h1" data-id="'+uniqId+'" data-cssclass="">'+
		'<div contentEditable="true"></div><span class="marker">H1</span><a class="remove" href="#"></a><a class="config" href="#"></a>'+
		'</div>'
	  );
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle h2 menu item
	$(this).find('div.editorMenu a.h2').click(function(){
	  var editor = this.parentNode.parentNode;

	  var length = $(editor).find('.h2').length + 1;
	  var uniqId = 'h2-'+ length;
	
	  appendHere(
		  '<div id="'+uniqId+'" class="h2" data-id="'+uniqId+'" data-cssclass="">'+
			'<div contentEditable="true"></div><span class="marker">H2</span><a class="remove" href="#"></a><a class="config" href="#"></a>'+
			'</div>'
	  );
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle h3 menu item
	$(this).find('div.editorMenu a.h3').click(function(){
	  var editor = this.parentNode.parentNode;

	  var length = $(editor).find('.h3').length + 1;
	  var uniqId = 'h3-'+ length;
	
	  appendHere(
		  '<div id="'+uniqId+'" class="h3" data-id="'+uniqId+'" data-cssclass="">'+
			'<div contentEditable="true"></div><span class="marker">H3</span><a class="remove" href="#"></a><a class="config" href="#"></a>'+
			'</div>'
	  );
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle cols menu item
	$(this).find('div.editorMenu a.cols').click(function(){
	  var editor = this.parentNode.parentNode;
	  var length = $(editor).find('.block').length + 1;
	  var uniqId = 'block-'+ length;
	
	  $(editor).append(
		'<div id="'+uniqId+'" class="block row-fluid">' +
		  '<div class="col span6 sortable">' +
		  '</div>' +
		  '<div class="col span6 sortable">' +
		  '</div>' +
		'<span class="blockActions"><span>#'+ uniqId + ' .block.row-fluid</span><a class="up" href="#"></a><a class="down" href="#"></a><a class="config-block" href="#"></a><a class="removeBlock" href="#"></a></span></div>'
	  );

	  $('.blockActions').show();

	  currnode = null;
   
	  var sortable = $('div.sortable');
	  
	  $('div.sortable').sortable({handle:'span.marker', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6'});
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});

	// handle more
	$(this).find('div.editorMenu a.more').click(function(){
	  var editor = this.parentNode.parentNode.parentNode;
	  $(editor).find('.secondary').toggle();

	  if($(this).hasClass('visible')){
		$(editor).find('span.blockActions').css('display', 'none');
		$(this).removeClass('visible');
		$(editor).removeClass('advanced');
	  }
	  else{
		$(editor).find('span.blockActions').css('display', 'block');
		$(this).addClass('visible');
		$(editor).addClass('advanced');
	  }
	  
	  return false;
	});
	
	// handle more
	$(this).find('div.editorMenu a.preview').click(function(){
	  var editor = this.parentNode.parentNode.parentNode;
	  
	  content.preview();

	  return false;
	});


	// handle cols73 menu item
	$(this).find('div.editorMenu a.cols73').click(function(){
	  var editor = this.parentNode.parentNode;
	  var length = $(editor).find('.block').length + 1;
	  var uniqId = 'block-'+ length;
	
	  var html = '<div id="'+uniqId+'" class="block row-fluid">' +
			  '<div class="col span9 sortable">' +
			'</div>' +
			'<div class="col span3 sortable">' +
			'</div>' +
		  '<span class="blockActions"><span>#'+ uniqId + ' .block.row-fluid</span><a class="up" href="#"></a><a class="down" href="#"></a><a class="config-block" href="#"></a><a class="removeBlock" href="#"></a></span></div>';
	  
	  $(editor).append(
		html
	  );

	  $('.blockActions').show();
	  
	  currnode = null;
   
	  var sortable = $('div.sortable');
	  
	  $('div.sortable').sortable({handle:'span.marker', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6'});
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle cols37 menu item
	$(this).find('div.editorMenu a.cols37').click(function(){
	  var editor = this.parentNode.parentNode;
	  var length = $(editor).find('.block').length + 1;
	  var uniqId = 'block-'+ length;
	
	  var html = '<div id="'+uniqId+'" class="block row-fluid">' +
			  '<div class="col span3 sortable">' +
			'</div>' +
			'<div class="col span9 sortable">' +
			'</div>' +
		  '<span class="blockActions"><span>#'+ uniqId + ' .block.row-fluid</span><a class="up" href="#"></a><a class="down" href="#"></a><a class="config-block" href="#"></a><a class="removeBlock" href="#"></a></span></div>';
	  
	  $(editor).append(
		html
	  );

	  $('.blockActions').show();
	  
	  currnode = null;
   
	  var sortable = $('div.sortable');
	  
	  $('div.sortable').sortable({handle:'span.marker', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6'});
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});

	// handle cols333 menu item
	$(this).find('div.editorMenu a.cols333').click(function(){
	  var editor = this.parentNode.parentNode;
	  var length = $(editor).find('.block').length + 1;
	  var uniqId = 'block-'+ length;
	
	  var html = '<div id="'+uniqId+'" class="block row-fluid">' +
			  '<div class="col span4 sortable">' +
			'</div>' +
			'<div class="col span4 sortable">' +
			'</div>' +
			'<div class="col span4 sortable">' +
			'</div>' +
		  '<span class="blockActions"><span>#'+ uniqId + ' .block.row-fluid</span><a class="up" href="#"></a><a class="down" href="#"></a><a class="config-block" href="#"></a><a class="removeBlock" href="#"></a></span></div>';
	  
	  $(editor).append(
		html
	  );

	  $('.blockActions').show();
	  
	  currnode = null;
   
	  var sortable = $('div.sortable');
	  
	  $('div.sortable').sortable({handle:'span.marker', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6'});
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle single menu item
	$(this).find('div.editorMenu a.single').click(function(){
	  var editor = this.parentNode.parentNode;
	  var length = $(editor).find('.block').length + 1;
	  var uniqId = 'block-'+ length;
	
	  $(editor).append(
		'<div id="'+uniqId+'" class="block row-fluid"><div class="col span12 sortable"></div>' +
		 '<span class="blockActions"><span>#'+ uniqId + ' .block.row-fluid</span><a class="up" href="#"></a><a class="down" href="#"></a><a class="config-block" href="#"></a><a class="removeBlock" href="#"></a></span></div>'
	  );

	  $('.blockActions').show();
	  
	  currnode = null;
	  
	  $('div.sortable').sortable({handle:'span.marker', connectWith: '.sortable', placeholder: 'editor-highlight', opacity:'0.6'});
	  
	  $(editor).respondHandleEvents();
	  
	  return false;
	});
	
	// handle featured menu item
	$(this).find('div.editorMenu a.list').click(function(){
	  content.showListDialog('add', -1);
	  return false;
	});

	var menu = $(this).find('div.editorMenu.primary');

	var top = menu.offset().top-42;
	var editor = this;

	$(window).scroll(function(evt) {
		var y = $(this).scrollTop();
		if (y > top) {
		  editor.addClass('fixed');
		} else {
			editor.removeClass('fixed');
		}
	});
	
  }

})(jQuery);

(function($){  
  $.fn.respondHtml = function () {
  
	var html = '';
	
	// gets html for a given block
	function getBlockHtml(block){
	
  		var newhtml = '';
	  
	  	var divs = $(block).find('div');
	  
	  	for(var x=0; x<divs.length; x++){
		
			// handle paragraphs
			if($(divs[x]).hasClass('p')){
		  		var id = $(divs[x]).attr('data-id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		  		var cssclass = $(divs[x]).attr('data-cssclass');
		  		if(cssclass==undefined || cssclass=='')cssclass = '';
		  
		  		var h = jQuery.trim($(divs[x]).find('div').html());
				newhtml += '<p id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '>' + h + '</p>';
			}

			// handle tables
			if($(divs[x]).hasClass('table')){
		  		var id = $(divs[x]).attr('data-id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		 
		 		var table = $(divs[x]).find('table');
		 		var cols = $(table).attr('data-columns');
		 		var cssclass = $(table).attr('class');

				newhtml += '<table id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += ' data-columns="'+cols+'"';
				newhtml += '>';

				newhtml+='<thead>';

				var tr = $(table).find('thead tr');		

				newhtml += '<tr>';
				var ths = $(tr).find('th');

				for(var d=0; d<ths.length; d++){
					newhtml += '<th class="col-'+(d+1)+'">'+$(ths[d]).html()+'</th>';
				}
				newhtml += '</tr>';		

				newhtml+='</thead>';
				newhtml+='<tbody>';

				var trs = $(table).find('tbody tr');

				for(var t=0; t<trs.length; t++){
					newhtml += '<tr class="row-'+(t+1)+'">';
					var tds = $(trs[t]).find('td');

					for(var d=0; d<tds.length; d++){
						newhtml += '<td class="col-'+(d+1)+'">'+$(tds[d]).html()+'</td>';
					}
					newhtml += '</tr>';
				}

				newhtml += '</tbody></table>';
			}
		
			// handle blockquotes
			if($(divs[x]).hasClass('q')){
		  		var id = $(divs[x]).attr('data-id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		  		var cssclass = $(divs[x]).attr('data-cssclass');
		  		if(cssclass==undefined || cssclass=='')cssclass = '';
		  
		  		var h = jQuery.trim($(divs[x]).find('div').html());
				newhtml += '<blockquote id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '>' + h + '</blockquote>';
			}
		
			// handle html
			if($(divs[x]).hasClass('html')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
			
				var h = jQuery.trim($(divs[x]).find('textarea').val());
			
				newhtml += '<module id="'+id+'" name="html">' + h + '</module>';
			}
		
			// handle plugin
			if($(divs[x]).hasClass('plugin')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);

				var data = $(divs[x]).data();
				var attrs = '';

				for(var i in data){
					if(i != 'sortableItem'){
						attrs += i + '="' + data[i] + '" ';
					}
				}

				var html = '<plugin id="'+id+'" ' + attrs + '></plugin>';
				newhtml += html;
			}
		
			// handle youtube
			if($(divs[x]).hasClass('youtube')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
				
				var h = jQuery.trim($(divs[x]).find('textarea').val());
				
				newhtml += '<module id="'+id+'" name="youtube">' + h + '</module>';
			}
			
			// handle vimeo
			if($(divs[x]).hasClass('vimeo')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
				
				var h = jQuery.trim($(divs[x]).find('textarea').val());
				
				newhtml += '<module id="'+id+'" name="vimeo">' + h + '</module>';
			}
		
			// handle ul
			if($(divs[x]).hasClass('ul')){
				var id = $(divs[x]).attr('data-id');
			  	if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
			  	var cssclass = $(divs[x]).attr('data-cssclass');
			  	if(cssclass==undefined || cssclass=='')cssclass = '';
			  
			  	var lis = $(divs[x]).find('div');
			  	newhtml += '<ul id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
			  	newhtml += '>';
			  
			  	for(var y=0; y<lis.length; y++){
					newhtml += '<li>' + jQuery.trim($(lis[y]).html()) + '</li>';
			  	}
			  
			  	newhtml += '</ul>';
			}
		
			// handle headlines 
			if($(divs[x]).hasClass('h1')){
				var id = $(divs[x]).attr('data-id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
				var cssclass = $(divs[x]).attr('data-cssclass');
				if(cssclass==undefined || cssclass=='')cssclass = '';
				
				var h = jQuery.trim($(divs[x]).find('div').html());
				newhtml += '<h1 id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '>' + h + '</h1>';
			}
		
			// h2
			if($(divs[x]).hasClass('h2')){
		  		var id = $(divs[x]).attr('data-id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		  		var cssclass = $(divs[x]).attr('data-cssclass');
				if(cssclass==undefined || cssclass=='')cssclass = '';
		  
		  		var h = jQuery.trim($(divs[x]).find('div').html());
		  		newhtml += '<h2 id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '>' + h + '</h2>';
	  		}
		
			// h3
			if($(divs[x]).hasClass('h3')){
				var id = $(divs[x]).attr('data-id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
				var cssclass = $(divs[x]).attr('data-cssclass');
				if(cssclass==undefined || cssclass=='')cssclass = '';

				var h = jQuery.trim($(divs[x]).find('div').html());
				newhtml += '<h3 id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '>' + h + '</h3>';
			}

			// syntax
			if($(divs[x]).hasClass('syntax')){
				var id = $(divs[x]).attr('data-id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);

				var h = jQuery.trim($(divs[x]).find('pre.non-pretty').html());

				newhtml += '<pre id="'+id+'" class="prettyprint linenums pre-scrollable">' + h + '</pre>';
			}
		
			// handle images
			if($(divs[x]).hasClass('i')){
				var id = $(divs[x]).attr('data-id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);

				var dir = 'o';
				if($(divs[x]).hasClass('right')){
					dir = 'r';
				}
				else if($(divs[x]).hasClass('left')){
					dir = 'l'
				}
		  
				var constraints = '';
				var width = $(divs[x]).attr('data-width');
				var height = $(divs[x]).attr('data-height');
				if(width!=''&&height!=''){
					if(!isNaN(width)&&!isNaN(height)){ // set constraints
						constraints = ' data-width="'+width+'" data-height="'+height+'"';
					}
	  			}
		  
				var i_id = $(divs[x]).find('img').attr('id');
				var src = $(divs[x]).find('img').attr('src');
				var url = $(divs[x]).find('img').attr('data-url');
				var h = jQuery.trim($(divs[x]).find('div.content').html());
	   
		  		newhtml += '<div id="'+id+'" class="'+dir+'-image"'+constraints+'>';
		  		if(url!=undefined){
					newhtml += '<a href="'+url+'"';
					newhtml += '>';
		  		}
		  		newhtml += '<img id="'+i_id+'" src="'+src+'">';
		  		if(url!=undefined)newhtml += '</a>';
		  		if(dir=='o'){
					newhtml += '</div>';
		  		}
		  		else{
					newhtml += '<p>'+h+'</p></div>';
		  		}
	   
			}	
		
			// handle modules
			if($(divs[x]).hasClass('slideshow')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);

				var width = $(divs[x]).attr('data-width');
				if(width==undefined || width=='')width=300;

				var height = $(divs[x]).attr('data-height');
				if(height==undefined || height=='')height=200;

				var imgs = $(divs[x]).find('span.image img');

				newhtml += '<module id="'+id+'" name="slideshow" width="'+width+'" height="'+height+'">';

				for(var y=0; y<imgs.length; y++){
					var imghtml = $('<div>').append($(imgs[y]).clone()).remove().html();
					newhtml += imghtml;
				}

				newhtml += '</module>';
			}

			// gallery
			if($(divs[x]).hasClass('gallery')){
		  		var id = $(divs[x]).attr('id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		  
		  		var imgs = $(divs[x]).find('span.image img');
		
		  		newhtml += '<module id="'+id+'" name="gallery">';
		  
		  		for(var y=0; y<imgs.length; y++){
					var imghtml = $('<div>').append($(imgs[y]).clone()).remove().html();
					newhtml += imghtml;
		  		}
		  
		  		newhtml += '</module>';
			}
		
			// list
			if($(divs[x]).hasClass('list')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
				  
				var display = $(divs[x]).attr('data-display');
				var type = $(divs[x]).attr('data-type');
				var label = $(divs[x]).attr('data-label');

				var desclength = $(divs[x]).attr('data-desclength');
				var length = $(divs[x]).attr('data-length');
				var orderby = $(divs[x]).attr('data-orderby');
				var groupby = $(divs[x]).attr('data-groupby');
				var pageresults = $(divs[x]).attr('data-pageresults');

				newhtml += '<module id="'+id+'" name="list" display="'+display+'" type="'+type+'" label="' + label + '"' +
					' desclength="'+desclength+'"' +
					' length="'+length+'"' +
					' orderby="'+orderby+'" groupby="'+groupby+'" pageresults="'+pageresults+'"' +
					'></module>';
			}
		
			// twitter
			if($(divs[x]).hasClass('twitter')){
		  		var id = $(divs[x]).attr('id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		  
		  		var username = $(divs[x]).find('input[type=text]').val();
		  		newhtml += '<module id="'+id+'" name="twitter" username="'+username+'"></module>';
			}
		
			// like
			if($(divs[x]).hasClass('like')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
			
				newhtml += '<module id="'+id+'" name="like"></module>';
			}

			// comments
			if($(divs[x]).hasClass('comments')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
			
				newhtml += '<module id="'+id+'" name="comments"></module>';
			}

			// blog
			if($(divs[x]).hasClass('blog')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
			
				newhtml += '<module id="'+id+'" name="blog"></module>';
			}

			// byline
			if($(divs[x]).hasClass('byline')){
				var id = $(divs[x]).attr('id');
				if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
			
				newhtml += '<module id="'+id+'" name="byline"></module>';
			}
		
			// hr
			if($(divs[x]).hasClass('hr')){
		  		var id = $(divs[x]).attr('data-id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);

				var cssclass = $(divs[x]).attr('data-cssclass');
				if(cssclass==undefined || cssclass=='')cssclass = '';
			
				newhtml += '<hr id="'+id+'"';
				if(cssclass!='')newhtml += ' class="'+cssclass+'"';
				newhtml += '></hr>';
			}
		
			// form
			if($(divs[x]).hasClass('form')){
		  		var id= $(divs[x]).attr('id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		  
		 		newhtml += '<module id="'+id+'" name="form">';
		  
		  		var fields = $(divs[x]).find('span.field-container');
		  
		  		for(var y=0; y<fields.length; y++){
		  			field = $(fields[y]).html();
					field = field.replace('<a class="remove-field" href="#"></a>', '');
					field = field.replace('<span class="marker-field" title="Field"></span>', '');
					field = global.replaceAll(field, ' ui-sortable', '');
					newhtml += field;
		  		}
		  
		  		newhtml += '</module>';
			}
		
			// map
			if($(divs[x]).hasClass('map')){
		  		var id = $(divs[x]).attr('id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
		  
		  		var address = $(divs[x]).find('input[type=text]').val();
		  		newhtml += '<module id="'+id+'" name="map" address="'+address+'"></module>';
			}
	
			// file
			if($(divs[x]).hasClass('file')){
		  		var id = $(divs[x]).attr('id');
		  		if(id==undefined || id=='')id=parseInt(new Date().getTime() / 1000);
			  
		  		var desc = $(divs[x]).find('input[type=text]').val();
		  		var file = $(divs[x]).find('em').html();
		  		newhtml += '<module id="'+id+'" name="file" file="'+file+'" description="'+desc+'"></module>';
			}
		
	  	}

	  	return newhtml;
	}

	var blocks = $(this).find('div.block');
	
	// walk through blocks
	for(var y=0; y<blocks.length; y++){
	  	var id = $(blocks[y]).attr('id');
	  	var cssclass = $(blocks[y]).attr('data-cssclass');

	  	if(cssclass!=''){
	  		cssclass = ' ' + cssclass;
	  	}
	  
	  	if(id==undefined || id=='')id='undefined';
	  
	  	html += '<div id="'+id+'" class="block row-fluid' + cssclass + '">';
	  
	  	// determine if there are columns
	  	var cols = $(blocks[y]).find('.col');

	  	if(cols.length==0){
			html += getBlockHtml(blocks[y]);
	  	}
	  	else{
			for(var z=0; z<cols.length; z++){
		  		var className = $(cols[z]).attr('class').replace(' sortable', '').replace(' ui-sortable', '');
		  
		  		html += '<div class="'+className+'">';
		  		html += getBlockHtml(cols[z]);
		  		html += '</div>';
			}
	  	}

	  	html+= '</div>';
	
	}

	return html;
  }

})(jQuery);

(function($){  
  $.fn.respondAppend = function(html){
  
	var blocks = $(this).find('div.block');
	var length = blocks.length;
	
	if(currnode){
		var temp = $(currnode).parent().append(html).get(0);
		
		var added = $(temp).next();
		
		$(added).find('div').focus();
		
		currnode = $(added).find('div');
	}
	else if(length>0){  
	  var curr = blocks[length-1]; // get last block

	  var cols = $(curr).find('div.col');

	  if(cols.length>0){
		curr = cols[0];
		$(curr).append(html);
	  }
	  else{
		$(curr).find('div:last').before(html);
	  }
	  
	  // arrh! focus!
	  $(curr).find('div').focus(); // #here
	}
	  
	$(this).respondHandleEvents();
		
  }

})(jQuery);

(function($){  
  $.fn.respondHandleEvents = function(){
	
	var context = this;

	$(context).find('.sortable div').focusin(function(){
	  currnode = this;
	});

	$(context).find('.sortable textarea').focusin(function(){
	  currnode = this;
	});

	$(context).find('.sortable input').focusin(function(){
	  
	  if($(this.parentNode).hasClass('field') || $(this.parentNode).hasClass('caption')){
		
	  }
	  else{
		currnode = this.parentNode;
	  }
	});

	// add field
	$(context).find('input.addField').click(function(){
	  var id = $(this.parentNode).attr('id');
	  content.showAddFieldDialog(id);
	  return false;
	});
	
	// handle focus
	$(context).find('div.table td').focus(function(){
		$(this).addClass('current');
	});

	$(context).find('div.table td').blur(function(){
		$(this).removeClass('current');
	});

	// handle add row
	$(context).find('a.addRow').click(function(){
		var table = $(this).parent().parent().find('table');
		var cols = $(table).attr('data-columns');

		var html = '<tr>';

		for(x=0; x<cols; x++){
			html += '<td contentEditable="true"></td>';
		}

		html += '</tr>';

		$(table).find('tbody').append(html);

		return false;
	});

	// handle add column
	$(context).find('a.addColumn').click(function(){
		var table = $(this).parent().parent().find('table');
		var cols = parseInt($(table).attr('data-columns'));
		var trs = table.find('tr');

		for(var x=0; x<trs.length; x++){

			if(trs[x].parentNode.nodeName=='THEAD'){
				$(trs[x]).append('<th contentEditable="true"></th>');
			}
			else{
				$(trs[x]).append('<td contentEditable="true"></td>');
			}
		}

		var n_cols = cols + 1;

		table.removeClass('col-'+cols);
		table.addClass('col-'+(n_cols));
		table.attr('data-columns', (n_cols));

		return false;
	});


	$('div.form div').sortable('destroy');
	$('div.form div').sortable({handle: 'span.marker-field', placeholder: 'editor-highlight', opacity:'0.6', axis:'y'});

	$('div.slideshow div').sortable('destroy');
	$('div.slideshow div').sortable({handle:'img', items:'span.image', placeholder: 'editor-highlight', opacity:'0.6', axis:'x'});
	
	$('div.gallery div').sortable('destroy');
	$('div.gallery div').sortable({handle:'img', items:'span.image', placeholder: 'editor-highlight', opacity:'0.6', axis:'x'});
	
	$(context).find('span.caption input').focus(function(){
	  $(this.parentNode.parentNode).addClass('edit');
	});

	$(context).find('span.caption input').blur(function(){
		var caption = $(this).val();
		$(this.parentNode.parentNode).find('img').attr('title', caption);
		$(this.parentNode.parentNode).removeClass('edit');
	});

	$(context).find('div.img').click(function(){
		var moduleId = this.parentNode.id;
		var url = $('div#'+moduleId+' img').attr('src');
		var uniqueName = $('div#'+moduleId+' img').attr('id');

		var width = $('div#'+moduleId).attr('data-width');
		var height = $('div#'+moduleId).attr('data-height');
		var isConstrained = false;

		if(width!=undefined&&height!=undefined){
			isConstrained = true;
		}

		content.showCropDialog(url, uniqueName, moduleId, 'image', isConstrained);
		return false;
	});

	$(context).find('a.remove').click(function(){
		$(this.parentNode).remove();
		context.find('a.'+this.parentNode.className).show();
		currnode = null;
		return false;
	}); 

	$(context).find('a.config').click(function(){

		var moduleId = $(this.parentNode).attr('id');

		var id = $(this.parentNode).attr('data-id');
		var cssClass = $(this.parentNode).attr('data-cssclass');
		
		$('#ConfigModuleId').val(moduleId);
		$('#ElementId').val(id);
		$('#ElementCssClass').val(cssClass);

		$('#ElementConfigDialog').modal('show');

		currnode = null;
		return false;
	}); 

	$(context).find('a.config-block').click(function(){

		var id = $(this.parentNode.parentNode).attr('id');
		var cssclass = $(this.parentNode.parentNode).attr('data-class');
		
		$('#ConfigBlockId').val(id);
		$('#BlockId').val(id);
		$('#BlockClass').val(cssclass);

		$('#BlockConfigDialog').modal('show');

		currnode = null;
		return false;
	}); 

	$(context).find('a.remove-field').click(function(){
		$(this.parentNode).remove();
		return false;
	});  
	
	function handleUpDown(){
		$(context).find('a.up').removeClass('disabled');
		$(context).find('a.up').first().addClass('disabled');

		$(context).find('a.down').removeClass('disabled');
		$(context).find('a.down').last().addClass('disabled');   
	}
   
	$(context).find('a.removeBlock').click(function(){
		$(this.parentNode.parentNode).remove();
		handleUpDown();
		return false;
	});
	
 	handleUpDown();
	
	$(context).find('a.down').click(function(){
		if($(this).hasClass('disabled')){return false;}

		var curr = $(this.parentNode.parentNode);
		var next = $(this.parentNode.parentNode).next();

		$(curr).swap(next); 
		handleUpDown();
		return false;
	});

	$(context).find('a.up').click(function(){
		if($(this).hasClass('disabled')){return false;}
		  
		var curr = $(this.parentNode.parentNode);
		var next = $(this.parentNode.parentNode).prev();
		  
		$(curr).swap(next); 
		handleUpDown();
		return false;
	});
   
	$(context).find('button.addImage').click(function(){
		var d = this.parentNode.parentNode;
		var id = $(d).attr('id');

		if($(this).hasClass('gallery')){
			imagesDialog.show('gallery', id);
		}
		else{
			imagesDialog.show('slideshow', id);
		}
	});
	   
	$(context).find('.config-list').click(function(){
		var id=$(this.parentNode).attr('id');
		content.showListDialog('edit', id);
		return false;
	});

	$(context).find('.config-plugin').click(function(){
		var id=$(this.parentNode).attr('id');
		var type=$(this.parentNode).attr('data-type');
		configPluginsDialog.show(id, type);
		return false;
	});
		
	$(context).find('a.switch').click(function(){
		$(this.parentNode).find('a').removeClass('selected');
		$(this).addClass('selected');
		return false;
	});
	  
	$(context).find('div.block div div').unbind('keydown');
		
	$('div[contentEditable=true]').paste();
	 
	$(context).find('div[contentEditable=true]').keydown(function(event){
	  var editor = this.parentNode.parentNode.parentNode;
	  var el = this.parentNode;
	  
	  if(event.keyCode == '13'){
		
		if($(el).hasClass('ul')){
		  $(this).after(
			  '<div contentEditable="true"></div>'
			);
		  
		  $(this.nextSibling).focus();
		}
		else{
		  $(el).after(
			'<div class="p"><div contentEditable="true"></div><span class="marker">P</span><a class="remove" href="#"></a><a class="config" href="#"></a></div>'
		  );
		  
		  $(this.parentNode.nextSibling).find('div').focus();
		}
		
		$(editor).respondHandleEvents();
		
		event.preventDefault();
		return false;
	  }
	  else if(event.keyCode == '8'){
		var h = $(this).html().trim();
		h = global.replaceAll(h, '<br>', '');
		
		if(h==''){
	  
		  var parent = $(this.parentNode);
		  var divs = $(this.parentNode).find('div');
		  
		  if(divs.length>1){
			$(this).remove();
			
			var last = parent.find('div:last');
		  
			last.focus();
			last.select();
			
			return false;
		  }
		}
		
	  }
	});
  }

})(jQuery);


(function($){  
  $.fn.respondGetDesc = function(){
  
	var divs = $(this).find('div.p');
   
	var desc = '';
	
	for(x=0; x<divs.length; x++){
	  desc += jQuery.trim($(divs[x]).find('div').text());
	}
  
  if(desc.length>200){
	desc = desc.substring(0, 200) + '...';
  }
	return desc;
  }

})(jQuery);

(function($){  
  $.fn.respondGetPrimaryImage = function(){
  
	var imgs = $(this).find('div.block .img img');
   
	if(imgs.length==0){
	  var imgs = $(this).find('div.block span.image img');
	}
	
	var id = -1;
	
	if(imgs.length>0){
	  var id = imgs[0].id;
	}

	return id;
  }

})(jQuery);

(function($){  
  $.fn.respondGetLocation = function(){
  
	var inputs = $(this).find('div.map input');
   
	var address='';
	
	if(inputs.length>0){
	  address = $(inputs[0]).val();
	}

	return address;
  }

})(jQuery);