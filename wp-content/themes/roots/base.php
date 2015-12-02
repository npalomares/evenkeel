<?php get_template_part('templates/head'); ?>
<body <?php body_class(); ?>>

  <!--[if lt IE 8]>
    <div class="alert alert-warning">
      <?php _e('You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.', 'roots'); ?>
    </div>
  <![endif]-->

  <?php
    do_action('get_header');
    // Use Bootstrap's navbar if enabled in config.php
    if (current_theme_supports('bootstrap-top-navbar')) {
      get_template_part('templates/header-top-navbar');
    } else {
      get_template_part('templates/header');
    }
  ?>
  
  <div class="hero-wrap">
  <?php if( is_front_page() ) { ?>
    <div class="slideshow-wrap">
      <div class="slideshow container">
        <?php echo do_shortcode('[gm_slideshow]'); ?>
      </div>
    </div>
    
    <?php } else { ?>

    <div class="interior-banner-wrap">
      <div class="interior-banner container">
        <h2 class="page-title text-center"><?php the_title(); ?></h2>
      </div>
    </div>

    <?php } ?>


  <div class="wrap container" role="document">
    <div class="content row">

      <div class="main <?php echo roots_main_class(); ?>" role="main">
        <?php include roots_template_path(); ?>
      </div><!-- /.main -->
      <?php if (roots_display_sidebar()) : ?>
        <aside class="sidebar <?php echo roots_sidebar_class(); ?>" role="complementary">
          <?php include roots_sidebar_path(); ?>
        </aside><!-- /.sidebar -->
      <?php endif; ?>
    </div><!-- /.content -->
  </div><!-- /.wrap -->
  

  <section class="post-content-wrap">
    <div class="inner-post-content container text-center">
      <?php dynamic_sidebar('sidebar-footer-a'); ?>
      <?php dynamic_sidebar('sidebar-footer-b'); ?>
      <?php dynamic_sidebar('sidebar-footer-c'); ?>
      <?php dynamic_sidebar('sidebar-footer-d'); ?>
    </div>
  </section>

  <?php get_template_part('templates/footer'); ?>

</body>
</html>
