<?

global $gm_testimonials_meta_boxes;
$gm_testimonials_meta_boxes = array();

$gm_testimonials_meta_boxes[] = array(
	'id' => 'testimonials_extra',
	'title' => 'Profile Info',
	'pages' => array( 'testimonials' ),
	'context' => 'normal',
	'priority' => 'high',
	'fields' => array(
		array(
			'name'  => 'Location',
			'id'    => "gm_testimonials_location",
			'desc'  => 'Example: San Diego, CA',
			'type'  => 'text',
			'std'   => '',
		),
		array(
			'name' => 'Date',
			'id'   => "gm_testimonials_date",
			'type' => 'date',

			// jQuery date picker options. See here http://jqueryui.com/demos/datepicker
			'js_options' => array(
				'appendText'      => '(yyyy-mm-dd)',
				'dateFormat'      => 'yy-mm-dd',
				'changeMonth'     => true,
				'changeYear'      => true,
				'showButtonPanel' => true,
			),
		),
	),
	'validation' => array(
		'rules' => array(
			"gm_testimonials_location" => array(
				'required'  => true,
			),
			"post_title" => array(
				'required' => true,
			),
		),
		'messages' => array(
			"gm_testimonials_location" => array(
				'required'  => 'Location is required',
			),
		)
	)
);


function gm_testimonials_register_meta_boxes() {
	if ( !class_exists( 'RW_Meta_Box' ) )
		return;
	global $gm_testimonials_meta_boxes;
	foreach ( $gm_testimonials_meta_boxes as $meta_box ) {
		new RW_Meta_Box( $meta_box );
	}
}
add_action( 'admin_init', 'gm_testimonials_register_meta_boxes' );