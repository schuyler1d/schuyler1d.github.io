function getUser (username) {
  return $.ajax({
    url: 'https://api.github.com/users/' + username + '/events',
    dataType: 'json',
    success: function(data) {
      console.log('success', username, data);
    },
    error: function(evt) {
      console.log('error', username, data);
    }
  });
}

function getUsersByQuery(users) {
  var userList = users.split(',');
  $.when.apply(null, $(userList).map(getUser)).done(function() {
    $(arguments).each(function() {
      console.log('datadata', this);
    });
  });
}

getUsersByQuery(location.search.substr(1));

