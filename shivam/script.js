// from https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos
(function() {
  var width = 320;
  var height = 0; // computer based on stream
  var streaming = false;
  var hasTakenPhoto = false;

  // HTML DOM elents
  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;
  var submitbutton = null;

  var formSubmitURL = "/yo";

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');
    submitbutton = document.getElementById('submitbutton');

    // get appropriate getMedia function based on browser
    navigator.getMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);

    navigator.getMedia(
      {
        video: true,
        audio: false
      },
      function(stream) {
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        }
        else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL.createObjectURL(stream);
        }
        video.play();
      },
      function(err) {
        console.log("An error occured! ", err);
      }
    );

    video.addEventListener('canplay', function(ev) {
      if (!streaming) {
        // proportionally set height based on stream height
        height = video.videoHeight / (video.videoWidth/width);

        // firefox bug: can't read height from video, so set height to 4:3
        if (isNaN(height)) {
          height = width / (4/3);
        }
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev){
      takepicture();
      ev.preventDefault();
    }, false);

    submitbutton.addEventListener('click', function(ev){
      submit();
    }, false);

    clearphoto();
  }

  // fill photo screen to indicate no photo has been taken
  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
    hasTakenPhoto = false;
  }

  // take picture by drawing contents of video into canvas and converting
  // it into a PNG format data URL.
  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
      hasTakenPhoto = true;
    } else {
      clearphoto();
    }
  }

  function submit() {
    var userData = getValidatedFields();
    var formData = new FormData();
    var xhr = new XMLHttpRequest();

    formData.append('name', userData.name);
    formData.append('email', userData.email);

    if (hasTakenPhoto) {
      var imageDataURI = photo.getAttribute('src');
      console.log(imageDataURI);
      var blob = dataURItoBlob(imageDataURI);
      formData.append('photo', blob);
    }

    logFormData(formData);
    xhr.open('POST', formSubmitURL);
    xhr.send(formData);
  }

  function getValidatedFields() {
    var data = {};
    var name = document.getElementById('inputName').value;
    var email = document.getElementById('inputEmail').value;

    data.name = name;
    data.email = email;
    return data;
  }

  // http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
  function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
  }

  function logFormData(formData) {
    for(var pair of formData.entries()) {
       console.log(pair[0]+ ', ', pair[1]);
    }
  }

  window.addEventListener('load', startup, false);
})();
