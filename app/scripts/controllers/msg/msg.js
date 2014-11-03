// Generated by CoffeeScript 1.7.1
"use strict";
Mifan.controller("msgCtrl", function($scope, $rootScope, $http, $debug, $timeout) {
  var DOC, ans, msg;
  DOC = $scope.DOC;
  $scope.$on("$viewContentLoaded", function() {
    return $scope.$emit("pageChange", "msg");
  });
  $scope.setMBill = function(index) {
    return $scope.toggleMBill(["love", "answer", "share"]);
  };
  msg = {
    init: function() {
      msg.getAskMe();
      $scope.askMe = [];
      $scope.askMeMsg = "";
      $scope.askMeMore = false;
      return $scope.getPage = msg.getAskMe;
    },
    getAskMe: function(page) {
      var api;
      if (page == null) {
        page = 1;
      }
      if ($scope.isPageLoading) {
        return false;
      }
      api = "" + API.askme + $scope.privacyParamDir + "/type/askme/page/" + page;
      if (IsDebug) {
        api = API.askme;
      }
      $http.get(api).success(msg.getAskMeCb);
      return $scope.$emit("onPaginationStartChange", page);
    },
    getAskMeCb: function(data) {
      var list, _ref;
      if (String(data.msg) === "ok") {
        list = (_ref = data.result) != null ? _ref['list'] : void 0;
        $scope.askMe = list || [];
        msg.count = list.length;
        $scope.$emit("onPaginationGeted", data['result']['page']);
      } else {
        $scope.askMeMsg = data.msg;
      }
      return $scope.dataLoaded = true;
    },
    count: 0
  };
  msg.init();
  ans = {
    init: function() {
      $scope.send = ans.send;
      $scope.$watch($scope.askMe, function() {
        if ($scope.askMe.length === 0) {
          return $scope.askMeMsg = "空";
        }
      });
      return $scope.$on("ansCb", function(event, data) {
        return ans.sendCb(data);
      });
    },
    item: null,
    send: function(item, msg) {
      var query;
      item.isSending = true;
      ans.item = item;
      query = {
        askid: msg.askid,
        content: item.content
      };
      return $scope.$emit("ans", query);
    },
    sendCb: function(data) {
      var item, toastType;
      item = ans.item;
      item.content = "";
      item.isSending = false;
      toastType = "";
      if (String(data.ret) === "100000") {
        $timeout(((function(_this) {
          return function() {
            item.isSendSucs = true;
            item.answerd = true;
            item.isSendSucs = false;
            ans.count++;
            if (ans.count >= msg.count) {
              return $scope.askMe.length = 0;
            }
          };
        })(this)), 100);
      } else {
        toastType = "warn";
      }
      return $scope.toast(data.msg, toastType);
    },
    count: 0
  };
  ans.init();
  return false;
});