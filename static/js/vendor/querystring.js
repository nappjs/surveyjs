(function($) {
  $.QueryString = (function(paramsArray) {
    var params = {};

    for (var i = 0; i < paramsArray.length; ++i) {
      let param = paramsArray[i].split("=", 2);

      if (param.length !== 2) continue;

      params[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
    }

    return params;
  })(window.location.search.substr(1).split("&"));

  $.buildQuerystring = function(object) {
    var result = [];
    for (var key in object) {
      if (typeof object[key] !== "undefined")
        result.push(key + "=" + object[key]);
    }
    return result.join("&");
  };
})(jQuery);
