<?php


function load_css() {

    wp_register_style('main', get_template_directory_uri() . '/dist/styles.css', array(), false, 'all');
    wp_enqueue_style('main');

};

add_action('wp_enqueue_scripts', 'load_css');

function load_js() {

    wp_enqueue_script('jquery');

    wp_register_script('swiper', get_template_directory_uri() . '/dist/swiper.js', false, false, true);
    wp_enqueue_script('swiper');

    wp_register_script('ics', get_template_directory_uri() . '/dist/ics.js', false, false, true);
    wp_enqueue_script('ics');

    wp_register_script('main', get_template_directory_uri() . '/dist/main.js', false, false, true);
    wp_enqueue_script('main');

};

add_action('wp_enqueue_scripts', 'load_js');


function allow_post_thumbnails() {
    add_theme_support( 'post-thumbnails' );
}
add_action( 'after_setup_theme', 'allow_post_thumbnails' );


function remove_menus(){  

  remove_menu_page( 'edit.php' );                   //Posts  
  remove_menu_page( 'edit.php?post_type=page' );    //Pages  
  remove_menu_page( 'edit-comments.php' );          //Comments  

}  
add_action( 'admin_menu', 'remove_menus' );  

add_theme_support('post-thumbnails');

add_image_size('cal', 760, 9999);


?>