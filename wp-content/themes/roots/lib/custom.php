<?php
/**
 * Custom functions
 * This file contains commonly used functions. Comment out or delete unnecessary code according to your needs.
 */
 

 
 /**
  * Register additional sidebars
  */
  
function gm_widgets_init() {
  // Secondary Sidebars
  register_sidebar(array(
    'name'          => __('Secondary', 'roots'),
    'id'            => 'sidebar-secondary',
    'before_widget' => '<section class="widget %1$s %2$s"><div class="widget-inner">',
    'after_widget'  => '</div></section>',
    'before_title'  => '<h3>',
    'after_title'   => '</h3>',
  ));

  // Separate Footer Areas
  register_sidebar(array(
    'name'          => __('Footer A', 'roots'),
    'id'            => 'sidebar-footer-a',
    'before_widget' => '<section class="widget %1$s %2$s"><div class="widget-inner">',
    'after_widget'  => '</div></section>',
    'before_title'  => '<h3>',
    'after_title'   => '</h3>',
  ));
  
  register_sidebar(array(
    'name'          => __('Footer B', 'roots'),
    'id'            => 'sidebar-footer-b',
    'before_widget' => '<section class="widget %1$s %2$s"><div class="widget-inner">',
    'after_widget'  => '</div></section>',
    'before_title'  => '<h3>',
    'after_title'   => '</h3>',
  ));
  
  register_sidebar(array(
    'name'          => __('Footer C', 'roots'),
    'id'            => 'sidebar-footer-c',
    'before_widget' => '<section class="widget %1$s %2$s"><div class="widget-inner">',
    'after_widget'  => '</div></section>',
    'before_title'  => '<h3>',
    'after_title'   => '</h3>',
  ));
  
  register_sidebar(array(
    'name'          => __('Footer D', 'roots'),
    'id'            => 'sidebar-footer-d',
    'before_widget' => '<section class="widget %1$s %2$s"><div class="widget-inner">',
    'after_widget'  => '</div></section>',
    'before_title'  => '<h3>',
    'after_title'   => '</h3>',
  ));

}
add_action('widgets_init', 'gm_widgets_init');