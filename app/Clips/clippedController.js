angular.module('clipr.clipped', ['ui.router', 'ui.bootstrap', 'ngAside', 'angularMoment'])

.controller('ClipController', ['$scope', 'Clips', '$modal', 'AuthService', '$aside', '$cookies', '$state', '$timeout', function($scope, Clips, $modal, AuthService, $aside, $cookies, $state, $timeout) {

//***'Clip' denotes each site that user bookmarks using the Clippr Chrome extension

  $scope.clips = Clips.clips;
  $scope.allClips = false;
  $scope.categories = Clips.clips;
  $scope.collection = "";
  $scope.categoryDisplay;

  //Adds clip to a specific collection
  $scope.submit = function() {
    Clips.addCollection($scope.collection);
    $scope.collection = "";
  };

  //Sorts clips within category by most visited
  $scope.mostVisited = function() {
    Clips.mostVisited();
  };

  //Increment count for each clip with each clik
  $scope.incrementCount = function(clipTitle) {
    Clips.incrementCount(clipTitle);
  };

  //Sorts clips by recently added
  $scope.recentlyAdded = function() {
    Clips.recentlyAdded();
  };

  //Displays collections
  $scope.showCollectionClips = function(collection) {
    Clips.showCollectionClips(collection);
  };

  //Loads all previously saved collections
  $scope.loadCollections = function() {
    Clips.loadCollections();
  };

  //Change current category display according to user selection
  $scope.loadClipsByCategory = function(category) {
    Clips.loadClipsByCategory(category);
    if (category === 'all') {
      $scope.categoryDisplay = 'All Clips:';
      $scope.allClips = true;
    } else {
      $scope.allClips = false;
      $scope.categoryDisplay = category + ' clips:';
    }
    $state.go('main');
  };

  $scope.navToClips = function() {
    Clips.loadAllClips($cookies.get('clipr'));
    $state.go('main');
  };

  //Initial function that makes GET request to server to fetch all clips from DB
  $scope.loadAllClips = function() {
    $scope.allClips = true;
    $scope.categoryDisplay = 'All Clips:';
    Clips.loadAllClips($cookies.get('clipr'));
  };

  //Allows users to drag-and-drop clip to category to change assigned category
  $scope.changeCategory = function(event, ui, item_id) {
    // console.log(event);
    var clipTitle = ui.draggable.find("h4").attr('title').toString();
    var category = item_id.toString();
    Clips.changeCategory(category, clipTitle);

    $timeout(function() {
      $scope.categoryDisplay = category + ' clips:';
    }, 2100, category);

  };

  //Log out user on click, deletes cookies
  $scope.logOut = function() {
    AuthService.logOut();
  };


  $scope.clipToggle = function() {
    if ($scope.clipShow === false) {
      $scope.clipShow = true;
    }
    if ($scope.clipShow === true) {
      $scope.clipShow = false;
    }
  };

  //Deletes clip from the database
  $scope.delete = function(clipTitle) {
    Clips.deleteClip(clipTitle);
  };

  //Configuration for the modal on '+' click for each clip
  $scope.showModal = function(clip, size) {
    $scope.opts = {
      size: size,
      backdrop: true,
      backdropClick: true,
      dialogFade: false,
      keyboard: true,
      templateUrl: 'html/clipSelectView.html',
      controller: ModalInstanceCtrl,
      resolve: {}
    };

    //Data being passed from main view to modal
      //Modal has access to clip's URL, title, and category
    $scope.opts.resolve.item = function() {
      return angular.copy({
        clipUrl: clip.clipUrl,
        title: clip.title,
        category: clip.category,
        clip: clip
      });
    };

    var modalInstance = $modal.open($scope.opts);
    modalInstance.result.then(function() {
      //on ok button press
    }, function() {
      //on cancel button press
      console.log("Modal Closed");
    });
  };

  //Fetch all clips data from the server
  $scope.loadAllClips();

  //Load all previously saved collections
  $scope.loadCollections();


}]);

//Controller for the modal
var ModalInstanceCtrl = function($scope, $modalInstance, Clips, $modal, item, $window) {
  $scope.collections = Clips.clips.collections;
  $scope.item = item.clip;

  //Shares url of current clip via twitter
  $scope.twitShare = function(clipUrl) {
    $window.open('https://twitter.com/intent/tweet?hashtags=clippr&text=' + clipUrl, 'height=300, width=400');
  };

  $scope.windowOpen = function(clipUrl) {
    $window.open('https://twitter.com/intent/tweet?hashtags=clipr&text=' + clipUrl, 'height=300, width=400');
  };

  //Shares url of current clip via facebook
  $scope.fbShare = function(url, title, winWidth, winHeight) {
    var winTop = (screen.height / 4) - (winHeight / 2);
    var winLeft = (screen.width / 4) - (winWidth / 2);
    window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' + title + '&p[url]=' + url + 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
  };

  //Shares url of current clip via Google+
  $scope.gooShare = function(url, title, winWidth, winHeight) {
    var w = 480;
    var h = 380;
    var x = Number((window.screen.width - w) / 2);
    var y = Number((window.screen.height - h) / 2);
    $window.open('https://plusone.google.com/share?hl=en&url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title) + '', 'width=' + w + ',height=' + h + ',left=' + x + ',top=' + y + ',scrollbars=no');

  };

  //Allows user to add clip to specific collection
  $scope.addToCollection = function(collection, clip) {
    Clips.addToCollection(collection, clip);
  };

  //Assigns clip to different category
  $scope.changeCategory = function(category, clip) {
    clip.category = category;
    Clips.changeCategory(category, clip.title);
  };

  //OK button function to close the modal
  $scope.ok = function() {
    $modalInstance.close();
  };

  //Cancel button function to close the modal
  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

};