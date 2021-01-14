<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Test</title>
</head>
<body>

    <?php 

    function console_log($output, $with_script_tags = true) {
        $js_code = 'console.log(' . json_encode($output, JSON_HEX_TAG) . ');';
        if ($with_script_tags) {
            $js_code = '<script>' . $js_code . '</script>';
        };
        echo $js_code;
    }

        $events = tribe_get_events(array(
            'start_date' => '2021-01-01 00:00:00',
            'end_date' => '2021-12-31 23:59:59',
        ));

        $posts = array();

        $sorted_events = array(
            1 => array(),
            2 => array(),
            3 => array(),
            4 => array(),
            5 => array(),
            6 => array(),
            7 => array(),
            8 => array(),
            9 => array(),
            10 => array(),
            11 => array(),
            12 => array(),
        );

        $homepage_events = array();

        foreach($events as $event) {

            $post = get_post($event);

            $event_ID = $post->ID;

            $meta = get_post_meta($event_ID);

            $category = count(tribe_get_event_cat_slugs($event_ID)) > 0 ? tribe_get_event_cat_slugs($event_ID)[0] : null;
            // console_log(get_the_tags($event_ID));

            $start_date_arr = array (
                'year' => date_parse($meta['_EventStartDateUTC'][0])["year"],
                'month' => date_parse($meta['_EventStartDateUTC'][0])["month"],
                'day' => date_parse($meta['_EventStartDateUTC'][0])["day"],
                'hour' => date_parse($meta['_EventStartDateUTC'][0])["hour"],
                'minute' => date_parse($meta['_EventStartDateUTC'][0])["minute"]
            );

            $end_date_parsed = date_parse($meta->_EventEndDateUTC);

            $end_date_arr = array (
                'year' => date_parse($meta['_EventEndDateUTC'][0])["year"],
                'month' => date_parse($meta['_EventEndDateUTC'][0])["month"],
                'day' => date_parse($meta['_EventEndDateUTC'][0])["day"],
                'hour' => date_parse($meta['_EventEndDateUTC'][0])["hour"],
                'minute' => date_parse($meta['_EventEndDateUTC'][0])["minute"]
            );

            $venueID = $meta['_EventVenueID'][0];

            $venue_obj = $venueID !== null ? tribe_get_venue_object($venueID) : null;

            // we're assuming no events that have time periods are going to start at midnight
            $all_day_condition = $start_date_arr[$hour] == 0;
            

            $featured = $meta['_tribe_featured'][0] == "1" ? true : false;

            $URL = $meta['_EventURL'] ? $meta['_EventURL'][0] : null;

            $image = !get_the_post_thumbnail_url($event_ID) ? false : array(
                'full' => get_the_post_thumbnail_url($event_ID, 'full'),
                'large' => get_the_post_thumbnail_url($event_ID, 'large')
            );

            $tags_arr = array();

            $post_tags = get_the_tags($event_ID);

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
                'image' => $image
            );

            $month_num = (int)$formatted_event['start_date']['month'];

            array_push($sorted_events[$month_num], $formatted_event);

        }

        // console_log($sorted_events);
        echo ('<script> var events = ' . json_encode($sorted_events) . ';</script>')

    ?>
    
</body>
</html>