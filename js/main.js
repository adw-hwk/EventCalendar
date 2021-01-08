const dataController = (() => {

    const siteURL = 'http://52.64.100.106';
    const endpoint = '/wp-json/tribe/events/v1/events';
    const query = '?page=1&per_page=1000&start_date=2021-01-01 00:00:00&end_date=2022-01-01 00:00:00';

    let state = {};

    return {
        state: state,

        fetchEvents: async() => {

            const timeStart = new Date().getTime();

            const events = await fetch(siteURL + endpoint + query)
                .then((response) => {
                    return response.json();
                })
                .catch(() => {
                    alert('Error fetching calendar  :(');
                });

            const timeEnd = new Date().getTime();


            console.log(`Fetch took ${(timeEnd - timeStart)}ms.`);

            return events;

        },

        sortEvents: (allEvents) => {

            let events = {};

            months.forEach((month, index) => {
                allEvents.events.forEach((e) => {
                    if (parseInt(e.start_date_details.month) == index + 1) {

                        // initialise month event array
                        if (!events[month]) {
                            events[month] = new Array();
                        }

                        events[month].push(e);
                    }
                })
            });

            return events;
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

        content: document.querySelector('.page-content')
    }

    const templates = __DOM_templates;


    return {
        DOM: DOM,

        templates: templates,

        writeHero: (featureEvents, heroText) => {

            DOM.heroTextWrapper.innerHTML = heroText;

            DOM.heroEventWrapper.innerHTML = '';
            featureEvents.forEach((event) => {
                DOM.heroEventWrapper.innerHTML += event;
            });

        },

        writeEvents: (events) => {

            DOM.eventWrapper.innerHTML = '';

            events.forEach((e) => {
                DOM.eventWrapper.innerHTML += templates.event(e)
            })
        },

        initHeroSwiper: (container) => {
            const swiper = new Swiper(container, {
                effect: 'fade',
                autoplay: {
                    delay: 2000,
                    disableOnInteraction: false
                },
                speed: 700,
                parallax: true
            });

            return swiper;
        },

        homepage: (featuredEvents) => {

            DOM.eventWrapper.innerHTML = '';
            DOM.heroEventWrapper.innerHTML = '';

            templates.hero(featuredEvents).articlesHTML.forEach((article) => {
                DOM.heroEventWrapper.innerHTML += article;
            });


            DOM.heroTextWrapper.innerHTML = `<h1 class="homepage-heading">What will you be doing in 2021?</h1>`;

        },

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

        showLoader: () => {
            DOM.loader.style.transition = "none";
            DOM.loader.style.opacity = "1";
            DOM.loader.style.display = "flex";
        },

        hideLoader: (fadeDelay = 250) => {
            DOM.loader.style.transition = `opacity ${fadeDelay}ms linear`
            DOM.loader.style.opacity = "0";
            setTimeout(() => {
                DOM.loader.style.display = "none";
            }, fadeDelay);

        },

        //delay set to 400ms in CSS
        showDropdownMenu: () => {
            DOM.monthMenu.style.display = "grid";
            setTimeout(() => {
                DOM.monthMenu.classList.add('open');
                document.querySelector(DOM.monthArrowString).classList.add('open');
                DOM.content.classList.add('menu-open');
            }, 25)

        },

        //delay set to 400ms in CSS
        hideDropdownMenu: () => {
            DOM.monthMenu.classList.remove('open');
            document.querySelector(DOM.monthArrowString).classList.remove('open');
            DOM.content.classList.remove('menu-open');
            setTimeout(() => {
                DOM.monthMenu.style.display = "none";
            }, 400)
        }


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

            UICtrl.showLoader();

            dataCtrl.state.currentMonth = 0;
            dataCtrl.state.displayedMonth = 0;

            dataCtrl.state.monthsVisited = new Array();

            dataCtrl.state.monthsVisited.push(dataCtrl.state.currentMonth);

            const events = await dataCtrl.fetchEvents();

            dataCtrl.state.events = dataCtrl.sortEvents(events);

            const featureEvents = dataCtrl.getAllFeatured(dataCtrl.state.events);

            const heroHTML = templates.hero(featureEvents, "2021");

            UICtrl.writeHero(heroHTML.articlesHTML, heroHTML.heroText);

            // hide loader once first hero image loads
            UICtrl.DOM.heroSwiperContainer.querySelector('img').addEventListener('load', () => {
                UICtrl.hideLoader();
            });

            dataCtrl.state.swiper = UICtrl.initHeroSwiper(UICtrl.DOM.heroSwiperContainer);

            setupEventListeners();

            UICtrl.toggleNavArrows(dataCtrl.state);

            // UICtrl.DOM.heroSwiperContainer.addEventListener('load', () => {
            //     UICtrl.hideLoader();
            // });
            // UICtrl.hideLoader();


        }
    }

})(dataController, UIController);

controller.init();