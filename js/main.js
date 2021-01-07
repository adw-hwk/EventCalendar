const dataController = (() => {

    const siteURL = 'http://eventcalendar.test';
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

        monthText: document.querySelector('header .month-text')
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
                    delay: 2500,
                },
                speed: 1000
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

        updateMonthText: (state, delay) => {
            DOM.monthText.style.transition = `transform ${delay}ms ease-in-out`
            DOM.monthText.classList.add('spin');

            setTimeout(() => {
                DOM.monthText.innerHTML = state.currentMonth == 0 ? `<strong>2021</strong>` : `${months[state.currentMonth].slice(0,3).toUpperCase()}`;
                DOM.monthText.classList.remove('spin');
            }, delay);
        },

        toggleNavArrows: (state) => {

            console.log(state.currentMonth);

            if (state.currentMonth == 0) {
                DOM.nextMonthBtn.style.visibility = "visible";
                DOM.prevMonthBtn.style.visibility = "hidden";
            } else if (state.currentMonth == 11) {
                DOM.nextMonthBtn.style.visibility = "hidden";
                DOM.prevMonthBtn.style.visibility = "visible";
            } else {
                DOM.nextMonthBtn.style.visibility = "visible";
                DOM.prevMonthBtn.style.visibility = "visible";
            }
        }
    }

})();


const controller = ((dataCtrl, UICtrl) => {

    const templates = UICtrl.templates;


    const updatePage = (state) => {

        if (state.currentMonth !== state.displayedMonth) {

            if (state.currentMonth == 0) {
                UICtrl.homepage(dataCtrl.getAllFeatured(state.events));
                dataCtrl.state.displayedMonth = 0;
                dataCtrl.state.swiper.update();
                UICtrl.updateMonthText(state, 250);
                UICtrl.toggleNavArrows(state);

                return;
            }

            const month = months[state.currentMonth];

            const monthEvents = state.events[month];

            const monthFeatured = dataCtrl.getMonthFeatured(monthEvents);

            const heroHTML = templates.hero(monthFeatured, month);

            UICtrl.writeHero(heroHTML.articlesHTML, heroHTML.heroText);

            UICtrl.writeEvents(monthEvents);

            dataCtrl.state.swiper.update();

            UICtrl.updateMonthText(state, 250);

            UICtrl.toggleNavArrows(state);

            state.displayedMonth = state.currentMonth;
        }

    }

    const setupEventListeners = () => {
        UICtrl.DOM.prevMonthBtn.addEventListener('click', () => {

            if (dataCtrl.state.currentMonth > 0) {
                dataCtrl.state.currentMonth--;
                updatePage(dataCtrl.state)
                console.log(dataCtrl.state)
            }
        });
        UICtrl.DOM.nextMonthBtn.addEventListener('click', () => {

            if (dataCtrl.state.currentMonth < 11) {
                dataCtrl.state.currentMonth++;
                updatePage(dataCtrl.state)
                console.log(dataCtrl.state)

            }
        })
    }

    return {
        init: async() => {

            dataCtrl.state.currentMonth = 0;
            dataCtrl.state.displayedMonth = 0;

            const events = await dataCtrl.fetchEvents();

            dataCtrl.state.events = dataCtrl.sortEvents(events);

            const featureEvents = dataCtrl.getAllFeatured(dataCtrl.state.events);

            const heroHTML = templates.hero(featureEvents, "2021");

            UICtrl.writeHero(heroHTML.articlesHTML, heroHTML.heroText);

            dataCtrl.state.swiper = UICtrl.initHeroSwiper(UICtrl.DOM.heroSwiperContainer);

            setupEventListeners();

            UICtrl.toggleNavArrows(dataCtrl.state);

        }
    }

})(dataController, UIController);

controller.init();