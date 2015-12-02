<?
global $gm_services_options;	
$gm_services_options = get_option( 'gm_services_options' );

add_image_size( 
	'services-thumb', 
	$gm_services_options['gm_services_image_thumb']['x'], 
	$gm_services_options['gm_services_image_thumb']['y'], 
	$gm_services_options['gm_services_image_thumb']['c']
	);
add_image_size( 
	'services-full', 
	$gm_services_options['gm_services_image_full']['x'], 
	$gm_services_options['gm_services_image_full']['y'], 
	$gm_services_options['gm_services_image_full']['c']
	);


add_action( 'admin_menu', 'gm_services_admin_menu' );
function gm_services_admin_menu() {
	add_submenu_page('edit.php?post_type=services', 'GM Services Settings', 'Settings', 'manage_options', 'gm-services-config', 'gm_services_config');
}

function gm_services_config() {
?>
<h2>Services Settings</h2>
<form action="options.php" method="post">
	<?php settings_fields('gm_services_options'); ?>
	<?php do_settings_sections('gm-services-config'); ?>
	<p class="submit">
	<input type="submit" class="button-primary" value="Save Changes" />
	</p>
</form>
<?
}

// Register and define the settings
add_action('admin_init', 'gm_services_admin_init');

function gm_services_admin_init(){

/* 
display options:
Excerpt or Full
Show Thumbnail
Link to Page
*/

	register_setting(
		'gm_services_options',
		'gm_services_options',
		'gm_services_validate_options'
	);
	
	add_settings_section(
		'gm_services_homepage_settings',
		'Display Options',
		'gm_services_section_text',
		'gm-services-config'
	);
	
	add_settings_field(
		'gm_services_link_title',
		'Link Titles',
		'gm_services_link_title_callback',
		'gm-services-config',
		'gm_services_homepage_settings'
	);
	
	add_settings_field(
		'gm_services_body_display',
		'Description Length',
		'gm_services_body_display_callback',
		'gm-services-config',
		'gm_services_homepage_settings'
	);
	
	add_settings_field(
		'gm_services_image_thumb',
		'Image Thumbnail',
		'gm_services_image_thumb_callback',
		'gm-services-config',
		'gm_services_homepage_settings'
	);
	
	add_settings_field(
		'gm_services_image_full',
		'Image Full',
		'gm_services_image_full_callback',
		'gm-services-config',
		'gm_services_homepage_settings'
	);
	
	

}

// display form fields
function gm_services_link_title_callback() {
	$gm_services_options = get_option( 'gm_services_options' );	
	?>
	<input type="checkbox" name="gm_services_options[gm_services_link_title]" value="true" <?php checked( "true", $gm_services_options['gm_services_link_title'] ); ?> />
<?
}

function gm_services_body_display_callback() {
	$gm_services_options = get_option( 'gm_services_options' ); ?>
	<select name="gm_services_options[gm_services_body_display]" value="<?php echo $gm_services_options[gm_services_body_display]; ?>" />
		<option value="none" <?php if ( $gm_services_options['gm_services_body_display'] == "none" ) echo " selected='selected'";?>>None</option>
		<option value="excerpt" <?php if ( $gm_services_options['gm_services_body_display'] == "excerpt" ) echo " selected='selected'";?>>Excerpt</option>
		<option value="full" <?php if ( $gm_services_options['gm_services_body_display'] == "full" ) echo " selected='selected'";?>>Full</option>
	</select>
<? }

function gm_services_image_thumb_callback() {
	$gm_services_options = get_option( 'gm_services_options' );
	echo "Width <input name='gm_services_options[gm_services_image_thumb][x]' type='number' value=\"".$gm_services_options[gm_services_image_thumb][x]."\" />";
	echo "Height <input name='gm_services_options[gm_services_image_thumb][y]' type='number' value=\"".$gm_services_options[gm_services_image_thumb][y]."\" /><br />"; ?>
	<input type="checkbox" name="gm_services_options[gm_services_image_thumb][c]" value="true" <?php checked( "true", $gm_services_options['gm_services_image_thumb']['c'] ); ?> /> Cropped

<? }

function gm_services_image_full_callback() {
	$gm_services_options = get_option( 'gm_services_options' );
	echo "Width <input name='gm_services_options[gm_services_image_full][x]' type='number' value=\"".$gm_services_options[gm_services_image_full][x]."\" />";
	echo "Height <input name='gm_services_options[gm_services_image_full][y]' type='number' value=\"".$gm_services_options[gm_services_image_full][y]."\" /><br />"; ?>
	<input type="checkbox" name="gm_services_options[gm_services_image_full][c]" value="true" <?php checked( "true", $gm_services_options['gm_services_image_full']['c'] ); ?> /> Cropped
<? }

function gm_services_validate_options($input) {

	// do something
	return $input;

}

// form section descriptions
function gm_services_section_text() {
	// Nothing to see here.
}
?>
