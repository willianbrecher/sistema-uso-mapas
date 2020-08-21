var app = angular.module('mapApp', []);

const baseUrl = 'http://localhost:3000';

app.controller('SideMenuController', function($scope, $http) {
    $http.get(baseUrl+'/coordenates').then(function successCallBack(response) {
        console.log(response.data);
        $scope.coordenates = response.data;
    });
});

var map = L.map('map').setView([-25.5012, -54.5782], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);
L.control.scale().addTo(map);