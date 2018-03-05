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
    "query($uid:String!){surveyByUID(uid:$uid){content propertyGroups{code name properties{code name}}}}",
    { uid: uid },
    function(err, result) {
      if (err) return callback(err);
      callback(null, result.data.surveyByUID);
    }
  );
}

function loadAnswerData(uid, callback) {
  sendQuery(
    "query($uid:String!){surveyAnswerByUID(uid:$uid){content sent survey {content}}}",
    { uid: uid },
    function(err, result) {
      if (err) return callback(err);
      callback(null, result.data.surveyAnswerByUID);
    }
  );
}
function saveAnswerData(uid, data, callback) {
  sendQuery(
    "mutation($uid:String!,$content:String!,$sent:String){updateSurveyAnswerByUID(uid:$uid,input:{sent:$sent,content:$content}){uid}}",
    {
      uid: uid,
      content: data.content,
      sent: data.send ? new Date().toISOString() : undefined
    },
    callback
  );
}
