/*

@license
dhtmlxScheduler v.5.3.14 Professional

This software is covered by DHTMLX Enterprise License. Usage without proper license is prohibited.

(c) XB Software Ltd.

*/
Scheduler.plugin(function(e){e.attachEvent("onTemplatesReady",function(){function t(e,t,a,n){for(var i=t.getElementsByTagName(e),r=a.getElementsByTagName(e),o=r.length-1;o>=0;o--){var a=r[o];if(n){var d=document.createElement("span");d.className="dhx_text_disabled",d.innerHTML=n(i[o]),a.parentNode.insertBefore(d,a),a.parentNode.removeChild(a)}else a.disabled=!0,t.checked&&(a.checked=!0)}}var a;e.form_blocks.recurring&&(a=e.form_blocks.recurring.set_value)
;var n=e.config.buttons_left.slice(),i=e.config.buttons_right.slice();e.attachEvent("onBeforeLightbox",function(t){this.config.readonly_form||this.getEvent(t).readonly?this.config.readonly_active=!0:(this.config.readonly_active=!1,e.config.buttons_left=n.slice(),e.config.buttons_right=i.slice(),e.form_blocks.recurring&&(e.form_blocks.recurring.set_value=a));var r=this.config.lightbox.sections;if(this.config.readonly_active){
for(var o=0;o<r.length;o++)"recurring"==r[o].type&&this.config.readonly_active&&e.form_blocks.recurring&&(e.form_blocks.recurring.set_value=function(t,a,n){var i=e.$domHelpers.closest(t,".dhx_wrap_section"),r="none";i.querySelector(".dhx_cal_lsection").display=r,i.querySelector(".dhx_form_repeat").display=r,i.style.display=r,e.setLightboxSize()});for(var d=["dhx_delete_btn","dhx_save_btn"],s=[e.config.buttons_left,e.config.buttons_right],o=0;o<d.length;o++)for(var _=d[o],l=0;l<s.length;l++){
for(var c=s[l],h=-1,u=0;u<c.length;u++)if(c[u]==_){h=u;break}-1!=h&&c.splice(h,1)}}return this.resetLightbox(),!0});var r=e._fill_lightbox;e._fill_lightbox=function(){var a=this.getLightbox();this.config.readonly_active&&(a.style.visibility="hidden",a.style.display="block");var n=r.apply(this,arguments);if(this.config.readonly_active&&(a.style.visibility="",a.style.display="none"),this.config.readonly_active){var i=this.getLightbox(),d=this._lightbox_r=i.cloneNode(!0);d.id=e.uid(),
d.className+=" dhx_cal_light_readonly",t("textarea",i,d,function(e){return e.value}),t("input",i,d,!1),t("select",i,d,function(e){return e.options.length?e.options[Math.max(e.selectedIndex||0,0)].text:""}),i.parentNode.insertBefore(d,i),o.call(this,d),e._lightbox&&e._lightbox.parentNode.removeChild(e._lightbox),this._lightbox=d,e.config.drag_lightbox&&(d.firstChild.onmousedown=e._ready_to_dnd),this.setLightboxSize(),d.onclick=function(t){
var a=t?t.target:event.srcElement,n=e.$domHelpers.closest(a,".dhx_btn_set");n&&n.querySelector(".dhx_cancel_btn")&&e.cancel_lightbox()},d.onkeydown=function(t){var a=t||window.event,n=t.target||t.srcElement,i=n.querySelector("[dhx_button]");switch(i||(i=n.parentNode.querySelector(".dhx_custom_button, .dhx_readonly")),(t||a).keyCode){case 32:if((t||a).shiftKey)return;i&&i.click&&i.click();break;case e.keys.edit_cancel:e.cancel_lightbox()}}}return n};var o=e.showCover;e.showCover=function(){
this.config.readonly_active||o.apply(this,arguments)};var d=e.hide_lightbox;e.hide_lightbox=function(){return this._lightbox_r&&(this._lightbox_r.parentNode.removeChild(this._lightbox_r),this._lightbox_r=this._lightbox=null),d.apply(this,arguments)}})});
//# sourceMappingURL=../sources/ext/dhtmlxscheduler_readonly.js.map