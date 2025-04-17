var sforce = {
	interaction: {

		saveLog: function (object, saveParams, callback) {
			console.log("calling saveLog with Params:");
			console.log("- object: ", object);
			console.log("- saveParams: ", saveParams);

			var result = {
				result: false,
				error: "dummy method"
			};

			result = {
				result: "001x0000003DGQR",
				error: null
			};

			if (callback && typeof (callback) === "function") {
				setTimeout(function () {
					callback(result);
				}, 3000);
			}
		},

		screenPop: function (url, callback) {
			console.log("calling screenPop with Params:");
			console.log("- url: ", url);
			if (callback && typeof (callback) === "function") {
				setTimeout(function () {
					callback({
						result: false,
						error: "dummy method"
					});
				}, 2000);
			}
		},

		getPageInfo: function (callback) {
			console.log("calling getPageInfo with Params:");
			if (callback && typeof (callback) === "function") {

				var result;

				result = {
					result: false,
					error: "dummy method"
				};

				result = {
					result: JSON.stringify({
						"url": "http://na1.salesforce.com/001x0000003DGQR",
						"objectId": "001x0000003DGQR",
						"objectName": "Acme",
						"object": "Account"
					}),
					error: null
				};

				if (callback && typeof (callback) === "function") {
					setTimeout(function () {
						callback(result);
					}, 1000);
				}
			}
		},

		searchAndScreenPop: function (searchParams, queryParams, callType, callback) {
			console.log("calling searchAndScreenPop with Params:");
			console.log("- searchParams: ", searchParams);
			console.log("- queryParams: ", queryParams);
			console.log("- callType: ", callType);
			if (callback && typeof (callback) === "function") {
				var result;

				result = {
					result: false,
					error: "dummy method"
				};

				result = {
					result: JSON.stringify({ "006x0000001ZcyG": { "Name": "Acme - 600 Widgets", "object": "Opportunity" },
						"001x0000003DGQR": { "Name": "Acme", "Type": "1", "object": "Account" },
						"006x0000001ZcyH": { "Name": "Acme - 200 Widgets", "object": "Opportunity" },
						"006x0000001ZcyF": { "Name": "Acme - 1,200 Widgets", "object": "Opportunity" }
					}),
					error: null
				}
				if (callback && typeof (callback) === "function") {
					setTimeout(function () {
						callback(result);
					}, 1000);
				}
			}
		}
	}
}