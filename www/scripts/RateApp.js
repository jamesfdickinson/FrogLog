RateApp = {
    SessionUsed: null,
    Count: 0
};
RateApp.delayedPrompt = function () {

    if (RateApp.SessionUsed) return;

    RateApp.SessionUsed = true;

    RateApp.Count = localStorage.getItem('DelayedPromptCount');
    if (!RateApp.Count) RateApp.Count = 0;
    RateApp.Count = Number(RateApp.Count);
    RateApp.Count += 1;

    if (RateApp.Count == 10) {
        RateApp.confirm("Having fun?  Would you like to rate this app?");
    }
    if (RateApp.Count == 25) {
        RateApp.confirm("It looks like you really like this app.  Would you like to rate this app 5 stars?");
    }
    if (RateApp.Count == 60) {
        RateApp.confirm("You have opened this app more than a zillion times. Would you like to rate this app 5 stars? ");
    }
    if (RateApp.Count == 200) {
        RateApp.confirm("You have opened this app more than a zillion times. Would you like to rate this app 5 stars? ");
    }
    localStorage.DelayedPromptCount = RateApp.Count;
}
RateApp.confirm = function (message) {
    if (typeof navigator.notification != 'undefined') {
        navigator.notification.confirm(message, function (i) {
            if (i == 1) RateApp.rateGame();
        }, "Rate", ['Yes', 'No']);
    } else if (typeof confirm != 'undefined') {
        if (confirm(message)) {
            RateApp.rateGame();
        }
    }
}

RateApp.clearCount = function () {
    RateApp.Count = 0;
    localStorage.DelayedPromptCount = RateApp.Count;
}

RateApp.rateGame = function () {
   
   

        var ua = navigator.userAgent;
        var isKindle = /Kindle/i.test(ua) || /Silk/i.test(ua) || /Amazon/i.test(ua) || /KFTT/i.test(ua) || /KFOT/i.test(ua) || /KFJWA/i.test(ua) || /KFJWI/i.test(ua) || /KFSOWI/i.test(ua) || /KFTHWA/i.test(ua) || /KFTHWI/i.test(ua) || /KFAPWA/i.test(ua) || /KFAPWI/i.test(ua);

        if (/(android)/i.test(navigator.userAgent) && isKindle) {
            window.open('amzn://apps/android?asin=B00Z2ZUAYO', "_system");
        }
        else if (/(android)/i.test(navigator.userAgent) && !isKindle) {
            window.open('market://details?id=com.jimmyinteractive.speed', "_system");
            //  window.open('https://play.google.com/store/apps/details?id=com.jimmyinteractive.speed', "_system");
        }
        else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
            window.open('itms-apps://itunes.apple.com/app/id914247866', "_system"); // or itms://
            //https://itunes.apple.com/us/app/speed-the-card-game/id914247866?mt=8&ign-mpt=uo%3D4
        }
        else if (/(windows phone)/i.test(navigator.userAgent)) {
            window.open('http://windowsphone.com/s?appid=4fc55105-3b28-e011-854c-00237de2db9e' , "_system");
        }
        else if (/(windows)/i.test(navigator.userAgent)) {
            window.open('ms-windows-store:REVIEW?PFN=24528JimmyDickinson.SpeedTheCardGame_nww69jnfa3hjr', "_system");
        }
        else {
            window.open('https://www.facebook.com/pages/Speed-The-Card-Game/847181962036765', "_system");
        }
}

