const months = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

function buildFooter() {
    document.getElementsByClassName("footer").item(0).innerHTML = `
    <div class="images">
        <a href="http://www.vexpan.nl" target="_blank"> <img src="images/vexpan.gif" alt="vexpan"/> </a>
        <a href="http://worldparkingsymposium.ca" target="_blank"> <img src="images/WPS.png" alt="World Parking Symposium"/> </a>
    </div>`;

}

function buildMenu() {
    const _list = [
        {
            link: "index.html",
            name: "Home",
        },
        {
            link: "bereikbaarheidsvisies.html",
            name: "Bereikbaarheidsvisies",
        },{
            link: "centrumgebieden.html",
            name: "Centrumgebieden",
        },{
            link: "effectrapportages.html",
            name: "Effectrapportages",
        },{
            link: "goederenverkeer.html",
            name: "Goederenverkeer",
        },{
            link: "papers.html",
            name: "Papers",
        },{
            link: "parkeervoorzieningen.html",
            name: "Parkeervoorzieningen",
        },{
            link: "parkeren.html",
            name: "Parkeren",
        },{
            link: "publicaties.html",
            name: "Publicaties",
        },{
            link: "verkeersontsluiting.html",
            name: "Verkeersontsluiting",
        },
    ];

    _list.forEach((item) => document.getElementsByClassName("menu").item(0).innerHTML += `<a class="menu" href="${item.link}">${item.name}</a></br>`);
} 

function buildList(page) {
    const subset = data[page];

    switch(page) {
        case "papers":
            subset.sort((a, b) => {
                const aDay   = a.date.day || (a.date.daySpan ? a.date.daySpan.higher : null);
                const bDay   = b.date.day || (b.date.daySpan ? b.date.daySpan.higher : null);
                const aMonth = a.date.month || (a.date.monthSpan ? a.date.monthSpan.higher : null);
                const bMonth = b.date.month || (b.date.monthSpan ? b.date.monthSpan.higher : null);
                const aYear  = a.date.year || (a.date.yearSpan ? a.date.yearSpan.higher : null);
                const bYear  = b.date.year || (b.date.yearSpan ? b.date.yearSpan.higher : null);
                let res = 0;
                if(aDay && bDay) {
                    res += (aDay - bDay)/3100;
                }
                if(aMonth && bMonth) {
                    res += (aMonth - bMonth)/120;
                }
                if(aYear && bYear) {
                    res += (aYear - bYear);
                }
                if(res === 0) {
                    return res;
                }
                return res > 0 ? -1 : 1;
            });
            subset.forEach((item) => {
                let dateString = "";
                if(item.date.daySpan || item.date.day) {
                    dateString += item.date.day || `${item.date.daySpan.lower} - ${item.date.daySpan.lower}`;
                    dateString += " ";
                }
                if(item.date.monthSpan || item.date.month) {
                    dateString += months[item.date.month - 1] || `${months[item.date.monthSpan.lower - 1]} - ${months[item.date.monthSpan.higher - 1]}`;
                    dateString += " ";
                }
                if(item.date.yearSpan || item.date.year) {
                    dateString += item.date.year || `${item.date.yearSpan.lower} - ${item.date.yearSpan.higher}`;
                }
                document.getElementsByClassName("list").item(0).innerHTML += `<li><span class="title">${item.main}</span><br/>${item.sub}${item.location && item.sub? ", " : ""}${item.location || ""}${dateString && (item.sub || item.location) ? ", " : ""}${dateString || ""}</li>`
            });
            break;
        case "parkeren":
            const centrum = subset.centrum;
            centrum.sort((a, b) => {
                const mainA = a.main.toUpperCase();
                const mainB = b.main.toUpperCase();
                if (mainA > mainB){
                    return 1;
                }
                return mainB > mainA ? -1 : 0;
            });
            const specifiek = subset.specifiek;
            specifiek.sort((a, b) => {
                const mainA = a.main.toUpperCase();
                const mainB = b.main.toUpperCase();
                if (mainA > mainB){
                    return 1;
                }
                return mainB > mainA ? -1 : 0;
            });

            centrum.forEach((item) => document.getElementById("centrumgebieden").innerHTML += `<li><span class="title">${item.main}</span><br/>${item.sub}</li>`);
            specifiek.forEach((item) => document.getElementById("specifiek").innerHTML += `<li><span class="title">${item.main}</span><br/>${item.sub}</li>`);
            break;
        case "publicaties":
            const parkeren = subset.parkeren;
            sortPublication(parkeren);
            parkeren.forEach((item) => displayItem(item, "parkeren"));
            const eco = subset.eco;
            sortPublication(eco);
            eco.forEach((item) => displayItem(item, "eco"));
            const bevoor = subset.bevoor;
            sortPublication(bevoor);
            bevoor.forEach((item) => displayItem(item, "bevoor"));
            const vervoer = subset.vervoer;
            sortPublication(vervoer);
            vervoer.forEach((item) => displayItem(item, "vervoer"));
            const onderzoek = subset.onderzoek;
            sortPublication(onderzoek);
            onderzoek.forEach((item) => displayItem(item, "onderzoek"));
            const diversen = subset.diversen;
            sortPublication(diversen);
            diversen.forEach((item) => displayItem(item, "diversen"));
            break;
        default:
            subset.sort((a, b) => {
                const mainA = a.main.toUpperCase();
                const mainB = b.main.toUpperCase();
                if (mainA > mainB){
                    return 1;
                }
                return mainB > mainA ? -1 : 0;
            })
            subset.forEach((item) => document.getElementsByClassName("list").item(0).innerHTML += `<li><span class="title">${item.main}</span><br/>${item.sub}</li>`);
            break;
    }
}

function sortPublication(list) {
    list.sort((a, b) => {
        if(a.edition.year > b.edition.year || a.edition.year < b.edition.year) {
            return a.edition.year > b.edition.year ? -1 : 1;
        }
        if(a.edition.nr && b.edition.nr) {
            if (a.edition.nr > b.edition.nr) {
                return -1;
            }
            return a.edition.nr < b.edition.nr ? 1 : 0;
        }
        if(a.edition.month && b.edition.month) {
            if (a.edition.month > b.edition.month) {
                return -1;
            }
            return a.edition.month < b.edition.month ? 1 : 0;
        }
        return 0;
    })
}

function displayItem(item, id) {
    const edition = item.edition.nr ? `${item.edition.year} nr ${item.edition.nr}` : `${months[item.edition.month - 1]} ${item.edition.year}`;
    document.getElementById(id).innerHTML += `<li><span class="title">${item.title}</span><br/>${item.publication}, ${edition} ${item.with ? "<br/>" : "" } ${item.with ? "(samen met " + item.with + ")" : ""}</li>`
}