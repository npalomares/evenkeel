<?php
/*
Plugin Name: GM Testimonials
Plugin URI: http://www.gaslampmedia.com
Description: Testimonials custom post type. <strong>Requires <a href="http://wordpress.org/extend/plugins/meta-box/">Meta Box.</a></strong>
Version: 1.0
Author: Thai Yin
Author URI: http://www.gaslampmedia.com/
License: All Rights Reserved
*/
// CREATE CUSTOM POST TYPES


include("inc/post_type.php");
include("inc/meta_boxes.php");
include("inc/shortcodes.php");



/* rename labels */
function gm_testimonials_title_alter( $title ) {
    $screen = get_current_screen();
    if ( $screen->post_type == "testimonials") {
        $title = 'Enter Name Here';
    }
    return $title;
}
add_filter( 'enter_title_here', 'gm_testimonials_title_alter' );

?>