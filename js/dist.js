"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}

function _asyncToGenerator(fn) {
    return function() {
        var self = this,
            args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);

            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }

            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}

window.addEventListener("load", function() {
    var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    var dataController = (function() {
        var siteURL = window.location.href;
        var endpoint = "wp-json/tribe/events/v1/events";
        var query =
            "?page=1&per_page=100&start_date=2021-01-01 00:00:00&end_date=2022-01-01 00:00:00";
        var state = {};
        return {
            state: state,
            // these functions were used when the events were fetched via the WP REST API
            // this became slow so the events are now fetched on the backend and added to the
            // page as a JavaScript object making these functions obsolete
            // should they ever be used again then the code will need to be changed in this file
            // a bit since these methods return the data structured differently
            // fetchEvents: async() => {
            //     let eventsArr;
            //     const timeStart = new Date().getTime();
            //     await fetch(siteURL + endpoint + query)
            //         .then(async(response) => {
            //             const initialReq = await response.json();
            //             eventsArr = initialReq.events;
            //             let nextURL = initialReq.next_rest_url;
            //             while (nextURL !== undefined) {
            //                 await fetch(nextURL)
            //                     .then((response) => {
            //                         return response.json();
            //                     })
            //                     .then((response) => {
            //                         nextURL = response.next_rest_url;
            //                         response.events.forEach((event) => {
            //                             eventsArr.push(event);
            //                         })
            //                     }).catch(() => {
            //                         alert('Error fetching calendar, try refreshing the page.');
            //                     })
            //             }
            //         })
            //         .catch(() => {
            //             alert('Error fetching calendar, try refreshing the page.');
            //         });
            //     const timeEnd = new Date().getTime();
            //     console.log(`Fetch took ${(timeEnd - timeStart)}ms.`);
            //     console.log(`Events: ${eventsArr.length}`);
            //     return eventsArr;
            // },
            // sortEvents: (allEvents) => {
            //     let sortedEvents = {};
            //     months.forEach((month, index) => {
            //         allEvents.forEach((e) => {
            //             if (parseInt(e.start_date.month) == index + 1) {
            //                 // initialise month event array
            //                 if (!sortedEvents[month]) {
            //                     sortedEvents[month] = new Array();
            //                 }
            //                 sortedEvents[month].push(e);
            //             }
            //         })
            //     });
            //     return sortedEvents;
            // },
            getAllFeatured: function getAllFeatured(events) {
                var featuredArr = [];
                monthKeys = Object.keys(events);
                monthKeys.forEach(function(month) {
                    events[month].forEach(function(e) {
                        if (e.featured) {
                            featuredArr.push(e);
                        }
                    });
                });
                return featuredArr;
            },
            getMonthFeatured: function getMonthFeatured(events) {
                var featuredArr = [];
                events.forEach(function(e) {
                    if (e.featured) {
                        featuredArr.push(e);
                    }
                });
                return featuredArr;
            },
            getHomepageFeatured: function getHomepageFeatured(events) {
                var featuredArr = [];
                monthKeys = Object.keys(events);
                monthKeys.forEach(function(month) {
                    events[month].forEach(function(e) {
                        if (e.tags !== null) {
                            e.tags.forEach(function(tag) {
                                if (tag === "homepage") {
                                    featuredArr.push(e);
                                }
                            });
                        }
                    });
                });
                return featuredArr;
            }
        };
    })();

    var UIController = (function() {
        var days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];
        var DOM = {
            pageWrapper: document.querySelector("#page-wrapper"),
            calendarSwiper: document.querySelector(".calendar-swiper"),
            heroSwiperContainer: document.querySelector(".hero-swiper-container"),
            heroEventWrapper: document.querySelector(".hero-article-wrapper"),
            heroTextWrapper: document.querySelector(".hero-text-wrapper"),
            eventWrapper: document.querySelector(".event-wrapper"),
            prevMonthBtn: document.querySelector("#prev-month-nav"),
            nextMonthBtn: document.querySelector("#next-month-nav"),
            monthText: document.querySelector("header .month-text"),
            monthArrowString: ".month-text i",
            monthMenu: document.querySelector(".months-dropdown-menu"),
            dropdownMonthArr: Array.prototype.slice.call(
                document
                .querySelector(".months-dropdown-menu")
                .querySelectorAll(".month")
            ),
            menuElements: [
                document.querySelector("header .month-text"),
                document.querySelector(".month-text strong"),
                document.querySelector(".month-text i")
            ],
            loader: document.querySelector("#page-wrapper .cal-loader"),
            monthSlides: Array.prototype.slice.call(
                document.querySelectorAll(".calendar-swiper .calendar-slide")
            ),
            calendarButton: document.querySelector(".show-months-btn"),
            homeCTA: document.querySelector("a.home-cta"),
            calendarGrids: Array.prototype.slice.call(
                document.querySelectorAll(".calendar .grid")
            )
        };
        var DOMStrings = {
            monthNavs: {
                next: "#next-month-nav",
                prev: "#prev-month-nav"
            }
        };
        return {
            DOM: DOM,
            DOMStrings: DOMStrings,
            eventHtml: function eventHtml(event) {
                var startDateObj = new Date(event.start_date.UTC);
                var startWeekday = startDateObj.getDay();
                var endDateObj = new Date(event.end_date.UTC);
                var endWeekday = endDateObj.getDay();
                var categories = event.categories ? event.categories : undefined;
                var mainType = "minor";

                if (categories !== undefined) {
                    categories.forEach(function(category) {
                        if (["major", "minor", "seasonal"].includes(category.slug)) {
                            mainType = category.slug;
                        }
                    });
                }

                var vals = {
                    type: event.type,
                    finishDate: !(
                            event.end_date.month == event.start_date.month &&
                            event.end_date.day == event.start_date.day
                        ) ?
                        {
                            day: event.end_date.day,
                            month: event.end_date.month,
                            dayOfWeek: days[endWeekday]
                        } :
                        null,
                    startDate: {
                        day: event.start_date.day,
                        month: event.start_date.month,
                        dayOfWeek: days[startWeekday]
                    },
                    imgURL: event.image ? event.image.large : null,
                    title: event.title,
                    venue: event.venue ? event.venue.name : null,
                    time: !event.all_day ?
                        ""
                        .concat(event.start_date.hour, ":")
                        .concat(event.start_date.minute, " - ")
                        .concat(event.end_date.hour, ":")
                        .concat(event.end_date.minutes) :
                        null,
                    description: event.description.length > 0 ? event.description : null
                };
                return '<div class="event '
                    .concat(
                        vals.type ? vals.type : "minor",
                        '"><div class="date"><table><tbody><tr><td class="ddmm">'
                    )
                    .concat(
                        vals.finishDate == null ?
                        ""
                        .concat(vals.startDate.day, " ")
                        .concat(months[vals.startDate.month - 1].slice(0, 3)) :
                        ""
                        .concat(vals.startDate.day, " ")
                        .concat(months[vals.startDate.month - 1].slice(0, 3), " - ")
                        .concat(vals.finishDate.day, " ")
                        .concat(months[vals.finishDate.month - 1].slice(0, 3)),
                        '</td></tr><tr><td class="day">'
                    )
                    .concat(
                        vals.finishDate == null ?
                        "".concat(vals.startDate.dayOfWeek) :
                        ""
                        .concat(vals.startDate.dayOfWeek, " - ")
                        .concat(vals.finishDate.dayOfWeek),
                        '</td></tr></tbody></table></div><div class="details">'
                    )
                    .concat(
                        vals.imgURL !== null ?
                        '<img class="event-image" data-src="'
                        .concat(vals.imgURL, '" alt="')
                        .concat(vals.title, '">') :
                        "",
                        '<div class="text"><div class="title">'
                    )
                    .concat(vals.title, "</div>")
                    .concat(
                        vals.venue !== null ?
                        '<div class="venue"><i class="far fa-building"></i> '.concat(
                            vals.venue,
                            "</div>"
                        ) :
                        ""
                    )
                    .concat(
                        vals.time !== null ?
                        '<div class="time"><i class="far fa-clock"></i> '.concat(
                            vals.time,
                            "</div>"
                        ) :
                        ""
                    )
                    .concat(
                        vals.description !== null ?
                        '<div class="description">'.concat(vals.description, "</div>") :
                        "",
                        "</div></div></div>"
                    );
            },
            heroArticleHtml: function heroArticleHtml(event) {
                var finishDate =
                    event.end_date.day !== event.start_date.day ?
                    {
                        day: event.end_date.day,
                        month: months[event.end_date.month - 1]
                    } :
                    null;
                var startDate = {
                    day: event.start_date.day,
                    month: months[event.end_date.month - 1]
                };
                return '<article class="swiper-slide">'
                    .concat(
                        event.image ?
                        '<img class="swiper-image" data-src="'
                        .concat(event.image.full, '" alt="')
                        .concat(event.title, '">') :
                        "",
                        '<div class="hero-title">'
                    )
                    .concat(event.title, '</div><br><div class="date">')
                    .concat(
                        finishDate == null ?
                        "".concat(startDate.day, " ").concat(startDate.month) :
                        ""
                        .concat(startDate.day, " ")
                        .concat(startDate.month, " - ")
                        .concat(finishDate.day, " ")
                        .concat(finishDate.month),
                        "</div></article>"
                    );
            },
            empty: function empty() {
                return "Such empty!";
            },
            updateMonthText: function updateMonthText(state) {
                var delay =
                    arguments.length > 1 && arguments[1] !== undefined ?
                    arguments[1] :
                    200;
                DOM.monthText.style.transition = "transform ".concat(
                    delay,
                    "ms ease-in-out"
                );
                DOM.monthText.classList.add("spin");
                setTimeout(function() {
                    DOM.monthText.innerHTML =
                        state.currentMonth == 0 ?
                        '<strong>2021</strong> | Jan  <i class="fas fa-angle-down"></i>' :
                        "".concat(
                            months[state.currentMonth],
                            '  <i class="fas fa-angle-down"></i>'
                        );
                    DOM.monthText.classList.remove("spin");
                }, delay);
            },
            toggleNavArrows: function toggleNavArrows(currentMonth) {
                if (currentMonth == 0) {
                    DOM.nextMonthBtn.style.opacity = "1";
                    DOM.prevMonthBtn.style.opacity = "0";
                } else if (currentMonth == 11) {
                    DOM.nextMonthBtn.style.opacity = "0";
                    DOM.prevMonthBtn.style.opacity = "1";
                } else {
                    DOM.nextMonthBtn.style.opacity = "1";
                    DOM.prevMonthBtn.style.opacity = "1";
                }
            },
            hideLoader: function hideLoader() {
                var fadeDelay =
                    arguments.length > 0 && arguments[0] !== undefined ?
                    arguments[0] :
                    250;
                DOM.loader.style.transition = "opacity ".concat(
                    fadeDelay,
                    "ms ease-in-out"
                );
                DOM.calendarSwiper.style.transition = "filter ".concat(
                    fadeDelay,
                    "ms ease-in-out"
                );
                DOM.loader.classList.add("fade");
                DOM.calendarSwiper.classList.remove("blur");
                setTimeout(function() {
                    DOM.loader.classList.add("hidden");
                }, fadeDelay);
            },
            showDropdownMenu: function showDropdownMenu() {
                DOM.monthMenu.style.display = "grid";
                setTimeout(function() {
                    DOM.monthMenu.classList.add("open");
                }, 25);
                DOM.monthSlides.forEach(function(slide) {
                    slide.classList.add("blur");
                });
            },
            //delay set to 400ms in CSS
            hideDropdownMenu: function hideDropdownMenu() {
                DOM.monthMenu.classList.remove("open");
                setTimeout(function() {
                    DOM.monthMenu.style.display = "none";
                }, 400);
                DOM.monthSlides.forEach(function(slide) {
                    slide.classList.remove("blur");
                });
            },
            getAllImages: function getAllImages() {
                return Array.prototype.slice.call(document.images);
            },
            sortImages: function sortImages(images) {
                var sortedImages = {};
                DOM.monthSlides.forEach(function(slide, i) {
                    images.forEach(function(image) {
                        if (image.closest(".calendar-slide") === slide) {
                            // initialise month array
                            if (sortedImages[months[i]] === undefined) {
                                sortedImages[months[i]] = new Array();
                            }

                            if (image.classList.contains("swiper-image")) {
                                if (sortedImages[months[i]].swiper === undefined) {
                                    sortedImages[months[i]].swiper = new Array();
                                }

                                sortedImages[months[i]].swiper.push(image);
                            } else if (image.classList.contains("hero-bg-image")) {
                                sortedImages[months[i]].heroBG = image;
                            } else {
                                if (sortedImages[months[i]].events === undefined) {
                                    sortedImages[months[i]].events = new Array();
                                }

                                sortedImages[months[i]].events.push(image);
                            }
                        }
                    });
                });
                return sortedImages;
            },
            setActiveMenuMonth: function setActiveMenuMonth(currentMonth) {
                DOM.dropdownMonthArr.forEach(function(month) {
                    if (month.classList.contains("active")) {
                        month.classList.remove("active");
                    }
                });
                DOM.dropdownMonthArr[currentMonth].classList.add("active");
            },
            writeCalendarGrid: function writeCalendarGrid(month, events) {
                var getDaysInMonth = function getDaysInMonth(monthNum, year) {
                    return new Date(year, monthNum, 0).getDate();
                };

                var writeDaysEvents = function writeDaysEvents(day, events) {
                    var eventList = "";
                    events.forEach(function(event) {
                        if (
                            event.start_date.day == day ||
                            (event.end_date.day >= day && event.start_date.day < day)
                        ) {
                            eventList += '<div class="day-event '
                                .concat(event.type, '">')
                                .concat(event.title, "</div>");
                        }
                    });
                    return eventList;
                };

                var year = new Date().getFullYear();
                var daysInMonth = getDaysInMonth(month, year);
                var monthString = month < 10 ? "0".concat(month) : "".concat(month);
                var dayOne = new Date("".concat(year, "-").concat(monthString, "-01"));
                var dayOneIndex = dayOne.getDay();
                var squares = 0;
                var HTML = "";

                var innactiveSquare = function innactiveSquare(curMonth, steps) {
                    var placement =
                        arguments.length > 2 && arguments[2] !== undefined ?
                        arguments[2] :
                        "before";
                    var daysInPrevMonth = getDaysInMonth(curMonth - 1, year);
                    var day;

                    if (placement === "after") {
                        day = steps + 1;
                    } else if (placement === "before") {
                        day = daysInPrevMonth + steps - dayOneIndex + 1;
                    } else {
                        day = "";
                    }

                    return '<div class="day-square innactive"><div class="banner">'.concat(
                        day,
                        '</div><div class="contents"></div></div>'
                    );
                };

                var daySquare = function daySquare(day, eventList) {
                    return '<div class="day-square'
                        .concat(eventList.length > 0 ? "" : " no-events", '" data-day="')
                        .concat(day, '"><div class="banner')
                        .concat([0, 6].includes(squares % 7) ? " weekend" : "", '">')
                        .concat(day, '<span class="mbl-weekday-text"> | ')
                        .concat(
                            days[squares % 7].slice(0, 3),
                            '</span></div><div class="contents">'
                        )
                        .concat(eventList, "</div></div>");
                };

                for (var i = 0; i < dayOneIndex; i++) {
                    HTML += innactiveSquare(month, i, "before");
                    squares++;
                }

                for (var _i = 0; _i < daysInMonth; _i++) {
                    HTML += daySquare(_i + 1, writeDaysEvents(_i + 1, events));
                    squares++;
                }

                var nextMonthSquare = 0;

                while (squares % 7 !== 0) {
                    HTML += innactiveSquare(month, nextMonthSquare, "after");
                    nextMonthSquare++;
                    squares++;
                } // DOM.calendarGrids[month - 2].style.gridTemplateRows = `repeat(${squares / 7}, 1fr)`

                return HTML;
            },
            writeEventSummary: function writeEventSummary(events) {
                var summaryHTML = {
                    major: "",
                    training: "",
                    seasonal: ""
                };
                events.forEach(function(event) {
                    if (event.type === "major") {
                        summaryHTML.major += ""
                            .concat(summaryHTML.major.length == 0 ? "" : ", ")
                            .concat(event.featured ? "<strong>" : "")
                            .concat(event.title)
                            .concat(event.featured ? "</strong>" : "");
                    } else if (event.type === "training") {
                        summaryHTML.training += ""
                            .concat(summaryHTML.training.length == 0 ? "" : ", ")
                            .concat(event.title);
                    } else if (event.type === "seasonal") {
                        summaryHTML.seasonal += ""
                            .concat(summaryHTML.seasonal.length == 0 ? "" : ", ")
                            .concat(event.title);
                    }
                });
                return "<table><tbody>"
                    .concat(
                        summaryHTML.major.length > 0 ?
                        '<tr><td class="icon"><i class="fas fa-globe"></i></td><td class="list">'.concat(
                            summaryHTML.major,
                            "</td></tr>"
                        ) :
                        ""
                    )
                    .concat(
                        summaryHTML.training.length > 0 ?
                        '<tr><td class="icon"><i class="fas fa-chalkboard-teacher"></i></td><td class="list">'.concat(
                            summaryHTML.training,
                            "</td></tr>"
                        ) :
                        ""
                    )
                    .concat(
                        summaryHTML.seasonal.length > 0 ?
                        '<tr><td class="icon"><i class="far fa-snowflake"></i></td><td class="list">'.concat(
                            summaryHTML.seasonal,
                            "</td></tr>"
                        ) :
                        "",
                        "</tbody></table>"
                    );
            }
        };
    })();

    var controller = (function(dataCtrl, UICtrl) {
        var setImgSrc = function setImgSrc(image) {
            if (!image.src && image.dataset.src.length > 0) {
                image.src = image.dataset.src;
            }
        };

        var setupEventListeners = function setupEventListeners() {
            window.addEventListener("click", function(e) {
                if (
                    UICtrl.DOM.monthMenu.classList.contains("open") &&
                    e.target.closest("a") !== UICtrl.DOM.calendarButton
                ) {
                    UICtrl.hideDropdownMenu();
                }
            });
            window.addEventListener("click", function(e) {
                if (e.target.closest("div.scroll-prompt")) {
                    UICtrl.DOM.monthSlides[dataCtrl.state.currentMonth]
                        .querySelector(".event-wrapper")
                        .scrollIntoView();
                }
            });
            var monthMenuArr = Array.prototype.slice.call(
                document.querySelectorAll(".months-dropdown-menu .month")
            );
            UICtrl.DOM.monthMenu.addEventListener("click", function(e) {
                if (monthMenuArr.includes(e.target.closest("div.month"))) {
                    dataCtrl.state.calendarSwiper.slideTo(
                        monthMenuArr.indexOf(e.target.closest("div.month")),
                        0
                    );
                }
            });
            UICtrl.DOM.calendarButton.addEventListener("click", function() {
                if (UICtrl.DOM.monthMenu.classList.contains("open")) {
                    UICtrl.hideDropdownMenu();
                } else {
                    UICtrl.showDropdownMenu();
                }
            });
            UICtrl.DOM.homeCTA.addEventListener("click", function() {
                dataCtrl.state.calendarSwiper.slideNext();
            });
            UICtrl.DOM.monthSlides.forEach(function(slide) {
                var prompt = slide.querySelector(".scroll-prompt");
                var hero = slide.querySelector(".hero-wrapper");
                slide.addEventListener("scroll", function() {
                    // with header height set to 5rem in CSS, the top value when fully scrolled to the top of the container is 80
                    var heroRect = hero.getBoundingClientRect();
                    var heroTop = heroRect.top;
                    var heroHeight = heroRect.height; // what the below does is set the opacity to 0 as you scroll
                    // the assignment directly below sets opacity to 0 by the time you
                    // get to 1/10 way down the hero section (heroHeight / 10)

                    var opacity = 1 - (80 - heroTop) / (heroHeight / 10);
                    opacity = opacity >= 0 ? opacity : 0;
                    prompt.style.opacity = opacity.toString();
                });
            });
        };

        return {
            init: (function() {
                var _init = _asyncToGenerator(
                    /*#__PURE__*/
                    regeneratorRuntime.mark(function _callee() {
                        var homepageEvents, monthTextSwiper, calendarSwiper;
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                            while (1) {
                                switch ((_context.prev = _context.next)) {
                                    case 0:
                                        dataCtrl.state.currentMonth = 0;
                                        dataCtrl.state.monthsVisited = new Array(); // __calEvents is the global JS object of events from the WP database that is
                                        // added to the HTML page when it's rendered

                                        dataCtrl.state.events = __calEvents;
                                        homepageEvents = dataCtrl.getHomepageFeatured(
                                            dataCtrl.state.events
                                        ); // writing the DOM

                                        UICtrl.DOM.monthSlides.forEach(function(slide, i) {
                                            var eventContainer = slide.querySelector(
                                                ".event-wrapper"
                                            );

                                            if (i == 0) {
                                                //homepage
                                                var heroSliderContainer = slide.querySelector(
                                                    ".hero-swiper-container"
                                                );
                                                var heroSliderWrapper = slide.querySelector(
                                                    ".hero-article-wrapper"
                                                );
                                                homepageEvents.forEach(function(event) {
                                                    heroSliderWrapper.innerHTML += UICtrl.heroArticleHtml(
                                                        event
                                                    );
                                                });
                                                new Swiper(heroSliderContainer, {
                                                    autoplay: {
                                                        delay: 2000
                                                    },
                                                    speed: 750,
                                                    effect: "fade",
                                                    fadeEffect: {
                                                        crossFade: true
                                                    }
                                                });
                                            } else {
                                                //calendar pages
                                                var monthEvents = dataCtrl.state.events[months[i]];
                                                var calendar = slide.querySelector(".calendar .grid");
                                                var eventSummary = slide.querySelector(
                                                    ".event-summary"
                                                );
                                                calendar.innerHTML = UICtrl.writeCalendarGrid(
                                                    i + 1,
                                                    monthEvents
                                                );
                                                eventSummary.innerHTML = UICtrl.writeEventSummary(
                                                    monthEvents
                                                );

                                                if (monthEvents !== undefined) {
                                                    var monthFeatured = dataCtrl.getMonthFeatured(
                                                        monthEvents
                                                    ); // monthFeatured.forEach((event) => {
                                                    //     heroSliderWrapper.innerHTML += UICtrl.heroArticleHtml(event);
                                                    // });
                                                    // new Swiper(heroSliderContainer, {
                                                    //     autoplay: {
                                                    //         delay: 2000,
                                                    //     },
                                                    //     speed: 750,
                                                    //     effect: 'fade',
                                                    //     fadeEffect: {
                                                    //         crossFade: true
                                                    //     },
                                                    // });
                                                    // monthEvents.forEach((event) => {
                                                    //     eventContainer.innerHTML += UICtrl.eventHtml(event);
                                                    // });
                                                }
                                            }
                                        });
                                        dataCtrl.state.images = UICtrl.sortImages(
                                            UICtrl.getAllImages()
                                        );
                                        monthTextSwiper = new Swiper(
                                            document.querySelector(".month-text-container"), {
                                                slidesPerView: 1,
                                                freeMode: false,
                                                watchSlidesVisibility: true,
                                                watchSlidesProgress: true,
                                                allowTouchMove: false,
                                                speed: 400
                                            }
                                        );
                                        dataCtrl.state.monthTextSwiper = monthTextSwiper;
                                        calendarSwiper = new Swiper(
                                            document.querySelector(".calendar-swiper"), {
                                                navigation: {
                                                    nextEl: document.querySelector(
                                                        UICtrl.DOMStrings.monthNavs.next
                                                    ),
                                                    prevEl: document.querySelector(
                                                        UICtrl.DOMStrings.monthNavs.prev
                                                    )
                                                },
                                                thumbs: {
                                                    swiper: monthTextSwiper
                                                },
                                                speed: 250,
                                                breakpoints: {
                                                    768: {
                                                        speed: 900
                                                    }
                                                },
                                                on: {
                                                    init: function init() {
                                                        var slide =
                                                            UICtrl.DOM.monthSlides[this.activeIndex];
                                                        Array.prototype.slice
                                                            .call(slide.querySelectorAll("img"))
                                                            .forEach(function(image) {
                                                                setImgSrc(image);
                                                            });
                                                        UICtrl.setActiveMenuMonth(
                                                            dataCtrl.state.currentMonth
                                                        );
                                                        UICtrl.toggleNavArrows(dataCtrl.state.currentMonth);
                                                        dataCtrl.state.monthsVisited.push(this.activeIndex);
                                                    },
                                                    slideChange: function slideChange() {
                                                        if (!dataCtrl.state.monthsVisited.includes(
                                                                this.activeIndex
                                                            )) {
                                                            var slide =
                                                                UICtrl.DOM.monthSlides[this.activeIndex];
                                                            Array.prototype.slice
                                                                .call(slide.querySelectorAll("img"))
                                                                .forEach(function(image) {
                                                                    setImgSrc(image);
                                                                });
                                                            dataCtrl.state.monthsVisited.push(
                                                                this.activeIndex
                                                            );
                                                        }

                                                        dataCtrl.state.currentMonth = this.activeIndex;
                                                        UICtrl.setActiveMenuMonth(
                                                            dataCtrl.state.currentMonth
                                                        );
                                                        UICtrl.toggleNavArrows(dataCtrl.state.currentMonth);
                                                    }
                                                }
                                            }
                                        );
                                        dataCtrl.state.calendarSwiper = calendarSwiper;
                                        setupEventListeners();
                                        UICtrl.hideLoader();

                                    case 12:
                                    case "end":
                                        return _context.stop();
                                }
                            }
                        }, _callee);
                    })
                );

                function init() {
                    return _init.apply(this, arguments);
                }

                return init;
            })()
        };
    })(dataController, UIController);

    controller.init();
});