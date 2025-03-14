/*

@license
dhtmlxScheduler v.5.3.14 Professional

This software is covered by DHTMLX Enterprise License. Usage without proper license is prohibited.

(c) XB Software Ltd.

*/
Scheduler.plugin(function(e){e._get_serializable_data=function(){var e={};for(var t in this._events){var a=this._events[t];-1==a.id.toString().indexOf("#")&&(e[a.id]=a)}return e},e.data_attributes=function(){var t=[],a=e._helpers.formatDate,n=this._get_serializable_data();for(var i in n){var r=n[i];for(var o in r)"_"!=o.substr(0,1)&&t.push([o,"start_date"==o||"end_date"==o?a:null]);break}return t},e.toXML=function(e){var t=[],a=this.data_attributes(),n=this._get_serializable_data()
;for(var i in n){var r=n[i];t.push("<event>");for(var o=0;o<a.length;o++)t.push("<"+a[o][0]+"><![CDATA["+(a[o][1]?a[o][1](r[a[o][0]]):r[a[o][0]])+"]]></"+a[o][0]+">");t.push("</event>")}return(e||"")+"<data>"+t.join("\n")+"</data>"},e._serialize_json_value=function(e){return null===e||"boolean"==typeof e?e=""+e:(e||0===e||(e=""),e='"'+e.toString().replace(/\n/g,"").replace(/\\/g,"\\\\").replace(/\"/g,'\\"')+'"'),e},e.toJSON=function(){
var e=[],t="",a=this.data_attributes(),n=this._get_serializable_data();for(var i in n){for(var r=n[i],o=[],d=0;d<a.length;d++)t=a[d][1]?a[d][1](r[a[d][0]]):r[a[d][0]],o.push(' "'+a[d][0]+'": '+this._serialize_json_value(t));e.push("{"+o.join(",")+"}")}return"["+e.join(",\n")+"]"},e.toICal=function(t){
var a="BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//dhtmlXScheduler//NONSGML v2.2//EN\nDESCRIPTION:",n="END:VCALENDAR",i=e.date.date_to_str("%Y%m%dT%H%i%s"),r=e.date.date_to_str("%Y%m%d"),o=[],d=this._get_serializable_data();for(var _ in d){var s=d[_];o.push("BEGIN:VEVENT"),s._timed&&(s.start_date.getHours()||s.start_date.getMinutes())?o.push("DTSTART:"+i(s.start_date)):o.push("DTSTART:"+r(s.start_date)),
s._timed&&(s.end_date.getHours()||s.end_date.getMinutes())?o.push("DTEND:"+i(s.end_date)):o.push("DTEND:"+r(s.end_date)),o.push("SUMMARY:"+s.text),o.push("END:VEVENT")}return a+(t||"")+"\n"+o.join("\n")+"\n"+n}});
//# sourceMappingURL=../sources/ext/dhtmlxscheduler_serialize.js.map