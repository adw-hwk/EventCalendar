<?php


function load_css() {

    wp_register_style('main', get_template_directory_uri() . '/css/styles.css', array(), false, 'all');
    wp_enqueue_style('main');

};

add_action('wp_enqueue_scripts', 'load_css');

function load_js() {

    wp_enqueue_script('jquery');

    wp_register_script('main', get_template_directory_uri() . '/js/main.js', 'jquery', false, true);
    wp_enqueue_script('main');

};

add_action('wp_enqueue_scripts', 'load_js');

?>