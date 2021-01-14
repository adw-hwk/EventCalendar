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
                            pageWrapper: document.querySelector('#page-wrapper'),
                            calendarSwiper: document.querySelector('.calendar-swiper'),
                            heroSwiperContainer: document.querySelector('.hero-swiper-container'),
                            heroEventWrapper: document.querySelector('.hero-article-wrapper'),
                            heroTextWrapper: document.querySelector('.hero-text-wrapper'),
                            eventWrapper: document.querySelector('.event-wrapper'),

                            prevMonthBtn: document.querySelector('#prev-month-nav'),
                            nextMonthBtn: document.querySelector('#next-month-nav'),

                            monthText: document.querySelector('header .month-text'),
                            monthArrowString: '.month-text i',
                            monthMenu: document.querySelector('.months-dropdown-menu'),
                            dropdownMonthArr: Array.prototype.slice.call(document.querySelector('.months-dropdown-menu').querySelectorAll('.month')),
                            menuElements: [document.querySelector('header .month-text'), document.querySelector('.month-text strong'), document.querySelector('.month-text i')],

                            loader: document.querySelector('#page-wrapper .cal-loader'),

                            monthSlides: Array.prototype.slice.call(document.querySelectorAll('.calendar-swiper .calendar-slide')),

                            calendarButton: document.querySelector('.show-months-btn'),

                            homeCTA: document.querySelector('a.home-cta'),

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

                                    return `<div class="event ${vals.type ? vals.type : 'minor'}"><div class="date"><table><tbody><tr><td class="ddmm">${vals.finishDate == null ? `${vals.startDate.day} ${vals.startDate.month.slice(0,3)}` : `${vals.startDate.day} ${vals.startDate.month.slice(0,3)} - ${vals.finishDate.day} ${vals.finishDate.month.slice(0,3)}`}</td></tr><tr><td class="day">${vals.finishDate == null ? `${vals.startDate.dayOfWeek}` : `${vals.startDate.dayOfWeek} - ${vals.finishDate.dayOfWeek}`}</td></tr></tbody></table></div><div class="details">${vals.imgURL !== null ? `<img class="event-image" data-src="${vals.imgURL}" alt="${vals.title}">` : ``}<div class="text"><div class="title">${vals.title}</div>${vals.venue !== null ? `<div class="venue"><i class="far fa-building"></i> ${vals.venue}</div>` : ``}${vals.time !== null ? `<div class="time"><i class="far fa-clock"></i> ${vals.time}</div>` : `` }${vals.description !== null ? `<div class="description">${vals.description}</div>` : `` }</div></div></div>`
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
                        return `<article class="swiper-slide">${event.image ? `<img class="swiper-image" data-src="${event.image.url}" alt="${event.title}">` : ``}<div class="hero-title">${event.title}</div><br><div class="date">${finishDate == null ? `${startDate.day} ${startDate.month}` : `${startDate.day} ${startDate.month} - ${finishDate.day} ${finishDate.month}`}</div></article>`;
                
                    },
    
                    empty: () => {
                        return`Such empty!`;
                    },

                    updateMonthText: (state, delay = 200) => {
                        DOM.monthText.style.transition = `transform ${delay}ms ease-in-out`
                        DOM.monthText.classList.add('spin');
            
                        setTimeout(() => {
                            DOM.monthText.innerHTML = state.currentMonth == 0 ? `<strong>2021</strong> | Jan  <i class="fas fa-angle-down"></i>` : `${months[state.currentMonth]}  <i class="fas fa-angle-down"></i>`;
                            DOM.monthText.classList.remove('spin');
                        }, delay);
                    },
            
                    toggleNavArrows: (currentMonth) => {
            
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
            
                    hideLoader: (fadeDelay = 250) => {

                        DOM.loader.style.transition = `opacity ${fadeDelay}ms ease-in-out`;
                        DOM.calendarSwiper.style.transition = `filter ${fadeDelay}ms ease-in-out`;
        
                        DOM.loader.classList.add('fade');
                        DOM.calendarSwiper.classList.remove('blur')
                        setTimeout(() => {
                            DOM.loader.classList.add('hidden');
                        }, fadeDelay)
            
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
                    },

                    getAllImages: () => {
                        return Array.prototype.slice.call(document.images);
                    },

                    sortImages: (images) => {
                        let sortedImages = {};

                        DOM.monthSlides.forEach((slide, i) => {
                            images.forEach((image) => {
                                if (image.closest('.calendar-slide') === slide) {
                                    
                                    // initialise month array
                                    if (sortedImages[months[i]] === undefined) {
                                        sortedImages[months[i]] = new Array();
                                    }

                                    if (image.classList.contains('swiper-image')) {

                                        if (sortedImages[months[i]].swiper === undefined) {
                                            sortedImages[months[i]].swiper = new Array();
                                        }

                                        sortedImages[months[i]].swiper.push(image)

                                    } else if (image.classList.contains('hero-bg-image')) {

                                        sortedImages[months[i]].heroBG = image;

                                    } else {

                                        if (sortedImages[months[i]].events === undefined) {
                                            sortedImages[months[i]].events = new Array();
                                        }

                                        sortedImages[months[i]].events.push(image)

                                    }

                                }
                            });
                        });

                        return sortedImages;
                    },

                    setActiveMenuMonth: (currentMonth) => {
                        DOM.dropdownMonthArr.forEach((month) => {
                            if (month.classList.contains('active')) {
                                month.classList.remove('active');
                            }
                        });

                        DOM.dropdownMonthArr[currentMonth].classList.add('active');
                    }


}

})();


const controller = ((dataCtrl, UICtrl) => {


const setImgSrc = (image) => {
    if (!image.src && image.dataset.src.length > 0) {
        image.src = image.dataset.src;
    }
}

const setupEventListeners = () => {



    window.addEventListener('click', (e) => {

        if (UICtrl.DOM.monthMenu.classList.contains('open') && e.target.closest('a') !== UICtrl.DOM.calendarButton) {
            UICtrl.hideDropdownMenu();
        }
    });

    window.addEventListener('click', (e) => {
        if(e.target.closest('div.scroll-prompt')) {
            UICtrl.DOM.monthSlides[dataCtrl.state.currentMonth].querySelector('.event-wrapper').scrollIntoView();
        }
    })

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
    });

    UICtrl.DOM.homeCTA.addEventListener('click', () => {
        dataCtrl.state.calendarSwiper.slideNext();
    });

    UICtrl.DOM.monthSlides.forEach((slide) => {
        const prompt = slide.querySelector('.scroll-prompt');
        const hero = slide.querySelector('.hero-wrapper');
        slide.addEventListener('scroll', () => {

            // with header height set to 5rem in CSS, the top value when fully scrolled to the top of the container is 80
            const heroRect = hero.getBoundingClientRect();

            const heroTop = heroRect.top;
            const heroHeight = heroRect.height;

            // what the below does is set the opacity to 0 as you scroll
            // the assignment directly below sets opacity to 0 by the time you
            // get to 1/10 way down the hero section (heroHeight / 10)
            let opacity = 1 - ((80 - heroTop) / (heroHeight / 10));

            opacity = opacity >= 0 ? opacity : 0 ;

            prompt.style.opacity = opacity.toString();

        })
    })
}

return {
    init: async() => {

        dataCtrl.state.currentMonth = 0;

        dataCtrl.state.monthsVisited = new Array();

    
        const allEvents = await dataCtrl.fetchEvents();

        dataCtrl.state.events = dataCtrl.sortEvents(allEvents);

        console.log(dataCtrl.state.events);

        const homepageEvents = dataCtrl.getHomepageFeatured(dataCtrl.state.events)

        // writing the DOM
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

        dataCtrl.state.images = UICtrl.sortImages(UICtrl.getAllImages());

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
                  init: function() {

                    const slide = UICtrl.DOM.monthSlides[this.activeIndex];

                    Array.prototype.slice.call(slide.querySelectorAll('img')).forEach((image) => {

                        setImgSrc(image);

                    });

                    UICtrl.setActiveMenuMonth(dataCtrl.state.currentMonth);
                    
                    UICtrl.toggleNavArrows(dataCtrl.state.currentMonth);

                    dataCtrl.state.monthsVisited.push(this.activeIndex);




                  },
                  slideChange: function() {


                      if (!dataCtrl.state.monthsVisited.includes(this.activeIndex)) {

                        const slide = UICtrl.DOM.monthSlides[this.activeIndex];

                        Array.prototype.slice.call(slide.querySelectorAll('img')).forEach((image) => {

                            setImgSrc(image);

                        })
                        

                        dataCtrl.state.monthsVisited.push(this.activeIndex);

                      }
                      dataCtrl.state.currentMonth = this.activeIndex;

                      UICtrl.setActiveMenuMonth(dataCtrl.state.currentMonth);

                      UICtrl.toggleNavArrows(dataCtrl.state.currentMonth);

                  },
                  
              }
        });

        dataCtrl.state.calendarSwiper = calendarSwiper;


        setupEventListeners();

        UICtrl.hideLoader();

    }
}

})(dataController, UIController);

controller.init();

})