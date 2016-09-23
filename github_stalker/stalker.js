function getUser (username) {
  $.ajax({
    url: 'https://api.github.com/user/' + username + '/events/',
    dataType: 'json'
    success: function(data) {
      console.log('success', username, data);
    },
    error: function(evt) {
    }
  });
}

function getUsersByQuery(users) {
  var userList = users.split(',');
  $(userList).each(getUser);
}

getUsersByQuery(location.search.substr(1));

