Shopbeam Spec
=============

Product specs and corresponding test automation for Shopbeam shoppable ads and universal cart

Specs
======

All Specs and Automation Code are inside [/features](/features) folder, check the README.md file inside that folder before reading or writting them.

Usage
===========

``` sh
  # install dependencies
  npm install

  # test all features
  npm test

  # test only some features
  ./node_modules/.bin/cucumber.js --tags @wip
  ./node_modules/.bin/cucumber.js features/somefolder  

  # using BROWSER env var
  BROWSER=firefox npm test
```

Driver Gotchas
==============

Internet Explorer
---------------

- Add the site being tested to Trusted Sites
