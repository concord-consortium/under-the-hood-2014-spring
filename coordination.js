(function () {
  var Interactive = iframePhone.ParentEndpoint,
      interactives = [],
      modelLoadedPromises = [],
      interactiveIframes = document.querySelectorAll(".interactive");

  function modelLoaded(interactive) {
    interactive.addEventListener = addEventListener;
    interactive.stop = stop;
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
        stopInteractivesThatArent(me);
      });
    })

    function stopInteractivesThatArent(me) {
      interactives.forEach(function (interactive){
        if (interactive !== me) {
          interactive.stop();
        }
      });
    }

  });

})();
