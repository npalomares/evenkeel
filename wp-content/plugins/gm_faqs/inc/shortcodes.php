<?
function gm_faq_shortcode( $atts ) {
	extract( shortcode_atts( array(
		'orderby' => 'menu_order',
		'cat' => '',
		'display' => 'excerpt',
	), $atts ) );

	$db_args = array(
		'post_type' => 'faqs',
		'order' => 'ASC',
		'orderby' => $orderby,
		'faq_categories' => $cat,
	);

	$original_query = $wp_query;
	$faqs_loop = new WP_Query( $db_args );
	if($faqs_loop->have_posts()) {
		switch($display) {		
			case "content":
				$content .= "<div class=\"faqs_wrapper\">";
				while( $faqs_loop->have_posts() ) : $faqs_loop->the_post();
					$content_filtered = get_the_content();
					$content_filtered = apply_filters('the_content', $content_filtered);
					$content_filtered = str_replace(']]>', ']]&gt;', $content_filtered);
					$content .= "<div class=\"faq_single\">";
					$content .= "<h3 class=\"faq_title\">".get_the_title()."</h3>";
					$content .= "<div class=\"faq_content\">$content_filtered</div>";
					$content .= "</div>";
				endwhile;
				$content .= "</div>";
				break;
			case "excerpt":
				$content .= "<div class=\"faqs_wrapper\">";
				while( $faqs_loop->have_posts() ) : $faqs_loop->the_post();
					$content .= "<div class=\"faq_single\">";
					$content .= "<h3 class=\"faq_title\"><a href=".get_permalink().">".get_the_title()."</a></h3>";
					$content .= "<div><span class=\"faq_excerpt\">".get_the_excerpt()."</span></div>";
					$content .= "</div>";
				endwhile;
				$content .= "</div>";
				break;
			case "list":
				$content .= "<ul class=\"faqs_wrapper\">";
				while( $faqs_loop->have_posts() ) : $faqs_loop->the_post();
					$content .= "<li class=\"faq_single\">";
					$content .= "<span class=\"faq_title\"><a href=".get_permalink().">".get_the_title()."</a></span>";
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
add_shortcode( 'gm_faq', 'gm_faq_shortcode' );

