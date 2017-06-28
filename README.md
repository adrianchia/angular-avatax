Angular Avatax API
==================
[![Build Status](https://travis-ci.org/adrianchia/angular-avatax.svg?branch=master)](https://travis-ci.org/adrianchia/angular-avatax)

Unofficial Angular service to communicate with [Avalara Avatax API](https://sandbox-rest.avatax.com/swagger/ui/)

## Usage

Include avalara into your angular module

```js
angular.module('app', ['avalara'])
```

Configure Avatax by using `AvataxProvider`. You can choose to supply username/password or accountId/licenseKey as well as environment (sandbox/ production). If no environment is provided, it will default to `production`.

E.g. Sandbox environment using usernam/password
```js
angular.module('app').config(AppConfig);

/* @ngInject */
function AppConfig(AvataxProvider) {
  AvataxProvider.init({
      username: '<YOUR USERNAME>',
      password: '<YOUR PASSWORD>',
      env: 'sandbox'
  });
}
```

E.g. Production environment using accountId/licenseKey
```js
angular.module('app').config(AppConfig);

/* @ngInject */
function AppConfig(AvataxProvider) {
  AvataxProvider.init({
      accountId: '<YOUR ACCOUNT ID>',
      licenseKey: '<YOUR LICENSE KEY>'
  });
}
```

Use `Avatax` from a controller or service.

```js
angular.module('app').controller('taxController', taxController);

/* @ngInject */
function taxController(Avatax) {
  Avatax.transactions
    .createTransactions({...})
    .then(function (response) {
      //do with response
    });
}
```
