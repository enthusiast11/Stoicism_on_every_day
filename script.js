let mainArea = document.querySelector(".main__area")
let db;
let openRequest = indexedDB.open('Stoicism', 1)
openRequest.onerror = () => console.log(openRequest.error);
openRequest.onupgradeneeded = function(e) {       
    db = e.target.result    
}
openRequest.onsuccess = (e) => {
    db = e.target.result 

    let transaction = db.transaction("allQuotes", "readwrite")
    let allQuotes = transaction.objectStore("allQuotes")
    
    let data = allQuotes.get(curentDay())
    
    data.onsuccess = (e) => {
        
        mainArea.innerHTML= data.result.date + "<br>"  + data.result.head + "<br>" + data.result.quote + "<br>" + data.result.writer 
        let commentArea = document.querySelector(".from__field")
        let saveBtn = document.querySelector(".form__btn-save")
        saveBtn.addEventListener("click", function() {
            
            if(commentArea.value == "") {
                alert("Вы не ввели комментарий")
                return
            }
            data.result.comment = commentArea.value
            let request = db.transaction("allQuotes", "readwrite").objectStore("allQuotes").delete(curentDay());
            request = db.transaction("allQuotes", "readwrite").objectStore("allQuotes").put(data.result);
            db.transaction("Bookmarks", "readwrite").objectStore("Bookmarks").put(data.result);
            alert("Комментарий добавлен")
            alert("Цитата сохранена")
        })   
    }
    let bookmarkIcon = document.querySelector(".main__bookmark")
    bookmarkIcon.addEventListener("click", () => {
        let request = db.transaction("Bookmarks", "readwrite").objectStore("Bookmarks").put(data.result);
        alert("Цитата сохранена")
    })
    

}
function curentDay() {
    let currentdate = new Date();
    let oneJan = new Date(currentdate.getFullYear(),0,1);
    let curentDayOfYear = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000)+3);
    return curentDayOfYear
}


