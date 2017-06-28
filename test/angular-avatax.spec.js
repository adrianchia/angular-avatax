'use strict';
describe('avalara', function() {

  describe('AvataxProvider', function() {

    var avataxProvider;

    beforeEach(function() {
      module('avalara', function(_AvataxProvider_) {
        avataxProvider = _AvataxProvider_;
      });

      inject(function() {});
    });

    it('should be defined', function() {
      expect(avataxProvider).toBeDefined();
    });

    it('should have a method init()', function() {
      expect(avataxProvider.init).toBeDefined();
    });

    it('should have a method getEnv()', function() {
      expect(avataxProvider.getEnv).toBeDefined();
    });

    it('should have a method getBaseUrl()', function() {
      expect(avataxProvider.getBaseUrl).toBeDefined();
    });

    it('should have default environment as production', function() {
      expect(avataxProvider.getEnv()).toBe('production');
    });

    it('should throw error with invalid config', function() {
      expect(function() { avataxProvider.init();}).toThrow(new Error('config must be provided to Avatax API'));
    });

    it('should throw error when username/password or accountId/licenseKey combination is not supplied', function() {
      expect(function() {avataxProvider.init({}) }).toThrow(new Error('either username/password or accountId/licenseKey combination must be provided to Avatax API'));
    });

    it('should not throw error when username/password is supplied', function() {
      expect(function() {
        avataxProvider.init({
        username: 'aaaa',
        password: 'bbbb'
      });
      }).not.toThrow(new Error('either username/password or accountId/licenseKey combination must be provided to Avatax API'));
    });

    it('should not throw error when accountId/licenseKey is supplied', function() {
      expect(function() {
        avataxProvider.init({
        accountId: 'aaaa',
        licenseKey: 'bbbb'
      });
      }).not.toThrow(new Error('either username/password or accountId/licenseKey combination must be provided to Avatax API'));
    });

    it('should set environment to sandbox when configured', function() {
      avataxProvider.init({
        username: 'aaaa',
        password: 'bbbb',
        env: 'sandbox'
      });
      expect(avataxProvider.getEnv()).toBe('sandbox');
    });

    it('should should provide production baseUrl when environment is production', function() {
      expect(avataxProvider.getBaseUrl()).toBe('https://rest.avatax.com/api/v2/');
    });

    it('should should provide sandbox baseUrl when environment is sandbox', function() {
      avataxProvider.init({
        username: 'aaaa',
        password: 'bbbb',
        env: 'sandbox'
      });
      expect(avataxProvider.getBaseUrl()).toBe('https://sandbox-rest.avatax.com/api/v2/');
    });
  });

  describe('Avatax', function() {
    var AvataxProvider;

    beforeEach(function() {
      module('avalara', function(_AvataxProvider_) {
        AvataxProvider = _AvataxProvider_;
        AvataxProvider.init({username: '123', password: '456'});
      });
      inject(function() {});
    });

    var Avatax;

    beforeEach(inject(function(_Avatax_) {
      Avatax = _Avatax_;
    }));

    it('should be defined', function() {
      expect(Avatax).toBeDefined();
    });

    it('should have a _api method', function() {
      expect(Avatax._api).toBeDefined();
    });

    it('should have getTransactionById method', function() {
      expect(Avatax.transactions.getTransactionById).toBeDefined();
    });

    it('should have createTransaction method', function() {
      expect(Avatax.transactions.createTransaction).toBeDefined();
    });

    describe('Avatax.accounts', function() {
      var $httpBackend;
      var Avatax;
      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call activate api', function() {
        spyOn(Avatax, '_api');

        Avatax.accounts.activateAccount('12345', {
          'acceptAvalaraTermsAndConditions': true,
          'haveReadAvalaraTermsAndConditions': true
        });

        expect(Avatax._api).toHaveBeenCalledWith('accounts/12345/activate', 'POST', null, {
          'acceptAvalaraTermsAndConditions': true,
          'haveReadAvalaraTermsAndConditions': true
        });
      });

      it('should call get account configuration api', function() {
        spyOn(Avatax, '_api');

        Avatax.accounts.getAccountConfiguration('12345');

        expect(Avatax._api).toHaveBeenCalledWith('accounts/12345/configuration', 'GET', null, null);
      });

      it('should call set account configuration api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "accountId": 0,
            "category": "TaxServiceConfig",
            "name": "MaxLines",
            "value": "1000"
          }
        ];

        Avatax.accounts.setAccountConfiguration('12345', reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/12345/configuration', 'POST', null, reqBody);
      });

      it('should call reset license key api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          'accountId': '12345',
          'confirmResetLicenseKey': true
        };

        Avatax.accounts.resetLicenseKey('12345', reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/12345/resetlicensekey', 'POST', null, reqBody);
      });

      it('should call get account by id api', function() {
        spyOn(Avatax, '_api');

        Avatax.accounts.getAccountById('12345');

        expect(Avatax._api).toHaveBeenCalledWith('accounts/12345', 'GET', {'$include': undefined}, null);
      });
    });

    describe('Avatax.addresses', function() {
      var $httpBackend;
      var Avatax;
      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call address resolve (GET) api', function() {
        spyOn(Avatax, '_api');
        Avatax.addresses.resolveAddress("l1", "l2","l3", "San Francisco", "CA", "96431", "US", "Mixed", null, null);

        expect(Avatax._api).toHaveBeenCalledWith('addresses/resolve', 'GET', {
          "line1": "l1",
          "line2": "l2",
          "line3": "l3",
          "city": "San Francisco",
          "region": "CA",
          "postalCode": "96431",
          "country": "US",
          "textCase": "Mixed",
          "latitude": null,
          "longitude": null
        }, null);
      });

      it('should call address resolve (POST) api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "textCase": "Upper",
          "line1": "123 Main Street",
          "city": "Irvine",
          "region": "CA",
          "country": "US",
          "postalCode": "92615"
        };

        Avatax.addresses.resolveAddressPost(reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('addresses/resolve', 'POST', null, reqBody);

      });
    });

    describe('Avatax.batches', function() {
      var $httpBackend;
      var Avatax;

      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call batches api', function() {
        spyOn(Avatax, '_api');

        Avatax.batches.queryBatches();

        expect(Avatax._api).toHaveBeenCalledWith('batches', 'GET', {
          "$include": undefined,
          "$filter": undefined,
          "$top": undefined,
          "$skip": undefined,
          "$orderBy": undefined
        }, null);
      });

      it('should list batches by company', function() {
        spyOn(Avatax, '_api');

        Avatax.batches.listBatchesByCompany(12345);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/batches', 'GET', {
          "$include": undefined,
          "$filter": undefined,
          "$top": undefined,
          "$skip": undefined,
          "$orderBy": undefined
        }, null);
      });

      it('should create batches by company', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "name": "TestBatch",
            "type": "TransactionImport",
            "batchAgent": "manual",
            "files": [
              {
                "name": "samplebatch.csv",
                "content": "UHJvY2Vzc0NvZGUsRG9jQ29kZSxEb2NUeXBlLERvY0RhdGUsQ29tcGFueUNvZGUsQ3VzdG9tZXJDb2RlLEVudGl0eVVzZUNvZGUsTGluZU5vLFRheENvZGUsVGF4RGF0ZSxJdGVtQ29kZSxEZXNjcmlwdGlvbixRdHksQW1vdW50LERpc2NvdW50LFJlZjEsUmVmMixFeGVtcHRpb25ObyxSZXZBY2N0LERlc3RBZGRyZXNzLERlc3RDaXR5LERlc3RSZWdpb24sRGVzdFBvc3RhbENvZGUsRGVzdENvdW50cnksT3JpZ0FkZHJlc3MsT3JpZ0NpdHksT3JpZ1JlZ2lvbixPcmlnUG9zdGFsQ29kZSxPcmlnQ291bnRyeSxMb2NhdGlvbkNvZGUsU2FsZXNQZXJzb25Db2RlLFB1cmNoYXNlT3JkZXJObyxDdXJyZW5jeUNvZGUsRXhjaGFuZ2VSYXRlLEV4Y2hhbmdlUmF0ZUVmZkRhdGUsUGF5bWVudERhdGUsVGF4SW5jbHVkZWQsRGVzdFRheFJlZ2lvbixPcmlnVGF4UmVnaW9uLFRheGFibGUsVGF4VHlwZSxUb3RhbFRheCxDb3VudHJ5TmFtZSxDb3VudHJ5Q29kZSxDb3VudHJ5UmF0ZSxDb3VudHJ5VGF4LFN0YXRlTmFtZSxTdGF0ZUNvZGUsU3RhdGVSYXRlLFN0YXRlVGF4LENvdW50eU5hbWUsQ291bnR5Q29kZSxDb3VudHlSYXRlLENvdW50eVRheCxDaXR5TmFtZSxDaXR5Q29kZSxDaXR5UmF0ZSxDaXR5VGF4LE90aGVyMU5hbWUsT3RoZXIxQ29kZSxPdGhlcjFSYXRlLE90aGVyMVRheCxPdGhlcjJOYW1lLE90aGVyMkNvZGUsT3RoZXIyUmF0ZSxPdGhlcjJUYXgsT3RoZXIzTmFtZSxPdGhlcjNDb2RlLE90aGVyM1JhdGUsT3RoZXIzVGF4LE90aGVyNE5hbWUsT3RoZXI0Q29kZSxPdGhlcjRSYXRlLE90aGVyNFRheCxSZWZlcmVuY2VDb2RlLEJ1eWVyc1ZBVE5vLElzU2VsbGVySW1wb3J0ZXJPZlJlY29yZCxCUkJ1eWVyVHlwZSxCUkJ1eWVyX0lzRXhlbXB0T3JDYW5ub3RXSF9JUlJGLEJSQnV5ZXJfSXNFeGVtcHRPckNhbm5vdFdIX1BJU1JGLEJSQnV5ZXJfSXNFeGVtcHRPckNhbm5vdFdIX0NPRklOU1JGLEJSQnV5ZXJfSXNFeGVtcHRPckNhbm5vdFdIX0NTTExSRixCUkJ1eWVyX0lzRXhlbXB0X1BJUyxCUkJ1eWVyX0lzRXhlbXB0X0NPRklOUyxCUkJ1eWVyX0lzRXhlbXB0X0NTTEwsSGVhZGVyX0Rlc2NyaXB0aW9uLEVtYWlsDQozLDlhYzI4MGMzLTNhNTUtNGEzNS1iZWQyLWE4M2RiNTNiMDUxZSwxLDEvMS8yMDE0LERFRkFVTFQsQ3VzdDEsLDEsLCwsLCwxMDAwLCwsLCwsMjM1IEUgNDJuZCBTdCAsTmV3IFlvcmssTlksMTAwMTctNTcwMyAgLFVTLDkwMCBXaW5zbG93IFdheSxCYWluYnJpZGdlIElzbGFuZCxXQSw5ODExMCxVUywsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwNCg==",
                "contentLength": 0,
                "contentType": "text/csv",
                "fileExtension": ".csv"
              }
            ]
          }
        ];

        Avatax.batches.createBatches(12345, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/batches', 'POST', null, reqBody);
      });

      it('should download a single batch file', function() {
        spyOn(Avatax, '_api');

        Avatax.batches.downloadBatch(12345,12,1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/batches/12/files/1/attachment', 'GET', null, null);
      });

      it('should delete a batch by company', function() {
        spyOn(Avatax, '_api');

        Avatax.batches.deleteBatch(12345,12);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/batches/12', 'DELETE', null, null);
      });

      it('should get a batch by company', function() {
        spyOn(Avatax, '_api');

        Avatax.batches.getBatch(12345,12);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/batches/12', 'GET', null, null);
      });
    });

    describe('Avatax.companies', function() {
      var $httpBackend;
      var Avatax;
      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call queryCompanies api', function() {
        spyOn(Avatax, '_api');
        Avatax.companies.queryCompanies();

        expect(Avatax._api).toHaveBeenCalledWith('companies', 'GET', {
          "$include": undefined,
          "$filter": undefined,
          "$top": undefined,
          "$skip": undefined,
          "$orderBy": undefined
        }, null);
      });

      it('should call createCompanies api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 12345,
            "accountId": 123456789,
            "companyCode": "DEFAULT",
            "name": "Default Company",
            "isDefault": false,
            "isActive": true,
            "taxpayerIdNumber": "123456789",
            "hasProfile": true,
            "isReportingEntity": false,
            "defaultCountry": "US",
            "baseCurrencyCode": "USD",
            "roundingLevelId": "Line",
            "isTest": true,
            "taxDependencyLevelId": "Document",
            "inProgress": false
          }
        ];

        Avatax.companies.createCompanies(reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies', 'POST', null, reqBody);
      });

      it('should call deleteCompany api', function() {
        spyOn(Avatax, '_api');

        Avatax.companies.deleteCompany(12345);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345', 'DELETE', null, null);
      });

      it('should call getCompany api', function() {
        spyOn(Avatax, '_api');

        Avatax.companies.getCompany(12345);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345', 'GET', {
          '$include': undefined
        }, null);
      });

      it('should call updateCompany api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "id": 12345,
          "accountId": 123456789,
          "companyCode": "DEFAULT",
          "name": "Default Company",
          "isDefault": false,
          "isActive": true,
          "taxpayerIdNumber": "123456789",
          "hasProfile": true,
          "isReportingEntity": false,
          "defaultCountry": "US",
          "baseCurrencyCode": "USD",
          "roundingLevelId": "Line",
          "isTest": true,
          "taxDependencyLevelId": "Document",
          "inProgress": false
        };

        Avatax.companies.updateCompany(12345, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345', 'PUT', null, reqBody);
      });

      it('should call getCompanyConfiguration api', function() {
        spyOn(Avatax, '_api');

        Avatax.companies.getCompanyConfiguration(12345);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/configuration', 'GET', null, null);
      });

      it('should call setCompanyConfiguration api', function() {
        spyOn(Avatax, '_api');

        var reqBody =  [
          {
            "companyId": 0,
            "category": "AvaCertServiceConfig",
            "name": "AllowPending",
            "value": "true"
          }
        ];

        Avatax.companies.setCompanyConfiguration(12345, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/configuration', 'POST', null, reqBody);
      });

      it('should call getFilingStatus api', function() {
        spyOn(Avatax, '_api');

        Avatax.companies.getFilingStatus(12345);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filingstatus', 'GET', null, null);
      });

      it('should call changeFilingStatus api', function() {
        spyOn(Avatax, '_api');

        let reqBody = {
          "requestedStatus": "FirstFiling"
        };

        Avatax.companies.changeFilingStatus(12345, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filingstatus', 'POST', null, reqBody);
      });

      it('should call listFundingRequestsByCompany api', function() {
        spyOn(Avatax, '_api');

        Avatax.companies.listFundingRequestsByCompany(12345);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/funding', 'GET', null, null);
      });

      it('should call createFundingRequest api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "requestEmail": true,
          "fundingEmailRecipient": "user@example.org"
        };

        Avatax.companies.createFundingRequest(12345, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/funding/setup', 'POST', null, reqBody);
      });

      it('should call companyInitialize api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "name": "Bob's Artisan Pottery",
          "companyCode": "DEFAULT",
          "taxpayerIdNumber": "12-3456789",
          "line1": "123 Main Street",
          "city": "Irvine",
          "region": "CA",
          "postalCode": "92615",
          "country": "US",
          "firstName": "Bob",
          "lastName": "Example",
          "title": "Owner",
          "email": "bob@example.org",
          "phoneNumber": "714 555-2121",
          "mobileNumber": "714 555-1212"
        };

        Avatax.companies.companyInitialize(reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/initialize', 'POST', null, reqBody);
      });
    });

    describe('Avatax.contacts', function() {
      var $httpBackend;
      var Avatax;

      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call listContactsByCompany api', function() {
        spyOn(Avatax, '_api');

        Avatax.contacts.listContactsByCompany('12345');

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/contacts', 'GET', {
          "$include": undefined,
          "$filter": undefined,
          "$top": undefined,
          "$skip": undefined,
          "$orderBy": undefined
        }, null);
      });

      it('should call createContacts api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 56789,
            "companyId": 12345,
            "contactCode": "DEFAULT",
            "firstName": "Bob",
            "lastName": "McExample",
            "title": "Owner",
            "line1": "123 Main Street",
            "city": "Irvine",
            "region": "CA",
            "postalCode": "92615",
            "country": "US",
            "email": "bob@example.org",
            "phone": "714 555-1212"
          }
        ];

        Avatax.contacts.createContacts(12345, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/contacts', 'POST', null, reqBody);
      });

      it('should call deleteContact api', function() {
        spyOn(Avatax, '_api');

        Avatax.contacts.deleteContact(12345, 22);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/contacts/22', 'DELETE', null, null);
      });

      it('should call getContact api', function() {
        spyOn(Avatax, '_api');

        Avatax.contacts.getContact(12345, 22);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/contacts/22', 'GET', null, null);
      });

      it('should call updateContact api', function() {
        spyOn(Avatax, '_api');

        let reqBody = {
          "id": 56789,
          "companyId": 12345,
          "contactCode": "DEFAULT",
          "firstName": "Bob",
          "lastName": "McExample",
          "title": "Owner",
          "line1": "123 Main Street",
          "city": "Irvine",
          "region": "CA",
          "postalCode": "92615",
          "country": "US",
          "email": "bob@example.org",
          "phone": "714 555-1212"
        };

        Avatax.contacts.updateContact(12345,56789, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/contacts/56789', 'PUT', null, reqBody);
      });

      it('should call queryContacts api', function() {
        spyOn(Avatax, '_api');

        Avatax.contacts.queryContacts();

        expect(Avatax._api).toHaveBeenCalledWith('contacts', 'GET', {
          "$include": undefined,
          "$filter": undefined,
          "$top": undefined,
          "$skip": undefined,
          "$orderBy": undefined
        }, null);
      });
    });

    describe('Avatax.definitions', function() {
      var $httpBackend;
      var Avatax;

      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call listAvaFileForms api', function() {
        spyOn(Avatax, '_api');

        Avatax.definitions.listAvaFileForms();

        expect(Avatax._api).toHaveBeenCalledWith('definitions/avafileforms', 'GET', null, null);
      });

      it('should call listCommunicationsTransactionTypes api', function() {
        spyOn(Avatax, '_api');

        Avatax.definitions.listCommunicationsTransactionTypes();

        expect(Avatax._api).toHaveBeenCalledWith('definitions/communications/transactiontypes', 'GET', null, null);
      });

      it('should call listCommunicationsServiceTypes api', function() {
        spyOn(Avatax, '_api');

        Avatax.definitions.listCommunicationsServiceTypes(123);

        expect(Avatax._api).toHaveBeenCalledWith('definitions/communications/transactiontypes/123/servicetypes', 'GET', null, null);
      });

      it('should call listCommunicationsTSPairs api', function() {
        spyOn(Avatax, '_api');

        Avatax.definitions.listCommunicationsTSPairs();

        expect(Avatax._api).toHaveBeenCalledWith('definitions/communications/tspairs', 'GET', null, null);
      });

      it('should call listCountries api', function() {
        spyOn(Avatax, '_api');

        Avatax.definitions.listCountries();

        expect(Avatax._api).toHaveBeenCalledWith('definitions/countries', 'GET', null, null);
      });

      it('should call listRateTypesByCountry api', function() {
        spyOn(Avatax, '_api');

        Avatax.definitions.listRateTypesByCountry('US');

        expect(Avatax._api).toHaveBeenCalledWith('definitions/countries/US/ratetypes', 'GET', null, null);
      });

      it('should call listRegionsByCountry api', function() {
        spyOn(Avatax, '_api');

        Avatax.definitions.listRegionsByCountry('US');

        expect(Avatax._api).toHaveBeenCalledWith('definitions/countries/US/regions', 'GET', null, null);
      });

      it('should call listEntityUseCodes api', function() {
        spyOn(Avatax, '_api');

        Avatax.definitions.listEntityUseCodes();

        expect(Avatax._api).toHaveBeenCalledWith('definitions/entityusecodes', 'GET', null, null);
      });

      it('should call listLoginVerifiers api', function() {
        spyOn(Avatax, '_api');

        Avatax.definitions.listLoginVerifiers();

        expect(Avatax._api).toHaveBeenCalledWith('definitions/filingcalendars/loginverifiers', 'GET', null, null);
      });

      it('should call getLoginVerifierByForm api', function() {
        spyOn(Avatax, '_api');

        Avatax.definitions.getLoginVerifierByForm(123);

        expect(Avatax._api).toHaveBeenCalledWith('definitions/filingcalendars/loginverifiers/123', 'GET', null, null);
      });

      it('should call listFilingFrequencies api', function() {
        spyOn(Avatax, '_api');

        Avatax.definitions.listFilingFrequencies();

        expect(Avatax._api).toHaveBeenCalledWith('definitions/filingfrequencies', 'GET', null, null);
      });

      it('should call listJurisdictionsByAddress api', function() {
        spyOn(Avatax, '_api');

        Avatax.definitions.listJurisdictionsByAddress('5500 Irvine Center Dr', null, null, 'Irvine', 'CA', "92618", "US");

        expect(Avatax._api).toHaveBeenCalledWith('definitions/jurisdictionsnearaddress', 'GET', {
          'line1': '5500 Irvine Center Dr',
          'line2': null,
          'line3': null,
          'city': 'Irvine',
          'region': 'CA',
          'postalCode': '92618',
          'country': 'US'
        }, null);
      });

      it('should call listLocationQuestionsByAddress api', function() {
        spyOn(Avatax, '_api');

        Avatax.definitions.listLocationQuestionsByAddress('5500 Irvine Center Dr', null, null, 'Irvine', 'CA', "92618", "US");

        expect(Avatax._api).toHaveBeenCalledWith('definitions/locationquestions', 'GET', {
          'line1': '5500 Irvine Center Dr',
          'line2': null,
          'line3': null,
          'city': 'Irvine',
          'region': 'CA',
          'postalCode': '92618',
          'country': 'US'
        }, null);
      });

      it('should call listNexus api', function() {
        spyOn(Avatax, '_api');

        Avatax.definitions.listNexus();

        expect(Avatax._api).toHaveBeenCalledWith('definitions/nexus', 'GET', null, null);
      });

      it('should call listNexusByCountry api', function() {
        spyOn(Avatax, '_api');

        Avatax.definitions.listNexusByCountry('US');

        expect(Avatax._api).toHaveBeenCalledWith('definitions/nexus/US', 'GET', null, null);
      });

      it('should call listNexusByCountryAndRegion api', function() {
        spyOn(Avatax, '_api');

        Avatax.definitions.listNexusByCountryAndRegion('US', 'CA');

        expect(Avatax._api).toHaveBeenCalledWith('definitions/nexus/US/CA', 'GET', null, null);
      });

      it('should call listNexusByAddress api', function() {
        spyOn(Avatax, '_api');

        Avatax.definitions.listNexusByAddress('5500 Irvine Center Dr', null, null, 'Irvine', 'CA', "92618", "US");

        expect(Avatax._api).toHaveBeenCalledWith('definitions/nexus/byaddress', 'GET', {
          'line1': '5500 Irvine Center Dr',
          'line2': null,
          'line3': null,
          'city': 'Irvine',
          'region': 'CA',
          'postalCode': '92618',
          'country': 'US'
        }, null);
      });

      it('should call listNexusByFormCode api', function() {
        spyOn(Avatax, '_api');

        Avatax.definitions.listNexusByFormCode('AL2100');

        expect(Avatax._api).toHaveBeenCalledWith('definitions/nexus/byform/AL2100', 'GET', null, null);
      });

      it('should call listNexusTaxTypeGroups api', function() {
        spyOn(Avatax, '_api');

        Avatax.definitions.listNexusTaxTypeGroups();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/nexustaxtypegroups', 'GET', null, null);
      });

      it('should call listNoticeCustomerFundingOptions api', function () {
        spyOn(Avatax, '_api');
        Avatax.definitions.listNoticeCustomerFundingOptions();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/noticecustomerfundingoptions', 'GET', null, null);
      });

      it('should call listNoticeCustomerTypes api', function () {
        spyOn(Avatax, '_api');
        Avatax.definitions.listNoticeCustomerTypes();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/noticecustomertypes', 'GET', null, null);
      });

      it('should call listNoticeFilingTypes api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listNoticeFilingTypes();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/noticefilingtypes', 'GET', null, null);
      });

      it('should call listNoticePriorities api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listNoticePriorities();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/noticepriorities', 'GET', null, null);
      });

      it('should call listNoticeReasons api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listNoticeReasons();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/noticereasons', 'GET', null, null);
      });

      it('should call listNoticeResponsibilities api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listNoticeResponsibilities();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/noticeresponsibilities', 'GET', null, null);
      });

      it('should call listNoticeRootCauses api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listNoticeRootCauses();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/noticerootcauses', 'GET', null, null);
      });

      it('should call listNoticeStatuses api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listNoticeStatuses();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/noticestatuses', 'GET', null, null);
      });

      it('should call listNoticeTypes api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listNoticeTypes();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/noticetypes', 'GET', null, null);
      });

      it('should call listParameters api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listParameters();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/parameters', 'GET', null, null);
      });

      it('should call listPermissions api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listPermissions();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/permissions', 'GET', null, null);
      });

      it('should call listRegions api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listRegions();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/regions', 'GET', null, null);
      });

      it('should call listResourceFileTypes api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listResourceFileTypes();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/resourcefiletypes', 'GET', null, null);
      });

      it('should call listSecurityRoles api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listSecurityRoles();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/securityroles', 'GET', null, null);
      });

      it('should call listSubscriptionTypes api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listSubscriptionTypes();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/subscriptiontypes', 'GET', null, null);
      });

      it('should call listTaxAuthorities api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listTaxAuthorities();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/taxauthorities', 'GET', null, null);
      });

      it('should call listTaxAuthorityForms api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listTaxAuthorityForms();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/taxauthorityforms', 'GET', null, null);
      });

      it('should call listTaxAuthorityTypes api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listTaxAuthorityTypes();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/taxauthoritytypes', 'GET', null, null);
      });

      it('should call listTaxCodes api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listTaxCodes();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/taxcodes', 'GET', null, null);
      });

      it('should call listTaxCodeTypes api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listTaxCodeTypes();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/taxcodetypes', 'GET', null, null);
      });

      it('should call listTaxSubTypes api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listTaxSubTypes();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/taxsubtypes', 'GET', null, null);
      });

      it('should call listTaxTypeGroups api', function() {
        spyOn(Avatax, '_api');
        Avatax.definitions.listTaxTypeGroups();
        expect(Avatax._api).toHaveBeenCalledWith('definitions/taxtypegroups', 'GET', null, null);
      });
    });

    describe('Avatax.filingCalendars', function() {
      var $httpBackend;
      var Avatax;

      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call listFilingCalendars api', function() {
        spyOn(Avatax, '_api');
        Avatax.filingCalendars.listFilingCalendars(56789);

        expect(Avatax._api).toHaveBeenCalledWith('companies/56789/filingcalendars', 'GET', {
          '$filter': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });

      it('should call deleteFilingCalendar api', function() {
        spyOn(Avatax, '_api');
        Avatax.filingCalendars.deleteFilingCalendar(56789, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/56789/filingcalendars/1', 'DELETE', null, null);
      });

      it('should call getFilingCalendar api', function() {
        spyOn(Avatax, '_api');
        Avatax.filingCalendars.getFilingCalendar(56789, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/56789/filingcalendars/1', 'GET', null, null);
      });

      it('should call updateFilingCalendar api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "id": 56789,
          "companyId": 12345,
          "returnName": "CABOE401A2",
          "outletTypeId": "None",
          "filingFrequencyId": "Quarterly",
          "months": 2340,
          "stateRegistrationId": "101-123456",
          "employerIdentificationNumber": "12-3456789",
          "line1": "123 Main Street",
          "city": "Irvine",
          "region": "CA",
          "postalCode": "92615",
          "country": "US",
          "phone": "714 555-1212",
          "legalEntityName": "Bob's Artisan Pottery",
          "effectiveDate": "2015-01-01",
          "filingTypeId": "ElectronicReturn",
          "prepayPercentage": 90,
          "taxTypeId": "All"
        };

        Avatax.filingCalendars.updateFilingCalendar(12345, 56789, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filingcalendars/56789', 'PUT', null, reqBody);
      });

      it('should call cycleSafeExpiration api', function() {
        spyOn(Avatax, '_api');
        Avatax.filingCalendars.cycleSafeExpiration(56789, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/56789/filingcalendars/1/cancel/options', 'GET', null, null);
      });

      it('should call cancelFilingRequests api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 12345,
            "companyId": 12345,
            "filingRequestStatusId": "New",
            "data": {
              "companyReturnId": 1,
              "returnName": "WIST12CT",
              "filingFrequencyId": "Monthly",
              "registrationId": "1234",
              "months": 2,
              "taxTypeId": "SalesTax",
              "locationCode": "LOC-1",
              "effDate": "2017-01-01",
              "endDate": "2017-01-01",
              "isClone": false,
              "region": "WI",
              "taxAuthorityId": 121,
              "taxAuthorityName": "WISCONSIN",
              "answers": [
                {
                  "filingQuestionId": 1,
                  "answer": "Answer to question 1"
                },
                {
                  "filingQuestionId": 2,
                  "answer": "Answer to question 2"
                }
              ]
            }
          }
        ];

        Avatax.filingCalendars.cancelFilingRequests(56789, 1, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/56789/filingcalendars/1/cancel/request', 'POST', null, reqBody);
      });

      it('should call cycleSafeEdit api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "fieldName": "Ein",
            "questionId": 36,
            "oldValue": "002094004",
            "newValue": "002094005"
          }
        ];

        Avatax.filingCalendars.cycleSafeEdit(56789, 1, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/56789/filingcalendars/1/edit/options', 'POST', null, reqBody);
      });

      it('should call requestFilingCalendarUpdate api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 12345,
            "companyId": 12345,
            "filingRequestStatusId": "New",
            "data": {
              "companyReturnId": 1,
              "returnName": "WIST12CT",
              "filingFrequencyId": "Monthly",
              "registrationId": "1234",
              "months": 2,
              "taxTypeId": "SalesTax",
              "locationCode": "LOC-1",
              "effDate": "2017-01-01",
              "endDate": "2017-01-01",
              "isClone": false,
              "region": "WI",
              "taxAuthorityId": 121,
              "taxAuthorityName": "WISCONSIN",
              "answers": [
                {
                  "filingQuestionId": 1,
                  "answer": "Answer to question 1"
                },
                {
                  "filingQuestionId": 2,
                  "answer": "Answer to question 2"
                }
              ]
            }
          }
        ];

        Avatax.filingCalendars.requestFilingCalendarUpdate(56789, 1, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/56789/filingcalendars/1/edit/request', 'POST', null, reqBody);
      });

      it('should call cycleSafeAdd api', function() {
        spyOn(Avatax, '_api');

        Avatax.filingCalendars.cycleSafeAdd(56789);

        expect(Avatax._api).toHaveBeenCalledWith('companies/56789/filingcalendars/add/options', 'GET', {
          "formCode": undefined
        }, null);
      });

      it('should call createFilingRequests api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 12345,
            "companyId": 12345,
            "filingRequestStatusId": "New",
            "data": {
              "companyReturnId": 1,
              "returnName": "WIST12CT",
              "filingFrequencyId": "Monthly",
              "registrationId": "1234",
              "months": 2,
              "taxTypeId": "SalesTax",
              "locationCode": "LOC-1",
              "effDate": "2017-01-01",
              "endDate": "2017-01-01",
              "isClone": false,
              "region": "WI",
              "taxAuthorityId": 121,
              "taxAuthorityName": "WISCONSIN",
              "answers": [
                {
                  "filingQuestionId": 1,
                  "answer": "Answer to question 1"
                },
                {
                  "filingQuestionId": 2,
                  "answer": "Answer to question 2"
                }
              ]
            }
          }
        ];

        Avatax.filingCalendars.createFilingRequests(12345, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filingcalendars/add/request', 'POST', null, reqBody);
      });

      it('should call listFilingRequests api', function() {
        spyOn(Avatax, '_api');

        Avatax.filingCalendars.listFilingRequests(12345);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filingrequests', 'GET', {
          '$filter': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });

      it('should call getFilingRequest api', function() {
        spyOn(Avatax, '_api');

        Avatax.filingCalendars.getFilingRequest(12345, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filingrequests/1', 'GET', null, null);
      });

      it('should call updateFilingRequest api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "id": 12345,
          "companyId": 12345,
          "filingRequestStatusId": "New",
          "data": {
            "companyReturnId": 1,
            "returnName": "WIST12CT",
            "filingFrequencyId": "Monthly",
            "registrationId": "1234",
            "months": 2,
            "taxTypeId": "SalesTax",
            "locationCode": "LOC-1",
            "effDate": "2017-01-01",
            "endDate": "2017-01-01",
            "isClone": false,
            "region": "WI",
            "taxAuthorityId": 121,
            "taxAuthorityName": "WISCONSIN",
            "answers": [
              {
                "filingQuestionId": 1,
                "answer": "Answer to question 1"
              },
              {
                "filingQuestionId": 2,
                "answer": "Answer to question 2"
              }
            ]
          }
        };

        Avatax.filingCalendars.updateFilingRequest(12345, 1, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filingrequests/1', 'PUT', null, reqBody);
      });

      it('should call approveFilingRequest api', function() {
        spyOn(Avatax, '_api');

        Avatax.filingCalendars.approveFilingRequest(12345, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filingrequests/1/approve', 'POST', null, null);
      });

      it('should call cancelFilingRequest api', function() {
        spyOn(Avatax, '_api');

        Avatax.filingCalendars.cancelFilingRequest(12345, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filingrequests/1/cancel', 'POST', null, null);
      });

      it('should call queryFilingCalendars api', function() {
        spyOn(Avatax, '_api');

        Avatax.filingCalendars.queryFilingCalendars();

        expect(Avatax._api).toHaveBeenCalledWith('filingcalendars', 'GET', {
          '$filter': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });

      it('should call loginVerificationStatus api', function() {
        spyOn(Avatax, '_api');

        Avatax.filingCalendars.loginVerificationStatus(1);

        expect(Avatax._api).toHaveBeenCalledWith('filingcalendars/credentials/1', 'GET', null, null);
      });

      it('should call loginVerificationRequest api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "companyId": 12345,
          "accountId": 1987654323,
          "region": "AR",
          "username": "Test",
          "password": "Test",
          "additionalOptions": "4133|AR-2131232-13",
          "bulkRequestId": 1,
          "priority": 2
        };

        Avatax.filingCalendars.loginVerificationRequest(reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('filingcalendars/credentials/verify', 'POST', null, reqBody);
      });

      it('should call queryFilingRequests api', function() {
        spyOn(Avatax, '_api');

        Avatax.filingCalendars.queryFilingRequests();

        expect(Avatax._api).toHaveBeenCalledWith('filingrequests', 'GET', {
          '$filter': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });
    });

    describe('Avatax.filings', function() {
      var $httpBackend;
      var Avatax;

      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call getFilingAttachment api', function() {
        spyOn(Avatax, '_api');
        Avatax.filings.getFilingAttachment(12345, 56789, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/56789/attachment', 'GET', {
          'fileId': 1
        }, null);
      });

      it('should call filingsCheckupReport api', function() {
        spyOn(Avatax, '_api');
        Avatax.filings.filingsCheckupReport(12345, 56789);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/56789/checkup', 'GET', null, null);
      });

      it('should call getFilings api', function() {
        spyOn(Avatax, '_api');
        Avatax.filings.getFilings(12345, 2016, 12);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/2016/12', 'GET', null, null);
      });

      it('should call getFilingsByCountry api', function() {
        spyOn(Avatax, '_api');
        Avatax.filings.getFilingsByCountry(12345, 2016, 12, 'US');

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/2016/12/US', 'GET', null, null);
      });

      it('should call getFilingsByCountryRegion api', function() {
        spyOn(Avatax, '_api');
        Avatax.filings.getFilingsByCountryRegion(12345, 2016, 12, 'US', 'CA');

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/2016/12/US/CA', 'GET', null, null);
      });

      it('should call getFilingsByReturnName api', function() {
        spyOn(Avatax, '_api');
        Avatax.filings.getFilingsByReturnName(12345, 2016, 12, 'US', 'CA', 'AL2100');

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/2016/12/US/CA/AL2100', 'GET', null, null);
      });

      it('should call createReturnAdjustment api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 103230,
            "fieldAmount": 10,
            "fieldName": "Credit from the State"
          }
        ];

        Avatax.filings.createReturnAdjustment(12345, 2016, 12, 'US', 'CA', 'AL2100', reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/2016/12/US/CA/AL2100/adjust', 'POST', null, reqBody);
      });

      it('should call createReturnAugmentation api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 103230,
            "fieldAmount": 10,
            "fieldName": "Credit from the State"
          }
        ];

        Avatax.filings.createReturnAugmentation(12345, 2016, 12, 'US', 'CA', 'AL2100', reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/2016/12/US/CA/AL2100/augment', 'POST', null, reqBody);
      });

      it('should call approveFilingsCountryRegion api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "approve": true
        };

        Avatax.filings.approveFilingsCountryRegion(12345, 2016, 12, 'US', 'CA', reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/2016/12/US/CA/approve', 'POST', null, reqBody);
      });

      it('should call rebuildFilingsByCountryRegion api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "rebuild": true
        };

        Avatax.filings.rebuildFilingsByCountryRegion(12345, 2016, 12, 'US', 'CA', reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/2016/12/US/CA/rebuild', 'POST', null, reqBody);
      });

      it('should call approveFilingsCountry api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "approve": true
        };

        Avatax.filings.approveFilingsCountry(12345, 2016, 12, 'US', reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/2016/12/US/approve', 'POST', null, reqBody);
      });

      it('should call rebuildFilingsByCountry api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "rebuild": true
        };

        Avatax.filings.rebuildFilingsByCountry(12345, 2016, 12, 'US', reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/2016/12/US/rebuild', 'POST', null, reqBody);
      });

      it('should call approveFilings api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "approve": true
        };

        Avatax.filings.approveFilings(12345, 2016, 12, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/2016/12/approve', 'POST', null, reqBody);
      });

      it('should call getFilingAttachments api', function() {
        spyOn(Avatax, '_api');
        Avatax.filings.getFilingAttachments(12345, 2016, 12);
        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/2016/12/attachments', 'GET', null, null);
      });

      it('should call getFilingAttachmentsTraceFile api', function() {
        spyOn(Avatax, '_api');
        Avatax.filings.getFilingAttachmentsTraceFile(12345, 2016, 12);
        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/2016/12/attachments/tracefile', 'GET', null, null);
      });

      it('should call filingsCheckupReports api', function() {
        spyOn(Avatax, '_api');
        Avatax.filings.filingsCheckupReports(12345, 2016, 12);
        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/2016/12/checkup', 'GET', null, null);
      });

      it('should call rebuildFilings api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "rebuild": true
        };

        Avatax.filings.rebuildFilings(12345, 2016, 12, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/2016/12/rebuild', 'POST', null, reqBody);
      });

      it('should call deleteReturnAdjustment api', function() {
        spyOn(Avatax, '_api');
        Avatax.filings.deleteReturnAdjustment(12345, 56789);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/adjust/56789', 'DELETE', null, null);
      });

      it('should call updateReturnAdjustment api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "id": 15634,
          "amount": 100,
          "period": "CurrentPeriod",
          "type": "Discount",
          "isCalculated": false,
          "accountType": "AccountsReceivableAccountsPayable"
        };

        Avatax.filings.updateReturnAdjustment(12345, 56789, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/adjust/56789', 'PUT', null, reqBody);
      });

      it('should call deleteReturnAugmentation api', function() {
        spyOn(Avatax, '_api');
        Avatax.filings.deleteReturnAugmentation(12345, 56789);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/augment/56789', 'DELETE', null, null);
      });

      it('should call updateReturnAugmentation api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "id": 103230,
          "fieldAmount": 10,
          "fieldName": "Credit from the State"
        };

        Avatax.filings.updateReturnAugmentation(12345, 56789, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/augment/56789', 'PUT', null, reqBody);
      });

      it('should call getFilingsReturns api', function() {
        spyOn(Avatax, '_api');
        Avatax.filings.getFilingsReturns(12345);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/filings/returns', 'GET', null, null);
      });
    });

    describe('Avatax.free', function() {
      var $httpBackend;
      var Avatax;

      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call requestFreeTrial api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "firstName": "Bob",
          "lastName": "McExample",
          "email": "bob@example.org",
          "company": "Bob's Artisan Pottery",
          "phone": "+1 (714) 555-1212"
        };

        Avatax.free.requestFreeTrial(reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/freetrials/request', 'POST', null, reqBody);
      });

      it('should call taxRatesByAddress', function() {
        spyOn(Avatax, '_api');

        Avatax.free.taxRatesByAddress("123 Main Street", null, null, "Irvine", "CA", "92615", "US");

        expect(Avatax._api).toHaveBeenCalledWith('taxrates/byaddress', 'GET', {
          "line1": "123 Main Street",
          "line2": null,
          "line3": null,
          "city": "Irvine",
          "region": "CA",
          "postalCode": "92615",
          "country": "US"
        }, null);
      });

      it('should call taxRatesByPostalCode', function() {
        spyOn(Avatax, '_api');

        Avatax.free.taxRatesByPostalCode("US", "92615");

        expect(Avatax._api).toHaveBeenCalledWith('taxrates/bypostalcode', 'GET', {
          "country": "US",
          "postalCode": "92615"
        }, null);
      });
    });

    describe('Avatax.fundingRequests', function() {
      var $httpBackend;
      var Avatax;

      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call fundingRequestStatus api', function() {
        spyOn(Avatax, '_api');

        Avatax.fundingRequests.fundingRequestStatus(12345);

        expect(Avatax._api).toHaveBeenCalledWith('fundingrequests/12345', 'GET', null, null);
      });

      it('should call activateFundingRequest api', function() {
        spyOn(Avatax, '_api');

        Avatax.fundingRequests.activateFundingRequest(12345);

        expect(Avatax._api).toHaveBeenCalledWith('fundingrequests/12345/widget', 'GET', null, null);
      });
    });

    describe('Avatax.items', function() {
      var $httpBackend;
      var Avatax;

      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call listItemsByCompany api', function() {
        spyOn(Avatax, '_api');

        Avatax.items.listItemsByCompany(12345);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/items', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });

      it('should call createItems api', function() {
        spyOn(Avatax, '_api');

        let reqBody = [
          {
            "id": 56789,
            "companyId": 12345,
            "itemCode": "CERMUG",
            "taxCode": "P0000000",
            "description": "Ceramic Mug"
          }
        ];

        Avatax.items.createItems(12345, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/items', 'POST', null, reqBody);
      });

      it('should call deleteItem api', function() {
        spyOn(Avatax, '_api');

        Avatax.items.deleteItem(12345, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/items/1', 'DELETE', null, null);
      });

      it('should call getItem api', function() {
        spyOn(Avatax, '_api');

        Avatax.items.getItem(12345, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/items/1', 'GET', null, null);
      });

      it('should call updateItem api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "id": 56789,
          "companyId": 12345,
          "itemCode": "CERMUG",
          "taxCode": "P0000000",
          "description": "Ceramic Mug"
        };

        Avatax.items.updateItem(12345, 1, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/items/1', 'PUT', null, reqBody);
      });

      it('should call queryItems api', function() {
        spyOn(Avatax, '_api');

        Avatax.items.queryItems();

        expect(Avatax._api).toHaveBeenCalledWith('items', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });
    });

    describe('Avatax.jurisdictionOverrides', function() {
      var $httpBackend;
      var Avatax;

      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call listJurisdictionOverridesByAccount api', function() {
        spyOn(Avatax, '_api');

        Avatax.jurisdictionOverrides.listJurisdictionOverridesByAccount(123);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/123/jurisdictionoverrides', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });

      it('should call createJurisdictionOverrides api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 0,
            "accountId": 0,
            "description": "a test JO",
            "line1": "5500 Irvine Center Dr",
            "city": "Irvine",
            "region": "CA",
            "country": "US",
            "postalCode": "92618",
            "effectiveDate": "2006-08-01",
            "endDate": "2099-01-12",
            "jurisdictions": [
              {
                "code": "53",
                "name": "WASHINGTON",
                "type": "State",
                "rate": 0.06,
                "salesRate": 0.06,
                "signatureCode": "",
                "region": "WA",
                "useRate": 0.06
              }
            ],
            "taxRegionId": 0,
            "boundaryLevel": "Address",
            "isDefault": false
          }
        ];

        Avatax.jurisdictionOverrides.createJurisdictionOverrides(123, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/123/jurisdictionoverrides', 'POST', null, reqBody);
      });

      it('should call deleteJurisdictionOverride api', function() {
        spyOn(Avatax, '_api');

        Avatax.jurisdictionOverrides.deleteJurisdictionOverride(123, 456);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/123/jurisdictionoverrides/456', 'DELETE', null, null);
      });

      it('should call getJurisdictionOverride api', function() {
        spyOn(Avatax, '_api');

        Avatax.jurisdictionOverrides.getJurisdictionOverride(123, 456);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/123/jurisdictionoverrides/456', 'GET', null, null);
      });

      it('should call updateJurisdictionOverride api', function() {
        spyOn(Avatax, '_api');

        let reqBody = {
          "id": 0,
          "accountId": 0,
          "description": "a test JO",
          "line1": "5500 Irvine Center Dr",
          "city": "Irvine",
          "region": "CA",
          "country": "US",
          "postalCode": "92618",
          "effectiveDate": "2006-08-01",
          "endDate": "2099-01-12",
          "jurisdictions": [
            {
              "code": "53",
              "name": "WASHINGTON",
              "type": "State",
              "rate": 0.06,
              "salesRate": 0.06,
              "signatureCode": "",
              "region": "WA",
              "useRate": 0.06
            }
          ],
          "taxRegionId": 0,
          "boundaryLevel": "Address",
          "isDefault": false
        };

        Avatax.jurisdictionOverrides.updateJurisdictionOverride(123, 456, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/123/jurisdictionoverrides/456', 'PUT', null, reqBody);
      });

      it('should call queryJurisdictionOverrides api', function() {
        spyOn(Avatax, '_api');

        Avatax.jurisdictionOverrides.queryJurisdictionOverrides();

        expect(Avatax._api).toHaveBeenCalledWith('jurisdictionoverrides', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });
    });

    describe('Avatax.locations', function() {
      var $httpBackend;
      var Avatax;

      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call listLocationsByCompany api', function() {
        spyOn(Avatax, '_api');

        Avatax.locations.listLocationsByCompany(12345);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/locations', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });

      it('should call createLocations api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 56789,
            "companyId": 12345,
            "locationCode": "DEFAULT",
            "description": "Bob's Artisan Pottery",
            "addressTypeId": "Location",
            "addressCategoryId": "MainOffice",
            "line1": "123 Main Street",
            "city": "Irvine",
            "county": "Orange",
            "region": "CA",
            "postalCode": "92615",
            "country": "US",
            "isDefault": true,
            "isRegistered": true,
            "dbaName": "Bob's Artisan Pottery",
            "outletName": "Main Office",
            "registeredDate": "2015-01-01T00:00:00"
          }
        ];

        Avatax.locations.createLocations(12345, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/locations', 'POST', null, reqBody);
      });

      it('should call deleteLocation api', function() {
        spyOn(Avatax, '_api');

        Avatax.locations.deleteLocation(12345, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/locations/1', 'DELETE', null, null);
      });

      it('should call getLocation api', function() {
        spyOn(Avatax, '_api');

        Avatax.locations.getLocation(12345, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/locations/1', 'GET', null, null);
      });

      it('should call updateLocation api', function() {
        spyOn(Avatax, '_api');

        let reqBody = {
          "id": 56789,
          "companyId": 12345,
          "locationCode": "DEFAULT",
          "description": "Bob's Artisan Pottery",
          "addressTypeId": "Location",
          "addressCategoryId": "MainOffice",
          "line1": "123 Main Street",
          "city": "Irvine",
          "county": "Orange",
          "region": "CA",
          "postalCode": "92615",
          "country": "US",
          "isDefault": true,
          "isRegistered": true,
          "dbaName": "Bob's Artisan Pottery",
          "outletName": "Main Office",
          "registeredDate": "2015-01-01T00:00:00"
        };

        Avatax.locations.updateLocation(12345, 56789, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/locations/56789', 'PUT', null, reqBody);
      });

      it('should call validateLoction api', function() {
        spyOn(Avatax, '_api');

        Avatax.locations.validateLocation(12345, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/locations/1/validate', 'GET', null, null);
      });

      it('should call queryLocations api', function() {
        spyOn(Avatax, '_api');

        Avatax.locations.queryLocations();

        expect(Avatax._api).toHaveBeenCalledWith('locations', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });
    });

    describe('Avatax.nexus', function() {
      var $httpBackend;
      var Avatax;

      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call listNexusByCompany api', function() {
        spyOn(Avatax, '_api');

        Avatax.nexus.listNexusByCompany(12345);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/nexus', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });

      it('should call createNexus api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 0,
            "companyId": 0,
            "country": "US",
            "region": "CA",
            "jurisTypeId": "STA",
            "jurisCode": "06",
            "jurisName": "CALIFORNIA",
            "shortName": "CA",
            "signatureCode": "",
            "stateAssignedNo": "",
            "nexusTypeId": "SalesOrSellersUseTax",
            "hasLocalNexus": true,
            "hasPermanentEstablishment": true,
            "streamlinedSalesTax": false,
            "createdDate": "2017-06-28T15:33:24.3493743Z",
            "createdUserId": 290370,
            "modifiedDate": "2017-06-28T15:33:24.3493743Z",
            "modifiedUserId": 290370,
            "nexusTaxTypeGroup": "SalesAndUse"
          }
        ];

        Avatax.nexus.createNexus(12345, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/nexus', 'POST', null, reqBody);
      });

      it('should call deleteNexus api', function() {
        spyOn(Avatax, '_api');

        Avatax.nexus.deleteNexus(12345, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/nexus/1', 'DELETE', null, null);
      });

      it('should call getNexus api', function() {
        spyOn(Avatax, '_api');

        Avatax.nexus.getNexus(12345, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/nexus/1', 'GET', null, null);
      });

      it('should call updateNexus api', function() {
        spyOn(Avatax, '_api');

        let reqBody = {
          "id": 0,
          "companyId": 0,
          "country": "US",
          "region": "CA",
          "jurisTypeId": "STA",
          "jurisCode": "06",
          "jurisName": "CALIFORNIA",
          "shortName": "CA",
          "signatureCode": "",
          "stateAssignedNo": "",
          "nexusTypeId": "SalesOrSellersUseTax",
          "hasLocalNexus": true,
          "hasPermanentEstablishment": true,
          "streamlinedSalesTax": false,
          "createdDate": "2017-06-28T15:33:24.3493743Z",
          "createdUserId": 290370,
          "modifiedDate": "2017-06-28T15:33:24.3493743Z",
          "modifiedUserId": 290370,
          "nexusTaxTypeGroup": "SalesAndUse"
        };

        Avatax.nexus.updateNexus(12345, 56789, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/nexus/56789', 'PUT', null, reqBody);
      });

      it('should call getNexusByFormCode api', function() {
        spyOn(Avatax, '_api');

        Avatax.nexus.getNexusByFormCode(12345, 'AL2100');

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/nexus/byform/AL2100', 'GET', null, null);
      });

      it('should call queryNexus api', function() {
        spyOn(Avatax, '_api');

        Avatax.nexus.queryNexus();

        expect(Avatax._api).toHaveBeenCalledWith('nexus', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });
    });

    describe('Avatax.notices', function() {
      var $httpBackend;
      var Avatax;

      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call listNoticesByCompany api', function() {
        spyOn(Avatax, '_api');

        Avatax.notices.listNoticesByCompany(12345);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/notices', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });

      it('should call createNotices api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 3878,
            "companyId": 5714,
            "statusId": 4,
            "status": "Closed - Paid",
            "receivedDate": "2017-06-28T08:37:47.685151-07:00",
            "closedDate": "2017-07-18T08:37:47.685151-07:00",
            "totalRemit": 0,
            "customerTypeId": "AvaTaxReturns",
            "country": "US",
            "region": "AZ",
            "taxAuthorityId": 208,
            "filingFrequency": "Quarterly",
            "filingTypeId": "ElectronicReturn",
            "ticketReferenceNo": "1235",
            "ticketReferenceUrl": "http://www.ticketurl.com",
            "salesForceCase": "3333",
            "salesForceCaseUrl": "http://www.salesforcecaseurl.com",
            "taxPeriod": "200710",
            "reasonId": 10,
            "reason": "Unsupported Credit",
            "typeId": 3,
            "customerFundingOptionId": "Pull",
            "priorityId": "ImmediateAttentionRequired",
            "customerComment": "comments",
            "hideFromCustomer": false,
            "expectedResolutionDate": "2017-07-13T08:37:47.685151-07:00",
            "showResolutionDateToCustomer": false,
            "closedByUserId": 1,
            "createdByUserName": "user@compliance.com",
            "ownedByUserId": 23,
            "description": "description",
            "avaFileFormId": 333,
            "revenueContactId": 444,
            "complianceContactId": 555,
            "jurisdictionName": "CHANDLER",
            "jurisdictionType": "City",
            "comments": [
              {
                "id": 3,
                "noticeId": 3878,
                "date": "2017-06-28T08:37:47.685151-07:00",
                "comment": "spoke to Chris payment not received need copy of check.VW",
                "commentUserId": 1,
                "commentUserName": "user@compliance.com",
                "commentTypeId": 0,
                "commentType": "Internal"
              }
            ],
            "finances": [
              {
                "id": 3,
                "noticeId": 0,
                "noticeDate": "2017-06-28T08:37:47.685151-07:00",
                "taxDue": 6.66,
                "penalty": 0.67,
                "interest": 0.19,
                "credits": 0.06,
                "taxAbated": 0
              }
            ],
            "createdDate": "2017-06-23T08:37:47.685151-07:00",
            "createdUserId": 1,
            "modifiedDate": "2017-06-28T08:37:47.685151-07:00",
            "modifiedUserId": 222
          }
        ];

        Avatax.notices.createNotices(12345, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/notices', 'POST', null, reqBody);
      });

      it('should call deleteNotice api', function() {
        spyOn(Avatax, '_api');

        Avatax.notices.deleteNotice(12345, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/notices/1', 'DELETE', null, null);
      });

      it('should call getNotice api', function() {
        spyOn(Avatax, '_api');

        Avatax.notices.getNotice(12345, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/notices/1', 'GET', null, null);
      });

      it('should call updateNotice api', function() {
        spyOn(Avatax, '_api');

        let reqBody = {
          "id": 3878,
          "companyId": 5714,
          "statusId": 4,
          "status": "Closed - Paid",
          "receivedDate": "2017-06-28T08:37:47.685151-07:00",
          "closedDate": "2017-07-18T08:37:47.685151-07:00",
          "totalRemit": 0,
          "customerTypeId": "AvaTaxReturns",
          "country": "US",
          "region": "AZ",
          "taxAuthorityId": 208,
          "filingFrequency": "Quarterly",
          "filingTypeId": "ElectronicReturn",
          "ticketReferenceNo": "1235",
          "ticketReferenceUrl": "http://www.ticketurl.com",
          "salesForceCase": "3333",
          "salesForceCaseUrl": "http://www.salesforcecaseurl.com",
          "taxPeriod": "200710",
          "reasonId": 10,
          "reason": "Unsupported Credit",
          "typeId": 3,
          "customerFundingOptionId": "Pull",
          "priorityId": "ImmediateAttentionRequired",
          "customerComment": "comments",
          "hideFromCustomer": false,
          "expectedResolutionDate": "2017-07-13T08:37:47.685151-07:00",
          "showResolutionDateToCustomer": false,
          "closedByUserId": 1,
          "createdByUserName": "user@compliance.com",
          "ownedByUserId": 23,
          "description": "description",
          "avaFileFormId": 333,
          "revenueContactId": 444,
          "complianceContactId": 555,
          "jurisdictionName": "CHANDLER",
          "jurisdictionType": "City",
          "comments": [
            {
              "id": 3,
              "noticeId": 3878,
              "date": "2017-06-28T08:37:47.685151-07:00",
              "comment": "spoke to Chris payment not received need copy of check.VW",
              "commentUserId": 1,
              "commentUserName": "user@compliance.com",
              "commentTypeId": 0,
              "commentType": "Internal"
            }
          ],
          "finances": [
            {
              "id": 3,
              "noticeId": 0,
              "noticeDate": "2017-06-28T08:37:47.685151-07:00",
              "taxDue": 6.66,
              "penalty": 0.67,
              "interest": 0.19,
              "credits": 0.06,
              "taxAbated": 0
            }
          ],
          "createdDate": "2017-06-23T08:37:47.685151-07:00",
          "createdUserId": 1,
          "modifiedDate": "2017-06-28T08:37:47.685151-07:00",
          "modifiedUserId": 222
        };

        Avatax.notices.updateNotice(5714, 3878, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/5714/notices/3878', 'PUT', null, reqBody);
      });

      it('should call getNoticeComments api', function() {
        spyOn(Avatax, '_api');

        Avatax.notices.getNoticeComments(12345, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/notices/1/comments', 'GET', null, null);
      });

      it('should call createNoticeComment api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 1123,
            "noticeId": 12345,
            "date": "2017-06-28T08:37:47.7007761-07:00",
            "comment": "comment",
            "commentUserId": 0,
            "commentUserName": "complianceUser",
            "commentTypeId": 0,
            "commentType": "Internal",
            "commentLink": "www.avalara.com",
            "taxNoticeFileName": "xyz.txt",
            "attachmentUploadRequest": {
              "content": "UHJvY2Vzc0NvZGUsRG9jQ29kZSxEb2NUeXBlLERvY0RhdGUsQ29tcGFueUNvZGUsQ3VzdG9tZXJDb2RlLEVudGl0eVVzZUNvZGUsTGluZU5vLFRheENvZGUsVGF4RGF0ZSxJdGVtQ29kZSxEZXNjcmlwdGlvbixRdHksQW1vdW50LERpc2NvdW50LFJlZjEsUmVmMixFeGVtcHRpb25ObyxSZXZBY2N0LERlc3RBZGRyZXNzLERlc3RDaXR5LERlc3RSZWdpb24sRGVzdFBvc3RhbENvZGUsRGVzdENvdW50cnksT3JpZ0FkZHJlc3MsT3JpZ0NpdHksT3JpZ1JlZ2lvbixPcmlnUG9zdGFsQ29kZSxPcmlnQ291bnRyeSxMb2NhdGlvbkNvZGUsU2FsZXNQZXJzb25Db2RlLFB1cmNoYXNlT3JkZXJObyxDdXJyZW5jeUNvZGUsRXhjaGFuZ2VSYXRlLEV4Y2hhbmdlUmF0ZUVmZkRhdGUsUGF5bWVudERhdGUsVGF4SW5jbHVkZWQsRGVzdFRheFJlZ2lvbixPcmlnVGF4UmVnaW9uLFRheGFibGUsVGF4VHlwZSxUb3RhbFRheCxDb3VudHJ5TmFtZSxDb3VudHJ5Q29kZSxDb3VudHJ5UmF0ZSxDb3VudHJ5VGF4LFN0YXRlTmFtZSxTdGF0ZUNvZGUsU3RhdGVSYXRlLFN0YXRlVGF4LENvdW50eU5hbWUsQ291bnR5Q29kZSxDb3VudHlSYXRlLENvdW50eVRheCxDaXR5TmFtZSxDaXR5Q29kZSxDaXR5UmF0ZSxDaXR5VGF4LE90aGVyMU5hbWUsT3RoZXIxQ29kZSxPdGhlcjFSYXRlLE90aGVyMVRheCxPdGhlcjJOYW1lLE90aGVyMkNvZGUsT3RoZXIyUmF0ZSxPdGhlcjJUYXgsT3RoZXIzTmFtZSxPdGhlcjNDb2RlLE90aGVyM1JhdGUsT3RoZXIzVGF4LE90aGVyNE5hbWUsT3RoZXI0Q29kZSxPdGhlcjRSYXRlLE90aGVyNFRheCxSZWZlcmVuY2VDb2RlLEJ1eWVyc1ZBVE5vLElzU2VsbGVySW1wb3J0ZXJPZlJlY29yZCxCUkJ1eWVyVHlwZSxCUkJ1eWVyX0lzRXhlbXB0T3JDYW5ub3RXSF9JUlJGLEJSQnV5ZXJfSXNFeGVtcHRPckNhbm5vdFdIX1BJU1JGLEJSQnV5ZXJfSXNFeGVtcHRPckNhbm5vdFdIX0NPRklOU1JGLEJSQnV5ZXJfSXNFeGVtcHRPckNhbm5vdFdIX0NTTExSRixCUkJ1eWVyX0lzRXhlbXB0X1BJUyxCUkJ1eWVyX0lzRXhlbXB0X0NPRklOUyxCUkJ1eWVyX0lzRXhlbXB0X0NTTEwsSGVhZGVyX0Rlc2NyaXB0aW9uLEVtYWlsDQozLDlhYzI4MGMzLTNhNTUtNGEzNS1iZWQyLWE4M2RiNTNiMDUxZSwxLDEvMS8yMDE0LERFRkFVTFQsQ3VzdDEsLDEsLCwsLCwxMDAwLCwsLCwsMjM1IEUgNDJuZCBTdCAsTmV3IFlvcmssTlksMTAwMTctNTcwMyAgLFVTLDkwMCBXaW5zbG93IFdheSxCYWluYnJpZGdlIElzbGFuZCxXQSw5ODExMCxVUywsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwNCg==",
              "username": "test.user",
              "accountId": 5555,
              "companyId": 66666,
              "name": "nameoffile.txt",
              "resourceFileTypeId": 0,
              "length": 333
            }
          }
        ];

        Avatax.notices.createNoticeComment(12345, 1123, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/notices/1123/comments', 'POST', null, reqBody);
      });

      it('should call getNoticeFinanceDetails api', function() {
        spyOn(Avatax, '_api');

        Avatax.notices.getNoticeFinanceDetails(12345, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/notices/1/financedetails', 'GET', null, null);
      });

      it('should call createNoticeFinanceDetails api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 0,
            "noticeId": 12345,
            "noticeDate": "2017-06-28T08:37:47.7163996-07:00",
            "dueDate": "2017-07-12T08:37:47.7163996-07:00",
            "noticeNumber": "3x3215",
            "taxDue": 99.98,
            "penalty": 56.98,
            "interest": 88.98,
            "credits": 85.98,
            "taxAbated": 45.98,
            "customerPenalty": 23.98,
            "customerInterest": 13.98,
            "cspFeeRefund": 10.98,
            "attachmentUploadRequest": {
              "content": "UHJvY2Vzc0NvZGUsRG9jQ29kZSxEb2NUeXBlLERvY0RhdGUsQ29tcGFueUNvZGUsQ3VzdG9tZXJDb2RlLEVudGl0eVVzZUNvZGUsTGluZU5vLFRheENvZGUsVGF4RGF0ZSxJdGVtQ29kZSxEZXNjcmlwdGlvbixRdHksQW1vdW50LERpc2NvdW50LFJlZjEsUmVmMixFeGVtcHRpb25ObyxSZXZBY2N0LERlc3RBZGRyZXNzLERlc3RDaXR5LERlc3RSZWdpb24sRGVzdFBvc3RhbENvZGUsRGVzdENvdW50cnksT3JpZ0FkZHJlc3MsT3JpZ0NpdHksT3JpZ1JlZ2lvbixPcmlnUG9zdGFsQ29kZSxPcmlnQ291bnRyeSxMb2NhdGlvbkNvZGUsU2FsZXNQZXJzb25Db2RlLFB1cmNoYXNlT3JkZXJObyxDdXJyZW5jeUNvZGUsRXhjaGFuZ2VSYXRlLEV4Y2hhbmdlUmF0ZUVmZkRhdGUsUGF5bWVudERhdGUsVGF4SW5jbHVkZWQsRGVzdFRheFJlZ2lvbixPcmlnVGF4UmVnaW9uLFRheGFibGUsVGF4VHlwZSxUb3RhbFRheCxDb3VudHJ5TmFtZSxDb3VudHJ5Q29kZSxDb3VudHJ5UmF0ZSxDb3VudHJ5VGF4LFN0YXRlTmFtZSxTdGF0ZUNvZGUsU3RhdGVSYXRlLFN0YXRlVGF4LENvdW50eU5hbWUsQ291bnR5Q29kZSxDb3VudHlSYXRlLENvdW50eVRheCxDaXR5TmFtZSxDaXR5Q29kZSxDaXR5UmF0ZSxDaXR5VGF4LE90aGVyMU5hbWUsT3RoZXIxQ29kZSxPdGhlcjFSYXRlLE90aGVyMVRheCxPdGhlcjJOYW1lLE90aGVyMkNvZGUsT3RoZXIyUmF0ZSxPdGhlcjJUYXgsT3RoZXIzTmFtZSxPdGhlcjNDb2RlLE90aGVyM1JhdGUsT3RoZXIzVGF4LE90aGVyNE5hbWUsT3RoZXI0Q29kZSxPdGhlcjRSYXRlLE90aGVyNFRheCxSZWZlcmVuY2VDb2RlLEJ1eWVyc1ZBVE5vLElzU2VsbGVySW1wb3J0ZXJPZlJlY29yZCxCUkJ1eWVyVHlwZSxCUkJ1eWVyX0lzRXhlbXB0T3JDYW5ub3RXSF9JUlJGLEJSQnV5ZXJfSXNFeGVtcHRPckNhbm5vdFdIX1BJU1JGLEJSQnV5ZXJfSXNFeGVtcHRPckNhbm5vdFdIX0NPRklOU1JGLEJSQnV5ZXJfSXNFeGVtcHRPckNhbm5vdFdIX0NTTExSRixCUkJ1eWVyX0lzRXhlbXB0X1BJUyxCUkJ1eWVyX0lzRXhlbXB0X0NPRklOUyxCUkJ1eWVyX0lzRXhlbXB0X0NTTEwsSGVhZGVyX0Rlc2NyaXB0aW9uLEVtYWlsDQozLDlhYzI4MGMzLTNhNTUtNGEzNS1iZWQyLWE4M2RiNTNiMDUxZSwxLDEvMS8yMDE0LERFRkFVTFQsQ3VzdDEsLDEsLCwsLCwxMDAwLCwsLCwsMjM1IEUgNDJuZCBTdCAsTmV3IFlvcmssTlksMTAwMTctNTcwMyAgLFVTLDkwMCBXaW5zbG93IFdheSxCYWluYnJpZGdlIElzbGFuZCxXQSw5ODExMCxVUywsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwNCg==",
              "username": "test.user",
              "accountId": 5555,
              "companyId": 66666,
              "name": "nameoffile.txt",
              "resourceFileTypeId": 0,
              "length": 333
            }
          }
        ];

        Avatax.notices.createNoticeFinanceDetails(12345, 1123, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/notices/1123/financedetails', 'POST', null, reqBody);
      });

      it('should call getNoticeResponsibilities api', function() {
        spyOn(Avatax, '_api');

        Avatax.notices.getNoticeResponsibilities(12345, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/notices/1/responsibilities', 'GET', null, null);
      });

      it('should call createNoticeResponsibilities api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 0,
            "noticeId": 4,
            "taxNoticeResponsibilityId": 4,
            "description": "Avalara-Compliance"
          }
        ];

        Avatax.notices.createNoticeResponsibilities(12345, 1123, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/notices/1123/responsibilities', 'POST', null, reqBody);
      });

      it('should call getNoticeRootCauses api', function() {
        spyOn(Avatax, '_api');

        Avatax.notices.getNoticeRootCauses(12345, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/notices/1/rootcauses', 'GET', null, null);
      });

      it('should call createNoticeRootCauses api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 0,
            "noticeId": 4,
            "taxNoticeRootCauseId": 4,
            "description": "Processor error-Return not submitted"
          }
        ];

        Avatax.notices.createNoticeRootCauses(12345, 1123, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/notices/1123/rootcauses', 'POST', null, reqBody);
      });

      it('should call deleteResponsibilities api', function() {
        spyOn(Avatax, '_api');

        Avatax.notices.deleteResponsibilities(12345, 3232, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/notices/3232/responsibilities/1', 'DELETE', null, null);
      });

      it('should call deleteRootCauses api', function() {
        spyOn(Avatax, '_api');

        Avatax.notices.deleteRootCauses(12345, 3232, 1);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/notices/3232/rootcauses/1', 'DELETE', null, null);
      });

      it('should call downloadNoticeAttachment api', function() {
        spyOn(Avatax, '_api');

        Avatax.notices.downloadNoticeAttachment(12345, 3232);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/notices/files/3232/attachment', 'GET', null, null);
      });

      it('should call uploadAttachment api', function() {
        spyOn(Avatax, '_api');

        let reqBody = {
          "content": "UHJvY2Vzc0NvZGUsRG9jQ29kZSxEb2NUeXBlLERvY0RhdGUsQ29tcGFueUNvZGUsQ3VzdG9tZXJDb2RlLEVudGl0eVVzZUNvZGUsTGluZU5vLFRheENvZGUsVGF4RGF0ZSxJdGVtQ29kZSxEZXNjcmlwdGlvbixRdHksQW1vdW50LERpc2NvdW50LFJlZjEsUmVmMixFeGVtcHRpb25ObyxSZXZBY2N0LERlc3RBZGRyZXNzLERlc3RDaXR5LERlc3RSZWdpb24sRGVzdFBvc3RhbENvZGUsRGVzdENvdW50cnksT3JpZ0FkZHJlc3MsT3JpZ0NpdHksT3JpZ1JlZ2lvbixPcmlnUG9zdGFsQ29kZSxPcmlnQ291bnRyeSxMb2NhdGlvbkNvZGUsU2FsZXNQZXJzb25Db2RlLFB1cmNoYXNlT3JkZXJObyxDdXJyZW5jeUNvZGUsRXhjaGFuZ2VSYXRlLEV4Y2hhbmdlUmF0ZUVmZkRhdGUsUGF5bWVudERhdGUsVGF4SW5jbHVkZWQsRGVzdFRheFJlZ2lvbixPcmlnVGF4UmVnaW9uLFRheGFibGUsVGF4VHlwZSxUb3RhbFRheCxDb3VudHJ5TmFtZSxDb3VudHJ5Q29kZSxDb3VudHJ5UmF0ZSxDb3VudHJ5VGF4LFN0YXRlTmFtZSxTdGF0ZUNvZGUsU3RhdGVSYXRlLFN0YXRlVGF4LENvdW50eU5hbWUsQ291bnR5Q29kZSxDb3VudHlSYXRlLENvdW50eVRheCxDaXR5TmFtZSxDaXR5Q29kZSxDaXR5UmF0ZSxDaXR5VGF4LE90aGVyMU5hbWUsT3RoZXIxQ29kZSxPdGhlcjFSYXRlLE90aGVyMVRheCxPdGhlcjJOYW1lLE90aGVyMkNvZGUsT3RoZXIyUmF0ZSxPdGhlcjJUYXgsT3RoZXIzTmFtZSxPdGhlcjNDb2RlLE90aGVyM1JhdGUsT3RoZXIzVGF4LE90aGVyNE5hbWUsT3RoZXI0Q29kZSxPdGhlcjRSYXRlLE90aGVyNFRheCxSZWZlcmVuY2VDb2RlLEJ1eWVyc1ZBVE5vLElzU2VsbGVySW1wb3J0ZXJPZlJlY29yZCxCUkJ1eWVyVHlwZSxCUkJ1eWVyX0lzRXhlbXB0T3JDYW5ub3RXSF9JUlJGLEJSQnV5ZXJfSXNFeGVtcHRPckNhbm5vdFdIX1BJU1JGLEJSQnV5ZXJfSXNFeGVtcHRPckNhbm5vdFdIX0NPRklOU1JGLEJSQnV5ZXJfSXNFeGVtcHRPckNhbm5vdFdIX0NTTExSRixCUkJ1eWVyX0lzRXhlbXB0X1BJUyxCUkJ1eWVyX0lzRXhlbXB0X0NPRklOUyxCUkJ1eWVyX0lzRXhlbXB0X0NTTEwsSGVhZGVyX0Rlc2NyaXB0aW9uLEVtYWlsDQozLDlhYzI4MGMzLTNhNTUtNGEzNS1iZWQyLWE4M2RiNTNiMDUxZSwxLDEvMS8yMDE0LERFRkFVTFQsQ3VzdDEsLDEsLCwsLCwxMDAwLCwsLCwsMjM1IEUgNDJuZCBTdCAsTmV3IFlvcmssTlksMTAwMTctNTcwMyAgLFVTLDkwMCBXaW5zbG93IFdheSxCYWluYnJpZGdlIElzbGFuZCxXQSw5ODExMCxVUywsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwNCg==",
          "username": "test.user",
          "accountId": 5555,
          "companyId": 66666,
          "name": "nameoffile.txt",
          "resourceFileTypeId": 0,
          "length": 333
        };

        Avatax.notices.uploadAttachment(66666, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/66666/notices/files/attachment', 'POST', null, reqBody);
      });

      it('should call queryNotices api', function() {
        spyOn(Avatax, '_api');

        Avatax.notices.queryNotices();

        expect(Avatax._api).toHaveBeenCalledWith('notices', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });
    });

    describe('Avatax.onboarding', function() {
      var $httpBackend;
      var Avatax;
      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call requestNewAccount api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "products": [
            "ZTFREE"
          ],
          "connectorName": "NetSuite",
          "parentAccountNumber": "123456789",
          "referrerId": "98765",
          "paymentMethodId": "CreditCard"
        };

        Avatax.onboarding.requestNewAccount(reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/request', 'POST', null, reqBody);
      });
    });

    describe('Avatax.registrar', function() {
      var $httpBackend;
      var Avatax;
      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call queryAccounts api', function() {
        spyOn(Avatax, '_api');

        Avatax.registrar.queryAccounts();

        expect(Avatax._api).toHaveBeenCalledWith('accounts', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });

      it('should call createAccount api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "id": 12345,
          "name": "Test Account",
          "effectiveDate": "2017-06-28T00:00:00-07:00",
          "accountStatusId": "Test"
        };

        Avatax.registrar.createAccount(reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('accounts', 'POST', null, reqBody);
      });

      it('should call deleteSubscription api', function() {
        spyOn(Avatax, '_api');

        Avatax.registrar.deleteSubscription(123,456);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/123/subscriptions/456', 'DELETE', null, null);
      });

      it('should call updateSubscription api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "id": 12345,
          "accountId": 123456789,
          "subscriptionTypeId": 2,
          "subscriptionDescription": "AvaTaxPro",
          "effectiveDate": "2015-01-01"
        };

        Avatax.registrar.updateSubscription(123456789,12345, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/123456789/subscriptions/12345', 'PUT', null, reqBody);
      });

      it('should call deleteUser api', function() {
        spyOn(Avatax, '_api');

        Avatax.registrar.deleteUser(123,456);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/123/users/456', 'DELETE', null, null);
      });

      it('should call deleteAccount api', function() {
        spyOn(Avatax, '_api');

        Avatax.registrar.deleteAccount(123);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/123', 'DELETE', null, null);
      });

      it('should call updateAccount api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "id": 12345,
          "name": "Test Account",
          "effectiveDate": "2017-06-28T00:00:00-07:00",
          "accountStatusId": "Test"
        };

        Avatax.registrar.updateAccount(12345, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/12345', 'PUT', null, reqBody);
      });

      it('should call changePassword api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "oldPassword": "MyOldPassword123!",
          "newPassword": "ANewPassword567:)"
        };

        Avatax.registrar.changePassword(reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('passwords', 'PUT', null, reqBody);
      });

      it('should call resetPassword api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "newPassword": "ANewPassword567:)"
        };

        Avatax.registrar.resetPassword(12345, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('passwords/12345/reset', 'POST', null, reqBody);
      });

      it('should call createSubscriptions api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 12345,
            "accountId": 123456789,
            "subscriptionTypeId": 2,
            "subscriptionDescription": "AvaTaxPro",
            "effectiveDate": "2015-01-01"
          }
        ];

        Avatax.registrar.createSubscriptions(123456789, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/123456789/subscriptions', 'POST', null, reqBody);
      });

      it('should call createUsers api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 12345,
            "accountId": 123456789,
            "companyId": 123456,
            "userName": "bobExample",
            "firstName": "Bob",
            "lastName": "Example",
            "email": "bob@example.org",
            "postalCode": "98110",
            "securityRoleId": "AccountUser",
            "passwordStatus": "UserCanChange",
            "isActive": true
          }
        ];

        Avatax.registrar.createUsers(123456789, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/123456789/users', 'POST', null, reqBody);
      });
    });

    describe('Avatax.subscriptions', function() {
      var $httpBackend;
      var Avatax;
      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call getSubscription api', function() {
        spyOn(Avatax, '_api');

        Avatax.subscriptions.getSubscription(123456789, 123);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/123456789/subscriptions/123', 'GET', null, null);
      });

      it('should call listSubscriptionsByAccount api', function() {
        spyOn(Avatax, '_api');

        Avatax.subscriptions.listSubscriptionsByAccount(123456789);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/123456789/subscriptions', 'GET', {
          '$filter': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });

      it('should call querySubscriptions api', function() {
        spyOn(Avatax, '_api');

        Avatax.subscriptions.querySubscriptions();

        expect(Avatax._api).toHaveBeenCalledWith('subscriptions', 'GET', {
          '$filter': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });
    });

    describe('Avatax.users', function() {
      var $httpBackend;
      var Avatax;
      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call getUser api', function() {
        spyOn(Avatax, '_api');

        Avatax.users.getUser(123, 456);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/123/users/456', 'GET', {
          '$include': undefined
        }, null);
      });

      it('should call updateUser api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "id": 12345,
          "accountId": 123456789,
          "companyId": 123456,
          "userName": "bobExample",
          "firstName": "Bob",
          "lastName": "Example",
          "email": "bob@example.org",
          "postalCode": "98110",
          "securityRoleId": "AccountUser",
          "passwordStatus": "UserCanChange",
          "isActive": true
        };
        Avatax.users.updateUser(123456789, 12345, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/123456789/users/12345', 'PUT', null, reqBody);
      });

      it('should call listUsersByAccount api', function() {
        spyOn(Avatax, '_api');

        Avatax.users.listUsersByAccount(123456789);

        expect(Avatax._api).toHaveBeenCalledWith('accounts/123456789/users', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });

      it('should call getUserEntitlements api', function() {
        spyOn(Avatax, '_api');
        Avatax.users.getUserEntitlements(123, 456);
        expect(Avatax._api).toHaveBeenCalledWith('accounts/123/users/456/entitlements', 'GET', null, null);
      });

      it('should call queryUsers api', function() {
        spyOn(Avatax, '_api');
        Avatax.users.queryUsers();

        expect(Avatax._api).toHaveBeenCalledWith('users', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });
    });

    describe('Avatax.taxCodes', function() {
      var $httpBackend;
      var Avatax;
      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call listTaxCodesByCompany api', function() {
        spyOn(Avatax, '_api');

        Avatax.taxCodes.listTaxCodesByCompany(123);

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/taxcodes', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });

      it('should call createTaxCodes api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 56789,
            "companyId": 12345,
            "taxCode": "PS081282",
            "taxCodeTypeId": "P",
            "description": "Yarn",
            "parentTaxCode": "PS080100",
            "isPhysical": true,
            "goodsServiceCode": 0,
            "entityUseCode": "",
            "isActive": true,
            "isSSTCertified": false
          }
        ];

        Avatax.taxCodes.createTaxCodes(12345, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/taxcodes', 'POST', null, reqBody);
      });

      it('should call deleteTaxCode api', function() {
        spyOn(Avatax, '_api');

        Avatax.taxCodes.deleteTaxCode(123, 456);

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/taxcodes/456', 'DELETE', null, null);
      });

      it('should call getTaxCode api', function() {
        spyOn(Avatax, '_api');

        Avatax.taxCodes.getTaxCode(123, 456);

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/taxcodes/456', 'GET', null, null);
      });

      it('should call updateTaxCode api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "id": 56789,
          "companyId": 12345,
          "taxCode": "PS081282",
          "taxCodeTypeId": "P",
          "description": "Yarn",
          "parentTaxCode": "PS080100",
          "isPhysical": true,
          "goodsServiceCode": 0,
          "entityUseCode": "",
          "isActive": true,
          "isSSTCertified": false
        };

        Avatax.taxCodes.updateTaxCode(12345, 56789, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/taxcodes/56789', 'PUT', null, reqBody);
      });

      it('should call queryTaxCodes api', function() {
        spyOn(Avatax, '_api');

        Avatax.taxCodes.queryTaxCodes();

        expect(Avatax._api).toHaveBeenCalledWith('taxcodes', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });
    });

    describe('Avatax.taxContent', function() {

      var $httpBackend;
      var Avatax;
      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call buildTaxContentFileForLocation api', function() {
        spyOn(Avatax, '_api');

        Avatax.taxContent.buildTaxContentFileForLocation(123, 456);

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/locations/456/pointofsaledata', 'GET', {
          'date': undefined,
          'format': undefined,
          'partnerId': undefined,
          'includeJurisCodes': undefined
        }, null);
      });

       it('should call buildTaxContentFile api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "companyCode": "DEFAULT",
          "documentDate": "2017-06-28T18:57:40.0364288Z",
          "responseType": "Json",
          "taxCodes": [
            "P0000000"
          ],
          "locationCodes": [
            "DEFAULT"
          ],
          "includeJurisCodes": true
        };

        Avatax.taxContent.buildTaxContentFile(reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('pointofsaledata/build', 'POST', null, reqBody);
      });
    });

    describe('Avatax.taxRules', function () {
      var $httpBackend;
      var Avatax;
      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call listTaxRules api', function() {
        spyOn(Avatax, '_api');

        Avatax.taxRules.listTaxRules(123);

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/taxrules', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });

      it('should call createTaxRules api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 56789,
            "companyId": 12345,
            "taxCode": "FR020800",
            "stateFIPS": "04",
            "jurisName": "MARICOPA",
            "jurisCode": "013",
            "jurisTypeId": "CTY",
            "customerUsageType": "",
            "taxTypeId": "BothSalesAndUseTax",
            "taxRuleTypeId": "ProductTaxabilityRule",
            "isAllJuris": true,
            "value": 0,
            "cap": 0,
            "threshold": 0,
            "options": "",
            "effectiveDate": "2017-06-28",
            "description": "Freight",
            "countyFIPS": "013",
            "isSTPro": false,
            "country": "US",
            "region": "AZ",
            "taxTypeGroup": "SalesAndUse",
            "taxSubType": "ALL"
          }
        ];

        Avatax.taxRules.createTaxRules(12345, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/taxrules', 'POST', null, reqBody);
      });

      it('should call deleteTaxRule api', function() {
        spyOn(Avatax, '_api');

        Avatax.taxRules.deleteTaxRule(123, 456);

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/taxrules/456', 'DELETE', null, null);
      });

      it('should call getTaxRule api', function() {
        spyOn(Avatax, '_api');

        Avatax.taxRules.getTaxRule(123, 456);

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/taxrules/456', 'GET', null, null);
      });

      it('should call updateTaxRule api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "id": 56789,
          "companyId": 12345,
          "taxCode": "FR020800",
          "stateFIPS": "04",
          "jurisName": "MARICOPA",
          "jurisCode": "013",
          "jurisTypeId": "CTY",
          "customerUsageType": "",
          "taxTypeId": "BothSalesAndUseTax",
          "taxRuleTypeId": "ProductTaxabilityRule",
          "isAllJuris": true,
          "value": 0,
          "cap": 0,
          "threshold": 0,
          "options": "",
          "effectiveDate": "2017-06-28",
          "description": "Freight",
          "countyFIPS": "013",
          "isSTPro": false,
          "country": "US",
          "region": "AZ",
          "taxTypeGroup": "SalesAndUse",
          "taxSubType": "ALL"
        };

        Avatax.taxRules.updateTaxRule(12345, 56789, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/12345/taxrules/56789', 'PUT', null, reqBody);
      });

      it('should call queryTaxRules api', function() {
        spyOn(Avatax, '_api');

        Avatax.taxRules.queryTaxRules();

        expect(Avatax._api).toHaveBeenCalledWith('taxrules', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });
    });

    describe('Avatax.transactions', function() {
      var $httpBackend;
      var Avatax;
      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call listTransactionsByCompany api', function() {
        spyOn(Avatax, '_api');

        Avatax.transactions.listTransactionsByCompany('123');

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/transactions', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });

      it('should call getTransactionByCode api', function() {
        spyOn(Avatax, '_api');

        Avatax.transactions.getTransactionByCode('123', '456');
        expect(Avatax._api).toHaveBeenCalledWith('companies/123/transactions/456', 'GET', {
          '$include': undefined
        }, null);
      });

      it('should call adjustTransaction api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "adjustmentReason": "PriceAdjusted",
          "adjustmentDescription": "Price drop before shipping",
          "newTransaction": {
            "lines": [
              {
                "number": "1",
                "quantity": 1,
                "amount": 100,
                "taxCode": "PS081282",
                "itemCode": "Y0001",
                "description": "Yarn"
              }
            ],
            "type": "SalesInvoice",
            "companyCode": "DEFAULT",
            "date": "2017-06-28",
            "customerCode": "ABC",
            "purchaseOrderNo": "2017-06-28-001",
            "addresses": {
              "singleLocation": {
                "line1": "123 Main Street",
                "city": "Irvine",
                "region": "CA",
                "country": "US",
                "postalCode": "92615"
              }
            },
            "commit": true,
            "currencyCode": "USD",
            "description": "Yarn"
          }
        };
        Avatax.transactions.adjustTransaction('123', '456', reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/transactions/456/adjust', 'POST', null, reqBody);
      });

      it('should call auditTransaction api', function() {
        spyOn(Avatax, '_api');

        Avatax.transactions.auditTransaction('123', '456');
        expect(Avatax._api).toHaveBeenCalledWith('companies/123/transactions/456/audit', 'GET', null, null);
      });

      it('should call changeTransactionCode api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "newCode": "ca912ec1-724c-41a5-b7fd-6617afffa0a5"
        };

        Avatax.transactions.changeTransactionCode('123', '456', reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/transactions/456/changecode', 'POST', null, reqBody);
      });

      it('should call commitTransaction api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "commit": true
        };

        Avatax.transactions.commitTransaction('123', '456', reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/transactions/456/commit', 'POST', null, reqBody);
      });

      it('should call lockTransaction api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "isLocked": true
        };

        Avatax.transactions.lockTransaction('123', '456', reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/transactions/456/lock', 'POST', null, reqBody);
      });

      it('should call refundTransaction api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "refundTransactionCode": "83c8c0a5-c9dd-4acf-81a7-d7cfe6585817",
          "refundDate": "2017-06-28",
          "refundType": "Full",
          "refundPercentage": 20,
          "refundLines": [
            "1",
            "2"
          ],
          "referenceCode": "Refund for a committed transaction"
        };

        Avatax.transactions.refundTransaction('123', '456', reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/transactions/456/refund', 'POST', null, reqBody);
      });

      it('should call settleTransaction api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "verify": {
            "verifyTransactionDate": "2017-06-28T00:00:00-07:00",
            "verifyTotalAmount": 100,
            "verifyTotalTax": 6.25
          },
          "changeCode": {
            "newCode": "fac0fbf6-f43b-4936-9e89-30b9707a45aa"
          },
          "commit": {
            "commit": true
          }
        };

        Avatax.transactions.settleTransaction('123', '456', reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/transactions/456/settle', 'POST', null, reqBody);
      });

      it('should call getTransactionByCodeAndType api', function() {
        spyOn(Avatax, '_api');

        Avatax.transactions.getTransactionByCodeAndType('123', '456', '789');

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/transactions/456/types/789', 'GET', {
          '$include': undefined
        }, null);
      });

      it('should call auditTransactionWithType api', function() {
        spyOn(Avatax, '_api');
        Avatax.transactions.auditTransactionWithType('123', '456', '789');

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/transactions/456/types/789/audit', 'GET', null, null);
      });

      it('should call verifyTransaction api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "verifyTransactionDate": "2017-06-28T00:00:00-07:00",
          "verifyTotalAmount": 100,
          "verifyTotalTax": 6.25
        };

        Avatax.transactions.verifyTransaction('123', '456', reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/transactions/456/verify', 'POST', null, reqBody);
      });

      it('should call voidTransaction api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "code": "DocVoided"
        };

        Avatax.transactions.voidTransaction('123', '456', reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/transactions/456/void', 'POST', null, reqBody);
      });

      it('should call addLines api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "companyCode": "DEFAULT",
          "transactionCode": "1234",
          "documentType": "SalesInvoice",
          "lines": [
            {
              "number": "1",
              "quantity": 1,
              "amount": 100,
              "taxCode": "PS081282",
              "itemCode": "Y0001",
              "description": "Yarn"
            }
          ],
          "renumber": false
        };

        Avatax.transactions.addLines(reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/transactions/lines/add', 'POST', null, reqBody);
      });

      it('should call deleteLines api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "companyCode": "DEFAULT",
          "transactionCode": "1234",
          "documentType": "SalesInvoice",
          "lines": [
            "1"
          ],
          "renumber": false
        };

        Avatax.transactions.deleteLines(reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/transactions/lines/delete', 'POST', null, reqBody);
      });

      it('should call getTransactionById api', function() {
        spyOn(Avatax, '_api');

        Avatax.transactions.getTransactionById(123);

        expect(Avatax._api).toHaveBeenCalledWith('transactions/123', 'GET', {
          '$include': undefined
        }, null);
      });

      it('should call createTransaction api', function() {
        spyOn(Avatax, '_api');

        var request = {
          "type": "SalesInvoice",
          "companyCode": "DEFAULT",
          "date": "2017-05-16T00:00:00-07:00",
          "customerCode": "ABC",
          "purchaseOrderNo": "2017-05-16-001",
          "addresses": {
            "singleLocation": {
              "line1": "123 Main Street",
              "city": "Irvine",
              "region": "CA",
              "country": "US",
              "postalCode": "92615"
            },
            "shipFrom": {
              "line1": "123 Main Street",
              "city": "Irvine",
              "region": "CA",
              "country": "US",
              "postalCode": "92615"
            },
            "shipTo": {
              "line1": "123 Main Street",
              "city": "Irvine",
              "region": "CA",
              "country": "US",
              "postalCode": "92615"
            },
            "pointOfOrderOrigin": {
              "line1": "123 Main Street",
              "city": "Irvine",
              "region": "CA",
              "country": "US",
              "postalCode": "92615"
            },
            "pointOfOrderAcceptance": {
              "line1": "123 Main Street",
              "city": "Irvine",
              "region": "CA",
              "country": "US",
              "postalCode": "92615"
            }
          },
          "lines": [
            {
              "number": "1",
              "quantity": 1,
              "amount": 100,
              "addresses": {
                "singleLocation": {
                  "line1": "123 Main Street",
                  "city": "Irvine",
                  "region": "CA",
                  "country": "US",
                  "postalCode": "92615"
                },
                "shipFrom": {
                  "line1": "123 Main Street",
                  "city": "Irvine",
                  "region": "CA",
                  "country": "US",
                  "postalCode": "92615"
                },
                "shipTo": {
                  "line1": "123 Main Street",
                  "city": "Irvine",
                  "region": "CA",
                  "country": "US",
                  "postalCode": "92615"
                },
                "pointOfOrderOrigin": {
                  "line1": "123 Main Street",
                  "city": "Irvine",
                  "region": "CA",
                  "country": "US",
                  "postalCode": "92615"
                },
                "pointOfOrderAcceptance": {
                  "line1": "123 Main Street",
                  "city": "Irvine",
                  "region": "CA",
                  "country": "US",
                  "postalCode": "92615"
                }
              },
              "taxCode": "PS081282",
              "itemCode": "Y0001",
              "description": "Yarn",
              "taxOverride": {
                "type": "TaxAmount",
                "taxAmount": 6.25,
                "taxDate": "2017-05-16T00:00:00-07:00",
                "reason": "Precalculated Tax"
              },
              "parameters": {}
            }
          ],
          "parameters": {},
          "commit": true,
          "taxOverride": {
            "type": "TaxAmount",
            "taxAmount": 6.25,
            "taxDate": "2017-05-16T00:00:00-07:00",
            "reason": "Precalculated Tax"
          },
          "currencyCode": "USD",
          "description": "Yarn"
        };

        Avatax.transactions.createTransaction(request);

        expect(Avatax._api).toHaveBeenCalledWith('transactions/create','POST', {
          '$include': undefined
        }, request);
      });

      it('should call createOrAdjustTransaction api', function() {
        spyOn(Avatax, '_api');

        var request = {
          "createTransactionModel": {
            "lines": [
              {
                "number": "1",
                "quantity": 1,
                "amount": 100,
                "taxCode": "PS081282",
                "itemCode": "Y0001",
                "description": "Yarn"
              }
            ],
            "type": "SalesInvoice",
            "companyCode": "DEFAULT",
            "date": "2017-06-28",
            "customerCode": "ABC",
            "purchaseOrderNo": "2017-06-28-001",
            "addresses": {
              "singleLocation": {
                "line1": "123 Main Street",
                "city": "Irvine",
                "region": "CA",
                "country": "US",
                "postalCode": "92615"
              }
            },
            "commit": true,
            "currencyCode": "USD",
            "description": "Yarn"
          }
        };

        Avatax.transactions.createOrAdjustTransaction(request);

        expect(Avatax._api).toHaveBeenCalledWith('transactions/createoradjust','POST', {
          '$include': undefined
        }, request);
      });

      it('should call bulkLockTransaction api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "documentIds": [
            1,
            2,
            3,
            4,
            5
          ],
          "isLocked": true
        };

        Avatax.transactions.bulkLockTransaction(reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('transactions/lock', 'POST', null, reqBody);
      });
    });

    describe('Avatax.upcs', function () {
      var $httpBackend;
      var Avatax;
      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call listUPCsByCompany api', function() {
        spyOn(Avatax, '_api');

        Avatax.upcs.listUPCsByCompany(123);

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/upcs', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });

      it('should call createUPCs api', function() {
        spyOn(Avatax, '_api');

        var reqBody = [
          {
            "id": 123456789,
            "companyId": 1234567,
            "upc": "023032550992",
            "legacyTaxCode": "PS081282",
            "description": "Yarn"
          }
        ];

        Avatax.upcs.createUPCs(1234567, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/1234567/upcs', 'POST', null, reqBody);
      });

      it('should call deleteUPC api', function() {
        spyOn(Avatax, '_api');

        Avatax.upcs.deleteUPC(123,456);

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/upcs/456', 'DELETE', null, null);
      });

      it('should call getUPC api', function() {
        spyOn(Avatax, '_api');

        Avatax.upcs.getUPC(123,456);

        expect(Avatax._api).toHaveBeenCalledWith('companies/123/upcs/456', 'GET', null, null);
      });

      it('should call updateUPC api', function() {
        spyOn(Avatax, '_api');

        var reqBody = {
          "id": 123456789,
          "companyId": 1234567,
          "upc": "023032550992",
          "legacyTaxCode": "PS081282",
          "description": "Yarn"
        };

        Avatax.upcs.updateUPC(1234567, 123456789, reqBody);

        expect(Avatax._api).toHaveBeenCalledWith('companies/1234567/upcs/123456789', 'PUT', null, reqBody);
      });

      it('should call queryUPCs api', function() {
        spyOn(Avatax, '_api');

        Avatax.upcs.queryUPCs();

        expect(Avatax._api).toHaveBeenCalledWith('upcs', 'GET', {
          '$filter': undefined,
          '$include': undefined,
          '$top': undefined,
          '$skip': undefined,
          '$orderBy': undefined
        }, null);
      });
    });

    describe('Avatax.utilities', function () {
      var $httpBackend;
      var Avatax;
      beforeEach(inject(function(_$httpBackend_, _Avatax_) {
        Avatax = _Avatax_;
        $httpBackend = _$httpBackend_;
      }));

      it('should call ping api', function() {
        spyOn(Avatax, '_api');

        Avatax.utilities.ping();

        expect(Avatax._api).toHaveBeenCalledWith('utilities/ping', 'GET', null, null);
      });

      it('should call listMySubscriptions api', function() {
        spyOn(Avatax, '_api');

        Avatax.utilities.listMySubscriptions();

        expect(Avatax._api).toHaveBeenCalledWith('utilities/subscriptions', 'GET', null, null);
      });

      it('should call getMySubscription api', function() {
        spyOn(Avatax, '_api');

        Avatax.utilities.getMySubscription('AvaTaxST');

        expect(Avatax._api).toHaveBeenCalledWith('utilities/subscriptions/AvaTaxST', 'GET', null, null);
      });
    });
  });
});
