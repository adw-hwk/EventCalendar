<?php get_header(); ?>

<?php 

function console_log($output, $with_script_tags = true) {
    $js_code = 'console.log(' . json_encode($output, JSON_HEX_TAG) . ');';
    if ($with_script_tags) {
        $js_code = '<script>' . $js_code . '</script>';
    };
    echo $js_code;
}

    $events = tribe_get_events(array(
        'start_date' => date('Y') . '-01-01 00:00:00',
        'end_date' => date('Y').  '-12-31 23:59:59',
    ));

    $fn_events = 0;

    $posts = array();

    $sorted_events = array(
        'January' => array(),
        'February' => array(),
        'March' => array(),
        'April' => array(),
        'May' => array(),
        'June' => array(),
        'July' => array(),
        'August' => array(),
        'September' => array(),
        'October' => array(),
        'November' => array(),
        'December' => array(),
    );

    $months = array(
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    );

    $homepage_events = array();

    foreach($events as $event) {

        $post = get_post($event);

        $event_ID = $post->ID;

        $meta = get_post_meta($event_ID);

        $category = count(tribe_get_event_cat_slugs($event_ID)) > 0 ? tribe_get_event_cat_slugs($event_ID)[0] : null;

        if ($category !== 'seasonal') {
            $fn_events++;
        }

        $start_date_arr = array (
            'year' => date_parse($meta['_EventStartDateUTC'][0])["year"],
            'month' => date_parse($meta['_EventStartDateUTC'][0])["month"],
            'day' => date_parse($meta['_EventStartDateUTC'][0])["day"],
            'hour' => date_parse($meta['_EventStartDateUTC'][0])["hour"],
            'minute' => date_parse($meta['_EventStartDateUTC'][0])["minute"],
            'UTC' => $meta['_EventStartDateUTC'][0]
        );

        $end_date_parsed = date_parse($meta->_EventEndDateUTC);

        $end_date_arr = array (
            'year' => date_parse($meta['_EventEndDateUTC'][0])["year"],
            'month' => date_parse($meta['_EventEndDateUTC'][0])["month"],
            'day' => date_parse($meta['_EventEndDateUTC'][0])["day"],
            'hour' => date_parse($meta['_EventEndDateUTC'][0])["hour"],
            'minute' => date_parse($meta['_EventEndDateUTC'][0])["minute"],
            'UTC' => $meta['_EventEndDateUTC'][0]
        );

        $venueID = $meta['_EventVenueID'][0];

        $venue_obj = $venueID !== null ? tribe_get_venue_object($venueID) : null;

        // we're assuming no events that have time periods are going to start at midnight
        $all_day_condition = $start_date_arr[$hour] == 0;
        
        $featured = $meta['_tribe_featured'][0] == "1" ? true : false;

        $URL = strlen($meta['_EventURL'][0]) > 0 ? $meta['_EventURL'][0] : null;

        $image = !get_the_post_thumbnail_url($event_ID) ? false : array(
            'full' => get_the_post_thumbnail_url($event_ID, 'full'),
            'large' => get_the_post_thumbnail_url($event_ID, 'large')
        );

        $tags_arr = array();

        $post_tags = get_the_tags($event_ID);

        $reg_link = $meta['RegistrationLink'] ? $meta['RegistrationLink'][0] : null;

        if ($post_tags) {
            foreach($post_tags as $tag) {
                array_push($tags_arr, $tag -> slug);
            };
        } else {
            $tags_arr = null;
        };

        $formatted_event = array (
            'ID' => $event_ID,
            'title' => $post->post_title,
            'start_date' => $start_date_arr,
            'end_date' => $end_date_arr,
            'all_day' => $all_day_condition ? true : false,
            'venue' => $venue_obj == null ? null : array(
                'name' => $venue_obj -> post_title,
                'city' => $venue_obj -> city,
                'state' => $venue_obj -> province
            ),
            'description' => apply_filters('the_content', $post->post_content),
            'type' => $category,
            'tags' => $tags_arr,
            'featured' => $featured,
            'URL' => $URL,
            'image' => $image,
            'reg_link' => $reg_link
        );

        $month_num = (int)$formatted_event['start_date']['month'];

        array_push($sorted_events[$months[$month_num - 1]], $formatted_event);

    }
    
    console_log($sorted_events);


    echo ('<script> var __calEvents = ' . json_encode($sorted_events) . ';</script>')

?>


<div id="page-wrapper">
    <div class="cal-loader">
        <span>Loading</span>
        <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <span>Calendar</span>
    </div>

    <header>
        <img src="<?php echo get_template_directory_uri() . '/img/logo-white.png' ?>" alt="" class="header-logo" />

        <div class="navigation">
            <a id="prev-month-nav" class="month-navigation"><i class="fas fa-angle-double-left"></i
      ></a>

            <div class="swiper-container month-text-container">
                <div class="swiper-wrapper">
                    <div class="month-text-slide swiper-slide" id="january-month-text">
                        <span><strong
                ><?php echo date('Y'); ?>
                |</strong
              >
              January</span
            >
          </div>

          <div class="month-text-slide swiper-slide" id="february-month-text">
            <span><strong>02 |</strong> February</span>
                    </div>

                    <div class="month-text-slide swiper-slide" id="march-month-text">
                        <span><strong>03 |</strong> March</span>
                    </div>

                    <div class="month-text-slide swiper-slide" id="april-month-text">
                        <span><strong>04 |</strong> April</span>
                    </div>

                    <div class="month-text-slide swiper-slide" id="may-month-text">
                        <span><strong>05 |</strong> May</span>
                    </div>

                    <div class="month-text-slide swiper-slide" id="june-month-text">
                        <span><strong>06 |</strong> June</span>
                    </div>

                    <div class="month-text-slide swiper-slide" id="july-month-text">
                        <span><strong>07 |</strong> July</span>
                    </div>

                    <div class="month-text-slide swiper-slide" id="august-month-text">
                        <span><strong>08 |</strong> August</span>
                    </div>

                    <div class="month-text-slide swiper-slide" id="september-month-text">
                        <span><strong>09 |</strong> September</span>
                    </div>

                    <div class="month-text-slide swiper-slide" id="october-month-text">
                        <span><strong>10 |</strong> October</span>
                    </div>

                    <div class="month-text-slide swiper-slide" id="november-month-text">
                        <span><strong>11 |</strong> November</span>
                    </div>

                    <div class="month-text-slide swiper-slide" id="december-month-text">
                        <span><strong>12 |</strong> December</span>
                    </div>
                </div>
            </div>

            <a id="next-month-nav" class="month-navigation"><i class="fas fa-angle-double-right"></i
      ></a>

            <a class="show-months-btn">
                <i class="fas fa-angle-down arrow"></i>
                <i class="far fa-calendar-alt calendar"></i>
            </a>
        </div>

        <div class="months-dropdown-menu">
            <div class="month">
                <div class="banner">
                    01
                    <span>
            | <strong><?php echo date('Y'); ?></strong> | January</span
          >
        </div>
        <div class="body">January</div>
      </div>
      <div class="month">
        <div class="banner">02 <span> | February</span></div>
                <div class="body">February</div>
            </div>
            <div class="month">
                <div class="banner">03 <span> | March</span></div>
                <div class="body">March</div>
            </div>
            <div class="month">
                <div class="banner">04 <span> | April</span></div>
                <div class="body">April</div>
            </div>
            <div class="month">
                <div class="banner">05 <span> | May</span></div>
                <div class="body">May</div>
            </div>
            <div class="month">
                <div class="banner">06 <span> | June</span></div>
                <div class="body">June</div>
            </div>
            <div class="month">
                <div class="banner">07 <span> | July</span></div>
                <div class="body">July</div>
            </div>
            <div class="month">
                <div class="banner">08 <span> | August</span></div>
                <div class="body">August</div>
            </div>
            <div class="month">
                <div class="banner">09 <span> | September</span></div>
                <div class="body">September</div>
            </div>
            <div class="month">
                <div class="banner">10 <span> | October</span></div>
                <div class="body">October</div>
            </div>
            <div class="month">
                <div class="banner">11 <span> | November</span></div>
                <div class="body">November</div>
            </div>
            <div class="month">
                <div class="banner">12 <span> | December</span></div>
                <div class="body">December</div>
            </div>
        </div>
    </header>

    <div class="event-modal-wrapper">
    
        <div class="event-modal">

            <div class="close-btn">X</div>

            <div class="inner">



            </div>

        
        </div>
    
    </div>

    <div class="calendar-swiper swiper-container">
        <div class="swiper-wrapper">
            <div class="calendar-slide swiper-slide" id="january-slider">
                <div class="hero-wrapper">
                    <div class="swiper-container hero-swiper-container">
                        <div class="hero-article-wrapper swiper-wrapper"></div>
                    </div>
                    <div class="hero-text-wrapper">
                        <div class="upper">
                            <img src="<?php echo get_template_directory_uri() . '/img/logo-white.png' ?>" alt="" class="hero-logo" />

                            <div class="text homepage-text">
                            <h4>What's on for your</h4>   
                                <h1>
                                    <?php echo date('Y'); ?>
                                </h1>
                            </div>
                            <img class="hero-bg-image" src="<?php echo get_template_directory_uri() . '/img/january.jpg' ?>" alt="" />
                        </div>

                        <div class="lower">
                            <div class="text">
                                <div class="counter">
                                    <?php echo $fn_events; ?>
                                </div>
                                <div class="hero-blurb">
                                    <div>
                                        First National events scheduled for
                                        <?php echo date('Y'); ?>.
                                    </div>

                                    <div style="font-weight: 600">See you there.</div>

                                    <a class="home-cta">See what's coming up in February
                    <i class="fas fa-angle-double-right"></i
                  ></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="event-wrapper"></div>
            </div>
            <div class="calendar-slide swiper-slide" id="february-slider">
                <div class="calendar-page">
                    <div class="top">
                        <div class="top-wrapper">

                        <div class="text">
                            <div class="inner">
                                
                                <h2>February</h2>
                            </div>
                        </div>

                        <div class="event-summary fade-in">

                        </div>
                        </div>
                        
                    </div>

                    <div class="calendar-container">
                        <div class="calendar fade-in">
                            <div class="weekdays">
                                <div>Sunday</div>
                                <div>Monday</div>
                                <div>Tuesday</div>
                                <div>Wednesday</div>
                                <div>Thursday</div>
                                <div>Friday</div>
                                <div>Saturday</div>
                            </div>

                            <div class="grid"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="march-slider">
                <div class="calendar-page">
                    <div class="top">
                    <div class="top-wrapper">

                        <div class="text">
                            <div class="inner">
                                
                                <h2>March</h2>
                            </div>
                        </div>

                        <div class="event-summary fade-in">

                        </div>
                    </div>
                    </div>

                    <div class="calendar-container">
                        <div class="calendar fade-in">
                            <div class="weekdays">
                                <div>Sunday</div>
                                <div>Monday</div>
                                <div>Tuesday</div>
                                <div>Wednesday</div>
                                <div>Thursday</div>
                                <div>Friday</div>
                                <div>Saturday</div>
                            </div>

                            <div class="grid"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="april-slider">
                <div class="calendar-page">
                    <div class="top">
                    <div class="top-wrapper">

                        <div class="text">
                            <div class="inner">
                                
                                <h2>April</h2>
                            </div>
                        </div>

                        <div class="event-summary fade-in">

                        </div>
                    </div>
                    </div>

                    <div class="calendar-container">
                        <div class="calendar fade-in">
                            <div class="weekdays">
                                <div>Sunday</div>
                                <div>Monday</div>
                                <div>Tuesday</div>
                                <div>Wednesday</div>
                                <div>Thursday</div>
                                <div>Friday</div>
                                <div>Saturday</div>
                            </div>

                            <div class="grid"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="may-slider">
                <div class="calendar-page">
                    <div class="top">
                    <div class="top-wrapper">

                        <div class="text">
                            <div class="inner">
                                
                                <h2>May</h2>
                            </div>
                        </div>

                        <div class="event-summary fade-in">

                        </div>
                    </div>
                    </div>

                    <div class="calendar-container">
                        <div class="calendar fade-in">
                            <div class="weekdays">
                                <div>Sunday</div>
                                <div>Monday</div>
                                <div>Tuesday</div>
                                <div>Wednesday</div>
                                <div>Thursday</div>
                                <div>Friday</div>
                                <div>Saturday</div>
                            </div>

                            <div class="grid"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="june-slider">
                <div class="calendar-page">
                    <div class="top">
                    <div class="top-wrapper">

                        <div class="text">
                            <div class="inner">
                                
                                <h2>June</h2>
                            </div>
                        </div>

                        <div class="event-summary fade-in">

                        </div>
                    </div>
                    </div>

                    <div class="calendar-container">
                        <div class="calendar fade-in">
                            <div class="weekdays">
                                <div>Sunday</div>
                                <div>Monday</div>
                                <div>Tuesday</div>
                                <div>Wednesday</div>
                                <div>Thursday</div>
                                <div>Friday</div>
                                <div>Saturday</div>
                            </div>

                            <div class="grid"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="july-slider">
                <div class="calendar-page">
                    <div class="top">
                    <div class="top-wrapper">

                        <div class="text">
                            <div class="inner">
                                
                                <h2>July</h2>
                            </div>
                        </div>

                        <div class="event-summary fade-in">

                        </div>
                    </div>
                    </div>

                    <div class="calendar-container">
                        <div class="calendar fade-in">
                            <div class="weekdays">
                                <div>Sunday</div>
                                <div>Monday</div>
                                <div>Tuesday</div>
                                <div>Wednesday</div>
                                <div>Thursday</div>
                                <div>Friday</div>
                                <div>Saturday</div>
                            </div>

                            <div class="grid"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="august-slider">
                <div class="calendar-page">
                    <div class="top">
                    <div class="top-wrapper">

                        <div class="text">
                            <div class="inner">
                                
                                <h2>August</h2>
                            </div>
                        </div>

                        <div class="event-summary fade-in">

                        </div>
                    </div>
                    </div>

                    <div class="calendar-container">
                        <div class="calendar fade-in">
                            <div class="weekdays">
                                <div>Sunday</div>
                                <div>Monday</div>
                                <div>Tuesday</div>
                                <div>Wednesday</div>
                                <div>Thursday</div>
                                <div>Friday</div>
                                <div>Saturday</div>
                            </div>

                            <div class="grid"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="september-slider">
                <div class="calendar-page">
                    <div class="top">
                    <div class="top-wrapper">

                        <div class="text">
                            <div class="inner">
                                
                                <h2>September</h2>
                            </div>
                        </div>

                        <div class="event-summary fade-in">

                        </div>
                    </div>
                    </div>

                    <div class="calendar-container">
                        <div class="calendar fade-in">
                            <div class="weekdays">
                                <div>Sunday</div>
                                <div>Monday</div>
                                <div>Tuesday</div>
                                <div>Wednesday</div>
                                <div>Thursday</div>
                                <div>Friday</div>
                                <div>Saturday</div>
                            </div>

                            <div class="grid"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="october-slider">
                <div class="calendar-page">
                    <div class="top">
                    <div class="top-wrapper">

                        <div class="text">
                            <div class="inner">
                                
                                <h2>October</h2>
                            </div>
                        </div>

                        <div class="event-summary fade-in">

                        </div>
                    </div>
                    </div>

                    <div class="calendar-container">
                        <div class="calendar fade-in">
                            <div class="weekdays">
                                <div>Sunday</div>
                                <div>Monday</div>
                                <div>Tuesday</div>
                                <div>Wednesday</div>
                                <div>Thursday</div>
                                <div>Friday</div>
                                <div>Saturday</div>
                            </div>

                            <div class="grid"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="november-slider">
                <div class="calendar-page">
                    <div class="top">
                    <div class="top-wrapper">

                        <div class="text">
                            <div class="inner">
                                
                                <h2>November</h2>
                            </div>
                        </div>

                        <div class="event-summary fade-in">

                        </div>
                    </div>
                    </div>

                    <div class="calendar-container">
                        <div class="calendar fade-in">
                            <div class="weekdays">
                                <div>Sunday</div>
                                <div>Monday</div>
                                <div>Tuesday</div>
                                <div>Wednesday</div>
                                <div>Thursday</div>
                                <div>Friday</div>
                                <div>Saturday</div>
                            </div>

                            <div class="grid"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="december-slider">
                <div class="calendar-page">
                    <div class="top">
                    <div class="top-wrapper">

                        <div class="text">
                            <div class="inner">
                                
                                <h2>December</h2>
                            </div>
                        </div>

                        <div class="event-summary fade-in">

                        </div>
                    </div>
                    </div>

                    <div class="calendar-container">
                        <div class="calendar fade-in">
                            <div class="weekdays">
                                <div>Sunday</div>
                                <div>Monday</div>
                                <div>Tuesday</div>
                                <div>Wednesday</div>
                                <div>Thursday</div>
                                <div>Friday</div>
                                <div>Saturday</div>
                            </div>

                            <div class="grid"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<?php get_footer(); ?>