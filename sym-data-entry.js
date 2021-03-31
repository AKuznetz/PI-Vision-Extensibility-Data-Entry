(function (PV) {
	//console.log("Элемент загружен на панель элементов"); 
	function symbolVis() {}
	PV.deriveVisualizationFromBase(symbolVis);	
	
	symbolVis.prototype.init = function(scope, elemm, $http){
		//console.log("Функция инициализации");	
		//Определили функцию, вызываемую при обновлении
		this.onDataUpdate = dataUpdate;
		//обновление данных
		function dataUpdate(data) {
			if(data) {
				if(data.Path) {
					scope.Path = data.Path; //получение полного пути привязаного элемента
					$http.get('/piwebapi' + '/attributes?path=' + scope.Path.slice(3)).then(function (response) {   //Получение WebID по пути
						//console.log(response.data.WebId);	//отладка						
						scope.webId = response.data.WebId; //Теперь в scope будет webId источника данных
					});
				}
			}
			//console.log(scope); //отладка
		}
		//Функция, вызываемая при нажатии кнопки
		scope.sendValue = function () { 	
			var data = JSON.stringify({
				Timestamp: '*',
				Value: scope.runtimeData.input
				});
				//console.log(data) //отладка
			$http.post('/piwebapi' + '/streams/' + scope.webId + '/value', data)		//Запрос на запись в WebAPI
		}
	};
	var definition = {
		typeName: 'data-entry',
		inject: ['$http'],
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
		visObjectType: symbolVis,
			getDefaultConfig: function() {
			return {
				DataShape: 'Value',
				Height: 150,
				Width: 350,
				BackgroundColor: 'rgb(255,0,0)',
				TextColor: 'rgb(0,255,0)',
				ShowLabel: true,
				ShowTime: false
				};
		}
	};
	PV.symbolCatalog.register(definition);
})(window.PIVisualization);