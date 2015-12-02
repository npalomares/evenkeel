<?php
/*
Plugin Name: GM Slideshow
Plugin URI: http://www.gaslampmedia.com
Description: Slideshow with Thumbnails custom post type.
Version: 1.0
Author: Thai Yin
Author URI: http://www.gaslampmedia.com/
License: All Rights Reserved
*/
// CREATE CUSTOM POST TYPES


include("inc/post_type.php");
include("inc/shortcodes.php");
include("inc/taxonomy.php");


function slideshow_scripts() {
    $plugin_url = plugin_dir_url( __FILE__ );

    //register slideshow css
    wp_register_style( 'slideshowStyle', $plugin_url . 'inc/css/slideshow.css' );
    wp_enqueue_style( 'slideshowStyle' );
	
	//load javascript    
    //wp_register_script( 'slideshowScript', $plugin_url . 'inc/js/slideshow.js' );
    //wp_enqueue_script( 'slideshowScript' );
}
add_action( 'wp_enqueue_scripts', 'slideshow_scripts' );
?>