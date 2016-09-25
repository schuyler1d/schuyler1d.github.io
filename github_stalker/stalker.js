function getUser (username) {
  if (typeof username === 'number') {
    username = this;
  }
  console.log('username', String(username));
  return $.ajax({
    url: 'https://api.github.com/' + username + '/events',
    dataType: 'json',
    success: function(data) {
      //console.log('success', username, data);
    },
    error: function(evt) {
      console.log('error', username, data);
    }
  });
}

function getUsersByQuery(users) {
  var userList = users.split(',');
  $.when.apply(null, $(userList).map(getUser)).done(function() {
    $(arguments).each(function(i) {
      console.log('datadata', i, userList[i], this);
      _.templateSettings.evaluate = /{%([\s\S]+?)%}/g;
      var tmpl = _.template($('#template div').get(0).innerHTML);
      $(this[0]).each(function() {
        $('#events').append(tmpl(this));
      });

    });
  });
}

getUsersByQuery(location.search.substr(1));

