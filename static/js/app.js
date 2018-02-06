function sendQuery(query, variables, callback) {
  var access_token = $.QueryString.access_token;
  $.ajax({
    method: "POST",
    url: CONFIG.API_URL,
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: access_token ? `Bearer ${access_token}` : undefined
    },
    data: JSON.stringify({ query: query, variables: variables })
  })
    .done(function(data) {
      callback(null, data);
    })
    .fail(function(err) {
      console.log("fail", err.statusCode());
      callback(err);
    });
}

function loadSurveyData(uid, callback) {
  sendQuery(
    "query($id:Int!){survey(id:$id){content propertyGroups{code name properties{code name}}}}",
    { id: uid },
    function(err, result) {
      if (err) return callback(err);
      callback(null, result.data.survey);
    }
  );
}

function loadAnswerData(uid, callback) {
  sendQuery(
    "query($id:Int!){surveyAnswer(id:$id){content survey {content}}}",
    { id: uid },
    function(err, result) {
      if (err) return callback(err);
      callback(null, result.data.surveyAnswer);
    }
  );
}
function saveAnswerData(uid, data, callback) {
  sendQuery(
    "mutation($id:Int!,$content:String!,$completed:Boolean!){updateSurveyAnswer(id:$id,input:{completed:$completed,content:$content}){id}}",
    { id: uid, content: data.content, completed: data.completed || false },
    callback
  );
}
