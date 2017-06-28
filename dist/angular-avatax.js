(function() {
  'use strict';

  angular.module('avalara', [])
    .provider('Avatax', avatax);

  function avatax() {
    var config = {};
    var env = config.env || 'production';
    var baseUrl = (env === 'sandbox') ? 'https://sandbox-rest.avatax.com/api/v2/' : 'https://rest.avatax.com/api/v2/';

    /**
     * Initialize Avatax API
     */
    this.init = function(cfg) {
      if (!cfg) {
        throw new Error('config must be provided to Avatax API');
      }
      else if (!(cfg.username && cfg.password) && !(cfg.accountId && cfg.licenseKey)) {
        throw new Error('either username/password or accountId/licenseKey combination must be provided to Avatax API');
      }

      config = cfg;
      if (config.env) {
        env = config.env || 'production';
        baseUrl = (env === 'sandbox') ? 'https://sandbox-rest.avatax.com/api/v2/' : 'https://rest.avatax.com/api/v2/';
      }
    }

    this.getEnv = function() {
      return env;
    }

    this.getBaseUrl = function() {
      return baseUrl;
    }

    /* @ngInject */
    this.$get = ["$q", "$http", "$window", function($q, $http, $window) {

      function _api(endpoint, method, params, data) {
        $http.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
        if(config.username && config.password) {
          $http.defaults.headers.common['Authorization'] = 'Basic ' + $window.btoa(config.username + ':' + config.password);
        } else if (config.accountId && config.licenseKey) {
          $http.defaults.headers.common['Authorization'] = 'Basic ' + $window.btoa(config.accountId + ':' + config.licenseKey);
        } else {
          throw new Error('either username/password or accountId/licenseKey combination must be provided to Avatax API');
        }

        var deferred = $q.defer();
        $http({
          url: baseUrl + endpoint,
          method: method ? method : 'GET',
          params: params,
          data: data
        })
        .then(function(response) {
          deferred.resolve(response);
        })
        .catch(function(response) {
          deferred.reject(response);
        });

        return deferred.promise;
      }

      function activateAccount(id, activationModel) {
        return avataxApi._api('accounts/' + id + '/activate', 'POST', null, activationModel);
      }

      function getAccountConfiguration(id) {
        return avataxApi._api('accounts/' + id + '/configuration', 'GET', null, null);
      }

      function setAccountConfiguration(id, body) {
        return avataxApi._api('accounts/' + id + '/configuration', 'POST', null, body);
      }

      function resetLicenseKey(id, body) {
        return avataxApi._api('accounts/' + id + '/resetlicensekey', 'POST', null, body);
      }

      function getAccountById(id, include) {
        return avataxApi._api('accounts/' + id, 'GET', {
          '$include': include
        }, null);
      }

      function resolveAddress(line1, line2, line3, city, region, postalCode, country, textCase, latitude, longitude) {
        return avataxApi._api('addresses/resolve', 'GET', {
          "line1": line1,
          "line2": line2,
          "line3": line3,
          "city": city,
          "region": region,
          "postalCode": postalCode,
          "country": country,
          "textCase": textCase,
          "latitude": latitude,
          "longitude": longitude
        }, null);
      }

      function resolveAddressPost(body) {
        return avataxApi._api('addresses/resolve', 'POST', null, body);
      }

      function queryBatches(filter, include, top, skip, orderBy) {
        return avataxApi._api('batches', 'GET', {
            "$include": include,
            "$filter": filter,
            "$top": top,
            "$skip": skip,
            "$orderBy": orderBy
        }, null);
      }

      function listBatchesByCompany(companyId, filter, include, top, skip, orderBy) {
        return avataxApi._api('companies/' + companyId + '/batches', 'GET', {
            "$include": include,
            "$filter": filter,
            "$top": top,
            "$skip": skip,
            "$orderBy": orderBy
        }, null);
      }

      function createBatches(companyId, batchModels) {
        return avataxApi._api('companies/' + companyId +'/batches', 'POST', null, batchModels);
      }

      function downloadBatch(companyId, batchId, id) {
        return avataxApi._api('companies/' + companyId + '/batches/' + batchId + '/files/' + id + '/attachment', 'GET', null, null);
      }

      function deleteBatch(companyId, batchId) {
        return avataxApi._api('companies/' + companyId + '/batches/' + batchId, 'DELETE', null, null);
      }

      function getBatch(companyId, batchId) {
        return avataxApi._api('companies/' + companyId + '/batches/' + batchId, 'GET', null, null);
      }

      function queryCompanies(include, filter, top, skip, orderBy) {
        return avataxApi._api('companies', 'GET', {
            "$include": include,
            "$filter": filter,
            "$top": top,
            "$skip": skip,
            "$orderBy": orderBy
        }, null);
      }

      function createCompanies(companyModels) {
        return avataxApi._api('companies', 'POST', null, companyModels);
      }

      function deleteCompany(id) {
        return avataxApi._api('companies/' + id, 'DELETE', null, null);
      }

      function getCompany(id, include) {
        return avataxApi._api('companies/' + id, 'GET', {
          "$include": include
        }, null);
      }

      function updateCompany(id, model) {
        return avataxApi._api('companies/' + id, 'PUT', null, model);
      }

      function getCompanyConfiguration(id) {
        return avataxApi._api('companies/' + id + '/configuration', 'GET', null, null);
      }

      function setCompanyConfiguration(id, configurationModel) {
        return avataxApi._api('companies/' + id + '/configuration', 'POST', null, configurationModel);
      }

      function getFilingStatus(id) {
        return avataxApi._api('companies/' +id + '/filingstatus', 'GET', null, null);
      }

      function changeFilingStatus(id, model) {
        return avataxApi._api('companies/' + id + '/filingstatus', 'POST', null, model);
      }

      function listFundingRequestsByCompany(id) {
        return avataxApi._api('companies/' +id + '/funding', 'GET', null, null);
      }

      function createFundingRequest(id, model) {
        return avataxApi._api('companies/' + id + '/funding/setup', 'POST', null, model);
      }

      function companyInitialize(model) {
        return avataxApi._api('companies/initialize', 'POST', null, model);
      }

      function listContactsByCompany(companyId, filter, include, top, skip, orderBy) {
        return avataxApi._api('companies/' + companyId + '/contacts', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function createContacts(companyId, model) {
        return avataxApi._api('companies/' + companyId + '/contacts', 'POST', null, model);
      }

      function deleteContact(companyId, contactId) {
        return avataxApi._api('companies/' + companyId + '/contacts/' + contactId, 'DELETE', null, null);
      }

      function getContact(companyId, contactId) {
         return avataxApi._api('companies/' + companyId + '/contacts/' + contactId, 'GET', null, null);
      }

      function updateContact(companyId, contactId, model) {
        return avataxApi._api('companies/' + companyId + '/contacts/' + contactId, 'PUT', null, model);
      }

      function queryContacts(filter, include, top, skip, orderBy) {
        return avataxApi._api('contacts', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function listAvaFileForms() {
        return avataxApi._api('definitions/avafileforms', 'GET', null, null);
      }

      function listCommunicationsTransactionTypes() {
        return avataxApi._api('definitions/communications/transactiontypes', 'GET', null, null);
      }

      function listCommunicationsServiceTypes(id) {
        return avataxApi._api('definitions/communications/transactiontypes/' + id + '/servicetypes', 'GET', null, null);
      }

      function listCommunicationsTSPairs() {
        return avataxApi._api('definitions/communications/tspairs', 'GET', null, null);
      }

      function listCountries(){
        return avataxApi._api('definitions/countries', 'GET', null, null);
      }

      function listRateTypesByCountry(country) {
        return avataxApi._api('definitions/countries/' + country + '/ratetypes', 'GET', null, null);
      }

      function listRegionsByCountry(country) {
          return avataxApi._api('definitions/countries/' + country + '/regions', 'GET', null, null);
      }

      function listEntityUseCodes() {
        return avataxApi._api('definitions/entityusecodes', 'GET', null, null);
      }

      function listLoginVerifiers() {
        return avataxApi._api('definitions/filingcalendars/loginverifiers', 'GET', null, null);
      }

      function getLoginVerifierByForm(form) {
        return avataxApi._api('definitions/filingcalendars/loginverifiers/' + form, 'GET', null, null);
      }

      function listFilingFrequencies() {
        return avataxApi._api('definitions/filingfrequencies', 'GET', null, null);
      }

      function listJurisdictionsByAddress(line1, line2, line3, city, region, postalCode, country) {
        return avataxApi._api('definitions/jurisdictionsnearaddress', 'GET', {
          'line1': line1,
          'line2': line2,
          'line3': line3,
          'city': city,
          'region': region,
          'postalCode': postalCode,
          'country': country
        }, null);
      }

      function listLocationQuestionsByAddress(line1, line2, line3, city, region, postalCode, country) {
        return avataxApi._api('definitions/locationquestions', 'GET', {
          'line1': line1,
          'line2': line2,
          'line3': line3,
          'city': city,
          'region': region,
          'postalCode': postalCode,
          'country': country
        }, null);
      }

      function listNexus() {
        return avataxApi._api('definitions/nexus', 'GET', null, null);
      }

      function listNexusByCountry(country) {
        return avataxApi._api('definitions/nexus/' + country, 'GET', null, null);
      }

      function listNexusByCountryAndRegion(country, region) {
        return avataxApi._api('definitions/nexus/' + country + '/' + region, 'GET', null, null);
      }

      function listNexusByAddress(line1, line2, line3, city, region, postalCode, country) {
        return avataxApi._api('definitions/nexus/byaddress', 'GET', {
          'line1': line1,
          'line2': line2,
          'line3': line3,
          'city': city,
          'region': region,
          'postalCode': postalCode,
          'country': country
        }, null);
      }

      function listNexusByFormCode(formCode) {
        return avataxApi._api('definitions/nexus/byform/' + formCode, 'GET', null, null);
      }

      function listNexusTaxTypeGroups() {
        return avataxApi._api('definitions/nexustaxtypegroups', 'GET', null, null);
      }

      function listNoticeCustomerFundingOptions() {
        return avataxApi._api('definitions/noticecustomerfundingoptions', 'GET', null, null);
      }

      function listNoticeCustomerTypes() {
        return avataxApi._api('definitions/noticecustomertypes', 'GET', null, null);
      }

      function listNoticeFilingTypes() {
        return avataxApi._api('definitions/noticefilingtypes', 'GET', null, null);
      }

      function listNoticePriorities() {
        return avataxApi._api('definitions/noticepriorities', 'GET', null, null);
      }

      function listNoticeReasons() {
        return avataxApi._api('definitions/noticereasons', 'GET', null, null);
      }

      function listNoticeResponsibilities() {
        return avataxApi._api('definitions/noticeresponsibilities', 'GET', null, null);
      }

      function listNoticeRootCauses() {
        return avataxApi._api('definitions/noticerootcauses', 'GET', null, null);
      }

      function listNoticeStatuses() {
        return avataxApi._api('definitions/noticestatuses', 'GET', null, null);
      }

      function listNoticeTypes() {
        return avataxApi._api('definitions/noticetypes', 'GET', null, null);
      }

      function listParameters() {
        return avataxApi._api('definitions/parameters', 'GET', null, null);
      }

      function listPermissions() {
        return avataxApi._api('definitions/permissions', 'GET', null, null);
      }

      function listRegions() {
        return avataxApi._api('definitions/regions', 'GET', null, null);
      }

      function listResourceFileTypes() {
        return avataxApi._api('definitions/resourcefiletypes', 'GET', null, null);
      }

      function listSecurityRoles() {
        return avataxApi._api('definitions/securityroles', 'GET', null, null);
      }

      function listSubscriptionTypes() {
        return avataxApi._api('definitions/subscriptiontypes', 'GET', null, null);
      }

      function listTaxAuthorities() {
        return avataxApi._api('definitions/taxauthorities', 'GET', null, null);
      }

      function listTaxAuthorityForms() {
        return avataxApi._api('definitions/taxauthorityforms', 'GET', null, null);
      }

      function listTaxAuthorityTypes() {
        return avataxApi._api('definitions/taxauthoritytypes', 'GET', null, null);
      }

      function listTaxCodes() {
        return avataxApi._api('definitions/taxcodes', 'GET', null, null);
      }

      function listTaxCodeTypes() {
        return avataxApi._api('definitions/taxcodetypes', 'GET', null, null);
      }

      function listTaxSubTypes() {
        return avataxApi._api('definitions/taxsubtypes', 'GET', null, null);
      }

      function listTaxTypeGroups() {
        return avataxApi._api('definitions/taxtypegroups', 'GET', null, null);
      }

      function listFilingCalendars(companyId, filter, top, skip, orderBy) {
        return avataxApi._api('companies/' + companyId + '/filingcalendars', 'GET', {
          '$filter': filter,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function deleteFilingCalendar(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/filingcalendars/' + id, 'DELETE', null, null);
      }

      function getFilingCalendar(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/filingcalendars/' + id, 'GET', null, null);
      }

      function updateFilingCalendar(companyId, id, model) {
        return avataxApi._api('companies/' + companyId + '/filingcalendars/' + id, 'PUT', null, model);
      }

      function cycleSafeExpiration(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/filingcalendars/' + id + '/cancel/options', 'GET', null, null);
      }

      function cancelFilingRequests(companyId, id, models) {
        return avataxApi._api('companies/' + companyId + '/filingcalendars/' + id + '/cancel/request', 'POST', null, models);
      }

      function cycleSafeEdit(companyId, id, model) {
        return avataxApi._api('companies/' + companyId + '/filingcalendars/' + id + '/edit/options', 'POST', null, model);
      }

      function requestFilingCalendarUpdate(companyId, id, models) {
        return avataxApi._api('companies/' + companyId + '/filingcalendars/' + id + '/edit/request', 'POST', null, models);
      }

      function cycleSafeAdd(companyId, formCode) {
        return avataxApi._api('companies/' + companyId + '/filingcalendars/add/options', 'GET', {
          "formCode": formCode
        }, null);
      }

      function createFilingRequests(companyId, models) {
        return avataxApi._api('companies/' + companyId + '/filingcalendars/add/request', 'POST', null, models);
      }

      function listFilingRequests(companyId, filter, top, skip, orderBy) {
        return avataxApi._api('companies/' + companyId + '/filingrequests', 'GET', {
          '$filter': filter,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function getFilingRequest(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/filingrequests/' + id, 'GET', null, null);
      }

      function updateFilingRequest(companyId, id, model) {
        return avataxApi._api('companies/' + companyId + '/filingrequests/' + id, 'PUT', null, model);
      }

      function approveFilingRequest(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/filingrequests/' + id + '/approve', 'POST', null, null);
      }

      function cancelFilingRequest(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/filingrequests/' + id + '/cancel', 'POST', null, null);
      }

      function queryFilingCalendars(filter, top, skip, orderBy) {
        return avataxApi._api('filingcalendars', 'GET', {
          '$filter': filter,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function loginVerificationStatus(jobId) {
        return avataxApi._api('filingcalendars/credentials/' + jobId, 'GET', null, null);
      }

      function loginVerificationRequest(model) {
        return avataxApi._api('filingcalendars/credentials/verify', 'POST', null, model);
      }

      function queryFilingRequests(filter, top, skip, orderBy) {
        return avataxApi._api('filingrequests', 'GET', {
          '$filter': filter,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function getFilingAttachment(companyId, filingId, fileId) {
        return avataxApi._api('companies/' + companyId +'/filings/' + filingId + '/attachment', 'GET', {
          'fileId': fileId
        }, null);
      }

      function filingsCheckupReport(companyId, filingsId) {
        return avataxApi._api('companies/' + companyId +'/filings/' + filingsId + '/checkup', 'GET', null, null);
      }

      function getFilings(companyId, year, month) {
        return avataxApi._api('companies/' + companyId + '/filings/' + year + '/' + month, 'GET', null, null);
      }

      function getFilingsByCountry(companyId, year, month, country) {
        return avataxApi._api('companies/' + companyId + '/filings/' + year + '/' + month + '/' + country, 'GET', null, null);
      }

      function getFilingsByCountryRegion(companyId, year, month, country, region) {
        return avataxApi._api('companies/' + companyId + '/filings/' + year + '/' + month + '/' + country + '/' + region, 'GET', null, null);
      }

      function getFilingsByReturnName(companyId, year, month, country, region, formCode) {
        return avataxApi._api('companies/' + companyId + '/filings/' + year + '/' + month + '/' + country + '/' + region + '/' + formCode, 'GET', null, null);
      }

      function createReturnAdjustment(companyId, year, month, country, region, formCode, models) {
        return avataxApi._api('companies/' + companyId + '/filings/' + year + '/' + month + '/' + country + '/' + region + '/' + formCode + '/adjust', 'POST', null, models);
      }

      function createReturnAugmentation(companyId, year, month, country, region, formCode, models) {
        return avataxApi._api('companies/' + companyId + '/filings/' + year + '/' + month + '/' + country + '/' + region + '/' + formCode + '/augment', 'POST', null, models);
      }

      function approveFilingsCountryRegion(companyId, year, month, country, region, model) {
        return avataxApi._api('companies/' + companyId + '/filings/' + year + '/' + month + '/' + country + '/' + region + '/approve', 'POST', null, model);
      }

      function rebuildFilingsByCountryRegion(companyId, year, month, country, region, model) {
        return avataxApi._api('companies/' + companyId + '/filings/' + year + '/' + month + '/' + country + '/' + region + '/rebuild', 'POST', null, model);
      }

      function approveFilingsCountry(companyId, year, month, country, model) {
        return avataxApi._api('companies/' + companyId + '/filings/' + year + '/' + month + '/' + country + '/approve', 'POST', null, model);
      }

      function rebuildFilingsByCountry(companyId, year, month, country, model) {
        return avataxApi._api('companies/' + companyId + '/filings/' + year + '/' + month + '/' + country + '/rebuild', 'POST', null, model);
      }

      function approveFilings(companyId, year, month, model) {
        return avataxApi._api('companies/' + companyId + '/filings/' + year + '/' + month + '/approve', 'POST', null, model);
      }

      function getFilingAttachments(companyId, year, month) {
        return avataxApi._api('companies/' + companyId + '/filings/' + year + '/' + month + '/attachments', 'GET', null, null);
      }

      function getFilingAttachmentsTraceFile(companyId, year, month) {
        return avataxApi._api('companies/' + companyId + '/filings/' + year + '/' + month + '/attachments/tracefile', 'GET', null, null);
      }

      function filingsCheckupReports(companyId, year, month) {
        return avataxApi._api('companies/' + companyId + '/filings/' + year + '/' + month + '/checkup', 'GET', null, null);
      }

      function rebuildFilings(companyId, year, month, model) {
        return avataxApi._api('companies/' + companyId + '/filings/' + year + '/' + month + '/rebuild', 'POST', null, model);
      }

      function deleteReturnAdjustment(companyId, id) {
        return avataxApi._api('companies/' + companyId +'/filings/adjust/' + id, 'DELETE', null, null);
      }

      function updateReturnAdjustment(companyId, id, model) {
        return avataxApi._api('companies/' + companyId +'/filings/adjust/' + id, 'PUT', null, model);
      }

      function deleteReturnAugmentation(companyId, id) {
        return avataxApi._api('companies/' + companyId +'/filings/augment/' + id, 'DELETE', null, null);
      }

      function updateReturnAugmentation(companyId, id, model) {
        return avataxApi._api('companies/' + companyId +'/filings/augment/' + id, 'PUT', null, model);
      }

      function getFilingsReturns(companyId) {
        return avataxApi._api('companies/' + companyId +'/filings/returns', 'GET', null, null);
      }

      function requestFreeTrial(model) {
        return avataxApi._api('accounts/freetrials/request', 'POST', null, model);
      }

      function taxRatesByAddress(line1, line2, line3, city, region, postalCode, country) {
        return avataxApi._api('taxrates/byaddress', 'GET', {
          "line1": line1,
          "line2": line2,
          "line3": line3,
          "city": city,
          "region": region,
          "postalCode": postalCode,
          "country": country
        }, null);
      }

      function taxRatesByPostalCode(country, postalCode) {
        return avataxApi._api('taxrates/bypostalcode', 'GET', {
          "country": country,
          "postalCode": postalCode
        }, null);
      }

      function fundingRequestStatus(id) {
        return avataxApi._api('fundingrequests/' + id, 'GET', null, null);
      }

      function activateFundingRequest(id) {
        return avataxApi._api('fundingrequests/' + id + '/widget', 'GET', null, null);
      }

      function listItemsByCompany(companyId, filter, include, top, skip, orderBy) {
        return avataxApi._api('companies/' + companyId + '/items', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function createItems(companyId, models) {
        return avataxApi._api('companies/' + companyId + '/items', 'POST', null, models);
      }

      function deleteItem(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/items/' + id, 'DELETE', null, null);
      }

      function getItem(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/items/' + id, 'GET', null, null);
      }

      function updateItem(companyId, id, model) {
        return avataxApi._api('companies/' + companyId + '/items/' + id, 'PUT', null, model);
      }

      function queryItems(filter, include, top, skip, orderBy) {
        return avataxApi._api('items', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function listJurisdictionOverridesByAccount(accountId, filter, include, top, skip, orderBy) {
        return avataxApi._api('accounts/' + accountId + '/jurisdictionoverrides', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function createJurisdictionOverrides(accountId, models) {
        return avataxApi._api('accounts/' + accountId + '/jurisdictionoverrides', 'POST', null, models);
      }

      function deleteJurisdictionOverride(accountId, id) {
        return avataxApi._api('accounts/' + accountId + '/jurisdictionoverrides/' + id, 'DELETE', null, null);
      }

      function getJurisdictionOverride(accountId, id) {
        return avataxApi._api('accounts/' + accountId + '/jurisdictionoverrides/' + id, 'GET', null, null);
      }

      function updateJurisdictionOverride(accountId, id, model) {
        return avataxApi._api('accounts/' + accountId + '/jurisdictionoverrides/' + id, 'PUT', null, model);
      }

      function queryJurisdictionOverrides(filter, include, top, skip, orderBy) {
        return avataxApi._api('jurisdictionoverrides', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function listLocationsByCompany(companyId, filter, include, top, skip, orderBy) {
        return avataxApi._api('companies/' + companyId + '/locations', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function createLocations(companyId, models) {
        return avataxApi._api('companies/' + companyId + '/locations', 'POST', null, models);
      }

      function deleteLocation(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/locations/' + id, 'DELETE', null, null);
      }

      function getLocation(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/locations/' + id, 'GET', null, null);
      }

      function updateLocation(companyId, id, model) {
        return avataxApi._api('companies/' + companyId + '/locations/' + id, 'PUT', null, model);
      }

      function validateLocation(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/locations/' + id + '/validate', 'GET', null, null);
      }

      function queryLocations(filter, include, top, skip, orderBy) {
        return avataxApi._api('locations', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function listNexusByCompany(companyId, filter, include, top, skip, orderBy) {
        return avataxApi._api('companies/' + companyId + '/nexus', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function createNexus(companyId, models) {
        return avataxApi._api('companies/' + companyId + '/nexus', 'POST', null, models);
      }

      function deleteNexus(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/nexus/' + id, 'DELETE', null, null);
      }

      function getNexus(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/nexus/' + id, 'GET', null, null);
      }

      function updateNexus(companyId, id, model) {
        return avataxApi._api('companies/' + companyId + '/nexus/' + id, 'PUT', null, model);
      }

      function getNexusByFormCode(companyId, formCode) {
        return avataxApi._api('companies/' + companyId + '/nexus/byform/' + formCode, 'GET', null, null);
      }

      function queryNexus(filter, include, top, skip, orderBy) {
         return avataxApi._api('nexus', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function listNoticesByCompany(companyId, filter, include, top, skip, orderBy) {
        return avataxApi._api('companies/' + companyId + '/notices', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function createNotices(companyId, models) {
        return avataxApi._api('companies/' + companyId + '/notices', 'POST', null, models);
      }

      function deleteNotice(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/notices/' + id, 'DELETE', null, null);
      }

      function getNotice(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/notices/' + id, 'GET', null, null);
      }

      function updateNotice(companyId, id, model) {
        return avataxApi._api('companies/' + companyId + '/notices/' + id, 'PUT', null, model);
      }

      function getNoticeComments(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/notices/' + id + '/comments', 'GET', null, null);
      }

      function createNoticeComment(companyId, id, models) {
        return avataxApi._api('companies/' + companyId + '/notices/' + id + '/comments', 'POST', null, models);
      }

      function getNoticeFinanceDetails(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/notices/' + id + '/financedetails', 'GET', null, null);
      }

      function createNoticeFinanceDetails(companyId, id, models) {
        return avataxApi._api('companies/' + companyId + '/notices/' + id + '/financedetails', 'POST', null, models);
      }

      function getNoticeResponsibilities(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/notices/' + id + '/responsibilities', 'GET', null, null);
      }

      function createNoticeResponsibilities(companyId, id, models) {
        return avataxApi._api('companies/' + companyId + '/notices/' + id + '/responsibilities', 'POST', null, models);
      }

      function getNoticeRootCauses(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/notices/' + id + '/rootcauses', 'GET', null, null);
      }

      function createNoticeRootCauses(companyId, id, models) {
        return avataxApi._api('companies/' + companyId + '/notices/' + id + '/rootcauses', 'POST', null, models);
      }

      function deleteResponsibilities(companyId, noticeId, id) {
        return avataxApi._api('companies/' + companyId + '/notices/' + noticeId + '/responsibilities/' + id, 'DELETE', null, null);
      }

      function deleteRootCauses(companyId, noticeId, id) {
        return avataxApi._api('companies/' + companyId + '/notices/' + noticeId + '/rootcauses/' + id, 'DELETE', null, null);
      }

      function downloadNoticeAttachment(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/notices/files/' + id + '/attachment', 'GET', null, null);
      }

      function uploadAttachment(companyId, requests) {
        return avataxApi._api('companies/' + companyId + '/notices/files/attachment', 'POST', null, requests);
      }

      function queryNotices(filter, include, top, skip, orderBy) {
         return avataxApi._api('notices', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function requestNewAccount(model) {
        return avataxApi._api('accounts/request', 'POST', null, model);
      }

      function queryAccounts(filter, include, top, skip, orderBy) {
        return avataxApi._api('accounts', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function createAccount(model) {
        return avataxApi._api('accounts', 'POST', null, model);
      }

      function deleteSubscription(accountId, id) {
        return avataxApi._api('accounts/' + accountId + '/subscriptions/' + id, 'DELETE', null, null);
      }

      function updateSubscription(accountId, id, model) {
        return avataxApi._api('accounts/' + accountId + '/subscriptions/' + id, 'PUT', null, model);
      }

      function deleteUser(accountId, id) {
        return avataxApi._api('accounts/' + accountId + '/users/' + id, 'DELETE', null, null);
      }

      function deleteAccount(accountId) {
        return avataxApi._api('accounts/' + accountId, 'DELETE', null, null);
      }

      function updateAccount(accountId, model) {
        return avataxApi._api('accounts/' + accountId, 'PUT', null, model);
      }

      function changePassword(model) {
        return avataxApi._api('passwords', 'PUT', null, model);
      }

      function resetPassword(userId, model) {
        return avataxApi._api('passwords/' + userId + '/reset', 'POST', null, model);
      }

      function createSubscriptions(accountId, models) {
        return avataxApi._api('accounts/' + accountId + '/subscriptions', 'POST', null, models);
      }

      function createUsers(accountId, models) {
        return avataxApi._api('accounts/' + accountId + '/users', 'POST', null, models);
      }

      function getSubscription(accountId, id) {
         return avataxApi._api('accounts/' + accountId + '/subscriptions/' + id, 'GET', null, null);
      }

      function listSubscriptionsByAccount(accountId, filter, top, skip, orderBy) {
        return avataxApi._api('accounts/' + accountId + '/subscriptions', 'GET', {
          '$filter': filter,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function querySubscriptions(filter, top, skip, orderBy) {
        return avataxApi._api('subscriptions', 'GET', {
          '$filter': filter,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function getUser(accountId, id, include) {
        return avataxApi._api('accounts/' + accountId + '/users/' + id, 'GET', {
          '$include': include
        }, null);
      }

      function updateUser(accountId, id, model) {
        return avataxApi._api('accounts/' + accountId + '/users/' + id, 'PUT', null, model);
      }

      function listUsersByAccount(accountId, filter, include, top, skip, orderBy) {
        return avataxApi._api('accounts/' + accountId + '/users', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function getUserEntitlements(accountId, id) {
        return avataxApi._api('accounts/' + accountId + '/users/' + id + '/entitlements', 'GET', null, null);
      }

      function queryUsers(filter, include, top, skip, orderBy) {
        return avataxApi._api('users', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function listTaxCodesByCompany(companyId, filter, include, top, skip, orderBy) {
        return avataxApi._api('companies/' + companyId + '/taxcodes', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function createTaxCodes(companyId, models) {
        return avataxApi._api('companies/' + companyId + '/taxcodes', 'POST', null, models);
      }

      function deleteTaxCode(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/taxcodes/' + id, 'DELETE', null, null);
      }

      function getTaxCode(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/taxcodes/' + id, 'GET', null, null);
      }

      function updateTaxCode(companyId, id, model) {
        return avataxApi._api('companies/' + companyId + '/taxcodes/' + id, 'PUT', null, model);
      }

      function queryTaxCodes(filter, include, top, skip, orderBy) {
        return avataxApi._api('taxcodes', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function buildTaxContentFileForLocation(companyId, id, date, format, partnerId, includeJurisCodes) {
        return avataxApi._api('companies/' + companyId + '/locations/' + id + '/pointofsaledata', 'GET', {
          'date': date,
          'format': format,
          'partnerId': partnerId,
          'includeJurisCodes': includeJurisCodes
        }, null);
      }

      function buildTaxContentFile(model) {
        return avataxApi._api('pointofsaledata/build', 'POST', null, model);
      }

      function listTaxRules(companyId, filter, include, top, skip, orderBy) {
        return avataxApi._api('companies/' + companyId + '/taxrules', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function createTaxRules(companyId, models) {
        return avataxApi._api('companies/' + companyId + '/taxrules', 'POST', null, models);
      }

      function deleteTaxRule(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/taxrules/' + id, 'DELETE', null, null);
      }

      function getTaxRule(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/taxrules/' + id, 'GET', null, null);
      }

      function updateTaxRule(companyId, id, model) {
        return avataxApi._api('companies/' + companyId + '/taxrules/' + id, 'PUT', null, model);
      }

      function queryTaxRules(filter, include, top, skip, orderBy) {
        return avataxApi._api('taxrules', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function listTransactionsByCompany(companyCode, filter, include, top, skip, orderBy) {
        return avataxApi._api('companies/' + companyCode + '/transactions', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function getTransactionByCode(companyCode, transactionCode, include) {
        return avataxApi._api('companies/' + companyCode + '/transactions/' + transactionCode, 'GET', {
          '$include': include
        }, null);
      }

      function adjustTransaction(companyCode, transactionCode, model) {
        return avataxApi._api('companies/' + companyCode + '/transactions/' + transactionCode + '/adjust', 'POST', null, model);
      }

      function auditTransaction(companyCode, transactionCode) {
        return avataxApi._api('companies/' + companyCode + '/transactions/' + transactionCode + '/audit', 'GET', null, null);
      }

      function changeTransactionCode(companyCode, transactionCode, model) {
        return avataxApi._api('companies/' + companyCode + '/transactions/' + transactionCode + '/changecode', 'POST', null, model);
      }

      function commitTransaction(companyCode, transactionCode, model) {
        return avataxApi._api('companies/' + companyCode + '/transactions/' + transactionCode + '/commit', 'POST', null, model);
      }

      function lockTransaction(companyCode, transactionCode, model) {
        return avataxApi._api('companies/' + companyCode + '/transactions/' + transactionCode + '/lock', 'POST', null, model);
      }

      function refundTransaction(companyCode, transactionCode, model) {
        return avataxApi._api('companies/' + companyCode + '/transactions/' + transactionCode + '/refund', 'POST', null, model);
      }

      function settleTransaction(companyCode, transactionCode, model) {
        return avataxApi._api('companies/' + companyCode + '/transactions/' + transactionCode + '/settle', 'POST', null, model);
      }

      function getTransactionByCodeAndType(companyCode, transactionCode, documentType, include) {
        return avataxApi._api('companies/' + companyCode + '/transactions/' + transactionCode + '/types/' + documentType, 'GET', {
          '$include': include
        }, null);
      }

      function auditTransactionWithType(companyCode, transactionCode, documentType) {
        return avataxApi._api('companies/' + companyCode + '/transactions/' + transactionCode + '/types/' + documentType + '/audit', 'GET', null, null);
      }

      function verifyTransaction(companyCode, transactionCode, model) {
        return avataxApi._api('companies/' + companyCode + '/transactions/' + transactionCode + '/verify', 'POST', null, model);
      }

      function voidTransaction(companyCode, transactionCode, model) {
        return avataxApi._api('companies/' + companyCode + '/transactions/' + transactionCode + '/void', 'POST', null, model);
      }

      function addLines(model) {
        return avataxApi._api('companies/transactions/lines/add', 'POST', null, model);
      }

      function deleteLines(model) {
        return avataxApi._api('companies/transactions/lines/delete', 'POST', null, model);
      }

      function getTransactionById(id, include) {
        return avataxApi._api('transactions/' + id, 'GET', {
          '$include': include
        }, null);
      }

      function createTransaction(transactionModel, include) {
        return avataxApi._api('transactions/create', 'POST', {
          '$include': include
        }, transactionModel);
      }

      function createOrAdjustTransaction(transactionModel, include) {
        return avataxApi._api('transactions/createoradjust', 'POST', {
          '$include': include
        }, transactionModel);
      }

      function bulkLockTransaction(model) {
        return avataxApi._api('transactions/lock', 'POST', null, model);
      }

      function listUPCsByCompany(companyId, filter, include, top, skip, orderBy) {
        return avataxApi._api('companies/' + companyId + '/upcs', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function createUPCs(companyId, model) {
        return avataxApi._api('companies/' + companyId + '/upcs', 'POST', null, model);
      }

      function deleteUPC(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/upcs/' + id, 'DELETE', null, null);
      }

      function getUPC(companyId, id) {
        return avataxApi._api('companies/' + companyId + '/upcs/' + id, 'GET', null, null);
      }

      function updateUPC(companyId, id, model) {
        return avataxApi._api('companies/' + companyId + '/upcs/' + id, 'PUT', null, model);
      }

      function queryUPCs(filter, include, top, skip, orderBy) {
        return avataxApi._api('upcs', 'GET', {
          '$filter': filter,
          '$include': include,
          '$top': top,
          '$skip': skip,
          '$orderBy': orderBy
        }, null);
      }

      function ping() {
        return avataxApi._api('utilities/ping', 'GET', null, null);
      }

      function listMySubscriptions() {
        return avataxApi._api('utilities/subscriptions', 'GET', null, null);
      }

      function getMySubscription(serviceTypeId) {
        return avataxApi._api('utilities/subscriptions/' + serviceTypeId, 'GET', null, null);
      }

      var avataxApi = {
        _api: _api,
        accounts: {
          activateAccount: activateAccount,
          getAccountConfiguration: getAccountConfiguration,
          setAccountConfiguration: setAccountConfiguration,
          resetLicenseKey: resetLicenseKey,
          getAccountById: getAccountById
        },
        addresses: {
          resolveAddress: resolveAddress,
          resolveAddressPost: resolveAddressPost
        },
        batches: {
          queryBatches: queryBatches,
          listBatchesByCompany: listBatchesByCompany,
          createBatches: createBatches,
          downloadBatch: downloadBatch,
          deleteBatch: deleteBatch,
          getBatch: getBatch
        },
        companies: {
          queryCompanies: queryCompanies,
          createCompanies: createCompanies,
          deleteCompany: deleteCompany,
          getCompany: getCompany,
          updateCompany: updateCompany,
          getCompanyConfiguration: getCompanyConfiguration,
          setCompanyConfiguration: setCompanyConfiguration,
          getFilingStatus: getFilingStatus,
          changeFilingStatus: changeFilingStatus,
          listFundingRequestsByCompany: listFundingRequestsByCompany,
          createFundingRequest: createFundingRequest,
          companyInitialize: companyInitialize
        },
        contacts: {
          listContactsByCompany: listContactsByCompany,
          createContacts: createContacts,
          deleteContact: deleteContact,
          getContact: getContact,
          updateContact: updateContact,
          queryContacts: queryContacts
        },
        definitions: {
          listAvaFileForms: listAvaFileForms,
          listCommunicationsTransactionTypes: listCommunicationsTransactionTypes,
          listCommunicationsServiceTypes: listCommunicationsServiceTypes,
          listCommunicationsTSPairs: listCommunicationsTSPairs,
          listCountries: listCountries,
          listRateTypesByCountry: listRateTypesByCountry,
          listRegionsByCountry: listRegionsByCountry,
          listEntityUseCodes: listEntityUseCodes,
          listLoginVerifiers: listLoginVerifiers,
          getLoginVerifierByForm: getLoginVerifierByForm,
          listFilingFrequencies: listFilingFrequencies,
          listJurisdictionsByAddress: listJurisdictionsByAddress,
          listLocationQuestionsByAddress: listLocationQuestionsByAddress,
          listNexus: listNexus,
          listNexusByCountry: listNexusByCountry,
          listNexusByCountryAndRegion: listNexusByCountryAndRegion,
          listNexusByAddress: listNexusByAddress,
          listNexusByFormCode: listNexusByFormCode,
          listNexusTaxTypeGroups: listNexusTaxTypeGroups,
          listNoticeCustomerFundingOptions: listNoticeCustomerFundingOptions,
          listNoticeCustomerTypes: listNoticeCustomerTypes,
          listNoticeFilingTypes: listNoticeFilingTypes,
          listNoticePriorities: listNoticePriorities,
          listNoticeReasons: listNoticeReasons,
          listNoticeResponsibilities: listNoticeResponsibilities,
          listNoticeRootCauses: listNoticeRootCauses,
          listNoticeStatuses: listNoticeStatuses,
          listNoticeTypes: listNoticeTypes,
          listParameters: listParameters,
          listPermissions: listPermissions,
          listRegions: listRegions,
          listResourceFileTypes: listResourceFileTypes,
          listSecurityRoles: listSecurityRoles,
          listSubscriptionTypes: listSubscriptionTypes,
          listTaxAuthorities: listTaxAuthorities,
          listTaxAuthorityForms: listTaxAuthorityForms,
          listTaxAuthorityTypes: listTaxAuthorityTypes,
          listTaxCodes: listTaxCodes,
          listTaxCodeTypes: listTaxCodeTypes,
          listTaxSubTypes: listTaxSubTypes,
          listTaxTypeGroups: listTaxTypeGroups
        },
        filingCalendars: {
          listFilingCalendars: listFilingCalendars,
          deleteFilingCalendar: deleteFilingCalendar,
          getFilingCalendar: getFilingCalendar,
          updateFilingCalendar: updateFilingCalendar,
          cycleSafeExpiration: cycleSafeExpiration,
          cancelFilingRequests: cancelFilingRequests,
          cycleSafeEdit: cycleSafeEdit,
          requestFilingCalendarUpdate: requestFilingCalendarUpdate,
          cycleSafeAdd: cycleSafeAdd,
          createFilingRequests: createFilingRequests,
          listFilingRequests: listFilingRequests,
          getFilingRequest: getFilingRequest,
          updateFilingRequest: updateFilingRequest,
          approveFilingRequest: approveFilingRequest,
          cancelFilingRequest: cancelFilingRequest,
          queryFilingCalendars: queryFilingCalendars,
          loginVerificationStatus: loginVerificationStatus,
          loginVerificationRequest: loginVerificationRequest,
          queryFilingRequests: queryFilingRequests
        },
        filings: {
          getFilingAttachment: getFilingAttachment,
          filingsCheckupReport: filingsCheckupReport,
          getFilings: getFilings,
          getFilingsByCountry: getFilingsByCountry,
          getFilingsByCountryRegion: getFilingsByCountryRegion,
          getFilingsByReturnName: getFilingsByReturnName,
          createReturnAdjustment: createReturnAdjustment,
          createReturnAugmentation: createReturnAugmentation,
          approveFilingsCountryRegion: approveFilingsCountryRegion,
          rebuildFilingsByCountryRegion: rebuildFilingsByCountryRegion,
          approveFilingsCountry: approveFilingsCountry,
          rebuildFilingsByCountry: rebuildFilingsByCountry,
          approveFilings: approveFilings,
          getFilingAttachments: getFilingAttachments,
          getFilingAttachmentsTraceFile: getFilingAttachmentsTraceFile,
          filingsCheckupReports: filingsCheckupReports,
          rebuildFilings: rebuildFilings,
          deleteReturnAdjustment: deleteReturnAdjustment,
          updateReturnAdjustment: updateReturnAdjustment,
          deleteReturnAugmentation: deleteReturnAugmentation,
          updateReturnAugmentation: updateReturnAugmentation,
          getFilingsReturns: getFilingsReturns
        },
        free: {
          requestFreeTrial: requestFreeTrial,
          taxRatesByAddress: taxRatesByAddress,
          taxRatesByPostalCode: taxRatesByPostalCode
        },
        fundingRequests: {
          fundingRequestStatus: fundingRequestStatus,
          activateFundingRequest: activateFundingRequest
        },
        items: {
          listItemsByCompany: listItemsByCompany,
          createItems: createItems,
          deleteItem: deleteItem,
          getItem: getItem,
          updateItem: updateItem,
          queryItems: queryItems
        },
        jurisdictionOverrides: {
          listJurisdictionOverridesByAccount: listJurisdictionOverridesByAccount,
          createJurisdictionOverrides: createJurisdictionOverrides,
          deleteJurisdictionOverride: deleteJurisdictionOverride,
          getJurisdictionOverride: getJurisdictionOverride,
          updateJurisdictionOverride: updateJurisdictionOverride,
          queryJurisdictionOverrides: queryJurisdictionOverrides
        },
        locations: {
          listLocationsByCompany: listLocationsByCompany,
          createLocations: createLocations,
          deleteLocation: deleteLocation,
          getLocation: getLocation,
          updateLocation: updateLocation,
          validateLocation: validateLocation,
          queryLocations: queryLocations
        },
        nexus: {
          listNexusByCompany: listNexusByCompany,
          createNexus: createNexus,
          deleteNexus: deleteNexus,
          getNexus: getNexus,
          updateNexus: updateNexus,
          getNexusByFormCode: getNexusByFormCode,
          queryNexus: queryNexus
        },
        notices: {
          listNoticesByCompany: listNoticesByCompany,
          createNotices: createNotices,
          deleteNotice: deleteNotice,
          getNotice: getNotice,
          updateNotice: updateNotice,
          getNoticeComments: getNoticeComments,
          createNoticeComment: createNoticeComment,
          getNoticeFinanceDetails: getNoticeFinanceDetails,
          createNoticeFinanceDetails: createNoticeFinanceDetails,
          getNoticeResponsibilities: getNoticeResponsibilities,
          createNoticeResponsibilities: createNoticeResponsibilities,
          getNoticeRootCauses: getNoticeRootCauses,
          createNoticeRootCauses: createNoticeRootCauses,
          deleteResponsibilities: deleteResponsibilities,
          deleteRootCauses: deleteRootCauses,
          downloadNoticeAttachment: downloadNoticeAttachment,
          uploadAttachment: uploadAttachment,
          queryNotices: queryNotices
        },
        onboarding: {
          requestNewAccount: requestNewAccount
        },
        registrar: {
          queryAccounts: queryAccounts,
          createAccount: createAccount,
          deleteSubscription: deleteSubscription,
          updateSubscription: updateSubscription,
          deleteUser: deleteUser,
          deleteAccount: deleteAccount,
          updateAccount: updateAccount,
          changePassword: changePassword,
          resetPassword: resetPassword,
          createSubscriptions: createSubscriptions,
          createUsers: createUsers
        },
        subscriptions: {
          getSubscription: getSubscription,
          listSubscriptionsByAccount: listSubscriptionsByAccount,
          querySubscriptions: querySubscriptions
        },
        users: {
          getUser: getUser,
          updateUser: updateUser,
          listUsersByAccount: listUsersByAccount,
          getUserEntitlements: getUserEntitlements,
          queryUsers: queryUsers
        },
        taxCodes: {
          listTaxCodesByCompany: listTaxCodesByCompany,
          createTaxCodes: createTaxCodes,
          deleteTaxCode: deleteTaxCode,
          getTaxCode: getTaxCode,
          updateTaxCode: updateTaxCode,
          queryTaxCodes: queryTaxCodes
        },
        taxContent: {
          buildTaxContentFileForLocation: buildTaxContentFileForLocation,
          buildTaxContentFile: buildTaxContentFile
        },
        taxRules: {
          listTaxRules: listTaxRules,
          createTaxRules: createTaxRules,
          deleteTaxRule: deleteTaxRule,
          getTaxRule: getTaxRule,
          updateTaxRule: updateTaxRule,
          queryTaxRules: queryTaxRules
        },
        transactions: {
          listTransactionsByCompany: listTransactionsByCompany,
          getTransactionByCode: getTransactionByCode,
          adjustTransaction: adjustTransaction,
          auditTransaction: auditTransaction,
          changeTransactionCode: changeTransactionCode,
          commitTransaction: commitTransaction,
          lockTransaction: lockTransaction,
          refundTransaction: refundTransaction,
          settleTransaction: settleTransaction,
          getTransactionByCodeAndType: getTransactionByCodeAndType,
          auditTransactionWithType: auditTransactionWithType,
          verifyTransaction: verifyTransaction,
          voidTransaction: voidTransaction,
          addLines: addLines,
          deleteLines: deleteLines,
          getTransactionById: getTransactionById,
          createTransaction: createTransaction,
          createOrAdjustTransaction: createOrAdjustTransaction,
          bulkLockTransaction: bulkLockTransaction
        },
        upcs: {
          listUPCsByCompany: listUPCsByCompany,
          createUPCs: createUPCs,
          deleteUPC: deleteUPC,
          getUPC: getUPC,
          updateUPC: updateUPC,
          queryUPCs: queryUPCs
        },
        utilities: {
          ping: ping,
          listMySubscriptions: listMySubscriptions,
          getMySubscription: getMySubscription
        }
      };

      return avataxApi;
    }];
    this.$get.$inject = ["$q", "$http", "$window"];
  }
})();
