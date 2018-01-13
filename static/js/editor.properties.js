var CONFIG = window.CONFIG;

var props = {
  survey: $.QueryString.survey,
  access_token: $.QueryString.access_token
};

$.get(CONFIG.API_URL + "properties.json?" + $.buildQuerystring(props), function(
  properties
) {
  for (var i in properties) {
    var property = properties[i];
    Survey.JsonObject.metaData.addProperty("questionbase", {
      name: property.key + ":" + property.type,
      choices: property.choices
    });
  }
});
