function createPointsImg(container, width, height, scale, image_url, draggable, points) {
      var stage = new Kinetic.Stage({
        container: 'points_container',
        width: width,
        height: height
      });
      var layer = new Kinetic.Layer();

      var circles = [];
      for (var i = 0; i<points.length;i++) {
        circles[i]= new Kinetic.Circle({
          x: points[i]["x"]*scale,
          y: points[i]["y"]*scale,
          id: points[i]["label"],
          radius: 10,
          fill: 'red',
          stroke: 'black',
          strokeWidth: 1,
          draggable: draggable
        })
        layer.add(circles[i]);
      }


      var imageObj = new Image();
      imageObj.onload = function() {
        var img = new Kinetic.Image({
          image: imageObj,
          scale: scale
        });

        // add the shape to the layer
        layer.add(img);
        for (var j = 0; j<circles.length;j++) {
          if (draggable) {
            circles[j].on('dragend', function() {
              console.log("id"+this.getId()+" value"+this.getPosition().x+"scale"+scale);
              $('fieldset.'+this.getId()+' input:nth-child(1)').val(this.getPosition().x/scale);
              $('fieldset.'+this.getId()+' input:nth-child(2)').val(this.getPosition().y/scale);
            });
          }
          layer.add(circles[j]);
        }

        // add the layer to the stage
        stage.add(layer);
      };
      imageObj.src = image_url

      // add the layer to the stage
      //stage.add(layer);
    };





