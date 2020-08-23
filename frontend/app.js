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

    $scope.newForm = function () {
        $scope.coordenate = {
            name: "",
            cor: "",
            latitude: "",
            longitude: "",
            attributes: []
        }

        $('#formModal').modal('show');
    }

    $scope.editForm = function (id) {
        $scope.loadCoordenate(id);
        $('#formModal').modal('show');
    }

    $scope.refreshList = function () {
        $http.get(baseUrl + '/coordenates').then(response => {
            $scope.coordenates = response.data;
        }).catch(error => console.log(error));

        if (activeMark != null)
            map.setView([-25.5012, -54.5782], 15).removeLayer(activeMark);
    }

    $scope.createPoint = function () {
        $http.post(baseUrl + '/coordenates/', [$scope.coordenate]).then(response => {
            $('#formModal').modal('hide');
            $scope.refreshList();
        }).catch(error => console.log(error));
    }

    $scope.updatePoint = function () {
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
        }).catch(error => console.log(error));
    }

    $scope.moveToPoint = function (id) {
        $scope.loadCoordenate(id);
        renderPoint($scope.coordenate);
    }
});

app.controller('UploadFileController', function ($scope, $http) {
    $scope.SelectFile = function (file) {
        $scope.SelectedFile = file;
    };

    $scope.submitScriptForm = function () {
        const reader = new FileReader();
        reader.readAsText($scope.SelectedFile, "UTF-8");

        reader.onload = function (evt) {
            const points = evt.target.result.replace(/"/g, "").split('\n').slice(1);
            var mapPoints = points.map(item => {
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

            var file = new Blob([JSON.stringify(mapPoints)], {type: 'text/plain'});

            var fileURL = URL.createObjectURL(file);
            var a         = document.createElement('a');
            a.href        = fileURL; 
            a.target      = '_blank';
            a.download    = 'documento-mongodb.json';
            document.body.appendChild(a);
            a.click();
        }
    }

    $scope.submitImportForm = function () {
        const reader = new FileReader();
        reader.readAsText($scope.SelectedFile, "UTF-8");

        reader.onload = function (evt) {
            const points = evt.target.result.replace(/"/g, "").split('\n').slice(1);
            if (points.length <= 100) {
                var mapPoints = points.map(item => {
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
            } else {
                alert('Arquivo possui mais de 100 linhas e é muito grande para importação via API. Utilize o script de importação.');
                $('#importModal').modal('hide');
            }
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