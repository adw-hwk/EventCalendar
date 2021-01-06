const dataController = (() => {

    const eventsURL = 'http://fneventcalendar.test/wp-json/tribe/events/v1/events';

    let events;

    return {
        fetchEvents: async() => {

            const timeStart = new Date().getTime();

            events = await fetch(eventsURL)
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

        getEvents: () => {
            return events;
        },

        sortEvents: (allEvents) => {

            let events = {};

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

        }
    }


})();




const UIController = (() => {

    return {
        templates: __DOM_templates,

    }


})();


const controller = ((dataCtrl, UICtrl) => {

    const templates = UICtrl.templates;




    return {
        init: async() => {

            const events = await dataCtrl.fetchEvents();

            const sortedEvents = dataCtrl.sortEvents(events);

            console.log(sortedEvents);

            console.log(templates.event(sortedEvents["March"][2]));

            // const sortedEvents = eventsByMonth.map(())



        }
    }





})(dataController, UIController);

controller.init();