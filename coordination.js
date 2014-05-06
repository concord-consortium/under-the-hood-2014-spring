(function () {
  var Interactive = iframePhone.ParentEndpoint,
      interactives = [],
      modelLoadedPromises = [],
      interactiveIframes = document.querySelectorAll(".interactive");

  function modelLoaded(interactive) {
    interactive.addEventListener = addEventListener;
    interactive.stop = stop;
    // load custom interactive this is because we need to cram these interactives
    // into a very small space.
    interactive.post('loadInteractive', SIMPLE_GAS_INTERACTIVE);
    return new RSVP.Promise(function(resolve, reject){
      interactive.addListener('modelLoaded', function(){
        resolve(interactive);
      });
    });
  }

  function addEventListener (type, listener) {
    var privateName = type + '.coordination';
    this.post('listenForDispatchEvent', {eventName: privateName});
    this.addListener(privateName, listener);
  }

  function stop () {
    this.post('stop');
  }

  for (var i=0; i < interactiveIframes.length; i++ ) {
    modelLoadedPromises.push(modelLoaded(new Interactive(interactiveIframes[i])));
  }

  RSVP.all(modelLoadedPromises).then(function(interactives){

    interactives.forEach(function(me){
      me.addEventListener('play', function (){
        stopInteractivesThatAreNot(me);
      });
    })

    function stopInteractivesThatAreNot(me) {
      interactives.forEach(function (interactive){
        if (interactive !== me) {
          interactive.stop();
        }
      });
    }

  });

})();
