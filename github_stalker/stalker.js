function getUser (username) {
  if (typeof username === 'number') {
    username = this;
  }
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
  console.log(userList);
  $.when.apply(null, $(userList).map(getUser)).done(function() {
    //workaround: when() is annoying -- if you send an array with one item, it collapses the result
    var resList = ((userList.length == 1) ? [$.makeArray(arguments)] : $.makeArray(arguments) );
    var events = _.flatten(_.map(resList, function(x) {
      return x[0]
    }));
    console.log(events);
    var d = function(x) {return (new Date(x.created_at)) };
    events.sort(function(a,b) {return d(b) - d(a); });
    events = _.sortedUniqBy(events, function(x){ return x.id });
    _.templateSettings.evaluate = /{%([\s\S]+?)%}/g;
    var tmpl = _.template($('#template div').get(0).innerHTML);
    $(events).each(function(i) {
      $('#events').append(tmpl(this));
    });
  });
}

getUsersByQuery(location.search.substr(1));

