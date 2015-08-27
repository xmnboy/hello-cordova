# Hello, Cordova

See [LICENSE.md][] for license terms and conditions.

  [LICENSE.md]: LICENSE.md

This sample webview app illustrates the use of some common core Cordova APIs
and, where possible, the equivalent HTML5 APIs within a hybrid mobile HTML5 app.
This app has been built and installed on Android Crosswalk, Android, iOS
and Windows 8 devices. It may run on other Cordova platforms, but has not been
tested on those other platforms.

> A detailed "how to debug" using the [Intel XDK][1] and this app is provided in
> the [included tutorial][]. Please read the [included tutorial][] for an 
> introduction to this sample app and how to debug Cordova apps with the Intel XDK.

[included tutorial]: docs/README.md
[1]: <http://xdk.intel.com>

# NOTE:

For details regarding the included `.gitignore` file, please see the official
[git doc pages][2] and, specifically, the [gitignore reference page][3]. This 
`.gitignore` file can be used as a starting point for your own Intel XDK
projects. The Intel XDK blank templates and most of the Intel XDK samples
include a default `.gitignore` file for your project. You are welcome to
modify it to meet the needs of your project, if you are using git.

[2]: <http://git-scm.com/doc>
[3]: <http://git-scm.com/docs/gitignore>

The [`.jscodehints` file][] is used by Brackets to exclude files and directories
from code hint scanning. This is helpful for speeding up the built-in
Brackets editor if your project contains large numbers of files that are not 
part of your source or are not important for code hinting while using the
built-in Brackets editor.

[`.jscodehints` file]: <https://github.com/adobe/brackets/wiki/JavaScript-Code-Hints#configuration>

The `intelxdk.config.additions.xml` file contains additional configuration 
options that can be used to control the Cordova build option outside of that
which can be done using the Intel XDK graphical user interface (GUI). In addition,
it includes an alternate example of how you can include icons and splash screens
in your project; especially for including icons that are not yet part of the
Intel XDK GUI. See [_Adding Intel XDK Cordova Build Options Using the Additions
File_][4] for details.

[4]: <https://software.intel.com/en-us/xdk/docs/adding-special-build-options-to-your-xdk-cordova-app-with-the-intelxdk-config-additions-xml-file>

Please ignore the `config.xml` file, the Cordova CLI `config.xml` format has
been changing significantly, especially with the release of CLI 5, and this
`config.xml` file has not been updated to reflect those changes. It _will not
work_ as written. It was originally created for use with PhoneGap CLI and has
not yet been updated for use with a current version of Cordova CLI.
