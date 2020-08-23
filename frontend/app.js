const app = angular.module('mapApp', ['ngFileUpload']);

const baseUrl = 'http://localhost:3000';

var map = L.map('map').setView([-25.5012, -54.5782], 15); // inicia em Foz do Iguaçu
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

var activedMark;

/**
 * 
 */
app.run(['$rootScope', '$http', function ($rootScope, $http) {
    $http.get(baseUrl + '/coordinates').then(response => {
        $rootScope.coordinates = response.data;
    }).catch(error => console.log(error));
}]);

/**
 * 
 */
app.controller('AppController', function ($scope, $http) {

    $scope.newForm = function () {
        $scope.coordinate = {
            name: "",
            cor: "",
            latitude: "",
            longitude: "",
            attributes: []
        }

        $('#formModal').modal('show');
    }

    $scope.editForm = function (id) {
        $scope.loadcoordinate(id);
        $('#formModal').modal('show');
    }

    $scope.refreshList = function () {
        $http.get(baseUrl + '/coordinates').then(response => {
            $scope.coordinates = response.data;
        }).catch(error => console.log(error));

        if (activedMark != null)
            map.setView([-25.5012, -54.5782], 15).removeLayer(activedMark);
    }

    $scope.createPoint = function () {
        $http.post(baseUrl + '/coordinates/', [$scope.coordinate]).then(response => {
            $('#formModal').modal('hide');
            $scope.refreshList();
        }).catch(error => alert("Ocorreu um erro ao tentar criar o ponto."));
    }

    $scope.updatePoint = function () {
        $http.put(baseUrl + '/coordinates/' + $scope.coordinate._id, $scope.coordinate).then(response => {
            $('#formModal').modal('hide');
            $scope.refreshList();
        }).catch(error => alert("Ocorreu um erro ao tentar atualizar o ponto."));
    }

    $scope.removePoint = function () {
        $http.delete(baseUrl + '/coordinates/' + $scope.coordinate._id).then(response => {
            $('#formModal').modal('hide');
            $scope.refreshList();
        }).catch(error => alert("Ocorreu um erro ao tentar remover o ponto."));
    }

    $scope.loadcoordinate = function (id) {
        return $http.get(baseUrl + '/coordinates/' + id).then(response => {
            $scope.coordinate = response.data;
        }).catch(error => console.log(error));
    }

    $scope.moveToPoint = function (id) {
        $scope.loadcoordinate(id).then(value => {
            renderPoint($scope.coordinate);
        });
    }

    $scope.selectFile = function (file) {
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

            var file = new Blob([JSON.stringify(mapPoints)], { type: 'text/plain' });

            var fileURL = URL.createObjectURL(file);
            var a = document.createElement('a');
            a.href = fileURL;
            a.target = '_blank';
            a.download = 'documento-mongodb.json';
            document.body.appendChild(a);
            a.click();

            $('#scriptModal').modal('hide');
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

                $http.post(baseUrl + '/coordinates', mapPoints, {}).then(function successCallBack(response) {
                    $('#importModal').modal('hide');
                    alert('Dados importados com sucesso.');
                    $scope.refreshList();
                }).catch(error => {
                    alert('Ocorreu um erro ao importar os dados.');
                });
            } else {
                alert('Arquivo possui mais de 100 linhas e é muito grande para importação via API. Utilize o script de importação.');
                $('#importModal').modal('hide');
            }
        }
    }
});

/**
 * 
 * @param {*} coordinate 
 */
function renderPoint(coordinate) {

    activedMark = L.marker([coordinate.latitude, coordinate.longitude])
        .bindPopup(
            '<div class="d-flex">' +
            '<label class="popup-map-label mr-auto p-2">' + coordinate.name + '</label>' +
            '<button class="btn p-2" data-toggle="modal" data-target="#formModal"><i class="fa fa-edit"></i></button>' +
            '</div>' +
            '<table>' +
            coordinate.attributes.map(item => {
                return '<tr>' +
                    '<td class="p-2">' + item.name + ':</td>' +
                    '<td class="p-2">' + item.value + '</td>' +
                    '</tr>'
            }).join('') +
            '</table>')
        .addTo(map)
        .openPopup();

    map.setView([coordinate.latitude, coordinate.longitude], 20);
}