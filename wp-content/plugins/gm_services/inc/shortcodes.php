<?
function gm_services_shortcode( $atts ) {
	extract( shortcode_atts( array(
		'orderby' => 'menu_order',
		'service_type' => '',
		'display' => 'excerpt'
	), $atts ) );

	$db_args = array(
		'post_type' => 'services',
		'order' => 'ASC', 
		'posts_per_page' => 50,
		'orderby' => $orderby,
		'service_type' => $service_type
	);

	$original_query = $wp_query;
	$services_loop = new WP_Query( $db_args );

	if($services_loop->have_posts()) {
		switch($display) {		
			case "content":
				$content .= "<div class=\"services_wrapper\">";
				while( $services_loop->have_posts() ) : $services_loop->the_post();
					$content_filtered = get_the_content();
					$content_filtered = apply_filters('the_content', $content_filtered);
					$content_filtered = str_replace(']]>', ']]&gt;', $content_filtered);
					$content .= "<div class=\"service_single\">";
					$content .= "<h3 class=\"service_title\">".get_the_title()."</h3>";
					$content .= "<div class=\"service_content\">$content_filtered</div>";
					$content .= "</div>";
				endwhile;
				$content .= "</div>";
				break;
			case "excerpt":
				$content .= "<div class=\"services_wrapper\">";
				while( $services_loop->have_posts() ) : $services_loop->the_post();
					$content .= "<div class=\"service_single\">";
					$content .= "<h3 class=\"service_title\"><a href=".get_permalink().">".get_the_title()."</a></h3>";
					$content .= "<div><span class=\"service_excerpt\">".get_the_excerpt()."</span></div>";
					$content .= "</div>";
				endwhile;
				$content .= "</div>";
				break;
			case "list":
				$content .= "<ul class=\"services_wrapper\">";
				while( $services_loop->have_posts() ) : $services_loop->the_post();
					$content .= "<li class=\"service_single\">";
					$content .= "<span class=\"service_title\"><a href=".get_permalink().">".get_the_title()."</a></span>";
					$content .= "</li>";
				endwhile;
				$content .= "</ul>";
				break;

			//apply accordion markup for the collapsing option
			case "accordion":
				$content .= "<div class=\"panel-group services_wrapper\" id=\"accordion\">";

				$i = 0;
				while( $services_loop->have_posts() ) : $services_loop->the_post();
				
					if($i == 0) { $first = ""; } else { $first = ''; }
				
					$content_filtered = get_the_content();
					$content_filtered = apply_filters('the_content', $content_filtered);
					$content_filtered = str_replace(']]>', ']]&gt;', $content_filtered);
					
				    $content .= "<div class=\"panel panel-default\">";
					$content .= '<div class="panel-heading">';
					$content .= "<h3 class=\"panel-title\">";
					$content .= '<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapse'.$i.'">'.get_the_title();
					$content .= '</a>';					
					$content .= '</h3>';
					$content .= '</div>';
					$content .= '<div id="collapse'.$i.'" class="panel-collapse collapse '.$first.'">';
					$content .= "<div class=\"panel-body\">$content_filtered</div>";
					$content .= "</div></div>";
					$i++;
				endwhile;
				$content .= "</div>"; //close the panel-group
				break;
			//end case accordion

		}
			
	}
	$wp_query = null;
	$wp_query = $original_query;
	wp_reset_postdata();
	return $content;
				
}
add_shortcode( 'gm_services', 'gm_services_shortcode' );
