<?php
/*
Plugin Name: GM Frequently Asked Questions
Plugin URI: http://www.gaslampmedia.com
Description: FAQ custom post type. <strong>Requires <a href="http://wordpress.org/extend/plugins/meta-box/">Meta Box.</a></strong>
Version: 1.0
Author: Thai Yin
Author URI: http://www.gaslampmedia.com/
License: GPLv2
*/

include("inc/post_type.php");
include("inc/taxonomy.php");
include("inc/meta_boxes.php");
include("inc/shortcodes.php");





/* rename labels */
function gm_faq_title_alter( $title ) {
    $screen = get_current_screen();
    if ( $screen->post_type == "faq") {
        $title = 'Enter Question Here';
    }
    return $title;
}
add_filter( 'enter_title_here', 'gm_faq_title_alter' );




