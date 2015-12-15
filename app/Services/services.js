angular.module('clipr.services', ['ngCookies'])

//Session service
.service('Session', function() {
  this.create = function(sessionId, userId) {
    this.id = sessionId;
    this.userId = userId;
  };

  this.destroy = function() {
    this.id = null;
    this.userId = null;
  };
})

.factory('Clips', ["$http", "$state", "$cookies", function($http, $state, $cookies) {

  //Clips object to hold data about all sites, categories, collections, and suggestions
  var clips = {
    data: {},
    clips: [],
    categories: {},
    collections: []
  };

  //Sorts clips by most visited using click count
  var mostVisited = function() {
    var sortedClips = clips.clips.sort(function(a, b) {
      a.clickCount = a.clickCount || null;
      b.clickCount = b.clickCount || null;
      return b.clickCount - a.clickCount;
    });
    clips.clips = sortedClips;

  };

  //Sorts clips by most recently added using timeAdded
  var recentlyAdded = function() {
    var sortedClips = clips.clips.sort(function(a, b) {
      a.timeAdded = a.timeAdded || null;
      b.timeAdded = b.timeAdded || null;
      return b.timeAdded - a.timeAdded;
    });
    console.log(sortedClips);
    clips.clips = sortedClips;
  };

  //Increments click count for each clip
  var incrementCount = function(clipTitle) {
    return $http({
      method: 'POST',
      url: '/incrementCount',
      params: {
        clipTitle: clipTitle
      }
    }).then(function(response) {
      loadAllClips($cookies.get('clipr'));
    });
  };

  //Sorts and accumulates clips according to each cateogry
  var loadClipsByCategory = function(topic) {
    var categorizedClips = [];
    if (topic === 'all') {
      for (var key in clips.categories) {
        for (var clip in clips.categories[key]) {
          categorizedClips.push(clips.categories[key][clip]);
        }
      }
    } else {
      for (var key in clips.categories[topic]) {
        categorizedClips.push(clips.categories[topic][key]);
      }
    }
    clips.clips = categorizedClips;
  };

  //Initial function that makes GET request to server to fetch all clip DATA from DB
  var loadAllClips = function(cookie) {
    return $http({
      method: 'GET',
      url: '/loadAllClips',
      params: {
        cookie: cookie
      }
    }).then(function(response) {
      clips.data = response.data;
      clips.clips = response.data;
      clips.categories = {};

      for (var x = 0; x < response.data.length; x++) {
        var clip = response.data[x].clips;
        var suggestion = response.data[x].suggestions;

        //Process data sent back from DB
        //Remove duplicate data by iterating through each clip, checking suggestion and category
        if (!clips.categories[clip.category]) {
          clips.categories[clip.category] = {};
          clips.categories[clip.category][clip.title] = clip;
          clips.categories[clip.category][clip.title].suggestions = [suggestion];
          console.log(clips.categories[clip.category][clip.title]);
        } else {
          if (clips.categories[clip.category][clip.title]) {
            clips.categories[clip.category][clip.title].suggestions.push(suggestion);
          } else {
            clips.categories[clip.category][clip.title] = clip;
            clips.categories[clip.category][clip.title].suggestions = [suggestion];
          }
        }
      }
      loadClipsByCategory('all');
    });
  };

  //Load all collections by making POST request to server
  var loadCollections = function() {
    return $http({
      method: 'POST',
      url: '/loadCollections'
    }).then(function(response) {
      var response = response.data;
      var result = [];
      for (var i = 0; i < response.length; i++) {
        result.push(response[i].collection);
      };
      clips.collections = result;
    });
  };

  //Adds specific clip to a collection
  var addToCollection = function(collection, clip) {
    return $http({
      method: 'POST',
      url: '/addToCollection',
      params: {
        collection: collection,
        clip: clip.title
      }
    });
  };

  //Show clips that belong to specific collection
  var showCollectionClips = function(collection) {
    return $http({
      method: 'POST',
      url: '/showCollectionClips',
      params: {
        collection: collection
      }
    }).then(function(response) {
      clips.clips = response.data;
    });
  };

  //Add new collection
  var addCollection = function(collection) {
    return $http({
      method: 'POST',
      url: '/addCollection',
      params: {
        collection: collection
      }
    }).then(function(response) {
      loadCollections();
    });
  };

  //Delete clip from database, sends title of clip and email of user to query DB
  var deleteClip = function(clipTitle) {
    return $http({
      method: 'POST',
      url: '/deleteClip',
      params: {
        clipTitle: clipTitle,
        email: $cookies.get('clipr')
      }
    }).then(function(response) {
      loadAllClips($cookies.get('clipr'));
    });
  };

  //Makes POST request to server with title of clip and new category to assign it to
  var changeCategory = function(category, clipTitle) {
    return $http({
      method: 'POST',
      url: '/changeCategory',
      params: {
        category: category,
        clipTitle: clipTitle
      }
    }).then(function(response) {
      loadAllClips($cookies.get('clipr')).then(function(response) {
      loadClipsByCategory(category);
      });
    });
  };

  return {
    loadClipsByCategory: loadClipsByCategory,
    loadAllClips: loadAllClips,
    incrementCount: incrementCount,
    mostVisited: mostVisited,
    clips: clips,
    changeCategory: changeCategory,
    deleteClip: deleteClip,
    addCollection: addCollection,
    loadCollections: loadCollections,
    addToCollection: addToCollection,
    showCollectionClips: showCollectionClips,
    recentlyAdded: recentlyAdded
  };

}])

//AuthService factory to handle cookies, sessions and state of application
.factory('AuthService', ['$http', 'Session', '$cookies', '$state', function($http, Session, $cookies, $state) {

  var isAuthenticated = function() {
    //check local storage return true or false depending on prescence of Clipr cookie
    console.log('cookies are delish', $cookies.get('clipr'));
    if ($cookies.get('clipr')) {
      return true;
    } else {
      return false;
    }
  };

  //Logs out user, removes cookies and changes state back to landing
  var logOut = function() {
    $cookies.remove('clipr');
    $state.go('landing');
  };

  return {
    isAuthenticated: isAuthenticated,
    logOut: logOut
  };

}]);