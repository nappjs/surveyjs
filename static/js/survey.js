Survey.Survey.cssType = "bootstrap";
Survey.defaultBootstrapCss.navigationButton = "btn btn-green";

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
  survey.onComplete.add(function() {
    console.log("data???", survey.data);
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

var saveAnswers = function(result) {
  $.ajax({
    method: "PUT",
    url: "/surveys/" + surveyUID + "/answers/" + answerUID + "?" + querystring,
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(result.data)
  })
    .done(function() {
      alert("saved");
    })
    .fail(function() {
      alert("failed to save");
    });
};
