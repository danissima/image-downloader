"use strict";
let dropzone = document.getElementById("downloader"),
    fileInput = document.getElementById("file"),
    arrImages = [],
    cells = document.querySelectorAll(".cell"),
    progressBar = document.getElementById("progressBar");

//Codding input//
(function() { 
    dropzone.ondrop = function() {
        fileInput.style.display = "none";
        this.classList.remove("dragover");
    }
    
    dropzone.ondragover = function() {
        this.classList.add("dragover");
        fileInput.style.display = "block";
        return false;
    };
    
    dropzone.ondragleave = function() {
        this.classList.remove("dragover");
        return false;
    };
    
}());

let items = document.querySelectorAll(".item"),
    imgsPreview = document.querySelectorAll(".item img"),
    imgsNames = document.querySelectorAll(".item p");

//Files appears and you can drag them//
fileInput.addEventListener("change", () => {
    //Creating an array of images if they are less than 32 MB//
    if (Array.from(fileInput.files).every(img => img.size < 32000000)) {
        for (let img of fileInput.files) {
            if (arrImages.every(item => item.name != img.name)) arrImages.unshift(img);
        }
        
        document.querySelector(".downloader input + p").textContent = "Maximum upload file size: 32 MB.";
        
        //Creating a containers inside the cells//
        for (let i = 0; i < arrImages.length; i++) {
            if (Array.from(imgsNames).every(item => item.innerHTML != arrImages[i].name)) {
                if (cells[i].innerHTML == "") {
                    cells[i].innerHTML = "<div class='item'><img><p></p></div>";
                }

                //Putting pictures and their names inside the cells//
                items = document.querySelectorAll(".item");
                imgsPreview = document.querySelectorAll(".item img");
                imgsNames = document.querySelectorAll(".item p");
                
                imgsNames[i].textContent = arrImages[i].name;
                imgsNames[i].classList.add("taked");
                items[i].draggable = "true";
                items[i].style.cursor = "pointer";
                
                let maxValue = 100 / arrImages.length;
                let reader = new FileReader();
                // reader.onprogress = function(e) {
                    // let percent = Math.round((e.loaded / e.total) * maxValue) ;
                    // if (percent < progressBar.max) {
                        // progressBar.value += percent;
                    // }
                    // console.log("processing...");
                // }
                reader.onload = function() {
                    if (i == arrImages.length - 1) {
                        progressBar.value = 100;
                        setTimeout(() => progressBar.value = 0, 1000);
                        console.log("loaded");                        
                    } else {
                        progressBar.value += maxValue;
                    }
                    imgsPreview[i].src = reader.result;
                }
                reader.readAsDataURL(arrImages[i]);
            }
        }
    //Drag and Drop//
        let dragged = null, picPosition = null;
        for (let i = 0; i < items.length; i++) {
            items[i].ondragstart = function(e) {
                dragged = items[i];
                picPosition = e.path[1];
                setTimeout(() => {
                    this.style.display = "none";
                }, 0);
            }

            items[i].ondragend = function() {
                dragged.style.display = "flex";
                dragged = null;
                picPosition = null;
            }
            
//            cells[i].ondragenter = function(e) {
//                e.preventDefault();
//                setTimeout(() => cells[Array.from(items).indexOf(dragged)].append(items[i]), 0);
//            }
//            cells[i].ondragleave = function() {
//                this.append(items[i]);
//            }

            for (let j = 0; j < cells.length; j++) {

                cells[j].ondragover = function(e) {
                    e.preventDefault();

                };

                cells[j].ondragenter = function(e) {
                    e.preventDefault();
                };

                cells[j].ondrop = function(e) {
                    if (this.innerHTML != "") {
                        picPosition.append(this.firstElementChild);
//                        picPosition.firstElementChild.ondragstart = function() { 
//                            dragged = items[i];
//                            picPosition = e.path[1];
//                            setTimeout(() => {
//                                this.style.display = "none";
//                            }, 0);
//                        }
//                        picPosition.firstElementChild.ondragend = function() {
//                            dragged.style.display = "flex";
//                            dragged = null;
//                            picPosition = null;
//                        }
                        this.innerHTML = "";
                    }
                    this.append(dragged);
                    let newItems = document.querySelectorAll(".item"), newArr = [];
                    for (let k = 0; k < newItems.length; k++) {
                        newArr.push(arrImages[arrImages.indexOf(arrImages.filter(item => item.name == newItems[k].textContent)[0])]);
                    }
                    arrImages = newArr;
                };
            }
        }
    } else {
        document.querySelector(".downloader input + p").textContent = "Wowowow, it's too big bruh!";
    }
    
});