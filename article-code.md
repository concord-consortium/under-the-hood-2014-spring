Code block from article in markdown

```javascript
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
```