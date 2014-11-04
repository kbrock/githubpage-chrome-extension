function onPageActionClicked(tab) {
  var pageUrl, usrename, reponame;
  var split = tab.url.split('/');

  if (split[2].match("github.com")) {
    username = split[3];
    reponame = split[4].split('#')[0].split('?')[0];
    pageUrl = 'http://' + username + '.github.io/' + reponame;
  } else if (split[2].match("reflectivepixel.com")) {
    username = "kbrock";
    reponame = split[3].split('#')[0].split('?')[0];
    pageUrl = "http://github.com/"+username+"/"+reponame;
  } else {
    username = split[2].split(".")[0];
    reponame = split[3].split('#')[0].split('?')[0];
    pageUrl = "http://github.com/"+username+"/"+reponame;
  }
  // construct the url
  console.debug("pageUrl " + pageUrl);
  //chrome.pageAction.getTitle({tabId: tab.id}, function(result) {
    chrome.tabs.create({
      index: tab.index + 1,
      url: pageUrl,
      openerTabId: tab.id
    });
  //});
}
if (!chrome.pageAction.onClicked.hasListener(onPageActionClicked)) {
  chrome.pageAction.onClicked.addListener(onPageActionClicked);
}

chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([{
      // That fires when a page's URL contains 'github' ...
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { urlMatches: '(github|reflectivepixel)' },
        })
      ],
      // shows the extension's page action.
      actions: [ new chrome.declarativeContent.ShowPageAction() ]
    }]);
  });
});

