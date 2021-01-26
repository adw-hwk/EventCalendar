window.addEventListener("DOMContentLoaded", () => {
  
  // defined globally since it's used inside all controllers
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
        const monthKeys = Object.keys(events);

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
        const monthKeys = Object.keys(events);

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
        const monthKeys = Object.keys(events);

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

      filter: document.querySelector(".filter"),

      filterBtn: document.querySelector('.filter .btn'),

      filterMenu: document.querySelector('.filter .filter-menu'),

      filterSpans: Array.prototype.slice.call(document.querySelectorAll('.filter .btn span'))
    };

    const DOMStrings = {
      monthNavs: {
        next: "#next-month-nav",
        prev: "#prev-month-nav",
      },

      fadeEls: ".fade-in",
    };

    const getEventClasses = (event) => {
      let eventClasses = event.type;

      if (event.tags !== null && event.tags.length > 0) {
        event.tags.forEach((tag) => {
          eventClasses += ` ${tag}`;
        });
      }

      return eventClasses;
    };

    return {
      DOM: DOM,

      DOMStrings: DOMStrings,

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
            const eventClasses = getEventClasses(event);

            if (
              event.start_date.day == day ||
              (event.end_date.day >= day && event.start_date.day < day)
            ) {
              eventList += `<div class="day-event ${eventClasses}" data-event-id="${event.ID
                }">${event.type === "seasonal" ? `` : `<div class="color-bar"></div>`
                }${event.type === "seasonal" && event.tags !== null && event.tags.includes('significant') ? `<img class="cal-event-bg-img" src="${event.image.cal !== undefined ? event.image.cal : event.image.full}">` : ''}<span>${event.title}</span></div>`;
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
          return `<div class="day-square${eventList.length > 0 ? "" : " no-events"
            }" data-day="${day}"><div class="banner${[0, 6].includes(squares % 7) ? " weekend" : ""
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

      openEventModal: (event) => {
        const modalContents = DOM.eventModalContents,
          modalWrapper = DOM.eventModalWrapper;

        modalWrapper.style.zIndex = "5000";

        let HTML = "";

        let enquiryEmail = {
          major: "events@firstnational.com.au",
          minor: "events@firstnational.com.au",
          training: "training@firstnational.com.au",
          seasonal: null,
        };

        const eventClasses = getEventClasses(event);

        HTML += `<div class="banner ${eventClasses}"><span class="date">${event.end_date.day === event.start_date.day
          ? `${event.start_date.weekday} ${event.start_date.day} ${months[event.start_date.month - 1]
          }`
          : `${event.start_date.weekday} ${event.start_date.day} ${months[event.start_date.month - 1]
          } - ${event.end_date.weekday} ${event.end_date.day} ${months[event.end_date.month - 1]
          }`
          }</span></div>`;

        if (event.image) {
          HTML += `<div class="image"><img src="${event.image.large}" alt="${event.title}"></div>`;
        }

        HTML += `<div class="details"><div class="columns ${eventClasses}">`;

        HTML += `<div class="text">${event.title.length > 0
          ? `<div class="title">${event.title}</div>`
          : ``
          }${event.venue !== null
            ? `${event.venue.name !== undefined
              ? `<div class="venue"><i class="fas fa-building"></i>${event.venue.name}</div>`
              : ``
            }${event.venue.city !== undefined
              ? `<div class="city"><i class="fas fa-map-marked-alt"></i>${event.venue.city}</div>`
              : ``
            }`
            : ``
          }${!event.all_day &&
            [
              event.start_date.day,
              event.start_date.hour,
              event.start_date.minute,
            ] !== [event.end_date.day, event.end_date.hour, event.end_date.minute]
            ? `<div class="time"><i class="far fa-clock"></i>${event.start_date.hour % 12
            }:${event.start_date.minute == 0 ? "00" : event.start_date.minute
            } - ${event.end_date.hour % 12 == 0 ? "12" : event.end_date.hour % 12
            }:${event.end_date.minute == 0 ? "00" : event.end_date.minute
            }</div>`
            : ""
          }</div>`;

        HTML += `<div class="links"><a class="add-to-calendar" target="_blank">Add to calendar</a>${enquiryEmail[event.type] !== null
          ? `<a href="mailto:${enquiryEmail[event.type]
          }?subject=Enquiry%20about%20${event.title.replace(
            " ",
            "%20"
          )}&body=Hi%20FN%20${event.type == "training" ? "Training" : "Events"
          }%20team%2C%0D%0A%0D%0A" class="enquiry">Enquire</a>`
          : ``
          }${event.URL == null
            ? ``
            : `<a class="info" href="${event.URL}" target="_blank">More info</a>`
          }${event.reg_link == null
            ? ``
            : `<a class="register" href="${event.reg_link}" target="_blank">Register</a>`
          }`;

        HTML += `</div>`;

        HTML += "</div>";

        HTML +=
          event.description.length > 0
            ? `<div class="description"><div class="inner">${event.description}</div></div>`
            : "";

        HTML += "</div>";

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

      toggleFilteredCalendarEvents: (state, type) => {
        const calendarEventsArr = Array.prototype.slice.call(
          document.querySelectorAll(".day-event")
        );

        // const stateStrings = ['qld', 'nsw', 'vic', 'tas', 'sa', 'wa', 'nt', 'nz'];

        let fnEvents = [],
          trainingEvents = [];

        let stateEvents = {};

        calendarEventsArr.forEach((event) => {
          if (
            event.classList.contains("minor") ||
            event.classList.contains("major")
          ) {
            fnEvents.push(event);
          }
          if (event.classList.contains("training")) {
            trainingEvents.push(event);
          }
          // stateStrings.forEach((state, i) => {
          //   const stateStr = state;
          //   if (event.classList.contains(state)) {
          //     if (stateEvents[stateStr] === undefined) {
          //       stateEvents[stateStr] = new Array();
          //     };
          //     stateEvents[stateStr].push(event);
          //   }
          // });

          if (type === "all" && state === "all") {
            event.classList.remove("hidden");
          } else if (type === "all") {
            if (!event.classList.contains(state)) {
              event.classList.add("hidden");
            } else {
              event.classList.remove("hidden");
            }
          } else if (state === "all") {
            if (type === "events") {
              if (!fnEvents.includes(event)) {
                event.classList.add("hidden");
              } else {
                event.classList.remove("hidden");
              }
            }
            if (type === "training") {
              if (!trainingEvents.includes(event)) {
                event.classList.add("hidden");
              } else {
                event.classList.remove("hidden");
              }
            }
          } else {
            if (type === "training") {
              if (
                !trainingEvents.includes(event) ||
                !event.classList.contains(state)
              ) {
                event.classList.add("hidden");
              } else {
                event.classList.remove("hidden");
              }
            }
            if (type === "events") {
              if (
                !fnEvents.includes(event) ||
                !event.classList.contains(state)
              ) {
                event.classList.add("hidden");
              } else {
                event.classList.remove("hidden");
              }
            }
          }
        });
      },

      showFilterMenu: () => {
        DOM.filter.classList.add("shown");
      },
      hideFilterMenu: () => {
        DOM.filter.classList.remove("shown");
      },

      showFilterBtn: (delay = 300) => {
        DOM.filterBtn.style.display = "flex";
        // short delay to allow for transition
        setTimeout(() => {
          DOM.filterBtn.classList.add("shown");
        }, 10);
      },

      hideFilterBtn: (delay = 300) => {
        DOM.filterBtn.classList.remove("shown");
        setTimeout(() => {
          DOM.filterBtn.style.display = "none";
        }, delay);
      },

      setFilterBtnAnimation: (duration = 600) => {
        DOM.filterBtn.querySelector(
          "i"
        ).style.animationName = `filter-prompt`;
        DOM.filterBtn.querySelector(
          "i"
        ).style.animationDuration = `${duration}ms`;
      },

      animateFilterBtn: (step = 45, animationDelay = 400, animationDuration = 420, fadeDelay = 900) => {
        DOM.filterSpans.forEach((span, i) => {

          setTimeout(() => {
            span.style.animationDuration = `${animationDuration}ms`;
            span.style.animationIterationCount = '1';
            span.style.animationName = `filter-prompt`;
          }, step * i + animationDelay)

        });

        setTimeout(() => {

          DOM.filterBtn.classList.add('minimised');

        }, DOM.filterSpans.length * step + fadeDelay);
      }
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
          e.target.closest(".filter") == null &&
          UICtrl.DOM.filter.classList.contains("shown")
        ) {
          UICtrl.hideFilterMenu();
        }
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
                `${event.venue ? event.venue.city : ``}, ${event.venue ? event.venue.state : ``
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


      // ADD TO CALENDAR BUTTON ICS DOWNLOAD
      UICtrl.DOM.eventModalContents.addEventListener("click", (e) => {
        if (
          e.target.closest("a") ==
          document.querySelector(".event-modal .add-to-calendar")
        ) {
          dataCtrl.ics.download(
            `${dataCtrl.state.currentEvent.title
              .replace(" ", "")
              .replace("'", "")
              .replace("/", "")}`
          );
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

      UICtrl.DOM.filterMenu.addEventListener("click", (e) => {

        const clicked = e.target.closest("a");
        let anchors;
        if (clicked.classList.contains("state")) {
          const state = clicked.dataset.state;

          if (state !== dataCtrl.state.filter.state) {
            dataCtrl.state.filter.state = state;
            UICtrl.toggleFilteredCalendarEvents(
              state,
              dataCtrl.state.filter.type
            );
            anchors = UICtrl.DOM.filter.querySelectorAll("a.state");
            anchors.forEach((a) => {
              if (a.dataset.state === state) {
                a.classList.add("active");
              } else {
                a.classList.remove("active");
              }
            });
          }
        } else if (clicked.classList.contains("type")) {
          const type = clicked.dataset.type;

          if (type !== dataCtrl.state.filter.type) {
            dataCtrl.state.filter.type = type;
            UICtrl.toggleFilteredCalendarEvents(
              dataCtrl.state.filter.state,
              type
            );
            anchors = UICtrl.DOM.filter.querySelectorAll("a.type");
            anchors.forEach((a) => {
              if (a.dataset.type === type) {
                a.classList.add("active");
              } else {
                a.classList.remove("active");
              }
            });
          }
        }
      });

      UICtrl.DOM.filterBtn.addEventListener("click", () => {
        if (UICtrl.DOM.filter.classList.contains("shown")) {
          UICtrl.hideFilterMenu();
        } else {
          UICtrl.showFilterMenu();
        }
      });
    };

    return {
      init: () => {
        // init state
        dataCtrl.state.currentMonth = 0;
        dataCtrl.state.monthsVisited = new Array();
        dataCtrl.state.filter = {};
        dataCtrl.state.filter.state = "all";
        dataCtrl.state.filter.type = "all";

        // __calEvents is the global JS object of events from the WP database that is
        // added to the HTML page when it's rendered

        dataCtrl.state.events = __calEvents;

        // writing the DOM
        UICtrl.DOM.monthSlides.forEach((slide, i) => {
          // if not landing page
          if (i !== 0) {

            const monthEvents = dataCtrl.state.events[months[i]];

            const calendar = slide.querySelector(".calendar .grid");

            calendar.innerHTML = UICtrl.writeCalendarGrid(i + 1, monthEvents);

          }
        });

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

                UICtrl.setActiveMenuMonth(dataCtrl.state.currentMonth);

                UICtrl.toggleNavArrows(dataCtrl.state.currentMonth);

                dataCtrl.state.monthsVisited.push(this.activeIndex);

                dataCtrl.state.slideHasBeenChanged = false;
              },
              slideChange: function () {

                // don't show filter button on landing page
                if (this.activeIndex > 0) {
                  UICtrl.showFilterBtn();
                } else {
                  UICtrl.hideFilterBtn();
                }

                const slide = UICtrl.DOM.monthSlides[this.activeIndex];

                const bgImg = slide.querySelector('.calendar-bg-img');

                if (bgImg !== null) {
                  setImgSrc(bgImg);
                }

                if (!dataCtrl.state.monthsVisited.includes(this.activeIndex)) {


                  dataCtrl.state.monthsVisited.push(this.activeIndex);
                }

                dataCtrl.state.currentMonth = this.activeIndex;

                UICtrl.setActiveMenuMonth(dataCtrl.state.currentMonth);

                UICtrl.toggleNavArrows(dataCtrl.state.currentMonth);

                // perform these actions only on the first slide change 
                if (!dataCtrl.state.slideHasBeenChanged) {
                  UICtrl.animateFilterBtn();
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