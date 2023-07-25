let mainArea = document.querySelector(".main__area")
let db;
let openRequest = indexedDB.open('Stoicism', 1)
openRequest.onerror = () => console.log(openRequest.error);
openRequest.onupgradeneeded = (e) => db = e.target.result    
openRequest.onsuccess = (e) => {
    db = e.target.result
    
    
    
    
    init()
    let cardsArea = document.querySelector(".cards__area")
    cardsArea.addEventListener("click", function(e) {
        let target = e.target
        if (target.className == "form__btn-del"){
            target.closest(".cards__card").remove()
            
            let key =target.closest(".cards__card").querySelector(".card__date").innerHTML.toUpperCase()
            console.log(key);
            let priceIndex = startTransaction("Bookmarks").index("date__index");
            let request = priceIndex.getKey(key);

            request.onsuccess = function() {
              let id = request.result;
              let delComm = startTransaction("allQuotes").get(id)
              console.log(delComm);
              delComm.onsuccess = () => {
                console.log(delComm.result);
                delComm.result.comment = " "
                startTransaction("allQuotes").delete(id);
                startTransaction("allQuotes").put(delComm.result);
                console.log(delComm);
              }
             startTransaction("Bookmarks").delete(id);
                
              alert("Закладка успешно удалена")

            };  
        }
        return
    })

}
function init() {
    store = db.transaction("Bookmarks", "readonly").objectStore("Bookmarks");
    store.getAll().onsuccess = function(e){
        let bookmarksArray = e.target.result
        for ( let item of bookmarksArray) {
            let card = 
            `<div class="cards__card card">
                <div class="card__main">${item.quote}</div>
                <div class="card__options">
                    <table>
                        <tr>
                            <td>Автор:</td>
                            <td>${item.writer}</td>
                           
                        </tr>
                        <tr>
                            <td>Дата:</td>
                            <td class="card__date">${item.date.toLowerCase()}</td>
                        </tr>
                        <tr>
                            <td>Комментарий:</td>
                        </tr>
                     </table>
                    <div class="card__comment"> ${item.comment}</div>
                    <button class="form__btn-del">Удалить</button>
                </div>
            </div>`
            document.querySelector(".cards__area").insertAdjacentHTML('afterbegin', card)
        }
        console.log(e.target.result);
    };
}
function startTransaction (storeName) {
    return db.transaction(storeName, "readwrite").objectStore(storeName)
}