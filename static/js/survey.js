// Survey.Survey.cssType = "bootstrap";
// Survey.defaultBootstrapCss.navigationButton = "btn btn-green";

var CONFIG = window.CONFIG;
var answerUID = $.url().param("answer");

var props = {
  survey: $.QueryString.survey
};
var querystring = $.buildQuerystring(props);

loadAnswerData(answerUID, function(err, data) {
  if (err) return alert("failed to load answer");

  if (data.sent) {
    alert("You already completed this survey");
    return;
  }

  var survey = new Survey.Model(data.survey.content);
  survey.onComplete.add(result => {
    saveAnswers(result, true);
  });
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

  let content = JSON.parse(data.content);
  for (var key in content) {
    survey.setValue(key, content[key]);
  }
});

var saveTimeoutInterval = null;
var scheduleSave = function(result) {
  if (saveTimeoutInterval) clearTimeout(saveTimeoutInterval);
  saveTimeoutInterval = setTimeout(function() {
    saveAnswers(result);
  }, 1000);
};

var saveAnswers = function(result, send) {
  var data = { content: JSON.stringify(result.data), send: send };
  saveAnswerData(answerUID, data, function(err) {
    if (send) {
      if (err) return alert("failed to save");
      alert("saved");
    }
  });
};
