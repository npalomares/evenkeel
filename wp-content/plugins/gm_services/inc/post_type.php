<?
function create_services() {
	$labels = array(
		'name'                => 'Services',
		'singular_name'       => 'Services',
		'menu_name'           => 'Services',
		'parent_item_colon'   => 'Parent Service:',
		'all_items'           => 'All Services',
		'view_item'           => 'View Service',
		'add_new_item'        => 'Add New Service',
		'add_new'             => 'New Service',
		'edit_item'           => 'Edit Service',
		'update_item'         => 'Update Service',
		'search_items'        => 'Search Services',
		'not_found'           => 'No services found',
		'not_found_in_trash'  => 'No services found in Trash',
	);

	$args = array(
		'label'               => 'services',
		'description'         => 'Services post type',
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

	register_post_type( 'services', $args );
}

// Hook into the 'init' action
add_action( 'init', 'create_services', 0 );
?>