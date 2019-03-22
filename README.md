# Dynamsoft Camera SDK

version 6.1

## Introduction
[Dynamsoft Camera SDK][1] provides JavaScript APIs that enable you to easily capture images and video streams from USB Video Class (UVC) compatible webcams from within a browser. With the browser-based webcam library, you can capture a live video stream into a container and grab an image with a couple lines of code in your web application.

## Download
http://www.dynamsoft.com/Downloads/dynamsoft-webcam-sdk-download.aspx

## API Reference
http://developer.dynamsoft.com/dws/api-reference.

## Samples
http://www.dynamsoft.com/Downloads/dynamsoft-webcam-sdk-sample-download.aspx

## Features
* Developers can have complete control over a webcam, e.g., exposure, iris, auto focus, etc.
* One Dynamsoft Webcam SDK object can have one video viewer and multiple image viewers. Image viewers can be dynamically created and destroyed.
* Supports embedding video stream in a browser
* Supports image editing
* Supports importing from DIB and exporting to base64 and DIB
* Uploads specified images to an HTTP server. Both sync and async modes are supported.
* [More][2]

## Getting Started: Hello World
---------------------------------
1. Create a new web project and copy the **DCSResources** folder to your project:
2. Create an HTML page and include the JavaScript libraries in sequence:

    ```HTML
    <script type="text/javascript" src="DCSResources/dynamsoft.camera.config.js"> </script>
    <script type="text/javascript" src="DCSResources/dynamsoft.camera.initiate.js"> </script>
    ```
3. Add video and image container:

    ```HTML
    <div class="content-container">
		<div class="tc">
			<div id="video-container" class="main-container inline-block"></div>
			<div id="image-container" class="main-container inline-block ml15"></div>
		</div>
		<div class="tc mt50">
			<a id="btn-grab" class="btn-grab" onclick="onBtnGrabClick()">Grab</a>
		</div>
	</div>
    ```

5. Add following JavaScript code to initialize containers and capture images:

    ```JavaScript
    var dcsObject, imageViewer;

    //Success callback function for dynamsoft.dcsEnv.init()
    function onInitSuccess(videoViewerId, imageViewerId) {
        dcsObject = dynamsoft.dcsEnv.getObject(videoViewerId); //Get the Dynamsoft Camera SDK object
        imageViewer = dcsObject.getImageViewer(imageViewerId); //Get a specific image viewer

        var cameraList = dcsObject.camera.getCameraList(); //Get a list of available cameras
        if (cameraList.length > 0) {
            //Call this method to take the ownership back, 
            //in case the first camera in the list is occupied by another Dynamsoft Camera process.
            dcsObject.camera.takeCameraOwnership(cameraList[0]);
            dcsObject.camera.playVideo();
        } else {
            alert('No camera is connected.');
        }
    }

    //Failure callback function for dynamsoft.dcsEnv.init()
    function onInitFailure(errorCode, errorString) {
        alert('Init failed: ' + errorString);
    };

    function onBtnGrabClick() {
        if (!dcsObject) return;

        dcsObject.camera.captureImage('image-container');

        if (dcsObject.getErrorCode() !== EnumDCS_ErrorCode.OK) {
            alert('Capture error: ' + dcsObject.getErrorString());
        }
    };

    //initiate Dynamsoft Camera SDK object
    dynamsoft.dcsEnv.init('video-container', 'image-container', onInitSuccess, onInitFailure); 

    //destroy Dynamsoft Camera SDK object when the page is closed
    window.onbeforeunload = function() {
        if (dcsObject) dcsObject.destroy();
    };

    ```

## Screenshot
![image](http://www.dynamsoft.com/assets/images/illus-dws-overview-feature.png)

## License Agreement
https://www.dynamsoft.com/Products/webcam-sdk-license.aspx

[1]:http://www.dynamsoft.com/Products/dynamsoft-webcam-sdk.aspx
[2]:http://www.dynamsoft.com/Products/webcam-sdk-features.aspx
