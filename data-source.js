"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("dotenv/config");
const typeorm_1 = require("typeorm");
const config_1 = require("./src/config");
const user_entity_1 = __importDefault(require("./src/modules/users/entities/user.entity"));
const order_entity_1 = require("./src/modules/orders/entities/order.entity");
const order_item_entity_1 = require("./src/modules/orders/entities/order-item.entity");
const order_file_entity_1 = require("./src/modules/orders/entities/order-file.entity");
const order_timeline_entity_1 = require("./src/modules/orders/entities/order-timeline.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: config_1.DBconfig.host,
    port: config_1.DBconfig.port,
    username: config_1.DBconfig.username,
    password: config_1.DBconfig.password,
    database: config_1.DBconfig.database,
    entities: [
        user_entity_1.default,
        order_entity_1.Order,
        order_item_entity_1.OrderItem,
        order_file_entity_1.OrderFile,
        order_timeline_entity_1.OrderTimeline,
    ],
    migrations: ['src/migrations/*{.ts,.js}'],
    synchronize: false,
    logging: true,
    ssl: config_1.DBconfig.ssl,
});
//# sourceMappingURL=data-source.js.map