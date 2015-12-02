<?
function create_faq() {
	$labels = array(
		'name'                => 'FAQs',
		'singular_name'       => 'FAQs',
		'menu_name'           => 'FAQs',
		'parent_item_colon'   => 'Parent FAQ:',
		'all_items'           => 'All FAQs',
		'view_item'           => 'View FAQ',
		'add_new_item'        => 'Add New FAQ',
		'add_new'             => 'New FAQ',
		'edit_item'           => 'Edit FAQ',
		'update_item'         => 'Update FAQ',
		'search_items'        => 'Search FAQs',
		'not_found'           => 'No FAQs found',
		'not_found_in_trash'  => 'No FAQs found in Trash',
	);

	$args = array(
		'label'               => 'FAQs',
		'description'         => 'FAQs post type',
		'labels'              => $labels,
		'supports'            => array( 'title', 'excerpt', 'thumbnail', 'revisions', 'page-attributes', 'editor'),
		'hierarchical'        => true,
		'public'              => true,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'show_in_nav_menus'   => true,
		'show_in_admin_bar'   => true,
		'menu_position'       => 6,
		'menu_icon'           => '',
		'can_export'          => true,
		'has_archive'         => false,
		'exclude_from_search' => false,
		'capability_type'     => 'page',
		'menu_icon' => plugins_url( 'gm_icon_bw.png', __FILE__ ),
	);

	register_post_type( 'faqs', $args );
}

// Hook into the 'init' action
add_action( 'init', 'create_faq', 0 );