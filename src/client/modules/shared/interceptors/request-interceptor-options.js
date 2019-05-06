"use strict";
// *****************************************************************************
// Imports
// *****************************************************************************
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var http_2 = require("@angular/http");
var http_3 = require("@angular/http");
// *****************************************************************************
// Service
// *****************************************************************************
var RequestInterceptorOptions = (function (_super) {
    __extends(RequestInterceptorOptions, _super);
    function RequestInterceptorOptions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RequestInterceptorOptions.prototype.merge = function (options) {
        var token = localStorage.getItem('token');
        var userId = localStorage.getItem('userId');
        if (!options) {
            options = new http_2.RequestOptions();
        }
        if (!options.headers) {
            options.headers = new http_3.Headers();
        }
        if (token) {
            options.headers.append('Authorization', 'Bearer ' + token);
        }
        if (userId) {
            options.headers.append('User-ID', userId);
        }
        options.headers.append('Content-Type', 'application/json');
        options.withCredentials = true;
        var merged = _super.prototype.merge.call(this, options);
        return merged;
    };
    return RequestInterceptorOptions;
}(http_1.BaseRequestOptions));
RequestInterceptorOptions = __decorate([
    core_1.Injectable()
], RequestInterceptorOptions);
exports.RequestInterceptorOptions = RequestInterceptorOptions;
// *****************************************************************************
// Provider
// *****************************************************************************
exports.requestInterceptorOptionsProvider = {
    provide: http_2.RequestOptions,
    useClass: RequestInterceptorOptions
};
// *****************************************************************************
//# sourceMappingURL=request-interceptor-options.js.map