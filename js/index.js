/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
//        document.getElementById('scan').addEventListener('click', this.scan, false);

		FastClick.attach(document.body);

    }
};

$( document ).ready(function() {
	$('#vinlookup').click(function() {
		getVIN();
	});

	$.ajaxSetup({
		timeout: 2*1000
	});
});

function getVIN(){
	var txt = $("#vinTxtBox").val();
	var url = "http://vpcsvc.azurewebsites.net/BOMInstallSvc.svc/work/1/" + txt + "?callback=?";

	if (txt == "")
		alert("Please enter or scan a VIN");
	else
	{
		setTimeout(function(){
			$.mobile.loading("show",{
				text: "Loading...",
				textVisible: true
			});
		}, 1);

		//call service to get data for vin

		$.jsonp({
			url: url,
			dataType: "jsonp",
			timeout: 3000,
			success: function (data, status) {

					$("#vehicleModel").html(data.Series);

					setTimeout(function(){
						$.mobile.loading("hide");
					}, 1);

			},
			error: function (XHR, textStatus, errorThrown) {
				alert("Error getting parts data");

				setTimeout(function(){
					$.mobile.loading("hide");
				}, 1);
			}
		});
	}
}

function jsontolist(data, cat){
	var gotone = false;
	var list = "<div data-role=\"collapsible\">";
	list += "<h4>"+cat+"</h4>";
	$.each( data.ParentPart, function( index, value ){
		if(value.Category == cat)
		{
			gotone = true;
			list += "<div data-role=\"collapsible\">";
			list += "<h4>" + $.trim(value.PartNumber) + " - " + $.trim(value.PartName) + "</h4>";
			//list += "<p>" + $.trim(value.PartNumber) + " - " + $.trim(value.PartName) + "</p>";
			if(value.ChildPart != null)
			{
				$.each( value.ChildPart, function( index2, value2 ){
					//list += "<div data-role=\"collapsible\">";
					//list += "<h4>" + $.trim(value2.PartNumber) + " - " + $.trim(value2.PartName) + "</h4>";
					list += "<p>" + $.trim(value2.PartNumber) + " - " + $.trim(value2.PartName) + "</p>";
				});
			}
			list += "</div>";
		}
	});
	list += "</div>";
	if(!gotone)
		list = "";
	return list;
}
