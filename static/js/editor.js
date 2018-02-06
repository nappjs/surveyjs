Survey.Survey.cssType = "bootstrap";
Survey.defaultBootstrapCss.navigationButton = "btn btn-green";

var CONFIG = window.CONFIG;
var surveyUID = $.url().param("survey");

var props = {
  survey: $.QueryString.survey
};
var querystring = $.buildQuerystring(props);

var editorOptions = {};
var editor = new SurveyEditor.SurveyEditor("editorElement", editorOptions);

loadSurveyData(surveyUID, function(err, data) {
  // properties
  for (var i in data.propertyGroups) {
    var group = data.propertyGroups[i];
    Survey.JsonObject.metaData.addProperty("questionbase", {
      name: group.code + ":multiplevalues",
      choices: group.properties.map(function(p) {
        return { value: p.code, text: p.name };
      })
    });
  }

  // editor content
  editor.text = data.content;
});

editor.saveSurveyFunc = function() {
  sendQuery(
    "mutation($id:Int!,$content:String!){updateSurvey(id:$id,input:{content:$content}){id}}",
    { id: surveyUID, content: JSON.stringify(JSON.parse(editor.text)) },
    function(err, result) {
      if (err) alert("failed to save");
      else alert("saved");
    }
  );
};
