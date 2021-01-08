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

const __DOM_templates = {


        hero: (featured, month = "2021") => {

                const articlesHTML = [];

                const heroText = `<h1>What will you be doing in ${month}?`;

                featured.forEach((article) => {

                            finishDate = parseInt(article.end_date_details.day) > parseInt(article.start_date_details.day) ? {
                                day: article.end_date_details.day,
                                month: months[parseInt(article.end_date_details.month) - 1]
                            } : null;

                            startDate = {
                                day: article.start_date_details.day,
                                month: months[parseInt(article.start_date_details.month) - 1]
                            };
                            const HTML = `
                    <article class="swiper-slide">

                        <img src="${article.image.url}" alt="Event Image">
            
                        <div class="hero-title">${article.title}</div><br>
            
                        <div class="date">${finishDate == null ? `${startDate.day} ${startDate.month}` : `${startDate.day} ${startDate.month} - ${finishDate.day} ${finishDate.month}`}</div>
    
                    </article>
                `

                articlesHTML.push(HTML);
            })

            return { articlesHTML, heroText }
        },

        event: (e) => {

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
                ]

                let vals = {
                    type: e.categories[0].slug,

                    finishDate: parseInt(e.end_date_details.day) > parseInt(e.start_date_details.day) ? {
                        day: e.end_date_details.day,
                        month: months[parseInt(e.end_date_details.month) - 1],
                        dayOfWeek: days[endWeekday]
                    } : null,

                    startDate: {
                        day: e.start_date_details.day,
                        month: months[parseInt(e.start_date_details.month) - 1],
                        dayOfWeek: days[startWeekday]
                    },

                    imgURL: e.image.url ? e.image.url : null,

                    title: e.title,

                    venue: e.venue.length > 0 ? e.venue.venue : null,

                    time: !e.all_day ? `${e.start_date_details.hour}:${e.start_date_details.minutes} - ${e.end_date_details.hour}:${e.end_date_details.minutes}` : null,

                    description: e.description.length > 0 ? e.description : null

                };

                return `
            <div class="event ${vals.type}">

                <div class="date">
                    <table>
                        <tbody>
                            <tr>
                                <td class="ddmm">${vals.finishDate == null ? `${vals.startDate.day} ${vals.startDate.month.slice(0,3)}` : `${vals.startDate.day} ${vals.startDate.month.slice(0,3)} - ${vals.finishDate.day} ${vals.finishDate.month.slice(0,3)}`}</td>
                            </tr>
                            <tr>
                                <td class="day">${vals.finishDate == null ? `${vals.startDate.dayOfWeek}` : `${vals.startDate.dayOfWeek} - ${vals.finishDate.dayOfWeek}`}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="details">

                    ${vals.imgURL !== null ? `<img src="${vals.imgURL}" alt="Event Image"></img>` : ``}

                    <div class="text">

                        <div class="title">${vals.title}</div>
                        ${vals.venue !== null ? `<div class="venue"><i class="far fa-building"></i> ${vals.venue}</div>` : ``}
                        ${vals.time !== null ? `<div class="time"><i class="far fa-clock"></i> ${vals.time}</div>` : `` }


                        ${vals.description !== null ? `<div class="description">${vals.description}</div>` : `` }

                    </div>
                </div>

            </div>
        `
    }


};