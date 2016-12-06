function getUser(githubUser, username) {
  var url = 'https://api.github.com/' + username + '/events';
  console.log('url', url);
  return $.ajax({
    url: url,
    dataType: 'json',
    success: function(data) {
      console.log('success', username, data);
    },
    error: function(evt) {
      console.log('error', username, data);
    }
  });
}

function getOrgPullRequests(org, githubUser) {
   $.ajax({
    url: 'https://api.github.com/' + org + '/repos',
    dataType: 'json',
     success: function(data) {
       $.when.apply(null, _.map(data, function(repo) {
         var allPullUrl = repo.pulls_url.replace(/\{.*$/, '');
         return $.ajax({'url':allPullUrl, dataType: 'json'});
       }))
         .done(
           renderEvents('pull_requests', 'templatePullRequest', data, 10)
         );
       
       //"pulls_url"

       //$.ajax({url: pulls_url + '?state=open'
       //      });
    },
    error: function(evt) {
      console.log('error', username, data);
    }
  });
}


function renderEvents(targetHtml, templateHtml, inputList, maxItems) {
  return function() {
    //workaround: when() is annoying -- if you send an array with one item, it collapses the result
    var resList = ((inputList.length == 1)
                   ? [$.makeArray(arguments)]
                   : $.makeArray(arguments) );
    var events = _.flatten(_.map(resList, function(x) {
      return x[0]
    }));
    console.log(targetHtml, 'event list', events);
    var d = function(x) {return (new Date(x.created_at)) };
    events.sort(function(a,b) {return d(b) - d(a); });
    events = _.sortedUniqBy(events, function(x){ return x.id });
    _.templateSettings.evaluate = /{%([\s\S]+?)%}/g;
    var tmpl = _.template($('#'+templateHtml+' div').get(0).innerHTML);
    if (events.length) {
      $('#'+targetHtml).append($('<h2>').append(targetHtml.replace('_', ' ')));
    }
    $(events.slice(0,maxItems||1000)).each(function(i) {
      $('#'+targetHtml).append(tmpl(this));
    });
  }
}

function getUsersByQuery(query) {
  var spl = function(t,s) {return s.split(t);}
  var params = _.fromPairs(_.map(spl('&',query), spl.bind(0,'=')));
  var githubUser = params.github;
  var userList = params.users.split(',');
  console.log(userList);

  $.when.apply(null, _.map(userList, getUser.bind(null, githubUser)) ).done(
    renderEvents('events', 'templateEvent', userList) //returns a function
  );

  var orgs = _.filter(userList, function(u) {
    if (/^org/.test(u)) {
      getOrgPullRequests(u, githubUser);
      return u;
    }
  });
}

function stalkerInit(evt) {
  if (evt) {
    evt.preventDefault();
  }
  var octo = new Octokat();
  if ($('input[name=username]').val()) {
    var octo = new Octokat({});
  }
  getUsersByQuery(location.search.substr(1));
}

stalkerInit();

$('form#github').submit(stalkerInit);
