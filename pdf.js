function Quotes(date,head, quote, writer, id, comment= "")  {
    this.date = date,
    this.head= head,
    this.quote = quote,
    this.writer= writer,
    this.comment = comment,
    this.id= id
}


let errPage = [24, 42, 53, 58, 65, 73, 90, 100, 104, 124, 133, 135, 142, 149, 153, 
    160, 161, 162, 194, 203, 209, 214, 228, 260, 265, 276, 293, 294, 295, 296, 302, 306,
    308, 318, 325, 332, 364, 367, 372, 374, 376, 379, 389, 395, 402, 423, 429, 433,]
//Страница 388, будь на чеку

let db;
let openRequest = indexedDB.open('Stoicism', 1)
openRequest.onerror = () => console.log(openRequest.error);
openRequest.onupgradeneeded = function(e) {       
    db = e.target.result
    if (!db.objectStoreNames.contains('allQoutes')) {
        db.createObjectStore("allQuotes", {keyPath: "id", autoIncriment: true})
        let bM = db.createObjectStore("Bookmarks", {keyPath: "id", autoIncriment: true})
        let index = bM.createIndex("date__index", "date")
    }     
}

function init() {
    openRequest.onsuccess = () => {
        let id=0
        for( let n=23; n<437; n++) {
           
            let todayText = [];
            if(errPage.includes(n)) continue
            id++
            let today = document.querySelector(`#page${n}-div`);
            for ( let i=3; i<11; i++) {
                if (today.childNodes[i].innerHTML == undefined) continue
                todayText.push(today.childNodes[i].innerHTML)
            
            }
        
            let qoute = new Quotes(todayText[0], todayText[1],todayText[2],todayText[3], id )
                db=openRequest.result
                let transaction = db.transaction("allQuotes", "readwrite")
                let allQuotes = transaction.objectStore("allQuotes")
                allQuotes.put(qoute)



        

        }
    }
       
}; 
init()

