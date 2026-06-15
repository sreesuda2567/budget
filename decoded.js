import { InjectionToken, Injectable, Optional, Inject, Component, NgZone, ChangeDetectorRef, Input, ViewChildren, ViewChild, HostListener, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { __awaiter } from 'tslib';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, ToastController, AlertController, IonicModule } from '@ionic/angular';
import { timeout, retry } from 'rxjs/operators';
import { PDFDocument, degrees, rgb } from 'pdf-lib';
import * as fontkitModule from '@pdf-lib/fontkit';
import * as pdfjsLib from 'pdfjs-dist';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import * as ɵngcc0 from '@angular/core';
import * as ɵngcc1 from '@angular/common/http';
import * as ɵngcc2 from '@ionic/angular';
import * as ɵngcc3 from '@angular/platform-browser';
import * as ɵngcc4 from '@angular/common';
import * as ɵngcc5 from '@angular/forms';

const _c0 = ["fileInput"];
const _c1 = ["viewerContainer"];
const _c2 = ["signatureCanvas"];
const _c3 = ["signatureFileInput"];
const _c4 = ["thumbFileInput"];
const _c5 = ["pdfCanvas"];
const _c6 = ["annotCanvas"];
function PdfAnnotatorModalComponent_div_6_ng_container_2_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementContainerStart(0);
    ɵngcc0.ɵɵelement(1, "ion-spinner", 122);
    ɵngcc0.ɵɵelementStart(2, "p", 123);
    ɵngcc0.ɵɵtext(3);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r24 = ɵngcc0.ɵɵnextContext(2);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵtextInterpolate(ctx_r24.loadingMessage);
} }
function PdfAnnotatorModalComponent_div_6_ng_container_3_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementContainerStart(0);
    ɵngcc0.ɵɵelementStart(1, "div", 124);
    ɵngcc0.ɵɵelement(2, "ion-icon", 125);
    ɵngcc0.ɵɵelementStart(3, "span", 126);
    ɵngcc0.ɵɵtext(4);
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(5, "div", 127);
    ɵngcc0.ɵɵelement(6, "div", 128);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(7, "div", 129)(8, "span");
    ɵngcc0.ɵɵelement(9, "ion-icon", 130);
    ɵngcc0.ɵɵtext(10, " บันทึก Annotations ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(11, "span");
    ɵngcc0.ɵɵelement(12, "ion-icon", 131);
    ɵngcc0.ɵɵtext(13, " Serialize PDF ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(14, "span");
    ɵngcc0.ɵɵelement(15, "ion-icon", 132);
    ɵngcc0.ɵɵtext(16, " สร้าง Preview ");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(17, "p", 123);
    ɵngcc0.ɵɵtext(18);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r25 = ɵngcc0.ɵɵnextContext(2);
    ɵngcc0.ɵɵadvance(4);
    ɵngcc0.ɵɵtextInterpolate1("", ctx_r25.saveProgress, "%");
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵstyleProp("width", ctx_r25.saveProgress, "%");
    ɵngcc0.ɵɵclassProp("save-progress-bar-fill--preview", ctx_r25.saveProgress > 61)("save-progress-bar-fill--serializing", ctx_r25.saveProgress === 61);
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵclassProp("active", ctx_r25.saveProgress > 0 && ctx_r25.saveProgress < 61);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵclassProp("active", ctx_r25.saveProgress === 61);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵclassProp("active", ctx_r25.saveProgress > 61);
    ɵngcc0.ɵɵadvance(4);
    ɵngcc0.ɵɵtextInterpolate(ctx_r25.loadingMessage);
} }
function PdfAnnotatorModalComponent_div_6_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "div", 119)(1, "div", 120);
    ɵngcc0.ɵɵtemplate(2, PdfAnnotatorModalComponent_div_6_ng_container_2_Template, 4, 1, "ng-container", 121);
    ɵngcc0.ɵɵtemplate(3, PdfAnnotatorModalComponent_div_6_ng_container_3_Template, 19, 14, "ng-container", 121);
    ɵngcc0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("loading-content--progress", ctx_r0.saveProgress > 0);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ctx_r0.saveProgress === 0);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ctx_r0.saveProgress > 0);
} }
function PdfAnnotatorModalComponent_span_31_ion_spinner_1_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelement(0, "ion-spinner", 135);
} }
function PdfAnnotatorModalComponent_span_31_span_2_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "span");
    ɵngcc0.ɵɵtext(1);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r27 = ɵngcc0.ɵɵnextContext(2);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate1("(", ctx_r27.loadedUntilPage, "↓)");
} }
function PdfAnnotatorModalComponent_span_31_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "span", 133);
    ɵngcc0.ɵɵtemplate(1, PdfAnnotatorModalComponent_span_31_ion_spinner_1_Template, 1, 0, "ion-spinner", 134);
    ɵngcc0.ɵɵtemplate(2, PdfAnnotatorModalComponent_span_31_span_2_Template, 2, 1, "span", 121);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("title", "โหลดแล้ว " + ctx_r1.loadedUntilPage + " / " + ctx_r1.pageCount + " หน้า");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ctx_r1.isLoadingChunk);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", !ctx_r1.isLoadingChunk);
} }
function PdfAnnotatorModalComponent_div_41_small_45_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "small");
    ɵngcc0.ɵɵtext(1, "(ไม่มีประวัติ)");
    ɵngcc0.ɵɵelementEnd();
} }
function PdfAnnotatorModalComponent_div_41_Template(rf, ctx) { if (rf & 1) {
    const _r30 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 136)(1, "div", 137);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_41_Template_div_click_1_listener() { ɵngcc0.ɵɵrestoreView(_r30); const ctx_r29 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r29.showInsertMenu = false); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(2, "div", 138)(3, "div", 139);
    ɵngcc0.ɵɵelement(4, "ion-icon", 140);
    ɵngcc0.ɵɵtext(5, " แทรกหน้าเปล่า ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(6, "div", 141)(7, "span", 142);
    ɵngcc0.ɵɵtext(8, "รูปแบบ:");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(9, "div", 143)(10, "button", 144);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_41_Template_button_click_10_listener() { ɵngcc0.ɵɵrestoreView(_r30); const ctx_r31 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r31.insertOrientation = "portrait"); });
    ɵngcc0.ɵɵelement(11, "ion-icon", 145);
    ɵngcc0.ɵɵelementStart(12, "span");
    ɵngcc0.ɵɵtext(13, "แนวตั้ง");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(14, "button", 146);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_41_Template_button_click_14_listener() { ɵngcc0.ɵɵrestoreView(_r30); const ctx_r32 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r32.insertOrientation = "landscape"); });
    ɵngcc0.ɵɵelement(15, "ion-icon", 147);
    ɵngcc0.ɵɵelementStart(16, "span");
    ɵngcc0.ɵɵtext(17, "แนวนอน");
    ɵngcc0.ɵɵelementEnd()()()();
    ɵngcc0.ɵɵelementStart(18, "button", 148);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_41_Template_button_click_18_listener() { ɵngcc0.ɵɵrestoreView(_r30); const ctx_r33 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r33.insertBlankPage("before")); });
    ɵngcc0.ɵɵelement(19, "ion-icon", 149);
    ɵngcc0.ɵɵelementStart(20, "span");
    ɵngcc0.ɵɵtext(21, "ก่อนหน้านี้ ");
    ɵngcc0.ɵɵelementStart(22, "small");
    ɵngcc0.ɵɵtext(23);
    ɵngcc0.ɵɵelementEnd()()();
    ɵngcc0.ɵɵelementStart(24, "button", 148);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_41_Template_button_click_24_listener() { ɵngcc0.ɵɵrestoreView(_r30); const ctx_r34 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r34.insertBlankPage("after")); });
    ɵngcc0.ɵɵelement(25, "ion-icon", 150);
    ɵngcc0.ɵɵelementStart(26, "span");
    ɵngcc0.ɵɵtext(27, "หลังหน้านี้ ");
    ɵngcc0.ɵɵelementStart(28, "small");
    ɵngcc0.ɵɵtext(29);
    ɵngcc0.ɵɵelementEnd()()();
    ɵngcc0.ɵɵelement(30, "div", 151);
    ɵngcc0.ɵɵelementStart(31, "div", 152);
    ɵngcc0.ɵɵelement(32, "ion-icon", 153);
    ɵngcc0.ɵɵtext(33, " ลบหน้า ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(34, "button", 154);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_41_Template_button_click_34_listener() { ɵngcc0.ɵɵrestoreView(_r30); const ctx_r35 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r35.deletePage()); });
    ɵngcc0.ɵɵelement(35, "ion-icon", 155);
    ɵngcc0.ɵɵelementStart(36, "span");
    ɵngcc0.ɵɵtext(37, "ลบหน้านี้ ");
    ɵngcc0.ɵɵelementStart(38, "small");
    ɵngcc0.ɵɵtext(39);
    ɵngcc0.ɵɵelementEnd()()();
    ɵngcc0.ɵɵelement(40, "div", 151);
    ɵngcc0.ɵɵelementStart(41, "button", 156);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_41_Template_button_click_41_listener() { ɵngcc0.ɵɵrestoreView(_r30); const ctx_r36 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r36.undoPageOp()); });
    ɵngcc0.ɵɵelement(42, "ion-icon", 157);
    ɵngcc0.ɵɵelementStart(43, "span");
    ɵngcc0.ɵɵtext(44, "ย้อนกลับการแทรก/ลบ ");
    ɵngcc0.ɵɵtemplate(45, PdfAnnotatorModalComponent_div_41_small_45_Template, 2, 0, "small", 121);
    ɵngcc0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵadvance(10);
    ɵngcc0.ɵɵclassProp("active", ctx_r2.insertOrientation === "portrait");
    ɵngcc0.ɵɵadvance(4);
    ɵngcc0.ɵɵclassProp("active", ctx_r2.insertOrientation === "landscape");
    ɵngcc0.ɵɵadvance(9);
    ɵngcc0.ɵɵtextInterpolate1("(หน้า ", ctx_r2.pageNo, ")");
    ɵngcc0.ɵɵadvance(6);
    ɵngcc0.ɵɵtextInterpolate1("(หน้า ", ctx_r2.pageNo + 1, ")");
    ɵngcc0.ɵɵadvance(5);
    ɵngcc0.ɵɵproperty("disabled", ctx_r2.pageCount <= 1);
    ɵngcc0.ɵɵadvance(5);
    ɵngcc0.ɵɵtextInterpolate1("(หน้า ", ctx_r2.pageNo, ")");
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵproperty("disabled", !ctx_r2.canUndoPageOp);
    ɵngcc0.ɵɵadvance(4);
    ɵngcc0.ɵɵproperty("ngIf", !ctx_r2.canUndoPageOp);
} }
function PdfAnnotatorModalComponent_div_58_Template(rf, ctx) { if (rf & 1) {
    const _r38 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 158)(1, "button", 159);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_58_Template_button_click_1_listener() { ɵngcc0.ɵɵrestoreView(_r38); const ctx_r37 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r37.changeTextFontSize(-2)); });
    ɵngcc0.ɵɵelement(2, "ion-icon", 160);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(3, "span");
    ɵngcc0.ɵɵtext(4);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(5, "button", 159);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_58_Template_button_click_5_listener() { ɵngcc0.ɵɵrestoreView(_r38); const ctx_r39 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r39.changeTextFontSize(2)); });
    ɵngcc0.ɵɵelement(6, "ion-icon", 161);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(7, "div", 162)(8, "div", 163);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_58_Template_div_click_8_listener() { ɵngcc0.ɵɵrestoreView(_r38); const ctx_r40 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r40.setTextColor("#000000")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(9, "div", 164);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_58_Template_div_click_9_listener() { ɵngcc0.ɵɵrestoreView(_r38); const ctx_r41 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r41.setTextColor("#0000FF")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(10, "div", 165);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_58_Template_div_click_10_listener() { ɵngcc0.ɵɵrestoreView(_r38); const ctx_r42 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r42.setTextColor("#FF0000")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(11, "div", 166);
    ɵngcc0.ɵɵelement(12, "ion-icon", 167);
    ɵngcc0.ɵɵelementStart(13, "input", 168);
    ɵngcc0.ɵɵlistener("input", function PdfAnnotatorModalComponent_div_58_Template_input_input_13_listener($event) { ɵngcc0.ɵɵrestoreView(_r38); const ctx_r43 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r43.setTextColor($event.target.value)); });
    ɵngcc0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r3 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("disabled", ctx_r3.textFontSize <= 8);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵtextInterpolate(ctx_r3.textFontSize);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("disabled", ctx_r3.textFontSize >= 100);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵclassProp("active", ctx_r3.textColor === "#000000");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("active", ctx_r3.textColor === "#0000FF");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("active", ctx_r3.textColor === "#FF0000");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵstyleProp("background", ctx_r3.textColor);
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵproperty("value", ctx_r3.textColor);
} }
function PdfAnnotatorModalComponent_div_74_Template(rf, ctx) { if (rf & 1) {
    const _r45 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 169)(1, "div", 170);
    ɵngcc0.ɵɵtext(2, "เพิ่มเครื่องหมายด่วน");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(3, "div", 171)(4, "button", 172);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_74_Template_button_click_4_listener() { ɵngcc0.ɵɵrestoreView(_r45); const ctx_r44 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r44.enableMarkMode("check")); });
    ɵngcc0.ɵɵnamespaceSVG();
    ɵngcc0.ɵɵelementStart(5, "svg", 173);
    ɵngcc0.ɵɵelement(6, "polyline", 174);
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵnamespaceHTML();
    ɵngcc0.ɵɵelementStart(7, "button", 175);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_74_Template_button_click_7_listener() { ɵngcc0.ɵɵrestoreView(_r45); const ctx_r46 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r46.enableMarkMode("cross")); });
    ɵngcc0.ɵɵnamespaceSVG();
    ɵngcc0.ɵɵelementStart(8, "svg", 173);
    ɵngcc0.ɵɵelement(9, "line", 176)(10, "line", 177);
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵnamespaceHTML();
    ɵngcc0.ɵɵelementStart(11, "button", 178);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_74_Template_button_click_11_listener() { ɵngcc0.ɵɵrestoreView(_r45); const ctx_r47 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r47.enableMarkMode("dot")); });
    ɵngcc0.ɵɵnamespaceSVG();
    ɵngcc0.ɵɵelementStart(12, "svg", 173);
    ɵngcc0.ɵɵelement(13, "circle", 179);
    ɵngcc0.ɵɵelementEnd()()();
    ɵngcc0.ɵɵnamespaceHTML();
    ɵngcc0.ɵɵelement(14, "div", 180);
    ɵngcc0.ɵɵelementStart(15, "div", 170);
    ɵngcc0.ɵɵtext(16, "เพิ่มฟิลด์แบบฟอร์มใหม่");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(17, "div", 181)(18, "button", 182);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_74_Template_button_click_18_listener() { ɵngcc0.ɵɵrestoreView(_r45); const ctx_r48 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r48.enableFormFieldMode("text")); });
    ɵngcc0.ɵɵelementStart(19, "span", 183);
    ɵngcc0.ɵɵtext(20, "Aa");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(21, "span");
    ɵngcc0.ɵɵtext(22, "Text Field");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(23, "button", 184);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_74_Template_button_click_23_listener() { ɵngcc0.ɵɵrestoreView(_r45); const ctx_r49 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r49.enableFormFieldMode("checkbox")); });
    ɵngcc0.ɵɵelementStart(24, "span", 185);
    ɵngcc0.ɵɵnamespaceSVG();
    ɵngcc0.ɵɵelementStart(25, "svg", 186);
    ɵngcc0.ɵɵelement(26, "rect", 187)(27, "polyline", 188);
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵnamespaceHTML();
    ɵngcc0.ɵɵelementStart(28, "span");
    ɵngcc0.ɵɵtext(29, "Checkbox");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(30, "button", 189);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_74_Template_button_click_30_listener() { ɵngcc0.ɵɵrestoreView(_r45); const ctx_r50 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r50.enableFormFieldMode("radio")); });
    ɵngcc0.ɵɵelementStart(31, "span", 185);
    ɵngcc0.ɵɵnamespaceSVG();
    ɵngcc0.ɵɵelementStart(32, "svg", 186);
    ɵngcc0.ɵɵelement(33, "circle", 190)(34, "circle", 191);
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵnamespaceHTML();
    ɵngcc0.ɵɵelementStart(35, "span");
    ɵngcc0.ɵɵtext(36, "Radio Button");
    ɵngcc0.ɵɵelementEnd()()();
    ɵngcc0.ɵɵelement(37, "div", 180);
    ɵngcc0.ɵɵelementStart(38, "div", 192)(39, "button", 159);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_74_Template_button_click_39_listener() { ɵngcc0.ɵɵrestoreView(_r45); const ctx_r51 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r51.changeMarkSize(-4)); });
    ɵngcc0.ɵɵelement(40, "ion-icon", 160);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(41, "span", 193);
    ɵngcc0.ɵɵtext(42);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(43, "button", 159);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_74_Template_button_click_43_listener() { ɵngcc0.ɵɵrestoreView(_r45); const ctx_r52 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r52.changeMarkSize(4)); });
    ɵngcc0.ɵɵelement(44, "ion-icon", 161);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(45, "div", 194)(46, "div", 163);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_74_Template_div_click_46_listener() { ɵngcc0.ɵɵrestoreView(_r45); const ctx_r53 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r53.setMarkColor("#000000")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(47, "div", 164);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_74_Template_div_click_47_listener() { ɵngcc0.ɵɵrestoreView(_r45); const ctx_r54 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r54.setMarkColor("#0000FF")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(48, "div", 165);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_74_Template_div_click_48_listener() { ɵngcc0.ɵɵrestoreView(_r45); const ctx_r55 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r55.setMarkColor("#FF0000")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(49, "div", 195);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_74_Template_div_click_49_listener() { ɵngcc0.ɵɵrestoreView(_r45); const ctx_r56 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r56.setMarkColor("#009900")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(50, "div", 166);
    ɵngcc0.ɵɵelement(51, "ion-icon", 167);
    ɵngcc0.ɵɵelementStart(52, "input", 168);
    ɵngcc0.ɵɵlistener("input", function PdfAnnotatorModalComponent_div_74_Template_input_input_52_listener($event) { ɵngcc0.ɵɵrestoreView(_r45); const ctx_r57 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r57.setMarkColor($event.target.value)); });
    ɵngcc0.ɵɵelementEnd()()()();
    ɵngcc0.ɵɵelement(53, "div", 180);
    ɵngcc0.ɵɵelementStart(54, "button", 196);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_74_Template_button_click_54_listener() { ɵngcc0.ɵɵrestoreView(_r45); const ctx_r58 = ɵngcc0.ɵɵnextContext(); ctx_r58.showMarkOptions = false; ctx_r58.toolMode = "none"; return ɵngcc0.ɵɵresetView(ctx_r58.updateCursor()); });
    ɵngcc0.ɵɵelement(55, "ion-icon", 106);
    ɵngcc0.ɵɵtext(56, " ยกเลิก ");
    ɵngcc0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r4 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵadvance(4);
    ɵngcc0.ɵɵclassProp("active", ctx_r4.toolMode === "mark" && ctx_r4.markType === "check");
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵclassProp("active", ctx_r4.toolMode === "mark" && ctx_r4.markType === "cross");
    ɵngcc0.ɵɵadvance(4);
    ɵngcc0.ɵɵclassProp("active", ctx_r4.toolMode === "mark" && ctx_r4.markType === "dot");
    ɵngcc0.ɵɵadvance(7);
    ɵngcc0.ɵɵclassProp("active", ctx_r4.toolMode === "formfield" && ctx_r4.formFieldType === "text");
    ɵngcc0.ɵɵadvance(5);
    ɵngcc0.ɵɵclassProp("active", ctx_r4.toolMode === "formfield" && ctx_r4.formFieldType === "checkbox");
    ɵngcc0.ɵɵadvance(7);
    ɵngcc0.ɵɵclassProp("active", ctx_r4.toolMode === "formfield" && ctx_r4.formFieldType === "radio");
    ɵngcc0.ɵɵadvance(9);
    ɵngcc0.ɵɵproperty("disabled", ctx_r4.markSize <= 12);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵtextInterpolate(ctx_r4.markSize);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("disabled", ctx_r4.markSize >= 96);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵclassProp("active", ctx_r4.markColor === "#000000");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("active", ctx_r4.markColor === "#0000FF");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("active", ctx_r4.markColor === "#FF0000");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("active", ctx_r4.markColor === "#009900");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵstyleProp("background", ctx_r4.markColor);
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵproperty("value", ctx_r4.markColor);
} }
function PdfAnnotatorModalComponent_div_80_Template(rf, ctx) { if (rf & 1) {
    const _r60 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 197)(1, "button", 198);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_80_Template_button_click_1_listener() { ɵngcc0.ɵɵrestoreView(_r60); const ctx_r59 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r59.selectShape("rect")); });
    ɵngcc0.ɵɵelement(2, "ion-icon", 199);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(3, "button", 200);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_80_Template_button_click_3_listener() { ɵngcc0.ɵɵrestoreView(_r60); const ctx_r61 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r61.selectShape("circle")); });
    ɵngcc0.ɵɵelement(4, "ion-icon", 201);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(5, "button", 202);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_80_Template_button_click_5_listener() { ɵngcc0.ɵɵrestoreView(_r60); const ctx_r62 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r62.selectShape("line")); });
    ɵngcc0.ɵɵelement(6, "ion-icon", 203);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(7, "button", 204);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_80_Template_button_click_7_listener() { ɵngcc0.ɵɵrestoreView(_r60); const ctx_r63 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r63.selectShape("arrow")); });
    ɵngcc0.ɵɵelement(8, "ion-icon", 205);
    ɵngcc0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r5 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("active", ctx_r5.shapeType === "rect");
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵclassProp("active", ctx_r5.shapeType === "circle");
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵclassProp("active", ctx_r5.shapeType === "line");
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵclassProp("active", ctx_r5.shapeType === "arrow");
} }
function PdfAnnotatorModalComponent_div_81_div_17_Template(rf, ctx) { if (rf & 1) {
    const _r68 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 221);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_81_div_17_Template_div_click_0_listener() { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r68); const c_r66 = restoredCtx.$implicit; const ctx_r67 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(!ctx_r67.shapeNoStroke && ctx_r67.setShapeStrokeColor(c_r66)); });
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const c_r66 = ctx.$implicit;
    const ctx_r64 = ɵngcc0.ɵɵnextContext(2);
    ɵngcc0.ɵɵstyleProp("background", c_r66);
    ɵngcc0.ɵɵclassProp("active", ctx_r64.shapeStrokeColor === c_r66 && !ctx_r64.shapeNoStroke);
    ɵngcc0.ɵɵproperty("title", c_r66);
} }
function PdfAnnotatorModalComponent_div_81_div_28_Template(rf, ctx) { if (rf & 1) {
    const _r71 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 221);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_81_div_28_Template_div_click_0_listener() { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r71); const c_r69 = restoredCtx.$implicit; const ctx_r70 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r70.shapeFillEnabled && ctx_r70.setShapeFillColor(c_r69)); });
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const c_r69 = ctx.$implicit;
    const ctx_r65 = ɵngcc0.ɵɵnextContext(2);
    ɵngcc0.ɵɵstyleProp("background", c_r69);
    ɵngcc0.ɵɵclassProp("active", ctx_r65.shapeFillColor === c_r69 && ctx_r65.shapeFillEnabled);
    ɵngcc0.ɵɵproperty("title", c_r69);
} }
function PdfAnnotatorModalComponent_div_81_Template(rf, ctx) { if (rf & 1) {
    const _r73 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 206)(1, "div", 207)(2, "span", 208);
    ɵngcc0.ɵɵtext(3, "ขนาด");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(4, "button", 209);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_81_Template_button_click_4_listener() { ɵngcc0.ɵɵrestoreView(_r73); const ctx_r72 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r72.changeShapeStrokeSize(-1)); });
    ɵngcc0.ɵɵelement(5, "ion-icon", 160);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(6, "span", 210);
    ɵngcc0.ɵɵtext(7);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(8, "button", 209);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_81_Template_button_click_8_listener() { ɵngcc0.ɵɵrestoreView(_r73); const ctx_r74 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r74.changeShapeStrokeSize(1)); });
    ɵngcc0.ɵɵelement(9, "ion-icon", 161);
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelement(10, "div", 211);
    ɵngcc0.ɵɵelementStart(11, "div", 207)(12, "span", 208);
    ɵngcc0.ɵɵtext(13, "เส้นขอบ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(14, "button", 212);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_81_Template_button_click_14_listener() { ɵngcc0.ɵɵrestoreView(_r73); const ctx_r75 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r75.toggleShapeNoStroke()); });
    ɵngcc0.ɵɵelement(15, "ion-icon", 213);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(16, "div", 214);
    ɵngcc0.ɵɵtemplate(17, PdfAnnotatorModalComponent_div_81_div_17_Template, 1, 5, "div", 215);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(18, "div", 216);
    ɵngcc0.ɵɵelement(19, "div", 217);
    ɵngcc0.ɵɵelementStart(20, "input", 218);
    ɵngcc0.ɵɵlistener("input", function PdfAnnotatorModalComponent_div_81_Template_input_input_20_listener($event) { ɵngcc0.ɵɵrestoreView(_r73); const ctx_r76 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r76.setShapeStrokeColor($event.target.value)); });
    ɵngcc0.ɵɵelementEnd()()();
    ɵngcc0.ɵɵelement(21, "div", 211);
    ɵngcc0.ɵɵelementStart(22, "div", 207)(23, "span", 208);
    ɵngcc0.ɵɵtext(24, "สีพื้น");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(25, "button", 219);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_81_Template_button_click_25_listener() { ɵngcc0.ɵɵrestoreView(_r73); const ctx_r77 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r77.toggleShapeFill()); });
    ɵngcc0.ɵɵelement(26, "ion-icon", 63);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(27, "div", 214);
    ɵngcc0.ɵɵtemplate(28, PdfAnnotatorModalComponent_div_81_div_28_Template, 1, 5, "div", 215);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(29, "div", 216);
    ɵngcc0.ɵɵelement(30, "div", 217);
    ɵngcc0.ɵɵelementStart(31, "input", 220);
    ɵngcc0.ɵɵlistener("input", function PdfAnnotatorModalComponent_div_81_Template_input_input_31_listener($event) { ɵngcc0.ɵɵrestoreView(_r73); const ctx_r78 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r78.setShapeFillColor($event.target.value)); });
    ɵngcc0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r6 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵadvance(4);
    ɵngcc0.ɵɵproperty("disabled", ctx_r6.shapeStrokeSize <= 1);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵtextInterpolate(ctx_r6.shapeStrokeSize);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("disabled", ctx_r6.shapeStrokeSize >= 20);
    ɵngcc0.ɵɵadvance(6);
    ɵngcc0.ɵɵclassProp("active", ctx_r6.shapeNoStroke);
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵclassProp("disabled", ctx_r6.shapeNoStroke);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngForOf", ctx_r6.shapeColorSwatches);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("disabled", ctx_r6.shapeNoStroke);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵstyleProp("background", ctx_r6.shapeStrokeColor);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("value", ctx_r6.shapeStrokeColor)("disabled", ctx_r6.shapeNoStroke);
    ɵngcc0.ɵɵadvance(5);
    ɵngcc0.ɵɵclassProp("active", ctx_r6.shapeFillEnabled);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("name", ctx_r6.shapeFillEnabled ? "color-fill" : "color-fill-outline");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("disabled", !ctx_r6.shapeFillEnabled);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngForOf", ctx_r6.shapeFillSwatches);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("disabled", !ctx_r6.shapeFillEnabled);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵstyleProp("background", ctx_r6.shapeFillColor);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("value", ctx_r6.shapeFillColor)("disabled", !ctx_r6.shapeFillEnabled);
} }
function PdfAnnotatorModalComponent_div_86_Template(rf, ctx) { if (rf & 1) {
    const _r80 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 158)(1, "button", 159);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_86_Template_button_click_1_listener() { ɵngcc0.ɵɵrestoreView(_r80); const ctx_r79 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r79.changeBrushSize(-1)); });
    ɵngcc0.ɵɵelement(2, "ion-icon", 160);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(3, "span");
    ɵngcc0.ɵɵtext(4);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(5, "button", 159);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_86_Template_button_click_5_listener() { ɵngcc0.ɵɵrestoreView(_r80); const ctx_r81 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r81.changeBrushSize(1)); });
    ɵngcc0.ɵɵelement(6, "ion-icon", 161);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(7, "div", 162)(8, "div", 163);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_86_Template_div_click_8_listener() { ɵngcc0.ɵɵrestoreView(_r80); const ctx_r82 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r82.setBrushColor("#000000")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(9, "div", 164);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_86_Template_div_click_9_listener() { ɵngcc0.ɵɵrestoreView(_r80); const ctx_r83 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r83.setBrushColor("#0000FF")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(10, "div", 165);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_86_Template_div_click_10_listener() { ɵngcc0.ɵɵrestoreView(_r80); const ctx_r84 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r84.setBrushColor("#FF0000")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(11, "div", 166);
    ɵngcc0.ɵɵelement(12, "ion-icon", 167);
    ɵngcc0.ɵɵelementStart(13, "input", 168);
    ɵngcc0.ɵɵlistener("input", function PdfAnnotatorModalComponent_div_86_Template_input_input_13_listener($event) { ɵngcc0.ɵɵrestoreView(_r80); const ctx_r85 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r85.setBrushColor($event.target.value)); });
    ɵngcc0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r7 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("disabled", ctx_r7.brushSize <= 1);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵtextInterpolate(ctx_r7.brushSize);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("disabled", ctx_r7.brushSize >= 50);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵclassProp("active", ctx_r7.brushColor === "#000000");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("active", ctx_r7.brushColor === "#0000FF");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("active", ctx_r7.brushColor === "#FF0000");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵstyleProp("background", ctx_r7.brushColor);
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵproperty("value", ctx_r7.brushColor);
} }
function PdfAnnotatorModalComponent_div_93_Template(rf, ctx) { if (rf & 1) {
    const _r87 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵnamespaceSVG();
    ɵngcc0.ɵɵnamespaceHTML();
    ɵngcc0.ɵɵelementStart(0, "div", 158)(1, "button", 159);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_93_Template_button_click_1_listener() { ɵngcc0.ɵɵrestoreView(_r87); const ctx_r86 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r86.changeHighlightSize(-5)); });
    ɵngcc0.ɵɵelement(2, "ion-icon", 160);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(3, "span");
    ɵngcc0.ɵɵtext(4);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(5, "button", 159);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_93_Template_button_click_5_listener() { ɵngcc0.ɵɵrestoreView(_r87); const ctx_r88 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r88.changeHighlightSize(5)); });
    ɵngcc0.ɵɵelement(6, "ion-icon", 161);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(7, "div", 162)(8, "div", 222);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_93_Template_div_click_8_listener() { ɵngcc0.ɵɵrestoreView(_r87); const ctx_r89 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r89.setHighlightColor("#ffff00")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(9, "div", 223);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_93_Template_div_click_9_listener() { ɵngcc0.ɵɵrestoreView(_r87); const ctx_r90 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r90.setHighlightColor("#00ff00")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(10, "div", 224);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_93_Template_div_click_10_listener() { ɵngcc0.ɵɵrestoreView(_r87); const ctx_r91 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r91.setHighlightColor("#00ffff")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(11, "div", 225);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_93_Template_div_click_11_listener() { ɵngcc0.ɵɵrestoreView(_r87); const ctx_r92 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r92.setHighlightColor("#ff99c2")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(12, "div", 226);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_93_Template_div_click_12_listener() { ɵngcc0.ɵɵrestoreView(_r87); const ctx_r93 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r93.setHighlightColor("#ffb366")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(13, "div", 227);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_93_Template_div_click_13_listener() { ɵngcc0.ɵɵrestoreView(_r87); const ctx_r94 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r94.setHighlightColor("#d9b3ff")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(14, "div", 228);
    ɵngcc0.ɵɵelement(15, "ion-icon", 167);
    ɵngcc0.ɵɵelementStart(16, "input", 229);
    ɵngcc0.ɵɵlistener("input", function PdfAnnotatorModalComponent_div_93_Template_input_input_16_listener($event) { ɵngcc0.ɵɵrestoreView(_r87); const ctx_r95 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r95.setHighlightColor($event.target.value)); });
    ɵngcc0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r8 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("disabled", ctx_r8.highlightSize <= 5);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵtextInterpolate(ctx_r8.highlightSize);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("disabled", ctx_r8.highlightSize >= 100);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵclassProp("active", ctx_r8.highlightColor === "#ffff00");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("active", ctx_r8.highlightColor === "#00ff00");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("active", ctx_r8.highlightColor === "#00ffff");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("active", ctx_r8.highlightColor === "#ff99c2");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("active", ctx_r8.highlightColor === "#ffb366");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("active", ctx_r8.highlightColor === "#d9b3ff");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵstyleProp("background", ctx_r8.highlightColor);
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵproperty("value", ctx_r8.highlightColor);
} }
function PdfAnnotatorModalComponent_div_99_Template(rf, ctx) { if (rf & 1) {
    const _r97 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵnamespaceSVG();
    ɵngcc0.ɵɵnamespaceHTML();
    ɵngcc0.ɵɵelementStart(0, "div", 158)(1, "button", 159);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_99_Template_button_click_1_listener() { ɵngcc0.ɵɵrestoreView(_r97); const ctx_r96 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r96.changeEraserSize(-5)); });
    ɵngcc0.ɵɵelement(2, "ion-icon", 160);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(3, "span");
    ɵngcc0.ɵɵtext(4);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(5, "button", 159);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_99_Template_button_click_5_listener() { ɵngcc0.ɵɵrestoreView(_r97); const ctx_r98 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r98.changeEraserSize(5)); });
    ɵngcc0.ɵɵelement(6, "ion-icon", 161);
    ɵngcc0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r9 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("disabled", ctx_r9.eraserSize <= 5);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵtextInterpolate(ctx_r9.eraserSize);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("disabled", ctx_r9.eraserSize >= 200);
} }
function PdfAnnotatorModalComponent_div_110_Template(rf, ctx) { if (rf & 1) {
    const _r100 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 158)(1, "button", 159);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_110_Template_button_click_1_listener() { ɵngcc0.ɵɵrestoreView(_r100); const ctx_r99 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r99.changeDateFontSize(-2)); });
    ɵngcc0.ɵɵelement(2, "ion-icon", 160);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(3, "span");
    ɵngcc0.ɵɵtext(4);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(5, "button", 159);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_110_Template_button_click_5_listener() { ɵngcc0.ɵɵrestoreView(_r100); const ctx_r101 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r101.changeDateFontSize(2)); });
    ɵngcc0.ɵɵelement(6, "ion-icon", 161);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(7, "div", 162)(8, "div", 163);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_110_Template_div_click_8_listener() { ɵngcc0.ɵɵrestoreView(_r100); const ctx_r102 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r102.setDateColor("#000000")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(9, "div", 164);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_110_Template_div_click_9_listener() { ɵngcc0.ɵɵrestoreView(_r100); const ctx_r103 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r103.setDateColor("#0000FF")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(10, "div", 165);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_110_Template_div_click_10_listener() { ɵngcc0.ɵɵrestoreView(_r100); const ctx_r104 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r104.setDateColor("#FF0000")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(11, "div", 166);
    ɵngcc0.ɵɵelement(12, "ion-icon", 167);
    ɵngcc0.ɵɵelementStart(13, "input", 168);
    ɵngcc0.ɵɵlistener("input", function PdfAnnotatorModalComponent_div_110_Template_input_input_13_listener($event) { ɵngcc0.ɵɵrestoreView(_r100); const ctx_r105 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r105.setDateColor($event.target.value)); });
    ɵngcc0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r10 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("disabled", ctx_r10.dateFontSize <= 8);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵtextInterpolate(ctx_r10.dateFontSize);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("disabled", ctx_r10.dateFontSize >= 100);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵclassProp("active", ctx_r10.dateColor === "#000000");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("active", ctx_r10.dateColor === "#0000FF");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("active", ctx_r10.dateColor === "#FF0000");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵstyleProp("background", ctx_r10.dateColor);
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵproperty("value", ctx_r10.dateColor);
} }
function PdfAnnotatorModalComponent_aside_123_ng_container_5_Template(rf, ctx) { if (rf & 1) {
    const _r111 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementContainerStart(0);
    ɵngcc0.ɵɵelementStart(1, "div", 237)(2, "div", 238);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_aside_123_ng_container_5_Template_div_click_2_listener() { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r111); const i_r109 = restoredCtx.index; const ctx_r110 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r110.goToPage(i_r109 + 1)); });
    ɵngcc0.ɵɵelementStart(3, "div", 239);
    ɵngcc0.ɵɵelement(4, "img", 240);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(5, "span", 241);
    ɵngcc0.ɵɵtext(6);
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(7, "div", 242);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_aside_123_ng_container_5_Template_div_click_7_listener($event) { return $event.stopPropagation(); });
    ɵngcc0.ɵɵelementStart(8, "button", 243);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_aside_123_ng_container_5_Template_button_click_8_listener() { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r111); const i_r109 = restoredCtx.index; const ctx_r113 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r113.movePageToIndex(i_r109 + 1, "up")); });
    ɵngcc0.ɵɵelement(9, "ion-icon", 244);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(10, "button", 245);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_aside_123_ng_container_5_Template_button_click_10_listener() { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r111); const i_r109 = restoredCtx.index; const ctx_r114 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r114.movePageToIndex(i_r109 + 1, "down")); });
    ɵngcc0.ɵɵelement(11, "ion-icon", 246);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(12, "button", 247);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_aside_123_ng_container_5_Template_button_click_12_listener() { ɵngcc0.ɵɵrestoreView(_r111); const ctx_r115 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r115.undoPageOp()); });
    ɵngcc0.ɵɵelement(13, "ion-icon", 157);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(14, "button", 248);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_aside_123_ng_container_5_Template_button_click_14_listener() { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r111); const i_r109 = restoredCtx.index; const ctx_r116 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r116.deleteSpecificPage(i_r109 + 1)); });
    ɵngcc0.ɵɵelement(15, "ion-icon", 153);
    ɵngcc0.ɵɵelementEnd()()();
    ɵngcc0.ɵɵelementStart(16, "div", 232)(17, "button", 249);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_aside_123_ng_container_5_Template_button_click_17_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r111); const i_r109 = restoredCtx.index; const ctx_r117 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r117.toggleThumbInsert(i_r109 + 1, $event)); });
    ɵngcc0.ɵɵelement(18, "ion-icon", 161);
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const thumb_r108 = ctx.$implicit;
    const i_r109 = ctx.index;
    const ctx_r106 = ɵngcc0.ɵɵnextContext(2);
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵclassProp("active", ctx_r106.pageNo === i_r109 + 1);
    ɵngcc0.ɵɵproperty("id", "thumb-" + (i_r109 + 1));
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵproperty("src", thumb_r108, ɵngcc0.ɵɵsanitizeUrl)("alt", "Page " + (i_r109 + 1));
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵtextInterpolate(i_r109 + 1);
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵproperty("disabled", i_r109 === 0);
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵproperty("disabled", i_r109 === ctx_r106.pageThumbnails.length - 1);
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵproperty("disabled", !ctx_r106.canUndoPageOp);
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵproperty("disabled", ctx_r106.pageCount <= 1);
} }
function PdfAnnotatorModalComponent_aside_123_Template(rf, ctx) { if (rf & 1) {
    const _r119 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "aside", 230)(1, "div", 231)(2, "div", 232)(3, "button", 233);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_aside_123_Template_button_click_3_listener($event) { ɵngcc0.ɵɵrestoreView(_r119); const ctx_r118 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r118.toggleThumbInsert(0, $event)); });
    ɵngcc0.ɵɵelement(4, "ion-icon", 161);
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵtemplate(5, PdfAnnotatorModalComponent_aside_123_ng_container_5_Template, 19, 10, "ng-container", 234);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(6, "input", 235, 236);
    ɵngcc0.ɵɵlistener("change", function PdfAnnotatorModalComponent_aside_123_Template_input_change_6_listener($event) { ɵngcc0.ɵɵrestoreView(_r119); const ctx_r120 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r120.onThumbFileSelected($event)); });
    ɵngcc0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r12 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵadvance(5);
    ɵngcc0.ɵɵproperty("ngForOf", ctx_r12.pageThumbnails);
} }
function PdfAnnotatorModalComponent_div_124_Template(rf, ctx) { if (rf & 1) {
    const _r122 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 250)(1, "div", 251);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_124_Template_div_click_1_listener() { ɵngcc0.ɵɵrestoreView(_r122); const ctx_r121 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r121.thumbInsertIndex = -1); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(2, "div", 252)(3, "button", 253);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_124_Template_button_click_3_listener() { ɵngcc0.ɵɵrestoreView(_r122); const ctx_r123 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r123.insertAtThumb(ctx_r123.thumbInsertIndex, "portrait")); });
    ɵngcc0.ɵɵelement(4, "ion-icon", 145);
    ɵngcc0.ɵɵtext(5, " หน้าเปล่า แนวตั้ง ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(6, "button", 253);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_124_Template_button_click_6_listener() { ɵngcc0.ɵɵrestoreView(_r122); const ctx_r124 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r124.insertAtThumb(ctx_r124.thumbInsertIndex, "landscape")); });
    ɵngcc0.ɵɵelement(7, "ion-icon", 147);
    ɵngcc0.ɵɵtext(8, " หน้าเปล่า แนวนอน ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(9, "button", 253);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_124_Template_button_click_9_listener() { ɵngcc0.ɵɵrestoreView(_r122); const ctx_r125 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r125.triggerThumbFileUpload(ctx_r125.thumbInsertIndex)); });
    ɵngcc0.ɵɵelement(10, "ion-icon", 254);
    ɵngcc0.ɵɵtext(11, " แทรกไฟล์ PDF/รูปภาพ ");
    ɵngcc0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r13 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵstyleProp("top", ctx_r13.thumbDropdownTop, "px");
} }
function PdfAnnotatorModalComponent_div_128_div_3_Template(rf, ctx) { if (rf & 1) {
    const _r136 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 265);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_3_Template_div_pointerdown_0_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r136); const tb_r134 = restoredCtx.$implicit; const ctx_r135 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r135.startDrag($event, tb_r134.id)); })("contextmenu", function PdfAnnotatorModalComponent_div_128_div_3_Template_div_contextmenu_0_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r136); const tb_r134 = restoredCtx.$implicit; const ctx_r137 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r137.onContextMenu($event, tb_r134.id, "text")); });
    ɵngcc0.ɵɵelementStart(1, "div", 266);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_3_Template_div_pointerdown_1_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r136); const tb_r134 = restoredCtx.$implicit; const ctx_r138 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r138.startResizeLeft($event, tb_r134.id)); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(2, "textarea", 267);
    ɵngcc0.ɵɵlistener("ngModelChange", function PdfAnnotatorModalComponent_div_128_div_3_Template_textarea_ngModelChange_2_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r136); const tb_r134 = restoredCtx.$implicit; return ɵngcc0.ɵɵresetView(tb_r134.text = $event); })("focus", function PdfAnnotatorModalComponent_div_128_div_3_Template_textarea_focus_2_listener() { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r136); const tb_r134 = restoredCtx.$implicit; const ctx_r140 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r140.activeTextBoxId = tb_r134.id); })("input", function PdfAnnotatorModalComponent_div_128_div_3_Template_textarea_input_2_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r136); const tb_r134 = restoredCtx.$implicit; const ctx_r141 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r141.onTextBoxInput($event, tb_r134)); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(3, "div", 268);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_3_Template_div_pointerdown_3_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r136); const tb_r134 = restoredCtx.$implicit; const ctx_r142 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r142.startResizeRight($event, tb_r134.id)); });
    ɵngcc0.ɵɵelementEnd()();
} if (rf & 2) {
    const tb_r134 = ctx.$implicit;
    const ctx_r127 = ɵngcc0.ɵɵnextContext(2);
    ɵngcc0.ɵɵstyleProp("left", tb_r134.x, "%")("top", tb_r134.y, "%")("width", tb_r134.width, "%")("height", tb_r134.height, "%")("color", tb_r134.color)("font-size", tb_r134.fontSize * ctx_r127.zoom, "px")("font-weight", tb_r134.bold ? "bold" : "normal")("font-style", tb_r134.italic ? "italic" : "normal")("text-align", tb_r134.align)("z-index", tb_r134.zIndex || 10);
    ɵngcc0.ɵɵclassProp("active", ctx_r127.activeTextBoxId === tb_r134.id);
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵproperty("ngModel", tb_r134.text);
} }
function PdfAnnotatorModalComponent_div_128_div_4__svg_rect_4_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵnamespaceSVG();
    ɵngcc0.ɵɵelement(0, "rect", 283);
} if (rf & 2) {
    const ss_r143 = ɵngcc0.ɵɵnextContext().$implicit;
    ɵngcc0.ɵɵattribute("stroke", ss_r143.strokeColor || "none")("stroke-width", ss_r143.strokeWidth)("fill", ss_r143.fillColor || "none");
} }
function PdfAnnotatorModalComponent_div_128_div_4__svg_ellipse_5_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵnamespaceSVG();
    ɵngcc0.ɵɵelement(0, "ellipse", 284);
} if (rf & 2) {
    const ss_r143 = ɵngcc0.ɵɵnextContext().$implicit;
    ɵngcc0.ɵɵattribute("stroke", ss_r143.strokeColor || "none")("stroke-width", ss_r143.strokeWidth)("fill", ss_r143.fillColor || "none");
} }
function PdfAnnotatorModalComponent_div_128_div_4__svg_line_6_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵnamespaceSVG();
    ɵngcc0.ɵɵelement(0, "line", 285);
} if (rf & 2) {
    const ss_r143 = ɵngcc0.ɵɵnextContext().$implicit;
    ɵngcc0.ɵɵattribute("x1", ss_r143.startFracX * 100)("y1", ss_r143.startFracY * 100)("x2", ss_r143.endFracX * 100)("y2", ss_r143.endFracY * 100)("stroke", ss_r143.strokeColor || "#000")("stroke-width", ss_r143.strokeWidth);
} }
function PdfAnnotatorModalComponent_div_128_div_4__svg_g_7_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵnamespaceSVG();
    ɵngcc0.ɵɵelementStart(0, "g");
    ɵngcc0.ɵɵelement(1, "line", 285)(2, "polygon");
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ss_r143 = ɵngcc0.ɵɵnextContext().$implicit;
    const ctx_r147 = ɵngcc0.ɵɵnextContext(2);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵattribute("x1", ss_r143.startFracX * 100)("y1", ss_r143.startFracY * 100)("x2", ss_r143.endFracX * 100)("y2", ss_r143.endFracY * 100)("stroke", ss_r143.strokeColor || "#000")("stroke-width", ss_r143.strokeWidth);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵattribute("points", "0,-6 12,0 0,6")("fill", ss_r143.strokeColor || "#000")("transform", "translate(" + ss_r143.endFracX * 100 + "," + ss_r143.endFracY * 100 + ") rotate(" + ctx_r147.getArrowAngleDeg(ss_r143) + ")");
} }
function PdfAnnotatorModalComponent_div_128_div_4_Template(rf, ctx) { if (rf & 1) {
    const _r153 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 269);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_4_Template_div_pointerdown_0_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r153); const ss_r143 = restoredCtx.$implicit; const ctx_r152 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r152.startShapeDrag($event, ss_r143.id)); })("contextmenu", function PdfAnnotatorModalComponent_div_128_div_4_Template_div_contextmenu_0_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r153); const ss_r143 = restoredCtx.$implicit; const ctx_r154 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r154.onContextMenu($event, ss_r143.id, "shape")); });
    ɵngcc0.ɵɵelementStart(1, "button", 270);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_128_div_4_Template_button_click_1_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r153); const ss_r143 = restoredCtx.$implicit; const ctx_r155 = ɵngcc0.ɵɵnextContext(2); ctx_r155.removeShapeStamp(ss_r143.id); return ɵngcc0.ɵɵresetView($event.stopPropagation()); });
    ɵngcc0.ɵɵelement(2, "ion-icon", 106);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵnamespaceSVG();
    ɵngcc0.ɵɵelementStart(3, "svg", 271);
    ɵngcc0.ɵɵtemplate(4, PdfAnnotatorModalComponent_div_128_div_4__svg_rect_4_Template, 1, 3, "rect", 272);
    ɵngcc0.ɵɵtemplate(5, PdfAnnotatorModalComponent_div_128_div_4__svg_ellipse_5_Template, 1, 3, "ellipse", 273);
    ɵngcc0.ɵɵtemplate(6, PdfAnnotatorModalComponent_div_128_div_4__svg_line_6_Template, 1, 6, "line", 274);
    ɵngcc0.ɵɵtemplate(7, PdfAnnotatorModalComponent_div_128_div_4__svg_g_7_Template, 3, 9, "g", 121);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵnamespaceHTML();
    ɵngcc0.ɵɵelementStart(8, "div", 275);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_4_Template_div_pointerdown_8_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r153); const ss_r143 = restoredCtx.$implicit; const ctx_r156 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r156.startShapeResize($event, ss_r143.id, "nw")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(9, "div", 276);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_4_Template_div_pointerdown_9_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r153); const ss_r143 = restoredCtx.$implicit; const ctx_r157 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r157.startShapeResize($event, ss_r143.id, "n")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(10, "div", 277);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_4_Template_div_pointerdown_10_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r153); const ss_r143 = restoredCtx.$implicit; const ctx_r158 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r158.startShapeResize($event, ss_r143.id, "ne")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(11, "div", 278);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_4_Template_div_pointerdown_11_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r153); const ss_r143 = restoredCtx.$implicit; const ctx_r159 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r159.startShapeResize($event, ss_r143.id, "e")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(12, "div", 279);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_4_Template_div_pointerdown_12_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r153); const ss_r143 = restoredCtx.$implicit; const ctx_r160 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r160.startShapeResize($event, ss_r143.id, "se")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(13, "div", 280);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_4_Template_div_pointerdown_13_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r153); const ss_r143 = restoredCtx.$implicit; const ctx_r161 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r161.startShapeResize($event, ss_r143.id, "s")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(14, "div", 281);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_4_Template_div_pointerdown_14_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r153); const ss_r143 = restoredCtx.$implicit; const ctx_r162 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r162.startShapeResize($event, ss_r143.id, "sw")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(15, "div", 282);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_4_Template_div_pointerdown_15_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r153); const ss_r143 = restoredCtx.$implicit; const ctx_r163 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r163.startShapeResize($event, ss_r143.id, "w")); });
    ɵngcc0.ɵɵelementEnd()();
} if (rf & 2) {
    const ss_r143 = ctx.$implicit;
    ɵngcc0.ɵɵstyleProp("left", ss_r143.x, "%")("top", ss_r143.y, "%")("width", ss_r143.width, "%")("height", ss_r143.height, "%")("z-index", ss_r143.zIndex || 10);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵattribute("viewBox", "0 0 100 100");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ss_r143.type === "rect");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ss_r143.type === "circle");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ss_r143.type === "line");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ss_r143.type === "arrow");
} }
function PdfAnnotatorModalComponent_div_128_div_5_Template(rf, ctx) { if (rf & 1) {
    const _r166 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 286);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_5_Template_div_pointerdown_0_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r166); const img_r164 = restoredCtx.$implicit; const ctx_r165 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r165.startImageDrag($event, img_r164.id)); })("contextmenu", function PdfAnnotatorModalComponent_div_128_div_5_Template_div_contextmenu_0_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r166); const img_r164 = restoredCtx.$implicit; const ctx_r167 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r167.onContextMenu($event, img_r164.id, "image")); });
    ɵngcc0.ɵɵelementStart(1, "button", 270);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_128_div_5_Template_button_click_1_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r166); const img_r164 = restoredCtx.$implicit; const ctx_r168 = ɵngcc0.ɵɵnextContext(2); ctx_r168.removeImage(img_r164.id); return ɵngcc0.ɵɵresetView($event.stopPropagation()); });
    ɵngcc0.ɵɵelement(2, "ion-icon", 106);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelement(3, "img", 287);
    ɵngcc0.ɵɵelementStart(4, "div", 275);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_5_Template_div_pointerdown_4_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r166); const img_r164 = restoredCtx.$implicit; const ctx_r169 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r169.startImageResize($event, img_r164.id, "nw")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(5, "div", 276);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_5_Template_div_pointerdown_5_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r166); const img_r164 = restoredCtx.$implicit; const ctx_r170 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r170.startImageResize($event, img_r164.id, "n")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(6, "div", 277);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_5_Template_div_pointerdown_6_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r166); const img_r164 = restoredCtx.$implicit; const ctx_r171 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r171.startImageResize($event, img_r164.id, "ne")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(7, "div", 278);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_5_Template_div_pointerdown_7_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r166); const img_r164 = restoredCtx.$implicit; const ctx_r172 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r172.startImageResize($event, img_r164.id, "e")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(8, "div", 279);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_5_Template_div_pointerdown_8_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r166); const img_r164 = restoredCtx.$implicit; const ctx_r173 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r173.startImageResize($event, img_r164.id, "se")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(9, "div", 280);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_5_Template_div_pointerdown_9_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r166); const img_r164 = restoredCtx.$implicit; const ctx_r174 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r174.startImageResize($event, img_r164.id, "s")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(10, "div", 281);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_5_Template_div_pointerdown_10_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r166); const img_r164 = restoredCtx.$implicit; const ctx_r175 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r175.startImageResize($event, img_r164.id, "sw")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(11, "div", 282);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_5_Template_div_pointerdown_11_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r166); const img_r164 = restoredCtx.$implicit; const ctx_r176 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r176.startImageResize($event, img_r164.id, "w")); });
    ɵngcc0.ɵɵelementEnd()();
} if (rf & 2) {
    const img_r164 = ctx.$implicit;
    ɵngcc0.ɵɵstyleProp("left", img_r164.x, "%")("top", img_r164.y, "%")("width", img_r164.width, "%")("height", img_r164.height, "%")("z-index", img_r164.zIndex || 10);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵproperty("src", img_r164.dataUrl, ɵngcc0.ɵɵsanitizeUrl);
} }
function PdfAnnotatorModalComponent_div_128_div_6_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r185 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 300);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_6_div_1_Template_div_pointerdown_0_listener($event) { return $event.stopPropagation(); });
    ɵngcc0.ɵɵelementStart(1, "span", 301);
    ɵngcc0.ɵɵelement(2, "ion-icon", 302);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(3, "button", 303);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_128_div_6_div_1_Template_button_click_3_listener() { ɵngcc0.ɵɵrestoreView(_r185); const mk_r177 = ɵngcc0.ɵɵnextContext().$implicit; const ctx_r183 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r183.changeMarkStampSize(mk_r177.id, -1)); });
    ɵngcc0.ɵɵelement(4, "ion-icon", 160);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(5, "span", 304);
    ɵngcc0.ɵɵtext(6);
    ɵngcc0.ɵɵpipe(7, "number");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(8, "button", 305);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_128_div_6_div_1_Template_button_click_8_listener() { ɵngcc0.ɵɵrestoreView(_r185); const mk_r177 = ɵngcc0.ɵɵnextContext().$implicit; const ctx_r186 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r186.changeMarkStampSize(mk_r177.id, 1)); });
    ɵngcc0.ɵɵelement(9, "ion-icon", 161);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelement(10, "div", 306);
    ɵngcc0.ɵɵelementStart(11, "button", 307);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_128_div_6_div_1_Template_button_click_11_listener($event) { ɵngcc0.ɵɵrestoreView(_r185); const mk_r177 = ɵngcc0.ɵɵnextContext().$implicit; const ctx_r188 = ɵngcc0.ɵɵnextContext(2); ctx_r188.removeImage(mk_r177.id); return ɵngcc0.ɵɵresetView($event.stopPropagation()); });
    ɵngcc0.ɵɵelement(12, "ion-icon", 153);
    ɵngcc0.ɵɵelementEnd()();
} if (rf & 2) {
    const mk_r177 = ɵngcc0.ɵɵnextContext().$implicit;
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵproperty("disabled", mk_r177.width <= 1);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵtextInterpolate(ɵngcc0.ɵɵpipeBind2(7, 3, mk_r177.width, "1.0-1"));
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵproperty("disabled", mk_r177.width >= 25);
} }
function PdfAnnotatorModalComponent_div_128_div_6__svg_ng_container_4_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵnamespaceSVG();
    ɵngcc0.ɵɵelementContainerStart(0);
    ɵngcc0.ɵɵelement(1, "polyline", 308);
    ɵngcc0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const mk_r177 = ɵngcc0.ɵɵnextContext().$implicit;
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵattribute("stroke", mk_r177.markColor || "#000000");
} }
function PdfAnnotatorModalComponent_div_128_div_6__svg_ng_container_5_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵnamespaceSVG();
    ɵngcc0.ɵɵelementContainerStart(0);
    ɵngcc0.ɵɵelement(1, "line", 309)(2, "line", 310);
    ɵngcc0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const mk_r177 = ɵngcc0.ɵɵnextContext().$implicit;
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵattribute("stroke", mk_r177.markColor || "#000000");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵattribute("stroke", mk_r177.markColor || "#000000");
} }
function PdfAnnotatorModalComponent_div_128_div_6__svg_ng_container_6_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵnamespaceSVG();
    ɵngcc0.ɵɵelementContainerStart(0);
    ɵngcc0.ɵɵelement(1, "circle", 311);
    ɵngcc0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const mk_r177 = ɵngcc0.ɵɵnextContext().$implicit;
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵattribute("fill", mk_r177.markColor || "#000000");
} }
function PdfAnnotatorModalComponent_div_128_div_6_Template(rf, ctx) { if (rf & 1) {
    const _r195 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 288);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_6_Template_div_pointerdown_0_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r195); const mk_r177 = restoredCtx.$implicit; const ctx_r194 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r194.startMarkDrag($event, mk_r177.id)); })("contextmenu", function PdfAnnotatorModalComponent_div_128_div_6_Template_div_contextmenu_0_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r195); const mk_r177 = restoredCtx.$implicit; const ctx_r196 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r196.onContextMenu($event, mk_r177.id, "image")); });
    ɵngcc0.ɵɵtemplate(1, PdfAnnotatorModalComponent_div_128_div_6_div_1_Template, 13, 6, "div", 289);
    ɵngcc0.ɵɵelementStart(2, "div", 290);
    ɵngcc0.ɵɵnamespaceSVG();
    ɵngcc0.ɵɵelementStart(3, "svg", 291);
    ɵngcc0.ɵɵtemplate(4, PdfAnnotatorModalComponent_div_128_div_6__svg_ng_container_4_Template, 2, 1, "ng-container", 121);
    ɵngcc0.ɵɵtemplate(5, PdfAnnotatorModalComponent_div_128_div_6__svg_ng_container_5_Template, 3, 2, "ng-container", 121);
    ɵngcc0.ɵɵtemplate(6, PdfAnnotatorModalComponent_div_128_div_6__svg_ng_container_6_Template, 2, 1, "ng-container", 121);
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵnamespaceHTML();
    ɵngcc0.ɵɵelementStart(7, "div", 292);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_6_Template_div_pointerdown_7_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r195); const mk_r177 = restoredCtx.$implicit; const ctx_r197 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r197.startImageResize($event, mk_r177.id, "nw")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(8, "div", 293);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_6_Template_div_pointerdown_8_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r195); const mk_r177 = restoredCtx.$implicit; const ctx_r198 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r198.startImageResize($event, mk_r177.id, "n")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(9, "div", 294);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_6_Template_div_pointerdown_9_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r195); const mk_r177 = restoredCtx.$implicit; const ctx_r199 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r199.startImageResize($event, mk_r177.id, "ne")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(10, "div", 295);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_6_Template_div_pointerdown_10_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r195); const mk_r177 = restoredCtx.$implicit; const ctx_r200 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r200.startImageResize($event, mk_r177.id, "e")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(11, "div", 296);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_6_Template_div_pointerdown_11_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r195); const mk_r177 = restoredCtx.$implicit; const ctx_r201 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r201.startImageResize($event, mk_r177.id, "se")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(12, "div", 297);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_6_Template_div_pointerdown_12_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r195); const mk_r177 = restoredCtx.$implicit; const ctx_r202 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r202.startImageResize($event, mk_r177.id, "s")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(13, "div", 298);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_6_Template_div_pointerdown_13_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r195); const mk_r177 = restoredCtx.$implicit; const ctx_r203 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r203.startImageResize($event, mk_r177.id, "sw")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(14, "div", 299);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_6_Template_div_pointerdown_14_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r195); const mk_r177 = restoredCtx.$implicit; const ctx_r204 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r204.startImageResize($event, mk_r177.id, "w")); });
    ɵngcc0.ɵɵelementEnd()();
} if (rf & 2) {
    const mk_r177 = ctx.$implicit;
    const ctx_r130 = ɵngcc0.ɵɵnextContext(2);
    ɵngcc0.ɵɵstyleProp("left", mk_r177.x, "%")("top", mk_r177.y, "%")("width", mk_r177.width, "%")("height", mk_r177.height, "%")("z-index", mk_r177.zIndex || 10);
    ɵngcc0.ɵɵclassProp("pff-active", ctx_r130.activeObjectId === mk_r177.id);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ctx_r130.activeObjectId === mk_r177.id);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵproperty("ngIf", mk_r177.markType === "check");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", mk_r177.markType === "cross");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", mk_r177.markType === "dot" || !mk_r177.markType);
} }
function PdfAnnotatorModalComponent_div_128_div_7_div_4_span_1_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "span");
    ɵngcc0.ɵɵtext(1);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const sig_r205 = ɵngcc0.ɵɵnextContext(2).$implicit;
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate(sig_r205.signDate);
} }
function PdfAnnotatorModalComponent_div_128_div_7_div_4_span_2_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "span");
    ɵngcc0.ɵɵtext(1);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const sig_r205 = ɵngcc0.ɵɵnextContext(2).$implicit;
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate(sig_r205.signTime);
} }
function PdfAnnotatorModalComponent_div_128_div_7_div_4_span_3_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "span", 316);
    ɵngcc0.ɵɵtext(1);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const sig_r205 = ɵngcc0.ɵɵnextContext(2).$implicit;
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate(sig_r205.digitalId);
} }
function PdfAnnotatorModalComponent_div_128_div_7_div_4_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "div", 314);
    ɵngcc0.ɵɵtemplate(1, PdfAnnotatorModalComponent_div_128_div_7_div_4_span_1_Template, 2, 1, "span", 121);
    ɵngcc0.ɵɵtemplate(2, PdfAnnotatorModalComponent_div_128_div_7_div_4_span_2_Template, 2, 1, "span", 121);
    ɵngcc0.ɵɵtemplate(3, PdfAnnotatorModalComponent_div_128_div_7_div_4_span_3_Template, 2, 1, "span", 315);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const sig_r205 = ɵngcc0.ɵɵnextContext().$implicit;
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", sig_r205.signDate);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", sig_r205.signTime);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", sig_r205.digitalId);
} }
function PdfAnnotatorModalComponent_div_128_div_7_Template(rf, ctx) { if (rf & 1) {
    const _r215 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 312);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_7_Template_div_pointerdown_0_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r215); const sig_r205 = restoredCtx.$implicit; const ctx_r214 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r214.startSignatureDrag($event, sig_r205.id)); })("contextmenu", function PdfAnnotatorModalComponent_div_128_div_7_Template_div_contextmenu_0_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r215); const sig_r205 = restoredCtx.$implicit; const ctx_r216 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r216.onContextMenu($event, sig_r205.id, "signature")); });
    ɵngcc0.ɵɵelementStart(1, "button", 270);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_128_div_7_Template_button_click_1_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r215); const sig_r205 = restoredCtx.$implicit; const ctx_r217 = ɵngcc0.ɵɵnextContext(2); ctx_r217.removeSignature(sig_r205.id); return ɵngcc0.ɵɵresetView($event.stopPropagation()); });
    ɵngcc0.ɵɵelement(2, "ion-icon", 106);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelement(3, "img", 287);
    ɵngcc0.ɵɵtemplate(4, PdfAnnotatorModalComponent_div_128_div_7_div_4_Template, 4, 3, "div", 313);
    ɵngcc0.ɵɵelementStart(5, "div", 275);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_7_Template_div_pointerdown_5_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r215); const sig_r205 = restoredCtx.$implicit; const ctx_r218 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r218.startSignatureResize($event, sig_r205.id, "nw")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(6, "div", 276);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_7_Template_div_pointerdown_6_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r215); const sig_r205 = restoredCtx.$implicit; const ctx_r219 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r219.startSignatureResize($event, sig_r205.id, "n")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(7, "div", 277);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_7_Template_div_pointerdown_7_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r215); const sig_r205 = restoredCtx.$implicit; const ctx_r220 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r220.startSignatureResize($event, sig_r205.id, "ne")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(8, "div", 278);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_7_Template_div_pointerdown_8_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r215); const sig_r205 = restoredCtx.$implicit; const ctx_r221 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r221.startSignatureResize($event, sig_r205.id, "e")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(9, "div", 279);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_7_Template_div_pointerdown_9_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r215); const sig_r205 = restoredCtx.$implicit; const ctx_r222 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r222.startSignatureResize($event, sig_r205.id, "se")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(10, "div", 280);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_7_Template_div_pointerdown_10_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r215); const sig_r205 = restoredCtx.$implicit; const ctx_r223 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r223.startSignatureResize($event, sig_r205.id, "s")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(11, "div", 281);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_7_Template_div_pointerdown_11_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r215); const sig_r205 = restoredCtx.$implicit; const ctx_r224 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r224.startSignatureResize($event, sig_r205.id, "sw")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(12, "div", 282);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_7_Template_div_pointerdown_12_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r215); const sig_r205 = restoredCtx.$implicit; const ctx_r225 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r225.startSignatureResize($event, sig_r205.id, "w")); });
    ɵngcc0.ɵɵelementEnd()();
} if (rf & 2) {
    const sig_r205 = ctx.$implicit;
    const ctx_r131 = ɵngcc0.ɵɵnextContext(2);
    ɵngcc0.ɵɵstyleProp("left", sig_r205.x, "%")("top", sig_r205.y, "%")("width", sig_r205.width, "%")("height", sig_r205.height, "%")("z-index", sig_r205.zIndex || 10);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵproperty("src", sig_r205.dataUrl, ɵngcc0.ɵɵsanitizeUrl);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ctx_r131.showDigitalId && (sig_r205.digitalId || sig_r205.signDate));
} }
function PdfAnnotatorModalComponent_div_128_div_8_div_1_ng_container_11_Template(rf, ctx) { if (rf & 1) {
    const _r234 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementContainerStart(0);
    ɵngcc0.ɵɵelementStart(1, "span", 301);
    ɵngcc0.ɵɵtext(2, "A");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(3, "button", 321);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_128_div_8_div_1_ng_container_11_Template_button_click_3_listener() { ɵngcc0.ɵɵrestoreView(_r234); const ff_r226 = ɵngcc0.ɵɵnextContext(2).$implicit; const ctx_r232 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r232.changeFormFieldFontSize(ff_r226.id, -2)); });
    ɵngcc0.ɵɵelement(4, "ion-icon", 160);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(5, "span", 304);
    ɵngcc0.ɵɵtext(6);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(7, "button", 322);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_128_div_8_div_1_ng_container_11_Template_button_click_7_listener() { ɵngcc0.ɵɵrestoreView(_r234); const ff_r226 = ɵngcc0.ɵɵnextContext(2).$implicit; const ctx_r235 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r235.changeFormFieldFontSize(ff_r226.id, 2)); });
    ɵngcc0.ɵɵelement(8, "ion-icon", 161);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelement(9, "div", 306);
    ɵngcc0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ff_r226 = ɵngcc0.ɵɵnextContext(2).$implicit;
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵproperty("disabled", (ff_r226.fontSize || 12) <= 6);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵtextInterpolate(ff_r226.fontSize || 12);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("disabled", (ff_r226.fontSize || 12) >= 72);
} }
function PdfAnnotatorModalComponent_div_128_div_8_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r241 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 300);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_8_div_1_Template_div_pointerdown_0_listener($event) { return $event.stopPropagation(); });
    ɵngcc0.ɵɵelementStart(1, "span", 301);
    ɵngcc0.ɵɵelement(2, "ion-icon", 302);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(3, "button", 303);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_128_div_8_div_1_Template_button_click_3_listener() { ɵngcc0.ɵɵrestoreView(_r241); const ff_r226 = ɵngcc0.ɵɵnextContext().$implicit; const ctx_r239 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r239.changeFormFieldSize(ff_r226.id, -0.5)); });
    ɵngcc0.ɵɵelement(4, "ion-icon", 160);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(5, "span", 304);
    ɵngcc0.ɵɵtext(6);
    ɵngcc0.ɵɵpipe(7, "number");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(8, "button", 305);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_128_div_8_div_1_Template_button_click_8_listener() { ɵngcc0.ɵɵrestoreView(_r241); const ff_r226 = ɵngcc0.ɵɵnextContext().$implicit; const ctx_r242 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r242.changeFormFieldSize(ff_r226.id, 0.5)); });
    ɵngcc0.ɵɵelement(9, "ion-icon", 161);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelement(10, "div", 306);
    ɵngcc0.ɵɵtemplate(11, PdfAnnotatorModalComponent_div_128_div_8_div_1_ng_container_11_Template, 10, 3, "ng-container", 121);
    ɵngcc0.ɵɵelementStart(12, "button", 320);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_128_div_8_div_1_Template_button_click_12_listener() { ɵngcc0.ɵɵrestoreView(_r241); const ff_r226 = ɵngcc0.ɵɵnextContext().$implicit; const ctx_r244 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r244.toggleFormFieldBorder(ff_r226.id)); });
    ɵngcc0.ɵɵelement(13, "ion-icon", 63);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(14, "button", 307);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_128_div_8_div_1_Template_button_click_14_listener() { ɵngcc0.ɵɵrestoreView(_r241); const ff_r226 = ɵngcc0.ɵɵnextContext().$implicit; const ctx_r246 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r246.removeFormField(ff_r226.id)); });
    ɵngcc0.ɵɵelement(15, "ion-icon", 153);
    ɵngcc0.ɵɵelementEnd()();
} if (rf & 2) {
    const ff_r226 = ɵngcc0.ɵɵnextContext().$implicit;
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵproperty("disabled", (ff_r226.type === "text" ? ff_r226.height : ff_r226.width) <= 1.5);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵtextInterpolate(ɵngcc0.ɵɵpipeBind2(7, 7, ff_r226.type === "text" ? ff_r226.height : ff_r226.width, "1.0-1"));
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵproperty("disabled", (ff_r226.type === "text" ? ff_r226.height : ff_r226.width) >= 30);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵproperty("ngIf", ff_r226.type === "text");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("pff-opt-active", ff_r226.borderVisible !== false);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("name", ff_r226.borderVisible !== false ? "square-outline" : "square");
} }
function PdfAnnotatorModalComponent_div_128_div_8_span_3_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "span", 323);
    ɵngcc0.ɵɵtext(1);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ff_r226 = ɵngcc0.ɵɵnextContext().$implicit;
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate1("Aa ", ff_r226.fontSize || 12, "pt");
} }
function PdfAnnotatorModalComponent_div_128_div_8__svg_svg_4_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵnamespaceSVG();
    ɵngcc0.ɵɵelementStart(0, "svg", 324);
    ɵngcc0.ɵɵelement(1, "rect", 325);
    ɵngcc0.ɵɵelementEnd();
} }
function PdfAnnotatorModalComponent_div_128_div_8__svg_svg_5_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵnamespaceSVG();
    ɵngcc0.ɵɵelementStart(0, "svg", 324);
    ɵngcc0.ɵɵelement(1, "circle", 326);
    ɵngcc0.ɵɵelementEnd();
} }
function PdfAnnotatorModalComponent_div_128_div_8_Template(rf, ctx) { if (rf & 1) {
    const _r251 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 317);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_8_Template_div_pointerdown_0_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r251); const ff_r226 = restoredCtx.$implicit; const ctx_r250 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r250.startFormFieldDrag($event, ff_r226.id)); });
    ɵngcc0.ɵɵtemplate(1, PdfAnnotatorModalComponent_div_128_div_8_div_1_Template, 16, 10, "div", 289);
    ɵngcc0.ɵɵelementStart(2, "div", 290);
    ɵngcc0.ɵɵtemplate(3, PdfAnnotatorModalComponent_div_128_div_8_span_3_Template, 2, 1, "span", 318);
    ɵngcc0.ɵɵtemplate(4, PdfAnnotatorModalComponent_div_128_div_8__svg_svg_4_Template, 2, 0, "svg", 319);
    ɵngcc0.ɵɵtemplate(5, PdfAnnotatorModalComponent_div_128_div_8__svg_svg_5_Template, 2, 0, "svg", 319);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(6, "div", 292);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_8_Template_div_pointerdown_6_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r251); const ff_r226 = restoredCtx.$implicit; const ctx_r252 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r252.startFormFieldResize($event, ff_r226.id, "nw")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(7, "div", 293);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_8_Template_div_pointerdown_7_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r251); const ff_r226 = restoredCtx.$implicit; const ctx_r253 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r253.startFormFieldResize($event, ff_r226.id, "n")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(8, "div", 294);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_8_Template_div_pointerdown_8_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r251); const ff_r226 = restoredCtx.$implicit; const ctx_r254 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r254.startFormFieldResize($event, ff_r226.id, "ne")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(9, "div", 295);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_8_Template_div_pointerdown_9_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r251); const ff_r226 = restoredCtx.$implicit; const ctx_r255 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r255.startFormFieldResize($event, ff_r226.id, "e")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(10, "div", 296);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_8_Template_div_pointerdown_10_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r251); const ff_r226 = restoredCtx.$implicit; const ctx_r256 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r256.startFormFieldResize($event, ff_r226.id, "se")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(11, "div", 297);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_8_Template_div_pointerdown_11_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r251); const ff_r226 = restoredCtx.$implicit; const ctx_r257 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r257.startFormFieldResize($event, ff_r226.id, "s")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(12, "div", 298);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_8_Template_div_pointerdown_12_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r251); const ff_r226 = restoredCtx.$implicit; const ctx_r258 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r258.startFormFieldResize($event, ff_r226.id, "sw")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(13, "div", 299);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_8_Template_div_pointerdown_13_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r251); const ff_r226 = restoredCtx.$implicit; const ctx_r259 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r259.startFormFieldResize($event, ff_r226.id, "w")); });
    ɵngcc0.ɵɵelementEnd()();
} if (rf & 2) {
    const ff_r226 = ctx.$implicit;
    const ctx_r132 = ɵngcc0.ɵɵnextContext(2);
    ɵngcc0.ɵɵstyleProp("left", ff_r226.x, "%")("top", ff_r226.y, "%")("width", ff_r226.width, "%")("height", ff_r226.height, "%")("z-index", ff_r226.zIndex || 20);
    ɵngcc0.ɵɵclassProp("pff-text", ff_r226.type === "text")("pff-checkbox", ff_r226.type === "checkbox")("pff-radio", ff_r226.type === "radio")("pff-no-border", ff_r226.borderVisible === false)("pff-active", ctx_r132.activeFormFieldId === ff_r226.id);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ctx_r132.activeFormFieldId === ff_r226.id);
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵproperty("ngIf", ff_r226.type === "text");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ff_r226.type === "checkbox");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ff_r226.type === "radio");
} }
function PdfAnnotatorModalComponent_div_128_div_9_Template(rf, ctx) { if (rf & 1) {
    const _r262 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 327);
    ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_div_128_div_9_Template_div_pointerdown_0_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r262); const ds_r260 = restoredCtx.$implicit; const ctx_r261 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r261.startDateDrag($event, ds_r260.id)); })("contextmenu", function PdfAnnotatorModalComponent_div_128_div_9_Template_div_contextmenu_0_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r262); const ds_r260 = restoredCtx.$implicit; const ctx_r263 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r263.onContextMenu($event, ds_r260.id, "date")); });
    ɵngcc0.ɵɵelementStart(1, "button", 270);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_128_div_9_Template_button_click_1_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r262); const ds_r260 = restoredCtx.$implicit; const ctx_r264 = ɵngcc0.ɵɵnextContext(2); ctx_r264.removeDateStamp(ds_r260.id); return ɵngcc0.ɵɵresetView($event.stopPropagation()); });
    ɵngcc0.ɵɵelement(2, "ion-icon", 106);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(3);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ds_r260 = ctx.$implicit;
    const ctx_r133 = ɵngcc0.ɵɵnextContext(2);
    ɵngcc0.ɵɵstyleProp("left", ds_r260.x, "%")("top", ds_r260.y, "%")("color", ds_r260.color)("font-size", ds_r260.fontSize * ctx_r133.zoom, "px")("z-index", ds_r260.zIndex || 10);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵtextInterpolate1(" ", ds_r260.text, " ");
} }
function PdfAnnotatorModalComponent_div_128_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "div", 255);
    ɵngcc0.ɵɵelement(1, "canvas", 256)(2, "canvas", 257);
    ɵngcc0.ɵɵtemplate(3, PdfAnnotatorModalComponent_div_128_div_3_Template, 4, 23, "div", 258);
    ɵngcc0.ɵɵtemplate(4, PdfAnnotatorModalComponent_div_128_div_4_Template, 16, 15, "div", 259);
    ɵngcc0.ɵɵtemplate(5, PdfAnnotatorModalComponent_div_128_div_5_Template, 12, 11, "div", 260);
    ɵngcc0.ɵɵtemplate(6, PdfAnnotatorModalComponent_div_128_div_6_Template, 15, 16, "div", 261);
    ɵngcc0.ɵɵtemplate(7, PdfAnnotatorModalComponent_div_128_div_7_Template, 13, 12, "div", 262);
    ɵngcc0.ɵɵtemplate(8, PdfAnnotatorModalComponent_div_128_div_8_Template, 14, 24, "div", 263);
    ɵngcc0.ɵɵtemplate(9, PdfAnnotatorModalComponent_div_128_div_9_Template, 4, 11, "div", 264);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r126 = ctx.$implicit;
    const ctx_r15 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("id", "page-" + p_r126);
    ɵngcc0.ɵɵattribute("data-page", p_r126);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("id", "pdfCanvas-" + p_r126);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("tools-active", ctx_r15.toolMode !== "none");
    ɵngcc0.ɵɵproperty("id", "annotCanvas-" + p_r126);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngForOf", ctx_r15.getTextBoxesForPage(p_r126));
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngForOf", ctx_r15.getShapeStampsForPage(p_r126));
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngForOf", ctx_r15.getRegularImageStampsForPage(p_r126));
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngForOf", ctx_r15.getMarkStampsForPage(p_r126));
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngForOf", ctx_r15.getSignatureStampsForPage(p_r126));
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngForOf", ctx_r15.getFormFieldsForPage(p_r126));
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngForOf", ctx_r15.getDateStampsForPage(p_r126));
} }
function PdfAnnotatorModalComponent_div_141_div_1_div_269_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "div", 334)(1, "h4", 335);
    ɵngcc0.ɵɵelement(2, "ion-icon", 389);
    ɵngcc0.ɵɵtext(3, " ประกาศเพิ่มเติม");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(4, "div", 390);
    ɵngcc0.ɵɵtext(5);
    ɵngcc0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r267 = ɵngcc0.ɵɵnextContext(3);
    ɵngcc0.ɵɵadvance(5);
    ɵngcc0.ɵɵtextInterpolate(ctx_r267.userGuideContent);
} }
function PdfAnnotatorModalComponent_div_141_div_1_button_270_Template(rf, ctx) { if (rf & 1) {
    const _r270 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 391);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_141_div_1_button_270_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r270); const ctx_r269 = ɵngcc0.ɵɵnextContext(3); return ɵngcc0.ɵɵresetView(ctx_r269.editGuide()); });
    ɵngcc0.ɵɵelement(1, "ion-icon", 392);
    ɵngcc0.ɵɵtext(2, " อัปเดตประกาศเพิ่มเติม ");
    ɵngcc0.ɵɵelementEnd();
} }
function PdfAnnotatorModalComponent_div_141_div_1_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "div", 331)(1, "div", 332);
    ɵngcc0.ɵɵelement(2, "ion-icon", 333);
    ɵngcc0.ɵɵelementStart(3, "div")(4, "strong");
    ɵngcc0.ɵɵtext(5, "เริ่มต้นง่ายมาก!");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(6, " เลือกเครื่องมือจากแถบด้านบน แล้วคลิกหรือลากบนเอกสารได้เลย — กด ");
    ɵngcc0.ɵɵelementStart(7, "code");
    ɵngcc0.ɵɵtext(8, "Ctrl+Z");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(9, " เพื่อย้อนกลับเสมอหากทำพลาด ");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(10, "div", 334)(11, "h4", 335);
    ɵngcc0.ɵɵelement(12, "ion-icon", 336);
    ɵngcc0.ɵɵtext(13, " ข้อความ (Text) ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(14, "div", 337)(15, "div", 338)(16, "div", 339);
    ɵngcc0.ɵɵtext(17, "1");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(18, "div", 340);
    ɵngcc0.ɵɵtext(19, "กดไอคอน ");
    ɵngcc0.ɵɵelement(20, "ion-icon", 341);
    ɵngcc0.ɵɵtext(21, " แล้วเลือก ");
    ɵngcc0.ɵɵelementStart(22, "strong");
    ɵngcc0.ɵɵtext(23, "ขนาดตัวอักษร");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(24, " และ ");
    ɵngcc0.ɵɵelementStart(25, "strong");
    ɵngcc0.ɵɵtext(26, "สี");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(27, " ที่ต้องการก่อนวาง");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(28, "div", 338)(29, "div", 339);
    ɵngcc0.ɵɵtext(30, "2");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(31, "div", 340);
    ɵngcc0.ɵɵtext(32, "คลิกบนเอกสาร PDF — กล่องข้อความจะปรากฏทันที พิมพ์ข้อความได้เลย ");
    ɵngcc0.ɵɵelementStart(33, "strong");
    ɵngcc0.ɵɵtext(34, "กล่องจะขยายตามข้อความอัตโนมัติ");
    ɵngcc0.ɵɵelementEnd()()();
    ɵngcc0.ɵɵelementStart(35, "div", 338);
    ɵngcc0.ɵɵelement(36, "ion-icon", 342);
    ɵngcc0.ɵɵelementStart(37, "div", 340)(38, "strong");
    ɵngcc0.ɵɵtext(39, "ย้ายตำแหน่ง:");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(40, " จับที่ ");
    ɵngcc0.ɵɵelementStart(41, "em");
    ɵngcc0.ɵɵtext(42, "เส้นขอบ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(43, " กล่องแล้วลากไปวางได้ทุกที่ (cursor จะเปลี่ยนเป็นลูกศร 4 ทิศ)");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(44, "div", 338);
    ɵngcc0.ɵɵelement(45, "ion-icon", 343);
    ɵngcc0.ɵɵelementStart(46, "div", 340)(47, "strong");
    ɵngcc0.ɵɵtext(48, "ปรับความกว้าง:");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(49, " ลากวงกลมสีฟ้า ");
    ɵngcc0.ɵɵelement(50, "span", 344);
    ɵngcc0.ɵɵtext(51, " ที่ซ้ายหรือขวากล่อง — ความสูงจะปรับตามข้อความเอง");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(52, "div", 338);
    ɵngcc0.ɵɵelement(53, "ion-icon", 345);
    ɵngcc0.ɵɵelementStart(54, "div", 340)(55, "strong");
    ɵngcc0.ɵɵtext(56, "ลบกล่องข้อความ:");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(57, " คลิกที่เส้นขอบกล่องเพื่อเลือก แล้วกด ");
    ɵngcc0.ɵɵelementStart(58, "code");
    ɵngcc0.ɵɵtext(59, "Delete");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(60, " หรือคลิกขวาเพื่อดูเมนู");
    ɵngcc0.ɵɵelementEnd()()()();
    ɵngcc0.ɵɵelementStart(61, "div", 334)(62, "h4", 335);
    ɵngcc0.ɵɵelement(63, "ion-icon", 346);
    ɵngcc0.ɵɵtext(64, " วาด / ไฮไลท์ / ยางลบ ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(65, "div", 337)(66, "div", 338);
    ɵngcc0.ɵɵelement(67, "ion-icon", 347);
    ɵngcc0.ɵɵelementStart(68, "div", 340)(69, "strong");
    ɵngcc0.ɵɵtext(70, "ปากกา / ดินสอ:");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(71, " ลากเพื่อวาดอิสระ — ปรับ ");
    ɵngcc0.ɵɵelementStart(72, "strong");
    ɵngcc0.ɵɵtext(73, "ขนาดเส้น");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(74, " และ ");
    ɵngcc0.ɵɵelementStart(75, "strong");
    ɵngcc0.ɵɵtext(76, "สี");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(77, " จากแถบด้านบน เส้นจะรวมเป็น object เดียวเมื่อยกปากกา");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(78, "div", 338);
    ɵngcc0.ɵɵelement(79, "ion-icon", 348);
    ɵngcc0.ɵɵelementStart(80, "div", 340)(81, "strong");
    ɵngcc0.ɵɵtext(82, "ไฮไลท์:");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(83, " ลากทับข้อความเพื่อเน้นสี — มีสีให้เลือก 6 สี หรือกำหนดสีเองได้ ปรับความหนาได้ตามต้องการ");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(84, "div", 338);
    ɵngcc0.ɵɵelement(85, "ion-icon", 349);
    ɵngcc0.ɵɵelementStart(86, "div", 340)(87, "strong");
    ɵngcc0.ɵɵtext(88, "ยางลบ:");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(89, " ลากผ่านเส้นวาดหรือไฮไลท์เพื่อลบ — ปรับขนาดยางลบได้จากแถบด้านบน");
    ɵngcc0.ɵɵelementEnd()()()();
    ɵngcc0.ɵɵelementStart(90, "div", 334)(91, "h4", 335);
    ɵngcc0.ɵɵelement(92, "ion-icon", 350);
    ɵngcc0.ɵɵtext(93, " รูปร่างและเส้น (Shapes) ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(94, "div", 337)(95, "div", 338);
    ɵngcc0.ɵɵelement(96, "ion-icon", 351);
    ɵngcc0.ɵɵelementStart(97, "div", 340)(98, "strong");
    ɵngcc0.ɵɵtext(99, "4 แบบ:");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(100, " สี่เหลี่ยม ");
    ɵngcc0.ɵɵelement(101, "ion-icon", 352);
    ɵngcc0.ɵɵtext(102, " วงกลม ");
    ɵngcc0.ɵɵelement(103, "ion-icon", 353);
    ɵngcc0.ɵɵtext(104, " เส้นตรง ");
    ɵngcc0.ɵɵelement(105, "ion-icon", 354);
    ɵngcc0.ɵɵtext(106, " ลูกศร ");
    ɵngcc0.ɵɵelement(107, "ion-icon", 355);
    ɵngcc0.ɵɵtext(108, " — กดลูกศรเล็กเพื่อเลือกแบบ แล้ว");
    ɵngcc0.ɵɵelementStart(109, "strong");
    ɵngcc0.ɵɵtext(110, "ลากบนเอกสาร");
    ɵngcc0.ɵɵelementEnd()()();
    ɵngcc0.ɵɵelementStart(111, "div", 338);
    ɵngcc0.ɵɵelement(112, "ion-icon", 356);
    ɵngcc0.ɵɵelementStart(113, "div", 340)(114, "strong");
    ɵngcc0.ɵɵtext(115, "ปรับสีและขนาดเส้น:");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(116, " ตั้งค่าสีขอบ, สีพื้น, และความหนาเส้นได้จากแถบด้านบน รองรับการปิดเส้นขอบหรือปิดสีพื้นแยกกันได้");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(117, "div", 338);
    ɵngcc0.ɵɵelement(118, "ion-icon", 357);
    ɵngcc0.ɵɵelementStart(119, "div", 340)(120, "strong");
    ɵngcc0.ɵɵtext(121, "ย้ายและปรับขนาด:");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(122, " ลากตรงกลางเพื่อย้าย — ลาก handle 8 จุดรอบรูปร่างเพื่อปรับขนาด — คลิกขวาเพื่อจัดลำดับชั้น");
    ɵngcc0.ɵɵelementEnd()()()();
    ɵngcc0.ɵɵelementStart(123, "div", 334)(124, "h4", 335);
    ɵngcc0.ɵɵelement(125, "ion-icon", 358);
    ɵngcc0.ɵɵtext(126, " ลายเซ็น (Signature) ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(127, "div", 337)(128, "div", 338);
    ɵngcc0.ɵɵelement(129, "ion-icon", 359);
    ɵngcc0.ɵɵelementStart(130, "div", 340)(131, "strong");
    ɵngcc0.ɵɵtext(132, "วาดลายเซ็น:");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(133, " กด ");
    ɵngcc0.ɵɵelement(134, "ion-icon", 360);
    ɵngcc0.ɵɵtext(135, " เพื่อเปิดหน้าต่างวาด — ปรับสีและขนาดปากกา — กด ");
    ɵngcc0.ɵɵelementStart(136, "strong");
    ɵngcc0.ɵɵtext(137, "\"ใช้ครั้งนี้\"");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(138, " เพื่อวางบนเอกสาร");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(139, "div", 338);
    ɵngcc0.ɵɵelement(140, "ion-icon", 361);
    ɵngcc0.ɵɵelementStart(141, "div", 340)(142, "strong");
    ɵngcc0.ɵɵtext(143, "บันทึกลายเซ็น:");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(144, " กด ");
    ɵngcc0.ɵɵelementStart(145, "strong");
    ɵngcc0.ɵɵtext(146, "\"บันทึกไว้ใช้ภายหลัง\"");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(147, " เพื่อเก็บลายเซ็นไว้ในระบบ — ครั้งถัดไปกดเลือกจากรายการได้ทันที");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(148, "div", 338);
    ɵngcc0.ɵɵelement(149, "ion-icon", 362);
    ɵngcc0.ɵɵelementStart(150, "div", 340)(151, "strong");
    ɵngcc0.ɵɵtext(152, "Digital ID (DID):");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(153, " กดปุ่ม ");
    ɵngcc0.ɵɵelementStart(154, "code");
    ɵngcc0.ɵɵtext(155, "DID");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(156, " เพื่อแสดง/ซ่อนข้อมูล Digital ID ใต้ลายเซ็น (วันที่, เวลา, รหัสผู้ใช้)");
    ɵngcc0.ɵɵelementEnd()()()();
    ɵngcc0.ɵɵelementStart(157, "div", 334)(158, "h4", 335);
    ɵngcc0.ɵɵelement(159, "ion-icon", 363);
    ɵngcc0.ɵɵtext(160, " วันที่ และรูปภาพ ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(161, "div", 337)(162, "div", 338);
    ɵngcc0.ɵɵelement(163, "ion-icon", 364);
    ɵngcc0.ɵɵelementStart(164, "div", 340)(165, "strong");
    ɵngcc0.ɵɵtext(166, "วันที่อัตโนมัติ:");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(167, " กด ");
    ɵngcc0.ɵɵelement(168, "ion-icon", 365);
    ɵngcc0.ɵɵtext(169, " เพื่อแทรกวันที่ปัจจุบัน — ปรับขนาดและสีตัวอักษรได้ — ลากเพื่อย้ายตำแหน่ง");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(170, "div", 338);
    ɵngcc0.ɵɵelement(171, "ion-icon", 366);
    ɵngcc0.ɵɵelementStart(172, "div", 340)(173, "strong");
    ɵngcc0.ɵɵtext(174, "แทรกรูปภาพ:");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(175, " กด ");
    ɵngcc0.ɵɵelement(176, "ion-icon", 367);
    ɵngcc0.ɵɵtext(177, " เพื่อเลือกไฟล์รูปจากเครื่อง — ลากเพื่อย้าย ลาก handle 8 จุดเพื่อปรับขนาด");
    ɵngcc0.ɵɵelementEnd()()()();
    ɵngcc0.ɵɵelementStart(178, "div", 334)(179, "h4", 335);
    ɵngcc0.ɵɵelement(180, "ion-icon", 368);
    ɵngcc0.ɵɵtext(181, " จัดการหน้าเอกสาร ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(182, "div", 337)(183, "div", 338);
    ɵngcc0.ɵɵelement(184, "ion-icon", 369);
    ɵngcc0.ɵɵelementStart(185, "div", 340)(186, "strong");
    ɵngcc0.ɵɵtext(187, "Thumbnail ด้านซ้าย:");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(188, " กด ");
    ɵngcc0.ɵɵelement(189, "ion-icon", 370);
    ɵngcc0.ɵɵtext(190, " เพื่อแสดง — คลิก thumbnail เพื่อกระโดดไปหน้านั้น — ลาก ");
    ɵngcc0.ɵɵelement(191, "ion-icon", 371)(192, "ion-icon", 372);
    ɵngcc0.ɵɵtext(193, " เพื่อเรียงลำดับหน้า");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(194, "div", 338);
    ɵngcc0.ɵɵelement(195, "ion-icon", 373);
    ɵngcc0.ɵɵelementStart(196, "div", 340)(197, "strong");
    ɵngcc0.ɵɵtext(198, "แทรก/ลบหน้า:");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(199, " กดไอคอน ");
    ɵngcc0.ɵɵelement(200, "ion-icon", 374);
    ɵngcc0.ɵɵtext(201, " บนแถบด้านบน — แทรกหน้าเปล่าแนวตั้ง/แนวนอน ก่อนหรือหลังหน้าปัจจุบัน — ลบหน้าที่ไม่ต้องการ — ย้อนกลับได้");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(202, "div", 338);
    ɵngcc0.ɵɵelement(203, "ion-icon", 375);
    ɵngcc0.ɵɵelementStart(204, "div", 340)(205, "strong");
    ɵngcc0.ɵɵtext(206, "ซูม:");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(207, " กดปุ่ม ");
    ɵngcc0.ɵɵelementStart(208, "code");
    ɵngcc0.ɵɵtext(209, "+");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(210, " / ");
    ɵngcc0.ɵɵelementStart(211, "code");
    ɵngcc0.ɵɵtext(212, "−");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(213, " หรือใช้ปุ่มซูมบนแถบนำทาง — รองรับตั้งแต่ 50% ถึง 300%");
    ɵngcc0.ɵɵelementEnd()()()();
    ɵngcc0.ɵɵelementStart(214, "div", 334)(215, "h4", 335);
    ɵngcc0.ɵɵelement(216, "ion-icon", 376);
    ɵngcc0.ɵɵtext(217, " คีย์ลัดที่ควรรู้ ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(218, "div", 377)(219, "div", 378)(220, "div", 379)(221, "kbd");
    ɵngcc0.ɵɵtext(222, "Ctrl");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(223, "span");
    ɵngcc0.ɵɵtext(224, "+");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(225, "kbd");
    ɵngcc0.ɵɵtext(226, "Z");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(227, "div", 380);
    ɵngcc0.ɵɵtext(228, "ย้อนกลับ (Undo)");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(229, "div", 378)(230, "div", 379)(231, "kbd");
    ɵngcc0.ɵɵtext(232, "Ctrl");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(233, "span");
    ɵngcc0.ɵɵtext(234, "+");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(235, "kbd");
    ɵngcc0.ɵɵtext(236, "Y");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(237, "div", 380);
    ɵngcc0.ɵɵtext(238, "ทำซ้ำ (Redo)");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(239, "div", 378)(240, "div", 379)(241, "kbd");
    ɵngcc0.ɵɵtext(242, "Delete");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(243, "div", 380);
    ɵngcc0.ɵɵtext(244, "ลบ object ที่เลือก");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(245, "div", 378)(246, "div", 379)(247, "kbd");
    ɵngcc0.ɵɵtext(248, "Esc");
    ɵngcc0.ɵɵelementEnd()();
    ɵngcc0.ɵɵelementStart(249, "div", 380);
    ɵngcc0.ɵɵtext(250, "ออกจากโหมดเครื่องมือ");
    ɵngcc0.ɵɵelementEnd()()()();
    ɵngcc0.ɵɵelementStart(251, "div", 381)(252, "div", 382);
    ɵngcc0.ɵɵelement(253, "ion-icon", 383);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(254, "div", 384)(255, "div", 385);
    ɵngcc0.ɵɵtext(256, "Pro Tips");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(257, "ul", 386)(258, "li");
    ɵngcc0.ɵɵtext(259, "คลิกขวาบน object ใด ๆ เพื่อจัดลำดับชั้น (Bring to Front / Send to Back)");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(260, "li");
    ɵngcc0.ɵɵtext(261, "กด ");
    ɵngcc0.ɵɵelementStart(262, "code");
    ɵngcc0.ɵɵtext(263, "Esc");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtext(264, " เพื่อออกจากโหมดเครื่องมือและกลับสู่โหมดปกติ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(265, "li");
    ɵngcc0.ɵɵtext(266, "ไฮไลท์ที่วาดด้วย opacity ต่ำ — ใช้ไฮไลท์ซ้อนกันหลายชั้นเพื่อเน้นสีเข้มขึ้น");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(267, "li");
    ɵngcc0.ɵɵtext(268, "บันทึกลายเซ็นไว้ในระบบเพื่อใช้ซ้ำในเอกสารอื่น ๆ ได้สะดวก");
    ɵngcc0.ɵɵelementEnd()()()();
    ɵngcc0.ɵɵtemplate(269, PdfAnnotatorModalComponent_div_141_div_1_div_269_Template, 6, 1, "div", 387);
    ɵngcc0.ɵɵtemplate(270, PdfAnnotatorModalComponent_div_141_div_1_button_270_Template, 3, 0, "button", 388);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r265 = ɵngcc0.ɵɵnextContext(2);
    ɵngcc0.ɵɵadvance(269);
    ɵngcc0.ɵɵproperty("ngIf", ctx_r265.userGuideContent && ctx_r265.userGuideContent.trim() !== "");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ctx_r265.canManageGuide);
} }
function PdfAnnotatorModalComponent_div_141_div_2_Template(rf, ctx) { if (rf & 1) {
    const _r272 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 393)(1, "div", 394);
    ɵngcc0.ɵɵtext(2, "คุณสามารถพิมพ์ในรูปแบบข้อความธรรมดา หรือ Markdown (ถ้ามีการเชื่อมต่อตัวแปลง)");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(3, "textarea", 395);
    ɵngcc0.ɵɵlistener("ngModelChange", function PdfAnnotatorModalComponent_div_141_div_2_Template_textarea_ngModelChange_3_listener($event) { ɵngcc0.ɵɵrestoreView(_r272); const ctx_r271 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r271.tempGuideContent = $event); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(4, "div", 396)(5, "button", 397);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_141_div_2_Template_button_click_5_listener() { ɵngcc0.ɵɵrestoreView(_r272); const ctx_r273 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r273.cancelEditGuide()); });
    ɵngcc0.ɵɵtext(6, "ยกเลิก");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(7, "button", 398);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_141_div_2_Template_button_click_7_listener() { ɵngcc0.ɵɵrestoreView(_r272); const ctx_r274 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r274.saveGuide()); });
    ɵngcc0.ɵɵtext(8, "บันทึกอัปเดต");
    ɵngcc0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r266 = ɵngcc0.ɵɵnextContext(2);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵproperty("ngModel", ctx_r266.tempGuideContent);
} }
function PdfAnnotatorModalComponent_div_141_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "div", 328);
    ɵngcc0.ɵɵtemplate(1, PdfAnnotatorModalComponent_div_141_div_1_Template, 271, 2, "div", 329);
    ɵngcc0.ɵɵtemplate(2, PdfAnnotatorModalComponent_div_141_div_2_Template, 9, 1, "div", 330);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r16 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", !ctx_r16.isEditingGuide);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ctx_r16.isEditingGuide);
} }
function PdfAnnotatorModalComponent_div_151_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "div", 399);
    ɵngcc0.ɵɵelement(1, "ion-spinner", 400);
    ɵngcc0.ɵɵelementEnd();
} }
function PdfAnnotatorModalComponent_div_152_div_1_span_6_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "span", 411);
    ɵngcc0.ɵɵtext(1);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const h_r277 = ɵngcc0.ɵɵnextContext().$implicit;
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate1("หน้า ", h_r277.page_number, "");
} }
function PdfAnnotatorModalComponent_div_152_div_1_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "div", 404)(1, "div", 405);
    ɵngcc0.ɵɵelement(2, "ion-icon", 63);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(3, "div", 406)(4, "div", 407);
    ɵngcc0.ɵɵtext(5);
    ɵngcc0.ɵɵtemplate(6, PdfAnnotatorModalComponent_div_152_div_1_span_6_Template, 2, 1, "span", 408);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(7, "div", 409);
    ɵngcc0.ɵɵtext(8);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(9, "div", 410);
    ɵngcc0.ɵɵtext(10);
    ɵngcc0.ɵɵpipe(11, "date");
    ɵngcc0.ɵɵelementEnd()()();
} if (rf & 2) {
    const h_r277 = ctx.$implicit;
    const ctx_r275 = ɵngcc0.ɵɵnextContext(2);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassMap("hi-" + h_r277.action_type);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("name", ctx_r275.getHistoryActionIcon(h_r277.action_type));
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵtextInterpolate1(" ", ctx_r275.getHistoryActionLabel(h_r277.action_type), " ");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", h_r277.page_number > 0);
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵtextInterpolate(h_r277.user_name || h_r277.user_id || "ผู้ใช้");
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵtextInterpolate(ɵngcc0.ɵɵpipeBind2(11, 7, h_r277.created_at, "dd/MM/yyyy HH:mm"));
} }
function PdfAnnotatorModalComponent_div_152_div_2_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "div", 412);
    ɵngcc0.ɵɵelement(1, "ion-icon", 40);
    ɵngcc0.ɵɵelementStart(2, "p");
    ɵngcc0.ɵɵtext(3, "ยังไม่มีประวัติ");
    ɵngcc0.ɵɵelementEnd()();
} }
function PdfAnnotatorModalComponent_div_152_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "div", 401);
    ɵngcc0.ɵɵtemplate(1, PdfAnnotatorModalComponent_div_152_div_1_Template, 12, 10, "div", 402);
    ɵngcc0.ɵɵtemplate(2, PdfAnnotatorModalComponent_div_152_div_2_Template, 4, 0, "div", 403);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r18 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngForOf", ctx_r18.historyEntries);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ctx_r18.historyEntries.length === 0);
} }
function PdfAnnotatorModalComponent_div_155_Template(rf, ctx) { if (rf & 1) {
    const _r282 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 413)(1, "div", 414);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_155_Template_div_click_1_listener() { ɵngcc0.ɵɵrestoreView(_r282); const ctx_r281 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r281.closeSignaturePad()); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(2, "div", 415)(3, "h3");
    ɵngcc0.ɵɵtext(4, "ลงลายเซ็น");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(5, "p", 416);
    ɵngcc0.ɵɵtext(6, "วาดลายเซ็นของคุณในกรอบด้านล่าง (ยกปากกาแล้ววาดต่อได้)");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(7, "div", 417)(8, "div", 418)(9, "span", 419);
    ɵngcc0.ɵɵtext(10, "สี:");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(11, "div", 162)(12, "div", 163);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_155_Template_div_click_12_listener() { ɵngcc0.ɵɵrestoreView(_r282); const ctx_r283 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r283.setSignaturePenColor("#000000")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(13, "div", 164);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_155_Template_div_click_13_listener() { ɵngcc0.ɵɵrestoreView(_r282); const ctx_r284 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r284.setSignaturePenColor("#0000FF")); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(14, "div", 165);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_155_Template_div_click_14_listener() { ɵngcc0.ɵɵrestoreView(_r282); const ctx_r285 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r285.setSignaturePenColor("#FF0000")); });
    ɵngcc0.ɵɵelementEnd()()();
    ɵngcc0.ɵɵelementStart(15, "div", 418)(16, "span", 419);
    ɵngcc0.ɵɵtext(17, "ขนาด:");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(18, "button", 420);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_155_Template_button_click_18_listener() { ɵngcc0.ɵɵrestoreView(_r282); const ctx_r286 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r286.changeSignaturePenSize(-0.5)); });
    ɵngcc0.ɵɵelement(19, "ion-icon", 160);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(20, "span", 421);
    ɵngcc0.ɵɵtext(21);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(22, "button", 420);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_155_Template_button_click_22_listener() { ɵngcc0.ɵɵrestoreView(_r282); const ctx_r287 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r287.changeSignaturePenSize(0.5)); });
    ɵngcc0.ɵɵelement(23, "ion-icon", 161);
    ɵngcc0.ɵɵelementEnd()()();
    ɵngcc0.ɵɵelement(24, "canvas", 422, 423);
    ɵngcc0.ɵɵelementStart(26, "div", 424)(27, "ion-button", 425);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_155_Template_ion_button_click_27_listener() { ɵngcc0.ɵɵrestoreView(_r282); const ctx_r288 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r288.clearSignaturePad()); });
    ɵngcc0.ɵɵelement(28, "ion-icon", 426);
    ɵngcc0.ɵɵtext(29, " ล้าง ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(30, "ion-button", 427);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_155_Template_ion_button_click_30_listener() { ɵngcc0.ɵɵrestoreView(_r282); const ctx_r289 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r289.closeSignaturePad()); });
    ɵngcc0.ɵɵelement(31, "ion-icon", 428);
    ɵngcc0.ɵɵtext(32, " ยกเลิก ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(33, "ion-button", 429);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_155_Template_ion_button_click_33_listener() { ɵngcc0.ɵɵrestoreView(_r282); const ctx_r290 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r290.triggerSignatureUpload()); });
    ɵngcc0.ɵɵelement(34, "ion-icon", 430);
    ɵngcc0.ɵɵtext(35, " อัพโหลดรูป ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(36, "ion-button", 431);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_155_Template_ion_button_click_36_listener() { ɵngcc0.ɵɵrestoreView(_r282); const ctx_r291 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r291.saveSignatureToDatabase()); });
    ɵngcc0.ɵɵelement(37, "ion-icon", 432);
    ɵngcc0.ɵɵtext(38, " บันทึกไว้ใช้ภายหลัง ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(39, "ion-button", 433);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_155_Template_ion_button_click_39_listener() { ɵngcc0.ɵɵrestoreView(_r282); const ctx_r292 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r292.saveSignature()); });
    ɵngcc0.ɵɵelement(40, "ion-icon", 434);
    ɵngcc0.ɵɵtext(41, " ใช้ครั้งนี้ ");
    ɵngcc0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r20 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵadvance(12);
    ɵngcc0.ɵɵclassProp("active", ctx_r20.signaturePenColor === "#000000");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("active", ctx_r20.signaturePenColor === "#0000FF");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵclassProp("active", ctx_r20.signaturePenColor === "#FF0000");
    ɵngcc0.ɵɵadvance(4);
    ɵngcc0.ɵɵproperty("disabled", ctx_r20.signaturePenSize <= 1);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵtextInterpolate(ctx_r20.signaturePenSize);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("disabled", ctx_r20.signaturePenSize >= 10);
} }
function PdfAnnotatorModalComponent_div_156_div_7_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "div", 444);
    ɵngcc0.ɵɵelement(1, "ion-spinner", 122);
    ɵngcc0.ɵɵelementStart(2, "span");
    ɵngcc0.ɵɵtext(3, "กำลังโหลด...");
    ɵngcc0.ɵɵelementEnd()();
} }
function PdfAnnotatorModalComponent_div_156_div_8_div_1_span_5_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "span", 456);
    ɵngcc0.ɵɵtext(1, "หลัก");
    ɵngcc0.ɵɵelementEnd();
} }
function PdfAnnotatorModalComponent_div_156_div_8_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r300 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 448);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_156_div_8_div_1_Template_div_click_0_listener() { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r300); const sig_r297 = restoredCtx.$implicit; const ctx_r299 = ɵngcc0.ɵɵnextContext(3); return ɵngcc0.ɵɵresetView(ctx_r299.useSavedSignature(sig_r297)); });
    ɵngcc0.ɵɵelement(1, "img", 240);
    ɵngcc0.ɵɵelementStart(2, "div", 449)(3, "span", 450);
    ɵngcc0.ɵɵtext(4);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtemplate(5, PdfAnnotatorModalComponent_div_156_div_8_div_1_span_5_Template, 2, 0, "span", 451);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(6, "div", 452)(7, "button", 453);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_156_div_8_div_1_Template_button_click_7_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r300); const sig_r297 = restoredCtx.$implicit; const ctx_r301 = ɵngcc0.ɵɵnextContext(3); return ɵngcc0.ɵɵresetView(ctx_r301.setDefaultSignature(sig_r297, $event)); });
    ɵngcc0.ɵɵelement(8, "ion-icon", 454);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(9, "button", 455);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_156_div_8_div_1_Template_button_click_9_listener($event) { const restoredCtx = ɵngcc0.ɵɵrestoreView(_r300); const sig_r297 = restoredCtx.$implicit; const ctx_r302 = ɵngcc0.ɵɵnextContext(3); return ɵngcc0.ɵɵresetView(ctx_r302.deleteSavedSignature(sig_r297, $event)); });
    ɵngcc0.ɵɵelement(10, "ion-icon", 91);
    ɵngcc0.ɵɵelementEnd()()();
} if (rf & 2) {
    const sig_r297 = ctx.$implicit;
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("src", sig_r297.signature_data, ɵngcc0.ɵɵsanitizeUrl)("alt", sig_r297.signature_name);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵtextInterpolate(sig_r297.signature_name);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", sig_r297.is_default);
    ɵngcc0.ɵɵadvance(2);
    ɵngcc0.ɵɵclassProp("active", sig_r297.is_default);
} }
function PdfAnnotatorModalComponent_div_156_div_8_div_2_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "div", 457);
    ɵngcc0.ɵɵelement(1, "ion-icon", 392);
    ɵngcc0.ɵɵelementStart(2, "p");
    ɵngcc0.ɵɵtext(3, "ยังไม่มีลายเซ็นที่บันทึกไว้");
    ɵngcc0.ɵɵelementEnd()();
} }
function PdfAnnotatorModalComponent_div_156_div_8_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "div", 445);
    ɵngcc0.ɵɵtemplate(1, PdfAnnotatorModalComponent_div_156_div_8_div_1_Template, 11, 6, "div", 446);
    ɵngcc0.ɵɵtemplate(2, PdfAnnotatorModalComponent_div_156_div_8_div_2_Template, 4, 0, "div", 447);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r294 = ɵngcc0.ɵɵnextContext(2);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngForOf", ctx_r294.savedSignatures);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ctx_r294.savedSignatures.length === 0);
} }
function PdfAnnotatorModalComponent_div_156_Template(rf, ctx) { if (rf & 1) {
    const _r304 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 435)(1, "div", 436);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_156_Template_div_click_1_listener() { ɵngcc0.ɵɵrestoreView(_r304); const ctx_r303 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r303.closeSignaturePicker()); });
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(2, "div", 437)(3, "h3");
    ɵngcc0.ɵɵtext(4, "เลือกลายเซ็น");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(5, "p", 438);
    ɵngcc0.ɵɵtext(6, "เลือกลายเซ็นที่บันทึกไว้ หรือวาดใหม่");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵtemplate(7, PdfAnnotatorModalComponent_div_156_div_7_Template, 4, 0, "div", 439);
    ɵngcc0.ɵɵtemplate(8, PdfAnnotatorModalComponent_div_156_div_8_Template, 3, 2, "div", 440);
    ɵngcc0.ɵɵelementStart(9, "div", 441)(10, "ion-button", 425);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_156_Template_ion_button_click_10_listener() { ɵngcc0.ɵɵrestoreView(_r304); const ctx_r305 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r305.closeSignaturePicker()); });
    ɵngcc0.ɵɵelement(11, "ion-icon", 428);
    ɵngcc0.ɵɵtext(12, " ปิด ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(13, "ion-button", 442);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_156_Template_ion_button_click_13_listener() { ɵngcc0.ɵɵrestoreView(_r304); const ctx_r306 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r306.triggerSignatureUpload()); });
    ɵngcc0.ɵɵelement(14, "ion-icon", 432);
    ɵngcc0.ɵɵtext(15, " อัพโหลดรูป ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(16, "ion-button", 433);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_156_Template_ion_button_click_16_listener() { ɵngcc0.ɵɵrestoreView(_r304); const ctx_r307 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r307.openSignaturePadFromPicker()); });
    ɵngcc0.ɵɵelement(17, "ion-icon", 443);
    ɵngcc0.ɵɵtext(18, " วาดลายเซ็นใหม่ ");
    ɵngcc0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r21 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵadvance(7);
    ɵngcc0.ɵɵproperty("ngIf", ctx_r21.isLoadingSignatures);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", !ctx_r21.isLoadingSignatures);
} }
function PdfAnnotatorModalComponent_div_157_div_13_ion_spinner_5_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelement(0, "ion-spinner", 475);
} }
function PdfAnnotatorModalComponent_div_157_div_13_span_6_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "span");
    ɵngcc0.ɵɵtext(1);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r312 = ɵngcc0.ɵɵnextContext(3);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵtextInterpolate1("แสดงทั้งหมด ", ctx_r312.previewTotalPages, " หน้า");
} }
function PdfAnnotatorModalComponent_div_157_div_13_span_7_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "span");
    ɵngcc0.ɵɵtext(1, "กำลังโหลด...");
    ɵngcc0.ɵɵelementEnd();
} }
function PdfAnnotatorModalComponent_div_157_div_13_Template(rf, ctx) { if (rf & 1) {
    const _r315 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 471);
    ɵngcc0.ɵɵelement(1, "ion-icon", 472);
    ɵngcc0.ɵɵelementStart(2, "span");
    ɵngcc0.ɵɵtext(3);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(4, "ion-button", 473);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_157_div_13_Template_ion_button_click_4_listener() { ɵngcc0.ɵɵrestoreView(_r315); const ctx_r314 = ɵngcc0.ɵɵnextContext(2); return ɵngcc0.ɵɵresetView(ctx_r314.loadAllPreviewPages()); });
    ɵngcc0.ɵɵtemplate(5, PdfAnnotatorModalComponent_div_157_div_13_ion_spinner_5_Template, 1, 0, "ion-spinner", 474);
    ɵngcc0.ɵɵtemplate(6, PdfAnnotatorModalComponent_div_157_div_13_span_6_Template, 2, 1, "span", 121);
    ɵngcc0.ɵɵtemplate(7, PdfAnnotatorModalComponent_div_157_div_13_span_7_Template, 2, 0, "span", 121);
    ɵngcc0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r308 = ɵngcc0.ɵɵnextContext(2);
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵtextInterpolate2("แสดงเฉพาะหน้าที่มีการแก้ไข (", ctx_r308.previewPages.length, " / ", ctx_r308.previewTotalPages, " หน้า)");
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("disabled", ctx_r308.isLoadingAllPreview);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ctx_r308.isLoadingAllPreview);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", !ctx_r308.isLoadingAllPreview);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ctx_r308.isLoadingAllPreview);
} }
function PdfAnnotatorModalComponent_div_157_div_14_img_1_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelement(0, "img", 478);
} if (rf & 2) {
    const page_r317 = ctx.$implicit;
    const i_r318 = ctx.index;
    ɵngcc0.ɵɵproperty("src", page_r317, ɵngcc0.ɵɵsanitizeUrl)("alt", "Page " + (i_r318 + 1));
} }
function PdfAnnotatorModalComponent_div_157_div_14_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "div", 476);
    ɵngcc0.ɵɵtemplate(1, PdfAnnotatorModalComponent_div_157_div_14_img_1_Template, 1, 2, "img", 477);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r309 = ɵngcc0.ɵɵnextContext(2);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngForOf", ctx_r309.previewPages);
} }
function PdfAnnotatorModalComponent_div_157_div_15_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelementStart(0, "div", 479);
    ɵngcc0.ɵɵelement(1, "ion-spinner", 122);
    ɵngcc0.ɵɵelementStart(2, "p");
    ɵngcc0.ɵɵtext(3, "กำลังโหลด Preview...");
    ɵngcc0.ɵɵelementEnd()();
} }
function PdfAnnotatorModalComponent_div_157_Template(rf, ctx) { if (rf & 1) {
    const _r320 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 458)(1, "div", 459)(2, "div", 460);
    ɵngcc0.ɵɵtext(3);
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(4, "div", 461)(5, "ion-button", 462);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_157_Template_ion_button_click_5_listener() { ɵngcc0.ɵɵrestoreView(_r320); const ctx_r319 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r319.backToEdit()); });
    ɵngcc0.ɵɵelement(6, "ion-icon", 463);
    ɵngcc0.ɵɵtext(7, " กลับไปแก้ไข ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(8, "ion-button", 464);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_157_Template_ion_button_click_8_listener() { ɵngcc0.ɵɵrestoreView(_r320); const ctx_r321 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r321.confirmSave()); });
    ɵngcc0.ɵɵelement(9, "ion-icon", 465);
    ɵngcc0.ɵɵtext(10);
    ɵngcc0.ɵɵelementEnd()()();
    ɵngcc0.ɵɵelementStart(11, "div", 466)(12, "div", 467);
    ɵngcc0.ɵɵtemplate(13, PdfAnnotatorModalComponent_div_157_div_13_Template, 8, 6, "div", 468);
    ɵngcc0.ɵɵtemplate(14, PdfAnnotatorModalComponent_div_157_div_14_Template, 2, 1, "div", 469);
    ɵngcc0.ɵɵtemplate(15, PdfAnnotatorModalComponent_div_157_div_15_Template, 4, 0, "div", 470);
    ɵngcc0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r22 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵtextInterpolate(ctx_r22.isCancelMode ? "ตรวจสอบเอกสารก่อนบันทึก" : "ตรวจสอบเอกสารก่อนลงนาม");
    ɵngcc0.ɵɵadvance(7);
    ɵngcc0.ɵɵtextInterpolate1(" ", ctx_r22.isCancelMode ? "ยืนยันการบันทึก" : "ยืนยันและลงนาม", " ");
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵproperty("ngIf", ctx_r22.previewIsFiltered || ctx_r22.isLoadingAllPreview);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ctx_r22.previewPages.length > 0);
    ɵngcc0.ɵɵadvance(1);
    ɵngcc0.ɵɵproperty("ngIf", ctx_r22.previewPages.length === 0);
} }
function PdfAnnotatorModalComponent_div_158_Template(rf, ctx) { if (rf & 1) {
    const _r323 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "div", 480)(1, "button", 481);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_158_Template_button_click_1_listener() { ɵngcc0.ɵɵrestoreView(_r323); const ctx_r322 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r322.contextBringToFront()); });
    ɵngcc0.ɵɵelement(2, "ion-icon", 482);
    ɵngcc0.ɵɵtext(3, " นำไปไว้หน้าสุด (Bring to Front) ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(4, "button", 481);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_158_Template_button_click_4_listener() { ɵngcc0.ɵɵrestoreView(_r323); const ctx_r324 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r324.contextBringForward()); });
    ɵngcc0.ɵɵelement(5, "ion-icon", 244);
    ɵngcc0.ɵɵtext(6, " นำไปข้างหน้า (Bring Forward) ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(7, "button", 481);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_158_Template_button_click_7_listener() { ɵngcc0.ɵɵrestoreView(_r323); const ctx_r325 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r325.contextSendBackward()); });
    ɵngcc0.ɵɵelement(8, "ion-icon", 246);
    ɵngcc0.ɵɵtext(9, " ส่งไปข้างหลัง (Send Backward) ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementStart(10, "button", 481);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_158_Template_button_click_10_listener() { ɵngcc0.ɵɵrestoreView(_r323); const ctx_r326 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r326.contextSendToBack()); });
    ɵngcc0.ɵɵelement(11, "ion-icon", 483);
    ɵngcc0.ɵɵtext(12, " ส่งไปไว้หลังสุด (Send to Back) ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelement(13, "div", 484);
    ɵngcc0.ɵɵelementStart(14, "button", 485);
    ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_div_158_Template_button_click_14_listener() { ɵngcc0.ɵɵrestoreView(_r323); const ctx_r327 = ɵngcc0.ɵɵnextContext(); return ɵngcc0.ɵɵresetView(ctx_r327.deleteContextMenuTarget()); });
    ɵngcc0.ɵɵelement(15, "ion-icon", 153);
    ɵngcc0.ɵɵtext(16, " ลบ (Delete) ");
    ɵngcc0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r23 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵstyleProp("left", ctx_r23.contextMenu.x, "px")("top", ctx_r23.contextMenu.y, "px");
} }
const PDF_ANNOTATOR_CONFIG = new InjectionToken('PDF_ANNOTATOR_CONFIG');

class PdfManagerService {
    constructor(http, config) {
        var _a;
        this.http = http;
        this.base = (_a = config === null || config === void 0 ? void 0 : config.pdfApiUrl) !== null && _a !== void 0 ? _a : 'http://localhost:3500/api';
    }
    listDocuments(userId, search) {
        let params = new HttpParams().set('userId', userId);
        if (search)
            params = params.set('search', search);
        return this.http.get(`${this.base}/pdf/list`, { params });
    }
    uploadDocument(file, userId, userName) {
        const form = new FormData();
        form.append('pdf', file);
        form.append('userId', userId);
        if (userName)
            form.append('userName', userName);
        return this.http.post(`${this.base}/pdf/upload`, form);
    }
    getPdfUrl(docId) {
        return `${this.base}/pdf/${docId}`;
    }
    saveAnnotatedPdf(docId, pdfBlob, userId, fileName, annotationSummary, userName) {
        const form = new FormData();
        form.append('pdf', pdfBlob, fileName);
        form.append('userId', userId);
        if (userName)
            form.append('userName', userName);
        if (annotationSummary)
            form.append('annotationSummary', JSON.stringify(annotationSummary));
        return this.http.post(`${this.base}/pdf/${docId}/save`, form);
    }
    getDocumentInfo(docId) {
        return this.http.get(`${this.base}/pdf/${docId}/info`);
    }
    deleteDocument(docId) {
        return this.http.delete(`${this.base}/pdf/${docId}`);
    }
    logAction(payload) {
        return this.http.post(`${this.base}/history`, payload);
    }
    getHistory(docId, limit = 100, offset = 0) {
        const params = new HttpParams().set('limit', limit).set('offset', offset);
        return this.http.get(`${this.base}/history/${docId}`, { params });
    }
    getHistorySummary(docId) {
        return this.http.get(`${this.base}/history/${docId}/summary`);
    }
    getSignatures(userId) {
        return this.http.get(`${this.base}/signatures/${userId}`);
    }
    saveSignature(userId, signatureData, signatureName, isDefault) {
        return this.http.post(`${this.base}/signatures`, {
            userId, signatureData, signatureName, isDefault,
        });
    }
    setDefaultSignature(sigId) {
        return this.http.put(`${this.base}/signatures/${sigId}/default`, {});
    }
    deleteSignature(sigId) {
        return this.http.delete(`${this.base}/signatures/${sigId}`);
    }
}
PdfManagerService.ɵfac = function PdfManagerService_Factory(t) { return new (t || PdfManagerService)(ɵngcc0.ɵɵinject(ɵngcc1.HttpClient), ɵngcc0.ɵɵinject(PDF_ANNOTATOR_CONFIG, 8)); };
PdfManagerService.ɵprov = /*@__PURE__*/ ɵngcc0.ɵɵdefineInjectable({ token: PdfManagerService, factory: PdfManagerService.ɵfac });
PdfManagerService.ctorParameters = () => [
    { type: HttpClient },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [PDF_ANNOTATOR_CONFIG,] }] }
];
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵngcc0.ɵsetClassMetadata(PdfManagerService, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc1.HttpClient }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [PDF_ANNOTATOR_CONFIG]
            }] }]; }, null); })();

class PdfAnnotatorModalComponent {
    constructor(modalCtrl, http, zone, toastCtrl, alertCtrl, cdr, sanitizer, pdfSvc, config) {
        var _a, _b;
        this.modalCtrl = modalCtrl;
        this.http = http;
        this.zone = zone;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.cdr = cdr;
        this.sanitizer = sanitizer;
        this.pdfSvc = pdfSvc;
        this.canManageGuide = false;
        // Context Menu state
        this.contextMenu = {
            show: false,
            x: 0,
            y: 0,
            targetId: '',
            targetType: ''
        };
        // Tool modes
        this.toolMode = 'none';
        this.shapeType = 'rect';
        this.showShapeMenu = false;
        this.showShapeDropdown = false;
        this.shapeNoStroke = false;
        // Shape-specific color settings (separate from brush)
        this.shapeStrokeColor = '#000000';
        this.shapeFillColor = '#ffffff';
        this.shapeFillEnabled = false;
        this.shapeStrokeSize = 2;
        // Mac Preview-style color swatches
        this.shapeColorSwatches = [
            '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#ffffff',
            '#ff0000', '#ff4500', '#ff9900', '#ffcc00', '#00b050', '#00b0f0', '#0070c0', '#7030a0',
            '#ff00ff', '#ff69b4', '#4169e1', '#20b2aa', '#228b22', '#8b4513', '#a0522d', '#dc143c'
        ];
        this.shapeFillSwatches = [
            '#ffffff', '#f2f2f2', '#e6e6e6', '#d9d9d9', '#cccccc', '#b7b7b7', '#999999', '#000000',
            '#ffcccc', '#ffe5cc', '#fffacc', '#ccffcc', '#ccf5ff', '#cce0ff', '#e5ccff', '#ffccf2',
            '#ff9999', '#ffcc99', '#ffff99', '#99ff99', '#99f2ff', '#99bbff', '#cc99ff', '#ff99ee'
        ];
        this.brushColor = '#0000FF';
        this.brushSize = 3;
        this.highlightColor = '#ffff00';
        this.highlightSize = 20;
        this.eraserSize = 20;
        this.pageNo = 1;
        this.pageCount = 0;
        this.PAGE_CHUNK = 50;
        this.loadedUntilPage = 0;
        this.isLoadingChunk = false;
        this.zoom = 1; // 0.5 - 3
        this.viewMode = 'single';
        this.pages = []; // Array [1, 2, ..., pageCount]
        this.isLoading = false;
        this.loadingMessage = '';
        this.saveProgress = 0;
        this.renderingPages = new Set();
        this.renderedPages = new Set();
        this.textBoxes = [];
        this.imageStamps = [];
        this.shapeStamps = [];
        this.signatureStamps = [];
        this.dateStamps = [];
        this.pdfFormFields = [];
        this.formFieldCounter = 0;
        this.activeFormFieldId = null;
        // Modal & Preview States
        this.showSignaturePad = false;
        this.showSignaturePicker = false;
        this.showPreviewOverlay = false;
        this.previewUrl = null;
        this.previewPages = []; // Array of base64 image URLs for preview
        this.previewIsFiltered = false; // true when showing annotated-pages-only preview
        this.previewTotalPages = 0;
        this.isLoadingAllPreview = false;
        this.pageThumbnails = []; // Array of base64 thumbnail images
        this.showThumbnails = true; // Toggle for thumbnails sidebar
        this.lastSavedBlob = null;
        this.lastSavedFileName = '';
        this.signatureCtx = null;
        this.isDrawingSignature = false;
        this.signaturePoints = [];
        this.signatureStrokes = [];
        this.bufferCanvas = null;
        // Signature pen settings
        this.signaturePenColor = '#000000';
        this.signaturePenSize = 2.5;
        // Quick Mark Stamp settings
        this.markType = 'check';
        this.formFieldType = 'checkbox';
        this.markColor = '#000000';
        this.markSize = 32; // px at 100% zoom (will be scaled)
        this.showMarkOptions = false;
        // Date Stamp Settings
        this.dateColor = '#000000';
        this.dateFontSize = 16;
        this.showDateOptions = false;
        // Saved Signatures (from database)
        this.savedSignatures = [];
        this.isLoadingSignatures = false;
        this.userId = '';
        this.userName = '';
        this.documentId = null;
        this.detailId = '';
        this.edocId = '';
        this.isCancelMode = false;
        // Digital ID settings
        this.showDigitalId = true;
        // Thumbnail sidebar state
        this.thumbInsertIndex = -1; // -1 = closed; 0 = before page 1; i = after page i
        this.thumbDropdownTargetIndex = -1;
        // ------------------------------------
        // User Guide Modal State
        // ------------------------------------
        this.showUserGuidePanel = false;
        this.isLoadingGuide = false;
        this.isEditingGuide = false;
        this.userGuideContent = '';
        this.tempGuideContent = '';
        this.thumbDropdownTop = 0; // Fixed-position Y coord for insert dropdown
        this.thumbInsertAtIndex = -1; // the slot index where file upload was triggered
        // ── History Panel ────────────────────────────────────────────────────────
        this.showHistoryPanel = false;
        this.historyEntries = [];
        this.isLoadingHistory = false;
        // Insert blank page
        this.showInsertMenu = false;
        this.showThumbInsertMenu = false;
        this.insertOrientation = 'portrait';
        // Page-operation undo stack (insert / delete page)
        this.pageHistoryStack = [];
        this.strokes = {};
        this.shapes = {};
        this.redoStack = {};
        this.activeStroke = null;
        this.activeShape = null;
        this.activeCanvasRect = null;
        this.activePointerId = null;
        this.activeObjectId = null;
        this.activeObjectType = null;
        this.activePointerType = '';
        this.renderRequested = false;
        this.isRenderingAll = false;
        this.renderDebounceTimer = null;
        this.isDragging = false;
        this.dragTextBoxId = null;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        // Resize state
        this.isResizing = false;
        this.resizeTextBoxId = null;
        // Image drag state
        this.isDraggingImage = false;
        this.dragImageId = null;
        this.isResizingImage = false;
        this.resizeImageId = null;
        // ShapeStamp drag/resize state
        this.isDraggingShape = false;
        this.dragShapeId = null;
        this.isResizingShape = false;
        this.resizeShapeId = null;
        this.resizeObserver = null;
        this.isScrollNavigating = false;
        this.basePdfBytes = null;
        /** PDF page aspect ratios (width/height) per page number, populated at load time */
        this.pdfPageAspects = new Map();
        /** PDF page rotations (0/90/180/270) per page number, populated at load time from pdf-lib */
        this.pdfPageRotations = new Map();
        this.revNo = 1;
        this.pdfDocProxy = null;
        this.currentViewport = null;
        // default text style
        this.textColor = '#0000FF';
        this.textFontSize = 16;
        this.pendingSignatureDataUrl = null;
        this.activeTextBoxId = null;
        this.SETTINGS_KEY = 'esign_pdf_annotator_settings';
        /* ================= Zoom & Resize ================= */
        this.lastParentWidth = 0;
        this.lastFitPageNo = -1;
        this.signaturesApiUrl = (_a = config === null || config === void 0 ? void 0 : config.signaturesApiUrl) !== null && _a !== void 0 ? _a : 'http://localhost:3500/api/signatures';
        this.pdfWorkerSrc = (_b = config === null || config === void 0 ? void 0 : config.pdfWorkerSrc) !== null && _b !== void 0 ? _b : '/assets/pdf.worker.min.mjs';
    }
    toggleDateOptions() {
        this.showDateOptions = !this.showDateOptions;
    }
    addDateStampAndShowOptions() {
        this.addDateStamp();
        this.showDateOptions = true;
    }
    setDateColor(color) {
        this.dateColor = color;
        this.saveSettings();
    }
    changeDateFontSize(delta) {
        const newSize = this.dateFontSize + delta;
        if (newSize >= 8 && newSize <= 100) {
            this.dateFontSize = newSize;
            this.saveSettings();
        }
    }
    /** Log an action to the ruts-pdf history API (fire-and-forget) */
    logHistory(actionType, detail = {}, pageNumber) {
        if (!this.documentId || !this.userId)
            return;
        this.pdfSvc.logAction({
            documentId: this.documentId,
            userId: this.userId,
            actionType,
            actionDetail: detail,
            pageNumber: pageNumber !== null && pageNumber !== void 0 ? pageNumber : this.pageNo,
            userName: this.userName,
        }).subscribe();
        // Also add to local panel immediately
        this.historyEntries.unshift({
            id: Date.now(),
            document_id: this.documentId,
            user_id: this.userId,
            action_type: actionType,
            action_detail: detail,
            page_number: pageNumber !== null && pageNumber !== void 0 ? pageNumber : this.pageNo,
            user_name: this.userName,
            user_position: '',
            ip_address: '',
            created_at: new Date().toISOString(),
        });
    }
    toggleHistoryPanel() {
        this.showHistoryPanel = !this.showHistoryPanel;
        if (this.showHistoryPanel && this.documentId && this.historyEntries.length === 0) {
            this.loadHistoryFromApi();
        }
    }
    loadHistoryFromApi() {
        if (!this.documentId)
            return;
        this.isLoadingHistory = true;
        this.pdfSvc.getHistory(this.documentId, 100).subscribe({
            next: (res) => {
                this.historyEntries = res.data;
                this.isLoadingHistory = false;
            },
            error: () => { this.isLoadingHistory = false; },
        });
    }
    getHistoryActionIcon(type) {
        const map = {
            sign: 'finger-print', text: 'text', draw: 'brush',
            highlight: 'color-fill-outline', shape: 'shapes-outline', image: 'image-outline',
            page_insert: 'add-circle-outline', page_delete: 'trash-outline',
            date_stamp: 'calendar', save: 'save-outline', upload: 'cloud-upload-outline', open: 'open-outline',
        };
        return map[type] || 'ellipse-outline';
    }
    getHistoryActionLabel(type) {
        const map = {
            sign: 'ลงลายเซ็น', text: 'เพิ่มข้อความ', draw: 'วาด', highlight: 'ไฮไลท์',
            shape: 'รูปทรง', image: 'รูปภาพ', page_insert: 'แทรกหน้า', page_delete: 'ลบหน้า',
            date_stamp: 'วันที่', save: 'บันทึก', upload: 'นำเข้า', open: 'เปิดเอกสาร',
        };
        return map[type] || type;
    }
    get canUndoPageOp() { return this.pageHistoryStack.length > 0; }
    savePageSnapshot() {
        if (!this.basePdfBytes)
            return;
        // Deep-clone annotation arrays and records so mutations don't affect snapshot
        const cloneArr = (a) => a.map(x => (Object.assign({}, x)));
        const cloneRec = (r) => {
            const out = {};
            for (const k of Object.keys(r))
                out[Number(k)] = [...r[Number(k)]];
            return out;
        };
        this.pageHistoryStack.push({
            bytes: this.basePdfBytes.slice(0),
            pageNo: this.pageNo,
            textBoxes: cloneArr(this.textBoxes),
            imageStamps: cloneArr(this.imageStamps),
            shapeStamps: cloneArr(this.shapeStamps),
            signatureStamps: cloneArr(this.signatureStamps),
            dateStamps: cloneArr(this.dateStamps),
            pdfFormFields: cloneArr(this.pdfFormFields),
            strokes: cloneRec(this.strokes),
            shapes: cloneRec(this.shapes),
            redoStack: cloneRec(this.redoStack),
        });
        // Keep last 20 snapshots
        if (this.pageHistoryStack.length > 20)
            this.pageHistoryStack.shift();
    }
    undoPageOp() {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = this.pageHistoryStack.pop();
            if (!snapshot)
                return;
            this.showInsertMenu = false;
            this.isLoading = true;
            this.loadingMessage = 'กำลังย้อนกลับ...';
            this.cdr.detectChanges();
            try {
                this.basePdfBytes = snapshot.bytes;
                this.textBoxes = snapshot.textBoxes;
                this.imageStamps = snapshot.imageStamps;
                this.shapeStamps = snapshot.shapeStamps;
                this.signatureStamps = snapshot.signatureStamps;
                this.dateStamps = snapshot.dateStamps;
                this.pdfFormFields = snapshot.pdfFormFields || [];
                this.strokes = snapshot.strokes;
                this.shapes = snapshot.shapes;
                this.redoStack = snapshot.redoStack;
                const copy = this.basePdfBytes.slice(0);
                if (this.pdfDocProxy) {
                    this.pdfDocProxy.destroy();
                    this.pdfDocProxy = null;
                }
                const loadingTask = pdfjsLib.getDocument({ data: copy, cMapUrl: '/assets/cmaps/', cMapPacked: true, standardFontDataUrl: '/assets/standard_fonts/' });
                this.pdfDocProxy = yield loadingTask.promise;
                this.pageCount = this.pdfDocProxy.numPages;
                this.loadedUntilPage = Math.min(this.loadedUntilPage, this.pageCount);
                this.pages = Array.from({ length: this.loadedUntilPage }, (_, i) => i + 1);
                this.pages.forEach(p => this.ensurePage(p));
                this.pdfPageAspects.clear();
                this.pdfPageRotations.clear();
                try {
                    const tmpDoc = yield PDFDocument.load(copy);
                    tmpDoc.getPages().forEach((pg, idx) => {
                        const { width, height } = pg.getSize();
                        this.pdfPageAspects.set(idx + 1, width / height);
                        this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
                    });
                }
                catch (_) { }
                this.pageNo = Math.min(snapshot.pageNo, this.pageCount);
                this.renderedPages.clear();
                this.renderingPages.clear();
                yield this.generateThumbnails();
                yield this.renderAllPages();
                this.scrollToPage(this.pageNo);
                const toast = yield this.toastCtrl.create({
                    message: 'ย้อนกลับเรียบร้อยแล้ว',
                    duration: 2000,
                    color: 'success',
                    position: 'bottom'
                });
                yield toast.present();
            }
            catch (err) {
                console.error('undoPageOp error:', err);
            }
            finally {
                this.isLoading = false;
                this.loadingMessage = '';
                this.cdr.detectChanges();
            }
        });
    }
    get activeTextBox() {
        return this.textBoxes.find(t => t.id === this.activeTextBoxId) || null;
    }
    close() {
        this.unlockOrientation();
        this.modalCtrl.dismiss();
    }
    get drawMode() { return this.toolMode === 'draw' || (this.toolMode === 'none' && this.activeObjectType === 'signature'); }
    get eraserMode() { return this.toolMode === 'eraser'; }
    get highlightMode() { return this.toolMode === 'highlight'; }
    get shapeMode() { return this.toolMode === 'shape' || (this.toolMode === 'none' && this.activeObjectType === 'shape'); }
    get textPlaceMode() { return this.toolMode === 'text' || (this.toolMode === 'none' && this.activeObjectType === 'text'); }
    ngOnInit() {
        this.strokes = {};
        this.shapes = {};
        this.redoStack = {};
        this.textBoxes = [];
        this.imageStamps = [];
        this.shapeStamps = [];
        this.signatureStamps = [];
        this.dateStamps = [];
        this.activeStroke = null;
        this.activeShape = null;
        this.activeTextBoxId = null;
        this.activeObjectId = null;
        this.activeObjectType = null;
        this.pendingSignatureDataUrl = null;
        this.toolMode = 'none';
        this.pageNo = 1;
        this.zoom = 1;
        this.savedSignatures = [];
        this.showSignaturePad = false;
        this.showSignaturePicker = false;
        this.showPreviewOverlay = false;
        this.previewUrl = null;
        this.lastSavedBlob = null;
        this.lastSavedFileName = '';
        this.isDrawingSignature = false;
        this.signaturePoints = [];
        this.signatureStrokes = [];
        this.isLoadingSignatures = false;
        this.isDragging = false;
        this.dragTextBoxId = null;
        this.isResizing = false;
        this.resizeTextBoxId = null;
        this.isDraggingImage = false;
        this.dragImageId = null;
        this.isResizingImage = false;
        this.resizeImageId = null;
        this.contextMenu.show = false;
        this.showShapeMenu = false;
        this.loadSettings(); // Restore user preferences
        this.cdr.detectChanges();
    }
    saveSettings() {
        const settings = {
            brushColor: this.brushColor,
            brushSize: this.brushSize,
            highlightColor: this.highlightColor,
            highlightSize: this.highlightSize,
            eraserSize: this.eraserSize,
            textColor: this.textColor,
            textFontSize: this.textFontSize,
            dateColor: this.dateColor,
            dateFontSize: this.dateFontSize,
            shapeType: this.shapeType,
            shapeStrokeColor: this.shapeStrokeColor,
            shapeFillColor: this.shapeFillColor,
            shapeFillEnabled: this.shapeFillEnabled,
            shapeStrokeSize: this.shapeStrokeSize,
            shapeNoStroke: this.shapeNoStroke
        };
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    }
    loadSettings() {
        try {
            const saved = localStorage.getItem(this.SETTINGS_KEY);
            if (saved) {
                const settings = JSON.parse(saved);
                if (settings.brushColor)
                    this.brushColor = settings.brushColor;
                if (settings.brushSize)
                    this.brushSize = settings.brushSize;
                if (settings.highlightColor)
                    this.highlightColor = settings.highlightColor;
                if (settings.highlightSize)
                    this.highlightSize = settings.highlightSize;
                if (settings.eraserSize)
                    this.eraserSize = settings.eraserSize;
                if (settings.textColor)
                    this.textColor = settings.textColor;
                if (settings.textFontSize)
                    this.textFontSize = settings.textFontSize;
                if (settings.dateColor)
                    this.dateColor = settings.dateColor;
                if (settings.dateFontSize)
                    this.dateFontSize = settings.dateFontSize;
                if (settings.shapeType)
                    this.shapeType = settings.shapeType;
                if (settings.shapeStrokeColor)
                    this.shapeStrokeColor = settings.shapeStrokeColor;
                if (settings.shapeFillColor)
                    this.shapeFillColor = settings.shapeFillColor;
                if (settings.shapeFillEnabled !== undefined)
                    this.shapeFillEnabled = settings.shapeFillEnabled;
                if (settings.shapeStrokeSize)
                    this.shapeStrokeSize = settings.shapeStrokeSize;
                if (settings.shapeNoStroke !== undefined)
                    this.shapeNoStroke = settings.shapeNoStroke;
            }
        }
        catch (e) {
            console.warn('Failed to load settings from localStorage', e);
        }
    }
    get visibleTextBoxes() { return this.getTextBoxesForPage(this.pageNo); }
    get visibleImageStamps() { return this.getImageStampsForPage(this.pageNo); }
    get visibleSignatures() { return this.getSignatureStampsForPage(this.pageNo); }
    get visibleDateStamps() { return this.getDateStampsForPage(this.pageNo); }
    getTextBoxesForPage(p) { return this.textBoxes.filter(t => t.page === p); }
    getImageStampsForPage(p) { return this.imageStamps.filter(i => i.page === p); }
    getRegularImageStampsForPage(p) { return this.imageStamps.filter(i => i.page === p && !i.id.startsWith('mark_')); }
    getMarkStampsForPage(p) { return this.imageStamps.filter(i => i.page === p && i.id.startsWith('mark_')); }
    getShapeStampsForPage(p) { return this.shapeStamps.filter(s => s.page === p); }
    getSignatureStampsForPage(p) { return this.signatureStamps.filter(s => s.page === p); }
    getDateStampsForPage(p) { return this.dateStamps.filter(d => d.page === p); }
    getMarkSvgContent(markType, color) {
        const c = color || '#000000';
        if (markType === 'check') {
            return `<polyline points="12,52 42,82 88,18" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
        }
        else if (markType === 'cross') {
            return `<line x1="15" y1="15" x2="85" y2="85" stroke="${c}" stroke-width="10" stroke-linecap="round"/>` +
                `<line x1="85" y1="15" x2="15" y2="85" stroke="${c}" stroke-width="10" stroke-linecap="round"/>`;
        }
        else {
            return `<circle cx="50" cy="50" r="38" fill="${c}"/>`;
        }
    }
    /** Lock screen orientation to portrait while annotating */
    lockOrientation() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orientation = screen.orientation;
                if (orientation && orientation.lock) {
                    yield orientation.lock('portrait-primary');
                }
            }
            catch (_) {
                // Screen Orientation API not supported (e.g. iOS Safari) — ignore
            }
        });
    }
    /** Unlock screen orientation when leaving the annotator */
    unlockOrientation() {
        try {
            const orientation = screen.orientation;
            if (orientation && orientation.unlock) {
                orientation.unlock();
            }
        }
        catch (_) { /* ignore */ }
    }
    ngAfterViewInit() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            pdfjsLib.GlobalWorkerOptions.workerSrc = this.pdfWorkerSrc;
            // Lock orientation to portrait so the PDF doesn't rotate during annotation
            this.lockOrientation();
            // Clear and reset canvases before loading new PDF
            (_a = this.pdfCanvases) === null || _a === void 0 ? void 0 : _a.forEach(ref => {
                const canvas = ref.nativeElement;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    canvas.width = 0;
                    canvas.height = 0;
                    canvas.style.width = '0px';
                    canvas.style.height = '0px';
                }
            });
            (_b = this.annotCanvases) === null || _b === void 0 ? void 0 : _b.forEach(ref => {
                const canvas = ref.nativeElement;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    canvas.width = 0;
                    canvas.height = 0;
                    canvas.style.width = '0px';
                    canvas.style.height = '0px';
                }
            });
            // Ensure state is clean
            this.strokes = {};
            this.shapes = {};
            this.redoStack = {};
            this.activeStroke = null;
            this.activeShape = null;
            this.activeObjectId = null;
            this.activeObjectType = null;
            yield this.loadPdfBytesAndInitPdfjs();
            this.zone.runOutsideAngular(() => {
                this.setupResizeAutoRender();
            });
            yield this.fitWidth();
            this.syncToolModeStyles();
        });
    }
    syncToolModeStyles() {
        // Set touch-action: none for ALL active tool modes to prevent iPad scroll
        const hasActiveTool = this.toolMode !== 'none';
        this.pages.forEach(p => {
            const canvas = this.getAnnotCanvas(p);
            if (canvas) {
                canvas.style.touchAction = hasActiveTool ? 'none' : 'auto';
            }
        });
        this.updateCursor();
    }
    ngOnDestroy() {
        if (this.resizeObserver)
            this.resizeObserver.disconnect();
        // Cleanup PDF.js document to free memory
        if (this.pdfDocProxy) {
            this.pdfDocProxy.destroy();
            this.pdfDocProxy = null;
        }
        // Clear all canvases to release memory
        this.pages.forEach(p => {
            const pdfCanvas = this.getPdfCanvas(p);
            const annotCanvas = this.getAnnotCanvas(p);
            if (pdfCanvas) {
                const ctx = pdfCanvas.getContext('2d');
                if (ctx)
                    ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
                pdfCanvas.width = 0;
                pdfCanvas.height = 0;
            }
            if (annotCanvas) {
                const ctx = annotCanvas.getContext('2d');
                if (ctx)
                    ctx.clearRect(0, 0, annotCanvas.width, annotCanvas.height);
                annotCanvas.width = 0;
                annotCanvas.height = 0;
            }
        });
        // Clear data arrays
        this.pageThumbnails = [];
        this.basePdfBytes = null;
        this.strokes = {};
        this.shapes = {};
        this.textBoxes = [];
        this.imageStamps = [];
        this.shapeStamps = [];
        this.signatureStamps = [];
        this.dateStamps = [];
    }
    /* ================= Keyboard Shortcuts ================= */
    onDocumentPointerDown(event) {
        if (this.contextMenu.show) {
            const target = event.target;
            if (!target.closest('.custom-context-menu')) {
                this.zone.run(() => {
                    this.closeContextMenu();
                    this.cdr.detectChanges();
                });
            }
        }
    }
    handleKeyboard(event) {
        // Undo: Ctrl+Z or Cmd+Z
        if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
            event.preventDefault();
            this.undo();
            return;
        }
        // Redo: Ctrl+Y or Ctrl+Shift+Z or Cmd+Shift+Z
        if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
            event.preventDefault();
            this.redo();
            return;
        }
        // Escape: exit modes
        if (event.key === 'Escape') {
            this.exitAllModes();
            return;
        }
        // Delete: remove active object
        if (event.key === 'Delete' || event.key === 'Backspace') {
            const activeEl = document.activeElement;
            // Don't delete if user is typing in a textarea or input
            if ((activeEl === null || activeEl === void 0 ? void 0 : activeEl.tagName) === 'TEXTAREA' || (activeEl === null || activeEl === void 0 ? void 0 : activeEl.tagName) === 'INPUT') {
                return;
            }
            if (this.activeObjectId && this.activeObjectType) {
                if (this.activeObjectType === 'text')
                    this.removeTextBox(this.activeObjectId);
                else if (this.activeObjectType === 'shape')
                    this.removeShapeStamp(this.activeObjectId);
                else if (this.activeObjectType === 'image')
                    this.removeImage(this.activeObjectId);
                else if (this.activeObjectType === 'signature')
                    this.removeSignature(this.activeObjectId);
                else if (this.activeObjectType === 'date')
                    this.removeDateStamp(this.activeObjectId);
                this.activeObjectId = null;
                this.activeObjectType = null;
            }
        }
    }
    exitAllModes() {
        this.toolMode = 'none';
        this.showShapeMenu = false;
        this.activeTextBoxId = null;
        this.activeObjectId = null;
        this.activeObjectType = null;
        this.pendingSignatureDataUrl = null;
        this.closeContextMenu();
        this.syncToolModeStyles(); // Reset touch-action so iPad can scroll/pan PDF again
        this.updateCursor();
    }
    /* ================= User Guide Methods ================= */
    toggleUserGuide(e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.showUserGuidePanel = !this.showUserGuidePanel;
        if (this.showUserGuidePanel) {
            this.isEditingGuide = false;
            this.fetchGuideData();
        }
    }
    fetchGuideData() {
        // Simulate API fetch
        this.isLoadingGuide = true;
        setTimeout(() => {
            // Logic for actual API fetch goes here (e.g. this.accessProviders.postData(...))
            this.isLoadingGuide = false;
        }, 500);
    }
    editGuide() {
        if (!this.canManageGuide)
            return;
        this.tempGuideContent = this.userGuideContent;
        this.isEditingGuide = true;
    }
    cancelEditGuide() {
        this.isEditingGuide = false;
        this.tempGuideContent = '';
    }
    saveGuide() {
        // Simulate API save
        this.userGuideContent = this.tempGuideContent;
        this.isEditingGuide = false;
        // Call API here to save permanently
        // e.g. this.accessProviders.postData({ content: this.userGuideContent }, 'save_guide.php')...
    }
    /* ================= Context Menu Methods ================= */
    closeContextMenu() {
        if (this.contextMenu.show) {
            this.contextMenu.show = false;
            this.cdr.detectChanges();
        }
    }
    onContextMenu(e, id, type) {
        e.preventDefault();
        e.stopPropagation();
        // Auto-switch to select mode when right clicking to ensure smooth UX
        if (this.toolMode !== 'none') {
            this.setToolMode('none');
        }
        // Position menu exactly at mouse
        this.contextMenu.x = e.clientX;
        this.contextMenu.y = e.clientY;
        this.contextMenu.targetId = id;
        this.contextMenu.targetType = type;
        this.contextMenu.show = true;
        // Force UI update immediately to prevent "slow" feeling
        this.cdr.detectChanges();
    }
    getContextTargetObject() {
        const id = this.contextMenu.targetId;
        switch (this.contextMenu.targetType) {
            case 'text': return this.textBoxes.find(t => t.id === id);
            case 'shape': return this.shapeStamps.find(s => s.id === id);
            case 'image': return this.imageStamps.find(i => i.id === id);
            case 'signature': return this.signatureStamps.find(s => s.id === id);
            case 'date': return this.dateStamps.find(d => d.id === id);
        }
        return null;
    }
    getAllAnnotationsZIndices() {
        const all = [
            ...this.textBoxes, ...this.shapeStamps, ...this.imageStamps,
            ...this.signatureStamps, ...this.dateStamps
        ];
        return all.map(a => a.zIndex || 10);
    }
    contextBringToFront() {
        const obj = this.getContextTargetObject();
        if (obj) {
            const zs = this.getAllAnnotationsZIndices();
            const maxZ = zs.length ? Math.max(...zs) : 10;
            obj.zIndex = maxZ + 1;
            this.closeContextMenu();
            this.cdr.detectChanges();
        }
    }
    contextBringForward() {
        const obj = this.getContextTargetObject();
        if (obj) {
            obj.zIndex = (obj.zIndex || 10) + 1;
            this.closeContextMenu();
            this.cdr.detectChanges();
        }
    }
    contextSendBackward() {
        const obj = this.getContextTargetObject();
        if (obj) {
            obj.zIndex = (obj.zIndex || 10) - 1;
            this.closeContextMenu();
            this.cdr.detectChanges();
        }
    }
    contextSendToBack() {
        const obj = this.getContextTargetObject();
        if (obj) {
            const zs = this.getAllAnnotationsZIndices();
            const minZ = zs.length ? Math.min(...zs) : 10;
            obj.zIndex = Math.max(1, minZ - 1);
            this.closeContextMenu();
            this.cdr.detectChanges();
        }
    }
    deleteContextMenuTarget() {
        const id = this.contextMenu.targetId;
        switch (this.contextMenu.targetType) {
            case 'text':
                this.removeTextBox(id);
                break;
            case 'shape':
                this.removeShapeStamp(id);
                break;
            case 'image':
                this.removeImage(id);
                break;
            case 'signature':
                this.removeSignature(id);
                break;
            case 'date':
                this.removeDateStamp(id);
                break;
        }
        this.closeContextMenu();
    }
    /* ================= PDF load ================= */
    loadPdfBytesAndInitPdfjs() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isLoading = true;
            this.loadingMessage = 'กำลังโหลด PDF...';
            try {
                const buffer = yield this.http
                    .get(this.pdfUrl, { responseType: 'arraybuffer' })
                    .pipe(timeout(60000), retry(2))
                    .toPromise();
                if (!buffer) {
                    throw new Error('ไม่สามารถโหลดไฟล์ PDF ได้');
                }
                this.basePdfBytes = buffer;
                const loadingTask = pdfjsLib.getDocument({ data: buffer.slice(0), cMapUrl: '/assets/cmaps/', cMapPacked: true, standardFontDataUrl: '/assets/standard_fonts/' });
                this.pdfDocProxy = yield loadingTask.promise;
                this.pageCount = this.pdfDocProxy.numPages || 1;
                // Initialize annotation data for ALL pages upfront
                for (let p = 1; p <= this.pageCount; p++)
                    this.ensurePage(p);
                // Only render first chunk in the DOM
                this.loadedUntilPage = Math.min(this.PAGE_CHUNK, this.pageCount);
                this.pages = Array.from({ length: this.loadedUntilPage }, (_, i) => i + 1);
                // Store PDF page aspect ratios and rotations for correct rendering and stamp calculation
                try {
                    const tmpDoc = yield PDFDocument.load(buffer);
                    tmpDoc.getPages().forEach((pg, idx) => {
                        const { width, height } = pg.getSize();
                        this.pdfPageAspects.set(idx + 1, width / height);
                        // Store rotation so renderPage can force correct landscape/portrait viewport
                        this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
                    });
                }
                catch (_) {
                    // Fallback: aspect ratios will be computed from canvas at placement time
                }
                // Generate thumbnails after loading PDF
                yield this.generateThumbnails();
            }
            catch (error) {
                console.error('Error loading PDF:', error);
                const isTimeout = (error === null || error === void 0 ? void 0 : error.name) === 'TimeoutError';
                const isNetwork = (error === null || error === void 0 ? void 0 : error.status) === 0;
                const is404 = (error === null || error === void 0 ? void 0 : error.status) === 404;
                let msg = 'ไม่สามารถโหลด PDF ได้ กรุณาลองใหม่อีกครั้ง';
                if (isTimeout)
                    msg = 'โหลด PDF หมดเวลา (Timeout) กรุณาตรวจสอบการเชื่อมต่อ';
                else if (isNetwork)
                    msg = 'ไม่สามารถเชื่อมต่อ Server ได้ กรุณาตรวจสอบเครือข่าย';
                else if (is404)
                    msg = 'ไม่พบไฟล์ PDF บน Server กรุณาติดต่อผู้ดูแลระบบ';
                const toast = yield this.toastCtrl.create({
                    message: msg,
                    duration: 4000,
                    color: 'danger',
                    position: 'middle'
                });
                yield toast.present();
                this.unlockOrientation();
                this.modalCtrl.dismiss({ error: true, message: msg });
            }
            finally {
                this.isLoading = false;
                this.loadingMessage = '';
            }
        });
    }
    generateThumbnails() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.pdfDocProxy)
                return;
            this.pageThumbnails = [];
            yield this.generateThumbnailsRange(1, this.loadedUntilPage);
        });
    }
    generateThumbnailsRange(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.pdfDocProxy)
                return;
            const scale = 0.2;
            for (let i = from; i <= to; i++) {
                const page = yield this.pdfDocProxy.getPage(i);
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                yield page.render({ canvasContext: ctx, viewport }).promise;
                this.pageThumbnails.push(canvas.toDataURL('image/png'));
            }
        });
    }
    loadNextChunk() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isLoadingChunk || this.loadedUntilPage >= this.pageCount)
                return;
            this.isLoadingChunk = true;
            const newEnd = Math.min(this.loadedUntilPage + this.PAGE_CHUNK, this.pageCount);
            const prevEnd = this.loadedUntilPage;
            yield this.generateThumbnailsRange(prevEnd + 1, newEnd);
            for (let p = prevEnd + 1; p <= newEnd; p++)
                this.pages.push(p);
            this.loadedUntilPage = newEnd;
            this.cdr.detectChanges();
            yield new Promise(r => setTimeout(r, 50));
            for (let p = prevEnd + 1; p <= newEnd; p++)
                yield this.renderPage(p);
            this.isLoadingChunk = false;
        });
    }
    goToPage(pageNum) {
        if (pageNum < 1 || pageNum > this.pageCount)
            return;
        this.pageNo = pageNum;
        this.scrollToPage(this.pageNo);
        // Re-fit width in case new page has different orientation (landscape vs portrait)
        this.fitWidth();
    }
    toggleThumbnails() {
        this.showThumbnails = !this.showThumbnails;
    }
    /* ================= Insert Blank Page ================= */
    insertBlankPage(where) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.basePdfBytes)
                return;
            this.showInsertMenu = false;
            this.isLoading = true;
            this.loadingMessage = 'กำลังแทรกหน้าเปล่า...';
            this.savePageSnapshot(); // บันทึก snapshot ก่อนแก้ไข
            this.cdr.detectChanges();
            try {
                const pdfDoc = yield PDFDocument.load(this.basePdfBytes);
                const pages = pdfDoc.getPages();
                const refPage = pages[this.pageNo - 1];
                const { width, height } = refPage.getSize();
                // Determine page dimensions based on chosen orientation
                let pageW;
                let pageH;
                if (this.insertOrientation === 'landscape') {
                    pageW = Math.max(width, height);
                    pageH = Math.min(width, height);
                }
                else {
                    pageW = Math.min(width, height);
                    pageH = Math.max(width, height);
                }
                const insertIndex = where === 'before' ? this.pageNo - 1 : this.pageNo;
                pdfDoc.insertPage(insertIndex, [pageW, pageH]);
                const newBytes = yield pdfDoc.save();
                this.basePdfBytes = newBytes.buffer;
                // Shift annotations that are on pages >= insertIndex+1
                const shiftPage = insertIndex + 1; // 1-based page number of first shifted page
                const shiftAnnotations = (arr) => arr.map(a => a.page >= shiftPage ? Object.assign(Object.assign({}, a), { page: a.page + 1 }) : a);
                this.textBoxes = shiftAnnotations(this.textBoxes);
                this.imageStamps = shiftAnnotations(this.imageStamps);
                this.shapeStamps = shiftAnnotations(this.shapeStamps);
                this.signatureStamps = shiftAnnotations(this.signatureStamps);
                this.dateStamps = shiftAnnotations(this.dateStamps);
                // Shift stroke/shape records
                const shiftRecord = (rec) => {
                    const next = {};
                    for (const key of Object.keys(rec)) {
                        const p = Number(key);
                        next[p >= shiftPage ? p + 1 : p] = rec[p];
                    }
                    return next;
                };
                this.strokes = shiftRecord(this.strokes);
                this.shapes = shiftRecord(this.shapes);
                this.redoStack = shiftRecord(this.redoStack);
                // Reload pdfjs
                const copy = this.basePdfBytes.slice(0);
                if (this.pdfDocProxy) {
                    this.pdfDocProxy.destroy();
                    this.pdfDocProxy = null;
                }
                const loadingTask = pdfjsLib.getDocument({ data: copy, cMapUrl: '/assets/cmaps/', cMapPacked: true, standardFontDataUrl: '/assets/standard_fonts/' });
                this.pdfDocProxy = yield loadingTask.promise;
                this.pageCount = this.pdfDocProxy.numPages;
                this.loadedUntilPage = Math.min(this.loadedUntilPage, this.pageCount);
                this.pages = Array.from({ length: this.loadedUntilPage }, (_, i) => i + 1);
                this.pages.forEach(p => this.ensurePage(p));
                // Refresh aspect ratios & rotations
                this.pdfPageAspects.clear();
                this.pdfPageRotations.clear();
                try {
                    const tmpDoc = yield PDFDocument.load(copy);
                    tmpDoc.getPages().forEach((pg, idx) => {
                        const { width: w, height: h } = pg.getSize();
                        this.pdfPageAspects.set(idx + 1, w / h);
                        this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
                    });
                }
                catch (_) { }
                // Navigate to the new blank page
                this.pageNo = insertIndex + 1;
                this.renderedPages.clear();
                this.renderingPages.clear();
                yield this.generateThumbnails();
                yield this.renderAllPages();
                this.scrollToPage(this.pageNo);
                const toast = yield this.toastCtrl.create({
                    message: `แทรกหน้าเปล่า${this.insertOrientation === 'portrait' ? 'แนวตั้ง' : 'แนวนอน'}ที่หน้า ${this.pageNo} เรียบร้อยแล้ว`,
                    duration: 2000,
                    color: 'success',
                    position: 'bottom'
                });
                yield toast.present();
                // Log to history
                this.logHistory('page_insert', { where, orientation: this.insertOrientation, insertedAt: this.pageNo }, this.pageNo);
            }
            catch (err) {
                console.error('insertBlankPage error:', err);
                const toast = yield this.toastCtrl.create({
                    message: 'เกิดข้อผิดพลาดในการแทรกหน้า',
                    duration: 2000,
                    color: 'danger',
                    position: 'bottom'
                });
                yield toast.present();
            }
            finally {
                this.isLoading = false;
                this.loadingMessage = '';
                this.cdr.detectChanges();
            }
        });
    }
    /* ================= Delete Current Page ================= */
    deletePage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.basePdfBytes || this.pageCount <= 1)
                return;
            this.showInsertMenu = false;
            // Confirm before deleting
            const alert = yield this.alertCtrl.create({
                header: 'ลบหน้าเอกสาร',
                message: `ต้องการลบหน้าที่ ${this.pageNo} ใช่หรือไม่? การกระทำนี้ไม่สามารถเรียกคืนได้`,
                buttons: [
                    { text: 'ยกเลิก', role: 'cancel' },
                    {
                        text: 'ลบหน้า',
                        role: 'destructive',
                        cssClass: 'alert-btn-danger',
                        handler: () => this.doDeletePage()
                    }
                ]
            });
            yield alert.present();
        });
    }
    doDeletePage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.basePdfBytes)
                return;
            this.isLoading = true;
            this.loadingMessage = 'กำลังลบหน้า...';
            this.savePageSnapshot(); // บันทึก snapshot ก่อนลบ
            this.cdr.detectChanges();
            try {
                const pdfDoc = yield PDFDocument.load(this.basePdfBytes);
                const deleteIndex = this.pageNo - 1; // 0-based
                pdfDoc.removePage(deleteIndex);
                const newBytes = yield pdfDoc.save();
                this.basePdfBytes = newBytes.buffer;
                // Remove annotations on the deleted page; shift pages above it down
                const deletedPage = this.pageNo;
                const filterAndShift = (arr) => arr
                    .filter(a => a.page !== deletedPage)
                    .map(a => a.page > deletedPage ? Object.assign(Object.assign({}, a), { page: a.page - 1 }) : a);
                this.textBoxes = filterAndShift(this.textBoxes);
                this.imageStamps = filterAndShift(this.imageStamps);
                this.shapeStamps = filterAndShift(this.shapeStamps);
                this.signatureStamps = filterAndShift(this.signatureStamps);
                this.dateStamps = filterAndShift(this.dateStamps);
                // Shift stroke/shape records
                const shiftDeleteRecord = (rec) => {
                    const next = {};
                    for (const key of Object.keys(rec)) {
                        const p = Number(key);
                        if (p === deletedPage)
                            continue; // drop deleted page
                        next[p > deletedPage ? p - 1 : p] = rec[p];
                    }
                    return next;
                };
                this.strokes = shiftDeleteRecord(this.strokes);
                this.shapes = shiftDeleteRecord(this.shapes);
                this.redoStack = shiftDeleteRecord(this.redoStack);
                // Reload pdfjs
                const copy = this.basePdfBytes.slice(0);
                if (this.pdfDocProxy) {
                    this.pdfDocProxy.destroy();
                    this.pdfDocProxy = null;
                }
                const loadingTask = pdfjsLib.getDocument({ data: copy, cMapUrl: '/assets/cmaps/', cMapPacked: true, standardFontDataUrl: '/assets/standard_fonts/' });
                this.pdfDocProxy = yield loadingTask.promise;
                this.pageCount = this.pdfDocProxy.numPages;
                this.loadedUntilPage = Math.min(this.loadedUntilPage, this.pageCount);
                this.pages = Array.from({ length: this.loadedUntilPage }, (_, i) => i + 1);
                this.pages.forEach(p => this.ensurePage(p));
                // Refresh aspect ratios & rotations
                this.pdfPageAspects.clear();
                this.pdfPageRotations.clear();
                try {
                    const tmpDoc = yield PDFDocument.load(copy);
                    tmpDoc.getPages().forEach((pg, idx) => {
                        const { width, height } = pg.getSize();
                        this.pdfPageAspects.set(idx + 1, width / height);
                        this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
                    });
                }
                catch (_) { }
                // Navigate to the previous page (or page 1 if we deleted page 1)
                this.pageNo = Math.min(deletedPage, this.pageCount);
                this.renderedPages.clear();
                this.renderingPages.clear();
                yield this.generateThumbnails();
                yield this.renderAllPages();
                this.scrollToPage(this.pageNo);
                const toast = yield this.toastCtrl.create({
                    message: `ลบหน้าที่ ${deletedPage} เรียบร้อยแล้ว`,
                    duration: 2000,
                    color: 'success',
                    position: 'bottom'
                });
                yield toast.present();
            }
            catch (err) {
                console.error('deletePage error:', err);
                const toast = yield this.toastCtrl.create({
                    message: 'เกิดข้อผิดพลาดในการลบหน้า',
                    duration: 2000,
                    color: 'danger',
                    position: 'bottom'
                });
                yield toast.present();
            }
            finally {
                this.isLoading = false;
                this.loadingMessage = '';
                this.cdr.detectChanges();
            }
        });
    }
    /* ================= Thumbnail Sidebar Wrappers ================= */
    toggleThumbInsert(idx, event) {
        if (this.thumbInsertIndex === idx) {
            this.thumbInsertIndex = -1;
            return;
        }
        this.thumbInsertIndex = idx;
        if (event && event.currentTarget) {
            const btn = event.currentTarget;
            const rect = btn.getBoundingClientRect();
            // Center the dropdown vertically on the button
            this.thumbDropdownTop = rect.top + rect.height / 2;
        }
    }
    /** Insert a blank page at `afterIndex` (0 = before page 1, n = after page n) */
    insertAtThumb(afterIndex, orientation) {
        return __awaiter(this, void 0, void 0, function* () {
            this.thumbInsertIndex = -1;
            if (!this.basePdfBytes)
                return;
            // Navigate to the page around which we are inserting so insertBlankPage works correctly
            this.insertOrientation = orientation;
            // insertBlankPage uses this.pageNo; afterIndex=0 means before page 1
            if (afterIndex === 0) {
                this.pageNo = 1;
                yield this.insertBlankPage('before');
            }
            else {
                this.pageNo = afterIndex;
                yield this.insertBlankPage('after');
            }
        });
    }
    triggerThumbFileUpload(afterIndex) {
        this.thumbInsertIndex = -1;
        this.thumbInsertAtIndex = afterIndex;
        if (this.thumbFileInputRef) {
            this.thumbFileInputRef.nativeElement.value = '';
            this.thumbFileInputRef.nativeElement.click();
        }
    }
    onThumbFileSelected(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = event.target;
            if (!input.files || !input.files[0] || !this.basePdfBytes)
                return;
            const file = input.files[0];
            // Navigate to the correct insert position then trigger image upload
            if (this.thumbInsertAtIndex === 0) {
                this.pageNo = 1;
            }
            else {
                this.pageNo = this.thumbInsertAtIndex;
            }
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => __awaiter(this, void 0, void 0, function* () {
                    const dataUrl = e.target.result;
                    // Place as full-page image stamp on the target page
                    if (this.thumbInsertAtIndex === 0) {
                        yield this.insertBlankPage('before');
                    }
                    else {
                        yield this.insertBlankPage('after');
                    }
                    // Add image stamp on the newly inserted page
                    const newPage = this.thumbInsertAtIndex === 0 ? 1 : this.thumbInsertAtIndex + 1;
                    const stamp = {
                        id: 'img_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                        page: newPage, x: 0, y: 0, width: 100, height: 100, dataUrl
                    };
                    this.imageStamps.push(stamp);
                    this.cdr.detectChanges();
                });
                reader.readAsDataURL(file);
            }
            else if (file.type === 'application/pdf') {
                this.isLoading = true;
                this.loadingMessage = 'กำลังแทรกไฟล์ PDF...';
                this.savePageSnapshot();
                this.cdr.detectChanges();
                try {
                    const arrayBuffer = yield file.arrayBuffer();
                    const importedPdf = yield PDFDocument.load(arrayBuffer);
                    const mainPdf = yield PDFDocument.load(this.basePdfBytes);
                    const importedPages = yield mainPdf.copyPages(importedPdf, importedPdf.getPageIndices());
                    // thumbInsertAtIndex is 0 to insert before page 1, or page number to insert after
                    const insertIndex = this.thumbInsertAtIndex;
                    let currentIndex = insertIndex;
                    for (const page of importedPages) {
                        mainPdf.insertPage(currentIndex, page);
                        currentIndex++;
                    }
                    const newBytes = yield mainPdf.save();
                    this.basePdfBytes = newBytes.buffer;
                    const insertedCount = importedPages.length;
                    // Shift annotations that are on pages >= insertIndex+1
                    const shiftPage = insertIndex + 1;
                    const shiftAnnotations = (arr) => arr.map(a => a.page >= shiftPage ? Object.assign(Object.assign({}, a), { page: a.page + insertedCount }) : a);
                    this.textBoxes = shiftAnnotations(this.textBoxes);
                    this.imageStamps = shiftAnnotations(this.imageStamps);
                    this.shapeStamps = shiftAnnotations(this.shapeStamps);
                    this.signatureStamps = shiftAnnotations(this.signatureStamps);
                    this.dateStamps = shiftAnnotations(this.dateStamps);
                    const shiftRecord = (rec) => {
                        const next = {};
                        for (const key of Object.keys(rec)) {
                            const p = Number(key);
                            next[p >= shiftPage ? p + insertedCount : p] = rec[p];
                        }
                        return next;
                    };
                    this.strokes = shiftRecord(this.strokes);
                    this.shapes = shiftRecord(this.shapes);
                    this.redoStack = shiftRecord(this.redoStack);
                    // Reload pdfjs
                    const copy = this.basePdfBytes.slice(0);
                    if (this.pdfDocProxy) {
                        this.pdfDocProxy.destroy();
                        this.pdfDocProxy = null;
                    }
                    const loadingTask = pdfjsLib.getDocument({ data: copy, cMapUrl: '/assets/cmaps/', cMapPacked: true, standardFontDataUrl: '/assets/standard_fonts/' });
                    this.pdfDocProxy = yield loadingTask.promise;
                    this.pageCount = this.pdfDocProxy.numPages;
                    this.pages = Array.from({ length: this.loadedUntilPage }, (_, i) => i + 1);
                    this.pages.forEach(p => this.ensurePage(p));
                    this.pdfPageAspects.clear();
                    this.pdfPageRotations.clear();
                    try {
                        const tmpDoc = yield PDFDocument.load(copy);
                        tmpDoc.getPages().forEach((pg, idx) => {
                            const { width: w, height: h } = pg.getSize();
                            this.pdfPageAspects.set(idx + 1, w / h);
                            this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
                        });
                    }
                    catch (_) { }
                    this.pageNo = shiftPage;
                    this.renderedPages.clear();
                    this.renderingPages.clear();
                    yield this.generateThumbnails();
                    yield this.renderAllPages();
                    this.scrollToPage(this.pageNo);
                    const toast = yield this.toastCtrl.create({
                        message: `แทรกไฟล์ PDF จำนวน ${insertedCount} หน้าเรียบร้อยแล้ว`,
                        duration: 2000,
                        color: 'success',
                        position: 'bottom'
                    });
                    yield toast.present();
                    this.logHistory('page_insert', { where: 'pdf_file', insertedAt: shiftPage, count: insertedCount }, shiftPage);
                }
                catch (err) {
                    console.error('insert PDF error:', err);
                    const toast = yield this.toastCtrl.create({
                        message: 'เกิดข้อผิดพลาดในการแทรกไฟล์ PDF',
                        duration: 2000,
                        color: 'danger',
                        position: 'bottom'
                    });
                    yield toast.present();
                }
                finally {
                    this.isLoading = false;
                    this.loadingMessage = '';
                    if (this.thumbFileInputRef) {
                        this.thumbFileInputRef.nativeElement.value = '';
                    }
                    this.cdr.detectChanges();
                }
            }
            else {
                const toast = yield this.toastCtrl.create({
                    message: 'รองรับเฉพาะไฟล์รูปภาพและเอกสาร PDF ในขณะนี้',
                    duration: 2500, color: 'warning', position: 'bottom'
                });
                yield toast.present();
            }
        });
    }
    movePageToIndex(pageNum, direction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (direction === 'up' && pageNum > 1) {
                const prevPageNo = this.pageNo;
                this.pageNo = pageNum;
                yield this.swapPages(pageNum - 1, pageNum);
                this.pageNo = pageNum - 1;
                this.scrollToPage(this.pageNo);
            }
            else if (direction === 'down' && pageNum < this.pageCount) {
                this.pageNo = pageNum;
                yield this.swapPages(pageNum, pageNum + 1);
                this.pageNo = pageNum + 1;
                this.scrollToPage(this.pageNo);
            }
        });
    }
    deleteSpecificPage(pageNum) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pageCount <= 1)
                return;
            this.pageNo = pageNum;
            yield this.deletePage();
        });
    }
    insertBlankPageFromThumb(where) {
        this.showThumbInsertMenu = false;
        this.insertBlankPage(where);
    }
    deletePageFromThumb() {
        this.deletePage();
    }
    /* ================= Move Page Up/Down ================= */
    movePageUp() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pageNo <= 1 || !this.basePdfBytes)
                return;
            yield this.swapPages(this.pageNo - 1, this.pageNo);
            this.pageNo = this.pageNo - 1;
            this.scrollToPage(this.pageNo);
        });
    }
    movePageDown() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pageNo >= this.pageCount || !this.basePdfBytes)
                return;
            yield this.swapPages(this.pageNo, this.pageNo + 1);
            this.pageNo = this.pageNo + 1;
            this.scrollToPage(this.pageNo);
        });
    }
    swapPages(pageA, pageB) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.basePdfBytes)
                return;
            this.savePageSnapshot();
            this.isLoading = true;
            this.loadingMessage = 'กำลังย้ายหน้า...';
            this.cdr.detectChanges();
            try {
                const pdfDoc = yield PDFDocument.load(this.basePdfBytes);
                const idxA = pageA - 1;
                const idxB = pageB - 1;
                // Copy both pages then insert at swapped positions
                const [copyOfB] = yield pdfDoc.copyPages(pdfDoc, [idxB]);
                const [copyOfA] = yield pdfDoc.copyPages(pdfDoc, [idxA]);
                // Insert B at position A, then A at position B+1 (now shifted by 1)
                pdfDoc.insertPage(idxA, copyOfB);
                pdfDoc.insertPage(idxB + 1, copyOfA);
                // Remove the original A (now at idxA+1) and original B (now at idxB+2)
                pdfDoc.removePage(idxA + 1);
                pdfDoc.removePage(idxB + 1);
                const newBytes = yield pdfDoc.save();
                this.basePdfBytes = newBytes.buffer;
                // Swap annotations between the two pages
                const swapAnnot = (arr) => arr.map(a => {
                    if (a.page === pageA)
                        return Object.assign(Object.assign({}, a), { page: pageB });
                    if (a.page === pageB)
                        return Object.assign(Object.assign({}, a), { page: pageA });
                    return a;
                });
                this.textBoxes = swapAnnot(this.textBoxes);
                this.imageStamps = swapAnnot(this.imageStamps);
                this.shapeStamps = swapAnnot(this.shapeStamps);
                this.signatureStamps = swapAnnot(this.signatureStamps);
                this.dateStamps = swapAnnot(this.dateStamps);
                const swapRecord = (rec) => {
                    const next = {};
                    for (const k of Object.keys(rec)) {
                        const p = Number(k);
                        if (p === pageA)
                            next[pageB] = rec[p];
                        else if (p === pageB)
                            next[pageA] = rec[p];
                        else
                            next[p] = rec[p];
                    }
                    return next;
                };
                this.strokes = swapRecord(this.strokes);
                this.shapes = swapRecord(this.shapes);
                this.redoStack = swapRecord(this.redoStack);
                // Reload pdfjs
                const copy = this.basePdfBytes.slice(0);
                if (this.pdfDocProxy) {
                    this.pdfDocProxy.destroy();
                    this.pdfDocProxy = null;
                }
                const loadingTask = pdfjsLib.getDocument({ data: copy, cMapUrl: '/assets/cmaps/', cMapPacked: true, standardFontDataUrl: '/assets/standard_fonts/' });
                this.pdfDocProxy = yield loadingTask.promise;
                this.pageCount = this.pdfDocProxy.numPages;
                this.loadedUntilPage = Math.min(this.loadedUntilPage, this.pageCount);
                this.pages = Array.from({ length: this.loadedUntilPage }, (_, i) => i + 1);
                this.pages.forEach(p => this.ensurePage(p));
                this.pdfPageAspects.clear();
                this.pdfPageRotations.clear();
                try {
                    const tmpDoc = yield PDFDocument.load(copy);
                    tmpDoc.getPages().forEach((pg, idx) => {
                        const { width, height } = pg.getSize();
                        this.pdfPageAspects.set(idx + 1, width / height);
                        this.pdfPageRotations.set(idx + 1, pg.getRotation().angle || 0);
                    });
                }
                catch (_) { }
                this.renderedPages.clear();
                this.renderingPages.clear();
                yield this.generateThumbnails();
                yield this.renderAllPages();
            }
            catch (err) {
                console.error('swapPages error:', err);
                const toast = yield this.toastCtrl.create({
                    message: 'เกิดข้อผิดพลาดในการย้ายหน้า',
                    duration: 2000, color: 'danger', position: 'bottom'
                });
                yield toast.present();
            }
            finally {
                this.isLoading = false;
                this.loadingMessage = '';
                this.cdr.detectChanges();
            }
        });
    }
    /* ================= Page helpers ================= */
    ensurePage(p = this.pageNo) {
        if (!this.strokes[p])
            this.strokes[p] = [];
        if (!this.shapes[p])
            this.shapes[p] = [];
        if (!this.redoStack[p])
            this.redoStack[p] = [];
    }
    getPdfCanvas(p) {
        return document.getElementById('pdfCanvas-' + p);
    }
    getAnnotCanvas(p) {
        return document.getElementById('annotCanvas-' + p);
    }
    onViewerScroll(event) {
        if (this.isScrollNavigating)
            return;
        const container = event.target;
        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        // Find which page is most visible
        for (let i = 1; i <= this.loadedUntilPage; i++) {
            const pageEl = document.getElementById('page-' + i);
            if (!pageEl)
                continue;
            const pageTop = pageEl.offsetTop - container.offsetTop;
            const pageBottom = pageTop + pageEl.offsetHeight;
            const visibleTop = Math.max(scrollTop, pageTop);
            const visibleBottom = Math.min(scrollTop + containerHeight, pageBottom);
            const visibleHeight = visibleBottom - visibleTop;
            if (visibleHeight > containerHeight * 0.5) {
                if (this.pageNo !== i) {
                    this.pageNo = i;
                    this.scrollThumbnailIntoView(i);
                    this.cdr.detectChanges();
                    this.fitWidth();
                }
                // Load next chunk when approaching the last loaded page
                if (i >= this.loadedUntilPage - 5)
                    this.loadNextChunk();
                break;
            }
        }
    }
    prevPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pageNo <= 1)
                return;
            this.pageNo -= 1;
            this.scrollToPage(this.pageNo);
            yield this.fitWidth();
        });
    }
    zoomIn() {
        return __awaiter(this, void 0, void 0, function* () {
            this.zoom = Math.min(3, this.zoom + 0.1);
            this.renderedPages.clear();
            yield this.renderAllPages();
        });
    }
    nextPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pageNo >= this.pageCount)
                return;
            // If at the edge of the loaded chunk, load next chunk first
            if (this.pageNo >= this.loadedUntilPage) {
                yield this.loadNextChunk();
            }
            this.pageNo += 1;
            this.scrollToPage(this.pageNo);
            yield this.fitWidth();
        });
    }
    firstPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pageNo === 1)
                return;
            this.pageNo = 1;
            this.scrollToPage(this.pageNo);
            yield this.fitWidth();
        });
    }
    lastPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pageNo === this.pageCount)
                return;
            // Jump to last loaded page; pre-load next chunk in background
            this.pageNo = this.loadedUntilPage;
            this.scrollToPage(this.pageNo);
            yield this.fitWidth();
            if (this.loadedUntilPage < this.pageCount)
                this.loadNextChunk();
        });
    }
    zoomOut() {
        return __awaiter(this, void 0, void 0, function* () {
            this.zoom = Math.max(0.5, this.zoom - 0.1);
            this.renderedPages.clear();
            yield this.renderAllPages();
        });
    }
    scrollToPage(pageNum) {
        this.isScrollNavigating = true;
        const pageEl = document.getElementById('page-' + pageNum);
        if (pageEl) {
            pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Also scroll thumbnail into view
        this.scrollThumbnailIntoView(pageNum);
        // Longer timeout for long documents - smooth scroll can take time
        setTimeout(() => {
            this.isScrollNavigating = false;
        }, 1500);
    }
    scrollThumbnailIntoView(pageNum) {
        const thumbEl = document.getElementById('thumb-' + pageNum);
        if (thumbEl) {
            thumbEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    debouncedRenderVisible() {
        if (this.renderDebounceTimer) {
            clearTimeout(this.renderDebounceTimer);
        }
        this.renderDebounceTimer = setTimeout(() => {
            this.renderAllPages();
        }, 200);
    }
    renderAllPages() {
        return __awaiter(this, void 0, void 0, function* () {
            // Prevent concurrent render calls
            if (this.isRenderingAll)
                return;
            this.isRenderingAll = true;
            try {
                // Render all pages (memory saved via DPR cap and cleanup on destroy)
                for (let p = 1; p <= this.pageCount; p++) {
                    yield this.renderPage(p);
                }
            }
            finally {
                this.isRenderingAll = false;
            }
        });
    }
    /** Compute zoom so the WIDEST page in the document fits within the container.
     *  This prevents landscape pages from overflowing and being clipped by overflow-x. */
    fitWidth() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.viewerContainerRef)
                return;
            const parent = this.viewerContainerRef.nativeElement;
            if (!parent || parent.clientWidth === 0) {
                yield new Promise(resolve => setTimeout(resolve, 50));
                return this.fitWidth();
            }
            const containerW = parent.clientWidth;
            const targetW = containerW - 40; // padding
            // Check if container size has changed enough, or if the current page changed
            const sameContainer = Math.abs(containerW - this.lastParentWidth) < 2;
            const samePage = this.pageNo === this.lastFitPageNo;
            if (sameContainer && samePage)
                return;
            this.lastParentWidth = containerW;
            this.lastFitPageNo = this.pageNo;
            // Wait for DOM to populate if pages are defined
            if (this.pages.length > 0) {
                yield new Promise(resolve => setTimeout(resolve, 100));
            }
            // Scan all pages to find the widest viewport (landscape pages may be wider than portrait)
            let maxVpWidth = 0;
            for (let p = 1; p <= this.pageCount; p++) {
                try {
                    const pg = yield this.pdfDocProxy.getPage(p);
                    const vp = pg.getViewport({ scale: 1 });
                    if (vp.width > maxVpWidth)
                        maxVpWidth = vp.width;
                }
                catch (_) { /* skip unavailable pages */ }
            }
            if (maxVpWidth <= 0)
                return; // safety guard
            this.zoom = targetW / maxVpWidth;
            this.renderedPages.clear();
            yield this.renderAllPages();
        });
    }
    renderPage(p = this.pageNo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.pdfDocProxy || this.renderingPages.has(p) || this.renderedPages.has(p))
                return;
            this.renderingPages.add(p);
            // Only show global loading if it's the first render or a manual save.
            // Regular page/zoom renders shouldn't block the UI with the intrusive overlay.
            // const showLoading = !this.isLoading && p === this.pageNo;
            // if (showLoading) {
            //   this.isLoading = true;
            //   this.loadingMessage = 'กำลังเรนเดอร์เอกสาร...';
            //   this.cdr.detectChanges();
            // }
            try {
                const page = yield this.pdfDocProxy.getPage(p);
                // Store the true effective rotation from pdf.js, as it correctly handles inherited rotations
                // from the PDF page tree (which pdf-lib's getRotation() sometimes misses).
                // We will use this in saveDocument to know exactly how the user saw the page.
                this.pdfPageRotations.set(p, page.rotate || 0);
                // Use native pdf.js viewport. pdf.js smartly handles rotation including inherited ones.
                const viewport = page.getViewport({ scale: this.zoom });
                if (p === this.pageNo)
                    this.currentViewport = viewport;
                const pdfCanvas = this.getPdfCanvas(p);
                if (!pdfCanvas)
                    return;
                const pdfCtx = pdfCanvas.getContext('2d');
                // Cap DPR at 2 to reduce memory usage on high-res displays
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                pdfCanvas.width = Math.floor(viewport.width * dpr);
                pdfCanvas.height = Math.floor(viewport.height * dpr);
                pdfCanvas.style.width = viewport.width + 'px';
                pdfCanvas.style.height = viewport.height + 'px';
                pdfCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
                pdfCtx.clearRect(0, 0, viewport.width, viewport.height);
                yield page.render({ canvasContext: pdfCtx, viewport }).promise;
                // Render Text Layer for native selection
                const pageWrapper = pdfCanvas.parentElement;
                if (pageWrapper) {
                    let textLayerDiv = pageWrapper.querySelector('.textLayer');
                    if (!textLayerDiv) {
                        textLayerDiv = document.createElement('div');
                        textLayerDiv.className = 'textLayer';
                        pageWrapper.insertBefore(textLayerDiv, pdfCanvas.nextSibling);
                    }
                    textLayerDiv.innerHTML = '';
                    textLayerDiv.style.width = viewport.width + 'px';
                    textLayerDiv.style.height = viewport.height + 'px';
                    textLayerDiv.style.left = '0';
                    textLayerDiv.style.top = '0';
                    // Ensure scale factor is cleanly applied
                    textLayerDiv.style.setProperty('--scale-factor', viewport.scale.toString());
                    try {
                        const textContent = yield page.getTextContent();
                        const textLayer = new pdfjsLib.TextLayer({
                            textContentSource: textContent,
                            container: textLayerDiv,
                            viewport
                        });
                        yield textLayer.render();
                    }
                    catch (e) {
                        console.warn('Failed to render text layer:', e);
                    }
                }
                // Small delay to ensure PDF content (fonts, text) are fully rendered
                yield new Promise(resolve => setTimeout(resolve, 100));
                this.resizeAnnotCanvasTo(p, viewport.width, viewport.height);
                const annotCanvas = this.getAnnotCanvas(p);
                if (annotCanvas) {
                    // Run events outside Angular to eliminate Change Detection lag on 120Hz/240Hz Apple Pencils
                    this.zone.runOutsideAngular(() => {
                        if (annotCanvas._hasPointerEvents)
                            return;
                        annotCanvas._hasPointerEvents = true;
                        annotCanvas.addEventListener('pointerdown', (e) => this.onCanvasPointerDown(e, p));
                        annotCanvas.addEventListener('pointermove', (e) => this.onCanvasPointerMove(e, p));
                        annotCanvas.addEventListener('pointerup', (e) => this.onCanvasPointerUp(e, p));
                        annotCanvas.addEventListener('pointerleave', (e) => this.onCanvasPointerUp(e, p));
                        annotCanvas.addEventListener('pointercancel', (e) => this.onCanvasPointerUp(e, p));
                    });
                }
                this.redraw(p);
                this.clampTextBoxesToView();
                this.renderedPages.add(p);
            }
            catch (err) {
                console.error(`Error rendering page ${p}:`, err);
            }
            finally {
                this.renderingPages.delete(p);
                if (this.renderingPages.size === 0) {
                    this.isLoading = false;
                    this.loadingMessage = '';
                    this.cdr.detectChanges();
                }
            }
        });
    }
    resizeAnnotCanvasTo(p, cssW, cssH) {
        const canvas = this.getAnnotCanvas(p);
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        // Cap DPR at 2 to reduce memory usage
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        // Force clear canvas before resizing to remove any artifacts
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = Math.floor(cssW * dpr);
        canvas.height = Math.floor(cssH * dpr);
        canvas.style.width = cssW + 'px';
        canvas.style.height = cssH + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.imageSmoothingEnabled = false;
    }
    setupResizeAutoRender() {
        if (!this.viewerContainerRef)
            return;
        this.resizeObserver = new ResizeObserver(() => {
            this.fitWidth();
        });
        this.resizeObserver.observe(this.viewerContainerRef.nativeElement);
    }
    /* ================= Tool Mode Toggles ================= */
    setToolMode(mode) {
        this.toolMode = this.toolMode === mode ? 'none' : mode;
        this.showShapeMenu = false;
        this.syncToolModeStyles();
    }
    updateCursor() {
        this.pages.forEach(p => {
            const canvas = this.getAnnotCanvas(p);
            if (canvas) {
                switch (this.toolMode) {
                    case 'draw':
                    case 'shape':
                    case 'eraser':
                    case 'date':
                    case 'mark':
                    case 'formfield':
                        canvas.style.cursor = 'crosshair';
                        break;
                    case 'highlight':
                        canvas.style.cursor = 'cell';
                        break;
                    case 'text':
                        canvas.style.cursor = 'text';
                        break;
                    case 'signature':
                        canvas.style.cursor = 'copy'; // Or custom cursor if available
                        break;
                    default:
                        canvas.style.cursor = 'default';
                }
            }
        });
    }
    /* ================= Size Adjustments ================= */
    changeBrushSize(delta) {
        this.brushSize = Math.max(1, Math.min(50, this.brushSize + delta));
        this.saveSettings();
        this.cdr.detectChanges();
    }
    setBrushColor(color) {
        this.brushColor = color;
        this.saveSettings();
        this.cdr.detectChanges();
    }
    changeHighlightSize(delta) {
        this.highlightSize = Math.max(5, Math.min(100, this.highlightSize + delta));
        this.saveSettings();
        this.cdr.detectChanges();
    }
    setHighlightColor(color) {
        this.highlightColor = color;
        this.saveSettings();
        this.cdr.detectChanges();
    }
    changeTextFontSize(delta) {
        this.textFontSize = Math.max(8, Math.min(100, this.textFontSize + delta));
        if (this.activeTextBoxId) {
            const tb = this.textBoxes.find(t => t.id === this.activeTextBoxId);
            if (tb) {
                tb.fontSize = this.textFontSize;
                this.cdr.detectChanges();
            }
        }
        this.saveSettings();
        this.cdr.detectChanges();
    }
    toggleDraw() { this.setToolMode('draw'); }
    toggleEraser() { this.setToolMode('eraser'); }
    toggleHighlight() { this.setToolMode('highlight'); }
    enableTextPlaceMode() { this.setToolMode('text'); }
    toggleShapeMenu() {
        this.showShapeMenu = !this.showShapeMenu;
        if (this.showShapeMenu) {
            this.toolMode = 'shape';
        }
    }
    toggleShapeDropdown() {
        this.showShapeDropdown = !this.showShapeDropdown;
    }
    selectShape(type) {
        this.shapeType = type;
        this.toolMode = 'shape';
        this.showShapeMenu = false;
        this.showShapeDropdown = false;
        this.saveSettings();
        this.updateCursor();
    }
    setShapeStrokeColor(color) {
        this.shapeStrokeColor = color;
        if (this.activeObjectId && this.activeObjectType === 'shape') {
            const s = this.shapeStamps.find(x => x.id === this.activeObjectId);
            if (s)
                s.strokeColor = color;
        }
        this.saveSettings();
    }
    setShapeFillColor(color) {
        this.shapeFillColor = color;
        if (this.activeObjectId && this.activeObjectType === 'shape') {
            const s = this.shapeStamps.find(x => x.id === this.activeObjectId);
            if (s)
                s.fillColor = color;
        }
        this.saveSettings();
    }
    toggleShapeFill() {
        this.shapeFillEnabled = !this.shapeFillEnabled;
        if (this.activeObjectId && this.activeObjectType === 'shape') {
            const s = this.shapeStamps.find(x => x.id === this.activeObjectId);
            if (s)
                s.fillColor = this.shapeFillEnabled ? this.shapeFillColor : 'none';
        }
        this.saveSettings();
    }
    toggleShapeNoStroke() {
        this.shapeNoStroke = !this.shapeNoStroke;
        if (this.activeObjectId && this.activeObjectType === 'shape') {
            const s = this.shapeStamps.find(x => x.id === this.activeObjectId);
            if (s)
                s.strokeColor = this.shapeNoStroke ? 'none' : this.shapeStrokeColor;
        }
        this.saveSettings();
    }
    changeShapeStrokeSize(delta) {
        const s = this.shapeStrokeSize + delta;
        if (s >= 1 && s <= 20) {
            this.shapeStrokeSize = s;
            if (this.activeObjectId && this.activeObjectType === 'shape') {
                const shape = this.shapeStamps.find(x => x.id === this.activeObjectId);
                if (shape)
                    shape.strokeWidth = s;
            }
            this.saveSettings();
        }
    }
    /* ================= Annotation Canvas Events ================= */
    getNormPos(e, p) {
        const rect = this.activeCanvasRect || (() => {
            const canvas = this.getAnnotCanvas(p);
            return canvas ? canvas.getBoundingClientRect() : null;
        })();
        if (!rect)
            return { x: 0, y: 0, p: 0 };
        const nx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        const ny = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
        const pressure = (typeof e.pressure === 'number' && e.pressure > 0) ? e.pressure : 0;
        return { x: nx, y: ny, p: pressure };
    }
    finalizeActiveStroke() {
        if (!this.activeStroke && !this.activeShape)
            return;
        let needsDetection = false;
        if (this.activeStroke) {
            this.ensurePage();
            this.strokes[this.pageNo].push(this.activeStroke);
            this.activeStroke = null;
        }
        if (this.activeShape) {
            const sh = this.activeShape;
            this.activeShape = null;
            // Convert canvas shape → draggable ShapeStamp overlay
            const canvas = this.getAnnotCanvas(sh.page);
            if (canvas) {
                const cw = canvas.clientWidth;
                const ch = canvas.clientHeight;
                const x1 = sh.startX * cw;
                const y1 = sh.startY * ch;
                const x2 = sh.endX * cw;
                const y2 = sh.endY * ch;
                const left = Math.min(x1, x2);
                const top = Math.min(y1, y2);
                const right = Math.max(x1, x2);
                const bottom = Math.max(y1, y2);
                // For line/arrow the bounding box can be tiny — ensure minimum 20px
                const bw = Math.max(right - left, 20);
                const bh = Math.max(bottom - top, 20);
                const stamp = {
                    id: 'shs_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                    page: sh.page,
                    x: (left / cw) * 100,
                    y: (top / ch) * 100,
                    width: (bw / cw) * 100,
                    height: (bh / ch) * 100,
                    type: sh.type,
                    strokeColor: sh.color,
                    strokeWidth: sh.size,
                    viewWidth: cw,
                    fillColor: sh.fillColor,
                    // Fraction of the bbox where the original start/end points sit
                    startFracX: bw > 0 ? (x1 - left) / bw : 0,
                    startFracY: bh > 0 ? (y1 - top) / bh : 0,
                    endFracX: bw > 0 ? (x2 - left) / bw : 1,
                    endFracY: bh > 0 ? (y2 - top) / bh : 1,
                };
                this.shapeStamps.push(stamp);
            }
            // Single-draw: exit shape mode after drawing one shape
            this.toolMode = 'none';
            this.updateCursor();
            this.syncToolModeStyles();
            needsDetection = true;
        }
        this.activePointerId = null;
        this.activeCanvasRect = null;
        this.redraw(this.pageNo);
        if (needsDetection) {
            this.cdr.detectChanges();
        }
    }
    removeShapeStamp(id) {
        this.shapeStamps = this.shapeStamps.filter(s => s.id !== id);
        this.cdr.detectChanges();
    }
    startShapeDrag(e, ssid) {
        if (this.toolMode !== 'none')
            return;
        this.closeContextMenu();
        this.activeObjectId = ssid;
        this.activeObjectType = 'shape';
        const stamp = this.shapeStamps.find(s => s.id === ssid);
        if (!stamp)
            return;
        // Sync UI settings with the selected shape
        this.shapeType = stamp.type;
        if (stamp.strokeColor === 'none' || stamp.strokeColor === 'rgba(0,0,0,0)' || stamp.strokeColor === 'transparent') {
            this.shapeNoStroke = true;
        }
        else {
            this.shapeNoStroke = false;
            this.shapeStrokeColor = stamp.strokeColor;
        }
        if (!stamp.fillColor || stamp.fillColor === 'none' || stamp.fillColor === 'rgba(0,0,0,0)' || stamp.fillColor === 'transparent') {
            this.shapeFillEnabled = false;
        }
        else {
            this.shapeFillEnabled = true;
            this.shapeFillColor = stamp.fillColor;
        }
        this.shapeStrokeSize = stamp.strokeWidth || this.shapeStrokeSize;
        this.isDraggingShape = true;
        this.dragShapeId = ssid;
        const canvasRect = this.getDragCanvasRect(stamp.page);
        const startXpx = (stamp.x / 100) * canvasRect.width;
        const startYpx = (stamp.y / 100) * canvasRect.height;
        this.dragOffsetX = e.clientX - canvasRect.left - startXpx;
        this.dragOffsetY = e.clientY - canvasRect.top - startYpx;
        const move = (ev) => {
            ev.preventDefault();
            if (!this.isDraggingShape || !this.dragShapeId)
                return;
            const s = this.shapeStamps.find(x => x.id === this.dragShapeId);
            if (!s)
                return;
            s.x = ((ev.clientX - canvasRect.left - this.dragOffsetX) / canvasRect.width) * 100;
            s.y = ((ev.clientY - canvasRect.top - this.dragOffsetY) / canvasRect.height) * 100;
            this.cdr.detectChanges();
        };
        const up = () => {
            this.isDraggingShape = false;
            this.dragShapeId = null;
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    }
    startShapeResize(ev, shapeId, direction = 'se') {
        if (ev.button === 2 || ev.ctrlKey)
            return;
        ev.stopPropagation();
        ev.preventDefault();
        const stamp = this.shapeStamps.find(s => s.id === shapeId);
        if (!stamp)
            return;
        // Sync UI settings with the selected shape
        this.activeObjectId = shapeId;
        this.activeObjectType = 'shape';
        this.shapeType = stamp.type;
        if (stamp.strokeColor === 'none' || stamp.strokeColor === 'rgba(0,0,0,0)' || stamp.strokeColor === 'transparent') {
            this.shapeNoStroke = true;
        }
        else {
            this.shapeNoStroke = false;
            this.shapeStrokeColor = stamp.strokeColor;
        }
        if (!stamp.fillColor || stamp.fillColor === 'none' || stamp.fillColor === 'rgba(0,0,0,0)' || stamp.fillColor === 'transparent') {
            this.shapeFillEnabled = false;
        }
        else {
            this.shapeFillEnabled = true;
            this.shapeFillColor = stamp.fillColor;
        }
        this.shapeStrokeSize = stamp.strokeWidth || this.shapeStrokeSize;
        this.isResizingShape = true;
        this.resizeShapeId = shapeId;
        const canvasRect = this.getDragCanvasRect(stamp.page);
        const startX = ev.clientX;
        const startY = ev.clientY;
        const startW = stamp.width;
        const startH = stamp.height;
        const startSX = stamp.x;
        const startSY = stamp.y;
        const move = (e) => {
            e.preventDefault();
            if (!this.isResizingShape || !this.resizeShapeId)
                return;
            const s = this.shapeStamps.find(x => x.id === this.resizeShapeId);
            if (!s)
                return;
            const dx = ((e.clientX - startX) / canvasRect.width) * 100;
            const dy = ((e.clientY - startY) / canvasRect.height) * 100;
            let nw = startW, nh = startH, nx = startSX, ny = startSY;
            if (direction.includes('e'))
                nw = Math.max(2, startW + dx);
            if (direction.includes('w')) {
                nw = Math.max(2, startW - dx);
                nx = startSX + (startW - nw);
            }
            if (direction.includes('s'))
                nh = Math.max(2, startH + dy);
            if (direction.includes('n')) {
                nh = Math.max(2, startH - dy);
                ny = startSY + (startH - nh);
            }
            s.width = nw;
            s.height = nh;
            s.x = nx;
            s.y = ny;
            this.cdr.detectChanges();
        };
        const up = () => {
            this.isResizingShape = false;
            this.resizeShapeId = null;
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    }
    /** Returns arrow rotation angle in degrees — used in SVG template to avoid Math in template */
    getArrowAngleDeg(ss) {
        return (180 / Math.PI) * Math.atan2(ss.endFracY - ss.startFracY, ss.endFracX - ss.startFracX);
    }
    onCanvasPointerDown(e, p) {
        // Prevent default touch behavior (scroll, zoom) when any tool is active
        if (this.toolMode !== 'none') {
            e.preventDefault();
        }
        // Finalize previous stroke if it exists
        if (this.activeStroke || this.activeShape) {
            this.finalizeActiveStroke();
        }
        // iPad Palm Rejection / Multi-touch handling
        if (this.activePointerId !== null) {
            if (e.pointerType === 'pen') {
                // ALWAYS trust a new pen touch. If pointerup was delayed, cut it off and start fresh.
                this.activeStroke = null;
                this.activeShape = null;
            }
            else if (this.activePointerType === 'pen') {
                return; // Strongly ignore touch if pen is currently active
            }
            else {
                // Trust the newest touch if no pen is involved
                this.activeStroke = null;
                this.activeShape = null;
            }
        }
        // Deselect any active element when clicking on the empty canvas
        this.zone.run(() => {
            if (this.activeTextBoxId !== null || this.activeObjectId !== null) {
                this.activeTextBoxId = null;
                this.activeObjectId = null;
                this.activeObjectType = null;
                this.cdr.detectChanges();
            }
        });
        const canvas = this.getAnnotCanvas(p);
        if (!canvas)
            return;
        this.activeCanvasRect = canvas.getBoundingClientRect();
        this.ensurePage(p);
        this.pageNo = p; // Mark this page as current for mode consistency
        switch (this.toolMode) {
            case 'draw':
            case 'highlight':
            case 'shape':
                canvas.setPointerCapture(e.pointerId);
                this.activePointerId = e.pointerId;
                this.activePointerType = e.pointerType;
                if (this.toolMode === 'draw' || this.toolMode === 'highlight') {
                    const isHighlight = this.toolMode === 'highlight';
                    this.activeStroke = {
                        id: 's_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                        color: isHighlight ? this.highlightColor : this.brushColor,
                        size: isHighlight ? this.highlightSize : this.brushSize,
                        points: [this.getNormPos(e, p)],
                        isHighlight
                    };
                }
                else if (this.toolMode === 'shape') {
                    const pos = this.getNormPos(e, p);
                    this.activeShape = {
                        id: 'sh_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                        page: p,
                        type: this.shapeType,
                        startX: pos.x,
                        startY: pos.y,
                        endX: pos.x,
                        endY: pos.y,
                        color: this.shapeNoStroke ? 'rgba(0,0,0,0)' : this.shapeStrokeColor,
                        size: this.shapeNoStroke ? 0 : this.shapeStrokeSize,
                        fillColor: this.shapeFillEnabled ? this.shapeFillColor : undefined
                    };
                }
                this.redoStack[p] = [];
                break;
            case 'eraser':
                this.eraseAtPoint(e, p);
                break;
            case 'date': {
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                const now = new Date();
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                const thaiYear = year + 543;
                const dateText = `${day}/${month}/${thaiYear}`;
                // Normalize mouse x/y to 0..100
                const xNormalized = (mouseX / rect.width) * 100;
                const yNormalized = (mouseY / rect.height) * 100;
                this.dateStamps.push({
                    id: 'date_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                    page: p,
                    x: xNormalized - 5,
                    y: yNormalized - 1,
                    text: dateText,
                    color: this.dateColor,
                    fontSize: this.dateFontSize
                });
                // Log to history
                this.logHistory('date_stamp', { page: p, text: dateText }, p);
                this.toolMode = 'none';
                this.updateCursor();
                break;
            }
            case 'mark': {
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                const sizePx = this.markSize;
                const dataUrl = this.generateMarkDataUrl(this.markType, this.markColor, sizePx * 2);
                const xPct = ((mouseX - sizePx / 2) / rect.width) * 100;
                const yPct = ((mouseY - sizePx / 2) / rect.height) * 100;
                const wPct = (sizePx / rect.width) * 100;
                const hPct = (sizePx / rect.height) * 100;
                this.imageStamps.push({
                    id: 'mark_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                    page: p, x: xPct, y: yPct, width: wPct, height: hPct, dataUrl,
                    markType: this.markType,
                    markColor: this.markColor,
                });
                this.logHistory('image', { type: 'mark', markType: this.markType }, p);
                break;
            }
            case 'formfield': {
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                const type = this.formFieldType;
                const defaultW = type === 'text' ? 28 : 4.5;
                const defaultH = type === 'text' ? 4 : 4.5;
                const newId = 'ff_' + Date.now() + '_' + Math.random().toString(16).slice(2);
                this.pdfFormFields.push({
                    id: newId,
                    page: p,
                    type,
                    x: Math.max(0, (mouseX / rect.width) * 100 - defaultW / 2),
                    y: Math.max(0, (mouseY / rect.height) * 100 - defaultH / 2),
                    width: defaultW,
                    height: defaultH,
                    fieldName: `${type}_${++this.formFieldCounter}`,
                    radioGroupName: type === 'radio' ? 'radioGroup_1' : undefined,
                    fontSize: 12,
                    borderVisible: true,
                });
                this.activeFormFieldId = newId;
                this.logHistory('image', { type: 'formfield', fieldType: type }, p);
                break;
            }
            case 'signature':
                if (this.pendingSignatureDataUrl) {
                    this.placeSignatureOnPage(e, p);
                }
                break;
            case 'text':
                this.placeTextBoxOnPage(e, p);
                break;
            default:
                // Do nothing for 'none' or 'signature' (if no data URL)
                break;
        }
        // Only run detectChanges for modes that modify the Angular template.
        // Canvas-only modes (draw/highlight/shape/eraser) don't need it.
        const canvasOnlyMode = this.toolMode === 'draw' || this.toolMode === 'highlight'
            || this.toolMode === 'shape' || this.toolMode === 'eraser'
            || this.toolMode === 'mark' || this.toolMode === 'formfield';
        if (!canvasOnlyMode) {
            this.cdr.detectChanges();
        }
    }
    onCanvasPointerMove(e, p) {
        if (this.activePointerId !== null && e.pointerId !== this.activePointerId)
            return;
        // Prevent default touch handling during active drawing
        if (this.activeStroke || this.activeShape) {
            e.preventDefault();
        }
        if (this.activeStroke) {
            let events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
            if (!events || events.length === 0)
                events = [e];
            const startIdx = Math.max(0, this.activeStroke.points.length - 1);
            const canvasRect = this.activeCanvasRect;
            for (const ev of events) {
                let pt = this.getNormPos(ev, p);
                if (this.activeStroke.points.length > 0 && canvasRect) {
                    const lastPt = this.activeStroke.points[this.activeStroke.points.length - 1];
                    // Skip physically tiny sub-pixel movements (less than 1.5px) to drastically reduce rendering overhead/lag
                    const dx = (pt.x - lastPt.x) * canvasRect.width;
                    const dy = (pt.y - lastPt.y) * canvasRect.height;
                    if (dx * dx + dy * dy < 2.25)
                        continue; // 1.5px squared
                    // Exponential Moving Average to smooth Apple Pencil hardware pressure & coordinate jitter
                    pt.x = (pt.x * 0.4) + (lastPt.x * 0.6);
                    pt.y = (pt.y * 0.4) + (lastPt.y * 0.6);
                    pt.p = (pt.p * 0.2) + (lastPt.p * 0.8);
                }
                this.activeStroke.points.push(pt);
            }
            // Incremental render for zero-latency drawing
            if (!this.renderRequested) {
                this.renderRequested = true;
                const strokeToDraw = this.activeStroke; // capture local reference
                requestAnimationFrame(() => {
                    if (strokeToDraw) {
                        if (strokeToDraw.isHighlight) {
                            // Highlight strokes must be fully redrawn each frame (no incremental draw)
                            // to prevent the alpha opacity from multiplying on top of itself at overlapping line joints.
                            this.redraw(p, true);
                        }
                        else {
                            this.drawStrokeIncremental(p, strokeToDraw, startIdx);
                        }
                    }
                    this.renderRequested = false;
                });
            }
        }
        else if (this.activeShape) {
            const pos = this.getNormPos(e, p);
            this.activeShape.endX = pos.x;
            this.activeShape.endY = pos.y;
            if (!this.renderRequested) {
                this.renderRequested = true;
                requestAnimationFrame(() => {
                    this.redraw(p, true);
                    this.renderRequested = false;
                });
            }
        }
        else if (this.toolMode === 'eraser' && e.buttons === 1) {
            this.eraseAtPoint(e, p);
        }
    }
    onCanvasPointerUp(e, p) {
        if (this.activePointerId !== null && e.pointerId === this.activePointerId) {
            e.preventDefault();
            this.finalizeActiveStroke();
            const canvas = this.getAnnotCanvas(p);
            if (canvas && canvas.hasPointerCapture(e.pointerId)) {
                canvas.releasePointerCapture(e.pointerId);
            }
            this.activePointerId = null;
            this.activePointerType = '';
        }
    }
    placeSignatureOnPage(e, p) {
        const canvas = this.getAnnotCanvas(p);
        if (!canvas)
            return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const dataUrl = this.pendingSignatureDataUrl;
        // Load the image to get its real aspect ratio
        const img = new Image();
        img.onload = () => __awaiter(this, void 0, void 0, function* () {
            const sigWidthPercent = 15;
            // Calculate height using PDF page aspect ratio for accuracy.
            // If not available yet, fall back to canvas aspect ratio.
            const pdfAspect = this.pdfPageAspects.get(p); // width/height of PDF page
            const canvasAspect = rect.width / rect.height; // width/height of canvas on screen
            // sigHeightPercent must match what pdf-lib will render:
            // In pdf-lib: pw = sigWidthPercent% * pdfW, ph = sigHeightPercent% * pdfH
            // We want pw/ph = img.width/img.height (natural aspect of signature image)
            // => sigHeightPercent = sigWidthPercent * (pdfW/pdfH) / imgNaturalAspect
            // => sigHeightPercent = sigWidthPercent * pdfAspect / imgNaturalAspect
            const imgNaturalAspect = img.width / img.height;
            const sigHeightPercent = pdfAspect
                ? sigWidthPercent * (pdfAspect / imgNaturalAspect)
                : sigWidthPercent * (img.height / img.width) * canvasAspect;
            const x = (mouseX / rect.width) * 100 - (sigWidthPercent / 2);
            const y = (mouseY / rect.height) * 100 - (sigHeightPercent / 2);
            const now = new Date();
            const thaiYear = now.getFullYear() + 543;
            const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${thaiYear}`;
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} +07'00'`;
            const digitalId = this.userId ? yield this.hashUserId(this.userId) : '';
            const stamp = {
                id: 'sig_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                page: p,
                x: x,
                y: y,
                width: sigWidthPercent,
                height: sigHeightPercent,
                dataUrl: dataUrl,
                digitalId: digitalId,
                signDate: dateStr,
                signTime: timeStr
            };
            this.signatureStamps.push(stamp);
            // Log to history
            this.logHistory('sign', { page: p, x: stamp.x, y: stamp.y, digitalId: stamp.digitalId }, p);
            this.pendingSignatureDataUrl = null;
            this.toolMode = 'none';
            this.updateCursor();
            this.cdr.detectChanges();
        });
        img.src = dataUrl;
    }
    /** Generate SHA-256 based Digital ID from userId */
    hashUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const encoder = new TextEncoder();
                const data = encoder.encode(userId);
                const hashBuffer = yield crypto.subtle.digest('SHA-256', data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                // Take first 10 hex chars for a shorter but still unique ID
                return `DID-${hashHex.substring(0, 10).toUpperCase()}`;
            }
            catch (e) {
                // Fallback for environments without Web Crypto
                let hash = 0;
                for (let i = 0; i < userId.length; i++) {
                    const ch = userId.charCodeAt(i);
                    hash = ((hash << 5) - hash) + ch;
                    hash = hash & hash;
                }
                return `DID-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
            }
        });
    }
    /** Log signature placement to database for reference/audit */
    logSignatureToDatabase(digitalId, signDate, pageNumber) {
        if (!this.userId || !digitalId)
            return;
        const isoDate = signDate.toISOString().replace('T', ' ').substring(0, 19);
        this.http.post(this.signaturesApiUrl, {
            aksi: 'log_signature',
            digital_id: digitalId,
            user_id: this.userId,
            sign_date: isoDate,
            document_name: this.fileName || '',
            page_number: pageNumber,
            detail_id: this.detailId || '',
            edoc_id: this.edocId || ''
        }).subscribe((res) => {
            if (res === null || res === void 0 ? void 0 : res.success) {
                console.log('Signature logged:', digitalId);
            }
            else {
                console.warn('Failed to log signature:', res === null || res === void 0 ? void 0 : res.msg);
            }
        }, (err) => console.error('Error logging signature:', err));
    }
    placeTextBoxOnPage(e, p) {
        const canvas = this.getAnnotCanvas(p);
        if (!canvas)
            return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        // Normalize position to 0..100
        const x = (mouseX / rect.width) * 100;
        const y = (mouseY / rect.height) * 100;
        // Default size in percentages
        const widthPercent = 6;
        const heightPercent = 5; // Reduced from 10%
        this.textBoxes.push({
            id: 't_' + Date.now() + '_' + Math.random().toString(16).slice(2),
            page: p,
            x,
            y,
            width: widthPercent,
            height: heightPercent,
            text: '',
            color: this.textColor,
            fontSize: this.textFontSize,
            bold: true,
            italic: false,
            align: 'left'
        });
        this.activeTextBoxId = this.textBoxes[this.textBoxes.length - 1].id;
        this.toolMode = 'none';
        this.syncToolModeStyles();
        this.updateCursor();
        this.cdr.detectChanges();
        // Log to history
        this.logHistory('text', { page: p, fontSize: this.textFontSize, color: this.textColor }, p);
        // Auto-focus the textarea to show keyboard immediately
        setTimeout(() => {
            const textBoxEl = document.querySelector('.text-box.active textarea');
            if (textBoxEl) {
                textBoxEl.focus();
            }
        }, 100);
    }
    /* ================= Eraser ================= */
    changeEraserSize(delta) {
        const newSize = this.eraserSize + delta;
        if (newSize >= 5 && newSize <= 200) {
            this.eraserSize = newSize;
            this.saveSettings();
        }
    }
    eraseAtPoint(e, p) {
        const pos = this.getNormPos(e, p);
        // Scale threshold based on eraser size. 
        // Default size 20 matches ~0.02 threshold roughly
        const threshold = (this.eraserSize / 1000);
        // Check strokes
        this.strokes[p] = this.strokes[p].filter(stroke => {
            return !stroke.points.some(pt => Math.abs(pt.x - pos.x) < threshold && Math.abs(pt.y - pos.y) < threshold);
        });
        // Check shapes
        this.shapes[p] = this.shapes[p].filter(shape => {
            const centerX = (shape.startX + shape.endX) / 2;
            const centerY = (shape.startY + shape.endY) / 2;
            const halfW = Math.abs(shape.endX - shape.startX) / 2;
            const halfH = Math.abs(shape.endY - shape.startY) / 2;
            return !(pos.x >= centerX - halfW - threshold &&
                pos.x <= centerX + halfW + threshold &&
                pos.y >= centerY - halfH - threshold &&
                pos.y <= centerY + halfH + threshold);
        });
        this.redraw(p);
    }
    /* ================= Drawing ================= */
    calcLineWidth(base, pressure) {
        if (!pressure)
            return base;
        return Math.max(1, base * (0.6 + pressure * 1.8));
    }
    redraw(p = this.pageNo, includeActive = false) {
        const canvas = this.getAnnotCanvas(p);
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
        const dpr = window.devicePixelRatio || 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        this.ensurePage(p);
        // Draw all static annotations for this specific page
        for (const s of this.strokes[p])
            this.drawStroke(ctx, p, s);
        for (const sh of this.shapes[p])
            this.drawShape(ctx, p, sh);
        // Draw active if this is the target page
        if (includeActive && p === this.pageNo) {
            if (this.activeStroke)
                this.drawStroke(ctx, p, this.activeStroke);
            if (this.activeShape)
                this.drawShape(ctx, p, this.activeShape);
        }
    }
    drawStroke(ctx, p, s) {
        const canvas = this.getAnnotCanvas(p);
        if (!canvas)
            return;
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        if (s.points.length < 2)
            return;
        if (s.isHighlight) {
            ctx.save();
            ctx.globalAlpha = 0.4;
            // Highlighters multiply against the background to feel like real markers
            ctx.globalCompositeOperation = 'multiply';
            ctx.strokeStyle = s.color;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = s.size;
            // Draw as a single continuous path without multiple beginPath() calls
            // to ensure overlapping joints do not amplify the alpha transparency.
            ctx.beginPath();
            for (let i = 0; i < s.points.length; i++) {
                const pt = s.points[i];
                if (i === 0) {
                    ctx.moveTo(pt.x * w, pt.y * h);
                }
                else {
                    ctx.lineTo(pt.x * w, pt.y * h);
                }
            }
            ctx.stroke();
            ctx.restore();
            return;
        }
        ctx.strokeStyle = s.color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // To support pressure-sensitive width AND butter-smooth curves,
        // we use segmented quadratic bezier curves passing through midpoints
        for (let i = 1; i < s.points.length; i++) {
            const prevPrev = i > 1 ? s.points[i - 2] : s.points[i - 1];
            const prev = s.points[i - 1];
            const curr = s.points[i];
            const startX = (prevPrev.x + prev.x) / 2 * w;
            const startY = (prevPrev.y + prev.y) / 2 * h;
            const endX = (prev.x + curr.x) / 2 * w;
            const endY = (prev.y + curr.y) / 2 * h;
            ctx.lineWidth = this.calcLineWidth(s.size, curr.p);
            ctx.beginPath();
            if (i === 1) {
                ctx.moveTo(prev.x * w, prev.y * h);
                ctx.lineTo(endX, endY);
            }
            else if (i === s.points.length - 1) {
                ctx.moveTo(startX, startY);
                ctx.quadraticCurveTo(prev.x * w, prev.y * h, curr.x * w, curr.y * h);
            }
            else {
                ctx.moveTo(startX, startY);
                ctx.quadraticCurveTo(prev.x * w, prev.y * h, endX, endY);
            }
            ctx.stroke();
        }
    }
    drawStrokeIncremental(p, s, startIdx) {
        const canvas = this.getAnnotCanvas(p);
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.strokeStyle = s.color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const renderStart = Math.max(1, startIdx);
        for (let i = renderStart; i < s.points.length; i++) {
            const prevPrev = i > 1 ? s.points[i - 2] : s.points[i - 1];
            const prev = s.points[i - 1];
            const curr = s.points[i];
            const startX = (prevPrev.x + prev.x) / 2 * w;
            const startY = (prevPrev.y + prev.y) / 2 * h;
            const endX = (prev.x + curr.x) / 2 * w;
            const endY = (prev.y + curr.y) / 2 * h;
            ctx.lineWidth = this.calcLineWidth(s.size, curr.p);
            ctx.beginPath();
            if (i === 1) {
                ctx.moveTo(prev.x * w, prev.y * h);
                ctx.lineTo(endX, endY);
            }
            else if (i === s.points.length - 1) {
                ctx.moveTo(startX, startY);
                ctx.quadraticCurveTo(prev.x * w, prev.y * h, curr.x * w, curr.y * h);
            }
            else {
                ctx.moveTo(startX, startY);
                ctx.quadraticCurveTo(prev.x * w, prev.y * h, endX, endY);
            }
            ctx.stroke();
        }
    }
    drawShape(ctx, p, sh) {
        const canvas = this.getAnnotCanvas(p);
        if (!canvas)
            return;
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        const x1 = sh.startX * w;
        const y1 = sh.startY * h;
        const x2 = sh.endX * w;
        const y2 = sh.endY * h;
        ctx.strokeStyle = sh.color;
        ctx.lineWidth = sh.size;
        ctx.beginPath();
        switch (sh.type) {
            case 'rect':
                ctx.rect(x1, y1, x2 - x1, y2 - y1);
                if (sh.fillColor) {
                    ctx.fillStyle = sh.fillColor;
                    ctx.fill();
                }
                break;
            case 'circle': {
                const cx = (x1 + x2) / 2;
                const cy = (y1 + y2) / 2;
                const rx = Math.abs(x2 - x1) / 2;
                const ry = Math.abs(y2 - y1) / 2;
                ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                if (sh.fillColor) {
                    ctx.fillStyle = sh.fillColor;
                    ctx.fill();
                }
                break;
            }
            case 'line':
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                break;
            case 'arrow': {
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                const angle = Math.atan2(y2 - y1, x2 - x1);
                const headLen = 15;
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
                break;
            }
        }
        ctx.stroke();
    }
    /* ================= Undo/Redo per page ================= */
    canUndo() {
        this.ensurePage(this.pageNo);
        return this.strokes[this.pageNo].length > 0 || this.shapes[this.pageNo].length > 0;
    }
    canRedo() {
        this.ensurePage(this.pageNo);
        return this.redoStack[this.pageNo].length > 0;
    }
    undo() {
        this.ensurePage(this.pageNo);
        let item = this.strokes[this.pageNo].pop();
        if (!item)
            item = this.shapes[this.pageNo].pop();
        if (!item)
            return;
        this.redoStack[this.pageNo].push(item);
        this.redraw(this.pageNo);
    }
    redo() {
        this.ensurePage(this.pageNo);
        const item = this.redoStack[this.pageNo].pop();
        if (!item)
            return;
        if ('points' in item)
            this.strokes[this.pageNo].push(item);
        else
            this.shapes[this.pageNo].push(item);
        this.redraw(this.pageNo);
    }
    clearAnnotations() {
        this.ensurePage(this.pageNo);
        this.strokes[this.pageNo] = [];
        this.shapes[this.pageNo] = [];
        this.redoStack[this.pageNo] = [];
        this.textBoxes = this.textBoxes.filter(t => t.page !== this.pageNo);
        this.imageStamps = this.imageStamps.filter(i => i.page !== this.pageNo);
        this.signatureStamps = this.signatureStamps.filter(s => s.page !== this.pageNo);
        this.dateStamps = this.dateStamps.filter(d => d.page !== this.pageNo);
        this.redraw(this.pageNo);
    }
    /* ================= TextBox Operations ================= */
    selectTextBox(id, ev) {
        ev.stopPropagation();
        this.activeTextBoxId = id;
    }
    onTextBoxPointerDown(ev, id) {
        ev.stopPropagation();
        this.activeTextBoxId = id;
        this.startDrag(ev, id);
    }
    clearTextSelection() {
        this.activeTextBoxId = null;
    }
    getDragCanvasRect(p) {
        const canvas = this.getAnnotCanvas(p);
        return canvas ? canvas.getBoundingClientRect() : new DOMRect();
    }
    startDrag(e, textBoxId) {
        if (this.toolMode !== 'none')
            return;
        this.closeContextMenu();
        // Set both activeTextBoxId (for UI) and global active object (for Delete key)
        this.activeTextBoxId = textBoxId;
        this.activeObjectId = textBoxId;
        this.activeObjectType = 'text';
        const tb = this.textBoxes.find(t => t.id === textBoxId);
        if (!tb)
            return;
        // Sync UI settings with the selected text box
        this.textColor = tb.color || this.textColor;
        this.textFontSize = tb.fontSize || this.textFontSize;
        // If user tapped directly on textarea to type, do not initiate dragging or blurring.
        const target = e.target;
        if (target.tagName.toLowerCase() === 'textarea') {
            return;
        }
        const textBoxEl = e.currentTarget;
        // Lock touch-action during drag to prevent iPad scroll
        textBoxEl.style.touchAction = 'none';
        // Disable textarea to prevent iPadOS Scribble during drag
        const textareaEl = textBoxEl === null || textBoxEl === void 0 ? void 0 : textBoxEl.querySelector('textarea');
        if (textareaEl) {
            textareaEl.blur();
            textareaEl.setAttribute('readonly', 'true');
            textareaEl.style.pointerEvents = 'none';
        }
        this.isDragging = true;
        this.dragTextBoxId = textBoxId;
        const canvasRect = this.getDragCanvasRect(tb.page);
        // Convert current % position to pixels for initial offset calculation
        const startXpx = (tb.x / 100) * canvasRect.width;
        const startYpx = (tb.y / 100) * canvasRect.height;
        this.dragOffsetX = e.clientX - canvasRect.left - startXpx;
        this.dragOffsetY = e.clientY - canvasRect.top - startYpx;
        const move = (ev) => {
            ev.preventDefault();
            if (!this.isDragging || !this.dragTextBoxId)
                return;
            const t = this.textBoxes.find(x => x.id === this.dragTextBoxId);
            if (!t)
                return;
            const mouseXpx = ev.clientX - canvasRect.left - this.dragOffsetX;
            const mouseYpx = ev.clientY - canvasRect.top - this.dragOffsetY;
            // Back to normalized
            t.x = (mouseXpx / canvasRect.width) * 100;
            t.y = (mouseYpx / canvasRect.height) * 100;
            this.cdr.detectChanges();
        };
        const up = () => {
            this.isDragging = false;
            this.dragTextBoxId = null;
            // Restore touch-action so iPad can scroll PDF again
            textBoxEl.style.touchAction = '';
            // Restore textarea after drag
            if (textareaEl) {
                textareaEl.removeAttribute('readonly');
                textareaEl.style.pointerEvents = '';
            }
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    }
    startTextBoxDrag(ev, textBoxId) {
        ev.preventDefault();
        ev.stopPropagation();
        const tb = this.textBoxes.find(t => t.id === textBoxId);
        if (!tb)
            return;
        this.activeTextBoxId = textBoxId;
        this.startDrag(ev, textBoxId);
    }
    onTextBoxInput(event, tb) {
        const textarea = event.target;
        const lines = tb.text.split('\n');
        let maxLineWidthPx = 30;
        const measureSpan = document.createElement('span');
        measureSpan.style.cssText = `position: absolute; visibility: hidden; white-space: pre; font-family: 'THSarabunNew', sans-serif; font-size: ${tb.fontSize * this.zoom}px; font-weight: ${tb.bold ? 'bold' : 'normal'}; font-style: ${tb.italic ? 'italic' : 'normal'};`;
        lines.forEach(line => {
            measureSpan.textContent = line || ' ';
            document.body.appendChild(measureSpan);
            const lineWidth = measureSpan.offsetWidth + 18; // 18px = border(2) + container padding(6) + textarea padding(6) + buffer(4)
            if (lineWidth > maxLineWidthPx)
                maxLineWidthPx = lineWidth;
            document.body.removeChild(measureSpan);
        });
        const canvasRect = this.getDragCanvasRect(tb.page);
        if (canvasRect.width > 0 && canvasRect.height > 0) {
            // Apply width first so DOM reflects correct wrapping before height measurement
            tb.width = Math.min(95, (maxLineWidthPx / canvasRect.width) * 100);
            this.cdr.detectChanges();
            // Reset height to 0 so scrollHeight reflects actual content (including any soft-wrapping)
            textarea.style.height = '0px';
            const contentHeightPx = textarea.scrollHeight;
            textarea.style.height = contentHeightPx + 'px'; // prevent scroll flicker
            const minHeightPx = (tb.fontSize * 1.4 * this.zoom) + 6;
            const finalHeightPx = Math.max(contentHeightPx, minHeightPx);
            // +6px for container top+bottom padding (3px each side)
            tb.height = Math.min(95, ((finalHeightPx + 6) / canvasRect.height) * 100);
        }
        this.cdr.detectChanges();
        // Clear inline style — container is now updated, CSS `height: 100%` takes over
        textarea.style.height = '';
    }
    onTextBoxFocus(id) {
        this.activeTextBoxId = id;
        this.activeObjectId = id;
        this.activeObjectType = 'text';
        const tb = this.textBoxes.find(t => t.id === id);
        if (tb) {
            this.textColor = tb.color || this.textColor;
            this.textFontSize = tb.fontSize || this.textFontSize;
        }
    }
    /* ================= TextBox Resize ================= */
    startResize(ev, textBoxId) {
        if (ev.button === 2 || ev.ctrlKey)
            return;
        ev.stopPropagation();
        ev.preventDefault();
        const tb = this.textBoxes.find(t => t.id === textBoxId);
        if (!tb)
            return;
        // Sync UI settings
        this.activeTextBoxId = textBoxId;
        this.activeObjectId = textBoxId;
        this.activeObjectType = 'text';
        this.textColor = tb.color || this.textColor;
        this.textFontSize = tb.fontSize || this.textFontSize;
        this.isResizing = true;
        this.resizeTextBoxId = textBoxId;
        const canvasRect = this.getDragCanvasRect(tb.page);
        const startX = ev.clientX;
        const startY = ev.clientY;
        const startW_norm = tb.width;
        const startH_norm = tb.height;
        const move = (e) => {
            e.preventDefault();
            if (!this.isResizing || !this.resizeTextBoxId)
                return;
            const t = this.textBoxes.find(x => x.id === this.resizeTextBoxId);
            if (!t)
                return;
            const deltaX_px = e.clientX - startX;
            const deltaY_px = e.clientY - startY;
            t.width = Math.max(5, startW_norm + (deltaX_px / canvasRect.width) * 100);
            t.height = Math.max(2, startH_norm + (deltaY_px / canvasRect.height) * 100);
            this.cdr.detectChanges();
        };
        const up = () => {
            this.isResizing = false;
            this.resizeTextBoxId = null;
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    }
    startResizeRight(ev, textBoxId) {
        if (ev.button === 2 || ev.ctrlKey)
            return;
        ev.stopPropagation();
        ev.preventDefault();
        const tb = this.textBoxes.find(t => t.id === textBoxId);
        if (!tb)
            return;
        this.activeTextBoxId = textBoxId;
        this.activeObjectId = textBoxId;
        this.activeObjectType = 'text';
        const canvasRect = this.getDragCanvasRect(tb.page);
        const startX = ev.clientX;
        const startW = tb.width;
        const move = (e) => {
            e.preventDefault();
            const deltaX = (e.clientX - startX) / canvasRect.width * 100;
            tb.width = Math.max(5, Math.min(95 - tb.x, startW + deltaX));
            this.cdr.detectChanges();
        };
        const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    }
    startResizeLeft(ev, textBoxId) {
        if (ev.button === 2 || ev.ctrlKey)
            return;
        ev.stopPropagation();
        ev.preventDefault();
        const tb = this.textBoxes.find(t => t.id === textBoxId);
        if (!tb)
            return;
        this.activeTextBoxId = textBoxId;
        this.activeObjectId = textBoxId;
        this.activeObjectType = 'text';
        const canvasRect = this.getDragCanvasRect(tb.page);
        const startX = ev.clientX;
        const startTbX = tb.x;
        const startTbW = tb.width;
        const move = (e) => {
            e.preventDefault();
            const deltaX = (e.clientX - startX) / canvasRect.width * 100;
            const newX = Math.max(0, startTbX + deltaX);
            const newW = Math.max(5, startTbW - deltaX);
            if (newX + newW <= 98) {
                tb.x = newX;
                tb.width = newW;
            }
            this.cdr.detectChanges();
        };
        const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    }
    removeTextBox(textBoxId) {
        this.textBoxes = this.textBoxes.filter(t => t.id !== textBoxId);
        if (this.activeTextBoxId === textBoxId)
            this.activeTextBoxId = null;
        this.cdr.detectChanges();
    }
    clampOneTextBox(tb) {
        // Both tb.x, tb.y, tb.width, tb.height are in 0-100 units
        tb.x = Math.max(0, Math.min(tb.x, 100 - tb.width));
        tb.y = Math.max(0, Math.min(tb.y, 100 - tb.height));
    }
    clampTextBoxesToView() {
        this.textBoxes.forEach(tb => this.clampOneTextBox(tb));
    }
    /* ================= Image Stamp Operations ================= */
    triggerImageUpload() {
        var _a, _b;
        (_b = (_a = this.fileInputRef) === null || _a === void 0 ? void 0 : _a.nativeElement) === null || _b === void 0 ? void 0 : _b.click();
    }
    normalizeImageToPng(dataUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => resolve(dataUrl); // fallback: keep original
            img.src = dataUrl;
        });
    }
    onImageSelected(event) {
        const input = event.target;
        if (!input.files || !input.files[0])
            return;
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const rawDataUrl = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            const dataUrl = yield this.normalizeImageToPng(rawDataUrl);
            const img = new Image();
            img.onload = () => {
                let w = img.naturalWidth;
                let h = img.naturalHeight;
                // Scale display size (px) to at most 30% of canvas width, min 5%
                const canvasRect = this.getDragCanvasRect(this.pageNo);
                const cw = canvasRect.width || 600;
                const ch = canvasRect.height || 800;
                const maxPx = Math.min(cw * 0.4, ch * 0.4);
                if (w > maxPx || h > maxPx) {
                    if (w > h) {
                        h = (h / w) * maxPx;
                        w = maxPx;
                    }
                    else {
                        w = (w / h) * maxPx;
                        h = maxPx;
                    }
                }
                this.imageStamps.push({
                    id: 'img_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                    page: this.pageNo,
                    x: ((cw / 2 - w / 2) / cw) * 100,
                    y: ((ch / 2 - h / 2) / ch) * 100,
                    width: (w / cw) * 100,
                    height: (h / ch) * 100,
                    dataUrl
                });
                this.logHistory('image', { type: 'upload' }, this.pageNo);
                this.cdr.detectChanges();
            };
            img.src = dataUrl;
        });
        reader.readAsDataURL(file);
        input.value = ''; // Reset for same file selection
    }
    startImageDrag(e, imgId) {
        if (this.toolMode !== 'none')
            return;
        this.closeContextMenu();
        this.activeObjectId = imgId;
        this.activeObjectType = 'image';
        const img = this.imageStamps.find(i => i.id === imgId);
        if (!img)
            return;
        this.isDraggingImage = true;
        this.dragImageId = imgId;
        const canvasRect = this.getDragCanvasRect(img.page);
        const startXpx = (img.x / 100) * canvasRect.width;
        const startYpx = (img.y / 100) * canvasRect.height;
        this.dragOffsetX = e.clientX - canvasRect.left - startXpx;
        this.dragOffsetY = e.clientY - canvasRect.top - startYpx;
        const move = (ev) => {
            ev.preventDefault();
            if (!this.isDraggingImage || !this.dragImageId)
                return;
            const i = this.imageStamps.find(x => x.id === this.dragImageId);
            if (!i)
                return;
            const mouseXpx = ev.clientX - canvasRect.left - this.dragOffsetX;
            const mouseYpx = ev.clientY - canvasRect.top - this.dragOffsetY;
            i.x = (mouseXpx / canvasRect.width) * 100;
            i.y = (mouseYpx / canvasRect.height) * 100;
            this.cdr.detectChanges();
        };
        const up = () => {
            this.isDraggingImage = false;
            this.dragImageId = null;
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    }
    startImageResize(ev, imageId, direction = 'se') {
        if (ev.button === 2 || ev.ctrlKey)
            return;
        ev.stopPropagation();
        ev.preventDefault();
        const img = this.imageStamps.find(i => i.id === imageId);
        if (!img)
            return;
        this.isResizingImage = true;
        this.resizeImageId = imageId;
        const canvasRect = this.getDragCanvasRect(img.page);
        const startX = ev.clientX;
        const startY = ev.clientY;
        const startW_norm = img.width;
        const startH_norm = img.height;
        const startX_norm = img.x;
        const startY_norm = img.y;
        const aspectRatio = startW_norm / startH_norm;
        const move = (e) => {
            e.preventDefault();
            if (!this.isResizingImage || !this.resizeImageId)
                return;
            const i = this.imageStamps.find(x => x.id === this.resizeImageId);
            if (!i)
                return;
            const deltaX_norm = ((e.clientX - startX) / canvasRect.width) * 100;
            const deltaY_norm = ((e.clientY - startY) / canvasRect.height) * 100;
            const isShift = e.shiftKey; // Maintain aspect ratio if shift is pressed
            let newW = startW_norm;
            let newH = startH_norm;
            let newX = startX_norm;
            let newY = startY_norm;
            if (direction.includes('e')) {
                newW = Math.max(2, startW_norm + deltaX_norm);
            }
            if (direction.includes('w')) {
                newW = Math.max(2, startW_norm - deltaX_norm);
                newX = startX_norm + (startW_norm - newW);
            }
            if (direction.includes('s')) {
                newH = Math.max(2, startH_norm + deltaY_norm);
            }
            if (direction.includes('n')) {
                newH = Math.max(2, startH_norm - deltaY_norm);
                newY = startY_norm + (startH_norm - newH);
            }
            // Maintain aspect ratio for corner handles or if Shift is held
            if (isShift || direction.length > 1) {
                if (direction.includes('e') || direction.includes('w')) {
                    newH = newW / aspectRatio;
                    if (direction.includes('n')) {
                        newY = startY_norm + (startH_norm - newH);
                    }
                }
                else {
                    newW = newH * aspectRatio;
                    if (direction.includes('w')) {
                        newX = startX_norm + (startW_norm - newW);
                    }
                }
            }
            i.width = newW;
            i.height = newH;
            i.x = newX;
            i.y = newY;
            this.cdr.detectChanges();
        };
        const up = () => {
            this.isResizingImage = false;
            this.resizeImageId = null;
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    }
    removeImage(imageId) {
        this.imageStamps = this.imageStamps.filter(i => i.id !== imageId);
        this.cdr.detectChanges();
    }
    /* ================= Signature Pad ================= */
    openSignaturePad() {
        this.showSignaturePad = true;
        this.signaturePoints = [];
        this.signatureStrokes = [];
        // Initialize canvas after modal is shown
        setTimeout(() => {
            this.initSignatureCanvas();
        }, 100);
    }
    closeSignaturePad() {
        this.showSignaturePad = false;
        this.signaturePoints = [];
        this.signatureStrokes = [];
    }
    setSignaturePenColor(color) {
        this.signaturePenColor = color;
    }
    changeSignaturePenSize(delta) {
        const newSize = this.signaturePenSize + delta;
        if (newSize >= 1 && newSize <= 10) {
            this.signaturePenSize = newSize;
        }
    }
    initSignatureCanvas() {
        var _a;
        const canvas = (_a = this.signatureCanvasRef) === null || _a === void 0 ? void 0 : _a.nativeElement;
        if (!canvas)
            return;
        // Responsive canvas size based on container
        const container = canvas.parentElement;
        const containerWidth = container ? container.clientWidth - 4 : 400;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(containerWidth * dpr);
        canvas.height = Math.floor((containerWidth / 2) * dpr);
        canvas.style.width = containerWidth + 'px';
        canvas.style.height = (containerWidth / 2) + 'px';
        this.signatureCtx = canvas.getContext('2d');
        if (this.signatureCtx) {
            this.signatureCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
            this.signatureCtx.strokeStyle = this.signaturePenColor;
            this.signatureCtx.lineWidth = this.signaturePenSize;
            this.signatureCtx.lineCap = 'round';
            this.signatureCtx.lineJoin = 'round';
        }
        // Remove old listeners first (prevents duplicates)
        canvas.removeEventListener('pointerdown', this.boundOnSigStart);
        canvas.removeEventListener('pointermove', this.boundOnSigMove);
        canvas.removeEventListener('pointerup', this.boundOnSigEnd);
        canvas.removeEventListener('pointerleave', this.boundOnSigEnd);
        this.boundOnSigStart = this.onSignatureStart.bind(this);
        this.boundOnSigMove = this.onSignatureMove.bind(this);
        this.boundOnSigEnd = this.onSignatureEnd.bind(this);
        canvas.addEventListener('pointerdown', this.boundOnSigStart);
        canvas.addEventListener('pointermove', this.boundOnSigMove);
        canvas.addEventListener('pointerup', this.boundOnSigEnd);
        canvas.addEventListener('pointerleave', this.boundOnSigEnd);
    }
    getSignaturePos(e) {
        const canvas = this.signatureCanvasRef.nativeElement;
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left),
            y: (e.clientY - rect.top)
        };
    }
    onSignatureStart(e) {
        e.preventDefault();
        this.isDrawingSignature = true;
        const pos = this.getSignaturePos(e);
        this.signaturePoints = [pos];
    }
    onSignatureMove(e) {
        if (!this.isDrawingSignature || !this.signatureCtx)
            return;
        e.preventDefault();
        const pos = this.getSignaturePos(e);
        this.signaturePoints.push(pos);
        // Redraw everything for smooth Bezier rendering
        this.redrawSignatureCanvas();
    }
    onSignatureEnd(e) {
        if (!this.isDrawingSignature)
            return;
        this.isDrawingSignature = false;
        if (this.signaturePoints.length >= 2) {
            this.signatureStrokes.push({
                points: [...this.signaturePoints],
                color: this.signaturePenColor,
                size: this.signaturePenSize
            });
        }
        this.signaturePoints = [];
    }
    redrawSignatureCanvas() {
        var _a;
        const canvas = (_a = this.signatureCanvasRef) === null || _a === void 0 ? void 0 : _a.nativeElement;
        if (!canvas || !this.signatureCtx)
            return;
        const ctx = this.signatureCtx;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        // Draw guide line at ~70% height
        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, h * 0.7);
        ctx.lineTo(w - 20, h * 0.7);
        ctx.stroke();
        ctx.restore();
        // Draw all saved strokes
        for (const stroke of this.signatureStrokes) {
            this.drawBezierStroke(ctx, stroke.points, stroke.color, stroke.size);
        }
        // Draw current active stroke
        if (this.signaturePoints.length >= 2) {
            this.drawBezierStroke(ctx, this.signaturePoints, this.signaturePenColor, this.signaturePenSize);
        }
    }
    drawBezierStroke(ctx, points, color, size, scale = 1) {
        if (points.length < 2)
            return;
        ctx.strokeStyle = color;
        ctx.lineWidth = size * scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(points[0].x * scale, points[0].y * scale);
        if (points.length === 2) {
            ctx.lineTo(points[1].x * scale, points[1].y * scale);
        }
        else {
            // Quadratic Bezier smoothing through midpoints
            for (let i = 1; i < points.length - 1; i++) {
                const midX = (points[i].x + points[i + 1].x) / 2 * scale;
                const midY = (points[i].y + points[i + 1].y) / 2 * scale;
                ctx.quadraticCurveTo(points[i].x * scale, points[i].y * scale, midX, midY);
            }
            // Connect to last point
            const last = points[points.length - 1];
            ctx.lineTo(last.x * scale, last.y * scale);
        }
        ctx.stroke();
    }
    clearSignaturePad() {
        this.signaturePoints = [];
        this.signatureStrokes = [];
        this.redrawSignatureCanvas();
    }
    /** Render strokes at high resolution on an offscreen canvas and auto-crop */
    trimSignatureCanvas() {
        var _a;
        const srcCanvas = (_a = this.signatureCanvasRef) === null || _a === void 0 ? void 0 : _a.nativeElement;
        if (!srcCanvas)
            return '';
        // Get the CSS size of the on-screen canvas
        const cssW = srcCanvas.clientWidth || 400;
        const cssH = srcCanvas.clientHeight || 200;
        // Render at 8x CSS size for crisp PDF output
        const exportScale = 8;
        const offW = Math.floor(cssW * exportScale);
        const offH = Math.floor(cssH * exportScale);
        const offCanvas = document.createElement('canvas');
        offCanvas.width = offW;
        offCanvas.height = offH;
        const ctx = offCanvas.getContext('2d');
        ctx.clearRect(0, 0, offW, offH);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // Draw all strokes scaled up with their original color/size (no guide line)
        for (const stroke of this.signatureStrokes) {
            if (stroke.points.length < 2)
                continue;
            this.drawBezierStroke(ctx, stroke.points, stroke.color, stroke.size, exportScale);
        }
        // Include any active points
        if (this.signaturePoints.length >= 2) {
            this.drawBezierStroke(ctx, this.signaturePoints, this.signaturePenColor, this.signaturePenSize, exportScale);
        }
        // Auto-crop to content bounds
        const imgData = ctx.getImageData(0, 0, offW, offH);
        const { data, width, height } = imgData;
        let top = height, left = width, right = 0, bottom = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const alpha = data[(y * width + x) * 4 + 3];
                if (alpha > 10) {
                    if (y < top)
                        top = y;
                    if (y > bottom)
                        bottom = y;
                    if (x < left)
                        left = x;
                    if (x > right)
                        right = x;
                }
            }
        }
        // No content found
        if (top > bottom || left > right)
            return offCanvas.toDataURL('image/png');
        // Add padding
        const pad = Math.round(4 * exportScale);
        top = Math.max(0, top - pad);
        left = Math.max(0, left - pad);
        bottom = Math.min(height - 1, bottom + pad);
        right = Math.min(width - 1, right + pad);
        const trimW = right - left + 1;
        const trimH = bottom - top + 1;
        const trimCanvas = document.createElement('canvas');
        trimCanvas.width = trimW;
        trimCanvas.height = trimH;
        const trimCtx = trimCanvas.getContext('2d');
        trimCtx.drawImage(offCanvas, left, top, trimW, trimH, 0, 0, trimW, trimH);
        return trimCanvas.toDataURL('image/png');
    }
    saveSignature() {
        var _a;
        const canvas = (_a = this.signatureCanvasRef) === null || _a === void 0 ? void 0 : _a.nativeElement;
        const totalPoints = this.signatureStrokes.reduce((sum, s) => sum + s.points.length, 0);
        if (!canvas || totalPoints < 2) {
            this.closeSignaturePad();
            return;
        }
        const dataUrl = this.trimSignatureCanvas();
        this.placeSignatureOnCanvas(dataUrl);
        this.closeSignaturePad();
    }
    startSignatureDrag(e, sigId) {
        if (this.toolMode !== 'none')
            return;
        this.closeContextMenu();
        this.activeObjectId = sigId;
        this.activeObjectType = 'signature';
        const sig = this.signatureStamps.find(s => s.id === sigId);
        if (!sig)
            return;
        const canvasRect = this.getDragCanvasRect(sig.page);
        const startXpx = (sig.x / 100) * canvasRect.width;
        const startYpx = (sig.y / 100) * canvasRect.height;
        const offsetX = e.clientX - canvasRect.left - startXpx;
        const offsetY = e.clientY - canvasRect.top - startYpx;
        const move = (ev) => {
            ev.preventDefault();
            const s = this.signatureStamps.find(x => x.id === sigId);
            if (!s)
                return;
            const mouseXpx = ev.clientX - canvasRect.left - offsetX;
            const mouseYpx = ev.clientY - canvasRect.top - offsetY;
            s.x = (mouseXpx / canvasRect.width) * 100;
            s.y = (mouseYpx / canvasRect.height) * 100;
            this.cdr.detectChanges();
        };
        const up = () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    }
    startSignatureResize(ev, sigId, direction = 'se') {
        if (ev.button === 2 || ev.ctrlKey)
            return;
        ev.stopPropagation();
        ev.preventDefault();
        const sig = this.signatureStamps.find(s => s.id === sigId);
        if (!sig)
            return;
        const canvasRect = this.getDragCanvasRect(sig.page);
        const startX = ev.clientX;
        const startY = ev.clientY;
        const startW_norm = sig.width;
        const startH_norm = sig.height;
        const startX_norm = sig.x;
        const startY_norm = sig.y;
        const aspectRatio = startW_norm / startH_norm;
        const move = (e) => {
            e.preventDefault();
            const s = this.signatureStamps.find(x => x.id === sigId);
            if (!s)
                return;
            const deltaX_norm = ((e.clientX - startX) / canvasRect.width) * 100;
            const deltaY_norm = ((e.clientY - startY) / canvasRect.height) * 100;
            const isShift = e.shiftKey;
            let newW = startW_norm;
            let newH = startH_norm;
            let newX = startX_norm;
            let newY = startY_norm;
            if (direction.includes('e')) {
                newW = Math.max(2, startW_norm + deltaX_norm);
            }
            if (direction.includes('w')) {
                newW = Math.max(2, startW_norm - deltaX_norm);
                newX = startX_norm + (startW_norm - newW);
            }
            if (direction.includes('s')) {
                newH = Math.max(2, startH_norm + deltaY_norm);
            }
            if (direction.includes('n')) {
                newH = Math.max(2, startH_norm - deltaY_norm);
                newY = startY_norm + (startH_norm - newH);
            }
            // Maintain aspect ratio for corners or if Shift is held
            if (isShift || direction.length > 1) {
                if (direction.includes('e') || direction.includes('w')) {
                    newH = newW / aspectRatio;
                    if (direction.includes('n')) {
                        newY = startY_norm + (startH_norm - newH);
                    }
                }
                else {
                    newW = newH * aspectRatio;
                    if (direction.includes('w')) {
                        newX = startX_norm + (startW_norm - newW);
                    }
                }
            }
            s.width = newW;
            s.height = newH;
            s.x = newX;
            s.y = newY;
            this.cdr.detectChanges();
        };
        const up = () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    }
    removeSignature(sigId) {
        this.signatureStamps = this.signatureStamps.filter(s => s.id !== sigId);
        this.cdr.detectChanges();
    }
    /* ================= Saved Signatures (Database) ================= */
    // Open signature picker modal
    openSignaturePickerOrPad() {
        // If user has saved signatures, show picker
        if (this.savedSignatures.length > 0) {
            this.showSignaturePicker = true;
        }
        else {
            // Otherwise, load from API first
            this.loadSavedSignatures().then(() => {
                if (this.savedSignatures.length > 0) {
                    this.showSignaturePicker = true;
                }
                else {
                    // No saved signatures, open draw pad
                    this.openSignaturePad();
                }
            });
        }
    }
    closeSignaturePicker() {
        this.showSignaturePicker = false;
    }
    // Load saved signatures from API
    loadSavedSignatures() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.userId) {
                console.warn('userId is not set, cannot load signatures');
                return;
            }
            this.isLoadingSignatures = true;
            try {
                const response = yield this.http.post(this.signaturesApiUrl, {
                    aksi: 'get_signatures',
                    user_id: this.userId
                }).toPromise();
                if (response === null || response === void 0 ? void 0 : response.success) {
                    this.savedSignatures = response.signatures || [];
                }
                else {
                    console.error('Failed to load signatures:', response === null || response === void 0 ? void 0 : response.msg);
                }
            }
            catch (err) {
                console.error('Error loading signatures:', err);
            }
            finally {
                this.isLoadingSignatures = false;
            }
        });
    }
    // Save current signature to database
    saveSignatureToDatabase(signatureName) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const canvas = (_a = this.signatureCanvasRef) === null || _a === void 0 ? void 0 : _a.nativeElement;
            const totalPoints = this.signatureStrokes.reduce((sum, s) => sum + s.points.length, 0);
            if (!canvas || totalPoints < 2) {
                return;
            }
            if (!this.userId) {
                console.warn('userId is not set, cannot save signature');
                this.saveSignature(); // Just use locally
                return;
            }
            const dataUrl = this.trimSignatureCanvas();
            this.isLoadingSignatures = true;
            try {
                const response = yield this.http.post(this.signaturesApiUrl, {
                    aksi: 'save_signature',
                    user_id: this.userId,
                    signature_name: signatureName || '',
                    signature_data: dataUrl
                }).toPromise();
                if (response === null || response === void 0 ? void 0 : response.success) {
                    // Add to local list
                    this.savedSignatures.push({
                        id: response.id,
                        user_id: this.userId,
                        signature_name: response.signature_name,
                        signature_data: dataUrl,
                        is_default: this.savedSignatures.length === 0,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });
                    // Also place the signature on canvas
                    this.placeSignatureOnCanvas(dataUrl);
                }
                else {
                    console.error('Failed to save signature:', response === null || response === void 0 ? void 0 : response.msg);
                    // Fallback: just use locally
                    this.saveSignature();
                }
            }
            catch (err) {
                console.error('Error saving signature:', err);
                this.saveSignature();
            }
            finally {
                this.isLoadingSignatures = false;
                this.closeSignaturePad();
            }
        });
    }
    // Use a saved signature from the list
    useSavedSignature(sig) {
        this.placeSignatureOnCanvas(sig.signature_data);
        this.closeSignaturePicker();
    }
    presentToast(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const toast = yield this.toastCtrl.create({
                message: msg,
                duration: 2000,
                position: 'top'
            });
            toast.present();
        });
    }
    // Place signature image on canvas (Starts placement mode)
    placeSignatureOnCanvas(dataUrl) {
        this.pendingSignatureDataUrl = dataUrl;
        this.toolMode = 'signature';
        this.updateCursor();
        this.presentToast('คลิกที่ PDF เพื่อวางลายเซ็น');
    }
    // Delete saved signature from database
    deleteSavedSignature(sig, event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event) {
                event.stopPropagation();
            }
            if (!this.userId)
                return;
            this.isLoadingSignatures = true;
            try {
                const response = yield this.http.post(this.signaturesApiUrl, {
                    aksi: 'delete_signature',
                    id: sig.id,
                    user_id: this.userId
                }).toPromise();
                if (response === null || response === void 0 ? void 0 : response.success) {
                    this.savedSignatures = this.savedSignatures.filter(s => s.id !== sig.id);
                }
                else {
                    console.error('Failed to delete signature:', response === null || response === void 0 ? void 0 : response.msg);
                }
            }
            catch (err) {
                console.error('Error deleting signature:', err);
            }
            finally {
                this.isLoadingSignatures = false;
            }
        });
    }
    // Set signature as default
    setDefaultSignature(sig, event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event) {
                event.stopPropagation();
            }
            if (!this.userId)
                return;
            try {
                const response = yield this.http.post(this.signaturesApiUrl, {
                    aksi: 'set_default',
                    id: sig.id,
                    user_id: this.userId
                }).toPromise();
                if (response === null || response === void 0 ? void 0 : response.success) {
                    // Update local list
                    this.savedSignatures.forEach(s => {
                        s.is_default = (s.id === sig.id);
                    });
                }
            }
            catch (err) {
                console.error('Error setting default:', err);
            }
        });
    }
    // Open signature pad from picker (to draw new one)
    openSignaturePadFromPicker() {
        this.closeSignaturePicker();
        this.openSignaturePad();
    }
    // Trigger file input for signature upload
    triggerSignatureUpload() {
        var _a, _b;
        (_b = (_a = this.signatureFileInputRef) === null || _a === void 0 ? void 0 : _a.nativeElement) === null || _b === void 0 ? void 0 : _b.click();
    }
    // Handle signature file selection
    onSignatureFileSelected(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = event.target;
            if (!input.files || input.files.length === 0)
                return;
            const file = input.files[0];
            // Validate file type
            if (!file.type.startsWith('image/')) {
                console.error('Invalid file type:', file.type);
                return;
            }
            // Convert to base64
            const reader = new FileReader();
            reader.onload = (e) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                let dataUrl = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                if (!dataUrl)
                    return;
                // Remove white background
                this.isLoadingSignatures = true;
                try {
                    dataUrl = yield this.removeWhiteBackground(dataUrl);
                }
                catch (err) {
                    console.warn('Could not remove background:', err);
                }
                // Save to database if userId is set
                if (this.userId) {
                    try {
                        const response = yield this.http.post(this.signaturesApiUrl, {
                            aksi: 'save_signature',
                            user_id: this.userId,
                            signature_name: file.name.replace(/\.[^/.]+$/, ''),
                            signature_data: dataUrl
                        }).toPromise();
                        if (response === null || response === void 0 ? void 0 : response.success) {
                            this.savedSignatures.push({
                                id: response.id,
                                user_id: this.userId,
                                signature_name: response.signature_name,
                                signature_data: dataUrl,
                                is_default: this.savedSignatures.length === 0,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                            });
                        }
                    }
                    catch (err) {
                        console.error('Error uploading signature:', err);
                    }
                }
                else {
                    // No userId, just use directly
                    this.placeSignatureOnCanvas(dataUrl);
                    this.closeSignaturePicker();
                }
                this.isLoadingSignatures = false;
                // Reset input
                input.value = '';
            });
            reader.readAsDataURL(file);
        });
    }
    // Remove white/light background from image, making it transparent
    removeWhiteBackground(dataUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject('Could not get canvas context');
                    return;
                }
                // Draw image
                ctx.drawImage(img, 0, 0);
                // Get pixel data
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                // Threshold for "white" - pixels with RGB all above this value will be made transparent
                const threshold = 240;
                // Also make near-white pixels semi-transparent for smoother edges
                const softThreshold = 200;
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    // Check if pixel is white/near-white
                    if (r > threshold && g > threshold && b > threshold) {
                        // Make fully transparent
                        data[i + 3] = 0;
                    }
                    else if (r > softThreshold && g > softThreshold && b > softThreshold) {
                        // Make semi-transparent for smoother edges
                        const avg = (r + g + b) / 3;
                        const alpha = Math.max(0, 255 - (avg - softThreshold) * (255 / (threshold - softThreshold)));
                        data[i + 3] = Math.min(data[i + 3], alpha);
                    }
                }
                // Put modified data back
                ctx.putImageData(imageData, 0, 0);
                // Return as PNG (supports transparency)
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => reject('Failed to load image');
            img.src = dataUrl;
        });
    }
    /* ================= PDF Form Fields ================= */
    enableFormFieldMode(type) {
        this.formFieldType = type;
        this.toolMode = 'formfield';
        this.showMarkOptions = true;
        this.updateCursor();
        const labels = { text: 'Text Field', checkbox: 'Checkbox', radio: 'Radio Button' };
        this.presentToast(`คลิกบนเอกสารเพื่อวาง ${labels[type]}`);
    }
    getFormFieldsForPage(page) {
        return this.pdfFormFields.filter(f => f.page === page);
    }
    removeFormField(id) {
        this.pdfFormFields = this.pdfFormFields.filter(f => f.id !== id);
        this.cdr.detectChanges();
    }
    startFormFieldDrag(e, id) {
        if (e.button === 2 || e.ctrlKey)
            return;
        const target = e.target;
        if (target.closest('button') || target.classList.contains('resize-handle'))
            return;
        e.stopPropagation();
        e.preventDefault();
        this.activeFormFieldId = id;
        const ff = this.pdfFormFields.find(f => f.id === id);
        if (!ff)
            return;
        const canvasRect = this.getDragCanvasRect(ff.page);
        const startXpx = (ff.x / 100) * canvasRect.width;
        const startYpx = (ff.y / 100) * canvasRect.height;
        const offsetX = e.clientX - canvasRect.left - startXpx;
        const offsetY = e.clientY - canvasRect.top - startYpx;
        const move = (ev) => {
            ev.preventDefault();
            const f = this.pdfFormFields.find(x => x.id === id);
            if (!f)
                return;
            f.x = ((ev.clientX - canvasRect.left - offsetX) / canvasRect.width) * 100;
            f.y = ((ev.clientY - canvasRect.top - offsetY) / canvasRect.height) * 100;
            this.cdr.detectChanges();
        };
        const up = () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    }
    startMarkDrag(e, markId) {
        if (e.button === 2 || e.ctrlKey)
            return;
        const target = e.target;
        if (target.closest('button') || target.classList.contains('pff-resize-handle'))
            return;
        e.stopPropagation();
        e.preventDefault();
        this.activeObjectId = markId;
        this.activeObjectType = 'image';
        this.cdr.detectChanges();
        const img = this.imageStamps.find(i => i.id === markId);
        if (!img)
            return;
        const canvasRect = this.getDragCanvasRect(img.page);
        const offsetX = e.clientX - canvasRect.left - (img.x / 100) * canvasRect.width;
        const offsetY = e.clientY - canvasRect.top - (img.y / 100) * canvasRect.height;
        const move = (ev) => {
            ev.preventDefault();
            const i = this.imageStamps.find(x => x.id === markId);
            if (!i)
                return;
            i.x = ((ev.clientX - canvasRect.left - offsetX) / canvasRect.width) * 100;
            i.y = ((ev.clientY - canvasRect.top - offsetY) / canvasRect.height) * 100;
            this.cdr.detectChanges();
        };
        const up = () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    }
    startFormFieldResize(e, id, dir) {
        e.stopPropagation();
        e.preventDefault();
        const ff = this.pdfFormFields.find(f => f.id === id);
        if (!ff)
            return;
        const canvasRect = this.getDragCanvasRect(ff.page);
        const startX = e.clientX;
        const startY = e.clientY;
        const origX = ff.x;
        const origY = ff.y;
        const origW = ff.width;
        const origH = ff.height;
        const move = (ev) => {
            ev.preventDefault();
            const f = this.pdfFormFields.find(x => x.id === id);
            if (!f)
                return;
            const dx = ((ev.clientX - startX) / canvasRect.width) * 100;
            const dy = ((ev.clientY - startY) / canvasRect.height) * 100;
            if (dir.includes('e'))
                f.width = Math.max(2, origW + dx);
            if (dir.includes('s'))
                f.height = Math.max(2, origH + dy);
            if (dir.includes('w')) {
                f.x = origX + dx;
                f.width = Math.max(2, origW - dx);
            }
            if (dir.includes('n')) {
                f.y = origY + dy;
                f.height = Math.max(2, origH - dy);
            }
            this.cdr.detectChanges();
        };
        const up = () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    }
    changeFormFieldFontSize(id, delta) {
        var _a;
        const ff = this.pdfFormFields.find(f => f.id === id);
        if (!ff)
            return;
        ff.fontSize = Math.max(6, Math.min(72, ((_a = ff.fontSize) !== null && _a !== void 0 ? _a : 12) + delta));
        this.cdr.detectChanges();
    }
    changeFormFieldSize(id, delta) {
        const ff = this.pdfFormFields.find(f => f.id === id);
        if (!ff)
            return;
        if (ff.type === 'text') {
            ff.height = Math.max(1.5, Math.min(30, ff.height + delta));
        }
        else {
            const s = Math.max(1, Math.min(30, ff.width + delta));
            ff.width = s;
            ff.height = s;
        }
        this.cdr.detectChanges();
    }
    toggleFormFieldBorder(id) {
        var _a;
        const ff = this.pdfFormFields.find(f => f.id === id);
        if (!ff)
            return;
        ff.borderVisible = !((_a = ff.borderVisible) !== null && _a !== void 0 ? _a : true);
        this.cdr.detectChanges();
    }
    /* ================= Quick Mark Stamps ================= */
    enableMarkMode(type) {
        this.markType = type;
        this.toolMode = 'mark';
        this.showMarkOptions = true;
        this.updateCursor();
        const labels = {
            check: '✓ เครื่องหมายถูก', cross: '✗ เครื่องหมายผิด', dot: '● จุด',
        };
        this.presentToast(`คลิกบนเอกสารเพื่อวาง ${labels[type]}`);
    }
    setMarkColor(color) {
        this.markColor = color;
    }
    changeMarkSize(delta) {
        this.markSize = Math.max(12, Math.min(96, this.markSize + delta));
    }
    changeMarkStampSize(id, delta) {
        const img = this.imageStamps.find(i => i.id === id);
        if (!img)
            return;
        const newSize = Math.max(1, Math.min(25, img.width + delta * 0.5));
        img.width = newSize;
        img.height = newSize;
        if (img.markType && img.markColor) {
            img.dataUrl = this.generateMarkDataUrl(img.markType, img.markColor, Math.round(newSize * 10));
        }
        this.cdr.detectChanges();
    }
    generateMarkDataUrl(type, color, sizePx) {
        const s = Math.round(sizePx);
        const canvas = document.createElement('canvas');
        canvas.width = s;
        canvas.height = s;
        const ctx = canvas.getContext('2d');
        const sw = Math.max(2, s * 0.10);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = sw;
        if (type === 'check') {
            ctx.beginPath();
            ctx.moveTo(s * 0.12, s * 0.52);
            ctx.lineTo(s * 0.42, s * 0.82);
            ctx.lineTo(s * 0.88, s * 0.18);
            ctx.stroke();
        }
        else if (type === 'cross') {
            ctx.beginPath();
            ctx.moveTo(s * 0.15, s * 0.15);
            ctx.lineTo(s * 0.85, s * 0.85);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(s * 0.85, s * 0.15);
            ctx.lineTo(s * 0.15, s * 0.85);
            ctx.stroke();
        }
        else {
            ctx.beginPath();
            ctx.arc(s / 2, s / 2, s * 0.38, 0, Math.PI * 2);
            ctx.fill();
        }
        return canvas.toDataURL('image/png');
    }
    /* ================= Date Stamp ================= */
    addDateStamp() {
        this.toolMode = 'date';
        this.updateCursor();
        this.presentToast('คลิกบนเอกสารเพื่อวางวันที่');
    }
    startDateDrag(ev, dateId) {
        if (ev.button === 2 || ev.ctrlKey)
            return;
        ev.stopPropagation();
        const target = ev.target;
        if (target.closest('button'))
            return;
        ev.preventDefault();
        const ds = this.dateStamps.find(d => d.id === dateId);
        if (!ds)
            return;
        const canvasRect = this.getDragCanvasRect(ds.page);
        const startXpx = (ds.x / 100) * canvasRect.width;
        const startYpx = (ds.y / 100) * canvasRect.height;
        const offsetX = ev.clientX - canvasRect.left - startXpx;
        const offsetY = ev.clientY - canvasRect.top - startYpx;
        const move = (e) => {
            e.preventDefault();
            const d = this.dateStamps.find(x => x.id === dateId);
            if (!d)
                return;
            const mouseXpx = e.clientX - canvasRect.left - offsetX;
            const mouseYpx = e.clientY - canvasRect.top - offsetY;
            d.x = (mouseXpx / canvasRect.width) * 100;
            d.y = (mouseYpx / canvasRect.height) * 100;
            this.cdr.detectChanges();
        };
        const up = () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    }
    removeDateStamp(dateId) {
        this.dateStamps = this.dateStamps.filter(d => d.id !== dateId);
        this.cdr.detectChanges();
    }
    /* ================= Text Style ================= */
    toggleBold() {
        if (this.activeTextBox) {
            this.activeTextBox.bold = !this.activeTextBox.bold;
            this.cdr.detectChanges();
        }
    }
    toggleItalic() {
        if (this.activeTextBox) {
            this.activeTextBox.italic = !this.activeTextBox.italic;
            this.cdr.detectChanges();
        }
    }
    setAlign(a) {
        if (this.activeTextBox) {
            this.activeTextBox.align = a;
            this.cdr.detectChanges();
        }
    }
    setTextColor(color) {
        this.textColor = color;
        if (this.activeTextBox) {
            this.activeTextBox.color = color;
            this.cdr.detectChanges();
        }
        this.saveSettings();
    }
    /* ================= Serialize JSON ================= */
    exportDrawingJson() {
        return JSON.stringify({
            version: 3,
            strokes: this.strokes,
            shapes: this.shapes,
            textBoxes: this.textBoxes,
            imageStamps: this.imageStamps,
            signatureStamps: this.signatureStamps,
            dateStamps: this.dateStamps
        });
    }
    /* ================= Save PDF (ALL PAGES) ================= */
    renderOverlayToPngBytes(pageNo, pdfW, pdfH) {
        const strokes = this.strokes[pageNo] || [];
        const shapes = this.shapes[pageNo] || [];
        const off = document.createElement('canvas');
        off.width = Math.floor(pdfW);
        off.height = Math.floor(pdfH);
        const ctx = off.getContext('2d');
        ctx.clearRect(0, 0, off.width, off.height);
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        const canvas = this.getAnnotCanvas(pageNo);
        const viewWidth = canvas ? canvas.clientWidth : 800;
        const thicknessScale = (pdfW / Math.max(1, viewWidth)) * 1.5;
        // Draw strokes
        for (const s of strokes) {
            if (!s.points.length)
                continue;
            if (s.isHighlight) {
                ctx.save();
                ctx.globalAlpha = 0.4;
                ctx.globalCompositeOperation = 'multiply';
            }
            ctx.strokeStyle = s.color;
            ctx.beginPath();
            for (let i = 0; i < s.points.length; i++) {
                const pt = s.points[i];
                const x = pt.x * off.width;
                const y = pt.y * off.height;
                ctx.lineWidth = this.calcLineWidth(s.size, pt.p) * thicknessScale;
                if (i === 0)
                    ctx.moveTo(x, y);
                else
                    ctx.lineTo(x, y);
            }
            ctx.stroke();
            if (s.isHighlight)
                ctx.restore();
        }
        // Draw shapes
        for (const sh of shapes) {
            const x1 = sh.startX * off.width;
            const y1 = sh.startY * off.height;
            const x2 = sh.endX * off.width;
            const y2 = sh.endY * off.height;
            ctx.strokeStyle = sh.color;
            ctx.lineWidth = sh.size * thicknessScale;
            ctx.beginPath();
            switch (sh.type) {
                case 'rect':
                    ctx.rect(x1, y1, x2 - x1, y2 - y1);
                    if (sh.fillColor) {
                        ctx.fillStyle = sh.fillColor;
                        ctx.fill();
                    }
                    break;
                case 'circle': {
                    const cx = (x1 + x2) / 2;
                    const cy = (y1 + y2) / 2;
                    const rx = Math.abs(x2 - x1) / 2;
                    const ry = Math.abs(y2 - y1) / 2;
                    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                    if (sh.fillColor) {
                        ctx.fillStyle = sh.fillColor;
                        ctx.fill();
                    }
                    break;
                }
                case 'line':
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    break;
                case 'arrow': {
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                    const angle2 = Math.atan2(y2 - y1, x2 - x1);
                    const headLen = 15 * thicknessScale;
                    ctx.beginPath();
                    ctx.moveTo(x2, y2);
                    ctx.lineTo(x2 - headLen * Math.cos(angle2 - Math.PI / 6), y2 - headLen * Math.sin(angle2 - Math.PI / 6));
                    ctx.moveTo(x2, y2);
                    ctx.lineTo(x2 - headLen * Math.cos(angle2 + Math.PI / 6), y2 - headLen * Math.sin(angle2 + Math.PI / 6));
                    break;
                }
            }
            ctx.stroke();
        }
        const b64 = off.toDataURL('image/png').split(',')[1];
        return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    }
    // Helper to map visual percentage coordinates to physical PDF coordinates
    getPdfPlacement(vxPercent, vyPercent, vwPercent, vhPercent, pageWidth, pageHeight, pageRotation) {
        const isRot = pageRotation === 90 || pageRotation === 270 || pageRotation === -90 || pageRotation === -270;
        // vW and vH are the dimensions of the visual canvas presented to the user
        // pdf-lib's getSize() gives unrotated dimensions. If it's rotated, the visual width is the page's Height, etc.
        const vW = isRot ? pageHeight : pageWidth;
        const vH = isRot ? pageWidth : pageHeight;
        const vx = (vxPercent / 100) * vW;
        const vy = (vyPercent / 100) * vH;
        const vw = (vwPercent / 100) * vW;
        const vh = (vhPercent / 100) * vH;
        let rotDeg = 0;
        let px = vx;
        let py = pageHeight - vy - vh;
        // The mapping handles drawing onto pdf-lib which uses bottom-left origin.
        if (pageRotation === 90 || pageRotation === -270) {
            // PDF page is rotated 90 CW visually. We draw elements 90 CCW to compensate for viewers rotating it later.
            rotDeg = 90;
            px = vy + vh;
            py = vx;
        }
        else if (pageRotation === 270 || pageRotation === -90) {
            // PDF page is rotated 90 CCW visually (270 CW). We draw elements 90 CW (-90).
            rotDeg = -90;
            px = pageWidth - (vy + vh);
            py = pageHeight - vx;
        }
        else if (pageRotation === 180 || pageRotation === -180) {
            // PDF page is upside down. We draw elements upside down (180).
            rotDeg = 180;
            px = pageWidth - vx;
            py = pageHeight - vy;
        }
        return { x: px, y: py, width: vw, height: vh, rotate: degrees(rotDeg), vW, vH };
    }
    saveDocument() {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.basePdfBytes)
                return;
            this.isLoading = true;
            this.saveProgress = 1;
            this.loadingMessage = 'กำลังเตรียมเอกสาร...';
            this.cdr.detectChanges();
            try {
                const pdfDoc = yield PDFDocument.load(this.basePdfBytes);
                const fontkit = fontkitModule.default || fontkitModule;
                pdfDoc.registerFontkit(fontkit);
                const fontBytes = yield fetch('/assets/fonts/Kanit-Regular.ttf').then(r => r.arrayBuffer());
                const thaiFont = yield pdfDoc.embedFont(fontBytes);
                const boldFontBytes = yield fetch('/assets/fonts/Kanit-Regular.ttf').then(r => r.arrayBuffer());
                const thaiFontBold = yield pdfDoc.embedFont(boldFontBytes);
                const pdfPages = pdfDoc.getPages();
                // Pre-build a set of pages that actually have annotations to skip empty pages
                const annotatedPageNums = new Set();
                Object.keys(this.strokes).forEach(p => { var _a; if ((((_a = this.strokes[+p]) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0)
                    annotatedPageNums.add(+p); });
                Object.keys(this.shapes).forEach(p => { var _a; if ((((_a = this.shapes[+p]) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0)
                    annotatedPageNums.add(+p); });
                this.shapeStamps.forEach(ss => annotatedPageNums.add(ss.page));
                this.textBoxes.forEach(t => annotatedPageNums.add(t.page));
                this.imageStamps.forEach(img => annotatedPageNums.add(img.page));
                this.signatureStamps.forEach(s => annotatedPageNums.add(s.page));
                this.dateStamps.forEach(d => annotatedPageNums.add(d.page));
                const batchSize = pdfPages.length > 100 ? 20 : 5;
                for (let i = 0; i < pdfPages.length; i++) {
                    const pageNum = i + 1;
                    const page = pdfPages[i];
                    // Batch UI updates for large documents instead of every page
                    if (i % batchSize === 0 || i === pdfPages.length - 1) {
                        this.saveProgress = Math.round(((i + 1) / pdfPages.length) * 60);
                        this.loadingMessage = `กำลังประมวลผลหน้า ${i + 1} / ${pdfPages.length}`;
                        this.cdr.detectChanges();
                        yield new Promise(resolve => setTimeout(resolve, 0));
                    }
                    // Skip pages with no annotations entirely
                    if (!annotatedPageNums.has(pageNum))
                        continue;
                    const { width, height } = page.getSize();
                    const canvas = this.getAnnotCanvas(pageNum);
                    const cw = canvas ? canvas.clientWidth : 800;
                    const rotationAngle = (_a = this.pdfPageRotations.get(pageNum)) !== null && _a !== void 0 ? _a : page.getRotation().angle;
                    const isRot = rotationAngle === 90 || rotationAngle === 270 || rotationAngle === -90 || rotationAngle === -270;
                    const vW = isRot ? height : width;
                    const vH = isRot ? width : height;
                    // 1) Drawings (rasterized PNG overlay)
                    const hasStrokes = (((_b = this.strokes[pageNum]) === null || _b === void 0 ? void 0 : _b.length) || 0) > 0;
                    const hasShapes = (((_c = this.shapes[pageNum]) === null || _c === void 0 ? void 0 : _c.length) || 0) > 0;
                    if (hasStrokes || hasShapes) {
                        const overlayPng = this.renderOverlayToPngBytes(pageNum, vW, vH);
                        const overlayImg = yield pdfDoc.embedPng(overlayPng);
                        const placement = this.getPdfPlacement(0, 0, 100, 100, width, height, rotationAngle);
                        page.drawImage(overlayImg, { x: placement.x, y: placement.y, width: placement.width, height: placement.height, rotate: placement.rotate });
                    }
                    const toRgb = (hex) => {
                        if (!hex || hex === 'none' || hex.includes('rgba'))
                            return undefined;
                        let cleanHex = hex.replace('#', '');
                        if (cleanHex.length === 3)
                            cleanHex = cleanHex.split('').map(c => c + c).join('');
                        if (cleanHex.length !== 6)
                            return undefined;
                        return rgb(parseInt(cleanHex.substring(0, 2), 16) / 255, parseInt(cleanHex.substring(2, 4), 16) / 255, parseInt(cleanHex.substring(4, 6), 16) / 255);
                    };
                    // 1.5) ShapeStamps — Draw natively as crisp PDF vectors
                    const stampsForPage = this.shapeStamps.filter(ss => ss.page === pageNum);
                    for (const ss of stampsForPage) {
                        const ssViewW = ss.viewWidth && ss.viewWidth > 0 ? ss.viewWidth : Math.max(1, cw);
                        const ssStrokeScale = vW / ssViewW;
                        const pdfStrokeW = ss.strokeWidth * ssStrokeScale;
                        const fillColor = ss.fillColor ? toRgb(ss.fillColor) : undefined;
                        const strokeColor = (ss.strokeColor && ss.strokeColor !== 'rgba(0,0,0,0)' && ss.strokeWidth > 0) ? toRgb(ss.strokeColor) : undefined;
                        const placement = this.getPdfPlacement(ss.x, ss.y, ss.width, ss.height, width, height, rotationAngle);
                        if (ss.type === 'rect') {
                            page.drawRectangle({
                                x: placement.x,
                                y: placement.y,
                                width: placement.width,
                                height: placement.height,
                                rotate: placement.rotate,
                                color: fillColor,
                                borderColor: strokeColor,
                                borderWidth: strokeColor ? pdfStrokeW : undefined
                            });
                        }
                        else if (ss.type === 'circle') {
                            const centerPt = this.getPdfPlacement(ss.x + ss.width / 2, ss.y + ss.height / 2, 0, 0, width, height, rotationAngle);
                            page.drawEllipse({
                                x: centerPt.x,
                                y: centerPt.y,
                                xScale: placement.width / 2,
                                yScale: placement.height / 2,
                                color: fillColor,
                                borderColor: strokeColor,
                                borderWidth: strokeColor ? pdfStrokeW : undefined
                            });
                        }
                        else if (ss.type === 'line' || ss.type === 'arrow') {
                            const pt1 = this.getPdfPlacement(ss.x + ss.startFracX * ss.width, ss.y + ss.startFracY * ss.height, 0, 0, width, height, rotationAngle);
                            const pt2 = this.getPdfPlacement(ss.x + ss.endFracX * ss.width, ss.y + ss.endFracY * ss.height, 0, 0, width, height, rotationAngle);
                            page.drawLine({
                                start: { x: pt1.x, y: pt1.y },
                                end: { x: pt2.x, y: pt2.y },
                                color: strokeColor || rgb(0, 0, 0),
                                thickness: strokeColor ? pdfStrokeW : 1
                            });
                            if (ss.type === 'arrow') {
                                const headLen = 15 * ssStrokeScale;
                                const angle = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x);
                                page.drawLine({
                                    start: { x: pt2.x, y: pt2.y },
                                    end: { x: pt2.x - headLen * Math.cos(angle - Math.PI / 6), y: pt2.y - headLen * Math.sin(angle - Math.PI / 6) },
                                    color: strokeColor || rgb(0, 0, 0),
                                    thickness: strokeColor ? pdfStrokeW : 1
                                });
                                page.drawLine({
                                    start: { x: pt2.x, y: pt2.y },
                                    end: { x: pt2.x - headLen * Math.cos(angle + Math.PI / 6), y: pt2.y - headLen * Math.sin(angle + Math.PI / 6) },
                                    color: strokeColor || rgb(0, 0, 0),
                                    thickness: strokeColor ? pdfStrokeW : 1
                                });
                            }
                        }
                    }
                    // 2) TextBoxes — render natively so text remains selectable in the final PDF
                    const textForPage = this.textBoxes.filter(t => t.page === pageNum);
                    for (const tb of textForPage) {
                        if (!tb.text.trim())
                            continue;
                        const fontToUse = (tb.bold || tb.italic) ? thaiFontBold : thaiFont;
                        const colorHex = tb.color || '#0000ff';
                        const txtColor = toRgb(colorHex) || rgb(0, 0, 1);
                        const lines = tb.text.split('\n');
                        const lineHeight = tb.fontSize * 1.4;
                        // Compensate for textarea CSS padding (2px top, 4px left) so PDF matches screen
                        const canvas = this.getAnnotCanvas(pageNum);
                        const canvasCW = canvas ? canvas.clientWidth : 800;
                        const canvasCH = canvas ? canvas.clientHeight : 1000;
                        const padLeftPct = (4 / canvasCW) * 100; // 4px left padding → %
                        const padTopPct = (2 / canvasCH) * 100; // 2px top padding  → %
                        const maxW = (tb.width / 100) * vW;
                        // shift X by padLeft, shift Y down by padTop
                        const textStartXPct = tb.x + padLeftPct;
                        let currentVisualY = ((tb.y + padTopPct) / 100) * vH;
                        for (const para of lines) {
                            if (!para) {
                                currentVisualY += lineHeight;
                                continue;
                            }
                            let paraWords = [];
                            if (typeof Intl !== 'undefined' && Intl.Segmenter) {
                                const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
                                paraWords = Array.from(segmenter.segment(para)).map((s) => s.segment);
                            }
                            else {
                                const parts = para.split(' ');
                                for (let i = 0; i < parts.length; i++) {
                                    paraWords.push(parts[i]);
                                    if (i < parts.length - 1)
                                        paraWords.push(' ');
                                }
                            }
                            let line = '';
                            for (const word of paraWords) {
                                const testLine = line + word;
                                const textWidth = fontToUse.widthOfTextAtSize(testLine, tb.fontSize);
                                if (textWidth > maxW && line) {
                                    let alignXVisual = (textStartXPct / 100) * vW;
                                    const finalLineWidth = fontToUse.widthOfTextAtSize(line, tb.fontSize);
                                    if (tb.align === 'center')
                                        alignXVisual += (maxW / 2) - (finalLineWidth / 2);
                                    if (tb.align === 'right')
                                        alignXVisual += maxW - finalLineWidth;
                                    const baselineVisualY = currentVisualY + (tb.fontSize * 0.95);
                                    const pt = this.getPdfPlacement((alignXVisual / vW) * 100, (baselineVisualY / vH) * 100, 0, 0, width, height, rotationAngle);
                                    page.drawText(line, {
                                        x: pt.x,
                                        y: pt.y,
                                        size: tb.fontSize,
                                        font: fontToUse,
                                        color: txtColor,
                                        rotate: pt.rotate
                                    });
                                    line = word.replace(/^\s+/, '');
                                    currentVisualY += lineHeight;
                                }
                                else {
                                    line = testLine;
                                }
                            }
                            if (line) {
                                let alignXVisual = (textStartXPct / 100) * vW;
                                const finalLineWidth = fontToUse.widthOfTextAtSize(line, tb.fontSize);
                                if (tb.align === 'center')
                                    alignXVisual += (maxW / 2) - (finalLineWidth / 2);
                                if (tb.align === 'right')
                                    alignXVisual += maxW - finalLineWidth;
                                const baselineVisualY = currentVisualY + (tb.fontSize * 0.95);
                                const pt = this.getPdfPlacement((alignXVisual / vW) * 100, (baselineVisualY / vH) * 100, 0, 0, width, height, rotationAngle);
                                page.drawText(line, {
                                    x: pt.x,
                                    y: pt.y,
                                    size: tb.fontSize,
                                    font: fontToUse,
                                    color: txtColor,
                                    rotate: pt.rotate
                                });
                                currentVisualY += lineHeight;
                            }
                        }
                    }
                    // 3) Image Stamps
                    const imgForPage = this.imageStamps.filter(img => img.page === pageNum);
                    for (const img of imgForPage) {
                        try {
                            // Ensure PNG (normalizeImageToPng guarantees this for newly added stamps;
                            // fall back to canvas conversion for any legacy stamps saved as JPEG)
                            const pngUrl = img.dataUrl.startsWith('data:image/png')
                                ? img.dataUrl
                                : yield this.normalizeImageToPng(img.dataUrl);
                            const bytes = Uint8Array.from(atob(pngUrl.split(',')[1]), c => c.charCodeAt(0));
                            const embedded = yield pdfDoc.embedPng(bytes);
                            const placement = this.getPdfPlacement(img.x, img.y, img.width, img.height, width, height, rotationAngle);
                            page.drawImage(embedded, { x: placement.x, y: placement.y, width: placement.width, height: placement.height, rotate: placement.rotate });
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                    // 4) Signatures
                    const sigForPage = this.signatureStamps.filter(s => s.page === pageNum);
                    for (const sig of sigForPage) {
                        try {
                            const bytes = Uint8Array.from(atob(sig.dataUrl.split(',')[1]), c => c.charCodeAt(0));
                            const embedded = yield pdfDoc.embedPng(bytes);
                            const placement = this.getPdfPlacement(sig.x, sig.y, sig.width, sig.height, width, height, rotationAngle);
                            page.drawImage(embedded, { x: placement.x, y: placement.y, width: placement.width, height: placement.height, rotate: placement.rotate });
                            // Draw Digital ID text to the right of signature (vertically centered)
                            if (this.showDigitalId && (sig.digitalId || sig.signDate)) {
                                const idFontSize = 8;
                                const idLines = [];
                                if (sig.signDate)
                                    idLines.push(sig.signDate);
                                if (sig.signTime)
                                    idLines.push(sig.signTime);
                                if (sig.digitalId)
                                    idLines.push(sig.digitalId);
                                const lineHeight = idFontSize + 2;
                                const totalTextHeight = idLines.length * lineHeight;
                                const textVisualXPct = sig.x + sig.width + (4 / vW * 100);
                                const textStartYPct = sig.y + (sig.height / 2) - ((totalTextHeight / 2) / vH * 100);
                                for (let li = 0; li < idLines.length; li++) {
                                    const lineBaselineVPct = textStartYPct + ((li * lineHeight + idFontSize) / vH * 100);
                                    const pt = this.getPdfPlacement(textVisualXPct, lineBaselineVPct, 0, 0, width, height, rotationAngle);
                                    page.drawText(idLines[li], {
                                        x: pt.x,
                                        y: pt.y,
                                        size: idFontSize,
                                        font: thaiFont,
                                        color: rgb(0.2, 0.2, 0.2),
                                        opacity: 1.0,
                                        rotate: pt.rotate
                                    });
                                }
                            }
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                    // 5) Date Stamps
                    const dateForPage = this.dateStamps.filter(d => d.page === pageNum);
                    for (const ds of dateForPage) {
                        const hex = ds.color.replace('#', '');
                        const r = parseInt(hex.substring(0, 2), 16) / 255;
                        const g = parseInt(hex.substring(2, 4), 16) / 255;
                        const b = parseInt(hex.substring(4, 6), 16) / 255;
                        const baselineVPct = ds.y + (ds.fontSize / vH * 100);
                        const pt = this.getPdfPlacement(ds.x, baselineVPct, 0, 0, width, height, rotationAngle);
                        page.drawText(ds.text, {
                            x: pt.x, y: pt.y, size: ds.fontSize, font: thaiFont,
                            color: rgb(r, g, b), opacity: 1.0, rotate: pt.rotate
                        });
                    }
                }
                // Bake PDF AcroForm fields (interactive text/checkbox/radio)
                if (this.pdfFormFields.length > 0) {
                    const form = pdfDoc.getForm();
                    for (const ff of this.pdfFormFields) {
                        const pgIdx = ff.page - 1;
                        if (pgIdx < 0 || pgIdx >= pdfPages.length)
                            continue;
                        const pdfPage = pdfPages[pgIdx];
                        const { width: pgW, height: pgH } = pdfPage.getSize();
                        const rotAngle = (_d = this.pdfPageRotations.get(ff.page)) !== null && _d !== void 0 ? _d : pdfPage.getRotation().angle;
                        const isRotated = rotAngle === 90 || rotAngle === 270 || rotAngle === -90 || rotAngle === -270;
                        const vW = isRotated ? pgH : pgW;
                        const vH = isRotated ? pgW : pgH;
                        const fx = (ff.x / 100) * vW;
                        const fw = (ff.width / 100) * vW;
                        const fh = (ff.height / 100) * vH;
                        const fy = pgH - (ff.y / 100) * vH - fh;
                        const borderW = ((_e = ff.borderVisible) !== null && _e !== void 0 ? _e : true) ? 1 : 0;
                        const opts = {
                            x: fx, y: fy, width: fw, height: fh,
                            borderWidth: borderW,
                            borderColor: borderW ? rgb(0, 0, 0) : undefined,
                            backgroundColor: rgb(1, 1, 1),
                        };
                        try {
                            if (ff.type === 'text') {
                                const tf = form.createTextField(ff.fieldName);
                                tf.addToPage(pdfPage, opts);
                                if (ff.fontSize)
                                    tf.setFontSize(ff.fontSize);
                            }
                            else if (ff.type === 'checkbox') {
                                const cb = form.createCheckBox(ff.fieldName);
                                cb.addToPage(pdfPage, opts);
                            }
                            else if (ff.type === 'radio') {
                                let rg;
                                try {
                                    rg = form.getRadioGroup(ff.radioGroupName);
                                }
                                catch (_f) {
                                    rg = form.createRadioGroup(ff.radioGroupName);
                                }
                                rg.addOptionToPage(ff.id, pdfPage, opts);
                            }
                        }
                        catch (formErr) {
                            console.warn('Form field error:', formErr);
                        }
                    }
                }
                this.saveProgress = 61;
                this.loadingMessage = 'กำลัง Serialize PDF...';
                this.cdr.detectChanges();
                yield new Promise(resolve => setTimeout(resolve, 80));
                this.revNo += 1;
                const pdfBytes = yield pdfDoc.save({ objectsPerTick: 20 });
                this.lastSavedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
                // Use original filename if provided, otherwise default to "annotated_rev..."
                if (this.fileName) {
                    this.lastSavedFileName = this.fileName;
                }
                else {
                    this.lastSavedFileName = `annotated_rev${this.revNo}_${Date.now()}.pdf`;
                }
                // Create preview using pdf.js to render pages as images
                yield this.generatePreviewPages();
                this.showPreviewOverlay = true;
            }
            catch (e) {
                console.error(e);
                this.presentToast('เกิดข้อผิดพลาดในการบันทึกเอกสาร');
            }
            finally {
                this.isLoading = false;
                this.loadingMessage = '';
                this.saveProgress = 0;
            }
        });
    }
    generatePreviewPages() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.lastSavedBlob)
                return;
            this.previewPages = [];
            const arrayBuffer = yield this.lastSavedBlob.arrayBuffer();
            const pdfDoc = yield pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const total = pdfDoc.numPages;
            this.previewTotalPages = total;
            // For large documents render only annotated pages, not all pages
            let pagesToRender;
            if (total > 50) {
                const annotated = new Set();
                Object.keys(this.strokes).forEach(p => { var _a; if ((((_a = this.strokes[+p]) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0)
                    annotated.add(+p); });
                Object.keys(this.shapes).forEach(p => { var _a; if ((((_a = this.shapes[+p]) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0)
                    annotated.add(+p); });
                this.shapeStamps.forEach(ss => annotated.add(ss.page));
                this.textBoxes.forEach(t => annotated.add(t.page));
                this.imageStamps.forEach(img => annotated.add(img.page));
                this.signatureStamps.forEach(s => annotated.add(s.page));
                this.dateStamps.forEach(d => annotated.add(d.page));
                pagesToRender = annotated.size > 0 ? Array.from(annotated).sort((a, b) => a - b) : [1];
                this.previewIsFiltered = pagesToRender.length < total;
            }
            else {
                pagesToRender = Array.from({ length: total }, (_, i) => i + 1);
                this.previewIsFiltered = false;
            }
            for (let idx = 0; idx < pagesToRender.length; idx++) {
                const pageNum = pagesToRender[idx];
                const page = yield pdfDoc.getPage(pageNum);
                const scale = 1.5;
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                yield page.render({ canvasContext: ctx, viewport }).promise;
                this.previewPages.push(canvas.toDataURL('image/png'));
                // Progress phase 2: generating preview (62–100%)
                this.saveProgress = 62 + Math.round(((idx + 1) / pagesToRender.length) * 38);
                this.loadingMessage = `กำลังสร้าง Preview หน้า ${pageNum} / ${total}`;
                this.cdr.detectChanges();
            }
        });
    }
    loadAllPreviewPages() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.lastSavedBlob || this.isLoadingAllPreview)
                return;
            this.isLoadingAllPreview = true;
            this.previewPages = [];
            this.cdr.detectChanges();
            const arrayBuffer = yield this.lastSavedBlob.arrayBuffer();
            const pdfDoc = yield pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const total = pdfDoc.numPages;
            for (let i = 1; i <= total; i++) {
                const page = yield pdfDoc.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                yield page.render({ canvasContext: ctx, viewport }).promise;
                this.previewPages.push(canvas.toDataURL('image/png'));
                this.cdr.detectChanges();
            }
            this.previewIsFiltered = false;
            this.isLoadingAllPreview = false;
            this.cdr.detectChanges();
        });
    }
    confirmSave() {
        if (!this.lastSavedBlob)
            return;
        // Log all signature stamps with Digital ID when confirmed and showDigitalId is enabled
        if (this.showDigitalId) {
            for (const sig of this.signatureStamps) {
                if (sig.digitalId) {
                    const now = new Date();
                    this.logSignatureToDatabase(sig.digitalId, now, sig.page);
                }
            }
        }
        // Log save to history
        this.logHistory('save', {
            signatures: this.signatureStamps.length,
            textBoxes: this.textBoxes.length,
            drawings: Object.values(this.strokes).reduce((s, arr) => s + arr.length, 0),
        }, 0);
        this.unlockOrientation();
        this.modalCtrl.dismiss({
            success: true,
            saved: true,
            blob: this.lastSavedBlob,
            fileName: this.lastSavedFileName,
            revNo: this.revNo
        });
    }
    backToEdit() {
        this.showPreviewOverlay = false;
        this.previewUrl = null;
        this.previewPages = [];
    }
}
PdfAnnotatorModalComponent.ɵfac = function PdfAnnotatorModalComponent_Factory(t) { return new (t || PdfAnnotatorModalComponent)(ɵngcc0.ɵɵdirectiveInject(ɵngcc2.ModalController), ɵngcc0.ɵɵdirectiveInject(ɵngcc1.HttpClient), ɵngcc0.ɵɵdirectiveInject(ɵngcc0.NgZone), ɵngcc0.ɵɵdirectiveInject(ɵngcc2.ToastController), ɵngcc0.ɵɵdirectiveInject(ɵngcc2.AlertController), ɵngcc0.ɵɵdirectiveInject(ɵngcc0.ChangeDetectorRef), ɵngcc0.ɵɵdirectiveInject(ɵngcc3.DomSanitizer), ɵngcc0.ɵɵdirectiveInject(PdfManagerService), ɵngcc0.ɵɵdirectiveInject(PDF_ANNOTATOR_CONFIG, 8)); };
PdfAnnotatorModalComponent.ɵcmp = /*@__PURE__*/ ɵngcc0.ɵɵdefineComponent({ type: PdfAnnotatorModalComponent, selectors: [["app-pdf-annotator-modal"]], viewQuery: function PdfAnnotatorModalComponent_Query(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵviewQuery(_c0, 5);
        ɵngcc0.ɵɵviewQuery(_c1, 5);
        ɵngcc0.ɵɵviewQuery(_c2, 5);
        ɵngcc0.ɵɵviewQuery(_c3, 5);
        ɵngcc0.ɵɵviewQuery(_c4, 5);
        ɵngcc0.ɵɵviewQuery(_c5, 5);
        ɵngcc0.ɵɵviewQuery(_c6, 5);
    } if (rf & 2) {
        let _t;
        ɵngcc0.ɵɵqueryRefresh(_t = ɵngcc0.ɵɵloadQuery()) && (ctx.fileInputRef = _t.first);
        ɵngcc0.ɵɵqueryRefresh(_t = ɵngcc0.ɵɵloadQuery()) && (ctx.viewerContainerRef = _t.first);
        ɵngcc0.ɵɵqueryRefresh(_t = ɵngcc0.ɵɵloadQuery()) && (ctx.signatureCanvasRef = _t.first);
        ɵngcc0.ɵɵqueryRefresh(_t = ɵngcc0.ɵɵloadQuery()) && (ctx.signatureFileInputRef = _t.first);
        ɵngcc0.ɵɵqueryRefresh(_t = ɵngcc0.ɵɵloadQuery()) && (ctx.thumbFileInputRef = _t.first);
        ɵngcc0.ɵɵqueryRefresh(_t = ɵngcc0.ɵɵloadQuery()) && (ctx.pdfCanvases = _t);
        ɵngcc0.ɵɵqueryRefresh(_t = ɵngcc0.ɵɵloadQuery()) && (ctx.annotCanvases = _t);
    } }, hostBindings: function PdfAnnotatorModalComponent_HostBindings(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵlistener("pointerdown", function PdfAnnotatorModalComponent_pointerdown_HostBindingHandler($event) { return ctx.onDocumentPointerDown($event); }, false, ɵngcc0.ɵɵresolveDocument)("keydown", function PdfAnnotatorModalComponent_keydown_HostBindingHandler($event) { return ctx.handleKeyboard($event); }, false, ɵngcc0.ɵɵresolveWindow);
    } }, inputs: { canManageGuide: "canManageGuide", userId: "userId", userName: "userName", documentId: "documentId", detailId: "detailId", edocId: "edocId", isCancelMode: "isCancelMode", pdfUrl: "pdfUrl", fileName: "fileName" }, decls: 159, vars: 65, consts: [["slot", "end"], ["fill", "clear", 3, "click"], ["name", "close"], [1, "annotator-content", 3, "scrollY"], ["class", "loading-overlay", 4, "ngIf"], [1, "annotator-layout-v2"], [1, "toolbar-row", "toolbar-row--nav"], [1, "toolbar-group"], ["title", "แสดง/ซ่อน Thumbnails", 1, "toolbar-btn", 3, "click"], ["name", "images-outline"], [1, "toolbar-divider"], [1, "toolbar-group", "toolbar-group--zoom"], [1, "toolbar-btn", 3, "disabled", "click"], ["name", "search-outline"], ["name", "remove-outline", 1, "zoom-icon"], [1, "toolbar-label"], ["name", "add-outline", 1, "zoom-icon"], [1, "toolbar-group", "toolbar-group--pager"], ["title", "หน้าแรก", 1, "toolbar-btn", 3, "disabled", "click"], ["name", "play-skip-back"], ["title", "หน้าก่อน", 1, "toolbar-btn", 3, "disabled", "click"], ["name", "chevron-back"], ["class", "chunk-indicator", 3, "title", 4, "ngIf"], ["title", "หน้าถัดไป", 1, "toolbar-btn", 3, "disabled", "click"], ["name", "chevron-forward"], [1, "toolbar-btn", 3, "disabled", "title", "click"], ["name", "play-skip-forward"], [1, "toolbar-spacer"], [1, "tool-item", "insert-page-tool"], ["title", "แทรก/ลบหน้า", 1, "toolbar-btn", 3, "click"], ["name", "documents-outline"], ["name", "chevron-down-outline", 1, "shape-chevron"], ["class", "insert-page-dropdown", 4, "ngIf"], [1, "toolbar-group", "toolbar-group--save"], [1, "toolbar-btn", "toolbar-btn--save", 3, "click"], ["name", "save-outline"], ["title", "คู่มือการใช้งาน", 1, "toolbar-btn", "toolbar-btn--guide", 3, "click"], ["name", "book"], [2, "font-weight", "500", "font-size", "13px"], ["title", "ประวัติการแก้ไข", 1, "toolbar-btn", 3, "click"], ["name", "time-outline"], [1, "toolbar-row", "toolbar-row--tools"], [1, "tool-item"], ["title", "ข้อความ", 1, "toolbar-btn", 3, "click"], ["name", "text"], ["class", "tool-options", 4, "ngIf"], [1, "tool-item", "mark-tool-item"], ["title", "แบบฟอร์ม", 1, "toolbar-btn", "mark-toolbar-btn", 3, "click"], ["width", "22", "height", "22", "viewBox", "0 0 22 22", "fill", "none"], ["x", "1", "y", "2", "width", "7", "height", "6", "rx", "1.2", "stroke", "currentColor", "stroke-width", "1.6"], ["points", "2.5,5 4.2,7 7.5,3", "stroke", "currentColor", "stroke-width", "1.5", "stroke-linecap", "round", "stroke-linejoin", "round"], ["x1", "10", "y1", "5", "x2", "21", "y2", "5", "stroke", "currentColor", "stroke-width", "1.5", "stroke-linecap", "round"], ["cx", "4.5", "cy", "14", "r", "3.2", "stroke", "currentColor", "stroke-width", "1.6"], ["cx", "4.5", "cy", "14", "r", "1.5", "fill", "currentColor"], ["x1", "10", "y1", "14", "x2", "21", "y2", "14", "stroke", "currentColor", "stroke-width", "1.5", "stroke-linecap", "round"], ["x1", "10", "y1", "20", "x2", "21", "y2", "20", "stroke", "currentColor", "stroke-width", "1.5", "stroke-linecap", "round"], ["x1", "1", "y1", "20", "x2", "7.5", "y2", "20", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round"], ["x1", "1", "y1", "17.5", "x2", "5", "y2", "17.5", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round"], [1, "mark-btn-label"], ["name", "chevron-down-outline", 1, "mark-chevron"], ["class", "mark-popup", 4, "ngIf"], [1, "tool-item", "shape-tool-item"], ["title", "รูปทรง", 1, "toolbar-btn", 3, "click"], [3, "name"], ["class", "shape-dropdown", 4, "ngIf"], ["class", "shape-options-panel", 4, "ngIf"], ["title", "วาด", 1, "toolbar-btn", 3, "click"], ["name", "brush"], ["title", "ไฮไลท์", 1, "toolbar-btn", 3, "click"], ["width", "24", "height", "24", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M18 2l4 4L9 19H5v-4L18 2z"], ["d", "M14 6l4 4"], ["x1", "3", "y1", "22", "x2", "21", "y2", "22", "stroke-width", "3"], ["title", "ยางลบ (ลบเส้นและรูปทรง)", 1, "toolbar-btn", 3, "click"], ["d", "M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4C13.5 3.5 14.5 3.5 15 4L20 9C20.5 9.5 20.5 10.5 20 11L11 20H20V20Z"], ["d", "M17.5 15L9 6.5"], ["title", "ลายเซ็น", 1, "toolbar-btn", 3, "click"], ["name", "finger-print"], ["title", "แสดง/ซ่อน Digital ID", 1, "toolbar-btn", "toolbar-btn--toggle", 3, "click"], [1, "toggle-label"], ["title", "วันที่", 1, "toolbar-btn", 3, "click"], ["name", "calendar"], ["title", "รูปภาพ", 1, "toolbar-btn", 3, "click"], ["name", "image"], ["type", "file", "accept", "image/*", 2, "display", "none", 3, "change"], ["fileInput", ""], ["title", "เลิกทำ", 1, "toolbar-btn", 3, "disabled", "click"], ["name", "arrow-undo"], ["title", "ทำซ้ำ", 1, "toolbar-btn", 3, "disabled", "click"], ["name", "arrow-redo"], ["title", "ล้างทั้งหมด", 1, "toolbar-btn", "toolbar-btn--danger", 3, "click"], ["name", "trash"], [1, "main-area"], ["class", "thumbnails-sidebar", 4, "ngIf"], ["class", "thumb-insert-overlay", 3, "top", 4, "ngIf"], [1, "viewer-wrapper"], [1, "viewer-container", 3, "scroll"], ["viewerContainer", ""], ["class", "page-container", 3, "id", 4, "ngFor", "ngForOf"], [1, "hint"], [1, "user-guide-drawer"], [1, "user-guide-drawer__backdrop", 3, "click"], [1, "user-guide-drawer__panel"], [1, "user-guide-drawer__header"], ["name", "book-outline"], [3, "click"], ["name", "close-outline"], ["class", "user-guide-content-area", 4, "ngIf"], [1, "annot-history-drawer"], [1, "annot-history-drawer__backdrop", 3, "click"], [1, "annot-history-drawer__panel"], [1, "annot-history-drawer__header"], ["class", "annot-history-loading", 4, "ngIf"], ["class", "annot-history-list", 4, "ngIf"], ["signatureFileInput", ""], ["class", "signature-modal", 4, "ngIf"], ["class", "signature-picker-modal", 4, "ngIf"], ["class", "preview-overlay", 4, "ngIf"], ["class", "custom-context-menu", 3, "left", "top", 4, "ngIf"], [1, "loading-overlay"], [1, "loading-content"], [4, "ngIf"], ["name", "crescent"], [1, "loading-msg"], [1, "save-progress-icon"], ["name", "document-text-outline"], [1, "save-progress-pct"], [1, "save-progress-bar-track"], [1, "save-progress-bar-fill"], [1, "save-progress-phases"], ["name", "layers-outline"], ["name", "archive-outline"], ["name", "image-outline"], [1, "chunk-indicator", 3, "title"], ["name", "crescent", "style", "width:10px;height:10px;", 4, "ngIf"], ["name", "crescent", 2, "width", "10px", "height", "10px"], [1, "insert-page-dropdown"], [1, "insert-page-backdrop", 3, "click"], [1, "insert-page-menu"], [1, "insert-page-title"], ["name", "add-circle-outline"], [1, "insert-orient-row"], [1, "insert-orient-label"], [1, "insert-orient-group"], ["title", "แนวตั้ง", 1, "insert-orient-btn", 3, "click"], ["name", "phone-portrait-outline"], ["title", "แนวนอน", 1, "insert-orient-btn", 3, "click"], ["name", "phone-landscape-outline"], [1, "insert-page-btn", 3, "click"], ["name", "arrow-up-outline"], ["name", "arrow-down-outline"], [1, "insert-menu-divider"], [1, "insert-page-title", "insert-page-title--danger"], ["name", "trash-outline"], [1, "insert-page-btn", "insert-page-btn--danger", 3, "disabled", "click"], ["name", "close-circle-outline"], [1, "insert-page-btn", "insert-page-btn--undo", 3, "disabled", "click"], ["name", "arrow-undo-outline"], [1, "tool-options"], [3, "disabled", "click"], ["name", "remove"], ["name", "add"], [1, "color-dots"], [1, "color-dot", 2, "background", "#000", 3, "click"], [1, "color-dot", 2, "background", "#00f", 3, "click"], [1, "color-dot", 2, "background", "#f00", 3, "click"], ["title", "กำหนดสีเอง", 1, "color-dot", "color-dot--custom"], ["name", "color-palette", 2, "position", "absolute", "top", "50%", "left", "50%", "transform", "translate(-50%, -50%)", "font-size", "12px", "color", "#fff", "text-shadow", "0 0 2px rgba(0,0,0,0.5)", "mix-blend-mode", "difference", "pointer-events", "none"], ["type", "color", 3, "value", "input"], [1, "mark-popup"], [1, "mark-popup-section-label"], [1, "mark-quick-row"], ["title", "เครื่องหมายถูก", 1, "mark-quick-btn", 3, "click"], ["width", "28", "height", "28", "viewBox", "0 0 28 28"], ["points", "4,14 11,21 24,7", "stroke", "currentColor", "stroke-width", "3", "stroke-linecap", "round", "stroke-linejoin", "round", "fill", "none"], ["title", "เครื่องหมายผิด", 1, "mark-quick-btn", 3, "click"], ["x1", "5", "y1", "5", "x2", "23", "y2", "23", "stroke", "currentColor", "stroke-width", "3", "stroke-linecap", "round"], ["x1", "23", "y1", "5", "x2", "5", "y2", "23", "stroke", "currentColor", "stroke-width", "3", "stroke-linecap", "round"], ["title", "จุด", 1, "mark-quick-btn", 3, "click"], ["cx", "14", "cy", "14", "r", "9", "fill", "currentColor"], [1, "mark-popup-divider"], [1, "mark-form-list"], ["title", "Text Field", 1, "mark-form-row-btn", 3, "click"], [1, "mark-form-row-icon", "mark-form-row-icon--text"], ["title", "Checkbox", 1, "mark-form-row-btn", 3, "click"], [1, "mark-form-row-icon"], ["width", "18", "height", "18", "viewBox", "0 0 18 18"], ["x", "1", "y", "1", "width", "16", "height", "16", "rx", "2.5", "stroke", "currentColor", "stroke-width", "2", "fill", "none"], ["points", "4,9 7,13 14,5", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round", "fill", "none"], ["title", "Radio Button", 1, "mark-form-row-btn", 3, "click"], ["cx", "9", "cy", "9", "r", "8", "stroke", "currentColor", "stroke-width", "2", "fill", "none"], ["cx", "9", "cy", "9", "r", "4", "fill", "currentColor"], [1, "mark-controls-row"], [1, "mark-size-val"], [1, "color-dots", 2, "margin-left", "6px"], [1, "color-dot", 2, "background", "#009900", 3, "click"], [1, "mark-cancel-btn", 3, "click"], [1, "shape-dropdown"], ["title", "สี่เหลี่ยม", 1, "shape-dd-btn", 3, "click"], ["name", "square-outline"], ["title", "วงกลม", 1, "shape-dd-btn", 3, "click"], ["name", "ellipse-outline"], ["title", "เส้น", 1, "shape-dd-btn", 3, "click"], ["name", "remove-outline"], ["title", "ลูกศร", 1, "shape-dd-btn", 3, "click"], ["name", "arrow-forward-outline"], [1, "shape-options-panel"], [1, "shape-opt-group"], [1, "shape-opt-label"], [1, "sopt-btn", 3, "disabled", "click"], [1, "sopt-val"], [1, "sopt-divider"], ["title", "ไม่มีเส้นขอบ", 1, "sopt-fill-toggle", 3, "click"], ["name", "ban-outline"], [1, "mac-color-grid"], ["class", "mac-swatch", 3, "background", "active", "title", "click", 4, "ngFor", "ngForOf"], [1, "mac-custom-color"], [1, "mac-swatch", "mac-swatch--current"], ["type", "color", "title", "กำหนดสีเอง", 3, "value", "disabled", "input"], ["title", "เปิด/ปิดสีพื้น", 1, "sopt-fill-toggle", 3, "click"], ["type", "color", "title", "กำหนดสีพื้นเอง", 3, "value", "disabled", "input"], [1, "mac-swatch", 3, "title", "click"], ["title", "เหลือง", 1, "color-dot", 2, "background", "#ffff00", 3, "click"], ["title", "เขียว", 1, "color-dot", 2, "background", "#00ff00", 3, "click"], ["title", "ฟ้า", 1, "color-dot", 2, "background", "#00ffff", 3, "click"], ["title", "ชมพู", 1, "color-dot", 2, "background", "#ff99c2", 3, "click"], ["title", "ส้ม", 1, "color-dot", 2, "background", "#ffb366", 3, "click"], ["title", "ม่วง", 1, "color-dot", 2, "background", "#d9b3ff", 3, "click"], ["title", "กำหนดสีเองรหัส HEX", 1, "color-dot", "color-dot--custom"], ["type", "color", "title", "กำหนดสีเอง", 3, "value", "input"], [1, "thumbnails-sidebar"], [1, "thumb-list"], [1, "thumb-insert-row"], ["title", "แทรกก่อนหน้า 1", 1, "thumb-add-btn", 3, "click"], [4, "ngFor", "ngForOf"], ["type", "file", "accept", "image/*,.pdf", 2, "display", "none", 3, "change"], ["thumbFileInput", ""], [1, "thumb-card-wrap"], [1, "thumb-card", 3, "id", "click"], [1, "thumb-card__img-wrap"], [3, "src", "alt"], [1, "thumb-card__label"], [1, "thumb-card__actions", 3, "click"], ["title", "เลื่อนขึ้น", 1, "thumb-action-btn", 3, "disabled", "click"], ["name", "chevron-up-outline"], ["title", "เลื่อนลง", 1, "thumb-action-btn", 3, "disabled", "click"], ["name", "chevron-down-outline"], ["title", "ย้อนกลับ", 1, "thumb-action-btn", 3, "disabled", "click"], ["title", "ลบหน้า", 1, "thumb-action-btn", "thumb-action-btn--danger", 3, "disabled", "click"], ["title", "แทรกหน้า", 1, "thumb-add-btn", 3, "click"], [1, "thumb-insert-overlay"], [1, "thumb-insert-backdrop", 3, "click"], [1, "thumb-insert-menu"], [1, "thumb-insert-opt", 3, "click"], ["name", "document-outline"], [1, "page-container", 3, "id"], [1, "pdf-canvas", 3, "id"], [1, "annot-canvas", 3, "id"], ["class", "text-box", 3, "active", "left", "top", "width", "height", "color", "font-size", "font-weight", "font-style", "text-align", "z-index", "pointerdown", "contextmenu", 4, "ngFor", "ngForOf"], ["class", "shape-stamp", 3, "left", "top", "width", "height", "z-index", "pointerdown", "contextmenu", 4, "ngFor", "ngForOf"], ["class", "image-stamp", 3, "left", "top", "width", "height", "z-index", "pointerdown", "contextmenu", 4, "ngFor", "ngForOf"], ["class", "pdf-form-field pff-mark", 3, "pff-active", "left", "top", "width", "height", "z-index", "pointerdown", "contextmenu", 4, "ngFor", "ngForOf"], ["class", "signature-stamp", 3, "left", "top", "width", "height", "z-index", "pointerdown", "contextmenu", 4, "ngFor", "ngForOf"], ["class", "pdf-form-field", 3, "pff-text", "pff-checkbox", "pff-radio", "pff-no-border", "pff-active", "left", "top", "width", "height", "z-index", "pointerdown", 4, "ngFor", "ngForOf"], ["class", "date-stamp", 3, "left", "top", "color", "font-size", "z-index", "pointerdown", "contextmenu", 4, "ngFor", "ngForOf"], [1, "text-box", 3, "pointerdown", "contextmenu"], [1, "tb-handle", "tb-handle--left", 3, "pointerdown"], ["spellcheck", "false", 3, "ngModel", "ngModelChange", "focus", "input"], [1, "tb-handle", "tb-handle--right", 3, "pointerdown"], [1, "shape-stamp", 3, "pointerdown", "contextmenu"], [1, "remove-btn", 3, "click"], ["width", "100%", "height", "100%", "preserveAspectRatio", "none", 2, "overflow", "visible", "pointer-events", "none"], ["x", "0", "y", "0", "width", "100", "height", "100", "vector-effect", "non-scaling-stroke", 4, "ngIf"], ["cx", "50", "cy", "50", "rx", "50", "ry", "50", "vector-effect", "non-scaling-stroke", 4, "ngIf"], ["vector-effect", "non-scaling-stroke", "fill", "none", 4, "ngIf"], [1, "resize-handle", "rh-nw", 3, "pointerdown"], [1, "resize-handle", "rh-n", 3, "pointerdown"], [1, "resize-handle", "rh-ne", 3, "pointerdown"], [1, "resize-handle", "rh-e", 3, "pointerdown"], [1, "resize-handle", "rh-se", 3, "pointerdown"], [1, "resize-handle", "rh-s", 3, "pointerdown"], [1, "resize-handle", "rh-sw", 3, "pointerdown"], [1, "resize-handle", "rh-w", 3, "pointerdown"], ["x", "0", "y", "0", "width", "100", "height", "100", "vector-effect", "non-scaling-stroke"], ["cx", "50", "cy", "50", "rx", "50", "ry", "50", "vector-effect", "non-scaling-stroke"], ["vector-effect", "non-scaling-stroke", "fill", "none"], [1, "image-stamp", 3, "pointerdown", "contextmenu"], [3, "src"], [1, "pdf-form-field", "pff-mark", 3, "pointerdown", "contextmenu"], ["class", "pff-options-bar", 3, "pointerdown", 4, "ngIf"], [1, "pff-inner"], ["width", "100%", "height", "100%", "viewBox", "0 0 100 100", 2, "pointer-events", "none", "overflow", "visible"], [1, "pff-resize-handle", "rh-nw", 3, "pointerdown"], [1, "pff-resize-handle", "rh-n", 3, "pointerdown"], [1, "pff-resize-handle", "rh-ne", 3, "pointerdown"], [1, "pff-resize-handle", "rh-e", 3, "pointerdown"], [1, "pff-resize-handle", "rh-se", 3, "pointerdown"], [1, "pff-resize-handle", "rh-s", 3, "pointerdown"], [1, "pff-resize-handle", "rh-sw", 3, "pointerdown"], [1, "pff-resize-handle", "rh-w", 3, "pointerdown"], [1, "pff-options-bar", 3, "pointerdown"], [1, "pff-opt-label"], ["name", "resize-outline"], ["title", "ลดขนาด", 1, "pff-opt-btn", 3, "disabled", "click"], [1, "pff-opt-val"], ["title", "เพิ่มขนาด", 1, "pff-opt-btn", 3, "disabled", "click"], [1, "pff-opt-sep"], ["title", "ลบ", 1, "pff-opt-btn", "pff-opt-delete", 3, "click"], ["points", "12,52 42,82 88,18", "stroke-width", "10", "stroke-linecap", "round", "stroke-linejoin", "round", "fill", "none"], ["x1", "15", "y1", "15", "x2", "85", "y2", "85", "stroke-width", "10", "stroke-linecap", "round"], ["x1", "85", "y1", "15", "x2", "15", "y2", "85", "stroke-width", "10", "stroke-linecap", "round"], ["cx", "50", "cy", "50", "r", "38"], [1, "signature-stamp", 3, "pointerdown", "contextmenu"], ["class", "digital-id-label", 4, "ngIf"], [1, "digital-id-label"], ["class", "did-text", 4, "ngIf"], [1, "did-text"], [1, "pdf-form-field", 3, "pointerdown"], ["class", "pff-text-hint", 4, "ngIf"], ["width", "55%", "height", "55%", "viewBox", "0 0 18 18", "style", "pointer-events:none", 4, "ngIf"], ["title", "เส้นขอบ", 1, "pff-opt-btn", 3, "click"], ["title", "ลดขนาดอักษร", 1, "pff-opt-btn", 3, "disabled", "click"], ["title", "เพิ่มขนาดอักษร", 1, "pff-opt-btn", 3, "disabled", "click"], [1, "pff-text-hint"], ["width", "55%", "height", "55%", "viewBox", "0 0 18 18", 2, "pointer-events", "none"], ["x", "1", "y", "1", "width", "16", "height", "16", "rx", "2", "stroke", "#3b82f6", "stroke-width", "2", "fill", "none"], ["cx", "9", "cy", "9", "r", "8", "stroke", "#3b82f6", "stroke-width", "2", "fill", "none"], [1, "date-stamp", 3, "pointerdown", "contextmenu"], [1, "user-guide-content-area"], ["class", "guide-view-mode", 4, "ngIf"], ["style", "display: flex; flex-direction: column; height: 100%;", 4, "ngIf"], [1, "guide-view-mode"], [1, "guide-banner"], ["name", "rocket"], [1, "guide-section"], [1, "guide-section__title"], ["name", "text", 2, "color", "#60a5fa"], [1, "guide-list"], [1, "guide-item"], [1, "guide-step"], [1, "guide-item__text"], ["name", "text", 2, "vertical-align", "-2px", "color", "#60a5fa"], ["name", "move-outline", 1, "guide-item__icon", 2, "color", "#60a5fa"], ["name", "contract-outline", 1, "guide-item__icon", 2, "color", "#60a5fa"], [1, "guide-dot-demo"], ["name", "trash-outline", 1, "guide-item__icon", 2, "color", "#f87171"], ["name", "brush", 2, "color", "#fb7185"], ["name", "brush", 1, "guide-item__icon", 2, "color", "#fb7185"], ["name", "color-filter-outline", 1, "guide-item__icon", 2, "color", "#fde68a"], ["name", "cut-outline", 1, "guide-item__icon", 2, "color", "#94a3b8"], ["name", "shapes", 2, "color", "#a78bfa"], ["name", "square-outline", 1, "guide-item__icon", 2, "color", "#a78bfa"], ["name", "square-outline", 2, "vertical-align", "-2px", "font-size", "13px"], ["name", "ellipse-outline", 2, "vertical-align", "-2px", "font-size", "13px"], ["name", "remove-outline", 2, "vertical-align", "-2px", "font-size", "13px"], ["name", "arrow-forward-outline", 2, "vertical-align", "-2px", "font-size", "13px"], ["name", "color-palette", 1, "guide-item__icon", 2, "color", "#fbbf24"], ["name", "resize", 1, "guide-item__icon", 2, "color", "#a78bfa"], ["name", "finger-print", 2, "color", "#34d399"], ["name", "create-outline", 1, "guide-item__icon", 2, "color", "#34d399"], ["name", "finger-print", 2, "vertical-align", "-2px", "font-size", "13px", "color", "#34d399"], ["name", "cloud-upload-outline", 1, "guide-item__icon", 2, "color", "#34d399"], ["name", "shield-checkmark-outline", 1, "guide-item__icon", 2, "color", "#34d399"], ["name", "calendar", 2, "color", "#fb923c"], ["name", "calendar-outline", 1, "guide-item__icon", 2, "color", "#fb923c"], ["name", "calendar", 2, "vertical-align", "-2px", "font-size", "13px", "color", "#fb923c"], ["name", "image-outline", 1, "guide-item__icon", 2, "color", "#fb923c"], ["name", "image", 2, "vertical-align", "-2px", "font-size", "13px", "color", "#fb923c"], ["name", "documents", 2, "color", "#f59e0b"], ["name", "images-outline", 1, "guide-item__icon", 2, "color", "#f59e0b"], ["name", "images-outline", 2, "vertical-align", "-2px", "font-size", "13px"], ["name", "chevron-up-outline", 2, "vertical-align", "-2px", "font-size", "12px"], ["name", "chevron-down-outline", 2, "vertical-align", "-2px", "font-size", "12px"], ["name", "add-circle-outline", 1, "guide-item__icon", 2, "color", "#f59e0b"], ["name", "documents-outline", 2, "vertical-align", "-2px", "font-size", "13px"], ["name", "search-outline", 1, "guide-item__icon", 2, "color", "#f59e0b"], ["name", "keypad", 2, "color", "#e2e8f0"], [1, "guide-shortcuts-grid"], [1, "guide-shortcut-card"], [1, "guide-shortcut-card__keys"], [1, "guide-shortcut-card__label"], [1, "guide-protip"], [1, "guide-protip__icon"], ["name", "bulb"], [1, "guide-protip__body"], [1, "guide-protip__title"], [1, "guide-protip__list"], ["class", "guide-section", 4, "ngIf"], ["class", "guide-edit-btn", 3, "click", 4, "ngIf"], ["name", "megaphone", 2, "color", "#10b981"], [1, "guide-raw-content"], [1, "guide-edit-btn", 3, "click"], ["name", "create-outline"], [2, "display", "flex", "flex-direction", "column", "height", "100%"], [2, "font-size", "12px", "color", "#94a3b8", "margin-bottom", "8px"], ["placeholder", "พิมพ์คู่มือที่นี่...", 2, "flex", "1", "min-height", "300px", "width", "100%", "padding", "12px", "background", "rgba(0,0,0,0.2)", "border", "1px solid #334155", "border-radius", "6px", "color", "#e8eaf6", "font-size", "13.5px", "resize", "none", "line-height", "1.5", "outline", "none", "font-family", "sans-serif", 3, "ngModel", "ngModelChange"], [2, "display", "flex", "gap", "8px", "margin-top", "16px", "padding-bottom", "20px"], [2, "flex", "1", "padding", "10px", "background", "transparent", "border", "1px solid #475569", "color", "#94a3b8", "border-radius", "6px", "cursor", "pointer", "font-weight", "500", 3, "click"], [2, "flex", "1", "padding", "10px", "background", "#3b82f6", "border", "none", "color", "#fff", "border-radius", "6px", "cursor", "pointer", "font-weight", "600", "transition", "background 0.2s", 3, "click"], [1, "annot-history-loading"], ["name", "dots"], [1, "annot-history-list"], ["class", "annot-history-entry", 4, "ngFor", "ngForOf"], ["class", "annot-history-empty", 4, "ngIf"], [1, "annot-history-entry"], [1, "annot-history-entry__icon"], [1, "annot-history-entry__body"], [1, "annot-history-entry__title"], ["class", "annot-history-entry__page", 4, "ngIf"], [1, "annot-history-entry__user"], [1, "annot-history-entry__time"], [1, "annot-history-entry__page"], [1, "annot-history-empty"], [1, "signature-modal"], [1, "signature-modal__backdrop", 3, "click"], [1, "signature-modal__content"], [1, "signature-modal__hint"], [1, "signature-modal__pen-options"], [1, "pen-option-group"], [1, "pen-option-label"], [1, "pen-size-btn", 3, "disabled", "click"], [1, "pen-size-val"], [1, "signature-modal__canvas"], ["signatureCanvas", ""], [1, "signature-modal__actions"], ["fill", "outline", "color", "medium", 3, "click"], ["name", "refresh", "slot", "start"], ["fill", "outline", "color", "danger", 3, "click"], ["name", "close", "slot", "start"], ["fill", "outline", "color", "tertiary", 3, "click"], ["name", "image-outline", "slot", "start"], ["fill", "outline", "color", "success", 3, "click"], ["name", "cloud-upload", "slot", "start"], ["color", "primary", 3, "click"], ["name", "checkmark", "slot", "start"], [1, "signature-picker-modal"], [1, "signature-picker-modal__backdrop", 3, "click"], [1, "signature-picker-modal__content"], [1, "signature-picker-modal__hint"], ["class", "signature-picker-modal__loading", 4, "ngIf"], ["class", "signature-picker-modal__list", 4, "ngIf"], [1, "signature-picker-modal__actions"], ["fill", "outline", "color", "secondary", 3, "click"], ["name", "create", "slot", "start"], [1, "signature-picker-modal__loading"], [1, "signature-picker-modal__list"], ["class", "signature-item", 3, "click", 4, "ngFor", "ngForOf"], ["class", "signature-picker-modal__empty", 4, "ngIf"], [1, "signature-item", 3, "click"], [1, "signature-item__info"], [1, "signature-item__name"], ["class", "signature-item__badge", 4, "ngIf"], [1, "signature-item__actions"], ["title", "ตั้งเป็นหลัก", 1, "signature-item__btn", 3, "click"], ["name", "star"], ["title", "ลบ", 1, "signature-item__btn", "signature-item__btn--delete", 3, "click"], [1, "signature-item__badge"], [1, "signature-picker-modal__empty"], [1, "preview-overlay"], [1, "preview-header"], [1, "preview-title"], [1, "preview-actions"], ["fill", "clear", "color", "dark", 3, "click"], ["slot", "start", "name", "arrow-back-outline"], ["color", "success", 3, "click"], ["slot", "start", "name", "checkmark-done-outline"], [1, "preview-scroll-area"], [1, "preview-body"], ["class", "preview-filter-bar", 4, "ngIf"], ["class", "preview-pages", 4, "ngIf"], ["class", "preview-loading", 4, "ngIf"], [1, "preview-filter-bar"], ["name", "information-circle-outline"], ["fill", "clear", "size", "small", 3, "disabled", "click"], ["name", "crescent", "slot", "start", 4, "ngIf"], ["name", "crescent", "slot", "start"], [1, "preview-pages"], ["class", "preview-page-img", 3, "src", "alt", 4, "ngFor", "ngForOf"], [1, "preview-page-img", 3, "src", "alt"], [1, "preview-loading"], [1, "custom-context-menu"], [1, "menu-btn", 3, "click"], ["name", "arrow-up-circle-outline"], ["name", "arrow-down-circle-outline"], [1, "menu-divider"], [1, "menu-btn", "danger-btn", 3, "click"]], template: function PdfAnnotatorModalComponent_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵelementStart(0, "ion-header")(1, "ion-toolbar")(2, "ion-buttons", 0)(3, "ion-button", 1);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_ion_button_click_3_listener() { return ctx.close(); });
        ɵngcc0.ɵɵelement(4, "ion-icon", 2);
        ɵngcc0.ɵɵelementEnd()()()();
        ɵngcc0.ɵɵelementStart(5, "ion-content", 3);
        ɵngcc0.ɵɵtemplate(6, PdfAnnotatorModalComponent_div_6_Template, 4, 4, "div", 4);
        ɵngcc0.ɵɵelementStart(7, "div", 5)(8, "div", 6)(9, "div", 7)(10, "button", 8);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_10_listener() { return ctx.toggleThumbnails(); });
        ɵngcc0.ɵɵelement(11, "ion-icon", 9);
        ɵngcc0.ɵɵelementEnd()();
        ɵngcc0.ɵɵelement(12, "div", 10);
        ɵngcc0.ɵɵelementStart(13, "div", 11)(14, "button", 12);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_14_listener() { return ctx.zoomOut(); });
        ɵngcc0.ɵɵelement(15, "ion-icon", 13)(16, "ion-icon", 14);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(17, "span", 15);
        ɵngcc0.ɵɵtext(18);
        ɵngcc0.ɵɵpipe(19, "number");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(20, "button", 12);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_20_listener() { return ctx.zoomIn(); });
        ɵngcc0.ɵɵelement(21, "ion-icon", 13)(22, "ion-icon", 16);
        ɵngcc0.ɵɵelementEnd()();
        ɵngcc0.ɵɵelement(23, "div", 10);
        ɵngcc0.ɵɵelementStart(24, "div", 17)(25, "button", 18);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_25_listener() { return ctx.firstPage(); });
        ɵngcc0.ɵɵelement(26, "ion-icon", 19);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(27, "button", 20);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_27_listener() { return ctx.prevPage(); });
        ɵngcc0.ɵɵelement(28, "ion-icon", 21);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(29, "span", 15);
        ɵngcc0.ɵɵtext(30);
        ɵngcc0.ɵɵtemplate(31, PdfAnnotatorModalComponent_span_31_Template, 3, 3, "span", 22);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(32, "button", 23);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_32_listener() { return ctx.nextPage(); });
        ɵngcc0.ɵɵelement(33, "ion-icon", 24);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(34, "button", 25);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_34_listener() { return ctx.lastPage(); });
        ɵngcc0.ɵɵelement(35, "ion-icon", 26);
        ɵngcc0.ɵɵelementEnd()();
        ɵngcc0.ɵɵelement(36, "div", 27);
        ɵngcc0.ɵɵelementStart(37, "div", 28)(38, "button", 29);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_38_listener() { return ctx.showInsertMenu = !ctx.showInsertMenu; });
        ɵngcc0.ɵɵelement(39, "ion-icon", 30)(40, "ion-icon", 31);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵtemplate(41, PdfAnnotatorModalComponent_div_41_Template, 46, 10, "div", 32);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelement(42, "div", 10);
        ɵngcc0.ɵɵelementStart(43, "div", 33)(44, "button", 34);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_44_listener() { return ctx.saveDocument(); });
        ɵngcc0.ɵɵelement(45, "ion-icon", 35);
        ɵngcc0.ɵɵelementStart(46, "span");
        ɵngcc0.ɵɵtext(47, "บันทึก");
        ɵngcc0.ɵɵelementEnd()();
        ɵngcc0.ɵɵelementStart(48, "button", 36);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_48_listener($event) { return ctx.toggleUserGuide($event); });
        ɵngcc0.ɵɵelement(49, "ion-icon", 37);
        ɵngcc0.ɵɵelementStart(50, "span", 38);
        ɵngcc0.ɵɵtext(51, "แนะนำการใช้งาน");
        ɵngcc0.ɵɵelementEnd()();
        ɵngcc0.ɵɵelementStart(52, "button", 39);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_52_listener() { return ctx.toggleHistoryPanel(); });
        ɵngcc0.ɵɵelement(53, "ion-icon", 40);
        ɵngcc0.ɵɵelementEnd()()();
        ɵngcc0.ɵɵelementStart(54, "div", 41)(55, "div", 42)(56, "button", 43);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_56_listener() { return ctx.enableTextPlaceMode(); });
        ɵngcc0.ɵɵelement(57, "ion-icon", 44);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵtemplate(58, PdfAnnotatorModalComponent_div_58_Template, 14, 12, "div", 45);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(59, "div", 46)(60, "button", 47);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_60_listener() { return ctx.showMarkOptions = !ctx.showMarkOptions; });
        ɵngcc0.ɵɵnamespaceSVG();
        ɵngcc0.ɵɵelementStart(61, "svg", 48);
        ɵngcc0.ɵɵelement(62, "rect", 49)(63, "polyline", 50)(64, "line", 51)(65, "circle", 52)(66, "circle", 53)(67, "line", 54)(68, "line", 55)(69, "line", 56)(70, "line", 57);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵnamespaceHTML();
        ɵngcc0.ɵɵelementStart(71, "span", 58);
        ɵngcc0.ɵɵtext(72, "แบบฟอร์ม");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelement(73, "ion-icon", 59);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵtemplate(74, PdfAnnotatorModalComponent_div_74_Template, 57, 26, "div", 60);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelement(75, "div", 10);
        ɵngcc0.ɵɵelementStart(76, "div", 61)(77, "button", 62);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_77_listener() { ctx.toolMode = "shape"; return ctx.showShapeDropdown = !ctx.showShapeDropdown; });
        ɵngcc0.ɵɵelement(78, "ion-icon", 63)(79, "ion-icon", 31);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵtemplate(80, PdfAnnotatorModalComponent_div_80_Template, 9, 8, "div", 64);
        ɵngcc0.ɵɵtemplate(81, PdfAnnotatorModalComponent_div_81_Template, 32, 26, "div", 65);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelement(82, "div", 10);
        ɵngcc0.ɵɵelementStart(83, "div", 42)(84, "button", 66);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_84_listener() { return ctx.toggleDraw(); });
        ɵngcc0.ɵɵelement(85, "ion-icon", 67);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵtemplate(86, PdfAnnotatorModalComponent_div_86_Template, 14, 12, "div", 45);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(87, "div", 42)(88, "button", 68);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_88_listener() { return ctx.toggleHighlight(); });
        ɵngcc0.ɵɵnamespaceSVG();
        ɵngcc0.ɵɵelementStart(89, "svg", 69);
        ɵngcc0.ɵɵelement(90, "path", 70)(91, "path", 71)(92, "line", 72);
        ɵngcc0.ɵɵelementEnd()();
        ɵngcc0.ɵɵtemplate(93, PdfAnnotatorModalComponent_div_93_Template, 17, 18, "div", 45);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵnamespaceHTML();
        ɵngcc0.ɵɵelementStart(94, "div", 42)(95, "button", 73);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_95_listener() { return ctx.toggleEraser(); });
        ɵngcc0.ɵɵnamespaceSVG();
        ɵngcc0.ɵɵelementStart(96, "svg", 69);
        ɵngcc0.ɵɵelement(97, "path", 74)(98, "path", 75);
        ɵngcc0.ɵɵelementEnd()();
        ɵngcc0.ɵɵtemplate(99, PdfAnnotatorModalComponent_div_99_Template, 7, 3, "div", 45);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵnamespaceHTML();
        ɵngcc0.ɵɵelement(100, "div", 10);
        ɵngcc0.ɵɵelementStart(101, "button", 76);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_101_listener() { return ctx.openSignaturePickerOrPad(); });
        ɵngcc0.ɵɵelement(102, "ion-icon", 77);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(103, "button", 78);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_103_listener() { return ctx.showDigitalId = !ctx.showDigitalId; });
        ɵngcc0.ɵɵelement(104, "ion-icon", 63);
        ɵngcc0.ɵɵelementStart(105, "span", 79);
        ɵngcc0.ɵɵtext(106, "DID");
        ɵngcc0.ɵɵelementEnd()();
        ɵngcc0.ɵɵelementStart(107, "div", 42)(108, "button", 80);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_108_listener() { return ctx.addDateStampAndShowOptions(); });
        ɵngcc0.ɵɵelement(109, "ion-icon", 81);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵtemplate(110, PdfAnnotatorModalComponent_div_110_Template, 14, 12, "div", 45);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(111, "button", 82);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_111_listener() { return ctx.triggerImageUpload(); });
        ɵngcc0.ɵɵelement(112, "ion-icon", 83);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(113, "input", 84, 85);
        ɵngcc0.ɵɵlistener("change", function PdfAnnotatorModalComponent_Template_input_change_113_listener($event) { return ctx.onImageSelected($event); });
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelement(115, "div", 10);
        ɵngcc0.ɵɵelementStart(116, "button", 86);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_116_listener() { return ctx.undo(); });
        ɵngcc0.ɵɵelement(117, "ion-icon", 87);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(118, "button", 88);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_118_listener() { return ctx.redo(); });
        ɵngcc0.ɵɵelement(119, "ion-icon", 89);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(120, "button", 90);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_120_listener() { return ctx.clearAnnotations(); });
        ɵngcc0.ɵɵelement(121, "ion-icon", 91);
        ɵngcc0.ɵɵelementEnd()();
        ɵngcc0.ɵɵelementStart(122, "div", 92);
        ɵngcc0.ɵɵtemplate(123, PdfAnnotatorModalComponent_aside_123_Template, 8, 1, "aside", 93);
        ɵngcc0.ɵɵtemplate(124, PdfAnnotatorModalComponent_div_124_Template, 12, 2, "div", 94);
        ɵngcc0.ɵɵelementStart(125, "div", 95)(126, "div", 96, 97);
        ɵngcc0.ɵɵlistener("scroll", function PdfAnnotatorModalComponent_Template_div_scroll_126_listener($event) { return ctx.onViewerScroll($event); });
        ɵngcc0.ɵɵtemplate(128, PdfAnnotatorModalComponent_div_128_Template, 10, 13, "div", 98);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(129, "div", 99)(130, "div");
        ɵngcc0.ɵɵtext(131, "• Keyboard: Ctrl+Z (Undo), Ctrl+Y (Redo), Escape (Exit mode), Delete (Remove selected)");
        ɵngcc0.ɵɵelementEnd()()()()();
        ɵngcc0.ɵɵelementStart(132, "div", 100)(133, "div", 101);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_div_click_133_listener() { return ctx.showUserGuidePanel = false; });
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(134, "div", 102)(135, "div", 103)(136, "span");
        ɵngcc0.ɵɵelement(137, "ion-icon", 104);
        ɵngcc0.ɵɵtext(138, " คู่มือการใช้งาน");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(139, "button", 105);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_139_listener() { return ctx.showUserGuidePanel = false; });
        ɵngcc0.ɵɵelement(140, "ion-icon", 106);
        ɵngcc0.ɵɵelementEnd()();
        ɵngcc0.ɵɵtemplate(141, PdfAnnotatorModalComponent_div_141_Template, 3, 2, "div", 107);
        ɵngcc0.ɵɵelementEnd()();
        ɵngcc0.ɵɵelementStart(142, "div", 108)(143, "div", 109);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_div_click_143_listener() { return ctx.showHistoryPanel = false; });
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(144, "div", 110)(145, "div", 111)(146, "span");
        ɵngcc0.ɵɵelement(147, "ion-icon", 40);
        ɵngcc0.ɵɵtext(148, " ประวัติการแก้ไข");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(149, "button", 105);
        ɵngcc0.ɵɵlistener("click", function PdfAnnotatorModalComponent_Template_button_click_149_listener() { return ctx.showHistoryPanel = false; });
        ɵngcc0.ɵɵelement(150, "ion-icon", 106);
        ɵngcc0.ɵɵelementEnd()();
        ɵngcc0.ɵɵtemplate(151, PdfAnnotatorModalComponent_div_151_Template, 2, 0, "div", 112);
        ɵngcc0.ɵɵtemplate(152, PdfAnnotatorModalComponent_div_152_Template, 3, 2, "div", 113);
        ɵngcc0.ɵɵelementEnd()();
        ɵngcc0.ɵɵelementStart(153, "input", 84, 114);
        ɵngcc0.ɵɵlistener("change", function PdfAnnotatorModalComponent_Template_input_change_153_listener($event) { return ctx.onSignatureFileSelected($event); });
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵtemplate(155, PdfAnnotatorModalComponent_div_155_Template, 42, 9, "div", 115);
        ɵngcc0.ɵɵtemplate(156, PdfAnnotatorModalComponent_div_156_Template, 19, 2, "div", 116);
        ɵngcc0.ɵɵtemplate(157, PdfAnnotatorModalComponent_div_157_Template, 16, 5, "div", 117);
        ɵngcc0.ɵɵtemplate(158, PdfAnnotatorModalComponent_div_158_Template, 17, 4, "div", 118);
        ɵngcc0.ɵɵelementEnd();
    } if (rf & 2) {
        ɵngcc0.ɵɵstyleProp("display", ctx.showPreviewOverlay ? "none" : "");
        ɵngcc0.ɵɵadvance(5);
        ɵngcc0.ɵɵproperty("scrollY", false);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.isLoading);
        ɵngcc0.ɵɵadvance(8);
        ɵngcc0.ɵɵproperty("disabled", ctx.zoom <= 0.5);
        ɵngcc0.ɵɵadvance(4);
        ɵngcc0.ɵɵtextInterpolate1("", ɵngcc0.ɵɵpipeBind2(19, 62, ctx.zoom * 100, "1.0-0"), "%");
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵproperty("disabled", ctx.zoom >= 3);
        ɵngcc0.ɵɵadvance(5);
        ɵngcc0.ɵɵproperty("disabled", ctx.pageNo <= 1);
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵproperty("disabled", ctx.pageNo <= 1);
        ɵngcc0.ɵɵadvance(3);
        ɵngcc0.ɵɵtextInterpolate2(" ", ctx.pageNo, " / ", ctx.pageCount || "?", " ");
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.loadedUntilPage < ctx.pageCount);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("disabled", ctx.pageNo >= ctx.pageCount || ctx.isLoadingChunk);
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵpropertyInterpolate1("title", "หน้าสุดท้าย (โหลดแล้ว ", ctx.loadedUntilPage, " หน้า)");
        ɵngcc0.ɵɵproperty("disabled", ctx.pageNo >= ctx.pageCount || ctx.isLoadingChunk);
        ɵngcc0.ɵɵadvance(7);
        ɵngcc0.ɵɵproperty("ngIf", ctx.showInsertMenu);
        ɵngcc0.ɵɵadvance(7);
        ɵngcc0.ɵɵclassProp("active", ctx.showUserGuidePanel);
        ɵngcc0.ɵɵadvance(4);
        ɵngcc0.ɵɵclassProp("active", ctx.showHistoryPanel);
        ɵngcc0.ɵɵadvance(4);
        ɵngcc0.ɵɵclassProp("active", ctx.textPlaceMode);
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵproperty("ngIf", ctx.textPlaceMode);
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵclassProp("active", ctx.showMarkOptions || ctx.toolMode === "mark");
        ɵngcc0.ɵɵadvance(14);
        ɵngcc0.ɵɵproperty("ngIf", ctx.showMarkOptions);
        ɵngcc0.ɵɵadvance(3);
        ɵngcc0.ɵɵclassProp("active", ctx.shapeMode);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("name", ctx.shapeType === "rect" ? "square-outline" : ctx.shapeType === "circle" ? "ellipse-outline" : ctx.shapeType === "line" ? "remove-outline" : "arrow-forward-outline");
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵproperty("ngIf", ctx.showShapeDropdown);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.shapeMode);
        ɵngcc0.ɵɵadvance(3);
        ɵngcc0.ɵɵclassProp("active", ctx.drawMode);
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵproperty("ngIf", ctx.drawMode);
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵclassProp("active", ctx.highlightMode);
        ɵngcc0.ɵɵadvance(5);
        ɵngcc0.ɵɵproperty("ngIf", ctx.highlightMode);
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵclassProp("active", ctx.eraserMode);
        ɵngcc0.ɵɵadvance(4);
        ɵngcc0.ɵɵproperty("ngIf", ctx.eraserMode);
        ɵngcc0.ɵɵadvance(4);
        ɵngcc0.ɵɵclassProp("active", ctx.showDigitalId);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("name", ctx.showDigitalId ? "shield-checkmark" : "shield-checkmark-outline");
        ɵngcc0.ɵɵadvance(4);
        ɵngcc0.ɵɵclassProp("active", ctx.showDateOptions);
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵproperty("ngIf", ctx.showDateOptions);
        ɵngcc0.ɵɵadvance(6);
        ɵngcc0.ɵɵproperty("disabled", !ctx.canUndo());
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵproperty("disabled", !ctx.canRedo());
        ɵngcc0.ɵɵadvance(5);
        ɵngcc0.ɵɵproperty("ngIf", ctx.showThumbnails);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.thumbInsertIndex >= 0);
        ɵngcc0.ɵɵadvance(4);
        ɵngcc0.ɵɵproperty("ngForOf", ctx.pages);
        ɵngcc0.ɵɵadvance(4);
        ɵngcc0.ɵɵclassProp("open", ctx.showUserGuidePanel);
        ɵngcc0.ɵɵadvance(9);
        ɵngcc0.ɵɵproperty("ngIf", !ctx.isLoadingGuide);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵclassProp("open", ctx.showHistoryPanel);
        ɵngcc0.ɵɵadvance(9);
        ɵngcc0.ɵɵproperty("ngIf", ctx.isLoadingHistory);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", !ctx.isLoadingHistory);
        ɵngcc0.ɵɵadvance(3);
        ɵngcc0.ɵɵproperty("ngIf", ctx.showSignaturePad);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.showSignaturePicker);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.showPreviewOverlay);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.contextMenu.show);
    } }, dependencies: [ɵngcc4.NgForOf, ɵngcc4.NgIf, ɵngcc5.DefaultValueAccessor, ɵngcc5.NgControlStatus, ɵngcc5.NgModel, ɵngcc2.IonButton, ɵngcc2.IonButtons, ɵngcc2.IonContent, ɵngcc2.IonHeader, ɵngcc2.IonIcon, ɵngcc2.IonSpinner, ɵngcc2.IonToolbar, ɵngcc4.DecimalPipe, ɵngcc4.DatePipe], styles: ["@charset \"UTF-8\";[_nghost-%COMP%]{display:block;height:100%}.annotator-content[_ngcontent-%COMP%]{--background: #f1f5f9;height:100%;overflow:hidden;position:relative}.annotator-content[_ngcontent-%COMP%]::part(scroll){display:flex;flex-direction:column;height:100%;overflow:hidden}ion-header[_ngcontent-%COMP%]{box-shadow:0 2px 8px #0000000d}ion-header[_ngcontent-%COMP%]   ion-toolbar[_ngcontent-%COMP%]{--background: #fff;--color: #1e293b;--padding-top: 8px;--padding-bottom: 8px}.annotator-layout[_ngcontent-%COMP%]{display:flex;height:100%;width:100%;min-height:0;overflow:hidden;position:relative}.annotator-layout-v2[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100%;width:100%;min-height:0;overflow:hidden}.toolbar-row[_ngcontent-%COMP%]{display:flex;align-items:center;background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:6px 12px;grid-gap:8px;gap:8px;flex-shrink:0}.toolbar-row--nav[_ngcontent-%COMP%]{background:#fff}.toolbar-row--tools[_ngcontent-%COMP%]{background:#f1f5f9;flex-wrap:wrap}.toolbar-group[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:4px;gap:4px}.toolbar-group--zoom[_ngcontent-%COMP%], .toolbar-group--pager[_ngcontent-%COMP%]{grid-gap:2px;gap:2px}.toolbar-group--save[_ngcontent-%COMP%]{margin-left:auto}.toolbar-divider[_ngcontent-%COMP%]{width:1px;height:24px;background:#e2e8f0;margin:0 8px}.toolbar-spacer[_ngcontent-%COMP%]{flex:1}.toolbar-label[_ngcontent-%COMP%]{font-size:12px;color:#64748b;min-width:50px;text-align:center}.toolbar-btn[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;grid-gap:4px;gap:4px;background:transparent;border:1px solid transparent;border-radius:6px;padding:6px 10px;cursor:pointer;transition:all .15s ease;color:#475569;font-size:13px}.toolbar-btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:18px}.toolbar-btn[_ngcontent-%COMP%]   .zoom-icon[_ngcontent-%COMP%]{font-size:10px;margin-left:-4px}.toolbar-btn[_ngcontent-%COMP%]:hover:not(:disabled){background:#e2e8f0}.toolbar-btn[_ngcontent-%COMP%]:disabled{opacity:.4;cursor:not-allowed}.toolbar-btn.active[_ngcontent-%COMP%]{background:#3b82f6;color:#fff;border-color:#2563eb}.toolbar-btn--guide[_ngcontent-%COMP%]{background:rgba(14,165,233,.1);color:#0ea5e9;border:1px solid rgba(14,165,233,.3);padding:6px 12px}.toolbar-btn--guide[_ngcontent-%COMP%]:hover{background:rgba(14,165,233,.2)}.toolbar-btn--guide.active[_ngcontent-%COMP%]{background:#0ea5e9;color:#fff;border-color:#0284c7}.toolbar-btn--save[_ngcontent-%COMP%]{background:linear-gradient(135deg,#22c55e 0%,#16a34a 100%);color:#fff;padding:7px 16px;font-weight:700;font-size:14px;border-radius:8px;border:1px solid #16a34a;box-shadow:0 2px 8px #22c55e59;letter-spacing:.2px;transition:all .2s ease}.toolbar-btn--save[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:17px}.toolbar-btn--save[_ngcontent-%COMP%]:hover:not(:disabled){background:linear-gradient(135deg,#16a34a 0%,#15803d 100%);box-shadow:0 4px 14px #22c55e80;transform:translateY(-1px)}.toolbar-btn--save[_ngcontent-%COMP%]:active{transform:translateY(0);box-shadow:0 2px 6px #22c55e4d}.toolbar-btn--danger[_ngcontent-%COMP%]{color:#ef4444}.toolbar-btn--danger[_ngcontent-%COMP%]:hover{background:#fee2e2}.toolbar-btn--toggle[_ngcontent-%COMP%]{font-size:11px;padding:4px 6px;grid-gap:2px;gap:2px}.toolbar-btn--toggle[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:14px}.toolbar-btn--toggle[_ngcontent-%COMP%]   .toggle-label[_ngcontent-%COMP%]{font-size:9px;font-weight:600;letter-spacing:.5px}.tool-item[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:4px;gap:4px}.tool-options[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:4px;gap:4px;background:#f1f5f9;padding:4px 8px;border-radius:6px;border:1px solid #e2e8f0}.tool-options[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:24px;height:24px;border:none;background:#fff;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center}.tool-options[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background:#e2e8f0}.tool-options[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled{opacity:.4}.tool-options[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:14px}.tool-options[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:11px;min-width:24px;text-align:center;color:#64748b}.color-dots[_ngcontent-%COMP%]{display:flex;grid-gap:4px;gap:4px;margin-left:4px}.color-dot[_ngcontent-%COMP%]{width:16px;height:16px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:all .15s ease;position:relative;overflow:hidden}.color-dot[_ngcontent-%COMP%]:hover{transform:scale(1.1)}.color-dot.active[_ngcontent-%COMP%]{border-color:#1e293b;box-shadow:0 0 0 2px #fff,0 0 0 4px currentColor}.color-dot--custom[_ngcontent-%COMP%]{box-shadow:0 0 0 1px #cbd5e1}.color-dot--custom[_ngcontent-%COMP%]   input[type=color][_ngcontent-%COMP%]{position:absolute;top:-10px;left:-10px;width:40px;height:40px;cursor:pointer;opacity:0}.color-dot--custom[_ngcontent-%COMP%]:hover{box-shadow:0 0 0 1.5px #94a3b8}.insert-page-tool[_ngcontent-%COMP%]{position:relative}.insert-page-tool[_ngcontent-%COMP%]   .insert-badge-icon[_ngcontent-%COMP%]{font-size:11px!important;margin-left:-6px;margin-top:-8px;color:#22c55e}.insert-page-dropdown[_ngcontent-%COMP%]{position:absolute;top:calc(100% + 4px);right:0;z-index:500}.insert-page-backdrop[_ngcontent-%COMP%]{position:fixed;inset:0;z-index:499}.insert-page-menu[_ngcontent-%COMP%]{position:relative;z-index:500;background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:8px;box-shadow:0 6px 24px #00000024;min-width:220px;display:flex;flex-direction:column;grid-gap:4px;gap:4px}.insert-page-title[_ngcontent-%COMP%]{font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;padding:2px 6px 6px;border-bottom:1px solid #f1f5f9;margin-bottom:2px}.insert-page-btn[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:10px;gap:10px;width:100%;padding:9px 12px;border:1px solid transparent;border-radius:7px;background:transparent;cursor:pointer;color:#334155;font-size:13px;text-align:left;transition:all .15s}.insert-page-btn[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{color:#94a3b8;font-size:11px}.insert-page-btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:16px;color:#3b82f6;flex-shrink:0}.insert-page-btn[_ngcontent-%COMP%]:hover:not(:disabled){background:#eff6ff;border-color:#bfdbfe;color:#1e40af}.insert-page-btn[_ngcontent-%COMP%]:hover:not(:disabled)   ion-icon[_ngcontent-%COMP%]{color:#1d4ed8}.insert-page-btn[_ngcontent-%COMP%]:active:not(:disabled){background:#dbeafe}.insert-page-btn[_ngcontent-%COMP%]:disabled{opacity:.35;cursor:not-allowed}.insert-page-btn--danger[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{color:#ef4444}.insert-page-btn--danger[_ngcontent-%COMP%]:hover:not(:disabled){background:#fff1f2;border-color:#fecaca;color:#b91c1c}.insert-page-btn--danger[_ngcontent-%COMP%]:hover:not(:disabled)   ion-icon[_ngcontent-%COMP%]{color:#dc2626}.insert-page-btn--danger[_ngcontent-%COMP%]:active:not(:disabled){background:#fee2e2}.insert-page-btn--undo[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{color:#f59e0b}.insert-page-btn--undo[_ngcontent-%COMP%]:hover:not(:disabled){background:#fffbeb;border-color:#fde68a;color:#92400e}.insert-page-btn--undo[_ngcontent-%COMP%]:hover:not(:disabled)   ion-icon[_ngcontent-%COMP%]{color:#d97706}.insert-page-btn--undo[_ngcontent-%COMP%]:active:not(:disabled){background:#fef3c7}.insert-orient-row[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:8px;gap:8px;padding:4px 6px 8px}.insert-orient-label[_ngcontent-%COMP%]{font-size:12px;color:#64748b;white-space:nowrap;flex-shrink:0}.insert-orient-group[_ngcontent-%COMP%]{display:flex;grid-gap:4px;gap:4px;flex:1}.insert-orient-btn[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:5px;gap:5px;flex:1;justify-content:center;padding:6px 8px;border:1.5px solid #e2e8f0;border-radius:7px;background:#f8fafc;cursor:pointer;font-size:12px;color:#475569;transition:all .15s}.insert-orient-btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:15px}.insert-orient-btn[_ngcontent-%COMP%]:hover{background:#f1f5f9;border-color:#cbd5e1}.insert-orient-btn.active[_ngcontent-%COMP%]{background:#eff6ff;border-color:#3b82f6;color:#1e40af;font-weight:600}.insert-orient-btn.active[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{color:#3b82f6}.insert-page-title--danger[_ngcontent-%COMP%]{color:#ef4444!important;background:#fff1f2;border-radius:5px;padding:3px 6px 6px!important}.insert-menu-divider[_ngcontent-%COMP%]{height:1px;background:#f1f5f9;margin:2px 0 4px}.shape-tool-item[_ngcontent-%COMP%]{position:relative;display:flex;align-items:flex-start;grid-gap:4px;gap:4px;flex-wrap:nowrap}.shape-chevron[_ngcontent-%COMP%]{font-size:10px!important;margin-left:-2px;opacity:.7}.mark-tool-item[_ngcontent-%COMP%]{position:relative;display:flex;align-items:flex-start}.mark-toolbar-btn[_ngcontent-%COMP%]{display:flex!important;flex-direction:row!important;align-items:center!important;grid-gap:4px!important;gap:4px!important;padding:0 8px!important;min-width:unset!important}.mark-btn-label[_ngcontent-%COMP%]{font-size:11px;font-weight:600;white-space:nowrap;letter-spacing:-.01em}.mark-chevron[_ngcontent-%COMP%]{font-size:10px!important;opacity:.7}.mark-popup[_ngcontent-%COMP%]{position:absolute;top:calc(100% + 6px);left:0;z-index:300;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 6px 24px #00000024;padding:12px 14px;min-width:210px;display:flex;flex-direction:column;grid-gap:8px;gap:8px}.mark-popup-section-label[_ngcontent-%COMP%]{font-size:11px;font-weight:600;color:#64748b;letter-spacing:.02em}.mark-popup-divider[_ngcontent-%COMP%]{height:1px;background:#f1f5f9;margin:0}.mark-quick-row[_ngcontent-%COMP%]{display:flex;grid-gap:8px;gap:8px;align-items:center}.mark-quick-btn[_ngcontent-%COMP%]{width:44px;height:44px;border:1.5px solid #e2e8f0;border-radius:8px;background:#f8fafc;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#1e293b;padding:0;transition:background .12s,border-color .12s}.mark-quick-btn[_ngcontent-%COMP%]:hover{background:#e2e8f0}.mark-quick-btn.active[_ngcontent-%COMP%]{background:#dbeafe;border-color:#3b82f6;color:#1d4ed8}.mark-form-list[_ngcontent-%COMP%]{display:flex;flex-direction:column;grid-gap:2px;gap:2px}.mark-form-row-btn[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:10px;gap:10px;width:100%;padding:7px 8px;border:none;border-radius:7px;background:transparent;cursor:pointer;color:#1e293b;font-size:13.5px;text-align:left;transition:background .1s}.mark-form-row-btn[_ngcontent-%COMP%]:hover{background:#f1f5f9}.mark-form-row-btn.active[_ngcontent-%COMP%]{background:#dbeafe;color:#1d4ed8}.mark-form-row-icon[_ngcontent-%COMP%]{width:24px;height:24px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.mark-form-row-icon--text[_ngcontent-%COMP%]{font-size:14px;font-weight:700;color:inherit}.mark-controls-row[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:4px;gap:4px}.mark-controls-row[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:24px;height:24px;border:1px solid #e2e8f0;border-radius:4px;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}.mark-controls-row[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background:#e2e8f0}.mark-controls-row[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled{opacity:.4;cursor:default}.mark-size-val[_ngcontent-%COMP%]{min-width:22px;text-align:center;font-size:12px;font-weight:500}.mark-cancel-btn[_ngcontent-%COMP%]{width:100%;display:flex;align-items:center;justify-content:center;grid-gap:6px;gap:6px;padding:7px 0;border:none;border-radius:6px;background:#f1f5f9;color:#64748b;font-size:13px;font-weight:500;cursor:pointer;transition:background .15s,color .15s}.mark-cancel-btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:16px}.mark-cancel-btn[_ngcontent-%COMP%]:hover{background:#fee2e2;color:#ef4444}.shape-dropdown[_ngcontent-%COMP%]{position:absolute;top:calc(100% + 4px);left:0;z-index:300;display:flex;flex-direction:column;grid-gap:2px;gap:2px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:6px;box-shadow:0 4px 16px #0000001f;min-width:46px}.shape-dropdown[_ngcontent-%COMP%]   .shape-dd-btn[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border:1px solid transparent;border-radius:6px;background:transparent;cursor:pointer;color:#475569;transition:all .15s}.shape-dropdown[_ngcontent-%COMP%]   .shape-dd-btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:18px}.shape-dropdown[_ngcontent-%COMP%]   .shape-dd-btn[_ngcontent-%COMP%]:hover{background:#f1f5f9;color:#1e293b}.shape-dropdown[_ngcontent-%COMP%]   .shape-dd-btn.active[_ngcontent-%COMP%]{background:#3b82f6;color:#fff;border-color:#2563eb}.shape-options-panel[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:8px;gap:8px;flex-wrap:wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:5px 10px;margin-left:2px}.shape-opt-group[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:5px;gap:5px}.shape-opt-label[_ngcontent-%COMP%]{font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.4px;white-space:nowrap}.sopt-divider[_ngcontent-%COMP%]{width:1px;height:30px;background:#e2e8f0;flex-shrink:0}.sopt-btn[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;width:22px;height:22px;border:1px solid #e2e8f0;border-radius:4px;background:#fff;cursor:pointer;color:#475569;transition:background .12s}.sopt-btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:13px}.sopt-btn[_ngcontent-%COMP%]:hover:not(:disabled){background:#e2e8f0}.sopt-btn[_ngcontent-%COMP%]:disabled{opacity:.35;cursor:not-allowed}.sopt-val[_ngcontent-%COMP%]{font-size:11px;font-weight:600;color:#475569;min-width:18px;text-align:center}.sopt-fill-toggle[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border:1px solid #e2e8f0;border-radius:5px;background:#fff;cursor:pointer;color:#94a3b8;transition:all .15s}.sopt-fill-toggle[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:15px}.sopt-fill-toggle[_ngcontent-%COMP%]:hover{background:#f1f5f9;color:#475569}.sopt-fill-toggle.active[_ngcontent-%COMP%]{background:#3b82f6;color:#fff;border-color:#2563eb}.mac-color-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(8,16px);grid-gap:2px;gap:2px;transition:opacity .15s}.mac-color-grid.disabled[_ngcontent-%COMP%]{opacity:.3;pointer-events:none}.mac-swatch[_ngcontent-%COMP%]{width:16px;height:16px;border-radius:3px;border:1.5px solid rgba(0,0,0,.18);cursor:pointer;transition:transform .1s,box-shadow .1s;flex-shrink:0}.mac-swatch[_ngcontent-%COMP%]:hover{transform:scale(1.25);z-index:2;box-shadow:0 2px 6px #0003}.mac-swatch.active[_ngcontent-%COMP%]{transform:scale(1.15);box-shadow:0 0 0 2px #fff,0 0 0 3.5px #3b82f6;z-index:3}.mac-swatch--current[_ngcontent-%COMP%]{width:22px;height:22px;border-radius:4px;border:2px solid #cbd5e1;cursor:default;pointer-events:none}.mac-swatch--current[_ngcontent-%COMP%]:hover{transform:none}.mac-custom-color[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:3px;gap:3px;transition:opacity .15s}.mac-custom-color.disabled[_ngcontent-%COMP%]{opacity:.3;pointer-events:none}.mac-custom-color[_ngcontent-%COMP%]   input[type=color][_ngcontent-%COMP%]{width:22px;height:22px;border:2px solid #cbd5e1;border-radius:4px;padding:1px;cursor:pointer;background:none}.mac-custom-color[_ngcontent-%COMP%]   input[type=color][_ngcontent-%COMP%]::-webkit-color-swatch-wrapper{padding:0}.mac-custom-color[_ngcontent-%COMP%]   input[type=color][_ngcontent-%COMP%]::-webkit-color-swatch{border:none;border-radius:2px}@media (max-width: 767px){.shape-options-panel[_ngcontent-%COMP%]{padding:4px 6px;grid-gap:5px;gap:5px}.mac-color-grid[_ngcontent-%COMP%]{grid-template-columns:repeat(8,13px)}.mac-color-grid[_ngcontent-%COMP%]   .mac-swatch[_ngcontent-%COMP%]{width:13px;height:13px}}.main-area[_ngcontent-%COMP%]{display:flex;flex:1;min-height:0;overflow:hidden}.thumbnails-sidebar[_ngcontent-%COMP%]{width:148px;min-width:148px;background:#1a2232;display:flex;flex-direction:column;overflow:visible;position:relative;z-index:10}.thumb-list[_ngcontent-%COMP%]{flex:1;overflow-y:auto;overflow-x:visible;display:flex;flex-direction:column;align-items:center;padding:8px 0 16px;grid-gap:0;gap:0;scrollbar-width:thin;scrollbar-color:#334155 #1a2232}.thumb-list[_ngcontent-%COMP%]::-webkit-scrollbar{width:5px}.thumb-list[_ngcontent-%COMP%]::-webkit-scrollbar-track{background:#1a2232}.thumb-list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}.thumb-card-wrap[_ngcontent-%COMP%]{width:120px;display:flex;flex-direction:column;border-radius:10px;overflow:hidden;box-shadow:0 3px 12px #0000004d;flex-shrink:0}.thumb-card[_ngcontent-%COMP%]{width:120px;background:#243044;border-radius:0;overflow:hidden;cursor:pointer;border:2.5px solid transparent;border-bottom:none;transition:border-color .15s}.thumb-card-wrap[_ngcontent-%COMP%]:hover > .thumb-card[_ngcontent-%COMP%]{border-color:#63b3ed66}.thumb-card-wrap[_ngcontent-%COMP%]:has(.thumb-card.active) > .thumb-card[_ngcontent-%COMP%]{border-color:#3b82f6}.thumb-card.active[_ngcontent-%COMP%]{border-color:#3b82f6}.thumb-card__img-wrap[_ngcontent-%COMP%]{padding:6px 6px 0;overflow:hidden;border-radius:8px 8px 0 0}.thumb-card__img-wrap[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;border-radius:5px;display:block;box-shadow:0 2px 8px #0006}.thumb-card__label[_ngcontent-%COMP%]{display:block;text-align:center;color:#94a3b8;font-size:11px;font-weight:500;padding:4px 0 3px}.thumb-card__actions[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-around;padding:5px 4px;background:#0f172a;border-top:1px solid #334155;border-radius:0 0 8px 8px}.thumb-action-btn[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border:1px solid #334155;border-radius:6px;background:#1e293b;color:#94a3b8;cursor:pointer;transition:all .15s;flex-shrink:0}.thumb-action-btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:15px}.thumb-action-btn[_ngcontent-%COMP%]:hover:not(:disabled){background:#334155;color:#e2e8f0;border-color:#475569}.thumb-action-btn[_ngcontent-%COMP%]:disabled{opacity:.25;cursor:not-allowed}.thumb-action-btn--danger[_ngcontent-%COMP%]{color:#f87171;border-color:#7f1d1d;background:#1c0a0a}.thumb-action-btn--danger[_ngcontent-%COMP%]:hover:not(:disabled){background:#450a0a;border-color:#ef4444;color:#fca5a5}.thumb-insert-row[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;width:100%;padding:6px 0;position:relative;flex-shrink:0}.thumb-insert-slot[_ngcontent-%COMP%]{position:relative;display:flex;align-items:center;justify-content:center}.thumb-add-btn[_ngcontent-%COMP%]{width:32px;height:32px;border-radius:50%;border:2px solid #3b82f6;background:#1e40af;color:#93c5fd;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;box-shadow:0 2px 8px #3b82f666}.thumb-add-btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:18px;font-weight:700}.thumb-add-btn[_ngcontent-%COMP%]:hover{background:#2563eb;color:#fff;transform:scale(1.1);box-shadow:0 4px 14px #3b82f680}.thumb-add-btn[_ngcontent-%COMP%]:active{transform:scale(.95)}.thumb-insert-dropdown[_ngcontent-%COMP%]{position:fixed;left:158px;z-index:2000;transform:translateY(-50%)}.thumb-insert-backdrop[_ngcontent-%COMP%]{position:fixed;inset:0;z-index:698}.thumb-insert-menu[_ngcontent-%COMP%]{position:relative;z-index:699;background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:8px;box-shadow:0 8px 32px #0000002e;min-width:210px;display:flex;flex-direction:column;grid-gap:2px;gap:2px}.thumb-insert-menu[_ngcontent-%COMP%]:before{content:\"\";position:absolute;left:-8px;top:50%;transform:translateY(-50%);border:8px solid transparent;border-right-color:#fff;border-left:none}.thumb-insert-opt[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:10px;gap:10px;width:100%;padding:10px 14px;border:1px solid transparent;border-radius:8px;background:transparent;cursor:pointer;color:#1e293b;font-size:14px;font-family:inherit;text-align:left;transition:all .15s}.thumb-insert-opt[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:18px;color:#3b82f6;flex-shrink:0}.thumb-insert-opt[_ngcontent-%COMP%]:hover{background:#eff6ff;border-color:#bfdbfe;color:#1e40af}.thumb-insert-opt[_ngcontent-%COMP%]:hover   ion-icon[_ngcontent-%COMP%]{color:#1d4ed8}.thumb-insert-opt[_ngcontent-%COMP%]:active{background:#dbeafe}.viewer-wrapper[_ngcontent-%COMP%]{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}.viewer-container[_ngcontent-%COMP%]{flex:1;overflow-y:auto;overflow-x:auto;background:#f1f5f9;display:flex;flex-direction:column;align-items:center;padding:20px;grid-gap:20px;gap:20px}.page-container[_ngcontent-%COMP%]{position:relative;box-shadow:0 4px 12px #00000026;background:#fff;flex-shrink:0}.page-container[_ngcontent-%COMP%]   .pdf-canvas[_ngcontent-%COMP%], .page-container[_ngcontent-%COMP%]   .annot-canvas[_ngcontent-%COMP%]{display:block}.page-container[_ngcontent-%COMP%]   .annot-canvas[_ngcontent-%COMP%]{position:absolute;top:0;left:0;touch-action:none}@media (max-width: 767px){.toolbar-row[_ngcontent-%COMP%]{padding:4px 8px;grid-gap:4px;gap:4px;flex-wrap:wrap}.toolbar-row--tools[_ngcontent-%COMP%]{padding:6px 8px}.toolbar-btn[_ngcontent-%COMP%]{padding:4px 6px}.toolbar-btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:16px}.toolbar-btn[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:none}.toolbar-divider[_ngcontent-%COMP%]{margin:0 4px}.thumbnails-sidebar[_ngcontent-%COMP%]{width:80px;min-width:80px;padding:8px 4px}.thumbnail-item[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{max-width:64px}.tool-options[_ngcontent-%COMP%]{display:none}.hint[_ngcontent-%COMP%]{display:none}}@media (max-width: 480px){.thumbnails-sidebar[_ngcontent-%COMP%]{display:none}.toolbar-label[_ngcontent-%COMP%]{min-width:30px;font-size:10px}}.sidebar[_ngcontent-%COMP%]{width:200px;min-width:200px;background:#1e293b;color:#fff;display:flex;flex-direction:column;padding:16px;z-index:100;box-shadow:4px 0 15px #0000001a;overflow-y:auto}.sidebar__section[_ngcontent-%COMP%]{margin-bottom:24px}.sidebar__section--nav[_ngcontent-%COMP%]{background:rgba(255,255,255,.05);padding:12px;border-radius:12px;margin-bottom:20px;display:flex;flex-direction:column;grid-gap:12px;gap:12px}.sidebar__section--save[_ngcontent-%COMP%]{margin-top:auto;padding-top:20px;border-top:1px solid rgba(255,255,255,.1)}.sidebar__title[_ngcontent-%COMP%]{font-size:11px;font-weight:700;color:#fff6;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}.sidebar__row[_ngcontent-%COMP%]{display:flex;grid-gap:8px;gap:8px;margin-bottom:8px}.sidebar__row--wrap[_ngcontent-%COMP%]{flex-wrap:wrap}.sidebar__btn[_ngcontent-%COMP%]{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;grid-gap:6px;gap:6px;padding:10px 4px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#fffc;font-size:11px;cursor:pointer;transition:all .2s;box-shadow:0 2px 4px #0000001a}.sidebar__btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:20px}.sidebar__btn[_ngcontent-%COMP%]:hover:not([disabled]){background:rgba(255,255,255,.15);color:#fff;transform:translateY(-1px);box-shadow:0 4px 8px #0003}.sidebar__btn.active[_ngcontent-%COMP%]{background:#3b82f6;color:#fff;border-color:#60a5fa;box-shadow:0 4px 12px #3b82f666}.sidebar__btn[disabled][_ngcontent-%COMP%]{opacity:.3;cursor:not-allowed}.sidebar__btn--signature[_ngcontent-%COMP%]{background:rgba(139,92,246,.1);border-color:#8b5cf64d;color:#a78bfa}.sidebar__btn--signature.active[_ngcontent-%COMP%], .sidebar__btn--signature[_ngcontent-%COMP%]:hover:not([disabled]){background:#8b5cf6;color:#fff}.sidebar__btn--date[_ngcontent-%COMP%]{background:rgba(16,185,129,.1);border-color:#10b9814d;color:#34d399}.sidebar__btn--date.active[_ngcontent-%COMP%], .sidebar__btn--date[_ngcontent-%COMP%]:hover:not([disabled]){background:#10b981;color:#fff}.sidebar__btn--warning[_ngcontent-%COMP%]{background:rgba(239,68,68,.1);border-color:#ef44444d;color:#f87171}.sidebar__btn--warning[_ngcontent-%COMP%]:hover:not([disabled]){background:#ef4444;color:#fff}.sidebar__btn--save[_ngcontent-%COMP%]{background:#10b981;color:#fff;flex-direction:row;grid-gap:10px;gap:10px;font-size:14px;font-weight:600;padding:14px;box-shadow:0 4px 12px #10b98140}.sidebar__btn--save[_ngcontent-%COMP%]:hover:not([disabled]){background:#059669;box-shadow:0 6px 18px #10b98166}.sidebar__btn--small[_ngcontent-%COMP%]{flex:0 0 calc(50% - 4px);padding:8px}.sidebar__picker[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:8px;gap:8px;padding:6px 8px;margin-bottom:6px;border-radius:6px;background:rgba(255,255,255,.05)}.sidebar__picker[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{font-size:11px;color:#fff9;min-width:60px}.sidebar__picker[_ngcontent-%COMP%]   input[type=color][_ngcontent-%COMP%]{width:24px;height:24px;border:2px solid rgba(255,255,255,.2);border-radius:4px;cursor:pointer;padding:0}.sidebar__picker[_ngcontent-%COMP%]   input[type=range][_ngcontent-%COMP%]{flex:1;max-width:50px}.sidebar__picker[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:11px;color:#ffffffb3;min-width:20px;text-align:right}.main-content[_ngcontent-%COMP%]{flex:1;display:flex;flex-direction:column;height:100%;min-height:0;overflow:hidden;background:#cbd5e1}.topbar-desktop[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;padding:8px 20px;background:#fff;border-bottom:1px solid #e2e8f0;box-shadow:0 2px 4px #00000005;min-height:56px}.topbar-desktop__tools[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:12px;gap:12px}.topbar-desktop__tool-btn[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:6px;gap:6px;padding:8px 14px;border:none;border-radius:8px;background:#fff;color:#475569;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s ease;box-shadow:0 2px 5px #00000014}.topbar-desktop__tool-btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:18px}.topbar-desktop__tool-btn[_ngcontent-%COMP%]:hover:not([disabled]){background:#f1f5f9;color:#1e293b;transform:translateY(-1px);box-shadow:0 4px 10px #0000001f}.topbar-desktop__tool-btn.active[_ngcontent-%COMP%]{background:#3b82f6;color:#fff}.topbar-desktop__tool-btn[disabled][_ngcontent-%COMP%]{opacity:.4;cursor:not-allowed}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:8px;gap:8px;background:#fff;padding:2px 8px;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 2px 5px #0000000d}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]   .size-controls[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:4px;gap:4px;padding-left:8px;border-left:1px solid #e2e8f0}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]   .size-controls[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{background:none;border:none;padding:4px;cursor:pointer;color:#64748b;display:flex;align-items:center}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]   .size-controls[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover:not([disabled]){color:#3b82f6}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]   .size-controls[_ngcontent-%COMP%]   button[disabled][_ngcontent-%COMP%]{opacity:.3}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]   .size-controls[_ngcontent-%COMP%]   .size-val[_ngcontent-%COMP%]{font-size:12px;font-weight:700;min-width:20px;text-align:center}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]   .size-controls[_ngcontent-%COMP%]   .format-btn[_ngcontent-%COMP%]{background:none;border:none;border-radius:4px;padding:4px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#64748b;transition:all .2s}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]   .size-controls[_ngcontent-%COMP%]   .format-btn[_ngcontent-%COMP%]:hover{background:#f1f5f9;color:#1e293b}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]   .size-controls[_ngcontent-%COMP%]   .format-btn.active[_ngcontent-%COMP%]{color:#3b82f6;background:#eff6ff}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]   .size-controls[_ngcontent-%COMP%]   .format-btn--text[_ngcontent-%COMP%]{font-family:serif;font-size:16px}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]   .size-controls[_ngcontent-%COMP%]   .format-btn--text[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:block;width:18px;text-align:center}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]   .size-controls[_ngcontent-%COMP%]   .format-btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:18px}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]   .size-controls[_ngcontent-%COMP%]   .color-palette[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:6px;gap:6px;margin-left:8px}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]   .size-controls[_ngcontent-%COMP%]   .color-palette[_ngcontent-%COMP%]   .color-dot[_ngcontent-%COMP%]{width:16px;height:16px;border-radius:50%;cursor:pointer;border:2px solid #e2e8f0;transition:transform .2s}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]   .size-controls[_ngcontent-%COMP%]   .color-palette[_ngcontent-%COMP%]   .color-dot[_ngcontent-%COMP%]:hover{transform:scale(1.2)}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]   .size-controls[_ngcontent-%COMP%]   .color-palette[_ngcontent-%COMP%]   .color-dot.active[_ngcontent-%COMP%]{border-color:#3b82f6;transform:scale(1.1)}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]   .size-controls[_ngcontent-%COMP%]   .color-palette[_ngcontent-%COMP%]   .color-dot.blue[_ngcontent-%COMP%]{background:#0000FF}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]   .size-controls[_ngcontent-%COMP%]   .color-palette[_ngcontent-%COMP%]   .color-dot.red[_ngcontent-%COMP%]{background:#FF0000}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]   .size-controls[_ngcontent-%COMP%]   .color-palette[_ngcontent-%COMP%]   .color-dot.black[_ngcontent-%COMP%]{background:#000000}.topbar-desktop[_ngcontent-%COMP%]   .tool-option[_ngcontent-%COMP%]   .size-controls[_ngcontent-%COMP%]   .color-palette[_ngcontent-%COMP%]   .color-dot.green[_ngcontent-%COMP%]{background:#008000}.topbar-desktop__divider[_ngcontent-%COMP%]{width:1px;height:24px;background:#e2e8f0;margin:0 4px}.topbar-desktop__divider--small[_ngcontent-%COMP%]{height:16px;opacity:.6}.topbar-desktop[_ngcontent-%COMP%]   .save-btn[_ngcontent-%COMP%]{background:#10b981;color:#fff;border:none;padding:8px 18px;border-radius:8px;font-weight:600;display:flex;align-items:center;grid-gap:8px;gap:8px;cursor:pointer;box-shadow:0 2px 4px #10b98133;margin-left:20px}.topbar-desktop[_ngcontent-%COMP%]   .save-btn[_ngcontent-%COMP%]:hover{background:#059669}.topbar-pager[_ngcontent-%COMP%], .topbar-zoom[_ngcontent-%COMP%]{display:flex;align-items:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:2px 6px;grid-gap:8px;gap:8px;height:38px}.topbar-pager__btn[_ngcontent-%COMP%], .topbar-zoom__btn[_ngcontent-%COMP%]{background:transparent;border:none;padding:6px;cursor:pointer;color:#64748b;display:flex;align-items:center;border-radius:4px;transition:all .2s}.topbar-pager__btn[_ngcontent-%COMP%]:hover:not([disabled]), .topbar-zoom__btn[_ngcontent-%COMP%]:hover:not([disabled]){background:#f1f5f9;color:#3b82f6}.topbar-pager__btn[disabled][_ngcontent-%COMP%], .topbar-zoom__btn[disabled][_ngcontent-%COMP%]{opacity:.3;cursor:not-allowed}.topbar-pager__btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%], .topbar-zoom__btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:16px}.topbar-pager__info[_ngcontent-%COMP%], .topbar-pager__val[_ngcontent-%COMP%], .topbar-zoom__info[_ngcontent-%COMP%], .topbar-zoom__val[_ngcontent-%COMP%]{font-size:13px;font-weight:700;color:#475569;min-width:45px;text-align:center;-webkit-user-select:none;user-select:none}.topbar-zoom[_ngcontent-%COMP%]   .fit-btn[_ngcontent-%COMP%]{font-size:11px;font-weight:700;text-transform:uppercase;color:#3b82f6;background:transparent;border:none;padding:4px 10px;cursor:pointer;letter-spacing:.5px}.topbar-zoom[_ngcontent-%COMP%]   .fit-btn[_ngcontent-%COMP%]:hover{color:#2563eb;text-decoration:underline}.viewer-container[_ngcontent-%COMP%]{flex:1;overflow:auto!important;position:relative;padding:40px 20px;background:#cbd5e1;scrollbar-width:thin;-webkit-overflow-scrolling:touch;touch-action:auto;text-align:center}.page-container[_ngcontent-%COMP%]{position:relative;display:inline-block;margin-bottom:30px;background:#fff;box-shadow:0 10px 30px #00000026;text-align:left}.page-container.single-page[_ngcontent-%COMP%]{margin-bottom:0}.pdf-canvas[_ngcontent-%COMP%]{display:block}.annot-canvas[_ngcontent-%COMP%]{position:absolute;top:0;left:0;z-index:10;touch-action:auto;pointer-events:none}.annot-canvas.tools-active[_ngcontent-%COMP%]{pointer-events:auto;touch-action:none!important;-webkit-touch-callout:none!important;-webkit-user-select:none!important;user-select:none!important}.text-box[_ngcontent-%COMP%]{position:absolute;pointer-events:auto;border-radius:2px;border:1px solid transparent;background:transparent;display:flex;flex-direction:column;z-index:20;min-width:30px;min-height:20px;box-sizing:border-box;cursor:move;padding:3px}.text-box[_ngcontent-%COMP%]:hover{border-color:#c0c4cb}.text-box.active[_ngcontent-%COMP%]{border:1px solid #c0c4cb;background:transparent}.text-box[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]{width:100%;height:100%;border:none;background:transparent;padding:0 3px;resize:none;outline:none;font-family:\"THSarabunNew\",sans-serif;font-size:inherit;font-weight:inherit;font-style:inherit;text-align:inherit;color:inherit;overflow:hidden;display:block;line-height:1.4;box-sizing:border-box;cursor:text}.text-box[_ngcontent-%COMP%]   .tb-handle[_ngcontent-%COMP%]{position:absolute;width:12px;height:12px;background:#1a73e8;border:2px solid #fff;border-radius:50%;top:50%;transform:translateY(-50%);cursor:ew-resize;z-index:27;display:none;box-shadow:0 1px 3px #00000040}.text-box[_ngcontent-%COMP%]   .tb-handle--left[_ngcontent-%COMP%]{left:-6px}.text-box[_ngcontent-%COMP%]   .tb-handle--right[_ngcontent-%COMP%]{right:-6px}.text-box.active[_ngcontent-%COMP%]   .tb-handle[_ngcontent-%COMP%]{display:block}.image-stamp[_ngcontent-%COMP%], .signature-stamp[_ngcontent-%COMP%]{position:absolute;pointer-events:auto;cursor:move;border:1px dashed transparent;z-index:20;touch-action:none}.image-stamp[_ngcontent-%COMP%]:hover, .signature-stamp[_ngcontent-%COMP%]:hover{border-color:#3b82f6}.image-stamp[_ngcontent-%COMP%]:hover   .remove-btn[_ngcontent-%COMP%], .signature-stamp[_ngcontent-%COMP%]:hover   .remove-btn[_ngcontent-%COMP%]{opacity:1}.image-stamp[_ngcontent-%COMP%]   img[_ngcontent-%COMP%], .signature-stamp[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block;-webkit-user-select:none;user-select:none;pointer-events:none}.image-stamp.mark-stamp-active[_ngcontent-%COMP%]{outline:2px solid #3b82f6;outline-offset:2px;border-color:#3b82f6}.image-stamp.mark-stamp-active[_ngcontent-%COMP%]   .resize-handle[_ngcontent-%COMP%]{opacity:1}.image-stamp.mark-stamp-active[_ngcontent-%COMP%]   .remove-btn[_ngcontent-%COMP%]{opacity:1}.image-stamp[_ngcontent-%COMP%]   .mark-options-bar[_ngcontent-%COMP%]{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translate(-50%);background:#1e293b;border:1px solid #334155;border-radius:8px;display:flex;align-items:center;grid-gap:1px;gap:1px;padding:3px 5px;z-index:50;white-space:nowrap;box-shadow:0 4px 14px #00000073;pointer-events:auto}.image-stamp[_ngcontent-%COMP%]   .mark-options-bar[_ngcontent-%COMP%]   .pff-opt-btn[_ngcontent-%COMP%]{width:24px;height:24px;border:none;background:transparent;color:#e2e8f0;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;padding:0;flex-shrink:0}.image-stamp[_ngcontent-%COMP%]   .mark-options-bar[_ngcontent-%COMP%]   .pff-opt-btn[_ngcontent-%COMP%]:hover{background:rgba(255,255,255,.1)}.image-stamp[_ngcontent-%COMP%]   .mark-options-bar[_ngcontent-%COMP%]   .pff-opt-btn.pff-opt-delete[_ngcontent-%COMP%]{color:#f87171}.image-stamp[_ngcontent-%COMP%]   .mark-options-bar[_ngcontent-%COMP%]   .pff-opt-btn.pff-opt-delete[_ngcontent-%COMP%]:hover{background:rgba(239,68,68,.2)}.image-stamp[_ngcontent-%COMP%]   .mark-options-bar[_ngcontent-%COMP%]   .pff-opt-btn[disabled][_ngcontent-%COMP%]{opacity:.3;cursor:not-allowed;pointer-events:none}.image-stamp[_ngcontent-%COMP%]   .mark-options-bar[_ngcontent-%COMP%]   .pff-opt-val[_ngcontent-%COMP%]{font-size:11px;color:#e2e8f0;min-width:22px;text-align:center;font-weight:600;line-height:1}.image-stamp[_ngcontent-%COMP%]   .mark-options-bar[_ngcontent-%COMP%]   .pff-opt-label[_ngcontent-%COMP%]{font-size:11px;color:#94a3b8;margin:0 2px;display:flex;align-items:center}.image-stamp[_ngcontent-%COMP%]   .mark-options-bar[_ngcontent-%COMP%]   .pff-opt-label[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:13px}.image-stamp[_ngcontent-%COMP%]   .mark-options-bar[_ngcontent-%COMP%]   .pff-opt-sep[_ngcontent-%COMP%]{width:1px;height:16px;background:#334155;margin:0 3px;flex-shrink:0}.shape-stamp[_ngcontent-%COMP%]{position:absolute;pointer-events:auto;cursor:move;border:1px dashed transparent;z-index:20;touch-action:none;overflow:visible}.shape-stamp[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{display:block;width:100%;height:100%;overflow:visible;pointer-events:none;-webkit-user-select:none;user-select:none}.shape-stamp[_ngcontent-%COMP%]:hover{border-color:#3b82f699}.shape-stamp[_ngcontent-%COMP%]:hover   .remove-btn[_ngcontent-%COMP%]{opacity:1}.shape-stamp[_ngcontent-%COMP%]:hover   .resize-handle[_ngcontent-%COMP%]{opacity:1}.signature-stamp[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{mix-blend-mode:multiply}.signature-stamp[_ngcontent-%COMP%]   .digital-id-label[_ngcontent-%COMP%]{position:absolute;left:100%;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;grid-gap:0;gap:0;pointer-events:none;white-space:nowrap;margin-left:6px}.signature-stamp[_ngcontent-%COMP%]   .digital-id-label[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:8px;color:#555;font-family:\"Courier New\",monospace;letter-spacing:.3px;line-height:1.4}.signature-stamp[_ngcontent-%COMP%]   .remove-btn[_ngcontent-%COMP%]{position:absolute;top:-10px;left:-10px;width:20px;height:20px;background:#ef4444;color:#fff;border:none;border-radius:50%;font-size:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity .2s;z-index:26}.pdf-form-field[_ngcontent-%COMP%]{position:absolute;pointer-events:auto;cursor:move;box-sizing:border-box;touch-action:none;z-index:20}.pdf-form-field.pff-mark[_ngcontent-%COMP%]{border:1.5px solid #3b82f6;border-radius:3px;background:transparent;min-width:10px;min-height:10px}.pdf-form-field.pff-text[_ngcontent-%COMP%]{border:1.5px solid #3b82f6;border-radius:3px;background:rgba(219,234,254,.25);min-width:40px;min-height:14px}.pdf-form-field.pff-checkbox[_ngcontent-%COMP%]{border:1.5px solid #3b82f6;border-radius:3px;background:rgba(219,234,254,.2);min-width:14px;min-height:14px}.pdf-form-field.pff-radio[_ngcontent-%COMP%]{border:1.5px solid #3b82f6;border-radius:50%;background:rgba(219,234,254,.2);min-width:14px;min-height:14px}.pdf-form-field[_ngcontent-%COMP%]:hover{border-color:#1d4ed8}.pdf-form-field[_ngcontent-%COMP%]:hover   .remove-btn[_ngcontent-%COMP%]{opacity:1}.pdf-form-field[_ngcontent-%COMP%]   .pff-inner[_ngcontent-%COMP%]{width:100%;height:100%;display:flex;align-items:center;justify-content:center;pointer-events:none}.pdf-form-field[_ngcontent-%COMP%]   .pff-text-hint[_ngcontent-%COMP%]{font-size:10px;color:#3b82f6;font-weight:600;opacity:.8;-webkit-user-select:none;user-select:none}.pdf-form-field[_ngcontent-%COMP%]   .remove-btn[_ngcontent-%COMP%]{position:absolute;top:-8px;right:-8px;width:16px;height:16px;background:#ef4444;color:#fff;border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;opacity:0;transition:opacity .15s;z-index:30;pointer-events:auto}.pdf-form-field[_ngcontent-%COMP%]   .resize-handle[_ngcontent-%COMP%]{opacity:0}.pdf-form-field[_ngcontent-%COMP%]:hover   .resize-handle[_ngcontent-%COMP%]{opacity:1}.pdf-form-field.pff-no-border[_ngcontent-%COMP%]{border-color:transparent!important;background:rgba(219,234,254,.08)}.pdf-form-field.pff-active[_ngcontent-%COMP%]{outline:2px solid #3b82f6;outline-offset:1px}.pdf-form-field.pff-active[_ngcontent-%COMP%]   .pff-resize-handle[_ngcontent-%COMP%]{opacity:1}.pdf-form-field[_ngcontent-%COMP%]:hover   .pff-resize-handle[_ngcontent-%COMP%]{opacity:1}.pdf-form-field[_ngcontent-%COMP%]   .pff-resize-handle[_ngcontent-%COMP%]{position:absolute;width:8px;height:8px;background:#3b82f6;border:1.5px solid #fff;border-radius:50%;z-index:25;touch-action:none;opacity:0;transition:opacity .15s}.pdf-form-field[_ngcontent-%COMP%]   .pff-resize-handle.rh-nw[_ngcontent-%COMP%]{top:-4px;left:-4px;cursor:nw-resize}.pdf-form-field[_ngcontent-%COMP%]   .pff-resize-handle.rh-n[_ngcontent-%COMP%]{top:-4px;left:calc(50% - 4px);cursor:n-resize}.pdf-form-field[_ngcontent-%COMP%]   .pff-resize-handle.rh-ne[_ngcontent-%COMP%]{top:-4px;right:-4px;cursor:ne-resize}.pdf-form-field[_ngcontent-%COMP%]   .pff-resize-handle.rh-e[_ngcontent-%COMP%]{top:calc(50% - 4px);right:-4px;cursor:e-resize}.pdf-form-field[_ngcontent-%COMP%]   .pff-resize-handle.rh-se[_ngcontent-%COMP%]{bottom:-4px;right:-4px;cursor:se-resize}.pdf-form-field[_ngcontent-%COMP%]   .pff-resize-handle.rh-s[_ngcontent-%COMP%]{bottom:-4px;left:calc(50% - 4px);cursor:s-resize}.pdf-form-field[_ngcontent-%COMP%]   .pff-resize-handle.rh-sw[_ngcontent-%COMP%]{bottom:-4px;left:-4px;cursor:sw-resize}.pdf-form-field[_ngcontent-%COMP%]   .pff-resize-handle.rh-w[_ngcontent-%COMP%]{top:calc(50% - 4px);left:-4px;cursor:w-resize}.pdf-form-field[_ngcontent-%COMP%]   .pff-options-bar[_ngcontent-%COMP%]{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translate(-50%);background:#1e293b;border:1px solid #334155;border-radius:8px;display:flex;align-items:center;grid-gap:1px;gap:1px;padding:3px 5px;z-index:50;white-space:nowrap;box-shadow:0 4px 14px #00000073;pointer-events:auto}.pdf-form-field[_ngcontent-%COMP%]   .pff-options-bar[_ngcontent-%COMP%]   .pff-opt-btn[_ngcontent-%COMP%]{width:24px;height:24px;border:none;background:transparent;color:#e2e8f0;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;padding:0;flex-shrink:0}.pdf-form-field[_ngcontent-%COMP%]   .pff-options-bar[_ngcontent-%COMP%]   .pff-opt-btn[_ngcontent-%COMP%]:hover{background:rgba(255,255,255,.1)}.pdf-form-field[_ngcontent-%COMP%]   .pff-options-bar[_ngcontent-%COMP%]   .pff-opt-btn.pff-opt-active[_ngcontent-%COMP%]{background:rgba(59,130,246,.3);color:#60a5fa}.pdf-form-field[_ngcontent-%COMP%]   .pff-options-bar[_ngcontent-%COMP%]   .pff-opt-btn.pff-opt-delete[_ngcontent-%COMP%]{color:#f87171}.pdf-form-field[_ngcontent-%COMP%]   .pff-options-bar[_ngcontent-%COMP%]   .pff-opt-btn.pff-opt-delete[_ngcontent-%COMP%]:hover{background:rgba(239,68,68,.2)}.pdf-form-field[_ngcontent-%COMP%]   .pff-options-bar[_ngcontent-%COMP%]   .pff-opt-btn[disabled][_ngcontent-%COMP%]{opacity:.3;cursor:not-allowed;pointer-events:none}.pdf-form-field[_ngcontent-%COMP%]   .pff-options-bar[_ngcontent-%COMP%]   .pff-opt-val[_ngcontent-%COMP%]{font-size:11px;color:#e2e8f0;min-width:22px;text-align:center;font-weight:600;line-height:1}.pdf-form-field[_ngcontent-%COMP%]   .pff-options-bar[_ngcontent-%COMP%]   .pff-opt-label[_ngcontent-%COMP%]{font-size:11px;color:#94a3b8;margin:0 2px;font-style:italic;font-weight:700;display:flex;align-items:center}.pdf-form-field[_ngcontent-%COMP%]   .pff-options-bar[_ngcontent-%COMP%]   .pff-opt-label[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:13px}.pdf-form-field[_ngcontent-%COMP%]   .pff-options-bar[_ngcontent-%COMP%]   .pff-opt-sep[_ngcontent-%COMP%]{width:1px;height:16px;background:#334155;margin:0 3px;flex-shrink:0}.date-stamp[_ngcontent-%COMP%]{position:absolute;pointer-events:auto;cursor:move;padding:4px 8px;background:rgba(255,255,255,.8);border:1px dashed #ccc;border-radius:4px;white-space:nowrap;font-family:\"THSarabunNew\",sans-serif;z-index:20;touch-action:none}.date-stamp[_ngcontent-%COMP%]:hover{border-color:#3b82f6}.date-stamp[_ngcontent-%COMP%]:hover   .remove-btn[_ngcontent-%COMP%]{opacity:1}.date-stamp[_ngcontent-%COMP%]   .remove-btn[_ngcontent-%COMP%]{position:absolute;top:-8px;right:-8px;width:16px;height:16px;background:#ef4444;color:#fff;border:none;border-radius:50%;font-size:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity .2s}.resize-handle[_ngcontent-%COMP%]{position:absolute;width:10px;height:10px;background:#3b82f6;border:1px solid #fff;border-radius:50%;z-index:22;touch-action:none;display:none}.resize-handle.rh-nw[_ngcontent-%COMP%]{top:-5px;left:-5px;cursor:nw-resize}.resize-handle.rh-n[_ngcontent-%COMP%]{top:-5px;left:calc(50% - 5px);cursor:n-resize}.resize-handle.rh-ne[_ngcontent-%COMP%]{top:-5px;right:-5px;cursor:ne-resize}.resize-handle.rh-e[_ngcontent-%COMP%]{top:calc(50% - 5px);right:-5px;cursor:e-resize}.resize-handle.rh-se[_ngcontent-%COMP%]{bottom:-5px;right:-5px;cursor:se-resize}.resize-handle.rh-s[_ngcontent-%COMP%]{bottom:-5px;left:calc(50% - 5px);cursor:s-resize}.resize-handle.rh-sw[_ngcontent-%COMP%]{bottom:-5px;left:-5px;cursor:sw-resize}.resize-handle.rh-w[_ngcontent-%COMP%]{top:calc(50% - 5px);left:-5px;cursor:w-resize}.image-stamp[_ngcontent-%COMP%]:hover   .resize-handle[_ngcontent-%COMP%], .signature-stamp[_ngcontent-%COMP%]:hover   .resize-handle[_ngcontent-%COMP%], .shape-stamp[_ngcontent-%COMP%]:hover   .resize-handle[_ngcontent-%COMP%]{display:block}@media (max-width: 991px){.topbar-desktop__tools[_ngcontent-%COMP%]{display:none}}@media (max-width: 767px){.annotator-layout[_ngcontent-%COMP%]{flex-direction:column}.sidebar[_ngcontent-%COMP%]{width:100%;height:auto;max-height:140px;min-width:0;order:2;flex-direction:row;flex-wrap:wrap;overflow-x:auto;overflow-y:auto;padding:8px 12px;grid-gap:8px;gap:8px;scrollbar-width:none;-ms-overflow-style:none;justify-content:center;align-items:flex-start}.sidebar[_ngcontent-%COMP%]::-webkit-scrollbar{display:none}.sidebar__section[_ngcontent-%COMP%]{margin-bottom:0;flex-shrink:0;display:flex;flex-direction:row;justify-content:center;align-items:center}.sidebar__section--nav[_ngcontent-%COMP%], .sidebar__section--save[_ngcontent-%COMP%], .sidebar__section[_ngcontent-%COMP%]   .sidebar__title[_ngcontent-%COMP%]{display:none}.sidebar__row[_ngcontent-%COMP%]{margin-bottom:0;grid-gap:6px;gap:6px;display:flex;flex-wrap:wrap;justify-content:center}.sidebar__btn[_ngcontent-%COMP%]{width:48px;height:48px;flex:none;font-size:9px;padding:4px}.sidebar__btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:20px}.sidebar__btn[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:none}.topbar-desktop[_ngcontent-%COMP%]{display:flex;padding:8px 12px}.topbar-desktop[_ngcontent-%COMP%]   .save-btn[_ngcontent-%COMP%], .topbar-desktop[_ngcontent-%COMP%]   .doc-title[_ngcontent-%COMP%]{display:none}.topbar-desktop[_ngcontent-%COMP%]   .topbar-desktop__left[_ngcontent-%COMP%]{display:none}.topbar-desktop[_ngcontent-%COMP%]   .topbar-desktop__center[_ngcontent-%COMP%]{margin:0 auto}.viewer[_ngcontent-%COMP%]{padding:10px}}.mobile-pager[_ngcontent-%COMP%]{display:none}@media (max-width: 767px){.mobile-pager[_ngcontent-%COMP%]{display:flex;position:absolute;top:60px;right:16px;z-index:10;background:rgba(0,0,0,.6);color:#fff;padding:4px 12px;border-radius:20px;font-size:12px;backdrop-filter:blur(4px)}}.loading-overlay[_ngcontent-%COMP%]{position:fixed;inset:0;z-index:20003;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);backdrop-filter:blur(4px)}.loading-overlay[_ngcontent-%COMP%]   .loading-content[_ngcontent-%COMP%]{background:#fff;padding:32px 48px;border-radius:16px;text-align:center}.loading-overlay[_ngcontent-%COMP%]   .loading-content[_ngcontent-%COMP%]   ion-spinner[_ngcontent-%COMP%]{--color: #3b82f6;width:48px;height:48px}.loading-overlay[_ngcontent-%COMP%]   .loading-content[_ngcontent-%COMP%]   .loading-msg[_ngcontent-%COMP%]{margin-top:16px;font-size:14px;color:#334155}.loading-overlay[_ngcontent-%COMP%]   .loading-content--progress[_ngcontent-%COMP%]{min-width:300px;padding:28px 32px}.loading-overlay[_ngcontent-%COMP%]   .loading-content--progress[_ngcontent-%COMP%]   .save-progress-icon[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;grid-gap:10px;gap:10px;margin-bottom:16px}.loading-overlay[_ngcontent-%COMP%]   .loading-content--progress[_ngcontent-%COMP%]   .save-progress-icon[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:36px;color:#3b82f6}.loading-overlay[_ngcontent-%COMP%]   .loading-content--progress[_ngcontent-%COMP%]   .save-progress-icon[_ngcontent-%COMP%]   .save-progress-pct[_ngcontent-%COMP%]{font-size:32px;font-weight:800;color:#1e293b;letter-spacing:-1px;line-height:1;min-width:64px;text-align:left}.loading-overlay[_ngcontent-%COMP%]   .loading-content--progress[_ngcontent-%COMP%]   .save-progress-bar-track[_ngcontent-%COMP%]{width:100%;height:10px;background:#e2e8f0;border-radius:99px;overflow:hidden;margin-bottom:14px}.loading-overlay[_ngcontent-%COMP%]   .loading-content--progress[_ngcontent-%COMP%]   .save-progress-bar-track[_ngcontent-%COMP%]   .save-progress-bar-fill[_ngcontent-%COMP%]{height:100%;background:linear-gradient(90deg,#3b82f6 0%,#06b6d4 100%);border-radius:99px;transition:width .3s ease,background .5s ease}.loading-overlay[_ngcontent-%COMP%]   .loading-content--progress[_ngcontent-%COMP%]   .save-progress-bar-track[_ngcontent-%COMP%]   .save-progress-bar-fill--preview[_ngcontent-%COMP%]{background:linear-gradient(90deg,#06b6d4 0%,#22c55e 100%)}.loading-overlay[_ngcontent-%COMP%]   .loading-content--progress[_ngcontent-%COMP%]   .save-progress-bar-track[_ngcontent-%COMP%]   .save-progress-bar-fill--serializing[_ngcontent-%COMP%]{background:linear-gradient(90deg,#3b82f6 0%,#8b5cf6 50%,#3b82f6 100%);background-size:200% 100%;animation:shimmerBar 1.5s linear infinite}.loading-overlay[_ngcontent-%COMP%]   .loading-content--progress[_ngcontent-%COMP%]   .save-progress-phases[_ngcontent-%COMP%]{display:flex;justify-content:space-between;grid-gap:8px;gap:8px;margin-bottom:12px}.loading-overlay[_ngcontent-%COMP%]   .loading-content--progress[_ngcontent-%COMP%]   .save-progress-phases[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:4px;gap:4px;font-size:11.5px;color:#94a3b8;transition:color .3s}.loading-overlay[_ngcontent-%COMP%]   .loading-content--progress[_ngcontent-%COMP%]   .save-progress-phases[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:13px}.loading-overlay[_ngcontent-%COMP%]   .loading-content--progress[_ngcontent-%COMP%]   .save-progress-phases[_ngcontent-%COMP%]   span.active[_ngcontent-%COMP%]{color:#3b82f6;font-weight:600}.loading-overlay[_ngcontent-%COMP%]   .loading-content--progress[_ngcontent-%COMP%]   .loading-msg[_ngcontent-%COMP%]{font-size:13px;color:#64748b;margin-top:4px}.signature-modal[_ngcontent-%COMP%], .signature-picker-modal[_ngcontent-%COMP%]{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center}.signature-modal__backdrop[_ngcontent-%COMP%], .signature-picker-modal__backdrop[_ngcontent-%COMP%]{position:absolute;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px)}.signature-modal__content[_ngcontent-%COMP%], .signature-picker-modal__content[_ngcontent-%COMP%]{position:relative;background:#fff;padding:28px 36px;border-radius:20px;box-shadow:0 24px 60px #00000040;text-align:center;width:95%;max-width:500px}@media (max-width: 500px){.signature-modal__content[_ngcontent-%COMP%], .signature-picker-modal__content[_ngcontent-%COMP%]{padding:20px}}.signature-modal__content[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], .signature-picker-modal__content[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:0 0 8px;font-size:22px;font-weight:600;color:#1e293b}.signature-modal__hint[_ngcontent-%COMP%], .signature-picker-modal__hint[_ngcontent-%COMP%]{margin:0 0 20px;font-size:14px;color:#64748b}.signature-modal__canvas[_ngcontent-%COMP%], .signature-picker-modal__canvas[_ngcontent-%COMP%]{display:block;width:100%;height:auto;aspect-ratio:2/1;border:2px solid #e2e8f0;border-radius:12px;background:#fff;cursor:crosshair;touch-action:none}.signature-modal__actions[_ngcontent-%COMP%], .signature-picker-modal__actions[_ngcontent-%COMP%]{display:flex;grid-gap:12px;gap:12px;justify-content:center;margin-top:24px;flex-wrap:wrap}.signature-modal__pen-options[_ngcontent-%COMP%], .signature-picker-modal__pen-options[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;grid-gap:20px;gap:20px;margin-bottom:16px;padding:8px 16px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0}.signature-modal__pen-options[_ngcontent-%COMP%]   .pen-option-group[_ngcontent-%COMP%], .signature-picker-modal__pen-options[_ngcontent-%COMP%]   .pen-option-group[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:8px;gap:8px}.signature-modal__pen-options[_ngcontent-%COMP%]   .pen-option-label[_ngcontent-%COMP%], .signature-picker-modal__pen-options[_ngcontent-%COMP%]   .pen-option-label[_ngcontent-%COMP%]{font-size:13px;color:#64748b;font-weight:500}.signature-modal__pen-options[_ngcontent-%COMP%]   .pen-size-btn[_ngcontent-%COMP%], .signature-picker-modal__pen-options[_ngcontent-%COMP%]   .pen-size-btn[_ngcontent-%COMP%]{width:28px;height:28px;border:1px solid #e2e8f0;background:#fff;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}.signature-modal__pen-options[_ngcontent-%COMP%]   .pen-size-btn[_ngcontent-%COMP%]:hover:not(:disabled), .signature-picker-modal__pen-options[_ngcontent-%COMP%]   .pen-size-btn[_ngcontent-%COMP%]:hover:not(:disabled){background:#e2e8f0}.signature-modal__pen-options[_ngcontent-%COMP%]   .pen-size-btn[_ngcontent-%COMP%]:disabled, .signature-picker-modal__pen-options[_ngcontent-%COMP%]   .pen-size-btn[_ngcontent-%COMP%]:disabled{opacity:.4;cursor:not-allowed}.signature-modal__pen-options[_ngcontent-%COMP%]   .pen-size-btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%], .signature-picker-modal__pen-options[_ngcontent-%COMP%]   .pen-size-btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:14px}.signature-modal__pen-options[_ngcontent-%COMP%]   .pen-size-val[_ngcontent-%COMP%], .signature-picker-modal__pen-options[_ngcontent-%COMP%]   .pen-size-val[_ngcontent-%COMP%]{font-size:13px;font-weight:600;min-width:28px;text-align:center;color:#334155}.signature-picker-modal__list[_ngcontent-%COMP%]{flex:1;overflow-y:auto;max-height:40vh;padding:4px 0;margin:16px 0}.signature-item[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:14px;gap:14px;padding:12px 14px;margin-bottom:8px;border:2px solid #e2e8f0;border-radius:12px;cursor:pointer;transition:all .15s}.signature-item[_ngcontent-%COMP%]:hover{border-color:#3b82f6;background:#f8fafc;transform:translate(4px)}.signature-item[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100px;height:50px;object-fit:contain;background:#fff;border-radius:6px;border:1px solid #e2e8f0}.signature-item__info[_ngcontent-%COMP%]{flex:1;display:flex;flex-direction:column;grid-gap:4px;gap:4px;text-align:left}.signature-item__name[_ngcontent-%COMP%]{font-size:14px;font-weight:500;color:#1e293b}.signature-item__badge[_ngcontent-%COMP%]{display:inline-block;padding:2px 8px;font-size:11px;font-weight:600;color:#3b82f6;background:#eff6ff;border-radius:10px;width:-moz-fit-content;width:fit-content}.signature-item__actions[_ngcontent-%COMP%]{display:flex;grid-gap:6px;gap:6px}.signature-item__btn[_ngcontent-%COMP%]{width:32px;height:32px;border:none;border-radius:8px;background:#f1f5f9;color:#64748b;display:flex;align-items:center;justify-content:center}.signature-item__btn[_ngcontent-%COMP%]:hover{background:#e2e8f0;color:#334155}.signature-item__btn.active[_ngcontent-%COMP%]{background:#fef3c7;color:#f59e0b}.signature-item__btn--delete[_ngcontent-%COMP%]:hover{background:#fee2e2;color:#ef4444}.hint[_ngcontent-%COMP%]{background:#f8fafc;padding:10px 20px;font-size:11px;color:#64748b;border-top:1px solid #e2e8f0}.preview-overlay[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100%;height:100dvh;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);z-index:20001;display:flex;flex-direction:column;overflow:hidden;animation:fadeIn .3s ease-out}.preview-overlay[_ngcontent-%COMP%]   .preview-header[_ngcontent-%COMP%]{flex-shrink:0;position:relative;background:#fff;padding:14px 24px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 12px #0000001f;z-index:20002}.preview-overlay[_ngcontent-%COMP%]   .preview-header[_ngcontent-%COMP%]   .preview-title[_ngcontent-%COMP%]{font-size:1.1rem;font-weight:700;color:#1f2937;display:flex;align-items:center;grid-gap:8px;gap:8px}.preview-overlay[_ngcontent-%COMP%]   .preview-header[_ngcontent-%COMP%]   .preview-title[_ngcontent-%COMP%]:before{content:\"\";display:inline-block;width:4px;height:20px;background:linear-gradient(180deg,#22c55e,#16a34a);border-radius:2px}.preview-overlay[_ngcontent-%COMP%]   .preview-header[_ngcontent-%COMP%]   .preview-actions[_ngcontent-%COMP%]{display:flex;grid-gap:10px;gap:10px;align-items:center}.preview-overlay[_ngcontent-%COMP%]   .preview-header[_ngcontent-%COMP%]   .preview-actions[_ngcontent-%COMP%]   ion-button[fill=clear][_ngcontent-%COMP%]{--color: #64748b;font-weight:500;font-size:14px}.preview-overlay[_ngcontent-%COMP%]   .preview-header[_ngcontent-%COMP%]   .preview-actions[_ngcontent-%COMP%]   ion-button[color=success][_ngcontent-%COMP%]{--background: linear-gradient(135deg, #22c55e 0%, #15803d 100%);--background-activated: #15803d;--background-hover: #16a34a;--color: #fff;--border-radius: 10px;--padding-start: 22px;--padding-end: 22px;--padding-top: 12px;--padding-bottom: 12px;--box-shadow: 0 4px 16px rgba(34, 197, 94, .45);font-weight:700;font-size:15px;letter-spacing:.3px;animation:confirmPulse 2.4s ease-in-out infinite}.preview-overlay[_ngcontent-%COMP%]   .preview-scroll-area[_ngcontent-%COMP%]{flex:1;overflow-y:auto;overflow-x:hidden}.preview-overlay[_ngcontent-%COMP%]   .preview-body[_ngcontent-%COMP%]{min-height:100%;padding:20px;display:flex;flex-direction:column;align-items:center}.preview-overlay[_ngcontent-%COMP%]   .preview-body[_ngcontent-%COMP%]   .preview-filter-bar[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:8px;gap:8px;background:rgba(255,193,7,.15);border:1px solid rgba(255,193,7,.4);border-radius:8px;padding:8px 14px;margin-bottom:12px;width:100%;max-width:1100px;color:#ffe082;font-size:13px}.preview-overlay[_ngcontent-%COMP%]   .preview-body[_ngcontent-%COMP%]   .preview-filter-bar[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:18px;flex-shrink:0}.preview-overlay[_ngcontent-%COMP%]   .preview-body[_ngcontent-%COMP%]   .preview-filter-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{flex:1}.preview-overlay[_ngcontent-%COMP%]   .preview-body[_ngcontent-%COMP%]   .preview-filter-bar[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%]{--color: #ffe082;--border-color: rgba(255, 193, 7, .5);border:1px solid rgba(255,193,7,.5);border-radius:6px;flex-shrink:0}.preview-overlay[_ngcontent-%COMP%]   .preview-body[_ngcontent-%COMP%]   iframe[_ngcontent-%COMP%]{width:100%;height:100%;max-width:1100px;background:white;border-radius:8px;box-shadow:0 10px 25px #0000004d}.preview-overlay[_ngcontent-%COMP%]   .preview-body[_ngcontent-%COMP%]   .preview-pages[_ngcontent-%COMP%]{display:flex;flex-direction:column;grid-gap:16px;gap:16px;max-width:1100px;width:100%}.preview-overlay[_ngcontent-%COMP%]   .preview-body[_ngcontent-%COMP%]   .preview-page-img[_ngcontent-%COMP%]{width:100%;background:white;border-radius:8px;box-shadow:0 4px 12px #00000026}.preview-overlay[_ngcontent-%COMP%]   .preview-body[_ngcontent-%COMP%]   .preview-loading[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;grid-gap:16px;gap:16px}.preview-overlay[_ngcontent-%COMP%]   .preview-body[_ngcontent-%COMP%]   .preview-loading[_ngcontent-%COMP%]   ion-spinner[_ngcontent-%COMP%]{--color: white;width:48px;height:48px}.preview-overlay[_ngcontent-%COMP%]   .preview-body[_ngcontent-%COMP%]   .preview-loading[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:16px;margin:0}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes shimmerBar{0%{background-position:200% 0}to{background-position:-200% 0}}@keyframes confirmPulse{0%,to{box-shadow:0 4px 16px #22c55e73}50%{box-shadow:0 4px 24px #22c55ebf,0 0 0 4px #22c55e26}}  .textLayer{position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;opacity:1;line-height:1;z-index:5;--scale-factor: 1}  .textLayer>span,   .textLayer>br{color:transparent!important;position:absolute;white-space:pre;cursor:text;transform-origin:0% 0%}  .textLayer ::selection{background:rgba(59,130,246,.3);color:transparent!important}.annot-history-drawer[_ngcontent-%COMP%], .user-guide-drawer[_ngcontent-%COMP%]{position:absolute;top:0;right:0;bottom:0;left:0;z-index:999;pointer-events:none}.annot-history-drawer.open[_ngcontent-%COMP%], .user-guide-drawer.open[_ngcontent-%COMP%]{pointer-events:auto}.annot-history-drawer__backdrop[_ngcontent-%COMP%], .user-guide-drawer__backdrop[_ngcontent-%COMP%]{position:absolute;inset:0;background:rgba(0,0,0,0);transition:background .3s}.annot-history-drawer.open[_ngcontent-%COMP%]   .annot-history-drawer__backdrop[_ngcontent-%COMP%], .user-guide-drawer.open[_ngcontent-%COMP%]   .annot-history-drawer__backdrop[_ngcontent-%COMP%], .annot-history-drawer.open[_ngcontent-%COMP%]   .user-guide-drawer__backdrop[_ngcontent-%COMP%], .user-guide-drawer.open[_ngcontent-%COMP%]   .user-guide-drawer__backdrop[_ngcontent-%COMP%]{background:rgba(0,0,0,.45)}.annot-history-drawer__panel[_ngcontent-%COMP%], .user-guide-drawer__panel[_ngcontent-%COMP%]{position:absolute;top:0;right:0;bottom:0;width:min(340px,92vw);background:#1e293b;border-left:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;transform:translate(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);box-shadow:-6px 0 28px #00000059}.annot-history-drawer.open[_ngcontent-%COMP%]   .annot-history-drawer__panel[_ngcontent-%COMP%], .user-guide-drawer.open[_ngcontent-%COMP%]   .annot-history-drawer__panel[_ngcontent-%COMP%], .annot-history-drawer.open[_ngcontent-%COMP%]   .user-guide-drawer__panel[_ngcontent-%COMP%], .user-guide-drawer.open[_ngcontent-%COMP%]   .user-guide-drawer__panel[_ngcontent-%COMP%]{transform:translate(0)}.annot-history-drawer__header[_ngcontent-%COMP%], .user-guide-drawer__header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 12px;border-bottom:1px solid rgba(255,255,255,.07);font-size:14px;font-weight:700;color:#e8eaf6}.annot-history-drawer__header[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%], .user-guide-drawer__header[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{margin-right:6px;color:#6c8ef5;vertical-align:-2px}.annot-history-drawer__header[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], .user-guide-drawer__header[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{background:none;border:none;color:#8892b0;cursor:pointer;font-size:20px;display:flex;align-items:center}.annot-history-drawer__header[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover, .user-guide-drawer__header[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{color:#e8eaf6}.annot-history-drawer__loading[_ngcontent-%COMP%], .user-guide-drawer__loading[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;padding:40px;color:#8892b0}.annot-history-drawer__loading[_ngcontent-%COMP%]   ion-spinner[_ngcontent-%COMP%], .user-guide-drawer__loading[_ngcontent-%COMP%]   ion-spinner[_ngcontent-%COMP%]{--color: #6c8ef5}.annot-history-list[_ngcontent-%COMP%]{flex:1;overflow-y:auto;padding:6px 0;scrollbar-width:thin;scrollbar-color:#334155 #1e293b}.annot-history-list[_ngcontent-%COMP%]::-webkit-scrollbar{width:5px}.annot-history-list[_ngcontent-%COMP%]::-webkit-scrollbar-track{background:#1e293b}.annot-history-list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}.annot-history-entry[_ngcontent-%COMP%]{display:flex;align-items:flex-start;grid-gap:11px;gap:11px;padding:9px 14px;border-bottom:1px solid rgba(255,255,255,.04);transition:background .12s}.annot-history-entry[_ngcontent-%COMP%]:last-child{border-bottom:none}.annot-history-entry[_ngcontent-%COMP%]:hover{background:rgba(255,255,255,.03)}.annot-history-entry__icon[_ngcontent-%COMP%]{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px;background:rgba(108,142,245,.15);color:#6c8ef5}.annot-history-entry__icon.hi-sign[_ngcontent-%COMP%]{background:rgba(74,222,128,.15);color:#4ade80}.annot-history-entry__icon.hi-save[_ngcontent-%COMP%]{background:rgba(251,191,36,.15);color:#fbbf24}.annot-history-entry__icon.hi-page_delete[_ngcontent-%COMP%]{background:rgba(255,77,109,.15);color:#ff4d6d}.annot-history-entry__icon.hi-page_insert[_ngcontent-%COMP%]{background:rgba(94,234,212,.15);color:#5eead4}.annot-history-entry__icon.hi-upload[_ngcontent-%COMP%]{background:rgba(167,139,250,.15);color:#a78bfa}.annot-history-entry__icon.hi-draw[_ngcontent-%COMP%]{background:rgba(251,113,133,.15);color:#fb7185}.annot-history-entry__icon.hi-highlight[_ngcontent-%COMP%]{background:rgba(251,191,36,.15);color:#fbbf24}.annot-history-entry__icon.hi-text[_ngcontent-%COMP%]{background:rgba(147,197,253,.15);color:#93c5fd}.annot-history-entry__body[_ngcontent-%COMP%]{flex:1;min-width:0}.annot-history-entry__title[_ngcontent-%COMP%]{font-size:13px;font-weight:600;color:#e8eaf6;display:flex;align-items:center;grid-gap:6px;gap:6px}.annot-history-entry__page[_ngcontent-%COMP%]{font-size:11px;background:rgba(108,142,245,.15);color:#6c8ef5;padding:1px 6px;border-radius:10px;font-weight:400}.annot-history-entry__user[_ngcontent-%COMP%]{font-size:12px;color:#8892b0;margin-top:2px}.annot-history-entry__time[_ngcontent-%COMP%]{font-size:11px;color:#8892b08c;margin-top:1px}.annot-history-empty[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;padding:56px 24px;color:#8892b0;grid-gap:10px;gap:10px}.annot-history-empty[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:36px;opacity:.4}.annot-history-empty[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:13px;margin:0}.custom-context-backdrop[_ngcontent-%COMP%]{position:fixed;inset:0;z-index:99998;cursor:pointer;touch-action:none}.custom-context-menu[_ngcontent-%COMP%]{position:fixed;z-index:99999;background:rgba(255,255,255,.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(0,0,0,.1);border-radius:8px;box-shadow:0 4px 16px #00000026;padding:4px;min-width:220px;display:flex;flex-direction:column}.custom-context-menu[_ngcontent-%COMP%]   .menu-btn[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:8px;gap:8px;width:100%;padding:8px 12px;border:none;background:transparent;cursor:pointer;font-size:13px;color:#334155;border-radius:4px;text-align:left;transition:background .1s}.custom-context-menu[_ngcontent-%COMP%]   .menu-btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:16px;color:#64748b}.custom-context-menu[_ngcontent-%COMP%]   .menu-btn[_ngcontent-%COMP%]:hover{background:#3b82f6;color:#fff}.custom-context-menu[_ngcontent-%COMP%]   .menu-btn[_ngcontent-%COMP%]:hover   ion-icon[_ngcontent-%COMP%]{color:#fff}.custom-context-menu[_ngcontent-%COMP%]   .menu-btn.danger-btn[_ngcontent-%COMP%]:hover{background:#ef4444;color:#fff}.custom-context-menu[_ngcontent-%COMP%]   .menu-btn.danger-btn[_ngcontent-%COMP%]:hover   ion-icon[_ngcontent-%COMP%]{color:#fff}.custom-context-menu[_ngcontent-%COMP%]   .menu-divider[_ngcontent-%COMP%]{height:1px;background:rgba(0,0,0,.08);margin:4px 0}.user-guide-content-area[_ngcontent-%COMP%]{flex:1;overflow-y:auto;padding:20px;background:#0f172a}.guide-view-mode[_ngcontent-%COMP%]{display:flex;flex-direction:column;grid-gap:24px;gap:24px}.guide-banner[_ngcontent-%COMP%]{display:flex;grid-gap:12px;gap:12px;background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);border-radius:8px;padding:12px 14px;color:#eff6ff;font-size:13px;line-height:1.5}.guide-banner[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:24px;color:#60a5fa;flex-shrink:0}.guide-banner[_ngcontent-%COMP%]   code[_ngcontent-%COMP%]{background:rgba(255,255,255,.1);padding:2px 6px;border-radius:4px;font-size:11px;color:#93c5fd}.guide-section__title[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:8px;gap:8px;font-size:15px;font-weight:600;color:#f8fafc;margin:0 0 12px}.guide-section__title[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:18px}.guide-list[_ngcontent-%COMP%]{display:flex;flex-direction:column;grid-gap:12px;gap:12px}.guide-item[_ngcontent-%COMP%]{display:flex;grid-gap:10px;gap:10px;align-items:flex-start;background:rgba(255,255,255,.03);padding:12px;border-radius:8px;border:1px solid rgba(255,255,255,.05)}.guide-item__icon[_ngcontent-%COMP%]{font-size:16px;color:#94a3b8;margin-top:2px;flex-shrink:0}.guide-item__text[_ngcontent-%COMP%]{font-size:13px;line-height:1.5;color:#cbd5e1}.guide-item__text[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{color:#f8fafc;font-weight:600}.guide-item__text[_ngcontent-%COMP%]   code[_ngcontent-%COMP%]{background:rgba(0,0,0,.3);padding:2px 5px;border-radius:4px;font-size:11px;color:#cbd5e1;border:1px solid rgba(255,255,255,.1)}.guide-step[_ngcontent-%COMP%]{width:20px;height:20px;border-radius:50%;background:#334155;color:#fff;font-size:11px;font-weight:bold;display:flex;align-items:center;justify-content:center;flex-shrink:0}.guide-raw-content[_ngcontent-%COMP%]{white-space:pre-wrap;color:#94a3b8;font-size:13px;line-height:1.6;background:rgba(0,0,0,.2);padding:12px;border-radius:8px;border:1px solid rgba(255,255,255,.05)}.guide-edit-btn[_ngcontent-%COMP%]{width:100%;padding:10px;background:rgba(108,142,245,.1);color:#818cf8;border:1px solid rgba(129,140,248,.3);border-radius:8px;cursor:pointer;font-weight:500;transition:all .2s;display:flex;align-items:center;justify-content:center;grid-gap:8px;gap:8px}.guide-edit-btn[_ngcontent-%COMP%]:hover{background:rgba(108,142,245,.15);border-color:#818cf880}.guide-dot-demo[_ngcontent-%COMP%]{display:inline-block;width:10px;height:10px;background:#1a73e8;border:2px solid #fff;border-radius:50%;vertical-align:middle;box-shadow:0 1px 3px #0000004d}.guide-shortcuts-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;grid-gap:10px;gap:10px}.guide-shortcut-card[_ngcontent-%COMP%]{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;grid-gap:6px;gap:6px}.guide-shortcut-card__keys[_ngcontent-%COMP%]{display:flex;align-items:center;grid-gap:4px;gap:4px}.guide-shortcut-card__keys[_ngcontent-%COMP%]   kbd[_ngcontent-%COMP%]{background:#1e293b;border:1px solid #334155;border-bottom:2px solid #475569;border-radius:5px;padding:3px 7px;font-size:11px;font-family:monospace;color:#e2e8f0;line-height:1.4}.guide-shortcut-card__keys[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:#64748b;font-size:12px}.guide-shortcut-card__label[_ngcontent-%COMP%]{font-size:12px;color:#94a3b8;line-height:1.3}.guide-protip[_ngcontent-%COMP%]{display:flex;grid-gap:12px;gap:12px;background:linear-gradient(135deg,rgba(251,191,36,.08) 0%,rgba(245,158,11,.05) 100%);border:1px solid rgba(251,191,36,.2);border-radius:10px;padding:14px}.guide-protip__icon[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:22px;color:#fbbf24;flex-shrink:0}.guide-protip__title[_ngcontent-%COMP%]{font-size:13px;font-weight:700;color:#fde68a;margin-bottom:8px;letter-spacing:.3px}.guide-protip__list[_ngcontent-%COMP%]{margin:0;padding-left:16px;display:flex;flex-direction:column;grid-gap:6px;gap:6px}.guide-protip__list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{font-size:12.5px;color:#cbd5e1;line-height:1.5}.guide-protip__list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   code[_ngcontent-%COMP%]{background:rgba(0,0,0,.25);padding:1px 5px;border-radius:4px;font-size:11px;color:#fde68a;border:1px solid rgba(251,191,36,.2)}"] });
PdfAnnotatorModalComponent.ctorParameters = () => [
    { type: ModalController },
    { type: HttpClient },
    { type: NgZone },
    { type: ToastController },
    { type: AlertController },
    { type: ChangeDetectorRef },
    { type: DomSanitizer },
    { type: PdfManagerService },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [PDF_ANNOTATOR_CONFIG,] }] }
];
PdfAnnotatorModalComponent.propDecorators = {
    pdfUrl: [{ type: Input }],
    fileName: [{ type: Input }],
    canManageGuide: [{ type: Input }],
    pdfCanvases: [{ type: ViewChildren, args: ['pdfCanvas',] }],
    annotCanvases: [{ type: ViewChildren, args: ['annotCanvas',] }],
    fileInputRef: [{ type: ViewChild, args: ['fileInput', { static: false },] }],
    viewerContainerRef: [{ type: ViewChild, args: ['viewerContainer', { static: false },] }],
    signatureCanvasRef: [{ type: ViewChild, args: ['signatureCanvas', { static: false },] }],
    userId: [{ type: Input }],
    userName: [{ type: Input }],
    documentId: [{ type: Input }],
    detailId: [{ type: Input }],
    edocId: [{ type: Input }],
    isCancelMode: [{ type: Input }],
    signatureFileInputRef: [{ type: ViewChild, args: ['signatureFileInput', { static: false },] }],
    thumbFileInputRef: [{ type: ViewChild, args: ['thumbFileInput', { static: false },] }],
    onDocumentPointerDown: [{ type: HostListener, args: ['document:pointerdown', ['$event'],] }],
    handleKeyboard: [{ type: HostListener, args: ['window:keydown', ['$event'],] }]
};
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵngcc0.ɵsetClassMetadata(PdfAnnotatorModalComponent, [{
        type: Component,
        args: [{ selector: 'app-pdf-annotator-modal', template: "<ion-header [style.display]=\"showPreviewOverlay ? 'none' : ''\">\n  <ion-toolbar>\n    <!-- <ion-title>PDF Annotator</ion-title> -->\n    <ion-buttons slot=\"end\">\n      <ion-button fill=\"clear\" (click)=\"close()\">\n        <ion-icon name=\"close\"></ion-icon>\n      </ion-button>\n    </ion-buttons>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content class=\"annotator-content\" [scrollY]=\"false\">\n\n  <!-- Loading Spinner Overlay -->\n  <div class=\"loading-overlay\" *ngIf=\"isLoading\">\n    <div class=\"loading-content\" [class.loading-content--progress]=\"saveProgress > 0\">\n\n      <!-- Normal spinner when no save progress -->\n      <ng-container *ngIf=\"saveProgress === 0\">\n        <ion-spinner name=\"crescent\"></ion-spinner>\n        <p class=\"loading-msg\">{{ loadingMessage }}</p>\n      </ng-container>\n\n      <!-- Progress bar UI during save -->\n      <ng-container *ngIf=\"saveProgress > 0\">\n        <div class=\"save-progress-icon\">\n          <ion-icon name=\"document-text-outline\"></ion-icon>\n          <span class=\"save-progress-pct\">{{ saveProgress }}%</span>\n        </div>\n        <div class=\"save-progress-bar-track\">\n          <div class=\"save-progress-bar-fill\" [style.width.%]=\"saveProgress\"\n            [class.save-progress-bar-fill--preview]=\"saveProgress > 61\"\n            [class.save-progress-bar-fill--serializing]=\"saveProgress === 61\"></div>\n        </div>\n        <div class=\"save-progress-phases\">\n          <span [class.active]=\"saveProgress > 0 && saveProgress < 61\">\n            <ion-icon name=\"layers-outline\"></ion-icon> บันทึก Annotations\n          </span>\n          <span [class.active]=\"saveProgress === 61\">\n            <ion-icon name=\"archive-outline\"></ion-icon> Serialize PDF\n          </span>\n          <span [class.active]=\"saveProgress > 61\">\n            <ion-icon name=\"image-outline\"></ion-icon> สร้าง Preview\n          </span>\n        </div>\n        <p class=\"loading-msg\">{{ loadingMessage }}</p>\n      </ng-container>\n\n    </div>\n  </div>\n\n  <!-- New Layout: Top Toolbars + Left Thumbnails + Center Viewer -->\n  <div class=\"annotator-layout-v2\">\n\n    <!-- Top Toolbar Row 1: Zoom & Navigation -->\n    <div class=\"toolbar-row toolbar-row--nav\">\n      <div class=\"toolbar-group\">\n        <button class=\"toolbar-btn\" (click)=\"toggleThumbnails()\" title=\"แสดง/ซ่อน Thumbnails\">\n          <ion-icon name=\"images-outline\"></ion-icon>\n        </button>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <div class=\"toolbar-group toolbar-group--zoom\">\n        <button class=\"toolbar-btn\" (click)=\"zoomOut()\" [disabled]=\"zoom <= 0.5\">\n          <ion-icon name=\"search-outline\"></ion-icon>\n          <ion-icon name=\"remove-outline\" class=\"zoom-icon\"></ion-icon>\n        </button>\n        <span class=\"toolbar-label\">{{ (zoom * 100) | number:'1.0-0' }}%</span>\n        <button class=\"toolbar-btn\" (click)=\"zoomIn()\" [disabled]=\"zoom >= 3\">\n          <ion-icon name=\"search-outline\"></ion-icon>\n          <ion-icon name=\"add-outline\" class=\"zoom-icon\"></ion-icon>\n        </button>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <div class=\"toolbar-group toolbar-group--pager\">\n        <button class=\"toolbar-btn\" (click)=\"firstPage()\" [disabled]=\"pageNo <= 1\" title=\"หน้าแรก\">\n          <ion-icon name=\"play-skip-back\"></ion-icon>\n        </button>\n        <button class=\"toolbar-btn\" (click)=\"prevPage()\" [disabled]=\"pageNo <= 1\" title=\"หน้าก่อน\">\n          <ion-icon name=\"chevron-back\"></ion-icon>\n        </button>\n        <span class=\"toolbar-label\">\n          {{ pageNo }} / {{ pageCount || '?' }}\n          <span *ngIf=\"loadedUntilPage < pageCount\" class=\"chunk-indicator\"\n            [title]=\"'โหลดแล้ว ' + loadedUntilPage + ' / ' + pageCount + ' หน้า'\">\n            <ion-spinner *ngIf=\"isLoadingChunk\" name=\"crescent\" style=\"width:10px;height:10px;\"></ion-spinner>\n            <span *ngIf=\"!isLoadingChunk\">({{ loadedUntilPage }}↓)</span>\n          </span>\n        </span>\n        <button class=\"toolbar-btn\" (click)=\"nextPage()\" [disabled]=\"pageNo >= pageCount || isLoadingChunk\" title=\"หน้าถัดไป\">\n          <ion-icon name=\"chevron-forward\"></ion-icon>\n        </button>\n        <button class=\"toolbar-btn\" (click)=\"lastPage()\" [disabled]=\"pageNo >= pageCount || isLoadingChunk\" title=\"หน้าสุดท้าย (โหลดแล้ว {{ loadedUntilPage }} หน้า)\">\n          <ion-icon name=\"play-skip-forward\"></ion-icon>\n        </button>\n      </div>\n\n      <div class=\"toolbar-spacer\"></div>\n\n      <!-- Insert Blank Page + Delete Page -->\n      <div class=\"tool-item insert-page-tool\">\n        <button class=\"toolbar-btn\" (click)=\"showInsertMenu = !showInsertMenu\" title=\"แทรก/ลบหน้า\">\n          <ion-icon name=\"documents-outline\"></ion-icon>\n          <ion-icon name=\"chevron-down-outline\" class=\"shape-chevron\"></ion-icon>\n        </button>\n\n        <!-- Dropdown -->\n        <div class=\"insert-page-dropdown\" *ngIf=\"showInsertMenu\">\n          <div class=\"insert-page-backdrop\" (click)=\"showInsertMenu = false\"></div>\n          <div class=\"insert-page-menu\">\n\n            <!-- Section: แทรกหน้าเปล่า -->\n            <div class=\"insert-page-title\">\n              <ion-icon name=\"add-circle-outline\"></ion-icon> แทรกหน้าเปล่า\n            </div>\n\n            <!-- Orientation Toggle -->\n            <div class=\"insert-orient-row\">\n              <span class=\"insert-orient-label\">รูปแบบ:</span>\n              <div class=\"insert-orient-group\">\n                <button class=\"insert-orient-btn\"\n                  [class.active]=\"insertOrientation === 'portrait'\"\n                  (click)=\"insertOrientation = 'portrait'\" title=\"แนวตั้ง\">\n                  <ion-icon name=\"phone-portrait-outline\"></ion-icon>\n                  <span>แนวตั้ง</span>\n                </button>\n                <button class=\"insert-orient-btn\"\n                  [class.active]=\"insertOrientation === 'landscape'\"\n                  (click)=\"insertOrientation = 'landscape'\" title=\"แนวนอน\">\n                  <ion-icon name=\"phone-landscape-outline\"></ion-icon>\n                  <span>แนวนอน</span>\n                </button>\n              </div>\n            </div>\n\n            <!-- Before / After -->\n            <button class=\"insert-page-btn\" (click)=\"insertBlankPage('before')\">\n              <ion-icon name=\"arrow-up-outline\"></ion-icon>\n              <span>ก่อนหน้านี้ <small>(หน้า {{ pageNo }})</small></span>\n            </button>\n            <button class=\"insert-page-btn\" (click)=\"insertBlankPage('after')\">\n              <ion-icon name=\"arrow-down-outline\"></ion-icon>\n              <span>หลังหน้านี้ <small>(หน้า {{ pageNo + 1 }})</small></span>\n            </button>\n\n            <div class=\"insert-menu-divider\"></div>\n\n            <!-- Section: ลบหน้า -->\n            <div class=\"insert-page-title insert-page-title--danger\">\n              <ion-icon name=\"trash-outline\"></ion-icon> ลบหน้า\n            </div>\n            <button class=\"insert-page-btn insert-page-btn--danger\"\n              [disabled]=\"pageCount <= 1\"\n              (click)=\"deletePage()\">\n              <ion-icon name=\"close-circle-outline\"></ion-icon>\n              <span>ลบหน้านี้ <small>(หน้า {{ pageNo }})</small></span>\n            </button>\n\n            <div class=\"insert-menu-divider\"></div>\n\n            <!-- Section: ย้อนกลับ -->\n            <button class=\"insert-page-btn insert-page-btn--undo\"\n              [disabled]=\"!canUndoPageOp\"\n              (click)=\"undoPageOp()\">\n              <ion-icon name=\"arrow-undo-outline\"></ion-icon>\n              <span>ย้อนกลับการแทรก/ลบ <small *ngIf=\"!canUndoPageOp\">(ไม่มีประวัติ)</small></span>\n            </button>\n\n          </div>\n        </div>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <div class=\"toolbar-group toolbar-group--save\">\n        <button class=\"toolbar-btn toolbar-btn--save\" (click)=\"saveDocument()\">\n          <ion-icon name=\"save-outline\"></ion-icon>\n          <span>บันทึก</span>\n        </button>\n        <!-- User Guide Toggle -->\n        <button class=\"toolbar-btn toolbar-btn--guide\" [class.active]=\"showUserGuidePanel\" (click)=\"toggleUserGuide($event)\" title=\"คู่มือการใช้งาน\">\n          <ion-icon name=\"book\"></ion-icon>\n          <span style=\"font-weight: 500; font-size: 13px;\">แนะนำการใช้งาน</span>\n        </button>\n        <!-- History Panel Toggle -->\n        <button class=\"toolbar-btn\" [class.active]=\"showHistoryPanel\" (click)=\"toggleHistoryPanel()\" title=\"ประวัติการแก้ไข\">\n          <ion-icon name=\"time-outline\"></ion-icon>\n        </button>\n      </div>\n    </div>\n\n    <!-- Top Toolbar Row 2: Tools -->\n    <div class=\"toolbar-row toolbar-row--tools\">\n      <!-- Text Tool -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"textPlaceMode\" (click)=\"enableTextPlaceMode()\" title=\"ข้อความ\">\n          <ion-icon name=\"text\"></ion-icon>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"textPlaceMode\">\n          <button (click)=\"changeTextFontSize(-2)\" [disabled]=\"textFontSize <= 8\"><ion-icon\n              name=\"remove\"></ion-icon></button>\n          <span>{{ textFontSize }}</span>\n          <button (click)=\"changeTextFontSize(2)\" [disabled]=\"textFontSize >= 100\"><ion-icon\n              name=\"add\"></ion-icon></button>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#000\" (click)=\"setTextColor('#000000')\"\n              [class.active]=\"textColor === '#000000'\"></div>\n            <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setTextColor('#0000FF')\"\n              [class.active]=\"textColor === '#0000FF'\"></div>\n            <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setTextColor('#FF0000')\"\n              [class.active]=\"textColor === '#FF0000'\"></div>\n            <div class=\"color-dot color-dot--custom\" [style.background]=\"textColor\" title=\"กำหนดสีเอง\">\n              <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n              <input type=\"color\" [value]=\"textColor\" (input)=\"setTextColor($any($event.target).value)\">\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- Quick Mark Stamps + Form Fields -->\n      <div class=\"tool-item mark-tool-item\">\n        <button class=\"toolbar-btn mark-toolbar-btn\" [class.active]=\"showMarkOptions || toolMode === 'mark'\"\n          (click)=\"showMarkOptions = !showMarkOptions\" title=\"แบบฟอร์ม\">\n          <!-- Fixed form icon: shows checkbox + radio + text rows -->\n          <svg width=\"22\" height=\"22\" viewBox=\"0 0 22 22\" fill=\"none\">\n            <rect x=\"1\" y=\"2\" width=\"7\" height=\"6\" rx=\"1.2\" stroke=\"currentColor\" stroke-width=\"1.6\"/>\n            <polyline points=\"2.5,5 4.2,7 7.5,3\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n            <line x1=\"10\" y1=\"5\" x2=\"21\" y2=\"5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n            <circle cx=\"4.5\" cy=\"14\" r=\"3.2\" stroke=\"currentColor\" stroke-width=\"1.6\"/>\n            <circle cx=\"4.5\" cy=\"14\" r=\"1.5\" fill=\"currentColor\"/>\n            <line x1=\"10\" y1=\"14\" x2=\"21\" y2=\"14\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n            <line x1=\"10\" y1=\"20\" x2=\"21\" y2=\"20\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n            <line x1=\"1\" y1=\"20\" x2=\"7.5\" y2=\"20\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n            <line x1=\"1\" y1=\"17.5\" x2=\"5\" y2=\"17.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n          </svg>\n          <span class=\"mark-btn-label\">แบบฟอร์ม</span>\n          <ion-icon name=\"chevron-down-outline\" class=\"mark-chevron\"></ion-icon>\n        </button>\n\n        <div class=\"mark-popup\" *ngIf=\"showMarkOptions\">\n          <!-- Quick Marks section -->\n          <div class=\"mark-popup-section-label\">เพิ่มเครื่องหมายด่วน</div>\n          <div class=\"mark-quick-row\">\n            <button class=\"mark-quick-btn\" [class.active]=\"toolMode === 'mark' && markType === 'check'\"\n              (click)=\"enableMarkMode('check')\" title=\"เครื่องหมายถูก\">\n              <svg width=\"28\" height=\"28\" viewBox=\"0 0 28 28\"><polyline points=\"4,14 11,21 24,7\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/></svg>\n            </button>\n            <button class=\"mark-quick-btn\" [class.active]=\"toolMode === 'mark' && markType === 'cross'\"\n              (click)=\"enableMarkMode('cross')\" title=\"เครื่องหมายผิด\">\n              <svg width=\"28\" height=\"28\" viewBox=\"0 0 28 28\"><line x1=\"5\" y1=\"5\" x2=\"23\" y2=\"23\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"23\" y1=\"5\" x2=\"5\" y2=\"23\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/></svg>\n            </button>\n            <button class=\"mark-quick-btn\" [class.active]=\"toolMode === 'mark' && markType === 'dot'\"\n              (click)=\"enableMarkMode('dot')\" title=\"จุด\">\n              <svg width=\"28\" height=\"28\" viewBox=\"0 0 28 28\"><circle cx=\"14\" cy=\"14\" r=\"9\" fill=\"currentColor\"/></svg>\n            </button>\n          </div>\n\n          <!-- Form Fields section -->\n          <div class=\"mark-popup-divider\"></div>\n          <div class=\"mark-popup-section-label\">เพิ่มฟิลด์แบบฟอร์มใหม่</div>\n          <div class=\"mark-form-list\">\n            <button class=\"mark-form-row-btn\" [class.active]=\"toolMode === 'formfield' && formFieldType === 'text'\"\n              (click)=\"enableFormFieldMode('text')\" title=\"Text Field\">\n              <span class=\"mark-form-row-icon mark-form-row-icon--text\">Aa</span>\n              <span>Text Field</span>\n            </button>\n            <button class=\"mark-form-row-btn\" [class.active]=\"toolMode === 'formfield' && formFieldType === 'checkbox'\"\n              (click)=\"enableFormFieldMode('checkbox')\" title=\"Checkbox\">\n              <span class=\"mark-form-row-icon\">\n                <svg width=\"18\" height=\"18\" viewBox=\"0 0 18 18\"><rect x=\"1\" y=\"1\" width=\"16\" height=\"16\" rx=\"2.5\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\"/><polyline points=\"4,9 7,13 14,5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/></svg>\n              </span>\n              <span>Checkbox</span>\n            </button>\n            <button class=\"mark-form-row-btn\" [class.active]=\"toolMode === 'formfield' && formFieldType === 'radio'\"\n              (click)=\"enableFormFieldMode('radio')\" title=\"Radio Button\">\n              <span class=\"mark-form-row-icon\">\n                <svg width=\"18\" height=\"18\" viewBox=\"0 0 18 18\"><circle cx=\"9\" cy=\"9\" r=\"8\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"9\" cy=\"9\" r=\"4\" fill=\"currentColor\"/></svg>\n              </span>\n              <span>Radio Button</span>\n            </button>\n          </div>\n\n          <!-- Size + Color controls (compact, below fold) -->\n          <div class=\"mark-popup-divider\"></div>\n          <div class=\"mark-controls-row\">\n            <button (click)=\"changeMarkSize(-4)\" [disabled]=\"markSize <= 12\"><ion-icon name=\"remove\"></ion-icon></button>\n            <span class=\"mark-size-val\">{{ markSize }}</span>\n            <button (click)=\"changeMarkSize(4)\" [disabled]=\"markSize >= 96\"><ion-icon name=\"add\"></ion-icon></button>\n            <div class=\"color-dots\" style=\"margin-left: 6px;\">\n              <div class=\"color-dot\" style=\"background:#000\" (click)=\"setMarkColor('#000000')\" [class.active]=\"markColor === '#000000'\"></div>\n              <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setMarkColor('#0000FF')\" [class.active]=\"markColor === '#0000FF'\"></div>\n              <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setMarkColor('#FF0000')\" [class.active]=\"markColor === '#FF0000'\"></div>\n              <div class=\"color-dot\" style=\"background:#009900\" (click)=\"setMarkColor('#009900')\" [class.active]=\"markColor === '#009900'\"></div>\n              <div class=\"color-dot color-dot--custom\" [style.background]=\"markColor\" title=\"กำหนดสีเอง\">\n                <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n                <input type=\"color\" [value]=\"markColor\" (input)=\"setMarkColor($any($event.target).value)\">\n              </div>\n            </div>\n          </div>\n\n          <!-- Cancel / close popup -->\n          <div class=\"mark-popup-divider\"></div>\n          <button class=\"mark-cancel-btn\" (click)=\"showMarkOptions = false; toolMode = 'none'; updateCursor()\">\n            <ion-icon name=\"close-outline\"></ion-icon>\n            ยกเลิก\n          </button>\n        </div>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <!-- Shapes — Dropdown -->\n      <div class=\"tool-item shape-tool-item\">\n        <!-- Main shape button: shows current shape icon, click to activate/toggle dropdown -->\n        <button class=\"toolbar-btn\" [class.active]=\"shapeMode\"\n          (click)=\"toolMode='shape'; showShapeDropdown=!showShapeDropdown\" title=\"รูปทรง\">\n          <ion-icon [name]=\"shapeType === 'rect' ? 'square-outline'\n                          : shapeType === 'circle' ? 'ellipse-outline'\n                          : shapeType === 'line' ? 'remove-outline'\n                          : 'arrow-forward-outline'\"></ion-icon>\n          <ion-icon name=\"chevron-down-outline\" class=\"shape-chevron\"></ion-icon>\n        </button>\n\n        <!-- Dropdown: choose shape type -->\n        <div class=\"shape-dropdown\" *ngIf=\"showShapeDropdown\">\n          <button class=\"shape-dd-btn\" [class.active]=\"shapeType === 'rect'\" (click)=\"selectShape('rect')\"\n            title=\"สี่เหลี่ยม\">\n            <ion-icon name=\"square-outline\"></ion-icon>\n          </button>\n          <button class=\"shape-dd-btn\" [class.active]=\"shapeType === 'circle'\" (click)=\"selectShape('circle')\"\n            title=\"วงกลม\">\n            <ion-icon name=\"ellipse-outline\"></ion-icon>\n          </button>\n          <button class=\"shape-dd-btn\" [class.active]=\"shapeType === 'line'\" (click)=\"selectShape('line')\" title=\"เส้น\">\n            <ion-icon name=\"remove-outline\"></ion-icon>\n          </button>\n          <button class=\"shape-dd-btn\" [class.active]=\"shapeType === 'arrow'\" (click)=\"selectShape('arrow')\"\n            title=\"ลูกศร\">\n            <ion-icon name=\"arrow-forward-outline\"></ion-icon>\n          </button>\n        </div>\n\n        <!-- Options panel: stroke width, stroke color, fill color -->\n        <div class=\"shape-options-panel\" *ngIf=\"shapeMode\">\n\n          <!-- Stroke width -->\n          <div class=\"shape-opt-group\">\n            <span class=\"shape-opt-label\">ขนาด</span>\n            <button class=\"sopt-btn\" (click)=\"changeShapeStrokeSize(-1)\" [disabled]=\"shapeStrokeSize <= 1\">\n              <ion-icon name=\"remove\"></ion-icon>\n            </button>\n            <span class=\"sopt-val\">{{ shapeStrokeSize }}</span>\n            <button class=\"sopt-btn\" (click)=\"changeShapeStrokeSize(1)\" [disabled]=\"shapeStrokeSize >= 20\">\n              <ion-icon name=\"add\"></ion-icon>\n            </button>\n          </div>\n\n          <div class=\"sopt-divider\"></div>\n\n          <!-- Stroke color (disabled when no-stroke is on) -->\n          <div class=\"shape-opt-group\">\n            <span class=\"shape-opt-label\">เส้นขอบ</span>\n            <!-- No stroke toggle -->\n            <button class=\"sopt-fill-toggle\" [class.active]=\"shapeNoStroke\" (click)=\"toggleShapeNoStroke()\"\n              title=\"ไม่มีเส้นขอบ\">\n              <ion-icon name=\"ban-outline\"></ion-icon>\n            </button>\n            <div class=\"mac-color-grid\" [class.disabled]=\"shapeNoStroke\">\n              <div class=\"mac-swatch\" *ngFor=\"let c of shapeColorSwatches\" [style.background]=\"c\"\n                [class.active]=\"shapeStrokeColor === c && !shapeNoStroke\"\n                (click)=\"!shapeNoStroke && setShapeStrokeColor(c)\" [title]=\"c\"></div>\n            </div>\n            <div class=\"mac-custom-color\" [class.disabled]=\"shapeNoStroke\">\n              <div class=\"mac-swatch mac-swatch--current\" [style.background]=\"shapeStrokeColor\"></div>\n              <input type=\"color\" [value]=\"shapeStrokeColor\" (input)=\"setShapeStrokeColor($any($event.target).value)\"\n                [disabled]=\"shapeNoStroke\" title=\"กำหนดสีเอง\" />\n            </div>\n          </div>\n\n          <div class=\"sopt-divider\"></div>\n\n          <!-- Fill color -->\n          <div class=\"shape-opt-group\">\n            <span class=\"shape-opt-label\">สีพื้น</span>\n            <button class=\"sopt-fill-toggle\" [class.active]=\"shapeFillEnabled\" (click)=\"toggleShapeFill()\"\n              title=\"เปิด/ปิดสีพื้น\">\n              <ion-icon [name]=\"shapeFillEnabled ? 'color-fill' : 'color-fill-outline'\"></ion-icon>\n            </button>\n            <div class=\"mac-color-grid\" [class.disabled]=\"!shapeFillEnabled\">\n              <div class=\"mac-swatch\" *ngFor=\"let c of shapeFillSwatches\" [style.background]=\"c\"\n                [class.active]=\"shapeFillColor === c && shapeFillEnabled\"\n                (click)=\"shapeFillEnabled && setShapeFillColor(c)\" [title]=\"c\"></div>\n            </div>\n            <div class=\"mac-custom-color\" [class.disabled]=\"!shapeFillEnabled\">\n              <div class=\"mac-swatch mac-swatch--current\" [style.background]=\"shapeFillColor\"></div>\n              <input type=\"color\" [value]=\"shapeFillColor\" (input)=\"setShapeFillColor($any($event.target).value)\"\n                [disabled]=\"!shapeFillEnabled\" title=\"กำหนดสีพื้นเอง\" />\n            </div>\n          </div>\n\n        </div>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <!-- Draw Tool -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"drawMode\" (click)=\"toggleDraw()\" title=\"วาด\">\n          <ion-icon name=\"brush\"></ion-icon>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"drawMode\">\n          <button (click)=\"changeBrushSize(-1)\" [disabled]=\"brushSize <= 1\"><ion-icon name=\"remove\"></ion-icon></button>\n          <span>{{ brushSize }}</span>\n          <button (click)=\"changeBrushSize(1)\" [disabled]=\"brushSize >= 50\"><ion-icon name=\"add\"></ion-icon></button>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#000\" (click)=\"setBrushColor('#000000')\"\n              [class.active]=\"brushColor === '#000000'\"></div>\n            <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setBrushColor('#0000FF')\"\n              [class.active]=\"brushColor === '#0000FF'\"></div>\n            <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setBrushColor('#FF0000')\"\n              [class.active]=\"brushColor === '#FF0000'\"></div>\n            <div class=\"color-dot color-dot--custom\" [style.background]=\"brushColor\" title=\"กำหนดสีเอง\">\n              <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n              <input type=\"color\" [value]=\"brushColor\" (input)=\"setBrushColor($any($event.target).value)\">\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- Highlight Tool -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"highlightMode\" (click)=\"toggleHighlight()\" title=\"ไฮไลท์\">\n          <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n            <!-- Marker Body -->\n            <path d=\"M18 2l4 4L9 19H5v-4L18 2z\"></path>\n            <path d=\"M14 6l4 4\"></path>\n            <!-- Highlight Line -->\n            <line x1=\"3\" y1=\"22\" x2=\"21\" y2=\"22\" stroke-width=\"3\"></line>\n          </svg>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"highlightMode\">\n          <button (click)=\"changeHighlightSize(-5)\" [disabled]=\"highlightSize <= 5\"><ion-icon\n              name=\"remove\"></ion-icon></button>\n          <span>{{ highlightSize }}</span>\n          <button (click)=\"changeHighlightSize(5)\" [disabled]=\"highlightSize >= 100\"><ion-icon\n              name=\"add\"></ion-icon></button>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#ffff00\" (click)=\"setHighlightColor('#ffff00')\"\n              [class.active]=\"highlightColor === '#ffff00'\" title=\"เหลือง\"></div>\n            <div class=\"color-dot\" style=\"background:#00ff00\" (click)=\"setHighlightColor('#00ff00')\"\n              [class.active]=\"highlightColor === '#00ff00'\" title=\"เขียว\"></div>\n            <div class=\"color-dot\" style=\"background:#00ffff\" (click)=\"setHighlightColor('#00ffff')\"\n              [class.active]=\"highlightColor === '#00ffff'\" title=\"ฟ้า\"></div>\n            <div class=\"color-dot\" style=\"background:#ff99c2\" (click)=\"setHighlightColor('#ff99c2')\"\n              [class.active]=\"highlightColor === '#ff99c2'\" title=\"ชมพู\"></div>\n            <div class=\"color-dot\" style=\"background:#ffb366\" (click)=\"setHighlightColor('#ffb366')\"\n              [class.active]=\"highlightColor === '#ffb366'\" title=\"ส้ม\"></div>\n            <div class=\"color-dot\" style=\"background:#d9b3ff\" (click)=\"setHighlightColor('#d9b3ff')\"\n              [class.active]=\"highlightColor === '#d9b3ff'\" title=\"ม่วง\"></div>\n            <div class=\"color-dot color-dot--custom\" [style.background]=\"highlightColor\" title=\"กำหนดสีเองรหัส HEX\">\n              <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n              <input type=\"color\" [value]=\"highlightColor\" (input)=\"setHighlightColor($any($event.target).value)\" title=\"กำหนดสีเอง\">\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- Eraser -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"eraserMode\" (click)=\"toggleEraser()\" title=\"ยางลบ (ลบเส้นและรูปทรง)\">\n          <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n            <path d=\"M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4C13.5 3.5 14.5 3.5 15 4L20 9C20.5 9.5 20.5 10.5 20 11L11 20H20V20Z\"/>\n            <path d=\"M17.5 15L9 6.5\"/>\n          </svg>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"eraserMode\">\n          <button (click)=\"changeEraserSize(-5)\" [disabled]=\"eraserSize <= 5\"><ion-icon name=\"remove\"></ion-icon></button>\n          <span>{{ eraserSize }}</span>\n          <button (click)=\"changeEraserSize(5)\" [disabled]=\"eraserSize >= 200\"><ion-icon name=\"add\"></ion-icon></button>\n        </div>\n      </div>\n\n      <div class=\"toolbar-divider\"></div>\n\n      <!-- Insert Tools -->\n      <button class=\"toolbar-btn\" (click)=\"openSignaturePickerOrPad()\" title=\"ลายเซ็น\">\n        <ion-icon name=\"finger-print\"></ion-icon>\n      </button>\n      <button class=\"toolbar-btn toolbar-btn--toggle\" [class.active]=\"showDigitalId\"\n        (click)=\"showDigitalId = !showDigitalId\" title=\"แสดง/ซ่อน Digital ID\">\n        <ion-icon [name]=\"showDigitalId ? 'shield-checkmark' : 'shield-checkmark-outline'\"></ion-icon>\n        <span class=\"toggle-label\">DID</span>\n      </button>\n\n      <!-- Date Stamp with Options -->\n      <div class=\"tool-item\">\n        <button class=\"toolbar-btn\" [class.active]=\"showDateOptions\" (click)=\"addDateStampAndShowOptions()\"\n          title=\"วันที่\">\n          <ion-icon name=\"calendar\"></ion-icon>\n        </button>\n        <div class=\"tool-options\" *ngIf=\"showDateOptions\">\n          <button (click)=\"changeDateFontSize(-2)\" [disabled]=\"dateFontSize <= 8\"><ion-icon\n              name=\"remove\"></ion-icon></button>\n          <span>{{ dateFontSize }}</span>\n          <button (click)=\"changeDateFontSize(2)\" [disabled]=\"dateFontSize >= 100\"><ion-icon\n              name=\"add\"></ion-icon></button>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#000\" (click)=\"setDateColor('#000000')\"\n              [class.active]=\"dateColor === '#000000'\"></div>\n            <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setDateColor('#0000FF')\"\n              [class.active]=\"dateColor === '#0000FF'\"></div>\n            <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setDateColor('#FF0000')\"\n              [class.active]=\"dateColor === '#FF0000'\"></div>\n            <div class=\"color-dot color-dot--custom\" [style.background]=\"dateColor\" title=\"กำหนดสีเอง\">\n              <ion-icon name=\"color-palette\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #fff; text-shadow: 0 0 2px rgba(0,0,0,0.5); mix-blend-mode: difference; pointer-events: none;\"></ion-icon>\n              <input type=\"color\" [value]=\"dateColor\" (input)=\"setDateColor($any($event.target).value)\">\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <button class=\"toolbar-btn\" (click)=\"triggerImageUpload()\" title=\"รูปภาพ\">\n        <ion-icon name=\"image\"></ion-icon>\n      </button>\n      <input type=\"file\" #fileInput accept=\"image/*\" style=\"display:none\" (change)=\"onImageSelected($event)\">\n\n      <div class=\"toolbar-divider\"></div>\n\n      <!-- Undo/Redo -->\n      <button class=\"toolbar-btn\" (click)=\"undo()\" [disabled]=\"!canUndo()\" title=\"เลิกทำ\">\n        <ion-icon name=\"arrow-undo\"></ion-icon>\n      </button>\n      <button class=\"toolbar-btn\" (click)=\"redo()\" [disabled]=\"!canRedo()\" title=\"ทำซ้ำ\">\n        <ion-icon name=\"arrow-redo\"></ion-icon>\n      </button>\n      <button class=\"toolbar-btn toolbar-btn--danger\" (click)=\"clearAnnotations()\" title=\"ล้างทั้งหมด\">\n        <ion-icon name=\"trash\"></ion-icon>\n      </button>\n    </div>\n\n    <!-- Main Content Area: Thumbnails + Viewer -->\n    <div class=\"main-area\">\n\n      <!-- Left Thumbnails Sidebar -->\n      <aside class=\"thumbnails-sidebar\" *ngIf=\"showThumbnails\">\n        <div class=\"thumb-list\">\n\n          <!-- Top insert button (before page 1) -->\n          <div class=\"thumb-insert-row\">\n            <button class=\"thumb-add-btn\" (click)=\"toggleThumbInsert(0, $event)\" title=\"แทรกก่อนหน้า 1\">\n              <ion-icon name=\"add\"></ion-icon>\n            </button>\n          </div>\n\n          <!-- Each thumbnail + its action bar + insert button after it -->\n          <ng-container *ngFor=\"let thumb of pageThumbnails; let i = index\">\n\n            <!-- Thumbnail card wrapper -->\n            <div class=\"thumb-card-wrap\">\n              <!-- Clickable thumbnail -->\n              <div class=\"thumb-card\" [class.active]=\"pageNo === i + 1\"\n                [id]=\"'thumb-' + (i + 1)\" (click)=\"goToPage(i + 1)\">\n                <div class=\"thumb-card__img-wrap\">\n                  <img [src]=\"thumb\" [alt]=\"'Page ' + (i + 1)\">\n                </div>\n                <span class=\"thumb-card__label\">{{ i + 1 }}</span>\n              </div>\n\n              <!-- Per-page action bar -->\n              <div class=\"thumb-card__actions\" (click)=\"$event.stopPropagation()\">\n                <button class=\"thumb-action-btn\" (click)=\"movePageToIndex(i + 1, 'up')\"\n                  [disabled]=\"i === 0\" title=\"เลื่อนขึ้น\">\n                  <ion-icon name=\"chevron-up-outline\"></ion-icon>\n                </button>\n                <button class=\"thumb-action-btn\" (click)=\"movePageToIndex(i + 1, 'down')\"\n                  [disabled]=\"i === pageThumbnails.length - 1\" title=\"เลื่อนลง\">\n                  <ion-icon name=\"chevron-down-outline\"></ion-icon>\n                </button>\n                <button class=\"thumb-action-btn\" (click)=\"undoPageOp()\"\n                  [disabled]=\"!canUndoPageOp\" title=\"ย้อนกลับ\">\n                  <ion-icon name=\"arrow-undo-outline\"></ion-icon>\n                </button>\n                <button class=\"thumb-action-btn thumb-action-btn--danger\"\n                  (click)=\"deleteSpecificPage(i + 1)\" [disabled]=\"pageCount <= 1\" title=\"ลบหน้า\">\n                  <ion-icon name=\"trash-outline\"></ion-icon>\n                </button>\n              </div>\n            </div>\n\n            <!-- Insert button after each page -->\n            <div class=\"thumb-insert-row\">\n              <button class=\"thumb-add-btn\" (click)=\"toggleThumbInsert(i + 1, $event)\" title=\"แทรกหน้า\">\n                <ion-icon name=\"add\"></ion-icon>\n              </button>\n            </div>\n\n          </ng-container>\n\n        </div>\n\n        <!-- Hidden file input -->\n        <input type=\"file\" #thumbFileInput accept=\"image/*,.pdf\" style=\"display:none\"\n          (change)=\"onThumbFileSelected($event)\">\n\n      </aside>\n\n      <!-- Insert Dropdown Overlay (outside aside — fixed position, no clipping) -->\n      <div class=\"thumb-insert-overlay\" *ngIf=\"thumbInsertIndex >= 0\"\n        [style.top.px]=\"thumbDropdownTop\">\n        <div class=\"thumb-insert-backdrop\" (click)=\"thumbInsertIndex = -1\"></div>\n        <div class=\"thumb-insert-menu\">\n          <button class=\"thumb-insert-opt\" (click)=\"insertAtThumb(thumbInsertIndex, 'portrait')\">\n            <ion-icon name=\"phone-portrait-outline\"></ion-icon>\n            หน้าเปล่า แนวตั้ง\n          </button>\n          <button class=\"thumb-insert-opt\" (click)=\"insertAtThumb(thumbInsertIndex, 'landscape')\">\n            <ion-icon name=\"phone-landscape-outline\"></ion-icon>\n            หน้าเปล่า แนวนอน\n          </button>\n          <button class=\"thumb-insert-opt\" (click)=\"triggerThumbFileUpload(thumbInsertIndex)\">\n            <ion-icon name=\"document-outline\"></ion-icon>\n            แทรกไฟล์ PDF/รูปภาพ\n          </button>\n        </div>\n      </div>\n\n      <!-- Viewer -->\n      <div class=\"viewer-wrapper\">\n        <div class=\"viewer-container\" #viewerContainer (scroll)=\"onViewerScroll($event)\">\n          <!-- Render all pages for continuous scroll -->\n          <div *ngFor=\"let p of pages\" class=\"page-container\" [attr.data-page]=\"p\" [id]=\"'page-' + p\">\n            <canvas [id]=\"'pdfCanvas-' + p\" class=\"pdf-canvas\"></canvas>\n            <canvas [id]=\"'annotCanvas-' + p\" class=\"annot-canvas\" [class.tools-active]=\"toolMode !== 'none'\"></canvas>\n\n            <!-- TextBoxes for this page -->\n            <div *ngFor=\"let tb of getTextBoxesForPage(p)\" class=\"text-box\" [class.active]=\"activeTextBoxId === tb.id\"\n              [style.left.%]=\"tb.x\" [style.top.%]=\"tb.y\" [style.width.%]=\"tb.width\" [style.height.%]=\"tb.height\"\n              [style.color]=\"tb.color\" [style.font-size.px]=\"tb.fontSize * zoom\"\n              [style.font-weight]=\"tb.bold ? 'bold' : 'normal'\" [style.font-style]=\"tb.italic ? 'italic' : 'normal'\"\n              [style.text-align]=\"tb.align\" [style.z-index]=\"tb.zIndex || 10\"\n              (pointerdown)=\"startDrag($event, tb.id)\" (contextmenu)=\"onContextMenu($event, tb.id, 'text')\">\n              <div class=\"tb-handle tb-handle--left\" (pointerdown)=\"startResizeLeft($event, tb.id)\"></div>\n              <textarea [(ngModel)]=\"tb.text\" (focus)=\"activeTextBoxId = tb.id\" (input)=\"onTextBoxInput($event, tb)\"\n                spellcheck=\"false\"></textarea>\n              <div class=\"tb-handle tb-handle--right\" (pointerdown)=\"startResizeRight($event, tb.id)\"></div>\n            </div>\n            <!-- ShapeStamps for this page (draggable/resizable SVG overlays) -->\n            <div *ngFor=\"let ss of getShapeStampsForPage(p)\" class=\"shape-stamp\" [style.left.%]=\"ss.x\"\n              [style.top.%]=\"ss.y\" [style.width.%]=\"ss.width\" [style.height.%]=\"ss.height\"\n              [style.z-index]=\"ss.zIndex || 10\" (pointerdown)=\"startShapeDrag($event, ss.id)\"\n              (contextmenu)=\"onContextMenu($event, ss.id, 'shape')\">\n              <button class=\"remove-btn\" (click)=\"removeShapeStamp(ss.id); $event.stopPropagation()\"><ion-icon name=\"close-outline\"></ion-icon></button>\n\n              <!-- SVG renders the actual shape inside the bounding box -->\n              <svg width=\"100%\" height=\"100%\" [attr.viewBox]=\"'0 0 100 100'\" preserveAspectRatio=\"none\"\n                style=\"overflow:visible; pointer-events:none\">\n                <!-- rect -->\n                <rect *ngIf=\"ss.type === 'rect'\" x=\"0\" y=\"0\" width=\"100\" height=\"100\"\n                  [attr.stroke]=\"ss.strokeColor || 'none'\" [attr.stroke-width]=\"ss.strokeWidth\"\n                  vector-effect=\"non-scaling-stroke\" [attr.fill]=\"ss.fillColor || 'none'\"></rect>\n                <!-- circle -->\n                <ellipse *ngIf=\"ss.type === 'circle'\" cx=\"50\" cy=\"50\" rx=\"50\" ry=\"50\"\n                  [attr.stroke]=\"ss.strokeColor || 'none'\" [attr.stroke-width]=\"ss.strokeWidth\"\n                  vector-effect=\"non-scaling-stroke\" [attr.fill]=\"ss.fillColor || 'none'\"></ellipse>\n                <!-- line -->\n                <line *ngIf=\"ss.type === 'line'\" [attr.x1]=\"ss.startFracX * 100\" [attr.y1]=\"ss.startFracY * 100\"\n                  [attr.x2]=\"ss.endFracX * 100\" [attr.y2]=\"ss.endFracY * 100\" [attr.stroke]=\"ss.strokeColor || '#000'\"\n                  [attr.stroke-width]=\"ss.strokeWidth\" vector-effect=\"non-scaling-stroke\" fill=\"none\"></line>\n                <!-- arrow -->\n                <g *ngIf=\"ss.type === 'arrow'\">\n                  <line [attr.x1]=\"ss.startFracX * 100\" [attr.y1]=\"ss.startFracY * 100\" [attr.x2]=\"ss.endFracX * 100\"\n                    [attr.y2]=\"ss.endFracY * 100\" [attr.stroke]=\"ss.strokeColor || '#000'\"\n                    [attr.stroke-width]=\"ss.strokeWidth\" vector-effect=\"non-scaling-stroke\" fill=\"none\">\n                  </line>\n                  <polygon [attr.points]=\"'0,-6 12,0 0,6'\" [attr.fill]=\"ss.strokeColor || '#000'\"\n                    [attr.transform]=\"'translate(' + (ss.endFracX*100) + ',' + (ss.endFracY*100) + ') rotate(' + getArrowAngleDeg(ss) + ')'\">\n                  </polygon>\n                </g>\n              </svg>\n\n              <!-- Resize handles (corner + edge) -->\n              <div class=\"resize-handle rh-nw\" (pointerdown)=\"startShapeResize($event, ss.id, 'nw')\"></div>\n              <div class=\"resize-handle rh-n\" (pointerdown)=\"startShapeResize($event, ss.id, 'n')\"></div>\n              <div class=\"resize-handle rh-ne\" (pointerdown)=\"startShapeResize($event, ss.id, 'ne')\"></div>\n              <div class=\"resize-handle rh-e\" (pointerdown)=\"startShapeResize($event, ss.id, 'e')\"></div>\n              <div class=\"resize-handle rh-se\" (pointerdown)=\"startShapeResize($event, ss.id, 'se')\"></div>\n              <div class=\"resize-handle rh-s\" (pointerdown)=\"startShapeResize($event, ss.id, 's')\"></div>\n              <div class=\"resize-handle rh-sw\" (pointerdown)=\"startShapeResize($event, ss.id, 'sw')\"></div>\n              <div class=\"resize-handle rh-w\" (pointerdown)=\"startShapeResize($event, ss.id, 'w')\"></div>\n            </div>\n\n            <!-- Regular image stamps (uploaded images, not marks) -->\n            <div *ngFor=\"let img of getRegularImageStampsForPage(p)\" class=\"image-stamp\"\n              [style.left.%]=\"img.x\"\n              [style.top.%]=\"img.y\" [style.width.%]=\"img.width\" [style.height.%]=\"img.height\"\n              [style.z-index]=\"img.zIndex || 10\" (pointerdown)=\"startImageDrag($event, img.id)\"\n              (contextmenu)=\"onContextMenu($event, img.id, 'image')\">\n              <button class=\"remove-btn\" (click)=\"removeImage(img.id); $event.stopPropagation()\"><ion-icon name=\"close-outline\"></ion-icon></button>\n              <img [src]=\"img.dataUrl\" />\n              <div class=\"resize-handle rh-nw\" (pointerdown)=\"startImageResize($event, img.id, 'nw')\"></div>\n              <div class=\"resize-handle rh-n\" (pointerdown)=\"startImageResize($event, img.id, 'n')\"></div>\n              <div class=\"resize-handle rh-ne\" (pointerdown)=\"startImageResize($event, img.id, 'ne')\"></div>\n              <div class=\"resize-handle rh-e\" (pointerdown)=\"startImageResize($event, img.id, 'e')\"></div>\n              <div class=\"resize-handle rh-se\" (pointerdown)=\"startImageResize($event, img.id, 'se')\"></div>\n              <div class=\"resize-handle rh-s\" (pointerdown)=\"startImageResize($event, img.id, 's')\"></div>\n              <div class=\"resize-handle rh-sw\" (pointerdown)=\"startImageResize($event, img.id, 'sw')\"></div>\n              <div class=\"resize-handle rh-w\" (pointerdown)=\"startImageResize($event, img.id, 'w')\"></div>\n            </div>\n\n            <!-- Mark stamps (check/cross/dot) — rendered as SVG, behaves like form field checkbox -->\n            <div *ngFor=\"let mk of getMarkStampsForPage(p)\" class=\"pdf-form-field pff-mark\"\n              [class.pff-active]=\"activeObjectId === mk.id\"\n              [style.left.%]=\"mk.x\" [style.top.%]=\"mk.y\"\n              [style.width.%]=\"mk.width\" [style.height.%]=\"mk.height\"\n              [style.z-index]=\"mk.zIndex || 10\"\n              (pointerdown)=\"startMarkDrag($event, mk.id)\"\n              (contextmenu)=\"onContextMenu($event, mk.id, 'image')\">\n\n              <!-- Options bar when active -->\n              <div class=\"pff-options-bar\" *ngIf=\"activeObjectId === mk.id\" (pointerdown)=\"$event.stopPropagation()\">\n                <span class=\"pff-opt-label\"><ion-icon name=\"resize-outline\"></ion-icon></span>\n                <button class=\"pff-opt-btn\" (click)=\"changeMarkStampSize(mk.id, -1)\" [disabled]=\"mk.width <= 1\" title=\"ลดขนาด\">\n                  <ion-icon name=\"remove\"></ion-icon>\n                </button>\n                <span class=\"pff-opt-val\">{{ mk.width | number:'1.0-1' }}</span>\n                <button class=\"pff-opt-btn\" (click)=\"changeMarkStampSize(mk.id, 1)\" [disabled]=\"mk.width >= 25\" title=\"เพิ่มขนาด\">\n                  <ion-icon name=\"add\"></ion-icon>\n                </button>\n                <div class=\"pff-opt-sep\"></div>\n                <button class=\"pff-opt-btn pff-opt-delete\" (click)=\"removeImage(mk.id); $event.stopPropagation()\" title=\"ลบ\">\n                  <ion-icon name=\"trash-outline\"></ion-icon>\n                </button>\n              </div>\n\n              <!-- SVG mark symbol fills the bounding box exactly -->\n              <div class=\"pff-inner\">\n                <svg width=\"100%\" height=\"100%\" viewBox=\"0 0 100 100\" style=\"pointer-events:none; overflow:visible\">\n                  <ng-container *ngIf=\"mk.markType === 'check'\">\n                    <polyline points=\"12,52 42,82 88,18\" [attr.stroke]=\"mk.markColor || '#000000'\" stroke-width=\"10\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"/>\n                  </ng-container>\n                  <ng-container *ngIf=\"mk.markType === 'cross'\">\n                    <line x1=\"15\" y1=\"15\" x2=\"85\" y2=\"85\" [attr.stroke]=\"mk.markColor || '#000000'\" stroke-width=\"10\" stroke-linecap=\"round\"/>\n                    <line x1=\"85\" y1=\"15\" x2=\"15\" y2=\"85\" [attr.stroke]=\"mk.markColor || '#000000'\" stroke-width=\"10\" stroke-linecap=\"round\"/>\n                  </ng-container>\n                  <ng-container *ngIf=\"mk.markType === 'dot' || !mk.markType\">\n                    <circle cx=\"50\" cy=\"50\" r=\"38\" [attr.fill]=\"mk.markColor || '#000000'\"/>\n                  </ng-container>\n                </svg>\n              </div>\n\n              <div class=\"pff-resize-handle rh-nw\" (pointerdown)=\"startImageResize($event, mk.id, 'nw')\"></div>\n              <div class=\"pff-resize-handle rh-n\"  (pointerdown)=\"startImageResize($event, mk.id, 'n')\"></div>\n              <div class=\"pff-resize-handle rh-ne\" (pointerdown)=\"startImageResize($event, mk.id, 'ne')\"></div>\n              <div class=\"pff-resize-handle rh-e\"  (pointerdown)=\"startImageResize($event, mk.id, 'e')\"></div>\n              <div class=\"pff-resize-handle rh-se\" (pointerdown)=\"startImageResize($event, mk.id, 'se')\"></div>\n              <div class=\"pff-resize-handle rh-s\"  (pointerdown)=\"startImageResize($event, mk.id, 's')\"></div>\n              <div class=\"pff-resize-handle rh-sw\" (pointerdown)=\"startImageResize($event, mk.id, 'sw')\"></div>\n              <div class=\"pff-resize-handle rh-w\"  (pointerdown)=\"startImageResize($event, mk.id, 'w')\"></div>\n            </div>\n\n            <div *ngFor=\"let sig of getSignatureStampsForPage(p)\" class=\"signature-stamp\" [style.left.%]=\"sig.x\"\n              [style.top.%]=\"sig.y\" [style.width.%]=\"sig.width\" [style.height.%]=\"sig.height\"\n              [style.z-index]=\"sig.zIndex || 10\" (pointerdown)=\"startSignatureDrag($event, sig.id)\"\n              (contextmenu)=\"onContextMenu($event, sig.id, 'signature')\">\n              <button class=\"remove-btn\" (click)=\"removeSignature(sig.id); $event.stopPropagation()\"><ion-icon name=\"close-outline\"></ion-icon></button>\n              <img [src]=\"sig.dataUrl\" />\n              <div class=\"digital-id-label\" *ngIf=\"showDigitalId && (sig.digitalId || sig.signDate)\">\n                <span *ngIf=\"sig.signDate\">{{ sig.signDate }}</span>\n                <span *ngIf=\"sig.signTime\">{{ sig.signTime }}</span>\n                <span *ngIf=\"sig.digitalId\" class=\"did-text\">{{ sig.digitalId }}</span>\n              </div>\n              <div class=\"resize-handle rh-nw\" (pointerdown)=\"startSignatureResize($event, sig.id, 'nw')\"></div>\n              <div class=\"resize-handle rh-n\" (pointerdown)=\"startSignatureResize($event, sig.id, 'n')\"></div>\n              <div class=\"resize-handle rh-ne\" (pointerdown)=\"startSignatureResize($event, sig.id, 'ne')\"></div>\n              <div class=\"resize-handle rh-e\" (pointerdown)=\"startSignatureResize($event, sig.id, 'e')\"></div>\n              <div class=\"resize-handle rh-se\" (pointerdown)=\"startSignatureResize($event, sig.id, 'se')\"></div>\n              <div class=\"resize-handle rh-s\" (pointerdown)=\"startSignatureResize($event, sig.id, 's')\"></div>\n              <div class=\"resize-handle rh-sw\" (pointerdown)=\"startSignatureResize($event, sig.id, 'sw')\"></div>\n              <div class=\"resize-handle rh-w\" (pointerdown)=\"startSignatureResize($event, sig.id, 'w')\"></div>\n            </div>\n\n            <!-- PDF Form Fields for this page -->\n            <div *ngFor=\"let ff of getFormFieldsForPage(p)\" class=\"pdf-form-field\"\n              [class.pff-text]=\"ff.type === 'text'\"\n              [class.pff-checkbox]=\"ff.type === 'checkbox'\"\n              [class.pff-radio]=\"ff.type === 'radio'\"\n              [class.pff-no-border]=\"ff.borderVisible === false\"\n              [class.pff-active]=\"activeFormFieldId === ff.id\"\n              [style.left.%]=\"ff.x\" [style.top.%]=\"ff.y\"\n              [style.width.%]=\"ff.width\" [style.height.%]=\"ff.height\"\n              [style.z-index]=\"ff.zIndex || 20\"\n              (pointerdown)=\"startFormFieldDrag($event, ff.id)\">\n\n              <!-- Options bar (shown when active) -->\n              <div class=\"pff-options-bar\" *ngIf=\"activeFormFieldId === ff.id\" (pointerdown)=\"$event.stopPropagation()\">\n                <!-- Element size: all 3 types -->\n                <span class=\"pff-opt-label\">\n                  <ion-icon name=\"resize-outline\"></ion-icon>\n                </span>\n                <button class=\"pff-opt-btn\" (click)=\"changeFormFieldSize(ff.id, -0.5)\" [disabled]=\"(ff.type === 'text' ? ff.height : ff.width) <= 1.5\" title=\"ลดขนาด\">\n                  <ion-icon name=\"remove\"></ion-icon>\n                </button>\n                <span class=\"pff-opt-val\">{{ (ff.type === 'text' ? ff.height : ff.width) | number:'1.0-1' }}</span>\n                <button class=\"pff-opt-btn\" (click)=\"changeFormFieldSize(ff.id, 0.5)\" [disabled]=\"(ff.type === 'text' ? ff.height : ff.width) >= 30\" title=\"เพิ่มขนาด\">\n                  <ion-icon name=\"add\"></ion-icon>\n                </button>\n                <div class=\"pff-opt-sep\"></div>\n                <!-- Font size: text only -->\n                <ng-container *ngIf=\"ff.type === 'text'\">\n                  <span class=\"pff-opt-label\">A</span>\n                  <button class=\"pff-opt-btn\" (click)=\"changeFormFieldFontSize(ff.id, -2)\" [disabled]=\"(ff.fontSize || 12) <= 6\" title=\"ลดขนาดอักษร\">\n                    <ion-icon name=\"remove\"></ion-icon>\n                  </button>\n                  <span class=\"pff-opt-val\">{{ ff.fontSize || 12 }}</span>\n                  <button class=\"pff-opt-btn\" (click)=\"changeFormFieldFontSize(ff.id, 2)\" [disabled]=\"(ff.fontSize || 12) >= 72\" title=\"เพิ่มขนาดอักษร\">\n                    <ion-icon name=\"add\"></ion-icon>\n                  </button>\n                  <div class=\"pff-opt-sep\"></div>\n                </ng-container>\n                <!-- Border toggle -->\n                <button class=\"pff-opt-btn\" [class.pff-opt-active]=\"ff.borderVisible !== false\"\n                  (click)=\"toggleFormFieldBorder(ff.id)\" title=\"เส้นขอบ\">\n                  <ion-icon [name]=\"ff.borderVisible !== false ? 'square-outline' : 'square'\"></ion-icon>\n                </button>\n                <!-- Delete -->\n                <button class=\"pff-opt-btn pff-opt-delete\" (click)=\"removeFormField(ff.id)\" title=\"ลบ\">\n                  <ion-icon name=\"trash-outline\"></ion-icon>\n                </button>\n              </div>\n\n              <div class=\"pff-inner\">\n                <span *ngIf=\"ff.type === 'text'\" class=\"pff-text-hint\">Aa {{ ff.fontSize || 12 }}pt</span>\n                <svg *ngIf=\"ff.type === 'checkbox'\" width=\"55%\" height=\"55%\" viewBox=\"0 0 18 18\" style=\"pointer-events:none\"><rect x=\"1\" y=\"1\" width=\"16\" height=\"16\" rx=\"2\" stroke=\"#3b82f6\" stroke-width=\"2\" fill=\"none\"/></svg>\n                <svg *ngIf=\"ff.type === 'radio'\" width=\"55%\" height=\"55%\" viewBox=\"0 0 18 18\" style=\"pointer-events:none\"><circle cx=\"9\" cy=\"9\" r=\"8\" stroke=\"#3b82f6\" stroke-width=\"2\" fill=\"none\"/></svg>\n              </div>\n\n              <div class=\"pff-resize-handle rh-nw\" (pointerdown)=\"startFormFieldResize($event, ff.id, 'nw')\"></div>\n              <div class=\"pff-resize-handle rh-n\"  (pointerdown)=\"startFormFieldResize($event, ff.id, 'n')\"></div>\n              <div class=\"pff-resize-handle rh-ne\" (pointerdown)=\"startFormFieldResize($event, ff.id, 'ne')\"></div>\n              <div class=\"pff-resize-handle rh-e\"  (pointerdown)=\"startFormFieldResize($event, ff.id, 'e')\"></div>\n              <div class=\"pff-resize-handle rh-se\" (pointerdown)=\"startFormFieldResize($event, ff.id, 'se')\"></div>\n              <div class=\"pff-resize-handle rh-s\"  (pointerdown)=\"startFormFieldResize($event, ff.id, 's')\"></div>\n              <div class=\"pff-resize-handle rh-sw\" (pointerdown)=\"startFormFieldResize($event, ff.id, 'sw')\"></div>\n              <div class=\"pff-resize-handle rh-w\"  (pointerdown)=\"startFormFieldResize($event, ff.id, 'w')\"></div>\n            </div>\n\n            <!-- Date Stamps for this page -->\n            <div *ngFor=\"let ds of getDateStampsForPage(p)\" class=\"date-stamp\" [style.left.%]=\"ds.x\"\n              [style.top.%]=\"ds.y\" [style.color]=\"ds.color\" [style.font-size.px]=\"ds.fontSize * zoom\"\n              [style.z-index]=\"ds.zIndex || 10\" (pointerdown)=\"startDateDrag($event, ds.id)\"\n              (contextmenu)=\"onContextMenu($event, ds.id, 'date')\">\n              <button class=\"remove-btn\" (click)=\"removeDateStamp(ds.id); $event.stopPropagation()\"><ion-icon name=\"close-outline\"></ion-icon></button>\n              {{ ds.text }}\n            </div>\n          </div>\n        </div>\n\n        <div class=\"hint\">\n          <div>• Keyboard: Ctrl+Z (Undo), Ctrl+Y (Redo), Escape (Exit mode), Delete (Remove selected)</div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- User Guide Panel (right slide-in drawer) -->\n  <div class=\"user-guide-drawer\" [class.open]=\"showUserGuidePanel\">\n    <div class=\"user-guide-drawer__backdrop\" (click)=\"showUserGuidePanel = false\"></div>\n    <div class=\"user-guide-drawer__panel\">\n      <div class=\"user-guide-drawer__header\">\n        <span><ion-icon name=\"book-outline\"></ion-icon> คู่มือการใช้งาน</span>\n        <button (click)=\"showUserGuidePanel = false\"><ion-icon name=\"close-outline\"></ion-icon></button>\n      </div>\n\n      <div class=\"user-guide-content-area\" *ngIf=\"!isLoadingGuide\">\n        <div *ngIf=\"!isEditingGuide\" class=\"guide-view-mode\">\n\n          <!-- Banner -->\n          <div class=\"guide-banner\">\n            <ion-icon name=\"rocket\"></ion-icon>\n            <div>\n              <strong>เริ่มต้นง่ายมาก!</strong> เลือกเครื่องมือจากแถบด้านบน แล้วคลิกหรือลากบนเอกสารได้เลย\n              — กด <code>Ctrl+Z</code> เพื่อย้อนกลับเสมอหากทำพลาด\n            </div>\n          </div>\n\n          <!-- ข้อความ -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"text\" style=\"color:#60a5fa;\"></ion-icon> ข้อความ (Text)\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <div class=\"guide-step\">1</div>\n                <div class=\"guide-item__text\">กดไอคอน <ion-icon name=\"text\" style=\"vertical-align:-2px;color:#60a5fa;\"></ion-icon> แล้วเลือก <strong>ขนาดตัวอักษร</strong> และ <strong>สี</strong> ที่ต้องการก่อนวาง</div>\n              </div>\n              <div class=\"guide-item\">\n                <div class=\"guide-step\">2</div>\n                <div class=\"guide-item__text\">คลิกบนเอกสาร PDF — กล่องข้อความจะปรากฏทันที พิมพ์ข้อความได้เลย <strong>กล่องจะขยายตามข้อความอัตโนมัติ</strong></div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"move-outline\" class=\"guide-item__icon\" style=\"color:#60a5fa;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>ย้ายตำแหน่ง:</strong> จับที่ <em>เส้นขอบ</em> กล่องแล้วลากไปวางได้ทุกที่ (cursor จะเปลี่ยนเป็นลูกศร 4 ทิศ)</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"contract-outline\" class=\"guide-item__icon\" style=\"color:#60a5fa;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>ปรับความกว้าง:</strong> ลากวงกลมสีฟ้า <span class=\"guide-dot-demo\"></span> ที่ซ้ายหรือขวากล่อง — ความสูงจะปรับตามข้อความเอง</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"trash-outline\" class=\"guide-item__icon\" style=\"color:#f87171;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>ลบกล่องข้อความ:</strong> คลิกที่เส้นขอบกล่องเพื่อเลือก แล้วกด <code>Delete</code> หรือคลิกขวาเพื่อดูเมนู</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- วาดและไฮไลท์ -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"brush\" style=\"color:#fb7185;\"></ion-icon> วาด / ไฮไลท์ / ยางลบ\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"brush\" class=\"guide-item__icon\" style=\"color:#fb7185;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>ปากกา / ดินสอ:</strong> ลากเพื่อวาดอิสระ — ปรับ <strong>ขนาดเส้น</strong> และ <strong>สี</strong> จากแถบด้านบน เส้นจะรวมเป็น object เดียวเมื่อยกปากกา</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"color-filter-outline\" class=\"guide-item__icon\" style=\"color:#fde68a;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>ไฮไลท์:</strong> ลากทับข้อความเพื่อเน้นสี — มีสีให้เลือก 6 สี หรือกำหนดสีเองได้ ปรับความหนาได้ตามต้องการ</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"cut-outline\" class=\"guide-item__icon\" style=\"color:#94a3b8;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>ยางลบ:</strong> ลากผ่านเส้นวาดหรือไฮไลท์เพื่อลบ — ปรับขนาดยางลบได้จากแถบด้านบน</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- รูปร่าง -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"shapes\" style=\"color:#a78bfa;\"></ion-icon> รูปร่างและเส้น (Shapes)\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"square-outline\" class=\"guide-item__icon\" style=\"color:#a78bfa;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>4 แบบ:</strong> สี่เหลี่ยม <ion-icon name=\"square-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> วงกลม <ion-icon name=\"ellipse-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> เส้นตรง <ion-icon name=\"remove-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> ลูกศร <ion-icon name=\"arrow-forward-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> — กดลูกศรเล็กเพื่อเลือกแบบ แล้ว<strong>ลากบนเอกสาร</strong></div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"color-palette\" class=\"guide-item__icon\" style=\"color:#fbbf24;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>ปรับสีและขนาดเส้น:</strong> ตั้งค่าสีขอบ, สีพื้น, และความหนาเส้นได้จากแถบด้านบน รองรับการปิดเส้นขอบหรือปิดสีพื้นแยกกันได้</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"resize\" class=\"guide-item__icon\" style=\"color:#a78bfa;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>ย้ายและปรับขนาด:</strong> ลากตรงกลางเพื่อย้าย — ลาก handle 8 จุดรอบรูปร่างเพื่อปรับขนาด — คลิกขวาเพื่อจัดลำดับชั้น</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- ลายเซ็น -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"finger-print\" style=\"color:#34d399;\"></ion-icon> ลายเซ็น (Signature)\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"create-outline\" class=\"guide-item__icon\" style=\"color:#34d399;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>วาดลายเซ็น:</strong> กด <ion-icon name=\"finger-print\" style=\"vertical-align:-2px;font-size:13px;color:#34d399;\"></ion-icon> เพื่อเปิดหน้าต่างวาด — ปรับสีและขนาดปากกา — กด <strong>\"ใช้ครั้งนี้\"</strong> เพื่อวางบนเอกสาร</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"cloud-upload-outline\" class=\"guide-item__icon\" style=\"color:#34d399;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>บันทึกลายเซ็น:</strong> กด <strong>\"บันทึกไว้ใช้ภายหลัง\"</strong> เพื่อเก็บลายเซ็นไว้ในระบบ — ครั้งถัดไปกดเลือกจากรายการได้ทันที</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"shield-checkmark-outline\" class=\"guide-item__icon\" style=\"color:#34d399;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>Digital ID (DID):</strong> กดปุ่ม <code>DID</code> เพื่อแสดง/ซ่อนข้อมูล Digital ID ใต้ลายเซ็น (วันที่, เวลา, รหัสผู้ใช้)</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- วันที่ และรูปภาพ -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"calendar\" style=\"color:#fb923c;\"></ion-icon> วันที่ และรูปภาพ\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"calendar-outline\" class=\"guide-item__icon\" style=\"color:#fb923c;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>วันที่อัตโนมัติ:</strong> กด <ion-icon name=\"calendar\" style=\"vertical-align:-2px;font-size:13px;color:#fb923c;\"></ion-icon> เพื่อแทรกวันที่ปัจจุบัน — ปรับขนาดและสีตัวอักษรได้ — ลากเพื่อย้ายตำแหน่ง</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"image-outline\" class=\"guide-item__icon\" style=\"color:#fb923c;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>แทรกรูปภาพ:</strong> กด <ion-icon name=\"image\" style=\"vertical-align:-2px;font-size:13px;color:#fb923c;\"></ion-icon> เพื่อเลือกไฟล์รูปจากเครื่อง — ลากเพื่อย้าย ลาก handle 8 จุดเพื่อปรับขนาด</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- จัดการหน้า -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"documents\" style=\"color:#f59e0b;\"></ion-icon> จัดการหน้าเอกสาร\n            </h4>\n            <div class=\"guide-list\">\n              <div class=\"guide-item\">\n                <ion-icon name=\"images-outline\" class=\"guide-item__icon\" style=\"color:#f59e0b;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>Thumbnail ด้านซ้าย:</strong> กด <ion-icon name=\"images-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> เพื่อแสดง — คลิก thumbnail เพื่อกระโดดไปหน้านั้น — ลาก <ion-icon name=\"chevron-up-outline\" style=\"vertical-align:-2px;font-size:12px;\"></ion-icon><ion-icon name=\"chevron-down-outline\" style=\"vertical-align:-2px;font-size:12px;\"></ion-icon> เพื่อเรียงลำดับหน้า</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"add-circle-outline\" class=\"guide-item__icon\" style=\"color:#f59e0b;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>แทรก/ลบหน้า:</strong> กดไอคอน <ion-icon name=\"documents-outline\" style=\"vertical-align:-2px;font-size:13px;\"></ion-icon> บนแถบด้านบน — แทรกหน้าเปล่าแนวตั้ง/แนวนอน ก่อนหรือหลังหน้าปัจจุบัน — ลบหน้าที่ไม่ต้องการ — ย้อนกลับได้</div>\n              </div>\n              <div class=\"guide-item\">\n                <ion-icon name=\"search-outline\" class=\"guide-item__icon\" style=\"color:#f59e0b;\"></ion-icon>\n                <div class=\"guide-item__text\"><strong>ซูม:</strong> กดปุ่ม <code>+</code> / <code>−</code> หรือใช้ปุ่มซูมบนแถบนำทาง — รองรับตั้งแต่ 50% ถึง 300%</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- Keyboard Shortcuts -->\n          <div class=\"guide-section\">\n            <h4 class=\"guide-section__title\">\n              <ion-icon name=\"keypad\" style=\"color:#e2e8f0;\"></ion-icon> คีย์ลัดที่ควรรู้\n            </h4>\n            <div class=\"guide-shortcuts-grid\">\n              <div class=\"guide-shortcut-card\">\n                <div class=\"guide-shortcut-card__keys\"><kbd>Ctrl</kbd><span>+</span><kbd>Z</kbd></div>\n                <div class=\"guide-shortcut-card__label\">ย้อนกลับ (Undo)</div>\n              </div>\n              <div class=\"guide-shortcut-card\">\n                <div class=\"guide-shortcut-card__keys\"><kbd>Ctrl</kbd><span>+</span><kbd>Y</kbd></div>\n                <div class=\"guide-shortcut-card__label\">ทำซ้ำ (Redo)</div>\n              </div>\n              <div class=\"guide-shortcut-card\">\n                <div class=\"guide-shortcut-card__keys\"><kbd>Delete</kbd></div>\n                <div class=\"guide-shortcut-card__label\">ลบ object ที่เลือก</div>\n              </div>\n              <div class=\"guide-shortcut-card\">\n                <div class=\"guide-shortcut-card__keys\"><kbd>Esc</kbd></div>\n                <div class=\"guide-shortcut-card__label\">ออกจากโหมดเครื่องมือ</div>\n              </div>\n            </div>\n          </div>\n\n          <!-- Pro Tips -->\n          <div class=\"guide-protip\">\n            <div class=\"guide-protip__icon\"><ion-icon name=\"bulb\"></ion-icon></div>\n            <div class=\"guide-protip__body\">\n              <div class=\"guide-protip__title\">Pro Tips</div>\n              <ul class=\"guide-protip__list\">\n                <li>คลิกขวาบน object ใด ๆ เพื่อจัดลำดับชั้น (Bring to Front / Send to Back)</li>\n                <li>กด <code>Esc</code> เพื่อออกจากโหมดเครื่องมือและกลับสู่โหมดปกติ</li>\n                <li>ไฮไลท์ที่วาดด้วย opacity ต่ำ — ใช้ไฮไลท์ซ้อนกันหลายชั้นเพื่อเน้นสีเข้มขึ้น</li>\n                <li>บันทึกลายเซ็นไว้ในระบบเพื่อใช้ซ้ำในเอกสารอื่น ๆ ได้สะดวก</li>\n              </ul>\n            </div>\n          </div>\n\n          <div class=\"guide-section\" *ngIf=\"userGuideContent && userGuideContent.trim() !== ''\">\n            <h4 class=\"guide-section__title\"><ion-icon name=\"megaphone\" style=\"color:#10b981;\"></ion-icon> ประกาศเพิ่มเติม</h4>\n            <div class=\"guide-raw-content\">{{ userGuideContent }}</div>\n          </div>\n\n          <button *ngIf=\"canManageGuide\" (click)=\"editGuide()\" class=\"guide-edit-btn\">\n            <ion-icon name=\"create-outline\"></ion-icon> อัปเดตประกาศเพิ่มเติม\n          </button>\n        </div>\n\n        <div *ngIf=\"isEditingGuide\" style=\"display: flex; flex-direction: column; height: 100%;\">\n          <div style=\"font-size: 12px; color: #94a3b8; margin-bottom: 8px;\">คุณสามารถพิมพ์ในรูปแบบข้อความธรรมดา หรือ Markdown (ถ้ามีการเชื่อมต่อตัวแปลง)</div>\n          <textarea [(ngModel)]=\"tempGuideContent\" style=\"flex: 1; min-height: 300px; width: 100%; padding: 12px; background: rgba(0,0,0,0.2); border: 1px solid #334155; border-radius: 6px; color: #e8eaf6; font-size: 13.5px; resize: none; line-height: 1.5; outline: none; font-family: sans-serif;\" placeholder=\"พิมพ์คู่มือที่นี่...\"></textarea>\n          \n          <div style=\"display: flex; gap: 8px; margin-top: 16px; padding-bottom: 20px;\">\n            <button (click)=\"cancelEditGuide()\" style=\"flex: 1; padding: 10px; background: transparent; border: 1px solid #475569; color: #94a3b8; border-radius: 6px; cursor: pointer; font-weight: 500;\">ยกเลิก</button>\n            <button (click)=\"saveGuide()\" style=\"flex: 1; padding: 10px; background: #3b82f6; border: none; color: #fff; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s;\">บันทึกอัปเดต</button>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- History Panel (right slide-in drawer) -->\n  <div class=\"annot-history-drawer\" [class.open]=\"showHistoryPanel\">\n    <div class=\"annot-history-drawer__backdrop\" (click)=\"showHistoryPanel = false\"></div>\n    <div class=\"annot-history-drawer__panel\">\n      <div class=\"annot-history-drawer__header\">\n        <span><ion-icon name=\"time-outline\"></ion-icon> ประวัติการแก้ไข</span>\n        <button (click)=\"showHistoryPanel = false\"><ion-icon name=\"close-outline\"></ion-icon></button>\n      </div>\n\n      <div class=\"annot-history-loading\" *ngIf=\"isLoadingHistory\">\n        <ion-spinner name=\"dots\"></ion-spinner>\n      </div>\n\n      <div class=\"annot-history-list\" *ngIf=\"!isLoadingHistory\">\n        <div class=\"annot-history-entry\" *ngFor=\"let h of historyEntries\">\n          <div class=\"annot-history-entry__icon\" [class]=\"'hi-' + h.action_type\">\n            <ion-icon [name]=\"getHistoryActionIcon(h.action_type)\"></ion-icon>\n          </div>\n          <div class=\"annot-history-entry__body\">\n            <div class=\"annot-history-entry__title\">\n              {{ getHistoryActionLabel(h.action_type) }}\n              <span class=\"annot-history-entry__page\" *ngIf=\"h.page_number > 0\">หน้า {{ h.page_number }}</span>\n            </div>\n            <div class=\"annot-history-entry__user\">{{ h.user_name || h.user_id || 'ผู้ใช้' }}</div>\n            <div class=\"annot-history-entry__time\">{{ h.created_at | date:'dd/MM/yyyy HH:mm' }}</div>\n          </div>\n        </div>\n        <div class=\"annot-history-empty\" *ngIf=\"historyEntries.length === 0\">\n          <ion-icon name=\"time-outline\"></ion-icon>\n          <p>ยังไม่มีประวัติ</p>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- Hidden file input for signature upload (always in DOM) -->\n  <input type=\"file\" #signatureFileInput accept=\"image/*\" style=\"display:none\"\n    (change)=\"onSignatureFileSelected($event)\">\n\n  <!-- Signature Pad Modal -->\n  <div class=\"signature-modal\" *ngIf=\"showSignaturePad\">\n    <div class=\"signature-modal__backdrop\" (click)=\"closeSignaturePad()\"></div>\n    <div class=\"signature-modal__content\">\n      <h3>ลงลายเซ็น</h3>\n      <p class=\"signature-modal__hint\">วาดลายเซ็นของคุณในกรอบด้านล่าง (ยกปากกาแล้ววาดต่อได้)</p>\n\n      <!-- Pen Options -->\n      <div class=\"signature-modal__pen-options\">\n        <div class=\"pen-option-group\">\n          <span class=\"pen-option-label\">สี:</span>\n          <div class=\"color-dots\">\n            <div class=\"color-dot\" style=\"background:#000\" (click)=\"setSignaturePenColor('#000000')\"\n              [class.active]=\"signaturePenColor === '#000000'\"></div>\n            <div class=\"color-dot\" style=\"background:#00f\" (click)=\"setSignaturePenColor('#0000FF')\"\n              [class.active]=\"signaturePenColor === '#0000FF'\"></div>\n            <div class=\"color-dot\" style=\"background:#f00\" (click)=\"setSignaturePenColor('#FF0000')\"\n              [class.active]=\"signaturePenColor === '#FF0000'\"></div>\n          </div>\n        </div>\n        <div class=\"pen-option-group\">\n          <span class=\"pen-option-label\">ขนาด:</span>\n          <button class=\"pen-size-btn\" (click)=\"changeSignaturePenSize(-0.5)\" [disabled]=\"signaturePenSize <= 1\">\n            <ion-icon name=\"remove\"></ion-icon>\n          </button>\n          <span class=\"pen-size-val\">{{ signaturePenSize }}</span>\n          <button class=\"pen-size-btn\" (click)=\"changeSignaturePenSize(0.5)\" [disabled]=\"signaturePenSize >= 10\">\n            <ion-icon name=\"add\"></ion-icon>\n          </button>\n        </div>\n      </div>\n\n      <canvas #signatureCanvas class=\"signature-modal__canvas\"></canvas>\n\n      <div class=\"signature-modal__actions\">\n        <ion-button fill=\"outline\" color=\"medium\" (click)=\"clearSignaturePad()\">\n          <ion-icon name=\"refresh\" slot=\"start\"></ion-icon>\n          ล้าง\n        </ion-button>\n        <ion-button fill=\"outline\" color=\"danger\" (click)=\"closeSignaturePad()\">\n          <ion-icon name=\"close\" slot=\"start\"></ion-icon>\n          ยกเลิก\n        </ion-button>\n        <ion-button fill=\"outline\" color=\"tertiary\" (click)=\"triggerSignatureUpload()\">\n          <ion-icon name=\"image-outline\" slot=\"start\"></ion-icon>\n          อัพโหลดรูป\n        </ion-button>\n        <ion-button fill=\"outline\" color=\"success\" (click)=\"saveSignatureToDatabase()\">\n          <ion-icon name=\"cloud-upload\" slot=\"start\"></ion-icon>\n          บันทึกไว้ใช้ภายหลัง\n        </ion-button>\n        <ion-button color=\"primary\" (click)=\"saveSignature()\">\n          <ion-icon name=\"checkmark\" slot=\"start\"></ion-icon>\n          ใช้ครั้งนี้\n        </ion-button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Signature Picker Modal -->\n  <div class=\"signature-picker-modal\" *ngIf=\"showSignaturePicker\">\n    <div class=\"signature-picker-modal__backdrop\" (click)=\"closeSignaturePicker()\"></div>\n    <div class=\"signature-picker-modal__content\">\n      <h3>เลือกลายเซ็น</h3>\n      <p class=\"signature-picker-modal__hint\">เลือกลายเซ็นที่บันทึกไว้ หรือวาดใหม่</p>\n\n      <div class=\"signature-picker-modal__loading\" *ngIf=\"isLoadingSignatures\">\n        <ion-spinner name=\"crescent\"></ion-spinner>\n        <span>กำลังโหลด...</span>\n      </div>\n\n      <div class=\"signature-picker-modal__list\" *ngIf=\"!isLoadingSignatures\">\n        <div class=\"signature-item\" *ngFor=\"let sig of savedSignatures\" (click)=\"useSavedSignature(sig)\">\n          <img [src]=\"sig.signature_data\" [alt]=\"sig.signature_name\" />\n          <div class=\"signature-item__info\">\n            <span class=\"signature-item__name\">{{ sig.signature_name }}</span>\n            <span class=\"signature-item__badge\" *ngIf=\"sig.is_default\">หลัก</span>\n          </div>\n          <div class=\"signature-item__actions\">\n            <button class=\"signature-item__btn\" (click)=\"setDefaultSignature(sig, $event)\"\n              [class.active]=\"sig.is_default\" title=\"ตั้งเป็นหลัก\">\n              <ion-icon name=\"star\"></ion-icon>\n            </button>\n            <button class=\"signature-item__btn signature-item__btn--delete\" (click)=\"deleteSavedSignature(sig, $event)\"\n              title=\"ลบ\">\n              <ion-icon name=\"trash\"></ion-icon>\n            </button>\n          </div>\n        </div>\n\n        <div class=\"signature-picker-modal__empty\" *ngIf=\"savedSignatures.length === 0\">\n          <ion-icon name=\"create-outline\"></ion-icon>\n          <p>ยังไม่มีลายเซ็นที่บันทึกไว้</p>\n        </div>\n      </div>\n\n      <div class=\"signature-picker-modal__actions\">\n        <ion-button fill=\"outline\" color=\"medium\" (click)=\"closeSignaturePicker()\">\n          <ion-icon name=\"close\" slot=\"start\"></ion-icon>\n          ปิด\n        </ion-button>\n        <ion-button fill=\"outline\" color=\"secondary\" (click)=\"triggerSignatureUpload()\">\n          <ion-icon name=\"cloud-upload\" slot=\"start\"></ion-icon>\n          อัพโหลดรูป\n        </ion-button>\n        <ion-button color=\"primary\" (click)=\"openSignaturePadFromPicker()\">\n          <ion-icon name=\"create\" slot=\"start\"></ion-icon>\n          วาดลายเซ็นใหม่\n        </ion-button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Preview Overlay -->\n  <div class=\"preview-overlay\" *ngIf=\"showPreviewOverlay\">\n    <div class=\"preview-header\">\n      <div class=\"preview-title\">{{ isCancelMode ? 'ตรวจสอบเอกสารก่อนบันทึก' : 'ตรวจสอบเอกสารก่อนลงนาม' }}</div>\n      <div class=\"preview-actions\">\n        <ion-button fill=\"clear\" color=\"dark\" (click)=\"backToEdit()\">\n          <ion-icon slot=\"start\" name=\"arrow-back-outline\"></ion-icon>\n          กลับไปแก้ไข\n        </ion-button>\n        <ion-button color=\"success\" (click)=\"confirmSave()\">\n          <ion-icon slot=\"start\" name=\"checkmark-done-outline\"></ion-icon>\n          {{ isCancelMode ? 'ยืนยันการบันทึก' : 'ยืนยันและลงนาม' }}\n        </ion-button>\n      </div>\n    </div>\n    <div class=\"preview-scroll-area\">\n    <div class=\"preview-body\">\n      <div class=\"preview-filter-bar\" *ngIf=\"previewIsFiltered || isLoadingAllPreview\">\n        <ion-icon name=\"information-circle-outline\"></ion-icon>\n        <span>แสดงเฉพาะหน้าที่มีการแก้ไข ({{ previewPages.length }} / {{ previewTotalPages }} หน้า)</span>\n        <ion-button fill=\"clear\" size=\"small\" (click)=\"loadAllPreviewPages()\" [disabled]=\"isLoadingAllPreview\">\n          <ion-spinner *ngIf=\"isLoadingAllPreview\" name=\"crescent\" slot=\"start\"></ion-spinner>\n          <span *ngIf=\"!isLoadingAllPreview\">แสดงทั้งหมด {{ previewTotalPages }} หน้า</span>\n          <span *ngIf=\"isLoadingAllPreview\">กำลังโหลด...</span>\n        </ion-button>\n      </div>\n      <div class=\"preview-pages\" *ngIf=\"previewPages.length > 0\">\n        <img *ngFor=\"let page of previewPages; let i = index\" [src]=\"page\" [alt]=\"'Page ' + (i + 1)\"\n          class=\"preview-page-img\">\n      </div>\n      <div *ngIf=\"previewPages.length === 0\" class=\"preview-loading\">\n        <ion-spinner name=\"crescent\"></ion-spinner>\n        <p>กำลังโหลด Preview...</p>\n      </div>\n    </div>\n    </div>\n  </div>\n\n  <!-- Custom Context Menu -->\n  <div class=\"custom-context-menu\" *ngIf=\"contextMenu.show\" [style.left.px]=\"contextMenu.x\" [style.top.px]=\"contextMenu.y\">\n    <button class=\"menu-btn\" (click)=\"contextBringToFront()\">\n      <ion-icon name=\"arrow-up-circle-outline\"></ion-icon> นำไปไว้หน้าสุด (Bring to Front)\n    </button>\n    <button class=\"menu-btn\" (click)=\"contextBringForward()\">\n      <ion-icon name=\"chevron-up-outline\"></ion-icon> นำไปข้างหน้า (Bring Forward)\n    </button>\n    <button class=\"menu-btn\" (click)=\"contextSendBackward()\">\n      <ion-icon name=\"chevron-down-outline\"></ion-icon> ส่งไปข้างหลัง (Send Backward)\n    </button>\n    <button class=\"menu-btn\" (click)=\"contextSendToBack()\">\n      <ion-icon name=\"arrow-down-circle-outline\"></ion-icon> ส่งไปไว้หลังสุด (Send to Back)\n    </button>\n    <div class=\"menu-divider\"></div>\n    <button class=\"menu-btn danger-btn\" (click)=\"deleteContextMenuTarget()\">\n      <ion-icon name=\"trash-outline\"></ion-icon> ลบ (Delete)\n    </button>\n  </div>\n\n</ion-content>", styles: ["@charset \"UTF-8\";:host{display:block;height:100%}.annotator-content{--background: #f1f5f9;height:100%;overflow:hidden;position:relative}.annotator-content::part(scroll){display:flex;flex-direction:column;height:100%;overflow:hidden}ion-header{box-shadow:0 2px 8px #0000000d}ion-header ion-toolbar{--background: #fff;--color: #1e293b;--padding-top: 8px;--padding-bottom: 8px}.annotator-layout{display:flex;height:100%;width:100%;min-height:0;overflow:hidden;position:relative}.annotator-layout-v2{display:flex;flex-direction:column;height:100%;width:100%;min-height:0;overflow:hidden}.toolbar-row{display:flex;align-items:center;background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:6px 12px;grid-gap:8px;gap:8px;flex-shrink:0}.toolbar-row--nav{background:#fff}.toolbar-row--tools{background:#f1f5f9;flex-wrap:wrap}.toolbar-group{display:flex;align-items:center;grid-gap:4px;gap:4px}.toolbar-group--zoom,.toolbar-group--pager{grid-gap:2px;gap:2px}.toolbar-group--save{margin-left:auto}.toolbar-divider{width:1px;height:24px;background:#e2e8f0;margin:0 8px}.toolbar-spacer{flex:1}.toolbar-label{font-size:12px;color:#64748b;min-width:50px;text-align:center}.toolbar-btn{display:flex;align-items:center;justify-content:center;grid-gap:4px;gap:4px;background:transparent;border:1px solid transparent;border-radius:6px;padding:6px 10px;cursor:pointer;transition:all .15s ease;color:#475569;font-size:13px}.toolbar-btn ion-icon{font-size:18px}.toolbar-btn .zoom-icon{font-size:10px;margin-left:-4px}.toolbar-btn:hover:not(:disabled){background:#e2e8f0}.toolbar-btn:disabled{opacity:.4;cursor:not-allowed}.toolbar-btn.active{background:#3b82f6;color:#fff;border-color:#2563eb}.toolbar-btn--guide{background:rgba(14,165,233,.1);color:#0ea5e9;border:1px solid rgba(14,165,233,.3);padding:6px 12px}.toolbar-btn--guide:hover{background:rgba(14,165,233,.2)}.toolbar-btn--guide.active{background:#0ea5e9;color:#fff;border-color:#0284c7}.toolbar-btn--save{background:linear-gradient(135deg,#22c55e 0%,#16a34a 100%);color:#fff;padding:7px 16px;font-weight:700;font-size:14px;border-radius:8px;border:1px solid #16a34a;box-shadow:0 2px 8px #22c55e59;letter-spacing:.2px;transition:all .2s ease}.toolbar-btn--save ion-icon{font-size:17px}.toolbar-btn--save:hover:not(:disabled){background:linear-gradient(135deg,#16a34a 0%,#15803d 100%);box-shadow:0 4px 14px #22c55e80;transform:translateY(-1px)}.toolbar-btn--save:active{transform:translateY(0);box-shadow:0 2px 6px #22c55e4d}.toolbar-btn--danger{color:#ef4444}.toolbar-btn--danger:hover{background:#fee2e2}.toolbar-btn--toggle{font-size:11px;padding:4px 6px;grid-gap:2px;gap:2px}.toolbar-btn--toggle ion-icon{font-size:14px}.toolbar-btn--toggle .toggle-label{font-size:9px;font-weight:600;letter-spacing:.5px}.tool-item{display:flex;align-items:center;grid-gap:4px;gap:4px}.tool-options{display:flex;align-items:center;grid-gap:4px;gap:4px;background:#f1f5f9;padding:4px 8px;border-radius:6px;border:1px solid #e2e8f0}.tool-options button{width:24px;height:24px;border:none;background:#fff;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center}.tool-options button:hover{background:#e2e8f0}.tool-options button:disabled{opacity:.4}.tool-options button ion-icon{font-size:14px}.tool-options span{font-size:11px;min-width:24px;text-align:center;color:#64748b}.color-dots{display:flex;grid-gap:4px;gap:4px;margin-left:4px}.color-dot{width:16px;height:16px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:all .15s ease;position:relative;overflow:hidden}.color-dot:hover{transform:scale(1.1)}.color-dot.active{border-color:#1e293b;box-shadow:0 0 0 2px #fff,0 0 0 4px currentColor}.color-dot--custom{box-shadow:0 0 0 1px #cbd5e1}.color-dot--custom input[type=color]{position:absolute;top:-10px;left:-10px;width:40px;height:40px;cursor:pointer;opacity:0}.color-dot--custom:hover{box-shadow:0 0 0 1.5px #94a3b8}.insert-page-tool{position:relative}.insert-page-tool .insert-badge-icon{font-size:11px!important;margin-left:-6px;margin-top:-8px;color:#22c55e}.insert-page-dropdown{position:absolute;top:calc(100% + 4px);right:0;z-index:500}.insert-page-backdrop{position:fixed;inset:0;z-index:499}.insert-page-menu{position:relative;z-index:500;background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:8px;box-shadow:0 6px 24px #00000024;min-width:220px;display:flex;flex-direction:column;grid-gap:4px;gap:4px}.insert-page-title{font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;padding:2px 6px 6px;border-bottom:1px solid #f1f5f9;margin-bottom:2px}.insert-page-btn{display:flex;align-items:center;grid-gap:10px;gap:10px;width:100%;padding:9px 12px;border:1px solid transparent;border-radius:7px;background:transparent;cursor:pointer;color:#334155;font-size:13px;text-align:left;transition:all .15s}.insert-page-btn small{color:#94a3b8;font-size:11px}.insert-page-btn ion-icon{font-size:16px;color:#3b82f6;flex-shrink:0}.insert-page-btn:hover:not(:disabled){background:#eff6ff;border-color:#bfdbfe;color:#1e40af}.insert-page-btn:hover:not(:disabled) ion-icon{color:#1d4ed8}.insert-page-btn:active:not(:disabled){background:#dbeafe}.insert-page-btn:disabled{opacity:.35;cursor:not-allowed}.insert-page-btn--danger ion-icon{color:#ef4444}.insert-page-btn--danger:hover:not(:disabled){background:#fff1f2;border-color:#fecaca;color:#b91c1c}.insert-page-btn--danger:hover:not(:disabled) ion-icon{color:#dc2626}.insert-page-btn--danger:active:not(:disabled){background:#fee2e2}.insert-page-btn--undo ion-icon{color:#f59e0b}.insert-page-btn--undo:hover:not(:disabled){background:#fffbeb;border-color:#fde68a;color:#92400e}.insert-page-btn--undo:hover:not(:disabled) ion-icon{color:#d97706}.insert-page-btn--undo:active:not(:disabled){background:#fef3c7}.insert-orient-row{display:flex;align-items:center;grid-gap:8px;gap:8px;padding:4px 6px 8px}.insert-orient-label{font-size:12px;color:#64748b;white-space:nowrap;flex-shrink:0}.insert-orient-group{display:flex;grid-gap:4px;gap:4px;flex:1}.insert-orient-btn{display:flex;align-items:center;grid-gap:5px;gap:5px;flex:1;justify-content:center;padding:6px 8px;border:1.5px solid #e2e8f0;border-radius:7px;background:#f8fafc;cursor:pointer;font-size:12px;color:#475569;transition:all .15s}.insert-orient-btn ion-icon{font-size:15px}.insert-orient-btn:hover{background:#f1f5f9;border-color:#cbd5e1}.insert-orient-btn.active{background:#eff6ff;border-color:#3b82f6;color:#1e40af;font-weight:600}.insert-orient-btn.active ion-icon{color:#3b82f6}.insert-page-title--danger{color:#ef4444!important;background:#fff1f2;border-radius:5px;padding:3px 6px 6px!important}.insert-menu-divider{height:1px;background:#f1f5f9;margin:2px 0 4px}.shape-tool-item{position:relative;display:flex;align-items:flex-start;grid-gap:4px;gap:4px;flex-wrap:nowrap}.shape-chevron{font-size:10px!important;margin-left:-2px;opacity:.7}.mark-tool-item{position:relative;display:flex;align-items:flex-start}.mark-toolbar-btn{display:flex!important;flex-direction:row!important;align-items:center!important;grid-gap:4px!important;gap:4px!important;padding:0 8px!important;min-width:unset!important}.mark-btn-label{font-size:11px;font-weight:600;white-space:nowrap;letter-spacing:-.01em}.mark-chevron{font-size:10px!important;opacity:.7}.mark-popup{position:absolute;top:calc(100% + 6px);left:0;z-index:300;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 6px 24px #00000024;padding:12px 14px;min-width:210px;display:flex;flex-direction:column;grid-gap:8px;gap:8px}.mark-popup-section-label{font-size:11px;font-weight:600;color:#64748b;letter-spacing:.02em}.mark-popup-divider{height:1px;background:#f1f5f9;margin:0}.mark-quick-row{display:flex;grid-gap:8px;gap:8px;align-items:center}.mark-quick-btn{width:44px;height:44px;border:1.5px solid #e2e8f0;border-radius:8px;background:#f8fafc;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#1e293b;padding:0;transition:background .12s,border-color .12s}.mark-quick-btn:hover{background:#e2e8f0}.mark-quick-btn.active{background:#dbeafe;border-color:#3b82f6;color:#1d4ed8}.mark-form-list{display:flex;flex-direction:column;grid-gap:2px;gap:2px}.mark-form-row-btn{display:flex;align-items:center;grid-gap:10px;gap:10px;width:100%;padding:7px 8px;border:none;border-radius:7px;background:transparent;cursor:pointer;color:#1e293b;font-size:13.5px;text-align:left;transition:background .1s}.mark-form-row-btn:hover{background:#f1f5f9}.mark-form-row-btn.active{background:#dbeafe;color:#1d4ed8}.mark-form-row-icon{width:24px;height:24px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.mark-form-row-icon--text{font-size:14px;font-weight:700;color:inherit}.mark-controls-row{display:flex;align-items:center;grid-gap:4px;gap:4px}.mark-controls-row button{width:24px;height:24px;border:1px solid #e2e8f0;border-radius:4px;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}.mark-controls-row button:hover{background:#e2e8f0}.mark-controls-row button:disabled{opacity:.4;cursor:default}.mark-size-val{min-width:22px;text-align:center;font-size:12px;font-weight:500}.mark-cancel-btn{width:100%;display:flex;align-items:center;justify-content:center;grid-gap:6px;gap:6px;padding:7px 0;border:none;border-radius:6px;background:#f1f5f9;color:#64748b;font-size:13px;font-weight:500;cursor:pointer;transition:background .15s,color .15s}.mark-cancel-btn ion-icon{font-size:16px}.mark-cancel-btn:hover{background:#fee2e2;color:#ef4444}.shape-dropdown{position:absolute;top:calc(100% + 4px);left:0;z-index:300;display:flex;flex-direction:column;grid-gap:2px;gap:2px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:6px;box-shadow:0 4px 16px #0000001f;min-width:46px}.shape-dropdown .shape-dd-btn{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border:1px solid transparent;border-radius:6px;background:transparent;cursor:pointer;color:#475569;transition:all .15s}.shape-dropdown .shape-dd-btn ion-icon{font-size:18px}.shape-dropdown .shape-dd-btn:hover{background:#f1f5f9;color:#1e293b}.shape-dropdown .shape-dd-btn.active{background:#3b82f6;color:#fff;border-color:#2563eb}.shape-options-panel{display:flex;align-items:center;grid-gap:8px;gap:8px;flex-wrap:wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:5px 10px;margin-left:2px}.shape-opt-group{display:flex;align-items:center;grid-gap:5px;gap:5px}.shape-opt-label{font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.4px;white-space:nowrap}.sopt-divider{width:1px;height:30px;background:#e2e8f0;flex-shrink:0}.sopt-btn{display:flex;align-items:center;justify-content:center;width:22px;height:22px;border:1px solid #e2e8f0;border-radius:4px;background:#fff;cursor:pointer;color:#475569;transition:background .12s}.sopt-btn ion-icon{font-size:13px}.sopt-btn:hover:not(:disabled){background:#e2e8f0}.sopt-btn:disabled{opacity:.35;cursor:not-allowed}.sopt-val{font-size:11px;font-weight:600;color:#475569;min-width:18px;text-align:center}.sopt-fill-toggle{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border:1px solid #e2e8f0;border-radius:5px;background:#fff;cursor:pointer;color:#94a3b8;transition:all .15s}.sopt-fill-toggle ion-icon{font-size:15px}.sopt-fill-toggle:hover{background:#f1f5f9;color:#475569}.sopt-fill-toggle.active{background:#3b82f6;color:#fff;border-color:#2563eb}.mac-color-grid{display:grid;grid-template-columns:repeat(8,16px);grid-gap:2px;gap:2px;transition:opacity .15s}.mac-color-grid.disabled{opacity:.3;pointer-events:none}.mac-swatch{width:16px;height:16px;border-radius:3px;border:1.5px solid rgba(0,0,0,.18);cursor:pointer;transition:transform .1s,box-shadow .1s;flex-shrink:0}.mac-swatch:hover{transform:scale(1.25);z-index:2;box-shadow:0 2px 6px #0003}.mac-swatch.active{transform:scale(1.15);box-shadow:0 0 0 2px #fff,0 0 0 3.5px #3b82f6;z-index:3}.mac-swatch--current{width:22px;height:22px;border-radius:4px;border:2px solid #cbd5e1;cursor:default;pointer-events:none}.mac-swatch--current:hover{transform:none}.mac-custom-color{display:flex;align-items:center;grid-gap:3px;gap:3px;transition:opacity .15s}.mac-custom-color.disabled{opacity:.3;pointer-events:none}.mac-custom-color input[type=color]{width:22px;height:22px;border:2px solid #cbd5e1;border-radius:4px;padding:1px;cursor:pointer;background:none}.mac-custom-color input[type=color]::-webkit-color-swatch-wrapper{padding:0}.mac-custom-color input[type=color]::-webkit-color-swatch{border:none;border-radius:2px}@media (max-width: 767px){.shape-options-panel{padding:4px 6px;grid-gap:5px;gap:5px}.mac-color-grid{grid-template-columns:repeat(8,13px)}.mac-color-grid .mac-swatch{width:13px;height:13px}}.main-area{display:flex;flex:1;min-height:0;overflow:hidden}.thumbnails-sidebar{width:148px;min-width:148px;background:#1a2232;display:flex;flex-direction:column;overflow:visible;position:relative;z-index:10}.thumb-list{flex:1;overflow-y:auto;overflow-x:visible;display:flex;flex-direction:column;align-items:center;padding:8px 0 16px;grid-gap:0;gap:0;scrollbar-width:thin;scrollbar-color:#334155 #1a2232}.thumb-list::-webkit-scrollbar{width:5px}.thumb-list::-webkit-scrollbar-track{background:#1a2232}.thumb-list::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}.thumb-card-wrap{width:120px;display:flex;flex-direction:column;border-radius:10px;overflow:hidden;box-shadow:0 3px 12px #0000004d;flex-shrink:0}.thumb-card{width:120px;background:#243044;border-radius:0;overflow:hidden;cursor:pointer;border:2.5px solid transparent;border-bottom:none;transition:border-color .15s}.thumb-card-wrap:hover>.thumb-card{border-color:#63b3ed66}.thumb-card-wrap:has(.thumb-card.active)>.thumb-card{border-color:#3b82f6}.thumb-card.active{border-color:#3b82f6}.thumb-card__img-wrap{padding:6px 6px 0;overflow:hidden;border-radius:8px 8px 0 0}.thumb-card__img-wrap img{width:100%;border-radius:5px;display:block;box-shadow:0 2px 8px #0006}.thumb-card__label{display:block;text-align:center;color:#94a3b8;font-size:11px;font-weight:500;padding:4px 0 3px}.thumb-card__actions{display:flex;align-items:center;justify-content:space-around;padding:5px 4px;background:#0f172a;border-top:1px solid #334155;border-radius:0 0 8px 8px}.thumb-action-btn{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border:1px solid #334155;border-radius:6px;background:#1e293b;color:#94a3b8;cursor:pointer;transition:all .15s;flex-shrink:0}.thumb-action-btn ion-icon{font-size:15px}.thumb-action-btn:hover:not(:disabled){background:#334155;color:#e2e8f0;border-color:#475569}.thumb-action-btn:disabled{opacity:.25;cursor:not-allowed}.thumb-action-btn--danger{color:#f87171;border-color:#7f1d1d;background:#1c0a0a}.thumb-action-btn--danger:hover:not(:disabled){background:#450a0a;border-color:#ef4444;color:#fca5a5}.thumb-insert-row{display:flex;align-items:center;justify-content:center;width:100%;padding:6px 0;position:relative;flex-shrink:0}.thumb-insert-slot{position:relative;display:flex;align-items:center;justify-content:center}.thumb-add-btn{width:32px;height:32px;border-radius:50%;border:2px solid #3b82f6;background:#1e40af;color:#93c5fd;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;box-shadow:0 2px 8px #3b82f666}.thumb-add-btn ion-icon{font-size:18px;font-weight:700}.thumb-add-btn:hover{background:#2563eb;color:#fff;transform:scale(1.1);box-shadow:0 4px 14px #3b82f680}.thumb-add-btn:active{transform:scale(.95)}.thumb-insert-dropdown{position:fixed;left:158px;z-index:2000;transform:translateY(-50%)}.thumb-insert-backdrop{position:fixed;inset:0;z-index:698}.thumb-insert-menu{position:relative;z-index:699;background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:8px;box-shadow:0 8px 32px #0000002e;min-width:210px;display:flex;flex-direction:column;grid-gap:2px;gap:2px}.thumb-insert-menu:before{content:\"\";position:absolute;left:-8px;top:50%;transform:translateY(-50%);border:8px solid transparent;border-right-color:#fff;border-left:none}.thumb-insert-opt{display:flex;align-items:center;grid-gap:10px;gap:10px;width:100%;padding:10px 14px;border:1px solid transparent;border-radius:8px;background:transparent;cursor:pointer;color:#1e293b;font-size:14px;font-family:inherit;text-align:left;transition:all .15s}.thumb-insert-opt ion-icon{font-size:18px;color:#3b82f6;flex-shrink:0}.thumb-insert-opt:hover{background:#eff6ff;border-color:#bfdbfe;color:#1e40af}.thumb-insert-opt:hover ion-icon{color:#1d4ed8}.thumb-insert-opt:active{background:#dbeafe}.viewer-wrapper{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}.viewer-container{flex:1;overflow-y:auto;overflow-x:auto;background:#f1f5f9;display:flex;flex-direction:column;align-items:center;padding:20px;grid-gap:20px;gap:20px}.page-container{position:relative;box-shadow:0 4px 12px #00000026;background:#fff;flex-shrink:0}.page-container .pdf-canvas,.page-container .annot-canvas{display:block}.page-container .annot-canvas{position:absolute;top:0;left:0;touch-action:none}@media (max-width: 767px){.toolbar-row{padding:4px 8px;grid-gap:4px;gap:4px;flex-wrap:wrap}.toolbar-row--tools{padding:6px 8px}.toolbar-btn{padding:4px 6px}.toolbar-btn ion-icon{font-size:16px}.toolbar-btn span{display:none}.toolbar-divider{margin:0 4px}.thumbnails-sidebar{width:80px;min-width:80px;padding:8px 4px}.thumbnail-item img{max-width:64px}.tool-options{display:none}.hint{display:none}}@media (max-width: 480px){.thumbnails-sidebar{display:none}.toolbar-label{min-width:30px;font-size:10px}}.sidebar{width:200px;min-width:200px;background:#1e293b;color:#fff;display:flex;flex-direction:column;padding:16px;z-index:100;box-shadow:4px 0 15px #0000001a;overflow-y:auto}.sidebar__section{margin-bottom:24px}.sidebar__section--nav{background:rgba(255,255,255,.05);padding:12px;border-radius:12px;margin-bottom:20px;display:flex;flex-direction:column;grid-gap:12px;gap:12px}.sidebar__section--save{margin-top:auto;padding-top:20px;border-top:1px solid rgba(255,255,255,.1)}.sidebar__title{font-size:11px;font-weight:700;color:#fff6;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}.sidebar__row{display:flex;grid-gap:8px;gap:8px;margin-bottom:8px}.sidebar__row--wrap{flex-wrap:wrap}.sidebar__btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;grid-gap:6px;gap:6px;padding:10px 4px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#fffc;font-size:11px;cursor:pointer;transition:all .2s;box-shadow:0 2px 4px #0000001a}.sidebar__btn ion-icon{font-size:20px}.sidebar__btn:hover:not([disabled]){background:rgba(255,255,255,.15);color:#fff;transform:translateY(-1px);box-shadow:0 4px 8px #0003}.sidebar__btn.active{background:#3b82f6;color:#fff;border-color:#60a5fa;box-shadow:0 4px 12px #3b82f666}.sidebar__btn[disabled]{opacity:.3;cursor:not-allowed}.sidebar__btn--signature{background:rgba(139,92,246,.1);border-color:#8b5cf64d;color:#a78bfa}.sidebar__btn--signature.active,.sidebar__btn--signature:hover:not([disabled]){background:#8b5cf6;color:#fff}.sidebar__btn--date{background:rgba(16,185,129,.1);border-color:#10b9814d;color:#34d399}.sidebar__btn--date.active,.sidebar__btn--date:hover:not([disabled]){background:#10b981;color:#fff}.sidebar__btn--warning{background:rgba(239,68,68,.1);border-color:#ef44444d;color:#f87171}.sidebar__btn--warning:hover:not([disabled]){background:#ef4444;color:#fff}.sidebar__btn--save{background:#10b981;color:#fff;flex-direction:row;grid-gap:10px;gap:10px;font-size:14px;font-weight:600;padding:14px;box-shadow:0 4px 12px #10b98140}.sidebar__btn--save:hover:not([disabled]){background:#059669;box-shadow:0 6px 18px #10b98166}.sidebar__btn--small{flex:0 0 calc(50% - 4px);padding:8px}.sidebar__picker{display:flex;align-items:center;grid-gap:8px;gap:8px;padding:6px 8px;margin-bottom:6px;border-radius:6px;background:rgba(255,255,255,.05)}.sidebar__picker label{font-size:11px;color:#fff9;min-width:60px}.sidebar__picker input[type=color]{width:24px;height:24px;border:2px solid rgba(255,255,255,.2);border-radius:4px;cursor:pointer;padding:0}.sidebar__picker input[type=range]{flex:1;max-width:50px}.sidebar__picker span{font-size:11px;color:#ffffffb3;min-width:20px;text-align:right}.main-content{flex:1;display:flex;flex-direction:column;height:100%;min-height:0;overflow:hidden;background:#cbd5e1}.topbar-desktop{display:flex;align-items:center;justify-content:center;padding:8px 20px;background:#fff;border-bottom:1px solid #e2e8f0;box-shadow:0 2px 4px #00000005;min-height:56px}.topbar-desktop__tools{display:flex;align-items:center;grid-gap:12px;gap:12px}.topbar-desktop__tool-btn{display:flex;align-items:center;grid-gap:6px;gap:6px;padding:8px 14px;border:none;border-radius:8px;background:#fff;color:#475569;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s ease;box-shadow:0 2px 5px #00000014}.topbar-desktop__tool-btn ion-icon{font-size:18px}.topbar-desktop__tool-btn:hover:not([disabled]){background:#f1f5f9;color:#1e293b;transform:translateY(-1px);box-shadow:0 4px 10px #0000001f}.topbar-desktop__tool-btn.active{background:#3b82f6;color:#fff}.topbar-desktop__tool-btn[disabled]{opacity:.4;cursor:not-allowed}.topbar-desktop .tool-option{display:flex;align-items:center;grid-gap:8px;gap:8px;background:#fff;padding:2px 8px;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 2px 5px #0000000d}.topbar-desktop .tool-option .size-controls{display:flex;align-items:center;grid-gap:4px;gap:4px;padding-left:8px;border-left:1px solid #e2e8f0}.topbar-desktop .tool-option .size-controls button{background:none;border:none;padding:4px;cursor:pointer;color:#64748b;display:flex;align-items:center}.topbar-desktop .tool-option .size-controls button:hover:not([disabled]){color:#3b82f6}.topbar-desktop .tool-option .size-controls button[disabled]{opacity:.3}.topbar-desktop .tool-option .size-controls .size-val{font-size:12px;font-weight:700;min-width:20px;text-align:center}.topbar-desktop .tool-option .size-controls .format-btn{background:none;border:none;border-radius:4px;padding:4px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#64748b;transition:all .2s}.topbar-desktop .tool-option .size-controls .format-btn:hover{background:#f1f5f9;color:#1e293b}.topbar-desktop .tool-option .size-controls .format-btn.active{color:#3b82f6;background:#eff6ff}.topbar-desktop .tool-option .size-controls .format-btn--text{font-family:serif;font-size:16px}.topbar-desktop .tool-option .size-controls .format-btn--text span{display:block;width:18px;text-align:center}.topbar-desktop .tool-option .size-controls .format-btn ion-icon{font-size:18px}.topbar-desktop .tool-option .size-controls .color-palette{display:flex;align-items:center;grid-gap:6px;gap:6px;margin-left:8px}.topbar-desktop .tool-option .size-controls .color-palette .color-dot{width:16px;height:16px;border-radius:50%;cursor:pointer;border:2px solid #e2e8f0;transition:transform .2s}.topbar-desktop .tool-option .size-controls .color-palette .color-dot:hover{transform:scale(1.2)}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.active{border-color:#3b82f6;transform:scale(1.1)}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.blue{background:#0000FF}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.red{background:#FF0000}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.black{background:#000000}.topbar-desktop .tool-option .size-controls .color-palette .color-dot.green{background:#008000}.topbar-desktop__divider{width:1px;height:24px;background:#e2e8f0;margin:0 4px}.topbar-desktop__divider--small{height:16px;opacity:.6}.topbar-desktop .save-btn{background:#10b981;color:#fff;border:none;padding:8px 18px;border-radius:8px;font-weight:600;display:flex;align-items:center;grid-gap:8px;gap:8px;cursor:pointer;box-shadow:0 2px 4px #10b98133;margin-left:20px}.topbar-desktop .save-btn:hover{background:#059669}.topbar-pager,.topbar-zoom{display:flex;align-items:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:2px 6px;grid-gap:8px;gap:8px;height:38px}.topbar-pager__btn,.topbar-zoom__btn{background:transparent;border:none;padding:6px;cursor:pointer;color:#64748b;display:flex;align-items:center;border-radius:4px;transition:all .2s}.topbar-pager__btn:hover:not([disabled]),.topbar-zoom__btn:hover:not([disabled]){background:#f1f5f9;color:#3b82f6}.topbar-pager__btn[disabled],.topbar-zoom__btn[disabled]{opacity:.3;cursor:not-allowed}.topbar-pager__btn ion-icon,.topbar-zoom__btn ion-icon{font-size:16px}.topbar-pager__info,.topbar-pager__val,.topbar-zoom__info,.topbar-zoom__val{font-size:13px;font-weight:700;color:#475569;min-width:45px;text-align:center;-webkit-user-select:none;user-select:none}.topbar-zoom .fit-btn{font-size:11px;font-weight:700;text-transform:uppercase;color:#3b82f6;background:transparent;border:none;padding:4px 10px;cursor:pointer;letter-spacing:.5px}.topbar-zoom .fit-btn:hover{color:#2563eb;text-decoration:underline}.viewer-container{flex:1;overflow:auto!important;position:relative;padding:40px 20px;background:#cbd5e1;scrollbar-width:thin;-webkit-overflow-scrolling:touch;touch-action:auto;text-align:center}.page-container{position:relative;display:inline-block;margin-bottom:30px;background:#fff;box-shadow:0 10px 30px #00000026;text-align:left}.page-container.single-page{margin-bottom:0}.pdf-canvas{display:block}.annot-canvas{position:absolute;top:0;left:0;z-index:10;touch-action:auto;pointer-events:none}.annot-canvas.tools-active{pointer-events:auto;touch-action:none!important;-webkit-touch-callout:none!important;-webkit-user-select:none!important;user-select:none!important}.text-box{position:absolute;pointer-events:auto;border-radius:2px;border:1px solid transparent;background:transparent;display:flex;flex-direction:column;z-index:20;min-width:30px;min-height:20px;box-sizing:border-box;cursor:move;padding:3px}.text-box:hover{border-color:#c0c4cb}.text-box.active{border:1px solid #c0c4cb;background:transparent}.text-box textarea{width:100%;height:100%;border:none;background:transparent;padding:0 3px;resize:none;outline:none;font-family:\"THSarabunNew\",sans-serif;font-size:inherit;font-weight:inherit;font-style:inherit;text-align:inherit;color:inherit;overflow:hidden;display:block;line-height:1.4;box-sizing:border-box;cursor:text}.text-box .tb-handle{position:absolute;width:12px;height:12px;background:#1a73e8;border:2px solid #fff;border-radius:50%;top:50%;transform:translateY(-50%);cursor:ew-resize;z-index:27;display:none;box-shadow:0 1px 3px #00000040}.text-box .tb-handle--left{left:-6px}.text-box .tb-handle--right{right:-6px}.text-box.active .tb-handle{display:block}.image-stamp,.signature-stamp{position:absolute;pointer-events:auto;cursor:move;border:1px dashed transparent;z-index:20;touch-action:none}.image-stamp:hover,.signature-stamp:hover{border-color:#3b82f6}.image-stamp:hover .remove-btn,.signature-stamp:hover .remove-btn{opacity:1}.image-stamp img,.signature-stamp img{width:100%;height:100%;display:block;-webkit-user-select:none;user-select:none;pointer-events:none}.image-stamp.mark-stamp-active{outline:2px solid #3b82f6;outline-offset:2px;border-color:#3b82f6}.image-stamp.mark-stamp-active .resize-handle{opacity:1}.image-stamp.mark-stamp-active .remove-btn{opacity:1}.image-stamp .mark-options-bar{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translate(-50%);background:#1e293b;border:1px solid #334155;border-radius:8px;display:flex;align-items:center;grid-gap:1px;gap:1px;padding:3px 5px;z-index:50;white-space:nowrap;box-shadow:0 4px 14px #00000073;pointer-events:auto}.image-stamp .mark-options-bar .pff-opt-btn{width:24px;height:24px;border:none;background:transparent;color:#e2e8f0;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;padding:0;flex-shrink:0}.image-stamp .mark-options-bar .pff-opt-btn:hover{background:rgba(255,255,255,.1)}.image-stamp .mark-options-bar .pff-opt-btn.pff-opt-delete{color:#f87171}.image-stamp .mark-options-bar .pff-opt-btn.pff-opt-delete:hover{background:rgba(239,68,68,.2)}.image-stamp .mark-options-bar .pff-opt-btn[disabled]{opacity:.3;cursor:not-allowed;pointer-events:none}.image-stamp .mark-options-bar .pff-opt-val{font-size:11px;color:#e2e8f0;min-width:22px;text-align:center;font-weight:600;line-height:1}.image-stamp .mark-options-bar .pff-opt-label{font-size:11px;color:#94a3b8;margin:0 2px;display:flex;align-items:center}.image-stamp .mark-options-bar .pff-opt-label ion-icon{font-size:13px}.image-stamp .mark-options-bar .pff-opt-sep{width:1px;height:16px;background:#334155;margin:0 3px;flex-shrink:0}.shape-stamp{position:absolute;pointer-events:auto;cursor:move;border:1px dashed transparent;z-index:20;touch-action:none;overflow:visible}.shape-stamp svg{display:block;width:100%;height:100%;overflow:visible;pointer-events:none;-webkit-user-select:none;user-select:none}.shape-stamp:hover{border-color:#3b82f699}.shape-stamp:hover .remove-btn{opacity:1}.shape-stamp:hover .resize-handle{opacity:1}.signature-stamp img{mix-blend-mode:multiply}.signature-stamp .digital-id-label{position:absolute;left:100%;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;grid-gap:0;gap:0;pointer-events:none;white-space:nowrap;margin-left:6px}.signature-stamp .digital-id-label span{font-size:8px;color:#555;font-family:\"Courier New\",monospace;letter-spacing:.3px;line-height:1.4}.signature-stamp .remove-btn{position:absolute;top:-10px;left:-10px;width:20px;height:20px;background:#ef4444;color:#fff;border:none;border-radius:50%;font-size:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity .2s;z-index:26}.pdf-form-field{position:absolute;pointer-events:auto;cursor:move;box-sizing:border-box;touch-action:none;z-index:20}.pdf-form-field.pff-mark{border:1.5px solid #3b82f6;border-radius:3px;background:transparent;min-width:10px;min-height:10px}.pdf-form-field.pff-text{border:1.5px solid #3b82f6;border-radius:3px;background:rgba(219,234,254,.25);min-width:40px;min-height:14px}.pdf-form-field.pff-checkbox{border:1.5px solid #3b82f6;border-radius:3px;background:rgba(219,234,254,.2);min-width:14px;min-height:14px}.pdf-form-field.pff-radio{border:1.5px solid #3b82f6;border-radius:50%;background:rgba(219,234,254,.2);min-width:14px;min-height:14px}.pdf-form-field:hover{border-color:#1d4ed8}.pdf-form-field:hover .remove-btn{opacity:1}.pdf-form-field .pff-inner{width:100%;height:100%;display:flex;align-items:center;justify-content:center;pointer-events:none}.pdf-form-field .pff-text-hint{font-size:10px;color:#3b82f6;font-weight:600;opacity:.8;-webkit-user-select:none;user-select:none}.pdf-form-field .remove-btn{position:absolute;top:-8px;right:-8px;width:16px;height:16px;background:#ef4444;color:#fff;border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;opacity:0;transition:opacity .15s;z-index:30;pointer-events:auto}.pdf-form-field .resize-handle{opacity:0}.pdf-form-field:hover .resize-handle{opacity:1}.pdf-form-field.pff-no-border{border-color:transparent!important;background:rgba(219,234,254,.08)}.pdf-form-field.pff-active{outline:2px solid #3b82f6;outline-offset:1px}.pdf-form-field.pff-active .pff-resize-handle{opacity:1}.pdf-form-field:hover .pff-resize-handle{opacity:1}.pdf-form-field .pff-resize-handle{position:absolute;width:8px;height:8px;background:#3b82f6;border:1.5px solid #fff;border-radius:50%;z-index:25;touch-action:none;opacity:0;transition:opacity .15s}.pdf-form-field .pff-resize-handle.rh-nw{top:-4px;left:-4px;cursor:nw-resize}.pdf-form-field .pff-resize-handle.rh-n{top:-4px;left:calc(50% - 4px);cursor:n-resize}.pdf-form-field .pff-resize-handle.rh-ne{top:-4px;right:-4px;cursor:ne-resize}.pdf-form-field .pff-resize-handle.rh-e{top:calc(50% - 4px);right:-4px;cursor:e-resize}.pdf-form-field .pff-resize-handle.rh-se{bottom:-4px;right:-4px;cursor:se-resize}.pdf-form-field .pff-resize-handle.rh-s{bottom:-4px;left:calc(50% - 4px);cursor:s-resize}.pdf-form-field .pff-resize-handle.rh-sw{bottom:-4px;left:-4px;cursor:sw-resize}.pdf-form-field .pff-resize-handle.rh-w{top:calc(50% - 4px);left:-4px;cursor:w-resize}.pdf-form-field .pff-options-bar{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translate(-50%);background:#1e293b;border:1px solid #334155;border-radius:8px;display:flex;align-items:center;grid-gap:1px;gap:1px;padding:3px 5px;z-index:50;white-space:nowrap;box-shadow:0 4px 14px #00000073;pointer-events:auto}.pdf-form-field .pff-options-bar .pff-opt-btn{width:24px;height:24px;border:none;background:transparent;color:#e2e8f0;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;padding:0;flex-shrink:0}.pdf-form-field .pff-options-bar .pff-opt-btn:hover{background:rgba(255,255,255,.1)}.pdf-form-field .pff-options-bar .pff-opt-btn.pff-opt-active{background:rgba(59,130,246,.3);color:#60a5fa}.pdf-form-field .pff-options-bar .pff-opt-btn.pff-opt-delete{color:#f87171}.pdf-form-field .pff-options-bar .pff-opt-btn.pff-opt-delete:hover{background:rgba(239,68,68,.2)}.pdf-form-field .pff-options-bar .pff-opt-btn[disabled]{opacity:.3;cursor:not-allowed;pointer-events:none}.pdf-form-field .pff-options-bar .pff-opt-val{font-size:11px;color:#e2e8f0;min-width:22px;text-align:center;font-weight:600;line-height:1}.pdf-form-field .pff-options-bar .pff-opt-label{font-size:11px;color:#94a3b8;margin:0 2px;font-style:italic;font-weight:700;display:flex;align-items:center}.pdf-form-field .pff-options-bar .pff-opt-label ion-icon{font-size:13px}.pdf-form-field .pff-options-bar .pff-opt-sep{width:1px;height:16px;background:#334155;margin:0 3px;flex-shrink:0}.date-stamp{position:absolute;pointer-events:auto;cursor:move;padding:4px 8px;background:rgba(255,255,255,.8);border:1px dashed #ccc;border-radius:4px;white-space:nowrap;font-family:\"THSarabunNew\",sans-serif;z-index:20;touch-action:none}.date-stamp:hover{border-color:#3b82f6}.date-stamp:hover .remove-btn{opacity:1}.date-stamp .remove-btn{position:absolute;top:-8px;right:-8px;width:16px;height:16px;background:#ef4444;color:#fff;border:none;border-radius:50%;font-size:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity .2s}.resize-handle{position:absolute;width:10px;height:10px;background:#3b82f6;border:1px solid #fff;border-radius:50%;z-index:22;touch-action:none;display:none}.resize-handle.rh-nw{top:-5px;left:-5px;cursor:nw-resize}.resize-handle.rh-n{top:-5px;left:calc(50% - 5px);cursor:n-resize}.resize-handle.rh-ne{top:-5px;right:-5px;cursor:ne-resize}.resize-handle.rh-e{top:calc(50% - 5px);right:-5px;cursor:e-resize}.resize-handle.rh-se{bottom:-5px;right:-5px;cursor:se-resize}.resize-handle.rh-s{bottom:-5px;left:calc(50% - 5px);cursor:s-resize}.resize-handle.rh-sw{bottom:-5px;left:-5px;cursor:sw-resize}.resize-handle.rh-w{top:calc(50% - 5px);left:-5px;cursor:w-resize}.image-stamp:hover .resize-handle,.signature-stamp:hover .resize-handle,.shape-stamp:hover .resize-handle{display:block}@media (max-width: 991px){.topbar-desktop__tools{display:none}}@media (max-width: 767px){.annotator-layout{flex-direction:column}.sidebar{width:100%;height:auto;max-height:140px;min-width:0;order:2;flex-direction:row;flex-wrap:wrap;overflow-x:auto;overflow-y:auto;padding:8px 12px;grid-gap:8px;gap:8px;scrollbar-width:none;-ms-overflow-style:none;justify-content:center;align-items:flex-start}.sidebar::-webkit-scrollbar{display:none}.sidebar__section{margin-bottom:0;flex-shrink:0;display:flex;flex-direction:row;justify-content:center;align-items:center}.sidebar__section--nav,.sidebar__section--save,.sidebar__section .sidebar__title{display:none}.sidebar__row{margin-bottom:0;grid-gap:6px;gap:6px;display:flex;flex-wrap:wrap;justify-content:center}.sidebar__btn{width:48px;height:48px;flex:none;font-size:9px;padding:4px}.sidebar__btn ion-icon{font-size:20px}.sidebar__btn span{display:none}.topbar-desktop{display:flex;padding:8px 12px}.topbar-desktop .save-btn,.topbar-desktop .doc-title{display:none}.topbar-desktop .topbar-desktop__left{display:none}.topbar-desktop .topbar-desktop__center{margin:0 auto}.viewer{padding:10px}}.mobile-pager{display:none}@media (max-width: 767px){.mobile-pager{display:flex;position:absolute;top:60px;right:16px;z-index:10;background:rgba(0,0,0,.6);color:#fff;padding:4px 12px;border-radius:20px;font-size:12px;backdrop-filter:blur(4px)}}.loading-overlay{position:fixed;inset:0;z-index:20003;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);backdrop-filter:blur(4px)}.loading-overlay .loading-content{background:#fff;padding:32px 48px;border-radius:16px;text-align:center}.loading-overlay .loading-content ion-spinner{--color: #3b82f6;width:48px;height:48px}.loading-overlay .loading-content .loading-msg{margin-top:16px;font-size:14px;color:#334155}.loading-overlay .loading-content--progress{min-width:300px;padding:28px 32px}.loading-overlay .loading-content--progress .save-progress-icon{display:flex;align-items:center;justify-content:center;grid-gap:10px;gap:10px;margin-bottom:16px}.loading-overlay .loading-content--progress .save-progress-icon ion-icon{font-size:36px;color:#3b82f6}.loading-overlay .loading-content--progress .save-progress-icon .save-progress-pct{font-size:32px;font-weight:800;color:#1e293b;letter-spacing:-1px;line-height:1;min-width:64px;text-align:left}.loading-overlay .loading-content--progress .save-progress-bar-track{width:100%;height:10px;background:#e2e8f0;border-radius:99px;overflow:hidden;margin-bottom:14px}.loading-overlay .loading-content--progress .save-progress-bar-track .save-progress-bar-fill{height:100%;background:linear-gradient(90deg,#3b82f6 0%,#06b6d4 100%);border-radius:99px;transition:width .3s ease,background .5s ease}.loading-overlay .loading-content--progress .save-progress-bar-track .save-progress-bar-fill--preview{background:linear-gradient(90deg,#06b6d4 0%,#22c55e 100%)}.loading-overlay .loading-content--progress .save-progress-bar-track .save-progress-bar-fill--serializing{background:linear-gradient(90deg,#3b82f6 0%,#8b5cf6 50%,#3b82f6 100%);background-size:200% 100%;animation:shimmerBar 1.5s linear infinite}.loading-overlay .loading-content--progress .save-progress-phases{display:flex;justify-content:space-between;grid-gap:8px;gap:8px;margin-bottom:12px}.loading-overlay .loading-content--progress .save-progress-phases span{display:flex;align-items:center;grid-gap:4px;gap:4px;font-size:11.5px;color:#94a3b8;transition:color .3s}.loading-overlay .loading-content--progress .save-progress-phases span ion-icon{font-size:13px}.loading-overlay .loading-content--progress .save-progress-phases span.active{color:#3b82f6;font-weight:600}.loading-overlay .loading-content--progress .loading-msg{font-size:13px;color:#64748b;margin-top:4px}.signature-modal,.signature-picker-modal{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center}.signature-modal__backdrop,.signature-picker-modal__backdrop{position:absolute;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px)}.signature-modal__content,.signature-picker-modal__content{position:relative;background:#fff;padding:28px 36px;border-radius:20px;box-shadow:0 24px 60px #00000040;text-align:center;width:95%;max-width:500px}@media (max-width: 500px){.signature-modal__content,.signature-picker-modal__content{padding:20px}}.signature-modal__content h3,.signature-picker-modal__content h3{margin:0 0 8px;font-size:22px;font-weight:600;color:#1e293b}.signature-modal__hint,.signature-picker-modal__hint{margin:0 0 20px;font-size:14px;color:#64748b}.signature-modal__canvas,.signature-picker-modal__canvas{display:block;width:100%;height:auto;aspect-ratio:2/1;border:2px solid #e2e8f0;border-radius:12px;background:#fff;cursor:crosshair;touch-action:none}.signature-modal__actions,.signature-picker-modal__actions{display:flex;grid-gap:12px;gap:12px;justify-content:center;margin-top:24px;flex-wrap:wrap}.signature-modal__pen-options,.signature-picker-modal__pen-options{display:flex;align-items:center;justify-content:center;grid-gap:20px;gap:20px;margin-bottom:16px;padding:8px 16px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0}.signature-modal__pen-options .pen-option-group,.signature-picker-modal__pen-options .pen-option-group{display:flex;align-items:center;grid-gap:8px;gap:8px}.signature-modal__pen-options .pen-option-label,.signature-picker-modal__pen-options .pen-option-label{font-size:13px;color:#64748b;font-weight:500}.signature-modal__pen-options .pen-size-btn,.signature-picker-modal__pen-options .pen-size-btn{width:28px;height:28px;border:1px solid #e2e8f0;background:#fff;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}.signature-modal__pen-options .pen-size-btn:hover:not(:disabled),.signature-picker-modal__pen-options .pen-size-btn:hover:not(:disabled){background:#e2e8f0}.signature-modal__pen-options .pen-size-btn:disabled,.signature-picker-modal__pen-options .pen-size-btn:disabled{opacity:.4;cursor:not-allowed}.signature-modal__pen-options .pen-size-btn ion-icon,.signature-picker-modal__pen-options .pen-size-btn ion-icon{font-size:14px}.signature-modal__pen-options .pen-size-val,.signature-picker-modal__pen-options .pen-size-val{font-size:13px;font-weight:600;min-width:28px;text-align:center;color:#334155}.signature-picker-modal__list{flex:1;overflow-y:auto;max-height:40vh;padding:4px 0;margin:16px 0}.signature-item{display:flex;align-items:center;grid-gap:14px;gap:14px;padding:12px 14px;margin-bottom:8px;border:2px solid #e2e8f0;border-radius:12px;cursor:pointer;transition:all .15s}.signature-item:hover{border-color:#3b82f6;background:#f8fafc;transform:translate(4px)}.signature-item img{width:100px;height:50px;object-fit:contain;background:#fff;border-radius:6px;border:1px solid #e2e8f0}.signature-item__info{flex:1;display:flex;flex-direction:column;grid-gap:4px;gap:4px;text-align:left}.signature-item__name{font-size:14px;font-weight:500;color:#1e293b}.signature-item__badge{display:inline-block;padding:2px 8px;font-size:11px;font-weight:600;color:#3b82f6;background:#eff6ff;border-radius:10px;width:-moz-fit-content;width:fit-content}.signature-item__actions{display:flex;grid-gap:6px;gap:6px}.signature-item__btn{width:32px;height:32px;border:none;border-radius:8px;background:#f1f5f9;color:#64748b;display:flex;align-items:center;justify-content:center}.signature-item__btn:hover{background:#e2e8f0;color:#334155}.signature-item__btn.active{background:#fef3c7;color:#f59e0b}.signature-item__btn--delete:hover{background:#fee2e2;color:#ef4444}.hint{background:#f8fafc;padding:10px 20px;font-size:11px;color:#64748b;border-top:1px solid #e2e8f0}.preview-overlay{position:fixed;top:0;left:0;width:100%;height:100dvh;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);z-index:20001;display:flex;flex-direction:column;overflow:hidden;animation:fadeIn .3s ease-out}.preview-overlay .preview-header{flex-shrink:0;position:relative;background:#fff;padding:14px 24px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 12px #0000001f;z-index:20002}.preview-overlay .preview-header .preview-title{font-size:1.1rem;font-weight:700;color:#1f2937;display:flex;align-items:center;grid-gap:8px;gap:8px}.preview-overlay .preview-header .preview-title:before{content:\"\";display:inline-block;width:4px;height:20px;background:linear-gradient(180deg,#22c55e,#16a34a);border-radius:2px}.preview-overlay .preview-header .preview-actions{display:flex;grid-gap:10px;gap:10px;align-items:center}.preview-overlay .preview-header .preview-actions ion-button[fill=clear]{--color: #64748b;font-weight:500;font-size:14px}.preview-overlay .preview-header .preview-actions ion-button[color=success]{--background: linear-gradient(135deg, #22c55e 0%, #15803d 100%);--background-activated: #15803d;--background-hover: #16a34a;--color: #fff;--border-radius: 10px;--padding-start: 22px;--padding-end: 22px;--padding-top: 12px;--padding-bottom: 12px;--box-shadow: 0 4px 16px rgba(34, 197, 94, .45);font-weight:700;font-size:15px;letter-spacing:.3px;animation:confirmPulse 2.4s ease-in-out infinite}.preview-overlay .preview-scroll-area{flex:1;overflow-y:auto;overflow-x:hidden}.preview-overlay .preview-body{min-height:100%;padding:20px;display:flex;flex-direction:column;align-items:center}.preview-overlay .preview-body .preview-filter-bar{display:flex;align-items:center;grid-gap:8px;gap:8px;background:rgba(255,193,7,.15);border:1px solid rgba(255,193,7,.4);border-radius:8px;padding:8px 14px;margin-bottom:12px;width:100%;max-width:1100px;color:#ffe082;font-size:13px}.preview-overlay .preview-body .preview-filter-bar ion-icon{font-size:18px;flex-shrink:0}.preview-overlay .preview-body .preview-filter-bar span{flex:1}.preview-overlay .preview-body .preview-filter-bar ion-button{--color: #ffe082;--border-color: rgba(255, 193, 7, .5);border:1px solid rgba(255,193,7,.5);border-radius:6px;flex-shrink:0}.preview-overlay .preview-body iframe{width:100%;height:100%;max-width:1100px;background:white;border-radius:8px;box-shadow:0 10px 25px #0000004d}.preview-overlay .preview-body .preview-pages{display:flex;flex-direction:column;grid-gap:16px;gap:16px;max-width:1100px;width:100%}.preview-overlay .preview-body .preview-page-img{width:100%;background:white;border-radius:8px;box-shadow:0 4px 12px #00000026}.preview-overlay .preview-body .preview-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;grid-gap:16px;gap:16px}.preview-overlay .preview-body .preview-loading ion-spinner{--color: white;width:48px;height:48px}.preview-overlay .preview-body .preview-loading p{font-size:16px;margin:0}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes shimmerBar{0%{background-position:200% 0}to{background-position:-200% 0}}@keyframes confirmPulse{0%,to{box-shadow:0 4px 16px #22c55e73}50%{box-shadow:0 4px 24px #22c55ebf,0 0 0 4px #22c55e26}}::ng-deep .textLayer{position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;opacity:1;line-height:1;z-index:5;--scale-factor: 1}::ng-deep .textLayer>span,::ng-deep .textLayer>br{color:transparent!important;position:absolute;white-space:pre;cursor:text;transform-origin:0% 0%}::ng-deep .textLayer ::selection{background:rgba(59,130,246,.3);color:transparent!important}.annot-history-drawer,.user-guide-drawer{position:absolute;top:0;right:0;bottom:0;left:0;z-index:999;pointer-events:none}.annot-history-drawer.open,.user-guide-drawer.open{pointer-events:auto}.annot-history-drawer__backdrop,.user-guide-drawer__backdrop{position:absolute;inset:0;background:rgba(0,0,0,0);transition:background .3s}.annot-history-drawer.open .annot-history-drawer__backdrop,.user-guide-drawer.open .annot-history-drawer__backdrop,.annot-history-drawer.open .user-guide-drawer__backdrop,.user-guide-drawer.open .user-guide-drawer__backdrop{background:rgba(0,0,0,.45)}.annot-history-drawer__panel,.user-guide-drawer__panel{position:absolute;top:0;right:0;bottom:0;width:min(340px,92vw);background:#1e293b;border-left:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;transform:translate(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);box-shadow:-6px 0 28px #00000059}.annot-history-drawer.open .annot-history-drawer__panel,.user-guide-drawer.open .annot-history-drawer__panel,.annot-history-drawer.open .user-guide-drawer__panel,.user-guide-drawer.open .user-guide-drawer__panel{transform:translate(0)}.annot-history-drawer__header,.user-guide-drawer__header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 12px;border-bottom:1px solid rgba(255,255,255,.07);font-size:14px;font-weight:700;color:#e8eaf6}.annot-history-drawer__header ion-icon,.user-guide-drawer__header ion-icon{margin-right:6px;color:#6c8ef5;vertical-align:-2px}.annot-history-drawer__header button,.user-guide-drawer__header button{background:none;border:none;color:#8892b0;cursor:pointer;font-size:20px;display:flex;align-items:center}.annot-history-drawer__header button:hover,.user-guide-drawer__header button:hover{color:#e8eaf6}.annot-history-drawer__loading,.user-guide-drawer__loading{display:flex;align-items:center;justify-content:center;padding:40px;color:#8892b0}.annot-history-drawer__loading ion-spinner,.user-guide-drawer__loading ion-spinner{--color: #6c8ef5}.annot-history-list{flex:1;overflow-y:auto;padding:6px 0;scrollbar-width:thin;scrollbar-color:#334155 #1e293b}.annot-history-list::-webkit-scrollbar{width:5px}.annot-history-list::-webkit-scrollbar-track{background:#1e293b}.annot-history-list::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}.annot-history-entry{display:flex;align-items:flex-start;grid-gap:11px;gap:11px;padding:9px 14px;border-bottom:1px solid rgba(255,255,255,.04);transition:background .12s}.annot-history-entry:last-child{border-bottom:none}.annot-history-entry:hover{background:rgba(255,255,255,.03)}.annot-history-entry__icon{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px;background:rgba(108,142,245,.15);color:#6c8ef5}.annot-history-entry__icon.hi-sign{background:rgba(74,222,128,.15);color:#4ade80}.annot-history-entry__icon.hi-save{background:rgba(251,191,36,.15);color:#fbbf24}.annot-history-entry__icon.hi-page_delete{background:rgba(255,77,109,.15);color:#ff4d6d}.annot-history-entry__icon.hi-page_insert{background:rgba(94,234,212,.15);color:#5eead4}.annot-history-entry__icon.hi-upload{background:rgba(167,139,250,.15);color:#a78bfa}.annot-history-entry__icon.hi-draw{background:rgba(251,113,133,.15);color:#fb7185}.annot-history-entry__icon.hi-highlight{background:rgba(251,191,36,.15);color:#fbbf24}.annot-history-entry__icon.hi-text{background:rgba(147,197,253,.15);color:#93c5fd}.annot-history-entry__body{flex:1;min-width:0}.annot-history-entry__title{font-size:13px;font-weight:600;color:#e8eaf6;display:flex;align-items:center;grid-gap:6px;gap:6px}.annot-history-entry__page{font-size:11px;background:rgba(108,142,245,.15);color:#6c8ef5;padding:1px 6px;border-radius:10px;font-weight:400}.annot-history-entry__user{font-size:12px;color:#8892b0;margin-top:2px}.annot-history-entry__time{font-size:11px;color:#8892b08c;margin-top:1px}.annot-history-empty{display:flex;flex-direction:column;align-items:center;padding:56px 24px;color:#8892b0;grid-gap:10px;gap:10px}.annot-history-empty ion-icon{font-size:36px;opacity:.4}.annot-history-empty p{font-size:13px;margin:0}.custom-context-backdrop{position:fixed;inset:0;z-index:99998;cursor:pointer;touch-action:none}.custom-context-menu{position:fixed;z-index:99999;background:rgba(255,255,255,.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(0,0,0,.1);border-radius:8px;box-shadow:0 4px 16px #00000026;padding:4px;min-width:220px;display:flex;flex-direction:column}.custom-context-menu .menu-btn{display:flex;align-items:center;grid-gap:8px;gap:8px;width:100%;padding:8px 12px;border:none;background:transparent;cursor:pointer;font-size:13px;color:#334155;border-radius:4px;text-align:left;transition:background .1s}.custom-context-menu .menu-btn ion-icon{font-size:16px;color:#64748b}.custom-context-menu .menu-btn:hover{background:#3b82f6;color:#fff}.custom-context-menu .menu-btn:hover ion-icon{color:#fff}.custom-context-menu .menu-btn.danger-btn:hover{background:#ef4444;color:#fff}.custom-context-menu .menu-btn.danger-btn:hover ion-icon{color:#fff}.custom-context-menu .menu-divider{height:1px;background:rgba(0,0,0,.08);margin:4px 0}.user-guide-content-area{flex:1;overflow-y:auto;padding:20px;background:#0f172a}.guide-view-mode{display:flex;flex-direction:column;grid-gap:24px;gap:24px}.guide-banner{display:flex;grid-gap:12px;gap:12px;background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);border-radius:8px;padding:12px 14px;color:#eff6ff;font-size:13px;line-height:1.5}.guide-banner ion-icon{font-size:24px;color:#60a5fa;flex-shrink:0}.guide-banner code{background:rgba(255,255,255,.1);padding:2px 6px;border-radius:4px;font-size:11px;color:#93c5fd}.guide-section__title{display:flex;align-items:center;grid-gap:8px;gap:8px;font-size:15px;font-weight:600;color:#f8fafc;margin:0 0 12px}.guide-section__title ion-icon{font-size:18px}.guide-list{display:flex;flex-direction:column;grid-gap:12px;gap:12px}.guide-item{display:flex;grid-gap:10px;gap:10px;align-items:flex-start;background:rgba(255,255,255,.03);padding:12px;border-radius:8px;border:1px solid rgba(255,255,255,.05)}.guide-item__icon{font-size:16px;color:#94a3b8;margin-top:2px;flex-shrink:0}.guide-item__text{font-size:13px;line-height:1.5;color:#cbd5e1}.guide-item__text strong{color:#f8fafc;font-weight:600}.guide-item__text code{background:rgba(0,0,0,.3);padding:2px 5px;border-radius:4px;font-size:11px;color:#cbd5e1;border:1px solid rgba(255,255,255,.1)}.guide-step{width:20px;height:20px;border-radius:50%;background:#334155;color:#fff;font-size:11px;font-weight:bold;display:flex;align-items:center;justify-content:center;flex-shrink:0}.guide-raw-content{white-space:pre-wrap;color:#94a3b8;font-size:13px;line-height:1.6;background:rgba(0,0,0,.2);padding:12px;border-radius:8px;border:1px solid rgba(255,255,255,.05)}.guide-edit-btn{width:100%;padding:10px;background:rgba(108,142,245,.1);color:#818cf8;border:1px solid rgba(129,140,248,.3);border-radius:8px;cursor:pointer;font-weight:500;transition:all .2s;display:flex;align-items:center;justify-content:center;grid-gap:8px;gap:8px}.guide-edit-btn:hover{background:rgba(108,142,245,.15);border-color:#818cf880}.guide-dot-demo{display:inline-block;width:10px;height:10px;background:#1a73e8;border:2px solid #fff;border-radius:50%;vertical-align:middle;box-shadow:0 1px 3px #0000004d}.guide-shortcuts-grid{display:grid;grid-template-columns:1fr 1fr;grid-gap:10px;gap:10px}.guide-shortcut-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;grid-gap:6px;gap:6px}.guide-shortcut-card__keys{display:flex;align-items:center;grid-gap:4px;gap:4px}.guide-shortcut-card__keys kbd{background:#1e293b;border:1px solid #334155;border-bottom:2px solid #475569;border-radius:5px;padding:3px 7px;font-size:11px;font-family:monospace;color:#e2e8f0;line-height:1.4}.guide-shortcut-card__keys span{color:#64748b;font-size:12px}.guide-shortcut-card__label{font-size:12px;color:#94a3b8;line-height:1.3}.guide-protip{display:flex;grid-gap:12px;gap:12px;background:linear-gradient(135deg,rgba(251,191,36,.08) 0%,rgba(245,158,11,.05) 100%);border:1px solid rgba(251,191,36,.2);border-radius:10px;padding:14px}.guide-protip__icon ion-icon{font-size:22px;color:#fbbf24;flex-shrink:0}.guide-protip__title{font-size:13px;font-weight:700;color:#fde68a;margin-bottom:8px;letter-spacing:.3px}.guide-protip__list{margin:0;padding-left:16px;display:flex;flex-direction:column;grid-gap:6px;gap:6px}.guide-protip__list li{font-size:12.5px;color:#cbd5e1;line-height:1.5}.guide-protip__list li code{background:rgba(0,0,0,.25);padding:1px 5px;border-radius:4px;font-size:11px;color:#fde68a;border:1px solid rgba(251,191,36,.2)}\n"] }]
    }], function () { return [{ type: ɵngcc2.ModalController }, { type: ɵngcc1.HttpClient }, { type: ɵngcc0.NgZone }, { type: ɵngcc2.ToastController }, { type: ɵngcc2.AlertController }, { type: ɵngcc0.ChangeDetectorRef }, { type: ɵngcc3.DomSanitizer }, { type: PdfManagerService }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [PDF_ANNOTATOR_CONFIG]
            }] }]; }, { canManageGuide: [{
            type: Input
        }], userId: [{
            type: Input
        }], userName: [{
            type: Input
        }], documentId: [{
            type: Input
        }], detailId: [{
            type: Input
        }], edocId: [{
            type: Input
        }], isCancelMode: [{
            type: Input
        }], 
    /* ================= Keyboard Shortcuts ================= */
    onDocumentPointerDown: [{
            type: HostListener,
            args: ['document:pointerdown', ['$event']]
        }], handleKeyboard: [{
            type: HostListener,
            args: ['window:keydown', ['$event']]
        }], pdfUrl: [{
            type: Input
        }], fileName: [{
            type: Input
        }], pdfCanvases: [{
            type: ViewChildren,
            args: ['pdfCanvas']
        }], annotCanvases: [{
            type: ViewChildren,
            args: ['annotCanvas']
        }], fileInputRef: [{
            type: ViewChild,
            args: ['fileInput', { static: false }]
        }], viewerContainerRef: [{
            type: ViewChild,
            args: ['viewerContainer', { static: false }]
        }], signatureCanvasRef: [{
            type: ViewChild,
            args: ['signatureCanvas', { static: false }]
        }], signatureFileInputRef: [{
            type: ViewChild,
            args: ['signatureFileInput', { static: false }]
        }], thumbFileInputRef: [{
            type: ViewChild,
            args: ['thumbFileInput', { static: false }]
        }] }); })();

// HttpClient must be provided by the host application:
//   Angular 15+:  provideHttpClient()  in app.config.ts
//   Angular 12-14: HttpClientModule    in AppModule imports
class PdfAnnotatorModule {
    static forRoot(config) {
        return {
            ngModule: PdfAnnotatorModule,
            providers: [
                { provide: PDF_ANNOTATOR_CONFIG, useValue: config },
                PdfManagerService
            ]
        };
    }
}
PdfAnnotatorModule.ɵfac = function PdfAnnotatorModule_Factory(t) { return new (t || PdfAnnotatorModule)(); };
PdfAnnotatorModule.ɵmod = /*@__PURE__*/ ɵngcc0.ɵɵdefineNgModule({ type: PdfAnnotatorModule });
PdfAnnotatorModule.ɵinj = /*@__PURE__*/ ɵngcc0.ɵɵdefineInjector({ providers: [DatePipe, PdfManagerService], imports: [CommonModule, FormsModule, IonicModule] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵngcc0.ɵsetClassMetadata(PdfAnnotatorModule, [{
        type: NgModule,
        args: [{
                declarations: [PdfAnnotatorModalComponent],
                imports: [CommonModule, FormsModule, IonicModule],
                exports: [PdfAnnotatorModalComponent],
                providers: [DatePipe, PdfManagerService],
                schemas: [CUSTOM_ELEMENTS_SCHEMA]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵngcc0.ɵɵsetNgModuleScope(PdfAnnotatorModule, { declarations: function () { return [PdfAnnotatorModalComponent]; }, imports: function () { return [CommonModule, FormsModule, IonicModule]; }, exports: function () { return [PdfAnnotatorModalComponent]; } }); })();

/*
 * Public API Surface of pdf-annotator
 */

/**
 * Generated bundle index. Do not edit.
 */

export { PDF_ANNOTATOR_CONFIG, PdfAnnotatorModalComponent, PdfAnnotatorModule, PdfManagerService };

//# sourceMappingURL=pdf-annotator.js.map