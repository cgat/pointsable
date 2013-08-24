var Pointsable = (function() {
  //methods
  var default_options = {
      container: 'pointsable_container',
      viewingWidth: null,
      scale: 1,
      draggable: true
    },
    addPoints,
    addPoint,
    removePoint;

  var updateRealPoint = function updateRealPoint(point,scale) {
    point.x = Math.round(this.getPosition().x/scale);
    point.y = Math.round(this.getPosition().y/scale);
  };
  var updateSelectedPoint = function updateSelectedPoint(poinstableObj) {
    if (poinstableObj.selectPoint !== this) {
      if (poinstableObj.selectedPoint) {
        lastSelectedPoint = poinstableObj.selectedPoint
        lastSelectedPoint.setFill("red");
      }
      poinstableObj.selectedPoint = this;
      poinstableObj.selectedPoint.setFill("green");

      poinstableObj.pointsLayer.draw();
    }
  }

  addPoints = function addPoints(points){
    for (var i = 0, length = points.length; i < length; i++) {
      this.addPoint(points[i]);
    }
  };

  addPoint = function addPoint(point) {
    var kpoint = new Kinetic.Circle({
          x: point.x*this.scale,
          y: point.y*this.scale,
          id: point.label,
          radius: 10,
          fill: 'red',
          stroke: 'black',
          strokeWidth: 1,
          draggable: this.draggable
        });
      this.kineticPoints.push(kpoint);
      this.pointsLayer.add(kpoint);
      kpoint.on('dragend', updateRealPoint.bind(kpoint,point,this.scale));
      kpoint.on('mousedown', updateSelectedPoint.bind(kpoint,this));
      this.realPoints.push(point);
      this.pointsLayer.draw();
  }

  removePoint = function removePoint(label){
    var kRemoveIndex, rRemoveIndex;
    for(var i = 0, length = this.kineticPoints.length; i < length; i++) {
      if (this.kineticPoints[i].getId()===label) {
        kRemoveIndex = i;
        this.kineticPoints[i].destroy();
      }
      if (this.realPoints[i].label===label) {
        rRemoveIndex = i;
      }
      if (kRemoveIndex && rRemoveIndex) {
        break;
      }
    }
    if (kRemoveIndex) {
      this.kineticPoints.splice(kRemoveIndex,1);
    }
    if (rRemoveIndex) {
      this.realPoints.splice(rRemoveIndex,1);
    }
    this.pointsLayer.draw();
  }

  //constructor
  function Poinstable(options) {
    var o = jQuery.extend({}, default_options, options || {}),
                _this = this;
    _this.imageUrl = o.imageUrl;
    _this.imageJs = new Image();
    _this.imageLayer = new Kinetic.Layer();
    _this.pointsLayer = new Kinetic.Layer();
    _this.controlsLayer = new Kinetic.Layer();
    _this.draggable = o.draggable
    _this.selectedPoint = null;

    //both real and kinetic points are built when addPoints is activated
    _this.kineticPoints = [];
    _this.realPoints = [];
    _this.viewingWidth = o.viewingWidth;
    _this.imageJs.onload = function setupStage(){
      if(o.viewingWidth) {
        _this.scale = _this.viewingWidth/_this.imageJs.width;
      }
      _this.stage = new Kinetic.Stage({
        container: o.container,
        width: _this.imageJs.width*_this.scale,
        height: _this.imageJs.height*_this.scale
      });
      var img = new Kinetic.Image({
        image: _this.imageJs,
        scale: _this.scale
      });
      _this.imageLayer.add(img);
      _this.stage.add(_this.imageLayer);
      _this.addPoints(o.points);
      _this.stage.add(_this.pointsLayer);
      _this.pointsLayer.moveToTop();
    };
    _this.imageJs.src = _this.imageUrl;
  };

  Poinstable.prototype.addPoints = addPoints;
  Poinstable.prototype.addPoint =  addPoint;
  Poinstable.prototype.removePoint = removePoint;

  return Poinstable;
})();







