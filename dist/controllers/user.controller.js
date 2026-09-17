"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleDisable = exports.changeRole = exports.deleteUser = exports.updateUser = exports.getUser = exports.listUsers = void 0;
const userService = __importStar(require("../services/user.service"));
const listUsers = async (req, res, next) => {
    try {
        const result = await userService.listUsers(req.query);
        res.status(200).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
};
exports.listUsers = listUsers;
const getUser = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({ success: true, data: user });
    }
    catch (err) {
        next(err);
    }
};
exports.getUser = getUser;
const updateUser = async (req, res, next) => {
    try {
        const user = await userService.updateUserProfile(req.params.id, req.body, req.user.id, req);
        res.status(200).json({ success: true, message: 'User updated', data: user });
    }
    catch (err) {
        next(err);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id, req.user.id, req);
        res.status(200).json({ success: true, message: 'User deleted' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteUser = deleteUser;
const changeRole = async (req, res, next) => {
    try {
        const user = await userService.changeUserRole(req.params.id, req.body.role, req.user.id, req);
        res.status(200).json({ success: true, message: 'User role changed', data: user });
    }
    catch (err) {
        next(err);
    }
};
exports.changeRole = changeRole;
const toggleDisable = async (req, res, next) => {
    try {
        const user = await userService.disableUser(req.params.id, req.user.id, req);
        res.status(200).json({
            success: true,
            message: user.isActive ? 'User enabled' : 'User disabled',
            data: user,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.toggleDisable = toggleDisable;
//# sourceMappingURL=user.controller.js.map