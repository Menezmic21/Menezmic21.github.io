const mySpan = document.getElementById('mySpan');

mySpan.addEventListener('click', function() {
    if (!document.fullscreenElement) {
        if (mySpan.requestFullscreen) {
            mySpan.requestFullscreen();
        } else if (mySpan.webkitRequestFullscreen) { /* Safari */
            mySpan.webkitRequestFullscreen();
        } else if (mySpan.msRequestFullscreen) { /* IE11 */
            mySpan.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }
});

// Optionally add a class for fullscreen styling
mySpan.addEventListener('fullscreenchange', function() {
    if (document.fullscreenElement) {
        mySpan.classList.add('fullscreen');
    } else {
        mySpan.classList.remove('fullscreen');
    }
});
mySpan.addEventListener('webkitfullscreenchange', function() {
    if(document.webkitFullscreenElement){
        mySpan.classList.add('fullscreen');
    } else {
        mySpan.classList.remove('fullscreen');
    }
});
mySpan.addEventListener('msfullscreenchange', function() {
    if(document.msFullscreenElement){
        mySpan.classList.add('fullscreen');
    } else {
        mySpan.classList.remove('fullscreen');
    }
});