<?
function service_categories_init() {
	register_taxonomy(
		'service_type',
		'services',
		array(
			'label' => __( 'Service Types' ),
			'rewrite' => array( 
				'slug' => 'service_type',
				'show_ui' => true,
			),
			'hierarchical' => true,
		)
	);
}
add_action( 'init', 'service_categories_init' );
?>