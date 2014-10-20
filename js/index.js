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
	var vin = $("#lookupVIN").val();
	var url = "http://vpcsvc.azurewebsites.net/BOMInstallSvc.svc/work/1/" + vin + "?callback=?";

	if (vin == "")
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

					$("body").pagecontainer("change", "#process", {});
					$("#processVIN").html(vin);
					$("#processModel").html(data.Series);

					var AccessoryCode = jsontolist(data,"accessories");
					$("#processAccessory").html(AccessoryCode);
					//$("#processStartTime").html(processStart);
					setTimeout(function(){
						$.mobile.loading("hide");
					}, 1);

			},
			error: function (XHR, textStatus, errorThrown) {
				alert("VIN not found");

				setTimeout(function(){
					$.mobile.loading("hide");
				}, 1);
			}
		});
	}
}

function fnCompleteInstall(Code)
{
	var UnInstallTime = new Date();
	var UnInstalllbl = "#" + Code;
	var Installlbl = "#Ct" + Code;

	var InstallTime = Date.parse($(Installlbl).html());
	var TimeForIntsall = ((UnInstallTime - InstallTime)/60000).toFixed(1);
	$(UnInstalllbl).html(TimeForIntsall);
}

function fnCancelInstall(Code)
{
	var UnInstallTime = new Date();
	var UnInstalllbl = "#" + Code;
	var Installlbl = "#Ct" + Code;

	var TimeForIntsall = "0 (Installation was cancelled)";
	$(UnInstalllbl).html(TimeForIntsall);
}

function fnStartInstall(Code)
{
	var InstallTime = new Date();
	var Installlbl = "#Ct" + Code;
	$(Installlbl).html(InstallTime);
}

function jsontolist(data, cat){
	var gotone = false;
	var list = "<div data-role='collapsible' data-collapsed='false'>";
	list += "<h4>"+"Accessory Details"+"</h4>";
	$.each( data.accessories, function( index, value ){
		if(value.AccessoryCode != "")
		{
			gotone = true;
			list += "<div data-role='collapsible' data-collapsed='false'>";
			list += "<h4>" + "Accessory" + " - " + $.trim(value.AccessoryCode) + " - " + $.trim(value.Description) + "</h4>";
			list += "<p><label style=\"font-weight:bold;display:inline;\">" + "Installation Expected:" + "&nbsp;&nbsp;"+ " </label> " ;
			if($.trim(value.ExpectedInstalled) == "true" )
			{
				list += "True";
			}
			else
			{
				list += "False";
			}
			list += "<label style=\"font-weight:bold;display:inline;\">" + "Expected Installation Time(mins):   " + " </label>  "+ "&nbsp;&nbsp;" + $.trim(value.InstallMinutes) + "</p>";
			list += "<div>" ;
			list += "<label id=\""+ $.trim(value.AccessoryCode)+ $.trim(value.AccessoryID)+"\" style=\"display:inline;\"> </label></div>";
			list += "<label id=\"Ct"+ $.trim(value.AccessoryCode)+ $.trim(value.AccessoryID)+"\" style=\"display:none\"> </label></div>";
			list += "<button type='submit' id='btnStart' onclick='fnStartInstall(\"" + $.trim(value.AccessoryCode)+ $.trim(value.AccessoryID)+"\")'>Start Installation</button>" + "&nbsp;&nbsp;&nbsp;&nbsp;";
			list += "<button type='submit' id='btnComplete' onclick='fnCompleteInstall(\"" + $.trim(value.AccessoryCode)+ $.trim(value.AccessoryID)+"\")'>Installation Complete</button>"+ "&nbsp;&nbsp;&nbsp;&nbsp;";
			list += "<button type='cancel' id='btnUnInstall' onclick='fnCancelInstall(\"" + $.trim(value.AccessoryCode)+ $.trim(value.AccessoryID)+"\")'>UnInstall</button>";
			list += "</div>";
		}
	});
	list += "</div>";

	if(!gotone)
		list = "";

	return list;
}
