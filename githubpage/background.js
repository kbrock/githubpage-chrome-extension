//get these out of preferences
var urlPatterns = {
  "github.com/.*github.(com|io)" : ["http://", "3", ".github.io/"],
  "github.io/$" : ["http://github.com/", "2", "/", "2", ".github.io"],
  "github.com" : ["http://", "3", ".github.io/", "4"],
  "github.io" : ["http://github.com/", "2", "/", "3"],
  "reflectivepixel.com" : ["http://github.com/kbrock/", "3"]
};

function onPageActionClicked(tab) {
  var tabUrlParts = tab.url.split('/');

  var urlPattern;
  for(var domain in urlPatterns) {
    if (tab.url.match(domain)) {
      urlPattern = urlPatterns[domain];
      break;
    }
  }

  var pageUrl;
  if (urlPattern) {
    var pageUrlParts = urlPattern.map(function(part) {
      if (part == 2) { // xxx.github.io
        return tabUrlParts[part].split(".")[0];
      } else if (isFinite(part)) { // projectname#x?x=y
        return tabUrlParts[part].split(/[#?]/)[0];
      } else { // hardcoded string
        return part;
      }
    });
    pageUrl = pageUrlParts.join("");
  }

  if (pageUrl) {
    chrome.tabs.create({
      index: tab.index + 1,
      url: pageUrl,
      openerTabId: tab.id
    });
  }
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
          pageUrl: { urlMatches: '(github.com|github.io|reflectivepixel)' },
        })
      ],
      // shows the extension's page action.
      actions: [ new chrome.declarativeContent.ShowPageAction() ]
    }]);
  });
});

