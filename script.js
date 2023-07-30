let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtn = document.querySelector(".capture-btn");
let recordFlag = false;
let transparentColor = "transparent";

let recorder;
let chunks = [] //media data in chunks

let constraints = {
    video: true,
    audio: false
}

//navigator -> global, brower info
window.navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
    video.srcObject = stream;

    recorder = new MediaRecorder(stream); 
    recorder.addEventListener("start",(e)=>{
        chunks=[];
    })
    recorder.addEventListener("dataavailable",(e) =>{
        chunks.push(e.data);
    })
    recorder.addEventListener("stop",(e) => {
       //conversion of media chunks data into video
       let blob = new Blob(chunks,{type: "video/mp4"});
       let videoURL = window.URL.createObjectURL(blob);

       //make a transaction
       if(db){
        let videoId = shortid();
        let dbTransaction = db.transaction("video", "readwrite");
        let videoStore = dbTransaction.objectStore("video");
        let videoEntry = {
            id : `video-${videoId}`,
            blobData : blob
        }
        videoStore.add(videoEntry);
       }

    //    let a = document.createElement("a");
    //    a.href=videoURL;
    //    a.download = "stream.mp4";
    //    a.click();
    })
})

recordBtnCont.addEventListener("click", (e)=>{
    timer.style.display = "block";
    if(!recorder) return;
    recordFlag = !recordFlag;

    if(recordFlag){//start
        recorder.start();
        recordBtn.classList.add("scale-record");
        startTimer();
    }else{//end
        recorder.stop();
        recordBtn.classList.remove("scale-record");
        endTimer();
    }
})

captureBtnCont.addEventListener("click",(e) => {
    captureBtn.classList.add("scale-capture");
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d"); //by doing this we get access of tool
    tool.drawImage(video, 0, 0, canvas.width, canvas.height); //get frame from video 
    //filtering
    tool.fillStyle = transparentColor; //sets color
    tool.fillRect(0, 0, canvas.width, canvas.height); //sets color acc to the given dimension

    let imageURL = canvas.toDataURL();
    if(db){
        let imageId = shortid();
        let dbTransaction = db.transaction("image", "readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id : `img-${imageId}`,
            url : imageURL
        }
        imageStore.add(imageEntry);
       }

    setTimeout(() => {
        captureBtn.classList.remove("scale-capture");
    }, 500)   

    // let a = document.createElement("a");
    //    a.href=imageURL;
    //    a.download = "image.jpg";
    //    a.click();
})

let timerID;
let counter = 0;//represnts total seconds 
let timer = document.querySelector(".timer");
function startTimer() {
    function displayTimer(){
        let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds/3600);
        totalSeconds = totalSeconds % 3600; //remaining value

        let minutes = Number.parseInt(totalSeconds/60);
        totalSeconds = totalSeconds % 60;

        let seconds =totalSeconds;

        hours =(hours < 10) ? `0${hours}` : hours;
        minutes =(minutes < 10) ? `0${minutes}` : minutes;
        seconds =(seconds < 10) ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;

        counter++;
    }

    timerID = setInterval(displayTimer,1000);
}
function endTimer() {
    clearInterval(timerID);
    timerID.innerText = "00:00:00";
    timer.style.display = "none";
}


//Filtering Logic
let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");
allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) => {
        //set 
        // transparentColor = filterElem.style.backgroundColor;
        //get
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = transparentColor;
    })
})

