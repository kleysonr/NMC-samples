define(['amd!cdf/lib/underscore'],function(_){
    
  var colorMapManager = {

    getColorMap: function (colorMap) {
      var cmap = [];
      colorMap = _.map(colorMap, color2array);
      for (k = 1, L = colorMap.length; k < L; k++) {
        cmap = cmap.concat(interpolate(colorMap[k - 1], colorMap[k], 32));
      }
      return _.map(cmap, function (v) {
        return 'rgba(' + v.join(',') + ')';
      });
    },

    mapColor: function (value, minValue, maxValue, colormap) {
      var n = colormap.length;
      var level = (value - minValue) / (maxValue - minValue);
      return colormap[Math.floor(level * (n - 1))];
    },
    toGrayscale: function (color) {
      var rgba = color2array(color);
      var g = Math.round(0.2989 * rgba[0] + 0.5870 * rgba[1] + 0.1140 * rgba[2]);
      var v = [g, g, g, rgba[3]];
      return 'rgba(' + v.join(',') + ')';
    }
  };

  function color2array(color) {
    var rgba = _.clone(color);
    if (_.isArray(color)) {
      rgba = color;
      if (rgba.length === 3) {
        rgba.push(1)
      }
    } else if (_.isString(color)) {
      if (color[0] === "#") {
        rgba = [parseInt(color.substring(1, 3), 16), parseInt(color.substring(3, 5), 16), parseInt(color.substring(5, 7), 16), 1];
      } else if (color.substring(0,4) === "rgba") {
        rgba = color.slice(5, -1).split(',').map(parseFloat); // assume rgba(R,G,B,A) format
      }
    }
    return rgba;
  }


  function interpolate(a, b, n) {
    var colormap = [], d = [];
    var k, kk, step;
    for (k = 0; k < a.length; k++) {
      colormap[k] = [];
      for (kk = 0, step = (b[k] - a[k]) / n; kk < n; kk++) {
        colormap[k][kk] = a[k] + kk * step;
      }
    }
    for (k = 0; k < colormap[0].length && k < 3; k++) {
      d[k] = [];
      for (kk = 0; kk < colormap.length; kk++) {
        d[k][kk] = Math.round(colormap[kk][k]);
      }
    }
    return d;
  }
  
  
  /*
  Module Export
  */
  return colorMapManager;
	
});