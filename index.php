<?php get_header(); ?>


<div id="page-wrapper">

    <div class="cal-loader">
        <span>Loading</span>
        <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        <span>Calendar</span>
    </div>

    <header>

    <img src="<?php echo get_template_directory_uri() . '/img/logo-white.png' ?>" alt="" class="header-logo">


        <div class="navigation">
            <a id="prev-month-nav" class="month-navigation"><i class="fas fa-angle-double-left"></i></a>

            <div class="swiper-container month-text-container">
                <div class="swiper-wrapper">
                
                    <div class="month-text-slide swiper-slide" id="january-month-text">
                        <span><strong>2021 |</strong> January</span>
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


            <a id="next-month-nav" class="month-navigation"><i class="fas fa-angle-double-right"></i></a>

            <a class="show-months-btn">
                <i class="fas fa-angle-down arrow"></i>
                <i class="far fa-calendar-alt calendar"></i>
            </a>
        </div>


        <div class="months-dropdown-menu">
        
            <div class="month">
                <div class="banner">01 <span> | <strong>2021</strong> | January</span></div>
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


    <div class="calendar-swiper swiper-container blur">
        <div class="swiper-wrapper">


            <div class="calendar-slide swiper-slide" id="january-slider">



                <div class="hero-wrapper">

                    <div class="swiper-container hero-swiper-container">
                        <div class="hero-article-wrapper swiper-wrapper">


                        </div>
                    </div>
                    <div class="hero-text-wrapper">

                        <div class="upper">
                        <img src="<?php echo get_template_directory_uri() . '/img/logo-white.png' ?>" alt="" class="hero-logo">

                            <div class="text homepage-text">



                                <h4>What's on for your</h4>
                                <h1>2021</h1>
                            </div>
                            <img class="hero-bg-image" src="https://source.unsplash.com/1600x900?fireworks" alt="">
                        </div>

                        <div class="lower">

                        <div class="text">

                            <div class="counter">486</div>
                            <div class="hero-blurb">
                                <div>First National events scheduled for 2021.</div>
                                
                                <div style="font-weight:600">See you there.</div>
                                
                                <a class="home-cta">See what's coming up in February <i class="fas fa-angle-double-right"></i></a>
                            </div>

                        </div>



                        </div>

                    </div>
                </div>
                <div class="event-wrapper">


                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="february-slider">

                <div class="hero-wrapper">



                    <div class="swiper-container hero-swiper-container">
                        <div class="hero-article-wrapper swiper-wrapper">



                        </div>
                    </div>
                    <div class="hero-text-wrapper">

                    <div class="upper">
                            <div class="text">
                                <h4>What's on for your</h4>
                                <h2>February</h2>

                                <div class="scroll-prompt">

<span>Scroll for events</span>

<div class="arrow"><i class="fas fa-angle-down"></i></div>

</div>
                            </div>

                            <img class="hero-bg-image" src="https://source.unsplash.com/1602x977?summer" alt="">
                        </div>



                    </div>
                </div>
                <div class="event-wrapper">



                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="march-slider">

                <div class="hero-wrapper">



                    <div class="swiper-container hero-swiper-container">
                        <div class="hero-article-wrapper swiper-wrapper">



                        </div>
                    </div>
                    <div class="hero-text-wrapper">

                    <div class="upper">
                            <div class="text">
                                <h4>What's on for your</h4>
                                <h2>March</h2>

                                <div class="scroll-prompt">

<span>Scroll for events</span>

<div class="arrow"><i class="fas fa-angle-down"></i></div>

</div>
                            </div>
                            <img class="hero-bg-image" src="https://source.unsplash.com/1600x955?autumn" alt="">
                        </div>



                    </div>
                </div>
                <div class="event-wrapper">



                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="april-slider">

                <div class="hero-wrapper">



                    <div class="swiper-container hero-swiper-container">
                        <div class="hero-article-wrapper swiper-wrapper">



                        </div>
                    </div>
                    <div class="hero-text-wrapper">

                    <div class="upper">
                            <div class="text">
                                <h4>What's on for your</h4>
                                <h2>April</h2>

                                <div class="scroll-prompt">

<span>Scroll for events</span>

<div class="arrow"><i class="fas fa-angle-down"></i></div>

</div>
                            </div>
                            <img class="hero-bg-image" src="https://source.unsplash.com/1650x990?autumn" alt="">
                        </div>



                    </div>
                </div>
                <div class="event-wrapper">



                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="may-slider">

                <div class="hero-wrapper">



                    <div class="swiper-container hero-swiper-container">
                        <div class="hero-article-wrapper swiper-wrapper">



                        </div>
                    </div>
                    <div class="hero-text-wrapper">

                    <div class="upper">
                            <div class="text">
                                <h4>What's on for your</h4>
                                <h2>May</h2>

                                <div class="scroll-prompt">

<span>Scroll for events</span>

<div class="arrow"><i class="fas fa-angle-down"></i></div>

</div>
                            </div>
                            <img class="hero-bg-image" src="https://source.unsplash.com/1800x950?autumn" alt="">
                        </div>



                    </div>
                </div>
                <div class="event-wrapper">



                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="june-slider">

                <div class="hero-wrapper">



                    <div class="swiper-container hero-swiper-container">
                        <div class="hero-article-wrapper swiper-wrapper">



                        </div>
                    </div>
                    <div class="hero-text-wrapper">

                    <div class="upper">
                            <div class="text">
                                <h4>What's on for your</h4>
                                <h2>June</h2>

                                <div class="scroll-prompt">

<span>Scroll for events</span>

<div class="arrow"><i class="fas fa-angle-down"></i></div>

</div>
                            </div>
                            <img class="hero-bg-image" src="https://source.unsplash.com/1700x908?winter" alt="">
                        </div>



                    </div>
                </div>
                <div class="event-wrapper">



                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="july-slider">

                <div class="hero-wrapper">



                    <div class="swiper-container hero-swiper-container">
                        <div class="hero-article-wrapper swiper-wrapper">



                        </div>
                    </div>
                    <div class="hero-text-wrapper">

                    <div class="upper">
                            <div class="text">
                                <h4>What's on for your</h4>
                                <h2>July</h2>
                                <div class="scroll-prompt">

<span>Scroll for events</span>

<div class="arrow"><i class="fas fa-angle-down"></i></div>

</div>
                            </div>
                            <img class="hero-bg-image" src="https://source.unsplash.com/1699x901?winter" alt="">
                        </div>



                    </div>
                </div>
                <div class="event-wrapper">



                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="august-slider">

                <div class="hero-wrapper">



                    <div class="swiper-container hero-swiper-container">
                        <div class="hero-article-wrapper swiper-wrapper">



                        </div>
                    </div>
                    <div class="hero-text-wrapper">

                    <div class="upper">
                            <div class="text">
                                <h4>What's on for your</h4>
                                <h2>August</h2>
                                <div class="scroll-prompt">

<span>Scroll for events</span>

<div class="arrow"><i class="fas fa-angle-down"></i></div>

</div>
                            </div>
                            <img class="hero-bg-image" src="https://source.unsplash.com/1607x942?winter" alt="">
                        </div>



                    </div>
                </div>
                <div class="event-wrapper">



                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="september-slider">

                <div class="hero-wrapper">



                    <div class="swiper-container hero-swiper-container">
                        <div class="hero-article-wrapper swiper-wrapper">



                        </div>
                    </div>
                    <div class="hero-text-wrapper">

                    <div class="upper">
                            <div class="text">
                                <h4>What's on for your</h4>
                                <h2>September</h2>
                                <div class="scroll-prompt">

<span>Scroll for events</span>

<div class="arrow"><i class="fas fa-angle-down"></i></div>

</div>
                            </div>
                            <img class="hero-bg-image" src="https://source.unsplash.com/1592x950?spring" alt="">
                        </div>


                    </div>
                </div>
                <div class="event-wrapper">



                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="october-slider">

                <div class="hero-wrapper">



                    <div class="swiper-container hero-swiper-container">
                        <div class="hero-article-wrapper swiper-wrapper">



                        </div>
                    </div>
                    <div class="hero-text-wrapper">

                    <div class="upper">
                            <div class="text">
                                <h4>What's on for your</h4>
                                <h2>October</h2>
                                <div class="scroll-prompt">

<span>Scroll for events</span>

<div class="arrow"><i class="fas fa-angle-down"></i></div>

</div>
                            </div>
                            <img class="hero-bg-image" src="https://source.unsplash.com/1600x909?spring" alt="">
                        </div>

     

                    </div>
                </div>
                <div class="event-wrapper">



                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="november-slider">

                <div class="hero-wrapper">



                    <div class="swiper-container hero-swiper-container">
                        <div class="hero-article-wrapper swiper-wrapper">



                        </div>
                    </div>
                    <div class="hero-text-wrapper">

                    <div class="upper">
                            <div class="text">
                                <h4>What's on for your</h4>
                                <h2>November</h2>
                                <div class="scroll-prompt">

<span>Scroll for events</span>

<div class="arrow"><i class="fas fa-angle-down"></i></div>

</div>
                            </div>
                            <img class="hero-bg-image" src="https://source.unsplash.com/1611x925?spring" alt="">
                        </div>

    

                    </div>
                </div>
                <div class="event-wrapper">



                </div>
            </div>
            <div class="calendar-slide swiper-slide" id="december-slider">

                <div class="hero-wrapper">



                    <div class="swiper-container hero-swiper-container">
                        <div class="hero-article-wrapper swiper-wrapper">



                        </div>
                    </div>
                    <div class="hero-text-wrapper">

                    <div class="upper">
                            <div class="text">
                                <h4>What's on for your</h4>
                                <h2>December</h2>

                                <div class="scroll-prompt">

<span>Scroll for events</span>

<div class="arrow"><i class="fas fa-angle-down"></i></div>

</div>
                            </div>
                            <img class="hero-bg-image" src="https://source.unsplash.com/random?summer" alt="">
                        </div>



                    </div>
                </div>
                <div class="event-wrapper">



                </div>
            </div>


        </div>
    </div>

</div>



<?php get_footer(); ?>