<?

/* shortcodes */
function gm_testimonials_shortcode( $atts ) {
	// set default values if no attributes passed
	extract( shortcode_atts( array(
		'orderby' => 'date', // by post date
		'order' => 'DESC', // newest first by default
		'meta_key' => '', // meta_key
		'display' => 'content',
	), $atts ) );

	$db_args = array(
		'post_type' => 'testimonials',
		'order' => $order,
		'orderby' => $orderby,
		'meta_key' => $meta_key,
	);

	$date_format = "M d, Y";
	
	$testimonials_loop = new WP_Query( $db_args );
	if($testimonials_loop->have_posts()) {
		switch($display) {		
			case "content":
				$content .= "<div class=\"testimonials_wrapper\">";
				while( $testimonials_loop->have_posts() ) : $testimonials_loop->the_post();
					
					$formatted_date = date($date_format, strtotime($raw_date));
					$content_filtered = get_the_content();
					$content_filtered = apply_filters('the_content', $content_filtered);
					$content_filtered = str_replace(']]>', ']]&gt;', $content_filtered);
					$content .= "<div class=\"testimonial_single\">";
					$content .= "<div class=\"testimonial_content\">$content_filtered</div>";
					$content .= "<div><span class=\"testimonial_location\">".rwmb_meta( 'gm_testimonials_location' )."</span></div>";
					//$content .= "<div><span class=\"testimonial_date\">".$formatted_date."</span></div>";
					$content .= "<div><span class=\"testimonial_title\">".get_the_title()."</span>";
					$content .= "</div>";
				endwhile;
				$content .= "</div>";
				break;
			case "excerpt":
				$content .= "<div class=\"testimonials_wrapper\">";
				while( $testimonials_loop->have_posts() ) : $testimonials_loop->the_post();
					$formatted_date = date($date_format, strtotime($raw_date));
					$content .= "<div class=\"testimonial_single\">";
					$content .= "<div><span class=\"testimonial_title\"><a href=".get_permalink().">".get_the_title()."</a></span></div>";
					$content .= "<div><span class=\"testimonial_excerpt\">".get_the_excerpt()."</span></div>";
					$content .= "</div>";
				endwhile;
				$content .= "</div>";
				break;
			case "list":
				$content .= "<ul class=\"testimonials_wrapper\">";
				while( $testimonials_loop->have_posts() ) : $testimonials_loop->the_post();
					$content .= "<li class=\"testimonial_single\">";
					$content .= "<span class=\"testimonial_title\"><a href=".get_permalink().">".get_the_title()."</a></span>";
					$content .= "</li>";
				endwhile;
				$content .= "</ul>";
				break;
		}
			
	}
	$wp_query = null;
	$wp_query = $original_query;
	wp_reset_postdata();
	return $content;
				
}
add_shortcode( 'gm_testimonials', 'gm_testimonials_shortcode' );

