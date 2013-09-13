//Creates Kinetic.Point
(function(Kinetic) {
  Kinetic.Point = function(config) {
        this._initPoint(config);
    };

  Kinetic.Point.prototype = {
      _initPoint: function(config) {
          this.circle = new Kinetic.Circle({
            x: 0,
            y: 0,
            radius: 20,
            stroke: 'red',
            strokeWidth: 2
          });
          this.label = new Kinetic.Text({
              x: this.circle.getRadius(),
              y: this.circle.getRadius(),
              text: config.label,
              fontFamily: 'Calibri',
              fontSize: 12,
              padding: 0,
              fill: 'yellow'
            });
          this.realPoint = config.realPoint;
          Kinetic.Group.call(this, config);
          this.add(this.label);
          this.add(this.circle);
          },
      setFill : function(arg){
          this.circle.setFill(arg);
      },
      setStroke : function(arg){
        this.circle.setStroke(arg);
      }
    };

  Kinetic.Util.extend(Kinetic.Point, Kinetic.Group);
})(Kinetic);

//Creates Kinetic.Magnify
(function(Kinetic) {
  var default_options = {
    radius: 100,
    circleStroke: "grey",
    circleStrokeWidth: 1,
    imageOffsetX: 0,
    imageOffsetY: 0,
    scale: 1
  }
  Kinetic.Magnify = function(config) {
        this._initMagnify(config);
    };

  Kinetic.Magnify.prototype = {
      _initMagnify: function(config) {
          var config = jQuery.extend({}, default_options, config || {})

          this.circle = new Kinetic.Circle({
            radius: config.radius,
            stroke: config.circleStroke,
            strokeWidth: config.circleStrokeWidth
          })
          this.circle.setFillPatternImage(config.image);
          this.circle.setFillPatternOffset(config.imageOffsetX,config.imageOffsetY);
          this.circle.setFillPatternScale(config.scale);
          Kinetic.Group.call(this, config);
          this.add(this.circle);
          },
      zoom : function(scale){
          this.circle.setFillPatternScale(scale);
      }
    };

  Kinetic.Util.extend(Kinetic.Magnify, Kinetic.Group);
})(Kinetic);

var Pointsable = (function() {
  //methods
  var default_options = {
      container: 'pointsable_container',
      viewingWidth: null,
      scale: 1,
      magnifyRadius: 100,
      draggable: true
    },
    addPoints,
    addPoint,
    removePoint;

  /**** event handlers ****/
  var updateRealPoint = function updateRealPoint(point,scale) {
    point.x = Math.round(this.getPosition().x/scale);
    point.y = Math.round(this.getPosition().y/scale);
  };
  var updateSelectedPoint = function updateSelectedPoint(pointsableObj) {
    if (pointsableObj.selectPoint !== this) {
      if (pointsableObj.selectedPoint) {
        lastSelectedPoint = pointsableObj.selectedPoint
        lastSelectedPoint.setStroke("red");
      }
      pointsableObj.selectedPoint = this;
      pointsableObj.selectedPoint.setStroke("blue");

      pointsableObj.pointsLayer.draw();
    }
  }
  var updateMagnify = function updateMagnify(pointsableObj) {
    pointsableObj.magnify.circle.setFillPatternOffset(this.realPoint.x, this.realPoint.y);
    pointsableObj.magnifyLayer.draw();
  }
  /** end  of event handlers **/

  addPoints = function addPoints(points){
    for (var i = 0, length = points.length; i < length; i++) {
      this.addPoint(points[i]);
    }
  };

  addPoint = function addPoint(point) {
      kpoint = new Kinetic.Point({
        x: point.x*this.scale,
        y: point.y*this.scale,
        id: point.label,
        label: point.label,
        draggable: this.draggable,
        realPoint: point
      });
      //setup the zoom scale for the magnify object if this is the first point being added && a magnifier already exists
      if (this.kineticPoints.length===0 && this.magnify) {
         this.magnify.zoom(1/((kpoint.circle.getRadius()/this.stage.getWidth())*(this.imageJs.width/this.magnify.circle.getRadius())));
      }
      this.kineticPoints.push(kpoint);
      this.pointsLayer.add(kpoint);
      kpoint.on('dragmove', updateRealPoint.bind(kpoint,point,this.scale));
      kpoint.on('dragmove mousedown', updateMagnify.bind(kpoint,this));
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
    _this.magnifyLayer = new Kinetic.Layer();
    _this.controlsLayer = new Kinetic.Layer();
    _this.draggable = o.draggable
    _this.selectedPoint = null;
    _this.magnifyRadius = o.magnifyRadius;
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
      var imgBackground = new Kinetic.Image({
        image: _this.imageJs,
        scale: _this.scale
      });
      _this.imageLayer.add(imgBackground);
      _this.stage.add(_this.imageLayer);
      _this.addPoints(o.points);
      _this.stage.add(_this.pointsLayer);
      _this.selectedPoint = _this.kineticPoints[0];
      _this.magnify = new Kinetic.Magnify({
        image: _this.imageJs,
        radius: _this.magnifyRadius,
        x: _this.stage.getWidth()-_this.magnifyRadius-5,
        y: _this.stage.getHeight()-_this.magnifyRadius-5,
        imageOffsetX: _this.magnifyRadius/_this.scale,
        imageOffsetY: _this.magnifyRadius/_this.scale,
      });
      if (_this.selectedPoint) {
        _this.magnify.circle.setFillPatternOffset(_this.selectedPoint.realPoint.x, _this.selectedPoint.realPoint.y);
        _this.magnify.circle.setFillPatternScale( 1/((_this.selectedPoint.circle.getRadius()/_this.stage.getWidth())*(_this.imageJs.width/_this.magnify.circle.getRadius())) );
      }
      _this.magnifyLayer.add(_this.magnify);
      _this.stage.add(_this.magnifyLayer);
      //_this.pointsLayer.moveToTop();
    };
    _this.imageJs.src = _this.imageUrl;
  };

  Poinstable.prototype.addPoints = addPoints;
  Poinstable.prototype.addPoint =  addPoint;
  Poinstable.prototype.removePoint = removePoint;

  return Poinstable;
})();







