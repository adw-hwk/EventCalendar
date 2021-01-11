<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FN Events Calendar</title>

    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Jost:wght@100;200;300;400;500;600;700;800;900&family=Vidaloka&display=swap" rel="stylesheet">
    <script src="https://kit.fontawesome.com/ac67bda5b9.js" crossorigin="anonymous"></script>

    <?php wp_head(); ?>


</head>

<body>

    <div id="page-wrapper">

        <header>

            <a id="prev-month" class="month-navigation" style="opacity: 0;"><i class="fas fa-angle-double-left"></i></a>

            <a class="month-text"><strong>2021</strong> | Jan <i class="fas fa-angle-down"></i></a>

            <a id="next-month" class="month-navigation"><i class="fas fa-angle-double-right"></i></a>

            <div class="months-dropdown-menu">
            
                <div class="month">
                    <div class="banner">01</div>
                    <div class="body">January</div>
                </div>
                <div class="month">
                    <div class="banner">02</div>
                    <div class="body">February</div>
                </div>
                <div class="month">
                    <div class="banner">03</div>
                    <div class="body">March</div>
                </div>
                <div class="month">
                    <div class="banner">04</div>
                    <div class="body">April</div>
                </div>
                <div class="month">
                    <div class="banner">05</div>
                    <div class="body">May</div>
                </div>
                <div class="month">
                    <div class="banner">06</div>
                    <div class="body">June</div>
                </div>
                <div class="month">
                    <div class="banner">07</div>
                    <div class="body">July</div>
                </div>
                <div class="month">
                    <div class="banner">08</div>
                    <div class="body">August</div>
                </div>
                <div class="month">
                    <div class="banner">09</div>
                    <div class="body">September</div>
                </div>
                <div class="month">
                    <div class="banner">10</div>
                    <div class="body">October</div>
                </div>
                <div class="month">
                    <div class="banner">11</div>
                    <div class="body">November</div>
                </div>
                <div class="month">
                    <div class="banner">12</div>
                    <div class="body">December</div>
                </div>


            </div>


        </header>

        <div id="page-loader">
        <div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        <span>Loading calendar</span>
        </div>
        <div class="page-content">