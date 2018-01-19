Survey.Survey.cssType = "bootstrap";
Survey.defaultBootstrapCss.navigationButton = "btn btn-green";

var CONFIG = window.CONFIG;
var surveyUID = $.url().param("survey");

var props = {
  survey: $.QueryString.survey
};
var querystring = $.buildQuerystring(props);

$.get(CONFIG.API_URL + "/surveys/" + surveyUID + "?" + querystring, function(
  data
) {
  editor.text = JSON.stringify(data);
});

var editorOptions = {};
var editor = new SurveyEditor.SurveyEditor("editorElement", editorOptions);

editor.saveSurveyFunc = function() {
  $.ajax({
    method: "PUT",
    url: CONFIG.API_URL + "/surveys/" + surveyUID + "?" + querystring,
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(JSON.parse(editor.text))
  })
    .done(function(data) {
      alert("saved");
    })
    .fail(function() {
      alert("failed to save");
    });
};
