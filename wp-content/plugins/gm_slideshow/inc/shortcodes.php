<?
function gm_slideshow_shortcode( $atts ) {
	extract( shortcode_atts( array(
		'orderby' => 'ASC',
		'cat' => '',
		'display' => 'excerpt',
	), $atts ) );

	$db_args = array(
	  'post_type' => 'slide', 
      'orderby'   => 'meta_value',
      'meta_key'  => 'order', 
      'order'     => 'ASC', 
	);
	

	$item_count = $loop->post_count;
	$original_query = $wp_query;
	$slideshow_loop = new WP_Query( $db_args );



	if($slideshow_loop->have_posts()) {
		$content .= "<div class=\"slideshow-wrap\">";
		$content .= "<div class=\"slideshow\">";
		$content .= "<div id=\"carousel-homepage\" class=\"carousel slide\" data-ride=\"carousel\">";

	
		// Button Bar - Carousel Indicator Background
		$content .= "<div class=\"button-bar\">";
		//carousel indicators
		$content .= "<ol class=\"carousel-indicators\">";

		$thumbid = $slideshow_loop->ID; 
		
		$is_first = TRUE;
		$i = 0;

		while( $slideshow_loop->have_posts() ) : $slideshow_loop->the_post();
			if ( $is_first ) {
				$class = 'class="active"';
			} else { $class = " "; }
			  
			$content .="<li data-target=\"#carousel-homepage\"" .$class." data-slide-to=\"".$i."\"><h3 class=\"btn slide-btn\">".get_the_title($slideshow_loop->post->ID)."</h3></li>";
			$is_first = FALSE;
			$i++;
		endwhile;

		//wp_reset_query();
		$content .= "</ol>"; // close the Carousel Indicators	
		$content .= "</div>"; // close the Button Bar


		
		//Wrapper for Slides
		$content .= "<div class=\"carousel-inner\">";
		$is_first = TRUE;
		$i = 1;
		while ( $slideshow_loop->have_posts() ) : 
			$slideshow_loop->the_post();	

			$link = get_post_meta( $slideshow_loop->post->ID, 'url', true );
			if( $is_first ) {
				$class = "active";
			}else {
				$class = '';
			}

		
			//Time to see the content        
			$content .= "<div class=\"item ".$class."\" id=\"slide".$i."\">";
		

			//if( !empty( $link ) ) {
			$content .= "<a href=\"$link\">".get_the_post_thumbnail()."</a>";
			//}else {
				//get_the_post_thumbnail('slide');
			//}
		
			$content .= "</div>"; //close item


			$is_first = FALSE;
			$i++;
		endwhile;
		$content .= "</div>"; //close carousel inner
		
		

		$content .= "<a class=\"left carousel-control\" href=\"#carousel-homepage\" role=\"button\" data-slide=\"prev\">";
		$content .= "<span class=\"glyphicon glyphicon-chevron-left\">";
		$content .= "</a>";

		$content .= "<a class=\"right carousel-control\" href=\"#carousel-homepage\" role=\"button\" data-slide=\"next\">";
		$content .= "<span class=\"glyphicon glyphicon-chevron-right\">";
		$content .= "</a>";

		
		$content .= "</div>"; //close carousel
		$content .= "</div>"; //close slideshow
		$content .= "</div>"; //close slideshow wrap
			
	}
	$wp_query = null;
	$wp_query = $original_query;
	wp_reset_postdata();
	return $content;
				
}
add_shortcode( 'gm_slideshow', 'gm_slideshow_shortcode' );