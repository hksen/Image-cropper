
let image;
let containerImg; 
let cropper; 
let range; 

let mouseMove = false;
let mouseDown = false;

let initMouseX = 0; 
let initMouseY = 0; 

let initImageX = 0; 
let initImageY = 0; 

let ratio = 1;
const margin = 50; 

const buttonUpload = document.querySelector('.upload-button');

// function to handle the image upload event
function imageUploaded(element){

    document.querySelector('.cropper-container').innerHTML = ''; 
    
    buttonUpload.style.display = "none"; 

    // verifiy if the file type is correct
    if (element.files[0].type === 'image/png' || element.files[0].type === 'image/jpeg') {

        // create a new FormData object to send the uploaded file to the server
        var file = element.files[0];
        var formData = new FormData();

        formData.append("file", file);

        // retrieve the cropper container via jQuery AJAX
        $.ajax({
            url: 'cropper.html',
            type: 'GET',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {

            $('.error-handling-container').remove(); 
            $('.cropper-container').html(response);
            $('.upload-button').remove();

    
            var reader = new FileReader();
            reader.onload = function(){
                document.getElementById("img").src = reader.result;
            }
            reader.readAsDataURL(file);

                image = document.getElementById('img'); 
                containerImg = document.getElementById('fileDisplay');
                cropper = document.getElementById('cropper');
                range = document.getElementById('range'); 

                cropContainer = document.querySelector('.crop-image-container'); 

                cropper.style.top = containerImg.offsetTop;

                image.onload = function(){

                    reset_image(); 
                    var originalImageWidth = image.clientWidth; 
                    var originalImageHeight = image.clientHeight; 

                    // when the mouse is moved, check if the mouseMove and mouseDown variables are true and move the image accordingly
                    window.onmousemove = function(event){

                        if(mouseMove && mouseDown){

                            var x = event.clientX - initMouseX; 
                            var y = event.clientY - initMouseY; 

                            x = initImageX + x; 
                            y = initImageY + y; 

                            if (x > 0){x = 0}; 
                            if(y > 0){y = 0}; 

                            xlimit = containerImg.clientWidth - image.clientWidth; 
                            ylimit = containerImg.clientHeight - image.clientHeight; 

                            if(x < xlimit){x = xlimit}; 
                            if(y < ylimit){y = ylimit};

                            image.style.left = x + "px"; 
                            image.style.top = y +"px"; 
                        }

                    }

                    function reset_image(){

                        if(image.naturalWidth > image.naturalHeight)
                        {
                            ratio = image.naturalWidth / image.naturalHeight; 

                            image.style.height = containerImg.clientHeight + "px"; 
                            image.style.width = (containerImg.clientWidth * ratio) + "px"; 

                            image.style.top = 0; 
                            
                            var extra = (image.clientWidth - containerImg.clientWidth) / 2;
                            image.style.left = (extra * -1)+ "px"; 

                        }else if (image.naturalWidth < image.naturalHeight)
                        {

                            ratio = image.naturalWidth / image.naturalHeight; 

                            image.style.width = containerImg.clientWidth  + "px"; 

                            image.style.top = 0; 

                            var extra = (image.clientWidth - containerImg.clientWidth) / 2;
                            image.style.left = (extra * -1)+ "px"; 

                        }else if(image.naturalWidth == image.naturalHeight)
                        {
                            image.style.width = containerImg.clientWidth  + "px"; 
                            image.style.height = containerImg.clientHeight + "px"; 
                        }
                    }

                    range.value = 10; 

                    range.addEventListener('mousemove', function() {

                        var w = image.clientWidth;
                        var h = image.clientHeight; 

                        image.style.width = (range.value / 10) * originalImageWidth + "px"; 
                        image.style.height = (range.value / 10) * originalImageHeight + "px";

                        var w2 = image.clientWidth;
                        var h2 = image.clientHeight; 

                        if(w - w2 != 0){

                            var diff = (w - w2) / 2; 
                            var diff2 = (h - h2) / 2; 

                            var x = image.offsetLeft + diff; 
                            var y = image.offsetTop + diff2;

                            if (x > 0){x = 0}; 
                            if(y > 0){y = 0}; 

                            xlimit = containerImg.clientWidth - image.clientWidth; 
                            ylimit = containerImg.clientHeight - image.clientHeight; 

                            if(x < xlimit){x = xlimit}; 
                            if(y < ylimit){y = ylimit}; 

                            image.style.left = x + "px"; 
                            image.style.top =  y + "px"; 
                        }
                        
                    });

                }

                window.onmouseup = function(){
                    mouseDown = false; 
                }

            }
        });

    } else {
        $.ajax({
            url: 'error.html',
            type: 'GET',
            data: {

            },
            success: function(response) {
                $('.error-handling').html(response);
            }});
    }



};


function mouseDown_on(event){

    mouseDown = true; 

    initMouseX = event.clientX; 
    initMouseY = event.clientY; 

    measureLeft = cropContainer.offsetLeft - containerImg.offsetLeft; 
    measureTop = cropContainer.offsetTop - containerImg.offsetTop; 


    initImageX = (image.offsetLeft - containerImg.offsetLeft); 
    initImageY = image.offsetTop - containerImg.offsetTop; 
    
} 

function mouseDown_off(){
    mouseDown = false; 
}

function mouseMove_on(){
    mouseMove = true; 
}

function mouseMove_off(){
    mouseMove = false; 
}

function crop() {

    var img = new Image();
    img.src = image.src;
    img.onload = function() {
        if (img.naturalWidth > img.naturalHeight) {
            ratio = img.naturalHeight / containerImg.clientHeight;
        } else {
            ratio = img.naturalWidth / containerImg.clientWidth;
        }

        var x1 = image.style.left; 
        x1 = x1.replace("px", ""); 
        if (x1 < 0) { x1 = x1 * -1 };

        var y1 = image.style.top; 
        y1 = y1.replace("px", ""); 
        if (y1 < 0) { y1 = y1 * -1 }; 

        var x2 = (x1 + containerImg.clientWidth); 
        var y2 = (y1 + containerImg.clientHeight); 

        var width = (x2 - x1) * ratio; 
        var height = (y2 - y1) * ratio; 

        x1 *= ratio; 
        y1 *= ratio; 

        var zoomFactor = (range.value / 10); 
        x1 = x1 / zoomFactor; 
        y1 = y1 / zoomFactor; 
        width = width / zoomFactor; 
        height = height / zoomFactor; 

        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, x1, y1, width, height, 0, 0, width, height);

        var croppedImg = new Image();
        croppedImg.src = canvas.toDataURL();
        var outputDiv = document.getElementById("output");
        outputDiv.innerHTML = ''; 
        outputDiv.appendChild(croppedImg);

    }
}

