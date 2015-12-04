if(typeof wdi_front == 'undefined'){
	wdi_front = {
		type: 'not_declared'
	};
}
jQuery(document).ready(function(){
	if(wdi_front['type'] != 'not_declared'){
		wdi_front.clickOrTouch = wdi_front.detectEvent(); 
		//initializing all feeds in the page
		wdi_front.globalInit();
	}else{
		return;
	}
		
});


wdi_front.detectEvent = function(){
	var isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
	if(isMobile){
		return "touchend";
	}else{
		return 'click';
	}
}
wdi_front.globalInit = function(){
	var num = wdi_front['feed_counter'];
	var currentFeed = '';

	

	for(var i = 0; i <= num; i++){
		currentFeed = window['wdi_feed_'+i];
		wdi_front.access_token = currentFeed['feed_row']['access_token'];
		currentFeed.dataStorage = []; //stores all avialable data
		currentFeed.dataStorageList = [];
		currentFeed.allResponseLength = 0;
		//number of instagram objects which has been got by single request
		currentFeed.currentResponseLength = 0;

		//temprorary usersData which is uses in case when getted data is smaller then needed
		currentFeed.temproraryUsersData = [];

		currentFeed.removedUsers = 0; 
		currentFeed.nowLoadingImages = true;
		currentFeed.imageIndex = 0; //index for image indexes
		currentFeed.resIndex = 0;  //responsive indexes used for pagination
		currentFeed.currentPage = 1; //pagination page number
		currentFeed.userSortFlags = []; //array for descripbing user based filter options
		currentFeed.customFilterChanged = false; //flag to notice filter change, onclick on username
		window.onload = function(){
			for(var i = 0; i <= wdi_front.feed_counter;i++){
				window['wdi_feed_'+i]['nowLoadingImages'] = false;
			}
		}

		if(currentFeed.feed_row.feed_type == 'masonry'){
			currentFeed.displayedData = [];
		}



		//if pagination is on then set pagination parameters
		if(currentFeed.feed_row.feed_display_view == 'pagination'){
			currentFeed.feed_row.resort_after_load_more = 0;
			if(currentFeed.feed_row.feed_type != 'image_browser'){
				currentFeed.feed_row.load_more_number = parseInt(currentFeed.feed_row.pagination_per_page_number);
				currentFeed.feed_row.number_of_photos = (1 + parseInt(currentFeed.feed_row.pagination_preload_number))*currentFeed.feed_row.load_more_number;
			}else{
				currentFeed.feed_row.number_of_photos = 1 + parseInt(currentFeed.feed_row.image_browser_preload_number);
				currentFeed.feed_row.load_more_number = parseInt(currentFeed.feed_row.image_browser_load_number);
			}
			
			
			currentFeed.freeSpaces =(Math.floor(currentFeed.feed_row.pagination_per_page_number/currentFeed.feed_row.number_of_columns)+1)*currentFeed.feed_row.number_of_columns - currentFeed.feed_row.pagination_per_page_number;
		}else{
			currentFeed.freeSpaces = 0;
		}
		

		wdi_front.bindEvents(currentFeed);



		//initializing function for lightbox
		currentFeed.galleryBox = function(image_id){
			 wdi_spider_createpopup(wdi_url.ajax_url+'?gallery_id=' + this.feed_row['id'] + '&image_id=' + image_id, wdi_front.feed_counter, this.feed_row['lightbox_width'], this.feed_row['lightbox_height'], 1, 'testpopup', 5,this);
		}
		//calling responive javascript
		wdi_responsive.columnControl(currentFeed);

		//if feed type is masonry then trigger resize event  for building proper column layout
		if(currentFeed.feed_row.feed_type == 'masonry'){
			jQuery(window).trigger('resize');
		}
		//initializing each feed
		wdi_front.init(currentFeed);
	}

}

wdi_front.init = function(currentFeed){

	
	//some varables used in code
	currentFeed.photoCounter =  currentFeed.feed_row["number_of_photos"];


	//loading feed
	//requesting user photos and adding ajax loading 
	currentFeed.feed_users = currentFeed.feed_row['feed_users'].split(',');
	currentFeed.dataCount = currentFeed.feed_users.length;
	for(var i=0;i<currentFeed.feed_users.length;i++){
		wdi_front.instagramRequest(i,currentFeed,33);
	}



	if(currentFeed.feed_row["number_of_photos"] > 0){
		wdi_front.ajaxLoader(currentFeed);
	}
	
	//setting feed name
	if(currentFeed['feed_row']['display_header']==='1'){
		wdi_front.show('header',currentFeed);
	}
	if(currentFeed['feed_row']['show_usernames'] === '1'){
		wdi_front.show('users',currentFeed);
	}
	

}


/* checks if input is username or hashtag and then generates proper request 
 * url for each type of input
 * after that if input is hashtag it simply requests 
 * hashtag recent images and saves it in currentFeed.usersData array
 * if input is username it first requests for user ID and then calls wdi_front.requestUserPhotos()
 * method.
 */
  wdi_front.instagramRequest = function(id,currentFeed,htCount){
	var username = currentFeed.feed_users[id];
	var access_token = currentFeed.feed_row['access_token'];
	var errorMessage = '';
	var userFound = false;
	var userId = '';
	var requestUrl='';
	var hashtag = false;
	var hashtagCount = currentFeed.feed_row['number_of_photos'];
	if(htCount != undefined){
		hashtagCount = htCount;
	}

	
	if(isHashtag(username)){
		var tag = username.substr(1,username.length);
		requestUrl = 'https://api.instagram.com/v1/tags/'+tag+'/media/recent?access_token='+access_token+'&count='+hashtagCount;
		hashtag = true;
	}else{
		requestUrl = 'https://api.instagram.com/v1/users/search?q='+username+'&access_token='+access_token;
	}

	jQuery.ajax({
		url: requestUrl,
		type: 'POST',
		dataType: 'jsonp',
		async: false,
		success: function(response){
			if(response == '' || response == undefined || response == null){
				errorMessage = wdi_front_messages.connection_error;
				currentFeed.dataCount--;
				alert(errorMessage);
				return;
			}
			if(response['meta']['code'] != 200){
				errorMessage = response['meta']['error_message'];
				currentFeed.dataCount--;
				alert(errorMessage);
				return;
			}
			if(hashtag === false){
				for(var i=0;i<response['data'].length;i++){
					if(response['data'][i]['username'] === username){
							userFound = true;
							userId = response['data'][i]['id'];
						break;
					}
				}
			}else{
				var user = {
								'userId' : username,
								'username' : username,
							};
				
				wdi_front.saveUserData(response,user,currentFeed);
			}
			
			if(!userFound && hashtag===false){
				errorMessage = username+' '+ wdi_front_messages.user_not_found ;
				currentFeed.dataCount--;
				alert(errorMessage);
				return;
			}else{
				if(hashtag === false){
					var user = {
								'userId' : userId,
								'username' : username,
							};
					wdi_front.requestUserPhotos(user,currentFeed);
				}
				
			}
		}
	});
	function isHashtag(str){
		return (str[0]==='#'); 
	}
}

/*
 * generates Instagram request url based on arguments
 */
wdi_front.generateRequestUrl = function(arg,currentFeed){
	var access_token = currentFeed.feed_row['access_token'];
	var baseUrl = 'https://api.instagram.com/v1/users/'+arg.userId+'/media/recent/?access_token='+access_token;
	if(arg.count != '' && arg.count != undefined && arg.count != null){
		baseUrl+='&count='+arg.count;
	}
	if(arg.min_timestamp != '' && arg.min_timestamp != undefined && arg.min_timestamp != null){
		baseUrl+='&min_timestamp='+arg.min_timestamp;
	}
	if(arg.max_timestamp != '' && arg.max_timestamp != undefined && arg.max_timestamp != null){
		baseUrl+='&max_timestamp='+arg.max_timestamp;
	}
	return baseUrl;
}
/*
 * Saves each user data on seperate index in currentFeed.usersData array
 * And also checks if all data form all users is already avialable if yes it displays feed
 */
wdi_front.saveUserData = function(data,user,currentFeed){
	data['username'] = user.username;
	data['user_id'] = user.userId;

	//checking if user type is hashtag then manually add hashtag to each object, for later use
	//hashtag based filters
	if(data['user_id'][0]==='#'){
		data['data'] = wdi_front.appendRequestHashtag(data['data'],data['user_id']);
	}
	
	
	currentFeed.usersData.push(data);


	currentFeed.currentResponseLength = wdi_front.getArrayContentLength(currentFeed.usersData,'data');
	currentFeed.allResponseLength += currentFeed.currentResponseLength;



	if(currentFeed.dataCount == currentFeed.usersData.length){
		
		//if getted objects is not enough then recuest new ones
	
		if(currentFeed.currentResponseLength < currentFeed.feed_row.number_of_photos && !wdi_front.userHasNoPhoto(currentFeed)){
			/*here we are calling loadMore function out of recursion cylce, after this initial-keep kall
			loadMore will be called with 'initial' recursivly until the desired number of photos is reached
			if possible*/
			wdi_front.loadMore('initial-keep',currentFeed);
		}else{
		
			wdi_front.displayFeed(currentFeed);
			//when all data us properly displayed check for any active filters and then apply them
			wdi_front.applyFilters(currentFeed);
			
		}

		
	}
	
}
/*
checks weather all feed users have any photos after first time request
*/
wdi_front.userHasNoPhoto = function(currentFeed,cstData){
	var counter = 0;
	var data = currentFeed.usersData;
	if(cstData != undefined){
		data = cstData;
	}
	for(var i = 0; i < data.length;i++){
		if(data[i]['pagination']['next_max_id'] == undefined){
			counter++
		}
	}
	if(counter == data.length){
		return 1;
	}else{
		return 0;
	}
}
/*
 *gives each instagram object custom hashtag parameter, which is used for searching image/video
 */
wdi_front.appendRequestHashtag = function(data,hashtag){
	for(var i = 0; i < data.length; i++){
		data[i]['wdi_hashtag'] = hashtag;
	}
	return data;
}
/*
 * Requests for user phots based on request url and saves it in currentFeed.usersData array
 */
wdi_front.requestUserPhotos = function(user,currentFeed){
	//var count = currentFeed.feed_row['number_of_photos'];
	count = 33; 
	var argument = {
		'userId' : user.userId,
		'count'  : count,
		'min_timestamp' :'',
		'max_timestamp': ''
	};
	var errorMessage = '';
	var ajax_url = wdi_front.generateRequestUrl(argument,currentFeed);
	jQuery.ajax({
		type: "POST",
		url: ajax_url,
		dataType: 'jsonp',
		success: function(response){
			if(response['meta']['code'] != 200){
				errorMessage = response['meta']['error_message'];
				alert(user.username +' : '+ errorMessage);
				currentFeed.dataCount--;
				return;
			}
			wdi_front.saveUserData(response,user,currentFeed);
		}
	});
}




/*
 * sorts data based on user choice and displays feed
 * also checks if one request is not enough for displaying all images user wanted
 * it recursively calls wdi_front.loadMore() until the desired number of photos is reached
 */
wdi_front.displayFeed = function(currentFeed,load_more_number){
	
	
	if(currentFeed.customFilterChanged == false){
		//sorting data...
		var data = wdi_front.feedSort(currentFeed,load_more_number);
	}
		
	
	// if custom filter changed then display custom data
	if(currentFeed.customFilterChanged == true){
		var data = currentFeed.customFilteredData;
		//parsing data for lightbox
		currentFeed.parsedData = wdi_front.parseLighboxData(currentFeed,true);
	}

	
	//storing all sorted data in array for later use in user based filters
	if(currentFeed.feed_row.resort_after_load_more != '1'){
		// filter changes when user clicks to usernames in header
		// at that point displayFeed triggers but we don't have any new data so
		// we are not adding new data to our list
		if(currentFeed.customFilterChanged == false){
			currentFeed.dataStorageList = currentFeed.dataStorageList.concat(data);
		}
	}else{
		// filter changes when user clicks to usernames in header
		// at that point displayFeed triggers but we don't have any new data so
		// we are not adding new data to our list
		if(currentFeed.customFilterChanged == false){
			currentFeed.dataStorageList = data;
		}
	}

	//checking feed_type and calling proper rendering functions
	if(currentFeed.feed_row.feed_type == 'masonry'){
		wdi_front.masonryDisplayFeedItems(data,currentFeed);
	}
	if(currentFeed.feed_row.feed_type == 'thumbnails' || currentFeed.feed_row.feed_type == 'blog_style' || currentFeed.feed_row.feed_type == 'image_browser'){
		wdi_front.displayFeedItems(data,currentFeed);
	}
	




	//recursively calling load more to get photos
	var dataLength = wdi_front.getDataLength(currentFeed);
		if (dataLength < currentFeed.photoCounter){
			wdi_front.loadMore('',currentFeed);
			
		}else{

		}

	//checking if display_view is pagination and we are not on the last page then enable
	//last page button
	if(currentFeed.feed_row.feed_display_view == 'pagination' && currentFeed.currentPage<currentFeed.paginator){
		jQuery('#wdi_feed_'+currentFeed.feed_row.wdi_feed_counter).find('#wdi_last_page').removeClass('wdi_disabled');
	}

}


 wdi_front.masonryDisplayFeedItems = function(data,currentFeed){
	 	var masonryColEnds = [];
	 	var masonryColumns = [];

	 	
	 	jQuery('#wdi_feed_'+currentFeed.feed_row['wdi_feed_counter']+' .wdi_masonry_column').each(function(){
	 		
	 		//if resorte after load more is on then reset columns on every load more
	 		if(currentFeed.feed_row.resort_after_load_more == 1 ){
	 			jQuery(this).html('');
	 			currentFeed.imageIndex = 0;
	 		}
	 		
	 		//if custom filter is set or changed then reset masonry columns
	 		if(currentFeed.customFilterChanged == true){
	 			jQuery(this).html('');
	 			currentFeed.imageIndex = 0;
	 		}
	 		
	 		//check if pagination is enabled then each page should have resetted colEnds
	 		//else give previous colEnds
	 		if(currentFeed.feed_row.feed_display_view == 'pagination'){
	 			masonryColEnds.push(0);
	 		}else{
	 			masonryColEnds.push(jQuery(this).height());
	 		}
	 		
	 		masonryColumns.push(jQuery(this));
	 	});
	 	
 		//if custom filter is set or changed then reset masonry columns
 		if(currentFeed.customFilterChanged == true){
 			currentFeed.customFilterChanged = false;
 		}
 		
 		
	 	//loop for displaying items
	 	for(var i=0;i<data.length;i++){

	 		currentFeed.displayedData.push(data[i]);
	 		if(data[i]['type'] == 'image'){
			var photoTemplate = wdi_front.getPhotoTemplate(currentFeed);
			}else{
			var photoTemplate = wdi_front.getVideoTemplate(currentFeed);
			}
		
			var rawItem = data[i];
			var item = wdi_front.createObject(rawItem,currentFeed);
			var html = photoTemplate(item);

			//find column with minumum height and append to it new object
			var shortCol = wdi_front.array_min(masonryColEnds);
			var imageResolution = wdi_front.getImageResolution(data[i]);
			
			masonryColumns[shortCol['index']].html(masonryColumns[shortCol['index']].html()+html);
			masonryColEnds[shortCol['index']] += masonryColumns[shortCol['index']].width()*imageResolution;
			currentFeed.imageIndex++;
			

			//changing responsive indexes for pagination
			if(currentFeed.feed_row.feed_display_view == 'pagination'){
				if((i+1)%currentFeed.feed_row.pagination_per_page_number === 0){
				currentFeed.resIndex+=currentFeed.freeSpaces+1;
				}else{
					currentFeed.resIndex++;
				}
			}	
	 	}


	 	//binding onload event for ajax loader
		currentFeed.wdi_loadedImages = 0;
		var columnFlag = false;
		currentFeed.wdi_load_count = i;
		var wdi_feed_counter = currentFeed.feed_row['wdi_feed_counter'];
		var feed_wrapper = jQuery('#wdi_feed_'+wdi_feed_counter + ' img.wdi_img').on('load',function(){
			currentFeed.wdi_loadedImages++;
			checkLoaded();

			//calls wdi_responsive.columnControl() which calculates column number on page
			//and gives feed_wrapper proper column class
			if(columnFlag === false){
				wdi_responsive.columnControl(currentFeed,1);
				columnFlag = true;
			}

			//Binds caption opening and closing event to each image photo_title
			if(currentFeed.feed_row.feed_type != 'blog_style'){
				wdi_responsive.bindMasonryCaptionEvent(jQuery(this).parent().parent().parent().parent().find('.wdi_photo_title'),currentFeed);
			}
			
		});

		//checks if all iamges have been succesfully loaded then it updates variables for next time use
		function checkLoaded(){

			if(currentFeed.wdi_load_count===currentFeed.wdi_loadedImages && currentFeed.wdi_loadedImages!=0){
				currentFeed.loadedImages = 0;
				currentFeed.wdi_load_count = 0;
				wdi_front.allImagesLoaded(currentFeed);
				
			}
		}

		//checking if pagination next button was clicked then change page
		if(currentFeed.paginatorNextFlag == true){
			wdi_front.updatePagination(currentFeed,'next');
		}

		//check if load more done successfully then set infinite scroll flag to false
		currentFeed.infiniteScrollFlag = false;
	
	 	
 }




/*
 * Calcuates image resolution
 */
wdi_front.getImageResolution = function(data){
	
	var originalWidth = data['images']['standard_resolution']['width'];
	var originalHeight = data['images']['standard_resolution']['height'];
	var resolution = originalHeight/originalWidth;
	return resolution;
}
/*
 * Calculates data count on global Storage and if custom storage provied
 * it adds custom storage data count to golbals data count and returns length of all storages
 */
wdi_front.getDataLength = function(currentFeed,customStorage){
		var length = 0;
		if(customStorage===undefined){
			for(var j=0;j<currentFeed.dataStorage.length;j++){
				length += currentFeed.dataStorage[j].length;
			}
		}else{
			for(var j=0;j<customStorage.length;j++){
				length += customStorage[j].length;
			}
		}
		
		return length;
	}

wdi_front.getArrayContentLength = function(array,data){
	var sum = 0;
	for(var i = 0; i < array.length; i++){
		if(array[i]['finished']=='finished'){
			continue;
		}
		sum+=array[i][data].length;
	}
	return sum;
}
/*
 * 
 */
wdi_front.displayFeedItems = function(data,currentFeed){

	//gets ready data, gets data template, and appens it into feed_wrapper
	var wdi_feed_counter = currentFeed.feed_row['wdi_feed_counter'];
	var feed_wrapper = jQuery('#wdi_feed_'+wdi_feed_counter + ' .wdi_feed_wrapper');
	
	//if resort_after_pagination is on then rewrite feed data
	if(currentFeed.feed_row['resort_after_load_more'] === '1'){
		feed_wrapper.html('');
		currentFeed.imageIndex = 0;
	}
	
	//if custom filter is set or changed then reset masonry columns
	if(currentFeed.customFilterChanged == true){
		feed_wrapper.html('');
		currentFeed.imageIndex = 0;
		currentFeed.customFilterChanged = false;
	}
	

	var lastIndex = wdi_front.getImgCount(currentFeed)-data.length-1;

	for (var i=0;i<data.length;i++){
		if(data[i]['type'] == 'image'){
			var photoTemplate = wdi_front.getPhotoTemplate(currentFeed);
		}else{
			var photoTemplate = wdi_front.getVideoTemplate(currentFeed);
		}
		
		var rawItem = data[i];
		var item = wdi_front.createObject(rawItem,currentFeed);
		var html = photoTemplate(item);
		feed_wrapper.html(feed_wrapper.html()+html);

		currentFeed.imageIndex++;
		

		//changing responsive indexes for pagination
		if(currentFeed.feed_row.feed_display_view == 'pagination'){
			if((i+1)%currentFeed.feed_row.pagination_per_page_number === 0){
			currentFeed.resIndex+=currentFeed.freeSpaces+1;
			}else{
				currentFeed.resIndex++;
			}
		}	
		
	}


	//fixing last row in case of full caption is open
	//for that triggering click twice to open and close caption text that will fix last row
	jQuery('#wdi_feed_'+currentFeed.feed_row['wdi_feed_counter']+' .wdi_feed_wrapper [wdi_index='+lastIndex+'] .wdi_photo_title').trigger(wdi_front.clickOrTouch);
	jQuery('#wdi_feed_'+currentFeed.feed_row['wdi_feed_counter']+' .wdi_feed_wrapper [wdi_index='+lastIndex+'] .wdi_photo_title').trigger(wdi_front.clickOrTouch);


	//binding onload event for ajax loader
	currentFeed.wdi_loadedImages = 0;
	var columnFlag = false;
	currentFeed.wdi_load_count = i;
	var wdi_feed_counter = currentFeed.feed_row['wdi_feed_counter'];
	var feed_wrapper = jQuery('#wdi_feed_'+wdi_feed_counter + ' img.wdi_img').on('load',function(){
		currentFeed.wdi_loadedImages++;
		checkLoaded();

		//calls wdi_responsive.columnControl() which calculates column number on page
		//and gives feed_wrapper proper column class
		
		if(columnFlag === false){
			// var eachFlag = false;
			// jQuery('#wdi_feed_'+currentFeed.feed_row.wdi_feed_counter+' .wdi_feed_item').each(function(){
			// 	if(!jQuery(this).hasClass('wdi_hidden') && eachFlag==false){
			// 		cstWidth = jQuery(this).width();
			// 		eachFlag = true;
			// 	}
			// });

			wdi_responsive.columnControl(currentFeed,1);
			columnFlag = true;
		}


		//Binds caption opening and closing event to each image photo_title
		if(currentFeed.feed_row.feed_type != 'blog_style'){
		wdi_responsive.bindCaptionEvent(jQuery(this).parent().parent().parent().parent().find('.wdi_photo_title'),currentFeed);
	}
	});

	//checks if all iamges have been succesfully loaded then it updates variables for next time use
	function checkLoaded(){
		if(currentFeed.wdi_load_count===currentFeed.wdi_loadedImages && currentFeed.wdi_loadedImages!=0){
			currentFeed.loadedImages = 0;
			currentFeed.wdi_load_count = 0;
			wdi_front.allImagesLoaded(currentFeed);
		
		}
	}

	//checking if pagination next button was clicked then change page
	if(currentFeed.paginatorNextFlag == true){
		wdi_front.updatePagination(currentFeed,'next');
	}

	//check if load more done successfully then set infinite scroll flag to false
	currentFeed.infiniteScrollFlag = false;
	
}
wdi_front.checkFeedFinished = function(currentFeed){
	for(var i = 0; i < currentFeed.usersData.length; i++){
		if(currentFeed.usersData[i]['finished'] == undefined){
			return false;
		}
	}
	return true;
}
wdi_front.sortingOperator = function(sortImagesBy,sortOrder){
	var operator;
	switch(sortImagesBy){
		case 'date':{
			switch(sortOrder){
				case 'asc':{
					operator = function(a,b){
						return (a['created_time']>b['created_time']) ? 1 : -1;
					}
					break;
				}
				case 'desc':{
					operator = function(a,b){
						return (a['created_time']>b['created_time']) ? -1 : 1;
					}
					break;
				}
			}
			break;
		}
		case 'likes':{
			switch(sortOrder){
				case 'asc':{
					operator = function(a,b){
						return (a['likes']['count']<b['likes']['count']) ? -1 : 1;
					}
					break;
				}
				case 'desc':{
					operator = function(a,b){
						return (a['likes']['count']<b['likes']['count']) ? 1 : -1;
					}
					break;
				}
			}
			break;
		}
		case 'comments':{
			switch(sortOrder){
				case 'asc':{
					operator = function(a,b){
						return (a['comments']['count']<b['comments']['count']) ? -1 : 1;
					}
					break;
				}
				case 'desc':{
					operator = function(a,b){
						return (a['comments']['count']<b['comments']['count']) ? 1 : -1;
					}
					break;
				}
			}
			break;
		}
		case 'random':{
			operator = function(a,b){
				var num = Math.random();
				return (num>0.5) ? 1 : -1;
			}
			break;
		}
	}
	return operator;
}
/*
 * Calls smart picker method and then after receiving data it sorts data based on user choice
 */
wdi_front.feedSort = function(currentFeed,load_more_number){

	var sortImagesBy = currentFeed.feed_row['sort_images_by'];
	var sortOrder = currentFeed.feed_row['display_order'];
	
	if(currentFeed.feed_row['resort_after_load_more'] === '1'){
		currentFeed['data'] = currentFeed['data'].concat(wdi_front.smartPicker(currentFeed,load_more_number));
	}else{
		currentFeed['data'] = wdi_front.smartPicker(currentFeed,load_more_number);
	}

	
	
	var operator = wdi_front.sortingOperator(sortImagesBy,sortOrder);
	currentFeed['data'].sort(operator);
	return currentFeed['data'];

}
/*
 * Filters all requested data and takes some amount of sata for each user
 * and stops picking when it reaches number_of_photos limit
 */
wdi_front.smartPicker = function(currentFeed,load_more_number){
	var dataStorage = [];
	var dataLength = 0;
	var readyData = [];
	var perUser = Math.ceil(currentFeed['feed_row']['number_of_photos']/currentFeed['usersData'].length);
	var number_of_photos = parseInt(currentFeed['feed_row']['number_of_photos']);
	var remainder = 0;

	//check if loadmore was clicked
	if(load_more_number != '' && load_more_number != undefined && load_more_number!=null){
		number_of_photos = parseInt(load_more_number);
		perUser = Math.ceil(number_of_photos/wdi_front.activeUsersCount(currentFeed));
	}


	var sortOperator = function(a,b){
		return (a['data'].length>b['data'].length) ? 1 : -1;
	}
	
	//sorts user data desc
	var usersData = currentFeed['usersData'].sort(sortOperator);

	//picks data from users and updates pagination in request json
	//for next time call
	for (var i = 0; i < usersData.length; i++){
		remainder+=perUser;
		if(usersData[i]['data'].length <= remainder){
			
			var pagination = usersData[i]['pagination']['next_url'];
			if(usersData[i]['finished'] === undefined){
				dataStorage.push(usersData[i]['data']);
				remainder-=usersData[i]['data'].length;
				dataLength+=usersData[i]['data'].length;
			}

			if(usersData[i]['finished'] === undefined){
				if(pagination === undefined || pagination==='' || pagination === null){
					usersData[i]['finished'] = 'finished';
				}
			}
		}
		else{
			if( (dataLength + remainder) > number_of_photos){
				remainder = number_of_photos - dataLength;
			}
			var pickedData = [];
			var indexPuller = 0;
			for(var j = 0; j < remainder; j++){
				if(currentFeed['auto_trigger'] === false){
						if(usersData[i]['finished'] === undefined){
							pickedData.push(usersData[i]['data'][j]);
						}
				}else{
					if(pickedData.length + wdi_front.getDataLength(currentFeed) + wdi_front.getDataLength(currentFeed,dataStorage) <currentFeed['feed_row']['number_of_photos']){
						if(usersData[i]['finished'] === undefined){
							pickedData.push(usersData[i]['data'][j]);
						}
					}else{
						indexPuller++;
					}
				}
				
			}
			j-=indexPuller;

			remainder = 0;
			//updating pagination
			if(pickedData.length != 0){
				var newMaxId = pickedData[j-1]['id'];
				var newMaxTagId = usersData[i]['data'][j]['id'];
				var oldPagination = usersData[i]['pagination'];
				var oldUrl = oldPagination['next_url'];

				//updating pagination url
				if(oldUrl != undefined && oldUrl != null && oldUrl != ''){
					var urlFragments = oldUrl.split('&');
					var urlKeyValue = [];
					for(var k = 0; k<urlFragments.length; k++){
						
						urlKeyValue.push(urlFragments[k].split('='));
						if(urlKeyValue[k][0] === 'max_id'){
							urlKeyValue[k][1] = newMaxId;
						}
						if(urlKeyValue[k][0] === 'max_tag_id'){
							urlKeyValue[k][1] = newMaxTagId.split('_')[0];
						}
						urlKeyValue[k] = urlKeyValue[k].join('=');
					}
				
					var newUrl = urlKeyValue.join('&');
					
					oldPagination['next_max_id'] = newMaxId;
					oldPagination['next_url'] = newUrl;
					
				}else{
					//if pagination is not provided ie there are no more images to paginate
					//it generates pagination url manually
					switch(currentFeed.usersData[i]['username'][0]){
						case '#':{
							
							oldPagination['next_url'] = 'https://api.instagram.com/v1/tags/'
										+usersData[i]['user_id'].substr(1,usersData[i]['user_id'].length)+
										'/media/recent?access_token='+currentFeed.feed_row.access_token+'&callback=jQuery111205299771015997976_1438177624435&max_tag_id='
										+newMaxTagId.split('_')[0]+
										'&_=1438177624450';
							oldPagination['next_max_tag_id'] = newMaxId;		
							break;
						}
						default:{
							
							oldPagination['next_url'] = 'https://api.instagram.com/v1/users/'
										+usersData[i]['user_id']+
										'/media/recent?access_token='+currentFeed.feed_row.access_token+'&callback=jQuery111205299771015997976_1438177624435&max_id='
										+newMaxId+
										'&_=1438177624450';
							oldPagination['next_max_id'] = newMaxId;
							break;
						}
					}
					
				}
			}
			
			
			//pushes picked data into local storage
			dataLength+=pickedData.length;
			dataStorage.push(pickedData);

		}
	}
	
	//checks if in golbal storage user already exisit then it adds new data to user old data
	//else it simple puches new user with it's data to global storage
	for(i = 0; i<dataStorage.length; i++){
		if(currentFeed.dataStorage[i] === undefined){
			currentFeed.dataStorage.push(dataStorage[i]);
		}else{
			currentFeed.dataStorage[i] = currentFeed.dataStorage[i].concat(dataStorage[i]); 
		}	
	}

	//parsing data for lightbox
	currentFeed.parsedData = wdi_front.parseLighboxData(currentFeed);

	//combines together all avialable data in global storage and returns it
	for (i = 0 ; i < dataStorage.length; i++){
		readyData = readyData.concat(dataStorage[i]);
	}
	
	return readyData;
}

/*
 * returns json object for inserting photo template
 */
wdi_front.createObject = function(obj,currentFeed){
	
	var caption = (obj['caption']!=null)? obj['caption']['text'] : '&nbsp';
	var image_url;
	if(window.innerWidth>=640){
		image_url = obj['images']['standard_resolution']['url'];
		if(currentFeed.feed_row.feed_type=='blog_style' || currentFeed.feed_row.feed_type=='image_browser'){
			image_url = obj['link']+'media?size=l';
		}
	}
	if(window.innerWidth>=150 && window.innerWidth<640){
		image_url = obj['images']['low_resolution']['url'];
		if(currentFeed.feed_row.feed_type=='blog_style' || currentFeed.feed_row.feed_type=='image_browser'){
			image_url = obj['link']+'media?size=l';
		}
	}
	if(window.innerWidth<150){
		image_url = obj['images']['thumbnail']['url'];
		if(currentFeed.feed_row.feed_type=='blog_style' || currentFeed.feed_row.feed_type=='image_browser'){
			image_url = obj['link']+'media?size=m';
		}
	}
	var videoUrl = '';
	if(obj['type']=='video'){
		videoUrl = obj['videos']['standard_resolution']['url'];
	}
	var imageIndex = currentFeed.imageIndex;
	
	var photoObject = {
		'id' : obj['id'],
		'caption' : caption,
		'image_url': image_url,
		'likes': obj['likes']['count'],
		'comments' : obj['comments']['count'],
		'wdi_index': imageIndex,
		'wdi_res_index': currentFeed.resIndex,
		'link': obj['link'],
		'video_url':videoUrl
	};
	return photoObject;
}

/*
 * If pagination is on sets the proper page number
 */
wdi_front.setPage = function(currentFeed){
	var display_type = currentFeed.feed_row.feed_display_view;
	var feed_type = currentFeed.feed_row.feed_type;
	if (display_type != 'pagination'){
		return '';
	}
	var imageIndex = currentFeed.imageIndex;
	if(feed_type == 'image_browser'){
		var divider = 1;
	}else{
		var divider = Math.abs(currentFeed.feed_row.pagination_per_page_number);
	}
	
	currentFeed.paginator = Math.ceil((imageIndex+1)/divider);
	
	
	return currentFeed.paginator;
}	

/*
 * Template for all feed items which have type=image
 */
wdi_front.getPhotoTemplate = function(currentFeed){
	var page = wdi_front.setPage(currentFeed);
	var customClass='';
	var pagination='';
	var onclick = '';
	var overlayCustomClass = '';
	var thumbClass = 'fa-fullscreen';
	if(currentFeed.feed_row.feed_type=='blog_style' || currentFeed.feed_row.feed_type=='image_browser'){
		thumbClass = '';
	}
	if(page != ''){
		pagination = 'wdi_page="'+page+'"';
	}
	if(page!= '' && page != 1){
		customClass = 'wdi_hidden';
	}

	//checking if caption is opend by default then add wdi_full_caption class
	//only in masonry
	if(currentFeed.feed_row.show_full_description == 1 && currentFeed.feed_row.feed_type == 'masonry'){
		customClass += ' wdi_full_caption';
	}

	//creating onclick string for different options
	switch(currentFeed.feed_row.feed_item_onclick){
		case 'lightbox':{
			onclick="onclick=wdi_feed_"+currentFeed.feed_row.wdi_feed_counter+".galleryBox('<%=id%>')";
			break;
		}
		case 'instagram':{
			onclick='onclick="window.open (\'<%= link%>\',\'_blank\')"';
			overlayCustomClass = 'wdi_hover_off';
			thumbClass = '';
			break;
		}
		case 'none':{
			onclick = '';
			overlayCustomClass = 'wdi_cursor_off wdi_hover_off';
			thumbClass='';
		}
	}
	var wdi_feed_counter = currentFeed.feed_row['wdi_feed_counter'];
	var source = '<div class="wdi_feed_item '+customClass+'"  wdi_index=<%= wdi_index%>  wdi_res_index=<%= wdi_res_index%> '+pagination+' wdi_type="image" id="wdi_'+wdi_feed_counter+'_<%=id%>">'+
		'<div class="wdi_photo_wrap">'+
		'<div class="wdi_photo_wrap_inner">'+
			'<div class="wdi_photo_img">'+
				'<img class="wdi_img" src="<%=image_url%>" alt="feed_image" onerror="wdi_front.brokenImageHandler(this);">'+
				'<div class="wdi_photo_overlay '+overlayCustomClass+'" >'+
					'<div class="wdi_thumb_icon" '+onclick+' style="display:table;width:100%;height:100%;">'+
						'<div style="display:table-cell;vertical-align:middle;text-align:center;color:white;">'+
							'<i class="fa '+thumbClass+'"></i>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>'+
		'</div>';
		if(currentFeed['feed_row']['show_likes'] === '1' || currentFeed['feed_row']['show_comments'] === '1' || currentFeed['feed_row']['show_description'] ==='1'){
			source+='<div class="wdi_photo_meta">';
			if(currentFeed['feed_row']['show_likes'] === '1'){
				source+='<div class="wdi_thumb_likes"><i class="fa fa-heart-o">&nbsp;<%= likes%></i></div>';
			}
			if(currentFeed['feed_row']['show_comments'] === '1'){
				source+='<div class="wdi_thumb_comments"><i class="fa fa-comment-o">&nbsp;<%= comments%></i></div>';
			}
			source+='<div class="clear"></div>';
			if(currentFeed['feed_row']['show_description'] ==='1'){
				source+='<div class="wdi_photo_title" >'+
							'<%=caption%>'+
						'</div>';
			}
			source+='</div>';
		}
		
	source+='</div>';
	var template = _.template(source);
	return template;
}

wdi_front.replaceToVideo = function(url,index,feed_counter){

	overlayHtml = "<video style='width:auto !important; height:auto !important; max-width:100% !important; max-height:100% !important; margin:0 !important;' controls=''>"+
							"<source src='"+url+"' type='video/mp4'>"+
							"Your browser does not support the video tag. </video>";

	jQuery('#wdi_feed_'+feed_counter+' [wdi_index="'+index+'"] .wdi_photo_wrap_inner').html(overlayHtml);
	jQuery('#wdi_feed_'+feed_counter+' [wdi_index="'+index+'"] .wdi_photo_wrap_inner video').get(0).play();
}
/*
 * Template for all feed items which have type=video
 */
wdi_front.getVideoTemplate = function(currentFeed){
	var page = wdi_front.setPage(currentFeed);
	var customClass='';
	var pagination='';
	var thumbClass = 'fa-play';
	var onclick = '';
	var overlayCustomClass = '';
	
	
	if(page != ''){
		pagination = 'wdi_page="'+page+'"';
	}
	if(page!= '' && page != 1){
		customClass = 'wdi_hidden';
	}

	//checking if caption is opend by default then add wdi_full_caption class
	//only in masonry
	if(currentFeed.feed_row.show_full_description == 1 && currentFeed.feed_row.feed_type == 'masonry'){
		customClass += ' wdi_full_caption';
	}
	
	//creating onclick string for different options
	switch(currentFeed.feed_row.feed_item_onclick){
		case 'lightbox':{
			onclick="onclick=wdi_feed_"+currentFeed.feed_row.wdi_feed_counter+".galleryBox('<%=id%>')";
			break;
		}
		case 'instagram':{
			onclick='onclick="window.open (\'<%= link%>\',\'_blank\')"';
			overlayCustomClass = 'wdi_hover_off';
			thumbClass = '';
			break;
		}
		case 'none':{
			overlayCustomClass = 'wdi_cursor_off wdi_hover_off';
			thumbClass='';
			if(currentFeed.feed_row.feed_type=='blog_style' || currentFeed.feed_row.feed_type=='image_browser'){
				thumbClass='fa-play';
			}
		}
	}


	var wdi_feed_counter = currentFeed.feed_row['wdi_feed_counter'];
	var source = '<div class="wdi_feed_item '+customClass+'"  wdi_index=<%= wdi_index%> wdi_res_index=<%= wdi_res_index%> '+pagination+' wdi_type="image" id="wdi_'+wdi_feed_counter+'_<%=id%>">'+
		'<div class="wdi_photo_wrap">'+
		'<div class="wdi_photo_wrap_inner">'+
			'<div class="wdi_photo_img">'+
				'<img class="wdi_img" src="<%=image_url%>" alt="feed_image" onerror="wdi_front.brokenImageHandler(this);">'+
				'<div class="wdi_photo_overlay '+overlayCustomClass+'" '+onclick+'>'+
					'<div class="wdi_thumb_icon" style="display:table;width:100%;height:100%;">'+
						'<div style="display:table-cell;vertical-align:middle;text-align:center;color:white;">'+
							'<i class="fa '+thumbClass+'"></i>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>'+
		'</div>';
	if(currentFeed['feed_row']['show_likes'] === '1' || currentFeed['feed_row']['show_comments'] === '1' || currentFeed['feed_row']['show_description'] ==='1'){
		source+='<div class="wdi_photo_meta">';
		if(currentFeed['feed_row']['show_likes'] === '1'){
			source+='<div class="wdi_thumb_likes"><i class="fa fa-heart-o">&nbsp;<%= likes%></i></div>';
		}
		if(currentFeed['feed_row']['show_comments'] === '1'){
			source+='<div class="wdi_thumb_comments"><i class="fa fa-comment-o">&nbsp;<%= comments%></i></div>';
		}
		source+='<div class="clear"></div>';
		if(currentFeed['feed_row']['show_description'] ==='1'){
			source+='<div class="wdi_photo_title" >'+
						'<%=caption%>'+
					'</div>';
		}
		source+='</div>';
	}
	source+='</div>';
	var template = _.template(source);
	return template;
}

wdi_front.bindEvents = function(currentFeed){
	if(currentFeed.feed_row.feed_display_view == 'load_more_btn'){
		//binding load more event
		jQuery('#wdi_feed_'+currentFeed.feed_row['wdi_feed_counter']+' .wdi_load_more_container').on(wdi_front.clickOrTouch,function(){
			//do the actual load more operation
			wdi_front.loadMore(jQuery(this).find('.wdi_load_more_wrap'));
		});
	}
	
	if(currentFeed.feed_row.feed_display_view == 'pagination'){
		//binding pagination events
		jQuery('#wdi_feed_'+currentFeed.feed_row['wdi_feed_counter']+' #wdi_next').on(wdi_front.clickOrTouch,function(){
			wdi_front.paginatorNext(jQuery(this),currentFeed);
		});
		jQuery('#wdi_feed_'+currentFeed.feed_row['wdi_feed_counter']+' #wdi_prev').on(wdi_front.clickOrTouch,function(){
			wdi_front.paginatorPrev(jQuery(this),currentFeed);
		});
		jQuery('#wdi_feed_'+currentFeed.feed_row['wdi_feed_counter']+' #wdi_last_page').on(wdi_front.clickOrTouch,function(){
			wdi_front.paginationLastPage(jQuery(this),currentFeed);
		});
		jQuery('#wdi_feed_'+currentFeed.feed_row['wdi_feed_counter']+' #wdi_first_page').on(wdi_front.clickOrTouch,function(){
			wdi_front.paginationFirstPage(jQuery(this),currentFeed);
		});
		//setting pagiantion flags
		currentFeed.paginatorNextFlag = false;
	}
	if(currentFeed.feed_row.feed_display_view == 'infinite_scroll'){
		//binding infinite scroll Events
		jQuery(window).on('scroll',function(){
			wdi_front.infiniteScroll(currentFeed);
		});
		//infinite scroll flags
		currentFeed.infiniteScrollFlag = false;
	}

	
}
wdi_front.infiniteScroll = function(currentFeed){



	//console.log(jQuery(window).scrollTop());
	//console.log(jQuery('#wdi_feed_'+currentFeed.feed_row['wdi_feed_counter']+' #wdi_infinite_scroll').offset().top);
	if(jQuery(window).scrollTop()<=jQuery('#wdi_feed_'+currentFeed.feed_row['wdi_feed_counter']+' #wdi_infinite_scroll').offset().top){
		if(currentFeed.infiniteScrollFlag === false){
			currentFeed.infiniteScrollFlag = true;
			wdi_front.loadMore(jQuery('#wdi_feed_'+currentFeed.feed_row['wdi_feed_counter']+' #wdi_infinite_scroll'),currentFeed);
		}
		
	}
}

















wdi_front.paginationFirstPage = function(btn,currentFeed){
	if(currentFeed.paginator == 1 || currentFeed.currentPage == 1){
		btn.addClass('wdi_disabled');
		return;
	}
	var oldPage = currentFeed.currentPage;
	currentFeed.currentPage = 1;
	wdi_front.updatePagination(currentFeed,'custom',oldPage);

	//enable last page button
	var last_page_btn = btn.parent().find('#wdi_last_page');
	last_page_btn.removeClass('wdi_disabled');

	//disabling first page button
	btn.addClass('wdi_disabled');

}
wdi_front.paginationLastPage = function(btn,currentFeed){
	if(currentFeed.paginator == 1 || currentFeed.currentPage==currentFeed.paginator){
		return;
	}
	var oldPage = currentFeed.currentPage;
	currentFeed.currentPage = currentFeed.paginator;
	wdi_front.updatePagination(currentFeed,'custom',oldPage);

	//disableing last page button
	btn.addClass('wdi_disabled');

	//enabling first page button
	var first_page_btn = btn.parent().find('#wdi_first_page');
	first_page_btn.removeClass('wdi_disabled');
}
wdi_front.paginatorNext = function(btn,currentFeed){
	var last_page_btn = btn.parent().find('#wdi_last_page');
	var first_page_btn = btn.parent().find('#wdi_first_page');
	currentFeed.paginatorNextFlag = true;
	if(currentFeed.paginator == currentFeed.currentPage && !wdi_front.checkFeedFinished(currentFeed)){
		currentFeed.currentPage++;
		var number_of_photos = currentFeed.feed_row.number_of_photos;
		wdi_front.loadMore(btn,currentFeed,number_of_photos);
		//on the last page don't show got to last page button
		last_page_btn.addClass('wdi_disabled');
	}else if(currentFeed.paginator > currentFeed.currentPage){
		currentFeed.currentPage++;
		wdi_front.updatePagination(currentFeed,'next');
		//check if new page isn't the last one then enable last page button
		if(currentFeed.paginator > currentFeed.currentPage){
			last_page_btn.removeClass('wdi_disabled');
		}else{
			last_page_btn.addClass('wdi_disabled');
		}
	}

	//enable first page button
	first_page_btn.removeClass('wdi_disabled');
	
	
}
wdi_front.paginatorPrev = function(btn,currentFeed){
	var last_page_btn = btn.parent().find('#wdi_last_page');
	var first_page_btn = btn.parent().find('#wdi_first_page');
	if(currentFeed.currentPage == 1){
		first_page_btn.addClass('wdi_disabled');
		return;
	}
	
	currentFeed.currentPage--;
	wdi_front.updatePagination(currentFeed,'prev');
	
	//enable last page button
	last_page_btn.removeClass('wdi_disabled');

	if(currentFeed.currentPage == 1){
		first_page_btn.addClass('wdi_disabled');
	}

}

//displays proper images for specific page after pagination buttons click event
wdi_front.updatePagination = function (currentFeed,dir,oldPage){
	var currentFeedString = '#wdi_feed_'+currentFeed.feed_row['wdi_feed_counter'];
	jQuery(currentFeedString+' [wdi_page="'+currentFeed.currentPage+'"]').each(function(){
		jQuery(this).removeClass('wdi_hidden');
	});
	switch (dir){
		case 'next':{
			var oldPage = currentFeed.currentPage-1;
			jQuery(currentFeedString+' .wdi_feed_wrapper').height(jQuery('.wdi_feed_wrapper').height());
			jQuery(currentFeedString+' [wdi_page="'+oldPage+'"]').each(function(){
				jQuery(this).addClass('wdi_hidden');
			});	
			break;
		}
		case 'prev':{
			var oldPage = currentFeed.currentPage+1;
			jQuery(currentFeedString+' .wdi_feed_wrapper').height(jQuery('.wdi_feed_wrapper').height());
			jQuery(currentFeedString+' [wdi_page="'+oldPage+'"]').each(function(){
				jQuery(this).addClass('wdi_hidden');
			});
			break;
		}
		case 'custom':{
			var oldPage = oldPage;
			if(oldPage!=currentFeed.currentPage){
				jQuery(currentFeedString+' .wdi_feed_wrapper').height(jQuery('.wdi_feed_wrapper').height());
				jQuery(currentFeedString+' [wdi_page="'+oldPage+'"]').each(function(){
					jQuery(this).addClass('wdi_hidden');
				});
			}
			
			break;
		}
	}
	currentFeed.paginatorNextFlag = false;
	
	jQuery(currentFeedString+' .wdi_feed_wrapper').css('height','auto');
	jQuery(currentFeedString+' #wdi_current_page').text(currentFeed.currentPage);
}


wdi_front.loadMore = function(button,_currentFeed){
	

	var dataCounter = 0;
	if(button != '' && button != undefined && button != 'initial' && button != 'initial-keep'){
		var currentFeed = window[button.parent().parent().parent().parent().attr('id')];
	}
	if(_currentFeed != undefined){
		var currentFeed = _currentFeed;
	}
	//check if any filter is enabled and filter user images has finished
	//then stop any load more action
	var activeFilter = 0,finishedFilter = 0;
	for(var i = 0; i < currentFeed.userSortFlags.length; i++){
		if(currentFeed.userSortFlags[i].flag === true){
			activeFilter++;
			for(var j = 0; j < currentFeed.usersData.length; j++){
				if(currentFeed.userSortFlags[i]['id'] === currentFeed.usersData[j]['user_id']){
					if(currentFeed.usersData[j]['finished']==='finished'){
						finishedFilter++;
					}
				}
			}
		}
	}
	if(activeFilter===finishedFilter && activeFilter != 0){
		return;
	}


	//if button is not provided than it enables auto_tiggering and recursively loads images
	if(button === ''){
		currentFeed['auto_trigger'] = true;
	}else{
		currentFeed['auto_trigger'] = false;
	}
	//ading ajax loading 
	wdi_front.ajaxLoader(currentFeed);
	

	
	//check if masonry view is on and and feed display type is pagination then
	//close all captions before loading more pages for porper pagination rendering
	if(currentFeed.feed_row.feed_type === 'masonry' && currentFeed.feed_row.feed_display_view=='pagination'){
		jQuery('#wdi_feed_'+wdi_front.feed_counter+' .wdi_full_caption').each(function(){
			jQuery(this).find('.wdi_photo_title').trigger(wdi_front.clickOrTouch);
		});
	}



	//check if all data loaded then remove ajaxLoader
	for(var i=0 ;i< currentFeed.usersData.length;i++){
		if(currentFeed.usersData[i]['finished'] === 'finished'){
			dataCounter++;
		}
	}
	if(dataCounter === currentFeed.usersData.length){
		wdi_front.allImagesLoaded(currentFeed);
		jQuery('#wdi_feed_'+currentFeed['feed_row']['wdi_feed_counter']+' .wdi_load_more').remove();
		
	}

	var usersData = currentFeed['usersData'];
	currentFeed.loadMoreDataCount = currentFeed.feed_users.length;
	
	for(var i=0; i<usersData.length;i++){

		var pagination = usersData[i]['pagination'];
		var user = {
			user_id : usersData[i]['user_id'],
			username : usersData[i]['username']
		}
		//checking if pagination url exists then load images, else skip
		if(pagination['next_url'] != '' && pagination['next_url'] != null && pagination['next_url'] != undefined){
			var next_url = pagination['next_url'];
			wdi_front.loadMoreRequest(user,next_url,currentFeed,button);
		}else{
		
			//usersData[i]['finished'] = 'finished';
			
			if(button == 'initial-keep'){
				
				currentFeed.temproraryUsersData[i] = currentFeed.usersData[i];	
			}
			currentFeed.loadMoreDataCount--;
			continue;
		}
	}


}

/*
 * Requests images based on provided pagination url
 */
wdi_front.loadMoreRequest = function(user,next_url,currentFeed,button){

	var usersData = currentFeed['usersData'];
	var errorMessage = '';
	
			jQuery.ajax({
					type: 'POST',
					url: next_url,
					dataType: 'jsonp',
					success: function(response){
						
						if(response === '' || response==undefined || response==null){
							errorMessage=wdi_front_messages.network_error;
							currentFeed.loadMoreDataCount--;
							alert(errorMessage);
							return;
						}
						if(response['meta']['code'] != 200){
							errorMessage = response['meta']['error_message'];
							currentFeed.loadMoreDataCount--;
							alert(errorMessage);
							return;
						}
						
						response['user_id'] = user.user_id;
						response['username'] = user.username;

						for(var i=0;i<currentFeed['usersData'].length;i++){
							if(response['user_id'] === currentFeed['usersData'][i]['user_id']){
								
								///mmm!!!
								if(response['user_id'][0]==='#'){
									response['data'] = wdi_front.appendRequestHashtag(response['data'],response['user_id']);
								}
								////////////////
								/*if button is initial-keep then we will lose currentFeed['usersData'][i]
								for not loosing it we keep it in currentFeed.temproraryUsersData, which value will be
								used later in wdi_front.checkForLoadMoreDone(), in other cases when button is set to
								initial we already keep data in that variable, so we don't deed to keep it again, it will give us duplicate value
								*/
								if(button == 'initial-keep'){
									currentFeed.temproraryUsersData[i] = currentFeed.usersData[i];
								}
								currentFeed['usersData'][i] = response;
								currentFeed.loadMoreDataCount--;
							}
						}
						//checks if load more done then displays feed
						wdi_front.checkForLoadMoreDone(currentFeed,button);
					}
				});
		
	
}
wdi_front.checkForLoadMoreDone = function(currentFeed,button){
	var load_more_number = currentFeed.feed_row['load_more_number'];
	var number_of_photos = currentFeed.feed_row['number_of_photos'];

	if(currentFeed.loadMoreDataCount == 0){
		
		currentFeed.temproraryUsersData = wdi_front.mergeData(currentFeed.temproraryUsersData,currentFeed.usersData);
		var gettedDataLength = wdi_front.getArrayContentLength(currentFeed.temproraryUsersData,'data');
		/*this will happen when we call loadMore first time 
		initial-keep is the same as initial except that if loadMore is called
		with initial-keep we store data on currentFee.temproraryUsersData before checkLoadMoreDone() 
		function call*/
		if(button == 'initial-keep'){
			button = 'initial';
		}
		//if button is set to inital load number_of_photos photos
		if(button == 'initial'){
			/*if existing data length is smaller then load_more_number then get more objects until desired number is reached
			 also if it is not possible to reach the desired number (this will happen when all users has no more photos) then
			 displayFeed()*/
			if(gettedDataLength < number_of_photos && !wdi_front.userHasNoPhoto(currentFeed,currentFeed.temproraryUsersData)){
				wdi_front.loadMore('initial',currentFeed);
			}else{

				currentFeed.usersData = currentFeed.temproraryUsersData;

				wdi_front.displayFeed(currentFeed);
				//when all data us properly displayed check for any active filters and then apply them
				wdi_front.applyFilters(currentFeed);

				//resetting temprorary users data array for the next loadmoer call
				currentFeed.temproraryUsersData = [];
			}

		}else{
			//else load load_more_number photos
			//if existing data length is smaller then load_more_number then get more objects until desired number is reached
			
			if(gettedDataLength < load_more_number && !wdi_front.userHasNoPhoto(currentFeed,currentFeed.temproraryUsersData)){
			wdi_front.loadMore(undefined,currentFeed);
			}else{

				currentFeed.usersData = currentFeed.temproraryUsersData;

				wdi_front.displayFeed(currentFeed,load_more_number);
				//when all data us properly displayed check for any active filters and then apply them
				wdi_front.applyFilters(currentFeed);

				//resetting temprorary users data array for the next loadmoer call
				currentFeed.temproraryUsersData = [];
			}
		}

		
		

	}
}

wdi_front.mergeData = function(array1, array2){
	
	
	for(var i = 0; i <array2.length; i++){
		if(array1[i] != undefined){
			if(array2[i]['finished'] == 'finished'){
				continue;
			}
			//if user data is finished then dont add duplicate data
			if(array1[i]['pagination']['next_max_id'] == undefined){
				continue;
			}
			//extend data
			array1[i]['data'] = array1[i]['data'].concat(array2[i]['data']);
			array1[i]['pagination'] = array2[i]['pagination'];
			array1[i]['user_id'] = array2[i]['user_id'];
			array1[i]['username'] = array2[i]['username'];
			array1[i]['meta'] = array2[i]['meta'];
		}else{
			array1.push(array2[i]);
		}
	}
	return array1;
}

	



//broken image handling
wdi_front.brokenImageHandler = function(source){   
    source.src = wdi_url.plugin_url+"../images/missing.png";
    source.onerror = "";
    return true;

}


//ajax loading
wdi_front.ajaxLoader = function(currentFeed){
	var wdi_feed_counter = currentFeed.feed_row['wdi_feed_counter'];
	var feed_container = jQuery('#wdi_feed_'+wdi_feed_counter);
	
	if(currentFeed.feed_row.feed_display_view == 'load_more_btn'){
		feed_container.find('.wdi_load_more').addClass('wdi_hidden');
		feed_container.find('.wdi_spinner').removeClass('wdi_hidden');
	}
    /////////////////////////////////////////////////////
	if(currentFeed.feed_row.feed_display_view == 'infinite_scroll'){
		var loadingDiv;
		if(feed_container.find('.wdi_ajax_loading').length == 0){
			loadingDiv = jQuery('<div class="wdi_ajax_loading"><div><div><img class="wdi_load_more_spinner" src="'+wdi_url.plugin_url+'../images/ajax_loader.png"></div></div></div>');
			feed_container.append(loadingDiv);
		}else{
			loadingDiv = feed_container.find('.wdi_ajax_loading');
		}
		loadingDiv.removeClass('wdi_hidden');
	}
	
}
//if all images loaded then clicking load more causes it's removal
wdi_front.allImagesLoaded = function(currentFeed){
	//clearInterval(currentFeed.loadingInterval);
	//jQuery('#wdi_feed_'+currentFeed.feed_row['wdi_feed_counter']+' .wdi_ajax_loading').remove();

	//if all images loaded then enable load more button and hide spinner
	var wdi_feed_counter = currentFeed.feed_row['wdi_feed_counter'];
	var feed_container = jQuery('#wdi_feed_'+wdi_feed_counter);
	
	if(currentFeed.feed_row.feed_display_view == 'load_more_btn'){
		feed_container.find('.wdi_load_more').removeClass('wdi_hidden');
		feed_container.find('.wdi_spinner').addClass('wdi_hidden');
	}

	if(currentFeed.feed_row.feed_display_view == 'infinite_scroll'){
		jQuery('#wdi_feed_'+currentFeed.feed_row['wdi_feed_counter']+' .wdi_ajax_loading').addClass('wdi_hidden');
	}

	//custom event fired for user based custom js
	feed_container.trigger('wdi_feed_loaded');

}


//shows different parts of the feed based user choice
wdi_front.show = function(name,currentFeed){
	var wdi_feed_counter = currentFeed.feed_row['wdi_feed_counter'];
	var feed_container = jQuery('#wdi_feed_'+wdi_feed_counter + ' .wdi_feed_container');
	
	switch (name){
		case 'header':{
			show_header();
			break;
		}
		case 'users':{
			show_users(currentFeed);
			break;
		}
			
	}
	function show_header(){

		var templateData = {
					'feed_thumb': currentFeed['feed_row']['feed_thumb'],
					'feed_name':currentFeed['feed_row']['feed_name'],
				};
				
		var headerTemplate = wdi_front.getHeaderTemplate(),
				      html = headerTemplate(templateData),
		     containerHtml = feed_container.find('.wdi_feed_header').html();

		feed_container.find('.wdi_feed_header').html(containerHtml+html);






	}
	function show_users(currentFeed){
		feed_container.find('.wdi_feed_users').html('');
		var users = currentFeed['feed_users'];
		var access_token = currentFeed['feed_row']['access_token'];
		
		var i = 0;
		currentFeed.headerUserinfo = [];
		getThumb();
		//recursively calls itself until all user data is ready then displyes it with escapeRequest
		function getThumb(){
			
			if(currentFeed.headerUserinfo.length == users.length){
				escapeRequest(currentFeed.headerUserinfo,currentFeed);
				return;
			}
			switch(users[currentFeed.headerUserinfo.length][0]){
				case '#':{
					
					var errorMessage = '';
					var url ='https://api.instagram.com/v1/tags/'+users[i].substr(1,users[i].length)+'/media/recent?access_token='+access_token;
					jQuery.ajax({
						'type': 'POST',
						'url' : url,
						dataType: 'jsonp',
						success: function(response){
							
							if(response == '' || response == undefined || response == null){
								errorMessage = wdi_front_messages.network_error;
								alert(errorMessage);
								return;
							}
							if(response['meta']['code']!=200){
								errorMessage = response['meta']['error_message'];
								alert(errorMessage);
								return;
							}
							if(response['data'].length === 0){
								errorMessage = wdi_front_messages.hashtag_nodata;
								alert(errorMessage);
								return;
							}
							
							thumb_img = response['data'][0]['images']['thumbnail']['url'];
							var obj = {
								name: users[i],
								url: thumb_img,
							};
							i++;
							currentFeed.headerUserinfo.push(obj);
							getThumb();
						}
					});
					break;
				}
				default:{
					var errorMessage = '';
					var url = 'https://api.instagram.com/v1/users/search?q='+users[i]+'&access_token='+access_token;
					var userIndex = i;
					jQuery.ajax({
						'type': 'POST',
						'url' : url,
						'dataType' : 'jsonp',
						success: function(response){

							if(response == '' || response == undefined || response == null){
								errorMessage = wdi_front_messages.network_error;
								alert(errorMessage);
								return;
							}
							if(response['meta']['code']!=200){
								errorMessage = response['meta']['error_message'];
								alert(errorMessage);
								return;
							}
							if(response['data'].length === 0){
								errorMessage = wdi_front_messages.hashtag_nodata;
								alert(errorMessage);
								return;
							}
							for(var j=0; j,response['data'].length;j++){
								if(response['data'][j]['username'] === users[i]){
									thumb_img = response['data'][j]['profile_picture'];

									var obj = {
										id : response['data'][j]['id'],
										name: users[i],
										url: thumb_img,
									};
									
									if(/*currentFeed.feed_row.display_user_info == '1'*/1){
										//getting user full info
										var nurl = 'https://api.instagram.com/v1/users/'+response['data'][j]['id']+'/?access_token='+access_token;
										jQuery.ajax({
											'type': 'POST',
											'url' : nurl,
											'dataType' : 'jsonp',
											success: function(response){
												if(response == '' || response == undefined || response == null){
													errorMessage = wdi_front_messages.network_error;
													alert(errorMessage);
													return;
												}
												if(response['meta']['code']!=200){
													errorMessage = response['meta']['error_message'];
													alert(errorMessage);
													return;
												}
												if(response['data'].length === 0){
													errorMessage = wdi_front_messages.hashtag_nodata;
													alert(errorMessage);
													return;
												}	
												var obj = {
													id : response['data']['id'],
													name: response['data']['username'],
													url: response['data']['profile_picture'],
													bio: response['data']['bio'],
													counts: response['data']['counts'],
													website: response['data']['website'],
													full_name: response['data']['full_name']
												}
											
												currentFeed.headerUserinfo.push(obj);
												i++;
												getThumb();
											
											}
										});
										
									}else{
										
									   currentFeed.headerUserinfo.push(obj);
									   i++;
									   getThumb();
									}
						
									break;
								}
							}
							
						}
					});
					break;
				}
			}	
		}
		//when all user data is ready break recursion and create user elements
		function escapeRequest(info,currentFeed){

			feed_container.find('.wdi_feed_users').html('');
			for(var k = 0; k< info.length;k++){
				//setting all user filters to false

				var userFilter = {
					'flag': false,
					'id': info[k]['id'],
					'name': info[k]['name']
				};
				

				//user inforamtion
				var feed_users_arr = currentFeed.feed_row.feed_users.split(',');
				var hashtagClass = (info[k]['name'][0] == '#') ? 'wdi_header_hashtag' : '';

				var templateData = {
					'user_index' : k,
					'user_img_url': info[k]['url'],
					'counts': info[k]["counts"],
					'feed_counter':currentFeed.feed_row.wdi_feed_counter,
					'user_name':info[k]['name'],
					'bio': info[k]['bio'],
					'usersCount': feed_users_arr.length,
					'hashtagClass':hashtagClass

				};
				
	
				var userTemplate = wdi_front.getUserTemplate(currentFeed,info[k]['name']),
				    html = userTemplate(templateData),
				    containerHtml = feed_container.find('.wdi_feed_users').html();

				feed_container.find('.wdi_feed_users').html(containerHtml+html);

				currentFeed.userSortFlags.push(userFilter);
				
				var clearFloat = jQuery('<div class="clear"></div>');

			}
			feed_container.find('.wdi_feed_users').append(clearFloat);
		};
	}

}


wdi_front.getUserTemplate =function(currentFeed,username){
	var usersCount = currentFeed.feed_row.feed_users.split(',').length,
		instagramLink,instagramLinkOnClick,js;

	switch(username[0]){
		case '#':{
			instagramLink = '//instagram.com/explore/tags/'+username.substr(1,username.length);
			break;
		}
		default:{
			instagramLink = '//instagram.com/'+username;
			break;
		}
	}
	js = 'window.open("'+instagramLink+'","_blank")';
	instagramLinkOnClick = "onclick='"+js+"'";

	var source ='<div class="wdi_single_user" user_index="<%=user_index%>">'+
					'<div class="wdi_header_user_text <%=hashtagClass%>">'+

						'<div class="wdi_user_img_wrap">'+
						'<img src="<%= user_img_url%>">';
						if(usersCount > 1){
							source+='<div  title="'+wdi_front_messages.filter_title+'" class="wdi_filter_overlay">'+
										'<div  class="wdi_filter_icon">'+
											'<span onclick="wdi_front.addFilter(<%=user_index%>,<%=feed_counter%>);" class="fa fa-filter"></span>'+
										'</div>'+
									'</div>';
						}
						source+='</div>';
						source += '<h3 '+instagramLinkOnClick+'><%= user_name%></h3>';	

						if(username[0] !== '#'){
							if(currentFeed.feed_row.follow_on_instagram_btn == '1'){
								source+='<div class="wdi_user_controls">'+
											'<div class="wdi_follow_btn" onclick="window.open(\'//instagram.com/<%= user_name%>\',\'_blank\')"><span> Follow</span></div>'+
										'</div>';
							}
						source+='<div class="wdi_media_info">'+
									'<p class="wdi_posts"><span class="fa fa-camera-retro"><%= counts.media%></span></p>'+
									'<p class="wdi_followers"><span class="fa fa-user"><%= counts.followed_by%></span></p>'+
								'</div>';
						}else{
							source+='<div class="wdi_user_controls">'+
								'</div>'+
								'<div class="wdi_media_info">'+
									'<p class="wdi_posts"><span></span></p>'+
									'<p class="wdi_followers"><span></span></p>'+
								'</div>';
						}
						
						if(usersCount == 1 && username[0] !== '#' && currentFeed.feed_row.display_user_info == '1'){
							source+='<div class="wdi_bio"><%= bio%></div>';
						}
						
		   
					
						

			source+='</div>'+
				'</div>';
	var template = _.template(source);
	return template;
}



wdi_front.getHeaderTemplate = function(){
var source='<div class="wdi_header_wrapper">'+
				'<div class="wdi_header_img_wrap">'+
					'<img src="<%=feed_thumb%>">'+
				'</div>'+
				'<div class="wdi_header_text"><%=feed_name%></div>'+
				'<div class="clear">'+
			'</div>';
	var template = _.template(source);
	return template;
}


//sets user filter to true and applys filter to feed
wdi_front.addFilter = function(index,feed_counter){
	var currentFeed = window['wdi_feed_'+feed_counter];
	var usersCount = currentFeed.feed_row.feed_users.split(',').length;
	if(usersCount<2){
		return;
	}

	if(currentFeed.nowLoadingImages != false){
		return;
	}else{

			var userDiv = jQuery('#wdi_feed_'+currentFeed.feed_row.wdi_feed_counter+'_users [user_index="'+index+'"]');
			userDiv.find('.wdi_filter_overlay').toggleClass('wdi_filter_active_bg');
			userDiv.find('.wdi_header_user_text h3').toggleClass('wdi_filter_active_col');
			userDiv.find('.wdi_media_info').toggleClass('wdi_filter_active_col');
			userDiv.find('.wdi_follow_btn').toggleClass('wdi_filter_active_col');

			currentFeed.customFilterChanged = true;
			//setting filter flag to true
			if(currentFeed.userSortFlags[index]['flag'] == false){
				currentFeed.userSortFlags[index]['flag'] = true;
			}else{
				currentFeed.userSortFlags[index]['flag'] = false;
			}
			//getting active filter count
			var activeFilterCount = 0;
			for(var j = 0; j < currentFeed.userSortFlags.length; j++){
					if(currentFeed.userSortFlags[j]['flag']==true){
						activeFilterCount++;
					}
				}



			if(currentFeed.feed_row.feed_display_view == 'pagination'){
				//reset responsive indexes because number of feed images may change after using filter
				currentFeed.resIndex = 0; 
			}


			//applying filters
			if(activeFilterCount != 0){
				wdi_front.filterData(currentFeed);
				wdi_front.displayFeed(currentFeed);
			}else{
				currentFeed.customFilteredData = currentFeed.dataStorageList;
				wdi_front.displayFeed(currentFeed);
			}	

			
			if(currentFeed.feed_row.feed_display_view == 'pagination'){
		     	//reset paginator because while filtering images become more or less so pages also become more or less
		     	currentFeed.paginator = Math.ceil((currentFeed.imageIndex)/parseInt(currentFeed.feed_row.pagination_per_page_number));
				//setting current page as the last loaded page when filter is active
				currentFeed.currentPage = currentFeed.paginator; //pagination page number
				//when feed is displayed we are by default in the first page
				//so we are navigating from page 1 to current page using custom navigation method
				wdi_front.updatePagination(currentFeed,'custom',1);

				jQuery('#wdi_first_page').removeClass('wdi_disabled');
				jQuery('#wdi_last_page').addClass('wdi_disabled');
			}
	    	
		}
}
wdi_front.filterData = function(currentFeed){
	
	var users = currentFeed.userSortFlags;
	currentFeed.customFilteredData = [];
	for(var i = 0; i < currentFeed.dataStorageList.length; i++){
		for(var j = 0; j < users.length; j++){
			if((currentFeed.dataStorageList[i]['user']['id']==users[j]['id'] ||currentFeed.dataStorageList[i]['wdi_hashtag'] == users[j]['name'])  && users[j]['flag']==true){
				currentFeed.customFilteredData.push(currentFeed.dataStorageList[i]);
			}

		}
	}
	
}
wdi_front.applyFilters = function(currentFeed){
	for(var i = 0; i < currentFeed.userSortFlags.length; i++){
		if(currentFeed.userSortFlags[i]['flag'] == true){
			var userDiv = jQuery('#wdi_feed_'+currentFeed.feed_row.wdi_feed_counter+ '[user_index="'+i+'"]');
			wdi_front.addFilter(i,currentFeed.feed_row.wdi_feed_counter);
			wdi_front.addFilter(i,currentFeed.feed_row.wdi_feed_counter);
		}
	}

}

//gets data Count from global storage
wdi_front.getImgCount = function(currentFeed){
	var dataStorage = currentFeed.dataStorage;
	var count = 0;
	for(var i = 0; i<dataStorage.length;i++){
		count+=dataStorage[i].length;
	}
	return count;
}

//parses image data for lightbox popup
wdi_front.parseLighboxData =function (currentFeed,filterFlag){
	
	var dataStorage = currentFeed.dataStorage;
	var sortImagesBy = currentFeed.feed_row['sort_images_by'];
	var sortOrder = currentFeed.feed_row['display_order'];
	var sortOperator = wdi_front.sortingOperator(sortImagesBy,sortOrder);
	var data = [];

	var popupData = [];
	var obj = {};
	
	//if filterFlag is true, it means that some filter for frontend content is enabled so give
	//lightbox only those images which are visible at that moment else give all avialable
	if(filterFlag == true){
		data = currentFeed.customFilteredData;
	}else{
		for(var i = 0; i<dataStorage.length;i++){
			for(var j=0; j<dataStorage[i].length;j++){
				data.push(dataStorage[i][j]);
			}
		}
		data.sort(sortOperator);
	}
	
	
	
	for(i = 0;i < data.length;i++){
		obj = {
				'alt':'',
				'avg_rating':'',
				'comment_count':data[i]['comments']['count'],
				'date': wdi_front.convertUnixDate(data[i]['created_time']),
				'description':wdi_front.getDescription((data[i]['caption']!==null) ? data[i]['caption']['text'] : ''),
				'filename': wdi_front.getFileName(data[i]),
				'filetype': wdi_front.getFileType(data[i]['type']),
				'hit_count':'0',
				'id':data[i]['id'],
				'image_url': data[i]['link'],
				'number' : 0,
				'rate':'',
				'rate_count': '0',
				'username' : data[i]['user']['username'],
				'profile_picture': data[i]['user']['profile_picture'],
				'thumb_url' :data[i]['link']+'media/?size=t',
				'comments_data': data[i]['comments']['data']
			}
			popupData.push(obj);
	}
	return popupData;
}
wdi_front.convertUnixDate = function(date){
	var utcSeconds = parseInt(date);
	var newDate = new Date(0);
	newDate.setUTCSeconds(utcSeconds);
	var str = newDate.getFullYear() + '-' + newDate.getMonth() + '-' +newDate.getDate();
	str+= ' '+newDate.getHours()+':'+newDate.getMinutes();
	return str;
}
wdi_front.getDescription = function(desc){
	desc = desc.replace(/\r?\n|\r/g,' ');


	return desc;
}
wdi_front.getFileName = function(data){
	var link = data['link'];
	var type = data['type'];
	var linkFragments = link.split('/');
	return linkFragments[linkFragments.length-2];

}
wdi_front.getFileType = function(type){
	return "EMBED_OEMBED_INSTAGRAM_IMAGE";
}



 wdi_front.array_max = function(array){
 	var max = array[0];
 	var minIndex = 0;
 	for(var i = 1; i< array.length;i++){
 		if(max<array[i]){
 			max = array[i];
 			minIndex = i;
 		}
 	}
 	return {
 		'value': max,
 		'index': minIndex
 	};
 }
 wdi_front.array_min = function(array){
 	var min = array[0];
 	var minIndex = 0;
 	for(var i = 1; i <array.length;i++){
 		if(min>array[i]){
 			min = array[i];
 			minIndex = i;
 		}
 	}
 	return {
 		'value': min,
 		'index': minIndex
 	};
 }

/*
 * Returns users count whose feed is not finished
 */
wdi_front.activeUsersCount = function(currentFeed){
	var counter = 0;
	for(var i = 0; i < currentFeed.usersData.length; i++){
		if(currentFeed.usersData[i].finished != 'finished'){
			counter++;
		}
	}
	return counter;
}













