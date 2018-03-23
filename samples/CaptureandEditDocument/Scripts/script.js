var dcsObject, imageViewer, documentEditor, curIndex;

//Success callback function for dynamsoft.dcsEnv.init()
function onInitSuccess(videoViewerId, imageViewerId) {
    dcsObject = dynamsoft.dcsEnv.getObject(videoViewerId); //Get the Dynamsoft Camera SDK object
    imageViewer = dcsObject.getImageViewer(imageViewerId); //Get a specific image viewer
	dcsObject.videoviewer.setMode(dcsObject.videoviewer.EnumMode.Document);
    dcsObject.videoviewer.setAllowCaptureUndetectedDocument(true);

    var cameraList = dcsObject.camera.getCameraList(); //Get a list of available cameras
    if (cameraList.length > 0) {
		//Call this method to take the ownership back, 
        //in case the first camera in the list is occupied by another Dynamsoft Camera process.
        dcsObject.camera.takeCameraOwnership(cameraList[0]);
        dcsObject.camera.playVideo();
    } else {
        alert('No camera is connected.');
    }
	showLoadingLayer(false);
}

//Failure callback function for dynamsoft.dcsEnv.init()
function onInitFailure(errorCode, errorString) {
    alert('Init failed: ' + errorString);
	
	showLoadingLayer(false);
};

function onBtnGrabClick() {
    if (!dcsObject) return;

	dcsObject.camera.captureDocument('image-container');
	
    if (dcsObject.getErrorCode() !== EnumDCS_ErrorCode.OK) {
        alert('Capture error: ' + dcsObject.getErrorString());
    };
	
	if(imageViewer.image.getCount()!=0){
		document.getElementById("btn-showDocumentEditor").classList.add('active');
	};
};

//Open the document editor
function onBtnShowDocumentEditor(){
	if (!dcsObject) return;
	if(imageViewer.image.getCount()==0) return;
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
	document.body.style.overflow = 'hidden';
    var documentEditorWrapper = document.getElementById("documentEditorWrapper");
	documentEditorWrapper.style.visibility = 'visible';
	updateDocumentEditor();
	
	dcsObject.addDocumentEditor('document-container');
	documentEditor = dcsObject.getDocumentEditor('document-container');
	curIndex = imageViewer.image._getIndex();
	imageViewer.image.editDocument('document-container',curIndex);
};

//show loading layer
showLoadingLayer(true);

//initiate Dynamsoft Camera SDK object
dynamsoft.dcsEnv.init('video-container', 'image-container', onInitSuccess, onInitFailure); 

//destroy Dynamsoft Camera SDK object when the page is closed
window.onbeforeunload = function() {
    if (dcsObject) dcsObject.destroy();
};

//triggered when dcs service is not found
dynamsoft.dcsEnv.ondcsnotfound = function() {
    showLoadingLayer(false);
	return false;
};

//show or hide loading layer
function showLoadingLayer(bShow){
	var loaderContent = document.getElementById('loaderContent'),
		elLoadingLayer = document.getElementById('loadingLayer');

	loaderContent.style.display = bShow ? 'block' : 'none';
	elLoadingLayer.style.display = bShow ? 'block' : 'none';
}

//Adaptive Document Editor when the window changes the size
window.onresize = function(){
   if (!dcsObject) return;
   if (!documentEditor) return;
   updateDocumentEditor();
   fitWindow();
   fitWindow();
};

function fitWindow(){
   var documentContainerH = document.getElementById("document-container").clientHeight,
       documentContainerW = document.getElementById("document-container").clientWidth;
   documentEditor.documentCtrl.documentEditorWidth = documentContainerW;
   documentEditor.documentCtrl.documentEditorHeight = documentContainerH;   
   documentEditor.ui._documentContainerWrapper.style.width = documentContainerW + 'px';
   documentEditor.ui._documentContainerWrapper.style.height = documentContainerH + 'px';
   documentEditor.ui._documentContainerBox.style.width = documentContainerW + 'px';
   documentEditor.ui._documentContainerBox.style.height = documentContainerH + 'px';
   documentEditor.documentCtrl.fitDocument();
};

//Document editing operation
function onBtntoColor(){
    if (!documentEditor) return;
	documentEditor.document.toColor();
};
function onBtntoGray(){
    if (!documentEditor) return;
	documentEditor.document.toGrey();
};
function onBtntoBW(){
    if (!documentEditor) return;
	documentEditor.document.toBlackWhite();
};

function onBtnRotateL(){
    if (!documentEditor) return;
	documentEditor.document.rotateLeft();
};
function onBtnRotateR(){
    if (!documentEditor) return;
	documentEditor.document.rotateRight();
};

function onBtnBrightnessIn(){
	if (!documentEditor) return;
	documentEditor.document.adjustBrightness(-5);
}
function onBtnBrightnessOut(){
	if (!documentEditor) return;
	documentEditor.document.adjustBrightness(5);
}

function onBtnContrastIn(){
	if (!documentEditor) return;
	documentEditor.document.adjustContrast(-5);
}
function onBtnContrastOut(){
	if (!documentEditor) return;
	documentEditor.document.adjustContrast(5);
}

function onBtnzoomIn(){
	if (!documentEditor) return;
	var curZoom = documentEditor.ui.getZoom()
	documentEditor.ui.setZoom(curZoom-0.2);
}
function onBtnzoomOut(){
	if (!documentEditor) return;
	var curZoom = documentEditor.ui.getZoom()
	documentEditor.ui.setZoom(curZoom+0.2);
}

function onBtnDiscard(){
    if (!documentEditor) return;
	var documentEditorWrapper = document.getElementById("documentEditorWrapper");
	documentEditorWrapper.style.visibility = 'hidden';
	documentEditor.document.discard();
	document.body.style.overflow = '';
};

function onBtnSave(){
    if (!documentEditor) return;
	var documentEditorWrapper = document.getElementById("documentEditorWrapper");
	documentEditorWrapper.style.visibility = 'hidden';
	documentEditor.document.save()
	document.body.style.overflow = '';
};

//Initialize the document editor
function updateDocumentEditor(){
	var documentEditorWrapper = document.getElementById("documentEditorWrapper"),
       documentEditorContainer = document.getElementById("documentEditorContainer"),
	   toolGroup = document.getElementById("toolGroup"),
	   toolItem = document.getElementById("toolGroup").getElementsByTagName('li'),
	   documentContainer = document.getElementById("document-container");
    var documentEditorWrapperH = documentEditorWrapper.clientHeight,
	    documentEditorWrapperW = documentEditorWrapper.clientWidth,
		toolGroupH,documentContainer = document.getElementById("document-container");
		documentEditorContainer.style.height = documentEditorWrapperH*0.96+'px';
		documentEditorContainer.style.width = documentEditorWrapperW*0.98+'px';
		documentEditorContainer.style.marginTop = documentEditorWrapperH*0.02+'px';
	var maxHeight = documentEditorWrapperH*0.96*0.2;
	if(maxHeight>54){
		maxHeight = 54;
		}else if(maxHeight<45){
			maxHeight = 45;
			};
	toolGroup.style.height = maxHeight+'px';
	for(var i=0;i<toolItem.length;i++){
		toolItem.item(i).style.paddingTop = (maxHeight-30)/2+'px';
		};
	documentContainer.style.height = (documentEditorWrapperH*0.96 - 2*maxHeight)+'px';
	if(documentContainer.clientHeight<40){
	    documentContainer.style.height = 40+'px';
	};
	documentContainer.style.width = (documentEditorWrapperW*0.98 - maxHeight)+'px';
	documentContainer.style.marginTop = maxHeight/2+'px';
};


