var menuLauncher = (function (module) {
    const Rx = require("rx-lite");

    var menuLauncherSubject = new Rx.Subject();

    return {
        getLaunchSubject: function() {
            return menuLauncherSubject;
        },

        launchMenu: function() {
            menuLauncherSubject.onNext();
        }
    }

})(module);

module.exports = menuLauncher;