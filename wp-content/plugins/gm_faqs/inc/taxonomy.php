<?

function faq_categories_init() {
	register_taxonomy(
		'faq_categories',
		'faqs',
		array(
			'label' => __( 'FAQ Categories' ),
			'rewrite' => array( 
				'slug' => 'faq_category',
		),
		'hierarchical' => true,
		)
	);
}
add_action( 'init', 'faq_categories_init' );