jQuery(document).ready(function(){
	wdi_controller.bindUnistallEvent();

	/*Feeds page*/
	wdi_controller.bindSaveFeedEvent();
	wdi_controller.bindAddNewUserOrHashtagEvent();
	jQuery('.display_type input').on('click',function(){
			wdi_controller.displaySettingsSection(jQuery(this));
		});
	/*Themes page*/
	wdi_controller.bindSaveThemeEvent();


	jQuery('#wdi_add_user_ajax').after(jQuery("<br><label class='wdi_pro_only' for='wdi_add_user_ajax_input'>"+wdi_messages.username_hashtag_multiple+"</label>"));
});
function wdi_controller(){};
wdi_controller.bindUnistallEvent = function (){
	jQuery('#wdi_unistall').on('click',function(){
		var wdi_confirm = confirm(wdi_messages.uninstall_confirm);
		if (wdi_confirm === true){
			jQuery.ajax({
			type: 'POST',
			url: wdi_ajax.uninstall_url,
			dataType: 'html',
			data: {
				action: 'wdiUninstallPlugin'
			},
			success: function(response){
				$msg = response;
				jQuery('#settings_wdi_title').after($msg);
				window.location = wdi_admin.admin_url + 'plugins.php#instagram-feed-wd';
			}
			});
		}
	});
}

wdi_getParameterByName = function(name){
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
wdi_controller.apiRedirected  = function(){
	var access_token_raw = wdi_getParameterByName('access_token');
	var arr = access_token_raw.split('.');
	var validRegEx = /^[^\\\/&?><"']*$/;
	for(i=0;i<arr.length;i++){
		if(arr[i].match(validRegEx) === null){return;}
	}
	var access_token = arr.join('.');
	jQuery(document).ready(function(){jQuery('#wdi_access_token').attr('value',access_token);});
	wdi_controller.getUserInfo(access_token);
}

function wdi_NumAndTwoDecimals(e , field) {
    
}

wdi_controller.getUserInfo = function(access_token){
	jQuery.ajax({
		type: 'GET',
		url : 'https://api.instagram.com/v1/users/self/?access_token=' + access_token,
		dataType:'jsonp',
		success: function(response){
			jQuery('#wdi_user_name').attr('value',response['data']['username']);
			jQuery(document).trigger('wdi_settings_filled');
		}
	})
}


wdi_controller.oldDisplayType = {};
wdi_controller.displayTypeMemory = {};


/*
 * Switches between feeds admin page tabs
 */
wdi_controller.switchFeedTabs = function(tabname,section){
	
	//add tabname in hidden field
	jQuery('#wdi_refresh_tab').attr('value',tabname);

	//hiding options of other tabs
	jQuery('[tab]').each(function(){
	if(jQuery(this).attr('tab') != tabname){
		jQuery(this).parent().parent().parent().parent().parent().filter('tr').css('display','none');
	}else{
		jQuery(this).parent().parent().parent().parent().parent().filter('tr').css('display','block');
	}
	});
	//hiding all display_type elements
	jQuery('.display_type').css('display','none');
	//showing only requested display_type tab elements
	jQuery('.display_type[tab="'+tabname+'"]').css('display','block');

	//swap active tab class 
	jQuery('.wdi_feed_tabs').filter('.wdi_feed_tab_active').each(function(){jQuery(this).removeClass('wdi_feed_tab_active');});
	jQuery('#wdi_'+tabname).addClass('wdi_feed_tab_active');
	var selectedSection = jQuery();
	var sectionSelectedFLag = false;
	if(section != undefined && section != ''){
		//check value which came from backend
		selectedSection = jQuery('.display_type #'+section).prop('checked',true);
		jQuery('#wdi_feed_type').attr('value',section);
		//sectionSelectedFLag = true;
	}
	//find the selected feed_type option
	if(!sectionSelectedFLag){
		selectedSection = jQuery('.display_type[tab="'+tabname+'"] input[name="feed_type"]:checked');
		if(selectedSection.length != 0) {
			sectionSelectedFLag = true;
		}
	}
	//if there are no selected feed_type option then set default option
	if(!sectionSelectedFLag){
		//make default section as selected
		selectedSection = jQuery('.display_type[tab="'+tabname+'"] #thumbnails');
		if(selectedSection.length != 0) {
			sectionSelectedFLag = true;
			selectedSection.prop('checked',true);
			jQuery('#wdi_feed_type').attr('value','thumbnails');
		};
		
	}
	//if under currect tab we have feed_type section then show it
	if(sectionSelectedFLag){
		wdi_controller.displaySettingsSection(selectedSection);
	}
	
}
/*
 * Displays Settings Section for admin pages
 */
wdi_controller.displaySettingsSection = function($this){
		var sectionName = $this.attr('id').toLowerCase().trim();
		var tab = $this.parent().parent().attr('tab');
		var sectionHiddenField = jQuery('#wdi_refresh_section');
		wdi_controller.oldDisplayType = {
			'section' : sectionName,
			'tab':tab
		};
		wdi_controller.displayTypeMemory[tab] = wdi_controller.oldDisplayType;
		//works only in theme page, because only theme page has #wdi_refresh_section hidden field
		if(sectionHiddenField != undefined){
			sectionHiddenField.attr('value',sectionName);
		}

		var formTable = jQuery('.wdi_border_wrapper .form-table');
		jQuery('#wdi_feed_type').attr('value',sectionName);
		var i=0,j=0;
		var sectionFlag = false;
		formTable.find('tr').each(function(){
			i++;
			
			var sectionStr = jQuery(this).children().children().children().children().children().attr('section');
			
			if(sectionStr !== undefined) {
				sectionFlag = false;
				var sections = sectionStr.toLowerCase().trim().split(',');
				for(j=0;j<sections.length;j++){
					if(sections[j]===sectionName){
						jQuery(this).css('display','block');
						sectionFlag = true;
					}
				}
				if(sectionFlag === false){
					jQuery(this).css('display','none');
				}
			}
		});
}

/*
 * Switches between themes admin page tabs
 */
wdi_controller.switchThemeTabs = function(tabname,section){
	

	//swap active tab class 
	jQuery('.wdi_feed_tabs').filter('.wdi_feed_tab_active').each(function(){jQuery(this).removeClass('wdi_feed_tab_active');});
	jQuery('#wdi_'+tabname).addClass('wdi_feed_tab_active');
	

	//hiding options of other tabs
	jQuery('[tab]').each(function(){
	if(jQuery(this).attr('tab') != tabname){
		jQuery(this).parent().parent().parent().parent().parent().filter('tr').css('display','none');
	}else{
		jQuery(this).parent().parent().parent().parent().parent().filter('tr').css('display','block');
	}
	});

	//hiding all display_type elements
	jQuery('.display_type').css('display','none');
	//showing only requested display_type tab elements
	jQuery('.display_type[tab="'+tabname+'"]').css('display','block');


	//add tabname in hidden field
	jQuery('#wdi_refresh_tab').attr('value',tabname);
	//add sectionname in hidden field
	if(section != undefined && section != ''){
		jQuery('#wdi_refresh_section').attr('value',section);
	}

	//check if any section was previously clicked then set to that section
	if(section == undefined && section != ''){
		if (wdi_controller.displayTypeMemory[tabname] != undefined) {
			jQuery('.display_type #'+wdi_controller.displayTypeMemory[tabname]['section']).trigger('click');
		}else{
			//default section
			jQuery('.display_type[tab="'+tabname+'"]').first().find('input').trigger('click');
		}
	}else{
		jQuery('.display_type #'+section).trigger('click');
	}

}

wdi_controller.showLightboxSettings = function(obj){

	jQuery('[tab="feed_settings"]').parent().parent().parent().parent().parent().filter('tr').each(function(){
	jQuery(this).css('display','none');
	});
	jQuery('.display_type[tab="feed_settings"]').css('display','none');
	jQuery('.display_type[tab="lightbox_settings"]').css('display','block');
	jQuery('[tab="lightbox_settings"]').parent().parent().parent().parent().parent().filter('tr').each(function(){
	jQuery(this).css('display','block');
	})

	
	//check if no tab was clicked then set default tab
	if(wdi_controller.displayTypeMemory['lightbox_settings'] === undefined){
		jQuery('.display_type[tab="lightbox_settings"] #'+obj).trigger('click');
	}else{
		jQuery('.display_type[tab="lightbox_settings"] #'+wdi_controller.displayTypeMemory['lightbox_settings'].section).trigger('click');
	}		
			
	

	jQuery('.wdi_feed_tabs').filter('.wdi_feed_tab_active').each(function(){jQuery(this).removeClass('wdi_feed_tab_active');});
	jQuery('#wdi_lightbox_settings').addClass('wdi_feed_tab_active');
}



wdi_controller.bindSaveFeedEvent = function(){


	function save_feed(task){
		jQuery('#task').attr('value',task);

		if(task=='apply_changes' || task=='reset_changes'){
			var id = jQuery('#wdi_add_or_edit').attr('value');
			jQuery('#wdi_current_id').attr('value',id);
		}
		if(task == 'cancel'){
			jQuery('#wdi_save_feed').submit();
		}

		//check if user input field is not empty then cancel save process and make an ajax request
		//add user in input field and then after it trigger save,apply or whatever
		wdi_controller.checkIfUserNotSaved(task);
		if(wdi_controller.waitingAjaxRequestEnd.button != 0){
			return;
		};

		var username,usernames;
		var thumb_user = jQuery('#WDI_thumb_user').val();
		var errorInfo = '';	
		username = thumb_user;
		//usernames= jQuery('#WDI_feed_users').val().trim().split(',');
		// for(var i = 0; i<usernames.length;i++){
		// 	if(thumb_user===usernames[i]){
		// 		username = usernames[i];
		// 		break;
		// 	}
		// }
		var accessToken = jQuery("#wdi_access_token").val();
		var correctUserFlag = false;
		var input_type = '';
		if(username[0]==='#'){
			input_type = "hashtag";
		}else{
			input_type = "user";
		}
		switch(input_type){
			case 'user':{
				jQuery.ajax({
					type: 'POST',
					dataType: 'jsonp',
					url: 'https://api.instagram.com/v1/users/search?q='+username+'&access_token='+accessToken,
					success: function(response){
						
						if(accessToken === ''){
							alert('Please get your access Token, go to settings section');
						}else if(response == ''){
							errorInfo = wdi_messages.instagram_server_error;
						}
						else if(response['meta']['code']!=200){
							correctUserFlag = false;
							
						}
						else{
								for(var i=0;i<response['data'].length;i++){
									if(username===response['data'][i]['username']){
										jQuery('#wdi_feed_thumb').attr('value',response['data'][i]['profile_picture']);
										correctUserFlag = true;
										break;
									}
								}
							}
						
							checkAndSubmit();
						}
					});
				break;
			}
			case "hashtag":{
				jQuery.ajax({
				type: 'POST',
				dataType: 'jsonp',
				url: 'https://api.instagram.com/v1/tags/'+username.substr(1,username.length)+'/media/recent?access_token='+accessToken,
				success: function(response){
					if(response['data'].length!=0){
						img = response['data'][0]['images']['low_resolution']['url'];
						jQuery('#wdi_feed_thumb').attr('value',img);
					}
					correctUserFlag=true;
					checkAndSubmit();
				}
			});
				break;
			}
		}
		
		function checkAndSubmit(){
			if(correctUserFlag === true){
						jQuery('#wdi_save_feed').submit();
					}else{
						if(errorInfo!=''){
							alert(errorInfo);
						}else{
							alert(wdi_messages.invalid_user +" " + username);
						}
					}
		}
	}

	jQuery('#wdi_save_feed_submit').on('click',function(){save_feed('save_feed')});
	jQuery('#wdi_save_feed_apply').on('click',function(){save_feed('apply_changes')});
	jQuery('#wdi_save_feed_reset').on('click',function(){save_feed('reset_changes')});
	jQuery('#wdi_cancel_changes').on('click',function(){save_feed('cancel')});
}
wdi_controller.getUserInput = function(){
	var user_input = jQuery('#wdi_add_user_ajax_input').val().trim().toLowerCase();
		var accessToken = jQuery("#wdi_access_token").val();
		var correctUserFlag = false;
		var newUser;
		var ajaxFinished = false;
		var input_type='';
		var errorInfo ='';
		if(user_input[0]==='#'){
			input_type = 'hashtag';
		}else{
			input_type = 'user';
		}
		if(wdi_version.is_pro == 'false'){
			if(jQuery('.wdi_user').length == 1){
				alert(wdi_messages.only_one_user_or_hashtag);
				return;
			}
		}
		switch(input_type){
			case 'user':{
				jQuery.ajax({
					type: 'POST',
					dataType: 'jsonp',
					url: 'https://api.instagram.com/v1/users/search?q='+user_input+'&access_token='+accessToken,
					success:function(response){
						if(response === undefined){
							errorInfo = wdi_messages.instagram_server_error;
						}
						else if(response['meta']['code'] !==200){
							correctUserFlag = false;
							errorInfo =response['meta']['error_message'];
						}
						else if(response['data'].length===0){
							correctUserFlag = false;
						}
						else{
							for(var i=0;i<response['data'].length;i++){
								if(user_input===response['data'][i]['username']){
									correctUserFlag = true;
									break;
								}
							}
							if(correctUserFlag === true){
								newUser = jQuery('<div class="wdi_user"><a target="_blank" href="http://www.instagram.com/'+user_input+'">'+'<img class="wdi_profile_pic" src="'+response['data'][i]['profile_picture']+'"><span class="wdi_username">'+user_input+'</span><i style="display:table-cell;width:25px;"></i></a><img class="wdi_remove_user" onclick="wdi_controller.removeFeedUser(jQuery(this))" src="'+wdi_url.plugin_url+'/images/delete_user.png"></div>');
								if(checkForDuplicate(newUser)==false){
									jQuery('#wdi_feed_users').append(newUser);
									jQuery('#wdi_add_user_ajax_input').attr('value','');
								}else{
									alert(wdi_messages.already_added);
								}
								

								if(wdi_version.is_pro == 'false'){
									if( jQuery('.wdi_user').length == 1 ){
										jQuery('#wdi_add_user_ajax_input').attr('disabled','disabled');
										jQuery('#wdi_add_user_ajax_input').attr('placeholder',wdi_messages.available_in_pro);
									}	
								}

							}
						}
						
						if(correctUserFlag===false){
							if(errorInfo!=''){
								alert(errorInfo);
							}else{
								alert(wdi_messages.user_not_exist);
							}
							
						}
						
						wdi_controller.updateHiddenField();
						if(correctUserFlag){
							wdi_controller.updateFeaturedImageSelect(user_input,'add');
						}

						////////////////////////////////////
						wdi_controller.saveFeedAfterAjaxWait(correctUserFlag);
						//////////////////////////////////////
						
					}
					});
				break;
			}
			case 'hashtag':{
				requestUrl = 'https://api.instagram.com/v1/tags/'+user_input.substr(1,user_input.length)+'/media/recent?access_token='+accessToken;
				jQuery.ajax({
					type: "POST",
					url: requestUrl,
					dataType: 'jsonp',
					success: function(response){
						if(response == '' || response == undefined || response == null){
							alert(wdi_messages.network_error);
							return;
						}
						if(response['meta']['code'] != 200){
							alert(user_input +': '+ response['meta']['error_message']);
							return;
						}
						var newHashtag = jQuery('<div class="wdi_user"><a target="_blank" href="https://instagram.com/explore/tags/'+user_input.substr(1,user_input.length)+'">'+'<img class="wdi_profile_pic" src="'+wdi_url.plugin_url+'/images/hashtag.png"><span class="wdi_hashtag">'+user_input.substr(1,user_input.length)+'</span><i style="display:table-cell;width:25px;"></i></a><img class="wdi_remove_user" onclick="wdi_controller.removeFeedUser(jQuery(this))" src="'+wdi_url.plugin_url+'/images/delete_user.png"></div>');
						var pattern = /[~!@$%&*#^()<>?]/;
						if(user_input.substr(1,user_input.length).match(pattern)== null && checkForDuplicate(newHashtag)==false){
							jQuery('#wdi_feed_users').append(newHashtag);
							jQuery('#wdi_add_user_ajax_input').attr('value','');

							if(wdi_version.is_pro == 'false'){
								if( jQuery('.wdi_user').length == 1 ){
									jQuery('#wdi_add_user_ajax_input').attr('disabled','disabled');
									jQuery('#wdi_add_user_ajax_input').attr('placeholder',wdi_messages.available_in_pro);
								}	
							}

						}else if(checkForDuplicate(newHashtag)){
							alert(wdi_messages.already_added);
						}
						else{
							alert(wdi_messages.invalid_hashtag);
						}
						wdi_controller.updateHiddenField();
						wdi_controller.updateFeaturedImageSelect(user_input,'add');

						////////////////////////////////////
						wdi_controller.saveFeedAfterAjaxWait(true);
						//////////////////////////////////////
					}
				});
				

				break;
			}
		}
		

		
		//
		function checkForDuplicate(user){
			var duplicate = false;
			var spanText = '';
			var userText = '';
			if(user.find('span').hasClass('wdi_hashtag')){
				userText = '#'+user.find('span').text();
			}else{
				userText = user.find('span').text();
			}

			jQuery('.wdi_user').each(function(){
				
				if(jQuery(this).find('span').hasClass('wdi_hashtag')){
					spanText = '#'+ jQuery(this).find('span').text();
				}else{
					spanText = jQuery(this).find('span').text();
				}
				if(spanText==userText){
					duplicate = true;
				}
			});

			return duplicate;
		}
		
		
		
}
wdi_controller.updateHiddenField = function(){
	var users = [];
	jQuery('#wdi_feed_users .wdi_user').each(function(){
	var span = jQuery(this).find('span');
	if(span.hasClass('wdi_hashtag')){
		users.push('#'+span.text());
	}
	if(span.hasClass('wdi_username')){
		users.push(span.text());
	}
	});

	userStr = users.join(',');
	if(userStr != ''){
		jQuery('#WDI_feed_users').attr('value',userStr);
	}else{
		jQuery('#WDI_feed_users').attr('value',jQuery('#wdi_default_user').val());
	}
}
function uniqueAdd(arr,value){
	var duplicate = 0;
	if(arr.length===0){
		arr.push(value);
	}else {
		for(var i=0;i<arr.length;i++){
			if(arr[i]===value){
				duplicate = true;
			}
		}
		if(duplicate = false){
			arr.push(value);
		}
	}
}
wdi_controller.bindAddNewUserOrHashtagEvent = function(){
	jQuery('#wdi_add_user_ajax').on('click',function(){
		wdi_controller.getUserInput();
	});
	jQuery('#wdi_add_user_ajax_input').on("keypress", function(e) {
        if (e.keyCode == 13) {
            wdi_controller.getUserInput();
            return false; // prevent the button click from happening
        }
	});

}
wdi_controller.removeFeedUser = function($this){


	var username = $this.parent().find('a span').text();
	if($this.parent().find('a span').hasClass('wdi_hashtag')){
		username = '#' + username;
	}
	
	$this.parent().remove();
	wdi_controller.updateHiddenField();
	if(username !== jQuery('#wdi_default_user').val()){
		wdi_controller.updateFeaturedImageSelect(username,'remove');
	}

	if(wdi_version.is_pro == 'false'){
		if( jQuery('.wdi_user').length == 0 ){
			jQuery('#wdi_add_user_ajax_input').removeAttr('disabled');
			jQuery('#wdi_add_user_ajax_input').attr('placeholder','');
		}	
	}
	
}


wdi_controller.requestUserData = function(user_input){

		var accessToken = jQuery("#wdi_access_token").val();
		var correctUserFlag = false;
		var newUser;
		var ajaxFinished = false;
		var input_type='';
		if(user_input[0]==='#'){
			input_type = 'hashtag';
		}else{
			input_type = 'user';
		}

		switch(input_type){
			case 'user':{
				jQuery.ajax({
					type: 'POST',
					dataType: 'jsonp',
					url: 'https://api.instagram.com/v1/users/search?q='+user_input+'&access_token='+accessToken,
					success:function(response){
						if(response['meta']['code'] !==200){
							correctUserFlag = false;
						}
						else if(response['data'].length===0){
							correctUserFlag = false;
						}
						else{
							for(var i=0;i<response['data'].length;i++){
								if(user_input===response['data'][i]['username']){
									correctUserFlag = true;
									break;
								}
							}
							if(correctUserFlag === true){
								newUser = jQuery('<div class="wdi_user" thumb="false"><a target="_blank" href="http://www.instagram.com/'+user_input+'">'+'<img class="wdi_profile_pic" src="'+response['data'][i]['profile_picture']+'"><span class="wdi_username">'+user_input+'</span><i style="display:table-cell;width:25px;"></i></a><img class="wdi_remove_user" onclick="wdi_controller.removeFeedUser(jQuery(this))" src="'+wdi_url.plugin_url+'/images/delete_user.png"></div>');
								jQuery('#wdi_feed_users').append(newUser);
								////wdi_controller.removeFeedUser();
								jQuery('#wdi_add_user_ajax_input').attr('value','');


								if(wdi_version.is_pro == 'false'){
									if( jQuery('.wdi_user').length == 1 ){
										jQuery('#wdi_add_user_ajax_input').attr('disabled','disabled');
										jQuery('#wdi_add_user_ajax_input').attr('placeholder',wdi_messages.available_in_pro);
									}	
								}



							}
						}
						wdi_controller.updateHiddenField();
						wdi_controller.updateFeaturedImageSelect(user_input,'add','backend');
					}
					});
				break;
			}
			case 'hashtag':{
				requestUrl = 'https://api.instagram.com/v1/tags/'+user_input.substr(1,user_input.length)+'/media/recent?access_token='+accessToken;
				jQuery.ajax({
					type: 'POST',
					url: requestUrl,
					dataType: 'jsonp',
					success: function(response){
						if(response=='' || response == undefined || response == null){
							alert(wdi_messages.network_error);
								return;
						}
						if(response['meta']['code'] != 200){
							alert(user_input + ': ' +response['meta']['error_message']);
							return;
						}


						var newHashtag = jQuery('<div class="wdi_user"><a target="_blank" href="https://instagram.com/explore/tags/'+user_input.substr(1,user_input.length)+'">'+'<img class="wdi_profile_pic" src="'+wdi_url.plugin_url+'/images/hashtag.png"><span class="wdi_hashtag">'+user_input.substr(1,user_input.length)+'</span><i style="display:table-cell;width:25px;"></i></a><img class="wdi_remove_user" onclick="wdi_controller.removeFeedUser(jQuery(this))" src="'+wdi_url.plugin_url+'/images/delete_user.png"></div>');
						var pattern = /[~!@$%&*#^()<>?]/;
						if(user_input.substr(1,user_input.length).match(pattern)== null){
							jQuery('#wdi_feed_users').append(newHashtag);
							////wdi_controller.removeFeedUser();
							jQuery('#wdi_add_user_ajax_input').attr('value','');



							if(wdi_version.is_pro == 'false'){
								if( jQuery('.wdi_user').length == 1 ){
									jQuery('#wdi_add_user_ajax_input').attr('disabled','disabled');
									jQuery('#wdi_add_user_ajax_input').attr('placeholder',wdi_messages.available_in_pro);
								}	
							}



						}else{
							alert(wdi_messages.invalid_hashtag);
						}
						wdi_controller.updateHiddenField();
						wdi_controller.updateFeaturedImageSelect(user_input,'add','backend');
					}
				});
				
				break;
			}
		}
		

		
		//updating hidden field		
}
wdi_controller.updateFeaturedImageSelect = function(username,action,origin){
	var select = jQuery('#WDI_thumb_user');
	switch(action){
		case 'add':{
			if(origin == 'backend' && username == ''){
				break;
			}
			//check if there is no duplicate then add
			var flag = select.find('option[value="'+username+'"]').length;
			if(!flag){
				var option = jQuery('<option value="'+username+'">'+username+'</option>');
				select.append(option);
			}
			
			break;
		}
		case 'remove':{
			select.find('option[value="'+username+'"]').remove();
			break;
		}
	}
	if(origin == 'backend'){
		var defaultUser = jQuery('#wdi_default_user').val();
		var defaultUserflag = select.find('option[value="'+defaultUser+'"]').length;
			if(!defaultUserflag){
				var option = jQuery('<option value="'+defaultUser+'">'+defaultUser+'</option>');
				select.append(option);
			}

		var thumb_user = jQuery('#wdi_thumb_user').val();
		if(select.find('option[value="'+thumb_user+'"]').length != 0){
			select.find('option[value="'+thumb_user+'"]').attr('selected',true);
		}

		
	}
}



////////////////////////////////////////////////////////////////////////////////
///////////////////////////////Themes Page//////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
wdi_controller.bindSaveThemeEvent = function(){
	jQuery('#wdi_save_theme_submit').on('click',function(){
		if(wdi_version.is_pro == 'true'){
			jQuery('#task').attr('value','save_feed');
			jQuery('#wdi_save_feed').submit();
		}else{
			alert(wdi_messages.theme_save_message_free);
		}
		
	});
	jQuery('#wdi_save_theme_apply').on('click',function(){
		if(wdi_version.is_pro == 'true'){
			jQuery('#task').attr('value','apply_changes');
			var id = jQuery('#wdi_add_or_edit').attr('value');
			jQuery('#wdi_current_id').attr('value',id);
			jQuery('#wdi_save_feed').submit();
		}else{
			alert(wdi_messages.theme_save_message_free);
		}
		
	});
	jQuery('#wdi_save_theme_reset').on('click',function(){
		if(wdi_version.is_pro == 'true'){
			jQuery('#task').attr('value','reset_changes');
			var id = jQuery('#wdi_add_or_edit').attr('value');
			jQuery('#wdi_current_id').attr('value',id);
			jQuery('#wdi_save_feed').submit();
		}else{
			alert(wdi_messages.theme_save_message_free);
		}
		
	});
}

wdi_controller.checkIfUserNotSaved = function(task){
	switch(task){
		case 'save_feed':{
			task = 'submit';
			break;
		}
		case 'apply_changes':{
			task = "apply";
			break;
		}
		case 'reset_changes':{
			task = 'reset';
			break;
		}
	}
	
	//checking if user has typed username in input field but didn't saved it, trigger add action
	if (jQuery('#wdi_add_user_ajax_input').val().trim() != '') {
		wdi_controller.getUserInput();
		wdi_controller.waitingAjaxRequestEnd = {
			button: task
		};
		return 1;
	}else{
		wdi_controller.waitingAjaxRequestEnd = {
			button : 0
		};
		return 0;
	}
}
//if user was clicked save before ajax request then trigger save after getting info
wdi_controller.saveFeedAfterAjaxWait = function(correctUserFlag){
	if(wdi_controller.waitingAjaxRequestEnd != undefined){
		//if save button was clicked before ajax request then retrigger save button
		var save_type_btn = wdi_controller.waitingAjaxRequestEnd.button;
		if(correctUserFlag && save_type_btn != 0){
			jQuery('#wdi_save_feed_'+save_type_btn).trigger('click');
		}
		wdi_controller.waitingAjaxRequestEnd = undefined;
	}
}




///////////////////////////////////////////////////////////////////////////////
///////////////Feeds and themes first view functions///////////////////////////
////////////////////////////////////////////////////////////////////////////////

function wdi_spider_select_value(obj) {
  obj.focus();
  obj.select();
}

// Set value by id.
function wdi_spider_set_input_value(input_id, input_value) {
  if(input_value==='add'){
    if(jQuery('#wdi_access_token').attr('value')==''){
      alert('Please get your access token');
    }
  }
  if (document.getElementById(input_id)) {
    document.getElementById(input_id).value = input_value;
  }
}

// Submit form by id.
function wdi_spider_form_submit(event, form_id) {
  if (document.getElementById(form_id)) {
    document.getElementById(form_id).submit();
  }
  if (event.preventDefault) {
    event.preventDefault();
  }
  else {
    event.returnValue = false;
  }
}




// Check all items.
function wdi_spider_check_all_items() {
  wdi_spider_check_all_items_checkbox();
  // if (!jQuery('#check_all').attr('checked')) {
    jQuery('#check_all').trigger('click');
  // }
}

function wdi_spider_check_all_items_checkbox() {
  if (jQuery('#check_all_items').attr('checked')) {
    jQuery('#check_all_items').attr('checked', false);
    jQuery('#draganddrop').hide();
  }
  else {
    var saved_items = (parseInt(jQuery(".displaying-num").html()) ? parseInt(jQuery(".displaying-num").html()) : 0);
    var added_items = (jQuery('input[id^="check_pr_"]').length ? parseInt(jQuery('input[id^="check_pr_"]').length) : 0);
    var items_count = added_items + saved_items;
    jQuery('#check_all_items').attr('checked', true);
    if (items_count) {
      jQuery('#draganddrop').html("<strong><p>Selected " + items_count + " item" + (items_count > 1 ? "s" : "") + ".</p></strong>");
      jQuery('#draganddrop').show();
    }
  }
}

function wdi_spider_check_all(current) {
  if (!jQuery(current).attr('checked')) {
    jQuery('#check_all_items').attr('checked', false);
    jQuery('#draganddrop').hide();
  }
}

// Set value by id.
function wdi_spider_set_input_value(input_id, input_value) {
  if(input_value==='add'){
    if(jQuery('#wdi_access_token').attr('value')==''){
      alert('Please get your access token');
    }
  }
  if (document.getElementById(input_id)) {
    document.getElementById(input_id).value = input_value;
  }
}







wdi_controller.getCookie = function(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
 }