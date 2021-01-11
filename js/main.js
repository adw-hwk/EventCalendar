const months = [
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

const dataController = (() => {

    const siteURL = 'http://eventcalendar.test';
    const endpoint = '/wp-json/tribe/events/v1/events';
    const query = '?page=1&per_page=1000&start_date=2021-01-01 00:00:00&end_date=2022-01-01 00:00:00';

    let state = {};

    return {
        state: state,

        fetchEvents: async() => {

            let eventsArr;

            const timeStart = new Date().getTime();

            await fetch(siteURL + endpoint + query)
                .then(async(response) => {
                    const initialReq = await response.json();

                    eventsArr = initialReq.events;

                    let nextURL = initialReq.next_rest_url;

                    while (nextURL !== undefined) {
                        await fetch(nextURL)
                            .then((response) => {
                                return response.json();
                            })
                            .then((response) => {
                                nextURL = response.next_rest_url;
                                response.events.forEach((event) => {
                                    eventsArr.push(event);
                                })
                            }).catch(() => {
                                alert('Error fetching calendar, try refreshing the page.');
                            })
                    }

                })
                .catch(() => {
                    alert('Error fetching calendar, try refreshing the page.');
                });

            const timeEnd = new Date().getTime();

            console.log(`Fetch took ${(timeEnd - timeStart)}ms.`);

            console.log(`Events: ${eventsArr.length}`);

            return eventsArr;

        },

        sortEvents: (allEvents) => {

            let sortedEvents = {};

            months.forEach((month, index) => {
                allEvents.forEach((e) => {
                    if (parseInt(e.start_date_details.month) == index + 1) {

                        // initialise month event array
                        if (!sortedEvents[month]) {
                            sortedEvents[month] = new Array();
                        }

                        sortedEvents[month].push(e);

                        allEvents.splice(allEvents.indexOf(e), 1);
                    }
                })
            });

            return sortedEvents;
        },

        getAllFeatured: (events) => {
            let featuredArr = [];
            monthKeys = Object.keys(events);

            monthKeys.forEach((month) => {
                events[month].forEach((e) => {
                    if (e.featured) {
                        featuredArr.push(e);
                    }
                })
            });

            return featuredArr;
        },

        getMonthFeatured: (events) => {
            let featuredArr = [];

            events.forEach((e) => {
                if (e.featured) {
                    featuredArr.push(e);
                }
            })

            return featuredArr;
        }
    }

})();

const UIController = (() => {

            const DOM = {
                heroSwiperContainer: document.querySelector('.hero-swiper-container'),
                heroEventWrapper: document.querySelector('.hero-article-wrapper'),
                heroTextWrapper: document.querySelector('.hero-text-wrapper'),
                eventWrapper: document.querySelector('.event-wrapper'),

                prevMonthBtn: document.querySelector('#prev-month'),
                nextMonthBtn: document.querySelector('#next-month'),

                monthText: document.querySelector('header .month-text'),
                monthArrowString: '.month-text i',
                monthMenu: document.querySelector('.months-dropdown-menu'),
                menuElements: [document.querySelector('header .month-text'), document.querySelector('.month-text strong'), document.querySelector('.month-text i')],

                loader: document.querySelector('#page-loader'),

                monthSlides: Array.prototype.slice.call(document.querySelectorAll('.calendar-swiper .calendar-slide'))

            }

            return {
                DOM: DOM,

                eventHtml: (event) => {

                        const startDateObj = new Date(e.start_date);
                        const startWeekday = startDateObj.getDay();
                        const endDateObj = new Date(e.end_date);
                        const endWeekday = endDateObj.getDay();
                        const days = [
                            "Sunday",
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday"
                        ];

                        let vals = {
                            type: event.categories[0].slug,

                            finishDate: parseInt(event.end_date_details.day) > parseInt(event.start_date_details.day) ? {
                                day: event.end_date_details.day,
                                month: months[parseInt(event.end_date_details.month) - 1],
                                dayOfWeek: days[endWeekday]
                            } : null,

                            startDate: {
                                day: event.start_date_details.day,
                                month: months[parseInt(event.start_date_details.month) - 1],
                                dayOfWeek: days[startWeekday]
                            },

                            imgURL: event.image.url ? event.image.url : null,

                            title: event.title,

                            venue: event.venue.length > 0 ? event.venue.venue : null,

                            time: !event.all_day ? `${event.start_date_details.hour}:${event.start_date_details.minutes} - ${event.end_date_details.hour}:${event.end_date_details.minutes}` : null,

                            description: event.description.length > 0 ? event.description : null

                        };

                        return `<div class="event ${vals.type}"><div class="date"><table><tbody><tr><td class="ddmm">${vals.finishDate == null ? `${vals.startDate.day} ${vals.startDate.month.slice(0,3)}` : `${vals.startDate.day} ${vals.startDate.month.slice(0,3)} - ${vals.finishDate.day} ${vals.finishDate.month.slice(0,3)}`}</td></tr><tr><td class="day">${vals.finishDate == null ? `${vals.startDate.dayOfWeek}` : `${vals.startDate.dayOfWeek} - ${vals.finishDate.dayOfWeek}`}</td></tr></tbody></table></div><div class="details">${vals.imgURL !== null ? `<img src="${vals.imgURL}" alt="${vals.title}"></img>` : ``}<div class="text"><div class="title">${vals.title}</div>${vals.venue !== null ? `<div class="venue"><i class="far fa-building"></i> ${vals.venue}</div>` : ``}${vals.time !== null ? `<div class="time"><i class="far fa-clock"></i> ${vals.time}</div>` : `` }${vals.description !== null ? `<div class="description">${vals.description}</div>` : `` }</div></div></div>`
        },
    
        heroArticleHtml: (event) => {
    
            const finishDate = event.end_date_details.day !== event.start_date_details.day ? {
                day: event.end_date_details.day,
                month: months[parseInt(event.end_date_details.month) - 1]
            } : null;
    
            const startDate = {
                day: event.start_date_details.day,
                month: months[parseInt(event.start_date_details.month) - 1]
            };
            return `<article class="swiper-slide"><img src="${event.image.url}" alt="${event.title}"><div class="hero-title">${event.title}</div><br><div class="date">${finishDate == null ? `${startDate.day} ${startDate.month}` : `${startDate.day} ${startDate.month} - ${finishDate.day} ${finishDate.month}`}</div></article>`;
    
        },


        // writeHero: (featureEvents, heroText) => {

        //     DOM.heroTextWrapper.innerHTML = heroText;

        //     DOM.heroEventWrapper.innerHTML = '';
        //     featureEvents.forEach((event) => {
        //         DOM.heroEventWrapper.innerHTML += event;
        //     });

        // },

        // writeEvents: (events) => {

        //     DOM.eventWrapper.innerHTML = '';

        //     events.forEach((e) => {
        //         DOM.eventWrapper.innerHTML += templates.event(e)
        //     })
        // },

        // initHeroSwiper: (container) => {
        //     const swiper = new Swiper(container, {
        //         effect: 'fade',
        //         autoplay: {
        //             delay: 2000,
        //             disableOnInteraction: false
        //         },
        //         speed: 700,
        //         parallax: true
        //     });

        //     return swiper;
        // },

        // homepage: (featuredEvents) => {

        //     DOM.eventWrapper.innerHTML = '';
        //     DOM.heroEventWrapper.innerHTML = '';

        //     templates.hero(featuredEvents).articlesHTML.forEach((article) => {
        //         DOM.heroEventWrapper.innerHTML += article;
        //     });


        //     DOM.heroTextWrapper.innerHTML = `<h1 class="homepage-heading">What will you be doing in 2021?</h1>`;

        // },

        updateMonthText: (state, delay = 200) => {
            DOM.monthText.style.transition = `transform ${delay}ms ease-in-out`
            DOM.monthText.classList.add('spin');

            setTimeout(() => {
                DOM.monthText.innerHTML = state.currentMonth == 0 ? `<strong>2021</strong> | Jan  <i class="fas fa-angle-down"></i>` : `${months[state.currentMonth]}  <i class="fas fa-angle-down"></i>`;
                DOM.monthText.classList.remove('spin');
            }, delay);
        },

        toggleNavArrows: (state) => {

            if (state.currentMonth == 0) {
                DOM.nextMonthBtn.style.opacity = "1";
                DOM.prevMonthBtn.style.opacity = "0";
            } else if (state.currentMonth == 11) {
                DOM.nextMonthBtn.style.opacity = "0";
                DOM.prevMonthBtn.style.opacity = "1";
            } else {
                DOM.nextMonthBtn.style.opacity = "1";
                DOM.prevMonthBtn.style.opacity = "1";
            }
        },

        // showLoader: () => {
        //     DOM.loader.style.transition = "none";
        //     DOM.loader.style.opacity = "1";
        //     DOM.loader.style.display = "flex";
        // },

        // hideLoader: (fadeDelay = 250) => {
        //     DOM.loader.style.transition = `opacity ${fadeDelay}ms linear`
        //     DOM.loader.style.opacity = "0";
        //     setTimeout(() => {
        //         DOM.loader.style.display = "none";
        //     }, fadeDelay);

        // },

        // //delay set to 400ms in CSS
        // showDropdownMenu: () => {
        //     DOM.monthMenu.style.display = "grid";
        //     setTimeout(() => {
        //         DOM.monthMenu.classList.add('open');
        //         document.querySelector(DOM.monthArrowString).classList.add('open');
        //     }, 25)

        // },

        // //delay set to 400ms in CSS
        // hideDropdownMenu: () => {
        //     DOM.monthMenu.classList.remove('open');
        //     document.querySelector(DOM.monthArrowString).classList.remove('open');
        //     setTimeout(() => {
        //         DOM.monthMenu.style.display = "none";
        //     }, 400)
        // }


    }

})();


const controller = ((dataCtrl, UICtrl) => {

    const templates = UICtrl.templates;


    const updatePage = (state) => {

        if (state.currentMonth !== state.displayedMonth) {

            if (!state.monthsVisited.includes(state.currentMonth)) {
                UICtrl.showLoader();
            }

            if (state.currentMonth == 0) {
                UICtrl.homepage(dataCtrl.getAllFeatured(state.events));
                state.displayedMonth = 0;
                state.swiper.update();
                UICtrl.updateMonthText(state);
                UICtrl.toggleNavArrows(state);

                return;
            }

            const month = months[state.currentMonth];
            const monthEvents = state.events[month];
            const monthFeatured = dataCtrl.getMonthFeatured(monthEvents);
            const heroHTML = templates.hero(monthFeatured, month);

            UICtrl.writeHero(heroHTML.articlesHTML, heroHTML.heroText);

            if (!state.monthsVisited.includes(state.currentMonth)) {

                if (UICtrl.DOM.heroSwiperContainer.querySelector('img')) {
                    UICtrl.DOM.heroSwiperContainer.querySelector('img').addEventListener('load', () => {
                        UICtrl.hideLoader();
                    });
                } else {
                    UICtrl.hideLoader();
                }
                state.monthsVisited.push(state.currentMonth);
            }

            UICtrl.writeEvents(monthEvents);
            state.swiper.update();
            UICtrl.updateMonthText(state);
            UICtrl.toggleNavArrows(state);
            state.displayedMonth = state.currentMonth;
            dataCtrl.state.swiper.destroy();
            UICtrl.initHeroSwiper(UICtrl.DOM.heroSwiperContainer);

        }

    }

    const setupEventListeners = () => {
        UICtrl.DOM.prevMonthBtn.addEventListener('click', () => {

            if (dataCtrl.state.currentMonth > 0) {
                dataCtrl.state.currentMonth--;
                updatePage(dataCtrl.state)
            }
        });
        UICtrl.DOM.nextMonthBtn.addEventListener('click', () => {

            if (dataCtrl.state.currentMonth < 11) {
                dataCtrl.state.currentMonth++;
                updatePage(dataCtrl.state)
            }
        });
        UICtrl.DOM.monthText.addEventListener('click', () => {

            if (UICtrl.DOM.monthMenu.classList.contains('open')) {
                UICtrl.hideDropdownMenu();
            } else {
                UICtrl.showDropdownMenu();
            }

        });

        window.addEventListener('click', (e) => {

            if (UICtrl.DOM.monthMenu.classList.contains('open') && e.target.closest('a') !== UICtrl.DOM.monthText) {
                UICtrl.hideDropdownMenu();
            }
        });

        const monthMenuArr = Array.prototype.slice.call(document.querySelectorAll('.months-dropdown-menu .month'));


        UICtrl.DOM.monthMenu.addEventListener('click', (e) => {

            if (monthMenuArr.includes(e.target.closest('div.month'))) {
                dataCtrl.state.currentMonth = monthMenuArr.indexOf(e.target.closest('div.month'));



                console.log(dataCtrl.state.currentMonth);

                if (dataCtrl.state.currentMonth == 0) {
                    UICtrl.homepage(dataCtrl.getAllFeatured(dataCtrl.state.events));
                    UICtrl.updateMonthText(dataCtrl.state);
                    UICtrl.toggleNavArrows(dataCtrl.state);
                    dataCtrl.state.displayedMonth = dataCtrl.state.currentMonth;
                    dataCtrl.state.swiper.destroy();
                    UICtrl.initHeroSwiper(UICtrl.DOM.heroSwiperContainer);
                } else {
                    updatePage(dataCtrl.state)
                }


            }


        })
    }

    return {
        init: async() => {

            const calSwiper = new Swiper(document.querySelector('.calendar-swiper'));

            events = await dataCtrl.fetchEvents();

            dataCtrl.state.currentMonth = 0;
            dataCtrl.state.displayedMonth = 0;

            dataCtrl.state.monthsVisited = new Array();

            dataCtrl.state.monthsVisited.push(dataCtrl.state.currentMonth);

            const allEvents = await dataCtrl.fetchEvents();

            dataCtrl.state.events = dataCtrl.sortEvents(allEvents);

            const featureEvents = dataCtrl.getAllFeatured(dataCtrl.state.events);

            UICtrl.monthSlides.forEach((slide, i) => {

                const heroSlider = slide.querySelector('.hero-article-wrapper');
                const eventContainer = slide.querySelector('.event-wrapper');

                if (i == 0) { //homepage

                    featureEvents.forEach((event) => {
                        heroSlider.innerHTML += UICtrl.heroArticleHtml(event);
                    })

                } else { //calendar pages

                    const monthEvents = dataCtrl.state.events[months[i]];

                    const monthFeatured = dataCtrl.getMonthFeatured(monthEvents);

                    monthFeatured.forEach((event) => {
                        heroSlider.innerHTML += UICtrl.heroArticleHtml(event);
                    });

                    monthEvents.forEach((event) => {
                        eventContainer.innerHTML += UICtrl.eventHtml(event);
                    })

                    
                }

            })

            // const heroHTML = templates.hero(featureEvents, "2021");

            // UICtrl.writeHero(heroHTML.articlesHTML, heroHTML.heroText);

            // // hide loader once first hero image loads
            // UICtrl.DOM.heroSwiperContainer.querySelector('img').addEventListener('load', () => {
            //     UICtrl.hideLoader();
            // });

            // dataCtrl.state.swiper = UICtrl.initHeroSwiper(UICtrl.DOM.heroSwiperContainer);

            // setupEventListeners();

            // UICtrl.toggleNavArrows(dataCtrl.state);

        }
    }

})(dataController, UIController);

controller.init();