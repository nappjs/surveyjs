// Survey.Survey.cssType = "bootstrap";
// Survey.defaultBootstrapCss.navigationButton = "btn btn-green";

var CONFIG = window.CONFIG;
var surveyUID = $.url().param("survey");
var answerUID = $.url().param("answer");

var props = {
  survey: $.QueryString.survey
};
var querystring = $.buildQuerystring(props);

$.get(CONFIG.API_URL + "/surveys/" + surveyUID + "?" + querystring, function(
  data
) {
  var survey = new Survey.Model(data);
  survey.onComplete.add(saveAnswers);
  survey.onValueChanged.add(function(result) {
    scheduleSave(result);
  });

  var converter = new showdown.Converter();
  survey.onTextMarkdown.add(function(survey, options) {
    var str = converter.makeHtml(options.text);
    options.html = str;
  });

  // survey.showCompletedPage = false;

  $("#surveyElement").Survey({
    model: survey,
    completeHtml: "Thank you"
  });

  $.get(
    CONFIG.API_URL +
      "/surveys/" +
      surveyUID +
      "/answers/" +
      answerUID +
      "?" +
      querystring,
    function(data) {
      for (var key in data) {
        survey.setValue(key, data[key]);
      }
    }
  );
});

var saveTimeoutInterval = null;
var scheduleSave = function(result) {
  if (saveTimeoutInterval) clearTimeout(saveTimeoutInterval);
  saveTimeoutInterval = setTimeout(function() {
    saveAnswers(result);
  }, 1000);
};

var saveAnswers = function(result, completed) {
  var data = Object.assign({}, result.data, { completed: completed });
  $.ajax({
    method: "PUT",
    url:
      CONFIG.API_URL +
      "/surveys/" +
      surveyUID +
      "/answers/" +
      answerUID +
      "?" +
      querystring,
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(data)
  })
    .done(function() {
      if (completed) alert("saved");
    })
    .fail(function() {
      if (completed) alert("failed to save");
    });
};
