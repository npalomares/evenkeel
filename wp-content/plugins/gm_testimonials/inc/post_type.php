<?
function create_testimonials() {
	$labels = array(
		'name'                => 'Testimonials',
		'singular_name'       => 'Testimonials',
		'menu_name'           => 'Testimonials',
		'parent_item_colon'   => 'Parent Testimonial:',
		'all_items'           => 'All Testimonials',
		'view_item'           => 'View Testimonial',
		'add_new_item'        => 'Add New Testimonial',
		'add_new'             => 'New Testimonial',
		'edit_item'           => 'Edit Testimonial',
		'update_item'         => 'Update Testimonial',
		'search_items'        => 'Search Testimonials',
		'not_found'           => 'No Testimonials found',
		'not_found_in_trash'  => 'No Testimonials found in Trash',
	);

	$args = array(
		'label'               => 'Testimonials',
		'description'         => 'Testimonials post type',
		'labels'              => $labels,
		'supports'            => array( 'title', 'excerpt', 'thumbnail', 'revisions', 'page-attributes', 'editor'),
		'hierarchical'        => true,
		'public'              => true,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'show_in_nav_menus'   => true,
		'show_in_admin_bar'   => true,
		'menu_position'       => 5,
		'can_export'          => true,
		'has_archive'         => false,
		'exclude_from_search' => false,
		'capability_type'     => 'page',
		'menu_icon' => plugins_url( 'gm_icon_bw.png', __FILE__ ),
	);

	register_post_type( 'testimonials', $args );
}

// Hook into the 'init' action
add_action( 'init', 'create_testimonials', 0 );
?>