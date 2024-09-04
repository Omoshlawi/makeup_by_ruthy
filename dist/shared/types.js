"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntity = void 0;
class BaseEntity {
    constructor(id) {
        this.id = id;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
exports.BaseEntity = BaseEntity;
