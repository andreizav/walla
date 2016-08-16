// Code goes here

var app = angular.module("wallaApp", ['ngSanitize'])

.component("main", {
    templateUrl: "main.html",
    controller: function (mainData,$scope) {
        this.items = [];
        this.currentItems = [];
        this.selectedItem = {};
        this.textToSearch = "";

        var self = this;

        if (localStorage.getItem("feedItems") === null) {
            localStorage.setItem("feedItems", JSON.stringify(this.currentItems));
        } else {
            this.currentItems = JSON.parse(localStorage.getItem("feedItems"));
            this.selectedItem = this.currentItems[0]
        }

        window.addEventListener('popstate', function (e) {
            self.changeState(e.state);
            $scope.$digest();
        }, false);

        this.changeState = function(item) {
            this.selectedItem = item;
        }

        mainData.getData().then(function (result) {
            self.items = result;
            console.log(self.items);
        })

        this.addItem = function (item) {
            this.currentItems.unshift(item);
            this.selectedItem = item;
            localStorage.setItem("feedItems", JSON.stringify(this.currentItems));
            window.history.pushState(item,"");
        }

        this.removeItem = function (item) {
            //console.log(item);
            this.currentItems.splice(this.currentItems.indexOf(item), 1);
            if (item === this.selectedItem) {
                this.selectedItem = this.currentItems[0] || "";
            }
            localStorage.setItem("feedItems", JSON.stringify(this.currentItems));
            
        }

        this.searchItem = function () {
            for (item in this.items) {
                if (this.items[item].feedUrl === this.textToSearch && !this.checkIfExist(this.items[item])) {
                    this.addItem(this.items[item]);
                }
            }
        }

        this.checkIfExist = function (item) {
            var status = false;
            for (i in this.currentItems) {
                if (this.currentItems[i] === item) {
                    status =  true;
                }
            }

            return status;
        }

        this.selectItem = function (item) {
            this.selectedItem = item;
            //console.log(item);
        }
    }
})

.component("feed", {
    bindings: {
        feed: "<"
    },
    templateUrl: "feed.html",
    controller: function () {
        console.log(this.feed);
    }
})

.service("mainData", function ($http) {
    this.getData = function () {
        return $http({
            method: "GET",
            url: "feeds.json"
        }).then(function (response) {
            return response.data;
        })
    }
})