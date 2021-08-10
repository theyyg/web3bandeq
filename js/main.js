// Effects
var threeBandEq = new Pizzicato.Effects.ThreeBandEqualizer({
    cutoff_frequency_low: 200,
    cutoff_frequency_high: 4000,
    low_band_gain: -6,
    mid_band_gain: 0,
    high_band_gain: 0,
    low_peak: 0.4,
    mid_peak: 1,
    high_peak: 3
});

// PZ Sound
var sound = new Pizzicato.Sound('https://theyyg.github.io/web3bandeq/audio/nature.ogg', function() {
    // Enable after adding the threeBandEq to Pizzacato
    sound.addEffect(threeBandEq);
});

var threeBandSegment = {
    audio: sound,
    playButton: document.getElementById('play'),
    stopButton: document.getElementById('stop'),
    lowBandSlider: document.getElementById('low-band-gain'),
    midBandSlider: document.getElementById('mid-band-gain'),
    highBandSlider: document.getElementById('high-band-gain'),
    effects: [
	{
	    instance: threeBandEq,
	    parameters: {
                // cutoff_frequency_low: threeBandEq.cutoff_fr3equency_low,
                // cutoff_frequency_high: threeBandEq.cutoff_frequency_high,
                low_band_gain: document.getElementById('low-band-gain'),
                mid_band_gain: document.getElementById('mid-band-gain'),
                high_band_gain: document.getElementById('high-band-gain'),
		// peak: threeBandEq.cutoff_frequency_high
	    }
	}
    ]
};


(function(segment) {

    segment.audio.on('play', function() {
	segment.playButton.classList.add('pause');
        segment.playButton.innerHTML = "Pause";
        visualize();
    });

    segment.audio.on('stop', function() {
	segment.playButton.classList.remove('pause');
        segment.playButton.innerHTML = "Play";
    });

    segment.audio.on('pause', function() {
	segment.playButton.classList.remove('pause');
        segment.playButton.innerHTML = "Play";
    });

    segment.playButton.addEventListener('click', function(e) {
	if (segment.playButton.classList.contains('pause'))
	    segment.audio.pause();
	else
	    segment.audio.play();
    });

    segment.stopButton.addEventListener('click', function(e) {
	segment.audio.stop();
    });

    if (!segment.effects || !segment.effects.length)
	return;

    for (var i = 0; i < segment.effects.length; i++) {
	var effect = segment.effects[i];

	for (var key in effect.parameters) {
	    (function(key, slider, instance){

		var display = slider.parentNode.getElementsByClassName('slider-db')[0];

		slider.addEventListener('input', function(e) {
                    instance[key] = e.target.valueAsNumber;
		    display.innerHTML = e.target.valueAsNumber.toFixed(0) + " dB";
		});

	    })(key, effect.parameters[key], effect.instance);	
	}
    }
    
})(threeBandSegment);

// Visualizer
var canvas = document.getElementById('visualizer');
var canvasCtx = canvas.getContext('2d');

var drawVisual;

function visualize() {
    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    var bufferLength = threeBandSegment.effects[0].instance.visualizerBinCount;
    console.log("Visualizer has " + bufferLength + " bins");
    var dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    var draw = function() {
        let playButton = document.getElementById('play');
        // Stop drawing if audio isn't playing
        if (playButton == null || !playButton.classList.contains('pause'))
            return;
        
        drawVisual = requestAnimationFrame(draw);

        if ( !threeBandSegment.effects || !threeBandSegment.effects.length )
            return;

        WIDTH = canvas.width;
        HEIGHT = canvas.height;
        
        let analyser = threeBandSegment.effects[0].instance.analyser;
        analyser.getByteFrequencyData(dataArray);

        // dataArray.set(threeBandSegment.effects[0].instance.frequencyData, bufferLength);
        
        canvasCtx.fillStyle = 'rgb(256, 256, 256)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        let barWidth = (WIDTH / bufferLength) * 2;
        let barHeight;
        let x = 0;

        for(let i = 0; i < bufferLength; i++) {
            let brightness = dataArray[i] / 256;
            let red = brightness * 249 + (1 - brightness) * 256;
            let green = brightness * 211 + (1 - brightness) * 256;
            let blue = brightness * 83 + (1 - brightness) * 256;
            
            barHeight = dataArray[i];

            canvasCtx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
            canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

            x += barWidth + 1;
        }
    };

    draw();
}
