// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"main.js":[function(require,module,exports) {
window.addEventListener("DOMContentLoaded", function () {
  var dataController = function () {
    var state = {};
    return {
      state: state,
      getConvention: function getConvention(events) {
        var monthKeys = Object.keys(events);
        var convention = false;
        monthKeys.forEach(function (month) {
          events[month].forEach(function (e) {
            if (e.tags !== null && e.tags.includes("convention")) {
              convention = e;
            }
          });
        });
        return convention;
      },
      getEvent: function getEvent(id, events) {
        var monthKeys = Object.keys(events);
        var event = false;
        monthKeys.forEach(function (month) {
          events[month].forEach(function (e) {
            if (e.ID == id) {
              event = e;
            }
          });
        });
        return event;
      },
      getURLParamEventID: function getURLParamEventID(param) {
        var qString = window.location.search;
        var params = new URLSearchParams(qString);
        var idString = params.get(param);
        idString = idString !== null && Number(idString) !== NaN ? parseInt(idString) : null;
        return idString;
      }
    };
  }();

  var UIController = function () {
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
      dropdownMonthArr: Array.prototype.slice.call(document.querySelector(".months-dropdown-menu").querySelectorAll(".month")),
      menuElements: [document.querySelector("header .month-text"), document.querySelector(".month-text strong"), document.querySelector(".month-text i")],
      loader: document.querySelector("#page-wrapper .cal-loader"),
      monthSlides: Array.prototype.slice.call(document.querySelectorAll(".calendar-swiper .calendar-slide")),
      calendarButton: document.querySelector(".show-months-btn"),
      calendarGrids: Array.prototype.slice.call(document.querySelectorAll(".calendar .grid")),
      eventModalWrapper: document.querySelector(".event-modal-wrapper"),
      eventModalContents: document.querySelector(".event-modal .inner"),
      eventModalClose: document.querySelector(".event-modal .close-btn"),
      filter: document.querySelector(".filter"),
      filterBtn: document.querySelector(".filter .btn"),
      filterMenu: document.querySelector(".filter .filter-menu"),
      filterSpans: Array.prototype.slice.call(document.querySelectorAll(".filter .btn span"))
    };

    var getEventClasses = function getEventClasses(event) {
      var eventClasses = event.type;

      if (event.tags !== null && event.tags.length > 0) {
        event.tags.forEach(function (tag) {
          eventClasses += " ".concat(tag);
        });
      }

      return eventClasses;
    };

    return {
      DOM: DOM,
      months: months,
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
        var fadeDelay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 250;
        DOM.loader.style.transition = "opacity ".concat(fadeDelay, "ms ease-in-out");
        DOM.calendarSwiper.style.transition = "filter ".concat(fadeDelay, "ms ease-in-out");
        DOM.loader.classList.add("fade");
        DOM.calendarSwiper.classList.remove("blur");
        setTimeout(function () {
          DOM.loader.classList.add("hidden");
        }, fadeDelay);
      },
      showDropdownMenu: function showDropdownMenu() {
        DOM.monthMenu.style.display = "grid";
        DOM.calendarButton.classList.add("is-active");
        setTimeout(function () {
          DOM.monthMenu.classList.add("open");
        }, 25);
        DOM.monthSlides.forEach(function (slide) {
          slide.classList.add("blur");
        });
      },
      //delay set to 400ms in CSS
      hideDropdownMenu: function hideDropdownMenu() {
        var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 400;
        DOM.calendarButton.classList.remove("is-active");
        DOM.monthMenu.classList.remove("open");
        setTimeout(function () {
          DOM.monthMenu.style.display = "none";
        }, delay);
        DOM.monthSlides.forEach(function (slide) {
          slide.classList.remove("blur");
        });
      },
      setActiveMenuMonth: function setActiveMenuMonth(currentMonth) {
        DOM.dropdownMonthArr.forEach(function (month) {
          if (month.classList.contains("active")) {
            month.classList.remove("active");
          }
        });
        DOM.dropdownMonthArr[currentMonth].classList.add("active");
      },
      writeConventionBanner: function writeConventionBanner(conventionEvent) {
        var conventionDates;

        if (conventionEvent.start_date.day === conventionEvent.end_date.day && conventionEvent.start_date.month === conventionEvent.end_date.month) {
          conventionDates = "".concat(conventionEvent.start_date.day, " ").concat(months[conventionEvent.start_date.month - 1]);
        } else if (conventionEvent.start_date.day !== conventionEvent.end_date.day && conventionEvent.start_date.month === conventionEvent.end_date.month) {
          conventionDates = "".concat(conventionEvent.start_date.day, " - ").concat(conventionEvent.end_date.day, " ").concat(months[conventionEvent.start_date.month - 1]);
        } else {
          conventionDates = "".concat(conventionEvent.start_date.day, " ").concat(conventionEvent.start_date.month, " - ").concat(conventionEvent.end_date.day, " ").concat(conventionEvent.end_date.month);
        }

        return "<div class=\"convention-feature\"><i class=\"fas fa-circle\"></i><div class=\"text\"><div class=\"title\">National Convention</div><div class=\"details\">".concat(conventionDates.length > 0 ? "<div class=\"date\">".concat(conventionDates, "</div>") : "").concat(conventionEvent.venue !== null && conventionEvent.venue.city.length > 0 ? "<div class=\"city\">".concat(conventionEvent.venue.city, "</div>") : "", "</div></div><i class=\"fas fa-circle\"></i></div></div>");
      },
      // Most important function, writes the calendar grid with events for a given month
      writeCalendarGrid: function writeCalendarGrid(month, events) {
        var getDaysInMonth = function getDaysInMonth(monthNum, year) {
          return new Date(year, monthNum, 0).getDate();
        }; // generates the HTML of events for a given day inside a calendar square


        var writeDaysEvents = function writeDaysEvents(day, events) {
          var eventList = "";
          events.forEach(function (event) {
            var eventClasses = getEventClasses(event);

            if (event.start_date.day == day || event.end_date.day >= day && event.start_date.day < day) {
              eventList += "<div class=\"day-event ".concat(eventClasses, "\" data-event-id=\"").concat(event.ID, "\">").concat(event.type === "seasonal" ? "" : "<div class=\"color-bar\"></div>").concat(event.type === "seasonal" && event.tags !== null && event.tags.includes("significant") ? "<img class=\"cal-event-bg-img\" src=\"".concat(event.image.cal !== undefined ? event.image.cal : event.image.full, "\">") : "", "<span>").concat(event.title, "</span></div>");
            }
          });
          return eventList;
        };

        var year = new Date().getFullYear();
        var daysInMonth = getDaysInMonth(month, year); // converts the month number into a string for use in Date

        var monthString = month < 10 ? "0".concat(month) : "".concat(month); // create date object of first day of the month

        var dayOne = new Date("".concat(year, "-").concat(monthString, "-01")); // get the day index of first day of the month

        var dayOneIndex = dayOne.getDay(); // tracks number of calendar squares that have been created

        var squares = 0; // HTML string of calendar grid squares to be appended to calendar grid container

        var HTML = ""; // this function creates innactive squares for the days of the previous and following month that are visible on the calendar

        var innactiveSquare = function innactiveSquare(curMonth, steps) {
          var placement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "before";
          var daysInPrevMonth = getDaysInMonth(curMonth - 1, year);
          var day;

          if (placement === "after") {
            day = steps + 1;
          } else if (placement === "before") {
            day = daysInPrevMonth + steps - dayOneIndex + 1;
          } else {
            day = "";
          }

          return "<div class=\"day-square innactive\"><div class=\"banner\">".concat(day, "</div><div class=\"contents\"></div></div>");
        };

        var daySquare = function daySquare(day, eventList) {
          return "<div class=\"day-square".concat(eventList.length > 0 ? "" : " no-events", "\" data-day=\"").concat(day, "\"><div class=\"banner").concat([0, 6].includes(squares % 7) ? " weekend" : "", "\">").concat(day, "<span class=\"mbl-weekday-text\">&nbsp;|&nbsp;").concat(days[squares % 7].slice(0, 3), "</span></div><div class=\"contents\">").concat(eventList, "</div></div>");
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
        }

        return HTML;
      },
      openEventModal: function openEventModal(event) {
        var modalContents = DOM.eventModalContents,
            modalWrapper = DOM.eventModalWrapper;
        modalWrapper.style.zIndex = "5000";
        var HTML = "";
        var enquiryEmail = {
          major: "events@firstnational.com.au",
          minor: "events@firstnational.com.au",
          training: "training@firstnational.com.au",
          seasonal: null
        };
        var eventClasses = getEventClasses(event);
        HTML += "<div class=\"banner ".concat(eventClasses, "\"><span class=\"date\">").concat(event.end_date.day === event.start_date.day ? "".concat(event.start_date.weekday, " ").concat(event.start_date.day, " ").concat(months[event.start_date.month - 1]) : "".concat(event.start_date.weekday, " ").concat(event.start_date.day, " ").concat(months[event.start_date.month - 1], " - ").concat(event.end_date.weekday, " ").concat(event.end_date.day, " ").concat(months[event.end_date.month - 1]), "</span></div>");

        if (event.image) {
          HTML += "<div class=\"image\"><img src=\"".concat(event.image.large, "\" alt=\"").concat(event.title, "\"></div>");
        }

        HTML += "<div class=\"details\"><div class=\"columns ".concat(eventClasses, "\">");
        HTML += "<div class=\"text\">".concat(event.title.length > 0 ? "<div class=\"title\">".concat(event.title, "</div>") : "").concat(event.venue !== null ? "".concat(event.venue.name !== undefined ? "<div class=\"venue\"><i class=\"fas fa-building\"></i>".concat(event.venue.name, "</div>") : "").concat(event.venue.city !== undefined ? "<div class=\"city\"><i class=\"fas fa-map-marked-alt\"></i>".concat(event.venue.city, "</div>") : "") : "").concat(!event.all_day && [event.start_date.day, event.start_date.hour, event.start_date.minute] !== [event.end_date.day, event.end_date.hour, event.end_date.minute] ? "<div class=\"time\"><i class=\"far fa-clock\"></i>".concat(event.start_date.hour % 12, ":").concat(event.start_date.minute == 0 ? "00" : event.start_date.minute, " - ").concat(event.end_date.hour % 12 == 0 ? "12" : event.end_date.hour % 12, ":").concat(event.end_date.minute == 0 ? "00" : event.end_date.minute, "</div>") : "", "</div>");
        HTML += "<div class=\"links\"><a class=\"add-to-calendar\" target=\"_blank\">Add to calendar</a>".concat(enquiryEmail[event.type] !== null ? "<a href=\"mailto:".concat(enquiryEmail[event.type], "?subject=Enquiry%20about%20").concat(event.title.replace(" ", "%20"), "&body=Hi%20FN%20").concat(event.type == "training" ? "Training" : "Events", "%20team%2C%0D%0A%0D%0A\" class=\"enquiry\">Enquire</a>") : "").concat(event.URL == null ? "" : "<a class=\"info\" href=\"".concat(event.URL, "\" target=\"_blank\">More info</a>")).concat(event.reg_link == null ? "" : "<a class=\"register\" href=\"".concat(event.reg_link, "\" target=\"_blank\">Register</a>"));
        HTML += "</div>";
        HTML += "</div>";
        HTML += event.description.length > 0 ? "<div class=\"description\"><div class=\"inner\">".concat(event.description, "</div></div>") : "";
        HTML += "</div>";
        modalContents.innerHTML = HTML;
        modalWrapper.classList.add("shown");
      },
      hideEventModal: function hideEventModal() {
        var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 250;
        DOM.eventModalWrapper.classList.remove("shown");
        setTimeout(function () {
          DOM.eventModalWrapper.style.zIndex = "-5000";
        }, delay);
      },
      setNavArrowAnimation: function setNavArrowAnimation() {
        DOM.nextMonthBtn.style.animation = "nav-prompt 900ms infinite";
      },
      unsetNavArrowAnimation: function unsetNavArrowAnimation() {
        DOM.nextMonthBtn.style.animation = "none";
      },
      toggleFilteredCalendarEvents: function toggleFilteredCalendarEvents(state, type) {
        var calendarEventsArr = Array.prototype.slice.call(document.querySelectorAll(".day-event")); // const stateStrings = ['qld', 'nsw', 'vic', 'tas', 'sa', 'wa', 'nt', 'nz'];

        var fnEvents = [],
            trainingEvents = [];
        var stateEvents = {};
        calendarEventsArr.forEach(function (event) {
          if (event.classList.contains("minor") || event.classList.contains("major")) {
            fnEvents.push(event);
          }

          if (event.classList.contains("training")) {
            trainingEvents.push(event);
          }

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
              if (!trainingEvents.includes(event) || !event.classList.contains(state)) {
                event.classList.add("hidden");
              } else {
                event.classList.remove("hidden");
              }
            }

            if (type === "events") {
              if (!fnEvents.includes(event) || !event.classList.contains(state)) {
                event.classList.add("hidden");
              } else {
                event.classList.remove("hidden");
              }
            }
          }
        });
      },
      showFilterMenu: function showFilterMenu() {
        DOM.filter.classList.add("shown");
      },
      hideFilterMenu: function hideFilterMenu() {
        DOM.filter.classList.remove("shown");
      },
      showFilterBtn: function showFilterBtn() {
        var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 300;
        DOM.filterBtn.style.display = "flex"; // short delay to allow for transition

        setTimeout(function () {
          DOM.filterBtn.classList.add("shown");
        }, 10);
      },
      hideFilterBtn: function hideFilterBtn() {
        var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 300;
        DOM.filterBtn.classList.remove("shown");
        setTimeout(function () {
          DOM.filterBtn.style.display = "none";
        }, delay);
      },
      setFilterBtnAnimation: function setFilterBtnAnimation() {
        var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 600;
        DOM.filterBtn.querySelector("i").style.animationName = "filter-prompt";
        DOM.filterBtn.querySelector("i").style.animationDuration = "".concat(duration, "ms");
      },
      animateFilterBtn: function animateFilterBtn() {
        var step = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 45;
        var animationDelay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 400;
        var animationDuration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 420;
        var fadeDelay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 900;
        DOM.filterSpans.forEach(function (span, i) {
          setTimeout(function () {
            span.style.animationDuration = "".concat(animationDuration, "ms");
            span.style.animationIterationCount = "1";
            span.style.animationName = "filter-prompt";
          }, step * i + animationDelay);
        });
        setTimeout(function () {
          DOM.filterBtn.classList.add("minimised");
        }, DOM.filterSpans.length * step + fadeDelay);
      }
    };
  }();

  var controller = function (dataCtrl, UICtrl) {
    var setImgSrc = function setImgSrc(image) {
      if (!image.src && image.dataset.src.length > 0) {
        image.src = image.dataset.src;
      }
    };

    var setupEventListeners = function setupEventListeners() {
      // window listeners
      window.addEventListener("click", function (e) {
        if (e.target.closest(".filter") == null && UICtrl.DOM.filter.classList.contains("shown")) {
          UICtrl.hideFilterMenu();
        }

        if (UICtrl.DOM.monthMenu.classList.contains("open") && e.target.closest("a") !== UICtrl.DOM.calendarButton) {
          UICtrl.hideDropdownMenu();
        }

        if (e.target.closest("div.scroll-prompt")) {
          UICtrl.DOM.monthSlides[dataCtrl.state.currentMonth].querySelector(".event-wrapper").scrollIntoView();
        }

        if (e.target.closest("div.day-event") !== null) {
          var ID = parseInt(e.target.closest("div.day-event").dataset.eventId);
          var monthEvents = dataCtrl.state.events[UICtrl.months[dataCtrl.state.currentMonth]];
          monthEvents.forEach(function (event) {
            if (event.ID === ID) {
              dataCtrl.ics = ics();
              dataCtrl.ics.addEvent(event.title, event.description_plain, "".concat(event.venue ? "".concat(event.venue.city ? event.venue.city + ', ' : '').concat(event.venue.state ? event.venue.state : '') : ''), event.start_date.UTC, event.end_date.UTC);
              dataCtrl.state.currentEvent = event;
              UICtrl.openEventModal(event);
            }
          });
        }
      });
      UICtrl.DOM.eventModalClose.addEventListener("click", function () {
        UICtrl.hideEventModal();
      }); // ADD TO CALENDAR BUTTON ICS DOWNLOAD

      UICtrl.DOM.eventModalContents.addEventListener("click", function (e) {
        if (e.target.closest("a") == document.querySelector(".event-modal .add-to-calendar")) {
          dataCtrl.ics.download("".concat(dataCtrl.state.currentEvent.title.replace(" ", "").replace("'", "").replace("/", "")));
        }
      });
      var monthMenuArr = Array.prototype.slice.call(document.querySelectorAll(".months-dropdown-menu .month"));
      UICtrl.DOM.monthMenu.addEventListener("click", function (e) {
        if (monthMenuArr.includes(e.target.closest("div.month"))) {
          dataCtrl.state.calendarSwiper.slideTo(monthMenuArr.indexOf(e.target.closest("div.month")), 0);
        }
      });
      UICtrl.DOM.calendarButton.addEventListener("click", function () {
        if (UICtrl.DOM.monthMenu.classList.contains("open")) {
          UICtrl.hideDropdownMenu();
        } else {
          UICtrl.showDropdownMenu();
        }
      });
      UICtrl.DOM.filterMenu.addEventListener("click", function (e) {
        var clicked = e.target.closest("a");
        var anchors;

        if (clicked.classList.contains("state")) {
          var state = clicked.dataset.state;

          if (state !== dataCtrl.state.filter.state) {
            dataCtrl.state.filter.state = state;
            UICtrl.toggleFilteredCalendarEvents(state, dataCtrl.state.filter.type);
            anchors = UICtrl.DOM.filter.querySelectorAll("a.state");
            anchors.forEach(function (a) {
              if (a.dataset.state === state) {
                a.classList.add("active");
              } else {
                a.classList.remove("active");
              }
            });
          }
        } else if (clicked.classList.contains("type")) {
          var type = clicked.dataset.type;

          if (type !== dataCtrl.state.filter.type) {
            dataCtrl.state.filter.type = type;
            UICtrl.toggleFilteredCalendarEvents(dataCtrl.state.filter.state, type);
            anchors = UICtrl.DOM.filter.querySelectorAll("a.type");
            anchors.forEach(function (a) {
              if (a.dataset.type === type) {
                a.classList.add("active");
              } else {
                a.classList.remove("active");
              }
            });
          }
        }
      });
      UICtrl.DOM.filterBtn.addEventListener("click", function () {
        if (UICtrl.DOM.filter.classList.contains("shown")) {
          UICtrl.hideFilterMenu();
        } else {
          UICtrl.showFilterMenu();
        }
      });
    };

    return {
      init: function init() {
        // init state
        dataCtrl.state.currentMonth = 0;
        dataCtrl.state.monthsVisited = new Array();
        dataCtrl.state.filter = {};
        dataCtrl.state.filter.state = "all";
        dataCtrl.state.filter.type = "all"; // __calEvents is the global JS object of events from the WP database that is
        // added to the HTML page when it's rendered

        dataCtrl.state.events = __calEvents; // get the convention event, if one present

        var convention = dataCtrl.getConvention(dataCtrl.state.events); // writing the DOM

        UICtrl.DOM.monthSlides.forEach(function (slide, i) {
          // if not landing page, write calendar grid
          if (i !== 0) {
            var monthEvents = dataCtrl.state.events[UICtrl.months[i]];
            var calendar = slide.querySelector(".calendar .grid");
            calendar.innerHTML = UICtrl.writeCalendarGrid(i + 1, monthEvents);
          } // write the convention banner for the convention month


          if (convention && i == convention.start_date.month - 1) {
            slide.querySelector(".event-summary").innerHTML = UICtrl.writeConventionBanner(convention);
          }
        }); // NAV / months swiper

        var monthTextSwiper = new Swiper(document.querySelector(".month-text-container"), {
          slidesPerView: 1,
          freeMode: false,
          watchSlidesVisibility: true,
          watchSlidesProgress: true,
          allowTouchMove: false,
          speed: 400
        });
        dataCtrl.state.monthTextSwiper = monthTextSwiper; // Calendar swiper

        var calendarSwiper = new Swiper(document.querySelector(".calendar-swiper"), {
          navigation: {
            nextEl: UICtrl.DOM.nextMonthBtn,
            prevEl: UICtrl.DOM.prevMonthBtn
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
          simulateTouch: false,
          spaceBetween: 0,
          on: {
            init: function init() {
              UICtrl.setActiveMenuMonth(dataCtrl.state.currentMonth);
              UICtrl.toggleNavArrows(dataCtrl.state.currentMonth);
              dataCtrl.state.monthsVisited.push(this.activeIndex);
              dataCtrl.state.slideHasBeenChanged = false;
              var nextSlide = UICtrl.DOM.monthSlides[this.activeIndex + 1];
              var bgImg = nextSlide.querySelector(".calendar-bg-img");

              if (bgImg !== null) {
                setImgSrc(bgImg);
              }
            },
            slideChange: function slideChange() {
              // don't show filter button on landing page
              if (this.activeIndex > 0) {
                UICtrl.showFilterBtn();
              } else {
                UICtrl.hideFilterBtn();
              }

              var slides;

              if (this.activeIndex == 0) {
                slides = [UICtrl.DOM.monthSlides[this.activeIndex], UICtrl.DOM.monthSlides[this.activeIndex + 1]];
              } else if (this.activeIndex == 11) {
                slides = [UICtrl.DOM.monthSlides[this.activeIndex - 1], UICtrl.DOM.monthSlides[this.activeIndex]];
              } else {
                slides = [UICtrl.DOM.monthSlides[this.activeIndex - 1], UICtrl.DOM.monthSlides[this.activeIndex], UICtrl.DOM.monthSlides[this.activeIndex + 1]];
              }

              slides.forEach(function (slide) {
                var bgImg = slide.querySelector(".calendar-bg-img");

                if (bgImg !== null) {
                  setImgSrc(bgImg);
                }
              });

              if (!dataCtrl.state.monthsVisited.includes(this.activeIndex)) {
                dataCtrl.state.monthsVisited.push(this.activeIndex);
              }

              dataCtrl.state.currentMonth = this.activeIndex;
              UICtrl.setActiveMenuMonth(dataCtrl.state.currentMonth);
              UICtrl.toggleNavArrows(dataCtrl.state.currentMonth); // perform these actions only on the first slide change

              if (!dataCtrl.state.slideHasBeenChanged) {
                UICtrl.animateFilterBtn();
                UICtrl.unsetNavArrowAnimation();
                dataCtrl.state.slideHasBeenChanged = true;
              }
            }
          }
        });
        dataCtrl.state.calendarSwiper = calendarSwiper; // page is ready

        setupEventListeners();
        UICtrl.hideLoader();
        UICtrl.setNavArrowAnimation(); // reading URL for event ID - if parameter present and ID is valid, skip calendar to that page and open event modal

        var urlEventID = dataCtrl.getURLParamEventID("event");

        if (urlEventID !== null) {
          var urlEvent = dataCtrl.getEvent(urlEventID, dataCtrl.state.events);

          if (urlEvent) {
            var eventMonth = urlEvent.start_date.month;
            dataCtrl.state.calendarSwiper.slideTo(eventMonth - 1, 750);
            setTimeout(function () {
              UICtrl.openEventModal(urlEvent);
            }, 750);
          }
        }
      }
    };
  }(dataController, UIController);

  controller.init();
});
},{}],"../../../../../../../../Users/toulaa/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53075" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../../../Users/toulaa/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)