const video = document.getElementById('video');

const constrains = {
    video: {}
};

var videoUtils = {
    stream: function (stream) {
        video.srcObject = stream;
    },
    error: function (err) {
        console.log(err);
    },
    initVideo: function () {
        var promise = navigator.mediaDevices.getUserMedia(constrains).then(this.stream).catch(this.error);
    }
};

(function (videoUtils) {
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    ]).then(videoUtils.initVideo());

    video.addEventListener('play', function () {
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);
        
        const displaySize = {
            width: video.width,
            height: video.height    
        };

        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();
                
            const resizeDetections = faceapi.resizeResults(detections, displaySize);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

            faceapi.draw.drawDetections(canvas, resizeDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizeDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizeDetections);

        }, 100);
    })

})(videoUtils);


