window.addEventListener("load", () => {
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
                "December",
            ];

            const dataController = (() => {
                let state = {};

                return {
                    state: state,

                    getAllFeatured: (events) => {
                        let featuredArr = [];
                        monthKeys = Object.keys(events);

                        monthKeys.forEach((month) => {
                            events[month].forEach((e) => {
                                if (e.featured) {
                                    featuredArr.push(e);
                                }
                            });
                        });

                        return featuredArr;
                    },

                    getMonthFeatured: (events) => {
                        let featuredArr = [];

                        events.forEach((e) => {
                            if (e.featured) {
                                featuredArr.push(e);
                            }
                        });

                        return featuredArr;
                    },

                    getHomepageFeatured: (events) => {
                        let featuredArr = [];
                        monthKeys = Object.keys(events);

                        monthKeys.forEach((month) => {
                            events[month].forEach((e) => {
                                if (e.tags !== null) {
                                    e.tags.forEach((tag) => {
                                        if (tag === "homepage") {
                                            featuredArr.push(e);
                                        }
                                    });
                                }
                            });
                        });

                        return featuredArr;
                    },

                    getFeatured: (events) => {
                        let featuredArr = [];
                        monthKeys = Object.keys(events);

                        monthKeys.forEach((month) => {
                            events[month].forEach((e) => {
                                if (e.featured) {
                                    featuredArr.push(e);
                                }
                            });
                        });

                        return featuredArr;
                    },
                };
            })();

            const UIController = (() => {
                        const days = [
                            "Sunday",
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                        ];

                        const DOM = {
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
                                document.querySelector(".month-text i"),
                            ],

                            loader: document.querySelector("#page-wrapper .cal-loader"),

                            monthSlides: Array.prototype.slice.call(
                                document.querySelectorAll(".calendar-swiper .calendar-slide")
                            ),

                            calendarButton: document.querySelector(".show-months-btn"),

                            calendarGrids: Array.prototype.slice.call(
                                document.querySelectorAll(".calendar .grid")
                            ),

                            eventModalWrapper: document.querySelector(".event-modal-wrapper"),

                            eventModalContents: document.querySelector(".event-modal .inner"),

                            eventModalClose: document.querySelector(".event-modal .close-btn"),
                        };

                        const DOMStrings = {
                            monthNavs: {
                                next: "#next-month-nav",
                                prev: "#prev-month-nav",
                            },

                            fadeEls: ".fade-in",
                        };

                        const getEventClass = (event) => {
                            const isConvention = event.tags !== null && event.tags.includes("convention") ? true : false;
                            const isCommercial = event.tags !== null && event.tags.includes("commercial") ? true : false;

                            let eventClass;

                            if (isCommercial) {
                                eventClass = 'commercial';
                            } else if (isConvention) {
                                eventClass = 'convention';
                            } else {
                                eventClass = event.type;
                            }

                            return eventClass;
                        };

                        return {
                            DOM: DOM,

                            DOMStrings: DOMStrings,

                            getWindowWidth: () => {
                                return document.body.getBoundingClientRect().width;
                            },

                            eventHtml: (event) => {
                                    const startDateObj = new Date(event.start_date.UTC);
                                    const startWeekday = startDateObj.getDay();
                                    const endDateObj = new Date(event.end_date.UTC);
                                    const endWeekday = endDateObj.getDay();

                                    const categories = event.categories ? event.categories : undefined;

                                    let mainType = "minor";

                                    if (categories !== undefined) {
                                        categories.forEach((category) => {
                                            if (["major", "minor", "seasonal"].includes(category.slug)) {
                                                mainType = category.slug;
                                            }
                                        });
                                    }

                                    let vals = {
                                        type: event.type,

                                        finishDate: !(
                                            event.end_date.month == event.start_date.month &&
                                            event.end_date.day == event.start_date.day
                                        ) ? {
                                            day: event.end_date.day,
                                            month: event.end_date.month,
                                            dayOfWeek: days[endWeekday],
                                        } : null,

                                        startDate: {
                                            day: event.start_date.day,
                                            month: event.start_date.month,
                                            dayOfWeek: days[startWeekday],
                                        },

                                        imgURL: event.image ? event.image.large : null,

                                        title: event.title,

                                        venue: event.venue ? event.venue.name : null,

                                        time: !event.all_day ?
                                            `${event.start_date.hour}:${event.start_date.minute} - ${event.end_date.hour}:${event.end_date.minutes}` : null,

                                        description: event.description.length > 0 ? event.description : null,
                                    };

                                    return `<div class="event ${
          vals.type ? vals.type : "minor"
        }"><div class="date"><table><tbody><tr><td class="ddmm">${
          vals.finishDate == null
            ? `${vals.startDate.day} ${months[vals.startDate.month - 1].slice(
                0,
                3
              )}`
            : `${vals.startDate.day} ${months[vals.startDate.month - 1].slice(
                0,
                3
              )} - ${vals.finishDate.day} ${months[
                vals.finishDate.month - 1
              ].slice(0, 3)}`
        }</td></tr><tr><td class="day">${
          vals.finishDate == null
            ? `${vals.startDate.dayOfWeek}`
            : `${vals.startDate.dayOfWeek} - ${vals.finishDate.dayOfWeek}`
        }</td></tr></tbody></table></div><div class="details">${
          vals.imgURL !== null
            ? `<img class="event-image" data-src="${vals.imgURL}" alt="${vals.title}">`
            : ``
        }<div class="text"><div class="title">${vals.title}</div>${
          vals.venue !== null
            ? `<div class="venue"><i class="far fa-building"></i> ${vals.venue}</div>`
            : ``
        }${
          vals.time !== null
            ? `<div class="time"><i class="far fa-clock"></i> ${vals.time}</div>`
            : ``
        }${
          vals.description !== null
            ? `<div class="description">${vals.description}</div>`
            : ``
        }</div></div></div>`;
      },

      heroArticleHtml: (event) => {
        const finishDate =
          event.end_date.day !== event.start_date.day
            ? {
                day: event.end_date.day,
                month: months[event.end_date.month - 1],
              }
            : null;

        const startDate = {
          day: event.start_date.day,
          month: months[event.end_date.month - 1],
        };

        return `<article class="swiper-slide">${
          event.image
            ? `<img class="swiper-image" data-src="${event.image.full}" alt="${event.title}">`
            : ``
        }<div class="hero-title">${event.title}</div><br><div class="date">${
          finishDate == null
            ? `${startDate.day} ${startDate.month}`
            : `${startDate.day} ${startDate.month} - ${finishDate.day} ${finishDate.month}`
        }</div></article>`;
      },

      empty: () => {
        return `Such empty!`;
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

        DOM.loader.classList.add("fade");
        DOM.calendarSwiper.classList.remove("blur");
        setTimeout(() => {
          DOM.loader.classList.add("hidden");
        }, fadeDelay);
      },

      showDropdownMenu: () => {
        DOM.monthMenu.style.display = "grid";
        DOM.calendarButton.classList.add("is-active");
        setTimeout(() => {
          DOM.monthMenu.classList.add("open");
        }, 25);
        DOM.monthSlides.forEach((slide) => {
          slide.classList.add("blur");
        });
      },

      //delay set to 400ms in CSS
      hideDropdownMenu: (delay = 400) => {
        DOM.calendarButton.classList.remove("is-active");
        DOM.monthMenu.classList.remove("open");
        setTimeout(() => {
          DOM.monthMenu.style.display = "none";
        }, delay);
        DOM.monthSlides.forEach((slide) => {
          slide.classList.remove("blur");
        });
      },

      getAllImages: () => {
        return Array.prototype.slice.call(document.images);
      },

      sortImages: (images) => {
        let sortedImages = {};

        DOM.monthSlides.forEach((slide, i) => {
          images.forEach((image) => {
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

      setActiveMenuMonth: (currentMonth) => {
        DOM.dropdownMonthArr.forEach((month) => {
          if (month.classList.contains("active")) {
            month.classList.remove("active");
          }
        });

        DOM.dropdownMonthArr[currentMonth].classList.add("active");
      },



      writeCalendarGrid: (month, events) => {
        const getDaysInMonth = (monthNum, year) => {
          return new Date(year, monthNum, 0).getDate();
        };

        const writeDaysEvents = (day, events) => {
          let eventList = "";

          events.forEach((event) => {

            const eventClass = getEventClass(event);

            if (
              event.start_date.day == day ||
              (event.end_date.day >= day && event.start_date.day < day)
            ) {
              eventList += `<div class="day-event ${eventClass}" data-event-id="${event.ID}">${
                event.type === "seasonal" ? `` : `<div class="color-bar"></div>`
              }<span>${event.title}</span></div>`;
            }
          });

          return eventList;
        };

        const year = new Date().getFullYear();

        const daysInMonth = getDaysInMonth(month, year);

        const monthString = month < 10 ? `0${month}` : `${month}`;

        const dayOne = new Date(`${year}-${monthString}-01`);
        const dayOneIndex = dayOne.getDay();

        let squares = 0;

        let HTML = "";

        const innactiveSquare = (curMonth, steps, placement = "before") => {
          const daysInPrevMonth = getDaysInMonth(curMonth - 1, year);

          let day;

          if (placement === "after") {
            day = steps + 1;
          } else if (placement === "before") {
            day = daysInPrevMonth + steps - dayOneIndex + 1;
          } else {
            day = "";
          }

          return `<div class="day-square innactive"><div class="banner">${day}</div><div class="contents"></div></div>`;
        };

        const daySquare = (day, eventList) => {
          return `<div class="day-square${
            eventList.length > 0 ? "" : " no-events"
          }" data-day="${day}"><div class="banner${
            [0, 6].includes(squares % 7) ? " weekend" : ""
          }">${day}<span class="mbl-weekday-text">&nbsp;|&nbsp;${days[
            squares % 7
          ].slice(
            0,
            3
          )}</span></div><div class="contents">${eventList}</div></div>`;
        };

        for (let i = 0; i < dayOneIndex; i++) {
          HTML += innactiveSquare(month, i, "before");
          squares++;
        }

        for (let i = 0; i < daysInMonth; i++) {
          HTML += daySquare(i + 1, writeDaysEvents(i + 1, events));
          squares++;
        }

        let nextMonthSquare = 0;

        while (squares % 7 !== 0) {
          HTML += innactiveSquare(month, nextMonthSquare, "after");
          nextMonthSquare++;
          squares++;
        }

        return HTML;
      },

      writeEventSummary: (events) => {
        let summaryHTML = {
          major: "",
          training: "",
          seasonal: "",
        };

        let trainingDisplayed = [];
        let trainingType = "general";
        let conventionEvent;
        let conventionOn = false;

        events.forEach((event) => {
          let isConvention = false;

          const tags = event.tags;

          let classStr = "";

          let trainingSkip = false;

          const trainingText = {
            pm: "PM Training",
            sales: "Sales Training",
            commercial: "Commercial Training",
            general: event.title,
          };

          if (tags !== null && tags.length > 0) {
            tags.forEach((tag) => {
              classStr += `${tag} `;

              if (["pm", "sales", "commercial", "general"].includes(tag)) {
                trainingType = tag;
              }

              if (tag === "convention") {
                isConvention = true;
                conventionOn = true;

                conventionEvent = event;
              }

              if (trainingDisplayed.includes(tag) && tag !== "general") {
                trainingSkip = true;
              } else {
                trainingDisplayed.push(tag);
              }
            });
          }

          if (event.type === "major") {
            if (
              !summaryHTML.major.toUpperCase().includes("YOUNG ACHIEVER") &&
              event.title.toUpperCase().includes("YOUNG ACHIEVER")
            ) {
              summaryHTML.major += `<div class="list-event ${classStr}">Young Achiever Awards</div>`;
            } else if (
              !event.title.toUpperCase().includes("YOUNG ACHIEVER") &&
              !classStr.includes("convention")
            ) {
              summaryHTML.major += `<div class="list-event ${classStr}">${event.title}</div>`;
            }
          } else if (event.type === "training" && !trainingSkip) {
            summaryHTML.training += `<div class="list-event ${classStr}">${trainingText[trainingType]}</div>`;
          } else if (event.type === "seasonal") {
            summaryHTML.seasonal += `<div class="list-event ${classStr}">${event.title}</div>`;
          }
        });

        let conventionDates;

        if (conventionEvent !== undefined) {
          console.log(conventionEvent);
          if (
            conventionEvent.start_date.day === conventionEvent.end_date.day &&
            conventionEvent.start_date.month === conventionEvent.end_date.month
          ) {
            conventionDates = `${conventionEvent.start_date.day} ${
              months[conventionEvent.start_date.month - 1]
            }`;
          } else if (
            conventionEvent.start_date.day !== conventionEvent.end_date.day &&
            conventionEvent.start_date.month === conventionEvent.end_date.month
          ) {
            conventionDates = `${conventionEvent.start_date.day} - ${
              conventionEvent.end_date.day
            } ${months[conventionEvent.start_date.month - 1]}`;
          } else {
            conventionDates = `${conventionEvent.start_date.day} ${conventionEvent.start_date.month} - ${conventionEvent.end_date.day} ${conventionEvent.end_date.month}`;
          }
        }

        return `${
          conventionOn
            ? `<div class="convention-feature"><i class="fas fa-circle"></i><div class="text"><div class="title">National Convention</div><div class="details">${
                conventionDates.length > 0
                  ? `<div class="date">${conventionDates}</div>`
                  : ``
              }${
                conventionEvent.venue !== null &&
                conventionEvent.venue.city.length > 0
                  ? `<div class="city">${conventionEvent.venue.city}</div>`
                  : ``
              }</div></div><i class="fas fa-circle"></i></div>`
            : ``
        }<div class="summary-columns">
                ${
                  summaryHTML.major.length > 0
                    ? `<div class="major"><div class="banner"><i class="fas fa-star"></i></div><div class="contents">${summaryHTML.major}</div></div>`
                    : ``
                }
                ${
                  summaryHTML.training.length > 0
                    ? `<div class="training"><div class="banner"><i class="fas fa-graduation-cap"></i></div><div class="contents">${summaryHTML.training}</div></div>`
                    : ``
                }
                ${
                  summaryHTML.seasonal.length > 0
                    ? `<div class="seasonal"><div class="banner"><i class="far fa-snowflake"></i></div><div class="contents">${summaryHTML.seasonal}</div></div>`
                    : ``
                }
                </div>`;
      },

      getFadeElements: () => {
        return document.querySelectorAll(DOMStrings.fadeEls);
      },

      calendarFade: (activeMonth, speed) => {
        Array.prototype.slice
          .call(document.querySelectorAll(DOMStrings.fadeEls))
          .forEach((el) => {
            el.classList.remove("shown");
          });

        const currentEls = DOM.monthSlides[activeMonth].querySelectorAll(
          DOMStrings.fadeEls
        );

        setTimeout(() => {
          currentEls.forEach((el) => {
            el.classList.add("shown");
          });
        }, speed);
      },

      openEventModal: (event) => {
        const modalContents = DOM.eventModalContents,
          modalWrapper = DOM.eventModalWrapper;

        modalWrapper.style.zIndex = "5000";

        let HTML = "";

        let enquiryEmail = {
          'major': 'events@firstnational.com.au',
          'minor': 'events@firstnational.com.au',
          'training': 'training@firstnational.com.au',
          'seasonal': null
        };

        const eventClass = getEventClass(event);

        HTML += `<div class="banner ${eventClass}"><span class="date">${
          event.end_date.day === event.start_date.day
            ? `${days[new Date(event.start_date.UTC).getDay()]} ${
                event.start_date.day
              } ${months[event.start_date.month - 1]}`
            : `${days[new Date(event.start_date.UTC).getDay()]} ${
                event.start_date.day
              } ${months[event.start_date.month - 1]} - ${
                days[new Date(event.end_date.UTC).getDay()]
              } ${event.end_date.day} ${months[event.end_date.month - 1]}`
        }</span></div>`;

        if (event.image) {
            HTML += `<div class="image"><img src="${event.image.large}" alt="${event.title}"></div>`;
          }

          HTML += `<div class="details"><div class="columns ${eventClass}">`;

        HTML += `<div class="text">${
          event.title.length > 0
            ? `<div class="title">${event.title}</div>`
            : ``
        }${
          event.venue !== null
            ? `${
                event.venue.name !== undefined
                  ? `<div class="venue"><i class="fas fa-building"></i>${event.venue.name}</div>`
                  : ``
              }${
                event.venue.city !== undefined
                  ? `<div class="city"><i class="fas fa-map-marked-alt"></i>${event.venue.city}</div>`
                  : ``
              }`
            : ``
        }</div>`;

        HTML += `<div class="links"><a class="add-to-calendar" target="_blank">Add to calendar</a>${enquiryEmail[event.type] !== null ? `<a href="mailto:${enquiryEmail[event.type]}?subject=Enquiry%20about%20${event.title.replace(' ', '%20')}&body=Hi%20FN%20${event.type == 'training' ? 'Training' : 'Events'}%20team%2C%0D%0A%0D%0A" class="enquiry">Enquire</a>` : ``}${
            event.URL == null
              ? ``
              : `<a class="info" href="${event.URL}" target="_blank">More info</a>`
          }${
            event.reg_link == null
              ? ``
              : `<a class="register" href="${event.reg_link}" target="_blank">Register</a>`
          }`;

        HTML += `</div>`;

        HTML += '</div>';

        HTML += event.description.length > 0 ? `<div class="description"><div class="inner">${event.description}</div></div>` : '';

        HTML += '</div>';




        modalContents.innerHTML = HTML;

        modalWrapper.classList.add("shown");
      },

      hideEventModal: (delay = 250) => {
        DOM.eventModalWrapper.classList.remove("shown");

        setTimeout(() => {
          DOM.eventModalWrapper.style.zIndex = "-5000";
        }, delay);
      },

      setNavArrowAnimation: () => {
        DOM.nextMonthBtn.style.animation = "nav-prompt 900ms infinite";
      },
      unsetNavArrowAnimation: () => {
        DOM.nextMonthBtn.style.animation = "none";
      },
    };
  })();

  const controller = ((dataCtrl, UICtrl) => {
    const setImgSrc = (image) => {
      if (!image.src && image.dataset.src.length > 0) {
        image.src = image.dataset.src;
      }
    };

    const setupEventListeners = () => {
      // window listeners
      window.addEventListener("click", (e) => {
        if (
          UICtrl.DOM.monthMenu.classList.contains("open") &&
          e.target.closest("a") !== UICtrl.DOM.calendarButton
        ) {
          UICtrl.hideDropdownMenu();
        }
        if (e.target.closest("div.scroll-prompt")) {
          UICtrl.DOM.monthSlides[dataCtrl.state.currentMonth]
            .querySelector(".event-wrapper")
            .scrollIntoView();
        }

        if (e.target.closest("div.day-event") !== null) {
          const ID = parseInt(
            e.target.closest("div.day-event").dataset.eventId
          );

          const monthEvents =
            dataCtrl.state.events[months[dataCtrl.state.currentMonth]];

          monthEvents.forEach((event) => {
            if (event.ID === ID) {
              dataCtrl.ics = ics();
              dataCtrl.ics.addEvent(
                event.title,
                event.description,
                `${event.venue ? event.venue.city : ``}, ${
                  event.venue ? event.venue.state : ``
                }`,
                event.start_date.UTC,
                event.end_date.UTC
              );
              dataCtrl.state.currentEvent = event;

              UICtrl.openEventModal(event);
            }
          });
        }
      });

      UICtrl.DOM.eventModalClose.addEventListener("click", () => {
        UICtrl.hideEventModal();
      });

      UICtrl.DOM.eventModalContents.addEventListener("click", (e) => {
          console.log(e);
        if (
          e.target.closest("a") ==
          document.querySelector(".event-modal .add-to-calendar")
        ) {
          dataCtrl.ics.download(`${dataCtrl.state.currentEvent.title.replace(' ', '').replace('\'', '').replace('/', '')}`);
        }
      });

      const monthMenuArr = Array.prototype.slice.call(
        document.querySelectorAll(".months-dropdown-menu .month")
      );

      UICtrl.DOM.monthMenu.addEventListener("click", (e) => {
        if (monthMenuArr.includes(e.target.closest("div.month"))) {
          dataCtrl.state.calendarSwiper.slideTo(
            monthMenuArr.indexOf(e.target.closest("div.month")),
            0
          );
        }
      });

      UICtrl.DOM.calendarButton.addEventListener("click", () => {
        if (UICtrl.DOM.monthMenu.classList.contains("open")) {
          UICtrl.hideDropdownMenu();
        } else {
          UICtrl.showDropdownMenu();
        }
      });
    };

    return {
      init: async () => {
        dataCtrl.state.currentMonth = 0;

        dataCtrl.state.monthsVisited = new Array();

        // __calEvents is the global JS object of events from the WP database that is
        // added to the HTML page when it's rendered

        dataCtrl.state.events = __calEvents;

        // randomise the homepage featured events array
        let homepageEvents = dataCtrl
          .getFeatured(dataCtrl.state.events)
          .sort(() => Math.random() - 0.5);

        // writing the DOM
        UICtrl.DOM.monthSlides.forEach((slide, i) => {
          if (i == 0) {
            //homepage

            console.log("homepage");
          } else {
            //calendar pages

            const monthEvents = dataCtrl.state.events[months[i]];

            const calendar = slide.querySelector(".calendar .grid");

            const eventSummary = slide.querySelector(".event-summary");

            calendar.innerHTML = UICtrl.writeCalendarGrid(i + 1, monthEvents);

            eventSummary.innerHTML = UICtrl.writeEventSummary(monthEvents);

            if (monthEvents !== undefined) {
              const monthFeatured = dataCtrl.getMonthFeatured(monthEvents);
            }
          }
        });

        dataCtrl.state.images = UICtrl.sortImages(UICtrl.getAllImages());

        const monthTextSwiper = new Swiper(
          document.querySelector(".month-text-container"),
          {
            slidesPerView: 1,
            freeMode: false,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            allowTouchMove: false,
            speed: 400,
          }
        );

        dataCtrl.state.monthTextSwiper = monthTextSwiper;

        const calendarSwiper = new Swiper(
          document.querySelector(".calendar-swiper"),
          {
            navigation: {
              nextEl: document.querySelector(UICtrl.DOMStrings.monthNavs.next),
              prevEl: document.querySelector(UICtrl.DOMStrings.monthNavs.prev),
            },
            thumbs: {
              swiper: monthTextSwiper,
            },
            speed: 250,
            breakpoints: {
              768: {
                speed: 900,
              },
            },
            simulateTouch: false,
            spaceBetween: 0,
            on: {
              init: function () {
                const slide = UICtrl.DOM.monthSlides[this.activeIndex];

                Array.prototype.slice
                  .call(slide.querySelectorAll("img"))
                  .forEach((image) => {
                    setImgSrc(image);
                  });

                UICtrl.setActiveMenuMonth(dataCtrl.state.currentMonth);

                UICtrl.toggleNavArrows(dataCtrl.state.currentMonth);

                dataCtrl.state.monthsVisited.push(this.activeIndex);

                dataCtrl.state.slideHasBeenChanged = false;
              },
              slideChange: function () {
                if (!dataCtrl.state.monthsVisited.includes(this.activeIndex)) {
                  const slide = UICtrl.DOM.monthSlides[this.activeIndex];

                  Array.prototype.slice
                    .call(slide.querySelectorAll("img"))
                    .forEach((image) => {
                      setImgSrc(image);
                    });

                  dataCtrl.state.monthsVisited.push(this.activeIndex);
                }
                dataCtrl.state.currentMonth = this.activeIndex;

                UICtrl.setActiveMenuMonth(dataCtrl.state.currentMonth);

                UICtrl.toggleNavArrows(dataCtrl.state.currentMonth);

                if (!dataCtrl.state.slideHasBeenChanged) {
                  UICtrl.unsetNavArrowAnimation();
                  dataCtrl.state.slideHasBeenChanged = true;
                }
              },
            },
          }
        );

        dataCtrl.state.calendarSwiper = calendarSwiper;

        setupEventListeners();

        UICtrl.hideLoader();

        UICtrl.setNavArrowAnimation();
      },
    };
  })(dataController, UIController);

  controller.init();
});