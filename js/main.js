window.addEventListener('load', () => {

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

                const siteURL = window.location.href;
                const endpoint = 'wp-json/tribe/events/v1/events';
                const query = '?page=1&per_page=100&start_date=2021-01-01 00:00:00&end_date=2022-01-01 00:00:00';

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
                    },

                    getHomepageFeatured: (events) => {

                        let featuredArr = [];
                        monthKeys = Object.keys(events);

                        monthKeys.forEach((month) => {
                            events[month].forEach((e) => {
                                e.categories.forEach((category) => {
                                    if (category.slug === "homepage") {
                                        featuredArr.push(e);
                                    }
                                })
                            })
                        });

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

                            monthSlides: Array.prototype.slice.call(document.querySelectorAll('.calendar-swiper .calendar-slide')),

                            calendarButton: document.querySelector('.show-months-btn'),

                        }

                        const DOMStrings = {
                            monthNavs: {
                                next: '#next-month-nav',
                                prev: '#prev-month-nav'
                            }
                        }

                        return {
                            DOM: DOM,

                            DOMStrings: DOMStrings,

                            eventHtml: (event) => {

                                    const startDateObj = new Date(event.start_date);
                                    const startWeekday = startDateObj.getDay();
                                    const endDateObj = new Date(event.end_date);
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

                                    const categories = event.categories ? event.categories : undefined;

                                    let mainType = 'minor';

                                    if (categories !== undefined) {

                                        categories.forEach((category) => {
                                            if (['major', 'minor', 'seasonal'].includes(category.slug)) {
                                                mainType = category.slug;
                                            }
                                        })

                                    }


                                    let vals = {
                                        type: mainType,

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

                                    return `<div class="event ${vals.type ? vals.type : 'minor'}"><div class="date"><table><tbody><tr><td class="ddmm">${vals.finishDate == null ? `${vals.startDate.day} ${vals.startDate.month.slice(0,3)}` : `${vals.startDate.day} ${vals.startDate.month.slice(0,3)} - ${vals.finishDate.day} ${vals.finishDate.month.slice(0,3)}`}</td></tr><tr><td class="day">${vals.finishDate == null ? `${vals.startDate.dayOfWeek}` : `${vals.startDate.dayOfWeek} - ${vals.finishDate.dayOfWeek}`}</td></tr></tbody></table></div><div class="details">${vals.imgURL !== null ? `<img data-src="${vals.imgURL}" alt="${vals.title}">` : ``}<div class="text"><div class="title">${vals.title}</div>${vals.venue !== null ? `<div class="venue"><i class="far fa-building"></i> ${vals.venue}</div>` : ``}${vals.time !== null ? `<div class="time"><i class="far fa-clock"></i> ${vals.time}</div>` : `` }${vals.description !== null ? `<div class="description">${vals.description}</div>` : `` }</div></div></div>`
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
                        return `<article class="swiper-slide">${event.image ? `<img data-src="${event.image.url}" alt="${event.title}">` : ``}<div class="hero-title">${event.title}</div><br><div class="date">${finishDate == null ? `${startDate.day} ${startDate.month}` : `${startDate.day} ${startDate.month} - ${finishDate.day} ${finishDate.month}`}</div></article>`;
                
                    },
    
                    empty: () => {
                        return`Such empty!`;
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
    

    
            hideLoader: (slide, fadeDelay = 250) => {

                const loader = slide.querySelector('.cal-loader');

                loader.style.transition = `opacity ${fadeDelay}ms ease-in-out`;
 
                loader.classList.add('fade');
                slide.classList.remove('blur')
                setTimeout(() => {
                    loader.classList.add('hidden');
                }, fadeDelay)

                console.log(loader);
                console.log('hidden loader for ', slide);
    
            },
    
            showDropdownMenu: () => {
                DOM.monthMenu.style.display = "grid";
                setTimeout(() => {
                    DOM.monthMenu.classList.add('open');
                }, 25)
                DOM.monthSlides.forEach((slide) => {
                    slide.classList.add('blur');
                });
            },
    
            //delay set to 400ms in CSS
            hideDropdownMenu: () => {
                DOM.monthMenu.classList.remove('open');
                setTimeout(() => {
                    DOM.monthMenu.style.display = "none";
                }, 400);
                DOM.monthSlides.forEach((slide) => {
                    slide.classList.remove('blur');
                });
            }
    
    
        }
    
    })();
    
    
    const controller = ((dataCtrl, UICtrl) => {
    

        const setImgSrc = (image) => {
            image.src = image.dataset.src;
        }
    
        const setupEventListeners = () => {
    
    
    
            window.addEventListener('click', (e) => {
    
                if (UICtrl.DOM.monthMenu.classList.contains('open') && e.target.closest('a') !== UICtrl.DOM.calendarButton) {
                    UICtrl.hideDropdownMenu();
                }
            });
    
            const monthMenuArr = Array.prototype.slice.call(document.querySelectorAll('.months-dropdown-menu .month'));
    
    
            UICtrl.DOM.monthMenu.addEventListener('click', (e) => {
    
                if (monthMenuArr.includes(e.target.closest('div.month'))) {
                    dataCtrl.state.calendarSwiper.slideTo(monthMenuArr.indexOf(e.target.closest('div.month')), 0);
                }
    
    
            });
    
            UICtrl.DOM.calendarButton.addEventListener('click', () => {
                if (UICtrl.DOM.monthMenu.classList.contains('open')) {
                    UICtrl.hideDropdownMenu();
                } else {
                    UICtrl.showDropdownMenu();
                }
            })
        }
    
        return {
            init: async() => {

                dataCtrl.state.currentMonth = 0;
    
                dataCtrl.state.monthsVisited = new Array();
        
            
                const allEvents = await dataCtrl.fetchEvents();
        
                dataCtrl.state.events = dataCtrl.sortEvents(allEvents);
    
                const homepageEvents = dataCtrl.getHomepageFeatured(dataCtrl.state.events)
        
                UICtrl.DOM.monthSlides.forEach((slide, i) => {
    
                    const heroSliderContainer = slide.querySelector('.hero-swiper-container');
                    const heroSliderWrapper = slide.querySelector('.hero-article-wrapper');
                    const eventContainer = slide.querySelector('.event-wrapper');
    
                    if (i == 0) { //homepage
    
                        homepageEvents.forEach((event) => {
                            heroSliderWrapper.innerHTML += UICtrl.heroArticleHtml(event);
                        });

                        new Swiper(heroSliderContainer, {
                            autoplay: {
                                delay: 2000,
                            },
                            speed: 750,
                            effect: 'fade',
                            fadeEffect: {
                                crossFade: true
                            },
                        });
    
                    } else { //calendar pages
    
                        const monthEvents = dataCtrl.state.events[months[i]];
    
                        if (monthEvents !== undefined) {
                            const monthFeatured = dataCtrl.getMonthFeatured(monthEvents);
        
                            monthFeatured.forEach((event) => {
                                heroSliderWrapper.innerHTML += UICtrl.heroArticleHtml(event);
                            });

                            new Swiper(heroSliderContainer, {
                                autoplay: {
                                    delay: 2000,
                                },
                                speed: 750,
                                effect: 'fade',
                                fadeEffect: {
                                    crossFade: true
                                },
                            });
        
                            monthEvents.forEach((event) => {
                                eventContainer.innerHTML += UICtrl.eventHtml(event);
                            });
                        } else {
                            eventContainer.innerHTML = UICtrl.empty();
                        }
    
    
    
                        
                    }
    
                });

                const monthTextSwiper = new Swiper(document.querySelector('.month-text-container'), {
                    slidesPerView: 1,
                    freeMode: false,
                    watchSlidesVisibility: true,
                    watchSlidesProgress: true,
                    allowTouchMove: false,
                    speed: 400,
                  });
    
                dataCtrl.state.monthTextSwiper = monthTextSwiper;
    
                const calendarSwiper = new Swiper(document.querySelector('.calendar-swiper'), {
                    navigation: {
                        nextEl: document.querySelector(UICtrl.DOMStrings.monthNavs.next),
                        prevEl: document.querySelector(UICtrl.DOMStrings.monthNavs.prev),
                      },
                      thumbs: {
                        swiper: monthTextSwiper
                      },
                      speed: 400,
                      on: {
                          init: () => {

                            const slide = UICtrl.DOM.monthSlides[0]
                            const images = slide.querySelectorAll('img');

                            if (images.length > 0) {
                            // convert img data-src to src
                                images.forEach((img) => {
                                    setImgSrc(img);
                                })
                            // add load event listener to hero slider
                                images[0].addEventListener('load', () => {
                                    UICtrl.hideLoader(slide);
                                })
                            } else {
                                UICtrl.hideLoader(slide);
                            }

                            dataCtrl.state.monthsVisited.push(0);

                            console.log(dataCtrl.state.monthsVisited);

                          },
                          slideChange: function() {


                              if (!dataCtrl.state.monthsVisited.includes(this.activeIndex)) {
                                  const slide = UICtrl.DOM.monthSlides[this.activeIndex];
                                  const images = slide.querySelectorAll('img');

                                  console.log(images);

                                  if (images.length > 0) {

                                    console.log(images);
                                  // convert img data-src to src
                                    images.forEach((img) => {
                                        setImgSrc(img);
                                    })
                                  // add load event listener to hero slider
                                    images[0].addEventListener('load', () => {
                                        UICtrl.hideLoader(slide)
                                    })
                                  } else {
                                    UICtrl.hideLoader(slide);
                                  }

                                  dataCtrl.state.monthsVisited.push(this.activeIndex);

                              }
                          },
                          
                      }
                });
    
                dataCtrl.state.calendarSwiper = calendarSwiper;
    
                // const heroHTML = templates.hero(featureEvents, "2021");
    
                // UICtrl.writeHero(heroHTML.articlesHTML, heroHTML.heroText);
    
                // // hide loader once first hero image loads
                // UICtrl.DOM.heroSwiperContainer.querySelector('img').addEventListener('load', () => {
                //     UICtrl.hideLoader();
                // });
    
                // dataCtrl.state.swiper = UICtrl.initHeroSwiper(UICtrl.DOM.heroSwiperContainer);
    
                setupEventListeners();
    
                // UICtrl.toggleNavArrows(dataCtrl.state);
    
            }
        }
    
    })(dataController, UIController);
    
    controller.init();

})