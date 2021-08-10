// Effects
var threeBandEq = new Pizzicato.Effects.ThreeBandEqualizer({
    cutoff_frequency_low: 400,
    cutoff_frequency_high: 4000,
    low_band_gain: 1,
    mid_band_gain: 1,
    high_band_gain: 1,
    peak: 1
});

// PZ Sound
var sound = new Pizzicato.Sound('https://theyyg.github.io/web3bandeq/audio/nature.wav', function() {
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

