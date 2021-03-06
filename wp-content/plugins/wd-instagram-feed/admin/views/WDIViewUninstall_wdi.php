<?php
class WDIViewUninstall_wdi{
////////////////////////////////////////////////////////////////////////////////////////
// Variables                                                                          //
////////////////////////////////////////////////////////////////////////////////////////
private $model;
////////////////////////////////////////////////////////////////////////////////////////
// Constructor and Destructor                                                         //
////////////////////////////////////////////////////////////////////////////////////////
	public function __construct($model){
		$this->model = $model;
	}
////////////////////////////////////////////////////////////////////////////////////////
// Public Methods                                                                     //
////////////////////////////////////////////////////////////////////////////////////////
public function display(){
		global $wpdb;
		?>			
		  			
		  			<span class="uninstall-icon"></span>
				      <h2>
				        <?php _e('Uninstalling Instagram Feed WD', "wdi"); ?>
				 	  </h2>
					 <p style="color:red;font-size:15px"> <?php _e('Deactivating Instagram Feed WD plugin does not remove any data that may have been created. To completely remove this plugin, you can uninstall it here.','wdi') ?><br>
					 <?php _e('WARNING: Once uninstalled, this can\'t be undone. You should use a Database Backup plugin of WordPress to back up all the data first.','wdi') ?> </p>
					 <p style="color:red;margin-top:10px;font-size:13px;"> <?php _e('The following Database Tables will be deleted:','wdi') ?> </p>
					 <div style="background-color:white;border:1px solid #888888" >
					 	<ul style="background-color:white;margin:0">
						 	<p style="background-color:#F3EFEF;margin: 0;border-bottom: 1px solid #888888;padding:2px;font-size:20px;">Database Tables</p>
						  	<li style="padding-bottom:5px;padding-left:5px;font-weight: bold;margin:0;">1) <?php echo $wpdb->prefix . WDI_FEED_TABLE  ?></li>
						  	<li style="padding-bottom:5px;padding-left:5px;font-weight: bold;margin:0;">2) <?php echo $wpdb->prefix . WDI_THEME_TABLE  ?></li>
						 	<p style="background-color:#F3EFEF;margin: 0;border-top: 1px solid #888888;border-bottom: 1px solid #888888;padding:2px;font-size:20px;">Options From <?php echo $wpdb->prefix , 'options' ?></p>
						 	<li style="padding-bottom:5px;padding-left:5px;font-weight: bold;margin:0;">3) wdi_user_name</li>
					 		<li style="padding-bottom:5px;padding-left:5px;font-weight: bold;margin:0;">4) wdi_access_token</li>
					 	</ul>
					 </div>
					
		  			<form action="admin.php?page=wdi_uninstall" id="wdi_uninstall_form" method="post">
					  <?php wp_nonce_field('nonce_wd', 'nonce_wd'); ?>
					  <input type="hidden" name="task" value="uninstall">
					 <div style="text-align:center">
						 <p style="margin:0;font-size:15px;"><?php _e('Are you sure you want to uninstall plugin?','wdi') ?></p>
						 <input type="checkbox" style="text-align: center;" id="wdi_verify" name="wdi_verify" value="1">
						 <label for="wdi_verify" style="vertical-align:top">Yes</label>
						 <br>

						 <div id="wdi_submit" style="text-align:center;margin-top:10px" class="button button-primary">Uninstall</div>
					 </div>
					 
					 
 		  </form>
 		  <script>
 		  jQuery(document).ready(function(){
 		  	jQuery('#wdi_submit').on('click',function(){
 		  		if(confirm("<?php _e('Are you sure you want to uninstall plugin?','wdi') ?>")){
 		  			jQuery('#wdi_uninstall_form').submit();
 		  		}
 		  	});
 		  });
 		  </script>
  		<?php
	}
	public function already_uninstalled(){
		$deactivate_url = wp_nonce_url('plugins.php?action=deactivate&amp;plugin=wd-instagram-feed/instagram-wd.php', 'deactivate-plugin_wd-instagram-feed/instagram-wd.php');
			?>
		  <span class="uninstall-icon"></span>
		      <h2>
		        <?php _e('Uninstalling Instagram Feed WD', "wdi"); ?>
		 	  </h2>
		 <p style="color:green;font-size:15px"> <?php _e('Instagram Feed WD is uninstalled','wdi') ?><a style="text-decoration:none;padding:3px;" href="<?php echo $deactivate_url ?>"> <?php _e('Click Here') ?> </a><?php _e('to deactivate it','wdi') ?></p>
		
  		<?php
	}
	public function successfully_uninstalled(){
		global $wpdb;
		$deactivate_url = wp_nonce_url('plugins.php?action=deactivate&amp;plugin=wd-instagram-feed/instagram-wd.php', 'deactivate-plugin_wd-instagram-feed/instagram-wd.php');
		?>
	  		<span class="uninstall-icon"></span>
		      <h2>
		        <?php _e('Uninstalling Instagram Feed WD', "wdi"); ?>
		 	  </h2>
			 <p style="color:green;margin-top:10px;font-size:13px;"> <?php _e('The following Database Tables has been successfully deleted:','wdi') ?> </p>
			 <div style="background-color:white;border:1px solid #888888" >
			 	<ul style="background-color:white;margin:0">
				 	<p style="background-color:#F3EFEF;margin: 0;border-bottom: 1px solid #888888;padding:2px;font-size:20px;">Database Tables</p>
				  	<li style="padding-bottom:5px;padding-left:5px;font-weight: bold;margin:0;">1)<?php echo $wpdb->prefix . WDI_FEED_TABLE  ?></li>
				  	<li style="padding-bottom:5px;padding-left:5px;font-weight: bold;margin:0;">2)<?php echo $wpdb->prefix . WDI_THEME_TABLE  ?></li>
				 	<p style="background-color:#F3EFEF;margin: 0;border-top: 1px solid #888888;border-bottom: 1px solid #888888;padding:2px;font-size:20px;">Options From <?php echo $wpdb->prefix , 'options' ?></p>
				 	<li style="padding-bottom:5px;padding-left:5px;font-weight: bold;margin:0;">3)wdi_user_name</li>
			 		<li style="padding-bottom:5px;padding-left:5px;font-weight: bold;margin:0;">4)wdi_access_token</li>
			 	</ul>
			</div>
			<p style="color:green;font-size:15px"> <?php _e('Instagram Feed WD is successfully uninstalled','wdi') ?><a style="text-decoration:none;padding:3px;" href="<?php echo $deactivate_url ?>"> <?php _e('Click Here') ?> </a><?php _e('to deactivate it','wdi') ?></p>

   		<?php
 	}
 }