// TODO: Integrate input box for images with backend

(function() {
  var hasTakenPhoto = false;

  // HTML DOM elents
  var camerabutton = null;
  var submitbutton = null;

  var formSubmitURL = "/yo";

  function startup() {
 
    camerabutton = document.getElementById('camerabutton');
    submitbutton = document.getElementById('submitbutton');

    camerabutton.addEventListener('click', function(ev){
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
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
    hasTakenPhoto = true;
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
