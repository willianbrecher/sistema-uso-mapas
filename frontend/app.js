var app = angular.module('mapApp', []);

const baseUrl = 'http://localhost:3000';

var map = L.map('map').setView([-25.5012, -54.5782], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);
L.control.scale().addTo(map);

app.controller('AppController', function ($scope, $http) {
    $http.get(baseUrl + '/coordenates').then(function successCallBack(response) {
        $scope.coordenates = response.data;
    });

    $scope.SubmitForm = function () {
        // const coordenates = new FormData();
        // coordenates.append("name", $scope.coordenate.name);
        $http.put(baseUrl + '/coordenates/'+$scope.coordenate._id, $scope.coordenate).then(function successCallBack(response) {
            console.log(response.data);
        });
    }

    $scope.loadCoordenate = function (id) {
        $http.get(baseUrl + '/coordenates/' + id).then(function successCallBack(response) {
            $scope.coordenate = response.data;
            console.log(response.data);
            renderPoint($scope.coordenate);
        });
    }
});

function renderPoint(coordenate) {
    L.marker([coordenate.latitude, coordenate.longitude])
    .bindPopup("<label>"+coordenate.name+"</label>" + 
                "<button class='btn' data-toggle='modal' data-toggle='modal' data-target='#formModal'><i class='fa fa-edit'></button>" + 
                "")
    .addTo(map)
    .openPopup();

    map.setView([coordenate.latitude, coordenate.longitude], 20);
}