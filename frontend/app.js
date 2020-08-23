const app = angular.module('mapApp', ['ngFileUpload']);

const baseUrl = 'http://localhost:3000';

var map = L.map('map').setView([-25.5012, -54.5782], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);
L.control.scale().addTo(map);

var activeMark;

app.run(['$rootScope', '$http', function ($rootScope, $http) {
    $http.get(baseUrl + '/coordenates').then(response => {
        $rootScope.coordenates = response.data;
    }).catch(error => console.log(error));
}]);

app.controller('AppController', function ($scope, $http) {
    $scope.refreshList = function () {
        $http.get(baseUrl + '/coordenates').then(response => {
            $scope.coordenates = response.data;
        }).catch(error => console.log(error));

        map.setView([-25.5012, -54.5782], 15).removeLayer(activeMark);
    }

    $scope.submitPoint = function () {
        $http.put(baseUrl + '/coordenates/' + $scope.coordenate._id, $scope.coordenate).then(response => {
            $('#formModal').modal('hide');
            $scope.refreshList();
        }).catch(error => console.log(error));
    }

    $scope.removePoint = function () {
        $http.delete(baseUrl + '/coordenates/' + $scope.coordenate._id).then(response => {
            $('#formModal').modal('hide');
            $scope.refreshList();
        }).catch(error => console.log(error));
    }

    $scope.loadCoordenate = function (id) {
        $http.get(baseUrl + '/coordenates/' + id).then(response => {
            $scope.coordenate = response.data;
            renderPoint($scope.coordenate);
        }).catch(error => console.log(error));
    }
});

app.controller('UploadFileController', function ($scope, $http) {
    $scope.SelectFile = function (file) {
        $scope.SelectedFile = file;
    };

    $scope.submitImportForm = function () {
        const reader = new FileReader();
        reader.readAsText($scope.SelectedFile, "UTF-8");

        reader.onload = function (evt) {
            const points = evt.target.result.replace(/"/g, "").split('\n');
            var mapPoints = points.slice(1).map(item => {
                const row = item.split(",");
                const point = {};

                point.name = row[0];
                point.longitude = row[1];
                point.latitude = row[2];
                point.color = row[4];
                point.attributes = [];
                row[3].split(";").map(attributeItem => {
                    const attributeRow = attributeItem.split(":");
                    point.attributes.push({
                        name: attributeRow[0],
                        value: attributeRow[1]
                    });
                });

                return point;
            });

            $http.post(baseUrl + '/coordenates', mapPoints, {}).then(function successCallBack(response) {
                $('#importModal').modal('hide');
                $scope.refreshList();
            });
        }
    }
});

function renderPoint(coordenate) {
    activeMark = L.marker([coordenate.latitude, coordenate.longitude])
        .bindPopup("<label>" + coordenate.name + "</label>" +
            "<button class=\"btn\" data-toggle='modal' data-toggle='modal' data-target='#formModal'><i class='fa fa-edit'></i></button>" + 
            coordenate.attributes.map(item => {
                return "<label>" +
                    item.name + " - " + item.value +
                    "</label></br>";
            }))
        .addTo(map)
        .openPopup();

    map.setView([coordenate.latitude, coordenate.longitude], 20);
}